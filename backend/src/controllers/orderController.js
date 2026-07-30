const pool = require('../config/db');

/**
 * Controlador de Órdenes
 *
 * Flujo de una orden:
 * 1. Usuario tiene items en cart_items
 * 2. POST /api/orders → crea la orden, copia los items, descuenta stock, vacía el carrito
 * 3. La orden queda en estado 'pending' hasta que se procese el pago
 *
 * Endpoints de usuario:
 *   POST /api/orders              — crear orden desde el carrito
 *   GET  /api/orders/my-orders    — mis órdenes
 *   GET  /api/orders/:id          — detalle de una orden
 *
 * Endpoints de admin:
 *   GET  /api/orders              — todas las órdenes
 *   PUT  /api/orders/:id/status   — actualizar estado
 */

/**
 * POST /api/orders
 * Crea una orden a partir del carrito actual del usuario.
 * Usa una transacción para garantizar consistencia:
 * si algo falla, se revierte todo.
 *
 * ¿Qué es una transacción SQL?
 * Es un bloque de operaciones que se ejecutan como una unidad atómica.
 * O todas tienen éxito (COMMIT) o ninguna se aplica (ROLLBACK).
 * Esencial cuando múltiples tablas deben actualizarse juntas.
 */
const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { shipping_name, shipping_address, shipping_city } = req.body;

  if (!shipping_name || !shipping_address || !shipping_city) {
    return res.status(400).json({ error: 'Nombre, dirección y ciudad de envío son requeridos.' });
  }

  const client = await pool.connect(); // Obtener cliente dedicado para la transacción

  try {
    await client.query('BEGIN'); // Iniciar transacción

    // 1. Obtener items del carrito con info de productos
    const cartResult = await client.query(
      `SELECT ci.id, ci.product_id, ci.quantity, p.price, p.name, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }

    // 2. Verificar stock de todos los productos
    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Stock insuficiente para "${item.name}". Solo hay ${item.stock} unidades.`
        });
      }
    }

    // 3. Calcular total
    const total = cartResult.rows.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity, 0
    );

    // 4. Crear la orden
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, shipping_name, shipping_address, shipping_city, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [userId, total.toFixed(2), shipping_name, shipping_address, shipping_city]
    );
    const order = orderResult.rows[0];

    // 5. Insertar items de la orden y descontar stock
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.name, item.price, item.quantity]
      );

      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // 6. Vaciar el carrito
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    await client.query('COMMIT'); // Confirmar todos los cambios

    res.status(201).json({
      message: 'Orden creada exitosamente.',
      order: {
        ...order,
        items: cartResult.rows.map(item => ({
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: (parseFloat(item.price) * item.quantity).toFixed(2),
        }))
      }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en createOrder:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  } finally {
    client.release(); // Devolver el cliente al pool
  }
};

/**
 * GET /api/orders/my-orders
 * Retorna todas las órdenes del usuario autenticado
 */
const getMyOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT id, total, status, shipping_address, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ orders: result.rows });

  } catch (err) {
    console.error('Error en getMyOrders:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * GET /api/orders/:id
 * Retorna el detalle de una orden (solo si pertenece al usuario, o si es admin)
 */
const getOrderById = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const { id } = req.params;

  try {
    // Obtener la orden
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada.' });
    }

    const order = orderResult.rows[0];

    // Verificar que la orden pertenece al usuario (a menos que sea admin)
    if (userRole !== 'admin' && order.user_id !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para ver esta orden.' });
    }

    // Obtener items de la orden
    const itemsResult = await pool.query(
      `SELECT oi.quantity, oi.price,
              (oi.quantity * oi.price) AS subtotal,
              oi.product_name, p.id AS product_id, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      order: {
        ...order,
        items: itemsResult.rows,
      }
    });

  } catch (err) {
    console.error('Error en getOrderById:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * GET /api/orders (admin)
 * Lista todas las órdenes con info del usuario
 */
const getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let whereClause = '';
    let params = [limit, offset];

    if (status) {
      whereClause = 'WHERE o.status = $3';
      params.push(status);
    }

    const result = await pool.query(
      `SELECT o.id, o.total, o.status, o.created_at,
              u.name AS user_name, u.email AS user_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );

    res.json({ orders: result.rows });

  } catch (err) {
    console.error('Error en getAllOrders:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * PUT /api/orders/:id/status (admin)
 * Actualiza el estado de una orden
 * Estados válidos: pending → processing → shipped → delivered | cancelled
 */
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Estado inválido. Válidos: ${validStatuses.join(', ')}` });
  }

  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada.' });
    }

    res.json({ order: result.rows[0] });

  } catch (err) {
    console.error('Error en updateOrderStatus:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
