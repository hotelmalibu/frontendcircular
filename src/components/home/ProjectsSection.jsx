import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAllProjects } from "../../api/projectsApi";
import { getImageProxyUrl } from "../../utils/imageUtils";
import { stripHtml } from "../../utils/textUtils";

// Import specific category images
import imgFortalecimiento from "../../assets/home/Proyectos/Fortalecimiento.png";
import imgInnovacion from "../../assets/home/Proyectos/Innovacion.png";
import imgConsumo from "../../assets/home/Proyectos/ConsumoResponsable.png";
import imgEstrategicos from "../../assets/home/Proyectos/ProyectosEstrategicos.png";
import imgInclusion from "../../assets/home/Proyectos/Inclusion.png";

// Category to image mapping
const categoryImages = {
  "Fortalecimiento": imgFortalecimiento,
  "Innovación": imgInnovacion,
  "Innovacion": imgInnovacion,
  "Consumo Responsable": imgConsumo,
  "Consumo": imgConsumo,
  "Proyectos Estratégicos": imgEstrategicos,
  "Estratégicos": imgEstrategicos,
  "Inclusión": imgInclusion,
  "Inclusion": imgInclusion,
  // Fallbacks or extra mappings
  "Investigacion": imgInnovacion,
  "Produccion": imgFortalecimiento,
  "Economia": imgConsumo,
};

// Category to color mapping
const categoryColors = {
  "Fortalecimiento": "#1E305D",
  "Innovación": "#00AB6D",
  "Innovacion": "#00AB6D",
  "Consumo Responsable": "#1E305D",
  "Consumo": "#1E305D",
  "Proyectos Estratégicos": "#00AB6D",
  "Estratégicos": "#00AB6D",
  "Inclusión": "#1E305D",
  "Inclusion": "#1E305D",
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const responseData = await getAllProjects();

        let projectsArray = [];
        // Since getAllProjects returns response.data, responseData is the body
        if (responseData?.items && Array.isArray(responseData.items)) {
          projectsArray = responseData.items;
        } else if (Array.isArray(responseData)) {
          projectsArray = responseData;
        } else if (responseData?.data?.items && Array.isArray(responseData.data.items)) {
          // Fallback just in case api-index interceptor or similar is involved
          projectsArray = responseData.data.items;
        } else if (responseData?.projects && Array.isArray(responseData.projects)) {
          projectsArray = responseData.projects;
        } else if (typeof responseData === 'object' && responseData !== null) {
          const possibleArrays = Object.values(responseData).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            projectsArray = possibleArrays[0];
          }
        }

        // Map API data to component expected format
        const mappedProjects = projectsArray.map(project => {
          if (!project) return null;

          // Handle category as string or object
          let catName = project.category_name || "";
          if (!catName && project.category) {
            catName = typeof project.category === 'object' ? project.category.name : project.category;
          }

          return {
            id: project.id,
            title: project.title || "Sin título",
            type: catName || "General",
            color: categoryColors[catName] || "#1E305D",
            customImage: getImageProxyUrl(project.cover_image?.url || project.cover_image_url || project.cover_image, { width: 600, quality: 80 }),
            defaultImage: categoryImages[catName] || "/assets/home/Proyectos/proyecto1.png",
            shortDescription: stripHtml(project.description) || "Sin descripción disponible",
          };
        }).filter(Boolean); // Remote potential nulls

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
    <section id="projects-section" className="relative py-20 px-6 md:px-12 text-center overflow-hidden bg-cover bg-center">
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
          {projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((project, index) => (
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
                  src={project.customImage || project.defaultImage}
                  alt={project.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = project.defaultImage;
                  }}
                  // CAMBIO 2: Agregué 'object-bottom'. Esto fuerza a que se vea la parte de abajo de la imagen.
                  className="w-full h-full object-cover object-bottom transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Filtro oscuro inferior */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Contenido de la tarjeta */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-left">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="inline-block text-[12px] font-bold text-white uppercase tracking-wider mb-3 drop-shadow-md">
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

        {/* Paginación */}
        {projects.length > itemsPerPage && (
          <div className="mt-16 flex justify-center items-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-3 rounded-full border-2 transition-all ${currentPage === 1
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-[#00AB6D] text-[#00AB6D] hover:bg-[#00AB6D] hover:text-white"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            <div className="flex gap-2">
              {[...Array(Math.ceil(projects.length / itemsPerPage))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: document.getElementById('projects-section')?.offsetTop - 100, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${currentPage === i + 1
                      ? "bg-[#1E305D] text-white shadow-lg"
                      : "text-gray-400 hover:text-[#1E305D] hover:bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(projects.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(projects.length / itemsPerPage)}
              className={`p-3 rounded-full border-2 transition-all ${currentPage === Math.ceil(projects.length / itemsPerPage)
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-[#00AB6D] text-[#00AB6D] hover:bg-[#00AB6D] hover:text-white"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}