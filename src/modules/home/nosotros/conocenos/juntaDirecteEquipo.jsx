import React from "react";
import { motion } from "framer-motion";

// 1. Importaciones Generales
import iconLogo from "../../../../assets/imgEquipo/iconologo.png";
import andiLogo from "../../../../assets/imgEquipo/andi.png";
import monicaV from "../../../../assets/imgEquipo/monicav.jpg";

// 2. Importaciones de Departamentos
import DeptInnovacion from "../../../../components/home/nosotros/conocenos/juntaDirecteEquipo/DeptInnovacion";
import DeptAdministrativa from "../../../../components/home/nosotros/conocenos/juntaDirecteEquipo/DeptAdministrativa";
import DeptCircularidad from "../../../../components/home/nosotros/conocenos/juntaDirecteEquipo/DeptCircularidad";
import DeptProyectos from "../../../../components/home/nosotros/conocenos/juntaDirecteEquipo/DeptProyectos";

// Banner único de la Directora (Mantenido aquí por ser único)
const DirectorBanner = ({ name, role, image }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-[72%] max-w-3xl h-[300px] mx-auto"
    >
      {/* Fondo izquierdo */}
      <div
        className="absolute top-0 left-0 h-full z-0 bg-[#DCE4F2]"
        style={{
          width: "72%",
          borderTopLeftRadius: "60px",
          clipPath: "polygon(18% 0, 100% 0, 84% 100%, 0% 100%)"
        }}
      >
        <div className="absolute bottom-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#A3D95B] to-[#007D6A]" />
      </div>

      {/* Texto directora */}
      <div
        className="absolute top-0 left-0 h-full z-20 flex flex-col justify-center items-center"
        style={{ width: "72%" }}
      >
        <div className="flex flex-col items-center justify-center pl-40 pr-10">
          <div className="bg-gradient-to-r from-[#02897B] to-[#186B73] text-white text-right text-2xl md:text-3xl font-extrabold py-4 px-10 shadow-md mb-4 tracking-wide leading-none"
            style={{ clipPath: "polygon(0% 0, 100% 0, 94% 100%, 0% 100%)" }}>
            {name}
          </div>
          <div className="text-black text-lg md:text-xl font-bold leading-tight pl-10 text-right uppercase mb-8">
            DIRECTORA
            <br />
            VISIÓN CIRCULAR
          </div>
          <div className="pr-44">
            {iconLogo ? (
              <img
                src={iconLogo}
                alt="Visión Circular Logo"
                className="w-14 h-14 md:w-18 md:h-18 object-contain"
              />
            ) : (
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
            )}
          </div>
        </div>
      </div>

      {/* Imagen directora derecha */}
      <div
        className="absolute top-0 right-0 h-full z-10"
        style={{
          width: "45%",
          clipPath: "polygon(28% 0, 100% 0, 74% 100%, 0% 100%)"
        }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top"
        />
      </div>
    </motion.div>
  );
};

export default function TeamOrgChart() {
  return (
    
    <section className="bg-[#F9FAFB] pt-36 pb-12 px-2 md:px-4 font-sans min-h-screen">
      
      <div className="w-full max-w-[95%] mx-auto">
        {/* HEADER */}
        <div className="text-center mb-2">
          <div className="bg-[#DCE4F2] inline-block px-6 py-1.5 rounded-full mb-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#1E305D] uppercase tracking-wide">
              Nuestro Equipo
            </h2>
          </div>
          <p className="text-gray-500 text-xs md:text-sm">
            Un equipo multidisciplinario comprometido con la circularidad y la innovación.
          </p>
        </div>

        {/* LOGOS SUPERIORES */}
        <div className="flex flex-row items-center justify-center gap-6 mb-6 flex-wrap mt-2">
          <div className="shrink-0">
            {andiLogo && (
              <img
                src={andiLogo}
                alt="ANDI"
                className="h-10 w-auto object-contain"
              />
            )}
          </div>
          <div className="text-[#1E305D] font-bold text-base md:text-lg">
            Asamblea de productores
          </div>
          <span className="text-[#1E305D] font-bold text-base md:text-lg">
            Junta directiva
          </span>
        </div>

        {/* DIRECTORA */}
        <div className="flex justify-center mb-16 mt-8" >
          <DirectorBanner
            name="Mónica Villegas"
            role="DIRECTORA VISIÓN CIRCULAR"
            image={monicaV}
          />
        </div>

        {/* LISTA DE DEPARTAMENTOS */}
        <div className="flex flex-col gap-8 w-full">
          <DeptInnovacion />
          <DeptAdministrativa />
          <DeptCircularidad />
          <DeptProyectos />
        </div>
      </div>
    </section>
  );
}