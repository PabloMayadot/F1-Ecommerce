import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        minLength: [2, "El nombre debe tener al menos 2 caracteres"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "La descripción del producto es obligatoria"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio debe ser mayor a 0"]
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio"],
        min: [0, "El stock no puede ser negativo"],
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "La categoría es obligatoria"]
    },
    images: {
        type: [String],
        default: ["https://cdn-icons-png.flaticon.com/256/12457/12457612.png"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { getters: true, virtuals: true }
})

export default mongoose.model("product", productSchema)
