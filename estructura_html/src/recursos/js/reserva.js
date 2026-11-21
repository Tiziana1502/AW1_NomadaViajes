// PROCESO DE RESERVA: resumen del pedido, envío por WhatsApp y pantalla de confirmación
import { obtenerCarrito, calcularTotal, vaciarCarrito } from "./carrito.js"
import { formatearPrecio, formatearFecha, escaparHTML } from "./formato.js"
import { NUMERO_WHATSAPP, PORCENTAJE_SENA, URL_FORMSUBMIT } from "./config.js"

// La última reserva se guarda en localStorage para mostrarla en confirmacion.html
const CLAVE_ULTIMA_RESERVA = "nomada-ultima-reserva"

function calcularSena(total) {
    return Math.round(total * PORCENTAJE_SENA)
}

// RESUMEN (formulario.html): muestra los paquetes del carrito arriba del formulario
function renderizarResumen(contenedor) {
    const carrito = obtenerCarrito()

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <h2>Tu reserva</h2>
            <p class="resumen-vacio">
                Tu carrito está vacío. Podés enviar el formulario como consulta, o elegir un paquete en el
                <a href="./catalogo.html">catálogo</a> para reservarlo.
            </p>
        `
        return
    }

    const total = calcularTotal(carrito)
    let itemsHTML = ""
    carrito.forEach((item) => {
        itemsHTML += `
            <li>
                <span>${item.nombre} (${item.personas} ${item.personas === 1 ? "persona" : "personas"})</span>
                <strong>${formatearPrecio(item.precio * item.personas)}</strong>
            </li>
        `
    })

    contenedor.innerHTML = `
        <h2>Tu reserva</h2>
        <ul class="resumen-items">${itemsHTML}</ul>
        <p class="resumen-total">Total: <strong>${formatearPrecio(total)}</strong></p>
        <p>Seña para reservar (15%): <strong>${formatearPrecio(calcularSena(total))}</strong></p>
    `
}

// Si el campo "Destino de interés" está vacío, se completa con los paquetes del carrito
function completarDestino(campoDestino) {
    const carrito = obtenerCarrito()
    if (campoDestino && campoDestino.value.trim() === "" && carrito.length > 0) {
        campoDestino.value = carrito.map((item) => item.nombre).join(", ")
    }
}

// Número de reserva: año actual y los últimos 6 dígitos de la hora en milisegundos
function generarNumeroReserva() {
    const ahora = new Date()
    return `NV-${ahora.getFullYear()}-${String(ahora.getTime()).slice(-6)}`
}

// Arma el texto del mensaje de WhatsApp con los datos del viajero y el detalle del pedido
function armarMensaje(reserva) {
    const cliente = reserva.cliente
    const lineas = []

    lineas.push(reserva.tipo === "reserva"
        ? `Hola Nómada Viajes, quiero confirmar la reserva ${reserva.numero}.`
        : `Hola Nómada Viajes, quiero hacer una consulta (${reserva.numero}).`)
    lineas.push("")
    lineas.push(`Nombre: ${cliente.nombre}`)
    lineas.push(`DNI: ${cliente.dni}`)
    lineas.push(`Email: ${cliente.email}`)
    lineas.push(`Teléfono: ${cliente.telefono}`)
    if (cliente.destino !== "") {
        lineas.push(`Destino de interés: ${cliente.destino}`)
    }
    if (cliente.fecha !== "") {
        lineas.push(`Fecha estimada de viaje: ${formatearFecha(cliente.fecha)}`)
    }

    if (reserva.tipo === "reserva") {
        lineas.push("")
        lineas.push("Paquetes:")
        reserva.items.forEach((item) => {
            lineas.push(`- ${item.nombre}: ${item.personas} x ${formatearPrecio(item.precio)} = ${formatearPrecio(item.precio * item.personas)}`)
        })
        lineas.push(`Total: ${formatearPrecio(reserva.total)}`)
        lineas.push(`Seña (15%): ${formatearPrecio(reserva.sena)}`)
    }

    if (cliente.mensaje !== "") {
        lineas.push("")
        lineas.push(`Mensaje: ${cliente.mensaje}`)
    }

    return lineas.join("\n")
}

// ENVÍO DE MAIL con FormSubmit: es un POST con fetch al servicio, que reenvía los datos por mail al correo
// de la agencia (EMAIL_RESERVAS en config.js). Devuelve true si el mail se envió y false si falló
async function enviarMail(reserva) {
    const cliente = reserva.cliente

    // Los datos viajan como JSON. Los campos que empiezan con _ son opciones de FormSubmit
    const datos = {
        _subject: `Nueva ${reserva.tipo} ${reserva.numero} - ${cliente.nombre}`,
        _template: "table",
        _captcha: "false",
        numero: reserva.numero,
        tipo: reserva.tipo,
        nombre: cliente.nombre,
        dni: cliente.dni,
        email: cliente.email, // FormSubmit lo usa como dirección de respuesta
        telefono: cliente.telefono,
        destino_de_interes: cliente.destino,
        fecha_estimada: cliente.fecha !== "" ? formatearFecha(cliente.fecha) : "",
        paquetes: reserva.items.map((item) => `${item.nombre}: ${item.personas} x ${formatearPrecio(item.precio)}`).join(" | "),
        total: formatearPrecio(reserva.total),
        sena: formatearPrecio(reserva.sena),
        mensaje: cliente.mensaje
    }

    // Si el servicio no responde en 8 segundos se cancela, para no dejar al usuario esperando
    const controlador = new AbortController()
    const temporizador = setTimeout(() => controlador.abort(), 8000)

    try {
        const respuesta = await fetch(URL_FORMSUBMIT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(datos),
            signal: controlador.signal
        })

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status} al enviar el mail`)
        }

        const resultado = await respuesta.json()
        // FormSubmit responde { success: "true" } cuando el mail se envió
        return resultado.success === true || resultado.success === "true"
    } catch (error) {
        console.error("No se pudo enviar el mail:", error)
        return false
    } finally {
        clearTimeout(temporizador)
    }
}

