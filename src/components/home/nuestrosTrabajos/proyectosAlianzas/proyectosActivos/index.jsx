import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Download, Filter, X, BookOpen, MapPin, TrendingUp } from "lucide-react";
import PDFModal from "../../../../../components/PDFModal";

// Imágenes Sectoriales
import imgGuia from "../../../../../assets/proyectosyalianzas/sectoriales/sectorial1.png";
import imgMetodologia from "../../../../../assets/proyectosyalianzas/sectoriales/sectorial2.png";

// Imágenes Territoriales
import territorial1 from "../../../../../assets/proyectosyalianzas/territoriales/territorial 1.png";
import territorial2 from "../../../../../assets/proyectosyalianzas/territoriales/territorial2.png";
import territorial3 from "../../../../../assets/proyectosyalianzas/territoriales/territorial3.png";
import territorial4 from "../../../../../assets/proyectosyalianzas/territoriales/territorial4.png";
import territorial5 from "../../../../../assets/proyectosyalianzas/territoriales/territorial5.png";
import territorial6 from "../../../../../assets/proyectosyalianzas/territoriales/territorial6.png";

// Skeleton loader components
const SkeletonCard = ({ isWide }) => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 backdrop-blur-xl rounded-xl shadow-sm border border-gray-300 overflow-hidden ${
      isWide ? "h-48 sm:h-56" : "h-full flex flex-col"
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
    {isWide && (
      <div className="grid sm:grid-cols-2 gap-0 h-full">
        <div className="bg-gradient-to-br from-gray-300 to-gray-200"></div>
        <div className="p-5 space-y-4">
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-8 bg-gray-300 rounded w-20 mt-auto"></div>
        </div>
      </div>
    )}
  </motion.div>
);

