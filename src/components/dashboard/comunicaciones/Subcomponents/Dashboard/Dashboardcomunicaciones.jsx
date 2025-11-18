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
import { Server, Zap, Database, UploadCloud, Clock } from "lucide-react";

export default function DashboardContenido() {
  const metricas = [
    { titulo: "Artículos Activos", valor: 145 },
    { titulo: "Eventos Activos", valor: 8 },
    { titulo: "Newsletter Enviadas", valor: 23 },
    { titulo: "Engagement Promedio", valor: "7.2%" },
  ];

  const redes = [
    {
      nombre: "Facebook",
      seguidores: "15,420 seguidores",
      engagement: "7.8% eng.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2" className="w-6 h-6">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.797c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.953.93-1.953 1.887v2.259h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      ),
    },
    {
      nombre: "X (Twitter)",
      seguidores: "8,930 seguidores",
      engagement: "7.0% eng.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000" className="w-6 h-6">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.33l-5.2-6.82-5.948 6.82H1.875l7.73-8.86L1.5 2.25h6.445l4.712 6.173L18.244 2.25zM17.1 19.692h1.833L7.002 4.177H5.03L17.1 19.692z" />
        </svg>
      ),
    },
    {
      nombre: "Instagram",
      seguidores: "5,670 seguidores",
      engagement: "7.3% eng.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E4405F" className="w-6 h-6">
          <path d="M7.75 2C4.678 2 2 4.678 2 7.75v8.5C2 19.322 4.678 22 7.75 22h8.5C19.322 22 22 19.322 22 16.25v-8.5C22 4.678 19.322 2 16.25 2h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm6.5.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zM12 9a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
      ),
    },
  ];

  const contenidoPendiente = [
    { titulo: "Economía Circular en el Sector Textil", autor: "Por Carlos Ruiz", estado: "Pendiente revisión", tipo: "rojo" },
    { titulo: "Guía de Compostaje Doméstico", autor: "Por Carlos Ruiz", estado: "Por publicar", tipo: "gris" },
  ];

  const actividad = [
    { tipo: "Artículo", texto: "‘Innovaciones en Reciclaje’ publicado" },
    { tipo: "Newsletter", texto: "‘EcoFriendly’ enviada a 12.800 suscriptores" },
    { tipo: "Evento", texto: "‘Taller de Reaprovechamiento’ creado" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">

      {/* Acceso Rápido */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-gray-600" /> Acceso Rápido
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm">
            <Server className="w-4 h-4" /> Nuevo Artículo
          </button>
          <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm">
            <Zap className="w-4 h-4" /> Nuevo Evento
          </button>
          <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm">
            <Database className="w-4 h-4" /> Crear Newsletter
          </button>
          <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm">
            <UploadCloud className="w-4 h-4" /> Subir Media
          </button>
        </div>
      </div>

      {/* Cuadrícula 2x2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Métricas Principales */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 h-[350px] flex flex-col">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-gray-600" /> Métricas Principales
          </h3>

          <div className="grid grid-cols-2 gap-4 flex-grow">
            {metricas.map((m, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-5 shadow-sm">
                <p className="text-3xl font-bold text-gray-900">{m.valor}</p>
                <p className="text-sm text-gray-500 mt-1 text-center leading-tight">{m.titulo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 h-[350px] flex flex-col">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-600" /> Redes Sociales
          </h3>

          <div className="space-y-3 flex-grow">
            {redes.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                    {r.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{r.nombre}</p>
                    <p className="text-sm text-gray-600">{r.seguidores}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{r.engagement}</p>
              </div>
            ))}
          </div>

          <div className="text-center border-t pt-3 mt-4">
            <p className="text-sm text-gray-600">
              Alcance Mensual: <span className="text-emerald-600 font-semibold">105.744</span>
            </p>
          </div>
        </div>

        {/* Contenido Pendiente */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 h-[350px] flex flex-col">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-600" /> Contenido Pendiente
          </h3>

          <div className="space-y-3 flex-grow">
            {contenidoPendiente.map((c, i) => (
              <div key={i} className="flex flex-col bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                <div>
                  <p className="font-semibold text-gray-800">{c.titulo}</p>
                  <p className="text-sm text-gray-500">{c.autor}</p>
                </div>
                <span
                  className={`mt-3 inline-block text-center text-xs font-medium py-1 px-3 rounded-md ${
                    c.tipo === "rojo"
                      ? "bg-red-200 text-red-800 w-full"
                      : "bg-gray-200 text-gray-700 w-full"
                  }`}
                >
                  {c.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 h-[350px] flex flex-col">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" /> Actividad Reciente
          </h3>

          <div className="flex-grow divide-y divide-gray-200">
            {actividad.map((a, i) => (
              <div key={i} className="py-3 flex items-start gap-3 text-gray-700">
                <div className="pt-0.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm">
                    <strong className="text-gray-900">{a.tipo}:</strong> {a.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}



