# Especificación

**ID:** SPEC-070

**Nombre:** Búsqueda y filtros de establecimientos (1.ª entrega)

**Versión:** 1.0

**Estado:** Aprobada

---

# Dependencias

- 000-product-specification.md
- 001-domain-model.md
- 002-system-architecture.md
- 003-infrastructure.md
- 010-authentication-and-authorization.md
- 030-establishment-management.md

---

# Objetivo

Permitir localizar establecimientos por nombre, categoría y ubicación, y ordenarlos según distintos criterios, desde la página del listado.

---

# Alcance

Implementa únicamente:

- Búsqueda por nombre.
- Filtros por categoría, provincia y municipio.
- Ordenación (recientes, antiguos, nombre A–Z, nombre Z–A, mejor valorados).
- Filtros reflejados en la URL y persistidos como valores iniciales.
- Estado vacío con acciones contextuales.

---

# Decisiones de diseño (arquitectura MVP)

- Un único constructor del `where`: solo las condiciones con valor participan; los valores vacíos se ignoran y un orden desconocido equivale al orden por defecto.
- La ordenación por «Mejor valorados» se obtiene a partir de la valoración media calculada dinámicamente a partir de las valoraciones existentes.
- El formulario es un GET nativo: los filtros viajan en la URL sin JavaScript ni AJAX, por lo que los resultados son enlazables y el navegador conserva el historial.

---

# Filtros

Combinables entre sí:

- Buscar por nombre (coincidencia parcial, sin distinguir mayúsculas).
- Categoría.
- Provincia.
- Municipio (solo habilitado cuando hay provincia elegida; muestra únicamente los municipios de esa provincia).
- Ordenar por: Más recientes (por defecto), Más antiguos, Nombre A–Z, Nombre Z–A, Mejor valorados (por media y, en caso de empate, por fecha).

---

# Listado

En `/establishments`, bajo el título y el acceso a «Nueva ficha», el formulario ofrece «Aplicar filtros» y «Limpiar» (vuelve al listado sin filtros).

- Sin resultados con filtros activos: «No se han encontrado establecimientos con esos filtros.» con acción «Limpiar filtros».
- Sin establecimientos ni filtros: invitación a crear la primera ficha con acción «Nueva ficha».

---

# Seguridad

Solo usuarios autenticados acceden al listado (grupo `(protected)`). Los filtros proceden de la URL y se normalizan en servidor; un valor desconocido nunca altera el comportamiento esperado.

---

# No implementar

- paginación;
- filtros por valoración mínima o criterios;
- búsqueda por cercanía;
- guardado de búsquedas.

---

# Tests

Crear únicamente:

- servicio (condiciones combinadas, valores vacíos ignorados, órdenes en base de datos, valoración ordenada por media con desempate por fecha).

Prisma mockeado (sin base de datos en tests). No crear E2E.

---

# Definition of Ready

La entrega estará lista para implementarse cuando esta especificación esté aprobada.

---

# Definition of Done

La entrega se considerará finalizada cuando:

- buscar por nombre devuelva coincidencias parciales;
- cada filtro combine correctamente con los demás;
- los cinco órdenes respondan según lo descrito;
- los filtros viajen en la URL y persistan como valores iniciales;
- «Limpiar» devuelva al listado sin filtros;
- `npm run build`, `npm run lint` y `npm test` pasen sin errores.
