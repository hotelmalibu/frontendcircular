import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  ArrowLeft, 
  FileText,
  User,
  Clock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { 
  BarChart, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Bar 
} from "recharts";
import formsApi from "../../../../../api/formsApi";
import toast from "react-hot-toast";

const BRAND_COLORS = ['#005380', '#B1D357', '#003a5a', '#c2df7a', '#0070ad', '#86a836', '#002538', '#d9ecab'];

// --- Compact & Responsive Components ---

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

const EmptyState = ({ message = "Sin datos", icon: Icon = MessageSquare }) => (
    <div className="py-8 text-center text-gray-300 italic bg-gray-50/20 rounded-xl border border-dashed border-gray-100/50">
        <Icon size={24} className="mx-auto mb-1 opacity-20" />
        <span className="text-[10px] md:text-xs">{message}</span>
    </div>
);

const Pagination = ({ meta, onPageChange }) => {
    if (!meta || meta.last_page <= 1) return null;
    const { current_page, last_page } = meta;
    
    return (
        <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-50 w-full">
            <span className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase">
                {meta.from}-{meta.to} de {meta.total}
            </span>
            <div className="flex items-center gap-1">
                <button disabled={current_page === 1} onClick={() => onPageChange(current_page - 1)} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 disabled:opacity-20 transition-all"><ChevronLeft size={16} /></button>
                <div className="flex gap-1">
                    {[...Array(Math.min(5, last_page))].map((_, i) => {
                        let p = current_page <= 3 ? i + 1 : (current_page >= last_page - 2 ? last_page - 4 + i : current_page - 2 + i);
                        if (p <= 0 || p > last_page) return null;
                        return (
                            <button key={p} onClick={() => onPageChange(p)} className={`w-7 h-7 rounded-lg text-[10px] md:text-xs font-bold transition-all ${current_page === p ? 'bg-[#005380] text-white' : 'text-gray-400 hover:bg-gray-100'}`}>{p}</button>
                        );
                    })}
                </div>
                <button disabled={current_page === last_page} onClick={() => onPageChange(current_page + 1)} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 disabled:opacity-20 transition-all"><ChevronRight size={16} /></button>
            </div>
        </div>
    );
};

