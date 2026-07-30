const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

/**
 * Rutas del Carrito
 * Prefijo: /api/cart (definido en index.js)
 * Todos los endpoints requieren autenticación
 */

router.use(authMiddleware); // Aplicar auth a todas las rutas del carrito

router.get('/',           getCart);         // Ver carrito
router.post('/',          addToCart);       // Agregar producto
router.put('/:itemId',    updateCartItem);  // Actualizar cantidad
router.delete('/:itemId', removeFromCart);  // Eliminar item
router.delete('/',        clearCart);       // Vaciar carrito

module.exports = router;
