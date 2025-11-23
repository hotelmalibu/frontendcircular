import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
// Asegúrate de que esta ruta sea correcta según tu estructura
import { allContentData, contentTypeConfig } from "../../data/mockContent"; 

export default function FeaturedSection() {
  const [filter, setFilter] = useState("Todos");

  // Filtrar y mostrar solo los primeros 4 elementos para el Home
  const filteredItems = (filter === "Todos" 
    ? allContentData 
    : allContentData.filter(item => item.type === filter)).slice(0, 4);

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E305D] mb-4 fontfamily-montserrat">
              Actualidad y Recursos
            </h2>
            
            {/* Filtros rápidos en el Home */}
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              {["Todos", "Noticias", "Documentos de interés", "Gestión documental"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`pb-1 transition-colors ${
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
          
          {/* BOTÓN PRINCIPAL "VER MÁS" -> Redirige a Página Explorar */}
          <Link 
            to="/explorar" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-[#1E305D] hover:text-[#00AB6D] transition-colors mt-4 md:mt-0"
          >
            Ver más
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* --- GRID DE TARJETAS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const config = contentTypeConfig[item.type] || {};
            const Icon = config.icon;

            return (
              <Link 
                key={item.id}
                // AQUÍ DEFINIMOS A DÓNDE LLEVA EL CLICK EN LA TARJETA/IMAGEN
                // Opción A (Recomendada): Lleva al detalle del artículo
                to={`/contenido/${item.slug}`}
                
                // Opción B (Si quieres que vaya a explorar): 
                // to="/explorar"
                
                className="group flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
              >
                {/* Imagen / Fondo Sólido */}
                <div className={`rounded-xl overflow-hidden aspect-[16/10] mb-4 relative shadow-sm ${config.isSolid ? config.bgColor : 'bg-gray-100'}`}>
                  {config.isSolid ? (
                    // Diseño Sólido (Documentos)
                    <div className="w-full h-full flex items-center justify-center relative p-6">
                      <Icon strokeWidth={1} size={100} className="absolute -right-4 -bottom-4 text-white opacity-20 rotate-12" />
                      <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center text-white backdrop-blur-sm">
                        <Icon size={32} />
                      </div>
                    </div>
                  ) : (
                    // Diseño Imagen (Noticias)
                    <>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </>
                  )}
                </div>

                {/* Texto */}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider mb-2 text-gray-400">
                     <span className={config.color}>{item.type}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1E305D] leading-tight mb-2 group-hover:text-[#00AB6D] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Botón "Ver más" para móvil */}
        <div className="mt-8 md:hidden text-center">
            <Link to="/explorar" className="inline-flex items-center gap-2 text-sm font-bold text-[#00AB6D] px-6 py-3 border border-[#00AB6D] rounded-full hover:bg-[#00AB6D] hover:text-white transition-all">
                Explorar todo <ArrowRight size={16} />
            </Link>
        </div>

      </div>
    </section>
  );
}