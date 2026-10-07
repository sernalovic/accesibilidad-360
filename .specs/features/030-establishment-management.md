# Especificación

**ID:** SPEC-030

**Nombre:** Gestión de establecimientos (1.ª entrega: creación)

**Versión:** 1.0

**Estado:** Pendiente de aprobación

---

# Dependencias

- 000-product-specification.md
- 001-domain-model.md
- 002-system-architecture.md
- 003-infrastructure.md
- 010-authentication-and-authorization.md

---

# Objetivo

Implementar la primera entrega del módulo de establecimientos: el flujo de creación de nuevas fichas por usuarios autenticados.

---

# Alcance

Implementa únicamente:

- Modelo Prisma Category.
- Modelo Prisma Establishment.
- Relaciones con User.
- Migración Prisma.
- Página "Nuevo establecimiento".
- Formulario.
- Validación Zod.
- React Hook Form.
- Server Action.
- Servicio.
- Persistencia.
- Redirección al listado tras crear.

---

# Decisiones de modelado (arquitectura MVP)

- `municipality` (en lugar de `city` de 001-domain-model.md).
- `province`.
- `postalCode` opcional (`String?`, no se solicita en el formulario de esta entrega; reservado para futuras fases).
- Category: `id`, `name`, `icon` opcional, `createdAt`.
- No crear tablas Municipality ni Province.
- La especificación 001 deberá actualizarse posteriormente para reflejar esta decisión.

---

# Modelo Category

Campos:

- id
- name
- icon (opcional)
- createdAt

No implementar todavía administración de categorías.

Crear un seed con categorías iniciales:

- Restaurante
- Bar
- Cafetería
- Comercio
- Supermercado
- Hotel
- Centro sanitario
- Centro público
- Instalación deportiva
- Otro

El seed deberá ser idempotente.

---

# Modelo Establishment

Implementar únicamente:

- id
- name
- description
- address
- municipality
- province
- postalCode (opcional, no solicitado en el formulario)
- categoryId
- createdById
- createdAt
- updatedAt

Relaciones:

- User 1:N Establishment
- Category 1:N Establishment

No implementar todavía:

- fotografías
- valoraciones
- puntuación
- coordenadas
- accesibilidad

---

# Formulario

Campos:

- nombre
- categoría
- dirección
- municipio
- provincia
- descripción

Todos obligatorios excepto descripción.

---

# Validaciones

Nombre

- mínimo 3
- máximo 120

Dirección

- obligatoria

Municipio

- obligatorio

Provincia

- obligatoria

Categoría

- obligatoria

---

# Seguridad

Solo usuarios autenticados podrán crear establecimientos.

Obtener siempre el usuario desde la sesión.

Nunca aceptar createdById desde el cliente.

---

# Dashboard

El enlace "Establecimientos" dejará de apuntar al placeholder.

Crear:

/establishments/new

Tras crear correctamente:

redirigir a:

/establishments

Aunque el listado todavía sea provisional.

---

# Listado

Crear una página muy sencilla que muestre:

"Próximamente aparecerá aquí el listado de establecimientos."

pero incluyendo un botón:

"Nueva ficha"

para acceder al formulario.

---

# No implementar

- edición
- eliminación
- fotografías
- mapa
- valoraciones
- filtros
- búsqueda
- paginación

---

# Tests

Crear únicamente:

- esquema Zod
- servicio
- Server Action

No crear E2E.

---

# Definition of Ready

La entrega estará lista para implementarse cuando esta especificación esté aprobada.

---

# Definition of Done

La entrega se considerará finalizada cuando:

- la migración `add_establishments` se aplique sin errores;
- el seed idempotente cree las 10 categorías;
- el formulario valide en cliente y servidor;
- solo usuarios autenticados puedan crear (createdById siempre de sesión);
- tras crear se redirija a /establishments;
- `npm run build`, `npm run lint` y `npm test` pasen sin errores.

## Política de eliminación

La eliminación de establecimientos queda limitada al propio registro del establecimiento.

En esta fase del proyecto no se define el comportamiento sobre entidades relacionadas (valoraciones, fotografías u otras que se incorporarán en especificaciones posteriores).

La política definitiva de eliminación (cascada, restricción, borrado lógico o cualquier otra estrategia) se decidirá cuando dichos módulos formen parte del dominio.

Mientras tanto, la implementación no deberá asumir ningún comportamiento de eliminación en cascada.