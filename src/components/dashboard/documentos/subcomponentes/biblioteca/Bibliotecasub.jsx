
import { useState } from "react";
import { Upload, Image, Video, FileText, Edit, Trash2, Download, X } from "lucide-react";
import { createDocument } from "../../../../../api/documentsApi";

export default function Bibliotecasub() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    document_type_id: "",
    name: "",
    description: "",
    version: "",
    expires_at: "",
    status: "",
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const documentTypes = [
    { id: "1", name: "Normas y Politicas" },
    { id: "2", name: "Formatos" },
    { id: "3", name: "Actas" },
    { id: "4", name: "Pesajes" },
    { id: "5", name: "Contratos" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const submitData = new FormData();
      submitData.append('document_type_id', parseInt(formData.document_type_id));
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('version', formData.version);
      if (formData.expires_at) {
        submitData.append('expires_at', formData.expires_at);
      }
      submitData.append('status', formData.status);
      submitData.append('file', formData.file);

      const response = await createDocument(submitData);
      setSubmitMessage("Documento creado correctamente");
      console.log("Document created:", response);

      // Reset form
      setFormData({
        document_type_id: "",
        name: "",
        description: "",
        version: "",
        expires_at: "",
        status: "",
        file: null
      });

      // Close modal after success
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setSubmitMessage("");
      }, 2000);

    } catch (error) {
      console.error("Error creating document:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
      setSubmitMessage(`Error al crear el documento: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
            >
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

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Subir Documento</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento *
                </label>
                <select
                  name="document_type_id"
                  value={formData.document_type_id}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Seleccionar tipo</option>
                  {documentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Nombre del documento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Descripción del documento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Versión *
                </label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ej: 1.0, 2.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Expiración
                </label>
                <input
                  type="date"
                  name="expires_at"
                  value={formData.expires_at}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Seleccionar estado</option>
                  <option value="draft">Borrador</option>
                  <option value="pending_review">Pendiente de Revisión</option>
                  <option value="approved">Aprobado</option>
                  <option value="expired">Expirado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Archivo *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {submitMessage && (
                <div className={`p-3 rounded-xl text-sm ${
                  submitMessage.includes("Error")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  {submitMessage}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? "Subiendo..." : "Subir Documento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
