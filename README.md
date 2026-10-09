# Accesibilidad 360

Plataforma web colaborativa para consultar y compartir información sobre la accesibilidad de establecimientos públicos y privados.

Proyecto desarrollado como Trabajo Fin de Máster en Programación con Inteligencia Artificial. La IA se utiliza exclusivamente como herramienta de apoyo al desarrollo, no forma parte del producto.

## Estado actual

Implementado y verificado (build + lint + tests en verde):

- **Autenticación (Auth.js v5):** registro con hash bcrypt, inicio de sesión con Credentials, cierre de sesión, shell protegido (`Topbar` + navegación), páginas `/login`, `/register`, `/dashboard`, `/profile`.
- **Perfil (SPEC-125):** información de la cuenta (nombre, correo, rol, alta, proveedor), edición del nombre con sincronización inmediata de la sesión, cambio de contraseña solo para cuentas locales, actividad (creados, valoraciones, fotos) y cierre de sesión. Ruta `/profile`.
- **Establecimientos:** alta con categorías y geografía normalizada (52 provincias + 8.192 municipios INE, sin texto libre; seed idempotente), listado en grid responsive con tarjetas compactas (foto principal, estrellas, «Ver ficha»), ficha de detalle con galería, edición y eliminación según permisos (creador o admin), media de accesibilidad dinámica. Rutas `/establishments`, `/establishments/new`, `/establishments/[id]`, `/establishments/[id]/edit`.
- **Valoraciones:** formulario accesible por criterios (escala 0–5 con significados), una valoración por usuario y establecimiento, lista en la ficha con eliminación según permisos.
- **Fotografías:** galería en Cloudinary (solo URL + publicId en BD), subida y eliminación según permisos, foto principal visible en tarjetas y ficha.
- **Mapa:** mapa global `/map` con establecimientos geolocalizados (Leaflet + OpenStreetMap); ubicación geocodificada con Nominatim al crear (en la ficha, sin coords muestra aviso).
- **Búsqueda y filtros:** texto, categoría, provincia, municipio y orden (recientes, nombre, mejor valorados) vía URL en `/establishments`.
- **Dashboard:** estadísticas, últimos establecimientos, mejor valorados y accesos rápidos. Ruta `/dashboard`.
- **Administración:** panel mínimo con gestión de categorías. Ruta `/admin` (solo ADMIN).
- **UI:** landing pública renovada (hero explicativo, beneficios, cómo funciona, criterios oficiales, llamada final), componentes oficiales shadcn/ui, sin modo oscuro ni animaciones.

La aplicación se considera funcionalmente completa para el alcance del TFM.

Posibles evoluciones futuras (fuera del alcance del TFM):

- Favoritos.
- Gamificación.
- API pública.
- Internacionalización.
- Aplicación móvil.

## Tecnologías

- Next.js 15 (App Router) + TypeScript estricto + React 19
- Tailwind CSS v4 + shadcn/ui + Lucide
- PostgreSQL (Neon) + Prisma ORM 6
- Auth.js v5 (Credentials, sesiones JWT) + bcrypt
- Zod + React Hook Form
- Cloudinary (fotografías) + Leaflet + React Leaflet (mapa, Nominatim para geocodificar)
- Vitest + Testing Library + Playwright + axe-core (189 tests unitarios/integración + 3 e2e)
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

Variables en `.env` (ver `.env.example`): `DATABASE_URL`, `AUTH_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

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
components/           # ui/ (shadcn), layout/ (Topbar, MainNav, Container),
                      #   stats/ (StatCard compartida), landing/ (presentación)
features/             # auth/, dashboard/, establishments/, photos/, reviews/,
                      #   profile/ (schemas, services, actions, components,
                      #   tests por módulo)
lib/                  # auth/ (Auth.js), db/ (Prisma), utils
prisma/               # schema.prisma, migrations/, seed.ts, data/ (INE)
tests/                # setup, lib/, e2e/
.specs/               # especificaciones (fuente de verdad)
.ai/                  # arquitectura, guías y decisiones (ADR)
```

## Documentación

- Fuente de verdad: `.specs/` (por prioridad) y `.ai/`.
- Flujo de trabajo y normas: `AGENTS.md`.
- Decisiones técnicas registradas (ADR) en `.ai/decisions.md`.
