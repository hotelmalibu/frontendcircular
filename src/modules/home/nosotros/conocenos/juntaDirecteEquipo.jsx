import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import teamApi from "../../../../api/teamApi";


// --- IMPORTS LOGOS JUNTA DIRECTIVA ---
import logoDarnel from "../../../../assets/LogosJuntaDirectiva/logo-darnel.png";
import logoAlimentosPolar from "../../../../assets/LogosJuntaDirectiva/Alimentos_polar_logo.jpg";
import logoArcosDorados from "../../../../assets/LogosJuntaDirectiva/logo_Arcos_Dorados.png";
import logoBelcorp from "../../../../assets/LogosJuntaDirectiva/logo_Belcorp.png";
import logoColombina from "../../../../assets/LogosJuntaDirectiva/Logo_Colombina.png";
import logoCorona from "../../../../assets/LogosJuntaDirectiva/Logo_Corona.png";
import logoDiana from "../../../../assets/LogosJuntaDirectiva/logo_diana.png";
import logoEterna from "../../../../assets/LogosJuntaDirectiva/logo_eterna.png";
import logoEssity from "../../../../assets/LogosJuntaDirectiva/Logo_Essity.png";
import logoNutresa from "../../../../assets/LogosJuntaDirectiva/Logo_Nutresa.jfif";
import logoMakro from "../../../../assets/LogosJuntaDirectiva/logo_makro.png";
import logoNatura from "../../../../assets/LogosJuntaDirectiva/Logo_Natura.png";
import logoNestle from "../../../../assets/LogosJuntaDirectiva/Nestle_Logo.png";
import logoWhirlpool from "../../../../assets/LogosJuntaDirectiva/Logo_Whirpool.png";

// --- IMPORTS IMÁGENES EQUIPO (Galerías Completas) ---
import andiLogo from "../../../../assets/imgEquipo/andi.png";
import groupPhoto from "../../../../assets/imgEquipo/group_photo.jpg";

// --- HERRAMIENTA DE RUTAS DE IMAGEN ---
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http') && !path.includes('localhost')) return path;
  const cleanPath = path.replace(/^(https?:\/\/localhost(:\d+)?\/)?(storage\/)?/, '');
  return `https://api-ecocircular.creativostecnologicosit.com/storage/${cleanPath}`;
};

// --- CONSTANTES DE ESTILO ---
const STYLE_INNOVACION = {
  title: "Innovación",
  color: "#9E1981",
  bgGradient: "bg-gradient-to-t from-[#9E1981] via-[#9E1981]/80 to-transparent",
};

const STYLE_ADMINISTRATIVA = {
  title: "Administrativa y Financiera",
  color: "#E15200",
  bgGradient: "bg-gradient-to-t from-[#E15200] via-[#E15200]/80 to-transparent",
};

const STYLE_CIRCULARIDAD = {
  title: "Circularidad y Regionales",
  color: "#8CB200",
  bgGradient: "bg-gradient-to-t from-[#8CB200] via-[#8CB200]/80 to-transparent",
};

const STYLE_PROYECTOS = {
  title: "Proyectos y Sostenibilidad",
  color: "#2C65AC",
  bgGradient: "bg-gradient-to-t from-[#2C65AC] via-[#2C65AC]/80 to-transparent",
};

const STYLE_RED = {
  title: "Coordinador de Proyectos",
  color: "#DF0024",
  bgGradient: "bg-gradient-to-t from-[#DF0024] via-[#DF0024]/80 to-transparent",
};

const STYLES_MAP = {
  INNOVACION: STYLE_INNOVACION,
  ADMINISTRATIVA: STYLE_ADMINISTRATIVA,
  CIRCULARIDAD: STYLE_CIRCULARIDAD,
  PROYECTOS: STYLE_PROYECTOS,
  RED: STYLE_RED,
};

// --- DATOS JUNTA DIRECTIVA ---
const boardMembers = [
  { name: "Grupo Essitty", logo: logoEssity, position: "Presidencia" },
  { name: "Grupo Nutresa", logo: logoNutresa, position: "Vicepresidencia" },
  { name: "Ajover Darnell", logo: logoDarnel },
  { name: "Alimentos Polar", logo: logoAlimentosPolar },
  { name: "Arcos Dorados", logo: logoArcosDorados },
  { name: "Belcorp", logo: logoBelcorp },
  { name: "Colombina", logo: logoColombina },
  { name: "Corona", logo: logoCorona },
  { name: "Diana Corporación", logo: logoDiana },
  { name: "Eterna", logo: logoEterna },
  { name: "Makro", logo: logoMakro, isWhite: true },
  { name: "Natura", logo: logoNatura },
  { name: "Nestlé", logo: logoNestle },
  { name: "Whirlpool", logo: logoWhirlpool },
];

// --- COMPONENTES UI ---

