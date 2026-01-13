import React, { useState, useEffect } from "react";
import imgProyectos from "../../../../assets/lineasestrategicas/proyectos.png";
import imgInnovacion from "../../../../assets/lineasestrategicas/innovacion.png";
import imgInclusion from "../../../../assets/lineasestrategicas/inclusion.png";
import imgConsumo from "../../../../assets/lineasestrategicas/consumoresponsable.png";
import imgCadenas from "../../../../assets/lineasestrategicas/cadenasdevalor.png";
import ImpactSection from "../../../../components/home/nosotros/conocenos/quienesSomos/ImpactSection.jsx";

const DATA_LINEAS = [
  {
    id: "cadenas",
    title: "Fortalecimiento de las cadenas de valor",
    description: "Modelo de articulación y encadenamientos para la optimización de ecosistemas locales...",
    detailedIntro: "Modelo de articulación y encadenamientos para la optimización de ecosistemas locales de aprovechamiento mediante la generación de valor entre actores de la cadena para el cumplimiento normativo en REP, aportando a estrategias corporativas.",
    articulation: "A través de la articulación de la cadena de valor de residuos aprovechables, garantizamos el cumplimiento de la normatividad vigente, por medio de proyectos territoriales, sectoriales y de inclusión social y productiva.",
    projects: [
      "Vinculación con proyectores territoriales y sectoriales"
    ],
    img: imgCadenas,
    colorAcento: "#1E305D",
    boxTitle: "¿Qué hacemos?",
    boxText: "Articular los actores de la cadena.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: "inclusion",
    title: "Inclusión social y productiva",
    detailedIntro: "La línea de Inclusión Social y Productiva de Visión Circular ANDI impulsa estrategias orientadas a cerrar brechas productivas y sociales, generando impacto en la competitividad, los ingresos y el bienestar de los actores de la cadena de envases y empaques.",
    articulation: "A través del modelo de inclusión social y productiva, se desarrollan programas y proyectos con dos objetivos: Mejorar la competitividad y promover la transición justa y los empleos verdes en toda la cadena.",
    projects: [
      "Ruta de la productividad",
      "Transforma más",
      "Transición justa, empleos verdes"
    ],
    img: imgInclusion,
    colorAcento: "#1E305D",
    boxTitle: "Cierre de Brechas",
    boxText: "Cierre de brechas de las organizaciones de recicladores y transformadores para fortalecer su competitividad.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: "innovacion",
    title: "Innovación para el cierre de ciclo de envases y empaques",
    detailedIntro: "Si bien, la línea de innovación lleva 3 años operando de cara al ecosistema CTeI, nuestro trabajo comenzó in 2021 con la formulación del Plan de Innovación, una hoja de ruta que ha guiado cada una de nuestras acciones. En este tiempo, hemos perfeccionado nuestras metodologías, afinado los criterios de selección y formulación de proyectos para garantizando que cada iniciativa tenga un impacto tangible y alineado con nuestra visión de sostenibilidad y economía circular.",
    articulationNode: (
      <div className="space-y-4">
        <p className="font-medium text-white/90">Desde 2023 hemos realizado dos convocatorias para activar el ecosistema de innovación, cofinanciando proyectos de investigación aplicada.</p>
        <div>
          <p className="mb-2 text-sm text-white/80">Categorías de proyectos:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 list-disc pl-4 text-xs md:text-sm text-white/90">
            <li>Tecnologías para la circularidad</li>
            <li>Biomateriales y sustitutos</li>
            <li>Ecodiseño y rediseño</li>
            <li>Educación y cultura</li>
            <li>Transformación productiva</li>
            <li>Regulación y certificación</li>
          </ul>
        </div>
      </div>
    ),
    projects: [
      "Viabilización del sistema HOMEKO (U. Javeriana)",
      "Empaques compostables de biomasa (Bioplanet)",
      "Empaques a base de orgánicos (U. Nacional)",
      "Reutilización empaques retornables (Xiclo)",
      "Modelo dispensación a granel / refill (CidPro)",
      "Renting de vehículos eléctricos (Equirent)",
      "Planta de retornabilidad de botellas de vidrio",
      "Reciclaje molecular de PET (ANDERCOL)",
      "Identificación de productos (Magma y MegaInn)",
      "Guía incorporación de PCR (Biocírculo)",
      "Cierre de ciclo de poliestireno (ICIPC)",
      "Transformación residuos plásticos (CIDEP)",
      "Fortalecimiento empresas transformadoras (PMTEC)",
      "Potencial reciclabilidad (ARCO)"
    ],
    documents: [
      { title: "Informe 2024 y perspectivas 2025", url: "https://www.andi.com.co/Uploads/ANDI_Econom%C3%ADaCircular_Informe2024_compressed_638990846971068830.pdf" },
      { title: "Definición de condiciones normativas (REFILL)", url: "https://www.andi.com.co/Uploads/2025_01_14Dispensaci%C3%B3n%20a%20Granel.pdf" },
      { title: "Potencial de Reciclabilidad de Envases y Empaques", url: "https://www.andi.com.co/Uploads/POTENCIAL%20DE%20RECICLABILIDAD%20DE%20ENVASES%20Y%20EMPAQUES%20EN%20COLOMBIA%20(003)_638602627756422428.pdf" },
      { title: "Empaquetech", url: "https://www.andi.com.co/Uploads/Montaje%20final%20para%20aprobacion%20tecnologias%20cierre%20de%20ciclo%20(2).pdf" },
      { title: "Guía para la incorporación de PCR", url: "https://www.andi.com.co/Uploads/Guia-para-la-incorporacion-de-PCR-resina-reciclada-posconsumo-de-PEAD-en-envases-de-diferentes-aplicaciones-OK_compressed.pdf" },
      { title: "Seismic Performance con Recycled Tetra Pak", url: "https://www.mdpi.com/2075-5309/15/5/813" },
      { title: "Review of Goldenberry Calyx as Reinforcing Fiber", url: "https://www.mdpi.com/2071-1050/17/13/5724" },
      { title: "Informes 2023 y perspectiva de 2024", url: "https://www.andi.com.co/Uploads/Informe%202023%20&%20perspectivas%202024%20dise%C3%B1o.pdf" }
    ],
    img: imgInnovacion,
    colorAcento: "#1E305D",
    boxTitle: "Investigación y Desarrollo",
    boxText: "Investigación aplicada y desarrollo experimental enfocados en dinamizar el ecosistema de Ciencia, Tecnología e Innovación (CTeI).",
    boxBgSpecific: "#1C2C5A",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    id: "proyectos",
    title: "Proyectos estratégicos: territoriales y sectoriales",
    description: "Estrategias para impulsar modelos circulares mediante procesos de generación de capacidades territoriales y sectoriales que generen impactos económicos, sociales y ambientales.",
    detailedIntroNode: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 leading-relaxed">
          Estrategias para impulsar modelos circulares mediante procesos de generación de capacidades territoriales y sectoriales que generen impactos económicos, sociales y ambientales.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#1E305D]">
          <p className="font-semibold text-gray-800 mb-3">Los proyectos estratégicos tienen dos componentes:</p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1E305D] text-white flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-medium text-gray-800">Estrategia Territorial</p>
                <p className="text-sm text-gray-600 mt-1">Modelo integral que articula componentes ambientales, sociales y económicos, con una visión de escalabilidad en territorios marino-costeros (Cartagena - Bolívar, Santa Marta y Barranquilla – Puerto Colombia).</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1E305D] text-white flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-medium text-gray-800">Estrategia Sectorial</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    articulation: "Los proyectos estratégicos en territorios marino-costeros buscan focalizar acciones desde la REP para crear modelos que, por un lado, contribuyan a las metas normativas de Responsabilidad Extendida del Productor, pero, más allá del cumplimiento, se trata de consolidar ecosistemas territoriales de economía circular que transformen la relación del territorio con sus residuos, impulse el desarrollo local y reduzca la presión sobre ecosistemas estratégicos como manglares, bahías y ciénagas.",
    projects: [
      "Proyectos marinos – costeros: Cartagena y Bolívar",
      "Proyectos marinos – costeros: Santa Marta",
      "Puerto Circular - Barranquilla y Puerto Colombia"
    ],
    img: imgProyectos,
    colorAcento: "#1E305D",
    boxTitle: "Enfoque y Alcance",
    boxText: "Los proyectos en Cartagena, Santa Marta y Barranquilla – Puerto Colombia tienen el objetivo de triple impacto (Económico, social, ambiental).",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: "consumo",
    title: "Consumo responsable y pedagogía al consumidor",
    detailedIntro: "La línea de Consumo Responsable y Pedagogía al Consumidor busca sensibilizar y promover el cambio de hábitos y comportamientos de la ciudadanía, fomentando la correcta separación en la fuente como condición clave para el funcionamiento de la economía circular.",
    articulation: "Los proyectos de esta línea se articulan para activar el rol del consumidor desde distintos entornos hogar, empresa, comercio, industria y territorio, facilitando prácticas de separación en la fuente y consumo responsable mediante acciones pedagógicas, mensajes claros y experiencias prácticas.",
    projects: [
      "Evolución Circular",
      "Tienda a tienda",
      "Separo en casa, entrego en mi empresa",
      "Industria arrocera unida por la economía circular",
      "Campaña Para y Separa"
    ],
    img: imgConsumo,
    colorAcento: "#1E305D",
    boxTitle: "Cambio de Hábitos",
    boxText: "Sensibilizar y contribuir al cambio de hábitos y comportamiento del consumidor fomentando la correcta separación en la fuente.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const COLOR_AZUL_PRINCIPAL = "#1E305D";

