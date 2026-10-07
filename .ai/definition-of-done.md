# Definition of Done (DoD)

## Objetivo

Este documento define los criterios obligatorios para considerar una tarea, historia de usuario o funcionalidad como finalizada.

Una implementación no estará terminada únicamente porque compile o funcione.

Deberá cumplir todos los requisitos funcionales, técnicos y de calidad definidos en este documento.

---

# Regla principal

Una tarea solo podrá darse por completada cuando TODOS los puntos de este documento se cumplan.

Si alguno de ellos no puede cumplirse, deberá justificarse expresamente.

---

# 1. Especificación

Antes de comenzar el desarrollo debe existir una especificación aprobada en la carpeta `.specs`.

La implementación debe cumplir completamente dicha especificación.

No deben añadirse funcionalidades no contempladas.

---

# 2. Código

El código debe:

* compilar correctamente;
* respetar la arquitectura del proyecto;
* seguir las normas de `.ai/coding-guidelines.md`;
* no introducir deuda técnica innecesaria;
* ser legible y mantenible.

---

# 3. TypeScript

No deben existir:

* errores de compilación;
* usos injustificados de `any`;
* tipos incompletos;
* conversiones inseguras.

El tipado debe ser estricto.

---

# 4. Lint

El proyecto debe superar ESLint sin errores.

Los avisos deberán revisarse y resolverse siempre que sea posible.

---

# 5. Testing

Cada funcionalidad deberá incluir las pruebas que correspondan.

Cuando proceda:

* tests unitarios;
* tests de componentes;
* tests de integración;
* tests End-to-End.

Todas las pruebas deberán ejecutarse correctamente.

---

# 6. Cobertura

La cobertura mínima recomendada será:

* Lógica de negocio: 90%
* Validaciones: 90%
* Componentes: 80%
* Utilidades: 90%

No es obligatorio alcanzar un porcentaje global concreto, pero sí garantizar una cobertura adecuada de las partes críticas.

---

# 7. Accesibilidad

Toda nueva interfaz deberá verificarse respecto a:

* navegación mediante teclado;
* etiquetas accesibles;
* formularios correctamente asociados;
* contraste suficiente;
* foco visible.

Cuando sea posible, incluir pruebas automáticas de accesibilidad.

---

# 8. Seguridad

Verificar que:

* todas las entradas se validan;
* no se confía en datos del cliente;
* se respetan permisos y roles;
* no se exponen datos sensibles.

---

# 9. Rendimiento

Comprobar que la funcionalidad no introduce:

* consultas innecesarias;
* renderizados evitables;
* dependencias excesivas;
* cálculos repetitivos.

No optimizar prematuramente.

---

# 10. Documentación

Actualizar la documentación cuando el cambio:

* añada una funcionalidad;
* modifique el comportamiento;
* altere la arquitectura;
* incorpore nuevas dependencias;
* afecte a la configuración.

---

# 11. Especificaciones

Si durante el desarrollo se detecta una mejora o cambio de alcance:

* no implementarla directamente;
* actualizar primero la especificación correspondiente;
* solicitar validación antes de continuar.

---

# 12. Revisión técnica

Antes de cerrar una tarea, revisar:

* nombres claros;
* funciones pequeñas;
* ausencia de duplicidades;
* eliminación de código muerto;
* estructura coherente;
* reutilización de componentes existentes.

---

# 13. Archivos

Eliminar:

* archivos sin uso;
* imports innecesarios;
* código comentado;
* funciones obsoletas.

No dejar restos de desarrollo temporal.

---

# 14. Resultado esperado

Una funcionalidad terminada debe poder integrarse en la rama principal sin requerir trabajo adicional.

No debe depender de tareas pendientes para funcionar correctamente.

---

# Checklist obligatoria

Antes de marcar una tarea como finalizada, verifica:

* [ ] Existe una especificación aprobada.
* [ ] Se cumplen todos los requisitos funcionales.
* [ ] Se cumplen los criterios de aceptación.
* [ ] El código compila sin errores.
* [ ] No existen errores de TypeScript.
* [ ] ESLint finaliza sin errores.
* [ ] Se han creado las pruebas necesarias.
* [ ] Todas las pruebas pasan correctamente.
* [ ] La accesibilidad ha sido revisada.
* [ ] Se han validado las entradas.
* [ ] Se respetan permisos y roles.
* [ ] No existe código duplicado.
* [ ] No existe código muerto.
* [ ] La documentación está actualizada.
* [ ] La implementación respeta la arquitectura.

---

# Criterio final

Una tarea no estará terminada cuando "parezca funcionar".

Solo estará terminada cuando pueda mantenerse, probarse y evolucionarse con seguridad por cualquier desarrollador del proyecto.
