import React from "react";
// Importamos el componente Index
import Index from "../../../../components/home/nuestrosTrabajos/lineasEstrategicas/proyectoEstrategico/index.jsx";

// --- IMPORTAR ACTIVOS ---
import imgHeader from "../../../../assets/lineasestrategicas/1.png";
import imgLogo from "../../../../assets/lineasestrategicas/proyectos/proyectos.png";


// Colores del manual de marca
const COLOR_AZUL_PRINCIPAL = '#1E305D';
const COLOR_AZUL_PROYECTOS = '#2C67B0'; // Azul primario para el énfasis
const COLOR_FONDO_CLARO = '#f9f9f9';


export default function ProyectoEstrategico() {
  return (
    // Contenedor principal con padding superior para el Navbar fijo y fondo claro
    <div className="mt-24 font-sans min-h-screen" style={{ backgroundColor: COLOR_FONDO_CLARO }}>
      
      {/* 1. IMAGEN DE CABECERA (CENTRADA Y LIMITADA) */}
      <div className="w-full h-auto mb-10 overflow-hidden">
        <img 
          src={imgHeader} 
          alt="Líneas Estratégicas - Cabecera"
          className="w-full max-w-7xl mx-auto object-cover" // <-- MODIFICACIÓN
        />
      </div>

      <div className="px-6 md:px-24 pb-14 max-w-7xl mx-auto">
        
        {/* Título de la página */}
        <h1 
          className="text-4xl font-display font-bold text-center mb-10 uppercase"
          style={{ color: COLOR_AZUL_PRINCIPAL }}
        >
          Líneas Estratégicas: Proyectos Estratégicos
        </h1>

        {/* 2. CONTENIDO PRINCIPAL: Tarjeta de Proyectos Estratégicos */}
        <div className="flex flex-col lg:flex-row items-start gap-8 bg-white p-6 md:p-10 rounded-xl shadow-xl border-t-4" style={{ borderColor: COLOR_AZUL_PROYECTOS }}>
          
          {/* Lado Izquierdo: Logo circular y Título */}
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4">
            <img 
              src={imgLogo} 
              alt="Proyectos Estratégicos Logo"
              className="w-full max-w-xs h-auto object-contain mb-4" 
            />
          </div>

          {/* Lado Derecho: Descripción y Texto */}
          <div className="w-full lg:w-2/3 text-lg font-sans text-left self-center">
            <p className="text-gray-800 leading-relaxed text-2xl mb-4">
              Desarrollar modelos para implementar y escalar
              estrategias para el fortalecimiento de la economía
              circular con enfoque en residuos sólidos
              aprovechables
            </p>
            {/* Quitamos el texto en itálica de aquí */}
            <Index /> {/* Componente de contenido genérico */}
          </div>
        </div>

        {/* 3. --- SECCIÓN DE TEXTO ADICIONAL CENTRADA EN CAJÓN --- */}
        <section 
          className="mt-16 text-center max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border-t-4" // <-- Estilo de cajón aplicado
          style={{ borderColor: COLOR_AZUL_PROYECTOS }} // <-- Borde superior Azul
        >
          <h2 className="text-3xl font-sans font-bold mb-4" style={{ color: COLOR_AZUL_PRINCIPAL }}>
            Enfoque y Alcance de la Línea
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            *Esta línea de acción se centra en la ejecución de iniciativas piloto y proyectos a gran escala, tanto a nivel territorial como sectorial, para demostrar la viabilidad de la economía circular.
          </p>
        </section>

      </div>
    </div>
  );
}