export default function LineasEstrategicasPage() {
  const [selectedLineId, setSelectedLineId] = useState(DATA_LINEAS[0].id);
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeData = DATA_LINEAS.find((item) => item.id === selectedLineId) || DATA_LINEAS[0];

  // Reset slide cuando cambiamos de línea
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedLineId]);

  // Construir configuración de slides
  const slides = [
    { type: "info", title: "Visión General" }, // Título, intro, descripción
    { type: "articulation", title: activeData.boxTitle || "Enfoque y Alcance" }, // Tarjeta de color
  ];
  if (activeData.projects && activeData.projects.length > 0) {
    slides.push({ type: "projects", title: "Proyectos Destacados" });
  }
  if (activeData.documents && activeData.documents.length > 0) {
    slides.push({ type: "documents", title: "Documentos e Informes" });
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="mt-20 md:mt-28 font-sans min-h-screen flex flex-col items-center p-2 lg:p-6 bg-gradient-to-b from-gray-100 to-[#7FB8D9]/10">

      <h1 className="text-2xl md:text-4xl font-bold text-[#1E305D] mb-2 text-center tracking-tight font-display">
        Líneas Estratégicas
      </h1>

      <p className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-wider">
        Haz clic en cada línea estratégica para conocer más.
      </p>

      {/* --- MENU SUPERIOR (LOGOS GRANDES SIN FILTROS) --- */}
      <div className="w-full">
        <div className="grid grid-cols-2 gap-x-0 gap-y-0 justify-items-center md:flex md:flex-nowrap md:gap-10 md:justify-center">
          {DATA_LINEAS.map((item) => {
            const isActive = selectedLineId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setSelectedLineId(item.id); setCurrentSlide(0); }}
                className={`relative transition-transform duration-300 outline-none ${isActive ? "md:scale-110" : "hover:scale-105 "}`}
              >
                {/* Contenedor Limpio (Sin cards ni bordes, solo imagen grande) */}
                <div className="w-28 h-28 md:w-40 md:h-40 flex items-center justify-center p-0 md:p-3">
                  <img src={item.img} alt={item.title} className="w-full h-full object-contain scale-[1.15]" />
                </div>
              </button>
            )
          })}
        </div>
      </div>


      {/* --- CONTENEDOR DE CONTENIDO (SLIDESHOW INTERNO) --- */}
      <div className="w-full max-w-5xl relative">

        {/* Botones de Navegación del Slide */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-14 z-20 p-2 md:p-3 rounded-full bg-white shadow-lg text-[#1E305D] hover:bg-[#1E305D] hover:text-white transition-all border border-gray-100"
          title="Anterior diapositiva"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-14 z-20 p-2 md:p-3 rounded-full bg-white shadow-lg text-[#1E305D] hover:bg-[#1E305D] hover:text-white transition-all border border-gray-100"
          title="Siguiente diapositiva"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* TARJETA PRINCIPAL */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 relative p-6 md:p-10 flex flex-col">

          {/* Indicador de Título de Línea Permanente */}
          <div className="w-full text-center border-b border-gray-50 pb-2 mb-2">
            <h2 className="text-xl md:text-2xl font-bold font-display text-gray-800">
              {activeData.title}
            </h2>
          </div>

          <div className="animate-slideInUp flex-1 flex flex-col w-full">

            {/* Indicador de qué slide estamos viendo (Puntos) */}
            <div className="w-full flex justify-center gap-2 mb-6">
              {slides.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentSlide ? "w-8 bg-[#1E305D]" : "w-2 bg-gray-300"}`}
                  title={s.title} // Tooltip para saber qué es cada punto
                ></div>
              ))}
            </div>

            {/* CONTENIDO DEL SLIDE ACTUAL */}
            <div className="w-full flex flex-col justify-center" key={currentSlide}>
              {(function () {
                const slide = slides[currentSlide] || slides[0];
                if (!slide) return null;

                return (
                  <>
                    {/* SLIDE 1: INFO GENERAL */}
                    {slide.type === "info" && (
                      <div className="animate-fadeIn w-full">
                        <h3 className="text-lg md:text-xl font-bold text-[#1E305D] mb-4 text-center md:text-left">
                          Visión General
                        </h3>
                        {activeData.detailedIntroNode ? (
                          activeData.detailedIntroNode
                        ) : (
                          <p className="text-base text-gray-600 leading-relaxed text-justify max-w-4xl mx-auto md:mx-0">
                            {activeData.detailedIntro || activeData.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* SLIDE 2: ARTICULACIÓN / ENFOQUE (Tarjeta de Color original) */}
                    {slides[currentSlide].type === "articulation" && (
                      <div className="animate-fadeIn w-full flex items-center justify-center">
                        <div
                          className="w-full md:w-11/12 rounded-2xl p-6 md:p-8 text-white shadow-xl transform transition-transform"
                          style={{ backgroundColor: activeData.boxBgSpecific || activeData.colorAcento || COLOR_AZUL_PRINCIPAL }}
                        >
                          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 border-b border-white/20 pb-4">
                            <div className="p-3 bg-white/20 rounded-full">
                              {React.cloneElement(activeData.iconSvg, { className: "w-8 h-8 md:w-10 md:h-10" })}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold">
                              {activeData.boxTitle || "Enfoque y Alcance"}
                            </h3>
                          </div>
                          <div className="text-base font-light leading-relaxed text-justify opacity-95">
                            {activeData.articulationNode ? activeData.articulationNode : (activeData.articulation || activeData.boxText)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SLIDE 3: PROYECTOS */}
                    {slides[currentSlide].type === "projects" && (
                      <div className="animate-fadeIn w-full">
                        <h3 className="text-lg md:text-xl font-bold text-[#1E305D] mb-6 text-center">
                          Proyectos Destacados
                        </h3>
                        {/* Grid Ajustable segun cantidad */}
                        <div className={`grid gap-3 max-w-4xl mx-auto ${activeData.projects.length > 6 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                          {activeData.projects.map((proj, idx) => (
                            <div key={idx} className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-start gap-2.5 hover:shadow-sm transition-shadow">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                              <p className="text-gray-700 font-medium text-sm leading-snug">{proj}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SLIDE 4: DOCUMENTOS */}
                    {slides[currentSlide].type === "documents" && (
                      <div className="animate-fadeIn w-full">
                        <h3 className="text-lg md:text-xl font-bold text-[#1E305D] mb-6 text-center">
                          Documentos e Informes
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
                          {activeData.documents.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-md transition-all group"
                            >
                              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-red-700 transition-colors">{doc.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Clic para descargar</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Estilos Animación */}
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

      <div className="mt-12 w-full max-w-6xl">
        <ImpactSection />
      </div>

    </div>
  );
}