import React from "react";
import ReactDOM from "react-dom";
import { X, Edit, Phone, Mail, Globe, MapPin, Package, Clock, ExternalLink, Building } from "lucide-react";

export default function CompanyDetailModal({ companyData, onClose, onEdit }) {
  if (!companyData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Detalles de la Empresa</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Edit size={16} />
              Editar
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Company Logo and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              {companyData.logo && companyData.logo.url ? (
                <img
                  src={companyData.logo.url}
                  alt={`Logo de ${companyData.name}`}
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-32 h-32 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center ${companyData.logo && companyData.logo.url ? 'hidden' : ''}`}
              >
                <Building className="text-gray-400" size={40} />
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {companyData.name}
              </h1>

              <div className="space-y-3">
                {/* Created Date */}
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={16} />
                  <span className="text-sm">
                    Creada el {formatDate(companyData.created_at)}
                  </span>
                </div>

                {/* Last Updated */}
                {companyData.updated_at && companyData.updated_at !== companyData.created_at && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={16} />
                    <span className="text-sm">
                      Última actualización: {formatDate(companyData.updated_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {companyData.description || "Sin descripción disponible"}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contacts List */}
              {companyData.contacts && companyData.contacts.length > 0 && (
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Contactos de la Empresa</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {companyData.contacts.map((contact, index) => (
                      <div key={index} className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                              {contact.contact_name ? contact.contact_name.charAt(0).toUpperCase() : 'C'}
                           </div>
                           <div>
                              <div className="font-bold text-gray-900 leading-tight">{contact.contact_name || 'Sin nombre'}</div>
                              <div className="text-xs text-gray-500">Contacto {index + 1}</div>
                           </div>
                        </div>
                        
                        <div className="space-y-2 pl-1">
                          {contact.phone && (
                            <div className="flex items-center gap-2.5 text-sm text-gray-600 group">
                              <div className="p-1.5 bg-green-50 rounded-md text-green-600 group-hover:bg-green-100 transition-colors">
                                <Phone size={14} />
                              </div>
                              <span className="font-medium">{contact.phone}</span>
                            </div>
                          )}
                          
                          {contact.email && (
                            <div className="flex items-center gap-2.5 text-sm text-gray-600 group">
                              <div className="p-1.5 bg-blue-50 rounded-md text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <Mail size={14} /> 
                              </div>
                              <a href={`mailto:${contact.email}`} className="hover:text-blue-700 hover:underline transition-colors truncate font-medium">
                                {contact.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Website */}
              {companyData.website_url && (
                <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sitio Web</p>
                    <a
                      href={companyData.website_url.startsWith('http') ? companyData.website_url : `https://${companyData.website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      {companyData.website_url.replace(/^https?:\/\//, '')}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )}

              {/* Address */}
              {companyData.address && (
                <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-medium text-gray-900">{companyData.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products */}
          {companyData.products && companyData.products.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Package size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Productos ({companyData.products.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyData.products.map((product, index) => (
                  <div key={product.id || index} className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    {product.created_at && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>Creado el {formatDate(product.created_at)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}