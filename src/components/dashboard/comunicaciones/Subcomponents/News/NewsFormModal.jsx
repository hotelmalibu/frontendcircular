import React, { useState, useEffect, useRef } from "react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { X, Save, Calendar, User, Tag, FileText, AlertCircle, Upload, Image, XCircle } from "lucide-react";
import { createNews, updateNews } from "../../../../../api/newsApi";
import { getAllCategories } from "../../../../../api/categoriesApi";

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
    status: "draft",
    upload_file: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

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
        status: newsData.status || "draft",
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
        // If it's a single object, wrap it in an array
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

  // Initialize CKEditor manually into the container with id news-description-editor
  useEffect(() => {
    const initEditor = async () => {
      if (hasInitialized.current) return; // avoid double creation
      hasInitialized.current = true;

      try {
        const container = editorRef.current || document.getElementById('news-description-editor');
        if (!container) return;
        if (editorInstanceRef.current) {
          await editorInstanceRef.current.destroy();
          editorInstanceRef.current = null;
        }

        const instance = await ClassicEditor.create(container, {
          toolbar: [
            'bold', 'italic', '|', 'undo', 'redo'
          ]
        });

        editorInstanceRef.current = instance;
        // set initial data
        instance.setData(formData.description || "");
        // keep model synchronized
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

  // Keep editor content in sync with formData.description (e.g., when opening edit modal)
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
    // Use date-only for inputs (`YYYY-MM-DD`)
    return date.toISOString().slice(0, 10);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Por favor, seleccione un archivo de imagen válido (JPEG, PNG, GIF, WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        upload_file: file,
      }));

      // Clear file error if any
      if (errors.upload_file) {
        setErrors((prev) => ({
          ...prev,
          upload_file: null,
        }));
      }
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      upload_file: null,
    }));
    // Reset file input
    const fileInput = document.getElementById('news-file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }

    if (!formData.status) {
      newErrors.status = "El estado es requerido";
    }

    if (formData.end_date && formData.start_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        newErrors.end_date = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }

    // Validate file if provided
    if (formData.upload_file && typeof formData.upload_file === 'object') {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(formData.upload_file.type)) {
        newErrors.upload_file = "Tipo de archivo no válido. Use JPEG, PNG, GIF o WebP.";
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (formData.upload_file.size > maxSize) {
        newErrors.upload_file = "El archivo es demasiado grande. Tamaño máximo: 5MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API: convert date-only inputs to ISO-like date-times
      const toIsoDate = (value) => {
        if (!value) return null;
        // If value is YYYY-MM-DD (from <input type="date">), append time to avoid timezone shifts
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return `${value}T00:00:00`;
        }
        try {
          const d = new Date(value);
          if (isNaN(d.getTime())) return value;
          return d.toISOString();
        } catch (e) {
          return value;
        }
      };

      // If the user didn't provide a published_at, and status is 'published', set today's date
      const todayDate = () => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
      };

      let publishedAt = null;
      // If the form included a published_at (from a previously published news), convert it.
      // If the status is 'published', ensure we set published_at to an ISO or today's date.
      // If the status is not 'published', explicitly clear published_at to avoid server-side validation errors.
      if (formData.published_at) publishedAt = toIsoDate(formData.published_at);
      if (formData.status === "published") {
        if (!publishedAt) publishedAt = todayDate();
      } else {
        // When switching to draft, remove any published_at value to avoid inconsistent state on server
        publishedAt = null;
      }

      const dataToSend = new FormData();
      
      // CRITICAL: Only add file if there's a valid file
      if (formData.upload_file && 
          formData.upload_file instanceof File && 
          formData.upload_file.name && 
          formData.upload_file.size > 0) {
        dataToSend.append('file', formData.upload_file); // Field name must be 'file' to match Postman
        console.log("✅ File added to FormData as 'file':", formData.upload_file.name);
      } else {
        console.log("ℹ️ No file selected or invalid file - NOT adding file field");
        // Explicitly ensure we don't add an empty file field
      }
      
      // Add basic form fields (AFTER checking file to avoid conflicts)
      dataToSend.append('type', formData.type);
      dataToSend.append('title', formData.title);
      
      // Ensure description is properly captured from CKEditor
      let descriptionContent = formData.description;
      if (editorInstanceRef.current) {
        const editorContent = editorInstanceRef.current.getData();
        if (editorContent !== descriptionContent) {
          descriptionContent = editorContent;
          console.log("Using editor content instead of form data:", descriptionContent);
        }
      }
      dataToSend.append('description', descriptionContent || "");
      
      dataToSend.append('category', formData.category || "");
      dataToSend.append('author', formData.author || "");
      dataToSend.append('status', formData.status);
      
      // Add dates
      if (formData.start_date) dataToSend.append('start_date', toIsoDate(formData.start_date));
      if (formData.end_date) dataToSend.append('end_date', toIsoDate(formData.end_date));
      if (publishedAt) dataToSend.append('published_at', publishedAt);

      console.log("NewsFormModal - FormData to send:");
      for (let [key, value] of dataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      console.log("NewsFormModal - Form state:", {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        author: formData.author,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date,
        hasFile: !!(formData.upload_file && formData.upload_file.name),
        publishedAt: publishedAt
      });

      if (isEditing && newsData?.id) {
        await updateNews(newsData.id, dataToSend);
        alert("Noticia actualizada exitosamente");
      } else {
        await createNews(dataToSend);
        alert("Noticia creada exitosamente");
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving news - Full error:", err);
      console.error("Error response:", err.response);
      
      // Get detailed error information
      let errorMessage = "Error al crear la publicación";
      
      // Try to get specific error from server
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (typeof err.response?.data === 'string') {
        errorMessage = err.response.data;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.toString() !== "[object Object]") {
        errorMessage = err.toString();
      }
      
      // Map server validation errors to form fields if available
      const serverErrors = err.response?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const mapped = {};
        Object.keys(serverErrors).forEach((key) => {
          const val = serverErrors[key];
          mapped[key] = Array.isArray(val) ? val.join(" ") : String(val);
        });
        setErrors((prev) => ({ ...prev, ...mapped }));
      }
      
      // Always show detailed error for debugging
      const errorDetails = {
        message: errorMessage,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        error: err.message,
        fullError: err
      };
      
      alert(`🔍 DETALLES DEL ERROR:\n\n${JSON.stringify(errorDetails, null, 2)}`);
      
      console.log("Complete error details:", errorDetails);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-green-600 to-green-700">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Editar Noticia" : "Nueva Noticia"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
            disabled={loading}
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Status Row (type is fixed to 'news' by default) */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                    errors.status ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.status}
                  </p>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ingrese el título de la noticia"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción / Contenido
              </label>
                {/* Rich text editor for description (CKEditor 5) */}
                <div className="w-full">
                  <div ref={editorRef} className="ck-editor__editable"></div>
                </div>
            </div>

            {/* Category and Author Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Tag size={16} />
                  Categoría
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  disabled={loading || categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? "Cargando categorías..." : "-- Seleccione categoría --"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <User size={16} />
                  Autor
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Nombre del autor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                <Image size={16} />
                Imagen de la Noticia
              </label>
              
              <div className="space-y-4">
                {!formData.upload_file ? (
                  /* Upload Area */
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <input
                      type="file"
                      id="news-file-input"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={loading}
                    />
                    <label
                      htmlFor="news-file-input"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <div className="bg-gray-100 rounded-full p-3">
                        <Upload size={24} className="text-gray-500" />
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-green-600 hover:text-green-500">
                          Haz clic para subir una imagen
                        </span>{' '}
                        o arrastra y suelta
                      </div>
                      <div className="text-xs text-gray-500">
                        PNG, JPG, GIF o WebP (máx. 5MB)
                      </div>
                    </label>
                  </div>
                ) : (
                  /* Preview and File Info */
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {typeof formData.upload_file === 'object' && formData.upload_file.name ? (
                          <img
                            src={URL.createObjectURL(formData.upload_file)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : formData.upload_file.url ? (
                          <img
                            src={formData.upload_file.url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="truncate">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {typeof formData.upload_file === 'object' && formData.upload_file.name 
                                ? formData.upload_file.name 
                                : formData.upload_file.original_name || 'Archivo seleccionado'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {typeof formData.upload_file === 'object' && formData.upload_file.name 
                                ? `${(formData.upload_file.size / 1024 / 1024).toFixed(2)} MB`
                                : formData.upload_file.size 
                                  ? `${(formData.upload_file.size / 1024 / 1024).toFixed(2)} MB`
                                  : 'Tamaño desconocido'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formData.upload_file.mime || formData.upload_file.extension || 'Imagen'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="text-red-500 hover:text-red-700 p-1"
                            disabled={loading}
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.upload_file && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.upload_file}
                  </p>
                )}
              </div>
            </div>

            {/* Dates Section */}
            <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                  <Calendar size={16} />
                  Fechas
                </h3>

                {/* Contenedor en fila */}
                <div className="flex flex-row gap-4">
                  
                  {/* Start Date */}
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      disabled={loading}
                    />
                  </div>

                  {/* End Date */}
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                        errors.end_date ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />

                    {errors.end_date && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.end_date}
                      </p>
                    )}
                  </div>
                </div>
              </div>

          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditing ? "Actualizar" : "Crear"} Noticia
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
