import React, { useState, useEffect } from "react";
import { 
  Building2, MapPin, Phone, Mail, ExternalLink, X, 
  Globe, Tag, CheckCircle2, ChevronRight 
} from "lucide-react";
import { getAllCompanies } from "../../api/companiesApi";

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
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E305D] flex items-center gap-3">
              <Building2 className="text-[#00AB6D]" size={36} />
              Directorio Circular
            </h2>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-orange-50 border-l-4 border-orange-400 text-orange-700 rounded-r-lg">
              <p>{error}</p>
            </div>
          )}

          {/* Grid de Tarjetas */}
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleCompanyClick(company)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl border border-gray-200 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer h-full"
                >
                  {/* --- 1. IMAGEN DE TARJETA --- */}
                  {/* CAMBIO: h-32 (128px) es suficiente para un logo. p-4 para margen interno. */}
                  <div className="w-full h-36 bg-white border-b border-gray-100 flex items-center justify-center p-4 relative">
                    
                    {company.logo?.url ? (
                      <img 
                        src={company.logo.url} 
                        alt={company.name}
                        // CAMBIO: max-h-full y max-w-full permiten que la imagen crezca hasta tocar el borde del contenedor
                        // pero sin deformarse (object-contain)
                        className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback */}
                    <div 
                       className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xl"
                       style={{ display: company.logo?.url ? 'none' : 'flex' }}
                    >
                      {getInitials(company.name)}
                    </div>
                  </div>

                  {/* --- 2. CONTENIDO --- */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-extrabold text-[#1E305D] text-lg mb-2 line-clamp-2 group-hover:text-[#00AB6D] transition-colors">
                      {company.name}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
                      {company.description || "Sin descripción disponible."}
                    </p>
                    
                    {company.address && (
                      <div className="flex items-start gap-2 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
                        <MapPin size={14} className="mt-0.5 text-[#00AB6D] flex-shrink-0" />
                        <span className="line-clamp-1">{company.address}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                       <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                         Empresa
                       </span>
                       <button className="text-[#00AB6D] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                         Ver ficha <ChevronRight size={16} />
                       </button>
                    </div>
                  </div>
                </div>
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

      {/* --- MODAL --- */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E305D]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* --- 1. MODAL HEADER: IMAGEN --- */}
            {/* CAMBIO: Reducido a h-48 para menos espacio blanco */}
            <div className="w-full h-48 bg-white flex items-center justify-center p-6 relative border-b border-gray-100">
                <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 transition-colors z-10"
                >
                  <X size={20} />
                </button>

                {selectedCompany.logo?.url ? (
                  <img 
                    src={selectedCompany.logo.url} 
                    alt={selectedCompany.name} 
                    // max-h-full hace que la imagen sea tan grande como el contenedor le permita
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-3xl">
                    {getInitials(selectedCompany.name)}
                  </div>
                )}
            </div>

            {/* --- 2. MODAL TITLE BAR --- */}
            <div className=" p-5 text-white flex flex-col sm:flex-row justify-between items-center gap-3">
               <h2 className="text-2xl font-bold leading-tight text-center sm:text-left text-[#1E305D]">
                  {selectedCompany.name}
               </h2>
            </div>

            {/* --- 3. MODAL BODY --- */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-gray-50/50">
              
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6">
                <h3 className="text-[#1E305D] font-bold text-lg mb-3 flex items-center gap-2">
                  <Tag size={20} className="text-[#00AB6D]" />
                  Descripción
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {selectedCompany.description || "Sin descripción detallada."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contacto */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 h-full">
                  <h4 className="text-gray-900 font-bold border-b pb-2 mb-2">Contacto</h4>
                  
                  {selectedCompany.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Phone size={16} />
                      </div>
                      <a href={`tel:${selectedCompany.phone}`} className="text-gray-700 hover:text-blue-600 font-medium">
                        {selectedCompany.phone}
                      </a>
                    </div>
                  )}

                  {selectedCompany.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Mail size={16} />
                      </div>
                      <a href={`mailto:${selectedCompany.email}`} className="text-gray-700 hover:text-indigo-600 font-medium break-all">
                        {selectedCompany.email}
                      </a>
                    </div>
                  )}
                  
                  {selectedCompany.website_url && (
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <Globe size={16} />
                      </div>
                      <a 
                        href={selectedCompany.website_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-teal-600 font-medium hover:underline flex items-center gap-1"
                      >
                        Visitar Sitio Web <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Ubicación */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
                   <h4 className="text-gray-900 font-bold border-b pb-2 mb-2">Ubicación</h4>
                   
                   {selectedCompany.address ? (
                     <div className="flex items-start gap-3">
                       <MapPin className="text-red-500 mt-1 flex-shrink-0" size={18} />
                       <p className="text-gray-700 font-medium">{selectedCompany.address}</p>
                     </div>
                   ) : (
                     <p className="text-gray-400 text-sm italic">Ubicación no especificada</p>
                   )}
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t flex justify-end">
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-[#1E305D] text-white rounded-lg font-bold hover:bg-[#152347] transition shadow-md"
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