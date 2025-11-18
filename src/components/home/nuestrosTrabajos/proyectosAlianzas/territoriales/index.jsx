import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import PDFModal from "../../../../../components/PDFModal";

// ✅ IMÁGENES LOCALES
import territorial1 from "../../../../../assets/proyectosyalianzas/territoriales/territorial 1.png";
import territorial2 from "../../../../../assets/proyectosyalianzas/territoriales/territorial2.png";
import territorial3 from "../../../../../assets/proyectosyalianzas/territoriales/territorial3.png";
import territorial4 from "../../../../../assets/proyectosyalianzas/territoriales/territorial4.png";
import territorial5 from "../../../../../assets/proyectosyalianzas/territoriales/territorial5.png";
import territorial6 from "../../../../../assets/proyectosyalianzas/territoriales/territorial6.png";

export default function IncidenciaTerritorial() {
  const [pdfVisible, setPdfVisible] = useState(null);

  const proyectos = [
    {
      titulo: "Ciudades circulares",
      subtitulo: "Oportunidades de sostenibilidad para los territorios Colombianos",
      descripcion:
        "Análisis detallado de oportunidades y estrategias para fortalecer la economía circular en las ciudades colombianas.",
      img: territorial1,
      pdf: "/docs/territoriales/1.pdf",
    },
    {
      titulo: "Potencial de reciclabilidad de envases y empaques en Colombia",
      descripcion:
        "Evaluación técnica sobre reciclabilidad y aprovechamiento de envases y empaques en el país.",
      img: territorial2,
      pdf: "/docs/territoriales/2.pdf",
    },
    {
      titulo: "Catálogo de laboratorios y ensayos para envases y empaques de Colombia",
      descripcion:
        "Directorio especializado con laboratorios certificados para pruebas, análisis y ensayos de envases.",
      img: territorial3,
      pdf: "/docs/territoriales/3.pdf",
    },
    {
      titulo: "Innovación para el cierre de ciclo de envases y empaques",
      descripcion:
        "Documento técnico con estrategias y lineamientos para mejorar el cierre de ciclo de materiales.",
      img: territorial4,
      pdf: "/docs/territoriales/4.pdf",
    },
    {
      titulo: "Modelo de dispensación a granel en el sector cosméticos y aseo",
      descripcion:
        "Lineamientos normativos para implementar modelos de dispensación a granel en cosmética y aseo.",
      img: territorial5,
      pdf: "/docs/territoriales/5.pdf",
    },
    {
      titulo:
        "Guía para la incorporación de PCR (resina reciclada posconsumo) de PEAD en envases",
      descripcion:
        "Guía técnica para la inclusión segura y eficiente de resinas recicladas en envases PEAD.",
      img: territorial6,
      pdf: "/docs/territoriales/6.pdf",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-20 bg-white relative">
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E305D]">
          Incidencia Territorial
        </h2>
        <div className="w-24 h-1 bg-[#00AB6D] mx-auto rounded-full mt-4"></div>

        <p className="text-[#1E305D]/70 text-lg max-w-3xl mx-auto mt-6">
          Documentos técnicos y herramientas orientadas al desarrollo territorial
          sostenible y la adopción de modelos de economía circular.
        </p>
      </div>

      {/* ✅ LISTA HORIZONTAL */}
      <div className="max-w-6xl mx-auto space-y-20">
        {proyectos.map((p, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
              group 
              grid md:grid-cols-2 
              gap-10 
              items-center 
              rounded-3xl 
              shadow-lg 
              border border-[#7FB8D9]
              bg-[#B1D35709]
              p-8 md:p-12
              hover:shadow-2xl 
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            {/* Imagen más grande */}
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl overflow-hidden shadow-xl w-full h-full"
            >
              <img
                src={p.img}
                alt={p.titulo}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Texto */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-[#1E305D] leading-snug">
                {p.titulo}
              </h3>

              {p.subtitulo && (
                <p className="text-[#006F63] font-medium">{p.subtitulo}</p>
              )}

              <p className="text-gray-700 text-lg leading-relaxed">
                {p.descripcion}
              </p>

              {/* Botón para abrir PDF */}
              <motion.button
                whileHover={{ x: 6 }}
                onClick={() => setPdfVisible(index)}
                className="inline-flex items-center gap-2 text-[#006F63] font-semibold mt-4 hover:text-[#00AB6D] transition"
              >
                <FileText className="w-5 h-5" />
                Ver documento
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal PDF */}
      {pdfVisible !== null && (
        <PDFModal
          file={proyectos[pdfVisible].pdf}
          onClose={() => setPdfVisible(null)}
        />
      )}
    </section>
  );
}