// Guarda la reserva para mostrarla en la página de confirmación
function guardarReserva(reserva) {
    try {
        localStorage.setItem(CLAVE_ULTIMA_RESERVA, JSON.stringify(reserva))
    } catch (error) {
        // Sin almacenamiento, la página de confirmación muestra un mensaje genérico
    }
}

// CONFIRMAR (formulario.html): la llama formulario.js cuando todos los datos son válidos
async function confirmarReserva(datosCliente) {
    const carrito = obtenerCarrito()
    const total = calcularTotal(carrito)

    const reserva = {
        numero: generarNumeroReserva(),
        tipo: carrito.length > 0 ? "reserva" : "consulta",
        cliente: datosCliente,
        items: carrito,
        total: total,
        sena: calcularSena(total)
    }

    // 1) Envío: se arma el enlace de la API de WhatsApp con el mensaje codificado para la dirección
    reserva.urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(armarMensaje(reserva))}`

    // 2) WhatsApp se abre ANTES de esperar al mail: si se abre después de un await, el navegador
    // puede bloquear la ventana porque ya no la asocia con el clic del usuario
    window.open(reserva.urlWhatsApp, "_blank", "noopener")

    // 3) Se envía el mail con FormSubmit y se guarda si salió bien o no
    reserva.mailEnviado = await enviarMail(reserva)

    // 4) Se guarda la reserva para mostrarla en la página de confirmación
    guardarReserva(reserva)

    // 5) Se vacía el carrito (en localStorage y en el ícono del encabezado) y se pasa a la confirmación
    vaciarCarrito()
    window.location.href = "./confirmacion.html"
}

// CONFIRMACIÓN (confirmacion.html): muestra la notificación con los datos de la última reserva
function renderizarConfirmacion(contenedor) {
    let reserva = null
    try {
        const guardada = localStorage.getItem(CLAVE_ULTIMA_RESERVA)
        reserva = guardada ? JSON.parse(guardada) : null
    } catch (error) {
        reserva = null
    }

    if (!reserva) {
        contenedor.innerHTML = `
            <h1>Todavía no hay reservas</h1>
            <p>Cuando completes el formulario de reserva vas a ver acá la confirmación.</p>
            <a href="./catalogo.html" class="boton">Ver paquetes</a>
        `
        return
    }

    const nombre = escaparHTML(reserva.cliente.nombre)
    const email = escaparHTML(reserva.cliente.email)
    let detalleHTML = ""

    if (reserva.tipo === "reserva") {
        let itemsHTML = ""
        reserva.items.forEach((item) => {
            itemsHTML += `<li>${item.nombre}: ${item.personas} ${item.personas === 1 ? "persona" : "personas"}, ${formatearPrecio(item.precio * item.personas)}</li>`
        })
        detalleHTML = `
            <ul class="confirmacion-items">${itemsHTML}</ul>
            <p><strong>Total:</strong> ${formatearPrecio(reserva.total)}</p>
            <p>
                Para asegurar tu lugar, la seña es de <strong>${formatearPrecio(reserva.sena)}</strong> (15% del total).
                Un asesor te va a contactar por WhatsApp para coordinar el pago y el saldo restante.
            </p>
        `
    }

    contenedor.innerHTML = `
        <h1>${reserva.tipo === "reserva" ? "¡Reserva confirmada!" : "¡Consulta enviada!"}</h1>
        <p><strong>Número de ${reserva.tipo}:</strong> ${reserva.numero}</p>
        <p>Gracias, ${nombre}. Abrimos WhatsApp con el detalle para que lo envíes. Un asesor también se va a comunicar con vos por teléfono o por correo a ${email}.</p>
        <p class="${reserva.mailEnviado ? "aviso-mail" : "aviso-mail aviso-mail-error"}">
            ${reserva.mailEnviado
                ? `Registramos tu ${reserva.tipo} en la agencia por correo electrónico.`
                : `No pudimos registrar el correo electrónico en la agencia. Enviá el detalle por WhatsApp para completar tu ${reserva.tipo}.`}
        </p>
        ${detalleHTML}
        <a href="${reserva.urlWhatsApp}" class="boton boton-secundario" target="_blank" rel="noopener">
            Abrir WhatsApp de nuevo
        </a>
        <a href="./index.html" class="boton">
            Volver al inicio
        </a>
    `
}

export { renderizarResumen, completarDestino, confirmarReserva, renderizarConfirmacion }
