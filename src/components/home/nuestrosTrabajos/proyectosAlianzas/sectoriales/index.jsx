import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";

// ✅ IMÁGENES LOCALES
import imgGuia from "../../../../../assets/proyectosyalianzas/sectoriales/sectorial1.png";
import imgMetodologia from "../../../../../assets/proyectosyalianzas/sectoriales/sectorial2.png";

// ✅ MODAL PARA VER PDF
import PDFModal from "../../../../../components/PDFModal";

export default function Sectoriales() {
  const [pdfVisible, setPdfVisible] = useState(null);

  const proyectos = [
    {
      titulo: "Guía de gestión integral de residuos sólidos y economía circular",
      subtitulo: "Enfoque en el sector restaurador",
      programa: "Regenera",
      descripcion:
        "Documento técnico que orienta la gestión adecuada de residuos sólidos en establecimientos del sector restaurador, integrando prácticas alineadas con la economía circular.",
      img: imgGuia,
      pdf: "/docs/guia1.pdf",
    },
    {
      titulo: "Metodología para el levantamiento de información",
      subtitulo: "Enfoque en el sector restaurador",
      programa: "Regenera",
      descripcion:
        "Propuesta metodológica que facilita el diagnóstico de residuos mediante herramientas estandarizadas para la recolección y análisis de información.",
      img: imgMetodologia,
      pdf: "/docs/guia2.pdf",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-20 bg-white relative">
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E305D]">
          Proyectos Sectoriales
        </h2>
        <div className="w-20 h-1 bg-[#00AB6D] mx-auto rounded-full mt-3"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-20">
        {proyectos.map((p, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group grid md:grid-cols-2 gap-10 items-center border border-[#7FB8D9] bg-[#B1D35709] rounded-3xl shadow-lg p-8 md:p-12"
          >
            {/* TEXTO */}
            <div className="space-y-4">
              <span className="text-[#2B65AC] font-semibold uppercase">
                {p.programa}
              </span>

              <h3 className="text-2xl md:text-3xl font-bold text-[#1E305D]">
                {p.titulo}
              </h3>

              <p className="text-[#006F63] font-medium">{p.subtitulo}</p>

              <p className="text-gray-700">{p.descripcion}</p>

              {/* ✅ BOTÓN PARA ABRIR EL MODAL */}
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setPdfVisible(index)}
                className="inline-flex items-center gap-2 text-[#006F63] font-semibold mt-4 hover:text-[#00AB6D] transition"
              >
                <FileText className="w-5 h-5" />
                Ver documento
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* IMAGEN */}
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden rounded-3xl shadow-xl w-full"
            >
              <img
                src={p.img}
                alt={p.titulo}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ✅ MODAL FLOTANTE */}
      {pdfVisible !== null && (
        <PDFModal
          file={proyectos[pdfVisible].pdf}
          onClose={() => setPdfVisible(null)}
        />
      )}
    </section>
  );
}
