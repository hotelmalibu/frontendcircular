import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  PieChart, 
  Recycle, 
  TrendingUp,
  User
} from "lucide-react";

import iconLogo from '../../../../../assets/iconologo.png';
import andiLogo from '../../../../../assets/andi.png'; 
import monicaV  from '../../../../../assets/monicav.jpg'; 
import felipeB from '../../../../../assets/felipe.jpg';
import monicaT from '../../../../../assets/monicat.jpg';
import sebastiant from '../../../../../assets/sebastian.jpg';
import diana from '../../../../../assets/Dianag.jpg';
import gabriel from '../../../../../assets/gabriel.jpg';
import jhostin from '../../../../../assets/Jhostinf.jpg';
import nubia from '../../../../../assets/nubia.jpg';
import luisa from '../../../../../assets/luisa.jpg';
import mariaf from '../../../../../assets/mariaf.jpg';
import defauli from '../../../../../assets/defaulimg.png';


const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80";
const monicaImg = monicaV; 
const felipeImg = felipeB; 
const monicaTImg = monicaT;
const nubiaImg = nubia;
const sebastianImg = sebastiant;
const jhostinImg = jhostin;
const dianaImg = diana;
const gabrielImg = gabriel;
const julianaImg = PLACEHOLDER_IMG;
const mariaFImg = mariaf;
const karenImg = PLACEHOLDER_IMG;
const luisaImg = luisa;
const lauraImg = PLACEHOLDER_IMG;
const estebanImg = defauli;
const andersonImg = defauli;
const andresImg = defauli;


const director = {
  role: "DIRECTORA VISIÓN CIRCULAR",
  name: "Mónica Villegas",
  image: monicaImg // Usando variable local
};

const departments = [
  {
    id: "innovation",
    title: "Innovación",
    headerGradient: "bg-gradient-to-r from-[#81A648] to-[#A3D95B]", 
    headerText: "text-[#1E305D]",
    cardBg: "bg-[#DDEEBC]", 
    icon: <Zap size={18} />,
    members: [
      { role: "Subgerente Innovación", name: "Felipe Belalcazar", image: felipeImg },
      { role: "Prof. de Innovación", name: "Mónica Turriago", image: monicaTImg },
    ]
  },
  {
    id: "admin",
    title: "Administrativa y Financiera",
    headerGradient: "bg-gradient-to-r from-[#4A7BB0] to-[#5B9BD5]", 
    headerText: "text-white",
    cardBg: "bg-[#9ACBEB]", 
    icon: <PieChart size={18} />,
    members: [
      { role: "Jefe Administrativa", name: "Nubia Rivera", image: nubiaImg },
      { role: "Prof. Contable", name: "Sebastián Gómez", image: sebastianImg },
      { role: "Analista Administrativo", name: "Jhostin Florez", image: jhostinImg },
    ]
  },
  {
    id: "circularity",
    title: "Circularidad y Regionales",
    headerGradient: "bg-gradient-to-r from-[#007055] to-[#008F6B]", 
    headerText: "text-white",
    cardBg: "bg-[#95DCC6]", 
    icon: <Recycle size={18} />,
    members: [
      { role: "Coord. de Circularidad", name: "Diana García", image: dianaImg },
      { role: "Coord. Regional", name: "Gabriel Sabogal", image: gabrielImg },
      { role: "Coord. Regional", name: "Juliana Ospina", image: julianaImg },
      { role: "Reg. Centro Oriente", name: "María Fernanda Ruge", image: mariaFImg },
      { role: "Reg. Suroccidente", name: "Karen Salazar", image: karenImg },
      { role: "Reg. Nororiente", name: "Luisa Montalvo", image: luisaImg },
      { role: "Reg. Oriente", name: "Laura Mojica", image: lauraImg },
    ]
  },
  {
    id: "projects",
    title: "Proyectos y Sostenibilidad",
    headerGradient: "bg-gradient-to-r from-[#172648] to-[#1E305D]", 
    headerText: "text-white",
    cardBg: "bg-[#A7BDDE]", 
    icon: <TrendingUp size={18} />,
    members: [
      { role: "Coord. de Proyectos", name: "Esteban Pelaez", image: estebanImg },
      { role: "Prof. Sistemas Info.", name: "Anderson Gallego", image: andersonImg },
      { role: "Prof. Sostenibilidad", name: "Andrés Cruz", image: andresImg },
    ]
  }
];

