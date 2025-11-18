import React from "react";
import Index from "../../../../components/home/nosotros/conocenos/informesAnuales/index.jsx";

export default function InformesAnuales() {
  return (
    <div className="mt-24 px-6 py-14 text-center">
      <h1 className="text-3xl font-bold mb-4">Informes Anuales</h1>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto">
        Somos una organización dedicada a la economía circular y la sostenibilidad.
      </p>
      <Index />
    </div>
  );
}