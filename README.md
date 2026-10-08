# Accesibilidad 360

Plataforma web colaborativa para consultar y compartir información sobre la accesibilidad de establecimientos públicos y privados.

Proyecto desarrollado como Trabajo Fin de Máster en Programación con Inteligencia Artificial. La IA se utiliza exclusivamente como herramienta de apoyo al desarrollo, no forma parte del producto.

## Estado actual

Implementado y verificado (build + lint + tests en verde):

- **Autenticación (Auth.js v5):** registro con hash bcrypt, inicio de sesión con Credentials, cierre de sesión, shell protegido (`Topbar` + navegación), páginas `/login`, `/register`, `/dashboard`, `/profile` (provisional).
- **Establecimientos:** alta con categorías (seed idempotente de 10), listado con tarjetas, ficha de detalle, media de accesibilidad dinámica. Rutas `/establishments`, `/establishments/new`, `/establishments/[id]`.
- **Valoraciones:** formulario accesible por criterios (escala 0–5 con significados), una valoración por usuario y establecimiento, lista en la ficha.
- **UI:** componentes oficiales shadcn/ui, sin modo oscuro ni animaciones.

Pendiente (según `.specs/`): edición/eliminación, fotografías, mapa, búsqueda/filtros, dashboard funcional, administración.

## Tecnologías

- Next.js 15 (App Router) + TypeScript estricto + React 19
- Tailwind CSS v4 + shadcn/ui + Lucide
- PostgreSQL (Neon) + Prisma ORM 6
- Auth.js v5 (Credentials, sesiones JWT) + bcrypt
- Zod + React Hook Form
- Vitest + Testing Library + Playwright + axe-core
- ESLint + Prettier + Husky + lint-staged

## Requisitos

- Node.js 22 LTS
- npm
- Base de datos PostgreSQL (Neon; ver `Despliegue`)

## Instalación

```bash
npm install
cp .env.example .env
npx auth secret   # genera AUTH_SECRET en .env
npx prisma migrate deploy
npx prisma db seed
```

Variables en `.env` (ver `.env.example`): `DATABASE_URL`, `AUTH_SECRET`.

## Ejecución

```bash
npm run dev       # desarrollo
npm run build     # compilación de producción
npm start         # servidor de producción
npm test          # tests unitarios e integración
npm run test:e2e  # tests end-to-end (Playwright + axe)
npm run lint      # análisis estático
```

## Estructura del proyecto

```text
app/                  # rutas: (public)/, (auth)/, (protected)/, api/auth/
components/           # ui/ (shadcn) y layout/ (Topbar, MainNav, Container)
features/             # auth/, establishments/, reviews/ (schemas, services,
                      #   actions, components, tests por módulo)
lib/                  # auth/ (Auth.js), db/ (Prisma), utils
prisma/               # schema.prisma, migrations/, seed.ts
tests/                # setup, lib/, e2e/
.specs/               # especificaciones (fuente de verdad)
.ai/                  # arquitectura, guías y decisiones (ADR)
```

## Documentación

- Fuente de verdad: `.specs/` (por prioridad) y `.ai/`.
- Flujo de trabajo y normas: `AGENTS.md`.
- Decisiones técnicas registradas (ADR) en `.ai/decisions.md`.
