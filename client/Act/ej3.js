/*Ejercicio 3: Arrays – creación y manipulación
Objetivo: Crear arrays y usar métodos básicos y avanzados.
Puntuación: 1.

Crea un array frutas con cinco frutas.*/

frutas =["mango","piña","tomate","sandía","melocotón"];

/*Añade una fruta al inicio y otra al final.*/
frutas.unshift("pera");
frutas.push("frambuesa");
console.log(frutas);

/*Elimina la primera y la última fruta.*/
frutas.pop()
frutas.shift()
console.log(frutas);

/*Crea un nuevo array frutasMayus con todas las frutas en mayúsculas usando map().*/
frutasMayus= frutas.map(e=> e=e.toUpperCase());
console.log(frutasMayus);

/*Filtra solo las frutas que contengan la letra "a" usando filter().*/
frutas_con_letra_a=frutas.filter(e=> e.includes("a"))
console.log(frutas_con_letra_a)

/*Encuentra la posición de la fruta "Manzana" usando findIndex().*/
frutas.push("manzana")
console.log(frutas)
console.log(`Posicion de "manzana" en el array "frutas": ${frutas.findIndex(e=> e==="manzana")}`)

/*Comprueba si alguna fruta empieza con "P" usando some() y si todas las frutas tienen más de 3 letras usando every().*/
console.log(`¿Empieza alguna fruta por P? ${frutas.some(e=>e.toUpperCase().startsWith("P"))}`)
console.log(`¿Tienen todas las frutas más de 3 letras? ${frutas.every(e=>e.length>3)}`)

/*Ordena las frutas alfabéticamente usando sort().*/
frutas_alfabeticamente=frutas.sort();
console.log(`Frutas ordenadas alfabéticamente: ${frutas_alfabeticamente}`);

/*Usa reduce() para crear un string que contenga todas las frutas separadas por coma.*/
console.log(`${frutas.reduce((valorAnterior,valorActual)=>valorAnterior+", "+valorActual)}`) // si le digo que el valor inicial es "" pone una coma al principio