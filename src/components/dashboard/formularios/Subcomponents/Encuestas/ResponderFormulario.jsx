import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import formsApi from "../../../../../api/formsApi";
import { toast } from "react-hot-toast";
import {
    AlertCircle,
    FileUp,
    ChevronDown,
    Info,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    ShieldCheck
} from "lucide-react";

import { useNavigate } from "react-router-dom";
const ResponderFormulario = ({ formId, onCancel, onSuccess, onLoad }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role_slug === "admin";
    
    const [form, setForm] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [isNotFound, setIsNotFound] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const fieldsPerPage = 6;

    useEffect(() => {
        const fetchForm = async () => {
            setLoading(true);
            try {
                const responseData = await formsApi.getForm(formId);
                let fetchedForm = null;
                
                if (responseData.data && responseData.data.form) {
                    fetchedForm = responseData.data.form;
                } else if (responseData.data) {
                    fetchedForm = responseData.data;
                } else {
                    fetchedForm = responseData;
                }

                if (!fetchedForm || !fetchedForm.id) {
                    setIsNotFound(true);
                } else {
                    setForm(fetchedForm);
                    const initialData = {};
                    (fetchedForm.fields || []).forEach(field => {
                        initialData[field.name] = field.default_value || "";
                    });
                    setFormData(initialData);
                    if (onLoad) onLoad();
                }
            } catch (error) {
                // If it's a 404, we don't log it as an error because it's a known scenario handled by redirect
                if (error.response?.status === 404) {
                    navigate('/404-not-found', { replace: true });
                    return;
                }
                
                console.error("Error fetching form:", error);
                navigate('/404-not-found', { replace: true });
            } finally {
                if (formId) setTimeout(() => setLoading(false), 300);
            }
        };

        if (formId) fetchForm();
    }, [formId, navigate, onLoad]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
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
                if (field.is_required && (!value || (typeof value === 'string' && value.trim() === ""))) {
                    newErrors[field.name] = "Este campo es obligatorio";
                }
            });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sortedFields = (form?.fields || []).sort((a, b) => a.order - b.order);
    const totalSteps = Math.ceil(sortedFields.length / fieldsPerPage);
    const currentFields = sortedFields.slice(currentStep * fieldsPerPage, (currentStep + 1) * fieldsPerPage);

    const handleNext = () => {
        // Validate only fields in the current step
        const stepErrors = {};
        currentFields.forEach(field => {
            const value = formData[field.name];
            if (field.is_required && (!value || (typeof value === 'string' && value.trim() === ""))) {
                stepErrors[field.name] = "Este campo es obligatorio";
            }
        });

        if (Object.keys(stepErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...stepErrors }));
            toast.error("Por favor completa los campos obligatorios");
            return;
        }

        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Por favor complete los campos obligatorios");
            return;
        }

        setSubmitting(true);
        try {
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
                        payload.append(`fields[${key}]`, value);
                    }
                });
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
            <div className="p-20 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-xl border border-gray-100 min-h-[450px] animate-fadeIn">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-50 border-t-[#2C67B0] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-blue-50/50 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="mt-8 text-gray-400 font-black uppercase tracking-[0.25em] text-[10px] animate-pulse">
                    Preparando Iniciativa Técnica...
                </p>
            </div>
        );
    }

    if (isNotFound) {
        return (
            <div className="p-16 text-center bg-white rounded-[3rem] shadow-2xl border border-red-50 relative overflow-hidden group animate-fadeIn">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                    <AlertCircle size={48} className="text-red-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Iniciativa no encontrada</h3>
                <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed font-medium mb-10">
                    Lo sentimos, la encuesta que buscas no se encuentra activa o el enlace ha expirado.
                </p>
                <button 
                    onClick={onCancel}
                    className="px-10 py-4 bg-[#005380] text-white font-black rounded-2xl hover:bg-[#2C67B0] transition-all shadow-xl active:scale-95"
                >
                    Volver al Listado
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,83,128,0.1)] overflow-hidden border border-gray-100 animate-slideUp">
            {/* Header Mural - Branding Permanente */}
            <div className="bg-[#005380] relative overflow-hidden px-8 md:px-12 py-8 text-white">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 border border-white/5">
                            <ShieldCheck size={10} className="text-[#B1D357]" />
                            Visión Circular ANDI
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                            {form.title && form.title !== "Nuevo Formulario" ? form.title : "Conoce más sobre nosotros"}
                        </h2>
                        {form.description && (
                            <p className="mt-2 text-blue-50/70 text-sm font-medium leading-relaxed max-w-4xl">
                                {form.description}
                            </p>
                        )}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-[-15deg] translate-x-16"></div>
            </div>

            {isAdmin && (
                <div className="bg-yellow-50 border-y border-yellow-100 px-12 py-3 flex items-center gap-3 text-yellow-800 text-[10px] font-black uppercase tracking-widest">
                    <Info size={14} className="text-yellow-600" />
                    Modo Vista Previa de Administrador (Respuestas deshabilitadas)
                </div>
            )}

            {/* Progress Bar */}
            {totalSteps > 1 && (
                <div className="bg-gray-50/50 px-8 md:px-16 py-4 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-[#005380] uppercase tracking-widest">
                            Progreso de la encuesta
                        </span>
                        <span className="text-[10px] font-black text-[#005380] uppercase tracking-widest">
                            Paso {currentStep + 1} de {totalSteps}
                        </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#B1D357] transition-all duration-500 ease-out"
                            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="px-8 md:px-12 py-8">
                {/* Top Actions & Information */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1 rounded-md border border-red-100/50">
                        <span className="text-lg font-black leading-none">*</span>
                        <span className="text-[10px] font-black uppercase tracking-wider">Campo Obligatorio</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Documento Versión {form.version || '1.0'}
                    </div>
                </div>

                {/* Main Information Section - Compact */}
                <div className="mb-10 space-y-4">
                    <div className="p-6 bg-gray-50/50 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-black text-[#005380] uppercase tracking-widest mb-2">Gracias por tu interés</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                            A través de este formulario recopilamos información básica que nos permitirá contactarlo y agendar un espacio para presentarle en detalle nuestro modelo, líneas estratégicas y oportunidades de articulación. Su información será utilizada únicamente para este fin y tratada con total confidencialidad.
                        </p>
                    </div>
                    <div className="flex items-start gap-3 px-2">
                        <Info size={14} className="text-[#B1D357] mt-0.5 shrink-0" />
                        <p className="text-[11px] text-gray-400 font-medium leading-tight">
                            Cuando envíe este formulario, no se recopilarán automáticamente sus detalles personales como nombre o correo, a menos que usted los proporcione en los campos correspondientes.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
                    {currentFields.map((field) => {
                            const type = (field.field_type?.slug || field.field_type?.name || field.type_name || "text").toLowerCase();
                            const isFullWidth = type === "textarea" || type.includes("file");
                            const hasError = !!errors[field.name];

                            return (
                                <div key={field.id} className={`${isFullWidth ? "md:col-span-2" : ""} space-y-3 group`}>
                                    <div className="flex justify-between items-end px-1">
                                        <label className="block text-sm font-black text-[#005380] group-hover:text-[#2C67B0] transition-colors uppercase text-[10px] tracking-[0.1em]">
                                            {field.label} {field.is_required && <span className="text-red-500 font-black ml-0.5">*</span>}
                                        </label>
                                        {field.metadata?.info && (
                                            <div className="group/info relative cursor-help">
                                                <Info size={14} className="text-gray-300 hover:text-[#2C67B0] transition-colors" />
                                                <div className="absolute bottom-full right-0 mb-3 w-56 p-4 bg-gray-900 text-white text-[11px] rounded-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all shadow-2xl z-50 leading-relaxed font-medium">
                                                    {field.metadata.info}
                                                    <div className="absolute top-full right-2 border-8 border-transparent border-t-gray-900"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {field.description && (
                                        <p className="px-1 text-xs text-gray-400 leading-relaxed italic font-medium">{field.description}</p>
                                    )}

                                    <div className="relative">
                                        {type === "textarea" ? (
                                            <textarea
                                                value={formData[field.name] || ""}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                placeholder={field.placeholder || "Escriba aquí..."}
                                                className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg min-h-[120px] outline-none transition-all resize-none font-bold text-gray-600 placeholder-gray-300 text-sm ${
                                                    hasError 
                                                    ? "border-red-200 focus:border-red-400 bg-red-50/10" 
                                                    : "focus:border-[#005380] focus:bg-white focus:ring-4 focus:ring-blue-500/5 group-hover:border-gray-200"
                                                }`}
                                            />
                                        ) : type === "select" || type === "dropdown" ? (
                                            <div className="relative">
                                                <select
                                                    value={formData[field.name] || ""}
                                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none transition-all font-bold text-gray-600 appearance-none text-sm ${
                                                        hasError 
                                                        ? "border-red-200 focus:border-red-400 bg-red-50/10" 
                                                        : "focus:border-[#005380] focus:bg-white focus:ring-4 focus:ring-blue-500/5 group-hover:border-gray-200"
                                                    }`}
                                                >
                                                    <option value="" disabled>{field.placeholder || "Selecciona una opción"}</option>
                                                    {(field.options?.choices || field.metadata?.options || []).map((opt, i) => (
                                                        <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                            </div>
                                        ) : type === "file" || type === "upload" || type.includes("image") ? (
                                            <div className={`relative group/file border border-dashed ${hasError ? 'border-red-200 bg-red-50/10' : 'border-gray-200 hover:border-[#005380] bg-gray-50/30 hover:bg-white'} rounded-lg p-6 transition-all text-center`}>
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                                                />
                                                <div className="flex flex-col items-center">
                                                    <div className={`p-3 rounded-md mb-3 ${formData[field.name] ? 'bg-emerald-50 text-emerald-500' : 'bg-white shadow-sm text-[#005380]'}`}>
                                                        <FileUp size={22} />
                                                    </div>
                                                    <span className="text-[11px] font-black text-[#005380]">
                                                        {formData[field.name] ? formData[field.name].name : "Adjuntar evidencia"}
                                                    </span>
                                                    <p className="text-[9px] text-gray-400 mt-1.5 font-medium tracking-tight">PDF, JPG, PNG (Máx 5MB)</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <input
                                                type={type.includes("email") ? "email" : type.includes("number") ? "number" : "text"}
                                                value={formData[field.name] || ""}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                placeholder={field.placeholder || "Escriba aquí..."}
                                                className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none transition-all font-bold text-gray-600 placeholder-gray-300 text-sm ${
                                                    hasError 
                                                    ? "border-red-200 focus:border-red-400 bg-red-50/10" 
                                                    : "focus:border-[#005380] focus:bg-white focus:ring-4 focus:ring-blue-500/5 group-hover:border-gray-200"
                                                }`}
                                            />
                                        )}

                                        {hasError && (
                                            <div className="flex items-center gap-1.5 mt-2 px-2 text-red-500 text-[10px] font-black uppercase tracking-wider animate-shake">
                                                <AlertCircle size={12} />
                                                <span>{errors[field.name]}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* MULTI-STEP NAVIGATION ACTIONS */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div className="flex gap-4">
                        {currentStep === 0 ? (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="py-3 px-8 bg-gray-50 text-gray-400 font-black rounded-lg hover:bg-gray-100 transition-all text-[10px] uppercase tracking-widest border border-gray-100"
                            >
                                Cancelar
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="py-3 px-6 bg-white text-gray-500 font-black rounded-lg border border-gray-200 hover:border-[#005380] hover:text-[#005380] transition-all text-[10px] uppercase tracking-widest flex items-center gap-2 group"
                            >
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                Anterior
                            </button>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {currentStep < totalSteps - 1 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="py-3 px-8 bg-[#005380] text-white font-black rounded-lg hover:bg-[#2C67B0] transition-all shadow-md flex items-center gap-3 text-[10px] uppercase tracking-widest group"
                            >
                                Siguiente
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={submitting || isAdmin}
                                className={`py-3 px-8 ${isAdmin ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-[#005380] text-white hover:bg-[#2C67B0]'} font-black rounded-lg transition-all shadow-md flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest group ${
                                    submitting ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5 active:scale-[0.98]"
                                }`}
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Enviando...
                                    </div>
                                ) : (
                                    <>
                                        {isAdmin ? 'Vista Previa' : 'Enviar Respuestas'}
                                        <CheckCircle size={14} className={isAdmin ? "text-gray-300" : "text-[#B1D357]"} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
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
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ResponderFormulario;
