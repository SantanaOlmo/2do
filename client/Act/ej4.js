/*Ejercicio 4: Operaciones combinadas y encadenamiento
Objetivo: Aplicar varias operaciones de arrays y funciones en cadena.

Dado el array de números [1, 4, 7, 10, 15]:*/

numeros=[1, 4, 7, 10, 15]
/*Filtra los números mayores que 5
Multiplica cada número filtrado por 2
Calcula la suma de todos los números resultantes
(todo encadenando filter(), map() y reduce())*/
console.log(numeros.filter(e=>e>5).map(e=>e*2).reduce((numAnterior,numActual)=>numActual+numAnterior,0));

/*Dado del array de usuarios, filtra los mayores de 20
Obtén un array con solo sus nombres usando map()
Ordena los nombres alfabéticamente usando sort().*/

let usuarios = [
  {nombre: "Ana", edad: 23},
  {nombre: "Luis", edad: 19},
  {nombre: "Marta", edad: 30}
];
console.log(`Usuarios mayores de 20 ordenados alfabeticamente: 
    ${usuarios.filter(usuario=>usuario.edad>20)
    .map(usuario=>usuario.nombre)
    .sort()
    .reduce((valorAnterior,valorActual)=>valorAnterior+", "+valorActual)}`)
//no lo guardo, solo muestro por consola para ver resultados.