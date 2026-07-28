const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba — verifica que el servidor está corriendo
app.get('/', (req, res) => {
  res.json({ message: '🛒 TiendaApp API funcionando', version: '1.0.0' });
});

// TODO: Importar y usar rutas aquí
// const productRoutes = require('./routes/products');
// app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
