import express from 'express'
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'

const userRoute = express.Router()

// Listar usuarios: solo admin
userRoute.get("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), getUsers)

// Ver usuario por ID: autenticado
userRoute.get("/:id", verifyTokenMiddleware, getUserById)

// Actualizar usuario: autenticado (solo a sí mismo, validado en controller)
userRoute.put("/:id", verifyTokenMiddleware, updateUser)

// Eliminar usuario: solo admin
userRoute.delete("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), deleteUser)

export default userRoute
