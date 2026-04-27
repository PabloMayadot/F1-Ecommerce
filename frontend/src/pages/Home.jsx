import { useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

const NEWSLETTER_INICIAL = { name: "", email: "" }

export default function Home({ title, subtitle, videoSrc }) {
    const [newsletter, setNewsletter] = useState(NEWSLETTER_INICIAL)
    const [suscripto, setSuscripto] = useState(false)

    const handleChange = ({ target: { name, value } }) => {
        setNewsletter((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSuscripto(true)
        setNewsletter(NEWSLETTER_INICIAL)
        setTimeout(() => setSuscripto(false), 4000)
    }

    return (
        <section className="hero-section">
            <video autoPlay muted loop>
                <source src={videoSrc} type="video/mp4" />
                Tu navegador no soporta el video.
            </video>

            <div className="hero-overlay"></div>

            <div className="hero-main-content">
                <div className="hero-text-content">
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                    <Link to="/tienda" className="btn-shop-now">
                        <i className="bi bi-bag-fill"></i> Ir a la tienda
                    </Link>
                </div>

                <form className="newsletter-signup-card" onSubmit={handleSubmit}>
                    <h2 className="newsletter-signup-title">
                        Suscribite <i className="bi bi-envelope-check-fill"></i>
                    </h2>

                    <div className="newsletter-form-field">
                        <input
                            id="newsletter-name"
                            type="text"
                            name="name"
                            placeholder=" "
                            autoComplete="name"
                            value={newsletter.name}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="newsletter-name">Nombre</label>
                    </div>

                    <div className="newsletter-form-field">
                        <input
                            id="newsletter-email"
                            type="email"
                            name="email"
                            placeholder=" "
                            autoComplete="email"
                            value={newsletter.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="newsletter-email">Email</label>
                    </div>

                    {suscripto ? (
                        <p className="newsletter-success">
                            <i className="bi bi-check-circle-fill"></i> ¡Gracias por suscribirte!
                        </p>
                    ) : (
                        <button type="submit" className="btn-primary-subscribe">
                            Quiero recibir novedades
                        </button>
                    )}
                </form>
            </div>
        </section>
    )
}

Home.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    videoSrc: PropTypes.string.isRequired,
}
