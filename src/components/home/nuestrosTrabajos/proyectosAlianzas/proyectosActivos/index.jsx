import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { getImageProxyUrl } from "../../../../../utils/imageUtils.js";
import { getAllProjects } from "../../../../../api/projectsApi.js";
import { getProjectTypes } from "../../../../../api/projectTypesApi.js";

const FORTALECIMIENTO_CATEGORY_ID = "01ke5g3mwyt6q8fx5e4n9x3z7h";

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

const ProjectCard = ({ p, i }) => {
  // Extract text for preview if it's HTML
  const plainDescription = p.description ? p.description.replace(/<[^>]*>?/gm, '') : (p.descripcion || "");
  const imageUrl = p.cover_image?.url || p.cover_image_url || p.img || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400";

  // Construct file URL based on Communications module logic
  const fileUrl = p.upload_file?.path
    ? `https://api-ecocircular.creativostecnologicosit.com/storage/${p.upload_file.path}`
    : (p.file_url || null);

  return (
    <motion.article
      key={p.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
    >
      <Link to={`/proyectos/${p.id}`} className="relative overflow-hidden h-40 bg-gray-100 block">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={getImageProxyUrl(imageUrl, { width: 600, quality: 80 })}
          alt={p.title || p.titulo}
          className="w-full h-full object-cover"
          onError={(e) => {
            if (e.target.src !== "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400") {
              e.target.src = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400";
            }
          }}
        />

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#2B65AC] font-bold text-[10px] rounded-full shadow-sm border border-gray-100 uppercase tracking-wider">
            <MapPin className="w-2.5 h-2.5" />
            {p.classification_type?.label || p.categoria || "Proyecto"}
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link to={`/proyectos/${p.id}`} className="mb-4 flex-1 block group">
          <h3 className="text-lg font-bold text-[#1E305D] leading-tight mb-2 group-hover:text-[#00AB6D] transition-colors duration-300">
            {p.title || p.titulo}
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 font-medium">
            {plainDescription}
          </p>
        </Link>

        <motion.a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 text-white font-bold rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm ${fileUrl ? "bg-[#00C18A]" : "bg-gray-300 cursor-not-allowed"
            }`}
          onClick={(e) => !fileUrl && e.preventDefault()}
        >
          <Download className="w-4 h-4" />
          {fileUrl ? "Descargar" : "No disponible"}
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.a>
      </div>
    </motion.article>
  );
};

export default function ProyectosYAlianzas() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [territorialProjects, setTerritorialProjects] = useState([]);
  const [sectorialProjects, setSectorialProjects] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch project types
        const typesResponse = await getProjectTypes();
        const types = typesResponse?.data?.items || [];

        const territorialType = types.find(t => t.label?.toLowerCase().includes("territorial"));
        const sectorialType = types.find(t => t.label?.toLowerCase().includes("sectorial"));

        // Fetch projects for Fortalecimiento category
        const projectsResponse = await getAllProjects({
          category_id: FORTALECIMIENTO_CATEGORY_ID,
          per_page: 100 // Get all for filtering
        });

        const allProjects = projectsResponse?.data?.items || [];

        // Extract classifications for the filter bar
        const classifications = ["all", ...new Set(allProjects.map(p => p.classification_type?.label).filter(Boolean))];
        setCategories(classifications);

        // Group projects
        setTerritorialProjects(allProjects.filter(p => p.project_type_id === territorialType?.id));
        setSectorialProjects(allProjects.filter(p => p.project_type_id === sectorialType?.id));

      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Error al cargar los proyectos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (category) => {
    setActiveFilter(category);
  };

  const filterFn = (p) => activeFilter === "all" || p.classification_type?.label === activeFilter;

  const filteredTerritorial = territorialProjects.filter(filterFn);
  const filteredSectorial = sectorialProjects.filter(filterFn);

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
        {/* Filtros (Diseño original) */}
        {!isLoading && categories.length > 1 && (
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
        )}

        <div className="space-y-20">
          {/* SECCIÓN TERRITORIAL */}
          <section id="territorial">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-[#1E305D]">Proyectos Territoriales</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
            </div>

            <div className="min-h-[200px]">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : filteredTerritorial.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredTerritorial.map((p, i) => (
                    <ProjectCard key={p.id} p={p} i={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400">No hay proyectos territoriales disponibles.</p>
                </div>
              )}
            </div>
          </section>

          {/* SECCIÓN SECTORIAL */}
          <section id="sectorial">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-[#1E305D]">Proyectos Sectoriales</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
            </div>

            <div className="min-h-[200px]">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : filteredSectorial.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredSectorial.map((p, i) => (
                    <ProjectCard key={p.id} p={p} i={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400">No hay proyectos sectoriales disponibles.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {error && (
          <div className="text-center p-4 bg-red-50 text-red-600 rounded-xl mt-8">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
