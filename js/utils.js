//! CREO ARRAY DE PRODUCTOS
// Array que contiene información sobre los productos disponibles
let productos = [];

fetch("data/productos.json")
    .then(res => res.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

//! LLAMADOS DEL DOM
const contenedorHomeProductos = document.querySelector("#contenedorHomeProductos");
let btnAgregar;
const contenedorResultados = document.querySelector(".contenedorResultados");

//! FUNCIÓN PARA CARGAR PRODUCTOS

function cargarProductos(origenProductos) {
    // Iterar sobre cada producto y agregarlo al DOM
    origenProductos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("card", "cardIndividual", "col-xl-3", "col-md-6", "col-sm-12", "h-100");
        div.innerHTML = `
    <img src="${producto.imagen}" class="card-img-top mx-auto" alt="${producto.nombre}">
    <h2 class="card-title nombreProducto">${producto.nombre}</h2>
    <h3> <span> $${producto.precioAnterior.toLocaleString()} </span> | $${producto.precio.toLocaleString()} </h3>
    <button type="button" class="btnProductos" id="${producto.id}"> Añadir al Carrito </button>
    `;
        if (contenedorHomeProductos) {
            contenedorHomeProductos.append(div);
        }; 

        if (contenedorResultados) {
            contenedorResultados.append(div);
        }
    });

    btnAgregar = document.querySelectorAll(".btnProductos");
    btnAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProductoAlCarrito);
    });

};

