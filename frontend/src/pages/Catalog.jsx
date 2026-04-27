import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { getProducts, getCategories } from "../services/api"
import ProductCard from "../components/ProductCard"

export default function Catalog() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    const categoriaActiva = searchParams.get("category") || ""
    const busquedaActiva = searchParams.get("search") || ""

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => console.error("Error al cargar categorías"))
    }, [])

    useEffect(() => {
        const cargarProductos = async () => {
            setLoading(true)
            setError(null)
            try {
                const query = {}
                if (categoriaActiva) query.category = categoriaActiva
                if (busquedaActiva) query.search = busquedaActiva
                const data = await getProducts(query)
                setProducts(data)
            } catch {
                setError("Error al cargar los productos")
            } finally {
                setLoading(false)
            }
        }
        cargarProductos()
    }, [categoriaActiva, busquedaActiva])

    const filtrarPorCategoria = (categoryId) => {
        const params = new URLSearchParams(searchParams)
        if (categoryId) {
            params.set("category", categoryId)
        } else {
            params.delete("category")
        }
        setSearchParams(params)
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        const search = new FormData(e.target).get("search")
        const params = new URLSearchParams(searchParams)
        if (search) {
            params.set("search", search)
        } else {
            params.delete("search")
        }
        setSearchParams(params)
    }

    return (
        <div className="catalog-page">
            <main>
                <h1>Tienda F1</h1>

                <form className="catalog-search" onSubmit={handleBuscar}>
                    <input
                        type="text"
                        name="search"
                        placeholder="Buscar productos..."
                        defaultValue={busquedaActiva}
                    />
                    <button type="submit">
                        <i className="bi bi-search"></i>
                    </button>
                </form>

                <div className="catalog-filters">
                    <button
                        className={`filter-btn ${!categoriaActiva ? "active" : ""}`}
                        onClick={() => filtrarPorCategoria("")}
                    >
                        Todos
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            className={`filter-btn ${categoriaActiva === cat._id ? "active" : ""}`}
                            onClick={() => filtrarPorCategoria(cat._id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">Cargando productos...</div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <i className="bi bi-inbox"></i>
                        <p>No se encontraron productos</p>
                        {(categoriaActiva || busquedaActiva) && (
                            <button className="filter-btn" onClick={() => setSearchParams({})}>
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
