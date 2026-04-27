import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="navbar navbar-expand-lg main-navbar" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/assets/img/F1.png" alt="F1" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/tienda">
                Tienda
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/equipos">
                Equipos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/galeria">
                Galería
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/carreras">
                Carreras
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contacto">
                Contacto
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {/* Carrito */}
            <li className="nav-item">
              <NavLink className="nav-link cart-link" to="/carrito">
                <i className="bi bi-cart3"></i>
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">
                      <i className="bi bi-gear-fill"></i> Panel Admin
                    </NavLink>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle"></i>{" "}
                    {user?.name || "Usuario"}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                    <li>
                      <Link className="dropdown-item" to="/mis-ordenes">
                        <i className="bi bi-bag-check"></i> Mis órdenes
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  <i className="bi bi-person"></i> Ingresar
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
