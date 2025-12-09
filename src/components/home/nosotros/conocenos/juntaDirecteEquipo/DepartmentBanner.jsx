import React from "react";
import iconLogo from "../../../../../assets/imgEquipo/iconologo.png";

const DepartmentBanner = ({ name, role, image, styles }) => {
  return (
    // CONTENEDOR PRINCIPAL CON MARGEN SUPERIOR
    <div className="relative w-full max-w-[550px] mx-auto my-8">
      
      <div 
        className={`absolute -top-8 left-10 z-30 ${styles.headerGradient} text-white text-sm font-bold py-1.5 px-6 rounded-sm shadow-md uppercase tracking-wide`}
      >
        {styles.title}
      </div>

      {/* 2. CUERPO DE LA TARJETA */}
      <div className="relative flex w-[420px] h-[190px]">
        
        {/* BLOQUE DE TEXTO (Izquierda) */}
        <div
          className="relative h-full w-[65%] z-20 flex flex-col justify-center items-end pr-1 pl-6"
          style={{
            backgroundColor: "#DEE5ED", 
            // El corte diagonal exacto: inclinado a la derecha tanto al inicio como al final
            clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0% 100%)"
          }}
        >
          {/* Contenedor interno alineado a la derecha */}
          <div className="flex flex-col items-end gap-1 w-full">
            
            {/* CAJA DEL NOMBRE DE LA PERSONA */}
            <div 
              className={`${styles.bannerNameBg } text-white text-lg font-bold py-2 px-6 shadow-sm text-right leading-none rounded-sm`}
              style={{clipPath: "polygon(0% 0, 100% 0, 97% 100%, 0% 100%)"}}
            >
              {name}
            </div>

            {/* CARGO */}
            <div className="text-[#1E305D] text-sm px-6 font-bold leading-tight text-right mt-1">
              {role}
            </div>

            {/* LOGO */}
            {/* Centrado visualmente con respecto al texto, o alineado a la derecha si prefieres */}
            <div className="mt-6 pr-28">
              {iconLogo ? (
                <img
                  src={iconLogo}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
              )}
            </div>
          </div>

          {/* Línea decorativa inferior (Accent) */}
          <div className={`absolute bottom-0 left-0 h-2 w-full ${styles.bannerAccent}`} />
        </div>

        {/* BLOQUE DE IMAGEN (Derecha) */}
        <div
          className="absolute top-0 right-0 h-full w-[50%] z-10"
          style={{
            // El corte complementario para que la imagen encaje detrás
            clipPath: "polygon(18% 0, 99% 0, 84% 100%, 0% 100%)"
          }}
        >
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
};

export default DepartmentBanner;