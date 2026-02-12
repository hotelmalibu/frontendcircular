import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  User,
  AlertCircle,
  FolderOpen
} from "lucide-react";
import { getAllProjects, deleteProject } from "../../../../../api/projectsApi";
import { getAllCategories } from "../../../../../api/categoriesApi";
import DOMPurify from 'dompurify';
import ProjectFormModal from "./ProjectFormModal";
import ProjectDetailModal from "./ProjectDetailModal";
import ConfirmModal from "../../../../../components/common/ConfirmModal";
import { getImageProxyUrl } from "../../../../../utils/imageUtils";

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

// Utility function to strip HTML tags and decode entities
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = DOMPurify.sanitize(String(html));
  return tmp.textContent || tmp.innerText || '';
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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const loadProjects = React.useCallback(async () => {
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
  }, []);

  const fetchCategories = React.useCallback(async () => {
    try {
      setCategoriesLoading(true);
      await getAllCategories();

    } catch (err) {
      console.error("Error loading categories for projects:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const filterProjectsData = React.useCallback(() => {
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
          item.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.project_type_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.project_type_label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.classification_type_label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.classification_type && typeof item.classification_type === 'object' && item.classification_type.label?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (typeof item.project_type === 'object' && (item.project_type?.label?.toLowerCase().includes(searchTerm.toLowerCase()) || item.project_type?.name?.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page
  }, [projects, searchTerm]);

  useEffect(() => {
    loadProjects();
    fetchCategories(); // Fetch categories on mount
  }, [loadProjects, fetchCategories]);

  useEffect(() => {
    filterProjectsData();
  }, [searchTerm, projects, filterProjectsData]);

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

  const handleDelete = (projectItem) => {
    setItemToDelete(projectItem);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteProject(itemToDelete.id);
      await loadProjects();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar el proyecto");
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    loadProjects();
  };

  if (loading || categoriesLoading) { // Added categoriesLoading to loading state
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 mb-4" style={{ borderColor: BRAND.blue }}></div>
        <p className="text-gray-500 font-medium">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">

      {/* ESPACIADOR SUPERIOR */}
      <div className="w-full"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: BRAND.darkBlue }}>Gestión de Proyectos</h1>
          <p className="text-gray-500 mt-1">Administración de iniciativas y contenido</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-bold text-sm transform active:scale-95"
          style={{ backgroundColor: BRAND.blue }}
        >
          <Plus size={20} />
          Nuevo Proyecto
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, autor o contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-gray-700"
            style={{ "--tw-ring-color": BRAND.lightBlue }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} style={{ color: BRAND.orange }} />
          <span>{error}</span>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-50">
            <FolderOpen className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron proyectos</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Intenta ajustar los filtros de búsqueda o crea un nuevo proyecto.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Borde Superior de Acento */}
              <div
                className="h-1.5 w-full absolute top-0 left-0"
                style={{ backgroundColor: BRAND.blue }}
              ></div>

              <div className="p-5 flex-1 flex flex-col">
                {/* Header: Categoría */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
                      <span>{item.category_name || item.category || "General"}</span>
                    </div>
                    {(item.project_type_name || item.project_type_label || (typeof item.project_type === 'object' && (item.project_type?.label || item.project_type?.name))) && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide bg-green-50 text-green-700 border border-green-100">
                        <span>{item.project_type_name || item.project_type_label || item.project_type?.label || item.project_type?.name}</span>
                      </div>
                    )}
                    {(item.classification_type_label || (item.classification_type && typeof item.classification_type === 'object' && item.classification_type.label)) && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide bg-orange-50 text-orange-700 border border-orange-100">
                        <span>{item.classification_type_label || item.classification_type?.label}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold text-gray-800 leading-tight line-clamp-2 mb-3 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>

                {/* Imagen o Placeholder */}
                <div className="mb-4 rounded-xl border border-gray-100 h-32 bg-gray-50 flex items-center justify-center relative overflow-hidden transition-colors">
                  {(item.cover_image?.url || item.cover_image_url || (typeof item.cover_image === 'string' && item.cover_image)) ? (
                    <img
                      src={getImageProxyUrl(item.cover_image?.url || item.cover_image_url || item.cover_image, { width: 300, quality: 75 })}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = ""; // Clear src to show placeholder if image fails
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`${(item.cover_image?.url || item.cover_image_url || (typeof item.cover_image === 'string' && item.cover_image)) ? 'hidden' : 'flex'} absolute inset-0 flex-col items-center justify-center text-gray-400 group-hover:text-blue-400 transition-colors transform group-hover:scale-110 duration-500`}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.blue} 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                      }}
                    ></div>
                    <FolderOpen size={48} className="mb-2 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Proyecto Ecocircular</span>
                  </div>
                </div>

                {/* Descripción */}
                <div className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed flex-grow break-words whitespace-normal">
                  {item.description ? (
                    stripHtml(item.description).slice(0, 150) + (stripHtml(item.description).length > 150 ? '...' : '')
                  ) : (
                    "Sin descripción disponible..."
                  )}
                </div>

                {/* Autor */}
                <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-50 pt-3 mt-auto">
                  <div className="p-1.5 rounded-full bg-gray-100">
                    <User size={14} className="text-gray-400" />
                  </div>
                  <span className="font-medium truncate max-w-[150px]">
                    {item.author || "Autor Desconocido"}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end items-center gap-1">
                <button
                  onClick={() => handleView(item)}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition"
                  title="Ver detalle"
                  style={{ color: BRAND.blue }}
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition"
                  title="Editar"
                  style={{ color: BRAND.darkGreen }}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition"
                  title="Eliminar"
                  style={{ color: BRAND.orange }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          </div>

          {/* Pagination Controls */}
          {filteredProjects.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                  }`}
              >
                Anterior
              </button>
              
              <span className="text-sm font-medium text-gray-600">
                Página {currentPage} de {Math.ceil(filteredProjects.length / itemsPerPage)}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProjects.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(filteredProjects.length / itemsPerPage)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === Math.ceil(filteredProjects.length / itemsPerPage)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                  }`}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-200 pt-6">
        Mostrando <span className="font-bold text-gray-600">{filteredProjects.length}</span> proyectos
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

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        title="Eliminar Proyecto"
        message={`¿Está seguro que desea eliminar el proyecto "${itemToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}