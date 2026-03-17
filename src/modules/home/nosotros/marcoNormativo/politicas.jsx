import React from "react";

// --- IMPORTAR ACTIVOS (PDFs) ---
import pdfGestionResiduos from "../../../../assets/marconormativo/politicas/Política_para_la_gestión_integral_de_ residuos.pdf";
import pdfODS from "../../../../assets/marconormativo/politicas/CONPES 3918_638235471484658132.pdf";
import pdfCrecimientoVerde from "../../../../assets/marconormativo/politicas/CONPES 3934.pdf";
import decreto1381 from "../../../../assets/marconormativo/resoluciones/DECRETO_1381_DE_2024.pdf";
import decreto0670 from "../../../../assets/marconormativo/resoluciones/decreto-0670-del-17-de-junio-de-2025-1.pdf";


// Colores del manual de marca
const COLOR_AZUL_PRINCIPAL = '#1E305D';
const COLOR_VERDE_PRINCIPAL = '#00AB6D';
const COLOR_AZUL_SECUNDARIO = '#2C67B0';



// Datos de las políticas (sin cambios)
const politicas = [
  {
    title: "Política nacional para la gestión integral de residuos sólidos (CONPES 3874 del 2016)",
    description: "Consejo Nacional de Política Económica y Social.",
    pdf: pdfGestionResiduos,
    color: COLOR_VERDE_PRINCIPAL
  },
  {
    title: "Estrategia para la implementación de los Objetivos de Desarrollo Sostenible (ODS) en Colombia (CONPES 3918 de 2018)",
    description: "Consejo Nacional de Política Económica y Social.",
    pdf: pdfODS,
    color: COLOR_AZUL_SECUNDARIO
  },
  {
    title: "Política de Crecimiento Verde (CONPES 3934 del 2018)",
    description: "Consejo Nacional de Política Económica y Social.",
    pdf: pdfCrecimientoVerde,
    color: COLOR_VERDE_PRINCIPAL
  },
  {
    title: "Decreto 1381 de 2024",
    description: "Establece medidas para la gestión integral de residuos y promueve la transición hacia modelos de economía circular.",
    pdf: decreto1381,
    color: COLOR_AZUL_SECUNDARIO
  },
  {
    title: "Decreto 0670 de 2025",
    description: "Fortalece las medidas de gestión ambiental y economía circular, estableciendo nuevos lineamientos para el cumplimiento normativo.",
    pdf: decreto0670,
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
    <div className="font-sans min-h-screen" style={{ color: '#e6e6e6ff' }}>



      <div className="px-6 py-10 mt-24 max-w-4xl mx-auto">
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