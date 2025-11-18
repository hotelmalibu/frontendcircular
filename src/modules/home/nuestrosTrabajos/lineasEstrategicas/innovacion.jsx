import React from "react";
// Importamos el componente Index
import Index from "../../../../components/home/nuestrosTrabajos/lineasEstrategicas/innovacion/index.jsx";

// --- IMPORTAR ACTIVOS ---
import imgHeader from "../../../../assets/lineasestrategicas/1.png";
import imgLogo from "../../../../assets/lineasestrategicas/innovacion/innovacion.png";


// Colores del manual de marca y uno morado para Innovación
const COLOR_AZUL_PRINCIPAL = '#1E305D';
const COLOR_MORADO_INNOVACION = '#9E1981'; // Tomado del Manual de Marca (paleta secundaria)
const COLOR_FONDO_CLARO = '#f9f9f9';


export default function Innovacion() {
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
          Líneas Estratégicas: Innovación
        </h1>

        {/* 2. CONTENIDO PRINCIPAL: Tarjeta de Innovación */}
        <div className="flex flex-col lg:flex-row items-start gap-8 bg-white p-6 md:p-10 rounded-xl shadow-xl border-t-4" style={{ borderColor: COLOR_MORADO_INNOVACION }}>
          
          {/* Lado Izquierdo: Logo circular y Título */}
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4">
            <img 
              src={imgLogo} 
              alt="Innovación Logo"
              className="w-full max-w-xs h-auto object-contain mb-4" 
            />
          </div>

          {/* Lado Derecho: Descripción y Texto */}
          <div className="w-full lg:w-2/3 text-lg font-sans text-left self-center">
            <p className="text-gray-800 leading-relaxed text-2xl mb-4">
              Dinamizar el ecosistema de innovación para el cierre de ciclo de Envases y Empaques, 
              promoviendo la tecnificación en toda la cadena de valor y fortaleciendo la capacidad para atracción
              de recursos
            </p>
            {/* Quitamos el texto en itálica de aquí */}
            <Index /> {/* Componente de contenido genérico */}
          </div>
        </div>

        {/* 3. --- SECCIÓN DE TEXTO ADICIONAL CENTRADA EN CAJÓN --- */}
        <section 
          className="mt-16 text-center max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border-t-4" // <-- Estilo de cajón aplicado
          style={{ borderColor: COLOR_MORADO_INNOVACION }} // <-- Borde superior Morado
        >
          <h2 className="text-3xl font-sans font-bold mb-4" style={{ color: COLOR_AZUL_PRINCIPAL }}>
            Enfoque y Alcance de la Línea
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            *Esta línea de acción se centra en la búsqueda y aplicación de nuevas tecnologías y metodologías para mejorar la eficiencia del proceso circular.
          </p>
        </section>

      </div>
    </div>
  );
}