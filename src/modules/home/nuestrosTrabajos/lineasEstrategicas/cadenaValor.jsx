import React from "react";
// Ajusta tus rutas según corresponda
import imgLogo from "../../../../assets/lineasestrategicas/cadenasdevalor/cadenasdevalor.png";

// Colores definidos
const COLOR_AZUL_PRINCIPAL = '#1E305D';
const COLOR_VERDE_PRINCIPAL = '#8CB200';
export default function CadenaValor() {
  return (
    <div 
      className="mt-24 font-sans min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 md:p-8" 
      style={{
        backgroundColor: "#e6e6e6ff", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundAttachment: "fixed" 
      }}
    >
      
      {/* --- CONTENEDOR PRINCIPAL (TARJETA FLOTANTE) --- */}
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* --- COLUMNA IZQUIERDA: IDENTIDAD VISUAL (40%) --- */}
        {/* Usamos un fondo con degradado muy sutil para que no sea blanco plano */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br from-white to-gray-50 p-8 lg:p-12 flex flex-col justify-center items-center relative border-b lg:border-b-0 lg:border-r border-gray-100">
          
          {/* Elemento decorativo de fondo (círculo verde difuminado) */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
          
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 self-start">
            Línea Estratégica
          </h2>

          <img 
            src={imgLogo} 
            alt="Fortalecimiento de Cadenas de Valor"
            className="w-full h-auto object-contain drop-shadow-lg transform transition-transform duration-500 hover:scale-105" 
          />

          
        </div>

        {/* --- COLUMNA DERECHA: CONTENIDO (60%) --- */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-between relative">
          
          {/* SECCIÓN SUPERIOR: Objetivo Principal */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gray-800">
              Fortalecimiento de <span style={{ color: COLOR_VERDE_PRINCIPAL }}>Cadenas de Valor</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Implementamos un modelo de <span className="font-semibold text-gray-900">articulación y fortalecimiento</span> de gestores y transformadores.
            </p>

          </div>

          {/* SECCIÓN INFERIOR: La "Caja de Contraste" */}
          {/* Esta caja coloreada llena el espacio visual inferior y destaca el enfoque */}
          <div 
            className="rounded-2xl p-6 md:p-8 text-white shadow-lg transform translate-y-2 relative overflow-hidden"
            style={{ backgroundColor: COLOR_AZUL_PRINCIPAL }}
          >
            {/* Decoración de fondo en la tarjeta azul */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#8CB200' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Enfoque y Alcance
              </h3>
              <p className="text-base md:text-lg opacity-90 leading-relaxed font-light">
                Buscamos cerrar el <strong>ciclo de vida de envases y empaques</strong>, promoviendo la colaboración total entre productores, gestores y transformadores.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}