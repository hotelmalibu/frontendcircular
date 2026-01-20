import React, { useState, useEffect, useMemo } from "react";
import { Search, ArrowRight, FileText, X } from "lucide-react";
import { contentTypeConfig } from "../../../../data/mockContent";
import { getPublishedNewsWithImages } from "../../../../api/newsApi";
import { getDocuments } from "../../../../api/documentsApi";
import { getAllProjects } from "../../../../api/projectsApi";
import { stripHtml } from "../../../../utils/textUtils";
import { getImageProxyUrl } from "../../../../utils/imageUtils.js";

export default function InformesAnuales() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfVisible, setPdfVisible] = useState(null); // URL or null

  // Load data logic similar to FeaturedSection
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [newsResponse, documentsResponse, projectsResponse] = await Promise.all([
          getPublishedNewsWithImages(),
          getDocuments(),
          getAllProjects()
        ]);

        if (!mounted) return;

        // --- Process News ---
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

        const mappedNews = newsArray.map(n => {
          const rawType = n.type || n.category || "";
          let finalType = "Noticias";

          // Logic key: identify if it belongs to "Documentos de interés"
          if (rawType.toLowerCase().includes("doc") || rawType.toLowerCase().includes("interés")) {
            finalType = "Documentos de interés";
          }
          // We can also include "Gestión documental" if desired, as per FeaturedSection logic
          else if (rawType.toLowerCase().includes("gesti") || rawType.toLowerCase().includes("gestion")) {
            finalType = "Gestión documental";
          }

          let imageUrl = "";
          if (n.upload_file && n.upload_file.url) {
            imageUrl = n.upload_file.url;
          } else if (n.image) {
            imageUrl = n.image;
          } else if (n.thumbnail) {
            imageUrl = n.thumbnail;
          } else if (n.cover) {
            imageUrl = n.cover;
          }

          return {
            id: n.id || n._id || n.uid || Math.random(),
            type: finalType,
            topic: n.category_name || (n.category && typeof n.category === 'object' ? n.category.name : n.category) || "General",
            title: n.title || n.name || "Sin título",
            excerpt: stripHtml(n.description || n.excerpt),
            image: getImageProxyUrl(imageUrl, { width: 600, quality: 80 }),
            date: n.published_at || n.publishedAt ? new Date(n.published_at || n.publishedAt).toLocaleDateString() : "",
            slug: n.slug || (`noticia-${n.id || n._id || ''}`),
            status: n.status || "",
            source: 'news'
          };
        });

        // --- Process Documents ---
        let documentsArray = [];
        if (documentsResponse?.data?.items && Array.isArray(documentsResponse.data.items)) {
          documentsArray = documentsResponse.data.items;
        } else if (Array.isArray(documentsResponse?.data)) {
          documentsArray = documentsResponse.data;
        } else if (Array.isArray(documentsResponse)) {
          documentsArray = documentsResponse;
        }

        const mappedDocuments = documentsArray.map(doc => {
          const category = "Documentos de interés";

          return {
            id: `doc-${doc.id}`,
            type: category,
            topic: doc.category_name || (doc.category && typeof doc.category === 'object' ? doc.category.name : doc.category) || "Documento",
            title: doc.name,
            excerpt: doc.description,
            image: "", // Documents usually don't have covers
            date: new Date(doc.created_at).toLocaleDateString(),
            slug: `documento-${doc.id}`,
            status: doc.status,
            source: 'document',
            documentData: doc
          };
        });

        // --- Process Projects ---
        let projectsArray = [];
        if (projectsResponse?.items && Array.isArray(projectsResponse.items)) {
          projectsArray = projectsResponse.items;
        } else if (Array.isArray(projectsResponse)) {
          projectsArray = projectsResponse;
        } else if (projectsResponse?.data?.items && Array.isArray(projectsResponse.data.items)) {
          projectsArray = projectsResponse.data.items;
        } else if (projectsResponse?.projects && Array.isArray(projectsResponse.projects)) {
          projectsArray = projectsResponse.projects;
        } else if (typeof projectsResponse === 'object' && projectsResponse !== null) {
          const possibleArrays = Object.values(projectsResponse).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            projectsArray = possibleArrays[0];
          }
        }

        const mappedProjects = projectsArray
          .filter(p => p && (p.upload_file || p.file)) // Only projects with files
          .map(p => {
            return {
              id: `project-${p.id}`,
              type: "Documentos de interés", // Categorize as documents for consistency
              topic: p.category_name || "Proyecto",
              title: p.title || "Proyecto sin título",
              excerpt: stripHtml(p.description),
              image: getImageProxyUrl(p.cover_image?.url || p.cover_image_url || p.cover_image || "", { width: 600, quality: 80 }),
              date: new Date(p.created_at).toLocaleDateString(),
              slug: p.id,
              status: p.status,
              source: 'project',
              projectData: p
            };
          });

        // Filter ONLY "Documentos de interés" from all sources
        const combined = [...mappedNews, ...mappedDocuments, ...mappedProjects];
        const onlyDocsOfInterest = combined.filter(item => {
          return item.type === "Documentos de interés" || item.type === "Gestión documental";
        });

        if (mounted) setItems(onlyDocsOfInterest);

      } catch (err) {
        console.error("Error cargando documentos para Informes Anuales:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false };
  }, []);


  // --- Filtering Logic ---
  const filteredResults = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase();
      // Search by title or excerpt (description)
      return (
        item.title?.toLowerCase().includes(q) ||
        item.excerpt?.toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery]);

  const openPdf = (url) => {
    if (url) setPdfVisible(url);
  };

  const closePdf = () => setPdfVisible(null);

  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION (Reused style from ExplorePage) --- */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-[#0D1B2A]">
        {/* Background Overlay/Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop")`, // Placeholder generic office/doc image if needed, or re-use existing
            filter: "brightness(0.4)"
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10 mt-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 fontfamily-montserrat tracking-tight drop-shadow-lg">
              Informes Anuales y Documentos
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              Accede a nuestra biblioteca de informes de gestión, balances y documentación de interés público.
            </p>

            <div className="relative group max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Buscar documento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-16 py-4 rounded-full text-gray-900 text-base shadow-xl focus:outline-none focus:ring-4 focus:ring-[#00AB6D]/50 transition-all placeholder-gray-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#00AB6D] text-white rounded-full hover:bg-[#008F5B] transition-colors shadow-md">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- RESULTS GRID --- */}
      <div className="container mx-auto px-4 md:px-8 py-16">

        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Documentos Disponibles</h2>
          <div className="text-sm text-gray-500 font-medium">
            {filteredResults.length} documentos encontrados
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredResults.map((item) => (
              <MinimalistCard key={item.id} item={item} onOpenPdf={openPdf} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="mb-4 text-gray-300 flex justify-center">
              <FileText size={64} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron documentos</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda.</p>
          </div>
        )}
      </div>

      {/* --- PDF Viewer Modal --- */}
      {pdfVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col relative animate-in fade-in zoom-in duration-300">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-[#1E305D] flex items-center gap-2">
                <FileText size={20} className="text-[#00AB6D]" />
                Visualizador de Documentos
              </h3>
              <button
                onClick={closePdf}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-red-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content (Iframe) */}
            <div className="flex-1 overflow-hidden bg-gray-50 relative">
              <iframe
                src={pdfVisible}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- Sub-component: MinimalistCard (Adapted from ExplorePage logic) ---
function MinimalistCard({ item, onOpenPdf }) {
  const config = contentTypeConfig[item.type] || contentTypeConfig["Documentos de interés"] || {};
  const Icon = config.icon || FileText;

  const handleItemClick = (e) => {
    // If it's a raw document with a specific file path
    if (item.source === 'document' && item.documentData) {
      e.preventDefault();
      const fileUrl = `https://api-ecocircular.creativostecnologicosit.com/storage/${item.documentData.upload_file.path}`;
      onOpenPdf(fileUrl);
    }
    // If it's a project with a specific file path or object
    else if (item.source === 'project' && (item.projectData?.upload_file || item.projectData?.file)) {
      e.preventDefault();
      const fileData = item.projectData.upload_file || item.projectData.file;
      const filePath = typeof fileData === 'object' ? fileData.path : fileData;
      const fileUrl = `https://api-ecocircular.creativostecnologicosit.com/storage/${filePath}`;
      onOpenPdf(fileUrl);
    }
  };

  const getHref = () => {
    const hasFile = item.projectData?.upload_file || item.projectData?.file;
    if (item.source === 'document' || (item.source === 'project' && hasFile)) {
      return "#";
    }
    if (item.source === 'project') {
      return window.location.origin + `/proyectos/${item.slug}`;
    }
    return window.location.origin + `/contenido/${item.slug}`;
  };

  return (
    <a
      href={getHref()}
      onClick={(e) => {
        const hasFile = item.projectData?.upload_file || item.projectData?.file;
        if (item.source === 'document' || (item.source === 'project' && hasFile)) {
          handleItemClick(e);
        }
      }}
      target="_self"
      rel="noopener noreferrer"
      className={`group h-full flex flex-col ${(item.source === 'document' || (item.source === 'project' && (item.projectData?.upload_file || item.projectData?.file))) ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`rounded-xl overflow-hidden mb-5 aspect-[16/10] relative shadow-sm transition-transform duration-500 group-hover:-translate-y-1 ${config.isSolid ? config.bgColor : "bg-gray-100"
          }`}
      >
        {config.isSolid ? (
          <div className="w-full h-full flex items-center justify-center relative p-6">
            <Icon
              strokeWidth={1}
              size={110}
              className="absolute -right-6 -bottom-6 text-white opacity-10 rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
            />
            <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center text-white backdrop-blur-sm z-10">
              <Icon size={32} />
            </div>
          </div>
        ) : item.image ? (
          <>
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative p-6 bg-gray-50">
            <Icon
              strokeWidth={1}
              size={110}
              className="absolute text-gray-200 opacity-80 rotate-6 transition-transform duration-700"
            />
            <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 z-10 bg-white">
              <Icon size={28} />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-3 text-gray-400">
          <span className={config.isSolid ? "text-gray-500" : config.color}>
            {item.type}
          </span>
          <span className="text-gray-300">/</span>
          <span>{item.topic}</span>
        </div>

        <h3 className="text-lg font-bold text-[#1E305D] leading-snug mb-3 group-hover:text-[#00AB6D] transition-colors line-clamp-2">
          {item.title}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed flex-1">
          {item.excerpt || "Sin descripción disponible."}
        </p>

        {/* Action hint */}
        <div className="mt-4 flex items-center text-[#00AB6D] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
          {(item.source === 'document' || (item.source === 'project' && (item.projectData?.upload_file || item.projectData?.file))) ? 'Ver Documento' : 'Leer más'} <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </a>
  );
}