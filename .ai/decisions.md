# Decisiones técnicas

## ADR-001: dependencia lib/auth → features/auth/services (SPEC-010)

**Fecha:** fase 010.4 — Inicio de sesión.

**Contexto:** Auth.js v5 exige definir `authorize` dentro del `NextAuth()` de `lib/auth/auth.ts`. La verificación de credenciales (Prisma + bcrypt) es lógica de dominio y, según la arquitectura, debe vivir en `features/auth/services`.

**Decisión:** `lib/auth/auth.ts` importa `verifyCredentials` y `loginSchema` desde `features/auth`. Es una decisión de integración temporal impuesta por Auth.js: `lib/auth` solo cablea (providers, callbacks, sesión) y no contiene reglas de negocio, que permanecen en `features/auth`.

**Consecuencias:** dirección de dependencia lib → features limitada a este cableado. Si en el futuro la verificación deja de pasar por Auth.js, el servicio ya existe aislado y testeado en el módulo.

# ADR-002 — Política de eliminación de establecimientos

**Fecha:** 2026-10-07

## Contexto

Durante la implementación del módulo de establecimientos (SPEC-030), la relación entre `User` y `Establishment` se ha definido inicialmente con eliminación en cascada (`ON DELETE CASCADE`) sobre `createdById`.

Esta decisión simplifica el MVP y es suficiente mientras el único dato relacionado con un establecimiento es el propio registro.

## Estado

Aceptada para el MVP.

## Decisión

Se mantiene temporalmente la política `ON DELETE CASCADE` entre `User` y `Establishment`.

## Justificación

- Simplifica la implementación inicial.
- No afecta al flujo funcional del MVP.
- Permite completar el desarrollo sin introducir complejidad adicional.

## Revisión prevista

Esta decisión deberá revisarse antes de la versión 1.0 o cuando se implementen los módulos de:

- Valoraciones.
- Fotografías.
- Historial.
- Moderación.

En ese momento se evaluará sustituir `CASCADE` por una estrategia más adecuada, previsiblemente:

- `RESTRICT`, para impedir eliminar usuarios con establecimientos asociados.

o, si el dominio lo requiere,

- `SET NULL`, permitiendo conservar el establecimiento aunque desaparezca el autor.

La decisión definitiva dependerá de las necesidades funcionales del producto.

# ADR-003 — Política de eliminación de valoraciones

**Fecha:** 2026-10-07

## Contexto

Durante la implementación del módulo de valoraciones (SPEC-040), las relaciones del modelo se definen inicialmente con:

- `User` → `AccessibilityReview`: `ON DELETE CASCADE`.
- `Establishment` → `AccessibilityReview`: `ON DELETE CASCADE`.
- `AccessibilityReview` → `CriterionScore`: `ON DELETE CASCADE`.
- `Criterion` → `CriterionScore`: `ON DELETE RESTRICT`.

## Estado

Aceptada para el MVP. Revisión pendiente (como ADR-002).

## Decisión

Se mantienen temporalmente estas políticas en cascada para simplificar la primera entrega, sin introducir moderación, historial ni borrado selectivo.

## Revisión prevista

Deberá revisarse antes de la versión 1.0 o cuando se implementen edición, eliminación, moderación o medias/estadísticas. Se evaluará sustituir `CASCADE` por `RESTRICT` o `SET NULL` según el dominio.

# ADR-004 — Almacenamiento de fotografías en Cloudinary

**Fecha:** 2026-10-08

## Contexto

La arquitectura inicial preveía almacenamiento local durante el desarrollo. Vercel (hosting del proyecto) tiene un sistema de archivos efímero: los ficheros subidos en local no persistirían en producción.

## Decisión

Almacenar las fotografías en Cloudinary (plan gratuito):

- Subida siempre desde el servidor mediante Server Actions (`upload_stream`); el API secret nunca sale del servidor.
- En PostgreSQL solo se persisten `url` (`secure_url`) y `publicId` (imprescindible para futuras eliminaciones/transformaciones).
- SDK oficial `cloudinary` (v2); sin librerías intermedias.

## Consecuencias

- Requiere `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` en el entorno (placeholders en `.env.example`).
- `next/image` exige `images.remotePatterns` para `res.cloudinary.com`.
- Límite técnico documentado en SPEC-050 (5 MB, JPG/PNG/WebP, dimensiones mínimas).