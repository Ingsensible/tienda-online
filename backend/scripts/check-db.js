const { Pool } = require('pg');
// NO cargar .env — usar solo la variable de entorno del sistema

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  const r = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
  );
  console.log('Tablas en Railway:', r.rows.map(x => x.table_name));
  await pool.end();
}

check().catch(e => { console.error('Error:', e.message); process.exit(1); });
