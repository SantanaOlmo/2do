/*Ejercicio 6: Ordenar, agrupar y validar datos
Objetivo: Trabajar con sort, every, some y reduce para clasificación y comprobaciones.

Puntuación: 4,5

Dado el array estudiantes:*/

let estudiantes = [
  { nombre: "Ana", nota: 9 },
  { nombre: "Luis", nota: 4 },
  { nombre: "Marta", nota: 7 },
  { nombre: "Pedro", nota: 5 },
  { nombre: "Sara", nota: 9 }
];

/*a) Ordena a los estudiantes por nota de mayor a menor (sin modificar el original).*/
console.table(estudiantes.sort((a,b)=>b.nota-a.nota))

/*b) Comprueba:
si todos han aprobado (nota >= 5)
si alguno tiene matrícula de honor (nota >= 9)*/
console.log(`¿Han aprobado todos? ${estudiantes.every(estudiante=>estudiante.nota>=5)}`)
console.log(`¿Alguien tiene matricula de honor? ${estudiantes.some(estudiante=>estudiante.nota>=9)}`)

/*+c) Agrupa los estudiantes por nota usando reduce() (objeto cuyo índice sea la nota).*/
console.log(estudiantes.reduce(
    (prevStudent,currentStudent)=>{
        
    }))

/*d) Genera un array de strings con formato "Nombre - Nota" usando map().*/
console.log(estudiantes.map(estudiante=>estudiante.nombre+" - "+estudiante.nota))