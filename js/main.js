//! CREO ARRAY DE PRODUCTOS
// Array que contiene información sobre los productos disponibles
let productos = [];

fetch("https://magalilamela.github.io/pf-js-lamela/data/productos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        productos = data;
        console.log(data);
        // Llamados específicos para cada página
        if (window.location.pathname === '/index.html') {
            rutaBaseImagenes = './';
            mostrarProductosPorCategoria("promociones", "contenedorHomeProductos");
        } else if (window.location.pathname === '/html/productos-perros.html') {
            rutaBaseImagenes = '../';
            mostrarProductosPorCategoria("perros", "contenedorPerros");
        } else if (window.location.pathname === '/html/productos-gatos.html') {
            rutaBaseImagenes = '../';
            mostrarProductosPorCategoria("gatos", "contenedorGatos");
        } else if (window.location.pathname.includes("resultados-busqueda.html")) {
            rutaBaseImagenes = '../';
            cargarProductosFiltrados()
        }
        console.log(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });


//! LLAMADOS DEL DOM
let btnAgregar;
const numeroCantidad = document.querySelector(".numeroCantidad");
let contenedorProductos;
let rutaBaseImagenes;


//! FUNCIÓN PARA CARGAR PRODUCTOS EN LA INTERFAZ

function mostrarProductos(productosCategoriaOFiltrados) {
    productosCategoriaOFiltrados.forEach(producto => {

        const divProducto = document.createElement("div");

        divProducto.classList.add("card", "cardIndividual", "col-xl-3", "col-lg-4", "col-md-6", "col-sm-12", "h-100");

        if (window.location.pathname === '/index.html') {
            divProducto.classList.remove("col-lg-4");
        }

        divProducto.innerHTML = `
        <img src="${rutaBaseImagenes}${producto.imagen}" class="card-img-top mx-auto" alt="${producto.nombre}">
        <h2 class="card-title nombreProducto">${producto.nombre}</h2>
        <h3> 
        ${producto.precioAnterior ? `<span>$${producto.precioAnterior.toLocaleString()}</span> |` : ''}
            $${producto.precio.toLocaleString()} 
        </h3>
        <button type="button" class="btnProductos" id="${producto.id}"> Añadir al Carrito </button>
      `;

        contenedorProductos.appendChild(divProducto);
    });
    btnAgregar = document.querySelectorAll(".btnProductos");
    btnAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProductoAlCarrito);
    });

}

// Función para mostrar productos de una categoría específica en el DOM
function mostrarProductosPorCategoria(categoria, contenedorId) {
    // Obtener el contenedor donde se mostrarán los productos
    contenedorProductos = document.getElementById(contenedorId);

    // Filtrar los productos por la categoría especificada
    const productosPorCategoria = productos.filter(producto => {
        return producto.categorias && producto.categorias.includes(categoria);
    });
        mostrarProductos(productosPorCategoria);
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
    nodoContenidoToastify.innerHTML = '<img src="../img/iconocarrito3.png" class="carritoProductoAgregado" alt="Ícono del Carrito con Producto Agregado"> Producto agregado al carrito';

    Toastify({
        node: nodoContenidoToastify,
        duration: 2000,
        close: true,
        offset: {
            y: 70 // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
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
    if (numeroCantidad) {
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
}

// Inicializar el número de productos en el carrito al cargar la página
actualizarNumeroCantidad();

