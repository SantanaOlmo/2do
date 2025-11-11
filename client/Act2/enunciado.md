# Enunciados

[![back](../../assets/icons/back.svg)](README.md)

## Ejercicio 1: La Base - El Objeto Tarea Documentado

Este primer ejercicio se centra en la creación, uso y documentación de un objeto simple.

**Objetivo Principal:** Crear la estructura de un objeto, definir sus propiedades y métodos, y documentarlo profesionalmente con JSDoc.

**Descripción del Ejercicio:**

- Crea una clase llamada `Tarea` en un archivo `Tarea.js`.
- El constructor debe recibir el texto de la tarea y establecer las siguientes propiedades:
  - `id`: Un identificador único (puedes usar `Date.now()` o un paquete como `uuid`).
  - `texto`: El texto recibido como parámetro.
  - `completada`: Booleano, por defecto `false`.
  - `fechaCreacion`: La fecha actual en la que se crea la tarea.
- Añade los siguientes métodos:
  - `completar()`: Cambia `completada` a `true`.
  - `toString()`: Devuelve un string representando la tarea, ej. "[ ] Comprar el pan" o "[x] Comprar el pan" si está completada.
- Documenta la clase exhaustivamente con JSDoc.

En `app.js`, importa la clase `Tarea`, crea un par de instancias y utiliza sus métodos mostrando los resultados por consola.

**Foco en Criterios:**

- (f, g): Clase `Tarea` con constructor, propiedades y métodos.
- (h): En `app.js` se crean y usan objetos `Tarea`.
- (i, k): Documentación completa con JSDoc.


[![back](../../assets/icons/back_mini.svg)](README.md#ejercicio-1-la-base---el-objeto-tarea-documentado)

## Ejercicio 2: El Gestor Central - TaskManager (Patrón Singleton)

Aquí introducimos el patrón Singleton para gestionar un estado único y compartido.

**Objetivo Principal:** Implementar Singleton para asegurar una única instancia que gestione el estado de la aplicación.

**Descripción del Ejercicio:**

- Crea la clase `TaskManager` en `TaskManager.js`.
- Implementa Singleton con un método estático `getInstance()`.
- Añade propiedad `tareas` (array de instancias de `Tarea`).
- Métodos:
  - `agregarTarea(texto)`: Crea y añade una tarea.
  - `eliminarTarea(id)`: Busca y elimina una tarea por `id`.
  - `obtenerTareas()`: Devuelve el array de tareas.
  - `marcarTareaComoCompletada(id)`: Busca la tarea y llama a `completar()`.
- Documenta toda la clase con JSDoc.

En `app.js`, obtén la instancia de `TaskManager` y úsala para añadir, listar y eliminar tareas, comprobando que siempre sea la misma instancia.

**Foco en Criterios:**

- (j): Uso del patrón Singleton.
- (f, g, h): Estructura de `TaskManager` y gestión de objetos `Tarea`.
- (i, k): Documentación completa.


[![back](../../assets/icons/back_mini.svg)](README.md#ejercicio-2-el-gestor-central---taskmanager-patrón-singleton)

## Ejercicio 3: Notificación de Cambios - TaskManager Mejorado (Patrón Observer)

Simula la reactividad de aplicaciones modernas.

**Objetivo Principal:** Aplicar Observer para desacoplar estado de la UI.

**Descripción del Ejercicio:**

- Modifica `TaskManager` para actuar como Sujeto.
- Añade `observadores` (array de funciones).
- Métodos:
  - `suscribir(observador)`: Añade función al array.
  - `notificar()`: Ejecuta todas las funciones del array.
- Modifica `agregarTarea`, `eliminarTarea` y `marcarTareaComoCompletada` para llamar a `this.notificar()` después de cambiar el array.
- En `app.js`, crea funciones observadoras:
  - `actualizarListaConsola()`: Muestra todas las tareas por consola.
  - `mostrarContador()`: Muestra el número total de tareas.
- Suscribe ambas funciones al `TaskManager` y comprueba su ejecución automática.

**Foco en Criterios:**

- (j): Uso del patrón Observer.
- (i, k): Documentación clara de suscripción y notificación.
- (f, g, h): Refactorización y uso del TaskManager con nuevas funcionalidades.

**Ampliación (para nota):** Crear un observador que actualice un `<ul>` en HTML manipulando el DOM.


[![back](../../assets/icons/back_mini.svg)](README.md#ejercicio-3-notificación-de-cambios---taskmanager-mejorado-patrón-observer)

## Ejercicio 4: Creación Flexible - ElementoUIFactory (Patrón Factory)

Desacopla la creación de objetos complejos.

**Objetivo Principal:** Usar Factory para crear diferentes tipos de elementos sin que el cliente sepa cómo se construyen.

**Descripción del Ejercicio:**

- Crea clase `ElementoUIFactory`.
- Método `crearElementoTarea(tarea, tipo)`:
  - `tipo = 'simple'`: Devuelve `<li>` con solo el texto de la tarea.
  - `tipo = 'detallado'`: Devuelve `<div>` con texto, fecha de creación y checkbox.
- Documenta la fábrica.

En `app.js`, usa la fábrica para generar elementos del DOM y añadirlos a la página web. No usar `document.createElement` directamente.

**Foco en Criterios:**

- (j): Uso del patrón Factory.
- (h): Código principal usa la fábrica para crear elementos.
- (i, k): Documentación de la lógica de la fábrica.


[![back](../../assets/icons/back_mini.svg)](README.md#ejercicio-4-creación-flexible---elementouifactory-patrón-factory)