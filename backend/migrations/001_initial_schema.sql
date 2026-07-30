-- ============================================================
-- MIGRACIÓN 001 — Esquema inicial de la base de datos
-- TiendaApp — Proyecto Didáctico
-- ============================================================
--
-- ¿Qué es una migración?
-- Es un archivo SQL con los cambios a la estructura de la BD.
-- Se numeran (001, 002, 003...) para ejecutarse en orden.
-- Esto permite que cualquier desarrollador recree la BD exacta
-- ejecutando las migraciones en secuencia.
--
-- ¿Por qué no modificar la BD directamente?
-- Porque si otro desarrollador clona el proyecto, no sabrá
-- qué cambios hiciste. Las migraciones son el historial de
-- la base de datos, igual que Git es el historial del código.
-- ============================================================

-- Eliminar tablas si existen (para poder re-ejecutar la migración)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- TABLA: users
-- Almacena los usuarios registrados en la tienda
-- ============================================================
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,        -- Siempre encriptada con bcrypt
  role        VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLA: categories
-- ============================================================
CREATE TABLE categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) UNIQUE NOT NULL,
  slug  VARCHAR(100) UNIQUE NOT NULL
);

-- ============================================================
-- TABLA: products
-- ============================================================
CREATE TABLE products (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  price         DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url     VARCHAR(500),
  stock         INTEGER DEFAULT 0 CHECK (stock >= 0),
  category_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLA: cart_items
-- ============================================================
CREATE TABLE cart_items (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================================
-- TABLA: orders
-- ============================================================
CREATE TABLE orders (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total            DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status           VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_name    VARCHAR(100) NOT NULL,
  shipping_address VARCHAR(300) NOT NULL,
  shipping_city    VARCHAR(100) NOT NULL,
  shipping_phone   VARCHAR(20),
  created_at       TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLA: order_items
-- Guardamos nombre y precio al momento de la compra
-- porque el producto puede cambiar de precio o eliminarse después
-- ============================================================
CREATE TABLE order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  price        DECIMAL(10, 2) NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0)
);

-- ============================================================
-- DATOS INICIALES (seed data) — para desarrollo y pruebas
-- ============================================================
INSERT INTO categories (name, slug) VALUES
  ('Electrónica', 'electronica'),
  ('Ropa', 'ropa'),
  ('Hogar', 'hogar'),
  ('Deportes', 'deportes');

INSERT INTO products (name, description, price, image_url, stock, category_id) VALUES
  ('Laptop Pro 15"', 'Laptop de alto rendimiento con procesador i7, 16GB RAM y 512GB SSD', 15999.99, 'https://via.placeholder.com/400x300?text=Laptop', 10, 1),
  ('Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido activa', 1299.99, 'https://via.placeholder.com/400x300?text=Auriculares', 25, 1),
  ('Smartphone X12', 'Teléfono inteligente con cámara de 108MP y batería de 5000mAh', 8999.99, 'https://via.placeholder.com/400x300?text=Smartphone', 15, 1),
  ('Camiseta Básica', 'Camiseta 100% algodón disponible en varios colores', 299.99, 'https://via.placeholder.com/400x300?text=Camiseta', 50, 2),
  ('Jeans Slim Fit', 'Pantalón de mezclilla corte slim, cómodo y duradero', 699.99, 'https://via.placeholder.com/400x300?text=Jeans', 30, 2),
  ('Cafetera Automática', 'Cafetera con molinillo integrado y pantalla táctil', 2499.99, 'https://via.placeholder.com/400x300?text=Cafetera', 8, 3),
  ('Silla Ergonómica', 'Silla de oficina con soporte lumbar ajustable', 3999.99, 'https://via.placeholder.com/400x300?text=Silla', 5, 3),
  ('Tenis Running', 'Tenis para correr con tecnología de amortiguación avanzada', 1599.99, 'https://via.placeholder.com/400x300?text=Tenis', 20, 4);

-- Usuario admin de prueba
-- Contraseña: admin123 (encriptada con bcrypt rounds=10)
INSERT INTO users (name, email, password, role) VALUES
  ('Administrador', 'admin@tienda.com', '$2a$10$ru07e1.J2BAvTOyhh3ISUOQ6CsafZcWEXukhblKfsxlZziopxeTnq', 'admin');
