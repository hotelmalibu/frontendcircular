import React from "react";
import fondos_submenus from "../../../../assets/fondos_submenus.jpg";

// --- IMPORTAR ACTIVOS ---
import imgHeader from "../../../../assets/lineasestrategicas/1.png";
import imgLogo from "../../../../assets/lineasestrategicas/cadenasdevalor/cadenasdevalor.png";


// Colores del manual de marca
const COLOR_AZUL_PRINCIPAL = '#1E305D';
// const COLOR_VERDE_PRINCIPAL = '#00AB6D';
const COLOR_AZUL_SECUNDARIO = '#2C67B0'; // Usado para el borde de la nueva sección
// const COLOR_GRIS_TEXTO = '#333333';
// const COLOR_FONDO_CLARO = '#f9f9f9';

export default function CadenaValor() {
  return (
    // Contenedor principal con padding superior para el Navbar fijo y fondo claro
    <div className="mt-24 font-sans min-h-screen" style={{ backgroundImage: `url(${fondos_submenus})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      
      {/* 1. IMAGEN DE CABECERA (CENTRADA Y LIMITADA) */}
      <div className="w-full h-auto mb-10 overflow-hidden">
        <img 
          src={imgHeader} 
          alt="Líneas Estratégicas - Cabecera"
          // Centrada y con ancho máximo
          className="w-full max-w-7xl mx-auto object-cover" 
        />
      </div>

      <div className="px-6 md:px-24 pb-14 max-w-7xl mx-auto">
        
        {/* Título de la página */}
        <h1 
          className="text-4xl font-display font-bold text-center mb-10 uppercase"
          style={{ color: COLOR_AZUL_PRINCIPAL }}
        >
          Líneas Estratégicas: Cadenas de Valor
        </h1>

        {/* 2. CONTENIDO PRINCIPAL: Tarjeta de Fortalecimiento (Diseño original) */}
        <div className="flex flex-col lg:flex-row items-start gap-8 bg-transparent p-6 md:p-10 rounded-xl">
          
          {/* Lado Izquierdo: Logo circular y Título */}
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4">
            <img 
              src={imgLogo} 
              alt="Fortalecimiento de Cadenas de Valor Logo"
              className="w-full max-w-xs h-auto object-contain mb-4" 
            />
          </div>

          {/* Lado Derecho: Descripción */}
          <div className="w-full lg:w-2/3 text-lg font-sans text-left self-center">
            <p className="text-gray-800 leading-relaxed text-2xl mb-4">
              Implementar <strong>un modelo de articulación y fortalecimiento</strong> de gestores y transformadores que
              permita el cumplimiento normativo de <strong>REP</strong> y <strong>PUSU</strong>, y que responda a estrategias corporativas y
              legales.
            </p>
          </div>
        </div>

        {/* 3. --- SECCIÓN DE TEXTO ADICIONAL CENTRADA EN CAJÓN --- */}
        <section className="mt-6 text-center max-w-4xl mx-auto p-8 bg-transparent">
          <h2 className="text-3xl font-sans font-bold mb-4" style={{ color: COLOR_AZUL_SECUNDARIO }}>
            Enfoque y Alcance de la Línea
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Esta línea estratégica busca cerrar <strong>el ciclo de vida de los envases y empaques</strong>,
            promoviendo la colaboración entre todos <strong>los actores de la cadena de valor</strong>, desde el
            productor hasta el transformador final.
          </p>
        </section>

      </div>
    </div>
  );
}