# Principios de Ingeniería

**Versión:** 1.0

**Estado:** Aprobado

---

# Objetivo

Este documento define los principios de ingeniería que deben guiar todas las decisiones técnicas del proyecto.

No describe una implementación concreta.

Describe la forma correcta de diseñar, desarrollar y evolucionar el software.

Cuando existan varias soluciones técnicamente válidas, estos principios determinarán cuál debe elegirse.

---

# Filosofía

El objetivo no es escribir código.

El objetivo es construir un software mantenible durante años.

Toda decisión debe favorecer:

- simplicidad;
- claridad;
- mantenibilidad;
- escalabilidad;
- testabilidad.

La velocidad de desarrollo nunca tendrá prioridad sobre la calidad del diseño.

---

# Principio 1
## La especificación es la fuente de verdad

Nunca implementar una funcionalidad sin una especificación aprobada.

Si una especificación es ambigua:

Detener el desarrollo.

Solicitar aclaraciones.

Nunca asumir requisitos.

---

# Principio 2
## El dominio manda

Las decisiones técnicas nunca modificarán el dominio.

El dominio representa el negocio.

La tecnología únicamente lo implementa.

Si una limitación técnica obliga a cambiar el dominio, deberá justificarse y actualizar previamente la especificación correspondiente.

---

# Principio 3
## Preferir simplicidad

Entre dos soluciones correctas siempre elegir:

- menos código;
- menos dependencias;
- menos complejidad;
- mayor legibilidad.

La solución más sofisticada rara vez será la correcta.

---

# Principio 4
## Responsabilidad única

Cada elemento del sistema debe tener una responsabilidad clara.

Aplica a:

- componentes;
- funciones;
- hooks;
- servicios;
- acciones;
- módulos.

Si una unidad comienza a realizar varias tareas, deberá dividirse.

---

# Principio 5
## Reutilizar antes que crear

Antes de escribir código nuevo comprobar:

- ¿Ya existe?
- ¿Puede reutilizarse?
- ¿Puede ampliarse?

No duplicar soluciones.

---

# Principio 6
## El código debe ser fácil de borrar

Todo módulo debe poder eliminarse sin afectar innecesariamente al resto del sistema.

Evitar dependencias ocultas.

Reducir el acoplamiento.

---

# Principio 7
## Server First

Siempre que sea posible:

- ejecutar en servidor;
- renderizar en servidor;
- validar en servidor;
- consultar datos desde el servidor.

El cliente solo realizará aquello que realmente requiera interacción.

---

# Principio 8
## Validar siempre

Toda entrada del usuario es potencialmente incorrecta.

Validar:

- formato;
- longitud;
- tipo;
- reglas de negocio;
- permisos.

Nunca confiar en el navegador.

---

# Principio 9
## Errores previsibles

Los errores forman parte del sistema.

Toda operación debe contemplar:

- éxito;
- error;
- ausencia de datos;
- permisos insuficientes;
- fallos externos.

Nunca asumir el caso ideal.

---

# Principio 10
## Componentes pequeños

Cada componente debe resolver un único problema.

Cuando un componente:

- mezcla responsabilidades;
- supera aproximadamente 200 líneas;
- resulta difícil de leer;

deberá dividirse.

---

# Principio 11
## Servicios para la lógica

La lógica de negocio no pertenece a React.

React muestra información.

Los servicios implementan reglas del negocio.

---

# Principio 12
## Las pruebas forman parte del desarrollo

Una funcionalidad no termina cuando funciona.

Termina cuando puede demostrarse que funciona.

Toda funcionalidad relevante deberá poder verificarse mediante pruebas automatizadas.

---

# Principio 13
## Optimizar solo cuando sea necesario

No añadir:

- memoización;
- cachés;
- índices especiales;
- optimizaciones;

sin una necesidad demostrada.

La complejidad también tiene coste.

---

# Principio 14
## Cada dependencia es deuda

Antes de instalar una librería responder:

¿Existe una solución nativa?

¿React ya lo resuelve?

¿Next.js ya lo incorpora?

¿Podemos implementarlo fácilmente?

Solo instalar cuando exista una ventaja clara.

---

# Principio 15
## La accesibilidad no es opcional

Toda interfaz debe ser utilizable mediante:

- teclado;
- lector de pantalla;
- alto contraste;
- dispositivos móviles.

La accesibilidad forma parte de la definición de calidad.

---

# Principio 16
## Refactorizar con intención

No modificar código únicamente por preferencias personales.

Refactorizar cuando:

- reduzca complejidad;
- elimine duplicidad;
- facilite pruebas;
- mejore mantenibilidad.

---

# Principio 17
## Commits pequeños

Cada commit debe representar una única idea.

Evitar commits masivos.

Un commit debe poder revertirse sin romper el proyecto.

---

# Principio 18
## Documentar decisiones

Toda decisión importante deberá quedar registrada.

La documentación es parte del producto.

No es un trabajo posterior.

---

# Principio 19
## Pensar antes de programar

Antes de implementar responder:

¿Qué problema resuelve?

¿Qué módulos afecta?

¿Qué riesgos introduce?

¿Cómo se probará?

Si no puede responderse, aún no debe escribirse código.

---

# Principio 20
## Calidad antes que velocidad

Nunca sacrificar:

- arquitectura;
- pruebas;
- accesibilidad;
- documentación;

para terminar una funcionalidad antes.

El software permanecerá más tiempo en mantenimiento que en desarrollo.

---

# Regla de oro

Antes de tomar cualquier decisión técnica pregúntate:

> ¿Seguiría eligiendo esta solución si tuviera que mantener este proyecto durante los próximos cinco años?

Si la respuesta es no, busca una alternativa mejor.