export default function ProyectosYAlianzas() {
  const [pdfVisible, setPdfVisible] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const sectoriales = [
    {
      id: "guia-residuos",
      titulo: "Guía de gestión integral de residuos sólidos y economía circular",
      programa: "Gestión",
      categoria: "Residuos",
      descripcion: "Documento técnico que orienta la gestión adecuada de residuos sólidos en establecimientos del sector restaurador, integrando prácticas alineadas con la economía circular.",
      img: imgGuia,
      pdf: "/docs/guia1.pdf",
    },
    {
      id: "metodologia-info",
      titulo: "Metodología para el levantamiento de información",
      programa: "Gestión",
      categoria: "Metodología",
      descripcion: "Propuesta metodológica que facilita el diagnóstico de residuos mediante herramientas estandarizadas para la recolección y análisis de información.",
      img: imgMetodologia,
      pdf: "/docs/guia2.pdf",
    },
  ];

  const territoriales = [
    {
      id: "ciudades-circulares",
      titulo: "Ciudades circulares",
      subtitulo: "Oportunidades de sostenibilidad para los territorios Colombianos",
      categoria: "Política",
      descripcion: "Análisis detallado de oportunidades y estrategias para fortalecer la economía circular en las ciudades colombianas.",
      img: territorial1,
      pdf: "/docs/territoriales/1.pdf",
    },
    {
      id: "reciclabilidad-envases",
      titulo: "Potencial de reciclabilidad de envases y empaques en Colombia",
      categoria: "Envases",
      descripcion: "Evaluación técnica sobre reciclabilidad y aprovechamiento de envases y empaques en el país.",
      img: territorial2,
      pdf: "/docs/territoriales/2.pdf",
    },
    {
      id: "laboratorios-ensayos",
      titulo: "Catálogo de laboratorios y ensayos para envases y empaques de Colombia",
      categoria: "Recursos",
      descripcion: "Directorio especializado con laboratorios certificados para pruebas, análisis y ensayos de envases.",
      img: territorial3,
      pdf: "/docs/territoriales/3.pdf",
    },
    {
      id: "cierre-ciclo-envases",
      titulo: "Innovación para el cierre de ciclo de envases y empaques",
      categoria: "Innovación",
      descripcion: "Documento técnico con estrategias y lineamientos para mejorar el cierre de ciclo de materiales.",
      img: territorial4,
      pdf: "/docs/territoriales/4.pdf",
    },
    {
      id: "dispensacion-granel",
      titulo: "Modelo de dispensación a granel en el sector cosméticos y aseo",
      categoria: "Cosméticos",
      descripcion: "Lineamientos normativos para implementar modelos de dispensación a granel en cosmética y aseo.",
      img: territorial5,
      pdf: "/docs/territoriales/5.pdf",
    },
    {
      id: "pcr-pead",
      titulo: "Guía para la incorporación de PCR (resina reciclada posconsumo) de PEAD en envases",
      categoria: "Envases",
      descripcion: "Guía técnica para la inclusión segura y eficiente de resinas recicladas en envases PEAD.",
      img: territorial6,
      pdf: "/docs/territoriales/6.pdf",
    },
  ];

  const categories = ["all", ...new Set(territoriales.map((p) => p.categoria))];

  const filteredTerritoriales =
    activeFilter === "all"
      ? territoriales
      : territoriales.filter((p) => p.categoria === activeFilter);

  const openPdf = (section, index) => {
    setPdfVisible({ section, index });
  };

  const closePdf = () => setPdfVisible(null);

  const currentPdf = pdfVisible
    ? pdfVisible.section === "sectoriales"
      ? sectoriales[pdfVisible.index]?.pdf
      : territoriales[pdfVisible.index]?.pdf
    : null;

  const handleFilterChange = (category) => {
    setIsLoading(true);
    setActiveFilter(category);
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F8FAFB] to-white">
        {/* ==================== TÍTULO PRINCIPAL ==================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E305D] mb-3">
              Proyectos Activos
            </h1>
          </motion.div>
        </div>

        {/* ==================== CONTENEDOR PRINCIPAL - LADO A LADO ==================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ==================== PROYECTOS SECTORIALES ==================== */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="inline-block px-3 py-1 bg-[#00AB6D]/10 text-[#00AB6D] font-bold text-xs rounded-full border border-[#00AB6D]/30"
                >
                  DOCUMENTOS ESPECIALIZADOS
                </motion.span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#1E305D] mb-2">
                Proyectos Sectoriales
              </h2>
              <div className="w-38 h-1 bg-gradient-to-r from-[#2B65AC] to-[#00AB6D] rounded-full mb-3"></div>
              <p className="text-sm text-gray-700 font-light leading-relaxed">
                Herramientas especializadas para transformar sectores productivos
              </p>
            </motion.div>

            {/* Grid Sectoriales */}
            <div className="grid gap-4">
              {isLoading ? (
                <>
                  <SkeletonCard isWide={true} />
                  <SkeletonCard isWide={true} />
                </>
              ) : (
                sectoriales.map((p, i) => (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="group bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-xl shadow-sm border border-white/60 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="grid sm:grid-cols-2 gap-0 h-48 sm:h-56">
                      {/* Imagen compacta */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#00AB6D]/5 to-[#2B65AC]/5">
                        <motion.img
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6 }}
                          src={p.img}
                          alt={p.titulo}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1E305D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                      </div>

                      {/* Contenido reducido - Text alineado a la izquierda */}
                      <div className="p-5 flex flex-col justify-between">
                        <div className="space-y-3">
                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-1">
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="inline-block px-2 py-0.5 bg-gradient-to-r from-[#2B65AC]/15 to-[#00AB6D]/15 text-[#2B65AC] font-bold text-xs rounded-full border border-[#2B65AC]/30"
                            >
                              {p.programa}
                            </motion.span>
                            <span className="text-xs font-semibold text-[#00AB6D] bg-[#00AB6D]/10 px-1.5 py-0.5 rounded-full">
                              {p.categoria}
                            </span>
                          </div>

                          {/* Título - Left aligned */}
                          <div>
                            <h3 className="text-base font-bold text-[#1E305D] leading-tight group-hover:text-[#00AB6D] transition-colors duration-300 text-left">
                              {p.titulo}
                            </h3>
                            <p className="text-xs text-[#006F63] font-semibold italic mt-1.5 text-left">
                              {p.subtitulo}
                            </p>
                          </div>

                          {/* Descripción */}
                          <p className="text-xs text-gray-700 leading-snug text-left line-clamp-2">
                            {p.descripcion}
                          </p>
                        </div>

                        {/* Botón */}
                        <motion.button
                          whileHover={{ scale: 1.05, x: 2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openPdf("sectoriales", i)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#006F63] to-[#00AB6D] text-white font-bold rounded-md hover:shadow-lg transition-all duration-300 text-xs w-fit mt-3"
                        >
                          <FileText className="w-3 h-3" />
                          Ver
                          <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                ))
              )}
            </div>
          </section>

          {/* ==================== INCIDENCIA TERRITORIAL ==================== */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="inline-block px-3 py-1 bg-[#2B65AC]/10 text-[#2B65AC] font-bold text-xs rounded-full border border-[#2B65AC]/30"
                >
                  DOCUMENTOS TERRITORIALES
                </motion.span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#1E305D] mb-2">
                Incidencia Territorial
              </h2>
              <div className="w-38 h-1 bg-gradient-to-r from-[#2B65AC] to-[#00AB6D] rounded-full mb-3"></div>
              <p className="text-sm text-gray-700 font-light leading-relaxed">
                Documentos estratégicos para territorios circulares
              </p>
            </motion.div>

            {/* Filtros optimizados con mejor transición */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex flex-wrap justify-start gap-1.5"
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange(category)}
                  className={`px-3 py-1 rounded-full font-semibold text-xs transition-all duration-300 ${
                    activeFilter === category
                      ? "bg-gradient-to-r from-[#2B65AC] to-[#00AB6D] text-white shadow-md"
                      : "bg-gray-100 border border-gray-200 text-gray-700 hover:border-[#00AB6D] hover:text-[#00AB6D]"
                  }`}
                >
                  {category === "all" ? "Todos" : category}
                </motion.button>
              ))}
            </motion.div>

            {/* Grid Territoriales - 3 columnas con AnimatePresence */}
            <div>
              {isLoading ? (
                <div className="grid grid-cols-3 gap-3">
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
                    className="grid grid-cols-3 gap-3"
                  >
                    {filteredTerritoriales.map((p, i) => (
                      <motion.article
                        key={p.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="group bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-white/70 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col"
                      >
                        {/* Imagen compacta */}
                        <div className="relative overflow-hidden h-28 bg-gradient-to-br from-[#00AB6D]/10 to-[#2B65AC]/10">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            src={p.img}
                            alt={p.titulo}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1E305D]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>

                          {/* Badge categoría */}
                          <motion.div
                            initial={{ opacity: 0, x: 15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="absolute top-1.5 right-1.5"
                          >
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-white/95 backdrop-blur-md text-[#2B65AC] font-bold text-xs rounded-full shadow-sm border border-white/50">
                              <MapPin className="w-2.5 h-2.5" />
                              {p.categoria}
                            </span>
                          </motion.div>
                        </div>

                        {/* Contenido comprimido - Text alineado a la izquierda */}
                        <div className="p-3 flex flex-col justify-between flex-1">
                          <div className="space-y-2 mb-2">
                            <motion.h3
                              whileHover={{ x: 2 }}
                              className="text-sm font-bold text-[#1E305D] leading-tight group-hover:text-[#00AB6D] transition-colors duration-300 text-left"
                            >
                              {p.titulo}
                            </motion.h3>
                            <p className="text-gray-700 text-xs leading-relaxed line-clamp-1 text-left">
                              {p.descripcion}
                            </p>
                          </div>

                          {/* Botón descargar */}
                          <motion.button
                            whileHover={{ scale: 1.05, x: 2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openPdf("territoriales", territoriales.indexOf(p))}
                            className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#00AB6D] to-[#00D68F] text-white font-bold rounded-md shadow-sm hover:shadow-md transition-all duration-300 text-xs"
                          >
                            <Download className="w-3 h-3" />
                            Descargar
                            <ArrowRight className="w-2.5 h-2.5" />
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
                  className="text-center py-8"
                >
                  <p className="text-gray-600 text-sm">
                    No hay documentos en esta categoría
                  </p>
                </motion.div>
              )}
            </div>
          </section>
          </div>
        </div>
      </div>

      {pdfVisible && currentPdf && (
        <PDFModal file={currentPdf} onClose={closePdf} />
      )}
    </>
  );
}