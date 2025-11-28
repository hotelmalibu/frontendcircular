import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Video, Clock, Tag, Users, ArrowRight } from "lucide-react";
import { getAllSchedules } from "../../api/scheduleApi";
import EventDetailModal from "./EventDetailModal";

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    loadEvents();
    
    // Add event listener for when new events are created
    const handleEventCreated = () => {
      refreshEvents(); // Reload events when a new one is created
    };
    
    window.addEventListener('eventCreated', handleEventCreated);
    
    return () => {
      window.removeEventListener('eventCreated', handleEventCreated);
    };
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timestamp to avoid caching issues
      const timestamp = Date.now();
      const response = await getAllSchedules(1, 12); // Get more events to ensure we have recent ones
      
      let eventsArray = [];
      if (response?.data?.schedules && Array.isArray(response.data.schedules)) {
        eventsArray = response.data.schedules;
      } else if (Array.isArray(response)) {
        eventsArray = response;
      } else if (response?.schedules && Array.isArray(response.schedules)) {
        eventsArray = response.schedules;
      }

      // Sort events by start date (most recent first)
      eventsArray.sort((a, b) => {
        const dateA = new Date(a.start_datetime || a.created_at || 0);
        const dateB = new Date(b.start_datetime || b.created_at || 0);
        return dateB - dateA;
      });

      // Filter only published events
      const publishedEvents = eventsArray.filter(event => event.status === 'published');
      
      console.log(`Loaded ${publishedEvents.length} published events`);
      setEvents(publishedEvents);
      setLastRefresh(timestamp);
    } catch (err) {
      console.error('Error loading events:', err);
      setError("Error al cargar los eventos");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = () => {
    loadEvents();
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
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

  const getEventTypeBadge = (type) => {
    const isRemote = type === 'remote';
    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
        isRemote 
          ? "bg-blue-100 text-blue-700" 
          : "bg-purple-100 text-purple-700"
      }`}>
        {isRemote ? <Video size={12} /> : <MapPin size={12} />}
        <span>{isRemote ? "Remoto" : "Presencial"}</span>
      </div>
    );
  };

  const isEventUpcoming = (startDate) => {
    if (!startDate) return false;
    return new Date(startDate) > new Date();
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    
    if (startDate && new Date(startDate) > now) {
      return { text: "Próximo", color: "bg-blue-100 text-blue-700" };
    }
    
    if (endDate && new Date(endDate) < now) {
      return { text: "Finalizado", color: "bg-gray-100 text-gray-700" };
    }
    
    return { text: "En curso", color: "bg-green-100 text-green-700" };
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Próximos Eventos
            </h2>
            <button
              onClick={refreshEvents}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Actualizar eventos"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestros eventos, conferencias y actividades. Mantente al día con las últimas novedades de nuestro ecosistema.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center gap-3 text-red-700">
            <span>{error}</span>
          </div>
        )}

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No hay eventos disponibles
            </h3>
            <p className="text-gray-500">
              No se encontraron eventos publicados en este momento.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const status = getEventStatus(event.start_datetime, event.end_datetime);
                return (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-green-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  >
                    {/* Event Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        <Clock size={12} />
                        <span>{status.text}</span>
                      </div>
                      {getEventTypeBadge(event.event_type)}
                    </div>

                    {/* Event Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {event.title}
                    </h3>

                    {/* Event Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {event.description ? 
                        event.description.replace(/<[^>]+>/g, '').slice(0, 120) + (event.description.length > 120 ? '...' : '')
                        : "Sin descripción disponible..."
                      }
                    </p>

                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      {/* Date & Time */}
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                          {formatDateTime(event.start_datetime, event.end_datetime, event.is_all_day)}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-gray-500">
                        {event.event_type === 'remote' ? 
                          <Video size={16} className="text-blue-500 flex-shrink-0" /> :
                          <MapPin size={16} className="text-purple-500 flex-shrink-0" />
                        }
                        <span className="text-sm text-gray-600 truncate">
                          {event.location_name || (event.event_type === 'remote' ? "Evento remoto" : "Ubicación por definir")}
                        </span>
                      </div>

                      {/* Registration Info */}
                      {event.requires_registration && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Users size={16} className="text-orange-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            Requiere registro
                            {event.max_attendees && ` (máx. ${event.max_attendees})`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          {event.category || "General"}
                        </span>
                      </div>
                      
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <EventDetailModal
          eventData={selectedEvent}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </section>
  );
}