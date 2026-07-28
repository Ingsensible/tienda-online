# 🗓️ Sprint Plan — Semana 1

## ¿Qué es el Sprint Planning?

El **Sprint Planning** es la ceremonia donde el equipo selecciona qué User Stories del
backlog se van a completar en el sprint. Su propósito es crear un **compromiso realista**:
el equipo no toma más trabajo del que puede terminar bien.

Estimar las tareas ayuda a detectar dependencias y evitar que un desarrollador bloquee al otro.

---

## 🎯 Sprint Goal

> *"Al final de la semana, un usuario puede registrarse, navegar el catálogo, agregar
> productos al carrito y completar una compra. Un administrador puede gestionar el
> catálogo de productos."*

---

## 👥 Roles del equipo

| Desarrollador | Área | Stack |
|--------------|------|-------|
| **Dev A** | Frontend | React 18 + Tailwind CSS |
| **Dev B** | Backend | Node.js + Express + PostgreSQL |

---

## 📅 Plan día a día

### LUNES — Setup y fundamentos

> **¿Por qué empezar con el setup?** Porque sin una base sólida y acordada, cada
> desarrollador trabajará de forma diferente y habrá conflictos desde el primer día.
> El setup incluye estructura de carpetas, variables de entorno y la primera rama de Git.

| Hora | Dev A (Frontend) | Dev B (Backend) | Estado |
|------|-----------------|-----------------|--------|
| 9:00–9:30 | 🔄 Sprint Planning conjunto | 🔄 Sprint Planning conjunto | ⬜ |
| 9:30–11:00 | Setup: Create React App + Tailwind + estructura de carpetas | Setup: Node.js + Express + estructura de carpetas + `.env` | ⬜ |
| 11:00–13:00 | Componentes base: Header, Footer, Layout, React Router | Base de datos: esquema SQL (users, products, orders, order_items) | ⬜ |
| 14:00–17:00 | Página de catálogo (UI estática con datos mock) | Endpoints: `GET /products`, `GET /products/:id` | ⬜ |
| 17:00–17:15 | 🔄 Sync: acordar contrato de API para productos | 🔄 Sync: acordar contrato de API para productos | ⬜ |

**Ramas del día:**
- Dev A: `feature/DEV-01-project-setup-frontend`
- Dev B: `feature/DEV-02-project-setup-backend`

---

### MARTES — Autenticación

> **¿Por qué la autenticación el martes?** Porque muchas otras funcionalidades dependen
> de saber si el usuario está logueado (carrito, checkout, historial). Es una dependencia
> crítica que debe resolverse temprano.

| Hora | Dev A (Frontend) | Dev B (Backend) | Estado |
|------|-----------------|-----------------|--------|
| 9:00–9:15 | 🔄 Daily Standup | 🔄 Daily Standup | ⬜ |
| 9:15–12:00 | Páginas de Login y Registro (formularios + validación) | Endpoints: `POST /auth/register`, `POST /auth/login` con JWT | ⬜ |
| 12:00–13:00 | AuthContext: manejo de sesión global en React | Middleware de autenticación (verificar JWT en headers) | ⬜ |
| 14:00–17:00 | Integrar Login/Registro con API real + rutas protegidas | Endpoint `GET /products` con paginación y filtros por categoría | ⬜ |
| 17:00–17:15 | 🔄 Sync: probar login end-to-end | 🔄 Sync: probar login end-to-end | ⬜ |

**Ramas del día:**
- Dev A: `feature/DEV-05-auth-frontend`
- Dev B: `feature/DEV-04-auth-backend`

---

### MIÉRCOLES — Catálogo completo y Carrito

> **¿Por qué el carrito el miércoles?** Es el núcleo del e-commerce. Sin carrito no hay
> compra. Se hace a mitad de semana para tener tiempo de corregir problemas antes del viernes.

| Hora | Dev A (Frontend) | Dev B (Backend) | Estado |
|------|-----------------|-----------------|--------|
| 9:00–9:15 | 🔄 Daily Standup | 🔄 Daily Standup | ⬜ |
| 9:15–11:00 | Integrar catálogo con API real + búsqueda y filtros | Endpoints carrito: `POST /cart`, `GET /cart`, `PUT /cart/:id`, `DELETE /cart/:id` | ⬜ |
| 11:00–13:00 | Página de detalle de producto (`/products/:id`) | Lógica de carrito en base de datos (tabla `cart_items`) | ⬜ |
| 14:00–17:00 | Componente Carrito: agregar, editar cantidad, eliminar, total | Endpoint `POST /orders` (crear pedido desde carrito) | ⬜ |
| 17:00–17:15 | 🔄 Sync: probar flujo catálogo → carrito | 🔄 Sync: probar flujo catálogo → carrito | ⬜ |

**Ramas del día:**
- Dev A: `feature/DEV-07-cart-frontend`
- Dev B: `feature/DEV-06-cart-backend`

---

### JUEVES — Checkout y Panel de Administración

> **¿Por qué el admin el jueves?** Porque para el viernes necesitamos tener productos
> reales en la base de datos para la demo. El panel admin permite cargarlos sin tocar SQL.

