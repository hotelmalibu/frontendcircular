import React from "react";
import DOMPurify from 'dompurify';
import {
  X,
  Calendar,
  MapPin,
  Video,
  Globe,
  Users,
  Link as LinkIcon,
  Tag,
  Clock,
  CheckCircle,
  FileText,
  ArrowRight,
  Info
} from "lucide-react";

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

export default function EventDetailModal({ eventData, onClose }) {
  
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventTypeConfig = (type) => {
    if (type === 'remote') {
      return {
        label: "Virtual",
        icon: <Video size={18} />,
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-100"
      };
    }
    return {
      label: "Presencial",
      icon: <MapPin size={18} />,
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-100"
    };
  };

  const getEventStatus = () => {
    const now = new Date();
    if (eventData.start_datetime && new Date(eventData.start_datetime) > now) {
      return { text: "Próximo", color: BRAND.blue, bg: "#EFF6FF", icon: <Calendar size={16} /> };
    }
    if (eventData.end_datetime && new Date(eventData.end_datetime) < now) {
      return { text: "Finalizado", color: BRAND.gray, bg: "#F3F4F6", icon: <Clock size={16} /> };
    }
    return { text: "En curso", color: BRAND.darkGreen, bg: "#F0FDF4", icon: <CheckCircle size={16} /> };
  };

  const typeConfig = getEventTypeConfig(eventData.event_type);
  const status = getEventStatus();

  return (
    <div className="fixed inset-0 z-50 bg-[#005380] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative animate-fadeIn">
        
        {/* Header con Gradiente */}
        <div 
          className="relative px-8 py-10 text-white"
          style={{ 
            background: eventData.event_type === 'remote' 
              ? `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.darkBlue} 100%)`
              : `linear-gradient(135deg, ${BRAND.green} 0%, ${BRAND.darkGreen} 100%)`
          }}
        >
          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-md"
          >
            <X size={20} />
          </button>

          {/* Badges Superiores */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/20 text-white border border-white/30 backdrop-blur-md`}>
              {typeConfig.icon} {typeConfig.label}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white text-gray-800 shadow-sm">
              <span style={{ color: status.color }}>{status.icon}</span> {status.text}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
            {eventData.title}
          </h1>
          
          {/* Categoría */}
          {eventData.category && (
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <Tag size={16} />
              <span>{eventData.category}</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Columna Izquierda: Detalles Principales */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Descripción */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="text-blue-500" size={20} />
                  Sobre el Evento
                </h3>
                {eventData.description ? (
                  <div 
                    className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(eventData.description) }} 
                  />
                ) : (
                  <p className="text-gray-400 italic">No hay descripción disponible.</p>
                )}
              </div>

              {/* Información Adicional (Si aplica) */}
              {(eventData.requires_registration || eventData.max_attendees) && (
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-start gap-4">
                   <div className="p-2 bg-white rounded-full shadow-sm text-orange-500">
                      <Info size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-orange-800 mb-1">Información de Registro</h4>
                      <p className="text-sm text-orange-700">
                        Este evento requiere registro previo. 
                        {eventData.max_attendees && ` Cupo limitado a ${eventData.max_attendees} asistentes.`}
                      </p>
                   </div>
                </div>
              )}

            </div>

            {/* Columna Derecha: Sidebar de Detalles */}
            <div className="space-y-6">
              
              {/* Tarjeta de Fecha y Hora */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Fecha y Hora</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-1">
                       <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 capitalize">
                        {formatDate(eventData.start_datetime)}
                      </p>
                      <p className="text-xs text-gray-500">Fecha de inicio</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-1">
                       <Clock className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {eventData.is_all_day ? "Todo el día" : `${formatTime(eventData.start_datetime)} - ${formatTime(eventData.end_datetime)}`}
                      </p>
                      <p className="text-xs text-gray-500">Horario {eventData.timezone && `(${eventData.timezone})`}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Ubicación */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Ubicación</h3>
                
                {eventData.event_type === 'remote' ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Video className="text-purple-600" size={20} />
                      <span className="font-bold text-gray-800">Reunión Virtual</span>
                    </div>
                    
                    {eventData.meeting_link ? (
                      <a 
                        href={eventData.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
                      >
                        <LinkIcon size={16} /> Unirse a la reunión
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg text-center">
                        Enlace pendiente
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                       <MapPin className="text-red-500 mt-1" size={20} />
                       <div>
                          <p className="text-sm font-bold text-gray-800">
                            {eventData.location_name || "Por definir"}
                          </p>
                          {eventData.location_address && (
                            <p className="text-xs text-gray-500 mt-0.5">{eventData.location_address}</p>
                          )}
                       </div>
                    </div>
                    {(eventData.latitude && eventData.longitude) && (
                       <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400">
                          {/* Aquí iría un componente de mapa real */}
                          <span className="flex items-center gap-1"><MapPin size={12}/> Vista de Mapa</span>
                       </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tarjeta de Organizador (Opcional) */}
              {/* Si tuvieras datos del organizador, irían aquí */}

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}