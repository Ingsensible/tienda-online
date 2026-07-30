/**
 * Script temporal para resetear la contraseña del admin
 * Uso: node scripts/reset-admin.js
 */
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

async function resetAdmin() {
  const hash = await bcrypt.hash('admin123', 10);
  const result = await pool.query(
    'UPDATE users SET password = $1 WHERE email = $2 RETURNING email, role',
    [hash, 'admin@tienda.com']
  );
  if (result.rows.length > 0) {
    console.log('✅ Contraseña actualizada para:', result.rows[0].email, '| rol:', result.rows[0].role);
  } else {
    console.log('❌ Usuario no encontrado');
  }
  process.exit(0);
}

resetAdmin().catch(err => { console.error(err); process.exit(1); });
