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
        if (window.location.pathname.includes("index.html")) {
            window.location.href = "./html/resultados-busqueda.html";
        } else {
            window.location.href = "./resultados-busqueda.html";
        }
    }
});


//! CÓDIGO PARA LA PÁGINA DE RESULTADOS DE BÚSQUEDA
function cargarProductosFiltrados() {

    // Obtener el contenedor donde se mostrarán los productos
    contenedorProductos = document.getElementById("contenedorResultados");

    // Obtener los términos de búsqueda almacenados en el localStorage
    const terminos = localStorage.getItem("terminosBusqueda");

    // Filtrar los productos que coinciden con los términos de búsqueda
    const productosFiltrados = productos.filter(producto => {
        return producto.nombre.toLowerCase().includes(terminos.toLowerCase()) || producto.categorias.some(categoria => categoria.toLowerCase().includes(terminos.toLowerCase()));
    });


    mostrarProductos(productosFiltrados);
}