/**
 * Manejador de errores centralizado para los controladores.
 * Lee el statusCode y message del error para construir la respuesta HTTP.
 */
export const handleError = (error, res) => {
    const statusCode = error.statusCode || 500
    const message = error.message || "Error interno del servidor"

    res.status(statusCode).json({ success: false, message })
}
