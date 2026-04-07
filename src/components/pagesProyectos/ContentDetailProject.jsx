import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from 'dompurify';
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
          image: getImageProxyUrl(projectData.cover_image?.url || projectData.cover_image_url || projectData.cover_image, { width: 1200, quality: 85 }) || categoryImages[catName] || imgFortalecimiento,
          date: projectData.created_at ? new Date(projectData.created_at).toLocaleDateString() : "Fecha no disponible",
          author: projectData.author || "Autor Desconocido",
          classification: projectData.classification_type_label || projectData.classification_type?.label,
          projectType: projectData.project_type_label || projectData.project_type?.label || projectData.project_type?.name,
          description: String(projectData.content || projectData.description || projectData.body || "Sin descripción disponible").replace(/\u00A0|&nbsp;/g, ' '),
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
      <div className="min-h-screen bg-white font-sans selection:bg-[#00AB6D]/30">


        {/* --- HERO HEADER --- */}
        <div className={`relative w-full min-h-[40vh] h-auto overflow-hidden bg-[#0f172a]`}>

          {/* FONDO: Color Sólido / Gradiente Sophisticado */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E305D] via-[#16324a] to-[#0f172a]"></div>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,171,109,0.15)_0%,transparent_50%)]"></div>
          </div>

          {/* TÍTULO EN HERO */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center pt-32 md:pt-40 pb-12 md:pb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 text-sm font-medium transition-all group px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al inicio
            </Link>

            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-[#00AB6D] text-white shadow-lg shadow-[#00AB6D]/20`}>
                {project.type}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] drop-shadow-2xl max-w-5xl tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 pt-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

            {/* COLUMNA IZQUIERDA: Cuerpo del Proyecto (Expandido) */}
            <div className="flex-1 min-w-0 bg-white rounded-t-[2rem] border border-gray-100">

              {/* Imagen del contenido (Estática) */}
              {project.image && (
                <div className="relative overflow-hidden bg-gray-50 border-b border-gray-100 flex justify-center">
                  <div className="max-w-4xl w-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="p-8 md:p-12 overflow-visible">
                {/* Título de la noticia (Tamaño moderado dentro del card) */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E305D] mb-4 leading-tight">
                  {project.title}
                </h2>

                {/* Sección de Autor más visible */}
                <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#1E305D]">
                    <User size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#00AB6D] uppercase tracking-widest">Responsable</span>
                    <span className="text-lg font-bold text-gray-900">{project.author || "Redacción Visión Circular"}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-gray-400 text-sm italic">
                    <Calendar size={14} /> {project.date}
                  </div>
                </div>
                <div
                  className="max-w-none text-gray-700 leading-relaxed font-sans news-content text-justify [&_*]:!text-justify"
                >
                  {project.description ? (
                    /[<>]/.test(project.description) ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(project.description, {
                            ADD_ATTR: ['target', 'rel', 'class']
                          })
                        }}
                        className="news-content ql-editor !p-0 !text-justify [&_*]:!text-justify"
                      />
                    ) : (
                      <>
                        {project.description
                          .split(/\r?\n\r?\n|\r?\n/)
                          .map(p => p.trim())
                          .filter(p => p.length > 0)
                          .map((paragraph, index) => (
                            <p key={index} className="news-content-styled text-justify !text-justify w-full">
                              {paragraph}
                            </p>
                          ))}
                      </>
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
              </div>
            </div>

            {/* COLUMNA DERECHA: Metadatos y Social Share (Sticky) */}
            <div className="lg:w-64 flex-shrink-0 order-2 lg:order-2">
              <div className="sticky top-32 flex flex-col gap-10">

                {/* Información */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b border-gray-200 pb-2">
                    Información del Proyecto
                  </h3>
                  <div className="space-y-6">
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