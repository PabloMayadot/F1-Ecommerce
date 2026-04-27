import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config.js'

/**
 * Verifica y decodifica un JWT.
 * Lanza un error con mensaje en español si el token es inválido o expiró.
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        const error = new Error("Token inválido o expirado")
        error.statusCode = 401
        throw error
    }
}
