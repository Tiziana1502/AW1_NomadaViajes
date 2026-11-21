// Funciones de formato compartidas por el catálogo, el detalle y el carrito

// Convierte un número en precio: 420000 -> $420.000
function formatearPrecio(precio) {
    return "$" + precio.toLocaleString("es-AR")
}

// Convierte una fecha AAAA-MM-DD en DD/MM/AAAA: "2026-12-10" -> "10/12/2026"
function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split("-")
    return `${dia}/${mes}/${anio}`
}

// Pone la primera letra en mayúscula: "aventura" -> "Aventura"
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Evita que un texto escrito por el usuario se interprete como HTML al mostrarlo con innerHTML
// (por ejemplo, si alguien escribe <b> en su nombre se muestra tal cual y no en negrita)
function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}

export { formatearPrecio, formatearFecha, capitalizar, escaparHTML }
