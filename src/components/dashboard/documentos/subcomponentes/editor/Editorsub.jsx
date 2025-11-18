import React from "react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Image, FileText, Save, Eye } from "lucide-react";

export default function Editorsub() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white shadow-sm rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
          <FileText className="text-blue-500" />
          Editor de Documentos
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-blue-200 transition">
            <Save size={16} /> Guardar Borrador
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-200 transition">
            <Eye size={16} /> Vista Previa
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-blue-600 transition">
            Subir Documento
          </button>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de escritura */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-xl p-5 flex flex-col gap-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b pb-3">
            <button className="p-2 rounded hover:bg-gray-100"><Bold size={18} /></button>
            <button className="p-2 rounded hover:bg-gray-100"><Italic size={18} /></button>
            <button className="p-2 rounded hover:bg-gray-100"><Underline size={18} /></button>
            <span className="mx-2 text-gray-300">|</span>
            <button className="p-2 rounded hover:bg-gray-100"><AlignLeft size={18} /></button>
            <button className="p-2 rounded hover:bg-gray-100"><AlignCenter size={18} /></button>
            <button className="p-2 rounded hover:bg-gray-100"><AlignRight size={18} /></button>
            <span className="mx-2 text-gray-300">|</span>
            <button className="p-2 rounded hover:bg-gray-100"><Image size={18} /></button>
          </div>

          {/* Título */}
          <input
            type="text"
            placeholder="Título del documento..."
            className="text-2xl font-semibold text-gray-800 outline-none border-b border-gray-200 pb-2 focus:border-blue-400 transition"
          />

          {/* Cuerpo del documento */}
          <textarea
            placeholder="Comienza a escribir tu documento aquí..."
            rows="15"
            className="w-full text-gray-700 text-base leading-relaxed resize-none outline-none bg-transparent"
          ></textarea>
        </div>

        {/* Panel lateral de metadatos */}
        <div className="bg-white shadow-sm rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-gray-700 font-semibold border-b pb-2">Metadatos</h2>

          <div className="flex flex-col gap-3 text-sm">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Descripción</label>
              <input
                type="text"
                placeholder="Descripción del documento"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Autor</label>
              <input
                type="text"
                placeholder="Nombre del autor"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Idioma</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 outline-none">
                <option>Español</option>
                <option>Inglés</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Categoría</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 outline-none">
                <option>Seleccionar categoría</option>
                <option>Técnico</option>
                <option>Investigación</option>
                <option>Educativo</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Etiquetas</label>
              <input
                type="text"
                placeholder="Ej: reciclaje, sostenibilidad"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Estado</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 outline-none">
                <option>Borrador</option>
                <option>Publicado</option>
                <option>En revisión</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Fecha de Publicación</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Biblioteca de Medios</label>
              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm">
                Abrir Biblioteca
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
