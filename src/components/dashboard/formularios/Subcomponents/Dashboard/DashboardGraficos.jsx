import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  AlertTriangle,
  History,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar
} from "lucide-react";
import formsApi from "../../../../../api/formsApi";
import { toast } from "react-hot-toast";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  lightBlue: "#7FB8D9",  // Azul Claro
  lime: "#B1D357",       // Verde Lima
  green: "#00AB6D",      // Verde Principal
};

const CHART_COLORS = [BRAND.blue, BRAND.green, BRAND.lime, BRAND.lightBlue];

export default function DashboardGraficos() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await formsApi.getStats();
      setStats(response.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const cards = useMemo(() => [
    {
      title: "Formularios Totales",
      value: stats?.total_forms || 0,
       icono: <ClipboardList size={22} />,
      bgIcon: "bg-[#2C67B0]/10",
      color: BRAND.blue
    },
    {
      title: "Respuestas Recibidas",
      value: stats?.total_submissions || 0,
      icono: <FileCheck size={22} />,
      bgIcon: "bg-[#B1D357]/15",
      color: BRAND.green
    },
    {
      title: "Formularios Publicados",
      value: stats?.published_forms || 0,
      icono: <TrendingUp size={22} />,
      bgIcon: `bg-[${BRAND.lightBlue}]/10`,
      color: BRAND.lightBlue
    },
    {
      title: "Borradores",
      value: stats?.draft_forms || 0,
      icono: <History size={22} />,
      bgIcon: `bg-[${BRAND.blue}]/20`,
      color: BRAND.blue
    }
  ], [stats]);

  if (loading && !stats) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: BRAND.blue }}></div>
            <p className="mt-4 text-gray-500 font-medium">Cargando estadísticas...</p>
        </div>
     );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans text-gray-700 animate-in fade-in duration-500">
      
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3" style={{ color: BRAND.blue }}>
            <LayoutDashboard className="text-blue-500" size={32} />
            Dashboard de Gestión
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Métricas clave de formularios y participación</p>
        </div>
        <button 
           onClick={fetchStats}
           className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95"
        >
            <Calendar size={16} style={{ color: BRAND.lime }} />
            Actualizar Datos
        </button>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-500" style={{ textDecorationColor: BRAND.lime, textDecorationLine: 'underline', textDecorationThickness: '2px' }}>
                  {card.title}
                </p>
                <h3 className="text-3xl font-black mt-2 leading-none" style={{ color: BRAND.blue }}>
                  {card.value.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-2xl ${card.bgIcon} transition-transform group-hover:scale-110 duration-300`}>
                {React.cloneElement(card.icono, { style: { color: card.color } })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos de Distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Distribución por Categoría */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <PieChartIcon className="text-emerald-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Distribución por Categoría</h2>
           </div>
           
           <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={0}>
                <PieChart>
                  <Pie
                    data={stats?.categories_distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(stats?.categories_distribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Estado de Formularios */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 className="text-blue-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Estado de los Formularios</h2>
           </div>
           
           <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={0}>
                <PieChart>
                  <Pie
                    data={stats?.status_distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(stats?.status_distribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? BRAND.blue : BRAND.lightBlue} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>

      </div>

      {/* Tendencia y Top 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Tendencia de Envíos */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-50 rounded-lg">
                    <BarChart3 className="text-indigo-600" size={20} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-800">Tendencia de Participación</h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                 Últimos 6 meses
              </span>
           </div>

           <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={0}>
                 <BarChart data={stats?.submissions_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: BRAND.gray, fontSize: 11, fontWeight: 600 }} 
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: BRAND.gray, fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip 
                       cursor={{ fill: '#F9FAFB' }}
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar 
                       dataKey="total" 
                       name="Envíos" 
                       fill={BRAND.blue} 
                       radius={[6, 6, 0, 0]} 
                       barSize={32}
                    />
                 </BarChart>
              </ResponsiveContainer>
              {(!stats?.submissions_trend || stats.submissions_trend.length === 0) && (
                <div className="flex h-full items-center justify-center -mt-[300px]">
                   <p className="text-gray-400 italic text-sm">No hay datos históricos suficientes</p>
                </div>
              )}
           </div>
        </div>

        {/* Top Formularios */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertTriangle className="text-amber-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Más Utilizados</h2>
           </div>

           <div className="flex-1 space-y-4">
              {(stats?.top_forms || []).map((form, idx) => (
                <div key={idx} className="group p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 hover:border-gray-100 transition-all duration-300">
                   <div className="flex justify-between items-start mb-2">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                          form.category === 'normativo' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          form.category === 'periodico' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-green-50 text-green-600 border-green-100'
                       }`}>
                          {form.category || 'Encuesta'}
                       </span>
                       <span className="text-xs font-bold text-gray-400">
                          {form.count} respuestas
                       </span>
                   </div>
                   <h4 className="text-sm font-bold text-gray-700 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {form.title}
                   </h4>
                   
                   {/* Mini progress bar decoration */}
                   <div className="mt-3 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div 
                         className="h-full rounded-full transition-all duration-1000"
                         style={{ 
                            width: `${(form.count / (stats?.top_forms[0]?.count || 1)) * 100}%`,
                            backgroundColor: idx === 0 ? BRAND.blue : idx === 1 ? BRAND.green : BRAND.lightBlue
                         }}
                      />
                   </div>
                </div>
              ))}
              {(!stats?.top_forms || stats.top_forms.length === 0) && (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
                   <ClipboardList size={40} className="text-gray-300 mb-2" />
                   <p className="text-xs text-gray-400">Aún no hay respuestas registradas</p>
                </div>
              )}
           </div>
        </div>

      </div>

    </div>
  );
}