const CoronaTeamCard = ({ name, role, image, styles }) => {
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden bg-gray-200 group flex flex-col justify-end transition-all duration-500 rounded-none border border-slate-100/20"
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 scale-105 group-hover:scale-100"
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-500">
        <div className="border-l-4 pl-3" style={{ borderColor: styles.color }}>
          <h3 className="text-white text-base md:text-lg font-bold leading-tight uppercase tracking-tight drop-shadow-md">
            {name}
          </h3>
          <p className="text-white/80 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-0.5 drop-shadow-sm">
            {role}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20" />
    </div>
  );
};


// Componente para logos de la junta, más compacto y sin fondos grises
const CompactBoardCard = ({ name, logo, isWhite, position }) => (
  <div className="flex flex-col items-center justify-end w-full group">
    <div className="h-6 flex items-end justify-center mb-1">
      {position && (
        <span className="text-[9px] md:text-[10px] font-black text-[#1E305D] uppercase tracking-widest text-center">
          {position}
        </span>
      )}
    </div>
    <div
      className={`p-1 flex items-center justify-center h-24 w-full transition-all duration-300 ${isWhite ? 'bg-[#DF0024] rounded-md' : 'bg-transparent'}`}
      title={name}
    >
      <img
        src={logo}
        alt={name}
        className={`max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110 ${isWhite ? 'brightness-200 contrast-200' : ''}`}
      />
    </div>
  </div>
);

export default function TeamOrgChart() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await teamApi.getAllMembers();
        if (data && data.length > 0) {
          const mappedMembers = data.map(m => ({
            name: m.name,
            role: m.role,
            image: getImageUrl(m.photo_url || m.image),
            styles: STYLES_MAP[m.style_type] || STYLE_CIRCULARIDAD,
            featured: m.featured === 1 || m.featured === true
          }));
          setTeamMembers(mappedMembers);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section className="bg-white pb-20 font-sans min-h-screen">

      {/* HERO BANNER */}
      <div className="relative h-[450px] md:h-[650px] w-full overflow-hidden mb-12">
        <img
          src={groupPhoto}
          alt="Equipo Visión Circular"
          className="w-full h-full object-cover object-center"
        />
        {/* Degradado y Textos al pie de la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E305D] via-transparent to-transparent flex flex-col justify-end items-center text-center pb-24 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight mb-3 drop-shadow-xl"
          >
            Nuestra Gente, Nuestra Visión
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg"
          >
            Un equipo impulsado por la pasión y el compromiso para liderar la transformación hacia un país plenamente circular y sostenible.
          </motion.p>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Junta Directiva Separada */}
          <div className="text-center mb-12 pt-8 border-t border-gray-100">
            <h3 className="text-[#1E305D] text-xl font-black uppercase tracking-[0.2em]">
              Asamblea de Productores
            </h3>
            <div className="h-1.5 w-16 bg-[#1E305D] mx-auto mt-4 rounded-full" />
          </div>


        {/* CABECERA GOBERNANZA - Separación visual */}
        <div className="mb-16">
          {/* Asamblea */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <div className="shrink-0">
              {andiLogo && <img src={andiLogo} alt="ANDI" className="h-16 w-auto object-contain" />}
            </div>
            <div className="h-12 w-[1px] bg-gray-300 hidden md:block" />
            <div className="text-center md:text-left">
              <p className="text-gray-700 text-base md:text-lg lg:text-xl font-semibold leading-relaxed max-w-3xl">
                Más de 380 empresas hacen parte del colectivo líder que impulsa la economía circular en el país.
              </p>
            </div>
          </div>

          {/* Junta Directiva Separada */}
          <div className="text-center mb-12 pt-8 border-t border-gray-100">
            <h3 className="text-[#1E305D] text-xl font-black uppercase tracking-[0.2em]">
              Junta Directiva
            </h3>
            <div className="h-1.5 w-16 bg-[#1E305D] mx-auto mt-4 rounded-full" />
          </div>

          {/* Logos de la Junta Directiva (Compacts & Cleans) */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7 gap-6 px-2 align-middle justify-items-center items-end">
            {boardMembers.map((member, idx) => (
              <CompactBoardCard key={idx} {...member} />
            ))}
          </div>
        </div>

        {/* --- SECCIÓN EQUIPO DE TRABAJO --- */}
        <div className="text-center mb-12 pt-8 border-t border-gray-100">
          <h3 className="text-[#1E305D] text-xl font-black uppercase tracking-[0.2em]">
            Equipo de Trabajo
          </h3>
          <div className="h-1.5 w-16 bg-[#1E305D] mx-auto mt-4 rounded-full" />
        </div>

        {/* --- GRID DEL EQUIPO (Estilo Corona) --- */}
        {/* Personas Grid */}
        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 mb-24 items-stretch">
            {teamMembers.map((member, index) => (
              <CoronaTeamCard
                key={index}
                {...member}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">Actualmente no hay miembros del equipo registrados o están cargando.</p>
          </div>
        )}
      </div>

    </section>
  );
}