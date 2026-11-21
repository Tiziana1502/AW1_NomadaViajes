//Siempre los import van arriba de todo
// Ojo: la ruta tiene que coincidir EXACTAMENTE con el nombre del archivo.
// Si un import falla, el navegador no ejecuta nada de este módulo (ni el menú ni el catálogo)
import { URL_PAQUETES, URL_DETALLE_VIAJES } from "./config.js"
import { obtenerDatos } from "./paquetes.js"
import { iniciarCatalogo } from "./vistaCatalogo.js" //nombrada
import { iniciarDetalle } from "./vistaDetalle.js"
import { iniciarCarrito } from "./carrito.js"
import { iniciarFormulario } from "./formulario.js"
import { renderizarResumen, completarDestino, confirmarReserva, renderizarConfirmacion } from "./reserva.js"

// Referenciamos elementos del DOM a partir de su ID
// Los 5 HTML cargan este archivo, por eso cada elemento se usa solo si existe en la página abierta
const encabezado = document.getElementById("encabezado-principal")
const botonAbrir = document.getElementById("boton-abrir")
const botonCerrar = document.getElementById("boton-cerrar")
const contenedorPaquetes = document.getElementById("contenedor-paquetes")
const formFiltros = document.getElementById("form-filtros")
const contenedorDetalle = document.getElementById("contenedor-detalle")
const formReserva = document.getElementById("form-reserva")
const resumenPedido = document.getElementById("resumen-pedido")
const resumenReserva = document.getElementById("resumen-reserva")

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
// En formulario.html, cada cambio del carrito vuelve a dibujar el resumen de la reserva
iniciarCarrito(() => {
    if (resumenPedido) {
        renderizarResumen(resumenPedido)
    }
})

// FORMULARIO DE RESERVA (solo existe en formulario.html)
if (formReserva) {
    completarDestino(document.getElementById("destino"))
    iniciarFormulario(formReserva, confirmarReserva)
}

// CONFIRMACIÓN (solo existe en confirmacion.html)
if (resumenReserva) {
    renderizarConfirmacion(resumenReserva)
}

// Mensaje que se muestra si no se pudieron leer los archivos JSON
const MENSAJE_ERROR_DATOS = `
    <p class="mensaje-error-datos">
        No se pudieron cargar los paquetes. Revisá tu conexión y volvé a intentarlo en unos minutos.
    </p>
`

// CATÁLOGO (solo existe en catalogo.html)
// Los datos se piden al archivo JSON con fetch (clase 21) y recién después se dibuja el catálogo
if (contenedorPaquetes && formFiltros) {
    const paquetes = await obtenerDatos(URL_PAQUETES)

    if (paquetes) {
        iniciarCatalogo(contenedorPaquetes, formFiltros, paquetes)
    } else {
        contenedorPaquetes.innerHTML = MENSAJE_ERROR_DATOS
    }
}

// DETALLE (solo existe en detalle.html): necesita los paquetes y el detalle de cada viaje
if (contenedorDetalle) {
    const paquetes = await obtenerDatos(URL_PAQUETES)
    const detalles = await obtenerDatos(URL_DETALLE_VIAJES)

    if (paquetes && detalles) {
        iniciarDetalle(contenedorDetalle, paquetes, detalles)
    } else {
        contenedorDetalle.innerHTML = `<h1>Detalle del paquete</h1>${MENSAJE_ERROR_DATOS}`
    }
}
