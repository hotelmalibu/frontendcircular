import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Search, MapPin, Mail, Phone, Globe, X,
  AlertCircle, CheckCircle2, Sparkles,
  Tag, ExternalLink, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import fondoMapa from '../../assets/fondosYlogos/fondo_mapaC.jpg';
import { getAllCompanies } from "../../api/companiesApi";

// --- FUZZY SEARCH ---
const fuzzySearch = (searchTerm, text) => {
  if (!text) return false;
  const search = searchTerm.toLowerCase();
  const compare = text.toLowerCase();

  if (compare.includes(search)) return true;

  let searchIndex = 0;
  for (let i = 0; i < compare.length && searchIndex < search.length; i++) {
    if (compare[i] === search[searchIndex]) {
      searchIndex++;
    }
  }
  return searchIndex === search.length;
};

export default function MapSection() {
  const { user } = useContext(AuthContext);


  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [empresasFiltradas, setEmpresasFiltradas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // --- Helpers ---
  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "EM";
  };

  // --- Carga de Datos ---
  useEffect(() => {
    if (user) {
      loadCompanies();
    }
  }, [user]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCompanies(1, 100); // Traemos mas para el mapa

      let companiesArray = [];
      if (response?.data?.items && Array.isArray(response.data.items)) {
        companiesArray = response.data.items;
      } else if (response?.data && Array.isArray(response.data)) {
        companiesArray = response.data;
      } else {
        companiesArray = [];
      }
      setCompanies(companiesArray);
      setEmpresasFiltradas(companiesArray);
    } catch (err) {
      console.error("Error loading companies:", err);
      setError("No pudimos conectar con el directorio.");
    } finally {
      setLoading(false);
    }
  };


  // Filtrado con un solo buscador
  useEffect(() => {
    if (!user) {
      setEmpresasFiltradas([]);
      return;
    }

    if (!searchTerm.trim()) {
      setEmpresasFiltradas(companies);
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtradas = companies.filter(e =>
      fuzzySearch(search, e.name) ||
      fuzzySearch(search, e.region || '') ||
      fuzzySearch(search, e.description || '') ||
      fuzzySearch(search, e.contacts ? JSON.stringify(e.contacts) : '') ||
      fuzzySearch(search, e.address || '')
    );

    setEmpresasFiltradas(filtradas);
  }, [searchTerm, user, companies]);


  return (
    <div
      className="relative w-full min-h-screen bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: `url(${fondoMapa})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* SECCIÓN: Acceso Requerido (sin login) */}
        {!user && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/60 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] border border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] text-center max-w-3xl relative overflow-hidden"
            >
              {/* Decorative Blur Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00AB6D]/20 blur-[80px] rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#1E305D]/20 blur-[80px] rounded-full" />

              <div className="relative z-10">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <MapPin className="w-12 h-12 text-[#00AB6D]" />
                </div>

                <span className="inline-block bg-[#00AB6D]/10 text-[#00AB6D] text-[11px] font-bold uppercase tracking-[0.25em] px-5 py-2 rounded-full mb-6 border border-[#00AB6D]/20">
                  Acceso Especial para Afiliados
                </span>

                <h2 className="text-4xl md:text-6xl font-black text-[#1E305D] mb-6 tracking-tight leading-tight">
                  Directorio de <span className="text-[#00AB6D]">Empresas Transformadoras</span>
                </h2>

                <div className="w-24 h-1.5 bg-gradient-to-r from-[#00AB6D] to-[#2C67B0] mx-auto rounded-full mb-8" />

                <p className="text-gray-600 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                  Conecta con las organizaciones líderes que están transformando la economía circular en Colombia.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* SECCIÓN: Directorio de Empresas (con login) */}
        {user && (
          <div className="flex-1 flex flex-col py-6 px-6 md:px-12 lg:px-20">
            {/* ENCABEZADO PREMIUM */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-100">
                    <MapPin size={22} className="text-[#00AB6D]" />
                  </div>
                  <span className="text-[#00AB6D] font-bold text-[10px] uppercase tracking-[0.2em] bg-[#00AB6D]/5 px-4 py-1.5 rounded-full border border-[#00AB6D]/10">
                    Ecosistema Colaborativo
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-[#1E305D] tracking-tight leading-none">
                  Directorio de <span className="text-[#00AB6D]">Empresas Transformadoras</span>
                </h1>
                <div className="w-20 h-1 bg-[#00AB6D] rounded-full" />
                <p className="text-gray-500 font-medium max-w-xl text-lg leading-relaxed">
                  Encuentra aliados estratégicos, servicios especializados y productos circulares para potenciar tu organización.
                </p>
              </div>
            </motion.div>
            {/* BUSCADOR MEJORADO */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 space-y-4"
            >
              {/* Búsqueda con icono mejorado */}
              <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
                {/* Sombra dinámica */}
                <div className={`absolute inset-0 bg-gradient-to-r from-[#00AB6D]/20 to-[#2C67B0]/20 rounded-2xl blur-xl transition-all duration-300 ${isFocused ? 'opacity-100 shadow-2xl' : 'opacity-0'}`} />

                {/* Container del input */}
                <div className="relative flex items-center">
                  <motion.div
                    animate={{ rotate: isFocused ? 15 : 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="absolute left-5 pointer-events-none"
                  >
                    <Search
                      size={22}
                      className={`transition-colors duration-300 ${isFocused
                        ? 'text-[#00AB6D] stroke-[3]'
                        : 'text-gray-400 stroke-[1.5]'
                        }`}
                    />
                  </motion.div>

                  <input
                    type="text"
                    placeholder="Buscar empresas, servicios, productos, región..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full pl-16 pr-12 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none font-medium ${isFocused
                      ? 'border-[#00AB6D] ring-4 ring-[#00AB6D]/10 bg-white shadow-2xl'
                      : 'border-gray-300/80 bg-white/95 shadow-lg hover:shadow-xl hover:border-gray-400'
                      }`}
                  />

                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={20} strokeWidth={2.5} />
                    </motion.button>
                  )}

                  {!searchTerm && isFocused && (
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute right-4 pointer-events-none"
                    >
                      <Sparkles size={20} className="text-[#00AB6D]/40" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Indicador de Resultados */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-sm font-medium p-3 rounded-lg flex items-center gap-2 transition-all ${empresasFiltradas.length > 0
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : loading ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Cargando directorio...</span>
                  </>
                ) : companies.length > 0 ? (
                  empresasFiltradas.length > 0 ? (
                    <>
                      <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                      <span>
                        Mostrando <span className="font-bold">{empresasFiltradas.length}</span> de{' '}
                        <span className="font-bold">{companies.length}</span> empresas
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                      <span>No se encontraron empresas con la búsqueda "{searchTerm}"</span>
                    </>
                  )
                ) : (
                  <>
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                    <span>No hay empresas disponibles en este momento.</span>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Errores */}
            {error && (
              <div className="max-w-7xl mx-auto px-4 mb-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Grid de Empresas */}
            <div className="flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-12 h-12 border-4 border-[#00AB6D] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white font-medium">Cargando empresas...</p>
                </div>
              ) : empresasFiltradas.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-0"
                >
                  {empresasFiltradas.map((empresa, idx) => (
                    <motion.div
                      key={empresa.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedEmpresa(empresa)}
                      className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-white/30 bg-white hover:border-[#00AB6D]/50 flex flex-col h-full"
                    >
                      {/* Logo (Design matched with DirectorySection) */}
                      <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden p-4 border-b border-gray-200 group-hover:from-[#00AB6D]/10 group-hover:to-[#2C67B0]/10 transition-all relative">
                        {empresa.logo?.url ? (
                          <img
                            src={empresa.logo.url}
                            alt={empresa.name}
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
                          style={{ display: empresa.logo?.url ? 'none' : 'flex' }}
                        >
                          {getInitials(empresa.name)}
                        </div>
                      </div>

                      {/* Contenido (Design matched with DirectorySection) */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h4 className="font-bold text-[#1E305D] text-lg mb-2 line-clamp-2 group-hover:text-[#00AB6D] transition-colors">
                          {empresa.name}
                        </h4>

                        {/* Ubicación */}
                        <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
                          <p className="flex items-start gap-1.5">
                            <MapPin size={14} className="text-[#00AB6D] flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{empresa.address || empresa.region || "Ubicación no disponible"}</span>
                          </p>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-3 mb-4 flex-grow leading-relaxed">
                          {empresa.description || "Sin descripción disponible."}
                        </p>

                        <button className="w-full bg-gradient-to-r from-[#00AB6D] to-[#008A5C] hover:from-[#009B5F] hover:to-[#007A4E] text-white font-bold py-2.5 rounded-lg text-xs transition-all duration-300 hover:shadow-lg mt-auto flex items-center justify-center gap-2">
                          Ver Detalles <ChevronRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <AlertCircle size={48} className="text-white/70 mb-4" />
                  <p className="text-white font-medium text-lg">
                    {searchTerm.trim() ? `No se encontraron empresas con "${searchTerm}"` : 'No hay empresas disponibles.'}
                  </p>
                </div>
              )}
            </div>


          </div>
        )}


        {/* MODAL DETALLE EMPRESA (Design matched with DirectorySection) */}
        {selectedEmpresa && user && ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1E305D]/70 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSelectedEmpresa(null)}
          >
            <div
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 relative border-b border-gray-100">
                <button
                  onClick={() => setSelectedEmpresa(null)}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full text-gray-600 transition-colors z-10 shadow-sm"
                >
                  <X size={20} />
                </button>

                {selectedEmpresa.logo?.url ? (
                  <img
                    src={selectedEmpresa.logo.url}
                    alt={selectedEmpresa.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white text-gray-400 flex items-center justify-center font-bold text-2xl shadow-md">
                    {getInitials(selectedEmpresa.name)}
                  </div>
                )}
              </div>

              {/* Title Bar */}
              <div className="p-5 text-center border-b border-gray-50">
                <h2 className="text-2xl font-bold text-[#1E305D]">
                  {selectedEmpresa.name}
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
                    {selectedEmpresa.description || "Sin descripción detallada."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contacto */}
                  <div className="space-y-3">
                    <h4 className="text-gray-900 font-bold text-sm border-b pb-1 mb-2">Contacto</h4>

                    {/* Multiple Contacts List */}
                    {selectedEmpresa.contacts && selectedEmpresa.contacts.length > 0 ? (
                      <div className="space-y-3">
                        {selectedEmpresa.contacts.map((contact, index) => (
                           <div key={index} className="flex flex-col gap-1 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50 hover:bg-blue-50 transition-colors">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                  {contact.contact_name ? contact.contact_name.charAt(0).toUpperCase() : 'C'}
                                </div>
                                <span className="text-sm font-semibold text-gray-800">{contact.contact_name}</span>
                              </div>
                              
                              {contact.phone && (
                                <div className="flex items-center gap-2 text-xs text-gray-600 ml-1">
                                  <Phone size={12} className="text-green-600" />
                                  <span>{contact.phone}</span>
                                </div>
                              )}
                              
                              {contact.email && (
                                <div className="flex items-center gap-2 text-xs text-gray-600 ml-1">
                                  <Mail size={12} className="text-indigo-600" />
                                  <a href={`mailto:${contact.email}`} className="hover:text-indigo-800 underline decoration-indigo-200">
                                    {contact.email}
                                  </a>
                                </div>
                              )}
                           </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No hay contactos registrados.</p>
                    )}

                    {selectedEmpresa.website_url && (
                      <div className="flex items-center gap-2 p-3 bg-teal-50/50 rounded-lg border border-teal-100/50 mt-2">
                        <Globe size={16} className="text-teal-600" />
                        <a
                          href={selectedEmpresa.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-teal-700 font-medium hover:underline flex items-center gap-1"
                        >
                          Visitar Sitio Web <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Ubicación */}
                  <div>
                    <h4 className="text-gray-900 font-bold text-sm border-b pb-1 mb-2">Ubicación</h4>
                    {selectedEmpresa.address ? (
                      <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <MapPin className="text-red-500 mt-1 flex-shrink-0" size={16} />
                        <p className="text-sm text-gray-700 font-medium">{selectedEmpresa.address}</p>
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
                  onClick={() => setSelectedEmpresa(null)}
                  className="px-6 py-2 bg-[#1E305D] text-white rounded-lg font-bold hover:bg-[#152347] transition shadow-md text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
