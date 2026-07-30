/**
 * fix-images.js — Actualiza las imágenes de productos con URLs de Unsplash
 * Uso: $env:DATABASE_URL="postgresql://..." ; node scripts/fix-images.js
 */
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const images = [
  { name: 'Laptop',        url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80' },
  { name: 'Auriculares',   url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
  { name: 'Smartphone',    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
  { name: 'Camiseta',      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { name: 'Jeans',         url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80' },
  { name: 'Cafetera',      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
  { name: 'Silla',         url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80' },
  { name: 'Tenis',         url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
];

async function fixImages() {
  console.log('🖼️  Actualizando imágenes de productos...\n');

  // Obtener todos los productos
  const { rows: products } = await pool.query('SELECT id, name FROM products ORDER BY id');
  console.log(`Productos encontrados: ${products.length}`);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const image = images[i % images.length];
    
    await pool.query(
      'UPDATE products SET image_url = $1 WHERE id = $2',
      [image.url, product.id]
    );
    console.log(`✅ ${product.name} → ${image.url.substring(0, 60)}...`);
  }

  console.log('\n🎉 Imágenes actualizadas correctamente.');
  await pool.end();
}

fixImages().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
