const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * Controlador de Autenticación
 * 
 * ¿Qué es un controlador?
 * Es la función que maneja la lógica de negocio de una ruta.
 * Separa la lógica del negocio de la definición de rutas,
 * haciendo el código más organizado y fácil de mantener.
 * 
 * Patrón: Router → Controller → Database
 */

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validación básica de campos
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
  }

  // Validar formato de email con regex simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'El formato del email no es válido.' });
  }

  try {
    // Verificar si el email ya está registrado
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Este email ya está registrado.' });
    }

    // Encriptar la contraseña con bcrypt
    // ¿Por qué bcrypt? Porque aplica un "salt" aleatorio y es lento por diseño,
    // lo que hace muy difícil los ataques de fuerza bruta.
    // El número 10 es el "cost factor" — más alto = más seguro pero más lento.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la BD
    const result = await pool.query(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, role, created_at`,
      [name, email.toLowerCase(), hashedPassword]
    );

    const user = result.rows[0];

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * POST /api/auth/login
 * Inicia sesión con email y contraseña
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  try {
    // Buscar el usuario por email
    const result = await pool.query(
      'SELECT id, name, email, password, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      // Mensaje genérico por seguridad — no revelar si el email existe o no
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const user = result.rows[0];

    // Comparar la contraseña con el hash guardado
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login exitoso.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * GET /api/auth/me
 * Retorna los datos del usuario autenticado
 * Requiere token JWT válido
 */
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({ user: result.rows[0] });

  } catch (err) {
    console.error('Error en getMe:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { register, login, getMe };
