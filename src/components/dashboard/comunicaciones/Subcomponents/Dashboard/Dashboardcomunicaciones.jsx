import React, { useState, useEffect } from "react";
import {
  PenTool,
  Calendar,
  Activity,
  Briefcase,
  FileText,
  PieChart as PieIcon,
  BarChart2
} from "lucide-react";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LabelList
} from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { getAllCategories } from "../../../../../api/categoriesApi";
import { getAllNews } from "../../../../../api/newsApi";
import { getAllSchedules } from "../../../../../api/scheduleApi";
import { getAllProjects } from "../../../../../api/projectsApi";
import { getDocuments } from "../../../../../api/documentsApi";

const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  lightBlue: "#7FB8D9",  // Azul Claro
  lime: "#B1D357",       // Verde Lima
  green: "#00AB6D",      // Verde Principal
};

export default function DashboardContenido() {
  const [categoryStats, setCategoryStats] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [metrics, setMetrics] = useState({
    news: 0,
    events: 0,
    projects: 0,
    documents: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Realizar peticiones balanceadas: 1 para totales, y una muestra para gráficas/actividad
        const [resCats, resNews, resScheds, resProjs, resDocs] = await Promise.all([
          getAllCategories({ per_page: 1000 }).catch(() => ({ data: [] })),
          getAllNews({ per_page: 1000 }).catch(() => ({ data: [] })),
          getAllSchedules(1, 1000).catch(() => ({ data: [] })),
          getAllProjects({ per_page: 1000 }).catch(() => ({ data: [] })),
          getDocuments({ per_page: 1000 }).catch(() => ({ data: [] }))
        ]);

        const categories = Array.isArray(resCats) ? resCats : (resCats?.data?.items || resCats?.data || []);
        const news = Array.isArray(resNews?.data?.news) ? resNews.data.news : (resNews?.data || []);
        const schedules = Array.isArray(resScheds?.data?.schedules) ? resScheds.data.schedules : (resScheds?.data?.items || resScheds?.data || []);
        const projects = Array.isArray(resProjs?.data?.items) ? resProjs.data.items : (resProjs?.data || []);
        const documents = Array.isArray(resDocs?.data?.items) ? resDocs.data.items : (resDocs?.data || []);

        // Contar SOLO los publicados (excluir borradores)
        setMetrics({
          news: news.filter(i => i.status === 'published').length,
          events: schedules.filter(i => i.status === 'published' || i.status === 'active' || i.status === 'scheduled').length,
          projects: projects.filter(i => i.status === 'published').length,
          documents: documents.filter(i => i.status === 'published').length,
          categories: categories.length
        });
        
        // Re-calcular estadísticas por categoría (Muestra de los últimos 50)
        const statsMap = {};
        categories.forEach(cat => {
          statsMap[cat.id] = { name: cat.name, Noticias: 0, Eventos: 0, Proyectos: 0, Documentos: 0 };
        });

        news.forEach(item => {
          const catId = item.category_id || item.category?.id;
          if (catId && statsMap[catId]) statsMap[catId].Noticias++;
        });

        schedules.forEach(item => {
          const catId = item.category_id || item.category?.id;
          if (catId && statsMap[catId]) statsMap[catId].Eventos++;
        });

        projects.forEach(item => {
          const catId = item.category_id || item.category?.id;
          if (catId && statsMap[catId]) statsMap[catId].Proyectos++;
        });

        documents.forEach(item => {
          const catId = item.category_id || item.category?.id;
          if (catId && statsMap[catId]) statsMap[catId].Documentos++;
        });

        setCategoryStats(Object.values(statsMap));

        const pData = [
          { name: "Noticias", value: resNews.data?.total || resNews.total || news.length },
          { name: "Eventos", value: resScheds.data?.total || resScheds.total || schedules.length },
          { name: "Proyectos", value: resProjs.data?.total || resProjs.total || projects.length },
          { name: "Documentos", value: resDocs.data?.total || resDocs.total || documents.length },
        ].filter(item => item.value > 0);
        setPieData(pData);

        // Actividad Reciente combinada (Muestra)
        const allItems = [
          ...news.slice(0, 5).map(i => ({ ...i, type: "Noticia", date: i.created_at })),
          ...schedules.slice(0, 5).map(i => ({ ...i, type: "Evento", date: i.created_at })),
          ...projects.slice(0, 5).map(i => ({ ...i, type: "Proyecto", date: i.created_at })),
          ...documents.slice(0, 5).map(i => ({ ...i, type: "Documento", date: i.created_at }))
        ];
        allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentActivity(allItems.slice(0, 5));

      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (type) => {
    switch (type) {
      case "Noticia": return BRAND.blue;
      case "Evento": return BRAND.green;
      case "Proyecto": return BRAND.lime;
      case "Documento": return BRAND.lightBlue;
      default: return "#9ca3af";
    }
  };

  const metricItems = [
    { title: "Noticias Publicadas", value: metrics.news, Icon: PenTool, color: BRAND.blue },
    { title: "Evento Programados", value: metrics.events, Icon: Calendar, color: BRAND.green },
    { title: "Proyectos Activos", value: metrics.projects, Icon: Briefcase, color: BRAND.lime },
    { title: "Documentos Subidos", value: metrics.documents, Icon: FileText, color: BRAND.lightBlue },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 mb-4" style={{ borderColor: BRAND.blue }}></div>
        <p className="text-gray-500 font-medium">Cargando tablero...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700 space-y-8">
      {/* 1. Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricItems.map((item, index) => {
          const Icon = item.Icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">{item.title}</p>
                <h4 className="text-3xl font-bold" style={{ color: item.color }}>{item.value}</h4>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <Icon size={24} style={{ color: item.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Bar Chart (Category Stats) */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="mb-8">
          <h3 className="text-xl font-bold flex items-center gap-3" style={{ color: BRAND.blue }}>
            <BarChart2 size={24} className="text-gray-400" /> Estadísticas por Categoría (Reciente)
          </h3>
          <p className="text-sm text-gray-500 mt-1">Distribución de los últimos 50 contenidos por temática</p>
        </div>
        {categoryStats.length > 0 ? (
          <div className="overflow-y-auto pr-4 custom-scrollbar" style={{ maxHeight: "800px" }}>
            <div style={{ height: `${Math.max(450, categoryStats.length * 100)}px`, minWidth: "600px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryStats}
                  layout="vertical"
                  margin={{ top: 20, right: 40, left: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" stroke="#6B7280" style={{ fontSize: "14px", fontWeight: "600" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#6B7280"
                    style={{ fontSize: "14px", fontWeight: "700" }}
                    width={220}
                    tick={{ fill: BRAND.blue }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  />
                  <Legend verticalAlign="top" align="right" height={40} wrapperStyle={{ paddingBottom: "30px" }} />
                  <Bar dataKey="Noticias" fill={BRAND.blue} radius={[0, 6, 6, 0]} barSize={35}>
                    <LabelList dataKey="Noticias" position="right" style={{ fill: BRAND.blue, fontSize: '12px', fontWeight: 'bold' }} />
                  </Bar>
                  <Bar dataKey="Eventos" fill={BRAND.green} radius={[0, 6, 6, 0]} barSize={35}>
                    <LabelList dataKey="Eventos" position="right" style={{ fill: BRAND.green, fontSize: '12px', fontWeight: 'bold' }} />
                  </Bar>
                  <Bar dataKey="Proyectos" fill={BRAND.lime} radius={[0, 6, 6, 0]} barSize={35}>
                    <LabelList dataKey="Proyectos" position="right" style={{ fill: BRAND.lime, fontSize: '12px', fontWeight: 'bold' }} />
                  </Bar>
                  <Bar dataKey="Documentos" fill={BRAND.lightBlue} radius={[0, 6, 6, 0]} barSize={35}>
                    <LabelList dataKey="Documentos" position="right" style={{ fill: BRAND.lightBlue, fontSize: '12px', fontWeight: 'bold' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm italic">No hay datos suficientes para mostrar la distribución por categoría</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Pie Chart (Content Distribution) */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: BRAND.blue }}>
              <PieIcon size={20} className="text-gray-400" /> Mix de Contenidos
            </h3>
            <p className="text-xs text-gray-500 mt-1">Proporción por tipo de contenido</p>
          </div>
          {pieData.length > 0 ? (
            <div className="h-[350px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[BRAND.blue, BRAND.green, BRAND.lime, BRAND.lightBlue][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, "Cantidad"]}
                    contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm italic">No hay datos disponibles</div>
          )}
        </div>

        {/* 4. Recent Activity List */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: BRAND.blue }}>
                <Activity size={20} className="text-gray-400" /> Actividad Reciente
              </h3>
              <p className="text-xs text-gray-500 mt-1">Últimos contenidos creados en la plataforma</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                  <th className="py-4 px-2 font-bold tracking-wider">Tipo</th>
                  <th className="py-4 px-2 font-bold tracking-wider">Título / Nombre</th>
                  <th className="py-4 px-2 font-bold tracking-wider text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm italic">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-2 font-semibold" style={{ color: getStatusColor(item.type) }}>
                        {item.type}
                      </td>
                      <td className="py-4 px-2 text-gray-800 font-medium not-italic">{item.name || item.title || "Sin título"}</td>
                      <td className="py-4 px-2 text-right not-italic">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-gray-400">No hay actividad reciente registrada</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
