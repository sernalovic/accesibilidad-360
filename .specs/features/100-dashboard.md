# Especificación

**ID:** SPEC-100

**Nombre:** Panel principal (1.ª entrega)

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
- 040-accessibility-reviews.md
- 050-photo-management.md

---

# Objetivo

Ofrecer un resumen de la actividad de la plataforma en la página `/dashboard`: totales, últimos establecimientos, mejor valorados y accesos rápidos.

---

# Alcance

Implementa únicamente:

- Saludo con el nombre del usuario autenticado.
- Cuatro estadísticas totales.
- Bloque protagonista con los 6 últimos establecimientos.
- Ranking con los 6 mejor valorados.
- Cuatro accesos rápidos.
- Estados vacíos.

---

# Decisiones de diseño (arquitectura MVP)

- La página no calcula ni transforma nada: recibe el DTO completamente preparado por el servicio.
- La tarjeta de estadística es un componente compartido (`components/stats`), reutilizado también por el perfil (SPEC-125).
- La arquitectura del módulo está preparada para futuras ampliaciones del panel sin alterar la organización actual.
- Sin gráficos todavía.

---

# Panel principal

En `/dashboard`, bajo el título «Panel principal» y el saludo «Bienvenido, {nombre}» (o el correo si no hay nombre):

- Estadísticas: Establecimientos, Usuarios, Valoraciones y Fotografías, cada una con su total.
- Últimos establecimientos: hasta 6, los más recientes, en tarjetas compactas con fotografía, nombre, categoría, municipio y provincia, estrellas, puntuación media y número de valoraciones. Sin establecimientos: «Aún no hay establecimientos.».
- Mejor valorados: hasta 6, ordenados por valoración media y, en caso de empate, por número de valoraciones y fecha. Los tres primeros se distinguen con medalla (🥇🥈🥉) y el primero queda discretamente destacado; el resto muestra su posición numérica. Cada entrada enlaza a su ficha con categoría, media y recuento. Sin valoraciones: «Aún no hay valoraciones.».
- Accesos rápidos: «Nuevo establecimiento» (`/establishments/new`), «Buscar establecimientos» (`/establishments`), «Mapa» (`/map`) y «Mi perfil» (`/profile`).

---

# Seguridad

Solo usuarios autenticados acceden al panel (grupo `(protected)`). El panel no expone ningún dato que las fichas no muestren ya.

---

# No implementar

- gráficos;
- bloque de últimas valoraciones en la página;
- filtros o paginación del panel;
- estadísticas avanzadas.

---

# Tests

Crear únicamente:

- servicio (estadísticas, últimos, ranking, últimas valoraciones, vacíos);
- tarjeta compacta de valoración (enlace, autor, estrellas con media exacta, comentario truncado, enlace a la ficha).

Prisma mockeado (sin base de datos en tests). No crear E2E.

---

# Definition of Ready

La entrega estará lista para implementarse cuando esta especificación esté aprobada.

---

# Definition of Done

La entrega se considerará finalizada cuando:

- el saludo muestre el nombre del usuario autenticado;
- las cuatro estadísticas reflejen los totales reales;
- los últimos muestren hasta 6 establecimientos recientes;
- el ranking ordene hasta 6 por valoración con medallas;
- los accesos rápidos enlacen a sus destinos;
- `npm run build`, `npm run lint` y `npm test` pasen sin errores.
