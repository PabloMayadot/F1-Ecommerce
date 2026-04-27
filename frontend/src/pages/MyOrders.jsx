import { useState, useEffect } from "react"
import { getOrders } from "../services/api"
import { formatearPrecio, formatearFecha } from "../utils/formato"

const ETIQUETAS_ESTADO = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    shipped: "Enviada",
    delivered: "Entregada",
    cancelled: "Cancelada",
}

export default function MyOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const cargarOrdenes = async () => {
            try {
                const data = await getOrders()
                setOrders(data)
            } catch {
                setError("Error al cargar las órdenes")
            } finally {
                setLoading(false)
            }
        }
        cargarOrdenes()
    }, [])

    return (
        <div className="cart-page">
            <main>
                <h1>Mis órdenes</h1>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">Cargando órdenes...</div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <i className="bi bi-bag"></i>
                        <p>Aún no realizaste ninguna compra</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <span className="order-id">Orden #{order._id.slice(-8)}</span>
                                        <span className="order-date">{formatearFecha(order.createdAt)}</span>
                                    </div>
                                    <span className={`order-status status-${order.status}`}>
                                        {ETIQUETAS_ESTADO[order.status] || order.status}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <span>{item.name}</span>
                                            <span>x{item.quantity}</span>
                                            <span>{formatearPrecio(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-total">
                                    <span>Total: {formatearPrecio(order.total)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
