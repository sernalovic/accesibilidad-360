# Guía de desarrollo

## Objetivo

Este documento establece las normas de desarrollo para todo el proyecto.

Su finalidad es garantizar un código consistente, mantenible, testeable y fácil de evolucionar.

Estas normas se aplican a cualquier código generado por IA o escrito manualmente.

---

# Principios generales

Todo el código deberá ser:

* Legible.
* Simple.
* Modular.
* Reutilizable.
* Tipado.
* Testeable.
* Fácil de mantener.

Siempre se priorizará la claridad frente a la complejidad.

---

# Principio KISS

La solución más simple que resuelva correctamente el problema será siempre la preferida.

No introducir abstracciones innecesarias.

No optimizar antes de tiempo.

---

# Principio DRY

No duplicar lógica.

Si una funcionalidad comienza a repetirse, extraerla a una utilidad, servicio o componente reutilizable.

No extraer código prematuramente si todavía no existe una repetición real.

---

# Principio YAGNI

No implementar funcionalidades futuras.

No crear configuraciones "por si acaso".

No añadir opciones que la especificación no requiera.

---

# SOLID

Aplicar los principios SOLID cuando aporten valor.

No introducir patrones complejos únicamente para cumplir un principio teórico.

---

# TypeScript

Modo estricto obligatorio.

Nunca utilizar:

```ts
any
```

Utilizar:

* interfaces para contratos públicos;
* type para composiciones y uniones;
* enums únicamente cuando estén justificados;
* tipos inferidos cuando mejoren la legibilidad.

---

# Componentes React

Cada componente debe tener una única responsabilidad.

Evitar componentes excesivamente grandes.

Como referencia:

* recomendable: menos de 150 líneas;
* máximo: 250 líneas.

Si supera ese tamaño, evaluar su división.

---

# Props

Las props deben ser mínimas.

No pasar objetos completos cuando solo se necesitan dos o tres propiedades.

Evitar el "prop drilling" innecesario.

---

# Hooks

Crear un hook únicamente cuando exista lógica reutilizable.

No convertir cada componente en un hook.

Los hooks no deben contener lógica de presentación.

---

# Server Components

Utilizar Server Components siempre que sea posible.

Solo utilizar Client Components cuando sea imprescindible.

Antes de añadir:

```tsx
"use client";
```

preguntarse si realmente es necesario.

---

# Server Actions

Utilizar Server Actions para:

* crear;
* editar;
* eliminar;
* operaciones iniciadas desde formularios.

No crear APIs internas si una Server Action resuelve el problema.

---

# Route Handlers

Reservar Route Handlers para:

* APIs públicas;
* webhooks;
* integraciones;
* consumo externo.

---

# Prisma

Toda operación con la base de datos deberá realizarse mediante Prisma.

No utilizar SQL directo salvo necesidad justificada.

Agrupar las consultas relacionadas.

Evitar consultas repetidas.

---

# Validación

Toda entrada deberá validarse mediante Zod.

Nunca confiar en datos enviados por el cliente.

Las validaciones del cliente mejoran la experiencia.

Las validaciones del servidor garantizan la seguridad.

Ambas son necesarias cuando corresponda.

---

# Gestión de errores

No capturar excepciones sin tratarlas.

Los errores deben proporcionar información útil para el desarrollador.

El usuario nunca debe recibir mensajes técnicos.

---

# Funciones

Las funciones deberán:

* realizar una única tarea;
* tener nombres descriptivos;
* evitar múltiples niveles de anidación.

Como referencia:

* recomendable: menos de 30 líneas;
* máximo: 50 líneas.

---

# Servicios

Crear un servicio cuando exista lógica de negocio reutilizable.

No colocar lógica de negocio dentro de componentes React.

---

# Utilidades

Las funciones puras deberán ubicarse en utilidades.

No mezclar utilidades con acceso a base de datos.

---

# Nombres

Utilizar nombres descriptivos.

Evitar abreviaturas innecesarias.

Ejemplos correctos:

```text
createReview

calculateAccessibilityScore

findNearbyEstablishments
```

Evitar nombres genéricos:

```text
data

value

temp

obj

helper

utils2
```

---

# Comentarios

El código debe ser autoexplicativo.

Comentar únicamente:

* decisiones complejas;
* algoritmos poco evidentes;
* soluciones temporales justificadas.

No comentar lo que el código ya expresa claramente.

---

# Dependencias

Antes de instalar una nueva librería comprobar:

1. ¿Existe ya una solución en Next.js?
2. ¿React resuelve este problema?
3. ¿Ya existe una utilidad interna?
4. ¿La dependencia aporta un beneficio claro?

---

# Testing

Toda funcionalidad deberá incluir pruebas cuando proceda.

Prioridad:

1. lógica de negocio;
2. validaciones;
3. componentes;
4. flujos completos.

Los tests deben ser claros y fáciles de mantener.

No escribir tests acoplados a la implementación interna.

---

# Accesibilidad

Todos los componentes deberán cumplir buenas prácticas WCAG.

Siempre que sea posible:

* etiquetas semánticas;
* navegación mediante teclado;
* foco visible;
* etiquetas ARIA cuando sean necesarias;
* contraste adecuado.

La accesibilidad no es opcional.

---

# Rendimiento

Optimizar únicamente cuando exista una necesidad demostrable.

No utilizar memoización por defecto.

No utilizar `useMemo` o `useCallback` sin una justificación clara.

---

# Refactorización

Refactorizar únicamente cuando:

* mejore la legibilidad;
* reduzca complejidad;
* elimine duplicidades;
* facilite el testing.

No refactorizar únicamente por preferencias personales.

---

# Antes de finalizar una tarea

Verificar siempre:

* Compila correctamente.
* Sin errores de TypeScript.
* Sin errores de ESLint.
* Sin código muerto.
* Sin imports innecesarios.
* Sin duplicidades.
* Pruebas superadas.
* Documentación actualizada.

---

# Regla de oro

Cada vez que exista una decisión técnica, elige la opción que:

1. sea más sencilla;
2. genere menos código;
3. resulte más mantenible;
4. esté alineada con la arquitectura del proyecto;
5. facilite el trabajo del siguiente desarrollador.
