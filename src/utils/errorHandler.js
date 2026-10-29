/**
 * Manejador de errores centralizado para los controladores.
 * Lee el statusCode y message del error para construir la respuesta HTTP.
 */
export const handleError = (error, res) => {
    if (error?.name === "ValidationError") {
        const messages = Object.values(error.errors || {}).map((e) => e.message)
        return res.status(400).json({
            success: false,
            message: messages.join(". ") || "Error de validación en los datos enviados"
        })
    }

    if (error?.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "El formato del identificador proporcionado no es válido"
        })
    }

    if (error?.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Ya existe un registro con esos datos únicos"
        })
    }

    const statusCode = error.statusCode || 500
    const message = error.message || "Error interno del servidor"

    res.status(statusCode).json({ success: false, message })
}
