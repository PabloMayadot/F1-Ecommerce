import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { formatearPrecio } from "../utils/formato"

const IMAGEN_POR_DEFECTO = "https://cdn-icons-png.flaticon.com/256/12457/12457612.png"

export default function Cart() {
    const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart()
    const { isAuthenticated } = useAuth()

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <main>
                    <h1>Carrito de compras</h1>
                    <div className="empty-state">
                        <i className="bi bi-cart-x"></i>
                        <p>Tu carrito está vacío</p>
                        <Link to="/tienda" className="btn-shop-now">Ir a la tienda</Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="cart-page">
            <main>
                <h1>Carrito de compras</h1>

                <div className="cart-content">
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item._id} className="cart-item">
                                <img
                                    src={item.images?.[0] || IMAGEN_POR_DEFECTO}
                                    alt={item.name}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-price">{formatearPrecio(item.price)}</p>
                                </div>

                                <div className="cart-item-actions">
                                    <div className="quantity-selector">
                                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                    </div>

                                    <p className="cart-item-subtotal">
                                        {formatearPrecio(item.price * item.quantity)}
                                    </p>

                                    <button
                                        className="btn-remove"
                                        onClick={() => removeFromCart(item._id)}
                                        title="Eliminar"
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Resumen</h2>
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

                        {isAuthenticated ? (
                            <Link to="/checkout" className="btn-checkout">Finalizar compra</Link>
                        ) : (
                            <Link to="/login" className="btn-checkout">Ingresar para comprar</Link>
                        )}

                        <button className="btn-clear-cart" onClick={clearCart}>
                            Vaciar carrito
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
