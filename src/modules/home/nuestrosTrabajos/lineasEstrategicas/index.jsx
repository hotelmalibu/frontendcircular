import React, { useState } from "react";

// --- IMPORTACIÓN DE IMÁGENES ---
// Asegúrate de que las rutas sean correctas
import imgProyectos from "../../../../assets/lineasestrategicas/proyectos.png";
import imgPedagogia from "../../../../assets/lineasestrategicas/Pedagogia.png";
import imgInnovacion from "../../../../assets/lineasestrategicas/innovacion.png";
import imgInclusion from "../../../../assets/lineasestrategicas/inclusion.png";
import imgConsumo from "../../../../assets/lineasestrategicas/consumoresponsable.png";
import imgCadenas from "../../../../assets/lineasestrategicas/cadenasdevalor.png";

// --- DATOS UNIFICADOS ---
const DATA_LINEAS = [
  {
    id: "proyectos",
    title: "Proyectos",
    highlight: "Estratégicos",
    description: "Estrategias para impulsar modelos circulares mediante procesos de generación de capacidades territoriales y sectoriales que generen impactos económicos, sociales y ambientales.",
    colorAcento: "#2B65AC",
    iconColor: "#ffffff",
    img: imgProyectos,
    bgGradient: "from-white to-purple-50",
    boxTitle: "Enfoque y Alcance",
    boxText: "Impulsamos estrategias territoriales que permiten validar y escalar modelos de economía circular en diferentes sectores productivos y regiones.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: "pedagogia",
    title: "Pedagogía y",
    highlight: "Sensibilización",
    description: (
      <>
        Diseñamos e implementamos estrategias educativas para <span className="font-semibold text-gray-900">transformar la cultura</span> del consumo y promover la sostenibilidad.
      </>
    ),
    colorAcento: "#F59E0B",
    iconColor: "#ffffff",
    img: imgPedagogia,
    bgGradient: "from-white to-yellow-50",
    boxTitle: "Enfoque y Alcance",
    boxText: "Buscamos generar consciencia en el consumidor final mediante campañas de comunicación y pedagogía que fomenten la separación adecuada en la fuente.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    )
  },
  {
    id: "innovacion",
    title: "Línea de",
    highlight: "Innovación",
    description: "Investigación aplicada y desarrollo experimental enfocados en dinamizar el ecosistema de Ciencia, Tecnología e Innovación (CTeI), para el cierre de ciclo de envases, empaques y PUSU, basados en modelos de negocio circulares.",
    colorAcento: "#9E1981",
    iconColor: "#ffffffff",
    img: imgInnovacion,
    bgGradient: "from-white to-pink-50",
    boxTitle: "Enfoque y Alcance",
    boxText: "Impulsamos la búsqueda y transferencia de nuevas tecnologías para optimizar procesos, incrementar la eficiencia y fortalecer la circularidad.",
    boxBgSpecific: "#1C2C5A",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    id: "inclusion",
    title: "Inclusión Social y",
    highlight: "Productiva",
    description: "Cierre de brechas de las organizaciones de recicladores y transformadores para fortalecer su competitividad y promover una transición justa hacia modelos de negocio circulares.",
    colorAcento: "#CD0000",
    iconColor: "#ffffff",
    img: imgInclusion,
    bgGradient: "from-white to-red-50",
    boxTitle: "Enfoque y Alcance",
    boxText: "Garantizamos que los beneficios de la economía circular lleguen a todos los actores, fomentando la formalización y la inclusión productiva real.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: "consumo",
    title: "Fomento del",
    highlight: "Consumo Responsable",
    description: "Sensibilizar y contribuir al cambio de hábitos y comportamiento del consumidor fomentando la correcta separación en la fuente.",
    colorAcento: "#E8AD00",
    iconColor: "#ffffff",
    img: imgConsumo,
    bgGradient: "from-white to-yellow-50",
    boxTitle: "Enfoque y Alcance",
    boxText: "Esta línea busca formar consumidores conscientes, promoviendo prácticas que aporten directamente al ciclo de la economía circular.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: "cadenas",
    title: "Fortalecimiento de",
    highlight: "Cadenas de Valor",
    description: "Modelo de articulación y encadenamientos para la optimización de ecosistemas locales de aprovechamiento mediante la generación de valor entre actores de la cadena para el cumplimiento normativo en REP, aportando a estrategias corporativas.",
    colorAcento: "#8CB200",
    iconColor: "#ffffff",
    img: imgCadenas,
    bgGradient: "from-white to-green-50",
    boxTitle: "Enfoque y Alcance",
    boxText: "Buscamos cerrar el ciclo de vida de envases y empaques, promoviendo la colaboración total entre productores, gestores y transformadores.",
    iconSvg: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    )
  }
];

