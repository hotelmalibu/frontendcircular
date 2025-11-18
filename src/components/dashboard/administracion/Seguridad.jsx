import React from "react";
import SeguridadConfig from "./Subcomponents/seguridad/SeguridadConfig";
import SesionesActivas from "./Subcomponents/seguridad/SesionesActivas";

export default function Seguridad() {
  return (
    <div>
      <SeguridadConfig />
      <SesionesActivas />
    </div>
  );
}