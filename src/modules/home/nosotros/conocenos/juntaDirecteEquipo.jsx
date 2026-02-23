import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { X, } from "lucide-react";


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

// 01. Esteban Peláez
import esteban_h1 from "../../../../assets/imgEquipo/EquipoFotos/01. Esteban Peláez/Esteban Pelaez H1.png";

// 02. Gabriel Sabogal
import gabriel_v1 from "../../../../assets/imgEquipo/EquipoFotos/02. Gabriel Sabogal/Gabriel Sabogal H1.jpg";

// 03. Mónica Turrego
import monicaT_h1 from "../../../../assets/imgEquipo/EquipoFotos/03. Mónica Turrego/Monica Turrego H1.png";

// 04. Anderson Gallego
import anderson_h1 from "../../../../assets/imgEquipo/EquipoFotos/04. Anderson Gallego/Anderson Gallego H1.png";

// Organigrama
import organigrama from "../../../../assets/imgEquipo/organigrama.png";

// 05. María Fernanda Ruge
import mariaF_h1 from "../../../../assets/imgEquipo/EquipoFotos/05. María Fernanda Ruge/María Fernanda Romero H1.png";

// 06. Diana García
import diana_h1 from "../../../../assets/imgEquipo/EquipoFotos/06. Diana García/Diana García H1.png";

// 07. Karen Salazar
import karen_h1 from "../../../../assets/imgEquipo/EquipoFotos/07. Karen Salazar/Karen Salazar H1.png";

// 08. Laura Mojica
import laura_h1 from "../../../../assets/imgEquipo/EquipoFotos/08. Laura Mojica/Laura Mojica H1.png";

// 09. Luisa Montalvo
import luisa_1 from "../../../../assets/imgEquipo/EquipoFotos/09. Luisa Montalvo/1.png";

// 10. Juliana Ospina
import juliana_1 from "../../../../assets/imgEquipo/EquipoFotos/10. Juliana Ospina/1.png";

// 11. Felipe Belalcazar
import felipe_1 from "../../../../assets/imgEquipo/EquipoFotos/11. Felipe Belalcazar/1.png";

// 12. Sebastian Gómez
import sebastian_1 from "../../../../assets/imgEquipo/EquipoFotos/12. Sebastian Gómez/1.png";

// 13. Jhostin Florez
import jhostin_1 from "../../../../assets/imgEquipo/EquipoFotos/13. Jhostin Florez/1.png";

// 14. Nubia Rivera
import nubia_1 from "../../../../assets/imgEquipo/EquipoFotos/14. Nubia Rivera/1.png";

// 15. Mónica Villegas
import monicaV_1 from "../../../../assets/imgEquipo/EquipoFotos/15. Mónica Villegas/1.jpg";

// 16. Andrés Cruz
import andres_1 from "../../../../assets/imgEquipo/EquipoFotos/16- Andrés Cruz/1.png";

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
  { name: "Anderson Gallego", role: "Prof. Sistemas Info.", image: anderson_h1, styles: STYLE_PROYECTOS },
  { name: "Andrés Cruz", role: "Prof. Sostenibilidad", image: andres_1, styles: STYLE_PROYECTOS },
  { name: "Diana García", role: "Coord. de Circularidad", image: diana_h1, styles: STYLE_CIRCULARIDAD },
  { name: "Esteban Pelaez", role: "Coord. de Proyectos", image: esteban_h1, styles: STYLE_PROYECTOS },
  { name: "Felipe Belalcazar", role: "Subgerente Innovación", image: felipe_1, styles: STYLE_INNOVACION },
  { name: "Gabriel Sabogal", role: "Coord. Regional", image: gabriel_v1, styles: STYLE_CIRCULARIDAD },
  { name: "Jhostin Florez", role: "Analista administrativo y financiero", image: jhostin_1, styles: STYLE_ADMINISTRATIVA },
  { name: "Juliana Ospina", role: "Coord. Regional", image: juliana_1, styles: STYLE_CIRCULARIDAD },
  { name: "Karen Salazar", role: "Prof. Circularidad suoriente", image: karen_h1, styles: STYLE_CIRCULARIDAD },
  { name: "Laura Mojica", role: "Prof. Circularidad suoriente", image: laura_h1, styles: STYLE_CIRCULARIDAD },
  { name: "Luisa Montalvo", role: "Prof. Circularidad suoriente", image: luisa_1, styles: STYLE_CIRCULARIDAD },
  { name: "María Quitales", role: "Prof. Circularidad suoriente", image: mariaF_h1, styles: STYLE_CIRCULARIDAD },
  { name: "Mónica Turriago", role: "Prof. de Innovación", image: monicaT_h1, styles: STYLE_INNOVACION },
  { name: "Mónica Villegas", role: "Director Ejecutivo", image: monicaV_1, styles: STYLE_PROYECTOS, featured: true },
  { name: "Nubia Rivera", role: "Jefe Administrativa", image: nubia_1, styles: STYLE_ADMINISTRATIVA },
  { name: "Sebastián Gómez", role: "Prof. Contable", image: sebastian_1, styles: STYLE_ADMINISTRATIVA },
];

