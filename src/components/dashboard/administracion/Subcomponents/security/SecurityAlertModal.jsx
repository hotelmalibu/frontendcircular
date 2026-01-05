import React from "react";
import ReactDOM from "react-dom";
import { X, ShieldAlert, User as UserIcon, MapPin, Calendar, Monitor } from "lucide-react";

const BRAND = {
    blue: "#2C67B0",
    darkBlue: "#005380",
    lightBlue: "#7FB8D9",
    green: "#B1D357",
    orange: "#E15200",
};

export default function SecurityAlertModal({ alert, onClose, onMarkAsViewed }) {
    const handleMarkAndClose = async () => {
        await onMarkAsViewed(alert.id);
        onClose();
    };

    const getTypeStyles = () => {
        switch (alert.type) {
            case 'critical':
                return { bg: '#FEF2F2', text: '#DC2626', icon: BRAND.orange };
            case 'warning':
                return { bg: '#FFFBEB', text: '#F59E0B', icon: BRAND.orange };
            default:
                return { bg: '#EFF6FF', text: BRAND.blue, icon: BRAND.blue };
        }
    };

    const styles = getTypeStyles();

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                {/* Header con gradiente de marca */}
                <div
                    className="relative p-8 text-white overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)`
                    }}
                >
                    <div className="absolute top-0 right-0 opacity-10">
                        <ShieldAlert size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Detalle de Alerta de Seguridad</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                                style={{ backgroundColor: styles.bg, color: styles.text }}
                            >
                                {alert.type}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-8 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Descripción del Evento</h3>
                        <p className="text-lg font-semibold text-gray-800">{alert.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <UserIcon size={18} style={{ color: BRAND.blue }} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Usuario</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-800 ml-11">
                                {alert.user_email || 'No especificado'}
                            </p>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <MapPin size={18} style={{ color: BRAND.orange }} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Dirección IP</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-800 ml-11">
                                {alert.ip_address || 'Desconocida'}
                            </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 md:col-span-2">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Calendar size={18} style={{ color: BRAND.green }} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Fecha y Hora</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-800 ml-11">
                                {new Date(alert.created_at).toLocaleString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer con botones */}
                <div className="px-8 pb-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Cerrar
                    </button>
                    {!alert.is_viewed && (
                        <button
                            onClick={handleMarkAndClose}
                            className="flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                            style={{
                                background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.darkBlue} 100%)`
                            }}
                        >
                            Marcar como Revisado
                        </button>
                    )}
                </div>
            </div>


        </div>,
        document.body
    );
}
