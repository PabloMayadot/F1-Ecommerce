import multer from "multer"

const ALLOWED_IMAGE_MIMES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif"
])

/**
 * Configuración de Multer para almacenamiento en memoria (buffer).
 * Es necesario para enviar el archivo directamente a Supabase Storage sin pasar por disco.
 */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB máximo
    },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_IMAGE_MIMES.has(file.mimetype)) {
            return cb(null, true)
        }
        cb(new Error("Tipo de imagen no permitido"))
    }
})

export default upload