const sortedTeamMembers = [
  ...rawTeamMembers.filter(m => m.featured),
  ...rawTeamMembers.filter(m => !m.featured).sort((a, b) => a.name.localeCompare(b.name))
];

// --- COMPONENTES UI ---

const CoronaTeamCard = ({ name, role, image, styles, onClick }) => {
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden bg-gray-200 group flex flex-col justify-end cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2rem] border border-slate-100"
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
      />

      <div className={`relative z-10 w-full p-4 ${styles.bgGradient} backdrop-blur-[2px] transition-all duration-500 transform translate-y-2 group-hover:translate-y-0`}>
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
    </div>
  );
};

// --- MODAL DE CARRUSEL CON GALERÍA INTERNA ---

const TeamCarouselModal = ({ members, currentIndex, onClose, onNext, onPrev }) => {
  const member = members[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "PageDown") onNext();
      if (e.key === "PageUp") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!member) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-2xl p-4 md:p-8 cursor-zoom-out"
        onClick={onClose}
      >
        {/* Botón de Cerrar Rojo Sólido y Muy Visible */}
        <button
          className="absolute top-6 right-6 text-white hover:scale-110 active:scale-95 transition-all z-[120] p-4 bg-[#DF0024] shadow-[0_4px_20px_rgba(223,0,36,0.4)] rounded-full flex items-center justify-center group"
          onClick={onClose}
          title="Cerrar (Esc)"
        >
          <X size={28} className="group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
        </button>

        <div
          className="relative max-w-5xl w-full h-auto max-h-[90vh] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 cursor-default bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Contenedor de Imagen */}
          <div className="relative w-full md:w-1/2 flex flex-col gap-6">
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-100 group/img"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
          </div>

          <motion.div
            key={member.name + "_info"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1E305D] uppercase tracking-tighter leading-[0.9] mb-4">
                {member.name.split(' ').map((part, i) => (
                  <span key={i} className="block">{part}</span>
                ))}
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-medium uppercase tracking-[0.1em] mb-10 max-w-md">
                {member.role}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-5">
                <div className="w-16 h-2 rounded-full shadow-sm" style={{ backgroundColor: member.styles.color }} />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Visión Circular ANDI</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Componente para logos de la junta, más compacto y sin fondos grises
const CompactBoardCard = ({ name, logo, isWhite }) => (
  <div
    className={`p-1 flex items-center justify-center h-24 w-full transition-all duration-300 ${isWhite ? 'bg-[#DF0024] rounded-md' : 'bg-transparent'}`}
    title={name}
  >
    <img
      src={logo}
      alt={name}
      className={`max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110 ${isWhite ? 'brightness-200 contrast-200' : ''}`}
    />
  </div>
);

export default function TeamOrgChart() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === sortedTeamMembers.length - 1 ? 0 : prev + 1));
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? sortedTeamMembers.length - 1 : prev - 1));
  }, []);

  const teamMembers = sortedTeamMembers; // Alias for clarity with the provided edit

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

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12">

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
        {/* Personas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-24">
          {teamMembers.map((member, index) => (
            <CoronaTeamCard
              key={index}
              {...member}
              onClick={() => {
                setSelectedIndex(index);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>

        {/* --- NUEVA SECCIÓN: ORGANIGRAMA --- */}
        <div className="mt-12 mb-32">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 px-6 py-2 border border-slate-100 rounded-full">
              Estructura Corporativa
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1E305D] uppercase tracking-tighter leading-none mb-6">
              Organigrama <span className="text-slate-300">Institucional</span>
            </h2>
            <div className="w-24 h-1.5 bg-[#1E305D] rounded-full opacity-20" />
          </div>

          <div className="bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl border border-slate-100 overflow-hidden relative group">
            <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <img
                src={organigrama}
                alt="Organigrama Institucional"
                className="w-full h-auto object-contain mx-auto transition-transform duration-700 group-hover:scale-[1.01]"
              />
            </div>
          </div>

          <div className="flex justify-center mt-12 gap-8 opacity-20">
            <div className="w-16 h-1 rounded-full bg-[#1E305D]" />
            <div className="w-16 h-1 rounded-full bg-[#1E305D]" />
            <div className="w-16 h-1 rounded-full bg-[#1E305D]" />
          </div>
        </div>
      </div>

      {/* Modal de Carrusel */}
      {isModalOpen && selectedIndex !== null && (
        <TeamCarouselModal
          members={teamMembers}
          currentIndex={selectedIndex}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedIndex(null);
          }}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </section>
  );
}