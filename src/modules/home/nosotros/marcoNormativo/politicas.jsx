import React from "react";
// CORRECCIÓN DE RUTA: Apunta a assets/marconormativo/1.png
import imgHeader from "../../../../assets/marconormativo/1.png";

// --- IMPORTAR ACTIVOS (PDFs) ---
import pdfGestionResiduos from "../../../../assets/marconormativo/politicas/Política_para_la_gestión_integral_de_ residuos.pdf"; 
import pdfODS from "../../../../assets/marconormativo/politicas/CONPES 3918_638235471484658132.pdf";
import pdfCrecimientoVerde from "../../../../assets/marconormativo/politicas/CONPES 3934.pdf";


// Colores del manual de marca
const COLOR_AZUL_PRINCIPAL = '#1E305D';
const COLOR_VERDE_PRINCIPAL = '#00AB6D';
const COLOR_AZUL_SECUNDARIO = '#2C67B0';
const COLOR_FONDO_CLARO = '#f9f9f9'; 


// Datos de las políticas (sin cambios)
const politicas = [
  {
    title: "Política nacional para la gestión integral de residuos sólidos (CONPES 3874 del 2016)",
    description: "Consejo Nacional de Política Económica y Social | 2016 - 2030",
    pdf: pdfGestionResiduos,
    color: COLOR_VERDE_PRINCIPAL
  },
  {
    title: "Estrategia para la implementación de los Objetivos de Desarrollo Sostenible (ODS) en Colombia (CONPES 3918 de 2018)",
    description: "Consejo Nacional de Política Económica y Social | 2017 - 2030",
    pdf: pdfODS,
    color: COLOR_AZUL_SECUNDARIO 
  },
  {
    title: "Política de Crecimiento Verde (CONPES 3934 del 2018)",
    description: "Consejo Nacional de Política Económica y Social | 2018",
    pdf: pdfCrecimientoVerde,
    color: COLOR_VERDE_PRINCIPAL 
  }
];

// Función para manejar el hover de los links (sin cambios)
const handleLinkHover = (e, isHovering) => {
  e.target.style.color = isHovering ? COLOR_VERDE_PRINCIPAL : COLOR_AZUL_SECUNDARIO;
};


// Componente para una tarjeta de política individual (sin cambios)
const PoliticaCard = ({ title, description, pdf, color }) => {
  const linkStyle = {
    transition: 'color 0.3s ease',
    color: COLOR_AZUL_SECUNDARIO,
    textDecoration: 'none',
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
          Normativas de interés
        </h1>

        <div className="space-y-6">
          {politicas.map((politica, index) => (
            <PoliticaCard 
              key={index}
              title={politica.title}
              description={politica.description}
              pdf={politica.pdf}
              color={politica.color}
            />
          ))}
        </div>
        
        <div className="h-10"></div>
      </div>
    </div>
  );
}