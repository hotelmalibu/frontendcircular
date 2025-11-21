import React from "react";
import { motion } from "framer-motion";
import proyecto1 from "../../assets/home/Proyectos/proyecto1.png";
import proyecto2 from "../../assets/home/Proyectos/proyecto2.png";
import proyecto3 from "../../assets/home/Proyectos/proyecto3.png";
import proyecto4 from "../../assets/home/Proyectos/proyecto4.png";
import proyecto5 from "../../assets/home/Proyectos/proyecto5.png";
import proyecto6 from "../../assets/home/Proyectos/proyecto6.png";
import fondoProyecto from "../../assets/home/Proyectos/fondo_proyecto.png";

const projects = [
  { id: 1, title: "Fortalecimiento de Recicladores de Oficio", type: "FORTALECIMIENTO", color: "#1E305D", image: proyecto1, description: "Programa de inclusión y formalización de recicladores con capacitación, equipamiento y vinculación a la cadena de valor." },
  { id: 2, title: "Modelos de Negocio Circular", type: "INNOVACIÓN", color: "#1E305D", image: proyecto2, description: "Desarrollo de soluciones innovadoras para la transformación de residuos en nuevos productos de alto valor." },
  { id: 3, title: "Sensibilización al Consumidor", type: "PEDAGOGÍA", color: "#1E305D", image: proyecto3, description: "Campañas educativas para promover la separación en la fuente y el consumo responsable en toda Colombia." },
  { id: 4, title: "Investigación en Materiales Circulares", type: "INVESTIGACIÓN", color: "#1E305D", image: proyecto4, description: "Estudios sobre nuevos materiales reciclables y biodegradables que impulsen la sostenibilidad en la industria." },
  { id: 5, title: "Producción Sostenible Local", type: "PRODUCCIÓN", color: "#1E305D", image: proyecto5, description: "Iniciativas que apoyan a productores locales en la adopción de procesos sostenibles y circulares." },
  { id: 6, title: "Economía Colaborativa Verde", type: "ECONOMÍA", color: "#1E305D", image: proyecto6, description: "Plataformas digitales que promueven el intercambio, la reutilización y la cooperación entre comunidades." },
];

export default function ProjectsSection() {
  return (
    <section
      className="relative py-20 px-6 md:px-12 text-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${fondoProyecto})` }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[#00AB6D] font-bold px-4 py-1.5 rounded-full text-2xl tracking-wide uppercase">
            Nuestras Iniciativas
          </span>

          <h2 className="text-4xl font-bold text-[#1E305D] mb-4 leading-tight">
            Proyectos que Transforman
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Conoce las iniciativas innovadoras que impulsan la economía circular en Colombia
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-lg bg-gray-100"
            >
              {/* Imagen cuadrada */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay con tipo, título y texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end">
                <span
                  className="self-start text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase"
                  style={{ backgroundColor: project.color }}
                >
                  {project.type}
                </span>

                <h3 className="text-white font-bold text-xl mb-2 leading-snug">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}