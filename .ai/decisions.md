# Decisiones técnicas

## ADR-001: dependencia lib/auth → features/auth/services (SPEC-010)

**Fecha:** fase 010.4 — Inicio de sesión.

**Contexto:** Auth.js v5 exige definir `authorize` dentro del `NextAuth()` de `lib/auth/auth.ts`. La verificación de credenciales (Prisma + bcrypt) es lógica de dominio y, según la arquitectura, debe vivir en `features/auth/services`.

**Decisión:** `lib/auth/auth.ts` importa `verifyCredentials` y `loginSchema` desde `features/auth`. Es una decisión de integración temporal impuesta por Auth.js: `lib/auth` solo cablea (providers, callbacks, sesión) y no contiene reglas de negocio, que permanecen en `features/auth`.

**Consecuencias:** dirección de dependencia lib → features limitada a este cableado. Si en el futuro la verificación deja de pasar por Auth.js, el servicio ya existe aislado y testeado en el módulo.
