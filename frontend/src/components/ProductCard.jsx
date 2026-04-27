import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { formatearPrecio } from "../utils/formato"

const IMAGEN_POR_DEFECTO = "https://cdn-icons-png.flaticon.com/256/12457/12457612.png"

export default function ProductCard({ product }) {
    const { addToCart } = useCart()

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product, 1)
    }

    const imageUrl = product.images?.[0] || IMAGEN_POR_DEFECTO

    return (
        <Link to={`/tienda/${product._id}`} className="product-card-link">
            <div className="product-card">
                <div className="product-card-image">
                    <img src={imageUrl} alt={product.name} />
                    {product.stock <= 0 && (
                        <span className="product-badge out-of-stock">Sin stock</span>
                    )}
                </div>

                <div className="product-card-body">
                    <span className="product-category">
                        {product.category?.name || "Sin categoría"}
                    </span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{formatearPrecio(product.price)}</p>

                    <button
                        className="btn-add-cart"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                    >
                        {product.stock > 0 ? (
                            <>
                                <i className="bi bi-cart-plus"></i> Agregar
                            </>
                        ) : (
                            "Agotado"
                        )}
                    </button>
                </div>
            </div>
        </Link>
    )
}

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        stock: PropTypes.number,
        images: PropTypes.arrayOf(PropTypes.string),
        category: PropTypes.shape({ name: PropTypes.string }),
    }).isRequired,
}
