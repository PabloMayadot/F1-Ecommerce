import mongoose from 'mongoose'
import { isGoodPassword } from '../utils/validators.js'
import bcrypt from 'bcrypt'

export const roleEnum = ["admin", "user"]

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        minLength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxLength: [40, 'El nombre debe tener menos de 40 caracteres'],
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        minLength: [4, 'El email debe tener más de 4 caracteres'],
        maxLength: [60, 'El email debe tener menos de 60 caracteres'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor, ingresá un correo electrónico válido']
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        validate: {
            validator: isGoodPassword,
            message: "La contraseña debe tener entre 6 y 12 caracteres, al menos una mayúscula, una minúscula y un número"
        }
    },
    role: {
        type: String,
        enum: {
            values: roleEnum,
            message: (props) => `"${props.value}" no es un rol válido`
        },
        default: roleEnum[1]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

// Encriptar la contraseña antes de guardar si fue modificada
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = bcrypt.hashSync(this.password, 10)
})

export default mongoose.model("user", userSchema)
