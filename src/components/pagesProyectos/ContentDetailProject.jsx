import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from 'dompurify';
import { motion } from "framer-motion";
import DefaultLoader from '../../components/common/DefaultLoader';
import {
  FileText,
  Calendar,
  User,
  Tag,
  Download,
  ArrowLeft,
  Facebook,
  X,
  Linkedin,
  Mail,
  Check,
  Layers,
  MessageCircle,
  Link as LinkIcon
} from "lucide-react";

import { getProjectById } from "../../api/projectsApi";
import { getImageProxyUrl } from "../../utils/imageUtils";

// Import specific category images
import imgFortalecimiento from "../../assets/home/Proyectos/Fortalecimiento.png";
import imgInnovacion from "../../assets/home/Proyectos/Innovacion.png";
import imgConsumo from "../../assets/home/Proyectos/ConsumoResponsable.png";
import imgEstrategicos from "../../assets/home/Proyectos/ProyectosEstrategicos.png";
import imgInclusion from "../../assets/home/Proyectos/Inclusion.png";

// Category to image mapping
const categoryImages = {
  "Fortalecimiento": imgFortalecimiento,
  "Innovación": imgInnovacion,
  "Innovacion": imgInnovacion,
  "Consumo Responsable": imgConsumo,
  "Consumo": imgConsumo,
  "Proyectos Estratégicos": imgEstrategicos,
  "Estratégicos": imgEstrategicos,
  "Inclusión": imgInclusion,
  "Inclusion": imgInclusion,
  // Fallbacks or extra mappings
  "Investigacion": imgInnovacion,
  "Produccion": imgFortalecimiento,
  "Economia": imgConsumo,
};



