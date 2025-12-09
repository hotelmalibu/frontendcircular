import React from "react";
import { motion } from "framer-motion";
import DepartmentBanner from "./DepartmentBanner";

// Imágenes específicas de Innovación
import monicaTImg from "../../../../../assets/imgEquipo/monicat.jpg";
import felipeImg from "../../../../../assets/imgEquipo/felipe.jpg";

export default function DeptInnovacion() {
  const styles = {
    title: "Innovación",
    headerGradient: "bg-gradient-to-r from-[#E9B501] to-[#716404]",
    headerText: "text-[#1E305D]",
    bannerBg: "bg-[#DDEEBC]",
    bannerNameBg: "bg-[#7F1D8D]",
    bannerAccent: "bg-gradient-to-r from-[#A3D95B] to-[#007D6A]",
  };

  const members = [
    { role: "Subgerente Innovación", name: "Felipe Belalcazar", image: felipeImg },
    { role: "Prof. de Innovación", name: "Mónica Turriago", image: monicaTImg }
  ];

  return (
    
    <div className="w-full flex justify-center ">
      
      {/* GRID:
          - Se mantiene la misma estructura que los otros componentes.
          - Al ser solo 2 miembros, ocuparán las primeras 2 columnas en desktop.
          - gap-y-20 para proteger el título flotante.
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