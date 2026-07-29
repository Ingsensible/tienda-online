const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación JWT
 * 
 * ¿Qué es un middleware?
 * Es una función que se ejecuta ENTRE que llega la petición y que se procesa la ruta.
 * Se usa para verificar permisos, validar datos, registrar logs, etc.
 * 
 * ¿Cómo funciona este middleware?
 * 1. El cliente envía el token en el header: Authorization: Bearer <token>
 * 2. Este middleware extrae el token
 * 3. Verifica que sea válido y no haya expirado
 * 4. Si es válido, agrega los datos del usuario a req.user y continúa
 * 5. Si no es válido, responde con 401 Unauthorized
 */
const authMiddleware = (req, res, next) => {
  // Extraer el token del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" → "TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next(); // Continuar con la siguiente función
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

/**
 * Middleware de autorización por rol
 * 
 * ¿Por qué separar autenticación de autorización?
 * - Autenticación: ¿Quién eres? (verifica identidad)
 * - Autorización: ¿Qué puedes hacer? (verifica permisos)
 * 
 * Uso: router.delete('/products/:id', authMiddleware, requireRole('admin'), handler)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
