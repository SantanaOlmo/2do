//ej1
precio = [50,100,25,80,120]
precioConDescuento = precio.map(precio=>precio-precio*20/100);
console.log(precioConDescuento)

//Ej2
const estudiantes = [
  { nombre: "Ana", nota: 7 },
  { nombre: "Luis", nota: 5 },
  { nombre: "María", nota: 9 },
  { nombre: "Pedro", nota: 4 },
  { nombre: "Sofía", nota: 8 }
];

notaMedia= estudiantes.reduce((acum,alumnoActual,index,array),{acum:0, a})

console.log(notaMedia);
