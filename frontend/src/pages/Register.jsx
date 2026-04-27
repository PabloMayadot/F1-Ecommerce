import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      let mensajeAmigable = err.message;

      if (mensajeAmigable.includes("Failed to fetch") || mensajeAmigable.includes("NetworkError")) {
          mensajeAmigable = "Falla de red: No pudimos contactar al servidor.";
      } else if (mensajeAmigable.toLowerCase().includes("duplicate") || mensajeAmigable.toLowerCase().includes("ya existe")) {
          mensajeAmigable = "Este correo electrónico ya está registrado en otra cuenta.";
      } else if (mensajeAmigable.toLowerCase().includes("password")) {
          mensajeAmigable = "La contraseña no cumple con los requisitos de seguridad.";
      } else if (mensajeAmigable.toLowerCase().includes("validation failed")) {
          mensajeAmigable = "Revisa bien los campos, hay información inválida o incompleta.";
      }

      setError(mensajeAmigable);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Crear cuenta</h1>
        <p className="auth-subtitle">Registrate para comenzar a comprar</p>

        {error && (
            <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-x-circle-fill"></i> {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="reg-name">Nombre</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="tucorreo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="reg-password">Contraseña</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              placeholder="6-12 caracteres, mayúscula, minúscula y número"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={12}
            />
            <small className="form-hint">
              De 6 a 12 caracteres, al menos una mayúscula, una minúscula y un número.
            </small>
          </div>

          <button type="submit" className="btn-submit btn-full" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
