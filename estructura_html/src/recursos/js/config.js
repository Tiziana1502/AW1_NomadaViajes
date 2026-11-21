// Configuración general del sitio (igual que config.js de la clase 21)

// Rutas de los archivos JSON con los datos del catálogo
export const URL_PAQUETES = './recursos/datos/paquetes.json'
export const URL_DETALLE_VIAJES = './recursos/datos/detalleViajes.json'

// Número de WhatsApp de la agencia (el mismo del botón flotante), solo con dígitos, sin +, espacios ni guiones
export const NUMERO_WHATSAPP = '5493533680171'

// Correo que recibe las reservas (se envían con FormSubmit, servicio gratuito para formularios).
// La primera vez que se envía una reserva, FormSubmit manda a este correo un mensaje para activar el formulario
export const EMAIL_RESERVAS = 'tizinahirrossi@gmail.com'
export const URL_FORMSUBMIT = `https://formsubmit.co/ajax/${EMAIL_RESERVAS}`

// Porcentaje de seña que se abona para reservar (15%)
export const PORCENTAJE_SENA = 0.15
