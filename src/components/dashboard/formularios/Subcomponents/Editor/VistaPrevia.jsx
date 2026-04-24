import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import formsApi from "../../../../../api/formsApi";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Settings2,
  Save,
  Send,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  Calendar,
  Type,
  Hash,
  Mail,
  List,
  CheckSquare,
  Upload,
  Maximize2,
  Minimize2,
  LayoutGrid
} from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  lightBlue: "#7FB8D9",  // Azul Claro
  lime: "#B1D357",       // Verde Lima
  green: "#00AB6D",      // Verde Principal
};

const DEFAULT_FIELD_TYPES = [
  { name: 'Texto', slug: 'text', description: 'Campo de texto simple', component: 'text-input' },
  { name: 'Email', slug: 'email', description: 'Campo de correo electrónico', component: 'email-input' },
  { name: 'URL', slug: 'url', description: 'Campo de URL', component: 'url-input' },
  { name: 'Teléfono', slug: 'phone', description: 'Campo de número de teléfono', component: 'phone-input' },
  { name: 'Número', slug: 'number', description: 'Campo numérico', component: 'number-input' },
  { name: 'Fecha', slug: 'date', description: 'Campo de fecha', component: 'date-input' },
  { name: 'Checkbox', slug: 'checkbox', description: 'Casilla de verificación', component: 'checkbox-input' },
  { name: 'Radio Buttons', slug: 'radio', description: 'Botones de opción única', component: 'radio-input', options_schema: { options: 'array' } },
  { name: 'Menú Desplegable', slug: 'select', description: 'Menú desplegable', component: 'select-input', options_schema: { choices: { type: 'array' } } },
  { name: 'Hora', slug: 'time', description: 'Selector de hora', component: 'time-input' },
  { name: 'Escala Lineal', slug: 'linear_scale', description: 'Escala numérica (ej. 1 a 5)', component: 'scale-input', options_schema: { min: { type: 'integer', default: 1 }, max: { type: 'integer', default: 5 }, min_label: "Etiqueta Min", max_label: "Etiqueta Max" } },
  { name: 'Sección', slug: 'section', description: 'Dividir formulario en páginas', component: 'section-break' },
  { name: 'Título y Descripción', slug: 'title', description: 'Bloque de texto sin input', component: 'title-display', options_schema: { tag: 'h2', align: 'left' } },
  { name: 'Imagen', slug: 'image', description: 'Imagen ilustrativa', component: 'image-display' },
  { name: 'Video', slug: 'video', description: 'Video de YouTube', component: 'video-display' },
  { name: 'Cuadrícula de opción múltiple', slug: 'grid', description: 'Selecciona una opción por fila', component: 'grid-input', options_schema: { rows: { type: 'array' }, columns: { type: 'array' } } },
  { name: 'Cuadrícula de casillas', slug: 'checkbox_grid', description: 'Selecciona varias opciones por fila', component: 'checkbox-grid-input', options_schema: { rows: { type: 'array' }, columns: { type: 'array' } } },
  { name: 'Carga de Archivo', slug: 'file', description: 'Carga de archivos', component: 'file-input', options_schema: { accept: ".pdf,.doc,.docx,.jpg,.png", size_limit: { type: 'integer', default: 5 } } },
  { name: 'Área de Texto', slug: 'textarea', description: 'Texto multilínea', component: 'textarea-input' }
];

