import { registerService, loginService, getMeService } from "../services/authService.js"
import { handleError } from "../utils/errorHandler.js"

export const register = async (req, res) => {
    try {
        const userData = req.body
        const result = await registerService(userData)
        res.status(201).json({ success: true, message: "Usuario registrado correctamente", data: result })
    } catch (error) {
        handleError(error, res)
    }
}

export const login = async (req, res) => {
    try {
        const loginData = req.body
        const result = await loginService(loginData)
        res.status(200).json({ success: true, message: result.message, token: result.token })
    } catch (error) {
        handleError(error, res)
    }
}

export const getMe = async (req, res) => {
    try {
        const userId = req.user.userId
        const user = await getMeService(userId)
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        handleError(error, res)
    }
}
