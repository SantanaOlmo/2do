/*Ejercicio 5: Gestión de Inventario con funciones avanzadas
Objetivo: Diseño modular con funciones que transforman y consultan arrays de objetos.

Dado el array "productos"*/

let productos = [
  { nombre: "Teclado", precio: 50, stock: 10 },
  { nombre: "Ratón", precio: 20, stock: 0 },
  { nombre: "Monitor", precio: 200, stock: 5 },
  { nombre: "USB", precio: 10, stock: 25 }
];

/*Crea una función productosConStock(arr) que devuelva solo los productos con stock > 0.*/
const productosConStock=(productos)=>productos.filter(producto=>producto.stock>0);
console.log(productosConStock(productos));

/*Crea una función incrementarPrecio(arr, porcentaje) que devuelva un nuevo array aumentando el precio en ese %.*/
const incrementarPrecio=(productos,porcentaje)=>
    productos.map(producto=>{
        return{
        nombre: producto.nombre,
        precio: producto.precio+(producto.precio*porcentaje/100),
        stock: producto.stock
        }
    }
);
// console.table permite mostrar array de objetos 
// y encima en forma de tabla
console.table(incrementarPrecio(productos,20))

// con stringify convierto objetos o json (es igual) a un string
// console.log(JSON.stringify(incrementarPrecio(productos,20)))


/*Crea una función calcularValorTotalInventario(arr) que use reduce() y devuelva el valor total del inventario disponible.*/
const calcularValorTotalInventario=(productos)=>
    productos.reduce((productoAnterior,productoActual)=>
        productoAnterior+(productoActual.precio*productoActual.stock),0
    );

console.log(`El valor total del inventario es: ${calcularValorTotalInventario(productos)}`)

/*Encadena las funciones anteriores para obtener el valor total del inventario tras un aumento del 10% en los precios.*/
console.table(`Tras el aumento del 10%, el precio total es: ${calcularValorTotalInventario(incrementarPrecio(productos,20))}`)
