const { Pool } = require('pg');
require('dotenv').config();

/**
 * Configuración de la conexión a PostgreSQL
 * 
 * ¿Qué es un Pool de conexiones?
 * En lugar de abrir y cerrar una conexión por cada consulta (lento),
 * un Pool mantiene varias conexiones abiertas y las reutiliza.
 * Esto mejora el rendimiento de la aplicación significativamente.
 * 
 * ¿Por qué usar variables de entorno (.env)?
 * Porque las credenciales de la BD son información sensible.
 * Si las hardcodeas en el código y subes el repo a GitHub,
 * cualquiera puede ver tu contraseña. Las variables de entorno
 * se cargan en tiempo de ejecución y NUNCA se suben al repo.
 */
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'tienda_online',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Verificar la conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    console.error('   Verifica que PostgreSQL esté corriendo y que tu .env esté configurado.');
  } else {
    console.log('✅ Conectado a PostgreSQL correctamente');
    release();
  }
});

module.exports = pool;
