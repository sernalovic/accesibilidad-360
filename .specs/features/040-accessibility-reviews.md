# Especificación

**ID:** SPEC-040

**Nombre:** Valoraciones de accesibilidad (1.ª entrega: crear y mostrar)

**Versión:** 1.0

**Estado:** Aprobada con precisiones (ver Decisiones de modelado y Formulario)

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

Permitir que un usuario autenticado añada una valoración de accesibilidad a un establecimiento y que las valoraciones existentes se muestren en la ficha.

---

# Alcance

Implementa únicamente:

- Modelo Prisma Criterion.
- Modelo Prisma AccessibilityReview.
- Modelo Prisma CriterionScore.
- Relaciones.
- Seed idempotente de criterios.
- Formulario.
- Server Action.
- Servicio.
- Mostrar las valoraciones existentes en la ficha del establecimiento.

---

# Decisiones de modelado (arquitectura MVP)

Simplifican 001-domain-model.md para la primera entrega:

- `Criterion` en lugar de `AccessibilityCriterion`: `id`, `name` (único, para seed idempotente), `description`, `order` (orden de presentación), `createdAt`. Sin `code`, `weight`, `active`, `icon` ni `applicableByDefault` (fases posteriores).
- `CriterionScore` sin `comment` (el comentario vive en la valoración).
- `score` entero de 0 a 5.
- Unicidad: un usuario solo puede tener una valoración por establecimiento (`@@unique([establishmentId, userId])`); un criterio solo se puntúa una vez por valoración (`@@unique([reviewId, criterionId])`).
- Borrado en cascada: al eliminar una valoración se eliminan sus puntuaciones.
- No crear tablas de medias ni estadísticas.
- La especificación 001 deberá actualizarse posteriormente para reflejar esta decisión.

---

# Modelo Criterion

Campos:

- id
- name (único)
- description
- order
- createdAt

Seed inicial idempotente (por nombre), en este orden:

1. Acceso sin escalones
2. Puerta accesible
3. Anchura de paso
4. Espacio de giro
5. Aseo adaptado
6. Ascensor accesible
7. Aparcamiento PMR
8. Señalización accesible

---

# Modelo AccessibilityReview

Campos:

- id
- establishmentId
- userId
- comment (opcional)
- createdAt
- updatedAt

Un usuario solo podrá crear una valoración por establecimiento.

---

# Modelo CriterionScore

Campos:

- id
- reviewId
- criterionId
- score (entero, mínimo 0, máximo 5)

---

# Relaciones

- User 1:N AccessibilityReview
- Establishment 1:N AccessibilityReview
- AccessibilityReview 1:N CriterionScore
- Criterion 1:N CriterionScore

---

# Migración

Nombre previsto: `add_accessibility_reviews`.

Dada la inestabilidad observada de `migrate dev` contra Neon en este entorno, se aplicará con el flujo equivalente `migrate diff --from-url` + `migrate deploy` si fuese necesario.

---

# Escala de puntuación (aprobada)

Significado accesible de cada valor (de 001-domain-model.md). Debe mostrarse al usuario junto a cada puntuación, nunca números sin contexto:

- 0 — Muy deficiente
- 1 — Deficiente
- 2 — Aceptable
- 3 — Buena
- 4 — Muy buena
- 5 — Excelente

---

# Formulario

Mostrar:

- comentario (opcional)
- lista de criterios (todos los del seed, en orden)

Cada criterio tendrá una puntuación obligatoria de 0 a 5.

No utilizar sliders.

Utilizar radios o botones claramente accesibles (grupo `radiogroup` con leyenda por criterio, navegable por teclado).

Cada opción llevará su significado mediante etiqueta visible o `aria-label` según la escala aprobada (p. ej. "3 — Buena").

---

# Ficha del establecimiento

En `/establishments/[id]`, bajo los datos básicos, mostrar:

- formulario de creación (solo autenticados)
- lista de valoraciones existentes, cada una con comentario, autor, fecha y criterios valorados

No calcular todavía:

- media
- puntuación global
- estadísticas

---

# Seguridad

Solo usuarios autenticados podrán valorar (sesión obligatoria en la Server Action; `userId` siempre de la sesión, nunca del cliente).

Un usuario no podrá valorar dos veces el mismo establecimiento (restricción de unicidad en base de datos + error controlado).

---

# No implementar

- edición
- eliminación
- fotografías
- puntuaciones medias
- filtros

---

# Tests

Crear únicamente:

- esquema Zod (casos válidos, puntuaciones fuera de rango, comentario opcional)
- servicio (creación, duplicado por usuario/establecimiento, puntuación inválida)
- Server Action (sin sesión, entrada inválida, éxito)

Prisma mockeado (sin base de datos en tests). No crear E2E.

---

# Definition of Ready

La entrega estará lista para implementarse cuando esta especificación esté aprobada.

---

# Definition of Done

La entrega se considerará finalizada cuando:

- la migración `add_accessibility_reviews` se aplique sin errores;
- el seed idempotente cree los 8 criterios;
- el formulario valide en cliente y servidor con radios accesibles;
- un usuario no pueda valorar dos veces el mismo establecimiento;
- la ficha muestre las valoraciones con comentario, autor, fecha y criterios;
- `npm run build`, `npm run lint` y `npm test` pasen sin errores.
