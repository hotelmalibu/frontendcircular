import React from "react";
import { motion } from "framer-motion";
import DepartmentBanner from "./DepartmentBanner";

// Imágenes específicas de Innovación
import monicaTImg from "../../../../../assets/imgEquipo/monicat.jpg";
import felipeImg from "../../../../../assets/imgEquipo/felipe.jpg";

export default function DeptInnovacion() {
  const styles = {
    title: "Innovación",
    headerGradient: "bg-gradient-to-r from-[#5A1E5F] to-[#9E1981]",
    headerText: "text-white",
    bannerNameBg: "bg-[#9E1981]",
    bannerAccent: "bg-gradient-to-r from-[#A3D95B] to-[#007D6A]",
  };

  const members = [
    { role: "Subgerente Innovación", name: "Felipe Belalcazar", image: felipeImg },
    { role: "Prof. de Innovación", name: "Mónica Turriago", image: monicaTImg }
  ];

  return (
    
    <div className="w-full flex justify-center ">
      
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