export default function ContentDetailProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        const catName = projectData.category_name || projectData.category || "General";
        const mappedProject = {
          id: projectData.id,
          title: projectData.title,
          type: catName,
          // Correctly access cover_image.url or fallback
          image: getImageProxyUrl(projectData.cover_image?.url || projectData.cover_image_url || projectData.cover_image, { width: 1200, quality: 85 }) || categoryImages[catName] || "/assets/home/Proyectos/proyecto1.png",
          date: projectData.created_at ? new Date(projectData.created_at).toLocaleDateString() : "Fecha no disponible",
          author: projectData.author || "Autor Desconocido",
          classification: projectData.classification_type_label || projectData.classification_type?.label,
          projectType: projectData.project_type_label || projectData.project_type?.label || projectData.project_type?.name,
          description: projectData.content || projectData.description || "Sin descripción disponible",
          uploadFile: projectData.upload_file,
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
    return <DefaultLoader />;
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

  // NOTE: Facebook sharing won't show a preview if the URL is "localhost".
  // To test that it works, you can temporarily replace 'encodedUrl' with encodeURIComponent('https://www.google.com')
  const facebookShareUrl = `https://www.facebook.com/sharer.php?u=${encodedUrl}`;
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedTextAndUrl}`;
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
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E305D]/50 to-[#1E305D]" />
            </div>

            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center pt-32 md:pt-40">
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
                <span className="inline-block mb-4 text-xs font-bold tracking-widest text-white uppercase drop-shadow-md">
                  {project.type}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 max-w-5xl drop-shadow-lg">
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
          {/* --- CONTENIDO PRINCIPAL --- */}
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

              {/* COLUMNA IZQUIERDA: Cuerpo del Proyecto (Expandido) */}
              <div className="flex-1 order-1 lg:order-1">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100"
                >
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E305D] mb-8 leading-tight">
                    {project.title}
                  </h1>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-sans">
                    {project.description ? (
                      /[<>]/.test(project.description) ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(project.description, {
                              ADD_ATTR: ['target', 'rel', 'class']
                            })
                          }}
                          className="news-content ql-editor !p-0"
                        />
                      ) : (
                        <p className="text-xl">{project.description}</p>
                      )
                    ) : (
                      <p className="italic text-gray-400">No hay detalles adicionales disponibles.</p>
                    )}
                  </div>

                  {/* Documentation Section - Now simpler and more professional */}
                  {project.uploadFile && (
                    <div className="mt-16 pt-10 border-t border-gray-100">
                      <h3 className="text-xl font-bold text-[#1E305D] mb-6 flex items-center gap-2">
                        <Download size={20} className="text-[#00AB6D]" /> Recursos y Documentos
                      </h3>
                      <div className="group flex items-center justify-between p-6 bg-gray-50 hover:bg-[#1E305D] rounded-2xl border border-gray-200 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1E305D] shadow-sm">
                            <FileText size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-[#1E305D] group-hover:text-white transition-colors capitalize">
                              {project.uploadFile.original_name?.toLowerCase() || "Documento adjunto"}
                            </p>
                            <p className="text-xs text-gray-500 group-hover:text-white/60 transition-colors uppercase tracking-widest font-bold">
                              {project.uploadFile.extension || "PDF"} • {Math.round(project.uploadFile.size / 1024)} KB
                            </p>
                          </div>
                        </div>
                        <a
                          href={project.uploadFile.path ? `https://api-ecocircular.creativostecnologicosit.com/storage/${project.uploadFile.path}` : project.uploadFile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#00AB6D] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00965d] active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#00AB6D]/20"
                        >
                          <Download size={18} />
                          <span className="hidden sm:inline">Descargar</span>
                        </a>
                      </div>
                    </div>
                  )}
                </motion.article>
              </div>

              {/* COLUMNA DERECHA: Metadatos y Social Share (Sticky) */}
              <div className="lg:w-56 flex-shrink-0 order-2 lg:order-2">
                <div className="sticky top-32 flex flex-col gap-10">

                  {/* Detalles Técnicos */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b border-gray-200 pb-2">
                      Información del Proyecto
                    </h3>
                    <div className="space-y-6">
                      <SidebarItem
                        icon={User}
                        label="Escrito por"
                        value={project.author}
                      />
                      <SidebarItem
                        icon={Layers}
                        label="Tópico / Categoría"
                        value={project.type}
                      />
                      <SidebarItem
                        icon={Tag}
                        label="Clasificación"
                        value={project.classification}
                      />
                      <SidebarItem
                        icon={Calendar}
                        label="Publicado el"
                        value={project.date}
                      />
                    </div>
                  </div>

                  {/* Social Share */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b border-gray-200 pb-2">
                      Compartir
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <SocialButton icon={Facebook} color="#1877F2" url={facebookShareUrl} />
                      <SocialButton icon={X} color="#000000" url={xShareUrl} />
                      <SocialButton icon={Linkedin} color="#0A66C2" url={linkedinShareUrl} />
                      <SocialButton icon={MessageCircle} color="#25D366" url={whatsappShareUrl} />
                      <SocialButton icon={Mail} color="#444444" url={mailShareUrl} />

                      {/* Botón de Copiar Link */}
                      <button
                        onClick={copyToClipboard}
                        className={`
                          w-12 h-12 flex items-center justify-center
                          rounded-xl
                          backdrop-blur-md
                          transition-all duration-200 hover:scale-110
                          ${copied ? "bg-green-500 text-white border-green-400 shadow-lg shadow-green-500/20" : "bg-white/20 text-[#718096] border border-white/30 hover:bg-white/30"}
                        `}
                        title="Copiar enlace"
                      >
                        {copied ? <Check size={26} strokeWidth={2} /> : <LinkIcon size={26} strokeWidth={2} />}
                      </button>
                    </div>
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

// Sub-component Item de Sidebar
function SidebarItem({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="group border-l-2 border-gray-100 pl-4 hover:border-[#00AB6D] transition-colors">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#00AB6D] transition-colors">
        <Icon size={14} />
        {label}
      </div>
      <p className="text-gray-900 font-bold leading-tight">{value}</p>
    </div>
  );
}