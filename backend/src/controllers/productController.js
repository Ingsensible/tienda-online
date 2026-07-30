const pool = require('../config/db');

/**
 * Controlador de Productos
 * 
 * Endpoints públicos (no requieren autenticación):
 *   GET /api/products          — listar productos con filtros y paginación
 *   GET /api/products/:id      — detalle de un producto
 * 
 * Endpoints de admin (requieren rol admin):
 *   POST   /api/products       — crear producto
 *   PUT    /api/products/:id   — actualizar producto
 *   DELETE /api/products/:id   — eliminar producto
 */

/**
 * GET /api/products
 * Lista productos con soporte para:
 * - Filtro por categoría: ?category=1
 * - Búsqueda por nombre: ?search=laptop
 * - Paginación: ?page=1&limit=12
 */
const getProducts = async (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Construir la query dinámicamente según los filtros
    // Usamos parámetros ($1, $2...) para evitar SQL injection
    let conditions = ['p.is_active = true'];
    let params = [];
    let paramIndex = 1;

    if (category) {
      conditions.push(`p.category_id = $${paramIndex++}`);
      params.push(category);
    }

    if (search) {
      conditions.push(`(p.name ILIKE $${paramIndex++} OR p.description ILIKE $${paramIndex - 1})`);
      params.push(`%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Query principal con JOIN a categorías
    const productsQuery = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.image_url,
        c.id AS category_id, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(limit, offset);

    // Query para el total (paginación)
    const countQuery = `
      SELECT COUNT(*) FROM products p ${whereClause}
    `;
    const countParams = params.slice(0, paramIndex - 3); // Sin limit y offset

    const [productsResult, countResult] = await Promise.all([
      pool.query(productsQuery, params),
      pool.query(countQuery, countParams),
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      products: productsResult.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      }
    });

  } catch (err) {
    console.error('Error en getProducts:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * GET /api/products/:id
 * Retorna el detalle completo de un producto
 */
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.image_url,
        c.id AS category_id, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1 AND p.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json({ product: result.rows[0] });

  } catch (err) {
    console.error('Error en getProductById:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * POST /api/products
 * Crea un nuevo producto (solo admin)
 */
const createProduct = async (req, res) => {
  const { name, description, price, stock, image_url, category_id } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Nombre y precio son requeridos.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, image_url, category_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, stock || 0, image_url, category_id]
    );

    res.status(201).json({ product: result.rows[0] });

  } catch (err) {
    console.error('Error en createProduct:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * PUT /api/products/:id
 * Actualiza un producto (solo admin)
 */
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image_url, category_id, is_active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products 
       SET name=$1, description=$2, price=$3, stock=$4, image_url=$5, category_id=$6, is_active=$7, updated_at=NOW()
       WHERE id=$8
       RETURNING *`,
      [name, description, price, stock, image_url, category_id, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json({ product: result.rows[0] });

  } catch (err) {
    console.error('Error en updateProduct:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * DELETE /api/products/:id
 * Soft delete — marca el producto como inactivo (solo admin)
 * 
 * ¿Por qué soft delete?
 * Si borramos el producto de la BD, los pedidos históricos que lo referencian
 * quedarían con datos inconsistentes. Es mejor marcarlo como inactivo.
 */
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json({ message: 'Producto eliminado correctamente.' });

  } catch (err) {
    console.error('Error en deleteProduct:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * GET /api/products/categories
 * Lista todas las categorías disponibles
 */
const getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('Error en getCategories:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories };
