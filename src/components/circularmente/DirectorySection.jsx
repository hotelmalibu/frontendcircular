import React, { useState, useEffect } from "react";
// Se mantienen los iconos y se añade Zap para un detalle visual
import { Building2, MapPin, Leaf, Phone, Mail, ExternalLink, X, Tag, Globe, Zap } from "lucide-react"; 
// Importa la función de la API para cargar datos
import { getAllCompanies } from "../../api/companiesApi";

export default function DirectorySection({ selectedRegion, user }) {
  // --- Estados del Componente ---
  const [companies, setCompanies] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // --- Datos de reserva (Legacy/Fallback) ---
  const legacyCompanies = [
    {
      id: 1,
      name: "Apropet S.A.S.",
      address: "Bogotá, Cundinamarca",
      region: "Andina", 
      materiales: "Resina PET reciclada, Plástico Grado Alimenticio", 
      phone: "+57 310 2890349",
      email: "info@apropet.com",
      website_url: "https://www.apropet.com", 
      tipo: "Transformadora",
      description: "Empresa especializada en resina PET reciclada y escamas de PET, contribuyendo a la economía circular con enfoque en envases.",
      logo: { url: "https://via.placeholder.com/64x64/00AB6D/FFFFFF?text=AP" },
      products: [{ id: 1, name: "Escamas de PET" }, { id: 2, name: "Gránulos de PET" }]
    },
    {
      id: 2,
      name: "ArtePop Reciclajes",
      address: "Bogotá, D.C.",
      region: "Andina",
      materiales: "Materiales posindustriales, Plásticos mixtos (PE/PP)",
      phone: "+57 301 2293490",
      email: "contacto@artepop.com",
      website_url: "https://www.artepop.co",
      tipo: "Transformadora",
      description: "Líder en la transformación de residuos plásticos posindustriales en nuevos productos de alta calidad para la construcción.",
      logo: null,
      products: [{ id: 3, name: "Láminas Plásticas" }, { id: 4, name: "Madera Plástica" }]
    },
    {
      id: 3,
      name: "EcoEmpresa S.A.S",
      address: "Carrera 15 #93-07, Bogotá, Colombia",
      region: "Andina",
      materiales: "Gestión integral de residuos, Sostenibilidad ambiental",
      phone: "+57 300 123 4567",
      email: "contacto1@ecoempresa.com",
      website_url: "https://www.ecoempresa.com",
      tipo: "Consultoría",
      description: "Empresa dedicada a la gestión integral de residuos y sostenibilidad ambiental, ofreciendo soluciones para grandes industrias.",
      logo: { url: "https://api-ecocircular.creativostecnologicosit.com/storage/companies/logos/COMP692914ed0084a.jpeg" },
      products: []
    }
  ];

  // --- Lógica de Carga de Datos (Mantenida) ---

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
      } else if (response?.data?.companies && Array.isArray(response.data.companies)) {
        companiesArray = response.data.companies;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        companiesArray = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        companiesArray = response.data;
      } else if (Array.isArray(response)) {
        companiesArray = response;
      }

      setCompanies(companiesArray);
    } catch (err) {
      console.error("Error loading companies:", err);
      setError("Error al cargar las empresas. Mostrando datos de reserva.");
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Interacción y Filtro (Mantenida) ---
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
  let sectionTitle = "Directorio de Empresas Circulares";
    
  if (selectedRegion && selectedRegion.nombre) {
    filteredCompanies = displayCompanies.filter((e) => e.region === selectedRegion.nombre);
    sectionTitle = `Empresas en la Región ${selectedRegion.nombre}`;
  }

  // --- Verificación de Autenticación (Solo usuarios logueados pueden ver las empresas) ---
  if (!user) {
    return null;
  }

  // --- Estados de Carga y Error (Mantenido) ---
  if (loading) {
     return (
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#F5F7FA] to-[#E8F0F7]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#00AB6D]"></div>
            <p className="mt-4 text-[#1E305D] font-medium text-lg">Cargando directorio de empresas...</p>
          </div>
        </div>
      </section>
    );
  }

  // --- Renderizado Principal (Sección de Empresas) ---

  return (
    <>
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#F5F7FA] to-[#E8F0F7]">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-7 h-7 text-[#00AB6D]" />
              <h2 className="text-4xl font-extrabold text-[#1E305D]">
                {sectionTitle}
              </h2>
            </div>
            <p className="text-gray-600 text-lg">
              {filteredCompanies.length} empresa{filteredCompanies.length !== 1 ? "s" : ""} {selectedRegion ? "disponible(s) en esta región" : "disponible(s)"}
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium flex items-center gap-2">
                ⚠️ **Error al cargar**: {error}
              </div>
            )}
          </div>

          {/* Grid de Empresas */}
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
              {filteredCompanies.map((company) => (
                // Diseño de Tarjeta Mejorado
                <div
                  key={company.id}
                  className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-2xl hover:border-[#00AB6D] transition-all duration-300 group cursor-pointer flex flex-col h-full"
                  onClick={() => handleCompanyClick(company)}
                >
                  
                  {/* Company Logo and Header */}
                  <div className="flex items-start gap-4 mb-3 pb-3 border-b border-gray-100">
                    {/* Logo/Fallback */}
                    <div className="flex-shrink-0">
                      {company.logo?.url ? (
                        <img
                          src={company.logo.url}
                          alt={`Logo de ${company.name || company.nombre}`}
                          className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex'; 
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-12 h-12 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center shadow-sm ${company.logo?.url ? 'hidden' : ''}`}
                        style={{ display: company.logo?.url ? 'none' : 'flex' }} 
                      >
                        <Building2 className="text-gray-400" size={20} />
                      </div>
                    </div>
                    
                    {/* Nombre y Tipo */}
                    <div className="flex-grow">
                      <h3 className="font-extrabold text-[#1E305D] text-xl leading-snug line-clamp-2 mb-1">
                        {company.name || company.nombre} 
                      </h3>
                      <span className="text-xs font-bold text-[#00AB6D] bg-[#00AB6D]/10 px-2.5 py-0.5 rounded-full inline-block">
                        {company.tipo || "Empresa"} 
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo: Descripción/Enfoque */}
                  <div className="flex-grow mb-4">
                    
                    {/* Descripción o Materiales (Destacado) */}
                    {(company.description || company.materiales) && (
                      <div className="flex items-start gap-2 text-sm text-gray-700 p-2 rounded-md">
                        <Tag className="w-4 h-4 text-[#00AB6D] mt-1 flex-shrink-0" />
                        <p className="font-normal line-clamp-3">
                          <span className="font-semibold text-[#1E305D]">Enfoque:</span> {company.description || company.materiales}
                        </p>
                      </div>
                    )}
                    
                    {/* Ubicación */}
                    {(company.address || company.ciudad) && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 mt-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="line-clamp-1">Ubicación: {company.address || company.ciudad}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Acción - Pie de Tarjeta */}
                  <div className="pt-3 border-t border-gray-100 text-center mt-auto">
                    <span className="inline-flex items-center gap-2 text-[#00AB6D] font-bold text-sm group-hover:text-[#008A5C] transition">
                      Ver Ficha Completa
                      <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Mensaje cuando no hay empresas filtradas */
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 text-lg">
                No hay empresas disponibles en esta región aún
              </p>
            </div>
          )}
        </div>
      </section>

      {/* --- Company Detail Modal (Diseño Premium) --- */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-3xl overflow-hidden animate-fadeIn max-h-[95vh] flex flex-col transform transition-all duration-300 scale-100">
            
            {/* Modal Header con Branding */}
            <div className="relative p-6 bg-gradient-to-br from-[#00AB6D] to-[#008A5C] text-white">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-white/80 p-1 rounded-full hover:bg-white/20 transition z-10"
                >
                    <X size={24} />
                </button>
                
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    {selectedCompany.logo?.url ? (
                        <img
                            src={selectedCompany.logo.url}
                            alt={`Logo de ${selectedCompany.name || selectedCompany.nombre}`}
                            className="w-16 h-16 object-cover rounded-xl border-4 border-white shadow-lg flex-shrink-0"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-white/20 rounded-xl border-4 border-white flex items-center justify-center flex-shrink-0">
                            <Building2 className="text-white" size={28} />
                        </div>
                    )}

                    <div>
                        <h1 className="text-2xl font-extrabold leading-tight">
                            {selectedCompany.name || selectedCompany.nombre}
                        </h1>
                        <span className="text-sm font-semibold bg-white/20 px-3 py-0.5 rounded-full inline-block mt-1">
                            {selectedCompany.tipo || "Empresa"}
                        </span>
                    </div>
                </div>
                
                {/* Elemento decorativo */}
                <Zap size={20} className="absolute bottom-1 right-6 text-white/50 animate-pulse" />
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              
              <div className="space-y-5">
                
                {/* 1. Descripción y Enfoque */}
                {(selectedCompany.description || selectedCompany.materiales) && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
                    <h3 className="font-bold text-[#1E305D] mb-2 text-lg flex items-center gap-2 border-b pb-2 border-gray-200">
                        <Tag size={20} className="text-[#00AB6D]" /> Descripción y Enfoque
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2">{selectedCompany.description || selectedCompany.materiales}</p>
                  </div>
                )}

                {/* 2. Ubicación y Productos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Ubicación */}
                    {(selectedCompany.address || selectedCompany.ciudad) && (
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-[#1E305D] mb-2 flex items-center gap-2">
                            <MapPin size={18} className="text-red-500" /> Dirección
                        </h3>
                        <p className="text-gray-700 text-sm">{selectedCompany.address || selectedCompany.ciudad}</p>
                        {selectedCompany.region && (
                          <p className="text-xs text-gray-500 mt-1">Región: **{selectedCompany.region}**</p>
                        )}
                      </div>
                    )}

                    {/* Products */}
                    {selectedCompany.products && selectedCompany.products.length > 0 && (
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-[#1E305D] mb-2 flex items-center gap-2">
                            <Leaf size={18} className="text-[#00AB6D]" /> Productos
                        </h3>
                        <ul className="list-none text-gray-700 pl-0 space-y-1 text-sm">
                          {selectedCompany.products.map((product, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span className="text-[#00AB6D] font-extrabold text-sm leading-none">&bull;</span> {product.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>

                {/* 3. Contacto Público (Website) */}
                {(selectedCompany.website_url) && (
                  <div className="p-4 rounded-xl border-4 border-[#00AB6D]/20 bg-[#F5F7FA] shadow-md">
                    <h3 className="font-bold text-[#1E305D] mb-3 flex items-center gap-2 text-lg border-b pb-2 border-gray-200">
                        <Globe size={20} className="text-[#00AB6D]" /> Información Pública
                    </h3>
                    <div className="flex items-center gap-3 text-sm pt-2">
                        <ExternalLink className="w-5 h-5 text-[#00AB6D] flex-shrink-0" />
                        <a
                            href={selectedCompany.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1E305D] font-bold hover:text-[#008A5C] transition truncate"
                            title={selectedCompany.website_url}
                        >
                            {selectedCompany.website_url.replace(/https?:\/\/(www\.)?/i, "").split('/')[0]}
                        </a>
                    </div>
                  </div>
                )}

                {/* 4. Contacto Privado (Solo si el usuario está logueado) */}
                {user && (selectedCompany.phone || selectedCompany.email) && (
                  <div className="p-4 rounded-xl border-4 border-[#1E305D]/20 bg-[#1E305D] text-white shadow-xl">
                    <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2 text-lg border-b pb-2 border-[#1E305D]/50">
                        <Phone size={20} className="text-yellow-400" /> Contacto Directo <span className="text-xs font-normal bg-yellow-400 text-[#1E305D] px-2 py-0.5 rounded-full">EXCLUSIVO</span>
                    </h3>
                    <div className="space-y-2 text-sm pt-2">
                      {/* Teléfono */}
                      {(selectedCompany.phone) && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-yellow-400" />
                          <a
                            href={`tel:${selectedCompany.phone}`}
                            className="font-semibold text-white hover:text-yellow-400 transition"
                          >
                            {selectedCompany.phone}
                          </a>
                        </div>
                      )}
                      {/* Email */}
                      {selectedCompany.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-yellow-400" />
                          <a
                            href={`mailto:${selectedCompany.email}`}
                            className="font-semibold text-white hover:text-yellow-400 transition truncate"
                            title={selectedCompany.email}
                          >
                            {selectedCompany.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-100">
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-lg bg-[#00AB6D] text-white font-bold hover:bg-[#008A5C] transition duration-300 shadow-md"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}