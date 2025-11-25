import React from "react";
// --- IMPORTAR ACTIVOS ---
import imgLogo from "../../../../assets/lineasestrategicas/consumoresponsable/consumoresponsable.png";

// Colores del manual de marca y específicos de esta línea
const COLOR_AZUL_PRINCIPAL = "#1E305D";
const COLOR_AMARILLO_CONSUMO = "#E8AD00"; // Color distintivo para esta sección
const COLOR_FONDO_CLARO = "#FFFDF5"; // Un fondo crema muy sutil para variar del blanco puro

export default function ConsumoResponsable() {
  return (
    <div
      className="mt-24 font-sans min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: '#e6e6e6ff',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", 
      }}
    >
      
      {/* --- CONTENEDOR PRINCIPAL (TARJETA FLOTANTE) --- */}
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* --- COLUMNA IZQUIERDA: IDENTIDAD VISUAL (40%) --- */}
        {/* Fondo con un gradiente sutil hacia el tono cálido/amarillo */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br from-white to-orange-50 p-8 lg:p-12 flex flex-col justify-center items-center relative border-b lg:border-b-0 lg:border-r border-gray-100">
          
          {/* Decoración de fondo (Círculo difuminado amarillo) */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2"></div>
          
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 self-start">
            Línea Estratégica
          </h2>

          <img
            src={imgLogo}
            alt="Logo Consumo Responsable"
            className="w-full h-auto object-contain drop-shadow-lg transform transition-transform duration-500 hover:scale-105"
          />

          {/* Adorno visual debajo del logo (Azul + Amarillo) */}
          <div className="mt-8 flex gap-2">
            <div className="h-2 w-16 rounded-full" style={{ backgroundColor: COLOR_AZUL_PRINCIPAL }}></div>
            <div className="h-2 w-4 rounded-full" style={{ backgroundColor: COLOR_AMARILLO_CONSUMO }}></div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: CONTENIDO (60%) --- */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-between relative">
          
          {/* SECCIÓN SUPERIOR: Objetivo Principal */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gray-800">
              Fomento del <span style={{ color: COLOR_AMARILLO_CONSUMO }}>Consumo Responsable</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Trabajamos para <span className="font-semibold text-gray-900">sensibilizar y contribuir</span> al cambio de hábitos y comportamiento del consumidor.
            </p>

            {/* Badges / Etiquetas Visuales */}
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="px-4 py-2 rounded-lg font-bold text-sm bg-yellow-50 text-yellow-800 border border-yellow-100 shadow-sm">
                Cambio de Hábitos
              </span>
              <span className="px-4 py-2 rounded-lg font-bold text-sm bg-blue-50 text-blue-900 border border-blue-100 shadow-sm">
                Separación en la Fuente
              </span>
              <span className="px-4 py-2 rounded-lg font-bold text-sm bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">
                Cultura Ciudadana
              </span>
            </div>
          </div>

          {/* SECCIÓN INFERIOR: La "Caja de Contraste" */}
          {/* Fondo Azul Oscuro para consistencia con la marca */}
          <div 
            className="rounded-2xl p-6 md:p-8 text-white shadow-lg transform translate-y-2 relative overflow-hidden"
            style={{ backgroundColor: COLOR_AZUL_PRINCIPAL }}
          >
             {/* Decoración de fondo sutil */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-xl"></div>

            <div className="relative z-10">
              {/* Icono + Título usando el amarillo de acento */}
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: COLOR_AMARILLO_CONSUMO }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Enfoque y Alcance
              </h3>
              
              <p className="text-base md:text-lg opacity-90 leading-relaxed font-light">
                Esta línea busca formar <strong>consumidores conscientes</strong>, promoviendo prácticas que aporten directamente al ciclo de la <strong>economía circular</strong>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}