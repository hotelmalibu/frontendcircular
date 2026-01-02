import { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Edit,
  Download,
  X,
  Eye,
  Search,
  Filter,
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { createDocument, getDocuments } from "../../../../../api/documentsApi";
import PDFViewer from "../../../../PDFViewer";
import { getImageProxyUrl } from "../../../../../utils/imageUtils";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja (Alertas)
  yellow: "#E8AD00",     // Amarillo
  gray: "#6B7280",
};

export default function Bibliotecasub() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    { id: "1", name: "Normas y Políticas" },
    { id: "2", name: "Formatos" },
    { id: "3", name: "Actas" },
    { id: "4", name: "Pesajes" },
    { id: "5", name: "Contratos" }
  ];

  const statusLabels = {
    draft: { text: "Borrador", color: BRAND.gray, bg: "#F3F4F6", icon: <Edit size={12} /> },
    pending_review: { text: "Pendiente Revisión", color: BRAND.yellow, bg: "#FFFBEB", icon: <Clock size={12} /> },
    approved: { text: "Aprobado", color: BRAND.darkGreen, bg: "#F0FDF4", icon: <CheckCircle2 size={12} /> },
    expired: { text: "Expirado", color: BRAND.orange, bg: "#FFF5EB", icon: <AlertCircle size={12} /> }
  };

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getDocuments();
      setDocuments(response.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = (document) => {
    try {
      const directUrl = `https://api-ecocircular.creativostecnologicosit.com/storage/${document.upload_file.path}`;
      const proxyUrl = getImageProxyUrl(directUrl);
      console.log("Download URLs:", { direct: directUrl, proxy: proxyUrl });
      window.open(proxyUrl, '_blank');
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Error al descargar el documento");
    }
  };

  const handleView = (document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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

      setFormData({
        document_type_id: "",
        name: "",
        description: "",
        version: "",
        expires_at: "",
        status: "",
        file: null
      });

      await fetchDocuments();

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
    { title: "Documentos Totales", value: documents.length, icon: <FolderOpen />, color: BRAND.blue },
    { title: "Espacio Usado", value: "Calculando...", icon: <Download />, color: BRAND.darkBlue },
    { title: "Activos", value: documents.filter(doc => doc.status === 'approved').length, icon: <CheckCircle2 />, color: BRAND.darkGreen },
    { title: "Pendientes", value: documents.filter(doc => doc.status === 'pending_review').length, icon: <Clock />, color: BRAND.yellow },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: BRAND.darkBlue }}>
            Biblioteca Digital
          </h1>
          <p className="text-gray-500 mt-1">Repositorio centralizado de documentación</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition transform active:scale-95"
          style={{ backgroundColor: BRAND.blue }}
        >
          <Upload size={20} /> <span className="font-medium">Subir Archivo</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{item.title}</p>
              <p className="text-2xl font-bold" style={{ color: BRAND.darkBlue }}>{item.value}</p>
            </div>
            <div className="p-3 rounded-xl bg-opacity-10" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre de archivo..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm"
              style={{ "--tw-ring-color": BRAND.lightBlue }}
            />
          </div>

          <div className="md:col-span-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm bg-white appearance-none cursor-pointer">
                <option>Todos los tipos</option>
                <option>Documentos PDF</option>
                <option>Imágenes</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-3">
            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm bg-white cursor-pointer">
              <option>Más recientes</option>
              <option>Nombre (A-Z)</option>
              <option>Tamaño</option>
            </select>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <button className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Documentos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 mb-4" style={{ borderColor: BRAND.blue }}></div>
            <p>Cargando biblioteca...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <FolderOpen size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No hay documentos disponibles</p>
            <p className="text-sm text-gray-400">Sube un nuevo archivo para comenzar</p>
          </div>
        ) : (
          documents.map((doc) => {
            const documentType = documentTypes.find(type => type.id === doc.document_type_id);
            const statusConfig = statusLabels[doc.status] || { text: doc.status, color: BRAND.gray, bg: "#F3F4F6", icon: null };
            const createdDate = new Date(doc.created_at).toLocaleDateString('es-ES');
            const isPdf = doc.name.toLowerCase().includes('pdf') || (doc.upload_file?.filename || '').toLowerCase().endsWith('.pdf');

            return (
              <div
                key={doc.id}
                className="group bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
              >
                {/* Header Card */}
                <div className="p-4 flex items-start justify-between gap-3 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${isPdf ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                    {isPdf ? <FileText size={24} /> : <ImageIcon size={24} />}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">
                        {documentType?.name || "General"}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm truncate" title={doc.name}>
                      {doc.name}
                    </h3>
                  </div>
                </div>

                {/* Body Card */}
                <div className="p-4 flex-1">
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8 leading-relaxed">
                    {doc.description || "Sin descripción disponible."}
                  </p>

                  <div className="flex items-center justify-between text-xs mt-auto">
                    <span
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md font-medium"
                      style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
                    >
                      {statusConfig.icon} {statusConfig.text}
                    </span>
                    <span className="text-gray-400 font-medium">v{doc.version}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="bg-gray-50 p-3 flex justify-between items-center border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium ml-1">
                    {createdDate}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => handleView(doc)} className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm transition" title="Ver">
                      <Eye size={16} />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm transition" title="Editar">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDownload(doc)} className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-green-600 hover:shadow-sm transition" title="Descargar">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- MODAL UPLOAD --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-[#005380] bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: BRAND.darkBlue }}>Subir Documento</h2>
                <p className="text-sm text-gray-500">Completa la información para archivar</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo *</label>
                  <select
                    name="document_type_id"
                    value={formData.document_type_id}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:border-transparent outline-none text-sm transition-all"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                  >
                    <option value="">Seleccionar...</option>
                    {documentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Versión *</label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:border-transparent outline-none text-sm"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                    placeholder="Ej: 1.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Archivo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:border-transparent outline-none text-sm"
                  style={{ "--tw-ring-color": BRAND.lightBlue }}
                  placeholder="Ej: Política de Sostenibilidad 2025"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:border-transparent outline-none text-sm resize-none"
                  style={{ "--tw-ring-color": BRAND.lightBlue }}
                  placeholder="Breve descripción del contenido..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:border-transparent outline-none text-sm"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="draft">Borrador</option>
                    <option value="pending_review">Pendiente de Revisión</option>
                    <option value="approved">Aprobado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiración</label>
                  <input
                    type="date"
                    name="expires_at"
                    value={formData.expires_at}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:border-transparent outline-none text-sm"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  id="file-upload"
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="text-blue-500 mb-2 mx-auto"><Upload size={24} className="mx-auto" /></div>
                  <span className="text-sm font-medium text-gray-600">
                    {formData.file ? formData.file.name : "Haga clic para subir el archivo"}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">PDF, Imágenes o Word</p>
                </label>
              </div>

              {submitMessage && (
                <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${submitMessage.includes("Error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
                  }`}>
                  {submitMessage.includes("Error") ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  {submitMessage}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 text-white rounded-xl hover:shadow-lg disabled:opacity-70 transition font-medium text-sm flex justify-center items-center gap-2"
                  style={{ backgroundColor: BRAND.blue }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload size={18} /> Subir Documento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL VIEW --- */}
      {isViewModalOpen && selectedDocument && (
        <div className="fixed inset-0 bg-[#005380] bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 leading-none">{selectedDocument.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">{selectedDocument.upload_file.original_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(selectedDocument)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white hover:shadow-sm transition text-gray-600 border border-transparent hover:border-gray-200"
                >
                  <Download size={18} /> Descargar
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-4">
              {selectedDocument.upload_file.filename.toLowerCase().endsWith('.pdf') ? (
                <div className="w-full h-full shadow-lg rounded-lg overflow-hidden bg-white">
                  {(() => {
                    const directPdfUrl = `https://api-ecocircular.creativostecnologicosit.com/storage/${selectedDocument.upload_file.path}`;
                    const proxyPdfUrl = getImageProxyUrl(directPdfUrl);
                    return <PDFViewer file={proxyPdfUrl} />;
                  })()}
                </div>
              ) : (
                <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-md">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">Vista previa no disponible</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Este tipo de archivo no se puede visualizar directamente en el navegador. Por favor, descárgalo para verlo.
                  </p>
                  <button
                    onClick={() => handleDownload(selectedDocument)}
                    className="w-full py-2.5 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition"
                    style={{ backgroundColor: BRAND.blue }}
                  >
                    Descargar Archivo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}