# Especificación

**ID:** SPEC-020

**Nombre:** Gestión de usuarios (roles y autorización)

**Versión:** 1.0

**Estado:** Aprobada

---

# Dependencias

- 000-product-specification.md
- 001-domain-model.md
- 002-system-architecture.md
- 003-infrastructure.md
- 010-authentication-and-authorization.md

---

# Objetivo

Definir los roles del sistema y las reglas de autorización que controlan el acceso a las rutas protegidas y a la gestión de contenidos según el rol del usuario autenticado.

La gestión del perfil del usuario autenticado (edición del nombre y cambio de contraseña) pertenece a la SPEC-125 y no forma parte de esta especificación.

---

# Alcance

Implementa únicamente:

- Roles USER, MODERATOR y ADMIN.
- Rol USER por defecto en el registro.
- Propagación del rol en la sesión JWT.
- Guard de autenticación para el grupo `(protected)`.
- Guard de administración para `/admin` y las acciones de categorías.
- Regla de gestión por propietario o administrador para establecimientos, valoraciones y fotografías.
- Etiqueta legible del rol en la interfaz.

---

# Roles

Existen los siguientes roles (`enum Role` en Prisma):

- USER
- MODERATOR
- ADMIN

Todos los nuevos usuarios reciben inicialmente el rol USER (`registerUser` lo fija de forma incondicional; el cliente nunca envía el rol).

El rol MODERATOR existe en el modelo y en las etiquetas de la interfaz, pero no dispone de permisos adicionales implementados: en todas las comprobaciones se comporta como USER.

---

# Permisos

## USER

Puede:

- gestionar su perfil (SPEC-125);
- crear establecimientos;
- editar y eliminar sus propios establecimientos;
- crear valoraciones;
- eliminar sus propias valoraciones;
- subir fotografías;
- eliminar sus propias fotografías.

## MODERATOR

Sin permisos adicionales implementados respecto a USER.

## ADMIN

Acceso completo al sistema. Además puede:

- gestionar establecimientos de cualquier usuario;
- eliminar valoraciones de cualquier usuario;
- eliminar fotografías de cualquier usuario;
- gestionar categorías (crear, renombrar, eliminar);
- acceder al panel de administración.

---

# Autorización

Las siguientes rutas requieren autenticación (grupo `app/(protected)`, verificado en servidor con `requireSession()`; sin sesión redirige a `/login`):

- panel principal
- establecimientos (listado, creación, ficha, edición)
- mapa
- perfil
- panel de administración

La interfaz puede ocultar opciones según el rol (por ejemplo, el enlace a `/admin` solo se muestra a administradores), pero la autorización es siempre responsabilidad del servidor.

---

# Guards

- `requireSession()`: punto único de protección del grupo `(protected)`. Las páginas heredan la protección y no deben reimplementarla.
- `isAdmin(actor)`: verdadero únicamente si `role === "ADMIN"`. Base de las comprobaciones de administración (`/admin`, acciones de categorías).
- `canManageOwnerOrAdmin(actor, ownerId)`: verdadero si el actor es el propietario del recurso o administrador. Misma regla para establecimientos, fotografías y valoraciones; cada servicio la aplica contra el propietario persistido en base de datos.
- `canManageEstablishment(actor, ownerId)`: delega en la regla anterior para establecimientos.

El `middleware.ts` no protege rutas; solo refresca la sesión.

---

# Etiqueta de rol

Los valores USER, MODERATOR y ADMIN son códigos internos. En la interfaz se muestran mediante `roleLabel()`:

- Usuario
- Moderador
- Administrador

---

# Nota sobre el rol MODERATOR

Aunque la SPEC-010 menciona el rol MODERATOR, la implementación actual no define permisos diferenciados para dicho rol. En la práctica, el sistema únicamente aplica reglas específicas para ADMIN; cualquier otro rol se comporta como un usuario estándar (USER). La posible evolución del rol MODERATOR queda fuera del alcance de esta versión.

---

# Seguridad

- El rol viaja en el token JWT y en la sesión (`auth.ts`, callbacks `jwt`/`session`); el cliente nunca lo proporciona.
- Toda operación sensible comprueba permisos en el servidor contra el propietario persistido, nunca contra datos enviados por el cliente.
- La edición y eliminación de establecimientos verifica creador o ADMIN antes de actuar.
- La eliminación de valoraciones y fotografías verifica propietario o ADMIN antes de actuar.
- Las acciones de categorías exigen ADMIN verificado en la Server Action.

---

# Casos límite

- Usuario sin sesión accediendo a una ruta protegida.
- Usuario no administrador accediendo a `/admin` o a acciones de categorías.
- Usuario no propietario intentando editar o eliminar contenido ajeno.
- Rol MODERATOR intentando acciones de administración.

---

# Criterios de aceptación

- El registro asigna siempre el rol USER.
- La sesión expone `id` y `role` del usuario autenticado.
- Las rutas protegidas no son accesibles sin autenticación.
- Solo los administradores acceden a `/admin` y gestionan categorías.
- Solo el creador o un administrador edita o elimina un establecimiento.
- Solo el propietario o un administrador elimina una valoración o fotografía.
- El rol se muestra con su etiqueta legible en la interfaz.

---

# Impacto técnico

Esta especificación podrá modificar únicamente:

- lib/permissions/
- lib/auth/ (propagación del rol en sesión)
- lib/utils/ (etiqueta de rol)
- features/establishments/services/establishment-permissions
- tests/

No podrá modificar funcionalidades pertenecientes a otros módulos.

---

# Tests obligatorios

## Unitarios

- `isAdmin` (ADMIN verdadero; USER y MODERATOR falso).
- `canManageOwnerOrAdmin` (propietario, administrador, ajeno).
- `canManageEstablishment` (creador, administrador, ajeno).
- Etiqueta de rol.

## Integración

- Guard de administración en `/admin`.
- Acciones de categorías solo para ADMIN.
- Edición y eliminación solo por creador o ADMIN.
- Eliminación de valoraciones y fotografías solo por propietario o ADMIN.

---

# No implementar

- administración de usuarios (listado, cambio de rol, bloqueo);
- edición del perfil (SPEC-125);
- cambio de contraseña (SPEC-125);
- OAuth;
- verificación de correo electrónico;
- auditoría de accesos.

---

# Definition of Ready

Se considera lista para implementarse cuando:

- el modelo de dominio esté aprobado;
- Auth.js esté disponible;
- Prisma esté configurado.

---

# Definition of Done

La especificación se considerará finalizada cuando:

- todos los tests pasen correctamente;
- los guards funcionen según los criterios de aceptación;
- el código cumpla las normas definidas en `.ai`;
- no exista deuda técnica conocida.
