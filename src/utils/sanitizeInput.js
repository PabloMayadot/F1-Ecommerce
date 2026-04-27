import path from "path"

/**
 * Escapa metacaracteres de regex para uso seguro dentro de $regex (evita ReDoS / patrones hostiles).
 */
export function escapeRegex(s) {
    if (typeof s !== "string") return ""
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Elimina claves que empiezan con $ en todos los niveles (mitiga operadores MongoDB en updates).
 */
export function stripMongoOperators(raw) {
    if (!raw || typeof raw !== "object") return {}
    if (Array.isArray(raw)) return raw

    const out = {}
    for (const [k, v] of Object.entries(raw)) {
        if (k.startsWith("$")) continue
        if (v !== null && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date) && !Buffer.isBuffer(v)) {
            out[k] = stripMongoOperators(v)
        } else {
            out[k] = v
        }
    }
    return out
}

/**
 * Nombre de archivo seguro para storage (evita path traversal y caracteres raros).
 */
export function sanitizeFilenameForStorage(name) {
    if (!name || typeof name !== "string") return "file"
    const base = path.basename(name.split("\0")[0]) || "file"
    const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120)
    return cleaned || "file"
}
