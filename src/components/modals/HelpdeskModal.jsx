import React, { useState, useRef } from "react";
import { X, Send, Paperclip, Loader2, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { createTicket } from "../../api/helpdeskApi";
import { createPortal } from "react-dom";

const BRAND = {
    blue: "#2C67B0",
    darkBlue: "#005380",
    green: "#B1D357",
    darkGreen: "#8CB200",
};

export default function HelpdeskModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        email: "",
        priority: "low",
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [submittedTicket, setSubmittedTicket] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Limit to 2 images as per API spec
        const validFiles = files.slice(0, 2);
        setImages(validFiles);
    };

    const handleCopy = () => {
        const id = submittedTicket?.ticket;
        if (!id) return;

        try {
            navigator.clipboard.writeText(id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Error copy to clipboard:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append("subject", formData.subject);
            data.append("description", formData.description);
            data.append("email", formData.email);
            data.append("priority", formData.priority);
            data.append("status", "pending");

            images.forEach((image) => {
                data.append("images[]", image);
            });

            const res = await createTicket(data);
            setSubmittedTicket(res.data?.data);
            setSuccess(true);
        } catch (err) {
            console.error("Error creating helpdesk ticket:", err);
            setError(err.response?.data?.message || "Ocurrió un error al enviar el reporte. Por favor, intente de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setSubmittedTicket(null);
        setCopied(false);
        setFormData({ subject: "", description: "", email: "", priority: "low" });
        setImages([]);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 text-gray-900 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col my-auto">
                {/* Header */}
                <div
                    className="px-8 py-6 flex justify-between items-center text-white"
                    style={{ backgroundColor: BRAND.darkBlue }}
                >
                    <div>
                        <h2 className="text-2xl font-bold">Soporte Técnico</h2>
                        <p className="text-white/70 text-sm mt-1">Cuéntanos cómo podemos ayudarte</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Cerrar"
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {success ? (
                        <div className="py-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce mb-6">
                                <CheckCircle2 size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Reporte Enviado!</h3>

                            <div className="w-full bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 mb-6 group relative">
                                <p className="text-[10px] font-black uppercase text-[#2C67B0] tracking-[0.2em] mb-2 text-center">Tu ID de Ticket es:</p>
                                <div className="flex items-center justify-center gap-4">
                                    <p className="text-3xl font-black text-[#005380] tracking-tight">
                                        {submittedTicket?.ticket || 'Generando...'}
                                    </p>
                                    <button
                                        onClick={handleCopy}
                                        type="button"
                                        className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-[#2C67B0] hover:bg-[#2C67B0] hover:text-white shadow-sm'}`}
                                        title="Copiar ID"
                                    >
                                        {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                                    </button>
                                </div>
                                {copied && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-bounce">
                                        ¡Copiado!
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-600 max-w-xs text-sm leading-relaxed mb-8">
                                Hemos recibido tu solicitud. Por favor **guarda este ID** para consultar el estado de tu reporte en la sección de "Consultar Estado".
                            </p>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-[0.98]"
                            >
                                Entendido
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start gap-3 rounded-r-lg shadow-sm">
                                    <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Tu Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="ejemplo@correo.com"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#2C67B0] outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Asunto</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        placeholder="¿Cuál es el problema?"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#2C67B0] outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Descripción</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows="4"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe detalladamente el problema..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#2C67B0] outline-none transition-all placeholder:text-gray-400 resize-none text-gray-900"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    {/* Priority selector */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Prioridad del Reporte</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {[
                                                { id: 'low', label: 'Baja', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                                                { id: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                                                { id: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-700 border-orange-200' },
                                                { id: 'critical', label: 'Crítica', color: 'bg-red-100 text-red-700 border-red-200' },
                                            ].map((p) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, priority: p.id }))}
                                                    className={`px-3 py-2.5 rounded-xl border-2 text-xs font-black uppercase tracking-wider transition-all ${formData.priority === p.id
                                                        ? p.color.replace('border-', 'border-[3px] border-') + ' shadow-md scale-105'
                                                        : 'bg-white border-gray-100 text-gray-400 opacity-60'
                                                        }`}
                                                >
                                                    {p.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Attachment */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Evidencia (máx. 2 imágenes)</label>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl border-dashed hover:bg-white hover:border-[#2C67B0] hover:shadow-md transition-all flex items-center justify-center gap-3 text-gray-500 group"
                                        >
                                            <Paperclip size={20} className="group-hover:text-[#2C67B0] transition-colors" />
                                            <span className="text-sm font-bold">
                                                {images.length > 0
                                                    ? `${images.length} Imagen(es) seleccionada(s)`
                                                    : "Haz clic para adjuntar imágenes"}
                                            </span>
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{ backgroundColor: BRAND.blue }}
                                    className="flex-[2] px-6 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            <span>Enviar Reporte</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
