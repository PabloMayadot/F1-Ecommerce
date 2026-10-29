import { checkModelExist } from "../helpers/checkExist.js"
import Category from "../models/categoryModel.js"
import Product from "../models/productModel.js"
import { stripMongoOperators } from "../utils/sanitizeInput.js"

export const getAllCategoryService = async () => {
    return await Category.find({ isActive: true })
}

export const getCategoryByIdService = async (id) => {
    return await checkModelExist(Category, { _id: id, isActive: true }, true, 404, "Categoría no encontrada")
}

export const createCategoryService = async (categoryData) => {
    const safe = stripMongoOperators(categoryData)
    const normalizedName = typeof safe.name === "string" ? safe.name.trim().toLowerCase() : safe.name

    const existing = await Category.findOne({ name: normalizedName })
    if (existing) {
        if (existing.isActive) {
            const error = new Error("La categoría ya existe")
            error.statusCode = 400
            throw error
        }
        existing.isActive = true
        if (safe.description !== undefined) {
            existing.description = safe.description
        }
        return await existing.save()
    }

    const newCategory = new Category({ ...safe, name: normalizedName, isActive: true })
    return await newCategory.save()
}

export const updateCategoryService = async (id, categoryData) => {
    await checkModelExist(Category, { _id: id, isActive: true }, true, 404, "Categoría no encontrada")

    const safe = stripMongoOperators(categoryData)
    if (typeof safe.name === "string") {
        safe.name = safe.name.trim().toLowerCase()
    }
    return await Category.findByIdAndUpdate(id, safe, { new: true, runValidators: true })
}

export const deleteCategoryService = async (id) => {
    await checkModelExist(Category, { _id: id, isActive: true }, true, 404, "Categoría no encontrada")

    // Soft delete: desactivar la categoría sin eliminarla físicamente
    const deletedCategory = await Category.findByIdAndUpdate(id, { isActive: false }, { new: true })

    // Efecto cascada: los productos de esta categoría quedan sin categoría asignada
    await Product.updateMany({ category: id }, { $set: { category: null } })

    return { message: "Categoría eliminada correctamente", data: deletedCategory }
}
