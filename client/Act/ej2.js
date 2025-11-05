/*Ejercicio 2: Funciones definidas por el usuario
Objetivo: Crear y usar funciones con parámetros, return y callback.
Puntuación: 1.*/

/*Crea una función saludar(nombre) que reciba un nombre y devuelva "Hola, [nombre]!".*/
/**
 * @param {string} nombre 
 * @returns {string} saludo al nombre
 */

function saludar(nombre){
    return `Hola, ${nombre}!`;
}

/*Crea una función esPar(numero) que devuelva true si el número es par, false si es impar.*/
/**
 * 
 * @param {number} numero 
 * @returns string par o impar
 */
function esPar(numero){
    return numero%2===0 ? "par":"impar";
}

/*Crea una función operacionArray(arr, callback) que reciba un array de números y una función callback,
 y aplique la callback a cada elemento del array (usa for…of o forEach).
Ejemplo de callback: multiplicar por 2, sumar 5, etc.*/

const frutas = [1,2,3,4,5];

function operacionArray(arr,callback){
    arr.forEach((e,i)=>{
        arr[i] = callback(e);
    })
}

function duplicar(numero){
    return numero*2;
}
console.log(frutas)
operacionArray(frutas,duplicar);
console.log(frutas)

/*Crea una función flecha promedio = arr => … que devuelva el promedio de un array de números utilizando reduce.*/

/**
 * Calcula la media de los valores de un array
 * @param {Array} array de numeros
 * @returns devuelve el valor medio en number
 */
const promedio = (arr)=> arr.reduce((acumulador,elemento)=>acumulador+elemento,0)/arr.length;
console.log(`Valor promedio del array: ${promedio(frutas)}`);
