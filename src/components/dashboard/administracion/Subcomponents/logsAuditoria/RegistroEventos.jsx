import React, { useState } from "react";
import { CheckCircle, XCircle, Shield, UserPlus, Filter } from "lucide-react";

export default function RegistroEventos() {
  const [filtroSeveridad, setFiltroSeveridad] = useState("todas");
  const [filtroModulo, setFiltroModulo] = useState("todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const eventos = [
    {
      tipo: "success",
      titulo: "Inicio de sesión exitoso",
      usuario: "Laura Sánchez",
      detalle:
        "IP: 192.168.0.10 · Dispositivo: Chrome/Windows 10 · Ubicación: Bogotá, Colombia",
      fecha: "15/9/2025, 20:15:32",
      modulo: "autenticación",
    },
    {
      tipo: "error",
      titulo: "Intento de acceso fallido",
      usuario: "usuario.soporte@host.com",
      detalle:
        "Credenciales inválidas · Ubicación no reconocida · Acción: Cuenta suspendida",
      fecha: "15/9/2025, 19:42:40",
      modulo: "autenticación",
    },
    {
      tipo: "warning",
      titulo: "Permisos modificados",
      usuario: "Carlos Ruiz",
      detalle:
        "Roles actualizados: administrador, documentos, reportes · Justificación: ampliación de responsabilidades",
      fecha: "15/9/2025, 18:30:18",
      modulo: "permisos",
    },
    {
      tipo: "info",
      titulo: "Usuario creado",
      usuario: "María González",
      detalle:
        "Cuenta asignada al área: ventas · Permisos: productos, documentos · ID: #19284301",
      fecha: "15/9/2025, 16:24:58",
      modulo: "usuarios",
    },
  ];

  const iconos = {
    success: <CheckCircle className="text-green-600" />,
    error: <XCircle className="text-red-600" />,
    warning: <Shield className="text-yellow-500" />,
    info: <UserPlus className="text-blue-600" />,
  };

  const colores = {
    success: "border-l-4 border-green-500",
    error: "border-l-4 border-red-500",
    warning: "border-l-4 border-yellow-500",
    info: "border-l-4 border-blue-500",
  };

  const eventosFiltrados = eventos.filter(
    (e) =>
      (filtroSeveridad === "todas" || e.tipo === filtroSeveridad) &&
      (filtroModulo === "todos" || e.modulo === filtroModulo)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Filtros */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div>
            <label className="text-sm font-medium text-gray-600 mr-2">
              Severidad:
            </label>
            <select
              value={filtroSeveridad}
              onChange={(e) => setFiltroSeveridad(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm focus:ring focus:ring-blue-200"
            >
              <option value="todas">Todas</option>
              <option value="success">Éxito</option>
              <option value="error">Error</option>
              <option value="warning">Advertencia</option>
              <option value="info">Informativo</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mr-2">
              Módulo:
            </label>
            <select
              value={filtroModulo}
              onChange={(e) => setFiltroModulo(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm focus:ring focus:ring-blue-200"
            >
              <option value="todos">Todos</option>
              <option value="autenticación">Autenticación</option>
              <option value="usuarios">Usuarios</option>
              <option value="permisos">Permisos</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm focus:ring focus:ring-blue-200"
            />
            <span className="text-gray-500">—</span>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md">
          <Filter size={16} /> Aplicar filtros
        </button>
      </div>

      {/* Lista de eventos */}
      <div className="space-y-4">
        {eventosFiltrados.map((e, i) => (
          <div
            key={i}
            className={`bg-white p-4 rounded-lg shadow-sm flex items-start gap-3 ${colores[e.tipo]}`}
          >
            <div className="pt-1">{iconos[e.tipo]}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{e.titulo}</h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>{e.usuario}</strong>
              </p>
              <p className="text-sm text-gray-600 mt-1">{e.detalle}</p>
              <p className="text-xs text-gray-500 mt-2">{e.fecha}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
