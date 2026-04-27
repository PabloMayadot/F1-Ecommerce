/**
 * Middleware de autorización por rol.
 * Recibe un array de roles permitidos y verifica que el usuario autenticado tenga uno de ellos.
 *
 * @param {string[]} rolesPermitidos - Roles que pueden acceder al recurso
 */
export const verifyRoleMiddleware = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "No se encontró información del usuario en la solicitud" })
        }

        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Acceso denegado: permisos insuficientes" })
        }

        next()
    }
}
