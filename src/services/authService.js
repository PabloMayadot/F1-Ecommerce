import { JWT_SECRET } from '../config/config.js'
import { checkModelExist } from '../helpers/checkExist.js'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerService = async (userData) => {
    const { name, email, password } = userData
    const cleanUser = { name, email, password }

    // Validar que el email no esté registrado
    await checkModelExist(User, { email: cleanUser.email }, false, 400, `El usuario con email ${cleanUser.email} ya existe`)

    // Rol fijo: no se aceptan isActive, role u otros campos del body público
    cleanUser.role = "user"

    const newUser = new User(cleanUser)
    const savedUser = await newUser.save()

    // Retornar el usuario sin exponer la contraseña
    const userResponse = savedUser.toObject()
    delete userResponse.password
    return userResponse
}

export const loginService = async (loginData) => {
    const { email, password } = loginData

    if (!email || !password) {
        const error = new Error("Email y contraseña son obligatorios")
        error.statusCode = 400
        throw error
    }

    const usuario = await checkModelExist(User, { email, isActive: true }, true, 400, "Usuario o contraseña incorrectos")

    const passwordValida = bcrypt.compareSync(password, usuario.password)
    if (!passwordValida) {
        const error = new Error("Usuario o contraseña incorrectos")
        error.statusCode = 400
        throw error
    }

    const payload = {
        userId: usuario._id,
        userEmail: usuario.email,
        role: usuario.role
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })
    return { message: "Sesión iniciada", token }
}

export const getMeService = async (userId) => {
    const user = await User.findById(userId).select("-password")

    if (!user) {
        const error = new Error("Usuario no encontrado")
        error.statusCode = 404
        throw error
    }

    return user
}
