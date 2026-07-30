# 📓 Daily Log — Registro de progreso diario

## ¿Qué es el Daily Standup y por qué existe?

El **Daily Standup** (o Daily Scrum) es una reunión de **máximo 15 minutos** que se
realiza cada día a la misma hora. Su propósito NO es reportar avances al jefe — es
una conversación entre pares para sincronizar el equipo y detectar bloqueos temprano.

Cada desarrollador responde **3 preguntas**:
1. ✅ **¿Qué hice ayer?** — Para que el equipo sepa qué avanzó
2. 🎯 **¿Qué haré hoy?** — Para que el equipo sepa en qué estás trabajando
3. 🚧 **¿Hay algo que me bloquea?** — Para pedir ayuda antes de perder horas atascado

> **Error común:** Convertir el Daily en una reunión de estado donde cada uno reporta
> al líder. El Daily es PARA el equipo, no para el manager. Si algo tarda más de 15
> minutos, se agenda una conversación aparte.

Este archivo es el **registro escrito** de esas respuestas. Sirve como historial del
sprint y ayuda a identificar patrones (¿siempre hay bloqueos el miércoles? ¿por qué?).

---

## 📅 Semana 1 — Sprint 1

---

### 📆 LUNES

> *Primer día del sprint — no hay "ayer", solo el "hoy" y el Sprint Goal.*

**Dev A (Frontend):**
- ✅ Hice ayer: *(primer día, no aplica)*
- 🎯 Haré hoy: Setup del proyecto frontend con `npx create-react-app`. Instalar Tailwind CSS. Crear estructura de carpetas y componentes base (Header, Footer, Layout). Configurar React Router.
- 🚧 Impedimentos: Ninguno

**Dev B (Backend):**
- ✅ Hice ayer: *(primer día, no aplica)*
- 🎯 Haré hoy: Setup del proyecto backend con Node.js + Express. Crear `.env` desde `.env.example`. Diseñar esquema SQL. Implementar endpoints `GET /products` y `GET /products/:id`.
- 🚧 Impedimentos: Ninguno

**📝 Progreso del día (registro en tiempo real):**
- ✅ Repositorio Git inicializado
- ✅ `.gitignore` configurado
- ✅ Estructura de carpetas `backend/` y `frontend/` creada
- ✅ `backend/package.json` con dependencias (express, cors, dotenv, pg, jsonwebtoken, bcryptjs)
- ✅ `backend/src/index.js` — servidor Express base
- ✅ `backend/.env.example` — plantilla de variables de entorno
- ✅ Frontend: React 18 + Tailwind CSS v3 compilando en http://localhost:3000
- ✅ Backend: Express corriendo en http://localhost:4000
- ✅ PostgreSQL 16 instalado y conectado correctamente
- ✅ Base de datos `tienda_online` creada y migración ejecutada (6 tablas + seed data)
- ✅ Commits DEV-01 y DEV-02 mergeados a `develop`
- ✅ `backend/src/config/db.js` — Pool de conexiones PostgreSQL
- ✅ `backend/migrations/001_initial_schema.sql` — esquema completo
- ✅ `backend/migrations/run.js` — script de migraciones

**🐛 Bugs encontrados y resueltos:**
- Tailwind v4 incompatible con create-react-app → solución: bajar a Tailwind v3
- PostgreSQL no estaba en el PATH → solución: usar variable PGPASSWORD

**🔄 Sync del día:**
- Backend en puerto 4000, frontend en 3000, CORS configurado
- Próximo paso (Martes): implementar autenticación JWT (register + login)

---

### 📆 MARTES

**Dev A (Frontend):**
- ✅ Hice ayer: Setup de React + Tailwind CSS, estructura de carpetas, App.js base
- 🎯 Haré hoy: Páginas de Login y Registro (formularios + validación), AuthContext, rutas protegidas
- 🚧 Impedimentos: Ninguno

