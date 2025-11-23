import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
// Ajusta la ruta "../data/mockContent" o "../../data/mockContent" según tu estructura exacta
import { allContentData, contentTypeConfig } from "../../data/mockContent"; 

export default function FeaturedSection() {
  const [filter, setFilter] = useState("Todos");

  // Filtrar y tomar solo los primeros 4 elementos para el Home
  const filteredItems = (filter === "Todos" 
    ? allContentData 
    : allContentData.filter(item => item.type === filter)).slice(0, 4);

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* --- HEADER DE SECCIÓN --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-2  border-b border-gray-200">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E305D] mb-2 fontfamily-montserrat">
              Actualidad y Destacados
            </h2>
            <p className="text-gray-600 max-w-1xl mb-4">
              Mantente al día con nuestras últimas noticias, accede a documentos clave y consulta recursos de gestión.
            </p>
            {/* Filtros rápidos */}
            <div className="flex flex-wrap gap-6 text-sm font-bold">
              {["Todos", "Noticias", "Documentos de interés", "Gestión documental"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`pb-2 transition-all ${
                    filter === cat 
                      ? "text-[#00AB6D] border-b-2 border-[#00AB6D]" 
                      : "text-gray-400 hover:text-[#1E305D]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Link a Explorar */}
          <Link 
            to="/explorar" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-[#1E305D] hover:text-[#00AB6D] transition-colors mt-4 md:mt-0"
          >
            Ver más
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* --- GRID DE TARJETAS (Diseño Idéntico a Explorar) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredItems.map((item) => {
            const config = contentTypeConfig[item.type] || {};
            const Icon = config.icon;

            return (
              <Link 
                key={item.id}
                to={`/contenido/${item.slug}`}
                className="group block h-full flex flex-col"
              >
                {/* 1. ÁREA VISUAL (Imagen o Color Sólido) */}
                <div className={`rounded-xl overflow-hidden mb-5 aspect-[16/10] relative shadow-sm transition-transform duration-500 group-hover:-translate-y-2 ${config.isSolid ? config.bgColor : 'bg-gray-100'}`}>
                  
                  {config.isSolid ? (
                    // DISEÑO SÓLIDO (Para Documentos/Gestión)
                    <div className="w-full h-full flex items-center justify-center relative p-6">
                      {/* Icono decorativo de fondo */}
                      <Icon strokeWidth={1} size={110} className="absolute -right-6 -bottom-6 text-white opacity-10 rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
                      
                      {/* Icono central */}
                      <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center text-white backdrop-blur-sm z-10">
                        <Icon size={32} />
                      </div>
                    </div>
                  ) : (
                    // DISEÑO FOTOGRÁFICO (Para Noticias)
                    <>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Overlay oscuro al hacer hover */}
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"></div>
                    </>
                  )}
                </div>

                {/* 2. ÁREA DE TEXTO (Limpia, sin caja blanca extra) */}
                <div className="flex flex-col flex-1">
                  {/* Metadatos (Tipo | Tema) */}
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-3 text-gray-400">
                     <span className={config.isSolid ? "text-gray-500" : config.color}>{item.type}</span>
                     <span className="text-gray-300">/</span>
                     <span>{item.topic}</span>
                  </div>

                  {/* Título */}
                  <h3 className="text-lg font-bold text-[#1E305D] leading-snug mb-3 group-hover:text-[#00AB6D] transition-colors">
                    {item.title}
                  </h3>

                  {/* Extracto */}
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed flex-1">
                    {item.excerpt}
                  </p>
                  
                  
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Botón móvil */}
        <div className="mt-12 md:hidden text-center">
            <Link to="/explorar" className="inline-flex items-center gap-2 text-sm font-bold text-[#00AB6D] px-6 py-3 border border-[#00AB6D] rounded-full hover:bg-[#00AB6D] hover:text-white transition-all">
                Ver más <ArrowRight size={16} />
            </Link>
        </div>

      </div>
    </section>
  );
}