const FieldWidget = ({ field, value, type, fileUrl }) => {
    // Si hay un fileUrl explícito o el valor parece una URL
    const isFileUrl = (str) => typeof str === 'string' && (str.startsWith('http') || str.includes('/storage/'));
    
    if (fileUrl || (type === 'file' && value && isFileUrl(value))) {
        const url = fileUrl || value;
        return (
            <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#005380] text-white rounded-lg text-[10px] md:text-xs font-bold uppercase hover:bg-black transition-all shadow-sm mt-1">
                <FileText size={14} /> Ver Adjunto <ExternalLink size={10} className="opacity-50" />
            </a>
        );
    }

    const isGrid = type?.includes('grid');
    const isPossibleJson = typeof value === 'string' && (value.trim().startsWith('{') || value.trim().startsWith('['));

    if (isGrid || isPossibleJson || (typeof value === 'object' && value !== null)) {
        try {
            const data = (typeof value === 'string') ? JSON.parse(value) : (value || {});
            const options = field?.options || {};
            const rows = options.rows || [];
            const columns = options.columns || [];
            
            if (rows.length === 0) {
                return (
                    <div className="mt-1 space-y-1 text-left w-full">
                        {Object.entries(data).map(([key, val], idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[10px] md:text-[11px] text-left">
                                <span className="font-bold text-gray-400 uppercase">{key.replace(/_/g, ' ')}:</span>
                                <span className="text-[#005380] font-medium">{String(val)}</span>
                            </div>
                        ))}
                    </div>
                );
            }

            return (
                <div className="mt-2 rounded-lg border border-gray-100 overflow-hidden text-[10px] md:text-[11px] bg-white text-left w-full max-w-lg">
                    <div className="grid grid-cols-2 bg-gray-50/50 border-b border-gray-100 px-3 py-1 font-bold text-gray-400 uppercase tracking-tighter text-left">
                        <span>Fila</span><span>Respuesta</span>
                    </div>
                    {rows.map((row, i) => {
                        const cellVal = data[row.id];
                        const cellArray = Array.isArray(cellVal) ? cellVal : [cellVal];
                        const labels = cellArray.map(cv => {
                            const col = columns.find(c => String(c.id) === String(cv));
                            return col ? col.label : cv;
                        }).filter(Boolean);
                        
                        return (
                            <div key={i} className="grid grid-cols-2 px-3 py-1.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors text-left">
                                <span className="font-medium text-gray-600 truncate mr-2">{row.label}</span>
                                <span className={labels.length > 0 ? "text-[#005380] font-bold" : "text-gray-300"}>{labels.join(", ") || '-'}</span>
                            </div>
                        );
                    })}
                </div>
            );
        } catch (e) { 
            // Si el parsing falla pero era un GRID, mostramos el valor plano al menos
            return <span className="text-gray-400 text-[10px] italic text-left block w-full">{String(value)}</span>; 
        }
    }

    // Mapeo robusto de valor a etiqueta (Select/Radio/LinearScale)
    const options = field?.options?.choices || field?.options?.options || [];
    if (options.length > 0) {
        const choice = options.find(c => String(c.value) === String(value));
        if (choice) return <span className="text-[#005380] font-bold text-[11px] md:text-sm mt-1 block text-left">{choice.label}</span>;
    }

    if (type === 'checkbox' && (value === "true" || value === true || value === "1" || value === 1)) return <span className="text-[#B1D357] font-black text-[10px] md:text-xs uppercase mt-1 block text-left">✓ Seleccionado</span>;
    if (Array.isArray(value)) return <div className="flex flex-wrap gap-1 mt-1.5 text-left">{value.map((v, i) => <span key={i} className="px-2 py-0.5 bg-blue-50 text-[#005380] rounded-md font-bold text-[9px] md:text-[10px] uppercase border border-blue-100">{v}</span>)}</div>;
    
    return <span className="text-gray-600 font-medium text-[11px] md:text-sm leading-relaxed block mt-1 whitespace-pre-wrap text-left w-full">{String(value || "Sin respuesta")}</span>;
};

// --- View Sections ---

