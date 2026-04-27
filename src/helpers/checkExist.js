import mongoose from 'mongoose'

/**
 * Verifica la existencia de un documento en la base de datos.
 *
 * @param {Model}   Model        - Modelo de Mongoose a consultar
 * @param {Object}  query        - Filtro de búsqueda
 * @param {boolean} shouldExist  - true si el documento DEBE existir, false si NO debe existir
 * @param {number}  statusCode   - Código HTTP del error a lanzar
 * @param {string}  errorMessage - Mensaje del error a lanzar
 * @returns {Document|null}      - El documento encontrado, o null si no existe
 */
export const checkModelExist = async (Model, query, shouldExist, statusCode, errorMessage) => {
    // Si la query busca por _id, validamos que el formato sea correcto antes de consultar
    if (query._id && !mongoose.Types.ObjectId.isValid(query._id)) {
        const error = new Error("El formato del ID proporcionado no es válido")
        error.statusCode = 400
        throw error
    }

    const document = await Model.findOne(query)

    if (shouldExist && !document) {
        const error = new Error(errorMessage)
        error.statusCode = statusCode
        throw error
    }

    if (!shouldExist && document) {
        const error = new Error(errorMessage)
        error.statusCode = statusCode
        throw error
    }

    return document
}
