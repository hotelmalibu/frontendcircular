import React from "react";
import fondos_submenus from "../../../../assets/fondos_submenus.jpg";

// --- IMPORTAR ACTIVOS ---
import imgHeader from "../../../../assets/lineasestrategicas/1.png";
import imgLogo from "../../../../assets/lineasestrategicas/proyectos/proyectos.png";

// Colores del manual de marca (MISMA PALETA)
const COLOR_AZUL_PRINCIPAL = "#1E305D";
// const COLOR_VERDE_PRINCIPAL = "#00AB6D";
const COLOR_AZUL_SECUNDARIO = "#00AB6D"; // Borde superior de sección
// const COLOR_GRIS_TEXTO = "#333333";
// const COLOR_FONDO_CLARO = "#f9f9f9";

export default function ProyectoEstrategico() {
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
        {/* TÍTULO PRINCIPAL */}
        <h1
          className="text-4xl font-display font-bold text-center mb-10 uppercase"
          style={{ color: COLOR_AZUL_PRINCIPAL }}
        >
          Líneas Estratégicas: Proyectos Estratégicos
        </h1>
        <div
          className="w-[65%] h-1 mx-auto mb-8"
          style={{ backgroundColor: COLOR_AZUL_PRINCIPAL }}
        ></div>

        {/* 2. TARJETA PRINCIPAL (MISMA ESTRUCTURA QUE CADENA VALOR) */}
        <div className="flex flex-col lg:flex-row items-start gap-8 p-6 md:p-10 rounded-xl bg-transparent">
          {/* LADO IZQUIERDO: LOGO */}
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4">
            <img
              src={imgLogo}
              alt="Proyectos Estratégicos Logo"
              className="w-full max-w-xs h-auto object-contain mb-4"
            />
          </div>

          {/* LADO DERECHO: TEXTO */}
          <div className="w-full lg:w-2/3 text-lg font-sans text-left self-center">
            <p className="text-gray-800 leading-relaxed text-2xl mb-4">
              Desarrollar modelos para <strong>implementar y escalar estrategias</strong> para el
              fortalecimiento de la <strong>economía circular</strong> con enfoque en residuos
              sólidos aprovechables.
            </p>

            {/* Componente dinámico */}
          </div>
        </div>

        {/* 3. SECCIÓN ADICIONAL — MISMO ESTILO */}
        <section className="mt-6 text-center max-w-4xl mx-auto p-8 bg-transparent">
          <h2
            className="text-3xl font-sans font-bold mb-4"
            style={{ color: COLOR_AZUL_SECUNDARIO }}
          >
            Enfoque y Alcance de la Línea
          </h2>

          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Esta línea de acción impulsa <strong>proyectos piloto y estrategias
            territoriales</strong> que permiten validar y escalar modelos de economía
            circular en diferentes sectores <strong>productivos y regiones del país</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