const SummaryTab = ({ analytics }) => {
    if (!analytics || !analytics.fields) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
    );

    const displayableFields = analytics.fields.filter(f => f.total_responses > 0);

    const renderChart = (field) => {
        let type = field.display_type || 'list';
        if (!field.data || field.data.length === 0) return <EmptyState />;

        if (type === 'pie') {
            return (
                <div className="w-full h-[150px] md:h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={field.data} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius="40%" 
                                outerRadius="70%" 
                                dataKey="value"
                                isAnimationActive={false}
                            >
                                {field.data.map((_, index) => <Cell key={index} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            );
        } else if (type === 'bar_vertical') {
            return (
                <div className="w-full h-[150px] md:h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={field.data} margin={{ top: 5, right: 10, left: -25, bottom: 20 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 8 }} interval={0} angle={-30} textAnchor="end" />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8 }} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none' }} />
                            <Bar dataKey="value" fill="#005380" radius={[2, 2, 0, 0]} barSize={14} isAnimationActive={false}>
                                {field.data.map((_, index) => <Cell key={index} fill={index % 2 === 0 ? '#005380' : '#B1D357'} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        } else if (type === 'bar_horizontal') {
            return (
                <div className="w-full h-[150px] md:h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={field.data} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 8 }} />
                            <Bar dataKey="value" fill="#B1D357" radius={[0, 2, 2, 0]} barSize={10} isAnimationActive={false} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        } else {
            // LIST VIEW (Para nombres, textos largos, archivos)
            return (
                <div className="space-y-1 mt-1 max-h-[140px] md:max-h-[170px] overflow-y-auto custom-scrollbar-mini pr-1 w-full">
                    {field.data.map((resp, i) => {
                        const isUrl = String(resp).includes('http') || String(resp).includes('/storage/');
                        return (
                            <div key={i} className="bg-gray-50/50 px-2.5 py-1.5 rounded-lg text-[10px] md:text-xs text-gray-500 border border-gray-100/50 truncate hover:bg-white transition-colors text-left w-full">
                                {isUrl ? (
                                    <a href={String(resp)} target="_blank" rel="noreferrer" className="text-[#005380] font-bold flex items-center gap-1"><FileText size={10}/> Ver Archivo</a>
                                ) : String(resp)}
                            </div>
                        );
                    })}
                </div>
            );
        }
    };

    return (
        <div className="animate-fadeIn space-y-4 pb-10 w-full">
            <div className="bg-[#005380] px-6 py-4 rounded-xl flex items-center justify-between text-white shadow-md w-full">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl md:text-2xl font-black">{analytics.total_submissions}</h2>
                    <div>
                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-60">Respuestas totales recibidas</p>
                    </div>
                </div>
                <div className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Resumen Estadístico</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {displayableFields.map((field, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-100 transition-all flex flex-col h-full shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <div className="mb-3 text-left">
                            <span className="text-[8px] md:text-[9px] font-black text-[#B1D357] uppercase bg-green-50/50 px-2 py-0.5 rounded-md inline-block mb-1">{field.type}</span>
                            <h4 className="text-[11px] md:text-sm font-bold text-gray-800 leading-tight line-clamp-2 text-left">{field.label}</h4>
                        </div>
                        <div className="flex-1 flex flex-col justify-start min-h-[150px]">
                            {renderChart(field)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const QuestionTab = ({ analytics, responses, onPageChange, paginationMeta }) => {
    const [selectedIdx, setSelectedIdx] = useState(0);
    if (!analytics || !analytics.fields) return <EmptyState />;
    
    const field = analytics.fields[selectedIdx];
    const fieldAnswers = responses.filter(r => {
        const sub = r.field_submissions?.find(fs => String(fs.form_field_id) === String(field.id));
        return sub && sub.value !== null && sub.value !== "";
    });

    return (
        <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn pb-10 w-full">
            <div className="bg-white p-2 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-2 sticky top-4 z-20 shadow-md">
                <select value={selectedIdx} onChange={e => setSelectedIdx(Number(e.target.value))} className="flex-1 bg-gray-50 font-bold text-gray-700 text-xs md:text-sm py-2 px-3 rounded-lg outline-none cursor-pointer border-r-8 border-transparent">
                    {analytics.fields.map((f, i) => <option key={i} value={i}>{i+1}. {f.label}</option>)}
                </select>
                <div className="flex gap-1 justify-center">
                    <button onClick={() => setSelectedIdx(p => p-1)} disabled={selectedIdx === 0} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 disabled:opacity-20 hover:text-[#005380] border border-gray-100 transition-all"><ChevronLeft size={18} /></button>
                    <button onClick={() => setSelectedIdx(p => p+1)} disabled={selectedIdx === analytics.fields.length - 1} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 disabled:opacity-20 hover:text-[#005380] border border-gray-100 transition-all"><ChevronRight size={18} /></button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
                <div className="p-5 md:p-8 border-b border-gray-50 bg-gray-50/20 text-left">
                    <h3 className="text-base md:text-2xl font-black text-gray-800 leading-tight text-left">{field.label}</h3>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest text-left">{fieldAnswers.length} respuestas filtradas</p>
                </div>
                <div className="p-5 md:p-8 divide-y divide-gray-50 text-left w-full">
                    {fieldAnswers.length > 0 ? fieldAnswers.map((item, idx) => {
                        const sub = item.field_submissions?.find(fs => String(fs.form_field_id) === String(field.id));
                        return (
                            <div key={idx} className="py-6 first:pt-0 last:pb-0 text-left w-full">
                                <div className="text-[9px] md:text-[10px] font-bold text-gray-300 uppercase mb-3 tracking-[0.2em] flex items-center gap-2 text-left">
                                    <Clock size={12} /> {new Date(item.submitted_at).toLocaleString()}
                                </div>
                                <FieldWidget field={field} value={sub?.value} type={field.type} fileUrl={sub?.file_url} />
                            </div>
                        );
                    }) : <EmptyState message="No hay respuestas para esta pregunta" />}
                    <Pagination meta={paginationMeta} onPageChange={onPageChange} />
                </div>
            </div>
        </div>
    );
};

const IndividualTab = ({ responses, paginationMeta, onPageChange }) => {
    const [idx, setIdx] = useState(0);
    if (!responses || responses.length === 0) return <EmptyState message="No hay expedientes disponibles" />;
    
    const safeIdx = Math.min(Math.max(0, idx), responses.length - 1);
    const res = responses[safeIdx];

    return (
        <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn pb-10 w-full">
            <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 text-[#005380] rounded-lg flex items-center justify-center font-black text-[10px] md:text-xs">
                        #{safeIdx + 1}
                    </div>
                    <div className="text-xs md:text-sm font-black text-gray-800 uppercase tracking-tighter">Detalle de Respuesta Individual</div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIdx(p => p-1)} disabled={safeIdx === 0} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 disabled:opacity-20 hover:text-[#005380] border border-gray-100 transition-all"><ChevronLeft size={20} /></button>
                    <span className="flex items-center px-4 bg-gray-50 rounded-lg text-[10px] md:text-xs font-bold text-gray-500">{safeIdx + 1} / {responses.length}</span>
                    <button onClick={() => setIdx(p => p+1)} disabled={safeIdx === responses.length - 1} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 disabled:opacity-20 hover:text-[#005380] border border-gray-100 transition-all"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left w-full">
                <div className="p-6 md:p-10 bg-gray-50/30 border-b border-gray-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="text-left">
                        <h4 className="text-sm md:text-base font-black text-gray-800 uppercase tracking-widest text-left">Resumen del Envío</h4>
                        <div className="text-[10px] md:text-xs text-gray-400 mt-1 flex items-center gap-1.5 font-medium"><Clock size={12} /> {new Date(res.submitted_at).toLocaleString()}</div>
                    </div>
                    <div className="text-[10px] md:text-xs font-black text-[#005380] bg-white border border-blue-50 px-4 py-1.5 rounded-full shadow-sm">ID: {res.id.toString().slice(-8).toUpperCase()}</div>
                </div>
                <div className="p-6 md:p-10 space-y-8 text-left w-full">
                    {res.field_submissions?.map((s, i) => {
                        const f = s.field || {};
                        const type = (f.fieldType?.slug || 'text');
                        if (['title', 'paragraph', 'section', 'divider', 'spacer', 'image', 'video', 'header', 'rich_text'].includes(type)) return null;
                        return (
                            <div key={i} className="group border-l-2 border-transparent hover:border-[#B1D357] pl-4 transition-all text-left w-full">
                                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1.5 group-hover:text-[#005380] transition-colors text-left">{f.label || "Campo"}</label>
                                <FieldWidget field={f} value={s.value} type={type} fileUrl={s.file_url} />
                            </div>
                        );
                    })}
                    <Pagination meta={paginationMeta} onPageChange={onPageChange} />
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const ResponseManagement = ({ formId: initialFormId, onBack }) => {
  const [formId, setFormId] = useState(initialFormId);
  const [tab, setTab] = useState('summary');
  const [search, setSearch] = useState("");
  const [responses, setResponses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [formsList, setFormsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const fetchForms = useCallback(async () => {
     setLoading(true);
     try {
        const res = await formsApi.listForms({ status: 'published' });
        setFormsList(res.data?.forms || res.data || []);
     } catch (e) { toast.error("Error al cargar lista"); } finally { setLoading(false); }
  }, []);

  const fetchData = useCallback(async (p = 1) => {
    if (!formId) return;
    setLoading(true);
    try {
      const [resData, statData] = await Promise.all([
          formsApi.getFormResponses(formId, { page: p }),
          p === 1 ? formsApi.getFormAnalytics(formId) : Promise.resolve(analytics)
      ]);
      setResponses(resData.data?.data || resData.data || []);
      setMeta(resData.data?.meta || null);
      if (p === 1) setAnalytics(statData.data || statData || null);
      setPage(p);
    } catch (e) { toast.error("Error al obtener datos"); } finally { setLoading(false); }
  }, [formId, analytics]);

  useEffect(() => { if (formId) fetchData(1); else fetchForms(); }, [formId, fetchData, fetchForms]);

  const filtered = formsList.filter(f => (f.title || "").toLowerCase().includes(search.toLowerCase()));

  if (!formId) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-10 animate-fadeIn w-full">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 w-full">
            <div className="border-l-4 border-[#B1D357] pl-5 text-left">
                 <h3 className="text-3xl md:text-5xl font-black text-[#005380] tracking-tighter text-left">Centro de Inteligencia</h3>
                 <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-[0.4em] mt-2 text-left">Gestión avanzada de ecos de datos</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input type="text" placeholder="Buscar formulario..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-white border border-gray-100 rounded-xl outline-none shadow-sm text-sm md:text-base font-bold placeholder:text-gray-200 focus:border-[#005380] transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {loading ? [1,2,3,4,8].map(i => <Skeleton key={i} className="h-36" />) : filtered.map(f => (
                <button key={f.id} onClick={() => setFormId(f.id)} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 hover:border-[#005380] hover:-translate-y-1.5 transition-all text-left group shadow-sm hover:shadow-xl hover:shadow-blue-900/5">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#005380] mb-5 group-hover:bg-[#005380] group-hover:text-white transition-all transform group-hover:rotate-6"><FileText size={24} /></div>
                    <h4 className="text-sm md:text-base font-black text-gray-800 leading-tight mb-3 line-clamp-2 text-left">{f.title}</h4>
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#B1D357] rounded-full" /><p className="text-[10px] md:text-[11px] text-gray-400 font-bold uppercase tracking-widest">{f.submissions_count || 0} Respuestas</p></div>
                </button>
              ))}
          </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-2 md:p-6 animate-fadeIn min-h-screen w-full overflow-hidden">
       <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col min-h-[90vh] overflow-hidden w-full">
            <div className="px-3 py-3 md:px-8 md:py-4 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-30 shadow-sm w-full">
                <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
                    <button onClick={() => { if(initialFormId) onBack?.(); else { setFormId(null); setAnalytics(null); setResponses([]); } }} className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 hover:text-[#005380] hover:bg-white border border-gray-100 transition-all shadow-sm shrink-0"><ArrowLeft size={20} /></button>
                    <div className="text-left overflow-hidden">
                        <div className="flex items-center gap-2 mb-0.5"><span className="w-1.5 h-1.5 bg-[#B1D357] rounded-full animate-pulse shrink-0" /><span className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest truncate">Dashboard Inteligente</span></div>
                        <h3 className="text-base md:text-lg font-black text-gray-800 tracking-tight leading-none text-left truncate max-w-[150px] md:max-w-[250px]">{analytics?.title || "Cargando..."}</h3>
                    </div>
                </div>
                
                <div className="flex items-center justify-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 w-full md:w-auto overflow-x-auto custom-scrollbar-hidden shrink-0">
                    {[
                        { id: 'summary', icon: BarChart, label: 'Reporte' },
                        { id: 'question', icon: MessageSquare, label: 'Preguntas' },
                        { id: 'individual', icon: User, label: 'Individual' }
                    ].map((t) => (
                        <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-3 md:px-5 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tab === t.id ? 'bg-[#005380] text-white shadow-md scale-[1.02]' : 'text-gray-400 hover:text-gray-600'}`}>
                            <t.icon size={14} className="shrink-0" />
                            <span>{t.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-end w-full md:w-auto md:ml-auto">
                    <button onClick={() => fetchData(page)} className="w-9 h-9 md:w-11 md:h-11 bg-gray-900 text-white rounded-xl hover:bg-black transition-all flex items-center justify-center shadow-sm shrink-0" title="Actualizar Datos">
                        <Clock size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-gray-50/20 text-left w-full h-full">
                {loading && responses.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-40">
                        <div className="w-14 h-14 border-4 border-[#005380]/10 border-t-[#005380] rounded-full animate-spin" />
                        <p className="mt-6 text-gray-300 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] animate-pulse">Sincronizando información...</p>
                    </div>
                ) : (
                    <div className="animate-fadeIn text-left w-full max-w-full">
                        {tab === 'summary' && <SummaryTab analytics={analytics} />}
                        {tab === 'question' && <QuestionTab analytics={analytics} responses={responses} onPageChange={fetchData} paginationMeta={meta} />}
                        {tab === 'individual' && <IndividualTab responses={responses} paginationMeta={meta} onPageChange={fetchData} />}
                    </div>
                )}
            </div>
       </div>
    </div>
  );
};

export default ResponseManagement;
