import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Download,
  Info
} from "lucide-react";
import imgProyectos from "../../../../assets/lineasestrategicas/proyectos.png";
import imgInnovacion from "../../../../assets/lineasestrategicas/innovacion.png";
import imgInclusion from "../../../../assets/lineasestrategicas/inclusion.png";
import imgConsumo from "../../../../assets/lineasestrategicas/consumoresponsable.png";
import imgCadenas from "../../../../assets/lineasestrategicas/cadenasdevalor.png";
import heroLineas from "../../../../assets/lineasestrategicas/hero_lineas_v2.jpg";
import ImpactSection from "../../../../components/home/nosotros/conocenos/quienesSomos/ImpactSection.jsx";

const DATA_LINEAS = [
  {
    id: "cadenas",
    title: "Fortalecimiento de las cadenas de valor",
    shortTitle: "Cadenas de Valor",
    description: "Modelo de articulación y encadenamientos para la optimización de ecosistemas locales.",
    detailedIntro: "Modelo de articulación y encadenamientos para la optimización de ecosistemas locales de aprovechamiento mediante la generación de valor entre actores de la cadena para el cumplimiento normativo en REP, aportando a estrategias corporativas.",
    articulation: "A través de la articulación de la cadena de valor de residuos aprovechables, garantizamos el cumplimiento de la normatividad vigente, por medio de proyectos territoriales, sectoriales y de inclusión social y productiva.",
    projects: ["Vinculación con proyectores territoriales y sectoriales"],
    img: imgCadenas,
    colorAcento: "#86B13D", // Greenish
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
    shortTitle: "Inclusión Social",
    detailedIntro: "La línea de Inclusión Social y Productiva de Visión Circular ANDI impulsa estrategias orientadas a cerrar brechas productivas y sociales, generando impacto en la competitividad, los ingresos y el bienestar de los actores de la cadena de envases y empaques.",
    articulation: "A través del modelo de inclusión social y productiva, se desarrollan programas y proyectos con dos objetivos: Mejorar la competitividad y promover la transición justa y los empleos verdes en toda la cadena.",
    projects: [
      "Ruta de la productividad",
      "Transforma más",
      "Transición justa, empleos verdes"
    ],
    img: imgInclusion,
    colorAcento: "#E15200",
    boxTitle: "Cierre de Brechas",
    boxText: "Fortalecimiento de la competitividad en organizaciones de recicladores y transformadores.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: "innovacion",
    title: "Innovación para el cierre de ciclo de envases",
    shortTitle: "Innovación",
    detailedIntro: "Nuestra hoja de ruta ha guiado cada acción perfeccionando metodologías y criterios de selección para garantizar que cada iniciativa tenga un impacto tangible alineado con nuestra visión de sostenibilidad.",
    articulationNode: (
      <div className="space-y-4">
        <p className="font-medium text-white/90">Desde 2023 hemos realizado dos convocatorias para activar el ecosistema de innovación, cofinanciando proyectos de investigación aplicada.</p>
        <div className="grid grid-cols-2 gap-2 text-xs md:text-sm text-white/90">
          {["Ecodiseño", "Biomateriales", "Tecnologías", "Educación"].map(t => (
            <div key={t} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full" /> {t}
            </div>
          ))}
        </div>
      </div>
    ),
    projects: [
      "Viabilización HOMEKO", "Biomateriales compostables", "Xiclo: Reutilización", "Molecular PET ANDERCOL"
    ],
    documents: [
      { title: "Informe 2024 y perspectivas 2025", url: "https://www.andi.com.co/Uploads/ANDI_Econom%C3%ADaCircular_Informe2024_compressed_638990846971068830.pdf" },
      { title: "Potencial de Reciclabilidad", url: "https://www.andi.com.co/Uploads/POTENCIAL%20DE%20RECICLABILIDAD%20DE%20ENVASES%20Y%20EMPAQUES%20EN%20COLOMBIA%20(003)_638602627756422428.pdf" }
    ],
    img: imgInnovacion,
    colorAcento: "#9E1981",
    boxTitle: "Investigación y Desarrollo",
    boxText: "Investigación aplicada y desarrollo experimental para dinamizar el ecosistema CTeI.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    id: "proyectos",
    title: "Proyectos estratégicos",
    shortTitle: "Territoriales",
    detailedIntro: "Estrategias para impulsar modelos circulares mediante procesos de generación de capacidades territoriales y sectoriales que generen impactos económicos, sociales y ambientales.",
    articulation: "Los proyectos estratégicos en territorios marino-costeros buscan focalizar acciones desde la REP para crear modelos que consoliden ecosistemas territoriales de economía circular reales.",
    projects: [
      "Magdalena Arriba", "Cartagena y Bolívar", "Puerto Circular Barranquilla"
    ],
    img: imgProyectos,
    colorAcento: "#2C67B0", // Blue
    boxTitle: "Enfoque Territorial",
    boxText: "Acciones enfocadas en zonas marino-costeras con visión de impacto triple.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: "consumo",
    title: "Consumo responsable y pedagogía",
    shortTitle: "Pedagogía",
    detailedIntro: "Buscamos sensibilizar y promover el cambio de hábitos, fomentando la correcta separación en la fuente como condición clave.",
    articulation: "Activamos el rol del consumidor desde distintos entornos facilitando prácticas sostenibles mediante acciones pedagógicas y mensajes claros.",
    projects: [
      "Evolución Circular", "Tienda a tienda", "Separo en casa"
    ],
    img: imgConsumo,
    colorAcento: "#F1B708", // Yellow
    boxTitle: "Cambio de Hábitos",
    boxText: "Promover la separación en la fuente mediante sensibilización ciudadana.",
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export default function LineasEstrategicasPage() {
  const [selectedLineId, setSelectedLineId] = useState(DATA_LINEAS[0].id);
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeData = DATA_LINEAS.find((item) => item.id === selectedLineId) || DATA_LINEAS[0];

  const slides = [
    { type: "info", title: "Visión General" },
    { type: "articulation", title: activeData.boxTitle || "Enfoque" },
  ];
  if (activeData.projects?.length > 0) slides.push({ type: "projects", title: "Proyectos" });
  if (activeData.documents?.length > 0) slides.push({ type: "documents", title: "Biblioteca" });

  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedLineId]);

  return (
    <div className="font-sans min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* HERO SECTION */}
      <div className="relative h-[550px] md:h-[750px] w-full">
        <img 
          src={heroLineas} 
          alt="Líneas Estratégicas" 
          className="w-full h-full object-cover object-center brightness-[0.9]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E305D]/70 via-transparent to-white/60 flex flex-col justify-center items-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-2xl font-display">
              Líneas Estratégicas
            </h1>
            <p className="text-white/90 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-lg opacity-80">
              Estrategias integrales diseñadas para transformar el modelo productivo del país hacia una economía circular.
            </p>
          </motion.div>
        </div>

        {/* WHITE BOTTOM FILTER OVERLAY */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-gray-50 via-white/20 to-transparent z-20" />

        {/* TABS DE SELECCIÓN (Overlapping at the bottom/edge) */}
        <div className="absolute -bottom-10 md:-bottom-16 left-0 w-full z-40 px-6">
          <div className="flex flex-wrap justify-center gap-4 md:gap-10">
            {DATA_LINEAS.map((item) => {
              const isActive = selectedLineId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedLineId(item.id)}
                  className={`flex flex-col items-center transition-all duration-500 group relative ${
                    isActive 
                      ? "scale-110 -translate-y-2 text-[#1E305D]" 
                      : "hover:scale-105"
                  }`}
                >
                  <div className="w-24 h-16 md:w-48 md:h-24 transition-transform duration-500">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-contain filter drop-shadow-2xl" 
                    />
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute -bottom-2 md:-bottom-4 w-20 h-1.5 bg-[#B1D357] rounded-full shadow-[0_0_20px_rgba(177,211,87,0.8)]" 
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="h-28 md:h-32 w-full" /> {/* Increased spacer to prevent clipping from below */}

      {/* CONTENIDO INTERACTIVO */}
      <div className="w-full max-w-6xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 grid md:grid-cols-12">
          
          {/* Navegación lateral integrada (Mobile superior) */}
          <div className="md:col-span-3 bg-gray-50/50 p-8 flex flex-col justify-between border-r border-gray-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Información</p>
              <div className="space-y-3">
                {slides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`flex items-center gap-3 w-full text-left p-3 rounded-xl transition-all ${
                      currentSlide === idx 
                        ? "bg-white shadow-md text-[#1E305D] font-bold ring-1 ring-gray-100" 
                        : "text-gray-400 hover:text-gray-600 font-medium"
                    }`}
                  >
                    <div className={`w-1.5 h-6 rounded-full transition-all ${currentSlide === idx ? 'bg-[#1E305D]' : 'bg-gray-200 opacity-0'}`} />
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="hidden md:flex gap-2">
              <button onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)} className="p-3 bg-white border border-gray-100 rounded-full hover:bg-gray-50 transition-colors">
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button onClick={() => setCurrentSlide(p => (p + 1) % slides.length)} className="p-3 bg-white border border-gray-100 rounded-full hover:bg-gray-50 transition-colors">
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Contenido Dinámico */}
          <div className="md:col-span-9 p-6 md:p-10 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E305D]/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
             
             <AnimatePresence mode="wait">
               <motion.div
                 key={`${selectedLineId}-${currentSlide}`}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
                 className="relative z-10 h-full flex flex-col"
               >
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl border border-gray-100 bg-[#1E305D]/10 text-[#1E305D]">
                      {React.cloneElement(activeData.iconSvg, { size: 28 })}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold leading-tight text-black">
                      {slides[currentSlide]?.title === "Visión General" ? activeData.title : (slides[currentSlide]?.title || "Cargando...")}
                    </h2>
                 </div>

                 <div className="flex-1 flex flex-col justify-center">
                   {slides[currentSlide].type === "info" && (
                      <p className="text-lg text-[#1E305D] leading-relaxed font-light">
                        {activeData.detailedIntro || activeData.description}
                      </p>
                   )}

                   {slides[currentSlide].type === "articulation" && (
                      <div className="p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden bg-[#1E305D]">
                         <div className="absolute top-0 left-0 w-full h-full bg-white/5" />
                         <div className="relative z-10">
                           <h4 className="flex items-center gap-2 text-white/70 font-bold uppercase text-xs tracking-widest mb-4">
                             <Info size={16} /> Detalle Estratégico
                           </h4>
                           <div className="text-lg md:text-xl font-medium leading-relaxed italic opacity-95">
                             {activeData.articulationNode ? activeData.articulationNode : activeData.articulation}
                           </div>
                         </div>
                      </div>
                   )}

                   {slides[currentSlide].type === "projects" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeData.projects.map((p, i) => (
                           <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#1E305D]/30 transition-all">
                              <div className="mt-1 w-2 h-2 rounded-full bg-[#1E305D] group-hover:scale-150 transition-transform" />
                              <span className="text-[#1E305D] font-bold text-sm leading-tight">{p}</span>
                           </div>
                        ))}
                      </div>
                   )}

                   {slides[currentSlide].type === "documents" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeData.documents.map((doc, idx) => (
                          <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-5 bg-white border border-gray-200 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                              <Download size={24} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#1E305D] line-clamp-1 mb-1">{doc.title}</p>
                              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                <ExternalLink size={12} /> Ver Documento
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                   )}
                 </div>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* IMPACT SECTION */}
      <div className="w-full bg-white pt-4 pb-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <ImpactSection />
        </div>
      </div>

      <style>{`
        .font-display { font-family: 'Montserrat', sans-serif; }
      `}</style>
    </div>
  );
}