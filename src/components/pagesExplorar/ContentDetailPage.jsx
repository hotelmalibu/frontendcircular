import React, { useEffect, useState, useContext } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import { Facebook, X, Linkedin, Mail, Calendar, MessageCircle, Link as LinkIcon, Check, User, Layers } from 'lucide-react';
import { allContentData } from '../../data/mockContent';
import { AuthContext } from '../../context/AuthContext';
import { getAllNews, getNewsById } from '../../api/newsApi';
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
            image: (() => {
              const API_BASE = 'https://api-ecocircular.creativostecnologicosit.com';
              let rawUrl = (found.upload_file && found.upload_file.url) || found.image || '';
              // Backend bug: sometimes returns localhost instead of real domain
              if (rawUrl) {
                rawUrl = rawUrl
                  .replace('https://localhost', API_BASE)
                  .replace('http://localhost', API_BASE);
              }
              return rawUrl;
            })(),
            date: found.published_at || found.created_at || "",
            type: found.type === 'news' ? 'Noticias' : (found.type || 'Noticias'),
            topic: found.category_name || (found.category && typeof found.category === 'object' ? found.category.name : found.category) || "General",
            author: found.author || "",
            slug: found.slug || null,
            status: found.status || "",
          };

          // Normalizar espacios de no-ruptura que vienen de la API para permitir saltos de línea correctos
          if (mapped.body) {
            mapped.body = String(mapped.body).replace(/\u00A0|&nbsp;/g, ' ');
          }

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
    <>
      <div className="min-h-screen bg-white font-sans pb-20 animate-slide-up">

        {/* --- HEADER INFO (Above Image) --- */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          {/* Metadata: Type badge + date */}
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] bg-[#00AB6D] text-white">
              {content.type}
            </span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} /> {content.date}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1E305D] leading-[1.1] tracking-tight">
            {content.title}
          </h1>
        </div>

        {/* --- BANNER IMAGE --- */}
        {content.image && (
          <div className="w-full px-6 md:px-12 mb-12">
            <div className="max-w-7xl mx-auto bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm" style={{ minHeight: '400px', maxHeight: '700px' }}>
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-auto max-h-[700px] object-contain"
              />
            </div>
          </div>
        )}

        {/* --- MAIN CONTENT AREA --- */}
        <div className="max-w-7xl mx-auto px-6">
          {/* Author */}
          <div className="flex items-center gap-3 pb-8 mb-8 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <User size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Escritor</span>
              <span className="text-base font-bold text-gray-900">{content.author || 'Redacción Visión Circular'}</span>
            </div>
          </div>

          {/* Two-column layout: content + sidebar */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

            {/* ===== LEFT: Article ===== */}
            <div className="flex-1 min-w-0">
              <div className="news-content text-gray-700 leading-relaxed font-sans text-justify [&_*]:!text-justify">
                {content.body ? (
                  /[<>]/.test(content.body) ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: content.body }}
                      className="news-content ql-editor !p-0 !font-sans !text-gray-700 !text-lg !text-justify [&_*]:!text-justify"
                    />
                  ) : (
                    <div className="space-y-6">
                      {content.body
                        .split(/\r?\n\r?\n|\r?\n/)
                        .map(p => p.trim())
                        .filter(p => p.length > 0)
                        .map((paragraph, idx) => (
                          <p key={idx} className="text-lg text-justify !text-justify w-full">{paragraph}</p>
                        ))}
                    </div>
                  )
                ) : (
                  <p className="italic text-gray-400">No hay contenido adicional disponible.</p>
                )}
              </div>
            </div>

            {/* Right side: Sidebar (Sticky) */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-32 space-y-12">

                {/* Meta Details */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] pb-2 border-b border-gray-100">
                    Detalles
                  </h3>
                  <div className="space-y-6">
                    <SidebarItem
                      icon={Layers}
                      label="Tópico / Categoría"
                      value={content.topic}
                    />
                    <SidebarItem
                      icon={Check}
                      label="Tipo de contenido"
                      value={content.type}
                    />
                  </div>
                </div>

                {/* Social Sharing */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] pb-2 border-b border-gray-100">
                    Compartir
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <SocialButton icon={Facebook} color="#1877F2" url={facebookShareUrl} />
                    <SocialButton icon={X} color="#000000" url={xShareUrl} />
                    <SocialButton icon={Linkedin} color="#0A66C2" url={linkedinShareUrl} />
                    <SocialButton icon={MessageCircle} color="#25D366" url={whatsappShareUrl} />
                    <SocialButton icon={Mail} color="#444444" url={mailShareUrl} />

                    <button
                      onClick={copyToClipboard}
                      className={`
                        w-10 h-10 flex items-center justify-center
                        rounded-lg border
                        transition-all duration-200
                        ${copied ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"}
                      `}
                      title="Copiar enlace"
                    >
                      {copied ? <Check size={20} /> : <LinkIcon size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>{/* end two-col */}
        </div>{/* end info-below-banner */}

      </div>{/* end min-h-screen */}
    </>
  );
}

// Sub-componente Botón Social (Simplificado)
function SocialButton({ icon: Icon, url, color }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-10 h-10 flex items-center justify-center
        rounded-lg border border-gray-100
        text-gray-400
        transition-all duration-200 hover:border-gray-300 hover:scale-105
      "
      style={{ '--hover-color': color }}
      onMouseEnter={(e) => e.currentTarget.style.color = color}
      onMouseLeave={(e) => e.currentTarget.style.color = ''}
      title="Compartir en red social"
    >
      <Icon size={20} />
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
