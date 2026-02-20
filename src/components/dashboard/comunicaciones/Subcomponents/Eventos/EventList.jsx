import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  MapPin,
  Users,
  Video,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Link as LinkIcon,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getAllSchedules, deleteSchedule } from "../../../../../api/scheduleApi";
import { getAllCategories } from "../../../../../api/categoriesApi";
import DOMPurify from 'dompurify';
import EventFormModal from "./EventFormModal";
import EventDetailModal from "./EventDetailModal";
import ConfirmModal from "../../../../../components/common/ConfirmModal";import { toast } from "react-hot-toast";

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

// Utility function to strip HTML tags and decode entities
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = DOMPurify.sanitize(String(html));
  return tmp.textContent || tmp.innerText || '';
};

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const loadEvents = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllSchedules(currentPage, pagination.per_page);

      let eventsArray = [];
      if (response?.data?.schedules && Array.isArray(response.data.schedules)) {
        eventsArray = response.data.schedules;
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else if (Array.isArray(response)) {
        eventsArray = response;
      } else if (response?.schedules && Array.isArray(response.schedules)) {
        eventsArray = response.schedules;
      }

      setEvents(eventsArray);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar los eventos");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pagination.per_page]);

  const loadCategories = React.useCallback(async () => {
    try {
      setCategoriesLoading(true);
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
      }
      setCategories(categoriesArray);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const filterEventsData = React.useCallback(() => {
    if (!Array.isArray(events)) {
      setFilteredEvents([]);
      return;
    }

    let filtered = [...events];
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category_id === filterCategory);
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.event_type === filterType);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filterCategory, filterStatus, filterType]);

  useEffect(() => {
    loadEvents();
  }, [currentPage, loadEvents]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    filterEventsData();
  }, [searchTerm, filterCategory, filterStatus, filterType, events, filterEventsData]);

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleEdit = (eventItem) => {
    setSelectedEvent(eventItem);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleView = (eventItem) => {
    setSelectedEvent(eventItem);
    setShowDetailModal(true);
  };

  const handleDelete = (eventItem) => {
    setItemToDelete(eventItem);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteSchedule(itemToDelete.id);
      toast.success("Evento eliminado correctamente");
      await loadEvents();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar el evento");
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    loadEvents();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // --- STYLE HELPERS ---

  const getStatusBadge = (status) => {
    const isPublished = status === 'published';
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
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

  const getEventTypeBadge = (type) => {
    const isRemote = type === 'remote';
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
        style={{
          backgroundColor: isRemote ? `${BRAND.blue}15` : `${BRAND.green}20`, // 15/20 hex alpha
          color: isRemote ? BRAND.blue : BRAND.darkGreen
        }}
      >
        {isRemote ? <Video size={12} /> : <MapPin size={12} />}
        <span>{isRemote ? "Virtual" : "Presencial"}</span>
      </div>
    );
  };

  const formatDateTime = (startDate, endDate, isAllDay) => {
    if (isAllDay) {
      return `Todo el día - ${new Date(startDate).toLocaleDateString("es-CO")}`;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const dateOptions = { day: "numeric", month: "short" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };

    return (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-700">
          {start.toLocaleDateString("es-CO", dateOptions)}
        </span>
        <span className="text-xs text-gray-500">
          {start.toLocaleTimeString("es-CO", timeOptions)} - {end.toLocaleTimeString("es-CO", timeOptions)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 mb-4" style={{ borderColor: BRAND.blue }}></div>
        <p className="text-gray-500 font-medium">Cargando agenda...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">

      {/* ESPACIADOR SUPERIOR */}
      <div className="w-full "></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: BRAND.darkBlue }}>Gestión de Eventos</h1>
          <p className="text-gray-500 mt-1">Agenda corporativa, talleres y conferencias</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-bold text-sm transform active:scale-95"
          style={{ backgroundColor: BRAND.blue }}
        >
          <Plus size={20} />
          Crear Evento
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 border border-gray-100 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, categoría o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-gray-700"
            style={{ "--tw-ring-color": BRAND.lightBlue }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative min-w-[180px]">
            <Tag size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm cursor-pointer appearance-none"
              style={{ "--tw-ring-color": BRAND.lightBlue }}
              disabled={categoriesLoading}
            >
              <option value="all">Categoría: Todas</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

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

          <div className="relative min-w-[180px]">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm cursor-pointer appearance-none"
              style={{ "--tw-ring-color": BRAND.lightBlue }}
            >
              <option value="all">Modalidad: Todas</option>
              <option value="in_person">Presencial</option>
              <option value="remote">Virtual</option>
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

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-50">
            <Calendar className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron eventos</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">No hay resultados para los filtros aplicados.</p>
          <button
            onClick={() => { setSearchTerm(""); setFilterStatus("all"); setFilterType("all") }}
            className="text-sm font-medium hover:underline"
            style={{ color: BRAND.blue }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 flex flex-col h-full relative"
            >
              {/* Borde Superior de Color */}
              <div
                className="h-1.5 w-full absolute top-0 left-0"
                style={{ backgroundColor: item.event_type === 'remote' ? BRAND.blue : BRAND.darkGreen }}
              ></div>

              <div className="p-5 flex-1 flex flex-col">
                {/* Header: Fecha y Badges */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center min-w-[50px]">
                    <span className="block text-xs font-bold text-gray-400 uppercase">
                      {new Date(item.start_datetime).toLocaleDateString("es-CO", { month: 'short' })}
                    </span>
                    <span className="block text-xl font-bold" style={{ color: BRAND.darkBlue }}>
                      {new Date(item.start_datetime).getDate()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* Título y Tipo */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-800 leading-tight line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>
                  {getEventTypeBadge(item.event_type)}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed break-words whitespace-normal">
                  {item.description ?
                    stripHtml(item.description).slice(0, 120) + (stripHtml(item.description).length > 120 ? '...' : '')
                    : "Sin descripción disponible."
                  }
                </p>

                {/* Detalles de Información */}
                <div className="space-y-3 mt-auto border-t border-gray-50 pt-3">

                  {/* Horario Detallado */}
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      {formatDateTime(item.start_datetime, item.end_datetime, item.is_all_day)}
                    </div>
                  </div>

                  {/* Ubicación / Enlace */}
                  {item.event_type === 'remote' && item.meeting_link ? (
                    <div className="flex items-center gap-3 text-sm text-gray-600 truncate">
                      <LinkIcon size={16} className="text-blue-400 flex-shrink-0" />
                      <span className="truncate text-blue-600 hover:underline cursor-pointer">Enlace de reunión</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-sm text-gray-600 truncate">
                      <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{item.location_name || "Por definir"}</span>
                    </div>
                  )}

                  {/* Asistentes */}
                  {item.requires_registration && (
                    <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                      <Users size={14} className="text-gray-400" />
                      <span>Requiere registro {item.max_attendees && `(Cupo: ${item.max_attendees})`}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Tag size={12} />
                  <span className="truncate max-w-[100px]">
                    {item.category_name || (() => {
                      const cat = item.category || item.topic;
                      if (!cat) return "General";
                      if (typeof cat === 'object') return cat.name || "General";
                      return cat;
                    })()}
                  </span>
                </div>

                <div className="flex gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => handleView(item)}
                    className="p-1 rounded-lg hover:bg-white hover:shadow-sm transition"
                    title="Ver detalle"
                    style={{ color: BRAND.blue }}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 rounded-lg hover:bg-white hover:shadow-sm transition"
                    title="Editar"
                    style={{ color: BRAND.darkGreen }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1 rounded-lg hover:bg-white hover:shadow-sm transition"
                    title="Eliminar"
                    style={{ color: BRAND.orange }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Mostrando <span className="font-bold">{filteredEvents.length}</span> de <span className="font-bold">{pagination.total}</span> eventos
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${page === currentPage
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 border border-transparent"
                    }`}
                  style={page === currentPage ? { backgroundColor: BRAND.blue } : {}}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.last_page}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showFormModal && (
        <EventFormModal
          eventData={selectedEvent}
          isEditing={isEditing}
          onClose={() => setShowFormModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showDetailModal && selectedEvent && (
        <EventDetailModal
          eventData={selectedEvent}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            setShowDetailModal(false);
            handleEdit(selectedEvent);
          }}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        title="Eliminar Evento"
        message={`¿Está seguro que desea eliminar el evento "${itemToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}