/**
 * Formatea un número como precio en pesos argentinos (ARS).
 * @param {number} precio - Valor a formatear
 * @returns {string} Precio formateado, ej: "$ 1.500"
 */
export const formatearPrecio = (precio) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
    }).format(precio)

/**
 * Formatea una fecha ISO al formato local argentino con hora.
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} Fecha formateada, ej: "22 de abril de 2026, 18:00"
 */
export const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
