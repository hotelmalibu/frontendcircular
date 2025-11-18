import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import HeaderCircular from "../../components/circularmente/HeaderCircular";
import MapSection from "../../components/circularmente/MapSection";
import DirectorySection from "../../components/circularmente/DirectorySection";
import AdminPanel from "../../components/circularmente/AdminPanel";
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

      {/* 🔹 Directorio de empresas */}
      <DirectorySection selectedRegion={selectedRegion} user={user} />

      {/* 🔹 Panel de administración (solo visible si hay usuario logueado) */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          
        </motion.div>
      )}
    </div>
  );
}
