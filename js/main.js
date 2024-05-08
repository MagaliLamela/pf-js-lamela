//! LLAMADOS DEL DOM
const numeroCantidad = document.querySelector(".numeroCantidad");

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