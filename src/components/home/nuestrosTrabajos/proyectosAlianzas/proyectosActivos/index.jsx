import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { getImageProxyUrl } from "../../../../../utils/imageUtils.js";

// Skeleton loader components
const SkeletonCard = ({ isWide }) => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 backdrop-blur-xl rounded-xl shadow-sm border border-gray-300 overflow-hidden ${isWide ? "h-48 sm:h-56" : "h-full flex flex-col"
      }`}
  >
    {!isWide && (
      <>
        <div className="h-28 bg-gradient-to-br from-gray-300 to-gray-200"></div>
        <div className="p-3 space-y-3 flex-1">
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-8 bg-gray-300 rounded mt-auto"></div>
        </div>
      </>
    )}
  </motion.div>
);

export default function ProyectosYAlianzas() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const territoriales = [
    {
      id: "ciudades-circulares",
      titulo: "Ciudades circulares",
      subtitulo: "Oportunidades de sostenibilidad para los territorios Colombianos",
      categoria: "Política",
      descripcion: "Análisis detallado de oportunidades y estrategias para fortalecer la economía circular en las ciudades colombianas.",
      img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
    },
    {
      id: "reciclabilidad-envases",
      titulo: "Potencial de reciclabilidad de envases y empaques en Colombia",
      categoria: "Envases",
      descripcion: "Evaluación técnica sobre reciclabilidad y aprovechamiento de envases y empaques en el país.",
      img: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400",
    },
    {
      id: "laboratorios-ensayos",
      titulo: "Catálogo de laboratorios y ensayos para envases y empaques de Colombia",
      categoria: "Recursos",
      descripcion: "Directorio especializado con laboratorios certificados para pruebas, análisis y ensayos de envases.",
      img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400",
    },
    {
      id: "cierre-ciclo-envases",
      titulo: "Innovación para el cierre de ciclo de envases y empaques",
      categoria: "Innovación",
      descripcion: "Documento técnico con estrategias y lineamientos para mejorar el cierre de ciclo de materiales.",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
    },
    {
      id: "dispensacion-granel",
      titulo: "Modelo de dispensación a granel en el sector cosméticos y aseo",
      categoria: "Cosméticos",
      descripcion: "Lineamientos normativos para implementar modelos de dispensación a granel en cosmética y aseo.",
      img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
    },
    {
      id: "pcr-pead",
      titulo: "Guía para la incorporación de PCR (resina reciclada posconsumo) de PEAD en envases",
      categoria: "Envases",
      descripcion: "Guía técnica para la inclusión segura y eficiente de resinas recicladas en envases PEAD.",
      img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400",
    },
  ];

  const categories = ["all", ...new Set(territoriales.map((p) => p.categoria))];

  const filteredTerritoriales =
    activeFilter === "all"
      ? territoriales
      : territoriales.filter((p) => p.categoria === activeFilter);

  const handleFilterChange = (category) => {
    setIsLoading(true);
    setActiveFilter(category);
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F8FAFB] to-white font-sans">
      {/* TÍTULO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#1E305D] mb-4">
            Portafolio de Proyectos
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#2B65AC] to-[#00AB6D] mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Documentos estratégicos y herramientas técnicas para impulsar la economía circular en los territorios.
          </p>
        </motion.div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 mt-12">
        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-wrap justify-center gap-2"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterChange(category)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 ${activeFilter === category
                ? "bg-gradient-to-r from-[#2B65AC] to-[#00AB6D] text-white shadow-lg"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#00AB6D] hover:text-[#00AB6D] shadow-sm"
                }`}
            >
              {category === "all" ? "Todos los proyectos" : category}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid de Proyectos */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} isWide={false} />
              ))}
            </div>
          ) : filteredTerritoriales.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredTerritoriales.map((p, i) => (
                  <motion.article
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="relative overflow-hidden h-40 bg-gray-100">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        src={getImageProxyUrl(p.img, { width: 600, quality: 80 })}
                        alt={p.titulo}
                        className="w-full h-full object-cover"
                      />
                      
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#2B65AC] font-bold text-[10px] rounded-full shadow-sm border border-gray-100 uppercase tracking-wider">
                          <MapPin className="w-2.5 h-2.5" />
                          {p.categoria}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-4 flex-1">
                        <h3 className="text-lg font-bold text-[#1E305D] leading-tight mb-2 group-hover:text-[#00AB6D] transition-colors duration-300">
                          {p.titulo}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 font-medium">
                          {p.descripcion}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00C18A] text-white font-bold rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Descargar
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
            >
              <p className="text-gray-500 text-lg">
                No se encontraron proyectos en esta categoría
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}