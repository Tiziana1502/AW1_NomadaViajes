//Siempre los import van arriba de todo
// Ojo: la ruta tiene que coincidir EXACTAMENTE con el nombre del archivo.
// Si un import falla, el navegador no ejecuta nada de este módulo (ni el menú ni el catálogo)
import paquetes from "./paquetes.js" //no nombrada
import detalleViajes from "./detalleViajes.js" //no nombrada
import { iniciarCatalogo } from "./vistaCatalogo.js" //nombrada
import { iniciarDetalle } from "./vistaDetalle.js"
import { iniciarCarrito } from "./carrito.js"
import { iniciarFormulario } from "./formulario.js"

// Referenciamos elementos del DOM a partir de su ID
// Los 5 HTML cargan este archivo, por eso cada elemento se usa solo si existe en la página abierta
const encabezado = document.getElementById("encabezado-principal")
const botonAbrir = document.getElementById("boton-abrir")
const botonCerrar = document.getElementById("boton-cerrar")
const contenedorPaquetes = document.getElementById("contenedor-paquetes")
const formFiltros = document.getElementById("form-filtros")
const contenedorDetalle = document.getElementById("contenedor-detalle")
const formReserva = document.getElementById("form-reserva")

// Condicional para activar el MENÚ HAMBURGUESA
if (encabezado && botonAbrir && botonCerrar) {
    function cerrarMenu() {
        encabezado.classList.remove("menu-abierto")
        botonAbrir.setAttribute("aria-expanded", "false")
    }

    // Escuchador: el botón de las tres rayas abre el menú
    botonAbrir.addEventListener('click', () => {
        encabezado.classList.add("menu-abierto")
        botonAbrir.setAttribute("aria-expanded", "true")
        botonCerrar.focus()
    })

    // Escuchador: el botón de la cruz cierra el menú
    botonCerrar.addEventListener('click', () => {
        cerrarMenu()
        botonAbrir.focus()
    })

    // Escuchador: la tecla Escape también cierra el menú
    document.addEventListener('keydown', (evento) => {
        if (evento.key === "Escape") {
            cerrarMenu()
        }
    })
}

// CARRITO (está en el encabezado de todas las páginas)
iniciarCarrito()

// CATÁLOGO (solo existe en catalogo.html)
if (contenedorPaquetes && formFiltros) {
    iniciarCatalogo(contenedorPaquetes, formFiltros, paquetes)
}

// DETALLE (solo existe en detalle.html)
if (contenedorDetalle) {
    iniciarDetalle(contenedorDetalle, paquetes, detalleViajes)
}

// FORMULARIO DE RESERVA (solo existe en formulario.html)
if (formReserva) {
    iniciarFormulario(formReserva)
}
