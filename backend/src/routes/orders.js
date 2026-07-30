const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus
} = require('../controllers/orderController');
const { authMiddleware, requireRole } = require('../middleware/auth');

/**
 * Rutas de Órdenes
 * Prefijo: /api/orders (definido en index.js)
 *
 * Usuario autenticado:
 *   POST /api/orders              — crear orden desde carrito
 *   GET  /api/orders/my-orders    — mis órdenes
 *   GET  /api/orders/:id          — detalle de orden (propia)
 *
 * Admin:
 *   GET  /api/orders              — todas las órdenes
 *   PUT  /api/orders/:id/status   — cambiar estado
 */

router.use(authMiddleware); // Todas las rutas requieren autenticación

// Rutas de usuario
router.post('/',            createOrder);
router.get('/my-orders',    getMyOrders);
router.get('/:id',          getOrderById);

// Rutas de admin
router.get('/',             requireRole('admin'), getAllOrders);
router.put('/:id/status',   requireRole('admin'), updateOrderStatus);

module.exports = router;
