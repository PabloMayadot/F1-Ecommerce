import mongoose from 'mongoose'

const estadosValidos = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: {
        type: Number,
        required: true,
        min: [1, "La cantidad debe ser al menos 1"]
    }
}, { _id: false })

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "El usuario es obligatorio"]
    },
    items: {
        type: [orderItemSchema],
        required: [true, "Los items son obligatorios"],
        validate: {
            validator: (value) => value.length > 0,
            message: "La orden debe tener al menos un item"
        }
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: {
            values: estadosValidos,
            message: (props) => `"${props.value}" no es un estado válido`
        },
        default: estadosValidos[0]
    }
}, { timestamps: true })

export default mongoose.model("order", orderSchema)
