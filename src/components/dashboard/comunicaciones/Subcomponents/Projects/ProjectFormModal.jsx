import React, { useState, useEffect, useRef } from "react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { X, Save, User, Tag, AlertCircle } from "lucide-react";
import { createProject, updateProject } from "../../../../../api/projectsApi";


export default function ProjectFormModal({ projectData, isEditing, onClose, onSuccess }) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const hasInitialized = useRef(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    author: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // Project-specific categories (matching the image mapping)
  const projectCategories = [
    { id: "fortalecimiento", name: "Fortalecimiento" },
    { id: "innovacion", name: "Innovacion" },
    { id: "sensibilizacion", name: "Sensibilizacion" },
    { id: "investigacion", name: "Investigacion" },
    { id: "produccion", name: "Produccion" },
    { id: "economia", name: "Economia" },
  ];

  useEffect(() => {
    if (isEditing && projectData) {
      setFormData({
        title: projectData.title || "",
        description: projectData.description || "",
        category: projectData.category || "",
        author: projectData.author || "",
      });
    }
  }, [projectData, isEditing]);

  // Initialize CKEditor manually into the container with id project-description-editor
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

  // Keep editor content in sync with formData.description
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let descriptionContent = formData.description;
      if (editorInstanceRef.current) {
        const editorContent = editorInstanceRef.current.getData();
        if (editorContent !== descriptionContent) {
          descriptionContent = editorContent;
        }
      }

      const dataToSend = {
        title: formData.title,
        description: descriptionContent || "",
        category: formData.category || "",
        author: formData.author || "",
      };

      if (isEditing && projectData?.id) {
        await updateProject(projectData.id, dataToSend);
        alert("Proyecto actualizado exitosamente");
      } else {
        await createProject(dataToSend);
        alert("Proyecto creado exitosamente");
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving project:", err);

      let errorMessage = "Error al crear el proyecto";
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
      }

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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-green-600 to-green-700">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}
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
                placeholder="Ingrese el título del proyecto"
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
                  <option value="">
                    -- Seleccione categoría --
                  </option>
                  {projectCategories.map((category) => (
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
                {isEditing ? "Actualizar" : "Crear"} Proyecto
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}