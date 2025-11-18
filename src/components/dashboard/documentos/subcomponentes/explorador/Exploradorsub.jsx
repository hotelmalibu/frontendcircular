import React, { useState } from "react";
import { Grid, List } from "lucide-react"; 

export default function Exploradorsub() {
  const [vista, setVista] = useState("grid");

  const documentos = [
    {
      titulo: "Manual Técnico Reciclaje",
      autor: "Jesús Daniel",
      fecha: "11/02/2025",
      tipo: "PDF",
      tamano: "2.4MB",
      version: "V1.2",
      descargas: 20,
      etiquetas: ["Reciclaje", "Manual", "Técnico"],
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
      etiquetas: ["Seguridad", "Guía", "Trabajo"],
      estado: "Publicado",
      color: "bg-green-500",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Controles */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex space-x-3">
          <select className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring focus:ring-blue-200">
            <option>Tipo</option>
            <option>PDF</option>
            <option>DOCX</option>
          </select>
          <select className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring focus:ring-blue-200">
            <option>Estado</option>
            <option>Publicado</option>
            <option>Borrador</option>
          </select>
          <select className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring focus:ring-blue-200">
            <option>Ordenar por</option>
            <option>Fecha</option>
            <option>Nombre</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setVista("grid")}
            className={`p-2 rounded-lg ${
              vista === "grid" ? "bg-blue-500 text-white" : "text-gray-500"
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setVista("lista")}
            className={`p-2 rounded-lg ${
              vista === "lista" ? "bg-blue-500 text-white" : "text-gray-500"
            }`}
          >
            <List size={18} />
          </button>
          <button className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-blue-600 transition">
            Subir Documento
          </button>
        </div>
      </div>

      {/* Vista GRID */}
      {vista === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentos.map((doc, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition flex flex-col items-center text-center"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                alt="pdf"
                className="w-16 h-16 mb-3"
              />
              <h3 className="font-semibold text-gray-700 mb-1">{doc.titulo}</h3>
              <p className="text-sm text-gray-500 mb-2">{doc.autor}</p>
              <p className="text-xs text-gray-400 mb-3">
                {doc.fecha} • {doc.tipo} • {doc.tamano}
              </p>
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {doc.etiquetas.map((tag, j) => (
                  <span
                    key={j}
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span
                className={`text-white text-xs px-3 py-1 rounded-full ${doc.color} mb-3`}
              >
                {doc.estado}
              </span>
              <div className="flex space-x-2 mt-auto">
                <button className="text-xs bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200">
                  Editar
                </button>
                <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200">
                  Ver
                </button>
                <button className="text-xs bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200">
                  Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista LISTA */}
      {vista === "lista" && (
        <div className="space-y-4">
          {documentos.map((doc, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  alt="pdf"
                  className="w-12 h-12"
                />
                <div>
                  <h3 className="font-semibold text-gray-700">
                    {doc.titulo}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {doc.autor} • {doc.fecha} • {doc.tipo} • {doc.tamano} •{" "}
                    {doc.version}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {doc.etiquetas.map((tag, j) => (
                      <span
                        key={j}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full ${doc.color} mt-2 inline-block`}
                  >
                    {doc.estado}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-xs bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200">
                  Editar
                </button>
                <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200">
                  Ver
                </button>
                <button className="text-xs bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200">
                  Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
