import React from "react";
import fondos_submenus from "../../../../assets/fondos_submenus.jpg";
import Index from "../../../../components/home/nuestrosTrabajos/proyectosAlianzas/territoriales/index.jsx";

export default function Territoriales() {
  return (
    <div className="mt-24 px-6 py-14 text-center" style={{ backgroundImage: `url(${fondos_submenus})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <Index />
    </div>
  );
}