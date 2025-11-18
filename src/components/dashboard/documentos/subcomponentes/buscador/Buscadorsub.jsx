import React, { useState } from "react";
import { Search, Filter, Download, Eye, Edit, FileText } from "lucide-react";

export default function Buscadorsub() {
  const [filtros, setFiltros] = useState({
    tipo: [],
    estado: "",
    desde: "",
    hasta: "",
    palabra: "",
  });

  const documentos = [
    {
      titulo: "Manual Técnico Reciclaje",
      autor: "Jesús Daniel",
      fecha: "11/02/2025",
      tipo: "PDF",
      tamano: "2.4MB",
      version: "V1.2",
      descargas: 20,
      estado: "Publicado",
      color: "bg-blue-500",
    },
    {
      titulo: "Guía de Seguridad Industrial",
      autor: "Jesús Daniel",
      fecha: "09/02/2025",
      tipo: "PDF",
      tamano: "3.1MB",
      version: "V2.0",
      descargas: 12,
      estado: "Publicado",
      color: "bg-green-500",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">

      {/* 🔍 Barra de búsqueda */}
      <div className="bg-white shadow-sm rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por título, autor o etiqueta..."
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:ring focus:ring-blue-100 outline-none text-sm"
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition flex items-center gap-1">
          <Filter size={16} />
          Buscar
        </button>
      </div>

      {/* 🧩 Filtros */}
      <div className="bg-white shadow-sm rounded-xl p-5">
        <h2 className="font-semibold text-gray-700 mb-3 border-b pb-2">
          Filtros de Búsqueda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">

          {/* Tipo de documento */}
          <div>
            <h3 className="font-medium text-gray-600 mb-2">Tipo de Documento</h3>
            <div className="space-y-1">
              {["PDF", "Word", "Excel", "Imagen", "Video"].map((tipo) => (
                <label key={tipo} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500" />
                  {tipo}
                </label>
              ))}
            </div>
          </div>

          {/* Estado */}
          <div>
            <h3 className="font-medium text-gray-600 mb-2">Estado</h3>
            <div className="space-y-1">
              {["Publicado", "Borrador", "Esperando Revisión"].map((estado) => (
                <label key={estado} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500" />
                  {estado}
                </label>
              ))}
            </div>
          </div>

          {/* Fecha */}
          <div>
            <h3 className="font-medium text-gray-600 mb-2">Fecha Límite</h3>
            <div className="space-y-2">
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-1.5 text-gray-600 outline-none focus:ring focus:ring-blue-100"
              />
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-1.5 text-gray-600 outline-none focus:ring focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Autor */}
          <div>
            <h3 className="font-medium text-gray-600 mb-2">Autor</h3>
            <input
              type="text"
              placeholder="Nombre del autor..."
              className="w-full border rounded-lg px-3 py-1.5 text-gray-600 outline-none focus:ring focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-5">
          <button className="text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
            Limpiar
          </button>
          <button className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* 📋 Resultados */}
      <div className="bg-white shadow-sm rounded-xl p-5">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="font-semibold text-gray-700">
            Resultados de Búsqueda
          </h2>
          <p className="text-sm text-gray-500">
            {documentos.length} documentos encontrados
          </p>
        </div>

        <div className="space-y-4">
          {documentos.map((doc, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <FileText className="text-red-500" size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{doc.titulo}</h3>
                  <p className="text-sm text-gray-500">
                    {doc.autor} • {doc.fecha} • {doc.tipo} • {doc.tamano} •{" "}
                    {doc.version}
                  </p>
                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full ${doc.color} mt-2 inline-block`}
                  >
                    {doc.estado}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="text-xs bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 flex items-center gap-1">
                  <Edit size={14} /> Editar
                </button>
                <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 flex items-center gap-1">
                  <Eye size={14} /> Ver
                </button>
                <button className="text-xs bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 flex items-center gap-1">
                  <Download size={14} /> Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
