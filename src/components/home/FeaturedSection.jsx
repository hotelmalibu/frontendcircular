import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Newspaper, FolderOpen, Calendar } from "lucide-react";

// Datos de ejemplo (Simulando tu base de datos o CMS)
const DATA_ITEMS = [
  {
    id: 1,
    category: "Noticias",
    title: "La economía circular como motor de cambio en 2025",
    excerpt: "Descubre cómo las nuevas políticas están transformando los modelos de negocio tradicionales hacia sistemas regenerativos.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
    link: "/noticias/economia-circular-2025",
    date: "22 Nov 2024",
  },
  {
    id: 2,
    category: "Documentos de interés",
    title: "Informe Anual de Sostenibilidad y Metas Cumplidas",
    excerpt: "Descarga el reporte completo con las métricas de impacto ambiental y social logradas durante el último periodo fiscal.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
    link: "/documentos/informe-anual",
    date: "15 Oct 2024",
  },
  {
    id: 3,
    category: "Gestión documental",
    title: "Guía técnica para la clasificación de residuos industriales",
    excerpt: "Manual actualizado para empresas aliadas sobre el correcto manejo y disposición final de materiales aprovechables.",
    image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=800&auto=format&fit=crop",
    link: "/gestion/guia-tecnica",
    date: "10 Sep 2024",
  },
  {
    id: 4,
    category: "Noticias",
    title: "Alianza estratégica para la recuperación de plásticos",
    excerpt: "Firmamos un nuevo acuerdo con líderes del sector para aumentar la tasa de recolección en zonas costeras.",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=800&auto=format&fit=crop",
    link: "/noticias/alianza-plasticos",
    date: "05 Sep 2024",
  }
];

export default function FeaturedSection() {
  const [filter, setFilter] = useState("Todos");

  // Filtrar los items según la selección
  const filteredItems = filter === "Todos" 
    ? DATA_ITEMS 
    : DATA_ITEMS.filter(item => item.category === filter);

  // Mapeo de categorías a colores/iconos para UI dinámica
  const getCategoryStyle = (cat) => {
    switch(cat) {
      case "Noticias": return { color: "text-[#00AB6D]", icon: <Newspaper size={14} /> };
      case "Documentos de interés": return { color: "text-[#2C67B0]", icon: <FileText size={14} /> };
      case "Gestión documental": return { color: "text-[#E8AD00]", icon: <FolderOpen size={14} /> };
      default: return { color: "text-gray-500", icon: <Calendar size={14} /> };
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* --- HEADER DE LA SECCIÓN --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E305D] mb-2 fontfamily-montserrat">
              Actualidad y Destacados
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Mantente al día con nuestras últimas noticias, accede a documentos clave y consulta recursos de gestión.
            </p>
          </div>
          
          {/* Botón "Ver más" Global */}
          <Link 
            to="/actualidad" 
            className="group flex items-center gap-2 text-[#00AB6D] font-semibold hover:text-[#1E305D] transition-colors whitespace-nowrap"
          >
            Ver todo el contenido
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* --- FILTROS  --- */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["Todos", "Noticias", "Documentos de interés", "Gestión documental"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                filter === cat
                  ? "bg-[#1E305D] text-white border-[#1E305D]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#00AB6D] hover:text-[#00AB6D]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- GRID DE TARJETAS  --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredItems.map((item) => {
            const style = getCategoryStyle(item.category);
            
            return (
              <article key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
                
                {/* Imagen */}
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay sutil al hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Contenido */}
                <div className="p-5 flex flex-col flex-1">
                  
                  {/* Categoría */}
                  <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 ${style.color}`}>
                    {style.icon}
                    <span>{item.category}</span>
                  </div>

                  {/* Título */}
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3 group-hover:text-[#00AB6D] transition-colors line-clamp-3">
                    <Link to={item.link}>
                      {item.title}
                    </Link>
                  </h3>

                  {/* Extracto */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                    {item.excerpt}
                  </p>

                  {/* Footer de la tarjeta (Fecha o leer más) */}
                  <div className="pt-4 border-t border-gray-100 mt-auto flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                    <Link 
                      to={item.link} 
                      className="text-sm font-semibold text-[#1E305D] group-hover:underline decoration-2 underline-offset-4"
                    >
                      Leer más
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mensaje si no hay resultados */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay contenidos destacados en esta categoría por el momento.</p>
          </div>
        )}

      </div>
    </section>
  );
}