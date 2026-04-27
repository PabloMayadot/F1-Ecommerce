import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { createOrder } from "../services/api"
import { formatearPrecio } from "../utils/formato"

const IMAGEN_POR_DEFECTO = "https://cdn-icons-png.flaticon.com/256/12457/12457612.png"

export default function Checkout() {
    const { items, subtotal, clearCart } = useCart()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleConfirmOrder = async () => {
        if (!isAuthenticated) {
            navigate("/login")
            return
        }

        setLoading(true)
        setError(null)

        try {
            await createOrder({
                items: items.map(({ _id, quantity }) => ({ productId: _id, quantity })),
            })
            clearCart()
            navigate("/orden-confirmada")
        } catch (err) {
            let mensajeAmigable = err.message;

            if (mensajeAmigable.includes("Failed to fetch") || mensajeAmigable.includes("NetworkError")) {
                mensajeAmigable = "No se pudo conectar con el servidor. Revisa tu conexión.";
            } else if (mensajeAmigable.includes("Unexpected token")) {
                mensajeAmigable = "Hubo un problema procesando tu orden. Intenta nuevamente.";
            } else if (mensajeAmigable.toLowerCase().includes("token")) {
                mensajeAmigable = "Tu sesión expiró. Por favor, inicia sesión nuevamente.";
            }

            setError(mensajeAmigable)
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <main>
                    <h1>Checkout</h1>
                    <div className="empty-state">
                        <i className="bi bi-cart-x"></i>
                        <p>No hay productos en el carrito</p>
                        <Link to="/tienda" className="btn-shop-now">Ir a la tienda</Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="cart-page">
            <main>
                <Link to="/carrito" className="back-link">
                    <i className="bi bi-arrow-left"></i> Volver al carrito
                </Link>

                <h1>Confirmar compra</h1>

                {error && (
                    <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bi bi-cart-x"></i> {error}
                    </div>
                )}

                <div className="cart-content">
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item._id} className="cart-item checkout-item">
                                <img
                                    src={item.images?.[0] || IMAGEN_POR_DEFECTO}
                                    alt={item.name}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p>Cantidad: {item.quantity}</p>
                                    <p className="cart-item-price">
                                        {formatearPrecio(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Resumen del pedido</h2>
                        <div className="cart-summary-row">
                            <span>Subtotal</span>
                            <span>{formatearPrecio(subtotal)}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Envío</span>
                            <span>Gratis</span>
                        </div>
                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span>{formatearPrecio(subtotal)}</span>
                        </div>

                        <button
                            className="btn-checkout"
                            onClick={handleConfirmOrder}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Confirmar compra"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
