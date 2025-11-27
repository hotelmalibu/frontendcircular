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
} from "lucide-react";
import { getAllSchedules, deleteSchedule } from "../../../../../api/scheduleApi";
import EventFormModal from "./EventFormModal";
import EventDetailModal from "./EventDetailModal";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });

  useEffect(() => {
    loadEvents();
  }, [currentPage]);

  useEffect(() => {
    filterEventsData();
  }, [searchTerm, filterCategory, filterStatus, filterType, events]);

  const loadEvents = async () => {
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
  };

  const filterEventsData = () => {
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
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.event_type === filterType);
    }

    setFilteredEvents(filtered);
  };

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

  const handleDelete = async (eventId) => {
    if (!window.confirm("¿Está seguro de eliminar este evento?")) {
      return;
    }

    try {
      await deleteSchedule(eventId);
      await loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar el evento");
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

  const getEventTypeBadge = (type) => {
    const isRemote = type === 'remote';
    return (
      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
        isRemote 
          ? "bg-blue-50 text-blue-600" 
          : "bg-purple-50 text-purple-600"
      }`}>
        {isRemote ? <Video size={12} /> : <MapPin size={12} />}
        <span>{isRemote ? "Remoto" : "Presencial"}</span>
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (startDate, endDate, isAllDay) => {
    if (isAllDay) {
      return `Todo el día - ${formatDate(startDate)}`;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startFormatted = start.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    const endFormatted = end.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    return `${startFormatted} - ${endFormatted}`;
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Eventos</h1>
          <p className="text-gray-500 mt-1">Administra los eventos y conferencias de la plataforma</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm font-medium"
        >
          <Plus size={18} />
          Nuevo Evento
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, categoría o ubicación..."
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
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border-transparent hover:bg-gray-100 rounded-xl outline-none text-gray-700 cursor-pointer"
          >
            <option value="all">Todos los tipos</option>
            <option value="in_person">Presencial</option>
            <option value="remote">Remoto</option>
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

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No se encontraron eventos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start gap-3 mb-3">
                <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 flex-1">
                  {item.title}
                </h3>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Event Type Badge */}
              <div className="mb-3">
                {getEventTypeBadge(item.event_type)}
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm mb-5 line-clamp-2 flex-grow leading-relaxed">
                {item.description ? 
                  item.description.replace(/<[^>]+>/g, '').slice(0, 150) + (item.description.length > 150 ? '...' : '')
                  : "Sin descripción disponible..."
                }
              </p>

              {/* Event Details */}
              <div className="space-y-2 mb-5">
                {/* Date & Time */}
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {formatDateTime(item.start_datetime, item.end_datetime, item.is_all_day)}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {item.location_name || "Ubicación no especificada"}
                  </span>
                </div>

                {/* Meeting Link (for remote events) */}
                {item.event_type === 'remote' && item.meeting_link && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <LinkIcon size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">
                      Enlace de reunión disponible
                    </span>
                  </div>
                )}

                {/* Registration Info */}
                {item.requires_registration && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Requiere registro
                      {item.max_attendees && ` (máx. ${item.max_attendees} asistentes)`}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags Row */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Tag size={14} className="stroke-2" />
                  <span className="text-sm font-medium">{item.category || "General"}</span>
                </div>
                {item.timezone && (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Globe size={14} className="stroke-2" />
                    <span className="text-sm font-medium">{item.timezone}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
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

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg ${
                  page === currentPage
                    ? "bg-green-600 text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.last_page}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-400">
        Mostrando {filteredEvents.length} de {pagination.total} eventos
      </div>

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
    </div>
  );
}