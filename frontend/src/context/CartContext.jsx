import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

/** Hook para consumir el contexto del carrito. */
export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider")
    }
    return context
}

const cargarCarritoGuardado = () => {
    try {
        const guardado = localStorage.getItem("f1_cart")
        return guardado ? JSON.parse(guardado) : []
    } catch {
        return []
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(cargarCarritoGuardado)

    // Persistir en localStorage cada vez que cambie el carrito
    useEffect(() => {
        localStorage.setItem("f1_cart", JSON.stringify(items))
    }, [items])

    const addToCart = (product, quantity = 1) => {
        setItems((prev) => {
            const existente = prev.find((item) => item._id === product._id)
            if (existente) {
                return prev.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            return [...prev, { ...product, quantity }]
        })
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setItems((prev) =>
            prev.map((item) => item._id === productId ? { ...item, quantity } : item)
        )
    }

    const removeFromCart = (productId) => {
        setItems((prev) => prev.filter((item) => item._id !== productId))
    }

    const clearCart = () => setItems([])

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const value = { items, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, subtotal }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
