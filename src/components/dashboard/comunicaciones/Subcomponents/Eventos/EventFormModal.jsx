import React, { useState, useEffect, useRef } from "react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { X, Save, Calendar, MapPin, Video, Users, Globe, Link as LinkIcon, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { createSchedule, updateSchedule } from "../../../../../api/scheduleApi";

export default function EventFormModal({ eventData, isEditing, onClose, onSuccess }) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const hasInitialized = useRef(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
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
    published_at: "",
    status: "draft",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && eventData) {
      setFormData({
        title: eventData.title || "",
        description: eventData.description || "",
        category: eventData.category || "",
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
        published_at: eventData.published_at ? formatDateForInput(eventData.published_at) : "",
        status: eventData.status || "draft",
      });
    }
  }, [eventData, isEditing]);

  // Initialize CKEditor
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
          toolbar: [
            'bold', 'italic', '|', 'undo', 'redo'
          ]
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

  // Keep editor content in sync
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

  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10); // YYYY-MM-DD format
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    if (!formData.start_datetime) {
      newErrors.start_datetime = "La fecha y hora de inicio son requeridas";
    }

    if (!formData.end_datetime) {
      newErrors.end_datetime = "La fecha y hora de fin son requeridas";
    }

    if (formData.start_datetime && formData.end_datetime) {
      const startDate = new Date(formData.start_datetime);
      const endDate = new Date(formData.end_datetime);
      if (endDate <= startDate) {
        newErrors.end_datetime = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }

    // Validate location fields for in-person events
    if (formData.event_type === 'in_person') {
      if (!formData.location_name.trim()) {
        newErrors.location_name = "El nombre del lugar es requerido para eventos presenciales";
      }
      if (!formData.location_address.trim()) {
        newErrors.location_address = "La dirección es requerida para eventos presenciales";
      }
    }

    // Validate meeting link for remote events
    if (formData.event_type === 'remote') {
      if (!formData.meeting_link.trim()) {
        newErrors.meeting_link = "El enlace de reunión es requerido para eventos remotos";
      }
    }

    // Validate coordinates if provided
    if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = "La latitud debe estar entre -90 y 90";
    }

    if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = "La longitud debe estar entre -180 y 180";
    }

    // Validate max_attendees if registration is required
    if (formData.requires_registration && formData.max_attendees) {
      const maxAttendees = parseInt(formData.max_attendees);
      if (isNaN(maxAttendees) || maxAttendees <= 0) {
        newErrors.max_attendees = "El número máximo de asistentes debe ser un número positivo";
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
      // Prepare data for API
      const toIsoDateTime = (value) => {
        if (!value) return null;
        try {
          const d = new Date(value);
          if (isNaN(d.getTime())) return value;
          return d.toISOString();
        } catch (e) {
          return value;
        }
      };

      // Handle published_at based on status
      let publishedAt = null;
      if (formData.published_at) {
        publishedAt = toIsoDateTime(formData.published_at);
      } else if (formData.status === "published") {
        publishedAt = new Date().toISOString();
      }

      const dataToSend = {
        title: formData.title,
        description: formData.description || "",
        category: formData.category || "",
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

      console.log("EventFormModal - Data to send:", dataToSend);

      if (isEditing && eventData?.id) {
        await updateSchedule(eventData.id, dataToSend);
        alert("Evento actualizado exitosamente");
      } else {
        await createSchedule(dataToSend);
        alert("Evento creado exitosamente");
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving event - Full error:", err);
      
      let errorMessage = "Error al crear el evento";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
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
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-green-600 to-green-700">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Editar Evento" : "Nuevo Evento"}
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
          <div className="space-y-6">
            {/* Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Evento
                </label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  disabled={loading}
                >
                  <option value="in_person">Presencial</option>
                  <option value="remote">Remoto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Globe size={16} />
                  Zona Horaria
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  disabled={loading}
                >
                  <option value="America/Bogota">Bogotá (GMT-5)</option>
                  <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                  <option value="America/Caracas">Caracas (GMT-4)</option>
                  <option value="America/Lima">Lima (GMT-5)</option>
                  <option value="America/Bogota">Lima (GMT-5)</option>
                  <option value="America/Guayaquil">Guayaquil (GMT-5)</option>
                  <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Evento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ingrese el título del evento"
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
                Descripción del Evento
              </label>
              <div className="w-full">
                <div ref={editorRef} className="ck-editor__editable"></div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <option value="conference">Conferencia</option>
                <option value="workshop">Taller</option>
                <option value="seminar">Seminario</option>
                <option value="webinar">Webinar</option>
                <option value="meeting">Reunión</option>
                <option value="training">Capacitación</option>
                <option value="networking">Networking</option>
                <option value="Medio Ambiente">Medio Ambiente</option>
                <option value="Reciclaje">Reciclaje</option>
                <option value="Conservación">Conservación</option>
                <option value="Políticas Públicas">Políticas Públicas</option>
              </select>
            </div>

            {/* Date & Time Section */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-1">
                <Calendar size={16} />
                Fecha y Hora
              </h3>

              <div className="space-y-4">
                {/* All Day Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_all_day"
                    checked={formData.is_all_day}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={loading}
                  />
                  <label className="text-sm text-gray-700">Evento de día completo</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start DateTime */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Fecha y Hora de Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="start_datetime"
                      value={formData.start_datetime}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                        errors.start_datetime ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    {errors.start_datetime && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.start_datetime}
                      </p>
                    )}
                  </div>

                  {/* End DateTime */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Fecha y Hora de Fin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="end_datetime"
                      value={formData.end_datetime}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                        errors.end_datetime ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    {errors.end_datetime && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.end_datetime}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section - Different based on event type */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-1">
                {formData.event_type === 'remote' ? <Video size={16} /> : <MapPin size={16} />}
                {formData.event_type === 'remote' ? 'Enlace de Reunión' : 'Ubicación'}
              </h3>

              {formData.event_type === 'remote' ? (
                /* Remote Event Fields */
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Enlace de Reunión <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="meeting_link"
                    value={formData.meeting_link}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                      errors.meeting_link ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={loading}
                  />
                  {errors.meeting_link && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.meeting_link}
                    </p>
                  )}
                </div>
              ) : (
                /* In-Person Event Fields */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Nombre del Lugar <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location_name"
                      value={formData.location_name}
                      onChange={handleChange}
                      placeholder="Ej: Centro de Convenciones"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                        errors.location_name ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    {errors.location_name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.location_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location_address"
                      value={formData.location_address}
                      onChange={handleChange}
                      placeholder="Ej: Carrera 15 #93-07, Bogotá"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                        errors.location_address ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    {errors.location_address && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.location_address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Latitud
                      </label>
                      <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="4.6097100"
                        step="any"
                        min="-90"
                        max="90"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                          errors.latitude ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                      />
                      {errors.latitude && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.latitude}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Longitud
                      </label>
                      <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="-74.0817500"
                        step="any"
                        min="-180"
                        max="180"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                          errors.longitude ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                      />
                      {errors.longitude && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.longitude}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Registration Section */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-1">
                <Users size={16} />
                Registro de Asistentes
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="requires_registration"
                    checked={formData.requires_registration}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={loading}
                  />
                  <label className="text-sm text-gray-700">Requiere registro previo</label>
                </div>

                {formData.requires_registration && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Número Máximo de Asistentes
                    </label>
                    <input
                      type="number"
                      name="max_attendees"
                      value={formData.max_attendees}
                      onChange={handleChange}
                      placeholder="Ej: 100"
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                        errors.max_attendees ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    {errors.max_attendees && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.max_attendees}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Published Date */}
            {formData.status === "published" && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-1">
                  <CheckCircle size={16} />
                  Fecha de Publicación
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Fecha de Publicación
                  </label>
                  <input
                    type="date"
                    name="published_at"
                    value={formData.published_at}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    disabled={loading}
                  />
                </div>
              </div>
            )}
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
                {isEditing ? "Actualizar" : "Crear"} Evento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}