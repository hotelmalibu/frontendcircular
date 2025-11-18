import React from "react";
import { ShieldCheck, Handshake, Scale, Users, Landmark } from "lucide-react";

export default function Index() {
  const valores = [
    {
      icon: Landmark,
      titulo: "Libertad de empresa y propiedad privada",
      descripcion:
        "Estamos convencidos que la empresa privada formal es instrumento fundamental para el desarrollo de un país. Nos enorgullece representar la creación de valor fruto del trabajo y esfuerzo de las personas.",
    },
    {
      icon: ShieldCheck,
      titulo: "Honestidad",
      descripcion:
        "Somos coherentes con nuestros principios y actos, demarcados por la transparencia, la franqueza, la honradez y la promoción de valores éticos. Defendemos la legalidad.",
    },
    {
      icon: Handshake,
      titulo: "Defensa de la democracia",
      descripcion:
        "Creemos en nuestra constitución, la búsqueda de instituciones eficientes y legítimas y en la participación colectiva como el motor de las decisiones.",
    },
    {
      icon: Scale,
      titulo: "Justicia",
      descripcion:
        "Defendemos lo que creemos: la libertad, la dignidad humana y un país equitativo, privilegiando el interés general sobre el particular.",
    },
    {
      icon: Users,
      titulo: "Respeto",
      descripcion:
        "Reconocemos la legitimidad, diversidad y condición humana de los individuos.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-green-50/70 py-24 px-6 md:px-20 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.08),_transparent_50%)] pointer-events-none"></div>

      {/* Encabezado */}
      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
          Nuestros Valores
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-400 mx-auto mb-6 rounded-full animate-pulse"></div>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          En la ANDI creemos en principios que inspiran nuestro trabajo diario y
          fortalecen la relación entre empresa, sociedad y país.
        </p>
      </div>

      {/* Tarjetas */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {valores.map((valor, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl border-2 border-green-200 shadow-sm hover:shadow-xl hover:border-green-400 transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
          >
            {/* Franja superior con ícono */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 h-28 flex items-center justify-center relative overflow-hidden">
              <div className="bg-white p-3 rounded-full shadow-md group-hover:scale-110 transition-transform duration-300">
                <valor.icon className="w-10 h-10 text-green-600 group-hover:text-emerald-600 transition-colors duration-300" />
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-500"></div>
            </div>

            {/* Contenido */}
            <div className="p-8 text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                {valor.titulo}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {valor.descripcion}
              </p>
            </div>

            {/* Borde decorativo animado al hacer hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-400/50 transition-all duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
