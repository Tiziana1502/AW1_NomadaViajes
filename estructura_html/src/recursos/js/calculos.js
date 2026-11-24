// FUNCIONES PURAS DE NÓMADA VIAJES
// Una función pura siempre devuelve el mismo resultado para los mismos datos
// y no toca el DOM, localStorage ni fetch: por eso se puede probar con Node.js
// sin abrir el navegador (archivo de pruebas: estructura_html/tests/calculos.test.js)

const MINIMO_PERSONAS = 1
const MAXIMO_PERSONAS = 10

// Precio total de un paquete: precio por persona x cantidad de personas
// 420000 y 2 -> 840000
// Si los datos no son válidos lanza un error en lugar de devolver un precio incorrecto
function calcularPrecioTotal(precioPorPersona, cantidadPersonas) {
    if (typeof precioPorPersona !== "number" || !Number.isFinite(precioPorPersona) || precioPorPersona <= 0) {
        throw new TypeError("El precio por persona debe ser un número mayor a 0.")
    }
    if (!Number.isInteger(cantidadPersonas)) {
        throw new TypeError("La cantidad de personas debe ser un número entero.")
    }
    if (cantidadPersonas < MINIMO_PERSONAS || cantidadPersonas > MAXIMO_PERSONAS) {
        throw new RangeError(`La cantidad de personas debe estar entre ${MINIMO_PERSONAS} y ${MAXIMO_PERSONAS}.`)
    }
    return precioPorPersona * cantidadPersonas
}

// Valida el DNI del formulario de reserva (misma regla que formulario.js)
// Devuelve el mensaje de error, o "" si el DNI es válido
function validarDni(valor) {
    // Se aceptan puntos por si se escribe 12.345.678
    const dni = String(valor ?? "").trim().replace(/\./g, "")
    if (dni === "") {
        return "Ingresá tu DNI."
    }
    if (!/^\d{7,8}$/.test(dni)) {
        return "El DNI debe tener 7 u 8 números, sin letras."
    }
    return ""
}

// Exportación nombrada
export { calcularPrecioTotal, validarDni }
