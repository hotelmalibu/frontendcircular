import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Filter,
  Newspaper
} from "lucide-react";
import { getAllNews, deleteNews } from "../../../../../api/newsApi";
import DOMPurify from 'dompurify';
import NewsFormModal from "./NewsFormModal";
import NewsDetailModal from "./NewsDetailModal";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja (Alertas)
  yellow: "#E8AD00",     // Amarillo
  gray: "#6B7280",
};

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    filterNewsData();
  }, [searchTerm, filterType, filterStatus, news]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllNews();
      
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
        if (possibleArrays.length > 0) {
          newsArray = possibleArrays[0];
        }
      }

      // Fetch detailed info only for recent items to optimize
      const detailedNews = await Promise.all(
        newsArray.map(async (newsItem) => {
          try {
            const daysSinceCreation = newsItem.created_at 
              ? (new Date() - new Date(newsItem.created_at)) / (1000 * 60 * 60 * 24)
              : 999;
            
            if (daysSinceCreation < 30) {
              const { getNewsById } = await import("../../../../../api/newsApi");
              const detailedResponse = await getNewsById(newsItem.id);
              const detailedNews = detailedResponse.data?.news || detailedResponse.news || detailedResponse;
              return detailedNews;
            } else {
              return newsItem;
            }
          } catch (error) {
            console.warn(`Failed to get detailed news for ID ${newsItem.id}:`, error);
            return newsItem;
          }
        })
      );

      setNews(detailedNews);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar las noticias");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNewsData = () => {
    if (!Array.isArray(news)) {
      setFilteredNews([]);
      return;
    }
    
    let filtered = [...news];
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    setFilteredNews(filtered);
  };

  const handleCreate = () => {
    setSelectedNews(null);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleEdit = (newsItem) => {
    setSelectedNews(newsItem);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleView = (newsItem) => {
    setSelectedNews(newsItem);
    setShowDetailModal(true);
  };

  const handleDelete = async (newsId) => {
    if (!window.confirm("¿Está seguro de eliminar esta noticia?")) {
      return;
    }

    try {
      await deleteNews(newsId);
      await loadNews();

    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar la noticia");
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    loadNews();
  };

  // --- STYLES HELPERS ---

  const getStatusBadge = (status) => {
    const isPublished = status === 'published';
    return (
      <div 
        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border"
        style={{
          backgroundColor: isPublished ? '#F0FDF4' : '#FFFBEB',
          color: isPublished ? BRAND.darkGreen : BRAND.yellow,
          borderColor: isPublished ? 'transparent' : 'transparent'
        }}
      >
        {isPublished ? <CheckCircle size={12} /> : <Clock size={12} />}
        <span>{isPublished ? "Publicado" : "Borrador"}</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }); 
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 mb-4" style={{ borderColor: BRAND.blue }}></div>
        <p className="text-gray-500 font-medium">Cargando noticias...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">
      
      {/* ESPACIADOR SUPERIOR */}
      <div className="w-full"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: BRAND.darkBlue }}>Gestión de Noticias</h1>
          <p className="text-gray-500 mt-1">Administra el contenido y novedades de la plataforma</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-bold text-sm transform active:scale-95"
          style={{ backgroundColor: BRAND.blue }}
        >
          <Plus size={20} />
          Nueva Noticia
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 border border-gray-100 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, autor o contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-gray-700"
            style={{ "--tw-ring-color": BRAND.lightBlue }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative min-w-[180px]">
             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
             <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm cursor-pointer appearance-none"
                style={{ "--tw-ring-color": BRAND.lightBlue }}
             >
                <option value="all">Estado: Todos</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
             </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} style={{ color: BRAND.orange }} />
          <span>{error}</span>
        </div>
      )}

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-50">
            <Newspaper className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron noticias</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Intenta ajustar los filtros de búsqueda o crea una nueva noticia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Borde Superior de Acento */}
              <div 
                className="h-1.5 w-full absolute top-0 left-0" 
                style={{ backgroundColor: item.type === 'news' ? BRAND.blue : BRAND.darkGreen }}
              ></div>

              <div className="p-5 flex-1 flex flex-col">
                {/* Header: Fecha y Estado */}
                <div className="flex justify-between items-start mb-3">
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                        {item.category || "General"}
                      </span>
                      <h3 className="text-lg font-bold text-gray-800 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h3>
                   </div>
                </div>

                {/* Badge de Estado (Flotante o integrado) */}
                <div className="mb-4">
                   {getStatusBadge(item.status)}
                </div>

                {/* Imagen Destacada */}
                <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 h-40 bg-gray-50 flex items-center justify-center relative group-hover:shadow-inner transition-all">
                   {item.upload_file && item.upload_file.url ? (
                      <img 
                        src={item.upload_file.url} 
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                   ) : (
                       <div className="flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon size={32} className="mb-2 opacity-50" />
                          <span className="text-xs">Sin imagen</span>
                       </div>
                   )}
                   {/* Fallback div */}
                   <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      <span className="text-xs">Imagen no disponible</span>
                   </div>
                </div>

                {/* Descripción Corta */}
                <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed flex-grow">
                  {item.description ? (
                    DOMPurify.sanitize(String(item.description)).replace(/<[^>]+>/g, '').slice(0, 150) + (item.description.length > 150 ? '...' : '')
                  ) : (
                    "Sin descripción disponible..."
                  )}
                </p>

                {/* Metadata Footer */}
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3 mt-auto">
                   <div className="flex items-center gap-1.5">
                      <User size={12} />
                      <span className="truncate max-w-[80px]">{item.author || "Admin"}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>{formatDate(item.published_at)}</span>
                   </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end items-center gap-1">
                <button
                  onClick={() => handleView(item)}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition"
                  title="Ver detalle"
                  style={{ color: BRAND.blue }}
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition"
                  title="Editar"
                  style={{ color: BRAND.darkGreen }}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition"
                  title="Eliminar"
                  style={{ color: BRAND.orange }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-200 pt-6">
        Mostrando <span className="font-bold text-gray-600">{filteredNews.length}</span> noticias
      </div>

      {/* Modals */}
      {showFormModal && (
        <NewsFormModal
          newsData={selectedNews}
          isEditing={isEditing}
          onClose={() => setShowFormModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showDetailModal && selectedNews && (
        <NewsDetailModal
          newsData={selectedNews}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            setShowDetailModal(false);
            handleEdit(selectedNews);
          }}
        />
      )}
    </div>
  );
}