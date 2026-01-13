import React, { useState, useEffect } from "react";
import {
  Building2, MapPin, Phone, Mail, ExternalLink, X,
  Globe, Tag, ChevronRight
} from "lucide-react";
import { getAllCompanies } from "../../api/companiesApi";
import { motion } from 'framer-motion';

export default function DirectorySection({ selectedRegion, user }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // --- Helpers ---
  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "EM";
  };

  // --- Datos Legacy ---
  const legacyCompanies = [
    {
      id: "legacy-1",
      name: "Apropet S.A.S.",
      address: "Bogotá, Cundinamarca",
      region: "Andina",
      description: "Empresa especializada en resina PET reciclada.",
      phone: "+57 310 2890349",
      email: "info@apropet.com",
      website_url: "https://www.apropet.com",
      logo: { url: "https://via.placeholder.com/300x200?text=Apropet" }
    }
  ];

  // --- Carga de Datos ---
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCompanies(1, 50);

      let companiesArray = [];
      if (response?.data?.items && Array.isArray(response.data.items)) {
        companiesArray = response.data.items;
      } else if (response?.data && Array.isArray(response.data)) {
        companiesArray = response.data;
      } else {
        companiesArray = [];
      }
      setCompanies(companiesArray);
    } catch (err) {
      console.error("Error loading companies:", err);
      setError("No pudimos conectar con el directorio. Mostrando datos locales.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
  };

  const displayCompanies = companies.length > 0 ? companies : legacyCompanies;
  let filteredCompanies = displayCompanies;

  if (selectedRegion && selectedRegion.nombre) {
    filteredCompanies = displayCompanies.filter((e) =>
      !e.region || e.region === selectedRegion.nombre
    );
  }



  if (!user) return null;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#00AB6D] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#1E305D] font-medium animate-pulse">Cargando directorio...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          

          {error && (
            <div className="mb-8 p-4 bg-orange-50 border-l-4 border-orange-400 text-orange-700 rounded-r-lg">
              <p>{error}</p>
            </div>
          )}

          {/* Grid de Tarjetas */}
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCompanies.map((company, idx) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleCompanyClick(company)}
                  className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-white/30 bg-white hover:border-[#00AB6D]/50 flex flex-col h-full"
                >
                  {/* Logo */}
                  <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden p-4 border-b border-gray-200 group-hover:from-[#00AB6D]/10 group-hover:to-[#2C67B0]/10 transition-all relative">
                    {company.logo?.url ? (
                      <img
                        src={company.logo.url}
                        alt={company.name}
                        className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    {/* Fallback Logo */}
                    <div
                      className="w-16 h-16 rounded-full bg-white/80 text-gray-400 flex items-center justify-center font-bold text-xl shadow-sm"
                      style={{ display: company.logo?.url ? 'none' : 'flex' }}
                    >
                      {getInitials(company.name)}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-bold text-[#1E305D] text-lg mb-2 line-clamp-2 group-hover:text-[#00AB6D] transition-colors">
                      {company.name}
                    </h4>

                    {/* Ubicación */}
                    <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
                      <p className="flex items-start gap-1.5">
                        <MapPin size={14} className="text-[#00AB6D] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{company.address || company.region || "Ubicación no disponible"}</span>
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 mb-4 flex-grow leading-relaxed">
                      {company.description || "Sin descripción disponible."}
                    </p>

                    <button className="w-full bg-gradient-to-r from-[#00AB6D] to-[#008A5C] hover:from-[#009B5F] hover:to-[#007A4E] text-white font-bold py-2.5 rounded-lg text-xs transition-all duration-300 hover:shadow-lg mt-auto flex items-center justify-center gap-2">
                      Ver Detalles <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
              <Building2 className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No se encontraron empresas.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- MODAL (Mantenido igual funcionalmente, ligeros ajustes visuales si necesario) --- */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E305D]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header Modal */}
            <div className="w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 relative border-b border-gray-100">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full text-gray-600 transition-colors z-10 shadow-sm"
              >
                <X size={20} />
              </button>

              {selectedCompany.logo?.url ? (
                <img
                  src={selectedCompany.logo.url}
                  alt={selectedCompany.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white text-gray-400 flex items-center justify-center font-bold text-2xl shadow-md">
                  {getInitials(selectedCompany.name)}
                </div>
              )}
            </div>

            {/* Title Bar */}
            <div className="p-5 text-center border-b border-gray-50">
              <h2 className="text-2xl font-bold text-[#1E305D]">
                {selectedCompany.name}
              </h2>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar bg-white">

              <div className="mb-6">
                <h3 className="text-[#1E305D] font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Tag size={16} className="text-[#00AB6D]" />
                  Descripción
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed p-4 bg-gray-50 rounded-xl border border-gray-100">
                  {selectedCompany.description || "Sin descripción detallada."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Contacto */}
                <div className="space-y-3">
                  <h4 className="text-gray-900 font-bold text-sm border-b pb-1 mb-2">Contacto</h4>

                  {selectedCompany.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Phone size={14} />
                      </div>
                      <a href={`tel:${selectedCompany.phone}`} className="text-sm text-gray-700 hover:text-blue-600 font-medium">
                        {selectedCompany.phone}
                      </a>
                    </div>
                  )}

                  {selectedCompany.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <Mail size={14} />
                      </div>
                      <a href={`mailto:${selectedCompany.email}`} className="text-sm text-gray-700 hover:text-indigo-600 font-medium break-all">
                        {selectedCompany.email}
                      </a>
                    </div>
                  )}

                  {selectedCompany.website_url && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                        <Globe size={14} />
                      </div>
                      <a
                        href={selectedCompany.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-teal-600 font-medium hover:underline flex items-center gap-1"
                      >
                        Visitar Sitio Web <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Ubicación */}
                <div>
                  <h4 className="text-gray-900 font-bold text-sm border-b pb-1 mb-2">Ubicación</h4>

                  {selectedCompany.address ? (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <MapPin className="text-red-500 mt-1 flex-shrink-0" size={16} />
                      <p className="text-sm text-gray-700 font-medium">{selectedCompany.address}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic">Ubicación no especificada</p>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-[#1E305D] text-white rounded-lg font-bold hover:bg-[#152347] transition shadow-md text-sm"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}