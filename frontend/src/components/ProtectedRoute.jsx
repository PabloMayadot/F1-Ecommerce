import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/**
 * Componente para proteger rutas privadas o de administrador.
 * @param {boolean} adminOnly - Si es true, solo permite el paso a usuarios con rol admin.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading, isAuthenticated, isAdmin } = useAuth()

    // Mientras se verifica la sesión (loading), no mostramos nada o un spinner
    if (loading) {
        return <div className="loading">Verificando credenciales...</div>
    }

    // Si la ruta pide estar logueado y no lo está
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Si la ruta pide ser ADMIN y el usuario no lo es
    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />
    }

    // Si pasa todas las pruebas, mostrar el contenido
    return children
}
