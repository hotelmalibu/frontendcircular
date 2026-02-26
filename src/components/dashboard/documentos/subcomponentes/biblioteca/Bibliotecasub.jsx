import { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
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
  AlertCircle,
  Trash2
} from "lucide-react";
import { createDocument, getDocuments, updateDocument, deleteDocument } from "../../../../../api/documentsApi";
import { getAllCategories } from "../../../../../api/categoriesApi";
import { getImageProxyUrl } from "../../../../../utils/imageUtils";
import { toast } from "react-hot-toast";
import ConfirmModal from "../../../../common/ConfirmModal";

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
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    version: "",
    expires_at: "",
    status: "",
    file: null,
    currentFileName: "" // Track current file name in edit mode
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    sort_by: "created_at",
    sort_order: "desc"
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0
  });
  const [globalCounts, setGlobalCounts] = useState({ approved: 0, pending: 0 });


  const statusLabels = {
    draft: { text: "Borrador", color: BRAND.gray, bg: "#F3F4F6", icon: <Edit size={12} /> },
    pending_review: { text: "Pendiente Revisión", color: BRAND.yellow, bg: "#FFFBEB", icon: <Clock size={12} /> },
    approved: { text: "Aprobado", color: BRAND.darkGreen, bg: "#F0FDF4", icon: <CheckCircle2 size={12} /> },
    expired: { text: "Expirado", color: BRAND.orange, bg: "#FFF5EB", icon: <AlertCircle size={12} /> }
  };

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await getAllCategories();
      let categoriesArray = [];

      // Handle multiple response structures (same as News component)
      if (response?.data?.items && Array.isArray(response.data.items)) {
        categoriesArray = response.data.items;
      } else if (Array.isArray(response)) {
        categoriesArray = response;
      } else if (response?.data && Array.isArray(response.data)) {
        categoriesArray = response.data;
      } else if (response?.categories && Array.isArray(response.categories)) {
        categoriesArray = response.categories;
      } else {
        categoriesArray = response ? [response] : [];
      }

      setCategories(categoriesArray);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        search: filters.search,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        page: pagination.current_page,
        per_page: pagination.per_page
      };

      const [docsResponse, approvedRes, pendingRes] = await Promise.all([
        getDocuments(params),
        getDocuments({ per_page: 1, status: 'approved', search: filters.search }).catch(() => ({ data: { total: 0 } })),
        getDocuments({ per_page: 1, status: 'pending_review', search: filters.search }).catch(() => ({ data: { total: 0 } }))
      ]);

      // Handle multiple response structures
      let docsArray = [];

      if (docsResponse?.data?.items && Array.isArray(docsResponse.data.items)) {
        // Paginated response: { data: { items: [...], pagination: {...} } }
        docsArray = docsResponse.data.items;
      } else if (Array.isArray(docsResponse?.data)) {
        // Direct array in data: { data: [...] }
        docsArray = docsResponse.data;
      } else if (Array.isArray(docsResponse)) {
        // Direct array response: [...]
        docsArray = docsResponse;
      }

      setDocuments(docsArray);

      // Update global counts
      const extractTotal = (res) => {
        if (!res) return 0;
        return res.data?.total || res.total || res.data?.pagination?.total || res.pagination?.total || res.meta?.total || res.data?.meta?.total || 0;
      };

      setGlobalCounts({
        approved: extractTotal(approvedRes),
        pending: extractTotal(pendingRes)
      });

      // Update pagination state from response
      if (docsResponse?.data?.pagination || docsResponse?.pagination) {
        const pag = docsResponse.data?.pagination || docsResponse.pagination;
        setPagination(prev => ({
          ...prev,
          current_page: pag.current_page || 1,
          last_page: pag.last_page || 1,
          total: pag.total || docsArray.length
        }));
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.current_page, pagination.per_page]);

  const handleDownload = (document) => {
    try {
      const directUrl = `https://api-ecocircular.creativostecnologicosit.com/storage/${document.upload_file.path}`;
      const proxyUrl = getImageProxyUrl(directUrl);
      console.log("Download URLs:", { direct: directUrl, proxy: proxyUrl });
      window.open(proxyUrl, '_blank');
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Error al descargar el documento");
    }
  };

  const handleView = (document) => {
    // Open document in a new browser tab using the proxy URL
    const directUrl = `https://api-ecocircular.creativostecnologicosit.com/storage/${document.upload_file.path}`;
    const proxyUrl = getImageProxyUrl(directUrl);
    window.open(proxyUrl, '_blank');
  };

  const handleEdit = (document) => {
    // Format date for input[type="date"] which expects YYYY-MM-DD
    let formattedDate = "";
    if (document.expires_at) {
      try {
        const date = new Date(document.expires_at);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0];
        }
      } catch (e) {
        console.warn("Error parsing date:", e);
      }
    }

    setFormData({
      category_id: document.category_id || "",
      name: document.name,
      description: document.description || "",
      version: document.version,
      expires_at: formattedDate,
      status: document.status,
      file: null, // File is optional on update
      currentFileName: document.upload_file?.original_name || document.upload_file?.filename || "" // Store current file name
    });
    setEditingId(document.id);
    setIsEditMode(true);
    setIsUploadModalOpen(true);
  };

  const handleDelete = (document) => {
    setDocumentToDelete(document);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDocument(documentToDelete.id);
      toast.success("Documento eliminado correctamente");
      await fetchDocuments();
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Error al eliminar el documento");
    } finally {
      setIsDeleting(false);
    }
  };

  const openUploadModal = () => {
    setFormData({
      category_id: "",
      name: "",
      description: "",
      version: "",
      expires_at: "",
      status: "",
      file: null,
      currentFileName: ""
    });
    setEditingId(null);
    setIsEditMode(false);
    setIsUploadModalOpen(true);
  };

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

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
      // Set a default document_type_id (hidden from user but required by backend)
      submitData.append('document_type_id', 1);
      if (formData.category_id) {
        submitData.append('category_id', formData.category_id);
      }
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('version', formData.version);
      if (formData.expires_at) {
        submitData.append('expires_at', formData.expires_at);
      }
      submitData.append('status', formData.status);

      if (formData.file) {
        submitData.append('file', formData.file);
      }

      if (isEditMode) {
        await updateDocument(editingId, submitData);
        setSubmitMessage("Documento actualizado correctamente");
      } else {
        if (!formData.file) {
          throw new Error("El archivo es obligatorio para nuevos documentos");
        }
        await createDocument(submitData);
        setSubmitMessage("Documento creado correctamente");
      }

      console.log(`Document ${isEditMode ? 'updated' : 'created'}`);

      // Clear form only if creating
      if (!isEditMode) {
        setFormData({
          category_id: "",
          name: "",
          description: "",
          version: "",
          expires_at: "",
          status: "",
          file: null,
          currentFileName: ""
        });
      }

      await fetchDocuments();

      setTimeout(() => {
        setIsUploadModalOpen(false);
        setSubmitMessage("");
        setIsEditMode(false);
        setEditingId(null);
      }, 2000);

    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} document:`, error);
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
      setSubmitMessage(`Error al ${isEditMode ? 'actualizar' : 'crear'} el documento: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { title: "Documentos Totales", value: pagination.total, icon: <FolderOpen />, color: BRAND.blue },
    { title: "Espacio Usado", value: "Calculando...", icon: <Download />, color: BRAND.darkBlue },
    { title: "Activos", value: globalCounts.approved, icon: <CheckCircle2 />, color: BRAND.darkGreen },
    { title: "Pendientes", value: globalCounts.pending, icon: <Clock />, color: BRAND.yellow },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 })); // Reset to first page on filter change
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      setPagination(prev => ({ ...prev, current_page: page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
          onClick={openUploadModal}
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
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Buscar por nombre de archivo..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm"
              style={{ "--tw-ring-color": BRAND.lightBlue }}
            />
          </div>

          <div className="md:col-span-5">
            <select
              name="sort_by"
              value={filters.sort_by}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm bg-white cursor-pointer"
            >
              <option value="created_at">Más recientes</option>
              <option value="name">Nombre</option>
              <option value="size">Tamaño</option>
            </select>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <button
              type="button"
              aria-label="Filtrar"
              className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition"
            >
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
                    <button type="button" onClick={() => handleView(doc)} className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm transition" title="Ver" aria-label="Ver documento">
                      <Eye size={16} />
                    </button>
                    <button type="button" onClick={() => handleEdit(doc)} className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm transition" title="Editar" aria-label="Editar documento">
                      <Edit size={16} />
                    </button>
                    <button type="button" onClick={() => handleDelete(doc)} className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-red-600 hover:shadow-sm transition" title="Eliminar" aria-label="Eliminar documento">
                      <Trash2 size={16} />
                    </button>
                    <button type="button" onClick={() => handleDownload(doc)} className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-green-600 hover:shadow-sm transition" title="Descargar" aria-label="Descargar documento">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && documents.length > 0 && pagination.last_page > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          <button
            onClick={() => goToPage(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Anterior
          </button>

          <div className="flex items-center gap-1">
            {[...Array(pagination.last_page)].map((_, i) => {
              const pageNum = i + 1;
              // Show limited page numbers for better UX
              if (
                pageNum === 1 ||
                pageNum === pagination.last_page ||
                (pageNum >= pagination.current_page - 1 && pageNum <= pagination.current_page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition ${pagination.current_page === pageNum
                      ? "text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-100"
                      }`}
                    style={{ backgroundColor: pagination.current_page === pageNum ? BRAND.blue : "" }}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === pagination.current_page - 2 || pageNum === pagination.current_page + 2) {
                return <span key={pageNum} className="text-gray-400 px-1">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => goToPage(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Siguiente
          </button>
        </div>
      )}

      {isUploadModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-[#005380] bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-opacity animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-3xl shadow-2xl transform transition-all scale-100 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 pl-2 pr-2">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: BRAND.darkBlue }}>{isEditMode ? "Editar Documento" : "Subir Documento"}</h2>
                <p className="text-sm text-gray-500">{isEditMode ? "Modifica la información del documento" : "Completa la información para archivar"}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                aria-label="Cerrar modal"
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto px-2 pb-2">

              {/* Row 1: Category, Version, Status (3 Cols) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:border-transparent outline-none text-sm transition-all"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                    disabled={categoriesLoading}
                  >
                    <option value="">{categoriesLoading ? "Cargando..." : "-- Seleccione --"}</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:border-transparent outline-none text-sm"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                    placeholder="Ej: 1.0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:border-transparent outline-none text-sm"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="draft">Borrador</option>
                    <option value="pending_review">Pendiente de Revisión</option>
                    <option value="approved">Aprobado</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Name (2 Cols) & Expiration (1 Col) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Archivo *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:border-transparent outline-none text-sm"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                    placeholder="Ej: Política de Sostenibilidad 2025"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiración</label>
                  <input
                    type="date"
                    name="expires_at"
                    value={formData.expires_at}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:border-transparent outline-none text-sm"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:border-transparent outline-none text-sm resize-none"
                  style={{ "--tw-ring-color": BRAND.lightBlue }}
                  placeholder="Breve descripción del contenido..."
                />
              </div>

              {/* Row 4: File Upload (Compact) */}
              <div className="bg-gray-50 p-3 rounded-xl border border-dashed border-gray-300 text-center hover:bg-blue-50/30 hover:border-blue-300 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  required={!isEditMode}
                  id="file-upload"
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <Upload size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-medium text-gray-700">
                      {formData.file ? formData.file.name : (isEditMode && formData.currentFileName ? `Archivo actual: ${formData.currentFileName}` : "Seleccionar archivo")}
                    </span>
                    <span className="text-xs text-gray-400">
                      {isEditMode ? "Dejar vacío para mantener el archivo actual" : "PDF, Imágenes o Word (Máx 10MB)"}
                    </span>
                  </div>
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
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ backgroundColor: BRAND.blue }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      {isEditMode ? "Actualizar Documento" : "Publicar Documento"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDocumentToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Documento"
        message={`¿Estás seguro de que deseas eliminar el documento "${documentToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}