
import { Upload, Image, Video, FileText, Edit, Trash2, Download } from "lucide-react";

export default function Bibliotecasub() {
  const stats = [
    { title: "Archivos Totales", value: 350 },
    { title: "Espacio Usado", value: "5.8GB" },
    { title: "Imágenes", value: 350 },
    { title: "Videos", value: 165 },
  ];

  const archivos = [
    {
      nombre: "logo-empresa-sostenible.png",
      tipo: "imagen",
      peso: "156 KB",
      resolucion: "800x600",
      uso: "Usada en 12 docs",
      fecha: "07/09/2025",
      icono: <Image size={22} className="text-blue-500" />,
    },
    {
      nombre: "proceso-reciclaje.mp4",
      tipo: "video",
      peso: "34.5 MB",
      duracion: "05:42",
      uso: "Usado en 13 docs",
      fecha: "07/09/2025",
      icono: <Video size={22} className="text-purple-500" />,
    },
    {
      nombre: "tutorial-compostaje.mp3",
      tipo: "audio",
      peso: "15 MB",
      duracion: "03:15",
      uso: "Usada en 12 docs",
      fecha: "09/09/2025",
      icono: <FileText size={22} className="text-green-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* --- Filtros y Subida --- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipo:</label>
            <select className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>Todos</option>
              <option>Imágenes</option>
              <option>Videos</option>
              <option>Documentos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Buscar:</label>
            <input
              type="text"
              placeholder="Buscar Archivo"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ordenar:</label>
            <select className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>Fecha (más reciente)</option>
              <option>Nombre (A-Z)</option>
              <option>Tamaño</option>
            </select>
          </div>

          <div className="flex justify-end items-end">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
              <Upload size={18} /> Subir Archivo
            </button>
          </div>
        </div>
      </div>

      {/* --- Estadísticas --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center"
          >
            <h3 className="text-gray-500 text-sm">{item.title}</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* --- Archivos --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {archivos.map((file, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-t-2xl">
              {file.icono}
              <p className="font-medium text-gray-800 text-sm truncate">
                {file.nombre}
              </p>
            </div>

            <div className="p-4 text-gray-600 text-sm">
              <p>{file.peso} {file.resolucion && `• ${file.resolucion}`}</p>
              <p>{file.duracion && `Duración: ${file.duracion}`}</p>
              <p>{file.uso}</p>
              <p className="text-gray-500 text-xs mt-2">{file.fecha}</p>
            </div>

            <div className="border-t border-gray-200 flex justify-between p-3 text-sm">
              <button className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition">
                <Edit size={16} className="text-blue-600" /> Editar
              </button>
              <button className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition">
                <Trash2 size={16} className="text-red-600" /> Eliminar
              </button>
              <button className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition">
                <Download size={16} className="text-gray-600" /> Descargar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
