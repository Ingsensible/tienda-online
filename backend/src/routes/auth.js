const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

/**
 * Rutas de Autenticación
 * 
 * ¿Por qué separar rutas de controladores?
 * Las rutas definen los endpoints (URLs + métodos HTTP).
 * Los controladores definen la lógica de cada endpoint.
 * Esta separación hace el código más legible y mantenible.
 * 
 * Prefijo: /api/auth (definido en index.js)
 */

// POST /api/auth/register — Registrar nuevo usuario
router.post('/register', register);

// POST /api/auth/login — Iniciar sesión
router.post('/login', login);

// GET /api/auth/me — Obtener datos del usuario autenticado (requiere token)
router.get('/me', authMiddleware, getMe);

module.exports = router;
