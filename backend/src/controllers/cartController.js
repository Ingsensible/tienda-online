const pool = require('../config/db');

/**
 * Controlador del Carrito de Compras
 * 
 * Todos los endpoints requieren autenticación (el carrito es personal).
 * El carrito se identifica por el user_id del token JWT.
 * 
 * Endpoints:
 *   GET    /api/cart           — ver mi carrito
 *   POST   /api/cart           — agregar producto al carrito
 *   PUT    /api/cart/:itemId   — actualizar cantidad de un item
 *   DELETE /api/cart/:itemId   — eliminar un item del carrito
 *   DELETE /api/cart           — vaciar el carrito completo
 */

/**
 * GET /api/cart
 * Retorna todos los items del carrito del usuario autenticado
 */
const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT 
        ci.id, ci.quantity,
        p.id AS product_id, p.name, p.price, p.image_url, p.stock,
        (ci.quantity * p.price) AS subtotal
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at ASC`,
      [userId]
    );

    // Calcular el total del carrito
    const total = result.rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.json({
      items: result.rows,
      total: total.toFixed(2),
      itemCount: result.rows.reduce((sum, item) => sum + item.quantity, 0),
    });

  } catch (err) {
    console.error('Error en getCart:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * POST /api/cart
 * Agrega un producto al carrito.
 * Si el producto ya está en el carrito, incrementa la cantidad.
 */
const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity = 1 } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: 'product_id es requerido.' });
  }

  if (quantity < 1) {
    return res.status(400).json({ error: 'La cantidad debe ser al menos 1.' });
  }

  try {
    // Verificar que el producto existe y tiene stock suficiente
    const productResult = await pool.query(
      'SELECT id, name, stock, price FROM products WHERE id = $1 AND is_active = true',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const product = productResult.rows[0];

    if (product.stock < quantity) {
      return res.status(400).json({ error: `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.` });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    let cartItem;

    if (existingItem.rows.length > 0) {
      // Ya existe — actualizar cantidad
      const newQuantity = existingItem.rows[0].quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({ error: `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.` });
      }

      const result = await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
        [newQuantity, existingItem.rows[0].id]
      );
      cartItem = result.rows[0];
    } else {
      // No existe — insertar nuevo item
      const result = await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, product_id, quantity]
      );
      cartItem = result.rows[0];
    }

    res.status(201).json({
      message: `"${product.name}" agregado al carrito.`,
      item: cartItem,
    });

  } catch (err) {
    console.error('Error en addToCart:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * PUT /api/cart/:itemId
 * Actualiza la cantidad de un item específico del carrito
 */
const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'La cantidad debe ser al menos 1.' });
  }

  try {
    // Verificar que el item pertenece al usuario
    const itemResult = await pool.query(
      'SELECT ci.*, p.stock FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = $1 AND ci.user_id = $2',
      [itemId, userId]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito.' });
    }

    if (itemResult.rows[0].stock < quantity) {
      return res.status(400).json({ error: `Stock insuficiente. Solo hay ${itemResult.rows[0].stock} unidades.` });
    }

    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, itemId]
    );

    res.json({ item: result.rows[0] });

  } catch (err) {
    console.error('Error en updateCartItem:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * DELETE /api/cart/:itemId
 * Elimina un item específico del carrito
 */
const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [itemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito.' });
    }

    res.json({ message: 'Item eliminado del carrito.' });

  } catch (err) {
    console.error('Error en removeFromCart:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * DELETE /api/cart
 * Vacía el carrito completo del usuario
 */
const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    res.json({ message: 'Carrito vaciado correctamente.' });
  } catch (err) {
    console.error('Error en clearCart:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
