import React from "react";
// Recuperamos el fondo común
import fondos_submenus from "../../../../assets/fondos_submenus.jpg";

// --- IMPORTAR ACTIVO ESPECÍFICO ---
// Asegúrate de que la ruta y la extensión (.jpg) sean correctas según tu estructura
import imgLogo from "../../../../assets/lineasestrategicas/pedagogia/Pedagogia.png";

// Colores del sistema de diseño
const COLOR_AZUL_PRINCIPAL = "#1E305D";
const COLOR_ACENTO_PEDAGOGIA = "#F59E0B"; // Ámbar/Ocre para Educación y Cultura

export default function PedagogiaSensibilizacion() {
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
        {/* Fondo con degradado suave hacia ámbar/amarillo */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br  p-8 lg:p-12 flex flex-col justify-center items-center relative border-b lg:border-b-0 lg:border-r border-gray-100">
          
          {/* Decoración de fondo (Círculo de luz/conocimiento) */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-60"></div>
          
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 self-start">
            Línea Estratégica
          </h2>

          <img
            src={imgLogo}
            alt="Logo Pedagogía y Sensibilización"
            // mix-blend-multiply ayuda a que si el JPG tiene fondo blanco, se integre mejor con el degradado
            className="w-full h-auto object-contain drop-shadow-lg transform transition-transform duration-500 hover:scale-105 mix-blend-multiply"
          />

        </div>

        {/* --- COLUMNA DERECHA: CONTENIDO (60%) --- */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-between relative">
          
          {/* SECCIÓN SUPERIOR: Objetivo Principal */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gray-800">
              Pedagogía y <span style={{ color: COLOR_ACENTO_PEDAGOGIA }}>Sensibilización</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Diseñamos e implementamos estrategias educativas para <span className="font-semibold text-gray-900">transformar la cultura</span> del consumo y promover la sostenibilidad.
            </p>

            
          </div>

          {/* SECCIÓN INFERIOR: La "Caja de Contraste" */}
          <div 
            className="rounded-2xl p-6 md:p-8 text-white shadow-lg transform translate-y-2 relative overflow-hidden"
            style={{ backgroundColor: COLOR_AZUL_PRINCIPAL }}
          >
             {/* Decoración: Ondas de sonido / Expansión */}
             <div className="absolute top-[-50%] right-[-10%] w-64 h-64 border-4 border-white opacity-5 rounded-full"></div>
             <div className="absolute top-[-40%] right-[-5%] w-48 h-48 border-4 border-white opacity-5 rounded-full"></div>

            <div className="relative z-10">
              {/* Icono de Megáfono/Comunicación + Título */}
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: COLOR_ACENTO_PEDAGOGIA }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Enfoque y Alcance
              </h3>
              
              <p className="text-base md:text-lg opacity-90 leading-relaxed font-light">
                Buscamos <strong>generar consciencia</strong> en el consumidor final mediante campañas de comunicación y pedagogía que fomenten la <strong>separación adecuada</strong> en la fuente.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}