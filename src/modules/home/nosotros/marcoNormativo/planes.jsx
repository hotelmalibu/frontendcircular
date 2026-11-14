import clientLogger from '../../../../utils/clientLogger';
import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { getPlanesNormativas, INITIAL_PLANES } from "../../../../services/marcoNormativoService";

// Colores del manual de marca oficial
const COLOR_AZUL_PRINCIPAL = '#1E305D';

export default function Planes() {
  const [planesList, setPlanesList] = useState(INITIAL_PLANES);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPlanesNormativas();
        setPlanesList(Array.isArray(data) ? data : []);
      } catch (err) {
        clientLogger.warn("Error cargando planes:", err);
        setPlanesList([]);
      }
    };

    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("normativasUpdated", handleUpdate);
    return () => window.removeEventListener("normativasUpdated", handleUpdate);
  }, []);

  return (
    <div className="font-sans min-h-screen" style={{ color: '#e6e6e6ff' }}>
      <div className="px-6 py-10 mt-24 max-w-6xl mx-auto">

        {/* Encabezado Principal */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-[#B1D357] text-[#1E305D] text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-wider shadow-sm">
            Instrumentos y Estrategias
          </span>
          <h1
            className="text-3xl md:text-4xl font-sans font-extrabold mt-3 uppercase tracking-tight"
            style={{ color: COLOR_AZUL_PRINCIPAL }}
          >
            Planes y Estrategias Nacionales
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Hojas de ruta, programas y lineamientos que impulsan la transición hacia modelos de producción y consumo circulares.
          </p>
        </div>

        {/* Cuadrícula / Grid Tipo Noticias o Estado Vacío */}
        {planesList.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white max-w-xl mx-auto p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#1E305D]">No hay planes ni estrategias registradas</h3>
            <p className="text-xs text-gray-500 mt-1">Actualmente no se han publicado planes ni estrategias.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {planesList.map((plan, index) => {
            const bannerImg = plan.banner || plan.image || plan.cover;
            return (
              <div
                key={plan.id || index}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group text-left"
              >
                {/* Portada / Banner superior si existe */}
                {bannerImg ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={bannerImg}
                      alt={plan.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#B1D357] text-[#1E305D] text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                      {plan.category || plan.year || "Estrategia"}
                    </div>
                  </div>
                ) : (
                  <div className="px-6 pt-6 pb-1 flex items-center justify-between">
                    <span className="bg-[#B1D357] text-[#1E305D] text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                      {plan.category || plan.year || "Estrategia"}
                    </span>
                  </div>
                )}

                {/* Cuerpo de la tarjeta */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">
                    {plan.entity || "Estrategia Nacional"}
                  </p>
                  <h3
                    className="text-xl font-bold leading-snug mb-3 line-clamp-2"
                    style={{ color: COLOR_AZUL_PRINCIPAL }}
                  >
                    {plan.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1 text-justify">
                    {plan.description || plan.desc}
                  </p>

                  {/* Botón de Acción */}
                  {(plan.pdf || plan.file) && (
                    <a
                      href={plan.pdf || plan.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm transition-all duration-300 bg-[#B1D357] text-[#1E305D] hover:bg-[#9cb84d] hover:shadow-md active:scale-95 mt-auto"
                    >
                      <Download size={16} />
                      Ver Documento
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

        <div className="h-10"></div>
      </div>
    </div>
  );
}