# Especificación del producto

**Proyecto:** Accesibilidad 360

**Versión:** 1.0

**Estado:** Aprobada

---

# 1. Propósito

Accesibilidad 360 es una plataforma web colaborativa que permite consultar y compartir información sobre la accesibilidad de establecimientos públicos y privados.

Su objetivo es facilitar la toma de decisiones de personas con discapacidad o movilidad reducida mediante información aportada por la comunidad.

La plataforma no pretende sustituir certificaciones oficiales de accesibilidad, sino complementar la información disponible mediante experiencias y evaluaciones reales de los usuarios.

---

# 2. Problema

Actualmente es difícil conocer con antelación si un establecimiento es realmente accesible.

Aunque algunos servicios muestran información básica, normalmente:

* está incompleta;
* no está actualizada;
* no incluye fotografías;
* no permite valorar distintos aspectos de la accesibilidad;
* depende únicamente de información proporcionada por el propietario.

Esto obliga a muchas personas a desplazarse sin saber si podrán acceder al establecimiento.

---

# 3. Objetivos del producto

El producto debe permitir:

* localizar establecimientos;
* consultar su nivel de accesibilidad;
* registrar nuevos establecimientos;
* compartir evaluaciones objetivas;
* subir fotografías;
* consultar un mapa interactivo;
* buscar establecimientos mediante filtros.

---

# 4. Público objetivo

Usuarios principales:

* Personas usuarias de silla de ruedas.
* Personas con movilidad reducida.
* Personas con discapacidad física.
* Personas mayores.
* Familiares y acompañantes.

Usuarios secundarios:

* Asociaciones.
* Ayuntamientos.
* Comercios.
* Técnicos de accesibilidad.

---

# 5. Actores del sistema

## Visitante

Puede:

* navegar por la plataforma;
* consultar establecimientos;
* utilizar el buscador;
* visualizar el mapa.

No puede modificar información.

---

## Usuario registrado

Además puede:

* crear establecimientos;
* valorar establecimientos;
* subir fotografías;
* editar sus propios contenidos;
* gestionar su perfil.

---

## Moderador

Además puede:

* aprobar establecimientos;
* ocultar contenido inapropiado;
* moderar fotografías;
* revisar valoraciones.

---

## Administrador

Control total del sistema.

Puede gestionar:

* usuarios;
* roles;
* categorías;
* contenido;
* configuración.

---

# 6. Entidades principales

El sistema estará compuesto inicialmente por las siguientes entidades:

* Usuario
* Establecimiento
* Valoración
* Fotografía
* Categoría
* Municipio
* Provincia

Estas entidades podrán ampliarse en futuras versiones.

---

# 7. Flujo principal

El flujo principal del producto será:

1. Un visitante accede a la plataforma.
2. Busca un establecimiento.
3. Consulta su información.
4. Consulta fotografías.
5. Consulta valoraciones.
6. Si desea colaborar, crea una cuenta.
7. Añade un nuevo establecimiento o realiza una valoración.

Este flujo constituye el caso de uso principal del MVP.

---

# 8. Funcionalidades del MVP

## Gestión de usuarios

* Registro.
* Inicio de sesión.
* Recuperación de contraseña.
* Gestión del perfil.

---

## Gestión de establecimientos

* Crear.
* Editar.
* Consultar.
* Buscar.
* Filtrar.

---

## Valoraciones

Los usuarios podrán valorar diferentes aspectos de accesibilidad.

Cada valoración estará asociada a un establecimiento.

---

## Fotografías

Cada establecimiento podrá contener varias fotografías.

Las imágenes servirán para complementar la información de accesibilidad.

---

## Mapa

Visualización de establecimientos mediante un mapa interactivo.

---

## Administración

Panel básico para moderación y gestión del contenido.

---

# 9. Funcionalidades fuera del MVP

No forman parte del alcance inicial:

* aplicación móvil;
* notificaciones push;
* chat;
* mensajería;
* gamificación;
* API pública;
* multidioma;
* integración con redes sociales.

La arquitectura deberá permitir incorporarlas posteriormente.

---

# 10. Requisitos no funcionales

El producto deberá ser:

* responsive;
* accesible;
* mantenible;
* seguro;
* fácilmente desplegable;
* fácilmente testeable.

---

# 11. Accesibilidad

La propia aplicación deberá cumplir buenas prácticas WCAG.

El objetivo es que cualquier persona pueda utilizarla independientemente de sus capacidades.

La accesibilidad no constituye una funcionalidad adicional, sino un requisito transversal del proyecto.

---

# 12. Arquitectura funcional

El producto estará dividido en los siguientes dominios:

* Autenticación
* Usuarios
* Establecimientos
* Valoraciones
* Fotografías
* Búsqueda
* Mapa
* Administración

Cada dominio evolucionará de forma independiente.

---

# 13. Restricciones

El producto:

* no utilizará inteligencia artificial;
* no dependerá de servicios de pago;
* deberá desplegarse automáticamente desde GitHub;
* deberá ejecutarse correctamente en Vercel;
* deberá poder reproducirse fácilmente por cualquier evaluador.

---

# 14. Criterios de éxito

El proyecto se considerará satisfactorio cuando:

* el MVP esté completamente operativo;
* todas las funcionalidades críticas dispongan de pruebas automatizadas;
* el despliegue sea automático mediante GitHub y Vercel;
* la documentación permita a cualquier desarrollador comprender el proyecto;
* el código sea mantenible y coherente con la arquitectura definida.

---

# 15. Evolución prevista

El diseño del sistema deberá facilitar futuras ampliaciones, entre ellas:

* aplicación móvil;
* API pública;
* colaboración con administraciones;
* validación comunitaria de establecimientos;
* nuevas categorías de accesibilidad;
* internacionalización.

Estas funcionalidades no deberán condicionar el desarrollo del MVP.
