import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
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

  // Load news on component mount
  useEffect(() => {
    loadNews();
  }, []);

  // Filter news when search or filters change
  useEffect(() => {
    filterNewsData();
  }, [searchTerm, filterType, filterStatus, news]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllNews();
      
      // Debug: Log the response to see its structure
      console.log("API Response:", response);
      console.log("Response type:", typeof response);
      console.log("Is Array:", Array.isArray(response));
      
      // Handle different response formats
      let newsArray = [];
      if (Array.isArray(response)) {
        newsArray = response;
      } else if (response?.data?.news && Array.isArray(response.data.news)) {
        // API format: { data: { news: [...] } }
        newsArray = response.data.news;
      } else if (response?.data && Array.isArray(response.data)) {
        // Alternative format: { data: [...] }
        newsArray = response.data;
      } else if (response?.news && Array.isArray(response.news)) {
        newsArray = response.news;
      } else if (typeof response === 'object' && response !== null) {
        // If response is an object, try to find an array property
        const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          newsArray = possibleArrays[0];
        }
      }
      
      console.log("Processed news array:", newsArray);
      console.log("News count:", newsArray.length);
      
      setNews(newsArray);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar las noticias");
      console.error("Error loading news:", err);
      setNews([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filterNewsData = () => {
    // Ensure news is always an array before filtering
    if (!Array.isArray(news)) {
      setFilteredNews([]);
      return;
    }
    
    let filtered = [...news];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    // Status filter
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
      alert("Noticia eliminada exitosamente");
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar la noticia");
      console.error("Error deleting news:", err);
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    loadNews();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle size={14} />,
        label: "Publicado",
      },
      draft: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock size={14} />,
        label: "Borrador",
      },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      news: { color: "bg-blue-100 text-blue-800", label: "Noticia" },
    };

    const config = typeConfig[type] || typeConfig.news;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando noticias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Gestión de Noticias
        </h1>
        <p className="text-gray-600">
          Administra las noticias y eventos de la plataforma
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto">


            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Nueva Noticia
          </button>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No se encontraron noticias</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Publicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNews.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {item.description?.substring(0, 60)}
                        {item.description?.length > 60 ? "..." : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(item.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Tag size={14} />
                        {item.category || "Sin categoría"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User size={14} />
                        {item.author || "Anónimo"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        {formatDate(item.published_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredNews.length} de {news.length} noticias
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
