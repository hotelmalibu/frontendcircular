import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import HeaderCircular from "../../components/circularmente/HeaderCircular";
import MapSection from "../../components/circularmente/MapSection";
import { Mail } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export default function Circularmente() {
  const { user } = useContext(AuthContext);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionSelect = (region) => {
    console.log("Región seleccionada:", region);
    setSelectedRegion(region);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen overflow-x-hidden font-[Montserrat]">
      {/* 🔹 Encabezado */}
      <HeaderCircular user={user} />


      {/* 🔹 Mapa interactivo */}
      <MapSection onRegionSelect={handleRegionSelect} />

      {/* 🔹 Panel informativo cuando se selecciona una región */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            key="region-detail"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-[#f4f8f7] text-[#0b1a2b] rounded-2xl shadow-md p-10 mx-auto my-10 max-w-4xl text-center"
          >
            <h3 className="text-2xl font-bold text-[#00AB6D] mb-2">
              Región {selectedRegion.nombre}
            </h3>
            <p className="text-gray-700 mb-4">
              <strong>Empresas:</strong> {selectedRegion.empresas} <br />
              <strong>Materiales:</strong> {selectedRegion.materiales}
            </p>
            <button
              onClick={() => setSelectedRegion(null)}
              className="bg-[#006F63] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#00AB6D] transition-all"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Panel de administración (solo visible si hay usuario logueado) */}
      {user && (
        <div />
      )}

      {/* 🔹 Sección de contacto Final */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#006F63] to-[#00AB6D] rounded-[2rem] p-12 shadow-2xl text-white relative overflow-hidden"
          >
            {/* Círculos decorativos */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 relative z-10">
              ¿Listo para transformar el futuro?
            </h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Si tienes dudas, propuestas o quieres ser parte de la red de economía circular, no dudes en contactarnos.
            </p>
            
            <a
              href="mailto:gsabogal@andi.com.co"
              className="inline-flex items-center gap-3 bg-white text-[#006F63] px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative z-10 group"
            >
              <Mail className="group-hover:animate-bounce" />
              Enviar un correo a gsabogal@andi.com.co
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
