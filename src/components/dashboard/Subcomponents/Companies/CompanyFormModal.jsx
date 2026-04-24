import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  X,
  Upload,
  Loader2,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  AlertCircle,
  Save,
  UserPlus,
  Trash2,
  User
} from "lucide-react";
import { createCompany, updateCompany } from "../../../../api/companiesApi";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  lightBlue: "#7FB8D9",  // Azul Claro
  lime: "#B1D357",       // Verde Lima
  green: "#00AB6D",      // Verde Principal
};

const EMPTY_CONTACT = { contact_name: "", email: "", phone: "" };

export default function CompanyFormModal({ companyData, isEditing, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    website_url: "",
    logo: null,
    brochure_file: null
  });
  const [contacts, setContacts] = useState([{ ...EMPTY_CONTACT }]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [brochureFileName, setBrochureFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'clean'],
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'link'
  ];

  useEffect(() => {
    if (companyData) {
      setFormData({
        name: companyData.name || "",
        description: companyData.description || "",
        address: companyData.address || "",
        website_url: companyData.website_url || "",
        logo: null,
        brochure_file: null
      });

      // Show existing brochure filename if we have the url
      if (companyData.brochure_url) {
        setBrochureFileName("Brochure actual (click para reemplazar)");
      } else {
        setBrochureFileName(null);
      }

      // Load contacts from JSON or fallback to legacy fields
      if (companyData.contacts && Array.isArray(companyData.contacts) && companyData.contacts.length > 0) {
        setContacts(companyData.contacts.map(c => ({
          contact_name: c.contact_name || "",
          email: c.email || "",
          phone: c.phone || ""
        })));
      } else if (companyData.phone || companyData.email) {
        // Fallback: use legacy phone/email fields
        setContacts([{
          contact_name: "",
          email: companyData.email || "",
          phone: companyData.phone || ""
        }]);
      } else {
        setContacts([{ ...EMPTY_CONTACT }]);
      }

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

  // --- Contact Handlers ---
  const handleContactChange = (index, field, value) => {
    setContacts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addContact = () => {
    setContacts(prev => [...prev, { ...EMPTY_CONTACT }]);
  };

  const removeContact = (index) => {
    if (contacts.length <= 1) return; // Must keep at least one
    setContacts(prev => prev.filter((_, i) => i !== index));
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

  const handleBrochureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrors(prev => ({ ...prev, brochure_file: "Solo se permiten PDF o imágenes" }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, brochure_file: "El archivo debe ser menor a 10MB" }));
        return;
      }
      setFormData(prev => ({ ...prev, brochure_file: file }));
      setBrochureFileName(file.name);
      if (errors.brochure_file) {
        setErrors(prev => ({ ...prev, brochure_file: "" }));
      }
    }
  };

  const removeBrochure = () => {
    setFormData(prev => ({ ...prev, brochure_file: null }));
    setBrochureFileName(companyData?.brochure_url ? "Brochure actual eliminado. Guarde para confirmar." : null);
    setErrors(prev => ({ ...prev, brochure_file: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.description.trim()) newErrors.description = "La descripción es requerida";
    if (formData.website_url && !formData.website_url.match(/^(https?:\/\/)?(www\.)?[\w-]+\.[\w-]+/)) newErrors.website_url = "Ingresa una URL válida";

    // Validate contacts
    contacts.forEach((contact, index) => {
      if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        newErrors[`contact_email_${index}`] = "Email no válido";
      }
    });

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
      if (formData.address) submitData.append('address', formData.address);
      if (formData.website_url) submitData.append('website_url', formData.website_url);
      if (formData.logo) submitData.append('logo', formData.logo);
      if (formData.brochure_file) submitData.append('brochure_file', formData.brochure_file);

      // Send contacts as JSON string
      const validContacts = contacts.filter(c => c.contact_name || c.email || c.phone);
      submitData.append('contacts', JSON.stringify(validContacts));

      // Also send primary email/phone for backward compat
      if (validContacts.length > 0) {
        if (validContacts[0].email) submitData.append('email', validContacts[0].email);
        if (validContacts[0].phone) submitData.append('phone', validContacts[0].phone);
      }

      if (isEditing && companyData) {
        await updateCompany(companyData.id, submitData);
      } else {
        await createCompany(submitData);
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
  const inputClass = `w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm`;
  const inputWithIconClass = `${inputClass} pl-10`;
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-[#2C67B0] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100" style={{ backgroundColor: BRAND.blue }}>
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="mt-0.5" size={16} />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* === COLUMNA IZQUIERDA: Identidad Corporativa === */}
            <div className="lg:col-span-2 space-y-6">
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

                  {/* Name, Description & Brochure */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className={labelClass}>Nombre Comercial <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Ej: EcoEmpresa S.A.S"
                          className={inputWithIconClass}
                          style={{ borderColor: errors.name ? BRAND.green : '' }}
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.name}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>Descripción <span className="text-red-500">*</span></label>
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                        <ReactQuill
                          theme="snow"
                          value={formData.description}
                          onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="Breve descripción de la actividad económica..."
                        />
                      </div>
                      {errors.description && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.description}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>Portafolio / Brochure</label>
                      <div className="relative">
                        {brochureFileName ? (
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="text-gray-400 flex-shrink-0" size={16} />
                              <span className="text-sm text-gray-700 truncate font-medium">{brochureFileName}</span>
                            </div>
                            <button
                              type="button"
                              onClick={removeBrochure}
                              className="p-1 hover:bg-gray-200 rounded-md text-red-500 transition-colors"
                              title="Remover Brochure"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer relative group">
                            <input
                              type="file"
                              accept="application/pdf,image/*"
                              onChange={handleBrochureChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center gap-2 text-gray-500 group-hover:text-blue-600 transition-colors">
                              <Upload size={16} />
                              <span className="text-sm font-medium">Subir PDF o Imagen (Máx 10MB)</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.brochure_file && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.brochure_file}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* === SECCIÓN: Contactos (dinámica) === */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <User size={16} style={{ color: BRAND.lime }} /> Personas de Contacto
                  </h3>
                  <button
                    type="button"
                    onClick={addContact}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:shadow-sm"
                    style={{ backgroundColor: `${BRAND.lime}20`, color: BRAND.green }}
                  >
                    <UserPlus size={14} />
                    Agregar Contacto
                  </button>
                </div>

                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-50 p-4 rounded-xl border border-gray-100 group hover:border-blue-100 transition-colors"
                    >
                      {/* Contact number badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Contacto {index + 1}
                        </span>
                        {contacts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeContact(index)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Eliminar contacto"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Contact Name */}
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Nombre</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                            <input
                              type="text"
                              value={contact.contact_name}
                              onChange={(e) => handleContactChange(index, "contact_name", e.target.value)}
                              placeholder="Juan Pérez"
                              className={`${inputClass} pl-9 text-xs py-2`}
                            />
                          </div>
                        </div>

                        {/* Contact Email */}
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                            <input
                              type="email"
                              value={contact.email}
                              onChange={(e) => handleContactChange(index, "email", e.target.value)}
                              placeholder="contacto@empresa.com"
                              className={`${inputClass} pl-9 text-xs py-2`}
                              style={{ borderColor: errors[`contact_email_${index}`] ? BRAND.orange : '' }}
                            />
                          </div>
                          {errors[`contact_email_${index}`] && (
                            <p className="mt-0.5 text-[10px] text-orange-500 font-medium">{errors[`contact_email_${index}`]}</p>
                          )}
                        </div>

                        {/* Contact Phone */}
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Teléfono</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                            <input
                              type="tel"
                              value={contact.phone}
                              onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                              placeholder="+57 300 123 4567"
                              className={`${inputClass} pl-9 text-xs py-2`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* === COLUMNA DERECHA: Ubicación y Web === */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
                  <Globe size={16} style={{ color: BRAND.blue }} /> Ubicación y Web
                </h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div>
                    <label className={labelClass}>Dirección Física</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Calle 123 # 45-67, Ciudad"
                        className={inputWithIconClass}
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label className={labelClass}>Sitio Web</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        placeholder="https://www.empresa.com"
                        className={inputWithIconClass}
                        style={{ borderColor: errors.website_url ? BRAND.green : '' }}
                      />
                    </div>
                    {errors.website_url && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.website_url}</p>}
                  </div>
                </div>
              </div>

              {/* Info card */}
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
                    <AlertCircle size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-800 mb-1">Contactos Múltiples</p>
                    <p className="text-[11px] text-blue-600 leading-relaxed">
                      Puedes agregar varios contactos para cada empresa. Cada contacto puede tener nombre, email y teléfono.
                    </p>
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
      <style>{`
        .ql-container {
          min-height: 120px;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 120px;
          font-size: 0.875rem;
        }
      `}</style>
    </div>,
    document.body
  );
}