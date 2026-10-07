# Especificación

**ID:** SPEC-003

**Nombre:** Infraestructura del proyecto

**Versión:** 1.0

**Estado:** Aprobada

---

# Dependencias

- 000-product-specification.md
- 001-domain-model.md
- 002-system-architecture.md

---

# Objetivo

Crear la infraestructura inicial del proyecto.

Al finalizar esta especificación deberá existir un proyecto completamente funcional preparado para comenzar el desarrollo del MVP.

No deberá implementarse ninguna funcionalidad del negocio.

---

# Alcance

Esta especificación incluye:

- creación del proyecto;
- configuración del entorno;
- instalación de dependencias;
- estructura de carpetas;
- herramientas de calidad;
- herramientas de testing;
- configuración del repositorio.

No incluye:

- autenticación;
- entidades Prisma;
- lógica de negocio;
- interfaz del producto.

---

# Proyecto

Crear una aplicación Next.js utilizando:

- App Router
- TypeScript
- ESLint
- Tailwind CSS

---

# Dependencias

Instalar únicamente las dependencias definidas en la arquitectura del proyecto.

No instalar librerías adicionales.

---

# Configuración

Configurar:

- TypeScript
- ESLint
- Prettier
- Husky
- lint-staged

---

# Componentes

Instalar y configurar:

- shadcn/ui

No generar todavía componentes personalizados.

---

# Base de datos

Configurar Prisma.

Crear:

- schema.prisma

No definir todavía ninguna entidad.

Configurar la conexión mediante variables de entorno.

---

# Testing

Configurar:

- Vitest
- React Testing Library
- Playwright
- axe-core

Crear un ejemplo mínimo de prueba para verificar que la configuración funciona correctamente.

---

# GitHub

Configurar GitHub Actions para ejecutar:

- instalación;
- lint;
- tests;
- build.

---

# Variables de entorno

Crear:

.env.example

Incluyendo únicamente las variables necesarias para la infraestructura.

No incluir credenciales reales.

---

# Estructura del proyecto

Crear únicamente la estructura necesaria para soportar la infraestructura inicial del proyecto.

No crear carpetas correspondientes a funcionalidades del negocio que aún no se hayan implementado.

Las carpetas de cada módulo funcional se crearán cuando se implemente su especificación correspondiente.

Las carpetas compartidas (por ejemplo, `app`, `components`, `lib`, `prisma`, `tests`, `public` o `docs`) sí deberán existir desde el inicio cuando sean necesarias para la infraestructura.

No crear carpetas vacías sin una finalidad clara.

---

# Scripts

Configurar los scripts mínimos:

- dev
- build
- start
- lint
- lint:fix
- test
- test:watch
- test:e2e
- format
- prepare

---

# README

Crear un README inicial que incluya:

- descripción;
- tecnologías;
- requisitos;
- instalación;
- ejecución;
- estructura del proyecto.

---

# Restricciones

- No crear la estructura interna de módulos funcionales (`features/auth`, `features/users`, `features/establishments`, etc.) hasta que se implemente su especificación correspondiente.

No implementar:

- modelos Prisma;
- autenticación;
- páginas;
- componentes del negocio;
- formularios;
- mapas.

---

# Criterios de aceptación

La especificación se considerará implementada cuando:

- el proyecto compile correctamente;
- `npm run build` finalice sin errores;
- ESLint no reporte errores;
- los tests de ejemplo pasen correctamente;
- Playwright esté configurado;
- Prisma esté configurado;
- shadcn/ui esté instalado;
- Husky funcione correctamente;
- GitHub Actions pueda ejecutarse sin errores.

Antes de ejecutar los tests End-to-End, verificar que no existe ningún proceso utilizando el puerto configurado para el servidor de desarrollo.

La infraestructura deberá ser capaz de ejecutar los tests E2E desde un entorno limpio sin intervención manual.

---

# Definition of Ready

Existen:

- arquitectura;
- dominio;
- especificación del producto.

---

# Definition of Done

El proyecto queda preparado para comenzar el desarrollo de la especificación:

010-authentication-and-authorization.md

No deberá existir ninguna funcionalidad del negocio implementada.