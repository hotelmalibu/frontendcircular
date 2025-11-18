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
} from "recharts";

// Datos de ejemplo
const estadisticas = [
  { title: "Total de Documentos", value: "1532" },
  { title: "Nuevos esta Semana", value: "40" },
  { title: "Pendientes Revisión", value: "12" },
  { title: "Espacio Usado", value: "5.5GB" },
];

const dataEstado = [
  { name: "Publicado", value: 400, color: "#3b82f6" },
  { name: "Borrador", value: 100, color: "#f59e0b" },
  { name: "Esperando Revisión", value: 200, color: "#10b981" },
  { name: "Privado", value: 150, color: "#6b7280" },
  { name: "Archivado", value: 80, color: "#9ca3af" },
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
    titulo: "Guía de Implementación de Economía Circular en PYMES",
    autor: "Jesús Felipe",
    tiempo: "Hace 2 horas",
    estado: "Publicado",
    color: "bg-blue-500",
  },
  {
    titulo: "Guía de Implementación de Economía Circular en PYMES",
    autor: "Jesús Felipe",
    tiempo: "Hace 7 horas",
    estado: "Esperando Revisión",
    color: "bg-emerald-500",
  },
  {
    titulo: "Guía de Implementación de Economía Circular en PYMES",
    autor: "Jesús Felipe",
    tiempo: "Hace 1 día",
    estado: "Publicado",
    color: "bg-blue-500",
  },
  {
    titulo: "Guía de Implementación de Economía Circular en PYMES",
    autor: "Jesús Felipe",
    tiempo: "Hace 2 días",
    estado: "Publicado",
    color: "bg-blue-500",
  },
];

export default function Dashboardsub() {
  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Estadísticas Generales */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Estadísticas Generales
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {estadisticas.map((item, index) => (
            <div
              key={index}
              className="bg-blue-400 text-white rounded-lg py-4 px-6 text-center shadow-sm"
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-2xl font-semibold mt-2">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución por Estado */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
            Distribución por Estado
          </h2>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={dataEstado}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  label
                >
                  {dataEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>


      {/* Distribución por Tipo */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Distribución por Tipo
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dataTipo}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Documentos Recientes */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Documentos Recientes
        </h2>
        <div className="space-y-4">
          {documentos.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl text-blue-500">📄</div>
                <div>
                  <p className="font-semibold text-gray-700">{doc.titulo}</p>
                  <p className="text-sm text-gray-500">
                    {doc.autor} • {doc.tiempo}
                  </p>
                </div>
              </div>
              <span
                className={`text-white text-sm px-3 py-1 rounded-full ${doc.color}`}
              >
                {doc.estado}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
