//! LLAMADOS DEL DOM
const contenedorProductoIndividual = document.querySelector("#contenedorProductoIndividual");
const contenedorInfo = document.querySelector("#contenedorInfo");


//! Obtener los parámetros de la URL para identificar el producto específico que se va a mostrar
const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get('id');


//! FETCH
// Realizar una solicitud fetch para obtener los datos del producto desde el archivo JSON
fetch("https://magalilamela.github.io/pf-js-lamela/data/productos.json")
    .then(res => res.json())
    .then((data) => {
        // Encontrar el producto con el ID coincidente
        const producto = data.find(item => item.id === idParam);
        if (producto) {
            // Si se encuentra el producto, rellenar el HTML con los datos del producto
            rellenarHTMLProducto(producto);
        } else {
            // Si no se encuentra el producto, mostrar un mensaje de "Producto no encontrado"
            contenedorProductoIndividual.innerHTML = `<div class = "productoNoEncontrado">
            <p>Producto no encontrado.</p>
            <button class = "btnVolver"> <a href="../index.html">Volver a la tienda</a></button> 
            </div>`;
            // Limpiar el contenedor de información del producto
            contenedorInfo.innerHTML = '';
        }
    })
    .catch((error) => {
        // Manejar errores en caso de que falle la solicitud fetch
        console.error('Error al cargar el archivo JSON:', error);
        // Mostrar un mensaje de error al cargar los datos del producto
        contenedorProductoIndividual.innerHTML = `<p class = "productoNoEncontrado">Error al cargar los datos del producto.</p> 
        <button class = "btnVolver"> <a href="../index.html">Volver a la tienda</a></button> `;
        // Limpiar el contenedor de información del producto
        contenedorInfo.innerHTML = '';
    });


//! Función para rellenar el HTML con los datos del producto
const rellenarHTMLProducto = (producto) => {
    // Crear un contenedor para la imagen y el título del producto
    const div = document.createElement("div");
    div.classList.add("contenedorImagenTitulo");
    div.innerHTML = `
            <img src="${rutaBaseImagenes}${producto.imagen}" alt="${producto.nombre}">
            <div>
            <h1>${producto.nombre}</h1>
            <h2>${producto.precioAnterior ? `<span>$${producto.precioAnterior.toLocaleString()}</span> |` : ''}
            $${producto.precio.toLocaleString()} </h2>
            <button type="button" class="btnProductos" id="${producto.id}"> Añadir al Carrito </button>
            <p> <span> Envío gratuito a tu domicilio en CABA y GBA de Lunes a Viernes de 14 a 22 hs. </span> <br>
            <i class="bi bi-check-circle"></i> Comprá antes de las 12 hs y recibilo en el día antes de las 22 hs. <br>
            <i class="bi bi-check-circle"></i> Comprando después de las 12 hs, recibilo de 14 a 22 hs el día hábil siguiente. <br>
            <i class="bi bi-check-circle"></i> Retira en tienda 1 hora después de realizada tu compra, todos los días de 10 a 20 hs. <br>
            <i class="bi bi-check-circle"></i> Devolución sin cargo dentro de los 30 días.
            </p>
            </div>
        `;
    contenedorProductoIndividual.append(div);

    // Crear un contenedor para la información adicional del producto
    const div2 = document.createElement("div");
    div2.classList.add("contenedorInfo");
    div2.innerText = producto.info;
    contenedorInfo.append(div2);

    // Obtener todos los botones de "Añadir al Carrito" y agregarles un evento de click
    btnAgregar = document.querySelectorAll(".btnProductos");
    btnAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProductoAlCarrito);
    });
};