| Hora | Dev A (Frontend) | Dev B (Backend) | Estado |
|------|-----------------|-----------------|--------|
| 9:00–9:15 | 🔄 Daily Standup | 🔄 Daily Standup | ⬜ |
| 9:15–12:00 | Página de Checkout: formulario de envío + resumen + confirmación | Endpoints admin: `POST /products`, `PUT /products/:id`, `DELETE /products/:id` | ⬜ |
| 12:00–13:00 | Integrar Checkout con API (`POST /orders`) | Endpoint `GET /orders` (admin) y `GET /orders/my` (usuario autenticado) | ⬜ |
| 14:00–17:00 | Panel de Administración: CRUD de productos en UI | Proteger rutas admin con middleware de roles (`role: 'admin'`) | ⬜ |
| 17:00–17:15 | 🔄 Sync: probar flujo completo carrito → checkout → confirmación | 🔄 Sync: probar flujo completo carrito → checkout → confirmación | ⬜ |

**Ramas del día:**
- Dev A: `feature/DEV-08-checkout` + `feature/DEV-09-admin-panel`
- Dev B: `feature/DEV-09-admin-backend` + `feature/DEV-10-orders-api`

---

### VIERNES — Pulido, pruebas y cierre del sprint

> **¿Por qué dedicar un día entero al pulido?** Porque una app que funciona al 80% pero
> se ve profesional es mejor para una demo que una app al 100% con bugs visibles.
> El viernes también es el día de las ceremonias de cierre del sprint.

| Hora | Dev A (Frontend) | Dev B (Backend) | Estado |
|------|-----------------|-----------------|--------|
| 9:00–9:15 | 🔄 Daily Standup | 🔄 Daily Standup | ⬜ |
| 9:15–11:00 | Corrección de bugs, mejoras de UI, responsive en móvil | Corrección de bugs, validaciones de entrada, manejo de errores HTTP | ⬜ |
| 11:00–12:00 | Historial de pedidos del usuario (`/my-orders`) | Tests básicos de endpoints con Postman o Jest | ⬜ |
| 12:00–13:00 | Revisión final conjunta + merge de `develop` a `main` | Revisión final conjunta + merge de `develop` a `main` | ⬜ |
| 14:00–15:30 | 🔄 Sprint Review: demo de la app funcionando | 🔄 Sprint Review: demo de la app funcionando | ⬜ |
| 15:30–16:30 | 🔄 Sprint Retrospective | 🔄 Sprint Retrospective | ⬜ |

---

## 📊 Tabla de tareas del sprint

| ID | Tarea | Responsable | Día | Horas est. | Estado |
|----|-------|-------------|-----|-----------|--------|
| T-01 | Setup frontend | Dev A | Lunes | 2h | ⬜ Pendiente |
| T-02 | Setup backend + BD | Dev B | Lunes | 3h | ⬜ Pendiente |
| T-03 | Componentes base (Header, Footer, Router) | Dev A | Lunes | 2h | ⬜ Pendiente |
| T-04 | Esquema SQL de la BD | Dev B | Lunes | 2h | ⬜ Pendiente |
| T-05 | Catálogo UI (mock) | Dev A | Lunes | 3h | ⬜ Pendiente |
| T-06 | API GET /products | Dev B | Lunes | 2h | ⬜ Pendiente |
| T-07 | Formularios Login/Registro | Dev A | Martes | 3h | ⬜ Pendiente |
| T-08 | API auth (register + login + JWT) | Dev B | Martes | 3h | ⬜ Pendiente |
| T-09 | AuthContext + rutas protegidas | Dev A | Martes | 2h | ⬜ Pendiente |
| T-10 | Middleware JWT + filtros en GET /products | Dev B | Martes | 3h | ⬜ Pendiente |
| T-11 | Catálogo con API real + búsqueda | Dev A | Miércoles | 3h | ⬜ Pendiente |
| T-12 | API carrito (CRUD) | Dev B | Miércoles | 3h | ⬜ Pendiente |
| T-13 | Detalle de producto | Dev A | Miércoles | 2h | ⬜ Pendiente |
| T-14 | API crear orden | Dev B | Miércoles | 2h | ⬜ Pendiente |
| T-15 | Componente carrito (UI completa) | Dev A | Miércoles | 3h | ⬜ Pendiente |
| T-16 | API admin CRUD productos | Dev B | Jueves | 3h | ⬜ Pendiente |
| T-17 | Página Checkout | Dev A | Jueves | 3h | ⬜ Pendiente |
| T-18 | API órdenes (admin + usuario) | Dev B | Jueves | 2h | ⬜ Pendiente |
| T-19 | Panel admin UI | Dev A | Jueves | 3h | ⬜ Pendiente |
| T-20 | Middleware roles admin | Dev B | Jueves | 2h | ⬜ Pendiente |
| T-21 | Bugs + responsive + pulido UI | Dev A | Viernes | 3h | ⬜ Pendiente |
| T-22 | Bugs + validaciones + manejo errores | Dev B | Viernes | 3h | ⬜ Pendiente |
| T-23 | Historial de pedidos (UI) | Dev A | Viernes | 2h | ⬜ Pendiente |
| T-24 | Tests de endpoints | Dev B | Viernes | 2h | ⬜ Pendiente |
| T-25 | Merge develop → main + tag v1.0 | Ambos | Viernes | 1h | ⬜ Pendiente |

## Estados
- ⬜ Pendiente
- 🔄 En progreso
- ✅ Completado
- 🚫 Bloqueado (anotar motivo)
