import React, { useState } from "react";
import { X, Image, Type, FileText, MousePointerClick } from "lucide-react";

export default function ModalNuevoNewsletter({ onClose }) {
  const [asunto, setAsunto] = useState("");
  const [bloques, setBloques] = useState([]);
  const [vista, setVista] = useState("desktop");

  const agregarBloque = (tipo) => {
    const nuevoBloque = { tipo, id: Date.now(), contenido: "" };
    setBloques([...bloques, nuevoBloque]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-6xl rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Creador de Newsletter
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50">
          {/* Bloques disponibles */}
          <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">
              Bloques Disponibles
            </h3>
            <input
              type="text"
              placeholder="Buscar bloque..."
              className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1 mb-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
            <div className="space-y-2">
              <button
                onClick={() => agregarBloque("texto")}
                className="flex items-center gap-2 w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <Type size={16} /> Texto
              </button>
              <button
                onClick={() => agregarBloque("imagen")}
                className="flex items-center gap-2 w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <Image size={16} /> Imagen
              </button>
              <button
                onClick={() => agregarBloque("boton")}
                className="flex items-center gap-2 w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <MousePointerClick size={16} /> Botón
              </button>
              <button
                onClick={() => agregarBloque("articulo")}
                className="flex items-center gap-2 w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <FileText size={16} /> Artículo
              </button>
            </div>
          </div>

          {/* Zona de construcción */}
          <div className="col-span-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="Asunto del newsletter..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 text-sm p-4 overflow-y-auto">
              {bloques.length === 0 ? (
                <p>Arrastra o selecciona bloques para construir tu newsletter</p>
              ) : (
                <div className="space-y-3 w-full">
                  {bloques.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition bg-gray-50"
                    >
                      <p className="text-sm text-gray-600 font-medium">
                        Bloque de {b.tipo}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vista previa */}
          <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
            <div className="flex gap-4 text-sm font-medium mb-2">
              <button
                onClick={() => setVista("desktop")}
                className={`${
                  vista === "desktop" ? "text-green-600" : "text-gray-500"
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setVista("mobile")}
                className={`${
                  vista === "mobile" ? "text-green-600" : "text-gray-500"
                }`}
              >
                Mobile
              </button>
            </div>
            <div className="flex-1 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              Vista previa aparecerá aquí
            </div>
          </div>
        </div>

        {/* Footer de acciones */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Guardar Newsletter
          </button>
        </div>
      </div>
    </div>
  );
}
