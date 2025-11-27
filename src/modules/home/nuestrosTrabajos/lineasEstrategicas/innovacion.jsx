import React from "react";

// --- IMPORTAR ACTIVOS ---
import imgLogo from "../../../../assets/lineasestrategicas/innovacion/innovacion.png";

// Colores del manual y acento específico para esta línea 
const COLOR_ACENTO_INNOVACION = "#9E1981";

export default function Innovacion() {
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
        
        <div className="w-full lg:w-2/5 -br from-white p-8 lg:p-12 flex flex-col justify-center items-center relative border-b lg:border-b-0 lg:border-r border-gray-100">
          
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 self-start">
            Línea Estratégica
          </h2>

          <img
            src={imgLogo}
            alt="Logo Innovación"
            className="w-full h-auto object-contain drop-shadow-lg transform transition-transform duration-500 hover:scale-105"
          />

          
        </div>

        {/* --- COLUMNA DERECHA: CONTENIDO (60%) --- */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-between relative">
          
          {/* SECCIÓN SUPERIOR: Objetivo Principal */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gray-800">
              Línea de <span style={{ color: COLOR_ACENTO_INNOVACION }}>Innovación</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Dinamizamos el <span className="font-semibold text-gray-900">ecosistema de innovación</span> para el cierre de ciclo, promoviendo la tecnificación en toda la cadena.
            </p>

            
          </div>

          {/* SECCIÓN INFERIOR: La "Caja de Contraste" */}
          <div 
            className="rounded-2xl p-6 md:p-8 text-white shadow-lg transform translate-y-2 relative overflow-hidden"
            style={{ backgroundColor: '#1C2C5A' }}
          >
             {/* Decoración abstracta (Circuitos / Conexiones) */}
             <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" >
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                   <circle cx="90%" cy="20%" r="40" stroke="white" strokeWidth="2" fill="none" />
                   <path d="M 80% 20% L 60% 50%" stroke="white" strokeWidth="2" />
                </svg>
             </div>

            <div className="relative z-10">
              {/* Icono de Bombilla/Idea + Título */}
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2"  >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#E0006C' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Enfoque y Alcance
              </h3>
              
              <p className="text-base md:text-lg  leading-relaxed font-light" style={{ color: '#F2F4FF' }}>
                Impulsamos la <strong>búsqueda y transferencia</strong> de nuevas tecnologías para optimizar procesos, incrementar la eficiencia y fortalecer la circularidad.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}