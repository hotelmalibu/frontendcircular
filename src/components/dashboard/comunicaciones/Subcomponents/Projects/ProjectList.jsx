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
  Image as ImageIcon,
  FolderOpen
} from "lucide-react";
import { getAllProjects, deleteProject } from "../../../../../api/projectsApi";
import DOMPurify from 'dompurify';
import ProjectFormModal from "./ProjectFormModal";
import ProjectDetailModal from "./ProjectDetailModal";
import CORSImage from "../../../../../components/common/CORSImage";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((item) => (
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
                  <div className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide bg-blue-50 text-blue-700">
                     <Tag size={12} />
                     <span>{item.category || "General"}</span>
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold text-gray-800 leading-tight line-clamp-2 mb-3 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>

                {/* Imagen del Proyecto */}
                <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 h-40 bg-gray-50 flex items-center justify-center relative">
                   {categoryImages[item.category] ? (
                      <img 
                        src={categoryImages[item.category]} 
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                   ) : item.image ? (
                       <CORSImage 
                         src={item.image} 
                         alt={item.title} 
                         className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                       />
                   ) : (
                       <div className="flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon size={32} className="mb-2 opacity-50" />
                          <span className="text-xs">Sin imagen</span>
                       </div>
                   )}
                   {/* Fallback div si la imagen falla */}
                   <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      <span className="text-xs">Imagen no disponible</span>
                   </div>
                </div>

                {/* Descripción */}
                <div className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed flex-grow">
                  {item.description ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(String(item.description)).slice(0, 150) + (item.description.length > 150 ? '...' : '') 
                    }} />
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
                  onClick={() => handleDelete(item.id)}
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
    </div>
  );
}