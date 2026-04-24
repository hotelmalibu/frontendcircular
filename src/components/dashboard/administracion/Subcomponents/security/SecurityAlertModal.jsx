import React, { useState } from "react";
import ReactDOM from "react-dom";
import { X, ShieldAlert, User, MapPin, Calendar, Monitor, Copy, Check, Terminal, Globe } from "lucide-react";

// Brand colors matching the theme


const CopyButton = ({ text, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/50 hover:bg-white border border-transparent hover:border-gray-200 transition-all text-xs font-medium text-gray-500 hover:text-gray-700"
            title={`Copiar ${label}`}
        >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
        </button>
    );
};

export default function SecurityAlertModal({ alert, onClose, onMarkAsViewed }) {
    const [isMarking, setIsMarking] = useState(false);

    const handleMarkAndClose = async () => {
        setIsMarking(true);
        await onMarkAsViewed(alert.id);
        setIsMarking(false);
        onClose();
    };

    const getTypeStyles = () => {
        switch (alert.type) {
            case 'critical':
                return { bg: 'bg-blue-50', text: 'text-[#2C67B0]', border: 'border-[#2C67B0]10', icon: 'text-[#2C67B0]', gradient: 'from-[#2C67B0] to-[#1E4D8A]' };
            case 'warning':
                return { bg: 'bg-lime-50', text: 'text-[#B1D357]', border: 'border-[#B1D357]10', icon: 'text-[#B1D357]', gradient: 'from-[#B1D357] to-[#8FA83E]' };
            default:
                return { bg: 'bg-blue-50', text: 'text-[#2C67B0]', border: 'border-[#2C67B0]10', icon: 'text-[#2C67B0]', gradient: 'from-[#2C67B0] to-[#7FB8D9]' };
        }
    };

    const styles = getTypeStyles();

    // Parse user agent if available, or use a placeholder
    const userAgent = alert.user_agent || "Información del dispositivo no disponible";

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
                
                {/* Header */}
                <div className={`relative px-8 py-6 text-white overflow-hidden bg-gradient-to-br ${styles.gradient}`}>
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
                        <ShieldAlert size={200} />
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div> 
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/10`}>
                                    {alert.type === 'critical' ? 'Crítica' : alert.type === 'warning' ? 'Advertencia' : 'Información'}
                                </span>
                                <span className="text-white/80 text-sm font-medium flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(alert.created_at).toLocaleString('es-ES', { 
                                        dateStyle: 'medium', 
                                        timeStyle: 'short' 
                                    })}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Alerta de Seguridad</h2>
                            <p className="text-white/80 mt-1 text-lg max-w-2xl text-shadow-sm">
                                {alert.description}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/90 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* User Information Card */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <User size={14} /> Usuario Implicado
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                                    style={{ backgroundColor: "#2C67B020", color: "#2C67B0" }}
                                >
                                    {alert.user_email ? alert.user_email.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-500 mb-0.5">Correo Electrónico</p>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-gray-800 truncate" title={alert.user_email}>
                                            {alert.user_email || 'No identificado'}
                                        </p>
                                        {alert.user_email && <CopyButton text={alert.user_email} label="Email" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Network Information Card */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Globe size={14} /> Red y Ubicación
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: "#B1D35720", color: "#B1D357" }}
                                >
                                    <MapPin size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-500 mb-0.5">Dirección IP</p>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-mono font-semibold text-gray-800">
                                            {alert.ip_address || '127.0.0.1'}
                                        </p>
                                        {alert.ip_address && <CopyButton text={alert.ip_address} label="IP" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Details Card - Spans full width */}
                        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Terminal size={14} /> Detalles Técnicos
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <Monitor size={16} />
                                        <span className="text-sm font-medium">User Agent / Dispositivo</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 font-mono text-xs text-gray-600 break-all leading-relaxed">
                                        {userAgent}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex justify-between items-center">
                                        <span className="text-xs font-medium text-gray-500">ID de Evento</span>
                                        <span className="text-xs font-mono font-bold text-gray-700">#{alert.id}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex justify-between items-center">
                                         <span className="text-xs font-medium text-gray-500">Estado</span>
                                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full`}
                                            style={{ 
                                                backgroundColor: alert.is_viewed ? "#00AB6D20" : "#2C67B020", 
                                                color: alert.is_viewed ? "#00AB6D" : "#2C67B0" 
                                            }}
                                          >
                                            {alert.is_viewed ? 'Revisado' : 'Nuevo'}
                                          </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                    >
                        Cerrar
                    </button>
                    {!alert.is_viewed && (
                        <button
                            onClick={handleMarkAndClose}
                            disabled={isMarking}
                            className={`px-6 py-2.5 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2
                                bg-gradient-to-r ${styles.gradient} hover:brightness-110
                                ${isMarking ? 'opacity-70 cursor-wait' : ''}
                            `}
                        >
                            {isMarking ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <Check size={18} />
                                    Marcar como Revisado
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
