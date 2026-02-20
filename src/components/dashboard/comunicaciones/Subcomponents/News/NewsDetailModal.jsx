import React from "react";
import ReactDOM from "react-dom";
import DOMPurify from 'dompurify';
import {
  X,
  Edit,
  Calendar,
  User,
  Tag,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function NewsDetailModal({ newsData, onClose, onEdit }) {
  const formatDate = (dateString) => {
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

  const getTypeBadge = (type) => {
    const typeConfig = {
      news: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Noticia",
      },
    };

    const config = typeConfig[type] || typeConfig.news;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color}`}
      >
        <FileText size={18} />
        <span className="font-medium">{config.label}</span>
      </div>
    );
  };

  const isActive = () => {
    if (newsData.status !== "published") return false;
    if (!newsData.published_at) return false;
    if (new Date(newsData.published_at) > new Date()) return false;
    if (newsData.end_date && new Date(newsData.end_date) < new Date()) return false;
    return true;
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-lg font-semibold text-white">Detalles de la Noticia</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
              title="Editar noticia"
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
            {getTypeBadge(newsData.type)}
            {getStatusBadge(newsData.status)}
            {isActive() && (
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-emerald-100 text-emerald-800 border-emerald-200">
                <CheckCircle size={18} />
                <span className="font-medium">Activa</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {newsData.title}
          </h1>

          {/* Image Section */}
          {newsData.upload_file && newsData.upload_file.url && (
            <div className="mb-6">
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <img
                  src={newsData.upload_file.url}
                  alt={newsData.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Error loading image:", newsData.upload_file.url);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              {newsData.upload_file.original_name && (
                <p className="text-sm text-gray-500 mt-2">
                  Imagen: {newsData.upload_file.original_name}
                </p>
              )}
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Category */}
            {newsData.category && (
              <div className="flex items-start gap-3">
                <Tag className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Categoría</p>
                  <p className="text-gray-900">{newsData.category}</p>
                </div>
              </div>
            )}

            {/* Author */}
            {newsData.author && (
              <div className="flex items-start gap-3">
                <User className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Autor</p>
                  <p className="text-gray-900">{newsData.author}</p>
                </div>
              </div>
            )}

            {/* Published At */}
            {newsData.published_at && (
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Fecha de Publicación
                  </p>
                  <p className="text-gray-900">{formatDate(newsData.published_at)}</p>
                </div>
              </div>
            )}

            {/* Start Date */}
            {newsData.start_date && (
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Inicio</p>
                  <p className="text-gray-900">{formatDate(newsData.start_date)}</p>
                </div>
              </div>
            )}

            {/* End Date */}
            {newsData.end_date && (
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Fin</p>
                  <p className="text-gray-900">{formatDate(newsData.end_date)}</p>
                </div>
              </div>
            )}

            {/* Created At */}
            {newsData.created_at && (
              <div className="flex items-start gap-3">
                <Clock className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
                  <p className="text-gray-900">{formatDate(newsData.created_at)}</p>
                </div>
              </div>
            )}

            {/* Updated At */}
            {newsData.updated_at && (
              <div className="flex items-start gap-3">
                <Clock className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Última Actualización
                  </p>
                  <p className="text-gray-900">{formatDate(newsData.updated_at)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description/Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={20} />
              Contenido
            </h3>
            {(newsData.content || newsData.description) ? (
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 bg-white p-4 rounded-lg border border-gray-200"
                  style={{ wordBreak: 'normal', overflowWrap: 'break-word', hyphens: 'none' }}
                >
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(newsData.content || newsData.description)) }} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <AlertCircle size={20} />
                <span>No hay contenido disponible</span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Información Adicional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-gray-900">{newsData.id}</span>
              </div>
              {newsData.created_by && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Creado por:</span>
                  <span className="font-mono text-gray-900">
                    {newsData.created_by}
                  </span>
                </div>
              )}
              {newsData.updated_by && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Actualizado por:</span>
                  <span className="font-mono text-gray-900">
                    {newsData.updated_by}
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Edit size={18} />
            Editar Noticia
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
