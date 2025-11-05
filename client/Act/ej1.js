/*Ejercicio 1: Funciones predefinidas y manipulación básica
Objetivo: Practicar funciones predefinidas de JavaScript.

Dado el array de números [4.7, 2.3, 9.8, 6.5]:
Puntuación: 1. */

array =[4.75, 2.3, 9.8, 6.5];

/*a) Redondea todos los números hacia arriba usando una función predefinida.*/
array_ceil=array.map(n=> Math.ceil(n));
console.log("Array redondeado hacia arriba --> \n"+ array_ceil)

/*b) Convierte todos los números a strings y muestra su longitud.*/
array_string=array.map((n)=>{
    string=n.toString();
    length=string.length;
    return{"num":string,
        "length":length
    }
    
})
console.log(array_string)

/*c) Calcula el mayor y el menor valor usando funciones Math.*/
maxNum= Math.max(...array)
console.log("Greatest number:"+maxNum)

/*Dado el string "JavaScript":*/
string="JavaScript";
/*a) Convierte todas las letras a mayúsculas. */
string_upperCase=string.toUpperCase();
console.log("string en mayúsculas: "+string_upperCase)

/*b) Obtén los 4 primeros caracteres usando un método de string.*/
four_first_chars=string.split("",4);
console.log(four_first_chars)

/*c) Verifica si contiene la letra "S" (mayúscula).*/
existe= string.toUpperCase().includes("S");
console.log(`¿Contiene S la palabra ${string}? ${existe}`)
