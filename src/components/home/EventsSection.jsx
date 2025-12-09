import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Video, Clock, Tag, Users, ArrowRight, LayoutGrid, List } from "lucide-react";
import { getAllSchedules } from "../../api/scheduleApi";
import EventDetailModal from "./EventDetailModal";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal
  darkGreen: "#8CB200",  // Verde Secundario
  gray: "#6B7280",
};

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    loadEvents();
    const handleEventCreated = () => { refreshEvents(); };
    window.addEventListener('eventCreated', handleEventCreated);
    return () => { window.removeEventListener('eventCreated', handleEventCreated); };
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const timestamp = Date.now();
      const response = await getAllSchedules(1, 12);
      
      let eventsArray = [];
      if (response?.data?.schedules && Array.isArray(response.data.schedules)) {
        eventsArray = response.data.schedules;
      } else if (Array.isArray(response)) {
        eventsArray = response;
      } else if (response?.schedules && Array.isArray(response.schedules)) {
        eventsArray = response.schedules;
      }

      eventsArray.sort((a, b) => {
        const dateA = new Date(a.start_datetime || a.created_at || 0);
        const dateB = new Date(b.start_datetime || b.created_at || 0);
        return dateB - dateA;
      });

      const publishedEvents = eventsArray.filter(event => event.status === 'published');
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

  const refreshEvents = () => { loadEvents(); };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  };

  const getEventTypeBadge = (type) => {
    const isRemote = type === 'remote';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
        isRemote ? "text-blue-700 bg-blue-50 border border-blue-100" : "text-purple-700 bg-purple-50 border border-purple-100"
      }`}>
        {isRemote ? <Video size={10} /> : <MapPin size={10} />}
        {isRemote ? "Virtual" : "Presencial"}
      </span>
    );
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    if (startDate && new Date(startDate) > now) return { text: "Próximo", color: "text-blue-600 bg-blue-50" };
    if (endDate && new Date(endDate) < now) return { text: "Finalizado", color: "text-gray-500 bg-gray-100" };
    return { text: "En curso", color: "text-green-600 bg-green-50" };
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
           <p className="text-gray-500 text-sm">Cargando agenda...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Compacto */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="text-green-600" size={24} /> Agenda de Eventos
            </h2>
            <p className="text-sm text-gray-500 mt-1">Actividades y encuentros del ecosistema</p>
          </div>
          <button onClick={refreshEvents} className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline mt-2 md:mt-0">
            Actualizar lista
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Grid de Eventos Compacto */}
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <Calendar className="text-gray-300 mx-auto mb-3" size={40} />
            <p className="text-gray-500">No hay eventos programados por el momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => {
              const status = getEventStatus(event.start_datetime, event.end_datetime);
              const startDay = new Date(event.start_datetime).getDate();
              const startMonth = new Date(event.start_datetime).toLocaleDateString("es-CO", { month: 'short' });

              return (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100 hover:border-green-300 transition-all duration-200 cursor-pointer flex flex-col h-full relative overflow-hidden"
                >
                  {/* Borde izquierdo de estado */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${status.text === 'En curso' ? 'bg-green-500' : (status.text === 'Próximo' ? 'bg-blue-500' : 'bg-gray-300')}`}></div>

                  <div className="flex justify-between items-start gap-3 pl-2">
                    {/* Fecha destacada */}
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2 min-w-[50px] border border-gray-100">
                       <span className="text-xs font-bold text-gray-400 uppercase leading-none">{startMonth}</span>
                       <span className="text-xl font-bold text-gray-800 leading-tight">{startDay}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${status.color}`}>
                            {status.text}
                          </span>
                          {getEventTypeBadge(event.event_type)}
                       </div>
                       <h3 className="text-base font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                         {event.title}
                       </h3>
                    </div>
                  </div>

                  <div className="mt-3 pl-2 space-y-2">
                     <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                           <Clock size={14} className="text-gray-400"/>
                           <span>{formatTime(event.start_datetime)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                           <MapPin size={14} className="text-gray-400"/>
                           <span className="truncate max-w-[120px]">{event.location_name || "Virtual"}</span>
                        </div>
                     </div>
                     
                    
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center pl-2">
                     <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                        <Tag size={12}/> {event.category || "General"}
                     </div>
                     <span className="text-xs font-semibold text-green-600 flex items-center gap-1 group-hover:underline">
                        Ver detalles <ArrowRight size={12} />
                     </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showDetailModal && selectedEvent && (
        <EventDetailModal
          eventData={selectedEvent}
          onClose={() => { setShowDetailModal(false); setSelectedEvent(null); }}
        />
      )}
    </section>
  );
}