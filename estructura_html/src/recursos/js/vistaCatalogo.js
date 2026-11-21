//importa filtros.js
import { iniciarFiltros } from "./filtros.js"
import { formatearPrecio, formatearFecha, capitalizar } from "./formato.js"

function renderizarPaquetes(contenedor, /*es la referencia del DOM*/ paquetes /*es el arreglo*/) {

    // Si no hay resultados se muestra un mensaje en lugar de la grilla
    if (paquetes.length === 0) {
        contenedor.innerHTML = `<p>No hay paquetes que coincidan con los filtros elegidos.</p>`
        return
    }

    let paquetesHTML = ''
    paquetes.forEach((paquete) => {
        paquetesHTML += `
        <article class="tarjeta-paquete">
            <img src="${paquete.imagen}" alt="${paquete.descripcionImagen}" width="400">
            <div class="tarjeta-cuerpo">
                <p class="tarjeta-etiqueta">Paquete · ${capitalizar(paquete.tipoViaje)}</p>
                <h3>${paquete.nombre}</h3>
                <p class="tarjeta-datos">${paquete.noches} noches · Salida ${formatearFecha(paquete.fechaSalida)}</p>
                <p class="tarjeta-precio-texto">Precio final por persona</p>
                <p class="tarjeta-precio">${formatearPrecio(paquete.precio)}</p>
                <a href="./detalle.html?id=${paquete.id}" class="boton boton-vinculo">
                    Ver detalle
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.5"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </a>
            </div>
        </article>
        `
    })
    contenedor.innerHTML = paquetesHTML
}

// La llama index.js: dibuja todo el catálogo y deja listos los filtros
function iniciarCatalogo(contenedor, formulario, paquetes) {
    // 1) Renderizamos todos los paquetes
    renderizarPaquetes(contenedor, paquetes)

    // 2) filtros.js escucha el formulario y llama a esta función con el arreglo ya filtrado
    iniciarFiltros(formulario, paquetes, (paquetesFiltrados) => {
        renderizarPaquetes(contenedor, paquetesFiltrados)
    })
}

// 2: Exportación nombrada -> las que sean necesarias
export { renderizarPaquetes, iniciarCatalogo }
