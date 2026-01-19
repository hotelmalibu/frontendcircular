import React, { useState, useEffect } from "react";
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
  Upload
} from "lucide-react";

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
  { name: 'Carga de Archivo', slug: 'file', description: 'Carga de archivos', component: 'file-input' },
  { name: 'Área de Texto', slug: 'textarea', description: 'Texto multilínea', component: 'textarea-input' }
];

const FormBuilder = ({ formId, onSuccess }) => {
  const [formMeta, setFormMeta] = useState({
    title: "",
    description: "",
    version: 1,
    expires_at: "",
    metadata: {
      category: "general",
    }
  });
  const [formFields, setFormFields] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

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
          const form = response.data || response;
          
          setFormMeta({
            title: form.title || "",
            description: form.description || "",
            version: form.version || 1,
            expires_at: form.expires_at ? form.expires_at.split('T')[0] : "",
            metadata: form.metadata || { category: "" }
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
  };

  const removeField = (index) => {
    const newFields = formFields.filter((_, i) => i !== index);
    setFormFields(newFields.map((f, i) => ({ ...f, order: i + 1 })));
    setSelectedFieldIndex(null);
  };

  const updateField = (index, updates) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], ...updates };
    setFormFields(newFields);
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
    return <Type size={18} />;
  };

  const renderSchemaInput = (key, schema, value, onChange) => {
    const type = typeof schema === 'string' ? schema : schema.type;
    
    const PROPERTY_LABELS = {
      placeholder: "Texto de Ayuda (Placeholder)",
      min: "Valor Mínimo",
      max: "Valor Máximo",
      step: "Incremento (Paso)",
      rows: "Altura (Filas)",
      cols: "Ancho (Columnas)",
      minlength: "Longitud Mínima",
      maxlength: "Longitud Máxima",
      pattern: "Patrón (Regex)",
      accept: "Tipos de Archivo (ej: .pdf,.jpg)",
      multiple: "Permitir Múltiples Archivos",
      size_limit: "Límite de Tamaño (MB)",
      choices: "Opciones de Selección",
      options: "Opciones",
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

    const label = PROPERTY_LABELS[key.toLowerCase()] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

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
          <label className="block text-xs font-bold text-gray-500 uppercase mb-3">{label}</label>
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
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          placeholder={`Ingrese ${label.toLowerCase()}`}
        />
      </div>
    );
  };

  const [activeTab, setActiveTab] = useState("canvas"); // palette, canvas, properties - for mobile
  const selectedField = selectedFieldIndex !== null ? formFields[selectedFieldIndex] : null;

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] md:h-[calc(100vh-120px)] bg-gray-50 overflow-hidden">
      {/* Top Header/Actions */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Settings2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Constructor de Formularios</h2>
            <p className="text-xs text-gray-500">Diseña y estructura tus encuestas técnicas</p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3">
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
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#004b72] text-white rounded-xl hover:bg-[#003a58] transition-all font-semibold shadow-md text-sm md:text-base"
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
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === "palette" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
        >
          Elementos
        </button>
        <button 
          onClick={() => setActiveTab("canvas")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === "canvas" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
        >
          Lienzo
        </button>
        <button 
          onClick={() => setActiveTab("properties")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === "properties" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
        >
          Propiedades {selectedField && "•"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004b72]"></div>
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
                className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-100 rounded-xl transition-all group"
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
                onChange={(e) => setFormMeta({ ...formMeta, title: e.target.value })}
                placeholder="Título del Formulario"
                className="w-full text-2xl md:text-3xl font-bold text-gray-800 placeholder-gray-300 border-none focus:ring-0 mb-2 p-0"
              />
              <div className="space-y-4">
                <div>
                  <textarea
                    value={formMeta.description}
                    onChange={(e) => setFormMeta({ ...formMeta, description: e.target.value })}
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
                    onChange={(e) => setFormMeta({ ...formMeta, version: parseInt(e.target.value) })}
                    className="w-10 md:w-12 border-none p-0 focus:ring-0 font-medium bg-transparent"
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="font-semibold text-gray-700">Expira:</span>
                  <input
                    type="date"
                    value={formMeta.expires_at}
                    onChange={(e) => setFormMeta({ ...formMeta, expires_at: e.target.value })}
                    className="border-none p-0 focus:ring-0 font-medium bg-transparent"
                  />
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
                    ? "border-blue-500 ring-2 ring-blue-500/10 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-500 bg-blue-50 p-1.5 rounded-lg">
                        {getIconForType({ slug: field.type_slug, name: field.type_name })}
                      </div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-tighter">{field.type_name}</span>
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

                  <div className="mt-4 pointer-events-none opacity-50">
                    <div className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-4 flex items-center text-gray-400 text-sm">
                      {field.placeholder || "Muestra de campo..."}
                    </div>
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
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
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
};

export default FormBuilder;
