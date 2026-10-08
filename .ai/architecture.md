# Arquitectura del proyecto

## Objetivo

Este documento define la arquitectura de referencia de **Accesibilidad 360**.

Su propósito es garantizar que todas las funcionalidades se desarrollen de forma consistente, mantenible y escalable.

Toda implementación deberá respetar estas decisiones arquitectónicas.

---

# Principios arquitectónicos

La arquitectura del proyecto se basa en los siguientes principios:

* Simplicidad antes que complejidad.
* Modularidad.
* Separación de responsabilidades.
* Composición antes que herencia.
* Bajo acoplamiento.
* Alta cohesión.
* Código fácilmente testeable.
* Evolución incremental.

La arquitectura debe favorecer la mantenibilidad frente a la optimización prematura.

---

# Arquitectura general

La aplicación utiliza **Next.js App Router** como framework principal.

Se adopta una arquitectura modular organizada por funcionalidades (Feature-Based Architecture).

Cada módulo es responsable de su propia lógica, componentes, validaciones y pruebas.

No se utilizará una arquitectura basada exclusivamente en capas tradicionales.

---

# Organización del proyecto

Cada funcionalidad deberá estar encapsulada dentro de `features/`.

Ejemplo:

```text
features/

auth/
establishments/
reviews/
photos/
map/
dashboard/
admin/
```

Cada módulo podrá contener:

* components
* actions
* hooks
* services
* schemas
* types
* utils
* tests

La estructura exacta dependerá de las necesidades del módulo.

No deben crearse carpetas vacías sin utilidad.

---

# App Router

La carpeta `app/` únicamente contendrá:

* rutas
* layouts
* páginas
* route handlers
* loading
* error
* not-found

La lógica de negocio nunca deberá implementarse directamente dentro de una página.

Las páginas actuarán únicamente como punto de entrada.

---

# Componentes

Los componentes deberán dividirse en dos categorías:

## Componentes compartidos

Ubicados en:

```text
components/
```

Contendrán componentes reutilizables por varios módulos.

Ejemplos:

* Button
* Dialog
* Card
* Navbar
* Sidebar

---

## Componentes de dominio

Ubicados dentro de cada módulo.

Ejemplo:

```text
features/reviews/components/
```

Estos componentes solo podrán ser utilizados por dicho módulo.

---

# Server Components

Los Server Components serán la opción por defecto.

Solo se utilizarán Client Components cuando sea imprescindible.

Ejemplos:

* formularios
* mapas
* modales
* drag & drop
* interacción en tiempo real

Antes de convertir un componente en cliente deberá justificarse su necesidad.

---

# Obtención de datos

Siempre que sea posible:

Server Component

↓

Prisma

↓

Base de datos

Evitar peticiones HTTP internas entre componentes del mismo proyecto.

---

# Server Actions

Se utilizarán preferentemente para:

* creación
* edición
* eliminación
* acciones iniciadas por formularios

Las Route Handlers se reservarán para:

* APIs públicas
* integraciones futuras
* consumo externo

---

# Acceso a datos

Toda interacción con la base de datos deberá realizarse mediante Prisma.

Nunca se ejecutará SQL directamente salvo casos excepcionales claramente documentados.

No deberá existir lógica SQL repartida por el proyecto.

---

# Validación

Toda entrada del usuario deberá validarse mediante Zod.

La validación deberá realizarse:

* en cliente cuando mejore la experiencia de usuario;
* siempre en servidor antes de persistir datos.

Nunca confiar en los datos enviados por el cliente.

---

# Estado de la aplicación

Se priorizará el uso del estado nativo de React.

Solo se utilizarán librerías adicionales cuando aporten un beneficio claro.

No utilizar Redux.

No duplicar estado entre cliente y servidor.

---

# Gestión de errores

Los errores deberán gestionarse de forma consistente.

No lanzar mensajes técnicos al usuario.

