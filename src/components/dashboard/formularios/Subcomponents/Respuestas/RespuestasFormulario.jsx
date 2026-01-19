import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import formsApi from "../../../../../api/formsApi";
import { toast } from "react-hot-toast";
import { 
  Search, 
  ArrowLeft, 
  Calendar, 
  User, 
  X,
  FileText,
  Clock,
  Download,
  Eye,
  Layout,
  ChevronRight,
  MessageSquare
} from "lucide-react";

/**
 * Modal de Detalle de Respuesta (Utiliza Portal para visualización global)
 */
const ResponseDetailModal = ({ response, onClose }) => {
  if (!response) return null;

  const date = response.submitted_at || response.created_at;
  const submissions = response.field_submissions || [];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white/95 backdrop-blur-md w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-gradient-to-br from-blue-50/50 to-transparent">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <MessageSquare size={20} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Detalle del Registro</span>
            </div>
            <h3 className="text-2xl font-black text-gray-800 leading-tight">
              Respuesta #{response.id?.toString().slice(0, 8)}
            </h3>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400 font-medium">
               <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full text-blue-600">
                  <User size={14} />
                  <span className="font-bold">{response.user?.name || "Invitado"}</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(date).toLocaleDateString()}
               </div>
               <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {new Date(date).toLocaleTimeString()}
               </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {submissions.length > 0 ? (
            <div className="grid gap-6">
              {submissions.map((sub, idx) => {
                const field = sub.field || {};
                const questionLabel = field.label || field.name || "Pregunta Sin Título";
                
                // Mapeo de valores para selects/radios/checkboxes
                let displayValue = sub.value;
                if (field.options?.choices || field.options?.options) {
                    const choices = field.options.choices || field.options.options || [];
                    const subValues = Array.isArray(sub.value) ? sub.value : [sub.value];
                    
                    const matchedLabels = choices
                        .filter(c => subValues.includes(c.value) || subValues.includes(String(c.id)))
                        .map(c => c.label);
                    
                    if (matchedLabels.length > 0) displayValue = matchedLabels.join(", ");
                }

                return (
                  <div key={sub.id || idx} className="group flex flex-col gap-2 p-5 rounded-3xl hover:bg-blue-50/40 transition-all border border-gray-100/50 hover:border-blue-100/50 bg-white/50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                      {questionLabel}
                    </span>
                    <div className="text-sm text-gray-700 font-semibold mt-1">
                      {sub.file_path ? (
                        <a 
                          href={`${process.env.REACT_APP_API_URL || ''}/storage/${sub.file_path}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline bg-blue-50 px-4 py-2 rounded-xl w-fit"
                        >
                          <Download size={14} />
                          Descargar Archivo
                        </a>
                      ) : (
                        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 leading-relaxed min-h-[3rem] flex items-center">
                            {displayValue || <span className="text-gray-300 italic">Sin respuesta</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <FileText size={40} className="text-gray-200" />
              </div>
              <p className="font-medium italic">No se encontraron respuestas detalladas para este envío.</p>
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-[#004b72] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2C67B0] transition-all shadow-lg shadow-blue-900/10 active:scale-95"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ResponseManagement = ({ formId: initialFormId, onBack }) => {
  const [currentFormId, setCurrentFormId] = useState(initialFormId);
  const [searchTerm, setSearchTerm] = useState("");
  const [responses, setResponses] = useState([]);
  const [formsList, setFormsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);

  // Obtener lista de formularios si no hay ID (Vista Global)
  const fetchForms = async () => {
     setLoading(true);
     try {
        const response = await formsApi.listForms({ status: 'published' });
        // Soportar diferentes estructuras de respuesta
        const list = response.data?.forms || response.data || response || [];
        setFormsList(Array.isArray(list) ? list : []);
     } catch (error) {
        console.error("Error fetching forms:", error);
        toast.error("Error al cargar la lista de formularios");
     } finally {
        setLoading(false);
     }
  };

  const fetchResponses = async () => {
    if (!currentFormId) return;
    setLoading(true);
    try {
      const response = await formsApi.getFormResponses(currentFormId);
      setResponses(response.data || []);
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast.error("Error al cargar las respuestas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentFormId) {
      fetchResponses();
    } else {
      fetchForms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFormId]);

  const filteredResponses = responses.filter((response) => {
    const searchString = JSON.stringify(response).toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const filteredForms = formsList.filter(f => 
    (f.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pantalla de Selección de Formulario (Vista Global / Respuestas Tab)
  if (!currentFormId && !loading) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-[3rem] border border-white shadow-2xl p-8 animate-slideUp ring-1 ring-gray-900/[0.03]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
               <h3 className="text-3xl font-black text-gray-800 tracking-tight">Centro de Respuestas</h3>
               <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-tighter">Selecciona un formulario para consultar sus datos acumulados</p>
            </div>
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-72 pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredForms.map(form => (
               <button
                 key={form.id}
                 onClick={() => setCurrentFormId(form.id)}
                 className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all text-left flex flex-col gap-4 relative overflow-hidden active:scale-[0.98]"
               >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors duration-500 pointer-events-none" />
                 
                 <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2 relative z-10">
                    <Layout size={24} />
                 </div>
                 
                 <div className="relative z-10">
                    <h4 className="font-black text-gray-800 line-clamp-2 leading-tight h-10">{form.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                       <MessageSquare size={12} className="text-blue-400" />
                       {form.submissions_count || 0} envíos registrados
                    </p>
                 </div>

                 <div className="flex justify-end mt-2 relative z-10">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-[#004b72] group-hover:text-white transition-all shadow-sm">
                       <ChevronRight size={20} />
                    </div>
                 </div>
               </button>
             ))}
             {filteredForms.length === 0 && (
                <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                   <p className="text-gray-400 font-bold italic">No hay formularios publicados disponibles para consultar.</p>
                </div>
             )}
          </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[3rem] border border-white shadow-2xl p-8 animate-slideUp ring-1 ring-gray-900/[0.03]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
           <button 
             onClick={() => {
                if (initialFormId) onBack?.();
                else {
                    setCurrentFormId(null);
                    setResponses([]);
                }
             }}
             className="mb-4 flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest group transition-all"
           >
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
             {initialFormId ? "Volver al Listado de Encuestas" : "Volver a Filtro Global"}
           </button>
           <h3 className="text-3xl font-black text-gray-800 tracking-tight">Registro de Respuestas</h3>
           <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-tighter">Explorando datos en tiempo real</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                placeholder="Filtrar registros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-72 pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none text-sm font-medium transition-all"
              />
            </div>
            <button
               onClick={fetchResponses}
               className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-blue-50 text-blue-600 transition-all shadow-sm hover:shadow-md"
               title="Actualizar Datos"
            >
               <Clock size={18} />
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#004b72]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="h-8 w-8 bg-blue-50 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest text-center">
            Sincronizando Base de Datos...
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white/50 shadow-sm font-sans">
          {filteredResponses.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-gray-100">
                  <Search size={32} className="text-gray-200" />
                </div>
                <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest italic">Sin resultados</h3>
                <p className="text-gray-400 text-xs mt-2 font-medium">No se han encontrado envíos que coincidan con la búsqueda.</p>
             </div>
          ) : (
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                    <th className="p-6 border-b border-gray-100">Marca Temporal</th>
                    <th className="p-6 border-b border-gray-100">Identificación</th>
                    <th className="p-6 border-b border-gray-100">Resumen</th>
                    <th className="p-6 border-b border-gray-100 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600">
                  {filteredResponses.map((response, index) => {
                    const submissions = response.field_submissions || [];
                    const userName = response.user?.name || "Invitado";
                    
                    return (
                      <tr 
                        key={response.id || index} 
                        className="group border-b border-gray-50 hover:bg-blue-50/30 transition-all duration-300"
                      >
                        <td className="p-6 border-b border-gray-50">
                           <div className="flex flex-col">
                             <span className="font-black text-gray-700">{new Date(response.submitted_at || response.created_at).toLocaleDateString()}</span>
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{new Date(response.submitted_at || response.created_at).toLocaleTimeString()}</span>
                           </div>
                        </td>
                        <td className="p-6 border-b border-gray-50">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xs ring-4 ring-blue-50/50 shadow-sm">
                                 <User size={14} />
                              </div>
                              <span className="font-bold text-gray-600">{userName}</span>
                           </div>
                        </td>
                        <td className="p-6 border-b border-gray-50 max-w-xs">
                           <div className="flex flex-wrap gap-2">
                              {submissions.slice(0, 2).map((sub, sIdx) => (
                                <span key={sIdx} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-400 truncate max-w-[120px] shadow-sm" title={sub.value}>
                                  {sub.value}
                                </span>
                              ))}
                              {submissions.length > 2 && <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-full">+{submissions.length - 2}</span>}
                              {submissions.length === 0 && <span className="text-[10px] text-gray-300 italic">Sin datos de respuesta</span>}
                           </div>
                        </td>
                        <td className="p-6 border-b border-gray-50">
                           <div className="flex justify-center">
                              <button 
                                onClick={() => setSelectedResponse(response)}
                                className="flex items-center gap-2 py-2 px-5 bg-white text-[#004b72] rounded-xl border border-gray-200 font-black text-[10px] uppercase tracking-widest hover:bg-[#004b72] hover:text-white hover:border-[#004b72] hover:shadow-xl hover:shadow-blue-900/10 transition-all active:scale-95 translate-y-0 group-hover:-translate-y-1 shadow-sm"
                              >
                                <span>Ver Detalle</span>
                                <Eye size={14} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Detalle (Renderizado vía Portal) */}
      {selectedResponse && (
        <ResponseDetailModal 
          response={selectedResponse} 
          onClose={() => setSelectedResponse(null)} 
        />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default ResponseManagement;
