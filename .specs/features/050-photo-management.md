# Especificación

**ID:** SPEC-050

**Nombre:** Fotografías de establecimientos (1.ª entrega: subida única)

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

Permitir que un usuario autenticado suba una fotografía a un establecimiento, almacenada en Cloudinary y mostrada en la ficha.

---

# Alcance

Implementa únicamente:

- Modelo Prisma Photo (preparado para múltiples futuras).
- Migración Prisma.
- Formulario de subida (un archivo).
- Validación Zod (tipo, tamaño, dimensiones).
- Server Action con subida servidor-a-servidor.
- Servicio de persistencia (solo URL + publicId).
- Mostrar la fotografía en la ficha.

---

# Decisiones de modelado (arquitectura MVP)

- `Photo`: `id`, `establishmentId`, `userId`, `url` (`secure_url`), `publicId` (imprescindible para futuras eliminaciones/transformaciones), `caption String?` (reservado, no solicitado), `isPrimary Boolean @default(true)` (soporte futuro de múltiples), `createdAt`.
- Relaciones: `Establishment 1:N Photo` y `User 1:N Photo` (Cascade, revisión pendiente como ADR-002/ADR-003).
- La regla "una fotografía por establecimiento" vive en el servicio (error controlado), no en BD, para no bloquear la futura galería.
- Almacenamiento en Cloudinary según ADR-004 (sustituye al almacenamiento local inicial por el filesystem efímero de Vercel).

---

# Validaciones del archivo

- Formatos: JPG (`image/jpeg`), PNG (`image/png`), WebP (`image/webp`).
- Tamaño máximo: 5 MB.
- Dimensiones mínimas: 800 × 600 px (verificadas con la respuesta de Cloudinary tras la subida; si no se alcanzan, se elimina lo subido y se devuelve error controlado, sin dependencias nuevas).

---

# Formulario

Un único `input[type=file]` (`accept="image/jpeg,image/png,image/webp"`).

Si el establecimiento ya tiene fotografía, el formulario se muestra **deshabilitado** (`fieldset disabled`) con el mensaje: "Este establecimiento ya tiene una fotografía. La gestión de múltiples fotografías llegará en una próxima fase."

Sin drag & drop, sin compresión manual, sin previsualización.

---

# Ficha del establecimiento

Si existe fotografía, mostrarla con `next/image` (requiere `images.remotePatterns` para `res.cloudinary.com`).

---

# Seguridad

Solo usuarios autenticados (`userId` siempre de la sesión). El API secret de Cloudinary nunca sale del servidor (subida en la Server Action).

---

# No implementar

- galerías
- carruseles
- edición
- eliminación
- múltiples fotografías
- compresión manual
- drag & drop

---

# Tests

Crear únicamente:

- esquema Zod (tipo, tamaño)
- servicio (SDK mockeado: éxito, duplicado por establecimiento, dimensiones insuficientes con limpieza)
- Server Action (sin sesión, entrada inválida, éxito)

Prisma mockeado. No crear E2E.

---

# Definition of Done

La entrega se considerará finalizada cuando:

- la migración `add_photos` se aplique sin errores;
- un usuario autenticado pueda subir JPG/PNG/WebP ≤ 5 MB y ≥ 800×600;
- solo se persistan `url` y `publicId` (+ metadatos propios);
- la segunda subida al mismo establecimiento devuelva error controlado;
- la ficha muestre la fotografía;
- `npm run build`, `npm run lint` y `npm test` pasen sin errores.
