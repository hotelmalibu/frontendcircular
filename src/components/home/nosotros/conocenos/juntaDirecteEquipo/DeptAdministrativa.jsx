import React from "react";
import DepartmentBanner from "./DepartmentBanner";

// Imágenes específicas de Administrativa
import nubiaImg from "../../../../../assets/imgEquipo/nubia.jpg";
import sebastianImg from "../../../../../assets/imgEquipo/sebastian.jpg";
import jhostinImg from "../../../../../assets/imgEquipo/Jhostinf.jpg";

export default function DeptAdministrativa() {
  const styles = {
    title: "Administrativa y Financiera",
    headerGradient: "bg-gradient-to-r from-[#A53A00] to-[#E15200]",
    headerText: "text-white",
    bannerNameBg: "bg-[#E15200]",
    bannerAccent: "bg-gradient-to-r from-[#A3D95B] to-[#007D6A]",
  };

  const members = [
    { role: "Jefe Administrativa", name: "Nubia Rivera", image: nubiaImg },
    { role: "Prof. Contable", name: "Sebastián Gómez", image: sebastianImg },
    { role: "Analista administrativo y financiero", name: "Jhostin Florez", image: jhostinImg }
  ];

  return (
    // Contenedor principal con padding vertical para dar aire arriba y abajo
    
    <div className="w-full flex justify-center px-4 py-4">
      
      
     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 max-w-7xl">
        
        {members.map((member, idx) => (
          <div 
            key={idx} 
            className="flex justify-center w-full"
          >
            <DepartmentBanner 
              name={member.name} 
              role={member.role} 
              image={member.image} 
              styles={styles} 
            />
          </div>
        ))}
        
      </div>
    </div>
  );
}