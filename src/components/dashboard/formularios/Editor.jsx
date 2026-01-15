import React from "react";
import VistaPrevia from "./Subcomponents/Editor/VistaPrevia";

export default function Dashboard({ onNavigate, formId }) {
  return (
    <div>
      <VistaPrevia formId={formId} onSuccess={() => onNavigate?.("Encuestas")} />
    </div>
  );
}