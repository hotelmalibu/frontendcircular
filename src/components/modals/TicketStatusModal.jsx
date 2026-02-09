import React, { useState } from "react";
import { X, Search, Loader2, CheckCircle2, AlertCircle, Clock, MessageSquare, AlertTriangle } from "lucide-react";
import { getTickets } from "../../api/helpdeskApi";
import { createPortal } from "react-dom";

const BRAND = {
    blue: "#2C67B0",
    darkBlue: "#005380",
    green: "#B1D357",
    darkGreen: "#8CB200",
};

const STATUS_LABELS = {
    pending: "Pendiente",
    in_progress: "En Proceso",
    resolved: "Resuelto",
    closed: "Cerrado",
};

export default function TicketStatusModal({ isOpen, onClose }) {
    const [ticketId, setTicketId] = useState("");
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!ticketId.trim()) return;

        setLoading(true);
        setError(null);
        setTicket(null);

        try {
            // Use getTickets with search instead of getTicket since the user has the friendly 'ticket' string, not the database 'id'
            const res = await getTickets({ search: ticketId.trim() });

            // The API structure for list is usually { data: { items: [...] } } or { data: [...] }
            const items = res.data?.data?.items || res.data?.data || res.data;

            if (Array.isArray(items) && items.length > 0) {
                // Find the exact match or take the first one if search was specific enough
                const found = items.find(t => t.ticket === ticketId.trim()) || items[0];
                setTicket(found);
            } else {
                setError("ID de Ticket no encontrado. Por favor verifica el código (ej. CIR-000001).");
            }
        } catch (err) {
            console.error("Error fetching ticket status:", err);
            setError(err.response?.data?.message || "Error al consultar el ticket. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTicketId("");
        setTicket(null);
        setError(null);
        onClose();
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'resolved': return <CheckCircle2 size={24} className="text-[#8CB200]" />;
            case 'in_progress': return <Clock size={24} className="text-blue-500" />;
            case 'closed': return <X size={24} className="text-gray-500" />;
            default: return <AlertTriangle size={24} className="text-yellow-500" />;
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 text-gray-900">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div
                    className="px-8 py-6 flex justify-between items-center text-white"
                    style={{ backgroundColor: BRAND.blue }}
                >
                    <div>
                        <h2 className="text-2xl font-bold">Consultar Ticket</h2>
                        <p className="text-white/70 text-sm mt-1">Ingresa tu ID para ver el estado</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {!ticket ? (
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 uppercase tracking-widest text-[10px]">
                                    ID del Ticket (ej. CIR-000001)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={ticketId}
                                        onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                                        placeholder="CIR-XXXXXX"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#2C67B0] outline-none transition-all placeholder:text-gray-300 text-xl font-black tracking-wider text-[#005380]"
                                    />
                                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start gap-3 rounded-r-lg">
                                    <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !ticketId.trim()}
                                style={{ backgroundColor: BRAND.darkBlue }}
                                className="w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-blue-900/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Consultar Ahora"}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Estado actual</p>
                                    <p className="font-bold text-lg text-gray-800">{STATUS_LABELS[ticket.status] || ticket.status}</p>
                                </div>
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                                    {getStatusIcon(ticket.status)}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2 ml-1">Asunto</label>
                                    <p className="font-bold text-gray-900 px-1">{ticket.subject}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Descripción</label>
                                    <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-3">"{ticket.description}"</p>
                                </div>

                                {ticket.solution ? (
                                    <div className="bg-green-50/50 p-5 rounded-3xl border-2 border-green-100 flex gap-4">
                                        <div className="shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#8CB200]">
                                            <MessageSquare size={20} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-[#8CB200] tracking-widest block mb-1">Respuesta del Equipo</label>
                                            <p className="text-gray-700 text-sm font-medium leading-relaxed">{ticket.solution}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex gap-4">
                                        <div className="shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-blue-700 text-sm font-bold">Respuesta pendiente</p>
                                            <p className="text-blue-600/70 text-xs">Nuestro equipo está trabajando en ello.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setTicket(null)}
                                className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-[0.98]"
                            >
                                Consultar otro Ticket
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
