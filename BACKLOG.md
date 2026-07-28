# 📋 Product Backlog — TiendaApp

## ¿Qué es el Product Backlog?

El **Product Backlog** es la lista ordenada y priorizada de todo lo que el producto necesita.
Es la **única fuente de verdad** sobre qué se va a construir. Se prioriza porque el tiempo
siempre es limitado — el equipo debe enfocarse en lo que más valor aporta primero.

## ¿Qué es una User Story?

Una **User Story** describe una funcionalidad desde la perspectiva del usuario final:

> *"Como [tipo de usuario], quiero [hacer algo], para [obtener un beneficio]."*

Este formato obliga al equipo a pensar en el **valor para el usuario**, no solo en la
implementación técnica. Los **criterios de aceptación** definen exactamente cuándo
la historia está terminada.

---

## 🔴 Alta Prioridad

### US-01: Ver catálogo de productos
**Como** cliente,
**quiero** ver el catálogo de productos con imagen, nombre y precio,
**para** decidir qué comprar.

**Criterios de aceptación:**
- [ ] Lista de productos visible al entrar a la app
- [ ] Cada producto muestra imagen, nombre, precio y categoría
- [ ] La vista es responsive en móvil y desktop
- [ ] Los productos se cargan desde la API (no datos hardcodeados)

**Rama Git:** `feature/DEV-01-product-catalog-ui` (Dev A) / `feature/DEV-02-products-api` (Dev B)

---

### US-02: Buscar y filtrar productos
**Como** cliente,
**quiero** buscar productos por nombre o filtrar por categoría,
**para** encontrar lo que necesito rápidamente.

**Criterios de aceptación:**
- [ ] Campo de búsqueda por nombre funcional
- [ ] Filtro por categoría (dropdown o chips)
- [ ] Resultados se actualizan sin recargar la página
- [ ] Mensaje "sin resultados" cuando no hay coincidencias

**Rama Git:** `feature/DEV-03-product-search`

---

### US-03: Registro e inicio de sesión
**Como** cliente,
**quiero** registrarme con email y contraseña e iniciar sesión,
**para** tener una cuenta personal en la tienda.

**Criterios de aceptación:**
- [ ] Formulario de registro con email, nombre y contraseña
- [ ] Validación de campos (email válido, contraseña mínimo 8 caracteres)
- [ ] Login devuelve un JWT token
- [ ] Token se guarda en localStorage
- [ ] Rutas protegidas redirigen al login si no hay sesión

**Rama Git:** `feature/DEV-04-auth-backend` (Dev B) / `feature/DEV-05-auth-frontend` (Dev A)

---

### US-04: Agregar productos al carrito
**Como** cliente,
**quiero** agregar productos al carrito desde el catálogo o el detalle,
**para** acumular mis compras antes de pagar.

**Criterios de aceptación:**
- [ ] Botón "Agregar al carrito" en cada producto
- [ ] Contador de items visible en el header
- [ ] El carrito persiste al recargar la página
- [ ] No se puede agregar el mismo producto dos veces (incrementa cantidad)

**Rama Git:** `feature/DEV-06-cart-backend` (Dev B) / `feature/DEV-07-cart-frontend` (Dev A)

---

### US-05: Ver y editar el carrito
**Como** cliente,
**quiero** ver los productos en mi carrito y modificar cantidades,
**para** revisar mi pedido antes de pagar.

**Criterios de aceptación:**
- [ ] Lista de productos en el carrito con imagen, nombre y precio
- [ ] Botones para aumentar/disminuir cantidad
- [ ] Botón para eliminar un producto del carrito
- [ ] Total del pedido calculado automáticamente
- [ ] Botón "Proceder al pago" visible

**Rama Git:** `feature/DEV-07-cart-frontend` (Dev A)

---

### US-06: Completar una compra (Checkout)
**Como** cliente,
**quiero** completar mi compra ingresando mis datos de envío,
**para** recibir los productos que seleccioné.

**Criterios de aceptación:**
- [ ] Formulario con nombre, dirección, ciudad y teléfono
- [ ] Resumen del pedido visible antes de confirmar
- [ ] Al confirmar, se crea la orden en la base de datos
- [ ] El carrito se vacía tras la compra exitosa
- [ ] Página de confirmación con número de orden

**Rama Git:** `feature/DEV-08-checkout`

---

## 🟡 Media Prioridad

### US-07: Panel de administración — CRUD de productos
**Como** administrador,
**quiero** agregar, editar y eliminar productos,
**para** mantener el catálogo actualizado.

**Criterios de aceptación:**
- [ ] Ruta `/admin` solo accesible para usuarios con rol `admin`
- [ ] Formulario para crear producto (nombre, precio, descripción, imagen, categoría)
- [ ] Botón de editar abre formulario con datos precargados
- [ ] Botón de eliminar con confirmación
- [ ] Lista de todos los productos con acciones

**Rama Git:** `feature/DEV-09-admin-panel`

---

### US-08: Ver pedidos (Admin)
**Como** administrador,
**quiero** ver todos los pedidos realizados,
**para** gestionar el inventario y los envíos.

**Criterios de aceptación:**
- [ ] Lista de pedidos con fecha, cliente, total y estado
- [ ] Detalle de cada pedido con productos incluidos
- [ ] Posibilidad de cambiar el estado del pedido

**Rama Git:** `feature/DEV-10-admin-orders`

---

### US-09: Detalle de producto
**Como** cliente,
**quiero** ver la página de detalle de un producto,
**para** obtener más información antes de comprar.

**Criterios de aceptación:**
- [ ] Página con URL única por producto (`/products/:id`)
- [ ] Descripción completa, precio, categoría e imagen
- [ ] Botón "Agregar al carrito" funcional
- [ ] Botón "Volver al catálogo"

**Rama Git:** `feature/DEV-11-product-detail`

---

## 🟢 Baja Prioridad

### US-10: Historial de pedidos (Cliente)
**Como** cliente,
**quiero** ver el historial de mis pedidos,
**para** hacer seguimiento de mis compras anteriores.

**Criterios de aceptación:**
- [ ] Lista de pedidos del usuario autenticado
- [ ] Fecha, total y estado de cada pedido
- [ ] Detalle de productos por pedido

**Rama Git:** `feature/DEV-12-order-history`

---

## 📊 Resumen del Backlog

| ID | User Story | Prioridad | Puntos | Sprint |
|----|-----------|-----------|--------|--------|
| US-01 | Ver catálogo | Alta | 3 | Sprint 1 |
| US-02 | Buscar productos | Alta | 3 | Sprint 1 |
| US-03 | Registro/Login | Alta | 3 | Sprint 1 |
| US-04 | Agregar al carrito | Alta | 2 | Sprint 1 |
| US-05 | Ver/editar carrito | Alta | 2 | Sprint 1 |
| US-06 | Checkout | Alta | 5 | Sprint 1 |
| US-07 | Admin CRUD productos | Media | 5 | Sprint 1 |
| US-08 | Admin ver pedidos | Media | 3 | Sprint 1 |
| US-09 | Detalle de producto | Media | 2 | Sprint 1 |
| US-10 | Historial pedidos | Baja | 2 | Sprint 1 |

**Total de puntos del sprint:** 30
