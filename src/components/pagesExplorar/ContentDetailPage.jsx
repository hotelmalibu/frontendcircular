import React, { useEffect, useState, useContext } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import { Facebook, X, Linkedin, Mail, Calendar, ArrowLeft, MessageCircle, Link as LinkIcon, Check, User, Layers } from 'lucide-react';
import { allContentData, contentTypeConfig as typeConfig } from '../../data/mockContent';
import { AuthContext } from '../../context/AuthContext';
import { getAllNews, getNewsById } from '../../api/newsApi';
import { getImageProxyUrl } from '../../utils/imageUtils.js';
import DefaultLoader from '../../components/common/DefaultLoader';


export default function ContentDetailPage() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Try to find content in static mock first, or fetch from API when needed
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    let mounted = true;

    const findContent = async () => {
      // 1) Try static mock
      const fromMock = allContentData.find(item => item.slug === slug);
      if (fromMock) {
        if (mounted) {
          // Ensure mock has a `body` field for full content rendering
          setContent({
            ...fromMock,
            body: fromMock.body || fromMock.description || fromMock.excerpt || "",
            author: fromMock.author || "",
          });
          setLoading(false);
        }
        return;
      }

      // 2) Fetch all news and try to match by slug
      try {
        const response = await getAllNews();
        let newsArray = [];
        if (Array.isArray(response)) newsArray = response;
        else if (response?.data?.news && Array.isArray(response.data.news)) newsArray = response.data.news;
        else if (response?.data && Array.isArray(response.data)) newsArray = response.data;
        else if (response?.news && Array.isArray(response.news)) newsArray = response.news;
        else if (typeof response === 'object' && response !== null) {
          const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) newsArray = possibleArrays[0];
        }

        // If links were generated as `noticia-{id}` on the cards, extract id
        const idFromSlug = typeof slug === 'string' && slug.startsWith('noticia-') ? slug.replace('noticia-', '') : null;

        // Search logic
        let found = newsArray.find(n => n.slug === slug || String(n.id) === slug || String(n._id) === slug || (idFromSlug && (String(n.id) === idFromSlug || String(n._id) === idFromSlug)));

        // If not found in the batch, try to fetch by id directly when we have idFromSlug
        if (!found && idFromSlug) {
          try {
            const byId = await getNewsById(idFromSlug);
            if (byId) found = byId;
            console.debug('ContentDetailPage: fetched by id', byId);
          } catch (err) {
            console.warn('ContentDetailPage: getNewsById failed', err);
          }
        }

        if (found && mounted) {
          // Log para depuración: Ver qué campos trae la API realmente
          console.log("Datos recibidos de la API:", found);

          // If the found content is not published, only allow displaying it for authenticated users.
          if (String(found.status).toLowerCase() !== 'published' && !isAuthenticated) {
            setContent(null);
            setLoading(false);
            return;
          }

          // Normalize API object into the shape expected by the detail page
          const mapped = {
            id: found.id || found._id || found.uid,
            title: found.title || found.name || "Sin título",
            excerpt: found.description || found.content || "",
            body: found.content || found.description || found.body || "",
            image: getImageProxyUrl((found.upload_file && found.upload_file.url) || found.image || "", { width: 1200, quality: 85 }),
            date: found.published_at || found.created_at || "",
            type: found.type === 'news' ? 'Noticias' : (found.type || 'Noticias'),
            topic: found.category_name || (found.category && typeof found.category === 'object' ? found.category.name : found.category) || "General",
            author: found.author || "",
            slug: found.slug || null,
            status: found.status || "",
          };

          // Sanitize body HTML
          if (mapped.body && /[<>]/.test(mapped.body)) {
            try {
              mapped.body = DOMPurify.sanitize(String(mapped.body), {
                ADD_ATTR: ['target', 'rel', 'class'],
              });
            } catch (e) { }
          }

          // Format date
          if (mapped.date) {
            try {
              mapped.date = new Date(mapped.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
            } catch (e) { }
          }

          setContent(mapped);
        } else if (mounted) {
          setContent(null);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        if (mounted) setContent(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    findContent();
    return () => { mounted = false };
  }, [slug, isAuthenticated]);

  // ...

  if (loading) {
    return <DefaultLoader />;
  }

  if (!content) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-4 bg-[#F6F6F6]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Contenido no encontrado</h2>
        <Link to="/explorar" className="text-[#00AB6D] hover:underline font-semibold">
          ← Volver a explorar
        </Link>
      </div>
    );
  }

  const config = (typeConfig && content?.type) ? (typeConfig[content.type] || {}) : {};
  const Icon = config.icon || (() => null);

  // --- SOCIAL SHARE URLS ---
  const currentUrl = window.location.href;
  const rawTitle = content?.title || '';

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(rawTitle);
  const encodedTextAndUrl = encodeURIComponent(`${rawTitle} ${currentUrl}`);

  const facebookShareUrl = `https://www.facebook.com/sharer.php?u=${encodedUrl}`;
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedTextAndUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodedTextAndUrl}`;
  const mailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedTextAndUrl}`;

  return (
    <div className="min-h-screen bg-white fontfamily-montserrat">

      {/* --- HERO HEADER --- */}
      <div className={`relative w-full min-h-[40vh] h-auto overflow-hidden ${config.isSolid ? config.bgColor : 'bg-[#0f172a]'}`}>

        {/* FONDO: Color Sólido / Gradiente Sophisticado */}
        {config.isSolid ? (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <Icon size={400} strokeWidth={0.5} className="text-white opacity-5 absolute -right-20 -bottom-20 rotate-12" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/40 to-transparent"></div>
          </div>
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E305D] via-[#16324a] to-[#0f172a]"></div>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,171,109,0.15)_0%,transparent_50%)]"></div>
          </div>
        )}

        {/* TÍTULO EN HERO */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center pt-32 md:pt-40 pb-12 md:pb-16">
          <Link to="/explorar" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 text-sm font-medium transition-all group px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver a explorar
          </Link>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-[#00AB6D] text-white shadow-lg shadow-[#00AB6D]/20`}>
              {content.type}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] drop-shadow-2xl max-w-5xl tracking-tight">
            {content.title}
          </h1>

        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 pt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* COLUMNA IZQUIERDA: Cuerpo del Artículo */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden">

              {/* Imagen del contenido (Estática) */}
              {content.image && (
                <div className="relative overflow-hidden bg-gray-50 border-b border-gray-100 flex justify-center">
                  <div className="max-w-4xl w-full">
                    <img
                      src={content.image}
                      alt={content.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="p-8 md:p-12">
                {/* Título de la noticia (Tamaño moderado dentro del card) */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E305D] mb-4 leading-tight">
                  {content.title}
                </h2>

                {/* Sección de Autor más visible */}
                <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#1E305D]">
                    <User size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#00AB6D] uppercase tracking-widest">Escritor</span>
                    <span className="text-lg font-bold text-gray-900">{content.author || 'Redacción Visión Circular'}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-gray-400 text-sm italic">
                    <Calendar size={14} /> {content.date}
                  </div>
                </div>

                <div className="max-w-none text-gray-700 leading-relaxed font-sans news-content">
                  {content.body ? (
                    /[<>]/.test(content.body) ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: content.body }}
                        className="news-content ql-editor !p-0 !font-sans !text-gray-700"
                      />
                    ) : (
                      <>
                        {content.body
                          .split(/\r?\n\r?\n|\r?\n/)
                          .map(p => p.trim())
                          .filter(p => p.length > 0)
                          .map((paragraph, idx) => (
                            <p key={idx} className="news-content-styled">{paragraph}</p>
                          ))}
                      </>
                    )
                  ) : (
                    <p className="italic text-gray-400">No hay contenido adicional disponible.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Metadatos y Social Share (Sticky) */}
          <div className="lg:w-64 flex-shrink-0 order-2 lg:order-2">
            <div className="sticky top-32 flex flex-col gap-10">

              {/* Información */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b border-gray-200 pb-2">
                  Información
                </h3>
                <div className="space-y-6">
                  <SidebarItem
                    icon={Layers}
                    label="Tópico / Categoría"
                    value={content.topic}
                  />

                  <SidebarItem
                    icon={Calendar}
                    label="Publicado el"
                    value={content.date}
                  />

                  <SidebarItem
                    icon={Check}
                    label="Tipo de contenido"
                    value={content.type}
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
  );
}

// Sub-componente Botón Social (REVERTIDO)
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

// Sub-component Item de Sidebar (REVERTIDO)
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
