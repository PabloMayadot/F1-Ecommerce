import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getProductById } from "../services/api"
import { useCart } from "../context/CartContext"
import { formatearPrecio } from "../utils/formato"

const IMAGEN_POR_DEFECTO = "https://cdn-icons-png.flaticon.com/256/12457/12457612.png"

export default function ProductDetail() {
    const { id } = useParams()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [agregado, setAgregado] = useState(false)

    useEffect(() => {
        const cargarProducto = async () => {
            setLoading(true)
            try {
                const data = await getProductById(id)
                setProduct(data)
                setSelectedImage(0) // Reiniciar imagen cuando el producto cambia
            } catch {
                setError("Producto no encontrado")
            } finally {
                setLoading(false)
            }
        }
        cargarProducto()
    }, [id])

    const handleAddToCart = () => {
        addToCart(product, quantity)
        setAgregado(true)
        setTimeout(() => setAgregado(false), 2000)
    }

    if (loading) return <div className="catalog-page"><div className="loading">Cargando producto...</div></div>
    if (error) return <div className="catalog-page"><div className="error-message">{error}</div></div>
    if (!product) return null

    const images = product.images && product.images.length > 0 ? product.images : [IMAGEN_POR_DEFECTO]

    return (
        <div className="catalog-page">
            <main>
                <Link to="/tienda" className="back-link">
                    <i className="bi bi-arrow-left"></i> Volver a la tienda
                </Link>

                <div className="product-detail">
                    <div className="product-detail-gallery">
                        <div className="product-detail-image">
                            <img src={images[selectedImage]} alt={product.name} />
                        </div>
                        
                        {images.length > 1 && (
                            <div className="product-thumbnails">
                                {images.map((img, index) => (
                                    <div 
                                        key={index} 
                                        className={`thumbnail-item ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={img} alt={`${product.name} vista ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="product-detail-info">
                        <span className="product-category">
                            {product.category?.name || "Sin categoría"}
                        </span>
                        <h1>{product.name}</h1>
                        <p className="product-detail-description">{product.description}</p>
                        <p className="product-detail-price">{formatearPrecio(product.price)}</p>

                        <div className="product-detail-stock">
                            {product.stock > 0 ? (
                                <span className="in-stock">
                                    <i className="bi bi-check-circle-fill"></i> En stock ({product.stock} disponibles)
                                </span>
                            ) : (
                                <span className="out-of-stock">
                                    <i className="bi bi-x-circle-fill"></i> Sin stock
                                </span>
                            )}
                        </div>

                        {product.stock > 0 && (
                            <div className="product-detail-actions">
                                <div className="quantity-selector">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className={`btn-add-cart-detail ${agregado ? "added" : ""}`}
                                    onClick={handleAddToCart}
                                >
                                    {agregado ? (
                                        <><i className="bi bi-check-lg"></i> Agregado</>
                                    ) : (
                                        <><i className="bi bi-cart-plus"></i> Agregar al carrito</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
