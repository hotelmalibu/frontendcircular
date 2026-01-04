import React, { useState, useEffect } from "react";
import formsApi from "../../../../../api/formsApi";
import { toast } from "react-hot-toast";
import ResponderFormulario from "./ResponderFormulario";
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
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  BarChart3,
  FileEdit,
  Play
} from "lucide-react";

const DashboardSurveyAnalysis = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [view, setView] = useState("list"); // list or respond

  const fetchForms = async () => {
    setLoading(true);
    try {
      const params = {
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search || undefined,
        per_page: 50 // Increase limit to be sure
      };
      const response = await formsApi.listForms(params);
      console.log("Form list response:", response);

      const body = response.data || response;
      // Handle various response patterns: [ ... ], { forms: [...] }, { data: { forms: [...] } }, { data: [...] }
      const list = Array.isArray(body)
        ? body
        : (body.forms || (body.data && (Array.isArray(body.data) ? body.data : body.data.forms)) || []);

      console.log("Parsed forms list:", list);
      console.log("Final form list to render:", list);
      if (list.length === 0 && (search || statusFilter !== "all")) {
        console.log("No forms found with current filters.");
      }
      setForms(list);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Error al cargar los formularios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [statusFilter]);

  // Handle search with debounce in a real app, here simple trigger on enter or button
  const handleSearch = (e) => {
    if (e.key === "Enter") fetchForms();
  };

  // --- Datos para gráficos (Stubs for now, as they'd probably come from a separate analytics endpoint) ---
  const dataBar = [
    { name: "Caracterización", respuestas: 40 },
    { name: "Percepción", respuestas: 45 },
  ];

  const dataPie = [
    { name: "Empresas", value: 40 },
    { name: "Gestores", value: 60 },
  ];

  const PIE_COLORS = ["#00B6B6", "#FDBA74"];

  if (view === "respond" && selectedFormId) {
    return (
      <div className="p-6">
        <button
          onClick={() => setView("list")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
        >
          ← Volver al Listado
        </button>
        <ResponderFormulario
          formId={selectedFormId}
          onCancel={() => setView("list")}
          onSuccess={() => {
            setView("list");
            fetchForms();
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Censo y Georreferenciación</h1>
          <p className="text-sm text-gray-500">Gestión de encuestas técnicas y recolección de datos</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar formulario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Ver Todos</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
            <option value="archived">Archivados</option>
          </select>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004b72]"></div>
        </div>
      ) : (
        <>
          {/* SURVEY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {forms.length > 0 ? forms.map((form) => {
              // Simulating some stats that might not be in the basic list API
              const responseCount = form.responses_count || 0;
              const targetCount = form.metadata?.target_responses || 100;
              const pct = Math.min(100, Math.round((responseCount / targetCount) * 100));

              return (
                <div
                  key={form.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                      <FileEdit size={24} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {form.status === 'published' ? 'Activa' : 'Borrador'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1">
                    {form.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-4">
                    {form.description || "Sin descripción proporcionada."}
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                      <span>Respuestas</span>
                      <span>{responseCount} / {targetCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#004b72] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{new Date(form.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      <span>{form.metadata?.category || "Técnica"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedFormId(form.id);
                        setView("respond");
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#004b72] text-white py-2.5 rounded-xl font-bold hover:bg-[#003a58] transition-all shadow-sm"
                    >
                      <Play size={16} />
                      Responder
                    </button>
                    <button className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
                      <BarChart3 size={20} />
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-20 text-center">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-dashed border-gray-300 inline-block">
                  <FileEdit size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400">No se encontraron formularios</h3>
                  <p className="text-gray-400 text-sm mt-1">Intenta con otros filtros o crea uno nuevo en el editor.</p>
                </div>
              </div>
            )}
          </div>

          {/* ANALYSIS TITLE */}
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-[#004b72]" size={32} />
            <h2 className="text-3xl font-bold text-gray-800">Impacto y Análisis</h2>
          </div>

          {/* CHARTS CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* BARS - Response Rate */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800">
                Tasa de Respuesta por Tipo
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataBar}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="respuestas" radius={[6, 6, 0, 0]} barSize={40}>
                    <Cell key="c1" fill="#00B6B6" />
                    <Cell key="c2" fill="#FDBA74" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PIE - Population Distribution */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800">
                Población Atendida
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {dataPie.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-8 mt-4">
                {dataPie.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                    <span className="text-sm font-semibold text-gray-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardSurveyAnalysis;