const COLOR_AZUL_PRINCIPAL = "#1E305D";

export default function LineasEstrategicasPage() {
  const [selectedId, setSelectedId] = useState(null);
  const activeData = DATA_LINEAS.find((item) => item.id === selectedId);

  return (
    // AJUSTE: Se agregó 'bg-gray-100' para el fondo gris claro
    <div className="mt-28 font-sans min-h-[60vh] flex flex-col items-center justify-center p-4 pb-10 bg-gray-100">
      
      {/* --- TÍTULO --- */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#1E305D] mb-8 text-center tracking-wider">
        Líneas estratégicas
      </h1>

      {/* --- TARJETA PRINCIPAL --- */}
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[380px] border border-gray-100">
        
        {/* --- COLUMNA IZQUIERDA: MENÚ --- */}
        <div className="w-full md:w-5/12 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto custom-scrollbar">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3 text-center">
            Selecciona una Línea
          </h2>
          
          <div className="grid grid-cols-2 gap-2">
            {DATA_LINEAS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`group relative p-1 rounded-xl transition-all duration-300 flex items-center justify-center bg-white border-2 h-24
                  ${selectedId === item.id 
                    ? `border-[${item.colorAcento}] shadow-lg z-10` 
                    : "border-transparent hover:border-gray-200 hover:shadow-md"
                  }
                `}
                style={{
                  borderColor: selectedId === item.id ? item.colorAcento : undefined
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className={`w-full h-full object-contain p-2 transition-transform duration-300 ${selectedId === item.id ? 'scale-105' : 'group-hover:scale-105'}`}
                />
                
                {selectedId === item.id && (
                  <div 
                    className="absolute right-1 top-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.colorAcento }}
                  ></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- COLUMNA DERECHA: CONTENIDO --- */}
        <div className="w-full md:w-7/12 relative flex flex-col">
          
          {/* ESTADO VACÍO: TEXTO E ICONO MÁS GRANDES Y OSCUROS */}
          {!selectedId && (
            // AJUSTE: Se eliminó 'opacity-40' para que los colores sean más oscuros y nítidos
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              {/* AJUSTE: Icono más grande (w-20 h-20), fondo sutil (bg-gray-100) y margen inferior (mb-4) */}
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {/* AJUSTE: SVG más grande (h-10 w-10) y color más oscuro (text-gray-500) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              {/* AJUSTE: Título más grande (text-xl) y oscuro (text-gray-900) */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">Explora nuestras Líneas Estratégicas</h3>
              {/* AJUSTE: Subtítulo más grande (text-base) y oscuro (text-gray-600) */}
              <p className="text-base text-gray-600 max-w-md">
                Haz clic en los logos de la izquierda para ver el detalle.
              </p>
            </div>
          )}

          {/* CONTENIDO ACTIVO */}
          {activeData && (
            <div className="flex-1 p-5 lg:p-8 flex flex-col justify-center animate-fadeIn relative overflow-hidden">
              
              <div 
                className={`absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none`}
               
              ></div>

              <div className="relative z-10 max-w-lg mx-auto w-full">
                
                {/* Cabecera */}
                <div className="mb-3">
                  <h1 className="text-2xl md:text-3xl font-display font-bold mb-2 text-gray-800 leading-tight">
                    {activeData.title} <span >{activeData.highlight}</span>
                  </h1>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {activeData.description}
                  </p>
                </div>

                {/* Tarjeta Azul */}
                <div 
                  className="rounded-2xl p-5 text-white shadow-xl relative overflow-hidden transform transition-all duration-500 hover:translate-y-[-2px]"
                  style={{ backgroundColor: activeData.boxBgSpecific || COLOR_AZUL_PRINCIPAL }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-bl-full pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-sm font-bold mb-1 flex items-center gap-2" style={{ color: activeData.iconColor }}>
                      {activeData.iconSvg}
                      {activeData.boxTitle}
                    </h3>
                    
                    <p className="text-sm opacity-90 leading-relaxed font-light">
                      {activeData.boxText}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}