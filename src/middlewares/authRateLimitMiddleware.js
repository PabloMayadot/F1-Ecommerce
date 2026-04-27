import rateLimit from "express-rate-limit"

const fifteenMin = 15 * 60 * 1000
const oneHour = 60 * 60 * 1000

/**
 * Limita intentos fallidos de login por IP (fuerza bruta).
 * Las respuestas exitosas (2xx) no cuentan contra el límite.
 */
export const loginRateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LOGIN_WINDOW_MS) || fifteenMin,
    max: Number(process.env.RATE_LOGIN_MAX) || 25,
    message: { success: false, message: "Demasiados intentos de inicio de sesión. Probá más tarde." },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
})

/**
 * Limita registros por IP (spam / cuentas masivas).
 */
export const registerRateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_REGISTER_WINDOW_MS) || oneHour,
    max: Number(process.env.RATE_REGISTER_MAX) || 8,
    message: { success: false, message: "Demasiados registros desde esta red. Probá más tarde." },
    standardHeaders: true,
    legacyHeaders: false
})
