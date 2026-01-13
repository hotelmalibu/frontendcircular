import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Calendar,
  MapPin,
  Video,
  Clock,
  Tag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getAllSchedules } from "../../api/scheduleApi";
import EventDetailModal from "./EventDetailModal";



// Configuración fija
const CARDS_PER_PAGE = 3;


export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFullAgenda, setShowFullAgenda] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // ← Nuevo estado

  const scrollContainerRef = useRef(null);

  const totalPages = Math.ceil(events.length / CARDS_PER_PAGE);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
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
        return dateA - dateB;
      });

      const publishedEvents = eventsArray.filter((event) => event.status === "published");
      setEvents(publishedEvents);
      setCurrentPage(0); // Resetear página al cargar
    } catch (err) {
      console.error("Error loading events:", err);
      setError("Error al cargar los eventos");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    const handleEventCreated = () => loadEvents();
    window.addEventListener("eventCreated", handleEventCreated);
    return () => window.removeEventListener("eventCreated", handleEventCreated);
  }, [loadEvents]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventTypeBadge = (type) => {
    const isRemote = type === "remote";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isRemote
          ? "text-blue-700 bg-blue-50 border border-blue-100"
          : "text-purple-700 bg-purple-50 border border-purple-100"
          }`}
      >
        {isRemote ? <Video size={10} /> : <MapPin size={10} />}
        {isRemote ? "Virtual" : "Presencial"}
      </span>
    );
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    if (startDate && new Date(startDate) > now)
      return { text: "Próximo", color: "text-blue-600 bg-blue-50" };
    if (endDate && new Date(endDate) < now)
      return { text: "Finalizado", color: "text-gray-500 bg-gray-100" };
    return { text: "En curso", color: "text-green-600 bg-green-50" };
  };

  const groupEventsByMonth = () => {
    const groups = {};
    events.forEach((event) => {
      const date = new Date(event.start_datetime);
      const key = date
        .toLocaleDateString("es-CO", { month: "long", year: "numeric" })
        .replace(/^\w/, (c) => c.toUpperCase());
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });
    return Object.entries(groups).sort(([a], [b]) => new Date(a) - new Date(b));
  };

  // Duplicamos para scroll infinito
  const duplicatedEvents = [...events, ...events];

  // Función para ir a una página específica
  const goToPage = (page) => {
    if (!scrollContainerRef.current) return;

    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 280 : 320;
    const gap = 24;
    const widthWithGap = cardWidth + gap;

    const targetScroll = page * widthWithGap * CARDS_PER_PAGE;
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
    setCurrentPage(page);
  };

  // Detectar scroll y actualizar currentPage (incluye animación y scroll manual)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      // Calculate dynamic width
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? 280 : 320;
      const gap = 24;
      const pageWidth = (cardWidth + gap) * CARDS_PER_PAGE;

      let newPage = Math.round(scrollLeft / pageWidth);

      // Porque el contenedor es duplicado, ajustamos el índice real
      if (newPage >= events.length / CARDS_PER_PAGE) {
        newPage = 0;
        // Reiniciamos suavemente al inicio para mantener el loop infinito
        container.scrollTo({ left: 0, behavior: "instant" });
      }

      setCurrentPage(newPage);
    };

    // Ejecutar al inicio
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [events.length]);

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
    <>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="text-green-600" size={24} /> Agenda de Eventos
              </h2>
              <p className="text-sm text-gray-500 mt-1">Actividades y encuentros del ecosistema</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <button onClick={loadEvents} className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline">
                Actualizar
              </button>
              {events.length > 3 && (
                <button onClick={() => setShowFullAgenda(true)} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                  Ver agenda completa
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* Carrusel */}
          {events.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
              <Calendar className="text-gray-300 mx-auto mb-3" size={40} />
              <p className="text-gray-500">No hay eventos programados por el momento.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Flechas */}
              <button
                onClick={() => goToPage(Math.max(0, currentPage - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition"
                disabled={totalPages <= 1}
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <button
                onClick={() => goToPage(Math.min(totalPages - 1, currentPage + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition"
                disabled={totalPages <= 1}
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>

              {/* Contenedor scrollable */}
              <div ref={scrollContainerRef} className="overflow-hidden">
                <div
                  className="flex gap-6"
                  style={{
                    animation: "scroll 80s linear infinite",
                  }}
                >
                  {duplicatedEvents.map((event, index) => {
                    const status = getEventStatus(event.start_datetime, event.end_datetime);
                    const startDay = new Date(event.start_datetime).getDate();
                    const startMonth = new Date(event.start_datetime).toLocaleDateString("es-CO", { month: "short" });

                    return (
                      <div
                        key={`${event.id}-${index}`}
                        onClick={() => handleEventClick(event)}
                        className="min-w-[280px] max-w-[280px] md:min-w-[320px] md:max-w-[320px] flex-shrink-0 bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 hover:border-green-300 transition-all duration-200 cursor-pointer relative overflow-hidden"
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 ${status.text === "En curso" ? "bg-green-500" :
                            status.text === "Próximo" ? "bg-blue-500" : "bg-gray-300"
                            }`}
                        ></div>

                        <div className="flex justify-between items-start gap-4 pl-2">
                          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-3 min-w-[60px] border border-gray-100">
                            <span className="text-xs font-bold text-gray-400 uppercase leading-none">{startMonth}</span>
                            <span className="text-2xl font-bold text-gray-800 leading-tight">{startDay}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${status.color}`}>
                                {status.text}
                              </span>
                              {getEventTypeBadge(event.event_type)}
                            </div>
                            <h3 className="text-base font-bold text-gray-800 leading-snug line-clamp-2 hover:text-green-700 transition-colors">
                              {event.title}
                            </h3>
                          </div>
                        </div>

                        <div className="mt-4 pl-2 space-y-3">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-gray-400" />
                              <span>{formatTime(event.start_datetime)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin size={14} className="text-gray-400" />
                              <span className="truncate">{event.location_name || "Virtual"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center pl-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                            <Tag size={12} /> {event.category || "General"}
                          </div>
                          <span className="text-xs font-semibold text-green-600 flex items-center gap-1 hover:underline">
                            Ver detalles <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Indicadores de paginación - ahora sí cambian */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i)}
                      className={`transition-all duration-300 rounded-full ${currentPage === i
                        ? "bg-green-600 w-10 h-2"
                        : "bg-gray-300 w-3 h-2 hover:bg-gray-400"
                        }`}
                      aria-label={`Ir a página ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modales */}
      {showDetailModal && selectedEvent && (
        <EventDetailModal
          eventData={selectedEvent}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {showFullAgenda && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Agenda Completa de Eventos</h3>
              <button onClick={() => setShowFullAgenda(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {groupEventsByMonth().length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay eventos programados.</p>
              ) : (
                groupEventsByMonth().map(([monthYear, monthEvents]) => (
                  <div key={monthYear} className="mb-10 last:mb-0">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-200 inline-block">
                      {monthYear}
                    </h4>
                    <div className="space-y-4">
                      {monthEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => {
                            handleEventClick(event);
                            setShowFullAgenda(false);
                          }}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-semibold text-gray-900">{event.title}</h5>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {new Date(event.start_datetime).toLocaleDateString("es-CO", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                  })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} /> {formatTime(event.start_datetime)}
                                </span>
                                <span className="flex items-center gap-1">
                                  {event.event_type === "remote" ? <Video size={14} /> : <MapPin size={14} />}
                                  {event.location_name || "Virtual"}
                                </span>
                              </div>
                            </div>
                            {getEventTypeBadge(event.event_type)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}