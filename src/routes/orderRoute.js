import express from "express"
import { createOrder, getOrders, getOrderById } from "../controllers/orderController.js"
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js"
import { createOrderRateLimiter } from "../middlewares/orderRateLimitMiddleware.js"

const orderRoute = express.Router()

// Todos los endpoints de órdenes requieren autenticación
orderRoute.post("/", verifyTokenMiddleware, createOrderRateLimiter, createOrder)
orderRoute.get("/", verifyTokenMiddleware, getOrders)
orderRoute.get("/:id", verifyTokenMiddleware, getOrderById)

export default orderRoute
