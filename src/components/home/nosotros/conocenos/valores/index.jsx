import React from "react";
import { 
  ShieldAlert, 
  FileText, 
  Scale, 
  Building2, 
  Download, 
  ArrowRight, 
  Lock,
  CheckCircle2
} from "lucide-react";

export default function TransparencyPortal() {
  const transparenciaItems = [
    {
      icon: FileText,
      titulo: "Código de Ética",
      descripcion: "Marco de referencia que guía el comportamiento. Principios no negociables.",
      action: "Descargar PDF",
      link: "#"
    },
    {
      icon: ShieldAlert,
      titulo: "Línea Ética",
      descripcion: "Canal confidencial y anónimo para reportar conductas contrarias a principios.",
      action: "Reportar",
      link: "#",
      highlight: true 
    },
    {
      icon: Building2,
      titulo: "Gobierno Corporativo",
      descripcion: "Estructura de toma de decisiones y junta directiva para una administración responsable.",
      action: "Ver Estructura",
      link: "#"
    },
    {
      icon: Scale,
      titulo: "Rendición de Cuentas",
      descripcion: "Informes anuales de gestión y sostenibilidad. Transparencia total en resultados.",
      action: "Ver Informes",
      link: "#"
    },
  ];

  return (
    <section className="bg-slate-50 mt-24 px-6 py-20 relative overflow-hidden">
      
      {/* Decoración de fondo sutil (opcional) */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>

      {/* --- BLOQUE SUPERIOR: TÍTULO + ÉTICA (Párrafo 1) --- */}
      <div className="max-w-5xl mx-auto mb-16 text-center">
        <span className="bg-green-100 text-green-800 py-1 px-4 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
          Integridad Institucional
        </span>
        
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
          Portal de Ética y <span className="text-green-600 relative inline-block">
            Transparencia
            <svg className="absolute w-full h-2 bottom-0 left-0 text-green-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
          </span>
        </h2>

        {/* Párrafo 1: Introducción centrada y limpia */}
        <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          En <strong className="text-slate-800">Visión Circular ANDI</strong> actuamos bajo principios de ética, responsabilidad y coherencia institucional. Gestionamos cada proyecto promoviendo prácticas responsables, priorizando la <span className="text-green-700 font-medium">inclusión, el respeto y la integridad</span> para asegurar estándares técnicos, sociales y ambientales sólidos.
        </p>
      </div>

      {/* --- BLOQUE CENTRAL: TARJETAS (Herramientas) --- */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {transparenciaItems.map((item, index) => (
          <div
            key={index}
            className={`group flex flex-col bg-white rounded-2xl transition-all duration-300 hover:-translate-y-1
              ${item.highlight 
                ? "border-2 border-green-500 shadow-xl shadow-green-900/10" 
                : "border border-slate-100 shadow-sm hover:shadow-lg hover:border-green-200"
              }`}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${item.highlight ? "bg-green-100 text-green-700" : "bg-slate-50 text-slate-500 group-hover:bg-green-50 group-hover:text-green-600"}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                {item.highlight && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.titulo}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                {item.descripcion}
              </p>

              <a href={item.link} className={`flex items-center text-sm font-bold ${item.highlight ? "text-green-700" : "text-slate-400 group-hover:text-green-600"}`}>
                {item.action} <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        ))}
      </div>

     
      <div className="max-w-6xl mx-auto mb-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 flex flex-col md:flex-row gap-10 items-center shadow-sm">
          
          {/* Lado Izquierdo: Título visual */}
          <div className="md:w-1/3 flex flex-col items-start border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Compromiso de Claridad</h3>
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>Economía Circular Trazable</span>
            </div>
          </div>

          {/* Lado Derecho: El Texto de Transparencia */}
          <div className="md:w-2/3">
            <p className="text-slate-600 text-lg leading-relaxed">
              La transparencia es un eje fundamental en nuestra gestión. Mantenemos una comunicación clara y oportuna sobre avances y metodologías, publicando informes que permiten hacer seguimiento al impacto. 
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mt-4">
              Garantizamos que las alianzas operen bajo criterios de <strong className="text-slate-800">apertura y rendición de cuentas</strong>, reafirmando nuestro compromiso con las mejores prácticas del país.
            </p>
          </div>

        </div>
      </div>

      {/* --- FOOTER: BANNER DE SEGURIDAD --- */}
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-full text-green-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white text-lg font-bold">Garantía de Anonimato</h4>
            <p className="text-slate-400 text-sm">Gestionado por un tercero independiente.</p>
          </div>
        </div>
        <button className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center shadow-lg shadow-green-900/20">
          Reportar incidente <ShieldAlert className="w-4 h-4 ml-2" />
        </button>
      </div>

    </section>
  );
}