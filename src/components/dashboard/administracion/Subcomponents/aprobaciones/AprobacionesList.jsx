import React from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

export default function AprobacionesList() {
  const solicitudes = [
    {
      id: 1,
      titulo: "Acceso a módulo: formularios_normativos",
      tipo: "Acceso Módulo",
      usuario: "coordinador@org.org",
      modulo: "formularios_normativos",
      nivel: "de acceso",
      estado: "En Revisión",
      fecha: "17/09/2025",
      asignado: "Laura Sánchez",
    },
    {
      id: 2,
      titulo: "Cambio de permisos: empresa.regional@ejemplo.com",
      tipo: "Gestión Permisos",
      usuario: "empresa.regional@ejemplo.com",
      permisos_actuales: ["productos:ver"],
      permisos_solicitados: ["productos:ver", "reportes:generar"],
      justificacion: "Reasignación de funciones gerenciales",
      estado: "Pendiente",
      fecha: "07/09/2025",
      asignado: "Carlos Ruiz",
    },
    {
      id: 3,
      titulo: "Solicitud de registro: david.lopez@greencircle.org",
      tipo: "Nueva Usuario",
      organizacion: "Green Circle Foundation",
      rol: "Ciudadanía",
      estado: "Pendiente",
      fecha: "03/09/2025",
      asignado: "Laura Sánchez",
    },
  ];

  const colorEstado = {
    "Pendiente": "text-orange-600 bg-orange-100",
    "En Revisión": "text-blue-600 bg-blue-100",
    "Aprobado": "text-green-600 bg-green-100",
    "Rechazado": "text-red-600 bg-red-100",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Solicitudes de Aprobación</h1>

      <div className="space-y-4">
        {solicitudes.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            {/* Encabezado */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {s.titulo}
                </h2>
                <p className="text-sm text-gray-600">{s.tipo}</p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${colorEstado[s.estado]}`}
              >
                {s.estado}
              </span>
            </div>

            {/* Detalles */}
            <div className="text-sm text-gray-700 space-y-1 mb-4">
              {s.usuario && (
                <p>
                  <strong>Usuario:</strong> {s.usuario}
                </p>
              )}
              {s.modulo && (
                <p>
                  <strong>Módulo:</strong> {s.modulo}
                </p>
              )}
              {s.permisos_solicitados && (
                <p>
                  <strong>Permisos solicitados:</strong>{" "}
                  {s.permisos_solicitados.join(", ")}
                </p>
              )}
              {s.justificacion && (
                <p>
                  <strong>Justificación:</strong> {s.justificacion}
                </p>
              )}
              {s.organizacion && (
                <p>
                  <strong>Organización:</strong> {s.organizacion}
                </p>
              )}
              {s.rol && (
                <p>
                  <strong>Rol solicitado:</strong> {s.rol}
                </p>
              )}
              <p className="text-gray-500 text-sm">
                Fecha: {s.fecha} · Asignado a: {s.asignado}
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition">
                <CheckCircle size={16} /> Aprobar
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition">
                <XCircle size={16} /> Rechazar
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded-md hover:bg-gray-200 transition">
                <Info size={16} /> Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
