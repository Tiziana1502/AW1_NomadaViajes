// Los datos de los paquetes ya no están escritos acá: se guardan en recursos/datos/paquetes.json
// (y el detalle de cada viaje en recursos/datos/detalleViajes.json) y se piden con fetch

// async / await: obtener los datos almacenados en un archivo JSON
// Devuelve el arreglo de datos, o null si no se pudieron cargar
async function obtenerDatos(url) {
    try {
        const respuesta = await fetch(url)

        // fetch solo da error si no hay conexión. Si el archivo no existe (error 404)
        // la respuesta llega igual, por eso se revisa respuesta.ok
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status} al pedir ${url}`)
        }

        const datos = await respuesta.json() // <-- 1) obtiene los datos del cuerpo
                                             //     2) transforma el JSON en un arreglo de JS
        return datos
    } catch (error) {
        console.error("No se pudieron obtener los datos:", error)
        return null
    }
}

// Exportación nombrada
export { obtenerDatos }
