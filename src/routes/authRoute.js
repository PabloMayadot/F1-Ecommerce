import express from "express"
import { register, login, getMe } from "../controllers/authController.js"
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js"
import { loginRateLimiter, registerRateLimiter } from "../middlewares/authRateLimitMiddleware.js"

const authRoute = express.Router()

// Registro público (rate limit anti-spam)
authRoute.post("/register", registerRateLimiter, register)

// Login público (rate limit anti fuerza bruta)
authRoute.post("/login", loginRateLimiter, login)

// Obtener datos del usuario autenticado
authRoute.get("/me", verifyTokenMiddleware, getMe)

export default authRoute
