import { checkModelExist } from '../helpers/checkExist.js'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'

export const getUsersService = async () => {
    return await User.find({ isActive: true }).select("-password")
}

export const getUserByIdService = async (id) => {
    await checkModelExist(User, { _id: id }, true, 404, "Usuario no encontrado")
    return await User.findById(id).select("-password")
}

export const updateUserService = async (id, userData) => {
    await checkModelExist(User, { _id: id }, true, 404, "Usuario no encontrado")

    const allowedKeys = ["name", "email", "password"]
    const payload = {}
    for (const key of allowedKeys) {
        if (userData[key] !== undefined) {
            payload[key] = userData[key]
        }
    }

    if (Object.keys(payload).length === 0) {
        return await User.findById(id).select("-password")
    }

    if (payload.password) {
        payload.password = bcrypt.hashSync(payload.password, 10)
    }

    return await User.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).select("-password")
}

export const deleteUserService = async (id) => {
    await checkModelExist(User, { _id: id }, true, 404, "Usuario no encontrado")

    // Soft delete: se desactiva la cuenta sin eliminarla de la base de datos
    const deletedUser = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password")
    return { message: "Usuario eliminado correctamente", data: deletedUser }
}
