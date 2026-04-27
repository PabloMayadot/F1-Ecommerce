import rateLimit from "express-rate-limit"

const tenMin = 10 * 60 * 1000

/**
 * Limita creación de órdenes por IP (abuso / DoS lógico).
 */
export const createOrderRateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_ORDER_WINDOW_MS) || tenMin,
    max: Number(process.env.RATE_ORDER_MAX) || 40,
    message: { success: false, message: "Demasiados pedidos en poco tiempo. Esperá unos minutos." },
    standardHeaders: true,
    legacyHeaders: false,
    // Tras verifyTokenMiddleware siempre hay usuario; evita mezclar IPs (NAT) y cumple validación IPv6 del paquete
    keyGenerator: (req) => `order:${String(req.user.userId)}`
})
