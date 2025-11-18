import React from "react";
// CORRECCIÓN DE RUTA: Apunta a assets/marconormativo/1.png
import imgHeader from "../../../../assets/marconormativo/1.png"; 

// --- IMPORTAR ACTIVOS (PDFs) ---
import pdfENEC from "../../../../assets/marconormativo/planes/ENEC.pdf"; 
import pdfPlasticos from "../../../../assets/marconormativo/planes/plan-nacional-para-la-gestion-sostenible-de-plasticos-un-solo-uso-minambiente_638235484889659598.pdf";
import pdfPND from "../../../../assets/marconormativo/planes/PND.pdf"; 

// Colores del manual de marca
const COLOR_AZUL_PRINCIPAL = '#1E305D';
const COLOR_VERDE_PRINCIPAL = '#00AB6D';
const COLOR_AZUL_SECUNDARIO = '#2C67B0';
const COLOR_VERDE_CLARO = '#B1D357'; 
const COLOR_FONDO_CLARO = '#f9f9f9';


// Datos de los planes (sin cambios)
const planes = [
  {
    title: "ENEC - Estrategia nacional de economía circular",
    description: "MADS | 2019 - 2030",
    pdf: pdfENEC,
    color: COLOR_VERDE_PRINCIPAL 
  },
  {
    title: "Plan nacional para la gestión sostenible de los plásticos de un solo uso",
    description: "MADS | 2021 - 2030",
    pdf: pdfPlasticos,
    color: COLOR_AZUL_SECUNDARIO
  },
  {
    title: "Plan Nacional de Desarrollo (PND)",
    description: "DNP | 2022 - 2026",
    pdf: pdfPND,
    color: COLOR_VERDE_CLARO 
  }
];

// Componente para una tarjeta de plan individual (sin cambios)
const PlanCard = ({ title, description, pdf, color }) => {
  const linkStyle = {
    transition: 'color 0.3s ease',
    color: COLOR_AZUL_SECUNDARIO,
    textDecoration: 'none',
  };

  const handleLinkHover = (e, isHovering) => {
    e.target.style.color = isHovering ? COLOR_VERDE_PRINCIPAL : COLOR_AZUL_SECUNDARIO;
  };

  return (
    <div 
        className="w-full text-left bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border-t-4" 
        style={{ borderColor: color }}
    >
      <h3 className="text-lg font-sans font-semibold mb-1" style={{ color: COLOR_AZUL_PRINCIPAL }}>
        {title}
      </h3>
      <p className="text-sm font-sans text-gray-600 mb-2">
        {description}
      </p>
      
      <a 
        href={pdf} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-sm font-sans font-medium transition-colors hover:underline"
        style={linkStyle}
        onMouseEnter={(e) => handleLinkHover(e, true)}
        onMouseLeave={(e) => handleLinkHover(e, false)}
      >
        Ver Documento
      </a>
    </div>
  );
};


export default function Index() {
  return (
    <div className="mt-24 font-sans min-h-screen" style={{ backgroundColor: COLOR_FONDO_CLARO }}>
      
      {/* 1. IMAGEN DE CABECERA - CENTRADA Y LIMITADA */}
      <div className="w-full h-auto mb-10 overflow-hidden">
          <img 
            src={imgHeader} 
            alt="Marco Normativo - Cabecera"
            // Clases para centrar y limitar el ancho
            className="w-full max-w-7xl mx-auto object-cover" 
          />
      </div>

      <div className="px-6 py-10 max-w-4xl mx-auto">
        <h1 
          className="text-4xl font-sans font-extrabold text-center mb-12"
          style={{ color: COLOR_AZUL_PRINCIPAL }}
        >
          Planes y Estrategias Nacionales
        </h1>

        <div className="space-y-6">
          {planes.map((plan, index) => (
            <PlanCard 
              key={index}
              title={plan.title}
              description={plan.description}
              pdf={plan.pdf}
              color={plan.color} 
            />
          ))}
        </div>
        
        <div className="h-10"></div>
      </div>
    </div>
  );
}