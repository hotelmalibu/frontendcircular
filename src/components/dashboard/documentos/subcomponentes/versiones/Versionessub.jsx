import React from "react";
import { 
  Download, 
  Trash2, 
  RotateCcw, 
  Search, 
  GitCompare, 
  FileClock, 
  User, 
  HardDrive, 
  ArrowRight,
  CheckCircle2,
  XCircle
} from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja (Alertas)
  red: "#DC2626",        // Rojo estándar para eliminar/borrar (armonizado)
  gray: "#6B7280",
};

export default function Versiones() {
  const versiones = [
    {
      version: "V1.3",
      fecha: "12/09/2025 14:30",
      autor: "María González",
      tamano: "2.3 MB",
      descripcion: "Actualización de datos estadísticos y nuevas referencias bibliográficas.",
      isLatest: true,
    },
    {
      version: "V1.2",
      fecha: "11/09/2025 10:15",
      autor: "María González",
      tamano: "2.3 MB",
      descripcion: "Corrección de errores tipográficos en la sección 4.",
      isLatest: false,
    },
    {
      version: "V1.1",
      fecha: "10/09/2025 12:30",
      autor: "María González",
      tamano: "2.1 MB",
      descripcion: "Versión inicial del documento para revisión interna.",
      isLatest: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-700">
      
      {/* Encabezado */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
            <FileClock className="text-blue-400" /> Control de Versiones
          </h1>
          <p className="text-sm text-gray-500 mt-1">Historial de cambios y recuperación de archivos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLUMNA IZQUIERDA: Historial y Buscador (2/3) --- */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Buscador Estilizado */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold mb-2 ml-1" style={{ color: BRAND.darkBlue }}>
              Buscar en el historial
            </label>
            <div className="flex gap-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por versión, autor o descripción..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{ "--tw-ring-color": BRAND.lightBlue }}
              />
              <button 
                className="text-white px-6 py-2 rounded-xl font-medium shadow-sm hover:opacity-90 transition"
                style={{ backgroundColor: BRAND.blue }}
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Lista de Versiones */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6" style={{ color: BRAND.darkBlue }}>
              Historial de Versiones
            </h2>
            <div className="space-y-4">
              {versiones.map((v, index) => (
                <div
                  key={index}
                  className="group border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all bg-white relative overflow-hidden"
                >
                  {/* Indicador visual lateral */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: v.isLatest ? BRAND.darkGreen : BRAND.lightBlue }}
                  ></div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pl-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span 
                          className="text-lg font-bold px-3 py-1 rounded-lg"
                          style={{ 
                            backgroundColor: v.isLatest ? '#F0FDF4' : '#EFF6FF', 
                            color: v.isLatest ? BRAND.darkGreen : BRAND.blue 
                          }}
                        >
                          {v.version}
                        </span>
                        {v.isLatest && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-green-600 border border-green-200 px-2 py-0.5 rounded-full bg-white">
                            Actual
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-mono">ID: 8a2f3c</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {v.descripcion}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                           <User size={14} className="text-gray-400"/> {v.autor}
                        </span>
                        <span className="flex items-center gap-1.5">
                           <FileClock size={14} className="text-gray-400"/> {v.fecha}
                        </span>
                        <span className="flex items-center gap-1.5">
                           <HardDrive size={14} className="text-gray-400"/> {v.tamano}
                        </span>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex md:flex-col gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4">
                      <button 
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition hover:bg-blue-50"
                        style={{ color: BRAND.blue }}
                        title="Restaurar esta versión"
                      >
                        <RotateCcw size={16} /> <span className="md:hidden xl:inline">Restaurar</span>
                      </button>
                      <button 
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                        title="Descargar"
                      >
                        <Download size={16} /> <span className="md:hidden xl:inline">Descargar</span>
                      </button>
                      <button 
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 transition hover:bg-red-50"
                        title="Eliminar registro"
                      >
                        <Trash2 size={16} /> <span className="md:hidden xl:inline">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: Comparador (1/3) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <GitCompare className="text-gray-400" /> Comparar Versiones
            </h2>

            {/* Selectores */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <div className="space-y-3 relative">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Versión Origen</label>
                  <select className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none">
                     <option>V1.2 (Anterior)</option>
                     <option>V1.1</option>
                  </select>
                </div>
                
                {/* Icono flecha decorativo */}
                <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-gray-200 rounded-full p-1 text-gray-500">
                    <ArrowRight size={14} className="transform rotate-90" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Versión Destino</label>
                  <select className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none">
                     <option>V1.3 (Actual)</option>
                  </select>
                </div>

                <button 
                  className="w-full mt-2 text-white py-2 rounded-lg font-medium text-sm transition hover:shadow-md"
                  style={{ backgroundColor: BRAND.darkBlue }}
                >
                  Ejecutar Comparación
                </button>
              </div>
            </div>

            {/* Resultados de comparación */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">
                Resumen de Cambios
              </h3>
              
              <div className="flex justify-between text-sm mb-4 bg-gray-50 p-3 rounded-lg">
                <div className="text-center">
                  <span className="block font-bold text-green-600">+15</span>
                  <span className="text-xs text-gray-500">Añadidas</span>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <span className="block font-bold text-red-500">-8</span>
                  <span className="text-xs text-gray-500">Eliminadas</span>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <span className="block font-bold text-yellow-600">3</span>
                  <span className="text-xs text-gray-500">Editadas</span>
                </div>
              </div>

              {/* Bloque de código/texto diff */}
              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-gray-100 px-3 py-2 font-semibold text-gray-600 border-b border-gray-200 flex justify-between">
                  <span>Sección: Introducción</span>
                  <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500">Línea 12</span>
                </div>
                <div className="bg-white p-3 font-mono space-y-2">
                  <div className="flex gap-2 p-1.5 rounded bg-red-50 text-red-800 border-l-2 border-red-400 opacity-70">
                    <XCircle size={12} className="mt-0.5 flex-shrink-0" />
                    <p className="line-through decoration-red-300">
                      Los datos de 2024 mostraban que solo el 65%...
                    </p>
                  </div>
                  <div className="flex gap-2 p-1.5 rounded bg-[#F0FDF4] text-[#14532D] border-l-2 border-[#B1D357]">
                    <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0" />
                    <p>
                      Según los últimos datos de 2025, el 78% de las PYMEs...
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}