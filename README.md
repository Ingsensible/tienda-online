# 🛒 TiendaApp — Proyecto Didáctico

Aplicación de e-commerce desarrollada como proyecto de entrenamiento para aprender
desarrollo web full-stack con metodología Scrum.

> **Nota para los desarrolladores:** Este proyecto es material didáctico. Cada decisión
> técnica está documentada con su razonamiento. Léan la documentación antes de empezar.

## 🚀 Tecnologías

| Tecnología | Área | Por qué se eligió |
|-----------|------|------------------|
| React 18 | Frontend | Librería más demandada del mercado. Enseña componentes, estado y UI reactiva |
| Tailwind CSS | Frontend | Utility-first CSS, permite estilizar rápido sin salir del HTML |
| Node.js + Express | Backend | JavaScript en el servidor, curva de aprendizaje reducida, muy flexible |
| PostgreSQL | Base de datos | BD relacional robusta y gratuita. Enseña SQL real con relaciones entre tablas |
| JWT | Autenticación | Estándar stateless para APIs modernas |
| Git + GitHub | Control de versiones | Herramienta indispensable en cualquier equipo de desarrollo |

## ⚙️ Cómo correr el proyecto

### Requisitos previos
- Node.js 18+
- PostgreSQL 14+
- Git

### Backend
```bash
cd backend
npm install
cp .env.example .env   # configurar variables de entorno
npm run migrate        # crear tablas en la BD
npm run dev            # servidor en http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm start              # app en http://localhost:3000
```

## 📁 Estructura del proyecto

```
tienda-online/
├── frontend/          # React + Tailwind CSS
├── backend/           # Node.js + Express + PostgreSQL
├── docs/              # Documentación adicional
├── README.md          # Este archivo
├── SPRINT_PLAN.md     # Plan del sprint día a día
├── BACKLOG.md         # Product Backlog con User Stories
├── WORKFLOW.md        # Guía del flujo de trabajo en Git
└── DAILY_LOG.md       # Registro diario del equipo
```

## 👥 Equipo

- **Desarrollador A** — Frontend (React + Tailwind)
- **Desarrollador B** — Backend (Node.js + PostgreSQL)

## 📚 Documentación del proyecto

- [Plan del Sprint](./SPRINT_PLAN.md)
- [Product Backlog](./BACKLOG.md)
- [Workflow de Git](./WORKFLOW.md)
- [Daily Log](./DAILY_LOG.md)
