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
} from "lucide-react";
import { getAllNews, deleteNews } from "../../../../../api/newsApi";
import NewsFormModal from "./NewsFormModal";
import NewsDetailModal from "./NewsDetailModal";

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
      setNews(newsArray);
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
      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
        isPublished 
          ? "bg-green-50 text-green-600 border-green-100" 
          : "bg-yellow-50 text-yellow-600 border-yellow-100"
      }`}>
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
    }); // Devuelve formato tipo: 22 de nov de 2025
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Noticias</h1>
          <p className="text-gray-500 mt-1">Administra el contenido de la plataforma</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm font-medium"
        >
          <Plus size={18} />
          Nueva Noticia
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, autor o contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white border focus:border-green-500 rounded-xl outline-none transition-all text-gray-700"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border-transparent hover:bg-gray-100 rounded-xl outline-none text-gray-700 cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* News Grid - CARD DESIGN START */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No se encontraron noticias</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start gap-3 mb-3">
                <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex-shrink-0">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm mb-5 line-clamp-2 flex-grow">
                {item.description || "Sin descripción disponible..."}
              </p>

              {/* Tags Row */}
              <div className="flex items-center gap-3 mb-5">
                {/* Type Badge (Blue Pill) */}
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                  {item.type === 'news' ? 'Noticia' : item.type || 'Evento'}
                </span>
                
                {/* Category Tag */}
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Tag size={14} className="stroke-2" />
                  <span className="text-sm font-medium">{item.category || "General"}</span>
                </div>
              </div>

              {/* Author & Date */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-gray-500">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium truncate">
                    {item.author || "Autor Desconocido"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formatDate(item.published_at)}
                  </span>
                </div>
              </div>

              {/* Actions Footer (Divider + Icons) */}
              <div className="pt-4 border-t border-gray-100 flex justify-end items-center gap-3 mt-auto">
                <button
                  onClick={() => handleView(item)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ver detalle"
                >
                  <Eye size={20} className="stroke-[1.5]" />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={20} className="stroke-[1.5]" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={20} className="stroke-[1.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-400">
        Mostrando {filteredNews.length} resultados
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

