# Especificación

**ID:** SPEC-010

**Nombre:** Autenticación y autorización

**Versión:** 1.0

**Estado:** Aprobada

---

# Dependencias

- 000-product-specification.md
- 001-domain-model.md
- 002-system-architecture.md
- 003-infrastructure.md

---

# Objetivo

Implementar el sistema completo de autenticación y autorización de Accesibilidad 360.

El sistema deberá permitir identificar a los usuarios, proteger el acceso a determinadas funcionalidades y gestionar los permisos según el rol asignado.

No se implementarán todavía funcionalidades propias del negocio.

---

# Historias de usuario

## HU-010-001

Como visitante quiero crear una cuenta para poder colaborar en la plataforma.

---

## HU-010-002

Como usuario registrado quiero iniciar sesión mediante mi correo electrónico y contraseña.

---

## HU-010-003

Como usuario autenticado quiero cerrar mi sesión.

---

## HU-010-004

Como usuario quiero recuperar mi contraseña en caso de olvidarla.

---

## HU-010-005

Como administrador quiero que cada usuario tenga un rol para controlar los permisos del sistema.

---

# Requisitos funcionales

## Registro

El sistema permitirá crear una cuenta utilizando:

- nombre
- correo electrónico
- contraseña
- confirmación de contraseña

El correo deberá ser único.

La contraseña nunca se almacenará en texto plano.

---

## Inicio de sesión

El usuario podrá autenticarse mediante:

- correo electrónico
- contraseña

Si las credenciales son incorrectas se mostrará un mensaje genérico.

No deberá indicarse qué dato es incorrecto.

---

## Cierre de sesión

El usuario podrá cerrar su sesión desde cualquier página autenticada.

---

## Recuperación de contraseña

El usuario podrá solicitar la recuperación indicando su correo electrónico.

Durante el MVP el envío de correo podrá simularse.

La arquitectura deberá permitir incorporar posteriormente un proveedor SMTP.

---

## Roles

Existirán los siguientes roles:

- USER
- MODERATOR
- ADMIN

Todos los nuevos usuarios tendrán inicialmente el rol USER.

---

## Sesión

El sistema deberá mantener la sesión entre peticiones.

Las rutas protegidas deberán comprobar siempre la autenticación.

---

# Requisitos no funcionales

- Contraseñas cifradas mediante algoritmos seguros.
- Validación completa mediante Zod.
- Formularios implementados con React Hook Form.
- Accesibilidad WCAG AA.
- Compatible con dispositivos móviles.
- Sin información sensible en mensajes de error.

---

# Flujo funcional

## Registro

Visitante

↓

Formulario

↓

Validación

↓

Creación del usuario

↓

Inicio automático de sesión

↓

Redirección al panel principal

---

## Inicio de sesión

Usuario

↓

Formulario

↓

Validación

↓

Autenticación

↓

Creación de sesión

↓

Redirección

---

## Recuperación

Usuario

↓

Solicitud

↓

Generación de token

↓

Simulación de envío

↓

Formulario de nueva contraseña

↓

Actualización

---

# Autorización

Las siguientes rutas requerirán autenticación:

- perfil
- creación de establecimientos
- edición de establecimientos propios
- creación de valoraciones
- subida de fotografías
- panel de administración

---

## Permisos

### USER

Puede:

- gestionar su perfil;
- crear establecimientos;
- crear valoraciones;
- subir fotografías.

---

### MODERATOR

Además puede:

- moderar fotografías;
- ocultar contenido;
- revisar establecimientos.

---

### ADMIN

Acceso completo al sistema.

---

# Casos límite

- Registro con correo existente.
- Contraseña demasiado corta.
- Contraseñas diferentes.
- Usuario inexistente.
- Contraseña incorrecta.
- Sesión expirada.
- Usuario deshabilitado (preparado para futuras versiones).
- Token de recuperación inválido.
- Token expirado.

---

# Criterios de aceptación

- El registro funciona correctamente.
- El inicio de sesión funciona correctamente.
- El cierre de sesión funciona correctamente.
- Los usuarios autenticados mantienen su sesión.
- Las rutas protegidas no son accesibles sin autenticación.
- Los permisos dependen del rol.
- Las validaciones funcionan tanto en cliente como en servidor.

---

# Impacto técnico

Esta especificación podrá modificar únicamente:

- app/
- features/auth/
- lib/auth/
- lib/permissions/
- prisma/
- middleware.ts
- types/
- tests/

No podrá modificar funcionalidades pertenecientes a otros módulos.

---

# Archivos que podrán crearse

- features/auth/components/*
- features/auth/actions/*
- features/auth/services/*
- features/auth/schemas/*
- features/auth/types/*
- features/auth/tests/*
- lib/auth/*
- lib/permissions/*
- middleware.ts

---

# Archivos que NO podrán modificarse

- features/establishments/*
- features/reviews/*
- features/photos/*
- features/map/*
- features/search/*
- features/admin/*
- cualquier especificación de negocio posterior

---

# Tests obligatorios

## Unitarios

- Validación de formularios.
- Validación de contraseñas.
- Gestión de permisos.
- Utilidades de autenticación.

---

## Integración

- Registro.
- Login.
- Logout.
- Recuperación de contraseña.

---

## End-to-End

- Registro completo.
- Inicio de sesión.
- Cierre de sesión.
- Acceso denegado a rutas protegidas.
- Acceso permitido según rol.

---

# Definition of Ready

Se considera lista para implementarse cuando:

- la infraestructura esté completamente validada;
- Prisma esté configurado;
- Auth.js esté disponible;
- el modelo de dominio esté aprobado.

---

# Definition of Done

La especificación se considerará finalizada cuando:

- todos los tests pasen correctamente;
- existan pruebas E2E del flujo completo;
- las rutas protegidas funcionen;
- el sistema de roles esté operativo;
- el código cumpla las normas definidas en `.ai`;
- no exista deuda técnica conocida.

---

# Restricciones

No implementar todavía:

- gestión avanzada del perfil;
- edición de datos personales;
- administración de usuarios;
- OAuth (Google, GitHub, Microsoft, etc.);
- autenticación multifactor (MFA);
- verificación de correo electrónico;
- bloqueo de cuentas;
- auditoría de accesos.

Estas funcionalidades podrán incorporarse en futuras especificaciones sin modificar la arquitectura definida.