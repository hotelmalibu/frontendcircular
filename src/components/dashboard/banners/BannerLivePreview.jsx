import React, { useState } from "react";
import { Monitor, Smartphone, ExternalLink, Image as ImageIcon } from "lucide-react";

const BRAND = {
  blue: "#2C67B0",
  darkBlue: "#005380",
  deepHero: "#1E305D",
  lime: "#B1D357",
  green: "#00AB6D",
};

export default function BannerLivePreview({
  banner,
  pageKey,
  activeSlide = null,
}) {
  const [device, setDevice] = useState("desktop"); // 'desktop' | 'mobile'

  const image = activeSlide
    ? activeSlide.image || activeSlide.defaultImage
    : banner.image || banner.defaultImage;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Header bar of the preview */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
        <div className="flex items-center gap-2">
          <ImageIcon size={18} style={{ color: BRAND.blue }} />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Vista Previa de Imagen
          </span>
          <span className="text-[11px] font-semibold text-gray-400 bg-gray-200/60 px-2 py-0.5 rounded-full">
            {banner.name}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded transition-all ${
              device === "desktop"
                ? "bg-blue-50 text-blue-700 shadow-xs"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="Vista de escritorio"
          >
            <Monitor size={15} />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded transition-all ${
              device === "mobile"
                ? "bg-blue-50 text-blue-700 shadow-xs"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="Vista móvil"
          >
            <Smartphone size={15} />
          </button>
        </div>
      </div>

      {/* Preview container - Pure image display without text overlay */}
      <div className="p-4 bg-gray-100/60 flex items-center justify-center min-h-[340px]">
        <div
          className={`transition-all duration-300 relative overflow-hidden rounded-xl shadow-md border border-gray-200 bg-gray-900 flex items-center justify-center ${
            device === "mobile"
              ? "w-[320px] h-[460px]"
              : "w-full max-w-full h-[320px]"
          }`}
        >
          {image ? (
            <img
              src={image}
              alt={banner.name || "Banner preview"}
              className="w-full h-full object-cover transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400 p-6 text-center">
              <ImageIcon size={44} className="text-gray-600 mb-2" />
              <span className="text-xs font-semibold text-gray-400">
                Sin imagen seleccionada
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>
          Ruta: <code className="text-[#2C67B0] font-mono">{banner.route}</code>
        </span>
        <a
          href={banner.route}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#2C67B0] hover:text-[#005380] transition-colors"
        >
          Visitar página
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
