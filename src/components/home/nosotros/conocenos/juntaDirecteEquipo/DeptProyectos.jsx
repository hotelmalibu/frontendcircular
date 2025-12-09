import React from "react";
import { motion } from "framer-motion";
import DepartmentBanner from "./DepartmentBanner";

// Imágenes específicas de Proyectos
import estebanImg from "../../../../../assets/imgEquipo/defaulimg.png";
import andersonImg from "../../../../../assets/imgEquipo/defaulimg.png";
import andresImg from "../../../../../assets/imgEquipo/defaulimg.png";

export default function DeptProyectos() {
  const styles = {
    title: "Proyectos y Sostenibilidad",
    headerGradient: "bg-gradient-to-r from-[#5A1E5F] to-[#9E1981]",
    headerText: "text-white",
    bannerBg: "bg-[#F0E6F5]",
    bannerNameBg: "bg-gradient-to-r from-[#02897B] to-[#186B73]",
    bannerAccent: "bg-gradient-to-r from-[#A3D95B] to-[#007D6A]",
  };

  const members = [
    { role: "Coord. de Proyectos", name: "Esteban Pelaez", image: estebanImg },
    { role: "Prof. Sistemas Info.", name: "Anderson Gallego", image: andersonImg },
    { role: "Prof. Sostenibilidad", name: "Andrés Cruz", image: andresImg }
  ];

  return (
    <div className="w-full flex justify-center">
      
      {/* GRID LAYOUT:
          - grid-cols-1: 1 columna en móviles
          - md:grid-cols-2: 2 columnas en tablets
          - xl:grid-cols-3: 3 columnas en pantallas grandes
          - gap-y-20: Espacio vital para que el título flotante (-top-8) no choque con la fila de arriba
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-20 max-w-7xl">
        
        {members.map((member, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: idx * 0.1 }}
            className="flex justify-center w-full"
          >
            <DepartmentBanner 
              name={member.name} 
              role={member.role} 
              image={member.image} 
              styles={styles} 
            />
          </motion.div>
        ))}

      </div>
    </div>
  );
}