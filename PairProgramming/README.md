# Gestor de Tareas - Explicación y Criterios Excelentes

## Actividad 1

- **Objetivo:** practicar variables, operadores, ámbitos, conversiones, decisiones, bucles y depuración.

### Mejoras y comentarios

1. **Variables y operadores**
   - Uso de `const` para elementos del DOM (`input`, `btnAgregar`, `lista`, `mensajes`) porque no cambian.
   - Uso de `let` para la variable `tarea` que cambia en cada clic.
   - Conversión de texto a minúsculas con `tarea.toLowerCase()`.

2. **Ámbito de variables**
   - Variables globales: `tareas` para depuración y seguimiento.
   - Variables locales: `li` y `tarea` dentro del listener.

3. **Decisiones**
   - Validación del input vacío:
     ```js
     if (tarea === "") { ... } else { ... }
     ```

4. **Bucles**
   - Recorremos el array `tareas` para mostrar en consola todas las tareas:
     ```js
     for (let i = 0; i < tareas.length; i++) {
       console.log(`${i + 1}. ${tareas[i]}`);
     }
     ```

5. **Mensajes**
   - Indicamos visualmente si se añadió la tarea correctamente:
     ```js
     mensajes.textContent = `✅ Tarea agregada: "${tarea}"`;
     mensajes.style.color = "green";
     ```

6. **Depuración**
   - Uso de `console.log()` para mostrar tareas y seguimiento del flujo.

---

## Actividad 2

- **Objetivo:** añadir funcionalidades de completar y eliminar tareas, con comentarios claros y estructura.

### Mejoras aplicadas

1. **Funciones reutilizables**
   - Creamos una función `agregarTarea()` para manejar tanto clic en el botón como tecla Enter:
     ```js
     function agregarTarea() { ... }
     ```

2. **Eventos**
   - Botón "Añadir":
     ```js
     btnAgregar.addEventListener("click", agregarTarea);
     ```
   - Tecla Enter:
     ```js
     input.addEventListener("keydown", (e) => {
       if (e.key === "Enter") agregarTarea();
     });
     ```

3. **Validación y mensajes**
   - Input vacío detectado con `trim()`:
     ```js
     if (tarea.trim() === "") {
       mensajes.textContent = "❌ La tarea no puede estar vacía.";
       return;
     }
     ```

4. **Creación y manipulación del DOM**
   - Crear `<li>` y añadir al `<ul>`:
     ```js
     const li = document.createElement("li");
     li.textContent = tarea;
     lista.appendChild(li);
     ```

5. **Completar tarea**
   - Toggle de clase `.completada` al hacer clic:
     ```js
     li.addEventListener("click", () => {
       li.classList.toggle("completada");
     });
     ```

6. **Eliminar tarea**
   - Doble clic elimina `<li>`:
     ```js
     li.addEventListener("dblclick", (e) => {
       e.stopPropagation();
       lista.removeChild(li);
     });
     ```

7. **Variables y alcance**
   - `tarea` y `li` son locales a la función, no interfieren con otros elementos del DOM.
   - `input`, `btnAgregar`, `lista`, `mensajes` son `const` globales, accesibles desde cualquier función.

8. **Estilo y usabilidad**
   - `.completada` cambia color y fondo.
   - Hover en `<li>` indica que es interactivo (cursor `pointer` y sombra).

---

## Criterios

- [ ] **Selección del lenguaje:** JavaScript, justificado por manipulación directa del DOM y respuesta inmediata al usuario. 
- [ ] **Variables y operadores:** uso de `const` y `let`, operadores de comparación y concatenación. 
- [ ] **Ámbito de variables:** diferenciado entre globales y locales. 
- [ ] **Conversiones:** `tarea.toLowerCase()`, uso de `trim()` para limpiar input. 
- [ ] **Comentarios:** código explicado en cada sección. 
- [ ] **Decisiones:** condicionales múltiples para validación de input. 
- [ ] **Bucles:** iteración sobre array de tareas para depuración. 
- [ ] **Herramientas:** uso de `console.log()` y mensajes visuales para depuración y feedback. 

---

# Criterios para proyecto excelente - Gestor de Tareas

## a) Selección del lenguaje (10%)
- Justificar claramente la elección de **JavaScript**.
- Explicar ventajas en entorno cliente: manipulación del DOM, respuesta inmediata al usuario, no requiere compilación, ampliamente soportado en navegadores.
- Nivel excelente: 10/10

## b) Variables y operadores (10%)
- Usar distintos tipos de variables (`let`, `const`, `var`) según el contexto.
- Aplicar operadores correctamente (aritméticos, comparación, lógicos, concatenación).
- Nivel excelente: 10/10

## c) Ámbito de variables (10%)
- Diferenciar variables **locales** y **globales**.
- Aplicarlas correctamente en funciones y bloques.
- Nivel excelente: 10/10

## d) Conversiones de datos (10%)
- Aplicar conversiones necesarias: strings a números (`Number()`), mayúsculas/minúsculas (`toLowerCase()`, `toUpperCase()`), etc.
- Nivel excelente: 10/10

## e) Comentarios al código (20%)
- Código bien comentado, explicando funciones, decisiones y pasos importantes.
- Mantener estructura clara y legible.
- Nivel excelente: 20/20

## f) Decisiones (10%)
- Usar condicionales correctas y múltiples cuando sea necesario (`if`, `else if`, `else`).
- Cubrir todos los casos posibles, incluyendo validación de input vacío.
- Nivel excelente: 10/10

## g) Bucles (20%)
- Implementar bucles correctamente (`for`, `forEach`, `while`) según el caso.
- Optimizar código, evitar redundancias.
- Nivel excelente: 20/20

## h) Herramientas y entornos (10%)
- Usar **consola** para depuración, logs de tareas añadidas.
- Aprovechar herramientas del navegador (DevTools) para revisar variables y errores.
- Nivel excelente: 10/10

