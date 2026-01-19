import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import formsApi from "../../../../../api/formsApi";
import { toast } from "react-hot-toast";
import ResponderFormulario from "./ResponderFormulario";
import ResponsesViewer from "../Respuestas/RespuestasFormulario";
import {
  FileEdit,
  Archive,
  UploadCloud,
  Edit,
  RefreshCw,
  ChevronRight,
  Trash2,
  Eye,
  Search
} from "lucide-react";

const DashboardSurveyAnalysis = ({ onEdit }) => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role_slug === "admin";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [view, setView] = useState("list"); // list, respond, responses
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const fetchForms = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        status: statusFilter === "all" ? undefined : statusFilter,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        search: search || undefined,
        per_page: 8,
        page: page
      };
      
      const response = await formsApi.listForms(params);
      const body = response.data || response;
      
      const list = body.forms || body.data?.forms || (Array.isArray(body.forms) ? body.forms : []);
      const paginInfo = body.pagination || body.data?.pagination || { current_page: 1, last_page: 1, total: 0 };

      setForms(Array.isArray(list) ? list : []);
      setPagination(paginInfo);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Error al cargar los formularios");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, search]);

  useEffect(() => {
    fetchForms(1);
  }, [fetchForms]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchForms(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchForms]);

  const handlePublish = async (id) => {
    try {
      await formsApi.publishForm(id);
      toast.success("Formulario publicado correctamente");
      fetchForms();
    } catch (error) {
      console.error("Error publishing form:", error);
      toast.error("Error al publicar el formulario");
    }
  };

  const handleDelete = (id) => {
      toast((t) => (
          <div className="flex flex-col gap-4">
              <span className="font-semibold text-gray-800">
                  ¿Estás seguro de que deseas eliminar este formulario?
                  <br />
                  <span className="text-xs text-gray-500 font-normal">Esta acción eliminará todas las respuestas asociadas y no se puede deshacer.</span>
              </span>
              <div className="flex gap-2 justify-end">
                  <button
                      onClick={() => toast.dismiss(t.id)}
                      className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                      Cancelar
                  </button>
                  <button
                      onClick={async () => {
                          toast.dismiss(t.id);
                          try {
                              await formsApi.deleteForm(id);
                              toast.success("Formulario eliminado correctamente");
                              fetchForms();
                          } catch (error) {
                              console.error("Error deleting form:", error);
                              toast.error("Error al eliminar el formulario");
                          }
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                      Sí, Eliminar
                  </button>
              </div>
          </div>
      ), {
          duration: 10000,
          style: {
              background: '#fff',
              border: '1px solid #fee2e2',
              padding: '16px',
          },
      });
  };

  const handleToggleArchive = async (id, currentStatus) => {
    try {
      if (currentStatus === 'archived') {
        await formsApi.updateForm(id, { status: 'draft' });
        toast.success("Formulario restaurado a borradores");
      } else {
        await formsApi.archiveForm(id);
        toast.success("Formulario archivado correctamente");
      }
      fetchForms();
    } catch (error) {
      console.error("Error toggling archive status:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

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

  if (view === "responses" && selectedFormId) {
      return (
          <div className="p-6">
              <button
                  onClick={() => setView("list")}
                  className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
              >
                  ← Volver al Listado
              </button>
              <ResponsesViewer
                  formId={selectedFormId}
                  onBack={() => setView("list")}
              />
          </div>
      );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Censo y Georreferenciación</h1>
          <p className="text-sm text-gray-500">Gestión de encuestas técnicas y recolección de datos</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar formulario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="all">Estado: Todos</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
              <option value="archived">Archivados</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="all">Tipo: Todos</option>
              <option value="encuesta">Encuesta</option>
              <option value="normativo">Normativo</option>
              <option value="periodico">Periódico</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004b72]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {forms.length > 0 ? forms.map((form) => {
              const responseCount = form.submissions_count || 0;
              const targetCount = form.metadata?.target_responses || 100;
              const pct = Math.min(100, Math.round((responseCount / targetCount) * 100));

              return (
                <div
                  key={form.id}
                  className="group bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,83,128,0.12)] transition-all duration-500 overflow-hidden flex flex-col h-full ring-1 ring-gray-900/[0.02]"
                >
                  <div className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="p-2 bg-blue-50/50 rounded-xl text-[#004b72]">
                         <FileEdit size={16} />
                      </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                              <div className="flex gap-1.5 flex-wrap">
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                    form.status === 'published' ? 'bg-[#B1D357]/20 text-[#6a822b]' :
                                    form.status === 'draft' ? 'bg-amber-50 text-amber-600' :
                                    'bg-gray-100 text-gray-500'
                                }`}>
                                    {form.status === 'published' ? 'Activa' : 
                                    form.status === 'draft' ? 'Borrador' : 'Archivada'}
                                </span>
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                    form.category === 'normativo' ? 'bg-purple-100 text-purple-700' :
                                    form.category === 'periodico' ? 'bg-blue-100 text-blue-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    <div className={`w-1 h-1 rounded-full ${
                                      form.category === 'normativo' ? 'bg-purple-500' :
                                      form.category === 'periodico' ? 'bg-blue-500' :
                                      'bg-green-500'
                                    }`} />
                                    {form.category === 'normativo' ? 'Normativo' : 
                                     form.category === 'periodico' ? 'Periódico' : 'Encuesta'}
                                </span>
                              </div>
                              <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap">{new Date(form.created_at).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-800 leading-tight truncate px-0.5" title={form.title}>
                             {form.title}
                          </h3>
                       </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 flex-1 flex flex-col justify-end">
                     {form.description && (
                       <p className="text-[10px] text-gray-400 line-clamp-1 mb-3">
                         {form.description}
                       </p>
                     )}

                     <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1.5 relative z-10">
                           <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Progreso</span>
                           <span className="text-[10px] font-black text-[#004b72]">{responseCount}/{targetCount}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-[#004b72] to-[#2C67B0]" style={{ width: `${pct}%` }}></div>
                        </div>
                     </div>
                  </div>

                  <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center gap-2 mt-auto group-hover:bg-white transition-colors duration-300 overflow-x-auto">
                    <div className="flex gap-1.5">
                      {form.status === 'draft' && (
                        <>
                          <button
                            onClick={() => handlePublish(form.id)}
                            className="p-2.5 bg-white text-green-600 rounded-xl hover:bg-green-50 hover:shadow-md border border-gray-100 transition-all"
                            title="Publicar encuesta"
                          >
                            <UploadCloud size={18} />
                          </button>
                          <button
                            onClick={() => onEdit?.(form.id)}
                            className="p-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 hover:shadow-md border border-gray-100 transition-all font-black"
                            title="Editar estructura"
                          >
                            <Edit size={18} />
                          </button>
                        </>
                      )}

                      {form.status !== 'draft' && (
                         <button
                           onClick={() => handleToggleArchive(form.id, form.status)}
                           className="p-2.5 bg-white text-orange-600 rounded-xl hover:bg-orange-50 hover:shadow-md border border-gray-100 transition-all"
                           title={form.status === 'archived' ? 'Mover a borradores' : 'Archivar encuesta'}
                         >
                           <Archive size={18} />
                         </button>
                      )}

                      <button
                          onClick={() => {
                              setSelectedFormId(form.id);
                              setView("responses");
                          }}
                          className="p-2.5 bg-white text-[#004b72] rounded-xl hover:bg-blue-50 hover:shadow-md border border-gray-100 transition-all"
                          title="Ver Respuestas"
                      >
                          <Eye size={18} />
                      </button>

                      <button
                          onClick={() => handleDelete(form.id)}
                          className="p-2.5 bg-white text-red-500 rounded-xl hover:bg-red-50 hover:shadow-md border border-gray-100 transition-all"
                          title="Eliminar encuesta"
                      >
                          <Trash2 size={18} />
                      </button>
                    </div>

                    {form.status === 'published' && !isAdmin && (
                      <button
                        onClick={() => {
                          setSelectedFormId(form.id);
                          setView("respond");
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#004b72] text-white rounded-xl hover:bg-[#2C67B0] transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/10 active:scale-95"
                      >
                        Responder
                        <ChevronRight size={14} />
                      </button>
                    )}

                    {form.status === 'archived' && (
                       <button
                        onClick={() => handleToggleArchive(form.id, form.status)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
                      >
                        <RefreshCw size={14} />
                        Restaurar
                      </button>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                  <Search size={40} className="text-gray-200" />
                </div>
                <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No hay formularios</h3>
                <p className="text-gray-400 text-xs mt-2 font-medium">Prueba con otros filtros o crea uno nuevo en el editor.</p>
              </div>
            )}
          </div>

          {pagination.last_page > 1 && (
            <div className="flex justify-center items-center gap-4 mb-4">
              <button
                disabled={pagination.current_page === 1}
                onClick={() => fetchForms(pagination.current_page - 1)}
                className={`p-2 rounded-xl border transition-all ${
                  pagination.current_page === 1 
                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' 
                    : 'bg-white text-[#004b72] border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <div className="flex gap-2">
                {[...Array(pagination.last_page)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => fetchForms(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      pagination.current_page === i + 1
                        ? 'bg-[#004b72] text-white shadow-lg shadow-blue-900/20'
                        : 'bg-white text-gray-500 border border-gray-100 hover:border-blue-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => fetchForms(pagination.current_page + 1)}
                className={`p-2 rounded-xl border transition-all ${
                  pagination.current_page === pagination.last_page 
                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' 
                    : 'bg-white text-[#004b72] border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardSurveyAnalysis;
