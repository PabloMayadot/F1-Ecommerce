import { useState, useCallback, useEffect } from "react";
import "../styles/galería.css";

const GALLERY_DATA = [
  { id: 1, src: "/assets/img/2265359570.webp.avif", title: "Alpine de Gasly" },
  { id: 2, src: "/assets/img/2266407902.webp.avif", title: "Red Bull de Verstappen" },
  { id: 3, src: "/assets/img/2268566310.webp.avif", title: "Alpine en Suzuka" },
  { id: 4, src: "/assets/img/2268572376.webp.avif", title: "Leclerc en curva" },
  { id: 5, src: "/assets/img/2268737809.webp.avif", title: "Mclaren saliendo de boxes" },
  { id: 6, src: "/assets/img/2268884816.webp.avif", title: "Mercedes en Silverstone" },
  { id: 7, src: "/assets/img/GettyImages-2266398499.webp.avif", title: "Hamilton y Leclerc" },
];

export default function Galeria() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextSlide = useCallback((e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % GALLERY_DATA.length);
  }, []);

  const prevSlide = useCallback((e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + GALLERY_DATA.length) % GALLERY_DATA.length);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextSlide, prevSlide]);

  return (
    <div className="gallery-page">
      <main>
        <h1 className="gallery-title">Galería Oficial F1 2026</h1>

        <div className="masonry-grid">
          {GALLERY_DATA.map((image, idx) => (
            <div key={image.id} className="masonry-item" onClick={() => openLightbox(idx)}>
              <img src={image.src} alt={image.title} loading="lazy" />
              <div className="masonry-overlay">
                <span className="masonry-overlay-title">{image.title}</span>
                <i className="bi bi-zoom-in masonry-zoom-icon"></i>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal de previsualización */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <i className="bi bi-x-lg"></i>
          </button>

          <button className="lightbox-nav prev" onClick={prevSlide}>
            <i className="bi bi-chevron-left"></i>
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY_DATA[lightboxIndex].src} alt={GALLERY_DATA[lightboxIndex].title} />
            <div className="lightbox-caption">
              {GALLERY_DATA[lightboxIndex].title}
              <span className="lightbox-counter">{lightboxIndex + 1} / {GALLERY_DATA.length}</span>
            </div>
          </div>

          <button className="lightbox-nav next" onClick={nextSlide}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}
