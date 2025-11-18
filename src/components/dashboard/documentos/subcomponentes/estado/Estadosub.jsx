import React from "react";

import { FileText, CheckCircle, Edit, Eye, Lock, Archive } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Publicados", value: 1230, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { title: "Borrador", value: 350, icon: Edit, color: "text-yellow-600", bg: "bg-yellow-100" },
    { title: "En Revisión", value: 200, icon: Eye, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Privados", value: 100, icon: Lock, color: "text-gray-600", bg: "bg-gray-100" },
    { title: "Archivados", value: 50, icon: Archive, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  const approvalFlow = [
    { title: "Revisión Estándar", type: "Estandar" },
    { title: "Revisión Normativa", type: "Normativa" },
    { title: "Revisión Estándar", type: "Estandar" },
  ];

  const pendingDocs = [
    { title: "Normativa Europea de Residuos Plásticos 2025" },
    { title: "Normativa Europea de Residuos Plásticos 2025" },
    { title: "Casos de Éxito en Economía Circular - Sector Textil" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* --- Estadísticas --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition`}
          >
            <div>
              <h3 className="text-gray-500 text-sm">{item.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
            </div>
            <div className={`${item.bg} ${item.color} p-3 rounded-xl`}>
              <item.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* --- Flujo de Aprobación --- */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Flujo de Aprobación
        </h2>
        <div className="space-y-3">
          {approvalFlow.map((item, index) => (
            <div
              key={index}
              className="flex flex-col border-l-4 border-blue-500 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition"
            >
              <div className="text-left">
                <h3 className="font-medium text-gray-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Procesos básicos de aprobación
                </p>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  Autor
                </span>
                <span className="text-gray-400">→</span>
                <span className="bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  Revisión Técnica
                </span>
                <span className="text-gray-400">→</span>
                <span className="bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  Revisión Final
                </span>
              </div>

              <p className="text-xs text-gray-500 text-left">
                Tiempo promedio 4–5 Días
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Documentos Pendientes --- */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Documentos Pendientes por Revisar
        </h2>
        <div className="space-y-3">
          {pendingDocs.map((doc, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 border-l-4 border-green-500 rounded-xl p-4 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-600 p-2 rounded-full">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{doc.title}</h3>
                  <p className="text-sm text-gray-500">
                    por <span className="font-medium">Carlos Ruiz</span> • Enviado hace 2 días
                  </p>
                </div>
              </div>
              <button className="mt-3 sm:mt-0 px-3 py-1 text-xs font-medium bg-green-600 text-white rounded-full hover:bg-green-700">
                Revisar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

