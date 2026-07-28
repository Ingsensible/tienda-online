/**
 * Script de migración — run.js
 * 
 * ¿Cómo usarlo?
 *   npm run migrate
 * 
 * ¿Qué hace?
 * Lee el archivo 001_initial_schema.sql y lo ejecuta en PostgreSQL.
 * Esto crea todas las tablas y carga los datos iniciales.
 * 
 * ¿Cuándo ejecutarlo?
 * - La primera vez que configures el proyecto
 * - Cuando un compañero agregue una nueva migración
 * - Cuando quieras resetear la BD a su estado inicial
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'tienda_online',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function runMigrations() {
  console.log('🔄 Ejecutando migraciones...\n');

  const migrationFiles = fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.sql'))
    .sort(); // Orden numérico: 001, 002, 003...

  for (const file of migrationFiles) {
    const filePath = path.join(__dirname, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`📄 Ejecutando: ${file}`);
    try {
      await pool.query(sql);
      console.log(`   ✅ ${file} ejecutado correctamente\n`);
    } catch (err) {
      console.error(`   ❌ Error en ${file}:`, err.message);
      process.exit(1);
    }
  }

  console.log('🎉 Todas las migraciones ejecutadas correctamente');
  console.log('   Base de datos lista para usar.\n');
  await pool.end();
}

runMigrations();
