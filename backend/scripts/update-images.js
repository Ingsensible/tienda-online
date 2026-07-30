/**
 * Script para actualizar las imágenes de los productos con fotos reales de Unsplash
 * Uso: node scripts/update-images.js
 */
const pool = require('../src/config/db');

const images = [
  {
    id: 1,
    name: 'Laptop Pro 15"',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'
  },
  {
    id: 2,
    name: 'Auriculares Bluetooth',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'
  },
  {
    id: 3,
    name: 'Smartphone X12',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80'
  },
  {
    id: 4,
    name: 'Camiseta Básica',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'
  },
  {
    id: 5,
    name: 'Jeans Slim Fit',
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'
  },
  {
    id: 6,
    name: 'Cafetera Automática',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80'
  },
  {
    id: 7,
    name: 'Silla Ergonómica',
    image_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&q=80'
  },
  {
    id: 8,
    name: 'Tenis Running',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'
  }
];

async function updateImages() {
  console.log('🖼️  Actualizando imágenes de productos...\n');
  for (const product of images) {
    const result = await pool.query(
      'UPDATE products SET image_url = $1 WHERE id = $2 RETURNING name',
      [product.image_url, product.id]
    );
    if (result.rows.length > 0) {
      console.log(`✅ ${result.rows[0].name}`);
    } else {
      console.log(`❌ Producto id=${product.id} no encontrado`);
    }
  }
  console.log('\n✅ Imágenes actualizadas correctamente');
  process.exit(0);
}

updateImages().catch(err => { console.error(err); process.exit(1); });
