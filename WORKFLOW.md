# 🌿 Guía de Workflow de Git — TiendaApp

## ¿Por qué necesitamos un workflow de Git?

Cuando dos o más personas trabajan en el mismo código, sin un flujo acordado el caos
es inevitable: código sobreescrito, bugs introducidos sin querer, versiones mezcladas.

Un **workflow de Git** es el conjunto de reglas que el equipo sigue para colaborar de
forma ordenada. Es como el reglamento de tránsito: todos lo siguen para que nadie choque.

---

## 🌳 Estructura de ramas

```
main          ← código en producción, siempre estable y funcional
└── develop   ← integración continua, aquí se mezcla el trabajo diario
    ├── feature/DEV-01-project-setup-frontend
    ├── feature/DEV-02-project-setup-backend
    ├── feature/DEV-03-product-search
    ├── feature/DEV-04-auth-backend
    ├── feature/DEV-05-auth-frontend
    ├── feature/DEV-06-cart-backend
    ├── feature/DEV-07-cart-frontend
    ├── feature/DEV-08-checkout
    ├── feature/DEV-09-admin-panel
    ├── feature/DEV-10-orders-api
    ├── feature/DEV-11-product-detail
    ├── feature/DEV-12-order-history
    └── bugfix/DEV-XX-descripcion-del-bug
```

### ¿Por qué estas ramas?

| Rama | Propósito | ¿Quién hace push? |
|------|-----------|------------------|
| `main` | Código listo para producción. Solo recibe merges desde `develop` al final del sprint | Nadie directamente |
| `develop` | Integración del trabajo diario. Siempre debe compilar y funcionar | Solo via Pull Request |
| `feature/*` | Una funcionalidad nueva. Vive mientras se desarrolla esa feature | El desarrollador asignado |
| `bugfix/*` | Corrección de un bug específico | El desarrollador que lo corrige |

> ⚠️ **Regla de oro:** NUNCA hacer `git push` directo a `main` o `develop`.
> Todo cambio entra por Pull Request.

---

## 🔄 Flujo de trabajo paso a paso

### 1. Antes de empezar una tarea

```bash
# Asegúrate de estar en develop y tener lo último
git checkout develop
git pull origin develop

# Crea tu rama con el nombre correcto
git checkout -b feature/DEV-05-auth-frontend
```

> **¿Por qué hacer pull antes de crear la rama?** Para que tu rama parta del código
> más reciente. Si partes de código viejo, tendrás más conflictos al hacer merge.

---

### 2. Durante el desarrollo — commits frecuentes

```bash
# Ver qué archivos cambiaste
git status

# Agregar los archivos al staging
git add src/pages/Login.jsx
git add src/context/AuthContext.jsx

# O agregar todos los cambios
git add .

# Hacer el commit con mensaje descriptivo
git commit -m "feat(auth): add login form with email/password validation"
```

> **¿Por qué commits frecuentes?** Cada commit es un punto de restauración. Si algo
> sale mal, puedes volver a un commit anterior. Commits grandes y poco frecuentes
> hacen muy difícil encontrar dónde se introdujo un bug.

---

### 3. Subir tu rama a GitHub

```bash
# Primera vez que subes la rama
git push -u origin feature/DEV-05-auth-frontend

# Las siguientes veces
git push
```

---

### 4. Abrir un Pull Request (PR)

1. Ve a GitHub → tu repositorio
2. Verás un banner "Compare & pull request" — haz clic
3. Asegúrate de que el PR va de `feature/DEV-05-auth-frontend` → `develop`
4. Escribe un título descriptivo: `feat(auth): implement login and register pages`
5. En la descripción explica:
   - ¿Qué hace este PR?
   - ¿Cómo probarlo?
   - ¿Hay algo que el revisor deba saber?
6. Asigna al otro desarrollador como **Reviewer**

> **¿Por qué Pull Requests?** Son la puerta de entrada al código compartido. Obligan
> a que alguien más revise el código antes de integrarlo. Esto reduce bugs, mejora
> la calidad y es una oportunidad de aprendizaje para ambos desarrolladores.

---

### 5. Revisar un Pull Request

Como revisor, debes verificar:
- [ ] ¿El código hace lo que dice que hace?
- [ ] ¿Hay bugs obvios o casos no manejados?
- [ ] ¿El código es legible y sigue las convenciones del proyecto?
- [ ] ¿Falta algún criterio de aceptación de la User Story?

Si todo está bien → **Approve** y merge.
Si hay cambios necesarios → **Request changes** con comentarios específicos.

---

### 6. Merge al final del sprint

```bash
# El viernes, cuando todo está en develop y probado:
git checkout main
git pull origin main
git merge develop
git tag v1.0.0
git push origin main --tags
```

---

## ✍️ Convención de mensajes de commit

Seguimos el estándar **Conventional Commits**:

```
<tipo>(<módulo>): <descripción corta en presente>
```

### Tipos de commit:

| Tipo | Cuándo usarlo | Ejemplo |
|------|--------------|---------|
| `feat` | Nueva funcionalidad | `feat(cart): add item quantity update` |
| `fix` | Corrección de bug | `fix(auth): handle expired JWT token` |
| `style` | Cambios de UI/CSS sin lógica | `style(catalog): improve mobile grid layout` |
| `refactor` | Mejora de código sin cambiar comportamiento | `refactor(api): extract product validation middleware` |
| `docs` | Cambios en documentación | `docs(readme): add setup instructions` |
| `test` | Agregar o modificar tests | `test(orders): add unit test for total calculation` |
| `chore` | Tareas de mantenimiento | `chore(deps): update express to 4.18.2` |

### Ejemplos reales del proyecto:

```bash
feat(catalog): add product listing with image and price
feat(auth): implement JWT login endpoint
fix(cart): prevent duplicate items on add to cart
style(checkout): improve form layout on mobile
docs(workflow): add git branching guide
refactor(products): move validation to separate middleware
test(auth): add test for invalid token rejection
```

> **¿Por qué esta convención?** Porque en 3 meses, cuando revises el historial de
> commits, un mensaje como `fix` no te dice nada. Uno como
> `fix(auth): handle expired JWT token on refresh` te dice exactamente qué se corrigió
> y dónde. También permite generar changelogs automáticos.

---

## ⚠️ Reglas del equipo

1. **Nunca** hacer push directo a `main` o `develop`
2. **Siempre** crear una rama por tarea/feature
3. **Siempre** hacer pull de `develop` antes de crear una rama nueva
4. **Siempre** escribir mensajes de commit descriptivos
5. **Siempre** esperar aprobación del PR antes de hacer merge
6. Un PR = una funcionalidad (no mezclar varias features en un PR)
7. Resolver conflictos en tu rama local antes de abrir el PR

---

## 🆘 Comandos útiles de emergencia

```bash
# Ver el historial de commits
git log --oneline --graph

# Deshacer el último commit (sin perder los cambios)
git reset --soft HEAD~1

# Ver diferencias antes de hacer commit
git diff

# Guardar cambios temporalmente sin hacer commit
git stash
git stash pop   # recuperar los cambios guardados

# Actualizar tu rama con los últimos cambios de develop
git fetch origin
git rebase origin/develop
```
