import React, { useState } from "react";
import {
  Mail,
  Users,
  CalendarDays,
  TrendingUp,
  Upload,
  Download,
  Filter,
} from "lucide-react";
import ModalNuevoNewsletter from "./ModalNuevoNewsletter";

export default function GestionNewsletter() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const newsletters = [
    {
      titulo: "EcoWeekly",
      tipo: "Newsletter automático · semanal · 12,500 suscriptores",
      fecha: "11/09/2025",
      apertura: "24.5%",
      clicks: "4.2%",
    },
    {
      titulo: "Eventos del Mes",
      tipo: "Newsletter estándar · mensual · 8,940 suscriptores",
      fecha: "31/08/2025",
      apertura: "31.8%",
      clicks: "6.7%",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fa] font-sans py-12 px-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl shadow-sm">
            <Mail className="text-blue-600 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Gestión de Newsletter
          </h2>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2"
        >
          + Nuevo Newsletter
        </button>
      </div>

      {/* Acciones */}
      <div className="w-1/2 max-w-4xl space-y-5 flex flex-col items-center">
        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl p-3 border border-gray-200 flex justify-center gap-3 w-full">
          {[
            { icon: <Upload size={16} />, text: "Importar Lista" },
            { icon: <Download size={16} />, text: "Exportar Datos" },
            { icon: <Filter size={16} />, text: "Segmentar" },
          ].map((btn, i) => (
            <button
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
            >
              {btn.icon} {btn.text}
            </button>
          ))}
        </div>
      </div>

      {/* Métricas */}
      <div className="w-full max-w-4xl space-y-5 mt-5">
        <div className="grid sm:grid-cols-3 gap-5 bg-white/80 backdrop-blur-sm shadow-md rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all">
            <div className="bg-indigo-100 text-indigo-700 p-3 rounded-xl">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Suscriptores</p>
              <h3 className="text-xl font-bold text-gray-800">21,440</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all">
            <div className="bg-yellow-100 text-yellow-700 p-3 rounded-xl">
              <CalendarDays size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Este Mes</p>
              <h3 className="text-xl font-bold text-gray-800">+245</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all">
            <div className="bg-green-100 text-green-700 p-3 rounded-xl">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tasa Apertura</p>
              <h3 className="text-xl font-bold text-gray-800">28.2%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de Newsletters */}
      <div className="w-full max-w-4xl mt-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Newsletters
        </h3>

        {newsletters.map((n, i) => (
          <div
            key={i}
            className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="text-left">
              <h4 className="text-base font-semibold text-gray-800 mb-1">
                {n.titulo}
              </h4>
              <p className="text-sm text-gray-500">{n.tipo}</p>
              <p className="text-xs text-gray-400 mt-1">
                Último envío: {n.fecha} · {n.apertura} apertura · {n.clicks} clicks
              </p>
            </div>

            <div className="flex gap-3 mt-4 sm:mt-0">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-sm text-sm transition-all">
                Configurar
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm text-sm transition-all">
                Ver Estadísticas
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal separado */}
      {mostrarModal && <ModalNuevoNewsletter onClose={() => setMostrarModal(false)} />}
    </div>
  );
}
