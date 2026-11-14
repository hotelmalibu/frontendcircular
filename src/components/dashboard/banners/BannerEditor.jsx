import clientLogger from '../../../utils/clientLogger';
import React, { useState, useEffect } from "react";
import {
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Save,
  CheckCircle2,
  ExternalLink,
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

export default function BannerEditor({ pageKey, onSaved }) {
  const [banner, setBanner] = useState(() => bannerService.getBanner(pageKey));
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    tag: "",
    description: "",
    image: "",
  });
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageMode, setImageMode] = useState("file"); // 'file' | 'url'
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const current = bannerService.getBanner(pageKey);
    setBanner(current);
    setFormData({
      title: current.title || "",
      subtitle: current.subtitle || "",
      tag: current.tag || "",
      description: current.description || "",
      image: current.image || "",
    });
    setImageUrlInput(
      current.image && !current.image.startsWith("data:") ? current.image : ""
    );
    setHasChanges(false);
  }, [pageKey]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP)");
      return;
    }

    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1920, 0.82);
      handleChange("image", compressedDataUrl);
      toast.success("Imagen cargada y optimizada");
    } catch (err) {
      clientLogger.error(err);
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
    handleChange("image", imageUrlInput.trim());
    toast.success("URL de imagen aplicada");
  };

  const handleRestoreDefaultImage = () => {
    handleChange("image", banner.defaultImage);
    setImageUrlInput("");
    toast.success("Imagen predeterminada restaurada");
  };

  const handleResetAll = () => {
    if (
      window.confirm(
        `¿Deseas restablecer todos los valores originales del banner para "${banner.name}"?`
      )
    ) {
      const reset = bannerService.resetBanner(pageKey);
      setBanner(reset);
      setFormData({
        title: reset.title || "",
        subtitle: reset.subtitle || "",
        tag: reset.tag || "",
        description: reset.description || "",
        image: reset.image || "",
      });
      setImageUrlInput("");
      setHasChanges(false);
      toast.success("Valores originales restaurados");
      if (onSaved) onSaved(reset);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }

    setIsSaving(true);
    try {
      const updated = bannerService.saveBanner(pageKey, formData);
      setBanner(updated);
      setHasChanges(false);
      toast.success(`Banner de "${banner.name}" actualizado correctamente`);
      if (onSaved) onSaved(updated);
    } catch (err) {
      clientLogger.error(err);
      toast.error("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  // Create combined banner object for preview
  const previewBanner = {
    ...banner,
    ...formData,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: FORM EDIT (7 cols) */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
          <div>
            <h2 className="text-xl font-bold" style={{ color: BRAND.darkBlue }}>
              Editar Banner: {banner.name}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Configura la imagen de fondo y los textos de presentación
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Restablecer valores predeterminados"
            >
              <RotateCcw size={14} />
              Predeterminado
            </button>
            <a
              href={banner.route}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors"
              style={{ backgroundColor: BRAND.green }}
              title="Ver en vivo"
            >
              <ExternalLink size={14} />
              Ver Página
            </a>
          </div>
        </div>

        {/* --- SECTION: IMAGE --- */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
            Imagen de Fondo
          </label>

          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => setImageMode("file")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                imageMode === "file"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"
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
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"
              }`}
            >
              Enlace Web (URL)
            </button>
            <button
              type="button"
              onClick={handleRestoreDefaultImage}
              className="ml-auto text-xs text-blue-600 hover:underline font-medium"
            >
              Restaurar original
            </button>
          </div>

          {imageMode === "file" ? (
            <div className="relative border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-xl p-5 text-center transition-colors bg-gray-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isCompressing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="banner-file-input"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${BRAND.blue}15`, color: BRAND.blue }}
                >
                  <Upload size={22} />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {isCompressing
                    ? "Optimizando imagen..."
                    : "Haz clic o arrastra una nueva imagen aquí"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Formatos recomendados: JPG, PNG o WEBP (hasta 1920px de ancho)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <LinkIcon size={16} />
                </span>
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://ejemplo.com/mi-banner.jpg"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm hover:opacity-90"
                style={{ backgroundColor: BRAND.blue }}
              >
                Aplicar
              </button>
            </div>
          )}

          {formData.image && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
                <img
                  src={formData.image}
                  alt="Miniatura"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">
                  Imagen activa
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {formData.image.startsWith("data:")
                    ? "Imagen local optimizada"
                    : formData.image}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRestoreDefaultImage}
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                title="Quitar imagen personalizada"
              >
                Quitar
              </button>
            </div>
          )}
        </div>

        {/* --- SECTION: TAG (Optional) --- */}
        {banner.tag !== undefined && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Etiqueta Superior (Badge)
            </label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => handleChange("tag", e.target.value)}
              placeholder="Ej: Transparencia Institucional"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Pequeña etiqueta decorativa que aparece arriba del título principal
            </p>
          </div>
        )}

        {/* --- SECTION: TITLE --- */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Título Principal *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Título impactante del banner"
            className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-semibold"
          />
        </div>

        {/* --- SECTION: SUBTITLE (Optional) --- */}
        {banner.subtitle !== undefined && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Línea Secundaria / Subtítulo
            </label>
            <input
              type="text"
              value={formData.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Ej: Conecta con transformadores líderes en economía circular."
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
            />
          </div>
        )}

        {/* --- SECTION: DESCRIPTION --- */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Descripción / Subtítulo
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Texto explicativo o introductorio del banner..."
            className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-y"
          />
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {hasChanges ? "Tienes cambios sin guardar" : "Todos los cambios guardados"}
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            style={{ backgroundColor: BRAND.blue }}
          >
            <Save size={16} />
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>

      {/* RIGHT COLUMN: LIVE PREVIEW (5 cols) */}
      <div className="lg:col-span-5 sticky top-28 space-y-4">
        <BannerLivePreview banner={previewBanner} pageKey={pageKey} />

        <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-800 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-blue-600" />
            Actualización en Tiempo Real
          </p>
          <p className="text-blue-700/80 leading-relaxed">
            Al hacer clic en <strong>Guardar Cambios</strong>, la página pública se actualizará inmediatamente para todos los usuarios.
          </p>
        </div>
      </div>
    </div>
  );
}
