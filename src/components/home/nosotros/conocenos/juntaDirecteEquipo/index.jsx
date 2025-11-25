import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  Zap, 
  TrendingUp, 
  PieChart, 
  Recycle, 
  User 
} from "lucide-react";

// --- DATOS TRANSFORMADOS PARA CLUSTERS ---
const strategicLevel = [
  { name: "Asamblea de Productores", icon: <Users size={18} />, color: "bg-gray-100 text-[#1E305D]" },
  { name: "Junta Directiva", icon: <Briefcase size={18} />, color: "bg-gray-100 text-[#1E305D]" }
];

const director = {
  role: "Directora Visión Circular",
  name: "Mónica Villegas",
  color: "text-[#1E305D]",
  bg: "bg-white border-[#1E305D]",
  border: "border-l-4"
};

const departments = [
  {
    id: "innovation",
    title: "Innovación",
    icon: <Zap size={20} />,
    colorTheme: "text-purple-600",
    bgTheme: "bg-purple-50",
    borderTheme: "border-purple-600",
    members: [
      { role: "Subgerente Innovación", name: "Felipe Belalcazar", isHead: true },
      { role: "Prof. de Innovación", name: "Mónica Turriago", isHead: false },
    ]
  },
  {
    id: "admin",
    title: "Administrativa y Financiera",
    icon: <PieChart size={20} />,
    colorTheme: "text-yellow-600",
    bgTheme: "bg-yellow-50",
    borderTheme: "border-yellow-500",
    members: [
      { role: "Jefe Administrativa", name: "Nubia Rivera", isHead: true },
      { role: "Prof. Contable", name: "Sebastián Gómez", isHead: false },
      { role: "Analista Administrativo", name: "Jhostin Florez", isHead: false },
    ]
  },
  {
    id: "circularity",
    title: "Circularidad y Regionales",
    icon: <Recycle size={20} />,
    colorTheme: "text-orange-500",
    bgTheme: "bg-orange-50",
    borderTheme: "border-orange-500",
    members: [
      { role: "Coord. de Circularidad", name: "Diana García", isHead: true },
      { role: "Coord. Regional", name: "Gabriel Sabogal", isHead: false },
      { role: "Reg. Centro Oriente", name: "María Fernanda Ruge", isHead: false, isSub: true },
      { role: "Reg. Suroccidente", name: "Karen Salazar", isHead: false, isSub: true },
      { role: "Coord. Regional", name: "Juliana Ospina", isHead: false },
      { role: "Reg. Nororiente", name: "Luisa Montalvo", isHead: false, isSub: true },
      { role: "Reg. Oriente", name: "Laura Mojica", isHead: false, isSub: true },
    ]
  },
  {
    id: "projects",
    title: "Proyectos y Sostenibilidad",
    icon: <TrendingUp size={20} />,
    colorTheme: "text-[#00AB6D]",
    bgTheme: "bg-green-50",
    borderTheme: "border-[#00AB6D]",
    members: [
      { role: "Coord. de Proyectos", name: "Esteban Pelaez", isHead: true },
      { role: "Prof. Sistemas Info.", name: "Anderson Gallego", isHead: false },
      { role: "Prof. Sostenibilidad", name: "Andrés Cruz", isHead: false },
    ]
  }
];

// --- COMPONENTES ---

const MemberItem = ({ member, colorClass }) => (
  <div className={`flex items-start gap-3 py-2 ${member.isSub ? "ml-4 pl-3 border-l-2 border-gray-200" : ""}`}>
    <div className={`mt-1 min-w-[24px] h-6 rounded-full flex items-center justify-center ${member.isHead ? "bg-white shadow-sm" : "bg-transparent"}`}>
      <User size={member.isHead ? 14 : 12} className={colorClass} />
    </div>
    <div>
      <p className={`text-sm ${member.isHead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
        {member.name}
      </p>
      <p className={`text-xs uppercase tracking-wide ${colorClass} ${member.isHead ? "font-bold" : "font-medium opacity-80"}`}>
        {member.role}
      </p>
    </div>
  </div>
);

const DepartmentCard = ({ dept, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`rounded-2xl p-6 ${dept.bgTheme} hover:shadow-lg transition-shadow duration-300 h-full`}
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/50">
        <div className={`p-2 bg-white rounded-lg shadow-sm ${dept.colorTheme}`}>
          {dept.icon}
        </div>
        <h3 className={`font-bold text-lg ${dept.colorTheme}`}>{dept.title}</h3>
      </div>

      <div className="space-y-1">
        {dept.members.map((member, idx) => (
          <MemberItem key={idx} member={member} colorClass={dept.colorTheme} />
        ))}
      </div>
    </motion.div>
  );
};

export default function TeamGridSection() {
  return (
   
    <section className="bg-[#F6F6F6] pt-40 pb-20 px-4 md:px-8 font-sans selection:bg-[#00AB6D]/20">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & STRATEGY */}
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-[#1E305D]"
          >
            Nuestro Equipo
          </motion.h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Un equipo multidisciplinario comprometido con la circularidad y la innovación.
          </p>

          {/* Strategic Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <span className="text-xs font-bold text-[#1E305D] tracking-widest uppercase py-2 mr-2 self-center">
              Aliados Estratégicos
            </span>
            {strategicLevel.map((item, idx) => (
              <div key={idx} className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm ${item.color}`}>
                {item.icon}
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* DIRECTOR SPOTLIGHT */}
        <div className="flex justify-center mb-16">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="bg-white p-1 rounded-3xl shadow-xl max-w-lg w-full relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1E305D] via-[#00AB6D] to-[#1E305D]"></div>
            <div className="px-8 py-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-[#1E305D]/10 group-hover:border-[#1E305D]/30 transition-colors">
                 <User size={40} className="text-[#1E305D]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1E305D] mb-1">{director.name}</h3>
              <div className="inline-block px-4 py-1 bg-[#1E305D]/10 rounded-full">
                <p className="text-sm font-bold text-[#1E305D] uppercase tracking-wide">{director.role}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* DEPARTMENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {departments.map((dept, index) => (
            <DepartmentCard key={dept.id} dept={dept} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}