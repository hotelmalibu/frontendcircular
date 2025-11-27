import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import { contentTypeConfig } from "../../data/mockContent"; 
import DOMPurify from 'dompurify';
import { getPublishedNewsWithImages } from "../../api/newsApi";

export default function FeaturedSection() {
  const [newsItems, setNewsItems] = useState([]);
  const [activeTab, setActiveTab] = useState("Todos");

  const categories = [
    "Todos", 
    "Noticias", 
    "Documentos de interés", 
    "Gestión documental"
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // Use the new API that combines list and detail endpoints
        const response = await getPublishedNewsWithImages();
        if (!mounted) return;

        // The response should already be an array of published news with upload_file data
        let newsArray = [];
        if (Array.isArray(response)) {
          newsArray = response;
        } else if (response?.data?.news && Array.isArray(response.data.news)) {
          newsArray = response.data.news;
        } else if (response?.data && Array.isArray(response.data)) {
          newsArray = response.data;
        } else if (response?.news && Array.isArray(response.news)) {
          newsArray = response.news;
        } else if (typeof response === 'object' && response !== null) {
          const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) newsArray = possibleArrays[0];
        }

        // --- 3. Mapeo y Normalización ---
        const mapped = newsArray.map(n => {
            // Obtenemos el tipo crudo de la API
            const rawType = n.type || n.category || ""; 
            
            // LÓGICA DE ASIGNACIÓN:
            // Dependiendo de cómo vengan tus datos, asignamos la categoría exacta del Tab.
            let finalType = "Noticias"; // Valor por defecto

            // Si la API dice "document", "file", "interes", lo mandamos a Documentos
            if (rawType.toLowerCase().includes("doc") || rawType.toLowerCase().includes("interés")) {
                finalType = "Documentos de interés";
            } 
            // Si la API dice "gestion", "management", lo mandamos a Gestión
            else if (rawType.toLowerCase().includes("gesti") || rawType.toLowerCase().includes("gestion")) {
                finalType = "Gestión documental";
            }
            // Si no, se queda como "Noticias"

            // Handle image data - use direct URL from JSON
            let imageUrl = "";
            
            if (n.upload_file && n.upload_file.url) {
                imageUrl = n.upload_file.url;
                console.log(`News ${n.id} has image:`, imageUrl);
            } else if (n.image) {
                imageUrl = n.image;
            } else if (n.thumbnail) {
                imageUrl = n.thumbnail;
            } else if (n.cover) {
                imageUrl = n.cover;
            }

            return {
                id: n.id || n._id || n.uid || Math.random(),
                type: finalType, // Usamos el tipo normalizado
                topic: n.category || n.topic || "General",
                title: n.title || n.name || "Sin título",
                excerpt: (n.description || n.excerpt || "") ? DOMPurify.sanitize(String(n.description || n.excerpt || "")).replace(/<[^>]+>/g, '') : "",
                image: imageUrl,
                date: n.published_at || n.publishedAt ? new Date(n.published_at || n.publishedAt).toLocaleDateString() : "",
                slug: n.slug || (`noticia-${n.id || n._id || ''}`),
                status: n.status || ""
            };
        });

        setNewsItems(mapped);
      } catch (err) {
        console.error("Error cargando noticias con imágenes:", err);
      }
    };

    load();
    return () => { mounted = false };
  }, []);

  // Filtro
  const filteredItems = newsItems.filter(item => {
    if (activeTab === "Todos") return true;
    return item.type === activeTab; // Ahora coincidirán exactamente
  });

  return (
    <section className="py-20 bg-white border-t border-gray-100">
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
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredItems.map((item) => {
              const config = contentTypeConfig[item.type] || contentTypeConfig["Noticias"] || {};
              const Icon = config.icon;

              return (
                <a 
                    key={item.id}
                    href={window.location.origin + `/contenido/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full flex flex-col"
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

                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed flex-1">
                      {item.excerpt}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500 font-medium">No se encontró contenido en la categoría "{activeTab}".</p>
            <button onClick={() => setActiveTab("Todos")} className="mt-2 text-sm text-[#00AB6D] underline">
                Ver todo el contenido
            </button>
          </div>
        )}

        {/* CORS Information */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2 text-amber-800">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Nota sobre CORS e Imágenes</h4>
              <p className="text-sm mt-1">
                Las imágenes se están cargando directamente desde el servidor API. Si experimenta problemas de carga, 
                puede deberse a restricciones CORS del navegador.
              </p>
              <p className="text-sm mt-2 text-amber-700">
                <strong>Solución Backend:</strong> Configure los headers CORS en su servidor de imágenes 
                (<code>api-ecocircular.creativostecnologicosit.com</code>) para permitir solicitudes desde este dominio.
              </p>
              <p className="text-xs mt-2 text-amber-600">
                Headers recomendados: <code>Access-Control-Allow-Origin: https://your-domain.com</code>
              </p>
            </div>
          </div>
        </div>
        
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