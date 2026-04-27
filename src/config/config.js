import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT || 5000
export const MONGODB_URI = process.env.MONGODB_URI
export const JWT_SECRET = process.env.JWT_SECRET
export const NODE_ENV = process.env.NODE_ENV
export const SUPABASE_URL = process.env.SUPABASE_URL
export const SUPABASE_KEY = process.env.SUPABASE_KEY

/**
 * Orígenes permitidos para CORS, separados por coma. En desarrollo tiene default razonable.
 */
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS

/**
 * Falla al arrancar si faltan secretos críticos (evita JWT con secret indefinido o BD sin URI).
 */
export function assertEnvForRuntime() {

    const missing = []
    if (!process.env.MONGODB_URI) missing.push("MONGODB_URI")
    if (!process.env.JWT_SECRET) missing.push("JWT_SECRET")
    if (missing.length) {
        console.error(`[config] Faltan variables de entorno obligatorias: ${missing.join(", ")}`)
        process.exit(1)
    }
    if (process.env.JWT_SECRET.length < 32) {
        console.warn("[config] JWT_SECRET debería tener al menos 32 caracteres en producción.")
    }
}
