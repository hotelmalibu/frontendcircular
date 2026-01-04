import React, { useState, useEffect } from "react";
import formsApi from "../../../../../api/formsApi";
import { toast } from "react-hot-toast";
import {
    Send,
    X,
    AlertCircle,
    CheckCircle2,
    FileUp,
    ChevronDown,
    Info
} from "lucide-react";

const ResponderFormulario = ({ formId, onCancel, onSuccess }) => {
    const [form, setForm] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const data = await formsApi.getForm(formId);
                // Handle different response structures gracefully
                const fetchedForm = data.data || (Array.isArray(data) ? data[0] : data);
                setForm(fetchedForm);

                // Initialize form data with default values
                const initialData = {};
                if (fetchedForm && fetchedForm.fields) {
                    fetchedForm.fields.forEach(field => {
                        initialData[field.name] = field.default_value || "";
                    });
                }
                setFormData(initialData);
            } catch (error) {
                console.error("Error fetching form:", error);
                toast.error("Error al cargar el formulario");
            } finally {
                setLoading(false);
            }
        };
        if (formId) fetchForm();
    }, [formId]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error if user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileChange = (name, file) => {
        if (file) {
            setFormData(prev => ({ ...prev, [name]: file }));
            if (errors[name]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (form && form.fields) {
            form.fields.forEach(field => {
                const value = formData[field.name];
                if (field.is_required && (!value || (value instanceof File === false && value.toString().trim() === ""))) {
                    newErrors[field.name] = "Este campo es obligatorio";
                }
            });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Por favor complete los campos obligatorios");
            return;
        }

        setSubmitting(true);
        try {
            // Check if we need FormData (for files)
            const hasFiles = form.fields.some(f => {
                const type = (f.field_type?.name || f.type_name || "").toLowerCase();
                return type.includes("file") || type.includes("image");
            });

            let payload;
            if (hasFiles) {
                payload = new FormData();
                Object.keys(formData).forEach(key => {
                    const value = formData[key];
                    if (value !== undefined && value !== null) {
                        if (value instanceof File) {
                            payload.append(`fields[${key}]`, value);
                        } else {
                            payload.append(`fields[${key}]`, value);
                        }
                    }
                });
                // Standard metadata for tracking
                payload.append("metadata[submission_source]", "web");
                payload.append("metadata[user_agent]", navigator.userAgent);
            } else {
                payload = {
                    fields: formData,
                    metadata: {
                        submission_source: "web",
                        user_agent: navigator.userAgent
                    }
                };
            }

            await formsApi.submitForm(formId, payload);
            toast.success("Respuestas enviadas con éxito");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error submitting form:", error);
            const apiError = error.response?.data?.message || "Error al enviar las respuestas";
            toast.error(apiError);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center p-24 bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-100 border-t-[#004b72]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Info size={24} className="text-[#004b72]" />
                    </div>
                </div>
                <p className="mt-6 text-gray-500 font-semibold animate-pulse">Preparando formulario técnico...</p>
            </div>
        );
    }

    if (!form) return (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Formulario no disponible</h3>
            <p className="text-gray-500 mt-2">El recurso solicitado no pudo ser cargado o no existe.</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden border border-gray-100">
            {/* Header Mural */}
            <div className="bg-[#004b72] relative overflow-hidden px-10 py-12 text-white">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                        <CheckCircle2 size={12} />
                        Censo Técnico v{form.version || 1}
                    </div>
                    <h2 className="text-4xl font-black mb-3">{form.title}</h2>
                    <p className="text-blue-100/80 text-lg max-w-2xl font-medium leading-relaxed">
                        {form.description}
                    </p>
                </div>

                {/* Abstract shapes for premium feel */}
                <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>
            </div>

            <form onSubmit={handleSubmit} className="p-12 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                    {(Array.isArray(form.fields) ? form.fields : [])
                        .sort((a, b) => a.order - b.order)
                        .map((field) => {
                            const type = (field.field_type?.slug || field.field_type?.name || field.type_name || "text").toLowerCase();
                            const isFullWidth = type === "textarea" || type.includes("file");
                            const hasError = !!errors[field.name];

                            return (
                                <div key={field.id} className={`${isFullWidth ? "md:col-span-2" : ""} space-y-3 group`}>
                                    <div className="flex justify-between items-end">
                                        <label className="block text-sm font-bold text-gray-700 tracking-tight">
                                            {field.label} {field.is_required && <span className="text-red-500 font-black ml-0.5">*</span>}
                                        </label>
                                        {field.metadata?.info && (
                                            <div className="group/info relative cursor-help">
                                                <Info size={14} className="text-gray-300 hover:text-blue-500 transition-colors" />
                                                <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all">
                                                    {field.metadata.info}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {field.description && (
                                        <p className="text-xs text-gray-500 leading-relaxed italic">{field.description}</p>
                                    )}

                                    <div className="relative">
                                        {/* Input Rendering based on type/slug */}
                                        {type === "textarea" ? (
                                            <textarea
                                                className={`w-full p-4 bg-gray-50/50 border ${hasError ? 'border-red-400 focus:ring-red-500/10' : 'border-gray-200 focus:ring-blue-500/10'} rounded-2xl focus:ring-4 focus:border-blue-500 outline-none transition-all h-40 resize-none text-gray-800 placeholder-gray-300 font-medium`}
                                                placeholder={field.options?.placeholder || field.placeholder}
                                                required={field.is_required}
                                                maxLength={field.options?.max_length}
                                                value={formData[field.name] || ""}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                            />
                                        ) : type === "file" || type === "upload" || type.includes("image") ? (
                                            <div className={`relative group/file border-2 border-dashed ${hasError ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-white'} rounded-3xl p-8 transition-all text-center`}>
                                                <input
                                                    type="file"
                                                    id={`file-${field.id}`}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                                                    accept={field.options?.accept || "*"}
                                                    multiple={field.options?.multiple}
                                                />
                                                <div className="flex flex-col items-center">
                                                    <div className={`p-4 rounded-2xl mb-3 ${formData[field.name] ? 'bg-emerald-100 text-emerald-600' : 'bg-white shadow-sm text-blue-500'}`}>
                                                        <FileUp size={32} />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700">
                                                        {formData[field.name] ? formData[field.name].name : (field.options?.placeholder || field.placeholder || "Subir archivo de evidencia")}
                                                    </span>
                                                    <span className="text-xs text-gray-400 mt-1">
                                                        {field.options?.max_size ? `Tamaño máx: ${field.options.max_size}KB` : "Tipos: PDF, JPG, PNG"}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : type === "select" || type === "dropdown" ? (
                                            <div className="relative">
                                                <select
                                                    className={`w-full appearance-none p-4 bg-gray-50/50 border ${hasError ? 'border-red-400 focus:ring-red-500/10' : 'border-gray-200 focus:ring-blue-500/10'} rounded-2xl focus:ring-4 focus:border-blue-500 outline-none transition-all text-gray-800 font-medium pr-12`}
                                                    required={field.is_required}
                                                    value={formData[field.name] || ""}
                                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                                >
                                                    <option value="">{field.options?.placeholder || field.placeholder || "Seleccione una opción"}</option>
                                                    {(field.options?.choices || []).map((choice, i) => (
                                                        <option key={i} value={choice.value}>
                                                            {choice.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                            </div>
                                        ) : type === "checkbox" ? (
                                            <div className="space-y-3 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                                                {(field.options?.choices || []).map((choice, i) => (
                                                    <label key={i} className="flex items-center gap-3 cursor-pointer group/check">
                                                        <input
                                                            type="checkbox"
                                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            checked={(formData[field.name] || []).includes(choice.value)}
                                                            onChange={(e) => {
                                                                const current = formData[field.name] || [];
                                                                const next = e.target.checked
                                                                    ? [...current, choice.value]
                                                                    : current.filter(v => v !== choice.value);
                                                                handleChange(field.name, next);
                                                            }}
                                                        />
                                                        <span className="text-sm font-medium text-gray-600 group-hover/check:text-gray-900 transition-colors">
                                                            {choice.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : type === "radio" ? (
                                            <div className="space-y-3 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                                                {(field.options?.choices || []).map((choice, i) => (
                                                    <label key={i} className="flex items-center gap-3 cursor-pointer group/radio">
                                                        <input
                                                            type="radio"
                                                            name={field.name}
                                                            className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            checked={formData[field.name] === choice.value}
                                                            onChange={() => handleChange(field.name, choice.value)}
                                                        />
                                                        <span className="text-sm font-medium text-gray-600 group-hover/radio:text-gray-900 transition-colors">
                                                            {choice.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <input
                                                type={type === "email" ? "email" : (type === "number" || type === "numeric") ? "number" : type === "date" ? "date" : type === "url" ? "url" : type === "phone" ? "tel" : "text"}
                                                className={`w-full p-4 bg-gray-50/50 border ${hasError ? 'border-red-400 focus:ring-red-500/10' : 'border-gray-200 focus:ring-blue-500/10'} rounded-2xl focus:ring-4 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-300 font-medium`}
                                                placeholder={field.options?.placeholder || field.placeholder}
                                                required={field.is_required}
                                                min={field.options?.min || field.options?.min_date}
                                                max={field.options?.max || field.options?.max_date}
                                                step={field.options?.step}
                                                value={formData[field.name] || ""}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                            />
                                        )}

                                        {hasError && (
                                            <div className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs font-bold animate-shake">
                                                <AlertCircle size={14} />
                                                <span>{errors[field.name]}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-5">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-4 px-8 border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all text-center"
                    >
                        Cancelar envío
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`flex-[2] py-4 px-8 bg-[#004b72] text-white font-bold rounded-2xl hover:bg-[#003a58] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 ${submitting ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1 active:scale-[0.98]"
                            }`}
                    >
                        {submitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Procesando datos...
                            </div>
                        ) : (
                            <>
                                <Send size={20} />
                                Enviar Reporte Técnico
                            </>
                        )}
                    </button>
                </div>
            </form>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
            `}</style>
        </div>
    );
};

export default ResponderFormulario;
