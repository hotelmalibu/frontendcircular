import React from "react";
import VistaPrevia from "./Subcomponents/Editor/VistaPrevia";

export default function Dashboard({ onNavigate }) {
  return (
    <div>
      <VistaPrevia onSuccess={() => onNavigate?.("Encuestas")} />
    </div>
  );
}