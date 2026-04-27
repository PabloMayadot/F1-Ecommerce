import express from 'express'
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/categoryController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'

const categoryRoute = express.Router()

// Endpoints públicos
categoryRoute.get("/", getAllCategories)
categoryRoute.get("/:id", getCategoryById)

// Endpoints protegidos (solo admin)
categoryRoute.post("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), createCategory)
categoryRoute.put("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), updateCategory)
categoryRoute.delete("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), deleteCategory)

export default categoryRoute
