/**
 * seed-railway.js — Poblar la base de datos de Railway con datos iniciales
 * Uso: $env:DATABASE_URL="postgresql://..." ; node scripts/seed-railway.js
 */
const { Pool } = require('pg');
// NO cargar .env — usar solo DATABASE_URL del sistema

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  console.log('🌱 Iniciando seed...\n');

  // Categorías
  await pool.query(`
    INSERT INTO categories (name) VALUES
      ('Electrónica'), ('Ropa'), ('Hogar'), ('Deportes')
    ON CONFLICT DO NOTHING
  `);
  console.log('✅ Categorías insertadas');

  // Admin (contraseña: admin123)
  await pool.query(`
    INSERT INTO users (name, email, password, role) VALUES
      ('Admin', 'admin@tienda.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
    ON CONFLICT (email) DO NOTHING
  `);
  console.log('✅ Usuario admin insertado (admin@tienda.com / admin123)');

  // Productos
  await pool.query(`
    INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
      ('Laptop Pro 15"', 'Laptop de alto rendimiento con procesador i7 y 16GB RAM', 18999, 10,
       'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 1),
      ('Auriculares Bluetooth', 'Sonido premium inalámbrico con cancelación de ruido', 1299, 25,
       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 1),
      ('Smartphone X12', 'Pantalla AMOLED 6.7 pulgadas, cámara 108MP', 12499, 15,
       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 1),
      ('Camiseta Básica', '100% algodón, disponible en varios colores', 299, 50,
       'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 2),
      ('Jeans Slim Fit', 'Mezclilla premium elástica, corte moderno', 799, 30,
       'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 2),
      ('Cafetera Automática', 'Espresso y americano en 30 segundos', 2499, 8,
       'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', 3),
      ('Silla Ergonómica', 'Soporte lumbar ajustable, ideal para home office', 4999, 5,
       'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400', 3),
      ('Tenis Running', 'Suela de gel amortiguadora, transpirable', 1599, 20,
       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 4)
    ON CONFLICT DO NOTHING
  `);
  console.log('✅ 8 productos insertados');

  console.log('\n🎉 Seed completado. La base de datos está lista.');
  await pool.end();
}

seed().catch(err => {
  console.error('❌ Error en seed:', err.message);
  process.exit(1);
});
