import React, { useState, useEffect } from "react";
import {
  Server,
  Zap,
  Database,

  PenTool,
  Calendar,
  Mail,
  FileImage,
  MoreHorizontal,
  ArrowUpRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  Tag,
  Briefcase,
  FileText
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getAllCategories } from "../../../../../api/categoriesApi";
import { getAllNews } from "../../../../../api/newsApi";
import { getAllSchedules } from "../../../../../api/scheduleApi";
import { getAllProjects } from "../../../../../api/projectsApi";
import { getDocuments } from "../../../../../api/documentsApi";

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

const COLORS = [BRAND.blue, BRAND.darkGreen, BRAND.orange, BRAND.yellow];

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

        // Fetch all data - increase per_page for schedules to get all events
        const [categoriesRes, newsRes, schedulesRes, projectsRes, documentsRes] = await Promise.all([
          getAllCategories(),
          getAllNews(),
          getAllSchedules(1, 100), // Fetch up to 100 events
          getAllProjects(),
          getDocuments()
        ]);

        // Extract arrays from responses (using robust extraction logic from before)
        let categories = [];
        if (Array.isArray(categoriesRes)) categories = categoriesRes;
        else if (categoriesRes?.data?.items && Array.isArray(categoriesRes.data.items)) categories = categoriesRes.data.items;
        else if (categoriesRes?.data && Array.isArray(categoriesRes.data)) categories = categoriesRes.data;
        else if (categoriesRes?.categories && Array.isArray(categoriesRes.categories)) categories = categoriesRes.categories;

        let news = [];
        if (Array.isArray(newsRes)) news = newsRes;
        else if (newsRes?.data?.news && Array.isArray(newsRes.data.news)) news = newsRes.data.news;
        else if (newsRes?.data && Array.isArray(newsRes.data)) news = newsRes.data;
        else if (newsRes?.news && Array.isArray(newsRes.news)) news = newsRes.news;

        let schedules = [];
        if (schedulesRes?.data?.schedules && Array.isArray(schedulesRes.data.schedules)) schedules = schedulesRes.data.schedules;
        else if (Array.isArray(schedulesRes)) schedules = schedulesRes;
        else if (schedulesRes?.data?.items && Array.isArray(schedulesRes.data.items)) schedules = schedulesRes.data.items;
        else if (schedulesRes?.data?.data && Array.isArray(schedulesRes.data.data)) schedules = schedulesRes.data.data;
        else if (schedulesRes?.data && Array.isArray(schedulesRes.data)) schedules = schedulesRes.data;

        let projects = [];
        if (Array.isArray(projectsRes)) projects = projectsRes;
        else if (projectsRes?.data?.items && Array.isArray(projectsRes.data.items)) projects = projectsRes.data.items;
        else if (projectsRes?.data && Array.isArray(projectsRes.data)) projects = projectsRes.data;
        else if (projectsRes?.projects && Array.isArray(projectsRes.projects)) projects = projectsRes.projects;

        let documents = [];
        if (documentsRes?.data?.items && Array.isArray(documentsRes.data.items)) documents = documentsRes.data.items;
        else if (Array.isArray(documentsRes?.data)) documents = documentsRes.data;
        else if (Array.isArray(documentsRes)) documents = documentsRes;

        // --- 1. Metrics ---
        setMetrics({
          news: news.length,
          events: schedules.length,
          projects: projects.length,
          documents: documents.length,
          categories: categories.length
        });

        // --- 2. Category Stats (Bar Chart) ---
        const statsMap = {};
        categories.forEach(cat => {
          statsMap[cat.id] = { name: cat.name, Noticias: 0, Eventos: 0, Proyectos: 0, Documentos: 0 };
        });

        news.forEach(item => {
          const catId = item.category_id || (item.category?.id);
          if (catId && statsMap[catId]) statsMap[catId].Noticias++;
        });

        schedules.forEach(item => {
          const catId = item.category_id || (item.category?.id);
          if (catId && statsMap[catId]) statsMap[catId].Eventos++;
        });

        projects.forEach(item => {
          const catId = item.category_id || (item.category?.id);
          if (catId && statsMap[catId]) statsMap[catId].Proyectos++;
        });

        documents.forEach(item => {
          const catId = item.category_id || (item.category?.id);
          if (catId && statsMap[catId]) statsMap[catId].Documentos++;
        });

        setCategoryStats(Object.values(statsMap));

        // --- 3. Content Distribution (Pie Chart) ---
        const pData = [
          { name: 'Noticias', value: news.length },
          { name: 'Eventos', value: schedules.length },
          { name: 'Proyectos', value: projects.length },
          { name: 'Documentos', value: documents.length },
        ].filter(item => item.value > 0);
        setPieData(pData);

        // --- 4. Recent Activity ---
        const allItems = [
          ...news.map(i => ({ ...i, type: 'Noticia', dataType: 'news', date: i.created_at })),
          ...schedules.map(i => ({ ...i, type: 'Evento', dataType: 'event', date: i.created_at })),
          ...projects.map(i => ({ ...i, type: 'Proyecto', dataType: 'project', date: i.created_at })),
          ...documents.map(i => ({ ...i, type: 'Documento', dataType: 'document', date: i.created_at }))
        ];
        // Sort by date desc
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
      case 'Noticia': return BRAND.blue;
      case 'Evento': return BRAND.darkGreen;
      case 'Proyecto': return BRAND.orange;
      case 'Documento': return BRAND.yellow;
      default: return BRAND.gray;
    }
  };

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
        {[
          { title: "Noticias Publicadas", value: metrics.news, icon: <PenTool size={24} />, color: BRAND.blue },
          { title: "Eventos Programados", value: metrics.events, icon: <Calendar size={24} />, color: BRAND.darkGreen },
          { title: "Proyectos Activos", value: metrics.projects, icon: <Briefcase size={24} />, color: BRAND.orange },
          { title: "Documentos Subidos", value: metrics.documents, icon: <FileText size={24} />, color: BRAND.yellow },
        ].map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">{metric.title}</p>
              <h4 className="text-3xl font-bold" style={{ color: metric.color }}>{metric.value}</h4>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 text-gray-400">
              {React.cloneElement(metric.icon, { style: { color: metric.color } })}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Bar Chart (Category Stats) - Full Width */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
            <BarChart3 size={20} className="text-gray-400" /> Estadísticas por Categoría
          </h3>
          <p className="text-xs text-gray-500 mt-1">Distribución de contenidos por temática</p>
        </div>
        {categoryStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px', fontWeight: '500' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px', fontWeight: '500' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Noticias" fill={BRAND.blue} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Eventos" fill={BRAND.darkGreen} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Proyectos" fill={BRAND.orange} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Documentos" fill={BRAND.yellow} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No hay datos suficientes</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Pie Chart (Content Distribution) */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <PieChartIcon size={20} className="text-gray-400" /> Mix de Contenidos
            </h3>
            <p className="text-xs text-gray-500 mt-1">Proporción por tipo de contenido</p>
          </div>
          {pieData.length > 0 ? (
            <div className="h-[350px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[BRAND.blue, BRAND.darkGreen, BRAND.orange, BRAND.yellow][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, "Cantidad"]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No hay datos suficientes</div>
          )}
        </div>

        {/* 4. Recent Activity List */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
                <Activity size={20} className="text-gray-400" /> Actividad Reciente
              </h3>
              <p className="text-xs text-gray-500 mt-1">Últimos contenidos creados en la plataforma</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                  <th className="py-3 font-semibold">Tipo</th>
                  <th className="py-3 font-semibold">Título / Nombre</th>
                  <th className="py-3 font-semibold text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, index) => (
                    <tr key={`${item.dataType}-${item.id}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-medium" style={{ color: getStatusColor(item.type) }}>
                        {item.type}
                      </td>
                      <td className="py-4 text-gray-800 font-medium">{item.name || item.title || "Sin título"}</td>
                      <td className="py-4 text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-400">No hay actividad reciente registrada</td>
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


