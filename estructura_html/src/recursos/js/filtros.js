// filtros.js

function estaVacio(valor) {
    return valor === undefined || valor === null || valor === ""
}


function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")                  
        .replace(/[\u0300-\u036f]/g, "")   
        .trim()
        .replace(/\s+/g, "-")              
}


function filtrarPaquetes(paquetes, criterios) {
    return paquetes.filter((paquete) => {

        
        if (!estaVacio(criterios.destino)) {
            const buscado = normalizarTexto(criterios.destino)
            if (!normalizarTexto(paquete.destino).includes(buscado)) {
                return false
            }
        }

        
        if (!estaVacio(criterios.fechaDesde) && paquete.fechaSalida < criterios.fechaDesde) {
            return false
        }
        if (!estaVacio(criterios.fechaHasta) && paquete.fechaSalida > criterios.fechaHasta) {
            return false
        }

        
        if (!estaVacio(criterios.precioMin) && paquete.precio < Number(criterios.precioMin)) {
            return false
        }
        if (!estaVacio(criterios.precioMax) && paquete.precio > Number(criterios.precioMax)) {
            return false
        }

        
        if (criterios.tiposViaje && criterios.tiposViaje.length > 0) {
            if (!criterios.tiposViaje.includes(paquete.tipoViaje)) {
                return false
            }
        }

        
        return true
    })
}


function leerCriterios(formulario) {
    const datos = new FormData(formulario)

    return {
        destino: datos.get("destino") || "",
        fechaDesde: datos.get("fecha-desde") || "",
        fechaHasta: datos.get("fecha-hasta") || "",
        precioMin: datos.get("precio-min") || "",
        precioMax: datos.get("precio-max") || "",
        tiposViaje: datos.getAll("tipo-viaje")
    }
}


function iniciarFiltros(formulario, paquetes, alFiltrar) {
    
    if (!formulario) {
        return
    }

 
    function aplicarFiltros() {
        const criterios = leerCriterios(formulario)
        alFiltrar(filtrarPaquetes(paquetes, criterios))
    }

    // Escuchador: los filtros se aplican SOLO al tocar el botón "Filtrar"
    // (antes también se escuchaba el evento "input" y filtraba con cada clic en un campo)
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault()
        aplicarFiltros()
    })

    // Escuchador: el botón "Limpiar filtros" (type="reset") vacía el formulario y vuelve a mostrar todo.
    // El evento reset ocurre ANTES de que se borren los campos, por eso se usa setTimeout
    formulario.addEventListener("reset", () => {
        setTimeout(aplicarFiltros, 0)
    })
}

export { filtrarPaquetes, iniciarFiltros }