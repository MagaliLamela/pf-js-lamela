//! OBTENER LOS PRODUCTOS DEL CARRITO ALMACENADOS EN EL ALMACENAMIENTO LOCAL DEL NAVEGADOR Y PARSEARLOS
const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));


//! LLAMADOS DEL DOM
const contenedorCarritoVacio = document.querySelector("#carritoVacio");
const contenedorCarritoProductos = document.querySelector("#contenedorCarritoProductos");
const btnFinalizarCompra = document.querySelector("#btnCarritoFinalizar");
const contenedorCarritoComprado = document.querySelector("#carritoComprado");


//! VARIABLES PARA REFERENCIAR ELEMENTOS DEL DOM RELACIONADOS CON LA MANIPULACIÓN DEL CARRITO DE COMPRAS
let btnAumentarCantidad; // Botón para aumentar la cantidad de un producto en el carrito
let btnDisminuirCantidad; // Botón para disminuir la cantidad de un producto en el carrito
let btnEliminarProducto; // Botón para eliminar un producto del carrito
let total; // Variable para mostrar el precio total de los productos en el carrito


//! FUNCIONES

//* Función para cargar los productos en el carrito
function cargarProductosCarrito() {
    // Verificar si hay productos en el carrito
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        // Mostrar la sección del carrito y ocultar el mensaje de carrito vacío y carrito comprado
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        btnFinalizarCompra.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        // Limpiar el contenedor de productos en el carrito
        contenedorCarritoProductos.innerHTML = "";

        // Crear la estructura de la tabla para mostrar los productos en el carrito
        const tr = document.createElement("tr");
        tr.classList.add("titulosCarrito");
        tr.innerHTML = `
        <td>
            <h2>Producto</h2>
        </td>
        <td>
            <h2>Precio</h2>
        </td>
        <td>
            <h2>Cantidad</h2>
        </td>
        <td>
            <h2>Subtotal</h2>
        </td>
        <td>
        </td>
        `;
        contenedorCarritoProductos.append(tr);

        // Iterar sobre cada producto en el carrito y mostrarlo en la tabla
        productosEnCarrito.forEach(producto => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td class="celdaProducto">
            <img class="imgCarrito" src=".${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
        </td>
        <td>
            <h3>$${producto.precio.toLocaleString()}</h3>
        </td>
        <td class="celdaCantidad">
            <div>
                <button class="btnCarritoIzq" data-id="${producto.id}" title="Botón para Restar Unidades"> <i class="bi bi-dash"></i> </button>
                <h3>${producto.cantidad}</h3>
                <button class="btnCarritoDer" data-id="${producto.id}" title="Botón para Sumar Unidades"> <i class="bi bi-plus"></i> </button>
            </div>
        </td>
        <td>
            <h3>$${(producto.precio * producto.cantidad).toLocaleString()}</h3>
        </td>
        <td>
            <button class="btnCarritoX" data-id="${producto.id}" title="Botón para Eliminar Producto"> <i class="bi bi-x"></i> </button>
        </td>
`;
            contenedorCarritoProductos.append(tr);
        })

        const tr2 = document.createElement("tr");
        tr2.classList.add("celdaTotal");
        tr2.innerHTML = `
        <td>
            <h3>Total</h3>
        </td>
        <td></td>
        <td></td>
        <td>
            <h3 id="totalFinal"></h3>
        </td>
        <td></td>
        `;
        contenedorCarritoProductos.append(tr2);

        // Agregar eventos a los botones de la tabla del carrito
        btnEliminarProducto = document.querySelectorAll(".btnCarritoX");
        btnEliminarProducto.forEach(boton => {
            boton.addEventListener("click", eliminarProducto);
        });

        btnAumentarCantidad = document.querySelectorAll(".btnCarritoDer");
        btnAumentarCantidad.forEach(boton => {
            boton.addEventListener("click", aumentarCantidad);
        });

        btnDisminuirCantidad = document.querySelectorAll(".btnCarritoIzq");
        btnDisminuirCantidad.forEach(boton => {
            boton.addEventListener("click", disminuirCantidad);
        });

        // Calcular y mostrar el precio total del carrito
        calcularPrecioTotal();

    } else {
        // Mostrar el mensaje de carrito vacío y ocultar la sección del carrito y de carrito comprado
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        btnFinalizarCompra.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled")
    }
}

// Llamar a la función para cargar los productos en el carrito
cargarProductosCarrito();


//* Función para eliminar un producto del carrito de compra.
function eliminarProducto(e) {
    // Obtener el ID del producto desde el atributo data-id del botón
    const botonId = e.currentTarget.dataset.id;

    // Encontrar el índice del producto en el array de productos en el carrito
    const indice = productosEnCarrito.findIndex(p => p.id === botonId);
    
    // Eliminar el producto del array
    productosEnCarrito.splice(indice, 1);

    // Actualizar el carrito en el almacenamiento local
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    // Volver a cargar los productos en el carrito
    cargarProductosCarrito();
}


//* Función para aumentar la cantidad de un producto en el carrito
function aumentarCantidad(e) {
    // Obtener el ID del producto desde el atributo data-id del botón
    const botonId = e.currentTarget.dataset.id; 

    // Encontrar el producto en el array de productos en el carrito
    const producto = productosEnCarrito.find(p => p.id === botonId);

    // Verificar si se encontró el producto en el carrito
    if (producto) {
        producto.cantidad++; // Aumentar la cantidad del producto en 1
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); // Actualizar el carrito en el almacenamiento local
        cargarProductosCarrito(); // Volver a cargar los productos en el carrito
    }
}


//* Función para disminuir la cantidad de un producto en el carrito
function disminuirCantidad(e) {
    // Obtener el ID del producto desde el atributo data-id del botón
    const botonId = e.currentTarget.dataset.id; 

    // Encontrar el producto en el array de productos en el carrito
    const producto = productosEnCarrito.find(p => p.id === botonId);

    // Verificar si se encontró el producto en el carrito y si su cantidad es mayor que 1
    if (producto && producto.cantidad > 1) {
        producto.cantidad--; // Disminuir la cantidad del producto en 1
    } else if (producto && producto.cantidad === 1) {
        // Si la cantidad es igual a 1, eliminar el producto del carrito
        const indice = productosEnCarrito.findIndex(p => p.id === botonId); // Encontrar el índice del producto en el array
        productosEnCarrito.splice(indice, 1); // Eliminar el producto del array de productos en el carrito
    };

    // Actualizar el carrito en el almacenamiento local
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); 
    
    // Volver a cargar los productos en el carrito
    cargarProductosCarrito(); 
}


//* Función para calcular el precio total del carrito de compra.
function calcularPrecioTotal() {
    // Elemento HTML donde se mostrará el precio total
    total = document.querySelector("#totalFinal");
    // Utiliza reduce para sumar los precios de todos los productos en el carrito.
    const calculoTotal = productosEnCarrito.reduce((acumulador, producto) => acumulador + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${calculoTotal.toLocaleString()}`;
}


//* Función para Finalizar Compra
function finalizarCompra() {
    productosEnCarrito.length = 0;  // Vaciar el array de productos en el carrito

    // Actualizar el carrito en el almacenamiento local
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    
    // Ocultar la sección del carrito y de carrito vacío y mostrar el mensaje de compra realizada
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    btnFinalizarCompra.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}

// Agregar evento al botón de finalizar compra
btnFinalizarCompra.addEventListener("click", finalizarCompra);