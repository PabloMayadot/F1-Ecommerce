import { checkModelExist } from "../helpers/checkExist.js"
import Category from "../models/categoryModel.js"
import Product from "../models/productModel.js"
import { stripMongoOperators } from "../utils/sanitizeInput.js"

export const getAllCategoryService = async () => {
    return await Category.find({ isActive: true })
}

export const getCategoryByIdService = async (id) => {
    return await checkModelExist(Category, { _id: id }, true, 404, "Categoría no encontrada")
}

export const createCategoryService = async (categoryData) => {
    const safe = stripMongoOperators(categoryData)
    await checkModelExist(Category, { name: safe.name }, false, 400, "La categoría ya existe")

    const newCategory = new Category(safe)
    return await newCategory.save()
}

export const updateCategoryService = async (id, categoryData) => {
    await checkModelExist(Category, { _id: id }, true, 404, "Categoría no encontrada")

    const safe = stripMongoOperators(categoryData)
    return await Category.findByIdAndUpdate(id, safe, { new: true, runValidators: true })
}

export const deleteCategoryService = async (id) => {
    await checkModelExist(Category, { _id: id }, true, 404, "Categoría no encontrada")

    // Soft delete: desactivar la categoría sin eliminarla físicamente
    const deletedCategory = await Category.findByIdAndUpdate(id, { isActive: false }, { new: true })

    // Efecto cascada: los productos de esta categoría quedan sin categoría asignada
    await Product.updateMany({ category: id }, { $set: { category: null } })

    return { message: "Categoría eliminada correctamente", data: deletedCategory }
}
