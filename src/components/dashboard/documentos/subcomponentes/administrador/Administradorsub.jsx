import { useState } from "react";
import { FileText, FileImage, FileVideo, FileMusic } from "lucide-react";

export default function Administradorsub() {
  const [activeTab, setActiveTab] = useState("general");

  const tipos = [
    { icon: FileText, nombre: "PDF", cantidad: 700 },
    { icon: FileText, nombre: "DOCX", cantidad: 700 },
    { icon: FileText, nombre: "XLSX", cantidad: 700 },
    { icon: FileText, nombre: "PPTX", cantidad: 700 },
    { icon: FileImage, nombre: "Imágenes", cantidad: 700 },
    { icon: FileVideo, nombre: "Videos", cantidad: 700 },
    { icon: FileMusic, nombre: "Audios", cantidad: 700 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Submenú */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-t-md text-sm font-medium border-b-2 transition ${
            activeTab === "general"
              ? "border-blue-500 text-blue-600 bg-gray-100"
              : "border-transparent hover:bg-gray-100"
          }`}
        >
          General
        </button>

        <button
          onClick={() => setActiveTab("tipos")}
          className={`px-4 py-2 rounded-t-md text-sm font-medium border-b-2 transition ${
            activeTab === "tipos"
              ? "border-blue-500 text-blue-600 bg-gray-100"
              : "border-transparent hover:bg-gray-100"
          }`}
        >
          Tipos de Archivos
        </button>

        <button
          onClick={() => setActiveTab("backup")}
          className={`px-4 py-2 rounded-t-md text-sm font-medium border-b-2 transition ${
            activeTab === "backup"
              ? "border-blue-500 text-blue-600 bg-gray-100"
              : "border-transparent hover:bg-gray-100"
          }`}
        >
          Backup
        </button>
      </div>

      {/* Contenido dinámico */}
      <div className="bg-white border rounded-md shadow-sm p-6 transition-all duration-300">
        {activeTab === "general" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Configuración General</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Límite de Tamaño por Archivo</label>
                <select className="w-full border rounded-md p-2 text-sm mt-1">
                  <option>50MB</option>
                  <option>100MB</option>
                  <option>200MB</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Cuota por Usuario</label>
                <select className="w-full border rounded-md p-2 text-sm mt-1">
                  <option>4GB</option>
                  <option>10GB</option>
                  <option>20GB</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Política de Retención</label>
                <select className="w-full border rounded-md p-2 text-sm mt-1">
                  <option>1 Año</option>
                  <option>3 Años</option>
                  <option>5 Años</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tipos" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Configuración General</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tipos.map(({ icon: Icon, nombre, cantidad }) => (
                <div
                  key={nombre}
                  className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50 transition"
                >
                  <input type="checkbox" className="accent-blue-500" />
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="flex-1">{nombre}</span>
                  <span className="text-xs text-gray-500">{cantidad} Archivos</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "backup" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Backup y Restauración</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border rounded-md p-2 items-center">
                <span>Último Backup:</span>
                <span className="text-gray-600">09/09/2025</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
                  Exitoso
                </span>
              </div>

              <div className="flex justify-between border rounded-md p-2">
                <span>Próximo Backup:</span>
                <span className="text-gray-600">09/09/2025</span>
              </div>

              <div className="flex justify-between border rounded-md p-2">
                <span>Tamaño Backup:</span>
                <span className="text-gray-600">14GB</span>
              </div>

              <div className="flex gap-3 mt-3">
                <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md">
                  Crear Backup Manual
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md">
                  Restaurar Desde Backup
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md">
                  Descargar Backup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
