import { Link } from "react-router-dom";
import "../styles/notfound.css";

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404 | Página no encontrada</h1>
      <p>Ups... Nos fuimos a la grava.</p>
      <Link to="/" className="btn-shop-now" style={{ marginTop: "24px" }}>
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFound;
