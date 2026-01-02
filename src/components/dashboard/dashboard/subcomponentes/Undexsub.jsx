import {
  Bell,
  ShieldAlert,
  Activity,
  AlertTriangle,
  AlertOctagon,
  Download,
  RefreshCw,
  Plus,
  Building,
  Edit,
  Search,
  FileText,
  Eye,
  Trash2
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import React, { useState, useEffect } from "react";
import { getAllProjects, deleteProject } from "../../../../api/projectsApi";
import ProjectFormModal from "../../../dashboard/comunicaciones/Subcomponents/Projects/ProjectFormModal";
import ProjectDetailModal from "../../../dashboard/comunicaciones/Subcomponents/Projects/ProjectDetailModal";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja (Alertas Críticas)
  yellow: "#E8AD00",     // Amarillo (Advertencias)
  purple: "#9E1981",     // Morado (Acentos)
};

export default function Undexsub() {
  // Datos de ejemplo
  const graficoImpacto = [
    { mes: "Ene", valor: 100 },
    { mes: "Feb", valor: 180 },
    { mes: "Mar", valor: 250 },
    { mes: "Abr", valor: 300 },
    { mes: "May", valor: 340 },
  ];

  const graficoRed = [
    { tipo: "Energía", valor: 80, fill: BRAND.darkGreen },
    { tipo: "Residuos", valor: 65, fill: BRAND.blue },
    { tipo: "Agua", valor: 90, fill: BRAND.lightBlue },
    { tipo: "CO₂", valor: 75, fill: BRAND.green },
  ];

  const alertas = [
    {
      titulo: "Múltiples intentos de acceso fallidos",
      descripcion: "Intentos desde usuario: user@ecologicproject.com",
      fecha: "18/09/2025 - 10:23 AM",
      tipo: "crítica",
    },
    {
      titulo: "Cambio de permisos críticos",
      descripcion: "El usuario admin@ecologic.com modificó roles",
      fecha: "17/09/2025 - 08:47 AM",
      tipo: "advertencia",
    },
    {
      titulo: "Acceso desde nueva ubicación",
      descripcion: "Ingreso detectado desde IP 190.85.32.11",
      fecha: "16/09/2025 - 09:12 AM",
      tipo: "info",
    },
  ];

  const stats = [
    {
      titulo: "Usuarios Totales",
      valor: "2,345",
      iconColor: BRAND.green,
      bgIcon: "bg-[#B1D357]/20", // Verde con transparencia
      icono: <Activity color={BRAND.darkGreen} size={24} />,
    },
    {
      titulo: "Sesiones Activas",
      valor: "97",
      iconColor: BRAND.blue,
      bgIcon: "bg-[#2C67B0]/10",
      icono: <Bell color={BRAND.blue} size={24} />,
    },
    {
      titulo: "Alertas Críticas",
      valor: "1,324",
      iconColor: BRAND.orange,
      bgIcon: "bg-[#E15200]/10",
      icono: <AlertTriangle color={BRAND.orange} size={24} />,
    },
    {
      titulo: "Accesos Bloqueados",
      valor: "22",
      iconColor: BRAND.purple,
      bgIcon: "bg-[#9E1981]/10",
      icono: <AlertOctagon color={BRAND.purple} size={24} />,
    },
  ];

  // Projects state management
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const loadProjects = React.useCallback(async () => {
    try {
      setLoading(true);
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
      }
      setProjects(projectsArray);
    } catch (err) {
      console.error("Error loading projects for main dashboard:", err);
      setProjects([]);
    } finally {
      setLoading(false);
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
          item.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

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

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">

      {/* Header Superior */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: BRAND.darkBlue }}>
            Panel de Control
          </h1>
          <p className="text-gray-500 mt-1">Resumen de actividad y gestión de proyectos</p>
        </div>

        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all"
            style={{ backgroundColor: BRAND.blue }}
          >
            <RefreshCw size={18} /> Actualizar
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all"
            style={{ backgroundColor: BRAND.darkGreen }}
          >
            <Download size={18} /> Exportar
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {item.titulo}
                </p>
                <h3 className="text-3xl font-bold mt-2" style={{ color: BRAND.darkBlue }}>
                  {item.valor}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${item.bgIcon}`}>
                {item.icono}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sección Izquierda: Gestión de Proyectos (Ocupa 2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Gestión de Proyectos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
                <Building className="text-blue-500" /> Gestión de Proyectos
              </h2>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition shadow-sm"
                style={{ backgroundColor: BRAND.blue }}
              >
                <Plus size={20} /> Nuevo Proyecto
              </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, autor o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{ "--tw-ring-color": BRAND.lightBlue }}
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: BRAND.blue }}></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No se encontraron proyectos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.slice(0, 6).map((project) => (
                  <div
                    key={project.id}
                    className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider"
                        style={{ backgroundColor: `${BRAND.lightBlue}20`, color: BRAND.darkBlue }}
                      >
                        {project.category || "General"}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleView(project)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Eye size={16} /></button>
                        <button onClick={() => handleEdit(project)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(project.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-800 mb-2 truncate text-lg">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                      {project.description ? project.description.replace(/<[^>]+>/g, '') : "Sin descripción disponible."}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-3 border-t border-gray-100">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {project.author ? project.author.charAt(0) : "U"}
                      </div>
                      <span>{project.author || "Anónimo"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProjects.length > 6 && (
              <div className="text-center mt-6">
                <button className="text-sm font-medium hover:underline" style={{ color: BRAND.blue }}>
                  Ver todos los proyectos ({filteredProjects.length})
                </button>
              </div>
            )}
          </div>

          {/* Gráficos de Impacto */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: BRAND.darkBlue }}>
              Métricas de Impacto Ambiental
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Actividad Mensual</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graficoImpacto}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="valor"
                      stroke={BRAND.blue}
                      strokeWidth={3}
                      dot={{ r: 4, fill: BRAND.blue, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: BRAND.orange }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Distribución por Tipo</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graficoRed}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="tipo" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Derecha: Alertas y Resumen (Ocupa 1/3) */}
        <div className="lg:col-span-1 flex flex-col gap-8">

          {/* Alertas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <ShieldAlert style={{ color: BRAND.orange }} /> Centro de Alertas
            </h2>
            <div className="space-y-3">
              {alertas.map((alerta, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border-l-4 transition-all hover:bg-gray-50"
                  style={{
                    borderColor: alerta.tipo === "crítica" ? BRAND.orange : alerta.tipo === "advertencia" ? BRAND.yellow : BRAND.blue,
                    backgroundColor: 'white',
                    borderWidth: '1px',
                    borderLeftWidth: '4px'
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        color: alerta.tipo === "crítica" ? BRAND.orange : alerta.tipo === "advertencia" ? BRAND.yellow : BRAND.blue,
                        backgroundColor: alerta.tipo === "crítica" ? '#FFF5EB' : alerta.tipo === "advertencia" ? '#FFFBEB' : '#EFF6FF'
                      }}
                    >
                      {alerta.tipo}
                    </span>
                    <span className="text-xs text-gray-400">{alerta.fecha.split('-')[1]}</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm">{alerta.titulo}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{alerta.descripcion}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition" style={{ color: BRAND.blue }}>
              Ver historial de seguridad
            </button>
          </div>

          {/* Resumen Ambiental Rápido */}
          <div className="bg-[#2C67B0] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* Elemento decorativo de fondo */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#B1D357] opacity-20 rounded-full"></div>

            <h3 className="text-lg font-bold mb-4 relative z-10">Resumen Eco</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center border-b border-white/20 pb-3">
                <span className="text-blue-100 text-sm">Reducción CO₂</span>
                <span className="font-bold text-xl">152.8 kg</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-3">
                <span className="text-blue-100 text-sm">Ahorro Energía</span>
                <span className="font-bold text-xl">45 MWh</span>
              </div>
              <div className="pt-2">
                <div className="w-full bg-blue-900/30 rounded-full h-2 mb-2">
                  <div className="bg-[#B1D357] h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-xs text-blue-100">Meta mensual al 75%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Modals */}
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