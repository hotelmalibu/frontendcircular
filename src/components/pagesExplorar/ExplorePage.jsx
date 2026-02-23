// UBICACIÓN: src/pages/ExplorePage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, FilterX } from "lucide-react";
// Asegúrate que la ruta a mockContent sea correcta según tu estructura
import { contentTypeConfig } from "../../data/mockContent";
import { getAllNews } from "../../api/newsApi";
import { getAllCategories } from "../../api/categoriesApi";
import { stripHtml } from "../../utils/textUtils";
import { getImageProxyUrl } from "../../utils/imageUtils.js";
import explorarHeroImage from "../../assets/explorar-hero.jpg";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [newsItems, setNewsItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // Only use news from API (remove mock data)
  const newsData = useMemo(() => {
    // Map news items to the expected shape
    return (newsItems || [])
      .filter((n) => String(n.status).toLowerCase() === "published")
      .map((n) => {
        // Resolve category name from various possible fields
        let catName = "General";
        if (n.category && typeof n.category === "object" && n.category.name) {
          catName = n.category.name;
        } else if (typeof n.category === "string") {
          catName = n.category;
        } else if (n.category_name) {
          catName = n.category_name;
        } else if (n.category_id) {
          const foundCat = categories.find(
            (c) => c.id === n.category_id || c.id === Number(n.category_id)
          );
          if (foundCat) catName = foundCat.name;
        }

        const API_BASE = 'https://api-ecocircular.creativostecnologicosit.com';
        const fixUrl = (url) => url
          ? url.replace('https://localhost', API_BASE).replace('http://localhost', API_BASE)
          : url;

        return {
          id: n.id || n._id || Math.random(),
          type: "Noticias",
          category: catName,
          title: n.title || n.name || "Sin título",
          excerpt: stripHtml(n.description || n.excerpt),
          image: fixUrl(
            (n.upload_file && n.upload_file.url) ||
            n.image ||
            n.thumbnail ||
            n.cover ||
            ""
          ),
          date: n.published_at
            ? new Date(n.published_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
            : "",
          slug: n.slug || `noticia-${n.id || n._id || ""}`,
        };
      });
  }, [newsItems, categories]);

  const allCategories = useMemo(
    () => categories.map((cat) => cat.name),
    [categories]
  );

  const filteredResults = useMemo(() => {
    return newsData.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title?.toLowerCase().includes(q) ||
        item.excerpt?.toLowerCase().includes(q);
      const matchesCategory = selectedCategory
        ? item.category === selectedCategory
        : true;
      const matchesType = selectedType ? item.type === selectedType : true;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [newsData, searchQuery, selectedCategory, selectedType]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedType("");
  };

  // Load news and categories from API on mount
  useEffect(() => {
    let mounted = true;

    const loadNews = async () => {
      try {
        setLoadingNews(true);
        const response = await getAllNews();

        // Normalize response similar to dashboard component
        let newsArray = [];
        if (Array.isArray(response)) {
          newsArray = response;
        } else if (response?.data?.news && Array.isArray(response.data.news)) {
          newsArray = response.data.news;
        } else if (response?.data && Array.isArray(response.data)) {
          newsArray = response.data;
        } else if (response?.news && Array.isArray(response.news)) {
          newsArray = response.news;
        } else if (typeof response === "object" && response !== null) {
          const possibleArrays = Object.values(response).filter((val) =>
            Array.isArray(val)
          );
          if (possibleArrays.length > 0) newsArray = possibleArrays[0];
        }

        if (mounted) setNewsItems(newsArray);
      } catch (err) {
        console.error("Error loading news for ExplorePage:", err);
      } finally {
        if (mounted) setLoadingNews(false);
      }
    };

    const loadCategories = async () => {
      try {
        const response = await getAllCategories();

        let categoriesArray = [];
        if (response?.data?.items && Array.isArray(response.data.items)) {
          categoriesArray = response.data.items;
        } else if (Array.isArray(response)) {
          categoriesArray = response;
        } else if (response?.data && Array.isArray(response.data)) {
          categoriesArray = response.data;
        } else if (response?.categories && Array.isArray(response.categories)) {
          categoriesArray = response.categories;
        } else {
          categoriesArray = response ? [response] : [];
        }

        if (mounted) setCategories(categoriesArray);
      } catch (err) {
        console.error("Error loading categories for ExplorePage:", err);
      } finally {
        // loadingCategories setter removed
      }
    };

    loadNews();
    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white ">
      {/* --- HERO SECTION (IMAGEN DE FONDO COMPLETA) --- */}

      <div className="relative w-full h-[70vh] md:h-[82vh] flex items-center justify-center overflow-hidden bg-[#0D1B2A]">
        {/* Imagen de fondo  */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url(${explorarHeroImage})`,
          }}
        ></div>

        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/90 via-[#0D1B2A]/70 to-[#0D1B2A]/50"></div>

        {/* Contenido del Hero (Texto y Buscador) */}
        <div className="container mx-auto px-4 relative z-10 mt-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 fontfamily-montserrat tracking-tight drop-shadow-lg">
              Explora la economía circular
            </h1>

            <div className="relative group max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Buscar artículos, documentos, noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-16 py-5 rounded-lg text-gray-900 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#00AB6D]/50 transition-all placeholder-gray-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#00AB6D] text-white rounded-md hover:bg-[#008F5B] transition-colors shadow-md">
                <Search size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- FILTROS Y RESULTADOS (Contenedor centrado) --- */}
      <div className="container mx-auto px-4 md:px-8 py-10">
        {/* Barra de Filtros Minimalista */}
        <div className="flex flex-wrap items-center gap-6 mb-12 border-b border-gray-100 pb-8">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Filtrar resultados:
          </span>

          <FilterDropdown
            label="Categoría"
            options={allCategories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />

          {(selectedCategory || selectedType || searchQuery) && (
            <button
              onClick={clearFilters}
              className="text-red-500 text-sm font-semibold hover:bg-red-50 px-3 py-2 rounded-lg transition-colors ml-auto md:ml-0 flex items-center gap-2"
            >
              <FilterX size={16} /> Borrar filtros
            </button>
          )}

          <div className="ml-auto text-sm text-gray-500 font-medium hidden lg:block">
            {filteredResults.length} publicaciones encontradas
          </div>
        </div>

        {/* Grid de Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredResults.map((item) => (
            <MinimalistCard key={item.id} item={item} />
          ))}
        </div>

        {!loadingNews && filteredResults.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-2xl mt-8 border border-gray-100">
            <div className="mb-4 text-gray-300 flex justify-center">
              <Search size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No encontramos coincidencias
            </h3>
            <p className="text-gray-500">
              Intenta ajustar los términos de búsqueda o limpiar los filtros.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 text-[#00AB6D] font-bold hover:underline"
            >
              Ver todo el contenido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-componentes (Dropdown y Card) ---
// Componente Dropdown para filtros
function FilterDropdown({ label, options, selected, onChange }) {
  return (
    <div className="relative inline-block">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:border-[#00AB6D] hover:text-[#00AB6D] focus:outline-none focus:border-[#00AB6D] cursor-pointer min-w-[160px] transition-colors shadow-sm"
      >
        <option value="">{label} (Todos)</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
    </div>
  );
}

function MinimalistCard({ item }) {
  const config = contentTypeConfig[item.type] || {};
  const Icon = config.icon;

  return (
    <a
      href={window.location.origin + `/contenido/${item.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group h-full flex flex-col"
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
          <span>{item.category}</span>
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
}
