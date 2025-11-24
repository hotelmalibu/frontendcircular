import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
// Ajusta la ruta "../data/mockContent" o "../../data/mockContent" según tu estructura exacta
import { contentTypeConfig } from "../../data/mockContent"; 
import { getAllNews } from "../../api/newsApi";

export default function FeaturedSection() {
  const [newsItems, setNewsItems] = useState([]);

  // Traer noticias publicadas desde la API y mapearlas al formato del mock
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await getAllNews();
            if (!mounted) return;

            // Normalize possible response shapes (array, { data: [...] }, { data: { news: [...] } }, etc.)
            let newsArray = [];
            if (Array.isArray(response)) {
              newsArray = response;
            } else if (response?.data?.news && Array.isArray(response.data.news)) {
              newsArray = response.data.news;
            } else if (response?.data && Array.isArray(response.data)) {
              newsArray = response.data;
            } else if (response?.news && Array.isArray(response.news)) {
              newsArray = response.news;
            } else if (typeof response === 'object' && response !== null) {
              const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
              if (possibleArrays.length > 0) {
                newsArray = possibleArrays[0];
              }
            }

            const mapped = newsArray
              .filter(n => String(n.status).toLowerCase() === 'published')
              .map(n => ({
                id: n.id || n._id || n.uid || Math.random(),
                type: "Noticias",
                topic: n.category || n.topic || "General",
                title: n.title || n.name || "Sin título",
                excerpt: n.description || n.excerpt || "",
              image: n.image || n.thumbnail || n.cover || "",
                date: n.published_at || n.publishedAt ? new Date(n.published_at || n.publishedAt).toLocaleDateString() : "",
                slug: n.slug || (`noticia-${n.id || n._id || ''}`),
                status: n.status || ""
              }));

            setNewsItems(mapped);
      } catch (err) {
        // Silenciar errores aquí; podríamos agregar estado de error si se desea
        console.error("Error cargando noticias:", err);
      }
    };

    load();
    return () => { mounted = false };
  }, []);

  // Mostrar únicamente las noticias traídas desde la API
  const filteredItems = newsItems;

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
              Últimas noticias publicadas en la plataforma.
            </p>
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
              <a 
                  key={item.id}
                  href={window.location.origin + `/contenido/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
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
                    item.image ? (
                      <>
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay oscuro al hacer hover */}
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"></div>
                      </>
                    ) : (
                      // Fallback: mostrar icono en lugar de imagen
                      <div className="w-full h-full flex items-center justify-center relative p-6 bg-gray-50">
                        <Icon strokeWidth={1} size={110} className="absolute text-gray-200 opacity-80 rotate-6 transition-transform duration-700" />
                        <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 z-10 bg-white">
                          <Icon size={28} />
                        </div>
                      </div>
                    )
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
              </a>
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