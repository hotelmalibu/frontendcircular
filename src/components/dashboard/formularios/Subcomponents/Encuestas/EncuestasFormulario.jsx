import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardSurveyAnalysis = () => {
  const [search, setSearch] = useState("");

  // --- Datos: tarjetas de encuestas en curso ---
  const surveys = [
    {
      id: 1,
      title: "Caracterización Recicladores Informales",
      progress: 78,
      total: 200,
      start: "19/08/2025",
    },
    {
      id: 2,
      title: "Caracterización Recicladores Informales",
      progress: 78,
      total: 200,
      start: "19/08/2025",
    },
  ];

  // --- Datos para gráficos ---
  const dataBar = [
    { name: "Caracterización Recicladores", respuestas: 40 },
    { name: "Percepción Ciudadana", respuestas: 45 },
  ];

  const dataPie = [
    { name: "Recicladores", value: 40 },
    { name: "Ciudadanos", value: 60 },
  ];

  const PIE_COLORS = ["#00B5B5", "#FDBA74"]; // colores para el donut

  // filtrado simple por título (opcional)
  const filteredSurveys = surveys.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* BUSCADOR */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="Buscar Formulario"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-96 p-2 border border-gray-300 rounded-full px-4"
        />
      </div>

      {/* TARJETAS DE ENCUESTAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {filteredSurveys.map((s) => {
          const pct = Math.round((s.progress / s.total) * 100);
          return (
            <div
              key={s.id}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">♻️</div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {s.title}
                </h3>
              </div>

              <div className="mb-3 text-sm text-gray-600 flex justify-between">
                <span>Progreso</span>
                <span>{pct}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3.5 mb-3 overflow-hidden">
                <div
                  className="h-3.5 bg-green-700"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Inicio: {s.start}</span>
                <span>Inicio: {s.start}</span>
              </div>

              <div className="flex gap-3">
                <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg shadow-sm text-sm">
                  Gestionar
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg shadow-sm text-sm">
                  Resultados
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TITULO ANALISIS */}
      <h2 className="text-2xl font-semibold mb-6">Analisis de Encuenta</h2>

      {/* CONTENEDOR DE GRAFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* BARRAS - Tasa de Respuesta */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-[#1E3A8A] text-center">
            Tasa de Respuesta
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataBar} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="respuestas">
                <Cell key="c1" fill="#00B5B5" />
                <Cell key="c2" fill="#FDBA74" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DONUT - Distribución por Público */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-[#1E3A8A] text-center">
            Distribución por Público
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label
              >
                {dataPie.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={PIE_COLORS[idx % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* leyenda simple */}
          <div className="flex justify-center gap-6 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#00B5B5] rounded-block inline-block" />
              <span>Recicladores</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#FDBA74] rounded-block inline-block" />
              <span>Ciudadanos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSurveyAnalysis;
