# Especificación

**ID:** SPEC-090

**Nombre:** Mapa global de establecimientos (1.ª entrega)

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

Mostrar todos los establecimientos geolocalizados en un único mapa colaborativo, con acceso a sus fichas desde cada marcador.

---

# Alcance

Implementa únicamente:

- Página `/map` con el mapa global.
- Marcadores por establecimiento con popup enriquecido.
- Resumen textual del número de establecimientos.
- Estado vacío cuando no hay ubicaciones.

---

# Decisiones de diseño (arquitectura MVP)

- Una única lectura con la primera fotografía y las puntuaciones para la media; solo establecimientos con coordenadas.
- El mapa es complementario al resumen textual: la página informa sin depender únicamente del mapa.
- El mapa se carga de forma diferida para garantizar su correcto funcionamiento en el entorno de ejecución de la aplicación, con mensaje de carga.

---

# Mapa global

En `/map`:

- Solo aparecen establecimientos con coordenadas; sin ninguno se muestra «Todavía no hay establecimientos con ubicación en el mapa.».
- Encima del mapa se indica el número: «1 establecimiento en el mapa.» o «N establecimientos en el mapa.».
- La vista se ajusta automáticamente para encuadrar todos los puntos.
- Cada establecimiento tiene un marcador circular coherente con el de la ficha, sin assets adicionales.

El popup de cada marcador muestra el nombre enlazado, la categoría y el municipio, la puntuación media con su recuento, la fotografía principal cuando existe y el enlace «Ver ficha», navegable por teclado.

Se reutiliza el marco compartido con el mapa de la ficha (SPEC-060): teselas de OpenStreetMap con atribución obligatoria y sin secuestrar el scroll.

---

# Seguridad

Solo usuarios autenticados acceden al mapa (grupo `(protected)`). El mapa no expone ningún dato que la ficha no muestre ya.

---

# No implementar

- filtros sobre el mapa;
- rutas o distancias;
- geolocalización del usuario;
- capas o leyendas.

---

# Tests

Crear únicamente:

- servicio (filtrado sin coordenadas, primera fotografía, media y recuento, lista vacía).

Prisma mockeado (sin base de datos en tests). No crear E2E.

---

# Definition of Ready

La entrega estará lista para implementarse cuando esta especificación esté aprobada.

---

# Definition of Done

La entrega se considerará finalizada cuando:

- solo los establecimientos con coordenadas aparezcan en el mapa;
- el resumen textual indique el número exacto;
- cada popup enlace a su ficha con fotografía y puntuación;
- la vista encuadre todos los puntos;
- sin ubicaciones se muestre el estado vacío;
- `npm run build`, `npm run lint` y `npm test` pasen sin errores.
