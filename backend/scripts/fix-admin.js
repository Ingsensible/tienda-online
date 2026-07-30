/**
 * fix-admin.js — Actualiza la contraseña del admin en Railway
 * Uso: $env:DATABASE_URL="postgresql://..." ; node scripts/fix-admin.js
 */
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixAdmin() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  const result = await pool.query(
    `UPDATE users SET password = $1 WHERE email = 'admin@tienda.com' RETURNING id, email, role`,
    [hash]
  );
  
  if (result.rows.length > 0) {
    console.log('✅ Contraseña del admin actualizada:', result.rows[0]);
    console.log('   Email: admin@tienda.com');
    console.log('   Password: admin123');
  } else {
    console.log('⚠️  No se encontró el usuario admin. Creándolo...');
    await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@tienda.com', $1, 'admin')`,
      [hash]
    );
    console.log('✅ Admin creado correctamente');
  }
  
  await pool.end();
}

fixAdmin().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
