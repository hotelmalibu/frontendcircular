import React, { useState, useEffect } from "react";
import { getSecurityLogs, markSecurityLogAsViewed } from "../../../../../api/auth";
import { ShieldAlert, ShieldCheck, ShieldEllipsis, Search, RefreshCw, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import SecurityAlertModal from "./SecurityAlertModal";
import { toast } from "react-hot-toast";

export default function SecurityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAlert, setSelectedAlert] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const fetchLogs = async (page = 1) => {
        try {
            setLoading(true);
            const params = {
                page: page,
                per_page: itemsPerPage,
                search: searchTerm 
            };
            
            const res = await getSecurityLogs(params);
            
            let items = [];
            let meta = {};

            const responseData = res.data;

            if (responseData?.data?.items && responseData?.data?.pagination) {
                // Caso Custom "Helpdesk" like
                items = responseData.data.items;
                meta = responseData.data.pagination;
            } else if (responseData?.meta) {
                 // Caso API Resource
                items = responseData.data;
                meta = responseData.meta;
            } else if (responseData?.data && Array.isArray(responseData.data)) {
                 // Caso Standard Laravel paginate
                items = responseData.data;
                meta = responseData;
            } else if (Array.isArray(responseData)) {
                 // Caso Sin Paginación (Array simple)
                items = responseData;
                meta = { current_page: 1, last_page: 1, total: items.length };
            } else {
                 // Fallback
                 items = responseData?.data || [];
            }

            setLogs(items);
            setCurrentPage(meta.current_page || 1);
            setTotalPages(meta.last_page || 1);
            setTotalItems(meta.total || items.length);

        } catch (err) {
            console.error("Error fetching security logs:", err);
            setLogs([]); 
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsViewed = async (id) => {
        try {
            await markSecurityLogAsViewed(id);
            setLogs(logs.map(log => log.id === id ? { ...log, is_viewed: 1 } : log));
            window.dispatchEvent(new CustomEvent('securityLogReviewed'));
        } catch (err) {
            console.error("Error marking log as viewed:", err);
            toast.error("No se pudo marcar como revisado.");
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchLogs(currentPage);
        }, 500); // Debounce para búsqueda
        return () => clearTimeout(timeoutId);
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]); 

    useEffect(() => {
        fetchLogs(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Calcular índices para visualización "Mostrando X-Y de Z" si se desea, 
    // pero el diseño pedido es "Mostrando {total} items" o similar. 
    // El usuario pidió "Mostrando X reportes" (donde X es el total visible o total global?).
    // En la imagen dice "Mostrando 4 reportes". Asumiremos que es la cantidad de items en la pag actuelle o total?
    // Usualmente es "Mostrando 1-10 de 100".
    // El texto del usuario anterior era "Mostrando filteredLogs.length reportes".
    // Mantendremos "Mostrando {totalItems} reportes" para que tenga sentido con paginación server-side.

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Historial de Seguridad</h2>
                    <p className="text-sm text-gray-500">Registro detallado de auditoría y eventos del sistema</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar alertas..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset a pagina 1 al buscar
                            }}
                        />
                    </div>
                    <button
                        onClick={() => fetchLogs(currentPage)}
                        className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium font-sans">Cargando registros de auditoría...</p>
                        </div>
                    </div>
                ) : logs.length > 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Evento</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Descripción</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {logs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className={`group transition-all duration-200 border-l-4 
                                                ${!log.is_viewed
                                                    ? 'bg-blue-50/60 border-blue-500 hover:bg-blue-100/50'
                                                    : 'bg-white border-transparent hover:bg-gray-50/50'
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {log.type === 'critical' ? (
                                                        <ShieldAlert className="text-red-500" size={18} />
                                                    ) : log.type === 'warning' ? (
                                                        <ShieldAlert className="text-orange-500" size={18} />
                                                    ) : (
                                                        <ShieldCheck className="text-blue-500" size={18} />
                                                    )}
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${log.type === 'critical' ? 'bg-red-50 text-red-600' :
                                                        log.type === 'warning' ? 'bg-orange-50 text-orange-600' :
                                                            'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        {log.type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-gray-800">{log.description}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-gray-600">
                                                    {new Date(log.created_at).toLocaleString('es-ES')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedAlert(log)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                                                        title="Ver Detalles"
                                                    >
                                                        <Eye size={14} /> 
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {logs.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white text-sm">
                                <span className="text-gray-500 font-medium">
                                    Mostrando <span className="font-bold text-gray-800">{logs.length}</span> de <span className="font-bold text-gray-800">{totalItems}</span> reportes
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 disabled:opacity-30 disabled:hover:border-gray-200 transition-all"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        disabled={currentPage >= totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 disabled:opacity-30 disabled:hover:border-gray-200 transition-all"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-center gap-3">
                            <ShieldEllipsis className="text-gray-200" size={64} />
                            <p className="text-gray-400 font-medium">No se han encontrado registros de seguridad.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Detalles */}
            {selectedAlert && (
                <SecurityAlertModal
                    alert={selectedAlert}
                    onClose={() => setSelectedAlert(null)}
                    onMarkAsViewed={handleMarkAsViewed}
                />
            )}
        </div>
    );
}
