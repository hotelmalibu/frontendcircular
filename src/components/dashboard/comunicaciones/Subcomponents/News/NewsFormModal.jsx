import React, { useState, useEffect, useRef } from "react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { X, Save, Calendar, User, Tag, FileText, AlertCircle } from "lucide-react";
import { createNews, updateNews } from "../../../../../api/newsApi";

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
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      });
    }
  }, [newsData, isEditing]);

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
            'heading', '|', 'bold', 'italic', 'underline', 'link',
            'bulletedList', 'numberedList', '|', 'outdent', 'indent',
            '|', 'blockQuote', 'undo', 'redo'
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

    // published_at is automated; no client-side input required

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

      const dataToSend = {
        ...formData,
        start_date: toIsoDate(formData.start_date),
        end_date: toIsoDate(formData.end_date),
        published_at: publishedAt,
      };

      // If we explicitly cleared published_at (for draft), remove the key to avoid backend validation issues
      if (publishedAt === null) {
        delete dataToSend.published_at;
      }

      // Debug: log payload sent to backend
      console.log("NewsFormModal - payload to send:", dataToSend);

      if (isEditing && newsData?.id) {
        await updateNews(newsData.id, dataToSend);
        alert("Noticia actualizada exitosamente");
      } else {
        await createNews(dataToSend);
        alert("Noticia creada exitosamente");
      }

      onSuccess();
    } catch (err) {
      // Map server validation errors to form fields if available
      const serverMessage = err.response?.data?.message;
      const serverErrors = err.response?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const mapped = {};
        Object.keys(serverErrors).forEach((key) => {
          // serverErrors[key] may be an array of messages
          const val = serverErrors[key];
          mapped[key] = Array.isArray(val) ? val.join(" ") : String(val);
        });
        setErrors((prev) => ({ ...prev, ...mapped }));
      }

      const errorMessage = serverMessage || err.response?.data?.message || "Error al guardar la noticia";
      alert(errorMessage);
      console.error("Error saving news:", err);
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
                  disabled={loading}
                >
                  <option value="">-- Seleccione categoría --</option>
                  <option value="Medio Ambiente">Medio Ambiente</option>
                  <option value="Reciclaje">Reciclaje</option>
                  <option value="Biodiversidad">Biodiversidad</option>
                  <option value="Cambio Climático">Cambio Climático</option>
                  <option value="Gestión de Residuos">Gestión de Residuos</option>
                  <option value="Energías Renovables">Energías Renovables</option>
                  <option value="Conservación">Conservación</option>
                  <option value="Agua y Saneamiento">Agua y Saneamiento</option>
                  <option value="Educación Ambiental">Educación Ambiental</option>
                  <option value="Políticas Públicas">Políticas Públicas</option>
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

            {/* Dates Section */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                <Calendar size={16} />
                Fechas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Start Date */}
                <div>
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
                <div>
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

                {/* Published At is automated; not requested from the form */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Fecha de Publicación
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                    Se asigna automáticamente al cambiar a "Publicado"
                  </div>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
              <FileText className="text-blue-600 flex-shrink-0" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Información sobre las fechas:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    <strong>Fecha de Inicio:</strong> Fecha en que la noticia/evento comienza
                  </li>
                  <li>
                    <strong>Fecha de Fin:</strong> Fecha en que la noticia/evento expira
                  </li>
                  <li>
                    <strong>Fecha de Publicación:</strong> Fecha efectiva de publicación
                  </li>
                </ul>
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
