import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  ClipboardList,
  FileCheck,
  CheckCircle,
  Info,
} from "lucide-react";

export default function DashboardGraficos() {
  // Datos de ejemplo (simulan los que aparecen en tu dashboard)
  const formulariosPorTipo = [
    { name: "Periódico", value: 8 },
    { name: "Normativo", value: 10 },
    { name: "Encuesta", value: 5 },
  ];

  const estadoFormularios = [
    { name: "Publicado", value: 15 },
    { name: "Borrador", value: 8 },
  ];

  const formulariosUsados = [
    { name: "Ene", total: 30 },
    { name: "Feb", total: 60 },
    { name: "Mar", total: 85 },
    { name: "Abr", total: 120 },
    { name: "May", total: 160 },
    { name: "Jun", total: 190 },
    { name: "Jul", total: 220 },
    { name: "Ago", total: 250 },
    { name: "Sep", total: 280 },
  ];

  // Lista de formularios más utilizados (izquierda)
  const formsMostUsed = [
    {
      title: "Reporte Trimestral de Aprovechamiento",
      subtitle: "234 respuestas",
      count: 234,
    },
    {
      title: "Registro de Productores de Envases y Empaques",
      subtitle: "156 respuestas",
      count: 156,
    },
    {
      title: "Manifiesto de Residuos Peligrosos",
      subtitle: "89 respuestas",
      count: 89,
    },
    {
      title: "Encuesta Recicladores Informales",
      subtitle: "78 respuestas",
      count: 78,
    },
  ];

  // Alertas (derecha)
  const alerts = [
    {
      type: "vencimiento",
      title: 'Formulario "Manifiesto RESPEL" vence en 15 días',
      company: "Empresa: Químicos Industriales S.A.",
      color: "bg-red-50 border-red-200 text-red-800",
      iconColor: "text-red-600",
    },
    {
      type: "campos",
      title:
        'Formulario "Registro Productores" requiere 3 campos adicionales',
      company: "Empresa: Envases del Norte Ltda.",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      iconColor: "text-blue-600",
    },
  ];

  const COLORS = ["#00A88F", "#FFB703", "#E63946", "#3A86FF"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Panel de Formularios</h1>

      {/* Tarjetas superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Formularios Activos</p>
            <p className="text-2xl font-bold text-gray-800">23</p>
          </div>
          <ClipboardList className="text-blue-500" size={28} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Respuestas Recibidas</p>
            <p className="text-2xl font-bold text-gray-800">1490</p>
          </div>
          <FileCheck className="text-green-500" size={28} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tasa de Completadas</p>
            <p className="text-2xl font-bold text-gray-800">45%</p>
          </div>
          <CheckCircle className="text-yellow-500" size={28} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Alertas de Vencimiento</p>
            <p className="text-2xl font-bold text-gray-800">5</p>
          </div>
          <AlertTriangle className="text-red-500" size={28} />
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Distribución por tipo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Distribución por tipos</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={formulariosPorTipo}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                label
              >
                {formulariosPorTipo.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Estado de formularios */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Estado de Formularios</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={estadoFormularios} dataKey="value" nameKey="name" outerRadius={90} label>
                {estadoFormularios.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
         {/* NUEVA SECCIÓN: Lista (izquierda) + Alertas (derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Formularios más Utilizados (lista compacta) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Formularios más Utilizados</h3>

          <div className="space-y-4">
            {formsMostUsed.map((f, idx) => (
              <div key={idx} className="border rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{f.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{f.subtitle}</p>
                </div>

                <div className="ml-4">
                  <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {f.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Alertas y Notificaciones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Alertas y Notificaciones</h3>

          <div className="space-y-4">
            {alerts.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 rounded-lg border ${a.color} shadow-sm`}
              >
                <div className="mt-1">
                  <AlertTriangle className={`${a.iconColor}`} size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{a.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{a.company}</p>
                </div>
                <div className="self-center">
                  <button
                    className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-md hover:bg-gray-50"
                    title="Ver detalles"
                  >
                    <Info size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de formularios más utilizados */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Formularios más utilizados</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formulariosUsados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#00A88F" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    
    </div>
  );
}
