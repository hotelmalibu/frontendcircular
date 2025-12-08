import React from "react";
import DOMPurify from 'dompurify';
import {
  X,
  Edit,
  User,
  Tag,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import CORSImage from "../../../../../components/common/CORSImage";

// Category to image mapping
const categoryImages = {
  "Fortalecimiento": "/assets/home/Proyectos/proyecto1.png",
  "Innovacion": "/assets/home/Proyectos/proyecto2.png",
  "Sensibilizacion": "/assets/home/Proyectos/proyecto3.png",
  "Investigacion": "/assets/home/Proyectos/proyecto4.png",
  "Produccion": "/assets/home/Proyectos/proyecto5.png",
  "Economia": "/assets/home/Proyectos/proyecto6.png",
};

export default function ProjectDetailModal({ projectData, onClose, onEdit }) {
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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-lg font-semibold text-white">Detalles del Proyecto</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
              title="Editar proyecto"
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
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {projectData.title}
          </h1>

          {/* Category Image Section */}
          {categoryImages[projectData.category] && (
            <div className="mb-6">
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <CORSImage
                  src={categoryImages[projectData.category]}
                  alt={`Categoría: ${projectData.category}`}
                  className="w-full h-full object-cover"
                  fallbackSrc="/assets/placeholder-news.jpg"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Categoría: {projectData.category}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Category */}
            {projectData.category && (
              <div className="flex items-start gap-3">
                <Tag className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Categoría</p>
                  <p className="text-gray-900">{projectData.category}</p>
                </div>
              </div>
            )}

            {/* Author */}
            {projectData.author && (
              <div className="flex items-start gap-3">
                <User className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Autor</p>
                  <p className="text-gray-900">{projectData.author}</p>
                </div>
              </div>
            )}

            {/* Created At */}
            {projectData.created_at && (
              <div className="flex items-start gap-3">
                <Clock className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
                  <p className="text-gray-900">{formatDate(projectData.created_at)}</p>
                </div>
              </div>
            )}

            {/* Updated At */}
            {projectData.updated_at && (
              <div className="flex items-start gap-3">
                <Clock className="text-gray-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Última Actualización
                  </p>
                  <p className="text-gray-900">{formatDate(projectData.updated_at)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description/Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={20} />
              Descripción
            </h3>
            {projectData.description ? (
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200">
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(projectData.description)) }} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <AlertCircle size={20} />
                <span>No hay descripción disponible</span>
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
                <span className="font-mono text-gray-900">{projectData.id}</span>
              </div>
              {projectData.created_by && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Creado por:</span>
                  <span className="font-mono text-gray-900">
                    {projectData.created_by}
                  </span>
                </div>
              )}
              {projectData.updated_by && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Actualizado por:</span>
                  <span className="font-mono text-gray-900">
                    {projectData.updated_by}
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
            Editar Proyecto
          </button>
        </div>
      </div>
    </div>
  );
}