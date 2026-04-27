import { createCategoryService, deleteCategoryService, getAllCategoryService, getCategoryByIdService, updateCategoryService } from "../services/categoryService.js"
import { handleError } from "../utils/errorHandler.js"

export const getAllCategories = async (req, res) => {
    try {
        const categories = await getAllCategoryService()
        res.status(200).json({ success: true, data: categories })
    } catch (error) {
        handleError(error, res)
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const category = await getCategoryByIdService(req.params.id)
        res.status(200).json({ success: true, data: category })
    } catch (error) {
        handleError(error, res)
    }
}

export const createCategory = async (req, res) => {
    try {
        const category = await createCategoryService(req.body)
        res.status(201).json({ success: true, message: "Categoría creada correctamente", data: category })
    } catch (error) {
        handleError(error, res)
    }
}

export const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await updateCategoryService(req.params.id, req.body)
        res.status(200).json({ success: true, message: "Categoría actualizada correctamente", data: updatedCategory })
    } catch (error) {
        handleError(error, res)
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const result = await deleteCategoryService(req.params.id)
        res.status(200).json({ success: true, message: result.message, data: result.data })
    } catch (error) {
        handleError(error, res)
    }
}
