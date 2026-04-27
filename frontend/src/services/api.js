const API_URL = import.meta.env.VITE_API_BASE_URL

const getAuthHeaders = () => {
    const token = localStorage.getItem("f1_token")
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
    }
}

/**
 * Realiza una petición fetch y lanza un error si la respuesta no es exitosa.
 */
const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, options)
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    return data.data
}

// ========== PRODUCTOS ==========

export const getProducts = (query = {}) => {
    const params = new URLSearchParams()
    if (query.category) params.append("category", query.category)
    if (query.search) params.append("search", query.search)
    const url = `${API_URL}/products${params.size ? `?${params}` : ""}`
    return fetchJSON(url)
}

export const getProductById = (id) => fetchJSON(`${API_URL}/products/${id}`)

export const createProduct = (formData) =>
    fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("f1_token")}` },
        body: formData,
    }).then(async (res) => {
        const data = await res.json()
        if (!data.success) throw new Error(data.message)
        return data.data
    })

export const deleteProduct = (id) =>
    fetchJSON(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })

// ========== CATEGORÍAS ==========

export const getCategories = () => fetchJSON(`${API_URL}/categories`)

export const createCategory = (categoryData) =>
    fetchJSON(`${API_URL}/categories`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
    })

export const deleteCategory = (id) =>
    fetchJSON(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })

// ========== ÓRDENES ==========

export const createOrder = (orderData) =>
    fetchJSON(`${API_URL}/orders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
    })

export const getOrders = () =>
    fetchJSON(`${API_URL}/orders`, { headers: getAuthHeaders() })

