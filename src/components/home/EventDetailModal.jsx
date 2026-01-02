import React from "react";
import DOMPurify from 'dompurify';
import {
  X,
  Calendar,
  MapPin,
  Video,
  Users,
  Tag,
  Clock,
  CheckCircle,
  FileText,
  Info,
  ExternalLink,
  PlayCircle
} from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",
  darkBlue: "#005380",
  lightBlue: "#7FB8D9",
  green: "#B1D357",
  darkGreen: "#8CB200",
  orange: "#E15200",
  gray: "#6B7280",
};

export default function EventDetailModal({ eventData, onClose }) {
  if (!eventData) return null;

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
        icon: <Video size={18} className="text-white-600" />,
        gradient: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.darkBlue} 100%)`,
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        buttonText: "text-white"
      };
    }
    return {
      label: "Presencial",
      icon: <MapPin size={18} className="text-green-600" />,
      gradient: `linear-gradient(135deg, ${BRAND.green} 0%, ${BRAND.darkGreen} 100%)`,
      buttonColor: "bg-green-600 hover:bg-green-700",
      buttonText: "text-white"
    };
  };

  const getEventStatus = () => {
    const now = new Date();
    const start = eventData.start_datetime ? new Date(eventData.start_datetime) : null;
    const end = eventData.end_datetime ? new Date(eventData.end_datetime) : null;

    if (start && start > now) {
      return { text: "Próximo", color: BRAND.blue, bg: "bg-blue-50", textColor: "text-blue-700", icon: <Calendar size={18} /> };
    }
    if (end && end < now) {
      return { text: "Finalizado", color: BRAND.gray, bg: "bg-gray-100", textColor: "text-gray-600", icon: <Clock size={18} /> };
    }
    return { text: "En curso", color: BRAND.darkGreen, bg: "bg-green-50", textColor: "text-green-700", icon: <CheckCircle size={18} /> };
  };

  const typeConfig = getEventTypeConfig(eventData.event_type);
  const status = getEventStatus();

  // Determinar acción principal
  const getPrimaryAction = () => {
    const isPast = status.text === "Finalizado";
    const isRemote = eventData.event_type === "remote";

    if (isPast && eventData.recording_link) {
      return {
        label: "Ver Grabación",
        icon: <PlayCircle size={20} />,
        href: eventData.recording_link,
        className: "bg-purple-600 hover:bg-purple-700 text-white"
      };
    }

    if (isRemote && eventData.meeting_link) {
      return {
        label: status.text === "En curso" ? "Unirse Ahora" : "Unirse a la Reunión",
        icon: <Video size={20} />,
        href: eventData.meeting_link,
        className: typeConfig.buttonColor + " " + typeConfig.buttonText
      };
    }

    if (eventData.registration_link) {
      return {
        label: "Registrarme",
        icon: <Users size={20} />,
        href: eventData.registration_link,
        className: "bg-orange-600 hover:bg-orange-700 text-white"
      };
    }

    return null;
  };

  const primaryAction = getPrimaryAction();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-fadeIn">

        {/* Header con Gradiente */}
        <div
          className="relative px-8 py-12 text-white overflow-hidden"
          style={{ background: typeConfig.gradient }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white/20 backdrop-blur-md border border-white/30">
                {typeConfig.icon}
                {typeConfig.label}
              </span>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${status.bg} ${status.textColor}`}>
                {status.icon}
                {status.text}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white/20 backdrop-blur-md border border-white/30">
                <Tag size={18} />
                {(() => {
                  const cat = eventData.category_name || eventData.category || eventData.topic;
                  if (!cat) return "General";
                  if (typeof cat === 'object') return cat.name || "General";
                  return cat;
                })()}
              </span>
            </div>


            <h1 className="text-3xl md:text-4xl font-black leading-tight max-w-4xl">
              {eventData.title}
            </h1>

          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Columna Principal */}
              <div className="lg:col-span-2 space-y-8">

                {/* Descripción */}
                <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FileText className="text-blue-600" size={24} />
                    Sobre el Evento
                  </h3>
                  {eventData.description ? (
                    <div
                      className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(eventData.description) }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">No hay descripción disponible para este evento.</p>
                  )}
                </div>

                {/* Alerta de Registro */}
                {(eventData.requires_registration || eventData.max_attendees) && !primaryAction?.href?.includes("registration") && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <Info size={28} className="text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 text-lg mb-2">Requiere Registro</h4>
                      <p className="text-amber-800">
                        Este evento tiene inscripción obligatoria.
                        {eventData.max_attendees && ` Cupo limitado a ${eventData.max_attendees} personas.`}
                        {eventData.registration_link ? " Usa el botón principal para registrarte." : " Contacta al organizador para más información."}
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Sidebar */}
              <div className="space-y-6">

                {/* Acción Principal */}
                {primaryAction && (
                  <a
                    href={primaryAction.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${primaryAction.className}`}
                  >
                    {primaryAction.icon}
                    {primaryAction.label}
                    <ExternalLink size={18} />
                  </a>
                )}

                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-5">Detalles</h3>
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <Tag size={22} className="text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900 capitalize">
                          {(() => {
                            const cat = eventData.category_name || eventData.category || eventData.topic;
                            if (!cat) return "General";
                            if (typeof cat === 'object') return cat.name || "General";
                            return cat;
                          })()}
                        </p>
                        <p className="text-sm text-gray-500">Categoría</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Calendar size={22} className="text-blue-600 mt-1 flex-shrink-0" />

                      <div>
                        <p className="font-bold text-gray-900 capitalize">{formatDate(eventData.start_datetime)}</p>
                        <p className="text-sm text-gray-500">Inicio del evento</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Clock size={22} className="text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900">
                          {eventData.is_all_day ? "Todo el día" : `${formatTime(eventData.start_datetime)} - ${formatTime(eventData.end_datetime || eventData.start_datetime)}`}
                        </p>
                        {eventData.timezone && <p className="text-sm text-gray-500">Zona horaria: {eventData.timezone}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-5">Ubicación</h3>
                  {eventData.event_type === 'remote' ? (
                    <div className="text-center py-4">
                      <Video size={40} className="text-purple-600 mx-auto mb-4" />
                      <p className="font-bold text-gray-900">Evento Virtual</p>
                      <p className="text-sm text-gray-500 mt-2">Acceso mediante enlace de reunión</p>
                    </div>
                  ) : (
                    <div>
                      <MapPin size={40} className="text-red-600 mx-auto mb-4" />
                      <p className="font-bold text-gray-900 text-center">{eventData.location_name || "Por confirmar"}</p>
                      {eventData.location_address && (
                        <p className="text-sm text-gray-600 text-center mt-2">{eventData.location_address}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Organizador (si existe) */}
                {eventData.organizer_name && (
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-5">Organizado por</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {eventData.organizer_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{eventData.organizer_name}</p>
                        {eventData.organizer_email && (
                          <a href={`mailto:${eventData.organizer_email}`} className="text-sm text-blue-600 hover:underline">
                            {eventData.organizer_email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white border-t border-gray-200 flex justify-end items-center">

          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}