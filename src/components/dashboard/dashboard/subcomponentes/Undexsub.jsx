import {
  Bell,
  ShieldAlert,
  Shield,
  Activity,
  AlertTriangle,
  AlertOctagon,
  Download,
  Leaf,
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
import { Link } from "react-router-dom";
import { getAllProjects, deleteProject } from "../../../../api/projectsApi";
import { getUsers, getSecurityLogs, getActiveSessions } from "../../../../api/auth";
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

  const [alertas, setAlertas] = useState([]); // Iniciamos vacío para data real futura

  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: "0",
    activeSessions: "0",
    criticalAlerts: "0",
    blockedAccesses: "0"
  });

  const loadStats = React.useCallback(async () => {
    try {
      // Usuarios y Bloqueados
      const resUsers = await getUsers();
      const userList = Array.isArray(resUsers.data) ? resUsers.data : (resUsers.data?.data || []);

      // Sesiones Activas
      let sessionsCount = 0;
      try {
        const resSessions = await getActiveSessions();
        sessionsCount = resSessions.data?.count || 0;
      } catch (e) {
        console.log("Sessions endpoint not available.");
      }

      // Alertas de Seguridad
      let realAlerts = [];
      try {
        const resAlerts = await getSecurityLogs();
        realAlerts = Array.isArray(resAlerts.data) ? resAlerts.data : (resAlerts.data?.data || []);
      } catch (err) {
        console.log("No security logs endpoint found yet.");
      }

      setDashboardStats({
        totalUsers: userList.length.toLocaleString(),
        activeSessions: sessionsCount.toString(),
        criticalAlerts: realAlerts.filter(a => a.type === 'critical').length.toString(),
        blockedAccesses: userList.filter(u => u.status === 'rejected').length.toString()
      });
      setAlertas(realAlerts.map(a => ({
        titulo: a.description || "Alerta de seguridad",
        descripcion: a.user_email ? `Usuario: ${a.user_email}` : "Actividad sospechosa",
        fecha: new Date(a.created_at).toLocaleString('es-ES'),
        tipo: a.type || "info"
      })));
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    }
  }, []);

  const stats = [
    {
      titulo: "Usuarios Totales",
      valor: dashboardStats.totalUsers,
      iconColor: BRAND.green,
      bgIcon: "bg-[#B1D357]/20",
      icono: <Activity color={BRAND.darkGreen} size={24} />,
    },
    {
      titulo: "Sesiones Activas",
      valor: dashboardStats.activeSessions,
      iconColor: BRAND.blue,
      bgIcon: "bg-[#2C67B0]/10",
      icono: <Bell color={BRAND.blue} size={24} />,
    },
    {
      titulo: "Alertas Críticas",
      valor: dashboardStats.criticalAlerts,
      iconColor: BRAND.orange,
      bgIcon: "bg-[#E15200]/10",
      icono: <AlertTriangle color={BRAND.orange} size={24} />,
    },
    {
      titulo: "Accesos Bloqueados",
      valor: dashboardStats.blockedAccesses,
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
    loadStats();
  }, [loadProjects, loadStats]);

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

      {/* Header Superior - Simplificado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: BRAND.darkBlue }}>
            Resumen de Actividad
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Visualización de métricas clave y seguridad</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-500 transition-colors">
                  {item.titulo}
                </p>
                <h3 className="text-3xl font-black mt-2 leading-none" style={{ color: BRAND.darkBlue }}>
                  {item.valor}
                </h3>
              </div>
              <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${item.bgIcon}`}>
                {item.icono}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Columna Izquierda (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Centro de Alertas - PASA A LA IZQUIERDA ABAJO */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <Shield style={{ color: BRAND.orange }} /> Centro de Alertas
            </h2>
            <div className="space-y-3">
              {alertas.length > 0 ? (
                alertas.slice(0, 3).map((alerta, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border-l-4 transition-all hover:bg-gray-50 bg-white border border-gray-100"
                    style={{
                      borderColor: alerta.tipo === "crítica" ? BRAND.orange : alerta.tipo === "advertencia" ? BRAND.yellow : BRAND.blue,
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
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400 italic">No hay alertas de seguridad recientes</p>
                </div>
              )}
            </div>
            <Link
              to="/administracion"
              className="block w-full mt-4 py-2 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition"
              style={{ color: BRAND.blue }}
            >
              Ver historial de seguridad
            </Link>
          </div>
        </div>

        {/* Columna Derecha (1/3) */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Resumen Eco - PASA ARRIBA A LA DERECHA */}
          <div className="bg-[#2C67B0] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-full flex flex-col justify-center min-h-[300px]">
            {/* Elemento decorativo de fondo */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#B1D357] opacity-20 rounded-full"></div>

            <h3 className="text-lg font-bold mb-4 relative z-10 flex items-center gap-2">
              <Leaf size={20} className="text-[#B1D357]" /> Resumen Eco
            </h3>
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

      {/* Métricas de Impacto Ambiental - PASA ABAJO EN ANCHO COMPLETO */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
          <Activity className="text-green-500" /> Métricas de Impacto Ambiental
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