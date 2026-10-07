# Accesibilidad 360

Plataforma web colaborativa para consultar y compartir información sobre la accesibilidad de establecimientos públicos y privados.

Proyecto desarrollado como Trabajo Fin de Máster en Programación con Inteligencia Artificial. La IA se utiliza exclusivamente como herramienta de apoyo al desarrollo, no forma parte del producto.

## Tecnologías

- Next.js 15 (App Router) + TypeScript estricto
- Tailwind CSS v4 + shadcn/ui + Lucide
- PostgreSQL 17 + Prisma ORM
- Zod + Auth.js v5
- Leaflet + OpenStreetMap
- Vitest + Testing Library + Playwright + axe-core
- ESLint + Prettier + Husky + lint-staged

## Requisitos

- Node.js 22 LTS
- npm
- Base de datos PostgreSQL (Neon en producción)

## Instalación

```bash
npm install
cp .env.example .env
```

## Despliegue

- Hosting de la aplicación: Vercel.
- Base de datos: Neon PostgreSQL (plan gratuito).

## Ejecución

```bash
npm run dev    # desarrollo
npm run build  # compilación de producción
npm start      # servidor de producción
npm test       # tests unitarios
npm run test:e2e  # tests end-to-end
npm run lint   # análisis estático
```

## Estructura del proyecto

```text
app/         # rutas, layouts y páginas (sin lógica de negocio)
components/  # componentes compartidos
features/    # módulos funcionales (se crean con su especificación)
lib/         # servicios compartidos
prisma/      # esquema, migraciones y semillas
tests/       # pruebas globales y e2e
docs/        # documentación
public/      # recursos estáticos
```
