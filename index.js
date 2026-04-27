import express from "express"
import cors from "cors"
import multer from "multer"
import helmet from "helmet"
import { PORT, ALLOWED_ORIGINS, assertEnvForRuntime } from "./src/config/config.js"
import { connectDB } from "./src/config/db.js"
import productRoute from "./src/routes/productRoute.js"
import categoryRoute from "./src/routes/categoryRoute.js"
import userRoute from "./src/routes/userRoute.js"
import authRoute from "./src/routes/authRoute.js"
import orderRoute from "./src/routes/orderRoute.js"

const app = express()

assertEnvForRuntime()

if (process.env.TRUST_PROXY === "1") {
    app.set("trust proxy", 1)
}

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}))

const corsDefaultOrigins = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
const corsAllowedList = (ALLOWED_ORIGINS || corsDefaultOrigins)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

// CORS restringido por lista (evita que cualquier sitio use la API desde el navegador con credenciales)
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true)
        }
        if (corsAllowedList.includes(origin)) {
            return callback(null, true)
        }
        return callback(null, false)
    },
    credentials: true
}))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

connectDB()
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

// Rutas
app.get("/", (req, res) => {
    res.json({ message: "API F1 Ecommerce Online y funcionando correctamente." })
})
app.use("/api/products", productRoute)
app.use("/api/categories", categoryRoute)
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/orders", orderRoute)

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ success: false, message: "El archivo supera los 5 MB permitidos" })
        }
        return res.status(400).json({ success: false, message: err.message || "Error al subir el archivo" })
    }
    if (err && err.message === "Tipo de imagen no permitido") {
        return res.status(400).json({ success: false, message: err.message })
    }
    next(err)
})

export default app
