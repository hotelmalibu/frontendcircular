import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
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
  Type,
  CheckCircle,
  Clock
} from "lucide-react";
import { createNews, updateNews } from "../../../../../api/newsApi";
import { getAllCategories } from "../../../../../api/categoriesApi"; import { toast } from "react-hot-toast";

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
  const [formData, setFormData] = useState({
    type: "news",
    title: "",
    description: "",
    category_id: "",
    author: "",
    start_date: "",
    end_date: "",
    published_at: "",
    status: "published",
    upload_file: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Estados para Cropper
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const cropperRef = useRef(null);

  // ... (Efectos de carga de datos y categorías se mantienen igual)
  useEffect(() => {
    if (isEditing && newsData) {
      const description = newsData.description || "";
      const catId = (newsData.category && typeof newsData.category === 'object') ? (newsData.category?.id || "") : (newsData.category_id || "");

      console.log("NewsFormModal - Loading Data:", {
        isEditing,
        descriptionLength: description.length,
        category_id: catId,
        rawCategory: newsData.category
      });

      setFormData((prev) => ({
        ...prev,
        type: newsData.type || "news",
        title: newsData.title || "",
        description: description,
        category_id: catId,
        author: newsData.author || "",
        start_date: newsData.start_date ? formatDateForInput(newsData.start_date) : "",
        end_date: newsData.end_date ? formatDateForInput(newsData.end_date) : "",
        published_at: newsData.published_at ? formatDateForInput(newsData.published_at) : "",
        status: newsData.status || "published",
        upload_file: newsData.upload_file || null,
      }));
      console.log("NewsFormModal - Status loaded:", newsData.status);
    }
  }, [newsData, isEditing]);


  const loadCategories = React.useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

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

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: null }));
    }
  };


  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category' || name === 'category_id') {
      console.log("NewsFormModal - Category Selected (Value):", value);
    }
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
        toast.error('Por favor, seleccione un archivo de imagen válido (JPEG, PNG, GIF, WebP)');
        return;
      }
      const maxSize = 10 * 1024 * 1024; // Aumentamos a 10MB temporalmente para el recorte
      if (file.size > maxSize) {
        toast.error('El archivo es demasiado grande. El tamaño máximo permitido para procesar es 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);

      // Limpiar el input para permitir seleccionar la misma imagen
      e.target.value = '';
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas({
        maxWidth: 1200,
        maxHeight: 800,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      }).toBlob((blob) => {
        if (blob) {
          // Crear un objeto de archivo a partir del blob
          const croppedFile = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
          setFormData((prev) => ({ ...prev, upload_file: croppedFile }));
          setShowCropper(false);
          setImageToCrop(null);
          if (errors.upload_file) {
            setErrors((prev) => ({ ...prev, upload_file: null }));
          }
        }
      }, 'image/jpeg', 0.9);
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
    if (!formData.category_id) newErrors.category_id = "La categoría es requerida";
    if (!formData.author.trim()) newErrors.author = "El autor es requerido";

    // Validar contenido de ReactQuill (quitando tags HTML para ver si hay texto real)
    const strippedDescription = formData.description.replace(/<[^>]*>/g, '').trim();
    if (!strippedDescription) newErrors.description = "El contenido de la noticia es requerido";

    if (formData.end_date && formData.start_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        newErrors.end_date = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
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
        try {
          const d = new Date(value);
          if (isNaN(d.getTime())) return value;
          return d.toISOString();
        } catch (e) { return value; }
      };

      const todayDate = () => {
        return new Date().toISOString();
      };

      let publishedAt = formData.published_at ? toIsoDate(formData.published_at) : todayDate();

      const dataToSend = new FormData();
      if (formData.upload_file && formData.upload_file instanceof File && formData.upload_file.name && formData.upload_file.size > 0) {
        dataToSend.append('file', formData.upload_file);
      }

      dataToSend.append('type', formData.type);
      dataToSend.append('title', formData.title);

      let descriptionContent = formData.description || "";
      dataToSend.append('content', descriptionContent);
      // El campo description ahora acepta texto completo (sin límite max en el backend)
      dataToSend.append('description', descriptionContent);

      if (formData.category_id) {
        dataToSend.append('category_id', formData.category_id);
      }

      dataToSend.append('author', formData.author || "");
      dataToSend.append('status', formData.status);

      console.log("NewsFormModal - Status being sent:", formData.status);
      console.log("NewsFormModal - Submitting dataToSend (category_id):", formData.category_id);

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
      console.log("Full error response:", err.response?.data);

      let errorMessage = "Ocurrió un error al guardar la noticia.";
      if (err.response?.data) {
        const data = err.response.data;
        if (data.message) errorMessage = data.message;

        // If there are specific validation errors, show them
        if (data.errors && typeof data.errors === 'object') {
          const detailedErrors = Object.entries(data.errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n');
          errorMessage += `\n\nErrores de validación:\n${detailedErrors}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const inputClass = `w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${errors.title ? "border-orange-300" : "border-gray-200"}`;
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-[#005380] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Columna Izquierda (Contenido Principal) */}
            <div className="lg:col-span-2 space-y-6">
              {/* SECCIÓN 1: Detalles Principales */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <FileText size={16} style={{ color: BRAND.blue }} /> Información General
                </h3>

                {/* Title */}
                <div className="mb-5">
                  <label className={labelClass}>Título <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
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
                  {errors.title && <p className="mt-1 text-xs font-medium text-orange-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.title}</p>}
                </div>

                {/* Description (ReactQuill) */}
                <div>
                  <label className={labelClass}>Descripción / Contenido <span className="text-red-500">*</span></label>
                  <div className={`bg-white rounded-xl overflow-hidden border transition-all ${errors.description ? "border-orange-300 ring-1 ring-orange-100" : "border-gray-200"}`}>
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={handleEditorChange}
                      modules={modules}
                      formats={formats}
                      placeholder="Escribe el contenido aquí..."
                      className="h-96 mb-16"
                    />
                  </div>
                  {errors.description && <p className="mt-1 text-xs font-medium text-orange-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.description}</p>}
                </div>
              </div>

              {/* SECCIÓN 3: Multimedia (Movida a la izquierda) */}
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
                      {formData.upload_file instanceof File || formData.upload_file instanceof Blob ? (
                        <img src={URL.createObjectURL(formData.upload_file)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={typeof formData.upload_file === 'string' ? formData.upload_file : (formData.upload_file?.url || '')}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.upload_file instanceof File ? formData.upload_file.name : (typeof formData.upload_file === 'string' ? 'Imagen actual' : (formData.upload_file?.name || "Imagen actual"))}
                      </p>
                      {formData.upload_file instanceof File && (
                        <p className="text-xs text-gray-500">
                          {(formData.upload_file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                    <button onClick={removeFile} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
                      <XCircle size={20} />
                    </button>
                  </div>
                )}
                {errors.upload_file && <p className="mt-2 text-xs font-medium text-orange-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.upload_file}</p>}
              </div>
            </div>

            {/* Columna Derecha (Metadata) */}
            <div className="space-y-6">
              {/* SECCIÓN 2: Clasificación y Autor */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <Tag size={16} style={{ color: BRAND.darkGreen }} /> Clasificación
                </h3>

                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <label className={labelClass}>Categoría <span className="text-red-500">*</span></label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className={inputClass}
                      style={{ "--tw-ring-color": BRAND.lightBlue }}
                      disabled={loading || categoriesLoading}
                    >
                      <option value="">{categoriesLoading ? "Cargando..." : "-- Seleccione --"}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                    {errors.category_id && <p className="mt-1 text-xs font-medium text-orange-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.category_id}</p>}
                  </div>

                  {/* Author */}
                  <div>
                    <label className={labelClass}>Autor <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${errors.author ? "text-orange-400" : "text-gray-400"}`} size={16} />
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Nombre del autor"
                        className={`${inputClass} pl-10 ${errors.author ? "border-orange-300 ring-1 ring-orange-100" : ""}`}
                        style={{ "--tw-ring-color": BRAND.lightBlue }}
                        disabled={loading}
                      />
                    </div>
                    {errors.author && <p className="mt-1 text-xs font-medium text-orange-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.author}</p>}
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
                      <Clock size={16} />
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
                      <CheckCircle size={16} />
                      Publicado
                    </button>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: Fechas */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <Calendar size={16} style={{ color: BRAND.blue }} /> Vigencia
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Desde</label>
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
                    <label className={labelClass}>Hasta</label>
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

      {/* Modal de Cropper */}
      {showCropper && (
        <div className="fixed inset-0 z-[10000] bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Ajustar Imagen</h3>
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
                initialAspectRatio={120 / 80}
                aspectRatio={120 / 80}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                dragMode="move"
                background={false}
                responsive={true}
                autoCropArea={0.75}
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