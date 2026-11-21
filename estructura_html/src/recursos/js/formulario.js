// FORMULARIO DE RESERVA: eventos de envío y validaciones
// index.js llama a iniciarFormulario(formReserva) solo si existe el formulario en la página

//Funciones de validación
// Cada una recibe el texto del campo y devuelve el mensaje de error, o "" si está bien

function validarNombre(valor) {
    if (valor.trim() === "") {
        return "Ingresá tu nombre y apellido."
    }
    if (valor.trim().length < 3) {
        return "El nombre es demasiado corto."
    }
    // Solo letras (con tildes y ñ), espacios, apóstrofes y guiones
    if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ' -]+$/.test(valor.trim())) {
        return "El nombre solo puede tener letras y espacios."
    }
    return ""
}

function validarDni(valor) {
    // Se aceptan puntos por si escribe 12.345.678
    const dni = valor.trim().replace(/\./g, "")
    if (dni === "") {
        return "Ingresá tu DNI."
    }
    if (!/^\d{7,8}$/.test(dni)) {
        return "El DNI debe tener 7 u 8 números, sin letras."
    }
    return ""
}

function validarEmail(valor) {
    if (valor.trim() === "") {
        return "Ingresá tu correo electrónico."
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) {
        return "Ingresá un correo válido, por ejemplo nombre@correo.com."
    }
    return ""
}

function validarTelefono(valor) {
    if (valor.trim() === "") {
        return "Ingresá tu teléfono de contacto."
    }
    // Se permiten espacios, guiones, paréntesis y + al escribirlo
    if (!/^[\d\s()+-]+$/.test(valor.trim())) {
        return "El teléfono solo puede tener números, espacios, guiones y paréntesis."
    }
    const cantidadNumeros = valor.replace(/\D/g, "").length
    if (cantidadNumeros < 8 || cantidadNumeros > 15) {
        return "El teléfono debe tener entre 8 y 15 números."
    }
    return ""
}

// Arma la fecha de hoy como AAAA-MM-DD (el mismo formato que devuelve input type="date")
function obtenerFechaHoy() {
    const hoy = new Date()
    const mes = String(hoy.getMonth() + 1).padStart(2, "0")
    const dia = String(hoy.getDate()).padStart(2, "0")
    return `${hoy.getFullYear()}-${mes}-${dia}`
}

function validarFecha(valor) {
    // La fecha es opcional: si está vacía no se valida
    if (valor === "") {
        return ""
    }
    if (valor < obtenerFechaHoy()) {
        return "La fecha de viaje no puede ser anterior a hoy."
    }
    return ""
}

// Destino y mensaje son opcionales: solo se revisan las reglas del HTML (largo máximo)
function sinValidacionPropia() {
    return ""
}

//Funciones para mostrar y borrar errores 

// Muestra el mensaje debajo del campo (lo crea la primera vez)
function mostrarError(campo, mensaje) {
    let elementoError = campo.parentElement.querySelector(".mensaje-error")
    if (!elementoError) {
        elementoError = document.createElement("p")
        elementoError.className = "mensaje-error"
        elementoError.id = `error-${campo.id}`
        campo.insertAdjacentElement("afterend", elementoError)
    }
    elementoError.textContent = mensaje
    campo.setAttribute("aria-invalid", "true")
    campo.setAttribute("aria-describedby", elementoError.id)
}

function limpiarError(campo) {
    const elementoError = campo.parentElement.querySelector(".mensaje-error")
    if (elementoError) {
        elementoError.remove()
    }
    campo.removeAttribute("aria-invalid")
    campo.removeAttribute("aria-describedby")
}

// Función principal 

// Lee los datos del formulario con FormData (igual que filtros.js)
function leerDatos(formulario) {
    const datos = new FormData(formulario)
    return {
        nombre: datos.get("nombre").trim(),
        dni: datos.get("dni").trim(),
        email: datos.get("email").trim(),
        telefono: datos.get("telefono").trim(),
        destino: datos.get("destino").trim(),
        fecha: datos.get("fecha"),
        mensaje: datos.get("mensaje").trim()
    }
}

