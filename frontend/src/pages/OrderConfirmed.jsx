import { Link } from "react-router-dom";

export default function OrderConfirmed() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <i className="bi bi-check-circle-fill" style={{ fontSize: "3rem", color: "#28a745" }}></i>
        <h1>¡Compra confirmada!</h1>
        <p className="auth-subtitle">
          Tu orden fue procesada correctamente. El stock fue descontado y pronto
          recibirás tus productos.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
          <Link to="/mis-ordenes" className="btn-submit">
            Ver mis órdenes
          </Link>
          <Link to="/tienda" className="btn-shop-now">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
