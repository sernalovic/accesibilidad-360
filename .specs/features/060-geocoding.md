# Especificación

**ID:** SPEC-060

**Nombre:** Geocodificación y mapa del establecimiento (1.ª entrega)

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

Situar cada establecimiento en el mapa a partir de su dirección y mostrar su ubicación en la ficha mediante un mapa individual.

---

# Alcance

Implementa únicamente:

- Geocodificación de la dirección con Nominatim (OpenStreetMap).
- Campos `latitude` y `longitude` anulables en el modelo Establishment.
- Cálculo de coordenadas al crear; recálculo al editar solo si cambia la ubicación.
- Sección «Ubicación» en la ficha con mapa individual o aviso cuando no hay coordenadas.

---

# Decisiones de modelado (arquitectura MVP)

- `Establishment.latitude` y `Establishment.longitude` (`Float?`, anulables): sin coordenadas el establecimiento existe igualmente y la ficha lo indica.
- La dirección consultada se construye con los nombres oficiales de provincia y municipio verificados en base de datos (SPEC-035), nunca con texto libre del formulario.
- Sin tablas de caché ni colas: la geocodificación es una llamada directa durante la creación o edición.

---

# Geocodificación

Se utiliza el servicio Nominatim (OpenStreetMap) para convertir la dirección en coordenadas.

- La consulta se realiza durante la creación del establecimiento, con la dirección y los nombres oficiales de municipio y provincia.
- Al editar, la consulta solo se repite cuando cambian la dirección, el municipio o la provincia; en caso contrario se preservan las coordenadas existentes.
- Cualquier error deja las coordenadas a `null` sin impedir la creación ni la edición.
- El mapa solo se muestra cuando existen coordenadas válidas.

---

# Ficha del establecimiento

En `/establishments/[id]`, sección «Ubicación»:

- Con coordenadas: mapa individual (`EstablishmentMap`) centrado en el punto con zoom 16 y marcador circular con el nombre en popup.
- Sin coordenadas: tarjeta con el aviso «Ubicación no disponible» y el texto «Todavía no se ha podido situar este establecimiento en el mapa.».

Toda la información del mapa existe también en texto (dirección, municipio, provincia); el mapa es complementario.

---

# Mapa individual

- `EstablishmentMap`: Client Component (Leaflet exige DOM), marcador `CircleMarker` único y popup con el nombre.
- `EstablishmentMapLoader`: carga diferida con `ssr: false` y mensaje «Cargando mapa…».
- `MapFrame`: marco compartido con el mapa global (SPEC-090); teselas de OpenStreetMap con atribución obligatoria y `scrollWheelZoom` desactivado para no secuestrar el scroll.

---

# Seguridad

Solo usuarios autenticados crean y editan establecimientos (`userId` siempre de la sesión). La geocodificación se ejecuta siempre en el servidor; la clave de la consulta no expone ningún secreto.

---

# No implementar

- mapa global (SPEC-090);
- re-geocodificación manual;
- caché de coordenadas;
- edición de coordenadas a mano;
- rutas o distancias.

---

# Tests

Crear únicamente:

- servicio de geocodificación (construcción de la consulta, coordenadas de Nominatim, nulos ante fallo, sin red real mediante `fetch` mockeado);
- servicio (geocodificación con nombres oficiales, persistencia de coordenadas, `null` si falla);
- Server Action (geocodificación mockeada, sin red en tests).

Prisma mockeado (sin base de datos en tests). No crear E2E.

---

# Definition of Ready

La entrega estará lista para implementarse cuando esta especificación esté aprobada.

---

# Definition of Done

La entrega se considerará finalizada cuando:

- la migración `add_establishment_coordinates` se aplique sin errores;
- crear con dirección válida persista las coordenadas;
- crear con fallo de geocodificación persista `null` sin bloquear;
- editar preserve las coordenadas si la ubicación no cambia;
- la ficha muestre el mapa o el aviso según corresponda;
- `npm run build`, `npm run lint` y `npm test` pasen sin errores.
