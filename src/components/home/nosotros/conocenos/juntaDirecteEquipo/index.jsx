import React from "react";
import { motion } from "framer-motion";
import { 
 
  Zap, 
  PieChart, 
  Recycle, 
  TrendingUp,
  User
} from "lucide-react";

// --- DATOS TRANSFORMADOS ---

// Puedes reemplazar estas URLs con las fotos reales de tu equipo
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80";
const MALE_PLACEHOLDER = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80";

const topLinks = [
  "Aliados Estratégicos",
  "Asamblea de Productores",
  "Junta Directiva"
];

const director = {
  role: "DIRECTORA VISIÓN CIRCULAR",
  name: "Mónica Villegas",
  
  image: PLACEHOLDER_IMG 
};

const departments = [
  {
    id: "innovation",
    title: "Innovación",
    // Color de la cabecera (Píldora)
    headerBg: "bg-[#A3D95B]", 
    headerText: "text-[#1E305D]",
    // Color de fondo de las tarjetas de los miembros
    cardBg: "bg-[#F2F9E6]", 
    icon: <Zap size={18} />,
    members: [
      { role: "Subgerente Innovación", name: "Felipe Belalcazar", image: MALE_PLACEHOLDER },
      { role: "Prof. de Innovación", name: "Mónica Turriago", image: PLACEHOLDER_IMG },
    ]
  },
  {
    id: "admin",
    title: "Administrativa y Financiera",
    headerBg: "bg-[#5B9BD5]",
    headerText: "text-white",
    cardBg: "bg-[#E6F2F9]", 
    icon: <PieChart size={18} />,
    members: [
      { role: "Jefe Administrativa", name: "Nubia Rivera", image: PLACEHOLDER_IMG },
      { role: "Prof. Contable", name: "Sebastián Gómez", image: MALE_PLACEHOLDER },
      { role: "Analista Administrativo", name: "Jhostin Florez", image: MALE_PLACEHOLDER },
    ]
  },
  {
    id: "circularity",
    title: "Circularidad y Regionales",
    headerBg: "bg-[#008F6B]", 
    headerText: "text-white",
    cardBg: "bg-[#E6F9F4]", 
    icon: <Recycle size={18} />,
    members: [
      { role: "Coord. de Circularidad", name: "Diana García", image: PLACEHOLDER_IMG },
      { role: "Coord. Regional", name: "Gabriel Sabogal", image: MALE_PLACEHOLDER },
      { role: "Reg. Centro Oriente", name: "María Fernanda Ruge", image: PLACEHOLDER_IMG },
      { role: "Reg. Suroccidente", name: "Karen Salazar", image: PLACEHOLDER_IMG },
      { role: "Coord. Regional", name: "Juliana Ospina", image: PLACEHOLDER_IMG },
      { role: "Reg. Nororiente", name: "Luisa Montalvo", image: PLACEHOLDER_IMG },
      { role: "Reg. Oriente", name: "Laura Mojica", image: PLACEHOLDER_IMG },
    ]
  },
  {
    id: "projects",
    title: "Proyectos y Sostenibilidad",
    headerBg: "bg-[#1E305D]",
    headerText: "text-white",
    cardBg: "bg-[#E8EBF2]", 
    icon: <TrendingUp size={18} />,
    members: [
      { role: "Coord. de Proyectos", name: "Esteban Pelaez", image: PLACEHOLDER_IMG },
      { role: "Prof. Sistemas Info.", name: "Anderson Gallego", image: MALE_PLACEHOLDER },
      { role: "Prof. Sostenibilidad", name: "Andrés Cruz", image: MALE_PLACEHOLDER },
    ]
  }
];

// --- COMPONENTES ---

const MemberCard = ({ member, bgClass }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`p-4 rounded-xl ${bgClass} shadow-sm flex flex-col items-center text-center w-full mb-4 border-b-4 border-black/5`}
  >
    {/* Imagen del Miembro */}
    <div className="w-24 h-24 mb-3 rounded-full overflow-hidden border-2 border-white shadow-sm">
      {member.image ? (
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          
          <User className="text-gray-400" />
        </div>
      )}
    </div>

    {/* Textos */}
    <h4 className="font-bold text-[#1E305D] text-sm leading-tight mb-1">
      {member.name}
    </h4>
    <p className="text-[11px] text-gray-600 uppercase font-medium tracking-tight mb-3">
      {member.role}
    </p>

    {/* Logo pequeño de marca (decorativo) */}
    <div className="mt-auto opacity-50">
       {/* Usamos un icono genérico como logo pequeño */}
       <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
    </div>
  </motion.div>
);

const DepartmentColumn = ({ dept, index }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Encabezado tipo Píldora */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`${dept.headerBg} ${dept.headerText} rounded-full py-2 px-4 mb-6 shadow-md flex items-center justify-center gap-2 text-sm font-bold text-center`}
      >
        {/* Opcional: mostrar icono si quieres */}
        {/* {dept.icon} */} 
        {dept.title}
      </motion.div>

      {/* Lista de Tarjetas */}
      <div className="flex flex-col gap-2">
        {dept.members.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index * 0.1) + (idx * 0.1) }}
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
    <section className="bg-[#F4F6F8] pt-20 pb-20 px-4 md:px-8 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER TITULO */}
        <div className="text-center mb-8">
          <div className="bg-[#DCE4F2] inline-block px-8 py-2 rounded-full mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#5B85D9] uppercase tracking-wide">
              Nuestro Equipo
            </h2>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
            Un equipo multidisciplinario comprometido con la circularidad y la innovación.
          </p>
        </div>

        {/* TOP LINKS (Aliados, Asamblea, etc) */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12 text-[#1E305D] font-bold text-sm md:text-base">
          {topLinks.map((link, i) => (
            <span key={i} className="cursor-pointer hover:text-[#00AB6D] transition-colors">
              {link}
            </span>
          ))}
        </div>

        {/* DIRECTOR SECTION (Oval Shape) */}
        <div className="flex justify-center mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="bg-[#D9E2EC] rounded-[50px] pr-8 pl-4 py-4 flex items-center gap-6 shadow-lg max-w-xl"
          >
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img 
                  src={director.image} 
                  alt={director.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-[#1E305D]">{director.name}</h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b-2 border-gradient-to-r from-green-400 to-blue-500 inline-block pb-1">
                {director.role}
              </p>
            </div>
          </motion.div>
        </div>

        {/* GRID DE DEPARTAMENTOS (COLUMNAS) */}
        {/* Grid configuration: 4 columns on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 align-top">
          {departments.map((dept, index) => (
            <DepartmentColumn key={dept.id} dept={dept} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}