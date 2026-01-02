import React, { useState, useEffect, useRef } from "react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  X,
  Save,
  User,
  Tag,
  AlertCircle,
  Type,
  AlignLeft,
  FileText
} from "lucide-react";
import { createProject, updateProject } from "../../../../../api/projectsApi";
import { getAllCategories } from "../../../../../api/categoriesApi";

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

export default function ProjectFormModal({ projectData, isEditing, onClose, onSuccess }) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const hasInitialized = useRef(false);
  const hasSyncedDescription = useRef(false);
  const [editorReady, setEditorReady] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    author: "",
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const fetchCategories = React.useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await getAllCategories();

      let categoriesArray = [];
      if (response?.data?.items && Array.isArray(response.data.items)) {
        categoriesArray = response.data.items;
      } else if (Array.isArray(response)) {
        categoriesArray = response;
      } else if (response?.data && Array.isArray(response.data)) {
        categoriesArray = response.data;
      } else if (response?.categories && Array.isArray(response.categories)) {
        categoriesArray = response.categories;
      }

      setCategories(categoriesArray);
    } catch (err) {
      console.error("Error loading categories for projects:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (isEditing && projectData) {
      const description = projectData.description || "";
      const catId = typeof projectData.category === 'object' ? (projectData.category?.id || "") : (projectData.category_id || "");

      console.log("ProjectFormModal - Loading Data:", {
        isEditing,
        descriptionLength: description.length,
        category_id: catId,
        rawCategory: projectData.category
      });

      setFormData({
        title: projectData.title || "",
        description: description,
        category_id: catId,
        author: projectData.author || "",
      });
    }
  }, [projectData, isEditing]);

  // Sync editor data once when editor is ready and data is available
  useEffect(() => {
    if (editorReady && isEditing && formData.description && !hasSyncedDescription.current) {
      if (editorInstanceRef.current) {
        console.log("ProjectFormModal - Syncing initial description to editor");
        editorInstanceRef.current.setData(formData.description);
        hasSyncedDescription.current = true;
      }
    }
  }, [editorReady, isEditing, formData.description]);

  // Initialize CKEditor
  useEffect(() => {
    const initEditor = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        const container = editorRef.current || document.getElementById('project-description-editor');
        if (!container) return;
        if (editorInstanceRef.current) {
          await editorInstanceRef.current.destroy();
          editorInstanceRef.current = null;
        }

        const instance = await ClassicEditor.create(container, {
          toolbar: ['bold', 'italic', '|', 'undo', 'redo']
        });

        editorInstanceRef.current = instance;
        setEditorReady(true);

        if (formData.description) {
          instance.setData(formData.description);
        }

        instance.model.document.on('change:data', () => {
          const data = instance.getData();
          setFormData(prev => ({ ...prev, description: data }));
          if (errors.description) {
            setErrors(prev => ({ ...prev, description: null }));
          }
        });
      } catch (e) {
        console.error('Error initializing editor:', e);
      }
    };

    initEditor();
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => { });
        editorInstanceRef.current = null;
        setEditorReady(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category_id') {
      console.log("ProjectFormModal - Category ID Selected:", value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let descriptionContent = formData.description;
      if (editorInstanceRef.current) {
        const editorContent = editorInstanceRef.current.getData();
        if (editorContent !== descriptionContent) {
          descriptionContent = editorContent;
        }
      }

      const dataToSend = {
        title: formData.title,
        description: descriptionContent || "",
        category_id: formData.category_id || null,
        author: formData.author || "",
      };

      if (isEditing && projectData?.id) {
        await updateProject(projectData.id, dataToSend);
        // alert("Proyecto actualizado exitosamente"); // Removed alert for cleaner UX
      } else {
        await createProject(dataToSend);
        // alert("Proyecto creado exitosamente"); // Removed alert for cleaner UX
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving project:", err);
      let errorMessage = "Error al guardar el proyecto";
      if (err.response?.data?.message) errorMessage = err.response.data.message;

      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        const mapped = {};
        Object.keys(serverErrors).forEach((key) => {
          const val = serverErrors[key];
          mapped[key] = Array.isArray(val) ? val.join(" ") : String(val);
        });
        setErrors((prev) => ({ ...prev, ...mapped }));
      }
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const inputClass = `w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${errors.title ? "border-orange-300" : "border-gray-200"}`;
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 z-50 bg-[#005380] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">

        {/* Header con Azul Profundo */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100" style={{ backgroundColor: BRAND.darkBlue }}>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}
            </h2>
            <p className="text-blue-200 text-xs mt-0.5">Gestión de iniciativas y contenido</p>
          </div>
          <button
            onClick={onClose}
            className="text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="space-y-6">

            {/* SECCIÓN 1: Detalles Principales */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <FileText size={16} style={{ color: BRAND.blue }} /> Detalles del Proyecto
              </h3>

              {/* Title */}
              <div className="mb-5">
                <label className={labelClass}>Título del Proyecto *</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ej: Estrategia de Reciclaje 2025"
                    className={`${inputClass} pl-10`}
                    style={{
                      "--tw-ring-color": BRAND.lightBlue,
                      borderColor: errors.title ? BRAND.orange : ''
                    }}
                    disabled={loading}
                  />
                </div>
                {errors.title && <p className="mt-1 text-xs font-medium flex items-center gap-1" style={{ color: BRAND.orange }}><AlertCircle size={12} /> {errors.title}</p>}
              </div>

              {/* Description (CKEditor) */}
              <div>
                <label className={labelClass}><AlignLeft size={12} className="inline mr-1" /> Descripción / Contenido</label>
                <div className="prose max-w-none border rounded-xl overflow-hidden bg-white" style={{ borderColor: '#E5E7EB' }}>
                  <div ref={editorRef}></div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Clasificación */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Tag size={16} style={{ color: BRAND.darkGreen }} /> Clasificación
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Category */}
                <div>
                  <label className={labelClass}>Categoría</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                    disabled={loading || categoriesLoading}
                  >
                    <option value="">{categoriesLoading ? "Cargando..." : "-- Seleccionar --"}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className={labelClass}>Autor</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Nombre del autor o entidad"
                      className={`${inputClass} pl-10`}
                      style={{ "--tw-ring-color": BRAND.lightBlue }}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium text-sm"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white hover:shadow-lg hover:opacity-90 transition font-bold text-sm transform active:scale-95"
            style={{ backgroundColor: BRAND.blue }}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditing ? "Actualizar Proyecto" : "Crear Proyecto"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}