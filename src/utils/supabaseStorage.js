import { supabase } from "../config/supabase.js"
import { sanitizeFilenameForStorage } from "./sanitizeInput.js"

const ALLOWED_IMAGE_MIMES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif"
])

export const uploadImageToSupabase = async (file, folder) => {
    if (!file || !file.buffer) {
        const err = new Error("Archivo inválido")
        err.statusCode = 400
        throw err
    }
    if (!ALLOWED_IMAGE_MIMES.has(file.mimetype)) {
        const err = new Error("Solo se permiten imágenes (JPEG, PNG, WebP, GIF, AVIF)")
        err.statusCode = 400
        throw err
    }

    const safeBase = sanitizeFilenameForStorage(file.originalname)
    const fileName = `${folder}/${Date.now()}-${safeBase}`

    const { data, error } = await supabase.storage
        .from("imagenes")
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        })

    if (error) {
        const err = new Error("Error al subir la imagen a Supabase")
        err.statusCode = 500
        throw err
    }

    // Obtener la URL pública de la imagen subida
    const { data: publicUrl } = supabase.storage
        .from("imagenes")
        .getPublicUrl(data.path)

    return publicUrl.publicUrl
}
