import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { contentTypeConfig } from "../../data/mockContent";
import { getPublishedNewsWithImages } from "../../api/newsApi";
import { getDocuments } from "../../api/documentsApi";
import { stripHtml } from "../../utils/textUtils";

export default function FeaturedSection() {
  const [newsItems, setNewsItems] = useState([]);
  const [activeTab, setActiveTab] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  const categories = [
    "Todos",
    "Noticias",
    "Documentos de interés"
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // Fetch both news and documents
        const [newsResponse, documentsResponse] = await Promise.all([
          getPublishedNewsWithImages(),
          getDocuments()
        ]);

        if (!mounted) return;

        // Process news
        let newsArray = [];
        if (Array.isArray(newsResponse)) {
          newsArray = newsResponse;
        } else if (newsResponse?.data?.news && Array.isArray(newsResponse.data.news)) {
          newsArray = newsResponse.data.news;
        } else if (newsResponse?.data && Array.isArray(newsResponse.data)) {
          newsArray = newsResponse.data;
        } else if (newsResponse?.news && Array.isArray(newsResponse.news)) {
          newsArray = newsResponse.news;
        } else if (typeof newsResponse === 'object' && newsResponse !== null) {
          const possibleArrays = Object.values(newsResponse).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) newsArray = possibleArrays[0];
        }

        // Process documents
        let documentsArray = [];
        if (documentsResponse?.data?.items && Array.isArray(documentsResponse.data.items)) {
          documentsArray = documentsResponse.data.items;
        } else if (Array.isArray(documentsResponse?.data)) {
          documentsArray = documentsResponse.data;
        } else if (Array.isArray(documentsResponse)) {
          documentsArray = documentsResponse;
        }

        // Map news items
        const mappedNews = newsArray
          .filter(n => (n.status || "").toLowerCase() === "published")
          .map(n => {
            const rawType = n.type || n.category || "";
            let finalType = "Noticias";

            if (rawType.toLowerCase().includes("doc") || rawType.toLowerCase().includes("interés")) {
              finalType = "Documentos de interés";
            }
            else if (rawType.toLowerCase().includes("gesti") || rawType.toLowerCase().includes("gestion")) {
              finalType = "Gestión documental";
            }

            let imageUrl = "";
            const API_BASE = 'https://api-ecocircular.creativostecnologicosit.com';
            const fixUrl = (url) => url
              ? url.replace('https://localhost', API_BASE).replace('http://localhost', API_BASE)
              : url;

            if (n.upload_file && n.upload_file.url) {
              imageUrl = fixUrl(n.upload_file.url);
            } else if (n.image) {
              imageUrl = fixUrl(n.image);
            } else if (n.thumbnail) {
              imageUrl = fixUrl(n.thumbnail);
            } else if (n.cover) {
              imageUrl = fixUrl(n.cover);
            }

            return {
              id: n.id || n._id || n.uid || Math.random(),
              type: finalType,
              topic: n.category_name ||
                (n.category && typeof n.category === 'object' ? n.category.name : n.category) ||
                "Sin categoría asignada",
              title: n.title || n.name || "Sin título",
              excerpt: stripHtml(n.description || n.excerpt),
              image: imageUrl,
              date: n.published_at || n.publishedAt ? new Date(n.published_at || n.publishedAt).toLocaleDateString() : "",
              slug: n.slug || (`noticia-${n.id || n._id || ''}`),
              status: n.status || "",
              source: 'news'
            };
          });

        const mappedDocuments = documentsArray
          .filter(doc => (doc.status || "").toLowerCase() === "approved")
          .map(doc => {
            // All documents go to "Documentos de interés"
            const category = "Documentos de interés";

            return {
              id: `doc-${doc.id}`,
              type: category,
              topic: doc.category_name || (doc.category && typeof doc.category === 'object' ? doc.category.name : doc.category) || "Documento",
              title: doc.name,
              excerpt: doc.description,
              image: "", // Documents don't have images
              date: new Date(doc.created_at).toLocaleDateString(),
              slug: `documento-${doc.id}`,
              status: doc.status,
              source: 'document',
              documentData: doc // Keep original document data for actions
            };
          });

        // Combine and set items
        const allItems = [...mappedNews, ...mappedDocuments];
        setNewsItems(allItems);

      } catch (err) {
        console.error("Error cargando contenido:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false };
  }, []);

  // Filtro
  const filteredItems = newsItems.filter(item => {
    if (activeTab === "Todos") return true;
    return item.type === activeTab;
  });

  // Reset pagination on tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section id="featured-section" className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-2 border-b border-gray-200">
          <div className="w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E305D] mb-2 fontfamily-montserrat">
              Actualidad y Destacados
            </h2>
            <p className="text-gray-600 max-w-2xl mb-4">
              Mantente al día con nuestras últimas noticias, accede a documentos clave y consulta recursos de gestión.
            </p>

            {/* TABS DE FILTRO */}
            <div className="flex flex-wrap items-center gap-6 mt-4">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`
                    pb-2 text-sm font-bold transition-all duration-300 border-b-2 
                    ${activeTab === cat
                      ? "text-[#00AB6D] border-[#00AB6D]"
                      : "text-gray-400 border-transparent hover:text-[#1E305D]"
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/explorar"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-[#1E305D] hover:text-[#00AB6D] transition-colors mb-3 shrink-0"
          >
            Ver más
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
                {/* Skeleton Imagen */}
                <div className="bg-gray-200 aspect-[16/10] w-full"></div>

                {/* Skeleton Contenido */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Categoría */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>

                  {/* Título */}
                  <div className="space-y-2 mb-4">
                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {currentItems.map((item) => {
              const config = contentTypeConfig[item.type] || contentTypeConfig["Noticias"] || {};
              const Icon = config.icon;

              const handleItemClick = () => {
                if (item.source === 'document' && item.documentData) {
                  const fileUrl = `https://api-ecocircular.creativostecnologicosit.com/storage/${item.documentData.upload_file.path}`;
                  window.open(fileUrl, '_blank');
                }
              };

              return (
                <Link
                  key={item.id}
                  to={item.source === 'document' ? "#" : `/contenido/${item.slug}`}
                  onClick={(e) => {
                    if (item.source === 'document' && item.documentData) {
                      e.preventDefault();
                      handleItemClick();
                    }
                  }}
                  className={`group h-full flex flex-col ${item.source === 'document' ? 'cursor-pointer' : ''}`}
                >
                  {/* Imagen / Icono */}
                  <div className={`rounded-xl overflow-hidden mb-5 aspect-[16/10] relative shadow-sm transition-transform duration-500 group-hover:-translate-y-2 ${config.isSolid ? config.bgColor : 'bg-gray-100'}`}>

                    {config.isSolid ? (
                      <div className="w-full h-full flex items-center justify-center relative p-6">
                        {Icon && <Icon strokeWidth={1} size={110} className="absolute -right-6 -bottom-6 text-white opacity-10 rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />}
                        <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center text-white backdrop-blur-sm z-10">
                          {Icon && <Icon size={32} />}
                        </div>
                      </div>
                    ) : (
                      item.image ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              console.log("Error loading image:", item.image);
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center relative p-6 bg-gray-50">
                          {Icon && <Icon strokeWidth={1} size={110} className="absolute text-gray-200 opacity-80 rotate-6 transition-transform duration-700" />}
                          <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 z-10 bg-white">
                            {Icon && <Icon size={28} />}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Textos */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-3 text-gray-400">
                      <span className={config.isSolid ? "text-gray-500" : config.color}>{item.type}</span>
                      <span className="text-gray-300">/</span>
                      <span>{item.topic}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1E305D] leading-snug mb-3 group-hover:text-[#00AB6D] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500 font-medium">No se encontró contenido en la categoría "{activeTab}".</p>
            <button type="button" onClick={() => setActiveTab("Todos")} className="mt-2 text-sm text-[#00AB6D] underline">
              Ver todo el contenido
            </button>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-3">
            <button
              type="button"
              aria-label="Página anterior"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-3 rounded-full border-2 transition-all ${currentPage === 1
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-[#00AB6D] text-[#00AB6D] hover:bg-[#00AB6D] hover:text-white"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  type="button"
                  key={i}
                  aria-label={`Página ${i + 1}`}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: document.getElementById('featured-section')?.offsetTop - 100, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${currentPage === i + 1
                    ? "bg-[#1E305D] text-white shadow-lg"
                    : "text-gray-400 hover:text-[#1E305D] hover:bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label="Página siguiente"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full border-2 transition-all ${currentPage === totalPages
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-[#00AB6D] text-[#00AB6D] hover:bg-[#00AB6D] hover:text-white"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}



        {/* Móvil */}
        <div className="mt-12 md:hidden text-center">
          <Link to="/explorar" className="inline-flex items-center gap-2 text-sm font-bold text-[#00AB6D] px-6 py-3 border border-[#00AB6D] rounded-full hover:bg-[#00AB6D] hover:text-white transition-all">
            Ver más <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}