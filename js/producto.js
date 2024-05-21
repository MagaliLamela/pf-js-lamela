const contenedorProductoIndividual = document.querySelector("#contenedorProductoIndividual");
const contenedorInfo = document.querySelector("#contenedorInfo");
const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get('id');


fetch("https://magalilamela.github.io/pf-js-lamela/data/productos.json")
    .then(res => res.json())
    .then((data) => {
        // Find the product with the matching ID
        const producto = data.find(item => item.id === idParam);
        if (producto) {
            rellenarHTML(producto);
        } else {
            contenedorProductoIndividual.innerHTML = '<p>Producto no encontrado.</p>';
            contenedorInfo.innerHTML = '';
        }
    })
    .catch((error) => {
        console.error('Error al cargar el archivo JSON:', error);
        contenedorProductoIndividual.innerHTML = '<p>Error al cargar los datos del producto.</p>';
        contenedorInfo.innerHTML = '';
    });

    const rellenarHTML = (producto) => {
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

        const div2 = document.createElement("div");
        div2.classList.add("contenedorInfo");
        div2.innerText = producto.info;
        contenedorInfo.append(div2);


        btnAgregar = document.querySelectorAll(".btnProductos");
        btnAgregar.forEach(boton => {
            boton.addEventListener("click", agregarProductoAlCarrito);
        });
    };