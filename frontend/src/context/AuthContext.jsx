import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

/** Hook para consumir el contexto de autenticación. */
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider")
    }
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    const API_URL = import.meta.env.VITE_API_BASE_URL

    // Al montar, restaurar la sesión desde localStorage
    useEffect(() => {
        const tokenGuardado = localStorage.getItem("f1_token")
        if (tokenGuardado) {
            setToken(tokenGuardado)
            cargarUsuario(tokenGuardado)
        } else {
            setLoading(false)
        }
    }, [])

    const cargarUsuario = async (authToken) => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${authToken}` },
            })
            const data = await res.json()
            if (data.success) {
                setUser(data.data)
            } else {
                // Token inválido o expirado
                cerrarSesion()
            }
        } catch {
            cerrarSesion()
        } finally {
            setLoading(false)
        }
    }

    const iniciarSesion = async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
        const data = await res.json()

        if (!data.success) throw new Error(data.message || "Error al iniciar sesión")

        localStorage.setItem("f1_token", data.token)
        setToken(data.token)
        await cargarUsuario(data.token)
        return data
    }

    const registrar = async (userData) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
        const data = await res.json()

        if (!data.success) throw new Error(data.message || "Error al registrarse")
        return data
    }

    const cerrarSesion = () => {
        localStorage.removeItem("f1_token")
        setToken(null)
        setUser(null)
    }

    const value = {
        user,
        token,
        loading,
        login: iniciarSesion,
        register: registrar,
        logout: cerrarSesion,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
