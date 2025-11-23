// UBICACIÓN: src/pages/ExplorePage.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, FilterX } from "lucide-react";
// Asegúrate que la ruta a mockContent sea correcta según tu estructura
import { allContentData, contentTypeConfig } from "../../data/mockContent"; 

const allTopics = [...new Set(allContentData.map(item => item.topic))];
const allTypes = Object.keys(contentTypeConfig);

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const filteredResults = useMemo(() => {
    return allContentData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTopic = selectedTopic ? item.topic === selectedTopic : true;
      const matchesType = selectedType ? item.type === selectedType : true;
      return matchesSearch && matchesTopic && matchesType;
    });
  }, [searchQuery, selectedTopic, selectedType]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTopic("");
    setSelectedType("");
  };

  return (
   
    <div className="min-h-screen bg-white ">
      
      {/* --- HERO SECTION (IMAGEN DE FONDO COMPLETA) --- */}
      
      <div className="relative w-full h-[70vh] md:h-[82vh] flex items-center justify-center overflow-hidden bg-[#0D1B2A]">
        
        {/* Imagen de fondo  */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1509881511796-3a0c5a059ec1?q=80&w=1633&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" 
          }}
        ></div>

        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/90 via-[#0D1B2A]/70 to-[#0D1B2A]/50"></div>

        {/* Contenido del Hero (Texto y Buscador) */}
        <div className="container mx-auto px-4 relative z-10 mt-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 fontfamily-montserrat tracking-tight drop-shadow-lg">
              Explora la economía circular
            </h1>
            
            <div className="relative group max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Buscar artículos, documentos, noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-16 py-5 rounded-lg text-gray-900 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#00AB6D]/50 transition-all placeholder-gray-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#00AB6D] text-white rounded-md hover:bg-[#008F5B] transition-colors shadow-md">
                <Search size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- FILTROS Y RESULTADOS (Contenedor centrado) --- */}
      <div className="container mx-auto px-4 md:px-8 py-10">
        
        {/* Barra de Filtros Minimalista */}
        <div className="flex flex-wrap items-center gap-6 mb-12 border-b border-gray-100 pb-8">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Filtrar resultados:</span>
          
          <FilterDropdown label="Tema" options={allTopics} selected={selectedTopic} onChange={setSelectedTopic} />
          <FilterDropdown label="Tipo" options={allTypes} selected={selectedType} onChange={setSelectedType} />
          
          {(selectedTopic || selectedType || searchQuery) && (
            <button 
              onClick={clearFilters} 
              className="text-red-500 text-sm font-semibold hover:bg-red-50 px-3 py-2 rounded-lg transition-colors ml-auto md:ml-0 flex items-center gap-2"
            >
              <FilterX size={16} /> Borrar filtros
            </button>
          )}
          
          <div className="ml-auto text-sm text-gray-500 font-medium hidden lg:block">
            {filteredResults.length} publicaciones encontradas
          </div>
        </div>

        {/* Grid de Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredResults.map((item) => (
            <MinimalistCard key={item.id} item={item} />
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-2xl mt-8 border border-gray-100">
            <div className="mb-4 text-gray-300 flex justify-center"><Search size={48} /></div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No encontramos coincidencias</h3>
            <p className="text-gray-500">Intenta ajustar los términos de búsqueda o limpiar los filtros.</p>
            <button onClick={clearFilters} className="mt-6 text-[#00AB6D] font-bold hover:underline">
              Ver todo el contenido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-componentes (Dropdown y Card) ---
// Componente Dropdown para filtros
function FilterDropdown({ label, options, selected, onChange }) {
  return (
    <div className="relative inline-block">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:border-[#00AB6D] hover:text-[#00AB6D] focus:outline-none focus:border-[#00AB6D] cursor-pointer min-w-[160px] transition-colors shadow-sm"
      >
        <option value="">{label} (Todos)</option>
        {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
    </div>
  );
}

function MinimalistCard({ item }) {
  const config = contentTypeConfig[item.type] || {};
  const Icon = config.icon;

  return (
    <Link to={`/contenido/${item.slug}`} className="group block h-full flex flex-col">
      <div className={`rounded-xl overflow-hidden mb-5 aspect-[16/10] relative shadow-sm transition-transform duration-500 group-hover:-translate-y-1 ${config.isSolid ? config.bgColor : 'bg-gray-100'}`}>
        {config.isSolid ? (
          <div className="w-full h-full flex items-center justify-center relative p-6">
            <Icon strokeWidth={1} size={110} className="absolute -right-6 -bottom-6 text-white opacity-10 rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
            <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center text-white backdrop-blur-sm z-10">
              <Icon size={32} />
            </div>
          </div>
        ) : (
          <>
             <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"></div>
          </>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-3 text-gray-400">
            <span className={config.isSolid ? "text-gray-500" : config.color}>{item.type}</span>
            <span className="text-gray-300">/</span>
            <span>{item.topic}</span>
        </div>
        <h3 className="text-lg font-bold text-[#1E305D] leading-snug mb-3 group-hover:text-[#00AB6D] transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed flex-1">
            {item.excerpt}
        </p>
      </div>
    </Link>
  );
}