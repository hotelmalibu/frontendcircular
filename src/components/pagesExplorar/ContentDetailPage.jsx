import React, { useEffect, useState, useContext } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import { Facebook, X, Linkedin, Mail, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { allContentData, contentTypeConfig } from '../../data/mockContent'; 
import { AuthContext } from '../../context/AuthContext';
import { getAllNews, getNewsById } from '../../api/newsApi';

export default function ContentDetailPage() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const searchKeys = { slug, idFromSlug };
        console.debug('ContentDetailPage: searching newsArray with keys', searchKeys);

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
          // If the found content is not published, only allow displaying it for authenticated users (dashboard/editor).
          if (String(found.status).toLowerCase() !== 'published' && !isAuthenticated) {
            setContent(null);
            setLoading(false);
            return;
          }
          // Normalize API object into the shape expected by the detail page
          const mapped = {
            id: found.id || found._id || found.uid,
            title: found.title || found.name || "Sin título",
            excerpt: found.excerpt || (found.description ? (String(found.description).slice(0, 250) + (String(found.description).length > 250 ? '...' : '')) : ""),
            body: found.description || found.content || found.body || "",
            image: found.image || found.thumbnail || found.cover || "",
            date: found.published_at || found.publishedAt || found.created_at || found.createdAt || "",
            type: found.type ? (found.type === 'news' ? 'Noticias' : found.type) : 'Noticias',
            topic: found.category || found.topic || "General",
            author: found.author || found.by || "",
            slug: found.slug || null,
            status: found.status || "",
          };

          // Sanitize body HTML to avoid XSS (server-side whitelist is recommended too)
          if (mapped.body) {
            try {
              mapped.body = DOMPurify.sanitize(String(mapped.body));
            } catch (e) {
              // If DOMPurify is not available or sanitization fails, leave body as-is
            }
          }

          // Format date to match mock format (simple localized string)
          if (mapped.date) {
            try {
              mapped.date = new Date(mapped.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
            } catch (e) {
              // leave as-is if invalid
            }
          }

          setContent(mapped);
        } else if (mounted) {
          setContent(null);
        }
      } catch (err) {
        console.error('Error fetching news for content detail:', err);
        if (mounted) setContent(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    findContent();
    return () => { mounted = false };
  }, [slug]);
  
  // Si aún no cargó el contenido, mostrar loader o mensaje
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Contenido no encontrado</h2>
        <Link to="/explorar" className="text-[#00AB6D] hover:underline font-semibold">
          ← Volver a explorar
        </Link>
      </div>
    );
  }

  const config = contentTypeConfig[content.type] || {};
  const Icon = config.icon || (() => null);

  // --- CÁLCULO DE URLS DE COMPARTIR (IMPLEMENTACIÓN NUEVA) ---
  const currentUrl = window.location.href;
  const rawTitle = content?.title || '';
  
  // Codificamos los valores para que sean seguros en una URL
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(rawTitle);
  const encodedTextAndUrl = encodeURIComponent(`${rawTitle} ${currentUrl}`); // Para LinkedIn y Mail

  // Definimos las URLs finales
  // 1. Facebook: Solo permite URL. No permite pre-rellenar texto.
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  
  // 2. X (Twitter): Permite URL y Texto.
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  
  // 3. LinkedIn: Usamos el endpoint 'feed' con 'text' para simular el comportamiento de X.
  const linkedinShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedTextAndUrl}`;
  
  // 4. Mail
  const mailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedTextAndUrl}`;


  return (
    <div className="min-h-screen bg-white fontfamily-montserrat">
      
      {/* --- HERO HEADER --- */}
      <div className={`relative w-full h-[70vh] md:h-[80vh] flex items-end overflow-hidden ${config.isSolid ? config.bgColor : 'bg-gray-900'}`}>

        {/* FONDO: Imagen o Color Sólido */}
        {config.isSolid ? (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
             <Icon size={400} strokeWidth={0.5} className="text-white opacity-10 absolute -right-20 -bottom-20 rotate-12" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        ) : (
          <>
            {content.image ? (
              <>
                <img 
                  src={content.image} 
                  alt={content.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E305D]/90 via-[#1E305D]/40 to-transparent"></div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#1E305D] to-[#16324a]">
                <Icon size={160} strokeWidth={1} className="text-white/20" />
              </div>
            )}
          </>
        )}

        {/* TÍTULO Y DATOS EN HERO */}
        <div className="container mx-auto px-4 md:px-8 relative z-10 pb-16 md:pb-20">
          <div className="max-w-4xl">
            <Link to="/explorar" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors">
              <ArrowLeft size={16} /> Volver a explorar
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/20 text-white backdrop-blur-sm border border-white/20`}>
                {content.type}
              </span>
              <span className="text-white/80 text-sm font-medium flex items-center gap-1">
                <Calendar size={14} /> {content.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-sm">
              {content.title}
            </h1>
          </div>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 py-16">
          
          {/* COLUMNA IZQUIERDA (Social Share Sticky) */}
          <div className="lg:w-24 flex-shrink-0">
             <div className="sticky top-32 flex lg:flex-col gap-4 items-center lg:items-start">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:block mb-2">
                  Compartir
                </span>

                <SocialButton
                  icon={Facebook}
                  color="#1877F2"
                  url={facebookShareUrl}
                />

                <SocialButton
                  icon={X}
                  color="#000000"
                  url={xShareUrl}
                />

                <SocialButton
                  icon={Linkedin}
                  color="#0A66C2"
                  url={linkedinShareUrl}
                />

                <SocialButton
                  icon={Mail}
                  color="#444444"
                  url={mailShareUrl}
                />


                {/* Móvil: Etiqueta compartir */}
                <div className="lg:hidden flex items-center gap-2 text-gray-400 text-sm font-bold ml-auto">
                    <Share2 size={16} /> Compartir
                </div>
             </div>
          </div>

          {/* COLUMNA DERECHA (Texto del Artículo) */}
          <div className="flex-1 max-w-3xl">

            {/* Cuerpo del texto: usar `content.body` o `content.description` */}
            <div className="prose prose-lg prose-headings:text-[#1E305D] prose-a:text-[#00AB6D] text-gray-600">
              {content.body ? (
                // Si el body contiene HTML, renderizar como HTML; si es texto plano, dividir en párrafos
                /<[a-z][\s\S]*>/i.test(content.body) ? (
                  <div dangerouslySetInnerHTML={{ __html: content.body }} />
                ) : (
                  content.body.split(/\n\s*\n/).map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                )
              ) : (
                <p>{content.excerpt || 'No hay contenido disponible.'}</p>
              )}
            </div>

            {/* Footer del artículo: Tema */}
            <div className="mt-16 pt-8 border-t border-gray-100">
               <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-4">Temática relacionada:</span>
               <Link to="/explorar" className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-600 hover:bg-[#00AB6D] hover:text-white transition-colors">
                  {content.topic}
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-componente Botón Social (ESTÁTICO)
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
      "
      // Aquí aplicamos el color fijo directamente al estilo
      style={{ color: color }}
    >
      <Icon size={26} strokeWidth={2} />
    </a>
  );
}