import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Calendar,
  MapPin,
  ArrowUpRight,
  TrendingUp,
  Facebook,
  X,
  Linkedin,
  Mail,
  Share2,
  MessageCircle,
  Instagram
} from "lucide-react";
import { getProjectById } from "../../api/projectsApi";

const formatNumber = (val) => {
  if (typeof val === 'number') {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k+`;
    return `${val}+`;
  }
  return val;
};

export default function ContentDetailProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProjectById(id);

        // Handle different response structures
        let projectData = response;
        if (response?.data) {
          projectData = response.data;
        }

        // Map API data to expected format
        const mappedProject = {
          id: projectData.id,
          title: projectData.title,
          type: projectData.category_name || projectData.category || "General",
          image: projectData.image || "/assets/home/Proyectos/proyecto1.png", // fallback image
          date: projectData.created_at ? new Date(projectData.created_at).toLocaleDateString() : "Fecha no disponible",
          location: projectData.location || "Ubicación no especificada",
          challenge: projectData.challenge || projectData.description || "Información del desafío no disponible",
          solution: projectData.solution || "Información de la solución no disponible",
          impact: projectData.impact || "Información del impacto no disponible",
          stats: projectData.stats || []
        };

        setProject(mappedProject);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.response?.data?.message || "Error al cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F6F6F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00AB6D] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-[#1E305D] text-xl font-bold bg-[#F6F6F6]">
        <div className="text-center">
          <p className="mb-4">Error: {error}</p>
          <Link to="/" className="text-[#00AB6D] hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center text-[#1E305D] text-xl font-bold bg-[#F6F6F6]">
        <div className="text-center">
          <p className="mb-4">Proyecto no encontrado</p>
          <Link to="/" className="text-[#00AB6D] hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Social share URLs
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(project?.title || '');
  const encodedTextAndUrl = encodeURIComponent(`${project?.title || ''} ${currentUrl}`);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedTextAndUrl}`;
  const instagramShareUrl = `https://www.instagram.com/share?url=${encodedUrl}&text=${encodedTextAndUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodedTextAndUrl}`;
  const mailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedTextAndUrl}`;

  return (
    <>
      {/* Force navbar white background for project detail pages */}
      <style>{`
        .navbar-forced-white header {
          background-color: white !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
        .navbar-forced-white .menu-underline {
          border-bottom-color: #00AB6D !important;
        }
        .navbar-forced-white .hamburger-line {
          background-color: #374151 !important;
        }
      `}</style>
      {/* Add class to parent to force navbar styling */}
      <div className="navbar-forced-white">
        <div className="bg-[#F6F6F6] min-h-screen font-sans selection:bg-[#00AB6D]/30">


          <div className="relative h-[85vh] w-full overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={project.image}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1E305D]/60 via-[#1E305D]/80 to-[#1E305D]" />
            </div>

            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center pt-8">
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
                </div>
              </motion.div>
            </div>
          </div>

          {/* --- CONTENIDO PRINCIPAL --- */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-12">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

              {/* COLUMNA IZQUIERDA: Social Share Sticky */}
              <div className="lg:w-24 flex-shrink-0">
                <div className="sticky top-32 flex lg:flex-col gap-4 items-center lg:items-start">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:block mb-2">
                    Compartir
                  </span>

                  <SocialButton icon={Facebook} color="#1877F2" url={facebookShareUrl} />
                  <SocialButton icon={X} color="#000000" url={xShareUrl} />
                  <SocialButton icon={Linkedin} color="#0A66C2" url={linkedinShareUrl} />
                  <SocialButton icon={Instagram} color="#E4405F" url={instagramShareUrl} />
                  <SocialButton icon={MessageCircle} color="#25D366" url={whatsappShareUrl} />
                  <SocialButton icon={Mail} color="#444444" url={mailShareUrl} />

                  {/* Móvil: Etiqueta compartir */}
                  <div className="lg:hidden flex items-center gap-2 text-gray-400 text-sm font-bold ml-auto">
                    <Share2 size={16} /> Compartir
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: Contenido del Proyecto */}
              <div className="flex-1 max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Columna Izquierda: Descripción del Proyecto */}
                  <div className="lg:col-span-8">
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <div className="prose prose-lg prose-headings:text-[#1E305D] prose-a:text-[#00AB6D] text-gray-600">
                        {project.challenge ? (
                          /<[a-z][\s\S]*>/i.test(project.challenge) ? (
                            <div dangerouslySetInnerHTML={{ __html: project.challenge }} />
                          ) : (
                            <p className="text-lg leading-relaxed">{project.challenge}</p>
                          )
                        ) : (
                          <p className="text-lg leading-relaxed text-gray-500">Descripción del proyecto no disponible.</p>
                        )}
                      </div>
                    </motion.section>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Sub-component Botón Social
function SocialButton({ icon: Icon, url, color }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-12 h-12 flex items-center justify-center
        rounded-xl
        bg-white/20 backdrop-blur-md
        border border-white/30
        text-white
        transition-all duration-200 hover:bg-white/30 hover:scale-110
      "
      style={{ color: color }}
      title="Compartir en red social"
    >
      <Icon size={26} strokeWidth={2} />
    </a>
  );
}