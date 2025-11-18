import React from "react";
import { Download, Trash2, RotateCcw } from "lucide-react";

export default function Versiones() {
  const versiones = [
    {
      version: "V1.3",
      fecha: "12/09/2025 14:30",
      autor: "María González",
      tamano: "2.3 MB",
      descripcion: "Actualización de datos estadísticos y nuevas referencias",
    },
    {
      version: "V1.2",
      fecha: "11/09/2025 10:15",
      autor: "María González",
      tamano: "2.3 MB",
      descripcion: "Corrección de errores tipográficos",
    },
    {
      version: "V1.1",
      fecha: "10/09/2025 12:30",
      autor: "María González",
      tamano: "2.3 MB",
      descripcion: "Versión inicial del documento",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* --- Buscador --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-8">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Buscar Documento
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Nombre del Documento"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
            Buscar
          </button>
        </div>
      </div>

      {/* --- Historial de Versiones --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 text-left">
          Historial de Versiones
        </h2>
        <div className="space-y-4">
          {versiones.map((v, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800 text-left">
                  {v.version}
                </h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition text-sm">
                    <RotateCcw size={16} /> Restaurar
                  </button>
                  <button className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition text-sm">
                    <Download size={16} /> Descargar
                  </button>
                  <button className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition text-sm">
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1 text-left">
                {v.fecha} • {v.autor} • {v.tamano}
              </p>
              <p className="text-gray-600 text-sm text-left">{v.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Comparación de Versiones --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 text-left">
          Comparación de Versiones
        </h2>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 text-left">
              Versión A
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 text-left">
              Versión B
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button className="self-end bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
            Comparar
          </button>
        </div>

        {/* --- Resultados de comparación --- */}
        <div className="text-left">
          <h3 className="text-md font-semibold text-gray-700 mb-3">
            Cambios Detectados
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            <span className="text-green-600 font-medium">+15 líneas añadidas</span> •{" "}
            <span className="text-red-600 font-medium">-8 líneas eliminadas</span> •{" "}
            <span className="text-yellow-600 font-medium">-3 líneas modificadas</span>
          </p>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-semibold text-blue-700 text-sm text-left">
              Introducción
            </div>
            <div className="p-4 text-sm text-left">
              <p className="bg-green-50 text-green-700 px-2 py-1 rounded-md mb-2">
                + Según los últimos datos de 2025, el 78% de las PYMEs...
              </p>
              <p className="bg-red-50 text-red-700 px-2 py-1 rounded-md">
                - Los datos de 2024 mostraban que solo el 65%...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
