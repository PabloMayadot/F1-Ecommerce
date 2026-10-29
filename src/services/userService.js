import { checkModelExist } from '../helpers/checkExist.js'
import User from '../models/userModel.js'
import { stripMongoOperators } from '../utils/sanitizeInput.js'

export const getUsersService = async () => {
    return await User.find({ isActive: true }).select("-password")
}

export const getUserByIdService = async (id) => {
    await checkModelExist(User, { _id: id, isActive: true }, true, 404, "Usuario no encontrado")
    return await User.findById(id).select("-password")
}

export const updateUserService = async (id, userData) => {
    const user = await checkModelExist(User, { _id: id, isActive: true }, true, 404, "Usuario no encontrado")
    const safeData = stripMongoOperators(userData)

    const allowedKeys = ["name", "email", "password"]
    const payload = {}
    for (const key of allowedKeys) {
        if (safeData[key] !== undefined) {
            payload[key] = safeData[key]
        }
    }

    if (Object.keys(payload).length === 0) {
        return await User.findById(id).select("-password")
    }

    if (payload.email) {
        const normalizedEmail = String(payload.email).trim().toLowerCase()
        await checkModelExist(
            User,
            { email: normalizedEmail, _id: { $ne: id } },
            false,
            400,
            `El usuario con email ${normalizedEmail} ya existe`
        )
        user.email = normalizedEmail
    }

    if (payload.name !== undefined) {
        user.name = payload.name
    }

    if (payload.password !== undefined) {
        user.password = payload.password
    }

    const updatedUser = await user.save()
    const userResponse = updatedUser.toObject()
    delete userResponse.password
    return userResponse
}

export const deleteUserService = async (id) => {
    await checkModelExist(User, { _id: id, isActive: true }, true, 404, "Usuario no encontrado")

    // Soft delete: se desactiva la cuenta sin eliminarla de la base de datos
    const deletedUser = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password")
    return { message: "Usuario eliminado correctamente", data: deletedUser }
}
