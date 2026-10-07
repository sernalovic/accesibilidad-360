# Flujo de trabajo de desarrollo

## Objetivo

Este documento define el proceso obligatorio que debe seguir la IA antes, durante y después de implementar cualquier cambio en el proyecto.

El objetivo es garantizar que todas las modificaciones sean coherentes con la arquitectura, las especificaciones y los criterios de calidad definidos.

La IA nunca debe actuar como un simple generador de código. Debe comportarse como un desarrollador senior que analiza el problema antes de proponer una solución.

---

# Regla principal

No implementes ninguna funcionalidad sin una especificación aprobada.

Si no existe una especificación correspondiente en `.specs/`, detente y solicita su creación antes de continuar.

---

# Flujo de trabajo

Toda tarea seguirá obligatoriamente las siguientes fases.

## Fase 1. Comprensión

Antes de escribir código:

* Lee la especificación correspondiente.
* Identifica el objetivo de la funcionalidad.
* Comprueba los criterios de aceptación.
* Revisa las restricciones técnicas.
* Analiza el impacto sobre módulos existentes.

No implementes nada mientras existan dudas sobre los requisitos.

---

## Fase 2. Análisis

Antes de modificar archivos:

* Localiza el código relacionado.
* Busca componentes reutilizables.
* Identifica posibles duplicidades.
* Evalúa si existe una solución ya implementada.

Siempre reutiliza antes de crear.

---

## Fase 3. Planificación

Antes de generar código presenta un pequeño plan indicando:

* Objetivo.
* Archivos que crearás.
* Archivos que modificarás.
* Riesgos.
* Dependencias.
* Estrategia de pruebas.

No continúes si el cambio afecta significativamente a la arquitectura sin indicarlo previamente.

---

## Fase 4. Implementación

Durante la implementación:

* Modifica únicamente los archivos necesarios.
* Mantén los cambios pequeños y coherentes.
* Evita introducir refactorizaciones no relacionadas.
* Respeta las convenciones del proyecto.
* No añadas dependencias sin justificación.

---

## Fase 5. Testing

Toda implementación deberá incluir las pruebas necesarias.

Cuando corresponda:

* Tests unitarios.
* Tests de componentes.
* Tests de integración.
* Tests End-to-End.

Si una funcionalidad no puede probarse fácilmente, revisa el diseño antes de continuar.

---

## Fase 6. Validación

Antes de finalizar una tarea verifica:

* Compilación correcta.
* Sin errores de TypeScript.
* Sin errores de ESLint.
* Sin imports innecesarios.
* Sin código muerto.
* Sin duplicidades.
* Sin advertencias relevantes.

---

## Fase 7. Documentación

Actualiza la documentación cuando el cambio:

* añada funcionalidades;
* modifique el comportamiento existente;
* introduzca decisiones técnicas relevantes;
* cambie la arquitectura;
* afecte a la configuración del proyecto.

---

# Gestión de cambios

Prioriza cambios pequeños.

Es preferible realizar cinco tareas pequeñas que una única modificación masiva.

Cada cambio debe ser fácilmente revisable.

---

# Refactorización

No refactorices código únicamente por preferencias personales.

Solo realiza refactorizaciones cuando:

* reduzcan complejidad;
* eliminen duplicidades;
* mejoren la mantenibilidad;
* faciliten las pruebas;
* estén justificadas por la especificación.

---

# Gestión de dependencias

Antes de instalar una librería:

1. Comprueba si Next.js ofrece esa funcionalidad.
2. Comprueba si React ya resuelve el problema.
3. Comprueba si existe una utilidad interna reutilizable.
4. Justifica la incorporación de la nueva dependencia.

---

# Manejo de errores

Todos los errores deberán:

* ser tratados;
* proporcionar información útil para el desarrollador;
* evitar exponer detalles técnicos al usuario final.

---

# Seguridad

Toda entrada del usuario deberá considerarse no confiable.

Validar siempre en servidor.

No confiar en restricciones del cliente.

---

# Comunicación

Cuando finalices una tarea responde utilizando la siguiente estructura:

## Resumen

Qué se ha implementado.

## Archivos modificados

Lista de archivos creados, modificados o eliminados.

## Pruebas realizadas

Indica las pruebas añadidas y las ejecutadas.

## Riesgos

Posibles aspectos que deban revisarse.

## Próximo paso recomendado

Qué especificación debería implementarse a continuación.

---

# Criterio de finalización

Una tarea solo puede considerarse terminada cuando:

* cumple la especificación;
* cumple los criterios de aceptación;
* todas las pruebas pasan correctamente;
* no existen errores de compilación;
* la documentación está actualizada;
* se cumplen los criterios definidos en `.ai/definition-of-done.md`.

---

# Filosofía

La calidad del proyecto es más importante que la velocidad de desarrollo.

Cuando existan varias soluciones posibles, elige siempre la más sencilla, mantenible y coherente con la arquitectura definida.
