// src/components/circularmente/AdminPanel.jsx
import { useState } from "react";

export default function AdminPanel() {
  const [empresa, setEmpresa] = useState("");

  return (
    <section className="py-10 bg-[#091726] text-center">
      <h2 className="text-xl font-semibold text-[#18a999] mb-4">
        Panel de Administración
      </h2>
      <input
        value={empresa}
        onChange={(e) => setEmpresa(e.target.value)}
        placeholder="Nombre de nueva empresa"
        className="bg-transparent border border-[#18a999] px-4 py-2 rounded-lg text-white"
      />
      <button
        onClick={() => {
          alert(`Empresa "${empresa}" añadida (mock)`);
          setEmpresa("");
        }}
        className="ml-3 bg-[#18a999] text-[#042022] px-4 py-2 rounded-lg font-semibold"
      >
        Agregar
      </button>
    </section>
  );
}
