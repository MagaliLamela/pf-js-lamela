//! CREO ARRAY DE PRODUCTOS
// Array que contiene información sobre los productos disponibles
let productos = [];

fetch("https://magalilamela.github.io/pf-js-lamela/data/productos.json")
    .then(res => res.json())
    .then(data => {
        productos = data;
        mostrarProductosPorCategoria("promociones", "contenedorHomeProductos");
        cargarProductosFiltrados();
    })


//! LLAMADOS DEL DOM
const contenedorHomeProductos = document.querySelector("#contenedorHomeProductos");
let btnAgregar;
const numeroCantidad = document.querySelector(".numeroCantidad");
let contenedorProductos;


//! FUNCIÓN PARA CARGAR PRODUCTOS A LA PÁGINA HOME
// Función para mostrar productos de una categoría específica en el DOM
function mostrarProductosPorCategoria(categoria, contenedorId) {
    // Obtener el contenedor donde se mostrarán los productos
    contenedorProductos = document.getElementById(contenedorId);
  
    // Limpiar el contenedor antes de mostrar nuevos productos
    contenedorProductos.innerHTML = "";
  
    // Filtrar los productos por la categoría especificada
    const productosFiltrados = productos.filter(producto => {
        return producto.categorias && producto.categorias.includes(categoria);
        });
  
    // Mostrar los productos filtrados en el DOM
    productosFiltrados.forEach(producto => {
      const divProducto = document.createElement("div");
      divProducto.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
      `;
      contenedorProductos.appendChild(divProducto);
    });
    btnAgregar = document.querySelectorAll(".btnProductos");
    btnAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProductoAlCarrito);
    });
};
  
//! CREO ARRAY DE CARRITO 
// Array que almacena los productos seleccionados por el usuario para su compra.
let productosEnCarrito;

// Recuperar los datos del carrito de compras almacenados en el almacenamiento local del navegador.
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
// Verificar si hay datos en el almacenamiento local.
if (productosEnCarritoLS) {
    // Si hay datos, parsearlos y asignarlos a la variable productosEnCarrito.
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
} else {
    // Si no hay datos, inicializar productosEnCarrito como un array vacío.
    productosEnCarrito = [];
}


//! FUNCIÓN PARA AGREGAR PRODUCTOS AL CARRITO
function agregarProductoAlCarrito(e) {

    // Obtenemos el ID del botón
    const botonId = e.currentTarget.id;

    // Buscamos el producto correspondiente al ID en el array de productos
    const productoAgregado = productos.find(p => p.id === botonId);

    // Verificar si el producto ya está en el carrito
    const productoEnCarritoIndex = productosEnCarrito.findIndex(item => item.nombre === productoAgregado.nombre);

    // Si el producto ya está en el carrito, aumenta la cantidad.
    if (productoEnCarritoIndex !== -1) {
        productosEnCarrito[productoEnCarritoIndex].cantidad++;
    } else {
        // Si el producto no está en el carrito, lo agrega.
        productosEnCarrito.push({ ...productoAgregado, cantidad: 1 });
    };

    // Mostrar mensaje de confirmación de agregado al carrito
    const nodoContenidoToastify = document.createElement('div');
    nodoContenidoToastify.innerHTML = '<img src="https://magalilamela.github.io/preentrega3-lamela/img/iconocarrito3.png" class="carritoProductoAgregado" alt="Ícono del Carrito con Producto Agregado"> Producto agregado al carrito';

    Toastify({
        node: nodoContenidoToastify,
        duration: 2000,
        close: true,
        style: {
            background: "#9C4A8C",
            borderRadius: "1rem",
            color: "#fafafa",
            fontSize: "1.2rem",
            padding: "5px",
            display: "flex",
            justifyContent: "space-evenly",
            width: "24rem"
        },
        stopOnFocus: true,
    }).showToast()

    // Actualizar el número que muestra la cantidad de productos en el carrito.
    actualizarNumeroCantidad();

    // Guardar los productos en el carrito en el almacenamiento local.
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}


//! FUNCIÓN PARA ACTUALIZAR EL NÚMERO DE PRODUCTOS EN EL CARRITO MOSTRADO EN LA INTERFAZ
function actualizarNumeroCantidad() {
    // Inicializar la cantidad inicial en 0
    let cantidadInicial = 0;

    // Verificar si hay productos en el carrito
    if (productosEnCarrito.length > 0) {
         // Si hay productos, sumar las cantidades de todos los productos en el carrito
        cantidadInicial = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    } else {
         // Si no hay productos, intentar obtener los productos desde el almacenamiento local
        productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
        if (productosEnCarritoLS) {
            // Si hay productos en el almacenamiento local, sumar las cantidades de todos los productos
            const productosEnCarritoParsed = JSON.parse(productosEnCarritoLS);
            cantidadInicial = productosEnCarritoParsed.reduce((acc, producto) => acc + producto.cantidad, 0);
        }
    };

    // Actualizar el número mostrado en la interfaz
    numeroCantidad.innerText = cantidadInicial;
}

// Inicializar el número de productos en el carrito al cargar la página
actualizarNumeroCantidad();




//! LLAMADOS DEL DOM
const iconoBuscador = document.querySelector(".icono-buscador");
const contenedorInputBuscador = document.querySelector(".contenedorInputBuscador");
const btnCerrarBuscador = document.querySelector(".btnCerrarBuscador");
const inputBuscador = document.querySelector(".inputBuscador");
const contenedorResultados = document.querySelector(".contenedorResultados");


//! VARIABLES
let terminosBusqueda; // Variable para almacenar los términos de búsqueda


//! EVENT LISTENER
//* Event listener para mostrar u ocultar el campo de entrada de búsqueda al hacer clic en el icono de buscador
iconoBuscador.addEventListener("click", () => {
    contenedorInputBuscador.classList.toggle("show"); // Alternar la clase .show para mostrar u ocultar el campo de entrada
});

//* Event listener para cerrar el campo de búsqueda al hacer clic en el icono de cerrar
btnCerrarBuscador.addEventListener("click", () => {
    contenedorInputBuscador.classList.toggle("show");
});

//* Event listener para la tecla Enter en el campo de búsqueda
inputBuscador.addEventListener("keypress", function (event) {
    if (event.key === 'Enter') {
        // Evita que se realice la acción por defecto del formulario (por ejemplo, enviar datos)
        event.preventDefault();

        // Capturar los términos de búsqueda
        terminosBusqueda = inputBuscador.value;

        // Almacenar los términos de búsqueda en el localStorage para usarlos en la página de resultados
        localStorage.setItem("terminosBusqueda", terminosBusqueda);

        // Redirige a la página de resultados de búsqueda
        window.location.href = "http://127.0.0.1:5500/html/resultados-busqueda.html";
    }
});


//! CÓDIGO PARA LA PÁGINA DE RESULTADOS DE BÚSQUEDA

function cargarProductosFiltrados() {
// Verificar si la URL actual corresponde a la página de resultados de búsqueda
if (window.location.pathname.includes("resultados-busqueda.html")) {
    // Obtener los términos de búsqueda almacenados en el localStorage
    const terminos = localStorage.getItem("terminosBusqueda");

    // Filtrar los productos que coinciden con los términos de búsqueda
    const productosFiltrados = productos.filter(producto => {
        return producto.nombre.toLowerCase().includes(terminos.toLowerCase());
    });

    console.log(productosFiltrados);

    // Mostrar los productos filtrados en la página de resultados
    productosFiltrados.forEach(producto => {
        const divProductoFiltrado = document.createElement("div");
        divProductoFiltrado.classList.add("card", "cardIndividual", "col-xl-3", "col-md-6", "col-sm-12", "h-100");
        divProductoFiltrado.innerHTML = `
        <img src=".${producto.imagen}" class="card-img-top mx-auto" alt="${producto.nombre}">
        <h2 class="card-title nombreProducto">${producto.nombre}</h2>
        <h3> <span> $${producto.precioAnterior} </span> | $${producto.precio} </h3>
        <button type="button" class="btnProductos" id="${producto.id}"> Añadir al Carrito </button>
        `;
        contenedorResultados.appendChild(divProductoFiltrado);
    });

    // Agregar event listener a los botones "Añadir al Carrito" en los productos filtrados
    btnAgregar = document.querySelectorAll(".btnProductos");
    btnAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProductoAlCarrito);
    });
}
}