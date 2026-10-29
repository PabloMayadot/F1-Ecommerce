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

const obtenerStockMaximo = (stock) => {
    if (stock === null || stock === undefined || stock === "") return Infinity
    const parsed = Number(stock)
    return Number.isFinite(parsed) ? parsed : Infinity
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(cargarCarritoGuardado)

    // Persistir en localStorage cada vez que cambie el carrito
    useEffect(() => {
        localStorage.setItem("f1_cart", JSON.stringify(items))
    }, [items])

    const addToCart = (product, quantity = 1) => {
        const maxStock = obtenerStockMaximo(product.stock)
        if (maxStock <= 0) return

        setItems((prev) => {
            const existente = prev.find((item) => item._id === product._id)
            if (existente) {
                const nuevaCantidad = Math.min(existente.quantity + quantity, maxStock)
                return prev.map((item) =>
                    item._id === product._id
                        ? { ...item, stock: product.stock, quantity: nuevaCantidad }
                        : item
                )
            }
            return [...prev, { ...product, quantity: Math.min(quantity, maxStock) }]
        })
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setItems((prev) =>
            prev.map((item) => {
                if (item._id !== productId) return item
                const maxStock = obtenerStockMaximo(item.stock)
                return { ...item, quantity: Math.min(quantity, maxStock) }
            })
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
