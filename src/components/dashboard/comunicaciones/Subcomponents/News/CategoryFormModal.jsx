import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Save, Tag, AlertCircle, FileText } from "lucide-react";
import { createCategory, updateCategory } from "../../../../../api/categoriesApi";

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

export default function CategoryFormModal({ categoryData, isEditing, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && categoryData) {
      setFormData({
        name: categoryData.name || "",
        description: categoryData.description || "",
      });
    }
  }, [categoryData, isEditing]);

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
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSend = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      if (isEditing && categoryData?.id) {
        await updateCategory(categoryData.id, dataToSend);
      } else {
        await createCategory(dataToSend);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving category:", err);
      if (err.response?.data?.message) {
        // console.error("Server error:", err.response.data.message);
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
      // alert(`Error: ${errorMessage}`); // Alert removed for cleaner UX, errors handled inline if possible or via toast in parent
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const inputClass = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${errors.name ? "border-orange-300" : "border-gray-200"}`;
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-[#005380] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col">

        {/* Header con Azul Profundo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100" style={{ backgroundColor: BRAND.darkBlue }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg text-white">
              <Tag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <p className="text-blue-200 text-xs mt-0.5">Definición de etiquetas</p>
            </div>
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
        <form onSubmit={handleSubmit} className="p-8 bg-gray-50">
          <div className="space-y-6">

            {/* Name Input */}
            <div>
              <label className={labelClass}>Nombre <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Tecnología, Medio Ambiente"
                className={inputClass}
                style={{
                  "--tw-ring-color": BRAND.lightBlue,
                  borderColor: errors.name ? BRAND.orange : ''
                }}
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium flex items-center gap-1" style={{ color: BRAND.orange }}>
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label className={labelClass}>Descripción <span className="text-red-500">*</span></label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Breve descripción del propósito de esta categoría..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                  style={{
                    "--tw-ring-color": BRAND.lightBlue,
                    borderColor: errors.description ? BRAND.orange : ''
                  }}
                  disabled={loading}
                />
                <FileText className="absolute right-3 top-3 text-gray-400" size={16} />
              </div>
              {errors.description && (
                <p className="mt-1 text-xs font-medium flex items-center gap-1" style={{ color: BRAND.orange }}>
                  <AlertCircle size={12} /> {errors.description}
                </p>
              )}
            </div>

          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition font-medium text-sm"
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
                {isEditing ? "Actualizar" : "Crear"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}