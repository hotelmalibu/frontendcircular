import React from "react";
import { 
  ShieldAlert, 
  FileText, 
  Scale, 
  Building2, 
  Download, 
  ArrowRight, 
  Lock 
} from "lucide-react";

export default function TransparencyPortal() {
  const transparenciaItems = [
    {
      icon: FileText,
      titulo: "Código de Ética y Conducta",
      descripcion:
        "Marco de referencia que guía el comportamiento de colaboradores. Principios no negociables de nuestra operación.",
      action: "Descargar PDF",
      link: "#"
    },
    {
      icon: ShieldAlert,
      titulo: "Línea Ética y Transparencia",
      descripcion:
        "Canal confidencial y anónimo para reportar conductas contrarias a nuestros principios, fraudes o corrupción.",
      action: "Realizar Reporte",
      link: "#",
      highlight: true 
    },
    {
      icon: Building2,
      titulo: "Gobierno Corporativo",
      descripcion:
        "Estructura de toma de decisiones, composición de la junta directiva y estatutos para una administración responsable.",
      action: "Ver Estructura",
      link: "#"
    },
    {
      icon: Scale,
      titulo: "Rendición de Cuentas",
      descripcion:
        "Informes anuales de gestión y sostenibilidad. Transparencia total en nuestros resultados financieros y sociales.",
      action: "Ver Informes",
      link: "#"
    },
  ];

  return (
    // AQUI SE APLICARON LAS CLASES SOLICITADAS: mt-24 px-6 py-14 text-center
    // Se mantiene bg-slate-50 para que tenga el color de fondo gris suave
    <section className="bg-slate-50 mt-24 px-6 py-14 text-center relative">
      
      {/* Encabezado */}
      <div className="max-w-4xl mx-auto mb-16">
        <span className="bg-white border border-slate-200 text-green-700 py-1 px-4 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block shadow-sm">
          Integridad Institucional
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
          Portal de Ética y <span className="text-green-700">Transparencia</span>
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Promovemos una cultura de legalidad. Aquí encontrarás las herramientas y documentos que respaldan nuestro compromiso público.
        </p>
      </div>

      {/* Grid de Tarjetas */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {transparenciaItems.map((item, index) => (
          <div
            key={index}
            // Agregué 'items-center' para que el icono se centre junto con el texto (ya que el padre tiene text-center)
            className={`group flex flex-col items-center bg-white rounded-xl transition-all duration-300 hover:-translate-y-1
              ${item.highlight 
                ? "border-2 border-green-500 shadow-lg shadow-green-900/5" 
                : "border border-slate-200 shadow-sm hover:shadow-xl hover:border-green-300"
              }`}
          >
            {/* Cuerpo de la tarjeta */}
            <div className="p-6 flex-grow flex flex-col items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-colors duration-300
                ${item.highlight ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-green-600 group-hover:text-white"}`}>
                <item.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.titulo}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {item.descripcion}
              </p>
            </div>

            {/* Footer de la tarjeta */}
            <div className="w-full p-6 pt-0 mt-auto border-t border-slate-50">
              <a 
                href={item.link} 
                className={`inline-flex items-center justify-center font-semibold text-sm mt-4 transition-colors
                  ${item.highlight 
                    ? "text-green-700 hover:text-green-900" 
                    : "text-slate-400 group-hover:text-green-600"
                  }`}
              >
                {item.action}
                {item.action.includes("Descargar") ? (
                  <Download className="w-4 h-4 ml-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                )}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Inferior de Seguridad (Restaurado a su diseño original dentro del contenedor) */}
      <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
              <div className="p-3 bg-slate-800 rounded-full">
                <Lock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="text-white text-xl font-bold mb-2">Garantía de Anonimato</h4>
                <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                  La línea ética es gestionada por un tercero independiente. No rastreamos IPs ni grabamos llamadas para proteger tu identidad.
                </p>
              </div>
            </div>
            
            <button className="bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg shadow-green-900/20 flex items-center whitespace-nowrap">
              Reportar incidente
              <ShieldAlert className="w-4 h-4 ml-2" />
            </button>
          </div>
      </div>

    </section>
  );
}