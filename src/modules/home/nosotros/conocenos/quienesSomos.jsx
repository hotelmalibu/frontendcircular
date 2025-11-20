import React from "react";
import Index from "../../../../components/home/nosotros/conocenos/quienesSomos/index.jsx";
import fondos_submenus from "../../../../assets/fondos_submenus.jpg";

export default function QuienesSomos() {
  return (
    <div className="mt-24 px-6 py-14 text-center" style={{ backgroundImage: `url(${fondos_submenus})`, backgroundSize: "cover", backgroundPosition: "center" }}>
    
      <Index />
    </div>
  );
}
