import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, MapPin, Globe, Briefcase, Filter, Search, X } from "lucide-react";
import { getImageProxyUrl } from "../../../../../utils/imageUtils.js";
import { getAllProjects } from "../../../../../api/projectsApi.js";
import { getProjectTypes } from "../../../../../api/projectTypesApi.js";
import { getAllCategories } from "../../../../../api/categoriesApi.js";
import { stripHtml, decodeHtmlEntities } from "../../../../../utils/textUtils.js";


// Import specific category images
import imgFortalecimiento from "../../../../../assets/home/Proyectos/Fortalecimiento.png";
import imgInnovacion from "../../../../../assets/home/Proyectos/Innovacion.png";
import imgConsumo from "../../../../../assets/home/Proyectos/ConsumoResponsable.png";
import imgEstrategicos from "../../../../../assets/home/Proyectos/ProyectosEstrategicos.png";
import imgInclusion from "../../../../../assets/home/Proyectos/Inclusion.png";

const CATEGORY_IMAGES = {
  "Fortalecimiento": imgFortalecimiento,
  "Innovación": imgInnovacion,
  "Innovacion": imgInnovacion,
  "Consumo Responsable": imgConsumo,
  "Consumo": imgConsumo,
  "Proyectos Estratégicos": imgEstrategicos,
  "Estratégicos": imgEstrategicos,
  "Inclusión": imgInclusion,
  "Inclusion": imgInclusion,
};

const FORTALECIMIENTO_CATEGORY_NAME = "Fortalecimiento";

// Skeleton loader components
const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 backdrop-blur-xl rounded-xl shadow-sm border border-gray-300 overflow-hidden h-full flex flex-col"
  >
    <div className="h-40 bg-gradient-to-br from-gray-300 to-gray-200"></div>
    <div className="p-5 space-y-3 flex-1">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-full"></div>
      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      <div className="h-10 bg-gray-300 rounded mt-auto"></div>
    </div>
  </motion.div>
);

