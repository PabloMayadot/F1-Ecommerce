import { roleEnum } from "../models/userModel.js"
import { createOrderService, getAllOrdersService, getOrderByIdService, getOrdersByUserService } from "../services/orderService.js"
import { handleError } from "../utils/errorHandler.js"

export const createOrder = async (req, res) => {
    try {
        const order = await createOrderService(req.user.userId, req.body)
        return res.status(201).json({ success: true, message: "Orden creada correctamente", data: order })
    } catch (error) {
        handleError(error, res)
    }
}

export const getOrders = async (req, res) => {
    try {
        const isAdmin = req.user.role === roleEnum[0]
        const orders = isAdmin
            ? await getAllOrdersService()
            : await getOrdersByUserService(req.user.userId)

        return res.status(200).json({ success: true, data: orders })
    } catch (error) {
        handleError(error, res)
    }
}

export const getOrderById = async (req, res) => {
    try {
        const order = await getOrderByIdService(req.params.id)

        const esElDueño = String(order.user._id || order.user) === String(req.user.userId)
        const esAdmin = req.user.role === roleEnum[0]

        if (!esElDueño && !esAdmin) {
            return res.status(403).json({ success: false, message: "No autorizado para ver esta orden" })
        }

        return res.status(200).json({ success: true, data: order })
    } catch (error) {
        handleError(error, res)
    }
}
