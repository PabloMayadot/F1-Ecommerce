import express from 'express'
import { createProduct, deleteProduct, getAllProduct, updateProduct, getProductById } from '../controllers/productController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'
import upload from '../middlewares/multerMiddleware.js'

const productRoute = express.Router()

// Endpoints públicos
productRoute.get("/", getAllProduct)
productRoute.get("/:id", getProductById)

// Endpoints protegidos (solo admin)
productRoute.post("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), upload.single('image'), createProduct)
productRoute.put("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), upload.single('image'), updateProduct)
productRoute.delete("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), deleteProduct)

export default productRoute
