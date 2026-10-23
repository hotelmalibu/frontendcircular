import React, { useState, useEffect } from "react";
import {
  Upload,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import bannerService, { compressImageFile } from "../../../services/bannerService";
import BannerLivePreview from "./BannerLivePreview";

const BRAND = {
  blue: "#2C67B0",
  darkBlue: "#005380",
  deepHero: "#1E305D",
  lime: "#B1D357",
  green: "#00AB6D",
};

export default function CarouselEditor({ pageKey = "inicio", onSaved }) {
  const [banner, setBanner] = useState(() => bannerService.getBanner(pageKey));
  const [slides, setSlides] = useState(() => banner?.slides || []);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [imageMode, setImageMode] = useState("file"); // 'file' | 'url'
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const current = bannerService.getBanner(pageKey);
    setBanner(current);
    setSlides(current.slides || []);
    setActiveSlideIndex(0);
    setHasChanges(false);
  }, [pageKey]);

  const currentSlide = slides[activeSlideIndex] || slides[0] || {};

  const handleSlideFieldChange = (field, value) => {
    setSlides((prev) => {
      const next = [...prev];
      next[activeSlideIndex] = {
        ...next[activeSlideIndex],
        [field]: value,
      };
      return next;
    });
    setHasChanges(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1920, 0.82);
      handleSlideFieldChange("image", compressedDataUrl);
      toast.success("Imagen de diapositiva optimizada y cargada");
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar la imagen");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleApplyUrl = () => {
    if (!imageUrlInput.trim()) {
      toast.error("Ingresa una URL de imagen válida");
      return;
    }
    handleSlideFieldChange("image", imageUrlInput.trim());
    setImageUrlInput("");
    toast.success("URL aplicada a la diapositiva");
  };

  const handleRestoreDefaultSlideImage = () => {
    const def = currentSlide.defaultImage;
    handleSlideFieldChange("image", def);
    toast.success("Imagen predeterminada restaurada");
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      image: currentSlide.image || currentSlide.defaultImage,
      defaultImage: currentSlide.defaultImage,
      title: "Nuevo Título Principal",
      subtitle: "Subtítulo de la diapositiva",
      description: "Descripción detallada para esta nueva diapositiva del carrusel de inicio.",
      button1: "Más información",
      button1_link: "/quines-somos",
      button2: "Nuestras Estrategias",
      button2_link: "/lineas-estrategicas",
    };

    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
    setHasChanges(true);
    toast.success("Nueva diapositiva agregada");
  };

  const handleDeleteSlide = (indexToDelete) => {
    if (slides.length <= 1) {
      toast.error("El carrusel debe tener al menos una diapositiva");
      return;
    }

    if (window.confirm("¿Estás seguro de eliminar esta diapositiva?")) {
      setSlides((prev) => prev.filter((_, idx) => idx !== indexToDelete));
      if (activeSlideIndex >= indexToDelete && activeSlideIndex > 0) {
        setActiveSlideIndex((prev) => prev - 1);
      }
      setHasChanges(true);
      toast.success("Diapositiva eliminada");
    }
  };

  const handleResetCarousel = () => {
    if (
      window.confirm(
        "¿Deseas restablecer todas las diapositivas a su configuración original de fábrica?"
      )
    ) {
      const reset = bannerService.resetBanner(pageKey);
      setBanner(reset);
      setSlides(reset.slides || []);
      setActiveSlideIndex(0);
      setHasChanges(false);
      toast.success("Carrusel restablecido a valores originales");
      if (onSaved) onSaved(reset);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (slides.length === 0) {
      toast.error("El carrusel no puede estar vacío");
      return;
    }

    setIsSaving(true);
    try {
      const updated = bannerService.saveBanner(pageKey, {
        ...banner,
        slides,
      });
      setBanner(updated);
      setHasChanges(false);
      toast.success("Carrusel de inicio guardado con éxito");
      if (onSaved) onSaved(updated);
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar el carrusel");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* FORM COLUMN (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <Layers size={22} className="text-blue-500" />
              Carrusel Principal: {banner.name}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Gestiona las diapositivas animadas con sus imágenes y enlaces
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetCarousel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RotateCcw size={14} />
              Predeterminado
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors"
              style={{ backgroundColor: BRAND.green }}
            >
              <ExternalLink size={14} />
              Ver Página
            </a>
          </div>
        </div>

        {/* --- SLIDES TABS BAR --- */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Diapositivas ({slides.length})
            </label>
            <button
              type="button"
              onClick={handleAddSlide}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg text-white shadow-xs hover:opacity-90 transition-all"
              style={{ backgroundColor: BRAND.blue }}
            >
              <Plus size={14} />
              Agregar Diapositiva
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {slides.map((s, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <div
                  key={s.id || idx}
                  className={`flex items-center rounded-xl border text-xs font-bold transition-all overflow-hidden ${
                    isActive
                      ? "border-blue-400 bg-blue-50 text-blue-800 ring-2 ring-blue-100 shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    className="px-3.5 py-2 flex items-center gap-2"
                  >
                    <span>Slide {idx + 1}</span>
                    {s.title && (
                      <span className="max-w-[90px] truncate text-gray-400 font-normal">
                        - {s.title}
                      </span>
                    )}
                  </button>

                  {slides.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(idx);
                      }}
                      className="px-2 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border-l border-gray-200"
                      title="Eliminar diapositiva"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- CURRENT SLIDE FORM --- */}
        <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/80 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Editando Diapositiva #{activeSlideIndex + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={activeSlideIndex === 0}
                onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Diapositiva anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={activeSlideIndex === slides.length - 1}
                onClick={() => setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Diapositiva siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Slide Image */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Imagen de Fondo del Slide
              </label>
              <button
                type="button"
                onClick={handleRestoreDefaultSlideImage}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Restaurar original
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setImageMode("file")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  imageMode === "file"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-white text-gray-500 border border-gray-200"
                }`}
              >
                Subir Archivo
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  imageMode === "url"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-white text-gray-500 border border-gray-200"
                }`}
              >
                Enlace Web (URL)
              </button>
            </div>

            {imageMode === "file" ? (
              <div className="relative border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-xl p-4 text-center transition-colors bg-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isCompressing}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <Upload size={20} className="text-blue-500 mb-1" />
                  <p className="text-xs font-bold text-gray-700">
                    {isCompressing ? "Procesando imagen..." : "Selecciona una imagen para este slide"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://ejemplo.com/fondo.jpg"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 text-xs font-bold text-white rounded-lg"
                  style={{ backgroundColor: BRAND.blue }}
                >
                  Aplicar
                </button>
              </div>
            )}

            {currentSlide.image && (
              <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={currentSlide.image}
                    alt="Miniatura"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    Imagen activa para Slide #{activeSlideIndex + 1}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Slide Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Línea de Título 1
              </label>
              <input
                type="text"
                value={currentSlide.title || ""}
                onChange={(e) => handleSlideFieldChange("title", e.target.value)}
                placeholder="Ej: Impulsando el país hacia"
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Línea de Título 2 (Subtítulo destacado)
              </label>
              <input
                type="text"
                value={currentSlide.subtitle || ""}
                onChange={(e) => handleSlideFieldChange("subtitle", e.target.value)}
                placeholder="Ej: la economía circular"
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
              />
            </div>
          </div>

          {/* Slide Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              value={currentSlide.description || ""}
              onChange={(e) => handleSlideFieldChange("description", e.target.value)}
              placeholder="Descripción del slide..."
              className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-y"
            />
          </div>

          {/* Slide Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            {/* Button 1 */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Botón 1 (Secundario / Contorno)
              </label>
              <input
                type="text"
                value={currentSlide.button1 || ""}
                onChange={(e) => handleSlideFieldChange("button1", e.target.value)}
                placeholder="Texto del botón 1"
                className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                value={currentSlide.button1_link || ""}
                onChange={(e) => handleSlideFieldChange("button1_link", e.target.value)}
                placeholder="Ruta (ej: /quines-somos)"
                className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-500 font-mono"
              />
            </div>

            {/* Button 2 */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Botón 2 (Primario / Verde)
              </label>
              <input
                type="text"
                value={currentSlide.button2 || ""}
                onChange={(e) => handleSlideFieldChange("button2", e.target.value)}
                placeholder="Texto del botón 2"
                className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                value={currentSlide.button2_link || ""}
                onChange={(e) => handleSlideFieldChange("button2_link", e.target.value)}
                placeholder="Ruta (ej: /lineas-estrategicas)"
                className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {hasChanges ? "Tienes cambios sin guardar" : "Todos los cambios guardados"}
          </span>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            style={{ backgroundColor: BRAND.blue }}
          >
            <Save size={16} />
            {isSaving ? "Guardando..." : "Guardar Carrusel"}
          </button>
        </div>
      </div>

      {/* PREVIEW COLUMN (5 cols) */}
      <div className="lg:col-span-5 sticky top-28 space-y-4">
        <BannerLivePreview
          banner={banner}
          pageKey="inicio"
          activeSlide={currentSlide}
        />

        <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-800 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-blue-600" />
            Diapositiva Activa en Vista Previa
          </p>
          <p className="text-blue-700/80 leading-relaxed">
            Estás previsualizando la <strong>Diapositiva #{activeSlideIndex + 1}</strong>. En la página pública, estas diapositivas rotan automáticamente cada 8 segundos con efectos de transición.
          </p>
        </div>
      </div>
    </div>
  );
}
