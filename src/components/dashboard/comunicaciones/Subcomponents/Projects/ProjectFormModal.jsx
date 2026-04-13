import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  X,
  Save,
  User,
  Tag,
  Calendar,
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
import { toast } from "react-hot-toast";

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
  // --- REACT-QUILL CONFIG INSIDE TO MATCH NEWS ---
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list',
    'align',
    'link'
  ];

  const [formData, setFormData] = useState({
    type: "project",
    title: "",
    description: "",
    category_id: "",
    project_type_id: "",
    classification_type_id: "",
    author: "",
    start_date: "",
    end_date: "",
    published_at: "",
    status: "published",
    upload_file: null, // Rename from file to match News
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

  // Estados para Cropper
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const cropperRef = useRef(null);

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

      // Prefer full content if available (edit mode), otherwise description
      const fullContent = projectData.content || projectData.description || "";

      setFormData((prev) => ({
        ...prev,
        title: projectData.title || "",
        description: fullContent,
        category_id: catId,
        project_type_id: projectData.project_type_id || "",
        classification_type_id: projectData.classification_type_id || "",
        author: projectData.author || "",
        start_date: projectData.start_date ? projectData.start_date.slice(0, 10) : "",
        end_date: projectData.end_date ? projectData.end_date.slice(0, 10) : "",
        published_at: projectData.published_at ? projectData.published_at.slice(0, 10) : "",
        status: projectData.status || "published",
        upload_file: projectData.upload_file || null,
        cover_image: projectData.cover_image || null,
      }));
    }
  }, [projectData, isEditing]);



  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: null }));
    }
  };

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
  }, [formData.project_type_id, classificationTypes, projectTypes, formData.classification_type_id]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];

      // Validation thresholds
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // Aumentamos para procesar el recorte

      let isValid = true;
      let errorMessage = "";

      if (name === "cover_image") {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          isValid = false;
          errorMessage = "Por favor, seleccione un archivo de imagen válido.";
        } else if (file.size > MAX_IMAGE_SIZE) {
          isValid = false;
          errorMessage = "La imagen es demasiado grande para procesar (Máx 10MB).";
        }

        if (!isValid) {
          setErrors((prev) => ({ ...prev, [name]: errorMessage }));
          e.target.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          setImageToCrop(reader.result);
          setShowCropper(true);
        };
        reader.readAsDataURL(file);
        e.target.value = ""; // Permite re-seleccionar
        return;
      } else if (name === "upload_file") {
        if (file.size > MAX_FILE_SIZE) {
          isValid = false;
          errorMessage = "El archivo no puede superar los 10MB.";
        }
      }

      if (!isValid) {
        setErrors((prev) => ({
          ...prev,
          [name]: errorMessage,
        }));
        e.target.value = "";
        return;
      }

      // Clear error if valid
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas({
        maxWidth: 2000,
        maxHeight: 2000,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      }).toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], "project_cover.jpg", { type: "image/jpeg" });
          setFormData((prev) => ({ ...prev, cover_image: croppedFile }));
          setShowCropper(false);
          setImageToCrop(null);
          if (errors.cover_image) {
            setErrors((prev) => ({ ...prev, cover_image: null }));
          }
        }
      }, 'image/jpeg', 0.9);
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
      const toIsoDate = (value) => {
        if (!value) return null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00`;
        try {
          const d = new Date(value);
          if (isNaN(d.getTime())) return value;
          return d.toISOString();
        } catch (e) { return value; }
      };

      const todayDate = () => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
      };

      let publishedAt = formData.published_at ? toIsoDate(formData.published_at) : todayDate();

      const dataToSend = new FormData();

      // Seguimos EXACTAMENTE el patrón de Noticias
      if (formData.upload_file && formData.upload_file instanceof File && formData.upload_file.name && formData.upload_file.size > 0) {
        dataToSend.append('file', formData.upload_file);
      }

      dataToSend.append('type', formData.type || "project");
      dataToSend.append('title', formData.title);

      const fullContent = formData.description || "";
      dataToSend.append('description', fullContent);

      dataToSend.append('category_id', formData.category_id || "");
      dataToSend.append('author', formData.author || "");
      dataToSend.append('status', formData.status);

      if (formData.start_date) dataToSend.append('start_date', toIsoDate(formData.start_date));
      if (formData.end_date) dataToSend.append('end_date', toIsoDate(formData.end_date));
      if (publishedAt) dataToSend.append('published_at', publishedAt);

      // Campos específicos de proyectos que no están en noticias
      if (formData.project_type_id) {
        dataToSend.append('project_type_id', formData.project_type_id);
      }
      if (formData.classification_type_id) {
        dataToSend.append('classification_type_id', formData.classification_type_id);
      }
      if (formData.cover_image && formData.cover_image instanceof File) {
        dataToSend.append('cover_image', formData.cover_image);
      }

      if (isEditing && projectData?.id) {
        await updateProject(projectData.id, dataToSend);
      } else {
        await createProject(dataToSend);
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
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const inputClass = `w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${errors.title ? "border-orange-300" : "border-gray-200"}`;
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-[#005380] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Columna Izquierda (Contenido Principal) */}
            <div className="lg:col-span-2 space-y-6">
              {/* SECCIÓN 1: Detalles Principales */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <FileText size={16} style={{ color: BRAND.blue }} /> Detalles del Proyecto
                </h3>

                {/* Title */}
                <div className="mb-5">
                  <label className={labelClass}>Título del Proyecto <span className="text-red-500">*</span></label>
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

                {/* Description (ReactQuill) */}
                <div>
                  <label className={labelClass}><AlignLeft size={12} className="inline mr-1" /> Descripción / Contenido</label>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 quill-fixed-toolbar">
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={handleEditorChange}
                      modules={modules}
                      formats={formats}
                      placeholder="Escribe el contenido aquí..."
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: Multimedia */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <Image size={16} style={{ color: BRAND.green }} /> Multimedia y Archivos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cover Image Upload */}
                  <div>
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
                            {formData.cover_image ? formData.cover_image.name : "Seleccionar imagen"}
                          </p>
                          <p className="text-xs text-gray-400">JPG, PNG o WEBP (Máx 5MB)</p>
                        </div>
                      </div>
                      {errors.cover_image && <p className="mt-1 text-xs font-medium flex items-center gap-1" style={{ color: BRAND.orange }}><AlertCircle size={12} /> {errors.cover_image}</p>}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className={labelClass}>Documento / Archivo (Opcional)</label>
                    <div className="relative">
                      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-blue-50 transition-colors cursor-pointer group">
                        <input
                          type="file"
                          name="upload_file"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={loading}
                        />
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                            <Upload size={20} className="text-blue-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            {formData.upload_file ? (formData.upload_file.name || "Archivo seleccionado") : "Seleccionar archivo"}
                          </p>
                          <p className="text-xs text-gray-400">PDF, Imágenes o Word (Máx 10MB)</p>
                        </div>
                      </div>
                      {errors.upload_file && <p className="mt-1 text-xs font-medium flex items-center gap-1" style={{ color: BRAND.orange }}><AlertCircle size={12} /> {errors.upload_file}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha (Metadata) */}
            <div className="space-y-6">
              {/* SECCIÓN 3: Clasificación */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <Tag size={16} style={{ color: BRAND.darkGreen }} /> Clasificación
                </h3>

                <div className="space-y-4">
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
                    </div>
                  </div>

                  {/* Classification Type (Only for Fortalecimiento) */}
                  {categories.find(c => String(c.id) === String(formData.category_id))?.name === "Fortalecimiento" && (
                    <div>
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
                                ? "-- Seleccionar Tipo Primero --"
                                : "-- Seleccionar Clasificación --"
                            }
                          </option>
                          {filteredClassificationTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Author */}
                  <div>
                    <label className={labelClass}>Autor/Entidad</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Nombre del autor"
                        className={`${inputClass} pl-10`}
                        style={{ "--tw-ring-color": BRAND.lightBlue }}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="pt-6 mt-4 border-t border-gray-100">
                  <label className={`${labelClass} mb-2`}>Estado</label>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: "draft" }))}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${formData.status === "draft"
                        ? "bg-orange-50 text-orange-600 border border-orange-200"
                        : "bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100"
                        }`}
                    >
                      Borrador
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: "published" }))}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${formData.status === "published"
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100"
                        }`}
                    >
                      Publicado
                    </button>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: Vigencia */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <Calendar size={16} style={{ color: BRAND.blue }} /> Vigencia
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Fecha Inicio</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className={inputClass}
                      style={{ "--tw-ring-color": BRAND.lightBlue }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Fecha Fin</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className={inputClass}
                      style={{ "--tw-ring-color": BRAND.lightBlue }}
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

      {/* Modal de Cropper */}
      {showCropper && (
        <div className="fixed inset-0 z-[10000] bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Ajustar Portada del Proyecto</h3>
              <button
                onClick={() => { setShowCropper(false); setImageToCrop(null); }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden bg-gray-200">
              <Cropper
                src={imageToCrop}
                style={{ height: "100%", width: "100%" }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                dragMode="move"
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
              />
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
              <button
                type="button"
                onClick={() => { setShowCropper(false); setImageToCrop(null); }}
                className="px-6 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCrop}
                className="px-8 py-2 rounded-xl text-white font-bold text-sm transition transform active:scale-95"
                style={{ backgroundColor: BRAND.blue }}
              >
                Confirmar Recorte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}