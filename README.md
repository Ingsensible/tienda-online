# 🛒 TiendaApp

Tienda en línea fullstack construida como proyecto didáctico para aprender desarrollo web moderno con metodología Scrum.

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, Tailwind CSS v3, React Router v6 |
| Backend | Node.js, Express.js |
| Base de datos | PostgreSQL 16 |
| Autenticación | JWT + bcryptjs |
| HTTP Client | Axios |

## 📁 Estructura del Proyecto

```
tienda-online/
├── backend/
│   ├── migrations/          # Esquema SQL y migraciones
│   │   ├── 001_initial_schema.sql
│   │   └── 002_add_is_active_to_products.sql
│   ├── scripts/
│   │   └── reset-admin.js   # Utilidad para resetear contraseña admin
│   ├── src/
│   │   ├── config/db.js     # Pool de conexiones PostgreSQL
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── middleware/auth.js # JWT middleware
│   │   └── routes/          # Definición de rutas
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Componentes reutilizables
    │   ├── context/         # AuthContext, CartContext
    │   ├── pages/           # Páginas de la aplicación
    │   ├── services/        # Clientes HTTP (axios)
    │   └── App.js
    └── package.json
```

## ⚙️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 16+

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd tienda-online
```

### 2. Configurar el Backend
```bash
cd backend
npm install

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

Contenido del `.env`:
```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tienda_online
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secreto_jwt
FRONTEND_URL=http://localhost:3000
```

### 3. Crear la base de datos y ejecutar migraciones
```bash
# Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE tienda_online;"

# Ejecutar migraciones (crea tablas + seed data)
node migrations/run.js
```

### 4. Configurar el Frontend
```bash
cd ../frontend
npm install
```

### 5. Iniciar los servidores

**Backend** (puerto 4000):
```bash
cd backend
node src/index.js
```

**Frontend** (puerto 3000):
```bash
cd frontend
npm start
```

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@tienda.com | admin123 |
| Cliente | Registrarse en /register | — |

## 📡 API Endpoints

### Autenticación
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Perfil del usuario | JWT |

### Productos
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/products` | Listar productos (filtros, paginación) | No |
| GET | `/api/products/categories` | Listar categorías | No |
| GET | `/api/products/:id` | Detalle de producto | No |
| POST | `/api/products` | Crear producto | Admin |
| PUT | `/api/products/:id` | Actualizar producto | Admin |
| DELETE | `/api/products/:id` | Eliminar producto | Admin |

### Carrito
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/cart` | Ver carrito | JWT |
| POST | `/api/cart` | Agregar producto | JWT |
| PUT | `/api/cart/:id` | Actualizar cantidad | JWT |
| DELETE | `/api/cart/:id` | Eliminar item | JWT |
| DELETE | `/api/cart` | Vaciar carrito | JWT |

### Órdenes
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/orders` | Crear orden desde carrito | JWT |
| GET | `/api/orders/my-orders` | Mis órdenes | JWT |
| GET | `/api/orders/:id` | Detalle de orden | JWT |
| GET | `/api/orders` | Todas las órdenes | Admin |
| PUT | `/api/orders/:id/status` | Cambiar estado | Admin |

## 🖥️ Páginas del Frontend

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Inicio | Público |
| `/catalog` | Catálogo con filtros y búsqueda | Público |
| `/login` | Iniciar sesión | Público |
| `/register` | Registro | Público |
| `/cart` | Carrito de compras | Usuario |
| `/checkout` | Finalizar compra | Usuario |
| `/orders` | Historial de pedidos | Usuario |
| `/orders/:id` | Detalle de pedido | Usuario |
| `/admin` | Panel de administración | Admin |

## 🗄️ Esquema de Base de Datos

```
users          → id, name, email, password, role, created_at
categories     → id, name, slug
products       → id, name, description, price, image_url, stock, category_id, is_active
cart_items     → id, user_id, product_id, quantity
orders         → id, user_id, total, status, shipping_name, shipping_address, shipping_city
order_items    → id, order_id, product_id, product_name, price, quantity
```

## 🔄 Flujo de una Compra

```
1. Usuario navega el catálogo (/catalog)
2. Agrega productos al carrito (POST /api/cart)
3. Ve su carrito (/cart) y ajusta cantidades
4. Procede al checkout (/checkout) con datos de envío
5. Se crea la orden con transacción SQL:
   - INSERT en orders
   - INSERT en order_items (por cada producto)
   - UPDATE stock de cada producto
   - DELETE cart_items del usuario
6. Redirige a confirmación (/orders/:id?success=1)
7. Usuario puede ver historial en /orders
```

## 🌿 Flujo de Git (Feature Branch Workflow)

```
main          ← releases estables (tag v1.0.0)
  └── develop ← integración continua
        ├── feature/DEV-01-backend-setup
        ├── feature/DEV-02-database
        ├── feature/DEV-04-auth-backend
        ├── feature/DEV-05-auth-frontend
        ├── feature/DEV-06-products-backend
        ├── feature/DEV-07-catalog-cart-frontend
        ├── feature/DEV-08-orders-backend
        └── feature/DEV-09-checkout-admin-frontend
```

## 📚 Conceptos Scrum Practicados

- **Sprint Planning** — Backlog priorizado y estimado en story points
- **Daily Standup** — Registro diario en `DAILY_LOG.md`
- **Feature Branch Workflow** — Una rama por historia de usuario
- **Definition of Done** — Criterios claros de completitud
- **Sprint Review** — Demo de funcionalidades completadas
- **Retrospectiva** — Análisis de lo que funcionó y lo que mejorar

## 🛠️ Scripts Útiles

```bash
# Resetear contraseña del admin
cd backend && node scripts/reset-admin.js

# Re-ejecutar migraciones (⚠️ borra todos los datos)
cd backend && node migrations/run.js
```
