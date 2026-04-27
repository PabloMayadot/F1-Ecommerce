import { useState, useEffect } from "react"
import { getProducts, getCategories, createProduct, deleteProduct, createCategory, deleteCategory } from "../services/api"
import { formatearPrecio } from "../utils/formato"

const FORM_PRODUCTO_INICIAL = { name: "", description: "", price: "", stock: "", category: "", image: null }
const FORM_CATEGORIA_INICIAL = { name: "", description: "" }

export default function AdminDashboard() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [activeTab, setActiveTab] = useState("products")
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [productForm, setProductForm] = useState(FORM_PRODUCTO_INICIAL)
    const [categoryForm, setCategoryForm] = useState(FORM_CATEGORIA_INICIAL)

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        setLoading(true)
        try {
            const [prods, cats] = await Promise.all([getProducts(), getCategories()])
            setProducts(prods)
            setCategories(cats)
        } catch {
            setError("Error al cargar datos")
        } finally {
            setLoading(false)
        }
    }

    const mostrarExito = (mensaje) => {
        setSuccess(mensaje)
        setTimeout(() => setSuccess(null), 3000)
    }

    const handleCambiarTab = (tab) => {
        setActiveTab(tab)
        setShowForm(false)
        setError(null)
    }

    const handleCrearProducto = async (e) => {
        e.preventDefault()
        setError(null)

        const formData = new FormData()
        formData.append("name", productForm.name)
        formData.append("description", productForm.description)
        formData.append("price", productForm.price)
        formData.append("stock", productForm.stock)
        formData.append("category", productForm.category)
        if (productForm.image) formData.append("image", productForm.image)

        try {
            await createProduct(formData)
            mostrarExito("Producto creado correctamente")
            setProductForm(FORM_PRODUCTO_INICIAL)
            setShowForm(false)
            cargarDatos()
        } catch (err) {
            let mensajeAmigable = err.message;

            if (mensajeAmigable.includes("Failed to fetch") || mensajeAmigable.includes("NetworkError")) {
                mensajeAmigable = "Error de red: No se pudo subir el producto.";
            } else if (mensajeAmigable.toLowerCase().includes("token")) {
                mensajeAmigable = "Tu sesión como administrador expiró.";
            }

            setError(mensajeAmigable)
        }
    }

    const handleCrearCategoria = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            await createCategory(categoryForm)
            mostrarExito("Categoría creada correctamente")
            setCategoryForm(FORM_CATEGORIA_INICIAL)
            setShowForm(false)
            cargarDatos()
        } catch (err) {
            let mensajeAmigable = err.message;
            if (mensajeAmigable.toLowerCase().includes("duplicate")) {
                mensajeAmigable = "Esta categoría ya existe.";
            } else if (mensajeAmigable.includes("Failed to fetch")) {
                mensajeAmigable = "Error de red: No se conectó al servidor.";
            }
            setError(mensajeAmigable)
        }
    }

    const handleEliminarProducto = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return
        try {
            await deleteProduct(id)
            mostrarExito("Producto eliminado")
            cargarDatos()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleEliminarCategoria = async (id) => {
        if (!confirm("¿Estás seguro de eliminar esta categoría?")) return
        try {
            await deleteCategory(id)
            mostrarExito("Categoría eliminada")
            cargarDatos()
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) return <div className="cart-page"><div className="loading">Cargando panel...</div></div>

    return (
        <div className="cart-page admin-page">
            <main>
                <h1><i className="bi bi-gear-fill"></i> Panel de administración</h1>

                {error && (
                    <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bi bi-exclamation-octagon-fill"></i> {error}
                    </div>
                )}
                {success && (
                    <div className="success-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bi bi-check-circle-fill"></i> {success}
                    </div>
                )}

                <div className="admin-tabs">
                    <button
                        className={`filter-btn ${activeTab === "products" ? "active" : ""}`}
                        onClick={() => handleCambiarTab("products")}
                    >
                        Productos ({products.length})
                    </button>
                    <button
                        className={`filter-btn ${activeTab === "categories" ? "active" : ""}`}
                        onClick={() => handleCambiarTab("categories")}
                    >
                        Categorías ({categories.length})
                    </button>
                </div>

                <button className="btn-submit" style={{ marginBottom: "16px" }} onClick={() => setShowForm(!showForm)}>
                    <i className="bi bi-plus-lg"></i> {showForm ? "Cancelar" : `Crear ${activeTab === "products" ? "producto" : "categoría"}`}
                </button>

                {showForm && activeTab === "products" && (
                    <form className="admin-form" onSubmit={handleCrearProducto}>
                        <div className="form-field">
                            <label>Nombre</label>
                            <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                        </div>
                        <div className="form-field">
                            <label>Descripción</label>
                            <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
                        </div>
                        <div className="form-row">
                            <div className="form-field">
                                <label>Precio</label>
                                <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required min="1" />
                            </div>
                            <div className="form-field">
                                <label>Stock</label>
                                <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required min="0" />
                            </div>
                        </div>
                        <div className="form-field">
                            <label>Categoría</label>
                            <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required>
                                <option value="" disabled>Seleccioná una categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Imagen</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProductForm({ ...productForm, image: e.target.files[0] })}
                            />
                        </div>
                        <button type="submit" className="btn-submit">Crear producto</button>
                    </form>
                )}

                {showForm && activeTab === "categories" && (
                    <form className="admin-form" onSubmit={handleCrearCategoria}>
                        <div className="form-field">
                            <label>Nombre</label>
                            <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
                        </div>
                        <div className="form-field">
                            <label>Descripción</label>
                            <input type="text" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                        </div>
                        <button type="submit" className="btn-submit">Crear categoría</button>
                    </form>
                )}

                {activeTab === "products" && (
                    <div className="results-table-container">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Categoría</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p._id}>
                                        <td>{p.name}</td>
                                        <td>{formatearPrecio(p.price)}</td>
                                        <td>{p.stock}</td>
                                        <td>{p.category?.name || "-"}</td>
                                        <td>
                                            <button className="btn-remove" onClick={() => handleEliminarProducto(p._id)} title="Eliminar">
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "categories" && (
                    <div className="results-table-container">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((c) => (
                                    <tr key={c._id}>
                                        <td>{c.name}</td>
                                        <td>{c.description || "-"}</td>
                                        <td>
                                            <button className="btn-remove" onClick={() => handleEliminarCategoria(c._id)} title="Eliminar">
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}