// --- COMPONENTE DE TARJETA ---
const MemberCard = ({ member, bgClass }) => (
  <motion.div 
    whileHover={{ y: -3 }}
    className={`rounded-xl ${bgClass} shadow-sm flex flex-col items-center text-center w-full max-w-[170px] mx-auto overflow-hidden`}
  >
    <div className="p-2 w-full flex flex-col items-center flex-grow">
        <div className="w-20 h-20 mb-1.5 rounded-[15px] overflow-hidden border-2 border-white shadow-sm shrink-0">
        {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover"/>
        ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <User className="text-gray-400" size={24} />
            </div>
        )}
        </div>
        <h4 className="font-bold text-black text-xs leading-tight mb-0.5">
          {member.name}
        </h4>
        <p className="text-[10px] text-black italic leading-tight mb-1 opacity-80">
          {member.role}
        </p>
        
        <div className="mt-auto mb-1">
            <div className="-mb-1.5 flex items-center justify-center">
              {iconLogo ? (
                <img src={iconLogo} alt="Logo" className="w-3.5 h-3.5 object-contain" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
              )}
            </div>
          </div>
        
    </div>
    <div className="h-1.5 w-full bg-gradient-to-r from-[#A3D95B] via-[#5B9BD5] to-[#1E305D] shrink-0"></div>
  </motion.div>
);

const DepartmentColumn = ({ dept, index }) => {
  if (dept.id === "circularity") {
    const coordCircularidad = dept.members.find(m => m.role === "Coord. de Circularidad");
    const coordRegionales = dept.members.filter(m => m.role === "Coord. Regional");
    const regionales = dept.members.filter(m => m.role !== "Coord. de Circularidad" && m.role !== "Coord. Regional");

    return (
      <div className="flex flex-col items-center h-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${dept.headerGradient} ${dept.headerText} rounded-full py-1.5 px-8 mb-5 shadow-md w-auto inline-block text-sm font-bold text-center`}
        >
          {dept.title}
        </motion.div>

        <div className="flex flex-col items-center w-full gap-2"> 
          {coordCircularidad && (
            <MemberCard member={coordCircularidad} bgClass={dept.cardBg} />
          )}
          <div className="grid grid-cols-2 gap-2 w-full justify-items-center">
            {coordRegionales.map((member, idx) => (
              <MemberCard key={idx} member={member} bgClass={dept.cardBg} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 w-full justify-items-center">
               {regionales.map((member, idx) => (
                 <MemberCard key={idx} member={member} bgClass={dept.cardBg} />
               ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`${dept.headerGradient} ${dept.headerText} rounded-full py-1.5 px-8 mb-5 shadow-md w-auto inline-block text-sm font-bold text-center`}
      >
        {dept.title}
      </motion.div>

      <div className="flex flex-col gap-2 w-full">
        {dept.members.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index * 0.1) + (idx * 0.05) }}
          >
            <MemberCard member={member} bgClass={dept.cardBg} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function TeamOrgChart() {
  return (

    <section className="bg-[#F9FAFB] pt-32 pb-12 px-2 md:px-4 font-sans min-h-screen">
      <div className="w-full max-w-[95%] mx-auto">
        
        {/* HEADER */}
        {/* CAMBIO: mb-2 (antes mb-6) para reducir espacio con ANDI */}
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

        
        <div className="flex flex-row items-center justify-center gap-6 mb-6 flex-wrap mt-2">
            
            {/* 1. Logo ANDI */}
            <div className="shrink-0">
              {andiLogo ? (
                <img src={andiLogo} alt="ANDI" className="h-10 w-auto object-contain" />
              ) : (
                <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
              )}
            </div>

            {/* 2. Asamblea */}
            <div className="text-[#1E305D] font-bold text-base md:text-lg">
              Asamblea de productores
            </div>
            
            {/* 3. Junta */}
            <span className="text-[#1E305D] font-bold text-base md:text-lg">
               Junta directiva
            </span>
        </div>

        {/* DIRECTOR */}
        <div className="flex justify-center mb-10">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="bg-[#D2DEEA] rounded-full pl-4 pr-12 py-3 flex flex-row items-center gap-6 shadow-lg max-w-2xl relative overflow-hidden"
          >
            {/* Imagen Circular */}
            <div className="relative shrink-0 z-10">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img src={director.image} alt={director.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Texto */}
            <div className="text-left z-10 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-black leading-none mb-1">
                  {director.name}
              </h3>
              <div className="flex flex-col items-start">
                  <p className="text-sm font-medium text-black uppercase tracking-wider mb-1">
                    {director.role}
                  </p>
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#A3D95B] via-[#5B9BD5] to-[#1E305D]"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* GRID DE DEPARTAMENTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 align-top">
          {departments.map((dept, index) => (
            <DepartmentColumn key={dept.id} dept={dept} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}