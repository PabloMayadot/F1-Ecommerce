import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Componentes
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmed from "./pages/OrderConfirmed";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Equipos from "./pages/Equipos";
import Galeria from "./pages/Galeria";
import Carreras from "./pages/Carreras";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";

function Layout({ children }) {
  return (
    <div className="app-container">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Públicas */}
              <Route path="/" element={<Home title="F1 Ecommerce" subtitle="Tienda Oficial" videoSrc="/assets/video/hero-video.mp4" />} />
              <Route path="/tienda" element={<Catalog />} />
              <Route path="/tienda/:id" element={<ProductDetail />} />
              <Route path="/equipos" element={<Equipos />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="/carreras" element={<Carreras />} />
              <Route path="/contacto" element={<Contacto />} />
              
              {/* Autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Privadas / Carrito */}
              <Route path="/carrito" element={<Cart />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orden-confirmada" element={<OrderConfirmed />} />
              <Route path="/mis-ordenes" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              
              {/* Administración */}
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
