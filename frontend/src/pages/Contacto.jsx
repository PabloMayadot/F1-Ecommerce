import { useState } from "react"
import "../styles/contacto.css"

const FORM_INICIAL = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    acceptTerms: false,
    subscribeNewsletter: false
}

export default function Contacto() {
    const [formData, setFormData] = useState(FORM_INICIAL)
    const [enviando, setEnviando] = useState(false)
    const [enviado, setEnviado] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handleReset = () => {
        setFormData(FORM_INICIAL)
        setEnviado(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setEnviando(true)

        // Simular envío de formulario
        await new Promise(resolve => setTimeout(resolve, 800))

        setEnviando(false)
        setEnviado(true)
        setFormData(FORM_INICIAL)

        setTimeout(() => setEnviado(false), 5000)
    }

    return (
        <div className="contact-page-wrapper">
            <div className="contact-form-card">
                <h2>Envianos tu mensaje</h2>

                {enviado && (
                    <div className="success-message">
                        <i className="bi bi-check-circle-fill"></i> Mensaje enviado correctamente. Entraremos a boxes para procesar tu solicitud y te contactaremos en breve.
                    </div>
                )}

                <form onSubmit={handleSubmit} onReset={handleReset} className="modern-contact-form">
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="name">Nombre Completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Ej. Ayrton Senna"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="ayrton@ejemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="phone">Teléfono (Opcional)</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="+54 11 1234-5678"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="subject">Área de Consulta</label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Seleccioná un área...</option>
                                <option value="pedidos">Estado de Pedidos</option>
                                <option value="soporte">Soporte Técnico</option>
                                <option value="ventas">Ventas y Merchandising</option>
                                <option value="otros">Otras Consultas</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="message">Tu Mensaje</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            placeholder="Describí tu duda o problema aquí..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="checkbox-group">
                        <div className="checkbox-item check-modern">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="acceptTerms">
                                Acepto los <a href="#">términos y condiciones de privacidad</a>
                            </label>
                        </div>
                        <div className="checkbox-item check-modern">
                            <input
                                type="checkbox"
                                id="subscribeNewsletter"
                                name="subscribeNewsletter"
                                checked={formData.subscribeNewsletter}
                                onChange={handleChange}
                            />
                            <label htmlFor="subscribeNewsletter">
                                Suscribirme a noticias del Paddock
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit btn-f1-premium" disabled={enviando}>
                            {enviando ? "Enviando..." : "Enviar Mensaje"} <i className="bi bi-send-fill ms-2"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
