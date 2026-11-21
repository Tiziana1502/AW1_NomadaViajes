// CARRITO DE COMPRAS: vive en el ícono del encabezado de todas las páginas
// Persistencia de datos (clase 22): el carrito se guarda en localStorage para que no se pierda
// al recargar la página o al pasar de una página a otra.
// Todo lo que se guarda en localStorage es texto: por eso se usa JSON.stringify para guardar
// el arreglo y JSON.parse para volver a convertirlo en arreglo al leerlo.
import { formatearPrecio } from "./formato.js"

const CLAVE_CARRITO = "nomada-carrito"
const MINIMO_PERSONAS = 1
const MAXIMO_PERSONAS = 10

// Referencias del DOM (se completan en iniciarCarrito)
let elementos = null

// Función que se avisa cada vez que cambia el carrito (por ejemplo, el resumen del formulario)
let alCambiarCarrito = null

// Datos del carrito

// Lee el carrito guardado: el texto de localStorage se convierte en arreglo con JSON.parse
function obtenerCarrito() {
    try {
        const guardado = localStorage.getItem(CLAVE_CARRITO)
        return guardado ? JSON.parse(guardado) : []
    } catch (error) {
        return []
    }
}

// Guarda el carrito: el arreglo se convierte en texto con JSON.stringify
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

// La cantidad de personas siempre queda entre 1 y 10
function limitarPersonas(personas) {
    return Math.min(Math.max(personas, MINIMO_PERSONAS), MAXIMO_PERSONAS)
}

// Cada operación sigue los mismos pasos: leer de localStorage, modificar el arreglo,
// guardarlo de nuevo en localStorage y volver a dibujar la vista

// AGREGAR: si el paquete ya estaba en el carrito se suman las personas, si no se agrega
function agregarAlCarrito(paquete, personas) {
    const carrito = obtenerCarrito()
    const existente = carrito.find((item) => item.id === paquete.id)

    if (existente) {
        existente.personas = limitarPersonas(existente.personas + personas)
    } else {
        carrito.push({
            id: paquete.id,
            nombre: paquete.nombre,
            imagen: paquete.imagen,
            descripcionImagen: paquete.descripcionImagen,
            precio: paquete.precio,
            personas: limitarPersonas(personas)
        })
    }

    guardarCarrito(carrito)
    actualizarVista()
    abrirPanel()
}

// ACTUALIZAR CANTIDAD: cambia la cantidad de personas de un paquete
function actualizarPersonas(id, personas) {
    const carrito = obtenerCarrito()
    const item = carrito.find((elemento) => elemento.id === id)

    if (item && Number.isInteger(personas)) {
        item.personas = limitarPersonas(personas)
        guardarCarrito(carrito)
    }
    // Se vuelve a dibujar siempre, así un valor inválido escrito en el campo se corrige solo
    actualizarVista()
}

// QUITAR: elimina un paquete del carrito
function quitarDelCarrito(id) {
    const carrito = obtenerCarrito().filter((item) => item.id !== id)
    guardarCarrito(carrito)
    actualizarVista()
}

// VACIAR: elimina todos los paquetes (se usa en el botón "Vaciar carrito" y al confirmar la reserva)
function vaciarCarrito() {
    try {
        localStorage.removeItem(CLAVE_CARRITO)
    } catch (error) {
        // Si el navegador bloquea el almacenamiento no hay nada guardado para borrar
    }
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
                <p>${formatearPrecio(item.precio)} por persona</p>
                <label class="carrito-personas">
                    Personas
                    <input type="number" class="carrito-cantidad" data-id="${item.id}" value="${item.personas}"
                        min="${MINIMO_PERSONAS}" max="${MAXIMO_PERSONAS}" step="1">
                </label>
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
    if (elementos) {
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

    // Se avisa a quien lo necesite (por ejemplo, el resumen de la reserva en formulario.html)
    if (alCambiarCarrito) {
        alCambiarCarrito()
    }
}

function abrirPanel() {
    if (!elementos) {
        return
    }
    elementos.panel.hidden = false
    elementos.botonCarrito.setAttribute("aria-expanded", "true")
}

function cerrarPanel() {
    elementos.panel.hidden = true
    elementos.botonCarrito.setAttribute("aria-expanded", "false")
}

// La llama index.js en todas las páginas.
// Recibe, si hace falta, una función que se ejecuta cada vez que cambia el carrito
function iniciarCarrito(funcionAlCambiar) {
    alCambiarCarrito = funcionAlCambiar || null

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

    // Escuchador: al cambiar la cantidad de personas de un paquete
    elementos.lista.addEventListener("change", (evento) => {
        if (evento.target.classList.contains("carrito-cantidad")) {
            actualizarPersonas(evento.target.dataset.id, Number(evento.target.value))
        }
    })

    // Escuchador: botón "Vaciar carrito"
    const botonVaciar = document.getElementById("boton-vaciar")
    if (botonVaciar) {
        botonVaciar.addEventListener("click", () => {
            vaciarCarrito()
        })
    }

    // Escuchador: clic fuera del panel lo cierra
    // (document.contains descarta los botones "Quitar", que ya se borraron al volver a dibujar la lista)
    document.addEventListener("click", (evento) => {
        if (!panel.hidden && document.contains(evento.target)
            && !panel.contains(evento.target) && !botonCarrito.contains(evento.target)
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

export { iniciarCarrito, agregarAlCarrito, obtenerCarrito, calcularTotal, vaciarCarrito }
