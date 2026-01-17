import React from "react";
import { motion } from "framer-motion";

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

// --- IMPORTS IMÁGENES EQUIPO ---
import andiLogo from "../../../../assets/imgEquipo/andi.png";
import monicaVImg from "../../../../assets/imgEquipo/monicav.jpg";
import groupPhoto from "../../../../assets/imgEquipo/group_photo.jpg";

import monicaTImg from "../../../../assets/imgEquipo/monicat.jpg";
import felipeImg from "../../../../assets/imgEquipo/felipe.jpg";
import nubiaImg from "../../../../assets/imgEquipo/nubia.jpg";
import sebastianImg from "../../../../assets/imgEquipo/sebastian.jpg";
import jhostinImg from "../../../../assets/imgEquipo/Jhostinf.jpg";
import dianaImg from "../../../../assets/imgEquipo/Dianag.jpg";
import gabrielImg from "../../../../assets/imgEquipo/gabriel.jpg";
import mariaFImg from "../../../../assets/imgEquipo/mariaf.jpg";
import luisaImg from "../../../../assets/imgEquipo/luisa.jpg";
import julianaImg from "../../../../assets/imgEquipo/juliana.jpg";
import karenImg from "../../../../assets/imgEquipo/karen.jpg";
import lauraImg from "../../../../assets/imgEquipo/laura.jpg";
import estebanImg from "../../../../assets/imgEquipo/defaulimg.png";
import andersonImg from "../../../../assets/imgEquipo/defaulimg.png";
import andresImg from "../../../../assets/imgEquipo/andres.jpg";

// --- CONSTANTES DE ESTILO ---
const STYLE_INNOVACION = {
  title: "Innovación",
  color: "#9E1981",
  bgGradient: "bg-gradient-to-t from-[#9E1981]/90 to-[#9E1981]/40",
};

const STYLE_ADMINISTRATIVA = {
  title: "Administrativa y Financiera",
  color: "#E15200",
  bgGradient: "bg-gradient-to-t from-[#E15200]/90 to-[#E15200]/40",
};

const STYLE_CIRCULARIDAD = {
  title: "Circularidad y Regionales",
  color: "#8CB200",
  bgGradient: "bg-gradient-to-t from-[#8CB200]/90 to-[#8CB200]/40",
};

const STYLE_PROYECTOS = {
  title: "Proyectos y Sostenibilidad",
  color: "#2C65AC",
  bgGradient: "bg-gradient-to-t from-[#2C65AC]/90 to-[#2C65AC]/40",
};

// --- DATOS JUNTA DIRECTIVA ---
const boardMembers = [
  { name: "Ajover Darnell", logo: logoDarnel },
  { name: "Alimentos Polar", logo: logoAlimentosPolar },
  { name: "Arcos Dorados", logo: logoArcosDorados },
  { name: "Belcorp", logo: logoBelcorp },
  { name: "Colombina", logo: logoColombina },
  { name: "Corona", logo: logoCorona },
  { name: "Diana Corporación", logo: logoDiana },
  { name: "Eterna", logo: logoEterna },
  { name: "Grupo Essitty", logo: logoEssity },
  { name: "Grupo Nutresa", logo: logoNutresa },
  { name: "Makro", logo: logoMakro, isWhite: true }, 
  { name: "Natura", logo: logoNatura },
  { name: "Nestlé", logo: logoNestle },
  { name: "Whirlpool", logo: logoWhirlpool },
];

// --- DATOS EQUIPO ---
const rawTeamMembers = [
  { name: "Anderson Gallego", role: "Prof. Sistemas Info.", image: andersonImg, styles: STYLE_PROYECTOS },
  { name: "Andrés Cruz", role: "Prof. Sostenibilidad", image: andresImg, styles: STYLE_PROYECTOS },
  { name: "Diana García", role: "Coord. de Circularidad", image: dianaImg, styles: STYLE_CIRCULARIDAD },
  { name: "Esteban Pelaez", role: "Coord. de Proyectos", image: estebanImg, styles: STYLE_PROYECTOS },
  { name: "Felipe Belalcazar", role: "Subgerente Innovación", image: felipeImg, styles: STYLE_INNOVACION },
  { name: "Gabriel Sabogal", role: "Coord. Regional", image: gabrielImg, styles: STYLE_CIRCULARIDAD },
  { name: "Jhostin Florez", role: "Analista administrativo y financiero", image: jhostinImg, styles: STYLE_ADMINISTRATIVA },
  { name: "Juliana Ospina", role: "Coord. Regional", image: julianaImg, styles: STYLE_CIRCULARIDAD },
  { name: "Karen Salazar", role: "Reg. Suroccidente", image: karenImg, styles: STYLE_CIRCULARIDAD },
  { name: "Laura Mojica", role: "Reg. Oriente", image: lauraImg, styles: STYLE_CIRCULARIDAD },
  { name: "Luisa Montalvo", role: "Reg. Nororiente", image: luisaImg, styles: STYLE_CIRCULARIDAD },
  { name: "María Fernanda", role: "Reg. Centro Oriente", image: mariaFImg, styles: STYLE_CIRCULARIDAD },
  { name: "Mónica Turriago", role: "Prof. de Innovación", image: monicaTImg, styles: STYLE_INNOVACION },
  { name: "Mónica Villegas", role: "Director Ejecutivo", image: monicaVImg, styles: STYLE_PROYECTOS, featured: true },
  { name: "Nubia Rivera", role: "Jefe Administrativa", image: nubiaImg, styles: STYLE_ADMINISTRATIVA },
  { name: "Sebastián Gómez", role: "Prof. Contable", image: sebastianImg, styles: STYLE_ADMINISTRATIVA },
];

