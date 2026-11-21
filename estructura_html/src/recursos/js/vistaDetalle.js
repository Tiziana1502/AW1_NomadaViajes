// VISTA DE DETALLE: dibuja en detalle.html el paquete elegido
// El paquete se elige con el parámetro de la URL: detalle.html?id=bariloche
// Arriba hay un selector con todos los destinos: al tocar uno se cambia el detalle sin recargar la página
import { formatearPrecio, formatearFecha, capitalizar } from "./formato.js"
import { agregarAlCarrito } from "./carrito.js"

// Se recuerda el último paquete visto para mostrarlo al entrar desde el menú (sin ?id=)
const CLAVE_ULTIMO_VISTO = "nomada-ultimo-paquete"

function leerUltimoVisto() {
    try {
        return localStorage.getItem(CLAVE_ULTIMO_VISTO)
    } catch (error) {
        return null
    }
}

function guardarUltimoVisto(id) {
    try {
        localStorage.setItem(CLAVE_ULTIMO_VISTO, id)
    } catch (error) {
        // Si el navegador bloquea el almacenamiento simplemente no se recuerda
    }
}

// Arma los <li> de una lista a partir de un arreglo de textos
function crearItems(textos) {
    return textos.map((texto) => `<li>${texto}</li>`).join("")
}

// Pastillas con todos los destinos; la del paquete actual queda marcada
function crearSelector(paquetes, idActual) {
    const vinculos = paquetes.map((paquete) => `
        <a href="./detalle.html?id=${paquete.id}" data-id="${paquete.id}"
            ${paquete.id === idActual ? 'aria-current="page"' : ""}>${paquete.destino}</a>
    `).join("")
    return `<nav class="selector-destinos" aria-label="Elegí un destino">${vinculos}</nav>`
}

function renderizarDetalle(contenedor, paquetes, paquete, detalle) {
    contenedor.innerHTML = `
        ${crearSelector(paquetes, paquete.id)}
        <h1>${paquete.nombre}</h1>
        <section class="galeria">
            <ul>
                <li>Destino: ${detalle.ubicacion}</li>
                <li>Duración: ${detalle.duracion}</li>
                <li>Fecha de salida: ${formatearFecha(paquete.fechaSalida)}</li>
                <li>Tipo de viaje: ${capitalizar(paquete.tipoViaje)}</li>
            </ul>
            <img src="${paquete.imagen}" alt="${detalle.descripcionImagen}" width="400">
        </section>

        <section class="itinerario">
            <h2>Descripción del itinerario</h2>
            <ul>${crearItems(detalle.itinerario)}</ul>
        </section>
        <section class="incluye">
            <h2>Qué incluye</h2>
            <ul>${crearItems(detalle.incluye)}</ul>
        </section>
        <section class="no-incluye">
            <h2>Qué no incluye</h2>
            <ul>${crearItems(detalle.noIncluye)}</ul>
        </section>
        <section class="reserva">
            <h2>Reservá tu lugar</h2>
            <p class="precio-final">
                ${formatearPrecio(paquete.precio)} <span>por persona</span>
            </p>
            <div class="campo-personas">
                <label for="id-personas">Cantidad de personas</label>
                <input type="number" name="personas" id="id-personas" min="1" max="10" value="2">
            </div>
            <button type="button" class="boton" id="boton-agregar">
                Agregar al carrito
            </button>
            <p class="mensaje-reserva" id="mensaje-reserva" role="status"></p>
        </section>
    `
}

function renderizarNoEncontrado(contenedor, paquetes) {
    contenedor.innerHTML = `
        ${crearSelector(paquetes, null)}
        <h1>Paquete no encontrado</h1>
        <p>El paquete que buscás no existe o ya no está disponible. Elegí uno de los destinos de arriba.</p>
        <a href="./catalogo.html" class="boton">Ver todos los paquetes</a>
    `
}

// La llama index.js solo en detalle.html
function iniciarDetalle(contenedor, paquetes, detalles) {
    let paqueteActual = null

    // Busca el paquete y lo dibuja. Devuelve false si no existe
    function mostrarPaquete(id) {
        const paquete = paquetes.find((item) => item.id === id)
        const detalle = detalles.find((item) => item.id === id)

        if (!paquete || !detalle) {
            paqueteActual = null
            document.title = "Nómada Viajes - Detalle"
            renderizarNoEncontrado(contenedor, paquetes)
            return false
        }

        paqueteActual = paquete
        document.title = `Nómada Viajes - ${paquete.nombre}`
        guardarUltimoVisto(paquete.id)
        renderizarDetalle(contenedor, paquetes, paquete, detalle)
        return true
    }

    // Prioridad: ?id= de la URL, después el último paquete visto, y si no el primero
    function idInicial() {
        const idUrl = new URLSearchParams(window.location.search).get("id")
        if (idUrl) {
            return idUrl
        }
        const ultimo = leerUltimoVisto()
        return paquetes.some((item) => item.id === ultimo) ? ultimo : paquetes[0].id
    }

    const id = idInicial()
    mostrarPaquete(id)
    // Se deja el id en la URL para poder compartir o recargar el mismo paquete
    history.replaceState({ id }, "", `?id=${id}`)

    // Escuchador (delegación): las pastillas del selector y el botón "Agregar al carrito"
    // se vuelven a crear en cada cambio, por eso se escucha en el contenedor
    contenedor.addEventListener("click", (evento) => {
        const vinculo = evento.target.closest(".selector-destinos a")
        if (vinculo) {
            evento.preventDefault()
            const nuevoId = vinculo.dataset.id
            if (!paqueteActual || nuevoId !== paqueteActual.id) {
                mostrarPaquete(nuevoId)
                history.pushState({ id: nuevoId }, "", `?id=${nuevoId}`)
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
            return
        }

        if (evento.target.closest("#boton-agregar") && paqueteActual) {
            const campoPersonas = contenedor.querySelector("#id-personas")
            const mensaje = contenedor.querySelector("#mensaje-reserva")
            const personas = Number(campoPersonas.value)

            if (!Number.isInteger(personas) || personas < 1 || personas > 10) {
                mensaje.textContent = "Elegí entre 1 y 10 personas."
                mensaje.classList.add("mensaje-error")
                campoPersonas.focus()
                return
            }

            agregarAlCarrito(paqueteActual, personas)
            mensaje.classList.remove("mensaje-error")
            mensaje.textContent = `Agregaste ${paqueteActual.nombre} (${personas} ${personas === 1 ? "persona" : "personas"}) al carrito.`
        }
    })

    // Escuchador: los botones atrás/adelante del navegador vuelven al paquete anterior
    window.addEventListener("popstate", (evento) => {
        const idHistorial = (evento.state && evento.state.id)
            || new URLSearchParams(window.location.search).get("id")
            || paquetes[0].id
        mostrarPaquete(idHistorial)
    })
}

export { iniciarDetalle }
