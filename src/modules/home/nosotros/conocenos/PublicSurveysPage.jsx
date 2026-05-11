
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import formsApi from "../../../../api/formsApi";
import { toast } from "react-hot-toast";
import { decodeHtmlEntities, stripHtml } from "../../../../utils/textUtils";

import {
  Play,
  FileText
} from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
// const BRAND = {
//   blue: "#2C67B0",
//   darkBlue: "#005380",
//   green: "#B1D357",
//   gray: "#6B7280",
// };

export default function PublicSurveysPage() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role_slug === "admin";
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  // BRAND COLORS
  const fetchForms = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        status: "published",
        category: categoryFilter === "all" ? undefined : categoryFilter,
        search: search || undefined,
        per_page: 8,
        page: page
      };
      
      const response = await formsApi.listPublicForms(params);
      const body = response.data || response;
      
      const list = body.forms || body.data?.forms || (Array.isArray(body.forms) ? body.forms : []);
      const paginInfo = body.pagination || body.data?.pagination || { current_page: 1, last_page: 1, total: 0 };

      setForms(Array.isArray(list) ? list : []);
      setPagination(paginInfo);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Error al cargar las encuestas");
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [categoryFilter, search]);

  useEffect(() => {
    fetchForms(1);
  }, [fetchForms]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchForms(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchForms]);


  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-[#B1D357]/30">
      {/* HERO SECTION - REFINED DESIGN */}
      <div className="relative min-h-[550px] flex items-center justify-center overflow-hidden">
        {/* Advanced Background with parallax vibe */}
        <div className="absolute inset-0 z-0">
          <img 
            src={require("../../../../assets/fondosYlogos/fondo_encuestas.png")} 
            alt="Fondo Encuestas" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#005380]/95 via-[#005380]/80 to-transparent"></div>
          
          {/* Decorative floating elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#B1D357]/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#2C67B0]/20 rounded-full blur-[120px]"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Profundiza más con nosotros
            </h1>
            
            <p className="text-lg text-blue-50/80 leading-relaxed font-medium mb-12 max-w-2xl mx-auto">
            Un espacio estratégico diseñado para las empresas que desean sumarse al colectivo Visión Circular. Inicia tu proceso de vinculación y participa en la transformación sostenible.
            </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-20 relative z-20 pb-32">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-[#005380] flex items-center gap-3">
                    <div className="w-1.5 h-10 bg-[#B1D357] rounded-full"></div>
                    Iniciativas Técnicas
                </h2>
                <p className="text-gray-500 font-medium ml-4">({pagination.total}) Encuestas y procesos activos</p>
            </div>

            <div className="flex flex-wrap gap-4 w-full md:w-auto mt-6 md:mt-0">
                <div className="relative flex-1 md:flex-none">
                    <input 
                      type="text"
                      placeholder="Buscar por título..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full md:w-64 pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#B1D357] outline-none text-sm transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Play size={14} className="rotate-180" />
                    </div>
                </div>

                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#B1D357] outline-none text-sm font-bold text-[#005380] transition-all cursor-pointer"
                >
                    <option value="all">Todas las Categorías</option>
                    <option value="encuesta">Encuestas</option>
                    <option value="normativo">Normativo</option>
                    <option value="periodico">Periódico</option>
                </select>
            </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-pulse h-80 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl"></div>
                            <div className="h-6 bg-gray-100 rounded-full w-3/4"></div>
                            <div className="h-4 bg-gray-50 rounded-full w-full"></div>
                            <div className="h-4 bg-gray-50 rounded-full w-5/6"></div>
                        </div>
                        <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {forms.length > 0 ? forms.map((form, idx) => (
                <div
                key={form.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
                style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both` }}
                >
                  <div className="p-6 flex flex-col h-full bg-gradient-to-br from-white to-gray-50/50">
                    {/* Header: Icon + Status + Date */}
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-12 h-12 bg-[#2C67B0]/10 text-[#2C67B0] rounded-xl flex items-center justify-center shadow-sm shrink-0">
                          <FileText size={22} />
                       </div>
                       <div className="flex flex-col items-end">
                           <span className="text-[10px] font-black text-[#B1D357] uppercase tracking-wider bg-[#F4F9E6] px-2.5 py-1 rounded-md border border-[#B1D357]/20 flex items-center gap-1">
                             <div className="w-1 h-1 bg-[#B1D357] rounded-full animate-pulse" />
                             {form.category === 'normativo' ? 'Normativo' : 
                              form.category === 'periodico' ? 'Periódico' : 'Encuesta'}
                           </span>
                           <span className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-tight">
                             {new Date(form.created_at).toLocaleDateString()}
                           </span>
                       </div>
                    </div>

                    {/* Title & Desc */}
                    <div className="flex-1 mb-6">
                       <h3 className="text-lg font-black text-[#005380] mb-2 group-hover:text-[#2C67B0] transition-colors leading-tight line-clamp-2">
                          {decodeHtmlEntities(form.title)}
                       </h3>
                       <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">
                          {stripHtml(form.description) || "Iniciativa técnica disponible para consulta."}
                       </p>
                    </div>

                    {/* Footer: Category + Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100/50 mt-auto gap-4">
                        {/* Category removed as requested */}

                        <Link
                          to={`/encuestas/${form.id}`}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm ${
                            isAdmin 
                               ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' 
                               : 'bg-[#005380] text-white hover:bg-[#004b72] hover:shadow-md'
                          }`}
                        >
                          {isAdmin ? 'Ver' : 'Participar'}
                          <Play size={10} fill="currentColor" />
                        </Link>
                    </div>
                  </div>
                </div>
            )) : (
                <div className="col-span-full py-20 text-center">
                    <div className="bg-white p-16 rounded-[3rem] shadow-2xl border border-gray-100 inline-block max-w-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#B1D357] to-[#2C67B0]"></div>
                        <div className="w-24 h-24 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <FileText size={48} className="text-gray-200" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-800 mb-4">Módulo en Preparación</h3>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed">
                            Actualmente estamos procesando nuevas iniciativas técnicas. Por favor, vuelve a consultar pronto para participar.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-10 px-8 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
                        >
                            Actualizar Vista
                        </button>
                    </div>
                </div>
            )}
            </div>
        )}

        {/* PAGINATION */}
        {pagination.last_page > 1 && (
          <div className="flex justify-center items-center gap-4 mt-20">
            <button
              disabled={pagination.current_page === 1}
              onClick={() => fetchForms(pagination.current_page - 1)}
              className={`p-3 rounded-2xl border bg-white shadow-sm transition-all ${
                pagination.current_page === 1 
                  ? 'text-gray-200 cursor-not-allowed border-gray-50' 
                  : 'text-[#005380] border-gray-100 hover:border-[#B1D357] hover:bg-gray-50'
              }`}
            >
              <Play size={16} className="rotate-180" />
            </button>
            <div className="flex gap-2">
              {[...Array(pagination.last_page)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchForms(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black transition-all ${
                    pagination.current_page === i + 1
                      ? 'bg-[#B1D357] text-white shadow-lg shadow-[#B1D357]/20'
                      : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => fetchForms(pagination.current_page + 1)}
              className={`p-3 rounded-2xl border bg-white shadow-sm transition-all ${
                pagination.current_page === pagination.last_page 
                  ? 'text-gray-200 cursor-not-allowed border-gray-50' 
                  : 'text-[#005380] border-gray-100 hover:border-[#B1D357] hover:bg-gray-50'
              }`}
            >
              <Play size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
}
