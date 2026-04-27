import mongoose from 'mongoose'
import { MONGODB_URI } from './config.js'

// Caché global para evitar agotar las conexiones en entornos Serverless (como Vercel)
let cached = global.mongoose || { conn: null, promise: null }
global.mongoose = cached

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
            console.log("Conexión a la base de datos establecida")
            return mongooseInstance
        }).catch(err => {
            console.error("Error al conectar con la base de datos:", err)
            throw err
        })
    }
    
    cached.conn = await cached.promise
    return cached.conn
}
