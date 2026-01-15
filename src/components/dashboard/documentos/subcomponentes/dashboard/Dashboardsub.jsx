import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  FileText,
  Clock,
  HardDrive,
  Files,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getDocuments } from "../../../../../api/documentsApi";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja
  yellow: "#E8AD00",     // Amarillo
  gray: "#6B7280",       // Gris neutro
  lightGray: "#F3F4F6",  // Fondo claro
};

// Document type mapping
const documentTypes = [
  { id: "1", name: "Normas y Políticas" },
  { id: "2", name: "Formatos" },
  { id: "3", name: "Actas" },
  { id: "4", name: "Pesajes" },
  { id: "5", name: "Contratos" }
];

// Función auxiliar para obtener estilos según el estado
const getStatusStyles = (status) => {
  switch (status) {
    case "approved":
      return { bg: "#E9F5E9", text: BRAND.darkGreen, icon: <CheckCircle2 size={14} />, label: "Aprobado" };
    case "pending_review":
      return { bg: "#EFF6FF", text: BRAND.orange, icon: <Clock size={14} />, label: "Pendiente" };
    case "draft":
      return { bg: "#FFFBEB", text: BRAND.yellow, icon: <AlertCircle size={14} />, label: "Borrador" };
    case "expired":
      return { bg: "#F3F4F6", text: BRAND.gray, icon: <AlertCircle size={14} />, label: "Expirado" };
    default:
      return { bg: "#F3F4F6", text: BRAND.gray, icon: null, label: status };
  }
};

export default function Dashboardsub() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    pendingReview: 0,
    approved: 0
  });
  const [statusData, setStatusData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDocuments();

        let docsArray = [];
        if (response?.data?.items && Array.isArray(response.data.items)) {
          docsArray = response.data.items;
        } else if (Array.isArray(response?.data)) {
          docsArray = response.data;
        } else if (Array.isArray(response)) {
          docsArray = response;
        }

        setDocuments(docsArray);

        // Calculate statistics
        const total = docsArray.length;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const thisWeek = docsArray.filter(doc =>
          new Date(doc.created_at) >= oneWeekAgo
        ).length;

        const pendingReview = docsArray.filter(doc =>
          doc.status === 'pending_review'
        ).length;

        const approved = docsArray.filter(doc =>
          doc.status === 'approved'
        ).length;

        setStats({ total, thisWeek, pendingReview, approved });

        // Calculate status distribution
        const statusCounts = {};
        docsArray.forEach(doc => {
          const status = doc.status || 'unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const statusMapping = {
          'approved': { name: 'Aprobado', color: BRAND.darkGreen },
          'draft': { name: 'Borrador', color: BRAND.yellow },
          'pending_review': { name: 'Pendiente Revisión', color: BRAND.orange },
          'expired': { name: 'Expirado', color: BRAND.gray }
        };

        const statusChartData = Object.entries(statusCounts).map(([key, value]) => ({
          name: statusMapping[key]?.name || key,
          value: value,
          color: statusMapping[key]?.color || BRAND.gray
        }));

        setStatusData(statusChartData);

        // Calculate type distribution
        const typeCounts = {};
        docsArray.forEach(doc => {
          const typeId = doc.document_type_id;
          const typeName = documentTypes.find(t => t.id === typeId)?.name || `Tipo ${typeId}`;
          typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
        });

        const typeChartData = Object.entries(typeCounts).map(([name, value]) => ({
          name,
          value
        }));

        setTypeData(typeChartData);

        // Calculate monthly uploads (last 6 months)
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const now = new Date();
        const monthlyUploads = {};

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
          monthlyUploads[key] = 0;
        }

        // Count documents by month
        docsArray.forEach(doc => {
          const docDate = new Date(doc.created_at);
          const key = `${monthNames[docDate.getMonth()]} ${docDate.getFullYear()}`;
          if (monthlyUploads.hasOwnProperty(key)) {
            monthlyUploads[key]++;
          }
        });

        const monthlyChartData = Object.entries(monthlyUploads).map(([name, value]) => ({
          name,
          value
        }));

        setMonthlyData(monthlyChartData);

        // Get recent documents (last 5)
        const sorted = [...docsArray].sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
        setRecentDocs(sorted.slice(0, 5));

      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const estadisticas = [
    {
      title: "Total de Documentos",
      value: loading ? "..." : stats.total.toString(),
      icon: <Files size={24} color="#FFF" />,
      bg: BRAND.blue
    },
    {
      title: "Nuevos esta Semana",
      value: loading ? "..." : stats.thisWeek.toString(),
      icon: <FileText size={24} color="#FFF" />,
      bg: BRAND.darkGreen
    },
    {
      title: "Pendientes Revisión",
      value: loading ? "..." : stats.pendingReview.toString(),
      icon: <Clock size={24} color="#FFF" />,
      bg: BRAND.orange
    },
    {
      title: "Aprobados",
      value: loading ? "..." : stats.approved.toString(),
      icon: <CheckCircle2 size={24} color="#FFF" />,
      bg: BRAND.darkBlue
    },
  ];

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return `Hace ${diffDays} días`;
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">

      {/* Título de la sección */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: BRAND.darkBlue }}>
          Gestión Documental
        </h1>
        <p className="text-gray-500 text-sm">Resumen de archivos y actividad reciente</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Estadísticas Generales */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
            <Files size={20} className="text-gray-400" /> Métricas Clave
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {estadisticas.map((item, index) => (
              <div
                key={index}
                className="rounded-xl p-5 text-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                style={{ backgroundColor: item.bg }}
              >
                {/* Decoración de fondo */}
                <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
                  {React.cloneElement(item.icon, { size: 60 })}
                </div>

                <div className="relative z-10">
                  <div className="mb-3 opacity-90">{item.icon}</div>
                  <p className="text-xs font-medium uppercase tracking-wide opacity-80 mb-1">{item.title}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por Estado (Pie Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-2 text-center" style={{ color: BRAND.darkBlue }}>
            Estado de Documentos
          </h2>
          {loading || statusData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-gray-400">
              {loading ? "Cargando..." : "No hay datos disponibles"}
            </div>
          ) : (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-gray-600 text-sm ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Documentos por Mes (Bar Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: BRAND.darkBlue }}>
            Documentos Subidos por Mes
          </h2>
          {loading || monthlyData.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              {loading ? "Cargando..." : "No hay datos disponibles"}
            </div>
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar
                    dataKey="value"
                    fill={BRAND.darkGreen}
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Documentos Recientes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold" style={{ color: BRAND.darkBlue }}>
              Archivos Recientes
            </h2>
            <button className="text-sm font-medium hover:underline" style={{ color: BRAND.blue }}>
              Ver todo
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Cargando...</div>
            ) : recentDocs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No hay documentos recientes</div>
            ) : (
              recentDocs.map((doc, index) => {
                const docType = documentTypes.find(t => t.id === doc.document_type_id);
                const statusStyle = getStatusStyles(doc.status);
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-blue-200 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icono del tipo de archivo */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm"
                        style={{ backgroundColor: `${BRAND.blue}15`, color: BRAND.blue }}
                      >
                        PDF
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate max-w-[180px] sm:max-w-xs">
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="font-medium text-gray-600">{docType?.name || 'Documento'}</span>
                          <span>•</span>
                          <span>{getTimeAgo(doc.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          borderColor: 'transparent'
                        }}
                      >
                        {statusStyle.icon}
                        {statusStyle.label}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}