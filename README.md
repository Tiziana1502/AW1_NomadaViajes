# Nómada Viajes — Entrega final IEFI

> "Tu próximo destino, a un clic de distancia"

Plataforma web e-commerce B2C orientada a la venta de paquetes turísticos combinados (vuelos, alojamientos y excursiones). Este repositorio contiene la **versión final del proyecto para la IEFI** de la materia Aplicaciones Web 1. Parte del trabajo realizado en grupo durante los trabajos prácticos anteriores (repositorio `aw_TrabajosPracticos`) e incorpora las modificaciones y correcciones del TP4 que se detallan más abajo.

---

## Descripción del Proyecto

Nómada Viajes es una agencia de viajes online diseñada para digitalizar por completo el proceso de consulta, selección y reserva de paquetes turísticos.

### Objetivos Principales
* Centralizar la oferta de destinos en un catálogo dinámico y filtrable (por destino, fecha, tipo de viaje y presupuesto).
* Reducir tiempos de gestión mediante validaciones frontend y flujos de reserva transparentes.
* Optimizar la experiencia de usuario mediante una arquitectura de navegación combinada (MPA / SPA).

---

## Funcionalidades

* **Inicio:** presentación de la agencia, destinos destacados y ofertas vigentes.
* **Catálogo de paquetes:** las tarjetas se generan con JavaScript a partir de los datos de `paquetes.js`. Los filtros (destino, fechas, precio y tipo de viaje) se aplican al presionar **Filtrar** y se pueden restablecer con **Limpiar filtros**.
* **Detalle de paquete:** itinerario día por día, qué incluye, qué no incluye, precio y reserva de cada uno de los 7 destinos. Un selector en la parte superior permite pasar de un destino a otro sin volver al catálogo (`detalle.html?id=...`).
* **Carrito de compras:** ícono en el encabezado de todas las páginas que muestra la cantidad de paquetes y el total. Al abrirlo permite revisar los paquetes, quitarlos y continuar con la reserva. Se guarda en `localStorage`, por lo que se conserva al cambiar de página.
* **Contacto / Reserva:** formulario con validación de campos mediante JavaScript (nombre, DNI, email, teléfono y fecha).
* **Confirmación:** pantalla de notificación al finalizar la reserva.
* **Menú hamburguesa** responsive para dispositivos móviles y **pie de página** con datos de contacto, redes y medios de pago.

---

## Modificaciones y correcciones TP4

* **Catálogo y menú hamburguesa:** se corrigió la ruta de importación de `vistaCatalogo.js` en `index.js`. El nombre no coincidía con el del archivo, por lo que el navegador no ejecutaba el módulo y no se renderizaba el catálogo ni funcionaba el menú.
* **Filtros:** el catálogo filtraba al modificar cualquier campo, antes de presionar el botón. Ahora filtra únicamente al enviar el formulario y se agregó el botón **Limpiar filtros**.
* **Inicio:** se agregó la estructura HTML del hero que esperaba la hoja de estilos, por lo que la imagen ya no queda debajo del texto.
* **Botones:** se creó la clase global `.boton`, redondeada y del ancho de su contenedor, con las variantes `.boton-secundario`, `.boton-contorno` y `.boton-vinculo`. Los vínculos que llevan a otra página pasaron a tener formato de botón.
* **Espaciados:** se unificaron los márgenes y anchos de todas las vistas de escritorio (contenido de hasta 1600px con el mismo margen lateral que el encabezado), y los formularios se organizaron en dos columnas.
* **Detalle dinámico:** se creó `detalleViajes.js` con la información de los 7 destinos y `vistaDetalle.js` para renderizarla según el paquete elegido.
* **Carrito:** se creó `carrito.js` y se movió el carrito de `detalle.html` a un ícono del encabezado, con contador y total.
* **Pie de página:** rediseño en cuatro columnas con franja legal, aplicado a las 5 páginas.
* **Organización del código:** se agregó `formato.js` con las funciones de formato compartidas (precios, fechas y mayúsculas).

El detalle de cada cambio por archivo está en la sección 1.5 del documento `AW1_ProyectoEscrito`.

---

## Arquitectura de la Información y Navegación

El sitio implementa un enfoque combinado para equilibrar indexación en buscadores (SEO) y fluidez de interacción:

* **MPA (Multi-Page Application):** páginas informativas (`Inicio`, `Nosotros`, `Contacto`, `Login / Registro`) para asegurar tiempos de carga inicial simples y rastreo SEO independiente.
* **SPA (Single-Page Application):** módulos interactivos (`Catálogo de paquetes`, `Carrito`, `Checkout`, `Mi Cuenta`) para filtrar y operar sin recargar la página completa, evitando la pérdida de contexto.

### Sitemap (Mapa del Sitio)
* **Inicio (Home):** buscador rápido, ofertas destacadas y accesos directos.
* **Catálogo de Paquetes:** grilla de paquetes con filtros en tiempo real, detalle del paquete, carrito y checkout.
* **Nosotros:** historia, visión y equipo de trabajo.
* **Contacto / Consultas:** formulario de contacto y datos de la agencia.
* **Mi Cuenta y Autenticación:** perfil, reservas, historial de pagos, login y registro.

---

## Estructura del proyecto

```
estructura_html/
├── package.json
└── src/
    ├── index.html · catalogo.html · detalle.html · formulario.html · confirmacion.html
    └── recursos/
        ├── estilos/      index-global.css (base, botones, encabezado, carrito y pie)
        │                 catalogo.css · detalle.css · formulario.css · confirmacion.css
        ├── js/           index.js (punto de entrada de todas las páginas)
        │                 paquetes.js · detalleViajes.js (datos)
        │                 vistaCatalogo.js · vistaDetalle.js · carrito.js · filtros.js
        │                 formulario.js · formato.js
        └── imagenes/
```

Los archivos JavaScript usan módulos ES (`import` / `export`), por lo que el sitio debe abrirse desde un servidor local y no directamente con `file://`.

---

## Cómo ejecutar el proyecto

Requiere [Node.js](https://nodejs.org/) y [pnpm](https://pnpm.io/). Desde la carpeta `estructura_html`:

```
pnpm install
pnpm dev
```

El script `dev` inicia `five-server` con la carpeta `src` como raíz.

---

## Infraestructura y Dominio

* **Dominio propuesto:** `nomadaviajes.com.ar`

---

## Prototipado y Diseño UX/UI

El proceso de diseño de interfaz abarca las siguientes fases:
1. Bocetos a mano alzada
2. Wireframes
3. Mockups de alta fidelidad
