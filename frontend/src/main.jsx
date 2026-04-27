import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Estilos globales de bootstrap e íconos (el index.html también los tiene por CDN, pero garantizamos estilos locales si se agregan en package.json en el futuro)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Estilos personalizados
import "./styles/index.css";         // Del TP Final original
import "./styles/e-commerce.css";    // Nuevos estilos para la tienda

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
