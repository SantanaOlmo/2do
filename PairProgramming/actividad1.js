/* 
  Actividad 1 - Miniproyecto Gestor de Tareas
  Objetivo: practicar variables, operadores, ámbitos, conversiones,
  decisiones, bucles y depuración.
*/



// Capturar elementos del DOM
const input = document.getElementById("tareaInput");
const btnAgregar = document.getElementById("btnAgregar");
const lista = document.getElementById("listaTareas");
const mensajes = document.getElementById("mensajes");

const tareas = [];

for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  if (key.startsWith("tarea")) {
    tareas.push(sessionStorage.getItem(key));
  }
}

console.log(tareas);


// Evento para el botón
btnAgregar.addEventListener("click", () => {
  // 1. Obtener valor del input
  let tarea = input.value;
  // 2. Validar que no esté vacío (if/else)
    if (tarea ==""){
      mensajes.textContent = "Error, el campo está vacío.";
    }else {
      mensajes.textContent= "Campo relleno";
  }

  // 3. Convertir texto a mayúsculas/minúsculas (conversiones de tipo)
  tarea = tarea.toLowerCase();
  console.log(tarea)
  // 4. Crear un <li> y añadir la tarea al <ul>
  
  let li = document.createElement("li");
  li.textContent= tarea;
  lista.appendChild(li);


  // 5. Recorrer todas las tareas con un bucle y mostrarlas en consola
  console.log("Lista de tareas:");
  for (let i = 0; i < tareas.length; i++) {
    console.log(`${i + 1}. ${tareas[i]}`);
  }

  // 6. Mostrar mensajes en el div #mensajes
  mensajes.textContent = `✅ Tarea agregada: "${tarea}"`;
  mensajes.style.color = "green";

  sessionStorage.setItem("li", )
});