// Función principal
// Recibe el formulario y la función que se ejecuta cuando todos los datos son válidos
function iniciarFormulario(formulario, alConfirmar) {
    // Referenciamos los campos a partir de su ID
    const campoNombre = formulario.querySelector("#nombre")
    const campoDni = formulario.querySelector("#dni")
    const campoEmail = formulario.querySelector("#email")
    const campoTelefono = formulario.querySelector("#telefono")
    const campoDestino = formulario.querySelector("#destino")
    const campoFecha = formulario.querySelector("#fecha")
    const campoMensaje = formulario.querySelector("#mensaje")
    const mensajeFormulario = formulario.querySelector("#mensaje-formulario")

    // Cada campo con su función de validación
    const validaciones = [
        { campo: campoNombre, validar: validarNombre },
        { campo: campoDni, validar: validarDni },
        { campo: campoEmail, validar: validarEmail },
        { campo: campoTelefono, validar: validarTelefono },
        { campo: campoDestino, validar: sinValidacionPropia },
        { campo: campoFecha, validar: validarFecha },
        { campo: campoMensaje, validar: sinValidacionPropia }
    ]

    // Validación nativa de HTML5: el calendario no deja elegir fechas anteriores a hoy
    campoFecha.min = obtenerFechaHoy()

    // Desactivamos los avisos emergentes del navegador para mostrar los mensajes en la página.
    // Las reglas del HTML (required, minlength, maxlength, pattern, min) se siguen revisando
    // con checkValidity dentro de validarCampo
    formulario.setAttribute("novalidate", "")

    // Valida un campo y muestra o borra su error. Devuelve true si está bien
    function validarCampo(item) {
        // 1) Validación propia, con mensajes claros para cada campo
        let mensaje = item.validar(item.campo.value)
        // 2) Si la propia está bien, se revisan las reglas nativas de HTML5 del campo
        if (mensaje === "" && !item.campo.checkValidity()) {
            mensaje = item.campo.validationMessage
        }
        if (mensaje !== "") {
            mostrarError(item.campo, mensaje)
            return false
        }
        limpiarError(item.campo)
        return true
    }

    // Escuchadores: al salir de un campo se valida; al escribir se borra el error mostrado
    validaciones.forEach((item) => {
        item.campo.addEventListener("blur", () => {
            validarCampo(item)
        })
        item.campo.addEventListener("input", () => {
            if (item.campo.getAttribute("aria-invalid") === "true") {
                validarCampo(item)
            }
        })
    })

    // Escuchador: al enviar se validan todos los campos
    formulario.addEventListener("submit", async (evento) => {
        // El envío lo maneja JavaScript (WhatsApp + confirmación), por eso la página no se recarga
        evento.preventDefault()

        let primerCampoConError = null
        let cantidadErrores = 0

        validaciones.forEach((item) => {
            const esValido = validarCampo(item)
            if (!esValido) {
                cantidadErrores++
                if (primerCampoConError === null) {
                    primerCampoConError = item.campo
                }
            }
        })

        // Si hay errores se avisa arriba del botón y se lleva al usuario al primer campo con error
        if (primerCampoConError !== null) {
            mensajeFormulario.textContent = cantidadErrores === 1
                ? "Hay 1 campo para corregir."
                : `Hay ${cantidadErrores} campos para corregir.`
            primerCampoConError.focus()
            return
        }

        // Si todo está bien se pasan los datos a la función que confirma la reserva.
        // Mientras se envía, el botón queda desactivado para que no se mande dos veces
        const botonEnviar = formulario.querySelector("button[type=submit]")
        const textoBoton = botonEnviar.textContent
        botonEnviar.disabled = true
        botonEnviar.textContent = "Enviando..."
        mensajeFormulario.textContent = ""

        try {
            await alConfirmar(leerDatos(formulario))
        } catch (error) {
            console.error("No se pudo confirmar la reserva:", error)
            mensajeFormulario.textContent = "No se pudo enviar la reserva. Volvé a intentarlo."
            botonEnviar.disabled = false
            botonEnviar.textContent = textoBoton
        }
    })
}

export { iniciarFormulario }
export default iniciarFormulario