const FormBuilder = ({ formId, onSuccess }) => {
  const [formMeta, setFormMeta] = useState({
    title: "",
    description: "",
    category: "encuesta",
    version: 1,
    expires_at: "",
    metadata: {}
  });
  const [formFields, setFormFields] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Protection against accidental tab closure
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Track changes on formMeta or formFields updates
  useEffect(() => {
    // Only set hasChanges after initial load (when loading is false)
    if (!loading && (formMeta.title !== "" || formFields.length > 0)) {
       // Note: This is a simple check. For better accuracy we'd compare with initial state.
       // But for a builder, any interaction usually implies modification intent.
    }
  }, [formMeta, formFields, loading]);

  const markChanged = () => {
    if (!hasChanges) setHasChanges(true);
  };

  useEffect(() => {
    const fetchFieldTypes = async () => {
      try {
        const response = await formsApi.getFieldTypes();
        // Handle various response patterns: { data: { field_types: [] } }, { field_types: [] }, { data: [] }, or [...]
        const base = response.data || response;
        let list = [];
        
        if (base && base.field_types && Array.isArray(base.field_types)) {
          list = base.field_types;
        } else if (base && base.data && base.data.field_types && Array.isArray(base.data.field_types)) {
          list = base.data.field_types;
        } else if (base && base.data && Array.isArray(base.data)) {
          list = base.data;
        } else if (Array.isArray(base)) {
          list = base;
        }
        
        console.log("Field types parsed:", list);
        
        // Custom sort to prioritize visual elements (Title, Paragraph)
        const sortedList = list.sort((a, b) => {
          const priority = ['title', 'paragraph'];
          const slugA = (a.slug || '').toLowerCase();
          const slugB = (b.slug || '').toLowerCase();
          
          const indexA = priority.indexOf(slugA);
          const indexB = priority.indexOf(slugB);
          
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          
          return 0;
        });

        setFieldTypes(sortedList.length > 0 ? sortedList : DEFAULT_FIELD_TYPES);
      } catch (error) {
        console.error("Error fetching field types, using defaults:", error);
        // Fallback to defaults on error
        setFieldTypes(DEFAULT_FIELD_TYPES);
      }
    };
    fetchFieldTypes();
  }, []);

  useEffect(() => {
    if (formId) {
      const fetchFormDetails = async () => {
        setLoading(true);
        try {
          const response = await formsApi.getForm(formId);
          const form = response.data?.form || response.data || response;
          
          setFormMeta({
            title: form.title || "",
            description: form.description || "",
            category: form.category || "encuesta",
            version: form.version || 1,
            expires_at: form.expires_at ? form.expires_at.split('T')[0] : "",
            metadata: form.metadata || {}
          });

          if (form.fields) {
            const mappedFields = form.fields.map(field => ({
              id: field.id,
              field_type_id: field.field_type_id,
              type_name: field.field_type?.name || "Campo",
              type_slug: field.field_type?.slug || "text",
              name: field.name,
              label: field.label,
              description: field.description || "",
              placeholder: field.placeholder || "",
              is_required: !!field.is_required,
              is_visible: !!field.is_visible,
              order: field.order,
              validation_rules: field.validation_rules || [],
              default_value: field.default_value,
              options: field.options || {},
              _schema: field.field_type?.options_schema
            }));
            setFormFields(mappedFields);
          }
        } catch (error) {
          console.error("Error fetching form details:", error);
          toast.error("Error al cargar los detalles del formulario");
        } finally {
          setLoading(false);
        }
      };
      fetchFormDetails();
    } else {
      // RESET STATE when formId becomes null (creating new)
      setFormMeta({
        title: "",
        description: "",
        category: "encuesta",
        version: 1,
        expires_at: "",
        metadata: {}
      });
      setFormFields([]);
      setSelectedFieldIndex(null);
      setHasChanges(false);
    }
  }, [formId]);

  const addField = (fieldType) => {
    // Determine default options based on options_schema
    const initialOptions = {};
    if (fieldType.options_schema) {
      Object.keys(fieldType.options_schema).forEach(key => {
        const schema = fieldType.options_schema[key];
        const type = typeof schema === 'string' ? schema : schema.type;

        if (type === 'boolean') initialOptions[key] = false;
        else if (type === 'integer' || type === 'numeric') initialOptions[key] = ""; // Start empty to avoid 0 validation issues
        else if (type === 'array') initialOptions[key] = [];
        else initialOptions[key] = "";
      });
    }

    const newField = {
      field_type_id: fieldType.id, // This MUST have an ID
      type_name: fieldType.name,
      type_slug: fieldType.slug,
      name: `${fieldType.slug}_${Date.now()}`,
      label: `Nuevo ${fieldType.name}`,
      description: fieldType.description || "",
      placeholder: "",
      is_required: false,
      is_visible: true,
      order: formFields.length + 1,
      validation_rules: [],
      default_value: null,
      options: initialOptions,
      _schema: fieldType.options_schema // Keep track of schema for the UI
    };

    if (!newField.field_type_id) {
       console.error("Attempted to add field without type ID:", fieldType);
       toast.error("Error: El tipo de campo seleccionado no tiene un ID válido");
       return;
    }

    setFormFields([...formFields, newField]);
    setSelectedFieldIndex(formFields.length);
    markChanged();
  };

  const moveField = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formFields.length - 1) return;

    const newFields = [...formFields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap elements
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];

    // Update orders
    const updatedWithOrders = newFields.map((f, i) => ({ ...f, order: i + 1 }));
    setFormFields(updatedWithOrders);

    // Maintain selection if it was the moved field
    if (selectedFieldIndex === index) setSelectedFieldIndex(targetIndex);
    else if (selectedFieldIndex === targetIndex) setSelectedFieldIndex(index);
    
    markChanged();
  };

  const removeField = (index) => {
    const newFields = formFields.filter((_, i) => i !== index);
    setFormFields(newFields.map((f, i) => ({ ...f, order: i + 1 })));
    setSelectedFieldIndex(null);
    markChanged();
  };

  const updateField = (index, updates) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], ...updates };
    setFormFields(newFields);
    markChanged();
  };

  const handleSave = async (isPublish = false) => {
    if (!formMeta.title) {
      toast.error("El título es obligatorio");
      return;
    }
    setSaving(true);
    try {
      // Validate that all fields have a field_type_id
      const invalidFields = formFields.filter(f => !f.field_type_id);
      if (invalidFields.length > 0) {
        console.error("Cannot save: fields missing field_type_id", invalidFields);
        toast.error("Error: Algunos campos no tienen un tipo válido configurado");
        setSaving(false);
        return;
      }

      // Clean up fields for API (remove UI-only helpers like _schema)
      const cleanFields = formFields.map(({ _schema, type_name, type_slug, ...rest }) => rest);

      const payload = {
        ...formMeta,
        status: isPublish ? 'published' : 'draft',
        fields: cleanFields
      };

      console.log("Pre-save Payload:", payload);

      const response = formId 
        ? await formsApi.updateForm(formId, payload)
        : await formsApi.createForm(payload);

      // Robust ID extraction
      const body = response.data || response;
      const responseId = body.id || (body.data && body.data.id) || body.form?.id;

      if (!responseId && !formId) {
        console.error("Could not extract form ID from response:", body);
        throw new Error("No se pudo obtener el ID del formulario");
      }

      if (isPublish) {
        toast.success("Formulario publicado con éxito");
      } else {
        toast.success(formId ? "Formulario actualizado con éxito" : "Borrador guardado con éxito");
      }

      setHasChanges(false); // Reset changes after successful save

      // Trigger redirection
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500); // Small delay so user sees the toast
      }
    } catch (error) {
      console.error("Error saving form:", error);

      const responseData = error.response?.data;
      if (responseData?.errors) {
        // Extract all specific error messages
        const messages = Object.values(responseData.errors).flat();
        if (messages.length > 0) {
          toast.error(messages[0]); // Show the first specific error
          return;
        }
      }

      const errorMsg = responseData?.message || error.message || "Error al guardar el formulario";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      toast((t) => (
        <div className="flex flex-col gap-4">
          <span className="font-semibold text-gray-800">
            Tienes cambios sin guardar.
            <br />
            <span className="text-xs text-gray-500 font-normal">¿Estás seguro de que deseas salir sin guardar?</span>
          </span>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              Seguir Editando
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setHasChanges(false);
                if (onSuccess) onSuccess();
              }}
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
            >
              Salir sin Guardar
            </button>
          </div>
        </div>
      ), { duration: 6000 });
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const getIconForType = (type) => {
    const slug = (type.slug || type.name || "").toLowerCase();
    if (slug.includes("textarea") || slug.includes("long")) return <FileText size={18} />;
    if (slug.includes("text")) return <Type size={18} />;
    if (slug.includes("email")) return <Mail size={18} />;
    if (slug.includes("number") || slug.includes("numeric")) return <Hash size={18} />;
    if (slug.includes("date")) return <Calendar size={18} />;
    if (slug.includes("file") || slug.includes("image") || slug.includes("upload")) return <Upload size={18} />;
    if (slug.includes("select") || slug.includes("choice") || slug.includes("dropdown") || slug.includes("radio")) return <List size={18} />;
    if (slug.includes("checkbox")) return <CheckSquare size={18} />;
    if (slug.includes("grid")) return <LayoutGrid size={18} />;
    return <Type size={18} />;
  };

  const renderSchemaInput = (key, schema, value, onChange) => {
    const type = typeof schema === 'string' ? schema : schema.type;
    
    const PROPERTY_LABELS = {
      placeholder: "Texto de Ayuda (Placeholder)",
      min: "Valor Mínimo",
      max: "Valor Máximo",
      step: "Incremento (Paso)",
      minlength: "Longitud Mínima",
      maxlength: "Longitud Máxima",
      pattern: "Patrón (Regex)",
      accept: "Tipos de Archivo (ej: .pdf,.jpg)",
      multiple: "Permitir Múltiples Archivos",
      size_limit: "Límite de Tamaño (MB)",
      choices: "Opciones de Respuesta",
      options: "Opciones (Radio/Checkbox)",
      rows: "Filas (o Altura)",
      columns: "Columnas (Configuración)",
      cols: "Ancho (Columnas)",
      min_label: "Etiqueta para el mínimo (ej: Bajo)",
      max_label: "Etiqueta para el máximo (ej: Excelente)",
      src: "URL de la Imagen",
      url: "URL del Video (YouTube)",
      alt: "Texto alternativo (Accesibilidad)",
      default: "Valor por Defecto",
      readonly: "Solo Lectura",
      disabled: "Deshabilitado",
      autofocus: "Enfocar al Inicio",
      autocomplete: "Autocompletar",
      // Estilos para Títulos y Párrafos
      tag: "Etiqueta HTML (h1-h6)",
      color: "Clase de Color (Tailwind)",
      size: "Clase de Tamaño (Tailwind)",
      align: "Alineación (left, center, right)"
    };

    const getPropertyHelp = (key, typeSlug) => {
        const helpMap = {
            placeholder: {
                default: "Texto gris de ejemplo que desaparece al escribir.",
                example: "Ej: Escribe aquí tu respuesta...",
                text: "Ej: Nombre completo",
                email: "Ej: nombre@correo.com",
                phone: "Ej: 300 123 4567",
                number: "Ej: 0",
                url: "Ej: https://sitio.com",
                date: "Ej: Selecciona una fecha"
            },
            min: {
                default: "Valor mínimo permitido.",
                example: "Ej: 0",
                date: "Ej: 2024-01-01"
            },
            max: {
                default: "Valor máximo permitido.",
                example: "Ej: 100",
                date: "Ej: 2025-12-31"
            },
            minlength: { default: "Mínimo caracteres requeridos.", example: "Ej: 3" },
            maxlength: { default: "Máximo caracteres permitidos.", example: "Ej: 255" },
            pattern: { 
                default: "Regex para validación.",
                example: "Ej: [A-Za-z]+",
                phone: "Ej: [0-9]{10}"
            },
            step: { default: "Saltos entre números.", example: "Ej: 1 o 0.5" },
            accept: { default: "Tipos de archivo.", example: "Ej: .pdf,.jpg,.png" },
            multiple: { default: "Permitir múltiples archivos." },
            size_limit: { default: "Límite en MB.", example: "Ej: 5" },
            
            choices: { default: "Opciones del menú.", example: "Ej: Opción 1" },
            options: { default: "Opciones a seleccionar.", example: "Ej: Sí" },
            
            rows: { default: "Filas de la cuadrícula.", example: "Ej: Calidad del Servicio" },
            columns: { default: "Columnas de la cuadrícula.", example: "Ej: Bueno" },
            cols: { default: "Ancho textbox.", example: "Ej: 30" },
            
            min_label: { default: "Etiqueta nivel bajo.", example: "Ej: Malo" },
            max_label: { default: "Etiqueta nivel alto.", example: "Ej: Bueno" },
            
            src: { default: "URL Imagen.", example: "Ej: https://imgur.com/image.jpg" },
            url: { default: "URL YouTube.", example: "Ej: https://youtube.com/watch?v=..." },
            alt: { default: "Descripción Alt.", example: "Ej: Logo de la empresa" },
            
            default: { default: "Valor por defecto.", example: "Ej: N/A" },
            tag: { default: "Etiqueta HTML.", example: "Ej: h2" },
            align: { default: "Alineación.", example: "Ej: center" },
            color: { default: "Clase Color.", example: "Ej: text-blue-500" },
            size: { default: "Clase Tamaño.", example: "Ej: text-xl" }
        };

        const keyLower = key.toLowerCase();
        if (!helpMap[keyLower]) return null;
        
        const config = helpMap[keyLower];
        const specific = config[typeSlug] || config.default;
        // If specific is an object (rarely needed but good for safety), standardise
        return typeof specific === 'string' ? { text: specific, example: config.example || "" } : specific;
    };

    const label = PROPERTY_LABELS[key.toLowerCase()] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const helpData = getPropertyHelp(key, selectedField?.type_slug || 'text');
    const helpText = helpData?.text || helpData; // Handle backward compat if string
    const placeholderText = helpData?.example || (helpData?.text ? `Ej: ${helpData.text}` : `Configurar ${label}`);

    if (type === 'boolean') {
      return (
        <label key={key} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-10 h-5 rounded-full transition-all ${value ? "bg-blue-500" : "bg-gray-200"}`} />
            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all ${value ? "translate-x-5" : ""}`} />
          </div>
          <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-all">{label}</span>
        </label>
      );
    }

    if (type === 'array' || key === 'choices') {
      const choices = Array.isArray(value) ? value : [];
      return (
        <div key={key} className="pt-2">
          <div className="flex justify-between items-center mb-3">
             <label className="block text-xs font-bold text-gray-500 uppercase">{label}</label>
             {helpText && <span title={helpText} className="cursor-help text-xs">💡</span>}
          </div>
          
          <div className="space-y-3">
            {choices.map((choice, cIdx) => (
              <div key={cIdx} className="flex gap-2">
                <input
                  type="text"
                  value={choice.label || ""}
                  placeholder="Texto visible de la opción"
                  onChange={(e) => {
                    const newChoices = [...choices];
                    newChoices[cIdx] = {
                      ...newChoices[cIdx],
                      label: e.target.value,
                      value: choice.value || e.target.value.toLowerCase().replace(/\s+/g, '_')
                    };
                    onChange(newChoices);
                  }}
                  className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                />
                <button
                  onClick={() => onChange(choices.filter((_, i) => i !== cIdx))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => onChange([...choices, { label: "", value: "" }])}
              className="w-full p-2 border border-dashed border-gray-300 text-gray-500 hover:text-blue-500 hover:border-blue-300 rounded-lg text-xs font-semibold transition-all"
            >
              + Añadir Opción
            </button>
            {helpText && (
                <p className="mt-1 text-[10px] text-gray-400 font-medium leading-tight ml-1">
                    💡 {helpText}
                </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={key}>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{label}</label>
        <input
          type={type === 'integer' || type === 'numeric' ? 'number' : 'text'}
          value={value || ""}
          onChange={(e) => onChange(type === 'integer' || type === 'numeric' ? (e.target.value === "" ? "" : parseFloat(e.target.value)) : e.target.value)}
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition-all text-sm"
          style={{ "--tw-ring-color": BRAND.blue }}
          placeholder={placeholderText}
        />
        {helpText && (
            <p className="mt-1.5 text-[10px] text-gray-400 font-medium leading-tight">
                💡 {helpText}
            </p>
        )}
      </div>
    );
  };

  const [activeTab, setActiveTab] = useState("canvas"); // palette, canvas, properties - for mobile
  const selectedField = selectedFieldIndex !== null ? formFields[selectedFieldIndex] : null;

  const editorContent = (
    <div className={`flex flex-col bg-gray-50 overflow-hidden transition-all duration-300 ${
      isFullscreen 
        ? "fixed inset-0 z-[9999] h-screen w-screen" 
        : "h-[calc(100vh-150px)] md:h-[calc(100vh-120px)]"
    }`}>
      {/* Top Header/Actions */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm relative z-20">
        <div className="flex items-center gap-4">
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all mr-2"
            title="Cerrar editor"
          >
            <X size={24} />
          </button>
          <div className="hidden sm:flex items-center gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Settings2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Constructor de Formularios</h2>
              <p className="text-xs text-gray-500">Diseña y estructura tus encuestas técnicas</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2.5 rounded-xl border transition-all ${
              isFullscreen 
                ? "bg-blue-50 text-blue-600 border-blue-200" 
                : "bg-white text-gray-400 border-gray-100 hover:border-blue-100 hover:text-blue-500"
            }`}
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          
          <div className="w-px h-6 bg-gray-100 mx-1 hidden sm:block"></div>

          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 text-sm md:text-base"
          >
            <Save size={18} />
            <span className="hidden sm:inline">{saving ? "Guardando..." : "Guardar Borrador"}</span>
            <span className="sm:hidden">{saving ? "..." : "Borrador"}</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#2C67B0] text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-md text-sm md:text-base"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Publicar</span>
            <span className="sm:hidden">Pub.</span>
          </button>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden flex border-b bg-white">
        <button 
          onClick={() => setActiveTab("palette")}
          className="flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all"
          style={{ 
            color: activeTab === "palette" ? BRAND.blue : "#9ca3af",
            borderBottom: activeTab === "palette" ? `2px solid ${BRAND.blue}` : "none"
          }}
        >
          Elementos
        </button>
        <button 
          onClick={() => setActiveTab("canvas")}
          className="flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all"
          style={{ 
            color: activeTab === "canvas" ? BRAND.blue : "#9ca3af",
            borderBottom: activeTab === "canvas" ? `2px solid ${BRAND.blue}` : "none"
          }}
        >
          Lienzo
        </button>
        <button 
          onClick={() => setActiveTab("properties")}
          className="flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all"
          style={{ 
            color: activeTab === "properties" ? BRAND.blue : "#9ca3af",
            borderBottom: activeTab === "properties" ? `2px solid ${BRAND.blue}` : "none"
          }}
        >
          Propiedades {selectedField && "•"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C67B0]"></div>
               <p className="text-gray-500 font-medium animate-pulse">Cargando formulario...</p>
             </div>
          </div>
        )}

        {/* Left: Element Palette */}
        <div className={`${activeTab === "palette" ? "flex" : "hidden"} md:flex w-full md:w-72 bg-white border-r overflow-y-auto p-4 custom-scrollbar flex-col absolute inset-0 z-10 md:relative`}>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Elementos Disponibles</h3>
          <div className="space-y-2">
            {(Array.isArray(fieldTypes) ? fieldTypes : []).map((type) => (
              <button
                key={type.id || type.slug}
                onClick={() => addField(type)}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 border border-transparent rounded-xl transition-all group hover:opacity-80"
                style={{ 
                  color: "inherit"
                }}
              >
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
                  {getIconForType(type)}
                </div>
                <span className="font-medium text-sm">{type.name}</span>
                <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
            {fieldTypes.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4 italic">Cargando tipos de campos...</p>
            )}
          </div>
        </div>

        {/* Center: Canvas */}
        <div className={`${activeTab === "canvas" ? "block" : "hidden md:block"} flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-gray-100/50`}>
          <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 ring-1 ring-gray-200/50">
              <input
                type="text"
                value={formMeta.title}
                onChange={(e) => {
                  setFormMeta({ ...formMeta, title: e.target.value });
                  markChanged();
                }}
                placeholder="Título del Formulario"
                className="w-full text-2xl md:text-3xl font-bold text-gray-800 placeholder-gray-300 border-none focus:ring-0 mb-2 p-0"
              />
              <div className="space-y-4">
                <div>
                  <textarea
                    value={formMeta.description}
                    onChange={(e) => {
                      setFormMeta({ ...formMeta, description: e.target.value });
                      markChanged();
                    }}
                    placeholder="Descripción o propósito de este formulario..."
                    className="w-full text-sm text-gray-600 placeholder-gray-300 border-none focus:ring-0 resize-none p-0 bg-gray-50/30 rounded-lg"
                    rows={2}
                  />
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-50 flex flex-wrap gap-4 md:gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="font-semibold text-gray-700">Versión:</span>
                  <input
                    type="number"
                    value={formMeta.version}
                    onChange={(e) => {
                      setFormMeta({ ...formMeta, version: parseInt(e.target.value) });
                      markChanged();
                    }}
                    className="w-10 md:w-12 border-none p-0 focus:ring-0 font-medium bg-transparent"
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="font-semibold text-gray-700">Expiración:</span>
                  <input
                    type="date"
                    value={formMeta.expires_at}
                    onChange={(e) => {
                      setFormMeta({ ...formMeta, expires_at: e.target.value });
                      markChanged();
                    }}
                    className="border-none p-0 focus:ring-0 font-medium bg-transparent"
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-500 border-l pl-4 border-gray-100 group relative">
                  <span className="font-semibold text-gray-700">Tipo:</span>
                  <div className="relative flex items-center">
                    <select
                      value={formMeta.category}
                      onChange={(e) => {
                        setFormMeta({ ...formMeta, category: e.target.value });
                        markChanged();
                      }}
                      className="border-none p-0 pr-6 focus:ring-0 font-bold bg-transparent cursor-pointer appearance-none relative z-10"
                      style={{ color: BRAND.blue }}
                    >
                      <option value="encuesta">Encuesta</option>
                      <option value="normativo">Normativo</option>
                      <option value="periodico">Periódico</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-0 pointer-events-none" style={{ color: BRAND.blue }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Field Canvas */}
            <div className="space-y-4">
              {(Array.isArray(formFields) ? formFields : []).map((field, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedFieldIndex(idx);
                    if (window.innerWidth < 768) setActiveTab("properties");
                  }}
                  className={`group relative bg-white p-4 md:p-6 rounded-2xl shadow-sm border transition-all cursor-pointer ${selectedFieldIndex === idx
                    ? "shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  style={{ 
                    borderColor: selectedFieldIndex === idx ? BRAND.blue : undefined,
                    boxShadow: selectedFieldIndex === idx ? `0 0 0 2px ${BRAND.blue}1A` : undefined
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${BRAND.blue}15`, color: BRAND.blue }}>
                        {getIconForType({ slug: field.type_slug, name: field.type_name })}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-tighter" style={{ color: BRAND.blue }}>{field.type_name}</span>
                    </div>
                    <div className="flex gap-1 md:gap-2">
                      <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(idx, 'up');
                          }}
                          disabled={idx === 0}
                          className={`p-1 rounded-md transition-all ${idx === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-blue-500 hover:bg-white hover:shadow-sm'}`}
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(idx, 'down');
                          }}
                          disabled={idx === formFields.length - 1}
                          className={`p-1 rounded-md transition-all ${idx === formFields.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-blue-500 hover:bg-white hover:shadow-sm'}`}
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeField(idx);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base md:text-lg font-semibold text-gray-800">{field.label || "Sin Etiqueta"}</h4>
                  {field.description && <p className="text-sm text-gray-500 mt-1">{field.description}</p>}

                   <div className="mt-4 pointer-events-none opacity-80 overflow-x-auto">
                    {(() => {
                        const slug = field.type_slug || "";
                        const options = field.options || {};
 
                        if (slug === 'grid' || slug === 'checkbox_grid') {
                            const rows = options.rows || ["Fila 1", "Fila 2"];
                            const cols = options.columns || ["Col 1", "Col 2", "Col 3"];
                            return (
                                <div className="min-w-[400px]">
                                    <table className="w-full text-xs text-gray-500">
                                        <thead>
                                            <tr>
                                                <th className="p-2"></th>
                                                {cols.map((c, i) => <th key={i} className="p-2 font-bold text-center">{typeof c === 'string' ? c : (c.label || `Col ${i+1}`)}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((r, ri) => (
                                                <tr key={ri} className={ri % 2 === 0 ? 'bg-gray-50/50' : ''}>
                                                    <td className="p-2 font-medium">{typeof r === 'string' ? r : (r.label || `Fila ${ri+1}`)}</td>
                                                    {cols.map((c, ci) => (
                                                        <td key={ci} className="p-2 text-center">
                                                            <div className={`w-4 h-4 mx-auto border border-gray-300 ${slug === 'grid' ? 'rounded-full' : 'rounded'}`}></div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        }

                        if (slug === 'section') {
                            return (
                                <div className="flex items-center gap-4 py-4">
                                    <div className="h-px bg-blue-200 flex-1 relative">
                                        <div className="absolute right-0 -top-1.5 w-3 h-3 rotate-45 border-t border-r border-blue-200 bg-white"></div>
                                    </div>
                                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Nueva Página</span>
                                    <div className="h-px bg-blue-200 flex-1 relative">
                                        <div className="absolute left-0 -top-1.5 w-3 h-3 -rotate-135 border-t border-r border-blue-200 bg-white"></div>
                                    </div>
                                </div>
                            );
                        }

                        if (slug === 'title') {
                            const Tag = options.tag || 'h2';
                            return (
                                <div className={`text-gray-800 ${options.align === 'center' ? 'text-center' : options.align === 'right' ? 'text-right' : 'text-left'}`}>
                                    {/* Visual preview of the tag size */}
                                    <div className={`font-bold ${Tag === 'h1' ? 'text-3xl' : Tag === 'h3' ? 'text-xl' : 'text-2xl'}`}>
                                        {field.label || "Título de la Sección"}
                                    </div>
                                    {field.description && <p className="text-gray-500 mt-2">{field.description}</p>}
                                </div>
                            );
                        }

                        if (slug === 'image') {
                            return (
                                <div className="flex justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 p-4 min-h-[150px] items-center">
                                    {options.src ? (
                                        <img src={options.src} alt={options.alt || ""} className="max-h-[300px] object-contain rounded-lg shadow-sm" />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Upload className="mx-auto mb-2 opacity-50" size={32} />
                                            <p className="text-xs">Configura la URL de la imagen en propiedades</p>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        if (slug === 'video') {
                            return (
                                <div className="flex justify-center bg-gray-900 rounded-xl overflow-hidden aspect-video items-center relative">
                                    {options.url ? (
                                        <iframe 
                                            width="100%" 
                                            height="100%" 
                                            src={`https://www.youtube.com/embed/${options.url.includes('v=') ? options.url.split('v=')[1].split('&')[0] : options.url.split('/').pop()}`}
                                            title="YouTube video player" 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                            className="absolute inset-0 z-10"
                                        ></iframe>
                                    ) : (
                                        <div className="text-center text-gray-500 z-10 relative">
                                            <div className="w-12 h-12 rounded-full border-2 border-gray-600 flex items-center justify-center mx-auto mb-2">
                                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-gray-600 border-b-[6px] border-b-transparent ml-1"></div>
                                            </div>
                                            <p className="text-xs">Configura la URL de YouTube</p>
                                        </div>
                                    )}
                                    {/* Placeholder background only visible if no video */}
                                    {!options.url && <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50"></div>}
                                </div>
                            );
                        }

                        if (slug === 'linear_scale') {
                            const min = parseInt(options.min || 1);
                            const max = parseInt(options.max || 5);
                            return (
                                <div className="flex items-end justify-between gap-4 pt-4 px-2">
                                    <span className="text-xs font-bold text-gray-400 mb-2">{options.min_label || min}</span>
                                    <div className="flex-1 flex justify-between items-center px-4">
                                        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(val => (
                                            <div key={val} className="flex flex-col items-center gap-2">
                                                <span className="text-xs font-bold text-gray-500">{val}</span>
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 mb-2">{options.max_label || max}</span>
                                </div>
                            );
                        }

                        if (['radio', 'checkbox', 'select'].includes(slug) && (options.options || options.choices)) {
                            const items = options.options || options.choices || [];
                            return (
                                <div className="space-y-2">
                                    {items.length > 0 ? items.map((opt, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg">
                                            {slug === 'checkbox' && <div className="w-4 h-4 rounded border border-gray-300"></div>}
                                            {slug === 'radio' && <div className="w-4 h-4 rounded-full border border-gray-300"></div>}
                                            {slug === 'select' && <div className="text-[10px] text-gray-400 font-bold border border-gray-200 px-1 rounded">1</div>}
                                            <span className="text-sm text-gray-600">{opt.label || `Opción ${i + 1}`}</span>
                                        </div>
                                    )) : (
                                        <div className="text-xs text-red-400 italic bg-red-50 p-2 rounded">
                                            Sin opciones definidas. Añádelas en el panel de propiedades.
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Default Text/Inputs
                        return (
                            <div className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-4 flex items-center text-gray-400 text-sm">
                                {field.placeholder || (slug === 'date' ? 'dd/mm/aaaa' : slug === 'time' ? '--:--' : 'Respuesta...')}
                            </div>
                        );
                    })()}
                  </div>

                  {field.is_required && (
                    <span className="absolute top-4 right-12 text-red-500 text-xs font-bold ring-1 ring-red-100 bg-red-50 px-2 py-0.5 rounded-full">Obligatorio</span>
                  )}
                </div>
              ))}

              {formFields.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center bg-gray-50/50">
                  <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                    <Plus size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400">El lienzo está vacío</h3>
                  <p className="text-sm text-gray-400 max-w-xs mt-2">Usa los elementos de la izquierda para empezar a construir tu formulario técnico.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Properties Panel */}
        <div className={`${activeTab === "properties" ? "flex" : "hidden"} md:flex w-full md:w-80 bg-white border-l overflow-y-auto p-4 md:p-6 custom-scrollbar flex-col absolute inset-0 z-10 md:relative`}>
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Settings2 size={18} className="text-blue-500" />
              Propiedades
            </h3>
            {selectedField && (
              <button onClick={() => setSelectedFieldIndex(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            )}
          </div>

          {selectedField ? (
            <div className="space-y-6">
              {/* General Properties */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Etiqueta del Campo</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedFieldIndex, { label: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition-all text-sm"
                  style={{ "--tw-ring-color": BRAND.blue }}
                />
              </div>

              {/* ID Único (Key) - Hidden to prevent accidental edits */}
              {/* <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ID Único (Key)</label>
                <input
                  type="text"
                  value={selectedField.name}
                  onChange={(e) => updateField(selectedFieldIndex, { name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono"
                />
              </div> */}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Descripción</label>
                <textarea
                  value={selectedField.description}
                  onChange={(e) => updateField(selectedFieldIndex, { description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedField.is_required}
                      onChange={(e) => updateField(selectedFieldIndex, { is_required: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full transition-all ${selectedField.is_required ? "bg-blue-500" : "bg-gray-200"}`} />
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all ${selectedField.is_required ? "translate-x-5" : ""}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-all">Obligatorio</span>
                </label>
              </div>

              {/* Dynamic Schema Properties */}
              {selectedField._schema && (
                <div className="pt-4 border-t space-y-6">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Configuración Técnica</h4>
                  {Object.keys(selectedField._schema).map(key =>
                    renderSchemaInput(
                      key,
                      selectedField._schema[key],
                      selectedField.options?.[key],
                      (val) => updateField(selectedFieldIndex, {
                        options: { ...selectedField.options, [key]: val }
                      })
                    )
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="p-3 bg-gray-50 rounded-2xl mb-4">
                <Settings2 size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">Selecciona un campo en el lienzo para configurar sus propiedades técnicas.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );

  if (isFullscreen) {
    return ReactDOM.createPortal(editorContent, document.body);
  }

  return editorContent;
};

export default FormBuilder;
