// CARRITO DE COMPRAS: vive en el ícono del encabezado de todas las páginas
// Se guarda en localStorage para que no se pierda al pasar de una página a otra
import { formatearPrecio } from "./formato.js"

const CLAVE_CARRITO = "nomada-carrito"

// Referencias del DOM (se completan en iniciarCarrito)
let elementos = null

// Datos del carrito

function obtenerCarrito() {
    try {
        const guardado = localStorage.getItem(CLAVE_CARRITO)
        return guardado ? JSON.parse(guardado) : []
    } catch (error) {
        return []
    }
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
    } catch (error) {
        // Si el navegador bloquea el almacenamiento, el carrito solo dura mientras la página esté abierta
    }
}

function calcularTotal(carrito) {
    return carrito.reduce((total, item) => total + item.precio * item.personas, 0)
}

// Si el paquete ya estaba en el carrito se suman las personas, si no se agrega
function agregarAlCarrito(paquete, personas) {
    const carrito = obtenerCarrito()
    const existente = carrito.find((item) => item.id === paquete.id)

    if (existente) {
        existente.personas += personas
    } else {
        carrito.push({
            id: paquete.id,
            nombre: paquete.nombre,
            imagen: paquete.imagen,
            descripcionImagen: paquete.descripcionImagen,
            precio: paquete.precio,
            personas: personas
        })
    }

    guardarCarrito(carrito)
    actualizarVista()
    abrirPanel()
}

function quitarDelCarrito(id) {
    const carrito = obtenerCarrito().filter((item) => item.id !== id)
    guardarCarrito(carrito)
    actualizarVista()
}

// Vista del carrito

function renderizarItems(carrito) {
    let itemsHTML = ""
    carrito.forEach((item) => {
        itemsHTML += `
        <li class="carrito-item">
            <img src="${item.imagen}" alt="${item.descripcionImagen}" width="80">
            <div class="carrito-datos">
                <h3>${item.nombre}</h3>
                <p>${item.personas} ${item.personas === 1 ? "persona" : "personas"} × ${formatearPrecio(item.precio)}</p>
                <p class="carrito-precio">${formatearPrecio(item.precio * item.personas)}</p>
            </div>
            <button type="button" class="boton boton-contorno boton-chico boton-quitar" data-id="${item.id}"
                aria-label="Quitar ${item.nombre} del carrito">
                Quitar
            </button>
        </li>
        `
    })
    return itemsHTML
}

function actualizarVista() {
    if (!elementos) {
        return
    }
    const carrito = obtenerCarrito()
    const total = calcularTotal(carrito)
    const cantidad = carrito.length
    const estaVacio = cantidad === 0

    // Ícono: contador de paquetes y total al lado
    elementos.contador.textContent = cantidad
    elementos.contador.hidden = estaVacio
    elementos.resumen.textContent = formatearPrecio(total)
    elementos.resumen.hidden = estaVacio
    elementos.botonCarrito.setAttribute("aria-label",
        estaVacio ? "Carrito vacío" : `Carrito: ${cantidad} ${cantidad === 1 ? "paquete" : "paquetes"}, total ${formatearPrecio(total)}`)

    // Panel desplegable
    elementos.lista.innerHTML = renderizarItems(carrito)
    elementos.vacio.hidden = !estaVacio
    elementos.pieTotal.hidden = estaVacio
    elementos.subtotal.textContent = formatearPrecio(total)
}

function abrirPanel() {
    elementos.panel.hidden = false
    elementos.botonCarrito.setAttribute("aria-expanded", "true")
}

function cerrarPanel() {
    elementos.panel.hidden = true
    elementos.botonCarrito.setAttribute("aria-expanded", "false")
}

// La llama index.js en todas las páginas
function iniciarCarrito() {
    const botonCarrito = document.getElementById("boton-carrito")
    const panel = document.getElementById("panel-carrito")
    if (!botonCarrito || !panel) {
        return
    }

    elementos = {
        botonCarrito,
        panel,
        contador: document.getElementById("carrito-contador"),
        resumen: document.getElementById("carrito-resumen"),
        lista: document.getElementById("carrito-items"),
        vacio: document.getElementById("carrito-vacio"),
        pieTotal: document.getElementById("carrito-total"),
        subtotal: document.getElementById("carrito-subtotal")
    }

    actualizarVista()

    // Escuchador: el ícono abre y cierra el panel
    botonCarrito.addEventListener("click", () => {
        if (panel.hidden) {
            abrirPanel()
        } else {
            cerrarPanel()
        }
    })

    // Escuchador: los botones "Quitar" (delegación, porque se crean con JS)
    elementos.lista.addEventListener("click", (evento) => {
        const boton = evento.target.closest(".boton-quitar")
        if (boton) {
            quitarDelCarrito(boton.dataset.id)
        }
    })

    // Escuchador: clic fuera del panel lo cierra
    document.addEventListener("click", (evento) => {
        if (!panel.hidden && !panel.contains(evento.target) && !botonCarrito.contains(evento.target)
            && !evento.target.closest("#boton-agregar")) {
            cerrarPanel()
        }
    })

    // Escuchador: la tecla Escape también lo cierra
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !panel.hidden) {
            cerrarPanel()
            botonCarrito.focus()
        }
    })

    // Escuchador: si el carrito cambia en otra pestaña se actualiza
    window.addEventListener("storage", (evento) => {
        if (evento.key === CLAVE_CARRITO) {
            actualizarVista()
        }
    })
}

export { iniciarCarrito, agregarAlCarrito }
