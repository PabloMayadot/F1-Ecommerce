import mongoose from "mongoose"
import { checkModelExist } from "../helpers/checkExist.js"
import Category from "../models/categoryModel.js"
import Product from "../models/productModel.js"
import { escapeRegex, stripMongoOperators } from "../utils/sanitizeInput.js"

export const createProductService = async (productData) => {
    const safe = stripMongoOperators(productData)
    const trimmedName = typeof safe.name === "string" ? safe.name.trim() : safe.name
    await checkModelExist(Product, { name: trimmedName, isActive: true }, false, 400, `El producto "${trimmedName}" ya existe`)

    if (safe.category) {
        await checkModelExist(Category, { _id: safe.category, isActive: true }, true, 404, "La categoría seleccionada no existe")
    }

    const newProduct = new Product({ ...safe, name: trimmedName, isActive: true })
    return await newProduct.save()
}

export const getAllProductService = async (query) => {
    const filters = { isActive: true }

    if (query.category) {
        if (!mongoose.Types.ObjectId.isValid(query.category)) {
            const error = new Error("El identificador de categoría no es válido")
            error.statusCode = 400
            throw error
        }
        filters.category = query.category
    }

    if (query.search) {
        const term = escapeRegex(String(query.search).slice(0, 120))
        if (term.length > 0) {
            filters.$or = [
                { name: { $regex: term, $options: "i" } },
                { description: { $regex: term, $options: "i" } }
            ]
        }
    }

    return await Product.find(filters).populate("category")
}

export const getProductByIdService = async (id) => {
    await checkModelExist(Product, { _id: id, isActive: true }, true, 404, "Producto no encontrado")
    return await Product.findById(id).populate("category")
}

export const updateProductService = async (id, productData) => {
    await checkModelExist(Product, { _id: id, isActive: true }, true, 404, "Producto no encontrado")

    const safe = stripMongoOperators(productData)
    if (safe.category) {
        await checkModelExist(Category, { _id: safe.category, isActive: true }, true, 404, "La categoría seleccionada no existe")
    }

    return await Product.findByIdAndUpdate(id, safe, { new: true, runValidators: true })
}

export const deleteProductService = async (id) => {
    await checkModelExist(Product, { _id: id, isActive: true }, true, 404, "Producto no encontrado")

    // Soft delete: desactivamos el producto en lugar de eliminarlo físicamente
    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true })
    return { message: "Producto eliminado correctamente", data: product }
}
