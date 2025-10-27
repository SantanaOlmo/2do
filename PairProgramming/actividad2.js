/* Actividad 2 - Miniproyecto Gestor de Tareas
  Objetivo: añadir comentarios explicativos, documentación,
  y nuevas funcionalidades (completar/eliminar).
  Lenguaje utilizado: JavaScript, adecuado en entorno cliente
  por ser interpretado directamente en el navegador y permitir
  la manipulación del DOM sin necesidad de compilación.
*/

// Capturar elementos del DOM
const input = document.getElementById("tareaInput");
const btnAgregar = document.getElementById("btnAgregar");
const lista = document.getElementById("listaTareas");
const mensajes = document.getElementById("mensajes");

// Evento para el botón
btnAgregar.addEventListener("click", () => {
  agregarTarea()
});
input.addEventListener("keydown", (e)=>{
  if(e.key =="Enter"){
    agregarTarea()
  }
})
function agregarTarea(){
  let tarea = input.value;

  
  if (tarea.trim() === "") {
    mensajes.textContent = "La tarea no puede estar vacía.";
    return;
  }

  // Crear elemento <li>
  const li = document.createElement("li");
  li.textContent = tarea;

  // ✅ Marcar como completada al hacer clic
  li.addEventListener("click", () => {
    li.classList.toggle("completada");
  });

  // 🗑️ Eliminar tarea al hacer doble clic
  li.addEventListener("dblclick", () => {
    lista.removeChild(li);
  });

  lista.appendChild(li);
  input.value = "";
}
