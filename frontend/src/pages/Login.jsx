import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      await login(formData.email, formData.password);
      navigate("/tienda");
    } catch (err) {
      let mensajeAmigable = err.message;
      
      // Traducciones y mensajes amigables para errores comunes
      if (mensajeAmigable.includes("Failed to fetch") || mensajeAmigable.includes("NetworkError")) {
          mensajeAmigable = "No se pudo conectar con el servidor. Revisa tu conexión a internet.";
      } else if (mensajeAmigable.toLowerCase().includes("incorrectos") || 
                 mensajeAmigable.toLowerCase().includes("invalid credentials")) {
          mensajeAmigable = "El correo o la contraseña que ingresaste no son correctos.";
      } else if (mensajeAmigable.toLowerCase().includes("required")) {
          mensajeAmigable = "Por favor, completa todos los campos requeridos.";
      } else if (mensajeAmigable.includes("Unexpected token")) {
          mensajeAmigable = "El servidor no respondió de la forma esperada. Informa de este error.";
      }

      setError(mensajeAmigable);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>
        <p className="auth-subtitle">Ingresá para acceder a tu cuenta</p>

        {error && (
            <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-exclamation-triangle-fill"></i> {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="tucorreo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Tu contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-submit btn-full" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tenés cuenta?{" "}
          <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
}
