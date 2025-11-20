import React from "react";
import fondos_submenus from "../../../../assets/fondos_submenus.jpg";
// Importamos el componente Index
import Index from "../../../../components/home/nuestrosTrabajos/lineasEstrategicas/inclusionSocialProductiva/index.jsx"; // Ruta corregida

// --- IMPORTAR ACTIVOS ---
import imgHeader from "../../../../assets/lineasestrategicas/1.png";
import imgLogo from "../../../../assets/lineasestrategicas/inclusion/inclusion.png"; // <-- RUTA CORREGIDA


// Colores del manual de marca
const COLOR_AZUL_PRINCIPAL = '#1E305D';
const COLOR_ROJO_INCLUSION = '#E15200'; // Rojo/Naranja de Inclusión
const COLOR_FONDO_CLARO = '#f9f9f9';


export default function InclusionSocialProductiva() { // Nombre corregido
  return (
    // Contenedor principal con padding superior para el Navbar fijo y fondo claro
    <div className="mt-24 font-sans min-h-screen" style={{ backgroundImage: `url(${fondos_submenus})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      
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
          Líneas Estratégicas: Inclusión Social y Productiva
        </h1>

        {/* 2. CONTENIDO PRINCIPAL: Tarjeta de Inclusión */}
        <div className="flex flex-col lg:flex-row items-start gap-8 bg-white p-6 md:p-10 rounded-xl shadow-xl border-t-4" style={{ borderColor: COLOR_ROJO_INCLUSION }}>
          
          {/* Lado Izquierdo: Logo circular y Título */}
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4">
            <img 
              src={imgLogo} 
              alt="Inclusión Social y Productiva Logo"
              className="w-full max-w-xs h-auto object-contain mb-4" 
            />
          </div>

          {/* Lado Derecho: Descripción y Texto */}
          <div className="w-full lg:w-2/3 text-lg font-sans text-left self-center">
            <p className="text-gray-800 leading-relaxed text-2xl mb-4">
              Impulsar estrategias y acciones dirigidas a cerrar
              brechas de los actores de la cadena, para mejorar
              el impacto de los modelos de economía circular
              con énfasis en REP
            </p>
            {/* Quitamos el texto en itálica de aquí */}
            <Index /> {/* Componente de contenido genérico */}
          </div>
        </div>

        {/* 3. --- SECCIÓN DE TEXTO ADICIONAL CENTRADA EN CAJÓN --- */}
        <section 
          className="mt-16 text-center max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border-t-4" // <-- Estilo de cajón aplicado
          style={{ borderColor: COLOR_ROJO_INCLUSION }} // <-- Borde superior Rojo/Naranja
        >
          <h2 className="text-3xl font-sans font-bold mb-4" style={{ color: COLOR_AZUL_PRINCIPAL }}>
            Enfoque y Alcance de la Línea
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            *Esta línea se enfoca en la equidad y el desarrollo de capacidades dentro de la cadena de valor, asegurando que los beneficios de la economía circular sean accesibles para todos los actores.
          </p>
        </section>

      </div>
    </div>
  );
}