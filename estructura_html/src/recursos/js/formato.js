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

export { formatearPrecio, formatearFecha, capitalizar }
