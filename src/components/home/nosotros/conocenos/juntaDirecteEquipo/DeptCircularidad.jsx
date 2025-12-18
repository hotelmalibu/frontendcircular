import React from "react";
import { motion } from "framer-motion";
import DepartmentBanner from "./DepartmentBanner";

// Imágenes específicas de Circularidad
import dianaImg from "../../../../../assets/imgEquipo/Dianag.jpg";
import gabrielImg from "../../../../../assets/imgEquipo/gabriel.jpg";
import mariaFImg from "../../../../../assets/imgEquipo/mariaf.jpg";
import luisaImg from "../../../../../assets/imgEquipo/luisa.jpg";
import julianaImg from "../../../../../assets/imgEquipo/juliana.jpg";
import karenImg from "../../../../../assets/imgEquipo/karen.jpg";
import lauraimg from "../../../../../assets/imgEquipo/laura.jpg";



export default function DeptCircularidad() {
  const styles = {
    title: "Circularidad y Regionales",
    headerGradient: "bg-gradient-to-r from-[#678900] to-[#8CB200]",
    headerText: "text-[#1E305D]",
    bannerNameBg: "bg-[#8CB200]",
    bannerAccent: "bg-gradient-to-r from-[#A3D95B] to-[#007D6A]",
  };

  const members = [
    { role: "Coord. de Circularidad", name: "Diana García", image: dianaImg },
    { role: "Coord. Regional", name: "Gabriel Sabogal", image: gabrielImg },
    { role: "Coord. Regional", name: "Juliana Ospina", image: julianaImg },
    { role: "Reg. Centro Oriente", name: "María Fernanda", image: mariaFImg },
    { role: "Reg. Suroccidente", name: "Karen Salazar", image: karenImg },
    { role: "Reg. Nororiente", name: "Luisa Montalvo", image: luisaImg },
    { role: "Reg. Oriente", name: "Laura Mojica", image: lauraimg }
  ];

  return (
    <div className="w-full flex justify-center">
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 max-w-7xl">
        
        {members.map((member, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
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