import React from "react";
import {
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function RedesSociales() {
  const redes = [
    {
      id: 1,
      nombre: "Facebook",
      estado: "Conectado",
      iconColor: "bg-blue-500",
      seguidores: 1247,
      publicaciones: 15,
      engagement: "5.2%",
      webhook: true,
      oauth: "14/12/2025",
      estadoColor: "text-emerald-600",
    },
    {
      id: 2,
      nombre: "Twitter",
      estado: "Conectado",
      iconColor: "bg-sky-400",
      seguidores: 834,
      publicaciones: 23,
      engagement: "N/A",
      webhook: true,
      oauth: "19/1/2026",
      estadoColor: "text-emerald-600",
    },
    {
      id: 3,
      nombre: "LinkedIn",
      estado: "Conectado",
      iconColor: "bg-rose-400",
      seguidores: 1156,
      publicaciones: 8,
      engagement: "N/A",
      webhook: false,
      oauth: "29/11/2025",
      estadoColor: "text-emerald-600",
    },
    {
      id: 4,
      nombre: "Instagram",
      estado: "Limitado",
      iconColor: "bg-pink-500",
      seguidores: 2341,
      publicaciones: 12,
      engagement: "7.8%",
      webhook: false,
      oauth: "14/10/2025",
      alerta: "API rate limit exceeded",
      estadoColor: "text-orange-500",
    },
  ];

  const dataEngagement = [
    { name: "Facebook", value: 32 },
    { name: "Twitter", value: 25 },
    { name: "LinkedIn", value: 18 },
    { name: "Instagram", value: 25 },
  ];

  const COLORS = ["#3b82f6", "#0ea5e9", "#0284c7", "#ec4899"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Integración de Redes Sociales
          </h1>
          <p className="text-sm text-gray-500">
            Gestión de publicaciones automáticas y monitoreo de menciones
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> 8/10 APIs Activas
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            + Conectar red social
          </button>
        </div>
      </div>

      {/* TARJETAS DE REDES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {redes.map((red) => (
          <div
            key={red.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${red.iconColor}`}></div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {red.nombre}
                </h3>
              </div>
              <p className={`text-xs font-medium ${red.estadoColor}`}>
                {red.estado}
              </p>
            </div>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-4 mb-2">
              <div>
                <p className="text-xs text-gray-500">Seguidores</p>
                <p className="font-semibold text-lg text-sky-600">
                  {red.seguidores}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Publicaciones</p>
                <p className="font-semibold text-lg text-emerald-600">
                  {red.publicaciones}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Engagement</p>
                <p className="font-semibold text-lg text-pink-500">
                  {red.engagement}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Webhook</p>
                {red.webhook ? (
                  <CheckCircle className="w-4 h-4 mx-auto text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mx-auto text-rose-500" />
                )}
              </div>
            </div>

            {/* ALERTA OPCIONAL */}
            {red.alerta && (
              <div className="bg-orange-100 text-orange-700 text-xs px-3 py-2 rounded-md mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {red.alerta}
              </div>
            )}

            {/* FECHA OAUTH - AHORA ALINEADA A LA IZQUIERDA */}
            <p className="text-xs text-gray-500 mt-2 text-left">
              OAuth expira:{" "}
              <span className="font-medium text-gray-700">{red.oauth}</span>
            </p>

            {/* BOTONES */}
            <div className="flex gap-3 mt-3">
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center gap-1 border border-gray-200">
                <Settings className="w-4 h-4 text-gray-600" /> Configurar
              </button>
              <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm flex items-center gap-1">
                <RefreshCw className="w-4 h-4" /> Renovar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MÉTRICAS DE ENGAGEMENT */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Métricas de Engagement
        </h2>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataEngagement}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
              >
                {dataEngagement.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
