import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // 1. IMPORTAR LINK
import fondoProyecto from "../../assets/home/Proyectos/fondo_proyecto.png";
import { projectsData } from "../../data/mockContentData"; // 2. IMPORTAR LOS DATOS

// Icono SVG simple
const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default function ProjectsSection() {
  // Usamos projectsData en lugar del array hardcodeado
  return (
    <section
      className="relative py-20 px-6 md:px-12 text-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${fondoProyecto})` }}
    >
      <div className="absolute inset-0 bg-[#F4F7F6]/90 mix-blend-overlay z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Encabezado (Sin cambios significativos) */}
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block bg-[#00AB6D]/10 text-[#00AB6D] font-bold px-6 py-2 rounded-full text-sm tracking-widest uppercase border border-[#00AB6D]/20"
          >
            Nuestras Iniciativas
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#1E305D] leading-tight"
          >
            Proyectos que <span className="text-[#00AB6D]">Transforman</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Descubre cómo estamos impulsando la economía circular en Colombia a través de la innovación y el impacto social.
          </motion.p>
        </div>

        {/* Grid de Proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => ( // Usamos projectsData
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative w-full h-[420px] rounded-[2rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#1E305D] via-[#1E305D]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end text-left">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <span
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full text-white uppercase tracking-wider mb-4 border border-white/20 backdrop-blur-sm"
                    style={{ backgroundColor: `${project.color}DD` }}
                  >
                   <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                   {project.type}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {project.title}
                  </h3>
                  
                  <div className="w-12 h-1 bg-[#00AB6D] mb-4 rounded-full transition-all duration-500 group-hover:w-full opacity-80"></div>

                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                    <div className="overflow-hidden">
                      <p className="text-gray-200 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                        {project.shortDescription} {/* Usamos shortDescription */}
                      </p>
                      
                      {/* CAMBIO AQUI: Button reemplazado por Link */}
                      <Link 
                        to={`/proyectos/${project.id}`} 
                        className="flex items-center gap-2 text-white text-sm font-semibold group/btn w-fit"
                      >
                        Ver detalles
                        <span className="bg-white/20 p-1.5 rounded-full group-hover/btn:bg-[#00AB6D] transition-colors">
                          <ArrowIcon />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}