import React from "react";
// Recuperamos el fondo de imagen para mantener la coherencia con la colección
import fondos_submenus from "../../../../assets/fondos_submenus.jpg";

// --- IMPORTAR ACTIVOS ---
import imgLogo from "../../../../assets/lineasestrategicas/proyectos/proyectos.png";

// Colores del manual y acento específico para esta línea
const COLOR_AZUL_PRINCIPAL = "#1E305D";
const COLOR_ACENTO_PROYECTOS = "#2B65AC"; // Violeta/Púrpura para Estrategia y Escalamiento

export default function ProyectoEstrategico() {
  return (
    <div
      className="mt-24 font-sans min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundImage: `url(${fondos_submenus})`, // Usamos la imagen para uniformidad
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Efecto Parallax
      }}
    >
      
      {/* --- CONTENEDOR PRINCIPAL (TARJETA FLOTANTE) --- */}
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* --- COLUMNA IZQUIERDA: IDENTIDAD VISUAL (40%) --- */}
        {/* Fondo con degradado suave hacia violeta */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br from-white to-purple-50 p-8 lg:p-12 flex flex-col justify-center items-center relative border-b lg:border-b-0 lg:border-r border-gray-100">
          
          {/* Decoración de fondo (Aura estratégica) */}
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
          
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 self-start">
            Línea Estratégica
          </h2>

          <img
            src={imgLogo}
            alt="Logo Proyectos Estratégicos"
            className="w-full h-auto object-contain drop-shadow-lg transform transition-transform duration-500 hover:scale-105"
          />

          {/* Adorno visual inferior */}
          <div className="mt-8 flex gap-2">
            <div className="h-2 w-16 rounded-full" style={{ backgroundColor: COLOR_AZUL_PRINCIPAL }}></div>
            <div className="h-2 w-4 rounded-full" style={{ backgroundColor: COLOR_ACENTO_PROYECTOS }}></div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: CONTENIDO (60%) --- */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-between relative">
          
          {/* SECCIÓN SUPERIOR: Objetivo Principal */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gray-800">
              Proyectos <span style={{ color: COLOR_ACENTO_PROYECTOS }}>Estratégicos</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Desarrollamos modelos para <span className="font-semibold text-gray-900">implementar y escalar estrategias</span> de fortalecimiento de la economía circular.
            </p>

            {/* Badges / Etiquetas Visuales */}
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="px-4 py-2 rounded-lg font-bold text-sm bg-purple-50 text-purple-900 border border-purple-100 shadow-sm">
                Escalamiento
              </span>
              <span className="px-4 py-2 rounded-lg font-bold text-sm bg-blue-50 text-blue-900 border border-blue-100 shadow-sm">
                Residuos Aprovechables
              </span>
              <span className="px-4 py-2 rounded-lg font-bold text-sm bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">
                Modelos Piloto
              </span>
            </div>
          </div>

          {/* SECCIÓN INFERIOR: La "Caja de Contraste" */}
          <div 
            className="rounded-2xl p-6 md:p-8 text-white shadow-lg transform translate-y-2 relative overflow-hidden"
            style={{ backgroundColor: COLOR_AZUL_PRINCIPAL }}
          >
             {/* Decoración: Mapa de puntos / Conexiones */}
             <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
                <svg viewBox="0 0 100 100" fill="white">
                    <circle cx="10" cy="90" r="4" />
                    <circle cx="30" cy="70" r="4" />
                    <circle cx="50" cy="80" r="4" />
                    <circle cx="80" cy="40" r="6" />
                </svg>
             </div>

            <div className="relative z-10">
              {/* Icono de Cohete/Lanzamiento + Título */}
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: COLOR_ACENTO_PROYECTOS }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /> 
                  {/* Nota: Usé el rayo/impulso, pero podrías usar un mapa o bandera */}
                </svg>
                Enfoque y Alcance
              </h3>
              
              <p className="text-base md:text-lg opacity-90 leading-relaxed font-light">
                Impulsamos <strong>estrategias territoriales</strong> que permiten validar y escalar modelos de economía circular en diferentes <strong>sectores productivos y regiones</strong>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}