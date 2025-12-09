import React from "react";
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

// Datos de ejemplo
const estadisticas = [
  { 
    title: "Total de Documentos", 
    value: "1,532", 
    icon: <Files size={24} color="#FFF" />,
    bg: BRAND.blue 
  },
  { 
    title: "Nuevos esta Semana", 
    value: "40", 
    icon: <FileText size={24} color="#FFF" />,
    bg: BRAND.darkGreen 
  },
  { 
    title: "Pendientes Revisión", 
    value: "12", 
    icon: <Clock size={24} color="#FFF" />,
    bg: BRAND.orange 
  },
  { 
    title: "Espacio Usado", 
    value: "5.5GB", 
    icon: <HardDrive size={24} color="#FFF" />,
    bg: BRAND.darkBlue 
  },
];

const dataEstado = [
  { name: "Publicado", value: 400, color: BRAND.darkGreen },
  { name: "Borrador", value: 100, color: BRAND.yellow },
  { name: "En Revisión", value: 200, color: BRAND.blue },
  { name: "Privado", value: 150, color: BRAND.darkBlue },
  { name: "Archivado", value: 80, color: BRAND.gray },
];

const dataTipo = [
  { name: "PDF", value: 580 },
  { name: "DOCX", value: 300 },
  { name: "XLSX", value: 220 },
  { name: "PPTX", value: 160 },
  { name: "IMG", value: 120 },
  { name: "MP4", value: 80 },
];

const documentos = [
  {
    titulo: "Guía de Implementación Economía Circular",
    autor: "Jesús Felipe",
    tiempo: "Hace 2 horas",
    estado: "Publicado",
    tipo: "PDF",
  },
  {
    titulo: "Reporte de Sostenibilidad Q3",
    autor: "Ana Gómez",
    tiempo: "Hace 7 horas",
    estado: "Revisión",
    tipo: "DOCX",
  },
  {
    titulo: "Matriz de Indicadores Ambientales",
    autor: "Carlos Ruiz",
    tiempo: "Hace 1 día",
    estado: "Borrador",
    tipo: "XLSX",
  },
  {
    titulo: "Presentación Junta Directiva",
    autor: "Jesús Felipe",
    tiempo: "Hace 2 días",
    estado: "Publicado",
    tipo: "PPTX",
  },
];

// Función auxiliar para obtener estilos según el estado
const getStatusStyles = (status) => {
  switch (status) {
    case "Publicado":
      return { bg: "#E9F5E9", text: BRAND.darkGreen, icon: <CheckCircle2 size={14}/> };
    case "Revisión":
      return { bg: "#EFF6FF", text: BRAND.blue, icon: <Clock size={14}/> };
    case "Borrador":
      return { bg: "#FFFBEB", text: BRAND.yellow, icon: <AlertCircle size={14}/> };
    default:
      return { bg: "#F3F4F6", text: BRAND.gray, icon: null };
  }
};

export default function Dashboardsub() {
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
            <Files size={20} className="text-gray-400"/> Métricas Clave
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
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataEstado}
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
                  {dataEstado.map((entry, index) => (
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
        </div>

        {/* Distribución por Tipo (Bar Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: BRAND.darkBlue }}>
            Formatos de Archivo
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTipo} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 12}} 
                />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill={BRAND.blue} 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
            {documentos.map((doc, index) => {
              const statusStyle = getStatusStyles(doc.estado);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-blue-200 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    {/* Icono del tipo de archivo */}
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm"
                      style={{ backgroundColor: `${BRAND.blue}15`, color: BRAND.blue }}
                    >
                      {doc.tipo}
                    </div>
                    
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate max-w-[180px] sm:max-w-xs">
                        {doc.titulo}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="font-medium text-gray-600">{doc.autor}</span>
                        <span>•</span>
                        <span>{doc.tiempo}</span>
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
                      {doc.estado}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}