# Especificación

**ID:** SPEC-080

**Nombre:** Edición y eliminación de establecimientos (1.ª entrega)

**Versión:** 1.0

**Estado:** Aprobada

---

# Dependencias

- 000-product-specification.md
- 001-domain-model.md
- 002-system-architecture.md
- 003-infrastructure.md
- 010-authentication-and-authorization.md
- 020-user-management.md
- 030-establishment-management.md
- 060-geocoding.md

---

# Objetivo

Permitir que el creador de un establecimiento o un administrador edite su ficha o la elimine, reutilizando el formulario y las validaciones de la creación.

---

# Alcance

Implementa únicamente:

- Página de edición con el formulario precargado.
- Actualización con las mismas validaciones de la creación.
- Eliminación con confirmación desde la ficha.
- Permisos de creador o administrador en todos los pasos.
- Eliminación de las fotografías almacenadas en Cloudinary antes de eliminar su registro en la aplicación.

---

# Decisiones de diseño (arquitectura MVP)

- La edición reutiliza el formulario de creación en modo edición, con los valores actuales como iniciales; no existe un formulario separado.
- La ubicación recalcula sus coordenadas únicamente cuando cambia (SPEC-060); las fotografías y valoraciones no se tocan al editar.
- Al eliminar, las fotografías almacenadas en Cloudinary se eliminan antes que su registro en la aplicación; las valoraciones y fotografías asociadas caen por las eliminaciones en cascada documentadas (ADR-002/ADR-003).

---

# Edición

En `/establishments/[id]/edit`:

- Solo el creador o un administrador ven el formulario; cualquier otro caso responde con `notFound()`, sin revelar si el establecimiento existe.
- Tras guardar, se revalidan la ficha y el listado, y se navega a la ficha actualizada.

---

# Eliminación

En la ficha, solo el creador o un administrador ven las acciones «Editar» y «Eliminar».

- «Eliminar» pide confirmación nativa («¿Eliminar este establecimiento? Esta acción no se puede deshacer.») y muestra los errores de forma accesible.
- Tras eliminar, se revalida el listado y se navega a `/establishments`.

---

# Seguridad

Solo el creador o un administrador, verificado en servidor contra el creador persistido y nunca con datos del cliente. Los errores de inexistencia y de permiso son controlados y no filtran información.

---

# No implementar

- edición o eliminación de valoraciones;
- edición o eliminación de fotografías;
- borrado lógico;
- historial de cambios.

---

# Tests

Crear únicamente:

- permisos (creador, administrador, ajeno);
- servicio (actualización, eliminación con limpieza, inexistente, prohibido);
- Server Actions (sin sesión, entrada inválida, éxito, geocodificación mockeada sin red).

Prisma mockeado (sin base de datos en tests). No crear E2E.

---

# Definition of Ready

La entrega estará lista para implementarse cuando esta especificación esté aprobada.

---

# Definition of Done

La entrega se considerará finalizada cuando:

- solo el creador o un administrador accedan a la edición;
- la edición valide igual que la creación y preserve fotografías y valoraciones;
- la eliminación pida confirmación y elimine las fotografías almacenadas en Cloudinary antes que su registro;
- los permisos se verifiquen en servidor en todos los pasos;
- `npm run build`, `npm run lint` y `npm test` pasen sin errores.
