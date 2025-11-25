import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Check, 
  Calendar, 
  MapPin, 
  ArrowUpRight, 
  TrendingUp 
} from "lucide-react"; 
import { projectsData } from "../../data/mockContentData";

const formatNumber = (val) => {
  if (typeof val === 'number') {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k+`; 
    return `${val}+`; 
  }
  return val;
};

export default function ContentDetailProject() {
  const { id } = useParams();
  const project = projectsData.find((p) => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center text-[#1E305D] text-xl font-bold bg-[#F6F6F6]">
        Proyecto no encontrado
      </div>
    );
  }

  return (
    
      
    <div className="bg-[#F6F6F6] min-h-screen font-sans selection:bg-[#00AB6D]/30 pt-28">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E305D]/60 via-[#1E305D]/80 to-[#1E305D]" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors w-fit group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest text-white uppercase bg-[#00AB6D] rounded-full">
              {project.type}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 max-w-4xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-gray-300 text-sm md:text-base">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00AB6D]" /> {project.date}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00AB6D]" /> {project.location}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Columna Izquierda: Historia */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* El Reto */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#00AB6D] font-bold uppercase tracking-wider mb-2 text-sm">
                El Desafío
              </h3>
              <h2 className="text-3xl font-bold text-[#1E305D] mb-6">
                ¿Qué problema estamos resolviendo?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {project.challenge}
              </p>
            </motion.section>

            {/* La Solución */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#e2e8f0] p-8 rounded-3xl border-l-4 border-[#00AB6D]"
            >
              <h3 className="text-[#1E305D] font-bold uppercase tracking-wider mb-4 text-sm">
                Nuestra Intervención
              </h3>
              <p className="text-[#1E305D] text-lg font-medium leading-relaxed">
                {project.solution}
              </p>
            </motion.section>

            {/* El Impacto */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#00AB6D] font-bold uppercase tracking-wider mb-2 text-sm">
                Resultados
              </h3>
              <h2 className="text-3xl font-bold text-[#1E305D] mb-6">
                Impacto Generado
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {project.impact}
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-[#00AB6D] mt-1 flex-shrink-0" />
                  <span>Mejora continua en procesos de recolección.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-[#00AB6D] mt-1 flex-shrink-0" />
                  <span>Alianzas estratégicas con el sector público.</span>
                </li>
              </ul>
            </motion.section>
          </div>

          {/* Columna Derecha: Stats y Sidebar */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#1E305D] text-white rounded-3xl p-8 shadow-xl h-fit"
            >
              <h4 className="text-xl font-bold mb-6 border-b border-white/20 pb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#00AB6D]" />
                Cifras Clave
              </h4>
              
              <div className="space-y-8">
                {project.stats?.length > 0 ? (
                  project.stats.map((stat, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="text-5xl font-extrabold text-[#00AB6D] mb-1">
                        {formatNumber(stat.value)}
                      </div>
                      <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    Información estadística en recolección.
                  </p>
                )}
              </div>

              <div className="mt-10 pt-6 border-t border-white/20">
                <p className="text-sm text-gray-300 mb-4">
                  ¿Te interesa apoyar este proyecto?
                </p>
                <button className="w-full py-3 bg-[#00AB6D] hover:bg-[#009b62] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group">
                  Contáctanos
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}