import React, { useState, useEffect, useContext, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Search,
  AlertCircle,
  X,
  Upload,
  ShieldAlert,
  Scale,
  Landmark,
  Compass
} from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext";
import ConfirmModal from "../../../common/ConfirmModal";
import { toast } from "react-hot-toast";
import {
  BRAND,
  getResolucionesNormativas,
  getPoliticasNormativas,
  getPlanesNormativas,
  addNormativa,
  updateNormativa,
  deleteNormativa
} from "../../../../services/marcoNormativoService";

export default function MarcoNormativoManager({ initialSection = "resoluciones" }) {
  const { user } = useContext(AuthContext);

  // Verificación estricta de permisos de Administrador
  const isAdmin = Boolean(
    user && (
      user.role?.toLowerCase() === "admin" ||
      user.role_slug?.toLowerCase() === "admin" ||
      user.role?.toLowerCase() === "administrador" ||
      user.role_slug?.toLowerCase() === "administrador" ||
      user.is_admin === true ||
      (Array.isArray(user.roles) && user.roles.some((r) => (r.slug || r.name || "").toLowerCase().includes("admin")))
    )
  );

  const [activeSection, setActiveSection] = useState(initialSection); // "resoluciones" | "politicas" | "planes"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State con soporte para imagen de portada o banner
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    entity: "",
    description: "",
    file: null,
    fileUrl: "",
    bannerFile: null,
    bannerUrl: "",
    bannerPreview: null
  });
  const [formErrors, setFormErrors] = useState({});

  // Carga de datos según la sección activa
  const loadSectionData = useCallback(async () => {
    setLoading(true);
    try {
      let data = [];
      if (activeSection === "resoluciones") {
        data = await getResolucionesNormativas();
      } else if (activeSection === "politicas") {
        data = await getPoliticasNormativas();
      } else if (activeSection === "planes") {
        data = await getPlanesNormativas();
      }
      setItems(data);
    } catch (err) {
      console.error("Error cargando normativas:", err);
      toast.error("Error al cargar las normativas");
    } finally {
      setLoading(false);
    }
  }, [activeSection]);

  useEffect(() => {
    loadSectionData();

    const handleUpdate = () => loadSectionData();
    window.addEventListener("normativasUpdated", handleUpdate);
    return () => window.removeEventListener("normativasUpdated", handleUpdate);
  }, [loadSectionData]);

  // Filtrar por término de búsqueda
  const filteredItems = items.filter((item) => {
    const q = searchTerm.toLowerCase();
    const t = (item.title || item.name || "").toLowerCase();
    const d = (item.desc || item.description || "").toLowerCase();
    const e = (item.entity || "").toLowerCase();
    const y = (item.year || "").toLowerCase();
    return t.includes(q) || d.includes(q) || e.includes(q) || y.includes(q);
  });

  // Abrir modal de creación
  const handleOpenCreate = () => {
    if (!isAdmin) {
      toast.error("Solo los administradores pueden añadir normativas.");
      return;
    }
    setEditingItem(null);
    setFormData({
      title: "",
      year: activeSection === "planes" ? "2024 - 2030" : new Date().getFullYear().toString(),
      entity: activeSection === "resoluciones" ? "Ministerio de Ambiente y Desarrollo Sostenible" : "Gobierno Nacional",
      description: "",
      file: null,
      fileUrl: "",
      bannerFile: null,
      bannerUrl: "",
      bannerPreview: null
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Abrir modal de edición
  const handleOpenEdit = (item) => {
    if (!isAdmin) {
      toast.error("Solo los administradores pueden editar normativas.");
      return;
    }
    setEditingItem(item);
    const existingBanner = item.banner || item.image || item.cover || "";
    setFormData({
      title: item.title || item.name || "",
      year: item.year || "",
      entity: item.entity || "",
      description: item.desc || item.description || "",
      file: null,
      fileUrl: item.file || item.pdf || "",
      bannerFile: null,
      bannerUrl: existingBanner,
      bannerPreview: existingBanner || null
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Guardar (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Acción denegada: Requiere rol de Administrador.");
      return;
    }

    // Validaciones
    const errors = {};
    if (!formData.title.trim()) errors.title = "El título o nombre es obligatorio.";
    if (!formData.description.trim()) errors.description = "La descripción o resumen es obligatorio.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        await updateNormativa(activeSection, editingItem.id, formData);
        toast.success("Normativa actualizada correctamente.");
      } else {
        await addNormativa(activeSection, formData);
        toast.success("Normativa añadida exitosamente.");
      }
      setIsModalOpen(false);
      loadSectionData();
    } catch (err) {
      console.error("Error guardando normativa:", err);
      toast.error(err.message || "Error al procesar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteNormativa(activeSection, itemToDelete.id);
      toast.success("Normativa eliminada.");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      loadSectionData();
    } catch (err) {
      toast.error("Error al eliminar la normativa");
    }
  };

  // Metadata por sección
  const sectionMeta = {
    resoluciones: {
      title: "Gestor de Resoluciones Ambientales",
      subtitle: "Administración oficial de resoluciones y normativas ministeriales de empaques y plásticos.",
      icon: Scale,
      color: BRAND.navy,
      badgeDefault: "Resolución Oficial"
    },
    politicas: {
      title: "Gestor de Políticas, Decretos y CONPES",
      subtitle: "Administración de políticas públicas nacionales, documentos CONPES y decretos presidenciales.",
      icon: Landmark,
      color: BRAND.navy,
      badgeDefault: "Política / Decreto"
    },
    planes: {
      title: "Gestor de Planes y Estrategias Nacionales",
      subtitle: "Administración de las hojas de ruta, estrategias de economía circular y el PND.",
      icon: Compass,
      color: BRAND.navy,
      badgeDefault: "Plan Estratégico"
    }
  };

  const currentMeta = sectionMeta[activeSection];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 font-sans">
      {/* Selector Superior de Secciones Separadas */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: BRAND.navy }}
          >
            <currentMeta.icon size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: BRAND.navy }}>
              {currentMeta.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Botón de Añadir (Paleta Oficial: Fondo #B1D357 y Texto #1E305D) */}
        {isAdmin ? (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm shadow hover:shadow-md transition-all active:scale-95 flex-shrink-0 bg-[#B1D357] text-[#1E305D] hover:bg-[#9cb84d]"
          >
            <Plus size={18} />
            Añadir Normativa
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldAlert size={16} />
            Modo solo lectura (Acceso exclusivo Admin para añadir)
          </div>
        )}
      </div>

      {/* Pestañas de Navegación entre Secciones Independientes */}
      <div className="flex flex-wrap gap-2 pt-6 pb-6">
        <button
          onClick={() => { setActiveSection("resoluciones"); setSearchTerm(""); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
            activeSection === "resoluciones"
              ? "bg-[#B1D357] text-[#1E305D] font-black shadow-sm"
              : "text-gray-600 bg-gray-50 hover:bg-gray-100 font-semibold"
          }`}
        >
          <Scale size={16} />
          Resoluciones Oficiales
        </button>

        <button
          onClick={() => { setActiveSection("politicas"); setSearchTerm(""); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
            activeSection === "politicas"
              ? "bg-[#B1D357] text-[#1E305D] font-black shadow-sm"
              : "text-gray-600 bg-gray-50 hover:bg-gray-100 font-semibold"
          }`}
        >
          <Landmark size={16} />
          Políticas y Decretos (CONPES)
        </button>

        <button
          onClick={() => { setActiveSection("planes"); setSearchTerm(""); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
            activeSection === "planes"
              ? "bg-[#B1D357] text-[#1E305D] font-black shadow-sm"
              : "text-gray-600 bg-gray-50 hover:bg-gray-100 font-semibold"
          }`}
        >
          <Compass size={16} />
          Planes y Estrategias Nacionales
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={`Buscar en ${activeSection}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B1D357] transition-all"
        />
      </div>

      {/* Listado en Formato Grid (Estilo Noticias) */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-[#B1D357] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Cargando normativas...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <AlertCircle size={36} className="text-gray-300 mx-auto mb-2" />
          <h4 className="font-bold text-gray-700 text-base">No hay normativas registradas</h4>
          <p className="text-xs text-gray-400 mt-1">No se encontraron elementos para esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const pdfUrl = item.file || item.pdf;
            const bannerImg = item.banner || item.image || item.cover;

            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Portada / Banner superior si existe */}
                {bannerImg ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={bannerImg}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#B1D357] text-[#1E305D] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                      {item.year || currentMeta.badgeDefault}
                    </div>
                  </div>
                ) : (
                  <div className="px-5 pt-5 pb-1 flex items-center justify-between gap-2">
                    <span className="bg-[#B1D357] text-[#1E305D] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                      {item.year || currentMeta.badgeDefault}
                    </span>
                  </div>
                )}

                {/* Contenido de la Tarjeta */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">
                    {item.entity || "Gobierno Nacional"}
                  </p>
                  <h3 className="text-base font-bold text-[#1E305D] leading-snug mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                    {item.desc || item.description}
                  </p>

                  {/* Pie con Acciones */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                    {pdfUrl ? (
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-[#B1D357] text-[#1E305D] hover:bg-[#9cb84d] transition-all shadow-sm"
                      >
                        <Download size={14} />
                        Descargar
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Sin archivo</span>
                    )}

                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#1E305D] hover:bg-gray-100 transition"
                          title="Editar normativa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Eliminar normativa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Creación / Edición */}
      {isModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold" style={{ color: BRAND.navy }}>
                {editingItem ? "Editar Normativa" : `Añadir a ${currentMeta.title.replace("Gestor de ", "")}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {activeSection === "resoluciones" ? "Número y Nombre de la Resolución *" : activeSection === "politicas" ? "Nombre de la Política o Decreto *" : "Nombre del Plan o Estrategia *"}
                </label>
                <input
                  type="text"
                  placeholder={activeSection === "resoluciones" ? "Ej. Resolución 2184 de 2019" : activeSection === "politicas" ? "Ej. Decreto 1381 de 2024" : "Ej. Plan de Acción de Economía Circular"}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#B1D357]"
                />
                {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {activeSection === "planes" ? "Vigencia / Periodo" : "Año"}
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 2024"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#B1D357]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Entidad Emisora
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. MinAmbiente, DNP"
                    value={formData.entity}
                    onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#B1D357]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Descripción o Resumen Normativo *
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalla brevemente el alcance, las obligaciones y el propósito de este documento normativo..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#B1D357]"
                />
                {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
              </div>

              {/* Imagen de Portada o Banner */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Imagen de Portada o Banner (Opcional)
                </label>
                {formData.bannerPreview ? (
                  <div className="flex items-center gap-3 w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0 shadow-sm">
                      <img
                        src={formData.bannerPreview}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-gray-700">Portada actual / cargada</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bannerFile: null, bannerUrl: "", bannerPreview: null }))}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5 w-fit"
                      >
                        <Trash2 size={13} />
                        Quitar portada
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0];
                          setFormData(prev => ({
                            ...prev,
                            bannerFile: file,
                            bannerUrl: "",
                            bannerPreview: URL.createObjectURL(file)
                          }));
                        }
                      }}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#B1D357] file:text-[#1E305D] hover:file:bg-[#9cb84d] cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Sube una imagen para la portada (Opcional - PNG, JPG, WebP)</p>
                  </div>
                )}
              </div>

              {/* Carga de Archivo PDF */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Documento Oficial en PDF (Opcional)
                </label>
                {formData.file || formData.fileUrl ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 truncate">
                      <Upload size={18} className="text-[#1E305D] flex-shrink-0" />
                      <span className="truncate">{formData.file ? formData.file.name : "Documento PDF vinculado"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, file: null, fileUrl: "" }))}
                      className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition flex items-center gap-1 flex-shrink-0"
                      title="Quitar archivo"
                    >
                      <Trash2 size={13} />
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFormData(prev => ({ ...prev, file: e.target.files[0] }));
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload size={24} className="text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-600">Haz clic para seleccionar el archivo PDF</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Solo documentos PDF (máx. 25MB)</p>
                  </div>
                )}
                {formErrors.file && <p className="text-xs text-red-500 mt-1">{formErrors.file}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 text-sm font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-[#1E305D] text-sm font-black shadow-md hover:shadow-lg transition flex items-center gap-2 bg-[#B1D357] hover:bg-[#9cb84d]"
                >
                  {submitting ? "Guardando..." : "Guardar Normativa"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Normativa?"
        message={`¿Estás seguro de que deseas eliminar "${itemToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
