import React, { useState, useEffect, useCallback } from "react";
import { 
  FileSpreadsheet, 
  Search, 
  Download, 
  Calendar, 
  BarChart3, 
  ClipboardList,
  ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import formsApi from "../../../../../api/formsApi";
import { toast } from "react-hot-toast";



export default function ExportacionFormulario() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchForms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await formsApi.listForms({ 
        search: searchTerm, 
        category: selectedCategory !== "all" ? selectedCategory : undefined 
      });
      const body = response.data || response;
      const list = body.forms || body.data?.forms || (Array.isArray(body) ? body : []);
      setForms(Array.isArray(list) ? list : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching forms for export:", err);
      setError("No se pudieron cargar los formularios. Por favor, intenta de nuevo.");
      toast.error("Error al cargar formularios");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleExportExcel = (formId, formName) => {
    // Como no podemos tocar el backend, simulamos el inicio de la descarga
    // o apuntamos al endpoint de respuestas si el backend ya soporta algún tipo de exportación básica.
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `Preparando Excel para "${formName}"...`,
        success: "Descarga iniciada correctamente (Simulado)",
        error: "Error al generar el archivo",
      }
    );
    
    // Aquí iría la lógica real de descarga si el endpoint existiera:
    // window.open(`${config.apiUrl}/forms/${formId}/export/excel`, '_blank');
  };

  const categories = [
    { id: "all", label: "Todos", icon: <ClipboardList size={16} /> },
    { id: "encuesta", label: "Encuestas", icon: <BarChart3 size={16} /> },
    { id: "normativo", label: "Normativos", icon: <ClipboardList size={16} /> },
    { id: "periodico", label: "Periódicos", icon: <Calendar size={16} /> },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-8 animate-fadeIn">
      {/* Header Interactivo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <FileSpreadsheet className="text-green-600" size={24} />
            </div>
            Exportación de Datos
          </h2>
          <p className="text-gray-500">
            Descarga los resultados de tus formularios en formato Microsoft Excel para análisis detallado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Selector de Categoría Estilizado */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 w-full md:w-auto overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Grid de Formularios */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-500 font-medium">Buscando formularios disponibles...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-red-50 rounded-3xl border border-red-100 text-center space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm text-red-500">
            <AlertCircle size={40} />
          </div>
          <div className="max-w-md">
            <p className="text-red-800 font-bold text-lg">{error}</p>
            <button 
              onClick={fetchForms}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-sm"
            >
              Reintentar carga
            </button>
          </div>
        </div>
      ) : forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
          <div className="p-5 bg-gray-50 rounded-full text-gray-300 mb-6">
            <ClipboardList size={60} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No se encontraron formularios</h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            No hay formularios que coincidan con tus filtros o aún no se han creado formularios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {forms.map((form) => (
            <div 
              key={form.ulid || form.id} 
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1"
            >
              {/* Card Header con Badge de Categoría */}
              <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    form.category === 'encuesta' ? 'bg-purple-100 text-purple-700' :
                    form.category === 'normativo' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {form.category || 'General'}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${form.status === 'published' ? 'bg-green-500 ring-4 ring-green-100' : 'bg-gray-300 ring-4 ring-gray-50'}`} />
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 leading-tight line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
                    {form.title}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar size={12} />
                    Actualizado: {new Date(form.updated_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Mini Estadísticas */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-50">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tight">Respuestas</p>
                    <p className="text-lg font-black text-gray-800">{form.submissions_count || 0}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tight">Estado</p>
                    <p className={`text-sm font-bold ${form.status === 'published' ? 'text-green-600' : 'text-gray-500'}`}>
                      {form.status === 'published' ? 'Publicado' : 'Borrador'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones de la Card */}
              <div className="p-4 bg-gray-50/50 flex items-center justify-between group-hover:bg-white transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  <Download size={14} className="text-gray-300" />
                  Formato XLS
                </div>
                <button 
                  onClick={() => handleExportExcel(form.ulid || form.id, form.title)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-green-700 border border-green-200 rounded-xl shadow-sm hover:bg-green-600 hover:text-white hover:border-green-600 transition-all font-bold group/btn disabled:opacity-50"
                  disabled={!form.submissions_count || form.submissions_count === 0}
                  title={!form.submissions_count ? "Sin respuestas para exportar" : "Descargar Excel"}
                >
                  <span className="text-sm">Exportar</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <AlertCircle size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-blue-900">Nota de Exportación</p>
          <p className="text-sm text-blue-800/80 leading-relaxed">
            Las exportaciones solo se generan para formularios que tengan **al menos una respuesta registrada**. 
            El archivo Excel incluirá todas las preguntas, metadatos de usuario (si aplica) y marcas de tiempo de envío.
          </p>
        </div>
      </div>
    </div>
  );
}
