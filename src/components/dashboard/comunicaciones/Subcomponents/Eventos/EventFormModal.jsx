import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  X,
  Save,
  Calendar,
  MapPin,
  Video,
  Users,
  Globe,
  Link as LinkIcon,
  AlertCircle,
  Type,
  AlignLeft
} from "lucide-react";
import { createSchedule, updateSchedule } from "../../../../../api/scheduleApi";
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

export default function EventFormModal({ eventData, isEditing, onClose, onSuccess }) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const hasInitialized = useRef(false);
  const hasSyncedDescription = useRef(false);
  const [editorReady, setEditorReady] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    event_type: "in_person",
    start_datetime: "",
    end_datetime: "",
    is_all_day: false,
    timezone: "America/Bogota",
    location_name: "",
    location_address: "",
    latitude: "",
    longitude: "",
    meeting_link: "",
    requires_registration: false,
    max_attendees: "",
    published_at: null,
    status: "published",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);


  // ... (Lógica de inicialización y carga de datos se mantiene igual)
  useEffect(() => {
    if (isEditing && eventData) {
      const description = eventData.description || "";
      const catId = (eventData.category && typeof eventData.category === 'object') ? (eventData.category?.id || "") : (eventData.category_id || "");

      console.log("EventFormModal - Loading Data:", {
        isEditing,
        descriptionLength: description.length,
        category_id: catId,
        rawCategory: eventData.category
      });

      const newFormData = {
        title: eventData.title || "",
        description: description,
        category_id: catId,
        event_type: eventData.event_type || "in_person",
        start_datetime: eventData.start_datetime ? formatDateTimeForInput(eventData.start_datetime) : "",
        end_datetime: eventData.end_datetime ? formatDateTimeForInput(eventData.end_datetime) : "",
        is_all_day: eventData.is_all_day || false,
        timezone: eventData.timezone || "America/Bogota",
        location_name: eventData.location_name || "",
        location_address: eventData.location_address || "",
        latitude: eventData.latitude ? eventData.latitude.toString() : "",
        longitude: eventData.longitude ? eventData.longitude.toString() : "",
        meeting_link: eventData.meeting_link || "",
        requires_registration: eventData.requires_registration || false,
        max_attendees: eventData.max_attendees ? eventData.max_attendees.toString() : "",
        published_at: eventData.published_at ? formatDateForInput(eventData.published_at) : null,
        status: eventData.status || "draft",
      };

      setFormData(newFormData);
    }
  }, [eventData, isEditing]);

  // Sync editor data once when editor is ready and data is available
  useEffect(() => {
    if (editorReady && isEditing && formData.description && !hasSyncedDescription.current) {
      if (editorInstanceRef.current) {
        console.log("EventFormModal - Syncing initial description to editor");
        editorInstanceRef.current.setData(formData.description);
        hasSyncedDescription.current = true;
      }
    }
  }, [editorReady, isEditing, formData.description]);

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


  useEffect(() => {
    const initEditor = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        const container = editorRef.current || document.getElementById('event-description-editor');
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

  // ... (Helpers de fecha y validación se mantienen igual)
  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'category_id') {
      console.log("EventFormModal - Category ID Selected:", value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "El título es requerido";
    if (!formData.status) newErrors.status = "El estado es requerido";
    if (!formData.start_datetime) newErrors.start_datetime = "Inicio requerido";
    if (!formData.end_datetime) newErrors.end_datetime = "Fin requerido";

    if (formData.start_datetime && formData.end_datetime) {
      if (new Date(formData.end_datetime) <= new Date(formData.start_datetime)) {
        newErrors.end_datetime = "La fecha fin debe ser posterior a la de inicio";
      }
    }

    if (formData.event_type === 'in_person') {
      if (!isEditing && !formData.location_name.trim()) newErrors.location_name = "Lugar requerido";
      if (!isEditing && !formData.location_address.trim()) newErrors.location_address = "Dirección requerida";
    }

    if (formData.event_type === 'remote') {
      if (!isEditing && !formData.meeting_link.trim()) newErrors.meeting_link = "Enlace requerido";
    }

    if (formData.requires_registration && formData.max_attendees) {
      if (parseInt(formData.max_attendees) <= 0) newErrors.max_attendees = "Debe ser positivo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const toIsoDateTime = (value) => {
        if (!value) return null;
        try { return new Date(value).toISOString(); } catch (e) { return value; }
      };

      const publishedAt = formData.published_at ? toIsoDateTime(formData.published_at) : null;

      const dataToSend = {
        title: formData.title,
        description: formData.description || "",
        category_id: formData.category_id || null,
        event_type: formData.event_type,
        start_datetime: toIsoDateTime(formData.start_datetime),
        end_datetime: toIsoDateTime(formData.end_datetime),
        is_all_day: formData.is_all_day,
        timezone: formData.timezone,
        location_name: formData.location_name || "",
        location_address: formData.location_address || "",
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        meeting_link: formData.meeting_link || "",
        requires_registration: formData.requires_registration,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        status: formData.status,
        published_at: publishedAt,
      };

      if (isEditing && eventData?.id) {
        await updateSchedule(eventData.id, dataToSend);
      } else {
        const result = await createSchedule(dataToSend);
        window.dispatchEvent(new CustomEvent('eventCreated', { detail: { event: result.data || result } }));
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving event:", err);
      let errorMessage = "Error desconocido";
      if (err.response?.data?.message) errorMessage = err.response.data.message;
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
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">

        {/* Header con Azul Profundo */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100" style={{ backgroundColor: BRAND.darkBlue }}>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? "Editar Evento" : "Nuevo Evento"}
            </h2>
            <p className="text-blue-200 text-xs mt-0.5">Complete los detalles para agendar</p>
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

            {/* SECCIÓN 1: Información General */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Type size={16} style={{ color: BRAND.blue }} /> Información Básica
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                {/* Estado */}
                <div>
                  <label className={labelClass}>Estado *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Borrador</option>
                  </select>
                </div>

                {/* Tipo de Evento */}
                <div>
                  <label className={labelClass}>Modalidad</label>
                  <select
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                  >
                    <option value="in_person">Presencial</option>
                    <option value="remote">Remoto / Virtual</option>
                  </select>
                </div>

                {/* Categoría */}
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
                    <option value="">{categoriesLoading ? "Cargando..." : "-- Seleccione --"}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Título */}
              <div className="mb-5">
                <label className={labelClass}>Título del Evento *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Congreso de Economía Circular 2025"
                  className={inputClass}
                  style={{
                    "--tw-ring-color": BRAND.lightBlue,
                    borderColor: errors.title ? BRAND.orange : ''
                  }}
                />
                {errors.title && <p className="mt-1 text-xs font-medium flex items-center gap-1" style={{ color: BRAND.orange }}><AlertCircle size={12} /> {errors.title}</p>}
              </div>

              {/* Descripción (CKEditor) */}
              <div>
                <label className={labelClass}><AlignLeft size={12} className="inline mr-1" /> Descripción</label>
                <div className="prose max-w-none border rounded-xl overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
                  <div ref={editorRef}></div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Fecha y Hora */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Calendar size={16} style={{ color: BRAND.darkGreen }} /> Fecha y Hora
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  name="is_all_day"
                  checked={formData.is_all_day}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  style={{ color: BRAND.blue }}
                />
                <label className="text-sm text-gray-700 font-medium">Evento de día completo</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                <div>
                  <label className={labelClass}>Inicio *</label>
                  <input
                    type="datetime-local"
                    name="start_datetime"
                    value={formData.start_datetime}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                  />
                  {errors.start_datetime && <p className="mt-1 text-xs font-medium" style={{ color: BRAND.orange }}>{errors.start_datetime}</p>}
                </div>
                <div>
                  <label className={labelClass}>Fin *</label>
                  <input
                    type="datetime-local"
                    name="end_datetime"
                    value={formData.end_datetime}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                  />
                  {errors.end_datetime && <p className="mt-1 text-xs font-medium" style={{ color: BRAND.orange }}>{errors.end_datetime}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}><Globe size={12} className="inline mr-1" /> Zona Horaria</label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ "--tw-ring-color": BRAND.lightBlue }}
                >
                  <option value="America/Bogota">Bogotá (GMT-5)</option>
                  <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                  <option value="America/Caracas">Caracas (GMT-4)</option>
                  <option value="America/Lima">Lima (GMT-5)</option>
                </select>
              </div>
            </div>

            {/* SECCIÓN 3: Ubicación */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                {formData.event_type === 'remote'
                  ? <><Video size={16} style={{ color: BRAND.blue }} /> Conexión Remota</>
                  : <><MapPin size={16} style={{ color: BRAND.orange }} /> Ubicación Física</>}
              </h3>

              {formData.event_type === 'remote' ? (
                <div>
                  <label className={labelClass}>Enlace de Reunión *</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="url"
                      name="meeting_link"
                      value={formData.meeting_link}
                      onChange={handleChange}
                      placeholder="https://meet.google.com/..."
                      className={`${inputClass} pl-10`}
                      style={{ "--tw-ring-color": BRAND.lightBlue }}
                    />
                  </div>
                  {errors.meeting_link && <p className="mt-1 text-xs font-medium" style={{ color: BRAND.orange }}>{errors.meeting_link}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Nombre del Lugar *</label>
                    <input
                      type="text"
                      name="location_name"
                      value={formData.location_name}
                      onChange={handleChange}
                      placeholder="Ej: Centro de Convenciones Ágora"
                      className={inputClass}
                      style={{ "--tw-ring-color": BRAND.lightBlue }}
                    />
                    {errors.location_name && <p className="mt-1 text-xs font-medium" style={{ color: BRAND.orange }}>{errors.location_name}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Dirección *</label>
                    <input
                      type="text"
                      name="location_address"
                      value={formData.location_address}
                      onChange={handleChange}
                      placeholder="Ej: Calle 26 # 12-34"
                      className={inputClass}
                      style={{ "--tw-ring-color": BRAND.lightBlue }}
                    />
                    {errors.location_address && <p className="mt-1 text-xs font-medium" style={{ color: BRAND.orange }}>{errors.location_address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Latitud</label>
                      <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="4.6097100"
                        className={inputClass}
                        style={{ "--tw-ring-color": BRAND.lightBlue }}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Longitud</label>
                      <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="-74.0817500"
                        className={inputClass}
                        style={{ "--tw-ring-color": BRAND.lightBlue }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECCIÓN 4: Registro */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Users size={16} style={{ color: BRAND.blue }} /> Asistentes
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  name="requires_registration"
                  checked={formData.requires_registration}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  style={{ color: BRAND.blue }}
                />
                <label className="text-sm text-gray-700 font-medium">Requiere registro previo</label>
              </div>

              {formData.requires_registration && (
                <div>
                  <label className={labelClass}>Cupo Máximo</label>
                  <input
                    type="number"
                    name="max_attendees"
                    value={formData.max_attendees}
                    onChange={handleChange}
                    placeholder="Ej: 100"
                    className={inputClass}
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                  />
                  {errors.max_attendees && <p className="mt-1 text-xs font-medium" style={{ color: BRAND.orange }}>{errors.max_attendees}</p>}
                </div>
              )}
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
                {isEditing ? "Actualizar Evento" : "Crear Evento"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}