import React from "react";
import {
  Server,
  Network,
  Rss,
  Settings,
  Activity,
  CheckCircle,
  Database,
  Zap,
  FileCode,
} from "lucide-react";

export default function GestionAPIs() {
  const filtrosPrincipales = [
    { nombre: "Dashboard principal", icono: <FileCode className="w-4 h-4" /> },
    { nombre: "APIs", icono: <Server className="w-4 h-4" /> },
    { nombre: "Redes sociales", icono: <Network className="w-4 h-4" /> },
    { nombre: "Feeds RSS", icono: <Rss className="w-4 h-4" /> },
    { nombre: "Logs", icono: <Activity className="w-4 h-4" /> },
    { nombre: "Configuración", icono: <Settings className="w-4 h-4" /> },
  ];

  const filtrosEstado = ["Todas", "Conectadas", "Con errores", "Mantenimiento"];

  const apis = [
    {
      id: 1,
      nombre: "API Línea Base",
      tipo: "REST API",
      url: "https://api.lineabase.gov.co/v2",
      auth: "Bearer Token",
      uptime: "99.2%",
      latencia: "180ms",
      requests: 2456,
      errores: 12,
      datos: "Empresas, Normativas, Indicadores",
      statusDot: "bg-emerald-500",
    },
    {
      id: 2,
      nombre: "Plataforma Trazabilidad",
      tipo: "GraphQL API",
      url: "https://trazabilidad.economia-circular.co/graphql",
      auth: "API Key + OAuth2",
      uptime: "97.8%",
      latencia: "320ms",
      requests: 1834,
      errores: 45,
      datos: "Cadena suministro, Materiales, Procesos",
      statusDot: "bg-sky-500",
    },
    {
      id: 3,
      nombre: "SMS Gateway",
      tipo: "REST API",
      url: "https://api.twilio.com/2020-04-01",
      auth: "undefined",
      uptime: "99.9%",
      latencia: "145ms",
      requests: 0,
      errores: 0,
      datos: "undefined",
      statusDot: "bg-emerald-500",
    },
    {
      id: 4,
      nombre: "API Correos Electrónicos",
      tipo: "SMTP/API",
      url: "undefined",
      auth: "undefined",
      uptime: "99.7%",
      latencia: "89ms",
      requests: 0,
      errores: 0,
      datos: "undefined",
      statusDot: "bg-emerald-500",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Gestión de APIs</h1>
          <p className="text-sm text-gray-500">
            Configuración y monitoreo detallado de integraciones
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> 8/10 APIs Activas
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm">
            Actualizar
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            + Nueva Integración
          </button>
        </div>
      </div>

      {/* FILTROS PRINCIPALES */}
      <div className="flex flex-wrap gap-3 mb-4">
        {filtrosPrincipales.map((f, i) => (
          <button
            key={i}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-gray-200 shadow-sm ${
              f.nombre === "APIs"
                ? "bg-emerald-700 text-white"
                : "bg-white hover:bg-gray-100 text-gray-700"
            }`}
          >
            {f.icono}
            {f.nombre}
          </button>
        ))}
      </div>

      {/* FILTROS DE ESTADO */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filtrosEstado.map((estado, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-full border text-sm shadow-sm ${
              estado === "Todas"
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white hover:bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* TARJETAS DE APIS */}
      <div className="space-y-6">
        {apis.map((api) => (
          <div
            key={api.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-5"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {api.nombre}
                </h3>
                <p className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-md inline-block mt-1">
                  {api.tipo}
                </p>
              </div>
              <span className={`w-3 h-3 rounded-full ${api.statusDot}`} />
            </div>

            <div className="text-sm text-gray-700 mb-4">
              <p>
                <span className="font-medium">URL:</span>{" "}
                <span className="text-gray-600">{api.url}</span>
              </p>
              <p>
                <span className="font-medium">Autenticación:</span>{" "}
                <span className="text-gray-600">{api.auth}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-gray-700 mb-4">
              <div>
                <p className="text-xs text-gray-500">Uptime</p>
                <p className="font-semibold text-lg text-emerald-700">
                  {api.uptime}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Latencia</p>
                <p className="font-semibold text-lg">{api.latencia}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Requests Hoy</p>
                <p className="font-semibold text-lg">{api.requests}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Errores Hoy</p>
                <p className="font-semibold text-lg">{api.errores}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Datos Sincronizados</p>
                <p className="font-semibold text-sm text-gray-600">
                  {api.datos}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-start">
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center gap-1 border border-gray-200">
                <Settings className="w-4 h-4 text-gray-600" /> Configurar
              </button>
              <button className="px-3 py-1.5 bg-white hover:bg-gray-50 rounded-md text-sm flex items-center gap-1 border border-gray-200">
                <Database className="w-4 h-4 text-emerald-600" /> Logs
              </button>
              <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-md text-sm text-white flex items-center gap-1">
                <Zap className="w-4 h-4" /> Probar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
