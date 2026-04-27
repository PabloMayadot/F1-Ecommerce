import { getUsersService, getUserByIdService, updateUserService, deleteUserService } from "../services/userService.js"
import { roleEnum } from "../models/userModel.js"
import { handleError } from "../utils/errorHandler.js"

export const getUsers = async (req, res) => {
    try {
        const users = await getUsersService()
        res.status(200).json({ success: true, data: users })
    } catch (error) {
        handleError(error, res)
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const esAdmin = req.user.role === roleEnum[0]
        if (!esAdmin && String(req.user.userId) !== String(id)) {
            return res.status(403).json({ success: false, message: "No autorizado para ver este perfil" })
        }

        const user = await getUserByIdService(id)
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        handleError(error, res)
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params

        // Solo el propio usuario puede editar su perfil
        if (String(req.user.userId) !== String(id)) {
            return res.status(403).json({ success: false, message: "No autorizado: solo podés editar tu propio perfil" })
        }

        const updatedUser = await updateUserService(id, req.body)
        res.status(200).json({ success: true, message: "Usuario actualizado correctamente", data: updatedUser })
    } catch (error) {
        handleError(error, res)
    }
}

// Solo el administrador puede eliminar cuentas
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const esAdmin = req.user.role === roleEnum[0]
        const esElDueño = String(req.user.userId) === String(id)

        if (!esElDueño && !esAdmin) {
            return res.status(403).json({ success: false, message: "No autorizado" })
        }

        const result = await deleteUserService(id)
        res.status(200).json({ success: true, message: result.message, data: result.data })
    } catch (error) {
        handleError(error, res)
    }
}
