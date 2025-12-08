import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAllProjects } from "../../api/projectsApi";
import proyecto1 from "../../assets/home/Proyectos/proyecto1.png";
import proyecto2 from "../../assets/home/Proyectos/proyecto2.png";
import proyecto3 from "../../assets/home/Proyectos/proyecto3.png";
import proyecto4 from "../../assets/home/Proyectos/proyecto4.png";
import proyecto5 from "../../assets/home/Proyectos/proyecto5.png";
import proyecto6 from "../../assets/home/Proyectos/proyecto6.png";

// Category to image mapping
const categoryImages = {
  "Fortalecimiento": proyecto1,
  "Innovacion": proyecto2,
  "Sensibilizacion": proyecto3,
  "Investigacion": proyecto4,
  "Produccion": proyecto5,
  "Economia": proyecto6,
};

// Category to color mapping
const categoryColors = {
  "Fortalecimiento": "#1E305D",
  "Innovacion": "#00AB6D",
  "Sensibilizacion": "#1E305D",
  "Investigacion": "#00AB6D",
  "Produccion": "#1E305D",
  "Economia": "#00AB6D",
};

// Icono SVG simple
const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllProjects();

        let projectsArray = [];
        if (response?.data?.items && Array.isArray(response.data.items)) {
          projectsArray = response.data.items;
        } else if (Array.isArray(response)) {
          projectsArray = response;
        } else if (response?.data?.projects && Array.isArray(response.data.projects)) {
          projectsArray = response.data.projects;
        } else if (response?.data && Array.isArray(response.data)) {
          projectsArray = response.data;
        } else if (response?.projects && Array.isArray(response.projects)) {
          projectsArray = response.projects;
        } else if (typeof response === 'object' && response !== null) {
          const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            projectsArray = possibleArrays[0];
          }
        }

        // Map API data to component expected format
        const mappedProjects = projectsArray.map(project => ({
          id: project.id,
          title: project.title,
          type: project.category,
          color: categoryColors[project.category] || "#1E305D",
          image: categoryImages[project.category] || "/assets/home/Proyectos/proyecto1.png",
          shortDescription: project.description || "Sin descripción disponible",
        }));

        setProjects(mappedProjects);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar los proyectos");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 px-6 md:px-12 text-center overflow-hidden bg-cover bg-center">
        <div className="absolute inset-0 bg-[#F4F7F6]/90 mix-blend-overlay z-0 pointer-events-none"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 px-6 md:px-12 text-center overflow-hidden bg-cover bg-center">
        <div className="absolute inset-0 bg-[#F4F7F6]/90 mix-blend-overlay z-0 pointer-events-none"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="text-center py-20">
            <p className="text-red-600">Error al cargar proyectos: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 px-6 md:px-12 text-center overflow-hidden bg-cover bg-center">
      <div className="absolute inset-0 bg-[#F4F7F6]/90 mix-blend-overlay z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto">

        {/* Encabezado */}
        <div className="text-center mb-12 space-y-4">
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
            Descubre cómo estamos impulsando la economía circular en Colombia.
          </motion.p>
        </div>

        {/* Grid de Proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              
              // CAMBIO 1: Reduje la altura de h-[340px] a h-[280px] para que sea menos alta
              className="group relative w-full h-[280px] rounded-[1.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Imagen de fondo */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  // CAMBIO 2: Agregué 'object-bottom'. Esto fuerza a que se vea la parte de abajo de la imagen.
                  className="w-full h-full object-cover object-bottom transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Filtro oscuro inferior */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Contenido de la tarjeta */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-left">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <span
                    className="inline-flex items-center gap-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider mb-3 border border-white/20 backdrop-blur-sm"
                    style={{ backgroundColor: `${project.color}DD` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    {project.type}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {project.title}
                  </h3>
                  
                  <div className="w-10 h-1 bg-[#00AB6D] mb-3 rounded-full transition-all duration-500 group-hover:w-full opacity-80"></div>

                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                    <div className="overflow-hidden">
                      <p className="text-gray-200 text-xs leading-relaxed mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 line-clamp-3">
                        {project.shortDescription}
                      </p>
                      
                      <Link 
                        to={`/proyectos/${project.id}`} 
                        className="flex items-center gap-2 text-white text-xs font-semibold group/btn w-fit hover:text-[#00AB6D] transition-colors"
                      >
                        Ver detalles
                        <ArrowIcon />
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