const sortedTeamMembers = [
    ...rawTeamMembers.filter(m => m.featured),
    ...rawTeamMembers.filter(m => !m.featured).sort((a, b) => a.name.localeCompare(b.name))
];

// --- COMPONENTES UI ---

const CoronaTeamCard = ({ name, role, image, styles }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative aspect-[3/4] overflow-hidden bg-gray-200 group flex flex-col justify-end"
    >
      <img 
        src={image} 
        alt={name} 
        className="absolute inset-0 w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700"
      />
      
      <div className={`relative z-10 w-full p-4 ${styles.bgGradient} backdrop-blur-[2px] transition-all duration-500`}>
        <div className="border-l-4 pl-3" style={{ borderColor: 'white' }}>
          <h3 className="text-white text-base md:text-lg font-bold leading-tight uppercase tracking-tight">
            {name}
          </h3>
          <p className="text-white/90 text-[10px] md:text-xs font-medium uppercase tracking-widest mt-1">
            {role}
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20" />
    </motion.div>
  );
};

// Componente para logos de la junta, más compacto y sin fondos grises
const CompactBoardCard = ({ name, logo, isWhite }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className={`p-1 flex items-center justify-center h-16 w-full transition-all duration-300 ${isWhite ? 'bg-[#DF0024] rounded-md' : 'bg-transparent'}`}
    title={name}
  >
    <img
      src={logo}
      alt={name}
      className={`max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110 ${isWhite ? 'brightness-200 contrast-200' : ''}`}
    />
  </motion.div>
);

export default function TeamOrgChart() {
  return (
    <section className="bg-white pb-20 font-sans min-h-screen">
      
      {/* HERO BANNER - Textos y transparencia */}
      <div className="relative h-[450px] md:h-[650px] w-full overflow-hidden mb-12">
        <img 
          src={groupPhoto} 
          alt="Equipo Visión Circular" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E305D]/60 via-transparent to-[#1E305D]/90 flex flex-col justify-center items-center text-center px-4">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-lg"
           >
             Nuestra Gente, Nuestra Visión
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-gray-100 text-base md:text-lg max-w-2xl leading-relaxed drop-shadow-md px-6 md:px-0"
           >
             Un equipo impulsado por la pasión y el compromiso para liderar la transformación hacia un país plenamente circular y sostenible.
           </motion.p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        
        {/* CABECERA GOBERNANZA - Separación visual */}
        <div className="mb-16">
            {/* Asamblea */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <div className="shrink-0">
                    {andiLogo && <img src={andiLogo} alt="ANDI" className="h-16 w-auto object-contain" />}
                </div>
                <div className="h-12 w-[1px] bg-gray-300 hidden md:block" />
                <div className="text-center md:text-left">
                    <h2 className="text-[#1E305D] font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none mb-1">
                        Asamblea de Productores
                    </h2>
                </div>
            </div>

            {/* Junta Directiva Separada */}
            <div className="mb-6 pl-2">
                <h3 className="text-[#1E305D] text-lg font-black border-b-2 border-[#1E305D] inline-block pb-1 uppercase tracking-tight">
                    Junta Directiva
                </h3>
            </div>
            
            {/* Logos de la Junta Directiva (Compacts & Cleans) */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7 gap-6 px-2 align-middle justify-items-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedTeamMembers.map((member, idx) => (
            <CoronaTeamCard key={idx} {...member} />
          ))}
        </div>

      </div>
    </section>
  );
}