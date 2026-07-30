const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories
} = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../middleware/auth');

/**
 * Rutas de Productos
 * Prefijo: /api/products (definido en index.js)
 * 
 * Públicas (sin token):
 *   GET /api/products           — listar con filtros y paginación
 *   GET /api/products/categories — listar categorías
 *   GET /api/products/:id       — detalle de producto
 * 
 * Admin (requieren token + rol admin):
 *   POST   /api/products        — crear
 *   PUT    /api/products/:id    — actualizar
 *   DELETE /api/products/:id    — eliminar (soft delete)
 */

// Rutas públicas
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas de admin
router.post('/',     authMiddleware, requireRole('admin'), createProduct);
router.put('/:id',   authMiddleware, requireRole('admin'), updateProduct);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteProduct);

module.exports = router;
