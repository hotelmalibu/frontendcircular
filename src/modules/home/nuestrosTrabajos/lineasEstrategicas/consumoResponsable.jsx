import React from "react";
import fondos_submenus from "../../../../assets/fondos_submenus.jpg";
import Index from "../../../../components/home/nuestrosTrabajos/lineasEstrategicas/consumoResponsable/index.jsx";

// --- IMPORTAR ACTIVOS ---
import imgHeader from "../../../../assets/lineasestrategicas/1.png";
import imgLogo from "../../../../assets/lineasestrategicas/consumoresponsable/consumoresponsable.png";

// Colores del manual de marca
const COLOR_AZUL_PRINCIPAL = "#1E305D";
const COLOR_AMARILLO_CONSUMO = "#E8AD00";
const COLOR_AZUL_SECUNDARIO = "#2C67B0"; // Igual que CadenaValor
const COLOR_GRIS_TEXTO = "#333333";

export default function ConsumoResponsable() {
  return (
    <div
      className="mt-24 font-sans min-h-screen"
      style={{
        backgroundImage: `url(${fondos_submenus})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 1. IMAGEN DE CABECERA */}
      <div className="w-full h-auto mb-10 overflow-hidden">
        <img
          src={imgHeader}
          alt="Líneas Estratégicas - Cabecera"
          className="w-full max-w-7xl mx-auto object-cover"
        />
      </div>

      <div className="px-6 md:px-24 pb-14 max-w-7xl mx-auto">
        {/* Título */}
        <h1
          className="text-4xl font-display font-bold text-center mb-10 uppercase"
          style={{ color: COLOR_AZUL_PRINCIPAL }}
        >
          Líneas Estratégicas: Consumo Responsable
        </h1>

        {/* 2. TARJETA PRINCIPAL */}
        <div className="flex flex-col lg:flex-row items-start gap-8 bg-transparent p-6 md:p-10 rounded-xl">
          {/* Izquierda */}
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4">
            <img
              src={imgLogo}
              alt="Consumo Responsable Logo"
              className="w-full max-w-xs h-auto object-contain mb-4"
            />
          </div>

          {/* Derecha */}
          <div className="w-full lg:w-2/3 text-lg font-sans text-left self-center">
            <p className="text-gray-800 leading-relaxed text-2xl mb-4">
              <strong>Sensibilizar y contribuir</strong> al cambio de hábitos y comportamiento
              del consumidor fomentando la correcta separación en la fuente.
            </p>
          </div>
        </div>

        {/* 3. SECCIÓN DE TEXTO ADICIONAL (MISMO ESTILO QUE CADENAVALOR) */}
        <section className="mt-6 text-center max-w-4xl mx-auto p-8 bg-transparent">
          <h2
            className="text-3xl font-sans font-bold mb-4"
            style={{ color: COLOR_AZUL_SECUNDARIO }}
          >
            Enfoque y Alcance de la Línea
          </h2>

          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Esta línea estratégica busca formar consumidores conscientes, 
            <strong> promoviendo prácticas de separación</strong> adecuada de residuos que aporten
            al ciclo de la economía circular.
          </p>
        </section>
      </div>
    </div>
  );
}
