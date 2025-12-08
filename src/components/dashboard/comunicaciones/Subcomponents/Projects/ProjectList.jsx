import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Image,
} from "lucide-react";
import { getAllProjects, deleteProject } from "../../../../../api/projectsApi";
import DOMPurify from 'dompurify';
import ProjectFormModal from "./ProjectFormModal";
import ProjectDetailModal from "./ProjectDetailModal";
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

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjectsData();
  }, [searchTerm, projects]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllProjects();

      let projectsArray = [];
      if (response?.data?.items && Array.isArray(response.data.items)) {
        projectsArray = response.data.items;
      } else if (Array.isArray(response)) {
        projectsArray = response;
      } else if (response?.data?.projects && Array.isArray(response.data.projects)) {
        projectsArray = response.data.projects;
      } else if (response?.data && Array.isArray(response.data)) {
        projectsArray = response.data;
      } else if (response?.projects && Array.isArray(response.projects)) {
        projectsArray = response.projects;
      } else if (typeof response === 'object' && response !== null) {
        const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          projectsArray = possibleArrays[0];
        }
      }

      setProjects(projectsArray);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar los proyectos");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProjectsData = () => {
    if (!Array.isArray(projects)) {
      setFilteredProjects([]);
      return;
    }

    let filtered = [...projects];
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  const handleCreate = () => {
    setSelectedProject(null);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleEdit = (projectItem) => {
    setSelectedProject(projectItem);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleView = (projectItem) => {
    setSelectedProject(projectItem);
    setShowDetailModal(true);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("¿Está seguro de eliminar este proyecto?")) {
      return;
    }

    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar el proyecto");
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    loadProjects();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Proyectos</h1>
          <p className="text-gray-500 mt-1">Administra el contenido de proyectos</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm font-medium"
        >
          <Plus size={18} />
          Nuevo Proyecto
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, autor o contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white border focus:border-green-500 rounded-xl outline-none transition-all text-gray-700"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No se encontraron proyectos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 transition-all duration-300 flex flex-col h-full"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start gap-3 mb-3">
                <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                  {item.title}
                </h3>
              </div>

              {/* Category Image Section */}
              {categoryImages[item.category] ? (
                <div className="mb-4">
                 
                </div>
              ) : (
                <div className="mb-4">
                  <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Image size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Sin imagen</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-500 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
                {item.description ? (
                  DOMPurify.sanitize(String(item.description)).replace(/<[^>]+>/g, '').slice(0, 200)
                ) : (
                  "Sin descripción disponible..."
                )}
              </p>

              {/* Tags Row */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Tag size={14} className="stroke-2" />
                  <span className="text-sm font-medium">{item.category || "General"}</span>
                </div>
              </div>

              {/* Author */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-gray-500">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium truncate">
                    {item.author || "Autor Desconocido"}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-end items-center gap-3 mt-auto">
                <button
                  onClick={() => handleView(item)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ver detalle"
                >
                  <Eye size={20} className="stroke-[1.5]" />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={20} className="stroke-[1.5]" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={20} className="stroke-[1.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center text-sm text-gray-400">
        Mostrando {filteredProjects.length} resultados
      </div>

      {/* Modals */}
      {showFormModal && (
        <ProjectFormModal
          projectData={selectedProject}
          isEditing={isEditing}
          onClose={() => setShowFormModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showDetailModal && selectedProject && (
        <ProjectDetailModal
          projectData={selectedProject}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            setShowDetailModal(false);
            handleEdit(selectedProject);
          }}
        />
      )}
    </div>
  );
}