const ProjectCard = ({ p, i }) => {
  const plainDescription = stripHtml(p.description || p.descripcion || "");


  // Lógica de fallback de imagen por categoría
  const catName = decodeHtmlEntities(p.category_name || p.category?.name || "");

  const categoryFallback = CATEGORY_IMAGES[catName] || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400";

  const imageUrl = p.cover_image?.url || p.cover_image_url || p.img || categoryFallback;

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
            if (e.target.src !== categoryFallback) {
              e.target.src = categoryFallback;
            }
          }}
        />

        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#2B65AC] font-bold text-[10px] rounded-full shadow-sm border border-gray-100 uppercase tracking-wider">
            <MapPin className="w-2.5 h-2.5" />
            {decodeHtmlEntities(p.classification_type?.label || p.categoria || "Proyecto")}
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link to={`/proyectos/${p.id}`} className="mb-4 flex-1 block group">
          <h3 className="text-lg font-bold text-[#1E305D] leading-tight mb-2 group-hover:text-[#00AB6D] transition-colors duration-300">
            {decodeHtmlEntities(p.title || p.titulo)}
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
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeCategory, setActiveCategory] = useState({ id: "all", name: "Todos" });
  const [activeSection, setActiveSection] = useState("territorial"); // 'territorial' | 'sectorial'
  const [allProjects, setAllProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [territorialTypeId, setTerritorialTypeId] = useState(null);
  const [sectorialTypeId, setSectorialTypeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [catsResponse, projectsResponse, typesResponse] = await Promise.all([
          getAllCategories(),
          getAllProjects({ per_page: 100 }),
          getProjectTypes()
        ]);

        const cats = catsResponse?.data?.items || [];
        setCategories([{ id: "all", name: "Todos los proyectos" }, ...cats]);

        const projects = projectsResponse?.data?.items || [];
        setAllProjects(projects.filter(p => p.status === 'published'));

        const types = typesResponse?.data?.items || [];
        const tType = types.find(t => t.label?.toLowerCase().includes("territorial"));
        const sType = types.find(t => t.label?.toLowerCase().includes("sectorial"));
        setTerritorialTypeId(tType?.id);
        setSectorialTypeId(sType?.id);

      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Error al cargar los proyectos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (cat) => {
    setIsFiltering(true);
    setActiveCategory(cat);
    if (cat.name !== FORTALECIMIENTO_CATEGORY_NAME) {
      setActiveSection(null);
    } else {
      setActiveSection("territorial");
    }
    setTimeout(() => setIsFiltering(false), 400);
  };

  const handleSectionChange = (section) => {
    setIsFiltering(true);
    setActiveSection(section);
    setTimeout(() => setIsFiltering(false), 300);
  };

  let filteredProjects = activeCategory.id === "all"
    ? allProjects
    : allProjects.filter(p => p.category_id === activeCategory.id);

  if (activeCategory.name === FORTALECIMIENTO_CATEGORY_NAME) {
    const typeId = activeSection === "territorial" ? territorialTypeId : sectorialTypeId;
    filteredProjects = filteredProjects.filter(p => p.project_type_id === typeId);
  }

  // Filtrado por buscador
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredProjects = filteredProjects.filter(p =>
      (p.title || p.titulo || "").toLowerCase().includes(query)
    );
  }

  const isFortalecimiento = activeCategory.name === FORTALECIMIENTO_CATEGORY_NAME;

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
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Explora nuestras iniciativas y herramientas técnicas diseñadas para impulsar la economía circular.
          </p>
        </motion.div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 mt-12">

        {/* ── PANEL DE FILTROS UNIFICADO ── */}
        <div className="mb-10">

          {/* Buscador */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 transition-colors duration-300 ${searchQuery ? "text-[#2B65AC]" : "text-gray-400"}`} />
              </div>
              <input
                type="text"
                placeholder="Buscar proyectos por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-[#2B65AC]/10 focus:border-[#2B65AC] outline-none transition-all duration-300 text-gray-700 font-medium placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                  title="Limpiar búsqueda"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Etiqueta + chips de categoría */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#2B65AC]" />
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Filtrar por Categoría</span>
              {activeCategory.id !== "all" && (
                <button
                  onClick={() => handleCategoryChange({ id: "all", name: "Todos" })}
                  className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-colors"
                >
                  <X className="w-2.5 h-2.5" /> Limpiar
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2.5">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 w-32 bg-gray-100 animate-pulse rounded-full" />
                ))
              ) : (
                categories.map((cat) => {
                  const isActive = activeCategory.id === cat.id;
                  const catImg = CATEGORY_IMAGES[cat.name];
                  const count = cat.id === "all"
                    ? allProjects.length
                    : allProjects.filter(p => p.category_id === cat.id).length;

                  return (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCategoryChange(cat)}
                      className={`relative inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full font-bold text-sm transition-all duration-300 border ${
                        isActive
                          ? "bg-[#1E305D] text-white border-[#1E305D] shadow-lg shadow-[#1E305D]/20"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#2B65AC] hover:text-[#2B65AC] hover:shadow-sm"
                      }`}
                    >
                      {catImg && (
                        <span className={`w-6 h-6 rounded-full overflow-hidden flex-shrink-0 ${isActive ? "ring-2 ring-white/40" : "ring-1 ring-gray-100"}`}>
                          <img src={catImg} alt={cat.name} className="w-full h-full object-cover" />
                        </span>
                      )}
                      <span>{decodeHtmlEntities(cat.name)}</span>
                      <span className={`ml-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {count}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* SELECTOR TERRITORIAL / SECTORIAL (solo para Fortalecimiento) */}
        <AnimatePresence>
          {isFortalecimiento && !isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center mb-10 overflow-hidden"
            >
              <div className="bg-[#1E305D]/5 p-1 rounded-2xl flex gap-1 border border-[#1E305D]/10">
                <button
                  onClick={() => handleSectionChange("territorial")}
                  className={`px-7 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                    activeSection === "territorial"
                      ? "bg-[#2B65AC] text-white shadow-md"
                      : "text-[#1E305D]/60 hover:bg-white hover:text-[#1E305D]"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Territoriales
                </button>
                <button
                  onClick={() => handleSectionChange("sectorial")}
                  className={`px-7 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                    activeSection === "sectorial"
                      ? "bg-[#00AB6D] text-white shadow-md"
                      : "text-[#1E305D]/60 hover:bg-white hover:text-[#1E305D]"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Sectoriales
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contador de resultados */}
        <AnimatePresence>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-6 px-1"
            >
              <p className="text-sm text-gray-500 font-medium">
                <span className="font-black text-[#1E305D]">{filteredProjects.length}</span>
                {" "}proyecto{filteredProjects.length !== 1 ? "s" : ""} encontrado{filteredProjects.length !== 1 ? "s" : ""}
                {activeCategory.id !== "all" && (
                  <span className="text-gray-400"> en <span className="font-bold text-[#2B65AC]">{decodeHtmlEntities(activeCategory.name)}</span></span>
                )}
              </p>
              {(searchQuery || activeCategory.id !== "all") && (
                <button
                  onClick={() => { setSearchQuery(""); handleCategoryChange({ id: "all", name: "Todos" }); }}
                  className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Limpiar todo
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid de Proyectos */}
        <div className="min-h-[400px] relative">
          <AnimatePresence mode="wait">
            {(isLoading || isFiltering) ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : filteredProjects.length > 0 ? (
              <motion.div
                key={`${activeCategory.id}-${activeSection}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProjects.map((p, i) => (
                  <ProjectCard key={p.id} p={p} i={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron proyectos</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Actualmente no hay proyectos disponibles en la categoría seleccionada.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="text-center p-6 bg-red-50 text-red-600 rounded-2xl mt-8 font-medium border border-red-100 shadow-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
