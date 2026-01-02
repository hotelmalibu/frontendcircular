import React from "react";
import {
  Server,
  Zap,
  Database,
  Clock,
  PenTool,
  Calendar,
  Mail,
  FileImage,
  MoreHorizontal,
  ArrowUpRight
} from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja (Alertas)
  yellow: "#E8AD00",     // Amarillo
  gray: "#6B7280",
};

export default function DashboardContenido() {
  const metricas = [
    { titulo: "Artículos Activos", valor: 145, icon: <PenTool size={20} />, color: BRAND.blue },
    { titulo: "Eventos Activos", valor: 8, icon: <Calendar size={20} />, color: BRAND.darkGreen },
    { titulo: "Newsletter Enviadas", valor: 23, icon: <Mail size={20} />, color: BRAND.orange },
    { titulo: "Engagement Promedio", valor: "7.2%", icon: <Zap size={20} />, color: BRAND.darkBlue },
  ];

  const redes = [
    {
      nombre: "Facebook",
      seguidores: "15,420",
      label: "Seguidores",
      engagement: "7.8%",
      color: "#1877F2",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.797c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.953.93-1.953 1.887v2.259h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      ),
    },
    {
      nombre: "X (Twitter)",
      seguidores: "8,930",
      label: "Seguidores",
      engagement: "7.0%",
      color: "#000000",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.33l-5.2-6.82-5.948 6.82H1.875l7.73-8.86L1.5 2.25h6.445l4.712 6.173L18.244 2.25zM17.1 19.692h1.833L7.002 4.177H5.03L17.1 19.692z" />
        </svg>
      ),
    },
    {
      nombre: "Instagram",
      seguidores: "5,670",
      label: "Seguidores",
      engagement: "7.3%",
      color: "#E4405F",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M7.75 2C4.678 2 2 4.678 2 7.75v8.5C2 19.322 4.678 22 7.75 22h8.5C19.322 22 22 19.322 22 16.25v-8.5C22 4.678 19.322 2 16.25 2h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm6.5.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zM12 9a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
      ),
    },
  ];

  const contenidoPendiente = [
    { titulo: "Economía Circular en el Sector Textil", autor: "Carlos Ruiz", estado: "Pendiente revisión", color: BRAND.orange, bg: "#FFF5EB" },
    { titulo: "Guía de Compostaje Doméstico", autor: "Ana Gómez", estado: "Por publicar", color: BRAND.blue, bg: "#EFF6FF" },
    { titulo: "Reporte de Sostenibilidad Q3", autor: "Equipo Técnico", estado: "Borrador", color: BRAND.gray, bg: "#F3F4F6" },
  ];

  const actividad = [
    { tipo: "Artículo", texto: "‘Innovaciones en Reciclaje’ publicado", time: "Hace 2h", icon: <PenTool size={14} />, color: BRAND.blue },
    { tipo: "Newsletter", texto: "‘EcoFriendly’ enviada a 12.800 suscriptores", time: "Hace 5h", icon: <Mail size={14} />, color: BRAND.darkGreen },
    { tipo: "Evento", texto: "‘Taller de Reaprovechamiento’ creado", time: "Ayer", icon: <Calendar size={14} />, color: BRAND.orange },
  ];

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">

      {/* Título de Sección */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: BRAND.darkBlue }}>Gestión de Contenidos</h1>
        <p className="text-gray-500 text-sm mt-1">Administración de publicaciones y métricas sociales</p>
      </div>

      {/* Acceso Rápido */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: BRAND.gray }}>
          <Zap size={16} style={{ color: BRAND.yellow }} /> Acciones Rápidas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition group">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition">
              <PenTool size={20} />
            </div>
            <span className="text-sm font-semibold text-gray-700">Nuevo Artículo</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition group">
            <div className="p-2 rounded-full bg-[#E9F5E9] text-[#65A30D] group-hover:bg-green-200 transition">
              <Calendar size={20} />
            </div>
            <span className="text-sm font-semibold text-gray-700">Nuevo Evento</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition group">
            <div className="p-2 rounded-full bg-[#FFF7ED] text-[#EA580C] group-hover:bg-orange-200 transition">
              <Mail size={20} />
            </div>
            <span className="text-sm font-semibold text-gray-700">Newsletter</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition group">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition">
              <FileImage size={20} />
            </div>
            <span className="text-sm font-semibold text-gray-700">Subir Media</span>
          </button>
        </div>
      </div>

      {/* Cuadrícula Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Métricas Principales */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <Server size={20} className="text-gray-400" /> Rendimiento General
            </h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-grow">
            {metricas.map((m, idx) => (
              <div key={idx} className="flex flex-col justify-between bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 rounded-lg bg-white shadow-sm" style={{ color: m.color }}>
                    {m.icon}
                  </div>
                  {idx === 3 && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">+1.2%</span>}
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: BRAND.darkBlue }}>{m.valor}</p>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">{m.titulo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
            <Zap size={20} className="text-gray-400" /> Impacto Social
          </h3>

          <div className="space-y-4 flex-grow">
            {redes.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: r.color }}>
                    {r.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{r.nombre}</p>
                    <p className="text-xs text-gray-500">{r.seguidores} {r.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{r.engagement}</p>
                  <p className="text-[10px] text-gray-400 uppercase">Eng.</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Alcance Mensual Total</span>
            <span className="text-xl font-bold" style={{ color: BRAND.darkGreen }}>105,744</span>
          </div>
        </div>

        {/* Contenido Pendiente */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <Database size={20} className="text-gray-400" /> Cola de Publicación
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">VER CALENDARIO</button>
          </div>

          <div className="space-y-3">
            {contenidoPendiente.map((c, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition bg-white">
                <div className="mb-3 sm:mb-0">
                  <h4 className="font-semibold text-gray-800 text-sm">{c.titulo}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Autor: {c.autor}</p>
                </div>
                <span
                  className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold w-fit"
                  style={{ backgroundColor: c.bg, color: c.color }}
                >
                  {c.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <Clock size={20} className="text-gray-400" /> Bitácora de Actividad
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400"><ArrowUpRight size={18} /></button>
          </div>

          <div className="relative pl-2">
            {/* Línea conectora */}
            <div className="absolute left-[11px] top-2 bottom-4 w-px bg-gray-200"></div>

            <div className="space-y-6">
              {actividad.map((a, i) => (
                <div key={i} className="relative flex items-start gap-4">
                  <div className="relative z-10 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-gray-50 text-white shrink-0" style={{ backgroundColor: a.color }}>
                    {React.cloneElement(a.icon, { size: 12, className: "text-white" })}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-semibold">{a.tipo}:</span> {a.texto}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}