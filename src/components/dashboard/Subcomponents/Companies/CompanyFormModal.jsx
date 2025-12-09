import React, { useState, useEffect } from "react";
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  AlertCircle,
  Save
} from "lucide-react";
import { createCompany, updateCompany } from "../../../../api/companiesApi";

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

export default function CompanyFormModal({ companyData, isEditing, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    email: "",
    website_url: "",
    logo: null
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (companyData) {
      setFormData({
        name: companyData.name || "",
        description: companyData.description || "",
        phone: companyData.phone || "",
        address: companyData.address || "",
        email: companyData.email || "",
        website_url: companyData.website_url || "",
        logo: null
      });
      
      if (companyData.logo && companyData.logo.url) {
        setLogoPreview(companyData.logo.url);
      }
    }
  }, [companyData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, logo: "Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: "El archivo debe ser menor a 5MB" }));
        return;
      }
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onload = (e) => { setLogoPreview(e.target.result); };
      reader.readAsDataURL(file);
      if (errors.logo) {
        setErrors(prev => ({ ...prev, logo: "" }));
      }
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    setLogoPreview(null);
    setErrors(prev => ({ ...prev, logo: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.description.trim()) newErrors.description = "La descripción es requerida";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "El email no tiene un formato válido";
    if (formData.website_url && !formData.website_url.match(/^(https?:\/\/)?(www\.)?[\w\-]+\.[\w\-]+/)) newErrors.website_url = "Ingresa una URL válida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      if (formData.phone) submitData.append('phone', formData.phone);
      if (formData.address) submitData.append('address', formData.address);
      if (formData.email) submitData.append('email', formData.email);
      if (formData.website_url) submitData.append('website_url', formData.website_url);
      if (formData.logo) submitData.append('logo', formData.logo);

      let result;
      if (isEditing && companyData) {
        result = await updateCompany(companyData.id, submitData);
      } else {
        result = await createCompany(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving company:", error);
      setErrors({ submit: error.response?.data?.message || "Error al guardar la empresa" });
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const inputClass = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm pl-10`;
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 z-50 bg-[#005380] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        
        {/* Header con Azul Profundo */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100" style={{ backgroundColor: BRAND.darkBlue }}>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-lg text-white">
                <Building size={20} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? "Editar Empresa" : "Nueva Empresa"}
                </h2>
                <p className="text-blue-200 text-xs mt-0.5">Gestión de aliados estratégicos</p>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="space-y-8">
            
            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="mt-0.5" size={16} />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* SECCIÓN 1: Identidad */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
                <FileText size={16} style={{ color: BRAND.blue }} /> Identidad Corporativa
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Logo Upload */}
                 <div className="md:col-span-1">
                    <label className={labelClass}>Logotipo</label>
                    
                    {logoPreview ? (
                      <div className="relative group">
                        <div className="w-full aspect-square bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                           <img src={logoPreview} alt="Preview" className="max-w-full max-h-full object-contain p-2" />
                        </div>
                        <button type="button" onClick={removeLogo} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-transform hover:scale-110">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl aspect-square flex flex-col items-center justify-center text-center p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all group cursor-pointer relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="p-3 bg-blue-50 rounded-full text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                           <Upload size={20} />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Subir Logo</p>
                        <p className="text-[10px] text-gray-400 mt-1">PNG, JPG (Máx 5MB)</p>
                      </div>
                    )}
                    {errors.logo && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.logo}</p>}
                 </div>

                 {/* Name & Description */}
                 <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className={labelClass}>Nombre Comercial *</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Ej: EcoEmpresa S.A.S"
                          className={inputClass}
                          style={{ borderColor: errors.name ? BRAND.orange : '' }}
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.name}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>Descripción *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm resize-none"
                        style={{ "--tw-ring-color": BRAND.lightBlue, borderColor: errors.description ? BRAND.orange : '' }}
                        placeholder="Breve descripción de la actividad económica..."
                      />
                      {errors.description && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.description}</p>}
                    </div>
                 </div>
              </div>
            </div>

            {/* SECCIÓN 2: Contacto */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
                <MapPin size={16} style={{ color: BRAND.green }} /> Información de Contacto
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 
                 {/* Email */}
                 <div>
                    <label className={labelClass}>Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contacto@empresa.com"
                        className={inputClass}
                        style={{ borderColor: errors.email ? BRAND.orange : '' }}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.email}</p>}
                 </div>

                 {/* Phone */}
                 <div>
                    <label className={labelClass}>Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+57 300 123 4567"
                        className={inputClass}
                      />
                    </div>
                 </div>

                 {/* Website */}
                 <div>
                    <label className={labelClass}>Sitio Web</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>
                      <input
                        type="url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        placeholder="https://www.empresa.com"
                        className={inputClass}
                        style={{ borderColor: errors.website_url ? BRAND.orange : '' }}
                      />
                    </div>
                    {errors.website_url && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.website_url}</p>}
                 </div>

                 {/* Address */}
                 <div>
                    <label className={labelClass}>Dirección Física</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Calle 123 # 45-67"
                        className={inputClass}
                      />
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
                <Loader2 className="animate-spin h-4 w-4" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditing ? "Actualizar Empresa" : "Crear Empresa"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}