Registrar los errores relevantes para facilitar el diagnóstico.

---

# Autorización

Toda operación sensible deberá comprobar permisos en el servidor.

Nunca confiar exclusivamente en restricciones del cliente.

La interfaz puede ocultar opciones, pero la autorización siempre será responsabilidad del servidor.

---

# Accesibilidad

La accesibilidad forma parte de la arquitectura.

No es una funcionalidad adicional.

Todos los componentes deberán cumplir, siempre que sea posible, las recomendaciones WCAG.

Se priorizarán:

* navegación mediante teclado;
* etiquetas semánticas;
* contraste adecuado;
* uso correcto de ARIA cuando sea necesario.

---

# Rendimiento

Optimizar únicamente cuando exista una necesidad demostrable.

Se utilizarán las capacidades nativas de Next.js antes de incorporar nuevas dependencias.

Evitar optimizaciones prematuras.

---

# Dependencias

Antes de instalar una nueva librería comprobar:

* si Next.js ya proporciona esa funcionalidad;
* si React ya resuelve el problema;
* si existe una utilidad propia reutilizable.

Cada dependencia debe estar justificada.

---

# Convenciones

Se utilizarán:

* TypeScript estricto.
* Imports absolutos cuando resulte apropiado.
* Nombres descriptivos.
* Funciones pequeñas.
* Componentes pequeños.
* Tipado explícito en interfaces públicas.

---

# Evolución

La arquitectura debe permitir incorporar en el futuro:

* aplicación móvil;
* API pública;
* internacionalización;
* gamificación;
* moderación colaborativa.

Estas funcionalidades no forman parte del MVP, pero las decisiones actuales no deben impedir su desarrollo.

---

# Regla principal

Si existen varias soluciones técnicamente correctas, deberá elegirse aquella que:

1. sea más simple;
2. requiera menos código;
3. sea más mantenible;
4. aproveche mejor las capacidades nativas de Next.js;
5. reduzca la complejidad del proyecto.

# Stack Tecnológico

**Versión:** 1.0

---

# Framework

Next.js 15

App Router.

Se utilizarán Server Components por defecto.

---

# Lenguaje

TypeScript

Modo estricto obligatorio.

No se permitirá JavaScript.

---

# Runtime

Node.js 22 LTS

---

# Gestor de paquetes

npm

No utilizar pnpm ni yarn.

El objetivo es facilitar la reproducción del proyecto.

---

# Estilos

Tailwind CSS v4

---

# Componentes UI

shadcn/ui

No crear componentes propios si ya existen equivalentes en shadcn/ui.

---

# Iconografía

Lucide React

---

# Base de datos

PostgreSQL 17

---

# ORM

Prisma ORM

---

# Validación

Zod

---

# Formularios

React Hook Form

---

# Autenticación

Auth.js v5

---

# Mapas

Leaflet

React Leaflet

OpenStreetMap

---

# Tablas

TanStack Table

---

# Estado

React nativo

No Redux.

No Zustand salvo necesidad futura.

---

# Peticiones

Server Actions

No utilizar Axios.

Utilizar fetch únicamente cuando sea necesario.

---

# Subida de imágenes

Server Actions

Cloudinary (ver ADR-004). En base de datos solo se persiste la URL
(`secure_url`) y el `publicId`; el secreto nunca sale del servidor.

---

# Testing

Vitest

React Testing Library

Playwright

axe-core

---

# Calidad

ESLint

Prettier

Husky

lint-staged

---

# Git

GitHub

GitHub Actions

---

# Hosting

Vercel

---

# Base de datos en producción

Neon PostgreSQL

Plan gratuito.

---

# Variables de entorno

dotenv

Gestionadas mediante Next.js.

---

# Diagramas

Mermaid

---

# Documentación

Markdown

---

# Desarrollo asistido

OpenCode

Muse Spark

---

# IA

La IA no forma parte del producto.

Solo participa en el proceso de desarrollo.