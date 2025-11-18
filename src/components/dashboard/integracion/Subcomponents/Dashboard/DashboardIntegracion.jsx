import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Server,
  Zap,
  Database,
  UploadCloud,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function DashboardIntegracion() {
  const metrics = [
    {
      key: "apis",
      title: "APIs Activas",
      value: "8/10",
      sub: "+2 esta semana",
      icon: <Server className="w-5 h-5 text-emerald-600" />,
    },
    {
      key: "latency",
      title: "Latencia Promedio",
      value: "245ms",
      sub: "-12% vs ayer",
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
    },
    {
      key: "uptime",
      title: "Uptime General",
      value: "98.7%",
      sub: "+0.3% mensual",
      icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
    },
    {
      key: "data",
      title: "Datos Transferidos",
      value: "2.3GB",
      sub: "Hoy",
      icon: <UploadCloud className="w-5 h-5 text-cyan-500" />,
    },
    {
      key: "webhooks",
      title: "Webhooks Activos",
      value: "15",
      sub: "Funcionando correctamente",
      icon: <Database className="w-5 h-5 text-indigo-500" />,
    },
    {
      key: "errors",
      title: "Errores Críticos",
      value: "3",
      sub: "Resueltos automáticamente",
      icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
    },
  ];

  const alerts = [
    {
      id: 1,
      title: "Instagram API - rate limit",
      description: "Límite de API alcanzado - Servicio suspendido temporalmente",
      color: "border-l-4 border-red-400 bg-red-50",
      note: "Resolución estimada: 1 hora",
    },
    {
      id: 2,
      title: "Sistema ANDI - latencia alta",
      description: "Tiempo de respuesta superior a 5 segundos",
      color: "border-l-4 border-yellow-400 bg-yellow-50",
      note: "Investigar conexiones",
    },
    {
      id: 3,
      title: "Plataforma Trazabilidad - certificado expira",
      description: "Certificado SSL expira en 30 días",
      color: "border-l-4 border-blue-400 bg-blue-50",
      note: "Programar renovación",
    },
  ];

  const latenciaData = [
    { hora: "00:00", "API Línea Base": 150, "SMS Gateway": 220, "Sistema ANDI": 900 },
    { hora: "04:00", "API Línea Base": 180, "SMS Gateway": 200, "Sistema ANDI": 880 },
    { hora: "08:00", "API Línea Base": 170, "SMS Gateway": 210, "Sistema ANDI": 920 },
    { hora: "12:00", "API Línea Base": 160, "SMS Gateway": 190, "Sistema ANDI": 950 },
    { hora: "16:00", "API Línea Base": 180, "SMS Gateway": 200, "Sistema ANDI": 930 },
    { hora: "20:00", "API Línea Base": 175, "SMS Gateway": 195, "Sistema ANDI": 910 },
  ];

  const requestsData = [
    { name: "API Línea Base", requests: 2500 },
    { name: "Trazabilidad", requests: 1800 },
    { name: "ANDI", requests: 1200 },
    { name: "SMS", requests: 900 },
    { name: "Email", requests: 700 },
    { name: "Líneas Base 2", requests: 300 },
  ];

  const barColors = ["#059669", "#10B981", "#34D399", "#4ADE80", "#6EE7B7", "#A7F3D0"];

  const apis = [
    {
      id: 1,
      nombre: "API Línea Base",
      tipo: "REST API",
      uptime: "99.2%",
      latencia: "195ms",
      requests: 2456,
      sync: "15/9, 20:45",
      statusDot: "bg-emerald-500",
    },
    {
      id: 2,
      nombre: "API Correos Electrónicos",
      tipo: "SMTP/API",
      uptime: "99.7%",
      latencia: "50ms",
      requests: 0,
      sync: "15/9, 20:46",
      statusDot: "bg-emerald-500",
    },
    {
      id: 3,
      nombre: "SMS Gateway",
      tipo: "REST API",
      uptime: "99.9%",
      latencia: "73ms",
      requests: 0,
      sync: "15/9, 20:47",
      statusDot: "bg-emerald-500",
    },
    {
      id: 4,
      nombre: "Plataforma Trazabilidad",
      tipo: "GraphQL API",
      uptime: "97.8%",
      latencia: "169ms",
      requests: 1834,
      sync: "15/9, 20:43",
      statusDot: "bg-sky-500",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Módulo de Integraciones</h1>
          <p className="text-sm text-gray-500">
            Conexiones y sincronización con sistemas externos
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-md text-sm font-medium">
            8/10 APIs Activas
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm">
            Actualizar
          </button>
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {metrics.map((m) => (
          <div
            key={m.key}
            className="bg-white rounded-xl shadow-[0_4px_14px_rgba(16,185,129,0.25)] border border-gray-200 p-4 flex flex-col justify-between transition hover:shadow-[0_4px_16px_rgba(16,185,129,0.35)]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-md">{m.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{m.title}</p>
                <p className="text-lg font-semibold text-gray-800 drop-shadow-sm">{m.value}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* ALERTAS */}
      <div className="space-y-4 mb-8">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`${a.color} border rounded-xl p-4 flex justify-between items-center`}
          >
            <div className="text-left">
              <p className="font-semibold text-gray-800">{a.title}</p>
              <p className="text-sm text-gray-600">{a.description}</p>
              <p className="text-xs text-gray-500 mt-1">{a.note}</p>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm flex items-center bg-white rounded-md border border-gray-200 hover:bg-gray-50">
                <CheckCircle className="w-4 h-4 text-emerald-600 mr-1" /> Resolver
              </button>
              <button className="px-3 py-1.5 text-sm flex items-center bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100">
                <Clock className="w-4 h-4 text-yellow-500 mr-1" /> Posponer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Latencia por API (últimas 24h)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={latenciaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="API Línea Base" stroke="#4F46E5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="SMS Gateway" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Sistema ANDI" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Volumen de Requests</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" radius={[8, 8, 0, 0]}>
                {requestsData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ESTADO DE APIS PRINCIPALES */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Estado de APIs Principales
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {apis.map((api) => (
          <div
            key={api.nombre}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{api.nombre}</h4>
                  <p className="text-sm text-gray-500">{api.tipo}</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${api.statusDot}`} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div>
                  <p className="text-xs text-gray-500">Uptime</p>
                  <p className="font-semibold text-lg text-emerald-700">{api.uptime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Latencia</p>
                  <p className="font-semibold text-lg text-gray-700">{api.latencia}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Requests Hoy</p>
                  <p className="font-semibold text-lg text-gray-700">{api.requests}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Última Sync</p>
                  <p className="font-semibold text-lg text-gray-700">{api.sync}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto flex gap-3 pt-4">
              <button className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm w-full">
                Ver Detalles
              </button>
              <button className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm w-full">
                Probar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
