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
} from "lucide-react";

export default function EventDetailModal({ eventData, onClose }) {
  const formatDateTime = (dateString) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTimeRange = (startDate, endDate, isAllDay) => {
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
    const typeConfig = {
      in_person: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <MapPin size={18} />,
        label: "Presencial",
        gradient: "from-purple-600 to-purple-700"
      },
      remote: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Video size={18} />,
        label: "Remoto",
        gradient: "from-blue-600 to-blue-700"
      },
    };

    const config = typeConfig[type] || typeConfig.in_person;

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${config.color} font-medium`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };

  const getEventStatus = () => {
    const now = new Date();
    
    if (eventData.start_datetime && new Date(eventData.start_datetime) > now) {
      return { 
        text: "Próximo", 
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: <Calendar size={18} />
      };
    }
    
    if (eventData.end_datetime && new Date(eventData.end_datetime) < now) {
      return { 
        text: "Finalizado", 
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <Clock size={18} />
      };
    }
    
    return { 
      text: "En curso", 
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle size={18} />
    };
  };

  const status = getEventStatus();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-fadeIn">
        {/* Header */}
        <div className={`relative px-8 py-8 bg-gradient-to-r ${eventData.event_type === 'remote' ? 'from-blue-600 to-blue-700' : 'from-green-600 to-green-700'} text-white`}>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X size={24} />
          </button>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {getEventTypeBadge(eventData.event_type)}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${status.color}`}>
              {status.icon}
              <span className="font-medium">{status.text}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight pr-12">
            {eventData.title}
          </h1>

          {/* Category */}
          {eventData.category && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white/90">
              <Tag size={16} />
              <span className="text-sm font-medium">{eventData.category}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Event Summary Card */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Información del Evento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Date & Time */}
                {eventData.start_datetime && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Calendar className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        {eventData.is_all_day ? 'Fecha' : 'Fecha y Hora'}
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {eventData.is_all_day ? 
                          formatDate(eventData.start_datetime) : 
                          formatDateTime(eventData.start_datetime)
                        }
                      </p>
                      {eventData.end_datetime && !eventData.is_all_day && (
                        <p className="text-sm text-gray-600 mt-1">
                          Hasta: {formatDateTime(eventData.end_datetime)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Location/Meeting */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    {eventData.event_type === 'remote' ? 
                      <Video className="text-blue-600" size={20} /> :
                      <MapPin className="text-purple-600" size={20} />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {eventData.event_type === 'remote' ? 'Reunión Virtual' : 'Ubicación'}
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {eventData.location_name || (eventData.event_type === 'remote' ? "Enlace de reunión" : "Por definir")}
                    </p>
                    {eventData.location_address && (
                      <p className="text-sm text-gray-600 mt-1">{eventData.location_address}</p>
                    )}
                  </div>
                </div>

                {/* Registration */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Users className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Registro</p>
                    <p className="text-gray-900 font-semibold">
                      {eventData.requires_registration ? 
                        `Requerido${eventData.max_attendees ? ` (máx. ${eventData.max_attendees})` : ''}` : 
                        'No requerido'
                      }
                    </p>
                  </div>
                </div>

                {/* Timezone */}
                {eventData.timezone && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Globe className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Zona Horaria</p>
                      <p className="text-gray-900 font-semibold">{eventData.timezone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Range Summary */}
            {eventData.start_datetime && eventData.end_datetime && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Clock size={20} />
                  Horario del Evento
                </h3>
                <p className="text-blue-800 font-medium text-lg">
                  {formatDateTimeRange(eventData.start_datetime, eventData.end_datetime, eventData.is_all_day)}
                </p>
                {eventData.timezone && (
                  <p className="text-blue-600 text-sm mt-2">
                    Zona horaria: {eventData.timezone}
                  </p>
                )}
              </div>
            )}

            {/* Location/Meeting Link Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {eventData.event_type === 'remote' ? <Video size={20} /> : <MapPin size={20} />}
                {eventData.event_type === 'remote' ? 'Detalles de la Reunión' : 'Detalles de la Ubicación'}
              </h3>
              
              {eventData.event_type === 'remote' ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  {eventData.meeting_link ? (
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <LinkIcon className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Enlace de la reunión</p>
                        <a 
                          href={eventData.meeting_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
                        >
                          Unirse a la reunión
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                        <LinkIcon className="text-gray-400" size={32} />
                      </div>
                      <p className="text-gray-500">El enlace de la reunión se compartirá próximamente</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                  {eventData.location_name && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Lugar</p>
                      <p className="text-gray-900 text-lg font-semibold">{eventData.location_name}</p>
                    </div>
                  )}
                  
                  {eventData.location_address && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Dirección</p>
                      <p className="text-gray-700">{eventData.location_address}</p>
                    </div>
                  )}
                  
                  {(eventData.latitude && eventData.longitude) && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Coordenadas</p>
                      <p className="text-gray-700 font-mono">
                        Lat: {eventData.latitude}, Lng: {eventData.longitude}
                      </p>
                    </div>
                  )}
                  
                  {!eventData.location_name && !eventData.location_address && (
                    <div className="text-center py-6">
                      <MapPin className="text-gray-400 mx-auto mb-2" size={32} />
                      <p className="text-gray-500">Los detalles de ubicación se compartirán próximamente</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Descripción del Evento
              </h3>
              {eventData.description ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div 
                    className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(String(eventData.description)) 
                    }} 
                  />
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                  <FileText className="text-gray-400 mx-auto mb-3" size={32} />
                  <p className="text-gray-500">No hay descripción disponible para este evento</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}