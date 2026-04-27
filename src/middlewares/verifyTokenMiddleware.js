import { JWT_SECRET } from "../config/config.js"
import { verifyToken } from "../utils/verifyToken.js"

/**
 * Middleware de autenticación.
 * Extrae el JWT del header Authorization y llena req.user con el payload decodificado.
 */
export const verifyTokenMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Se requiere un token de acceso" })
        }

        const token = authHeader.split(" ")[1]
        req.user = verifyToken(token)
        next()

    } catch (error) {
        return res.status(401).json({ success: false, message: error.message })
    }
}