**Dev B (Backend):**
- ✅ Hice ayer: Setup de Express + PostgreSQL, esquema SQL, migración ejecutada, servidor corriendo
- 🎯 Haré hoy: Endpoints POST /auth/register y POST /auth/login con JWT, middleware de autenticación
- 🚧 Impedimentos: Ninguno

**📝 Progreso del día (registro en tiempo real):**
- ✅ `backend/src/middleware/auth.js` — middleware JWT (autenticación + autorización por rol)
- ✅ `backend/src/controllers/authController.js` — register, login, getMe con bcrypt + JWT
- ✅ `backend/src/routes/auth.js` — POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
- ✅ Endpoints probados con Invoke-WebRequest: register ✅ login ✅ /me con token ✅
- ✅ `frontend/src/services/authService.js` — axios con interceptor JWT
- ✅ `frontend/src/context/AuthContext.js` — Context API con login, register, logout
- ✅ `frontend/src/pages/LoginPage.js` y `RegisterPage.js` — formularios con validación
- ✅ `frontend/src/components/ProtectedRoute.js` — rutas protegidas por rol
- ✅ `frontend/src/App.js` — Router, Header dinámico, rutas configuradas
- ✅ Login end-to-end probado en navegador: usuario creado y sesión iniciada
- ✅ DEV-04 y DEV-05 mergeados a `develop`

**🔄 Sync del día:**
- Login end-to-end probado: ✅ Sí
- Problemas encontrados: Ninguno
- Decisiones tomadas: ProtectedRoute listo para usar en rutas del Miércoles

---

### 📆 MIÉRCOLES

**Dev A (Frontend):**
- ✅ Hice ayer: Páginas Login/Registro, AuthContext, ProtectedRoute, Header dinámico
- 🎯 Haré hoy: Página de catálogo con grid de productos, componente ProductCard, CartContext, página del carrito
- 🚧 Impedimentos: Ninguno

**Dev B (Backend):**
- ✅ Hice ayer: Endpoints auth (register, login, /me), middleware JWT, bcrypt
- 🎯 Haré hoy: GET /api/products, GET /api/products/:id, endpoints del carrito (GET/POST/PUT/DELETE)
- 🚧 Impedimentos: Ninguno

**📝 Progreso del día (registro en tiempo real):**
- ✅ `backend/src/controllers/productController.js` — GET/POST/PUT/DELETE productos + categorías
- ✅ `backend/src/routes/products.js` — rutas públicas y de admin con middleware de roles
- ✅ `backend/src/controllers/cartController.js` — GET/POST/PUT/DELETE carrito con validación de stock
- ✅ `backend/src/routes/cart.js` — todas las rutas protegidas con authMiddleware
- ✅ `backend/migrations/002_add_is_active_to_products.sql` — columna is_active agregada
- ✅ GET /api/products probado: retorna 8 productos con categorías y paginación
- ✅ `frontend/src/services/productService.js` — productService + cartService con axios
- ✅ `frontend/src/context/CartContext.js` — estado global del carrito sincronizado con backend
- ✅ `frontend/src/pages/CatalogPage.js` — grid de productos, búsqueda, filtros por categoría, paginación
- ✅ `frontend/src/pages/CartPage.js` — lista de items, control de cantidad, resumen del pedido
- ✅ `frontend/src/App.js` — CartProvider, nuevas rutas /catalog y /cart, contador en Header
- ✅ DEV-06 y DEV-07 mergeados a `develop`

**🐛 Bugs encontrados y resueltos:**
- Columna `is_active` no existía en tabla products → solución: migración 002

**🔄 Sync del día:**
- Flujo catálogo → carrito probado: ✅ Sí
- Problemas encontrados: Columna is_active faltante (resuelto con migración)
- Decisiones tomadas: /cart es ruta protegida, catálogo es público

---

### 📆 JUEVES

**Dev A (Frontend):**
- ✅ Hice ayer: CatalogPage con filtros, CartContext, CartPage con control de cantidad
- 🎯 Haré hoy: CheckoutPage (formulario dirección + resumen), OrderHistoryPage, panel admin básico (CRUD productos)
- 🚧 Impedimentos: Ninguno

