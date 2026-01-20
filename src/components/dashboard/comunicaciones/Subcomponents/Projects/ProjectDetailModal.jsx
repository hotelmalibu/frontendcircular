import React from "react";
import ReactDOM from "react-dom";
import DOMPurify from 'dompurify';
import {
  X,
  Edit,
  User,
  Tag,
  Clock,
  FileText,
  AlertCircle,
  Layers,
  Download,
} from "lucide-react";

import { getImageProxyUrl } from "../../../../../utils/imageUtils";

// Category to image mapping (Legacy - removed to avoid loading errors)

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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center backdrop-blur-sm p-4 animate-fadeIn">
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
          {/* Cover Image */}
          {(projectData.cover_image?.url || projectData.cover_image_url || (typeof projectData.cover_image === 'string' && projectData.cover_image)) && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 shadow-sm max-h-80">
              <img
                src={getImageProxyUrl(projectData.cover_image?.url || projectData.cover_image_url || projectData.cover_image)}
                alt={projectData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {projectData.title}
          </h1>

          {/* Category Display */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 font-medium">
              Categoría: <span className="text-blue-600 font-bold">{projectData.category_name || projectData.category || "General"}</span>
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
            {/* Category */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Categoría</p>
                <p className="text-gray-900 font-medium">{projectData.category_name || projectData.category || "General"}</p>
              </div>
            </div>

            {/* Project Type */}
            {(projectData.project_type_name || projectData.project_type_label || (typeof projectData.project_type === 'object' && (projectData.project_type?.label || projectData.project_type?.name))) && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <Layers size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Tipo de Proyecto</p>
                  <p className="text-gray-900 font-medium">
                    {projectData.project_type_name || projectData.project_type_label || projectData.project_type?.label || projectData.project_type?.name}
                  </p>
                </div>
              </div>
            )}

            {/* Author */}
            {projectData.author && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Autor</p>
                  <p className="text-gray-900 font-medium">{projectData.author}</p>
                </div>
              </div>
            )}

            {/* Classification Type */}
            {(projectData.classification_type_label || (projectData.classification_type && typeof projectData.classification_type === 'object' && projectData.classification_type.label)) && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <Tag size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Clasificación</p>
                  <p className="text-gray-900 font-medium">
                    {projectData.classification_type_label || projectData.classification_type?.label}
                  </p>
                </div>
              </div>
            )}

            {/* Created At */}
            {projectData.created_at && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Fecha de Creación</p>
                  <p className="text-gray-900 font-medium">{formatDate(projectData.created_at)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description/Content */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
              <FileText size={20} className="text-blue-600" />
              Descripción del Proyecto
            </h3>
            {projectData.description ? (
              <div className="prose max-w-none">
                <div className="text-gray-700 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(projectData.description)) }} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
                <AlertCircle size={20} className="text-gray-400" />
                <span>No hay descripción disponible para este proyecto.</span>
              </div>
            )}
          </div>

          {/* Documentation Section */}
          {projectData.upload_file && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Download size={20} className="text-green-600" />
                Documentación Adjunta
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm border border-blue-50">
                    <FileText size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{projectData.upload_file.original_name || "Documento del Proyecto"}</p>
                    <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                      <Clock size={12} /> Subido el {formatDate(projectData.upload_file.created_at)}
                    </p>
                  </div>
                </div>
                <a
                  href={getImageProxyUrl(`https://api-ecocircular.creativostecnologicosit.com/storage/${projectData.upload_file.path}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all font-bold text-sm transform active:scale-95"
                >
                  <Download size={18} /> Descargar Archivo
                </a>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="border-t pt-6 mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Registro de Auditoría
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectData.created_by && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-medium text-gray-500">ID de Creador:</span>
                  <span className="text-xs font-mono font-bold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                    {projectData.created_by}
                  </span>
                </div>
              )}
              {projectData.updated_by && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-medium text-gray-500">ID de Editor:</span>
                  <span className="text-xs font-mono font-bold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
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
    </div>,
    document.body
  );
}