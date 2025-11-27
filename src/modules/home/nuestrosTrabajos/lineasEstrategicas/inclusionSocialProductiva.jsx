import React from "react";

// --- IMPORTAR ACTIVOS ---
import imgLogo from "../../../../assets/lineasestrategicas/inclusion/inclusion.png";

// Colores del manual y acento específico para esta línea
const COLOR_AZUL_PRINCIPAL = "#1E305D";
const COLOR_ACENTO_INCLUSION = "#CD0000"; 
const COLOR_FONDO_CLARO = "#FFF5F8"; // Fondo rosado muy pálido

export default function InclusionSocialProductiva() {
  return (
    <div
      className="mt-24 font-sans min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: '#e6e6e6ff',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Efecto Parallax
      }}
    >
      
      {/* --- CONTENEDOR PRINCIPAL (TARJETA FLOTANTE) --- */}
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* --- COLUMNA IZQUIERDA: IDENTIDAD VISUAL (40%) --- */}
        {/* Fondo con degradado suave hacia el tono de acento */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br from-white to-pink-50 p-8 lg:p-12 flex flex-col justify-center items-center relative border-b lg:border-b-0 lg:border-r border-gray-100">
          
          {/* Decoración de fondo (Mancha de color difuminada) */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-50 translate-x-1/4 -translate-y-1/4"></div>
          
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 self-start">
            Línea Estratégica
          </h2>

          <img
            src={imgLogo}
            alt="Logo Inclusión Social y Productiva"
            className="w-full h-auto object-contain drop-shadow-lg transform transition-transform duration-500 hover:scale-105"
          />

         
        </div>

        {/* --- COLUMNA DERECHA: CONTENIDO (60%) --- */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-between relative">
          
          {/* SECCIÓN SUPERIOR: Objetivo Principal */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gray-800">
              Inclusión Social y <span style={{ color: COLOR_ACENTO_INCLUSION }}>Productiva</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Impulsamos <span className="font-semibold text-gray-900">estrategias para cerrar brechas</span> entre los actores de la cadena, mejorando el impacto de la economía circular.
            </p>

          
          </div>

          {/* SECCIÓN INFERIOR: La "Caja de Contraste" */}
          <div 
            className="rounded-2xl p-6 md:p-8 text-white shadow-lg transform translate-y-2 relative overflow-hidden"
            style={{ backgroundColor: COLOR_AZUL_PRINCIPAL }}
          >
             {/* Decoración geométrica de fondo */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full"></div>

            <div className="relative z-10">
              {/* Icono de Grupo/Personas + Título */}
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#d31c1cff'   }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Enfoque y Alcance
              </h3>
              
              <p className="text-base md:text-lg opacity-90 leading-relaxed font-light">
                Garantizamos que los beneficios de la economía circular lleguen a <strong>todos los actores</strong>, fomentando la formalización y la inclusión productiva real.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}