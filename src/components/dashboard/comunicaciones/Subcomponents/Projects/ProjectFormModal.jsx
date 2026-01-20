import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  X,
  Save,
  User,
  Tag,
  AlertCircle,
  Type,
  AlignLeft,
  FileText,
  Upload,
  Layers,
  Image
} from "lucide-react";
import { createProject, updateProject } from "../../../../../api/projectsApi";
import { getAllCategories } from "../../../../../api/categoriesApi";
import { getProjectTypes } from "../../../../../api/projectTypesApi";
import { getClassificationTypes } from "../../../../../api/classificationTypesApi";

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
    project_type_id: "",
    classification_type_id: "",
    author: "",
    file: null,
    cover_image: null,
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [projectTypes, setProjectTypes] = useState([]);
  const [projectTypesLoading, setProjectTypesLoading] = useState(true);
  const [classificationTypes, setClassificationTypes] = useState([]);
  const [classificationTypesLoading, setClassificationTypesLoading] = useState(true);
  const [filteredClassificationTypes, setFilteredClassificationTypes] = useState([]);
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

  const fetchProjectTypes = React.useCallback(async () => {
    try {
      setProjectTypesLoading(true);
      const response = await getProjectTypes();
      let typesArray = [];

      // Handle response.data.items as per user feedback
      if (response?.data?.items && Array.isArray(response.data.items)) {
        typesArray = response.data.items;
      } else if (response?.data && Array.isArray(response.data)) {
        typesArray = response.data;
      } else if (Array.isArray(response)) {
        typesArray = response;
      }

      setProjectTypes(typesArray);
    } catch (err) {
      console.error("Error loading project types:", err);
    } finally {
      setProjectTypesLoading(false);
    }
  }, []);

  const fetchClassificationTypes = React.useCallback(async () => {
    try {
      setClassificationTypesLoading(true);
      const response = await getClassificationTypes();
      let typesArray = [];

      if (response?.data?.items && Array.isArray(response.data.items)) {
        typesArray = response.data.items;
      } else if (response?.data && Array.isArray(response.data)) {
        typesArray = response.data;
      } else if (Array.isArray(response)) {
        typesArray = response;
      }

      setClassificationTypes(typesArray);
    } catch (err) {
      console.error("Error loading classification types:", err);
    } finally {
      setClassificationTypesLoading(false);
    }
  }, []);

  // Fetch categories, project types and classification types on mount
  useEffect(() => {
    fetchCategories();
    fetchProjectTypes();
    fetchClassificationTypes();
  }, [fetchCategories, fetchProjectTypes, fetchClassificationTypes]);

  useEffect(() => {
    if (isEditing && projectData) {
      const description = projectData.description || "";
      const catId = (projectData.category && typeof projectData.category === 'object') ? (projectData.category?.id || "") : (projectData.category_id || "");

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
        project_type_id: projectData.project_type_id || "",
        classification_type_id: projectData.classification_type_id || "",
        author: projectData.author || "",
        file: null, // Reset file on edit load
        cover_image: null, // Reset image on edit load
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

  // Clear project_type_id and classification_type_id if category is not Fortalecimiento
  useEffect(() => {
    if (categories.length > 0 && formData.category_id) {
      const selectedCategory = categories.find(c => String(c.id) === String(formData.category_id));
      if (selectedCategory && selectedCategory.name !== "Fortalecimiento") {
        setFormData(prev => ({ ...prev, project_type_id: "", classification_type_id: "" }));
      }
    }
  }, [formData.category_id, categories]);

  // Dynamic filtering for classification types based on project type
  useEffect(() => {
    if (!formData.project_type_id) {
      setFilteredClassificationTypes(classificationTypes);
      return;
    }

    const selectedProjectType = projectTypes.find(t => String(t.id) === String(formData.project_type_id));
    const projectTypeLabel = (selectedProjectType?.label || selectedProjectType?.name || "").toLowerCase();

    let filtered = [];
    if (projectTypeLabel.includes("sectorial")) {
      // Sectorial: only Residuos and Metodología
      filtered = classificationTypes.filter(t =>
        t.label.toLowerCase().includes("residuos") ||
        t.label.toLowerCase().includes("metodología") ||
        t.label.toLowerCase().includes("metodologia")
      );
    } else if (projectTypeLabel.includes("territorial")) {
      // Territorial: the rest (Política, Envases, Recursos, Innovación, Cosméticos)
      filtered = classificationTypes.filter(t =>
        !t.label.toLowerCase().includes("residuos") &&
        !t.label.toLowerCase().includes("metodología") &&
        !t.label.toLowerCase().includes("metodologia")
      );
    } else {
      filtered = classificationTypes;
    }

    setFilteredClassificationTypes(filtered);

    // Reset classification_type_id if it's no longer in the filtered list
    if (formData.classification_type_id && !filtered.some(t => String(t.id) === String(formData.classification_type_id))) {
      setFormData(prev => ({ ...prev, classification_type_id: "" }));
    }
  }, [formData.project_type_id, classificationTypes, projectTypes]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
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

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', descriptionContent || "");
      if (formData.category_id) {
        submitData.append('category_id', formData.category_id);
      }
      if (formData.project_type_id) {
        submitData.append('project_type_id', formData.project_type_id);
      }
      if (formData.classification_type_id) {
        submitData.append('classification_type_id', formData.classification_type_id);
      }
      submitData.append('author', formData.author || "");

      if (formData.file) {
        submitData.append('file', formData.file);
      }

      if (formData.cover_image) {
        submitData.append('cover_image', formData.cover_image);
      }

      if (isEditing && projectData?.id) {
        await updateProject(projectData.id, submitData);
      } else {
        await createProject(submitData);
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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-[#005380] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
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

                {/* Project Type */}
                <div className="relative group">
                  <label
                    className={labelClass}
                    style={{ opacity: categories.find(c => String(c.id) === String(formData.category_id))?.name === "Fortalecimiento" ? 1 : 0.5 }}
                  >
                    Tipo de Proyecto
                  </label>
                  <div className="relative group/tooltip">
                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      name="project_type_id"
                      value={formData.project_type_id}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      style={{
                        "--tw-ring-color": BRAND.lightBlue,
                        opacity: categories.find(c => String(c.id) === String(formData.category_id))?.name === "Fortalecimiento" ? 1 : 0.6,
                        cursor: categories.find(c => String(c.id) === String(formData.category_id))?.name === "Fortalecimiento" ? 'pointer' : 'help',
                        borderColor: categories.find(c => String(c.id) === String(formData.category_id))?.name === "Fortalecimiento" ? BRAND.green : '#E5E7EB'
                      }}
                      disabled={loading || projectTypesLoading || categories.find(c => String(c.id) === String(formData.category_id))?.name !== "Fortalecimiento"}
                    >
                      <option value="">
                        {projectTypesLoading
                          ? "Cargando..."
                          : categories.find(c => String(c.id) === String(formData.category_id))?.name === "Fortalecimiento"
                            ? "-- Seleccionar Tipo --"
                            : "-- No disponible --"
                        }
                      </option>
                      {projectTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label || type.name}
                        </option>
                      ))}
                    </select>

                    {/* Hover Tooltip for disabled state */}
                    {categories.find(c => String(c.id) === String(formData.category_id))?.name !== "Fortalecimiento" && (
                      <div className="absolute left-1/2 -bottom-2 translate-y-full -translate-x-1/2 w-64 p-3 rounded-xl bg-gray-900 text-white text-[11px] leading-relaxed shadow-xl opacity-0 group-hover/tooltip:opacity-100 invisible group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-left-4 border-right-4 border-bottom-4 border-transparent border-bottom-gray-900" style={{ borderBottomColor: '#111827', borderWidth: '0 6px 6px 6px' }}></div>
                        <div className="flex items-start gap-2">
                          <AlertCircle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                          <p>
                            <span className="font-bold text-yellow-400">Acceso Restringido:</span> Los tipos de proyecto solo están disponibles para la categoría <span className="underline decoration-yellow-400/50">Fortalecimiento</span>.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Classification Type (Only for Fortalecimiento) */}
                {categories.find(c => String(c.id) === String(formData.category_id))?.name === "Fortalecimiento" && (
                  <div className="md:col-span-2">
                    <label className={labelClass}>Tipo de Clasificación</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <select
                        name="classification_type_id"
                        value={formData.classification_type_id}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                        style={{
                          "--tw-ring-color": BRAND.lightBlue,
                          opacity: formData.project_type_id ? 1 : 0.6,
                          cursor: formData.project_type_id ? 'pointer' : 'help'
                        }}
                        disabled={loading || classificationTypesLoading || !formData.project_type_id}
                      >
                        <option value="">
                          {classificationTypesLoading
                            ? "Cargando..."
                            : !formData.project_type_id
                              ? "-- Deber seleccionar un Tipo de Proyecto --"
                              : "-- Seleccionar Clasificación --"
                          }
                        </option>
                        {filteredClassificationTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                      </select>

                      {/* Tooltip for when Project Type is not selected */}
                      {!formData.project_type_id && (
                        <div className="absolute left-1/2 -bottom-2 translate-y-full -translate-x-1/2 w-64 p-3 rounded-xl bg-gray-900 text-white text-[11px] leading-relaxed shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                          <p>Debe seleccionar primero un <span className="font-bold text-yellow-400">Tipo de Proyecto</span> para filtrar las clasificaciones.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Author */}
                <div className="md:col-span-2">
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

                {/* Cover Image Upload */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Imagen de Portada (Opcional)</label>
                  <div className="relative">
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-green-50 transition-colors cursor-pointer group">
                      <input
                        type="file"
                        name="cover_image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={loading}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                          <Image size={20} className="text-green-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          {formData.cover_image ? formData.cover_image.name : "Seleccionar imagen de portada"}
                        </p>
                        <p className="text-xs text-gray-400">JPG, PNG o WEBP (Máx 5MB)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Documento / Archivo (Opcional)</label>
                  <div className="relative">
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-blue-50 transition-colors cursor-pointer group">
                      <input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={loading}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                          <Upload size={20} className="text-blue-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          {formData.file ? formData.file.name : "Seleccionar archivo para el proyecto"}
                        </p>
                        <p className="text-xs text-gray-400">PDF, Imágenes o Word (Máx 10MB)</p>
                      </div>
                    </div>
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
    </div>,
    document.body
  );
}