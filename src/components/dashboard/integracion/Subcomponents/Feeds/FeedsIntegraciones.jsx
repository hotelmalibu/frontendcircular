import React from "react";
import { RefreshCw, Edit, CheckCircle } from "lucide-react";

export default function FeedsRSS() {
  const feeds = [
    {
      id: 1,
      titulo: "Normativas por Categoría",
      tipo: "RSS 2.0",
      estado: "Inactivo",
      colorEstado: "text-red-500",
      url: "https://ecocircular.com/feeds/normativas.xml",
      subscriptores: 890,
      items: 12,
      ultimaBuild: "15/9, 19:45",
      categorias: "Residuos, Reciclaje, Energía, Agua",
      frecuencia: "undefined",
    },
    {
      id: 2,
      titulo: "Eventos por Territorio",
      tipo: "Atom 1.0",
      estado: "Inactivo",
      colorEstado: "text-red-500",
      url: "https://ecocircular.com/feeds/eventos-territorio.xml",
      subscriptores: 567,
      items: 18,
      ultimaBuild: "15/9, 20:15",
      filtros: "Bogotá, Medellín, Cali, Barranquilla",
      frecuencia: "undefined",
    },
    {
      id: 3,
      titulo: "Noticias Economía Circular",
      tipo: "RSS 2.0",
      estado: "Activo",
      colorEstado: "text-emerald-500",
      url: "https://ecocircular.com/feeds/noticias.xml",
      subscriptores: 1234,
      items: 25,
      ultimaBuild: "15/9, 20:30",
      frecuencia: "cada 30 minutos",
    },
  ];

  const cache = {
    hitRate: "94.2%",
    tamano: "156 MB",
    ultimaLimpieza: "2h ago",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Gestión de Feeds RSS/Atom
          </h1>
          <p className="text-sm text-gray-500">
            Generación y distribución de contenido estructurado
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> 8/10 APIs Activas
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 border border-gray-200">
            <RefreshCw className="w-4 h-4" /> Actualizar
          </button>
        </div>
      </div>

      {/* TARJETAS DE FEEDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 relative"
          >
            {/* TÍTULO Y ESTADO */}
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-base font-semibold text-gray-800">
                {feed.titulo}
              </h3>
              <span className={`text-xs font-semibold ${feed.colorEstado}`}>
                {feed.estado}
              </span>
            </div>

            {/* TIPO DE FEED — alineado a la izquierda */}
            <div className="absolute left-5 top-[42px]">
              <div className="bg-gray-100 rounded-md px-2 py-1 text-[11px] text-gray-600 inline-block border border-gray-200 shadow-inner">
                {feed.tipo}
              </div>
            </div>

            {/* SEPARACIÓN VISUAL */}
            <div className="h-6"></div>

            {/* URL */}
            <div className="bg-gray-50 rounded-md px-3 py-2 mb-3 border border-gray-200 shadow-inner text-xs text-gray-600">
              {feed.url}
            </div>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div>
                <p className="text-xs text-gray-500">Suscriptores</p>
                <p className="text-sky-600 font-semibold text-base">
                  {feed.subscriptores}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Items Activos</p>
                <p className="text-emerald-600 font-semibold text-base">
                  {feed.items}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Último Build</p>
                <p className="text-gray-800 font-semibold text-base">
                  {feed.ultimaBuild}
                </p>
              </div>
            </div>

            {/* CAMPOS EXTRA */}
            <div className="text-xs text-gray-500 space-y-1 mb-2 text-left">
              {feed.categorias && (
                <p>
                  <span className="font-medium text-gray-500">Categorías:</span>{" "}
                  <span className="text-gray-700">{feed.categorias}</span>
                </p>
              )}
              {feed.filtros && (
                <p>
                  <span className="font-medium text-gray-500">Filtros:</span>{" "}
                  <span className="text-gray-700">{feed.filtros}</span>
                </p>
              )}
              {feed.frecuencia && (
                <p>
                  <span className="font-medium text-gray-500">Frecuencia:</span>{" "}
                  <span className="text-gray-700">{feed.frecuencia}</span>
                </p>
              )}
            </div>

            {/* BOTONES */}
            <div className="flex gap-2 mt-4">
              <button className="bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1">
                <Edit className="w-3.5 h-3.5" /> Editar
              </button>
              <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Validar
              </button>
              <button className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Actualizar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SISTEMA DE CACHE */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Estado del Sistema de Cache
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-wrap justify-between items-center">
          <div className="flex gap-10">
            <div>
              <p className="text-xs text-gray-500 mb-1">Hit Rate</p>
              <p className="text-sky-600 font-semibold text-base">
                {cache.hitRate}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tamaño Cache</p>
              <p className="text-emerald-600 font-semibold text-base">
                {cache.tamano}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Última Limpieza</p>
              <p className="text-gray-800 font-semibold text-base">
                {cache.ultimaLimpieza}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200">
              Limpiar Cache
            </button>
            <button className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium px-3 py-1.5 rounded-md">
              Forzar Actualización
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
