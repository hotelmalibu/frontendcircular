import { motion } from "framer-motion";

import {
  ShieldAlert,
  FileText,
  Scale,
  Building2,
  Lock,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

// Importar la imagen de fondo generada (Oscura y sin texto)
import ethicsHero from "../../../../../assets/home/nosotros/conocenos/valores/ethics_hero_dark.jpg";

// --- PALETA DE COLORES DASHBOARD / BRAND ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#1E305D",   // Azul Profundo
  green: "#B1D357",      // Verde Principal
  emerald: "#10b981",    // Acento de seguridad
};

const transparenciaItems = [
  {
    icon: FileText,
    titulo: "Código de Ética",
    descripcion: "Nuestro marco de referencia fundamental que guía el comportamiento y define nuestros principios no negociables.",
    action: "Descargar PDF",
    link: "#",
    color: "from-[#2C67B0] to-[#1E305D]"
  },
  {
    icon: ShieldAlert,
    titulo: "Línea Ética",
    descripcion: "Canal confidencial y anónimo disponible para reportar cualquier conducta contraria a nuestros principios y valores.",
    action: "Reportar Incidente",
    link: "#",
    highlight: true,
    color: "from-[#B1D357] to-[#8fb23a]"
  },
  {
    icon: Building2,
    titulo: "Gobierno Corporativo",
    descripcion: "Estructura sólida de toma de decisiones y junta directiva para asegurar una administración responsable y transparente.",
    action: "Ver Estructura",
    link: "#",
    color: "from-[#2C67B0] to-[#1E305D]"
  },
  {
    icon: Scale,
    titulo: "Rendición de Cuentas",
    descripcion: "Informes anuales de gestión y sostenibilidad que reflejan nuestro compromiso con la transparencia total en resultados.",
    action: "Ver Informes",
    link: "#",
    color: "from-[#2C67B0] to-[#1E305D]"
  },
];

const TransparencyCard = ({ item, index }) => {
  return (
    <div
      className={`group relative flex flex-col bg-white rounded-3xl p-8 transition-all duration-500 shadow-sm hover:shadow-2xl border border-slate-100 overflow-hidden ${item.highlight ? 'ring-2 ring-[#B1D357]/30' : ''}`}
    >
      {/* Background Gradient Strip */}
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
      
      {/* Icon */}
      <div className="flex justify-between items-start mb-8">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg transition-transform duration-500 group-hover:scale-110`}>
          <item.icon size={28} />
        </div>
        {item.highlight && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B1D357] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B1D357]"></span>
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-4 transition-all duration-300">
        {item.titulo}
      </h3>
      
      <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
        {item.descripcion}
      </p>

      <div className="mt-auto">
        <a 
          href={item.link} 
          className={`inline-flex items-center gap-2 text-sm font-bold tracking-tight px-0 transition-all duration-300 ${item.highlight ? 'text-[#8fb23a]' : 'text-slate-400 group-hover:text-[#2C67B0]'}`}
        >
          {item.action}
          <div className={`p-1 rounded-full ${item.highlight ? 'bg-[#B1D357]/10' : 'bg-slate-50 group-hover:bg-[#2C67B0]/10'} transition-colors`}>
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default function TransparencyPortal() {
  return (
    <section className="bg-white font-sans min-h-screen">
      
      {/* HERO SECTION - REPLICA ESTILO HOME/EQUIPO CON COLORES BRAND */}
      <div className="relative h-[450px] md:h-[600px] w-full overflow-hidden">
        <img 
          src={ethicsHero} 
          alt="Portal de Ética y Transparencia" 
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Overlay para garantizar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E305D]/80 via-[#1E305D]/40 to-white flex flex-col justify-center items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <span className="px-5 py-1.5 rounded-full bg-[#B1D357]/20 backdrop-blur-md border border-[#B1D357]/30 text-[#B1D357] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-6">
              Transparencia Institucional
            </span>
            <h1 
              className="text-white text-3xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-2xl"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Portal de Ética <br className="hidden md:block" /> y Transparencia
            </h1>
            <p 
              className="text-white/90 text-sm md:text-lg max-w-2xl font-medium leading-relaxed tracking-wide drop-shadow-lg px-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Nuestra gestión se fundamenta en principios de integridad, responsabilidad y coherencia. Construimos confianza a través de la claridad total en cada proceso.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 -mt-20 relative z-20 pb-24">
        
        {/* GRID DE HERRAMIENTAS - Usando colores del dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {transparenciaItems.map((item, index) => (
            <TransparencyCard key={index} item={item} index={index} />
          ))}
        </div>

        {/* SECCIÓN DETALLES CLARIDAD */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className="space-y-8"
          >
            <div className={`inline-flex items-center gap-3 font-bold uppercase tracking-widest text-xs`} style={{ color: BRAND.blue }}>
              <div className="h-px w-8" style={{ backgroundColor: BRAND.blue }} />
              Compromiso de Claridad
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Trazabilidad y Apertura <br /> en nuestra Gestión
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              La transparencia no es solo un valor, es el eje que permite que la <strong className="text-slate-900">Economía Circular</strong> sea real y medible. Garantizamos que cada alianza y proyecto operen bajo criterios de auditoría y rendición de cuentas pública.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {[
                "Información en Tiempo Real",
                "Metodologías Auditables",
                "Cumplimiento Normativo",
                "Impacto Social Medible"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-700 font-semibold group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-[#2C67B0] flex items-center justify-center transition-colors group-hover:bg-[#2C67B0] group-hover:text-white">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative"
          >
            <div className="bg-[#1E305D] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B1D357]/10 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/10 rounded-2xl text-white backdrop-blur-sm border border-white/20">
                    <Lock size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">Garantía de Anonimato</h4>
                    <p className="text-slate-300 text-sm">Protección total de tu identidad</p>
                  </div>
                </div>
                
                <p className="text-slate-300 leading-relaxed italic border-l-2 border-[#B1D357]/30 pl-6">
                  "Nuestra línea ética es gestionada por un tercero independiente para asegurar la imparcialidad y confidencialidad absoluta en cada reporte."
                </p>

                <div className="pt-6">
                  <button 
                    className="w-full border-2 font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: BRAND.green, 
                      borderColor: BRAND.green,
                      color: BRAND.darkBlue 
                    }}
                  >
                    Reportar Incidente
                    <ShieldAlert size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}