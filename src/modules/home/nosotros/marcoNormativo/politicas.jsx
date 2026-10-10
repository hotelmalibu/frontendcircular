import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { getPoliticasNormativas, INITIAL_POLITICAS } from "../../../../services/marcoNormativoService";

// Colores del manual de marca oficial
const COLOR_AZUL_PRINCIPAL = '#1E305D';

export default function Politicas() {
  const [politicasList, setPoliticasList] = useState(INITIAL_POLITICAS);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPoliticasNormativas();
        setPoliticasList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn("Error cargando políticas:", err);
        setPoliticasList([]);
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
            Marco Regulatorio
          </span>
          <h1
            className="text-3xl md:text-4xl font-sans font-extrabold mt-3 uppercase tracking-tight"
            style={{ color: COLOR_AZUL_PRINCIPAL }}
          >
            Normativas y Políticas de Interés
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Consulta las directrices, decretos y documentos estratégicos en materia de economía circular y sostenibilidad.
          </p>
        </div>

        {/* Cuadrícula / Grid Tipo Noticias */}
        {politicasList.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white max-w-xl mx-auto p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#1E305D]">No hay políticas o decretos registrados</h3>
            <p className="text-xs text-gray-500 mt-1">Actualmente no se han publicado políticas ni documentos CONPES.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {politicasList.map((politica, index) => {
              const bannerImg = politica.banner || politica.image || politica.cover;
              return (
                <div
                  key={politica.id || index}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group text-left"
                >
                  {/* Portada / Banner superior si existe */}
                  {bannerImg ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={bannerImg}
                        alt={politica.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-[#B1D357] text-[#1E305D] text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                        {politica.category || politica.year || "Política"}
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 pt-6 pb-1 flex items-center justify-between">
                      <span className="bg-[#B1D357] text-[#1E305D] text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                        {politica.category || politica.year || "Política"}
                      </span>
                    </div>
                  )}

                  {/* Cuerpo de la tarjeta */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">
                      {politica.entity || "Política Pública Nacional"}
                    </p>
                    <h3
                      className="text-xl font-bold leading-snug mb-3 line-clamp-2"
                      style={{ color: COLOR_AZUL_PRINCIPAL }}
                    >
                      {politica.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1 text-justify">
                      {politica.description}
                    </p>

                    {/* Botón de Acción */}
                    {politica.pdf && (
                      <a
                        href={politica.pdf}
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