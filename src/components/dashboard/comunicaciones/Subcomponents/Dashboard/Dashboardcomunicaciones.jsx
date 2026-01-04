import React, { useState, useEffect } from "react";
import {
  Server,
  Zap,
  Database,
  Clock,
  PenTool,
  Calendar,
  Mail,
  FileImage,
  MoreHorizontal,
  ArrowUpRight,
  BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAllCategories } from "../../../../../api/categoriesApi";
import { getAllNews } from "../../../../../api/newsApi";
import { getAllSchedules } from "../../../../../api/scheduleApi";
import { getAllProjects } from "../../../../../api/projectsApi";

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

export default function DashboardContenido() {
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data - increase per_page for schedules to get all events
        const [categoriesRes, newsRes, schedulesRes, projectsRes] = await Promise.all([
          getAllCategories(),
          getAllNews(),
          getAllSchedules(1, 100), // Fetch up to 100 events
          getAllProjects()
        ]);

        console.log("=== RAW API RESPONSES ===");
        console.log("Categories Response:", categoriesRes);
        console.log("News Response:", newsRes);
        console.log("Schedules Response:", schedulesRes);
        console.log("Schedules Response.data:", schedulesRes?.data);
        console.log("Schedules Response.data keys:", schedulesRes?.data ? Object.keys(schedulesRes.data) : 'N/A');
        console.log("Projects Response:", projectsRes);

        // Extract arrays from responses - try multiple paths
        let categories = [];
        if (Array.isArray(categoriesRes)) {
          categories = categoriesRes;
        } else if (categoriesRes?.data?.items && Array.isArray(categoriesRes.data.items)) {
          categories = categoriesRes.data.items;
        } else if (categoriesRes?.data && Array.isArray(categoriesRes.data)) {
          categories = categoriesRes.data;
        } else if (categoriesRes?.categories && Array.isArray(categoriesRes.categories)) {
          categories = categoriesRes.categories;
        }

        let news = [];
        if (Array.isArray(newsRes)) {
          news = newsRes;
        } else if (newsRes?.data?.news && Array.isArray(newsRes.data.news)) {
          news = newsRes.data.news;
        } else if (newsRes?.data && Array.isArray(newsRes.data)) {
          news = newsRes.data;
        } else if (newsRes?.news && Array.isArray(newsRes.news)) {
          news = newsRes.news;
        }

        let schedules = [];
        if (schedulesRes?.data?.schedules && Array.isArray(schedulesRes.data.schedules)) {
          schedules = schedulesRes.data.schedules;
        } else if (Array.isArray(schedulesRes)) {
          schedules = schedulesRes;
        } else if (schedulesRes?.data?.items && Array.isArray(schedulesRes.data.items)) {
          schedules = schedulesRes.data.items;
        } else if (schedulesRes?.data?.data && Array.isArray(schedulesRes.data.data)) {
          schedules = schedulesRes.data.data;
        } else if (schedulesRes?.data && Array.isArray(schedulesRes.data)) {
          schedules = schedulesRes.data;
        } else if (schedulesRes?.schedules && Array.isArray(schedulesRes.schedules)) {
          schedules = schedulesRes.schedules;
        } else if (schedulesRes?.items && Array.isArray(schedulesRes.items)) {
          schedules = schedulesRes.items;
        }

        let projects = [];
        if (Array.isArray(projectsRes)) {
          projects = projectsRes;
        } else if (projectsRes?.data?.items && Array.isArray(projectsRes.data.items)) {
          projects = projectsRes.data.items;
        } else if (projectsRes?.data && Array.isArray(projectsRes.data)) {
          projects = projectsRes.data;
        } else if (projectsRes?.projects && Array.isArray(projectsRes.projects)) {
          projects = projectsRes.projects;
        }

        console.log("=== EXTRACTED ARRAYS ===");
        console.log("Categories:", categories);
        console.log("News:", news);
        console.log("Schedules:", schedules);
        console.log("Projects:", projects);

        // Create a map to count items by category
        const statsMap = {};

        // Initialize with all categories
        categories.forEach(cat => {
          statsMap[cat.id] = {
            name: cat.name,
            Noticias: 0,
            Eventos: 0,
            Proyectos: 0
          };
        });

        console.log("=== INITIAL STATS MAP ===", statsMap);

        // Count news by category
        news.forEach(item => {
          const catId = item.category_id || (item.category?.id);
          console.log(`News "${item.title || item.id}" - category_id: ${catId}`, item);
          if (catId && statsMap[catId]) {
            statsMap[catId].Noticias++;
          } else if (catId) {
            console.warn(`Category ID ${catId} not found in statsMap for news:`, item);
          }
        });

        // Count schedules/events by category
        schedules.forEach(item => {
          const catId = item.category_id || (item.category?.id);
          console.log(`Schedule "${item.title || item.id}" - category_id: ${catId}`, item);
          if (catId && statsMap[catId]) {
            statsMap[catId].Eventos++;
          } else if (catId) {
            console.warn(`Category ID ${catId} not found in statsMap for schedule:`, item);
          }
        });

        // Count projects by category
        projects.forEach(item => {
          const catId = item.category_id || (item.category?.id);
          console.log(`Project "${item.title || item.id}" - category_id: ${catId}`, item);
          if (catId && statsMap[catId]) {
            statsMap[catId].Proyectos++;
          } else if (catId) {
            console.warn(`Category ID ${catId} not found in statsMap for project:`, item);
          }
        });

        console.log("=== FINAL STATS MAP ===", statsMap);

        // Convert to array for recharts
        const statsArray = Object.values(statsMap);
        console.log("=== STATS ARRAY FOR CHART ===", statsArray);

        setCategoryStats(statsArray);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const metricas = [
    { titulo: "Artículos Activos", valor: 145, icon: <PenTool size={20} />, color: BRAND.blue },
    { titulo: "Eventos Activos", valor: 8, icon: <Calendar size={20} />, color: BRAND.darkGreen },
    { titulo: "Newsletter Enviadas", valor: 23, icon: <Mail size={20} />, color: BRAND.orange },
    { titulo: "Engagement Promedio", valor: "7.2%", icon: <Zap size={20} />, color: BRAND.darkBlue },
  ];

  const redes = [
    {
      nombre: "Facebook",
      seguidores: "15,420",
      label: "Seguidores",
      engagement: "7.8%",
      color: "#1877F2",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.797c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.953.93-1.953 1.887v2.259h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      ),
    },
    {
      nombre: "X (Twitter)",
      seguidores: "8,930",
      label: "Seguidores",
      engagement: "7.0%",
      color: "#000000",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.33l-5.2-6.82-5.948 6.82H1.875l7.73-8.86L1.5 2.25h6.445l4.712 6.173L18.244 2.25zM17.1 19.692h1.833L7.002 4.177H5.03L17.1 19.692z" />
        </svg>
      ),
    },
    {
      nombre: "Instagram",
      seguidores: "5,670",
      label: "Seguidores",
      engagement: "7.3%",
      color: "#E4405F",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M7.75 2C4.678 2 2 4.678 2 7.75v8.5C2 19.322 4.678 22 7.75 22h8.5C19.322 22 22 19.322 22 16.25v-8.5C22 4.678 19.322 2 16.25 2h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm6.5.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zM12 9a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
      ),
    },
  ];

  const contenidoPendiente = [
    { titulo: "Economía Circular en el Sector Textil", autor: "Carlos Ruiz", estado: "Pendiente revisión", color: BRAND.orange, bg: "#FFF5EB" },
    { titulo: "Guía de Compostaje Doméstico", autor: "Ana Gómez", estado: "Por publicar", color: BRAND.blue, bg: "#EFF6FF" },
    { titulo: "Reporte de Sostenibilidad Q3", autor: "Equipo Técnico", estado: "Borrador", color: BRAND.gray, bg: "#F3F4F6" },
  ];

  const actividad = [
    { tipo: "Artículo", texto: "‘Innovaciones en Reciclaje’ publicado", time: "Hace 2h", icon: <PenTool size={14} />, color: BRAND.blue },
    { tipo: "Newsletter", texto: "‘EcoFriendly’ enviada a 12.800 suscriptores", time: "Hace 5h", icon: <Mail size={14} />, color: BRAND.darkGreen },
    { tipo: "Evento", texto: "‘Taller de Reaprovechamiento’ creado", time: "Ayer", icon: <Calendar size={14} />, color: BRAND.orange },
  ];

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">

      {/* Estadísticas por Categoría */}
      <div className="mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <BarChart3 size={20} className="text-gray-400" /> Estadísticas por Categoría
            </h3>
            <p className="text-xs text-gray-500 mt-1">Distribución de contenidos por categoría</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 mb-4" style={{ borderColor: BRAND.blue }}></div>
            <p className="text-gray-500 font-medium">Cargando estadísticas...</p>
          </div>
        ) : categoryStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <BarChart3 size={48} className="text-gray-300 mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">No hay datos disponibles</h4>
            <p className="text-sm text-gray-500">Crea categorías y asígnalas a tus contenidos para ver las estadísticas.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                style={{ fontSize: '12px', fontWeight: '500' }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: '12px', fontWeight: '500' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '14px', fontWeight: '600' }}
              />
              <Bar dataKey="Noticias" fill={BRAND.blue} radius={[8, 8, 0, 0]} />
              <Bar dataKey="Eventos" fill={BRAND.darkGreen} radius={[8, 8, 0, 0]} />
              <Bar dataKey="Proyectos" fill={BRAND.orange} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}
