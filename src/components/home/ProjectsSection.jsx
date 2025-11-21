import React from "react";
import { ArrowRight } from "lucide-react";
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
  className="relative py-20 px-6 md:px-12 text-center overflow-hidden"
  style={{
    backgroundColor: "#d0e8da",             // color de fondo
    backgroundImage: `url(${fondoProyecto})`, // imagen de fondo
    backgroundRepeat: "no-repeat",
    backgroundPosition: "left bottom",      // esquina inferior izquierda
    backgroundSize: "250px auto",           // tamaño pequeño de la imagen
  }}
>



      {/* === CONTENIDO === */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block  text-[#00AB6D] font-bold px-4 py-1.5 rounded-full text-2xl tracking-wide uppercase">
            Nuestras Iniciativas
          </span>
          <h2 className="text-4xl md:text-4xl font-bold text-[#1E305D] mb-4 leading-tight">
            Proyectos que Transforman
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Conoce las iniciativas innovadoras que impulsan la economía circular en Colombia
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {projects.map((project, index) => (
            <div key={project.id} className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col border border-gray-100">
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="absolute top-4 left-4 text-white text-xs font-bold py-2 px-4 rounded-full tracking-wider uppercase shadow-lg backdrop-blur-sm"
                  style={{ backgroundColor: project.color, boxShadow: `0 8px 20px ${project.color}40` }}>
                  {project.type}
                </span>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <ArrowRight size={20} className="text-[#00AB6D]" />
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-7 flex flex-col flex-grow">
                <h3 className="text-[#1E305D] text-lg md:text-xl font-bold mb-3 leading-snug group-hover:text-[#00AB6D] transition-colors duration-300">{project.title}</h3>
                <p className="text-gray-600 text-sm md:text-base flex-grow leading-relaxed mb-6">{project.description}</p>
                <a href="#" className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300"
                  style={{ color: project.color, backgroundColor: `${project.color}15`, border: `2px solid ${project.color}30` }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = project.color; e.target.style.color = "white"; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = `${project.color}15`; e.target.style.color = project.color; }}>
                  Ver proyecto
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <button className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#00AB6D] to-[#008A5C] text-white font-bold px-8 md:px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative">Ver todos los proyectos</span>
            <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
