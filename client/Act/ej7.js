/*Ejercicio 7: Sistema de gestión de tareas (CRUD básico con arrays)
Objetivo: Encadenar operaciones funcionales y uso de callbacks personalizados.

Puntuación: 5

Dado el array tareas

Crea funciones reutilizables:

generarId(arr) → Devuelve el id siguiente.
agregarTarea(arr, titulo) → añade una nueva tarea con id autogenerada.
completarTarea(arr, id) → marca como completada la tarea con ese id.
eliminarTarea(arr, id) → elimina la tarea correspondiente.
obtenerPendientes(arr) → devuelve las tareas !completada.
contarCompletadas(arr) → usando reduce().
Todo debe ser inmutable (sin modificar el array original). Intenta hacer todas las funciones con un return de una sola línea y nada más.

Puntuación: 2,5.*/

let tareas = [
  { id: 1, titulo: "Estudiar JavaScript", completada: false },
  { id: 2, titulo: "Comprar pan", completada: true },
  { id: 3, titulo: "Hacer ejercicio", completada: false }
];
const generarId=(arr)=>arr.length+1; 
const agregarTarea=(arr,titulo)=>[...arr,{id:arr.length+1,titulo:titulo,completada:false}];
//en el siguiente, al llamar a ...tarea y a completada:true no estoy duplicando el atributo completado sino que si existe se sobreescribe
const completarTarea=(arr,id)=>arr.map(tarea=>tarea.id===id ? {...tarea,completada:true}:t);
const eliminarTarea=(arr,id)=>arr.filter(tarea=>tarea.id!=id)//creo otro lista de tarea sin la tarea que se desea eliminar
const obtenerPendientes=(tareas)=>tareas.filter(tarea=>tarea.completada===false)
const contarCompletadas=(arr)=>[...arr].reduce((prev,current)=>current.completada===true? prev+1:prev,0 );

console.table(tareas)
console.log("generarId:", generarId(tareas));//number
console.table("agregarTarea:", agregarTarea(tareas, "Lavar la ropa"));//array
console.table("completarTarea:", completarTarea(tareas, 1));
console.table("eliminarTarea:", eliminarTarea(tareas, 2));
console.table("obtenerPendientes:", obtenerPendientes(tareas));
console.table("contarCompletadas:", contarCompletadas(tareas));
