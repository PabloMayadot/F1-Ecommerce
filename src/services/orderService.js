import Product from "../models/productModel.js"
import Order from "../models/orderModel.js"

const MAX_LINE_ITEMS = 50
const MAX_QTY_PER_LINE = 99

export const createOrderService = async (userId, orderData) => {
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
        const error = new Error("La orden debe incluir al menos un producto")
        error.statusCode = 400
        throw error
    }

    if (orderData.items.length > MAX_LINE_ITEMS) {
        const error = new Error(`La orden no puede superar ${MAX_LINE_ITEMS} productos distintos`)
        error.statusCode = 400
        throw error
    }

    let shipping = orderData.shipping != null ? Number(orderData.shipping) : 0
    if (!Number.isFinite(shipping) || shipping < 0) {
        shipping = 0
    }
    // Costo de envío solo puede sumar (evita total artificialmente bajo con shipping negativo)
    if (shipping > 1_000_000) {
        const error = new Error("El costo de envío indicado no es válido")
        error.statusCode = 400
        throw error
    }

    let subtotal = 0
    const itemsProcesados = []

    // Validar stock y calcular precios desde la base de datos (no confiamos en el frontend)
    for (const item of orderData.items) {
        const qty = Number(item.quantity)
        if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) {
            const error = new Error(`Cantidad inválida para un producto (permitido: 1-${MAX_QTY_PER_LINE})`)
            error.statusCode = 400
            throw error
        }

        const product = await Product.findById(item.productId)

        if (!product) {
            const error = new Error(`Producto con ID ${item.productId} no encontrado`)
            error.statusCode = 404
            throw error
        }

        if (!product.isActive) {
            const error = new Error(`El producto "${product.name}" no está disponible`)
            error.statusCode = 400
            throw error
        }

        subtotal += product.price * qty

        itemsProcesados.push({
            product: product._id,
            name: product.name,
            quantity: qty,
            price: product.price
        })
    }

    const total = Number((subtotal + shipping).toFixed(2))

    const decremented = []

    try {
        for (const item of itemsProcesados) {
            const updated = await Product.findOneAndUpdate(
                { _id: item.product, stock: { $gte: item.quantity }, isActive: true },
                { $inc: { stock: -item.quantity } }
            )

            if (!updated) {
                const error = new Error(`Stock insuficiente o el producto "${item.name}" ya no está disponible`)
                error.statusCode = 400
                throw error
            }

            decremented.push({ product: item.product, quantity: item.quantity })
        }

        const nuevaOrden = new Order({
            user: userId,
            items: itemsProcesados,
            subtotal: Number(subtotal.toFixed(2)),
            shipping,
            total,
            status: "pending"
        })

        return await nuevaOrden.save()
    } catch (err) {
        if (decremented.length > 0) {
            await Promise.all(
                decremented.map(({ product, quantity }) =>
                    Product.findByIdAndUpdate(product, { $inc: { stock: quantity } })
                )
            )
        }
        throw err
    }
}

export const getAllOrdersService = async () => {
    return await Order.find().populate("user", "name email").sort({ createdAt: -1 })
}

export const getOrdersByUserService = async (userId) => {
    return await Order.find({ user: userId }).sort({ createdAt: -1 })
}

export const getOrderByIdService = async (orderId) => {
    const order = await Order.findById(orderId).populate("user", "name email")

    if (!order) {
        const error = new Error("Orden no encontrada")
        error.statusCode = 404
        throw error
    }

    return order
}
