import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    Edit,
    Trash2,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    X,
    Mail,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Eye,
    MessageSquare,
    FileText
} from "lucide-react";
import { getTickets, updateTicket, deleteTicket } from "../../../../../api/helpdeskApi";

const BRAND = {
    blue: "#2C67B0",
    darkBlue: "#005380",
    lightBlue: "#7FB8D9",
    green: "#B1D357",
    darkGreen: "#8CB200",
    orange: "#E15200",
    yellow: "#E8AD00",
    gray: "#6B7280",
};

const STATUS_LABELS = {
    in_progress: "En proceso",
    resolved: "Resuelto",
    closed: "Cerrado",
    pending: "Pendiente",
};

const PRIORITY_LABELS = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
    critical: "Crítica",
};

export default function HelpdeskTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal States
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [saving, setSaving] = useState(false);

    // Pagination
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1
    });

    useEffect(() => {
        fetchTickets();
    }, [pagination.current_page]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchTerm,
                page: pagination.current_page,
                per_page: pagination.per_page,
                sort_by: "created_at",
                sort_order: "desc",
            };
            const res = await getTickets(params);

            // Structure: res.data.data.items and res.data.data.pagination
            const responseData = res.data?.data;

            if (responseData && Array.isArray(responseData.items)) {
                setTickets(responseData.items);
                if (responseData.pagination) {
                    setPagination({
                        current_page: responseData.pagination.current_page || 1,
                        per_page: responseData.pagination.per_page || 15,
                        total: responseData.pagination.total || 0,
                        last_page: responseData.pagination.last_page || 1
                    });
                }
            } else {
                // Fallback for different response structures or simple arrays
                const fallbackData = responseData?.items || responseData || res.data;
                setTickets(Array.isArray(fallbackData) ? fallbackData : []);
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching tickets:", err);
            setError("No se pudieron cargar los tickets de soporte.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!currentTicket) return;
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("status", currentTicket.status);
            formData.append("solution", currentTicket.solution || "");
            formData.append("priority", currentTicket.priority);
            formData.append("subject", currentTicket.subject);
            formData.append("email", currentTicket.email);
            formData.append("description", currentTicket.description);

            await updateTicket(currentTicket.id, formData);
            setIsManageModalOpen(false);
            fetchTickets();
        } catch (err) {
            console.error("Error updating ticket:", err);
            alert("Error al actualizar el ticket");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!currentTicket) return;
        setSaving(true);
        try {
            await deleteTicket(currentTicket.id);
            setIsDeleteModalOpen(false);
            fetchTickets();
        } catch (err) {
            console.error("Error deleting ticket:", err);
            alert("Error al eliminar el ticket");
        } finally {
            setSaving(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'resolved': return <CheckCircle2 size={14} className="text-green-500" />;
            case 'in_progress': return <Clock size={14} className="text-blue-500" />;
            case 'closed': return <X size={14} className="text-gray-500" />;
            default: return <AlertTriangle size={14} className="text-yellow-500" />;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tool Bar */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por asunto o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchTickets()}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2C67B0]/20 focus:border-[#2C67B0] outline-none transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchTickets}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                    >
                        Refrescar
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[#2C67B0] mb-2" size={32} />
                        <p className="text-gray-400 text-sm">Cargando reportes...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-red-500">
                        <AlertCircle size={32} className="mb-2" />
                        <p>{error}</p>
                        <button onClick={fetchTickets} className="mt-4 text-[#2C67B0] underline text-sm">Reintentar</button>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket</th>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="py-4 px-6 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="py-4 px-6 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Prioridad</th>
                                <th className="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50/80 transition duration-150 group">
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#005380] text-sm">#{ticket.ticket || ticket.id}</span>
                                                <span className="text-sm font-medium text-gray-900 line-clamp-1">{ticket.subject}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={14} className="text-gray-400" />
                                                <span className="truncate max-w-[150px]">{ticket.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border bg-white text-xs font-bold">
                                                {getStatusIcon(ticket.status)}
                                                {STATUS_LABELS[ticket.status] || ticket.status}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                                                {PRIORITY_LABELS[ticket.priority] || ticket.priority}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setCurrentTicket({ ...ticket }); setIsDetailsModalOpen(true); }}
                                                    className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-[#2C67B0] hover:text-white transition-all shadow-sm"
                                                    title="Visualizar detalles"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { setCurrentTicket({ ...ticket }); setIsManageModalOpen(true); }}
                                                    className="p-2 rounded-xl text-green-600 bg-green-50 hover:bg-[#8CB200] hover:text-white transition-all shadow-sm"
                                                    title="Gestionar Ticket"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { setCurrentTicket(ticket); setIsDeleteModalOpen(true); }}
                                                    className="p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500">
                                        No se encontraron tickets de soporte.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                <p className="text-sm text-gray-500">
                    Mostrando <span className="font-bold text-gray-800">{tickets.length}</span> reportes
                </p>
                <div className="flex gap-2">
                    <button
                        disabled={pagination.current_page === 1}
                        onClick={() => setPagination(p => ({ ...p, current_page: p.current_page - 1 }))}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        disabled={pagination.current_page >= pagination.last_page}
                        onClick={() => setPagination(p => ({ ...p, current_page: p.current_page + 1 }))}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Details Modal (READ ONLY) */}
            {isDetailsModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-gray-900">
                        <div className="px-8 py-6 flex justify-between items-center text-white" style={{ backgroundColor: BRAND.darkBlue }}>
                            <div>
                                <h3 className="text-xl font-bold">Visualización del Ticket</h3>
                                <p className="text-sm opacity-80">#{currentTicket?.ticket || currentTicket?.id}</p>
                            </div>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">De</label>
                                    <p className="font-bold text-gray-800">{currentTicket?.email}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Prioridad</label>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getPriorityColor(currentTicket?.priority)}`}>
                                            {PRIORITY_LABELS[currentTicket?.priority]}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Estado</label>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase border border-gray-200 bg-gray-50">
                                            {STATUS_LABELS[currentTicket?.status]}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Asunto</label>
                                <div className="bg-gray-50 p-4 rounded-2xl flex gap-3">
                                    <FileText className="text-blue-500 shrink-0" size={20} />
                                    <p className="font-bold text-gray-900">{currentTicket?.subject}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Descripción del Problema</label>
                                <div className="bg-gray-50 p-4 rounded-2xl flex gap-3 border border-gray-100">
                                    <MessageSquare className="text-gray-400 shrink-0" size={20} />
                                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{currentTicket?.description}</p>
                                </div>
                            </div>

                            {/* Images evidence section */}
                            {currentTicket?.images && currentTicket.images.length > 0 && (
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-3">Evidencia Adjunta</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {currentTicket.images.map((img) => (
                                            <a
                                                key={img.id}
                                                href={img.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative h-40 rounded-2xl overflow-hidden border border-gray-200 hover:border-[#2C67B0] transition-all"
                                            >
                                                <img src={img.url} alt="Evidencia" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Eye className="text-white" size={32} />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentTicket?.solution && (
                                <div className="pt-4 border-t border-gray-100 mt-6">
                                    <label className="text-[10px] font-black uppercase text-[#8CB200] tracking-widest block mb-2">Solución Brindada</label>
                                    <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 flex gap-3">
                                        <CheckCircle2 className="text-[#8CB200] shrink-0" size={20} />
                                        <p className="text-gray-700 italic text-sm">{currentTicket.solution}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                Cerrar Vista
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Manage Modal (STATUS & SOLUTION) */}
            {isManageModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 text-gray-900">
                        <div className="px-8 py-6 flex justify-between items-center text-white" style={{ backgroundColor: BRAND.blue }}>
                            <div>
                                <h3 className="text-xl font-bold">Gestionar Reporte</h3>
                                <p className="text-sm opacity-80">#{currentTicket?.ticket}</p>
                            </div>
                            <button onClick={() => setIsManageModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateStatus} className="p-8 space-y-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1 text-gray-900">Cambiar Estado</label>
                                    <select
                                        value={currentTicket?.status}
                                        onChange={(e) => setCurrentTicket(t => ({ ...t, status: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-900 appearance-none cursor-pointer"
                                    >
                                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1 text-gray-900">Brindar Solución</label>
                                    <textarea
                                        rows="5"
                                        value={currentTicket?.solution || ""}
                                        onChange={(e) => setCurrentTicket(t => ({ ...t, solution: e.target.value }))}
                                        placeholder="Escribe aquí la respuesta o solución para el usuario..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none text-sm text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsManageModalOpen(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={{ backgroundColor: BRAND.blue }}
                                    className="flex-[2] px-6 py-4 rounded-2xl font-bold text-white shadow-lg shadow-blue-900/10 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Guardando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={20} />
                                            <span>Resolver Reporte</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 text-gray-900">
                        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Eliminar reporte?</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            El reporte <span className="font-bold text-gray-800">#{currentTicket?.ticket}</span> será eliminado permanentemente. Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-6 py-3 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                                disabled={saving}
                            >
                                {saving && <Loader2 className="animate-spin" size={18} />}
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
