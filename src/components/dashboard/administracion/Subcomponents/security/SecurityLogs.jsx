import React, { useState, useEffect } from "react";
import { getSecurityLogs, markSecurityLogAsViewed } from "../../../../../api/auth";
import { ShieldAlert, ShieldCheck, ShieldEllipsis, Search, RefreshCw, Eye } from "lucide-react";
import SecurityAlertModal from "./SecurityAlertModal";



export default function SecurityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAlert, setSelectedAlert] = useState(null);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await getSecurityLogs();
            const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setLogs(items);
        } catch (err) {
            console.error("Error fetching security logs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsViewed = async (id) => {
        try {
            await markSecurityLogAsViewed(id);
            // Actualización local
            setLogs(logs.map(log => log.id === id ? { ...log, is_viewed: 1 } : log));

            // Emitir evento personalizado para que el Navbar actualice el contador
            window.dispatchEvent(new CustomEvent('securityLogReviewed'));
        } catch (err) {
            console.error("Error marking log as viewed:", err);
            alert("No se pudo marcar como revisado.");
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchLogs}
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
                ) : filteredLogs.length > 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Evento</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Descripción</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredLogs.map((log) => (
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
                                            <button
                                                onClick={() => setSelectedAlert(log)}
                                                className="inline-flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                                            >
                                                <Eye size={14} /> Ver Detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
