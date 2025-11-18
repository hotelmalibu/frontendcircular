import React from "react";
import { RefreshCw, Search, Download } from "lucide-react";

export default function LogsYMonitoreo() {
  const logs = [
    {
      id: 1,
      fecha: "2025-09-15 20:45:12",
      nivel: "INFO",
      servicio: "API Línea Base",
      mensaje: "Sincronización completada exitosamente - 245 registros actualizados (1.2s)",
    },
    {
      id: 2,
      fecha: "2025-09-15 20:43:30",
      nivel: "WARNING",
      servicio: "Plataforma Trazabilidad",
      mensaje: "Latencia detectada - 3.2s respuesta (3.2s)",
    },
    {
      id: 3,
      fecha: "2025-09-15 20:41:15",
      nivel: "ERROR",
      servicio: "Instagram API",
      mensaje: "Rate limit exceeded - requests suspended for 1 hour",
    },
    {
      id: 4,
      fecha: "2025-09-15 20:40:00",
      nivel: "INFO",
      servicio: "SMS Gateway",
      mensaje: "Mensaje entregado exitosamente - ID: msg_001234",
    },
    {
      id: 5,
      fecha: "2025-09-15 20:38:45",
      nivel: "SUCCESS",
      servicio: "Sistema ANDI",
      mensaje: "Certificado renovado automáticamente",
    },
  ];

  const nivelColor = {
    INFO: "bg-blue-50 text-blue-700 border-blue-200",
    WARNING: "bg-amber-50 text-amber-700 border-amber-200",
    ERROR: "bg-red-50 text-red-700 border-red-200",
    SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Logs y Monitoreo
          </h1>
          <p className="text-sm text-gray-500">
            Seguimiento detallado de actividad y errores
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            8/10 APIs Activas
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 border border-gray-200">
            <RefreshCw className="w-4 h-4" /> Actualizar
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <select className="border border-gray-300 text-gray-700 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500">
              <option>Todos los niveles</option>
              <option>INFO</option>
              <option>WARNING</option>
              <option>ERROR</option>
              <option>SUCCESS</option>
            </select>
            <select className="border border-gray-300 text-gray-700 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500">
              <option>Todos los servicios</option>
              <option>API Línea Base</option>
              <option>Plataforma Trazabilidad</option>
              <option>Instagram API</option>
              <option>SMS Gateway</option>
              <option>Sistema ANDI</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Buscar en logs..."
              className="border border-gray-300 text-gray-700 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-64"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-2 rounded-md flex items-center gap-1">
              <Search className="w-4 h-4" /> Buscar
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-md flex items-center gap-1 border border-gray-200">
              <Download className="w-4 h-4" /> Exportar
            </button>
          </div>
        </div>
      </div>

      {/* TABLA DE LOGS */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`rounded-md border px-4 py-2 mb-2 text-sm ${nivelColor[log.nivel]}`}
          >
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-500">{log.fecha}</span>
                <span className="font-semibold text-gray-700">
                  [{log.servicio}]
                </span>
                <span
                  className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-md border ${
                    nivelColor[log.nivel]
                  }`}
                >
                  {log.nivel}
                </span>
                <span className="text-gray-700">{log.mensaje}</span>
              </div>
            </div>
          </div>
        ))}

        {/* PAGINACIÓN */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700">
            ← Anterior
          </button>
          <p>Página 1 de 15</p>
          <button className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700">
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
