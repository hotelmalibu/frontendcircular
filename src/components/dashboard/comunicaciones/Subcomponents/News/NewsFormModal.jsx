import React, { useState, useEffect, useRef } from "react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { 
  X, 
  Save, 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  AlertCircle, 
  Upload, 
  Image as ImageIcon, 
  XCircle,
  Type
} from "lucide-react";
import { createNews, updateNews } from "../../../../../api/newsApi";
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

export default function NewsFormModal({ newsData, isEditing, onClose, onSuccess }) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const hasInitialized = useRef(false);
  
  const [formData, setFormData] = useState({
    type: "news",
    title: "",
    description: "",
    category: "",
    author: "",
    start_date: "",
    end_date: "",
    status: "published",
    upload_file: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // ... (Efectos de carga de datos y categorías se mantienen igual)
  useEffect(() => {
    if (isEditing && newsData) {
      setFormData({
        type: newsData.type || "news",
        title: newsData.title || "",
        description: newsData.description || "",
        category: newsData.category || "",
        author: newsData.author || "",
        start_date: newsData.start_date ? formatDateForInput(newsData.start_date) : "",
        end_date: newsData.end_date ? formatDateForInput(newsData.end_date) : "",
        status: "published",
        upload_file: newsData.upload_file || null,
      });
    }
  }, [newsData, isEditing]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
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
  };

  // ... (Inicialización del editor CKEditor se mantiene igual)
  useEffect(() => {
    const initEditor = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        const container = editorRef.current || document.getElementById('news-description-editor');
        if (!container) return;
        if (editorInstanceRef.current) {
          await editorInstanceRef.current.destroy();
          editorInstanceRef.current = null;
        }

        const instance = await ClassicEditor.create(container, {
          toolbar: ['bold', 'italic', '|', 'undo', 'redo']
        });

        editorInstanceRef.current = instance;
        instance.setData(formData.description || "");
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
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const instance = editorInstanceRef.current;
    if (!instance) return;
    const currentData = instance.getData() || '';
    const targetData = formData.description || '';
    if (currentData !== targetData) {
      try {
        instance.setData(targetData);
      } catch (e) {
        // ignore setData errors
      }
    }
  }, [formData.description]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Por favor, seleccione un archivo de imagen válido (JPEG, PNG, GIF, WebP)');
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
        return;
      }
      setFormData((prev) => ({ ...prev, upload_file: file }));
      if (errors.upload_file) {
        setErrors((prev) => ({ ...prev, upload_file: null }));
      }
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, upload_file: null }));
    const fileInput = document.getElementById('news-file-input');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "El título es requerido";
    if (formData.end_date && formData.start_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        newErrors.end_date = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }
    if (formData.upload_file && typeof formData.upload_file === 'object') {
        // ... (Validaciones de archivo)
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // ... (Lógica de envío de datos - FormData - se mantiene igual)
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
      if (formData.upload_file && formData.upload_file instanceof File && formData.upload_file.name && formData.upload_file.size > 0) {
        dataToSend.append('file', formData.upload_file);
      }
      
      dataToSend.append('type', formData.type);
      dataToSend.append('title', formData.title);
      
      let descriptionContent = formData.description;
      if (editorInstanceRef.current) {
        const editorContent = editorInstanceRef.current.getData();
        if (editorContent !== descriptionContent) descriptionContent = editorContent;
      }
      dataToSend.append('description', descriptionContent || "");
      dataToSend.append('category', formData.category || "");
      dataToSend.append('author', formData.author || "");
      dataToSend.append('status', formData.status);
      
      if (formData.start_date) dataToSend.append('start_date', toIsoDate(formData.start_date));
      if (formData.end_date) dataToSend.append('end_date', toIsoDate(formData.end_date));
      if (publishedAt) dataToSend.append('published_at', publishedAt);

      if (isEditing && newsData?.id) {
        await updateNews(newsData.id, dataToSend);
      } else {
        await createNews(dataToSend);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving news:", err);
      // ... (Manejo de errores simplificado para el ejemplo)
      alert("Ocurrió un error al guardar la noticia.");
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
              {isEditing ? "Editar Noticia" : "Nueva Noticia"}
            </h2>
            <p className="text-blue-200 text-xs mt-0.5">Gestión de contenido informativo</p>
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
          <div className="space-y-8">

            {/* SECCIÓN 1: Detalles Principales */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <FileText size={16} style={{ color: BRAND.blue }} /> Información General
              </h3>

              {/* Title */}
              <div className="mb-5">
                <label className={labelClass}>Título <span className="text-red-500">*</span></label>
                <div className="relative">
                   <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>
                   <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ingrese el título de la noticia"
                    className={`${inputClass} pl-10`}
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                    disabled={loading}
                  />
                </div>
                {errors.title && <p className="mt-1 text-xs font-medium text-orange-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.title}</p>}
              </div>

              {/* Description (CKEditor) */}
              <div>
                <label className={labelClass}>Descripción / Contenido</label>
                <div className="prose max-w-none border rounded-xl overflow-hidden bg-white" style={{ borderColor: '#E5E7EB' }}>
                   <div ref={editorRef}></div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Clasificación y Autor */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Tag size={16} style={{ color: BRAND.darkGreen }} /> Clasificación
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Category */}
                <div>
                  <label className={labelClass}>Categoría</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                    disabled={loading || categoriesLoading}
                  >
                    <option value="">{categoriesLoading ? "Cargando..." : "-- Seleccione --"}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className={labelClass}>Autor</label>
                  <div className="relative">
                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>
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
            </div>

            {/* SECCIÓN 3: Multimedia */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <ImageIcon size={16} style={{ color: BRAND.orange }} /> Imagen Destacada
              </h3>

              {!formData.upload_file ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                  <input
                    type="file"
                    id="news-file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <label htmlFor="news-file-input" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-500 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Haz clic para subir una imagen</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Máx. 5MB)</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                   <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 border border-gray-300">
                      {typeof formData.upload_file === 'object' ? (
                        <img src={URL.createObjectURL(formData.upload_file)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <img src={formData.upload_file.url} alt="Preview" className="w-full h-full object-cover" />
                      )}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.upload_file.name || "Imagen actual"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(formData.upload_file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                   </div>
                   <button onClick={removeFile} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
                      <XCircle size={20} />
                   </button>
                </div>
              )}
              {errors.upload_file && <p className="mt-2 text-xs font-medium text-orange-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.upload_file}</p>}
            </div>

            {/* SECCIÓN 4: Fechas */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Calendar size={16} style={{ color: BRAND.blue }} /> Vigencia
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    {errors.end_date && <p className="mt-1 text-xs font-medium text-orange-500">{errors.end_date}</p>}
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
                {isEditing ? "Actualizar Noticia" : "Crear Noticia"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}