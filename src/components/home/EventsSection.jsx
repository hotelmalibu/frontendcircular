import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Calendar,
  MapPin,
  Video,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getAllSchedules } from "../../api/scheduleApi";
import EventDetailModal from "./EventDetailModal";



// Configuración fija
// Configuración
const AUTO_SLIDE_INTERVAL = 3000;

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFullAgenda, setShowFullAgenda] = useState(false);
  
  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isHovering, setIsHovering] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Responsive: Determine items per slide
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCards(1);      // Mobile
      else if (width < 1024) setVisibleCards(2); // Tablet
      else if (width < 1280) setVisibleCards(3); // Desktop
      else setVisibleCards(4);                   // Large Desktop
    };
    
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch events logic (same as before)
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllSchedules(1, 50);
      let eventsArray = [];
      if (response?.data?.schedules && Array.isArray(response.data.schedules)) eventsArray = response.data.schedules;
      else if (Array.isArray(response)) eventsArray = response;
      else if (response?.schedules && Array.isArray(response.schedules)) eventsArray = response.schedules;

      eventsArray.sort((a, b) => new Date(a.start_datetime || 0) - new Date(b.start_datetime || 0));
      const published = eventsArray.filter((e) => e.status === "published");
      setEvents(published);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Error loading events:", err);
      setError("Error al cargar los eventos");
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

  // Auto-slide logic
  useEffect(() => {
    if (loading || events.length === 0 || isHovering) return;
    
    const maxIndex = Math.max(0, events.length - visibleCards);
    if (maxIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [events.length, visibleCards, isHovering, loading]);

  const nextSlide = () => {
    const maxIndex = Math.max(0, events.length - visibleCards);
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, events.length - visibleCards);
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchEndX.current - touchStartX.current > 50) prevSlide();
  };

  // Helpers (same as before)
  const handleEventClick = (event) => { setSelectedEvent(event); setShowDetailModal(true); };
  const formatTime = (d) => d ? new Date(d).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }) : "";
  
  const getEventTypeBadge = (type) => {
    const isRemote = type === "remote";
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isRemote ? "text-blue-700 bg-blue-50 border border-blue-100" : "text-purple-700 bg-purple-50 border border-purple-100"}`}>
        {isRemote ? <Video size={10} /> : <MapPin size={10} />}
        {isRemote ? "Virtual" : "Presencial"}
      </span>
    );
  };

  const getEventStatus = (start, end) => {
    const now = new Date();
    if (start && new Date(start) > now) return { text: "Próximo", color: "text-blue-600 bg-blue-50" };
    if (end && new Date(end) < now) return { text: "Finalizado", color: "text-gray-500 bg-gray-100" };
    return { text: "En curso", color: "text-green-600 bg-green-50" };
  };

  const groupEventsByMonth = () => {
    const groups = {};
    events.forEach((event) => {
      const date = new Date(event.start_datetime);
      const key = date.toLocaleDateString("es-CO", { month: "long", year: "numeric" }).replace(/^\w/, (c) => c.toUpperCase());
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });
    return Object.entries(groups).sort(([a], [b]) => new Date(a) - new Date(b));
  };

  // Loading Skeleton
  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <div className="space-y-2 w-full md:w-auto">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-6 overflow-hidden pb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse h-[200px]">
                <div className="flex gap-4 mb-4">
                  <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pt-2 pb-16 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-200 pb-4 gap-4">
            <div className="w-full md:w-auto">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2"><Calendar className="text-green-600 shrink-0" size={28} /> Agenda de</span>
                <span>Eventos</span>
              </h2>
              <p className="text-gray-500 mt-2 text-sm md:text-base max-w-lg leading-relaxed">
                Actividades y encuentros del ecosistema
              </p>
            </div>
            
            <div className="flex flex-row items-center justify-between w-full md:w-auto gap-4">
               {/* Controls */}
               <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentIndex === 0 || events.length <= visibleCards}
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    type="button"
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentIndex >= events.length - visibleCards || events.length <= visibleCards}
                    aria-label="Siguiente"
                  >
                     <ChevronRight size={20} />
                  </button>
               </div>

               {events.length > 4 && (
                <button type="button" onClick={() => setShowFullAgenda(true)} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                  Ver agenda completa <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">{error}</div>}

          {events.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <Calendar className="text-gray-300 mx-auto mb-4" size={48} />
              <p className="text-gray-500 text-lg">No hay eventos programados por el momento.</p>
            </div>
          ) : (
            <div 
              className="relative group" 
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              
              {/* Carrusel Container */}
              <div className="overflow-hidden p-2 -m-2"> {/* Negative margin for shadow/border visibility */}
                <div 
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
                >
                  {events.map((event, index) => {
                     const status = getEventStatus(event.start_datetime, event.end_datetime);
                     const startDay = new Date(event.start_datetime).getDate();
                     const startMonth = new Date(event.start_datetime).toLocaleDateString("es-CO", { month: "short" }).replace('.', ''); // Remove dot if present
                     
                     return (
                      <div 
                        key={event.id}
                        className="flex-shrink-0 px-2"
                        style={{ width: `${100 / visibleCards}%` }}
                      >
                        <div
                          onClick={() => handleEventClick(event)}
                          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg border border-gray-100 hover:border-green-200 transition-all duration-200 cursor-pointer h-full relative overflow-hidden group/card flex flex-col"
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${status.text === "En curso" ? "bg-green-500" : status.text === "Próximo" ? "bg-blue-500" : "bg-gray-300"}`}></div>

                          <div className="flex justify-between items-start gap-3 mb-3 pl-2">
                             <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2 min-w-[60px] border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">{startMonth}</span>
                                <span className="text-2xl font-black text-gray-800 leading-none">{startDay}</span>
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${status.color}`}>
                                    {status.text}
                                  </span>
                                  {getEventTypeBadge(event.event_type)}
                                </div>
                                <h3 className="text-base font-bold text-gray-800 leading-tight line-clamp-2 group-hover/card:text-green-700 transition-colors">
                                  {event.title}
                                </h3>
                             </div>
                          </div>

                          <div className="pl-2 space-y-2 mt-auto">
                             <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock size={14} className="text-gray-400" />
                                <span>{formatTime(event.start_datetime)}</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs text-gray-500">
                                <MapPin size={14} className="text-gray-400" />
                                <span className="truncate">{event.location_name || "Virtual"}</span>
                             </div>
                          </div>
                        </div>
                      </div>
                     );
                  })}
                </div>
              </div>

              {/* Pagination Dots */}
              {events.length > visibleCards && (
                <div className="flex justify-center gap-1.5 mt-6">
                  {Array.from({ length: events.length - visibleCards + 1 }).map((_, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? "w-6 bg-green-500" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Ir a slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modales (se mantienen igual) */}
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
          {/* Full Agenda Modal Content (Same as before) */}
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900">Agenda Completa</h3>
              <button type="button" aria-label="Cerrar agenda" onClick={() => setShowFullAgenda(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
               {groupEventsByMonth().map(([month, monthEvents]) => (
                  <div key={month} className="mb-8 last:mb-0">
                     <h4 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-green-500 pl-3 sticky top-0 bg-white z-10 py-2">{month}</h4>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {monthEvents.map(evt => {
                           const status = getEventStatus(evt.start_datetime, evt.end_datetime);
                           return (
                             <div key={evt.id} onClick={() => {handleEventClick(evt); setShowFullAgenda(false)}} className="bg-white border border-gray-100 p-4 rounded-xl hover:shadow-md hover:border-green-300 cursor-pointer transition flex flex-col h-full relative overflow-hidden group/mini">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${status.text === "En curso" ? "bg-green-500" : status.text === "Próximo" ? "bg-blue-500" : "bg-gray-300"}`}></div>
                                
                                <div className="pl-2 mb-2">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase">{new Date(evt.start_datetime).toLocaleDateString("es-CO", { weekday: 'short', day: 'numeric' })}</span>
                                    {getEventTypeBadge(evt.event_type)}
                                  </div>
                                  <h5 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover/mini:text-green-700 transition-colors">{evt.title}</h5>
                                </div>
                                
                                <div className="mt-auto pl-2 pt-2 border-t border-gray-50 text-xs text-gray-500 flex justify-between items-center">
                                   <span className="flex items-center gap-1"><Clock size={12}/> {formatTime(evt.start_datetime)}</span>
                                   <ArrowRight size={14} className="text-gray-300 group-hover/mini:text-green-500 transition-colors"/>
                                </div>
                             </div>
                           );
                        })}
                     </div>
                  </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}