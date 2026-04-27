import { createProductService, deleteProductService, getAllProductService, updateProductService, getProductByIdService } from "../services/productService.js"
import { handleError } from "../utils/errorHandler.js"
import { uploadImageToSupabase } from "../utils/supabaseStorage.js"

export const createProduct = async (req, res) => {
    try {
        const productData = { ...req.body }

        if (!productData || Object.keys(productData).length === 0) {
            return res.status(400).json({ success: false, message: "No se recibió información del producto" })
        }

        if (req.file) {
            productData.images = [await uploadImageToSupabase(req.file, "products")]
        }

        const savedProduct = await createProductService(productData)
        res.status(201).json({ success: true, message: "Producto creado correctamente", data: savedProduct })
    } catch (error) {
        handleError(error, res)
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const products = await getAllProductService(req.query)
        res.status(200).json({ success: true, data: products })
    } catch (error) {
        handleError(error, res)
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await getProductByIdService(req.params.id)
        res.status(200).json({ success: true, data: product })
    } catch (error) {
        handleError(error, res)
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const productData = { ...req.body }

        if (req.file) {
            productData.images = [await uploadImageToSupabase(req.file, "products")]
        }

        const updatedProduct = await updateProductService(id, productData)
        res.status(200).json({ success: true, message: "Producto actualizado correctamente", data: updatedProduct })
    } catch (error) {
        handleError(error, res)
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const result = await deleteProductService(req.params.id)
        res.status(200).json({ success: true, message: result.message, data: result.data })
    } catch (error) {
        handleError(error, res)
    }
}
