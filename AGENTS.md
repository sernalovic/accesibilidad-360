# AGENTS.md

## Contexto

Estás colaborando en el desarrollo de **Accesibilidad 360**, un Trabajo Fin de Máster en Programación con Inteligencia Artificial.

La aplicación NO incorpora inteligencia artificial como funcionalidad del producto.

La inteligencia artificial únicamente se utiliza como asistente durante el desarrollo.

Este proyecto debe mantener una calidad equivalente a la de un producto profesional.

---

# Fuente de verdad

Antes de realizar cualquier tarea debes consultar la documentación del proyecto.

El orden de prioridad es:

1. `.specs/*.md`
2. `.ai/project.md`
3. `.ai/architecture.md`
4. `.ai/coding-guidelines.md`
5. `.ai/definition-of-done.md`
6. `.ai/tech-stack.md`

Nunca hagas suposiciones si la documentación ya contiene la respuesta.

Si detectas contradicciones entre documentos, detente y solicita aclaraciones.

---

# Forma de trabajar

Nunca implementes directamente una funcionalidad.

El flujo obligatorio será:

1. Leer la especificación.
2. Analizar el impacto.
3. Identificar dependencias.
4. Proponer un plan.
5. Esperar confirmación cuando el cambio sea significativo.
6. Implementar.
7. Crear o actualizar los tests.
8. Verificar que todo compila.
9. Comprobar que no existen errores de lint.
10. Verificar que se cumplen los criterios de aceptación.

---

# Restricciones

Nunca:

* inventes requisitos.
* elimines funcionalidades existentes sin autorización.
* modifiques la arquitectura del proyecto sin justificarlo.
* ignores una especificación.
* utilices `any` salvo autorización expresa.
* dupliques código.
* añadas dependencias innecesarias.
* implementes soluciones temporales ("quick fixes") sin indicarlo.

---

# Filosofía

Prioriza siempre:

* simplicidad.
* legibilidad.
* mantenibilidad.
* tipado fuerte.
* reutilización.
* bajo acoplamiento.
* alta cohesión.

El código debe ser fácil de comprender por otro desarrollador.

---

# Antes de escribir código

Analiza:

* qué módulos afecta el cambio;
* qué componentes pueden reutilizarse;
* si existe una solución ya implementada;
* qué pruebas deben modificarse.

No escribas código hasta tener claro el diseño.

---

# Implementación

Cada implementación debe:

* respetar la arquitectura;
* mantener la coherencia del proyecto;
* minimizar el número de archivos modificados;
* evitar efectos secundarios.

Si una implementación requiere refactorizar código existente, indícalo antes de hacerlo.

---

# Testing

Toda funcionalidad nueva debe incluir las pruebas correspondientes.

Según el caso:

* Unitarias.
* Integración.
* Componentes.
* End-to-End.

No consideres una tarea finalizada si las pruebas no existen o no pasan correctamente.

---

# Calidad

Antes de finalizar cualquier tarea verifica:

* Compilación correcta.
* Sin errores de TypeScript.
* Sin errores de ESLint.
* Sin código muerto.
* Sin imports innecesarios.
* Sin duplicidades.
* Sin advertencias relevantes.

---

# Documentación

Cuando una tarea modifique el comportamiento del sistema:

* actualiza la documentación correspondiente;
* indica qué especificaciones se han visto afectadas;
* registra decisiones importantes si procede.

La documentación forma parte del proyecto.

---

# Comunicación

Cuando respondas:

1. Resume brevemente el trabajo realizado.
2. Enumera los archivos modificados.
3. Indica posibles riesgos.
4. Sugiere mejoras únicamente si aportan valor.
5. No repitas información innecesaria.

Sé claro y conciso.

---

# Objetivo final

El objetivo no es únicamente generar código.

El objetivo es desarrollar una aplicación mantenible, bien documentada, correctamente probada y alineada con las especificaciones del proyecto.

Cada decisión debe acercar el proyecto a ese objetivo.
