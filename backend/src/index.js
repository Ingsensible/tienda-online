const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar la conexión a la BD (esto verifica la conexión al iniciar)
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================================
// Middlewares globales
// ============================================================

// CORS: permite que el frontend (localhost:3000) llame a esta API
// Sin esto, el navegador bloquea las peticiones por seguridad
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Parsear JSON: permite leer req.body en las rutas POST/PUT
app.use(express.json());

// ============================================================
// Rutas
// ============================================================

// Ruta de salud — útil para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.json({
    message: '🛒 TiendaApp API funcionando',
    version: '1.0.0',
    status: 'ok'
  });
});

// Rutas de la API
const authRoutes    = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes    = require('./routes/cart');
const orderRoutes   = require('./routes/orders');

app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);

// ============================================================
// Manejo de rutas no encontradas (404)
// ============================================================
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada` });
});

// ============================================================
// Manejo global de errores
// ============================================================
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ============================================================
// Iniciar servidor
// ============================================================
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