**Dev B (Backend):**
- ✅ Hice ayer: Endpoints productos y carrito completos, migración is_active
- 🎯 Haré hoy: POST /api/orders (crear orden desde carrito), GET /api/orders/my-orders, GET /api/orders/:id, endpoints admin
- 🚧 Impedimentos: Ninguno

**📝 Progreso del día (registro en tiempo real):**

**🔄 Sync del día:**
- Flujo completo carrito → checkout → confirmación probado: ⬜ Sí / ⬜ No
- Problemas encontrados:
- Decisiones tomadas:

---

### 📆 VIERNES

**Dev A (Frontend):**
- ✅ Hice ayer:
- 🎯 Haré hoy:
- 🚧 Impedimentos:

**Dev B (Backend):**
- ✅ Hice ayer:
- 🎯 Haré hoy:
- 🚧 Impedimentos:

---

## 🔄 Sprint Review — Viernes 14:00

> **¿Qué es el Sprint Review?** Es la ceremonia donde el equipo presenta lo que
> construyó durante el sprint. Se hace una **demo en vivo** de la aplicación funcionando,
> no slides. El objetivo es obtener feedback real.
>
> **Error común:** Presentar trabajo incompleto como si estuviera listo, o mostrar
> capturas de pantalla en lugar de la app funcionando.

### ¿Qué se completó?

| User Story | Estado | Notas |
|-----------|--------|-------|
| US-01: Ver catálogo | ⬜ | |
| US-02: Buscar productos | ⬜ | |
| US-03: Registro/Login | ⬜ | |
| US-04: Agregar al carrito | ⬜ | |
| US-05: Ver/editar carrito | ⬜ | |
| US-06: Checkout | ⬜ | |
| US-07: Admin CRUD productos | ⬜ | |
| US-08: Admin ver pedidos | ⬜ | |
| US-09: Detalle de producto | ⬜ | |
| US-10: Historial pedidos | ⬜ | |

### ¿Qué quedó pendiente y por qué?

*(Anotar aquí)*

### Feedback recibido:

*(Anotar aquí)*

---

## 🪞 Sprint Retrospective — Viernes 15:30

> **¿Qué es la Retrospectiva?** Es la ceremonia más importante para el crecimiento
> del equipo. Es el espacio seguro para hablar honestamente de lo que salió bien,
> lo que salió mal y qué cambiar en el próximo sprint.
>
> **Error común:** Saltársela porque "no hay tiempo". La retro es exactamente para
> eso — para que el equipo mejore y el próximo sprint sea más eficiente.

### 🟢 START — ¿Qué deberíamos EMPEZAR a hacer?

*(Prácticas nuevas que el equipo debería adoptar)*

- 
- 

### 🔴 STOP — ¿Qué deberíamos DEJAR de hacer?

*(Cosas que no están funcionando y hay que eliminar)*

- 
- 

### 🟡 CONTINUE — ¿Qué está funcionando bien y debemos MANTENER?

*(Prácticas que el equipo valora y quiere conservar)*

- 
- 

### 📌 Compromisos para el próximo sprint:

1. 
2. 
3. 

---

## 📊 Definition of Done (DoD)

> **¿Qué es el DoD?** Es la lista de criterios que TODOS deben cumplir para que una
> tarea se considere "terminada". Sin DoD, cada desarrollador tiene su propia
> interpretación de "listo", lo que genera deuda técnica y malentendidos.

Una tarea está **✅ DONE** cuando:

- [ ] El código funciona sin errores en el entorno local
- [ ] Se hizo commit con mensaje descriptivo siguiendo la convención
- [ ] Se abrió un Pull Request y fue revisado por el otro desarrollador
- [ ] El PR fue mergeado a `develop`
- [ ] La funcionalidad fue probada manualmente (happy path + al menos un caso de error)
- [ ] El `SPRINT_PLAN.md` fue actualizado con el estado ✅
- [ ] Si aplica: se actualizó el `README.md` o documentación relevante
