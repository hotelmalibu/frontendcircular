import React from "react";
import ReactDOM from "react-dom";
import DOMPurify from 'dompurify';
import {
  X,
  Edit,
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
  AlertCircle,
} from "lucide-react";

export default function EventDetailModal({ eventData, onClose, onEdit }) {
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle size={18} />,
        label: "Publicado",
      },
      draft: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock size={18} />,
        label: "Borrador",
      },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color}`}
      >
        {config.icon}
        <span className="font-medium">{config.label}</span>
      </div>
    );
  };

  const getEventTypeBadge = (type) => {
    const typeConfig = {
      in_person: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <MapPin size={18} />,
        label: "Presencial",
      },
      remote: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Video size={18} />,
        label: "Remoto",
      },
    };

    const config = typeConfig[type] || typeConfig.in_person;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color}`}
      >
        {config.icon}
        <span className="font-medium">{config.label}</span>
      </div>
    );
  };

  const isEventActive = () => {
    if (eventData.status !== "published") return false;
    if (!eventData.published_at) return false;
    if (new Date(eventData.published_at) > new Date()) return false;
    if (eventData.end_datetime && new Date(eventData.end_datetime) < new Date()) return false;
    return true;
  };

  const isEventUpcoming = () => {
    if (!eventData.start_datetime) return false;
    return new Date(eventData.start_datetime) > new Date();
  };

  const getEventStatus = () => {
    if (isEventActive()) return "activo";
    if (isEventUpcoming()) return "próximo";
    return "finalizado";
  };

  const getEventStatusBadge = () => {
    const status = getEventStatus();
    const statusConfig = {
      activo: {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: <CheckCircle size={18} />,
        label: "Activo",
      },
      próximo: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Calendar size={18} />,
        label: "Próximo",
      },
      finalizado: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <Clock size={18} />,
        label: "Finalizado",
      },
    };

    const config = statusConfig[status];

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color}`}
      >
        {config.icon}
        <span className="font-medium">{config.label}</span>
      </div>
    );
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-green-600 to-green-700">
          <h2 className="text-lg font-semibold text-white">Detalles del Evento</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
              title="Editar evento"
            >
              <Edit size={18} />
              Editar
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Status and Type Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {getEventTypeBadge(eventData.event_type)}
            {getStatusBadge(eventData.status)}
            {getEventStatusBadge()}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {eventData.title}
          </h1>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Category */}
            <div className="flex items-start gap-3">
              <Tag className="text-gray-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-500">Categoría</p>
                <p className="text-gray-900">
                  {(() => {
                    const cat = eventData.category_name || eventData.category || eventData.topic;
                    if (!cat) return "General";
                    if (typeof cat === 'object') return cat.name || "General";
                    return cat;
                  })()}
                </p>
              </div>
            </div>


            {/* Event Type */}
            <div className="flex items-start gap-3">
              {eventData.event_type === 'remote' ?
                <Video className="text-gray-500 mt-1 flex-shrink-0" size={20} /> :
                <MapPin className="text-gray-500 mt-1 flex-shrink-0" size={20} />
              }
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo de Evento</p>
                <p className="text-gray-900">
                  {eventData.event_type === 'remote' ? 'Remoto' : 'Presencial'}
                </p>
              </div>
            </div>

            {/* Start DateTime */}
            {eventData.start_datetime && (
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {eventData.is_all_day ? 'Fecha' : 'Fecha y Hora de Inicio'}
                  </p>
                  <p className="text-gray-900">
                    {eventData.is_all_day ?
                      formatDate(eventData.start_datetime) :
                      formatDateTime(eventData.start_datetime)
                    }
                  </p>
                </div>
              </div>
            )}

            {/* End DateTime */}
            {eventData.end_datetime && (
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {eventData.is_all_day ? '' : 'Fecha y Hora de Fin'}
                  </p>
                  <p className="text-gray-900">
                    {eventData.is_all_day ?
                      formatDate(eventData.end_datetime) :
                      formatDateTime(eventData.end_datetime)
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Timezone */}
            {eventData.timezone && (
              <div className="flex items-start gap-3">
                <Globe className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Zona Horaria</p>
                  <p className="text-gray-900">{eventData.timezone}</p>
                </div>
              </div>
            )}

            {/* All Day Flag */}
            {eventData.is_all_day && (
              <div className="flex items-start gap-3">
                <Clock className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Duración</p>
                  <p className="text-gray-900">Evento de día completo</p>
                </div>
              </div>
            )}

            {/* Registration Requirement */}
            <div className="flex items-start gap-3">
              <Users className="text-gray-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-500">Registro</p>
                <p className="text-gray-900">
                  {eventData.requires_registration ?
                    `Requiere registro${eventData.max_attendees ? ` (máx. ${eventData.max_attendees} asistentes)` : ''}` :
                    'No requiere registro'
                  }
                </p>
              </div>
            </div>

            {/* Published At */}
            {eventData.published_at && (
              <div className="flex items-start gap-3">
                <CheckCircle className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Fecha de Publicación
                  </p>
                  <p className="text-gray-900">{formatDateTime(eventData.published_at)}</p>
                </div>
              </div>
            )}

            {/* Created At */}
            {eventData.created_at && (
              <div className="flex items-start gap-3">
                <Clock className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
                  <p className="text-gray-900">{formatDateTime(eventData.created_at)}</p>
                </div>
              </div>
            )}

            {/* Updated At */}
            {eventData.updated_at && (
              <div className="flex items-start gap-3">
                <Clock className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Última Actualización
                  </p>
                  <p className="text-gray-900">{formatDateTime(eventData.updated_at)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Location Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {eventData.event_type === 'remote' ? <Video size={20} /> : <MapPin size={20} />}
              {eventData.event_type === 'remote' ? 'Información de Reunión' : 'Ubicación'}
            </h3>

            {eventData.event_type === 'remote' ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                {eventData.meeting_link ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <LinkIcon size={20} />
                    <a
                      href={eventData.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-medium"
                    >
                      {eventData.meeting_link}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <AlertCircle size={20} />
                    <span>No se ha proporcionado enlace de reunión</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                {eventData.location_name && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lugar</p>
                    <p className="text-gray-900">{eventData.location_name}</p>
                  </div>
                )}

                {eventData.location_address && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dirección</p>
                    <p className="text-gray-900">{eventData.location_address}</p>
                  </div>
                )}

                {(eventData.latitude && eventData.longitude) && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Coordenadas</p>
                    <p className="text-gray-900 font-mono text-sm">
                      Lat: {eventData.latitude}, Lng: {eventData.longitude}
                    </p>
                  </div>
                )}

                {!eventData.location_name && !eventData.location_address && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <AlertCircle size={20} />
                    <span>No se ha proporcionado información de ubicación</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description/Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={20} />
              Descripción
            </h3>
            {eventData.description ? (
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-normal bg-white p-4 rounded-lg border border-gray-200">
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(eventData.description).replace(/\u00A0|&nbsp;/g, ' ')) }} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <AlertCircle size={20} />
                <span>No hay descripción disponible</span>
              </div>
            )}
          </div>

          {/* Event Range Summary */}
          {eventData.start_datetime && eventData.end_datetime && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Resumen del Evento</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">
                  {formatDateTimeRange(eventData.start_datetime, eventData.end_datetime, eventData.is_all_day)}
                </p>
                {eventData.timezone && (
                  <p className="text-blue-600 text-sm mt-1">
                    Zona horaria: {eventData.timezone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Información Adicional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {eventData.created_by && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Creado por:</span>
                  <span className="font-mono text-gray-900">
                    {eventData.created_by}
                  </span>
                </div>
              )}
              {eventData.updated_by && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Actualizado por:</span>
                  <span className="font-mono text-gray-900">
                    {eventData.updated_by}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            <Edit size={18} />
            Editar Evento
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}