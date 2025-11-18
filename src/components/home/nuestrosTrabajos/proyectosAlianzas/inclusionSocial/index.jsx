import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import PDFModal from "../../../../../components/PDFModal";

// ✅ IMAGEN TEMPORAL (reemplázala por la tuya)
import inclusion1 from "../../../../../assets/proyectosyalianzas/inclusionsocial/inclusion1.png";

export default function InclusionSocial() {
  const [pdfVisible, setPdfVisible] = useState(null);

  const proyectos = [
    {
      titulo: "Diagnóstico de barreras y facilitadores de la separación de residuos aprovechables",
      descripcion:
        "Estudio que identifica los principales obstáculos y factores habilitadores para mejorar la separación en la fuente de residuos aprovechables, promoviendo prácticas responsables y fortaleciendo procesos de inclusión social en las cadenas de reciclaje.",
      img: inclusion1, // ✅ Imagen local
      pdf: "/docs/inclusionsocial/1.pdf", // ✅ PDF local
    },
  ];

  return (
    <section className="py-24 px-6 md:px-20 bg-white relative">
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E305D]">
          Inclusión Social
        </h2>
        <div className="w-24 h-1 bg-[#00AB6D] mx-auto rounded-full mt-4"></div>

        <p className="text-[#1E305D]/70 text-lg max-w-3xl mx-auto mt-6">
          Iniciativas que fortalecen la participación de comunidades y actores
          sociales dentro de los procesos de economía circular, promoviendo
          inclusión, equidad y sostenibilidad.
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
            {/* Imagen grande */}
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

              <p className="text-gray-700 text-lg leading-relaxed">
                {p.descripcion}
              </p>

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
