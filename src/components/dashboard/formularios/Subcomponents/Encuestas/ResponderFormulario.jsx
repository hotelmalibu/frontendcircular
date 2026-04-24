import React, { useState, useEffect, useContext } from "react";
import DOMPurify from 'dompurify';
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
    ShieldCheck,
    Mail,
    Link as LinkIcon
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
    const [formSubmitted, setFormSubmitted] = useState(false);

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
                
                // Better validation for different types
                const isEmpty = (val) => {
                    if (val === undefined || val === null) return true;
                    if (typeof val === 'string') return val.trim() === "";
                    if (Array.isArray(val)) return val.length === 0;
                    if (typeof val === 'object') return Object.keys(val).length === 0;
                    return false;
                };

                if (field.is_required && isEmpty(value)) {
                    newErrors[field.name] = "Este campo es obligatorio";
                }
            });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Auto-Pagination Logic based on Titles
    const pages = React.useMemo(() => {
        if (!form?.fields) return [];
        const sorted = [...form.fields].sort((a, b) => a.order - b.order);
        
        const _pages = [];
        let currentPage = [];
        
        sorted.forEach((field, index) => {
            const type = (field.field_type?.slug || field.field_type?.name || field.type_name || "text").toLowerCase();
            
            // If it's a Section, break to new page
            if (type === 'section' && index > 0) {
                if (currentPage.length > 0) _pages.push(currentPage);
                currentPage = [];
            }
            currentPage.push(field);
        });
        
        if (currentPage.length > 0) _pages.push(currentPage);
        
        return _pages.length > 0 ? _pages : [sorted];
    }, [form]);

    const totalSteps = pages.length;
    const currentFields = pages[currentStep] || [];

    const handleNext = (e) => {
        if (e) e.preventDefault();
        
        // Validate only fields in the current step
        const stepErrors = {};
        currentFields.forEach(field => {
            const value = formData[field.name];
            
            const isEmpty = (val) => {
                if (val === undefined || val === null) return true;
                if (typeof val === 'string') return val.trim() === "";
                if (Array.isArray(val)) return val.length === 0;
                if (typeof val === 'object') return Object.keys(val).length === 0;
                return false;
            };

            if (field.is_required && isEmpty(value)) {
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
        if (e) e.preventDefault();

        // Extra check: if we are not in the last step, don't submit if called via keyboard/form submit
        if (currentStep < totalSteps - 1) {
            handleNext();
            return;
        }

        if (!validateForm()) {
            toast.error("Por favor complete los campos obligatorios");
            const firstErrorField = document.querySelector('.animate-shake');
            if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setSubmitting(true);
        try {
            const hasFiles = form.fields.some(f => {
                const type = (f.field_type?.name || f.type_name || "").toLowerCase();
                return type.includes("file") || type.includes("image");
            });

            // Filter out decorative fields (titles, paragraphs, etc.) - These should NEVE be sent to backend
            const decorativeTypes = ['title', 'paragraph', 'divider', 'spacer', 'rich_text', 'section', 'header', 'image', 'video'];
            
            console.log("Filtering Form Data. Original keys:", Object.keys(formData));

            const cleanFormData = Object.keys(formData).reduce((acc, key) => {
                const field = form.fields.find(f => f.name === key);
                if (!field) return acc;

                const type = (field.field_type?.slug || field.type_slug || field.field_type?.name || field.type_name || "").toLowerCase();
                
                // SKIP if type is decorative (images, videos, etc don't store values)
                if (decorativeTypes.includes(type)) return acc;
                
                // SKIP if name suggests decorative
                if (key.includes('image_') || key.includes('video_')) return acc;

                acc[key] = formData[key];
                return acc;
            }, {});

            console.log("Clean Form Data keys:", Object.keys(cleanFormData));

            let payload;
            if (hasFiles) {
                payload = new FormData();
                Object.keys(cleanFormData).forEach(key => {
                    const value = cleanFormData[key];
                    if (value !== undefined && value !== null) {
                        if (Array.isArray(value)) {
                            value.forEach((v, i) => {
                                payload.append(`fields[${key}][${i}]`, v);
                            });
                        } else if (typeof value === 'object' && !(value instanceof File || value instanceof Blob)) {
                            // Handle nested structures for Grids
                            Object.entries(value).forEach(([subKey, subVal]) => {
                                if (Array.isArray(subVal)) {
                                    subVal.forEach((v, i) => payload.append(`fields[${key}][${subKey}][${i}]`, v));
                                } else {
                                    payload.append(`fields[${key}][${subKey}]`, subVal);
                                }
                            });
                        } else {
                            payload.append(`fields[${key}]`, value);
                        }
                    }
                });
                payload.append("metadata[submission_source]", "web");
                payload.append("metadata[user_agent]", navigator.userAgent);
            } else {
                payload = {
                    fields: cleanFormData,
                    metadata: {
                        submission_source: "web",
                        user_agent: navigator.userAgent
                    }
                };
            }

            await formsApi.submitForm(formId, payload);
            toast.success("Respuestas enviadas con éxito");
            setFormSubmitted(true);
            if (onSuccess) onSuccess();
        } catch (error) {
            if (error.response?.data) {
                console.group("Validation Errors Details");
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
                
                if (error.response.status === 422 && error.response.data?.errors) {
                    const apiErrors = error.response.data.errors;
                    const newErrors = {};
                    
                    Object.keys(apiErrors).forEach(key => {
                        const fieldName = key.replace('fields.', '');
                        newErrors[fieldName] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
                    });
                    
                    setErrors(newErrors);
                    console.table(apiErrors);
                }
                console.groupEnd();
            }
            
            let apiError = "Error al enviar las respuestas";
            if (error.response?.data?.message) {
                 apiError = error.response.data.message;
            } else if (error.message) {
                 apiError = error.message;
            }
            
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

            {/* Cleaner Progress Bar & Legend */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-8 md:px-12 py-6 border-b border-gray-100">
                {totalSteps > 1 && (
                    <div className="flex-1 max-w-md">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Progreso
                            </span>
                            <span className="text-[10px] font-black text-[#005380] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                                Paso {currentStep + 1} / {totalSteps}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#005380] transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                
                {/* Subtle Mandatory Legend */}
                <div className={`flex items-center gap-2 ${totalSteps > 1 ? '' : 'w-full'}`}>
                    <span className="text-red-500 font-black text-lg leading-none">*</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Campos obligatorios
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 md:px-12 py-8">
                {/* Main Information Section - Compact */}
                <div className="mb-0">
                   {/* Content removed as requested */}
                </div>
                <div className="space-y-8">
                    {currentFields.map((field) => {
                            const type = (field.field_type?.slug || field.field_type?.name || field.type_name || "text").toLowerCase();
                            const hasError = !!errors[field.name];

                            // Render Logic for Display-Only Fields (Title, Paragraph)
                            if (type === 'title') {
                                return (
                                    <div key={field.id} className="pt-4 pb-2 border-b border-gray-100">
                                        <h3 
                                            className={`font-black text-[#005380] ${
                                                field.options?.tag === 'h1' ? 'text-3xl' :
                                                field.options?.tag === 'h2' ? 'text-2xl' :
                                                'text-xl'
                                            } ${field.options?.align ? `text-${field.options.align}` : ''} ${field.options?.color ? field.options.color : ''}`}
                                        >
                                            {field.label || field.name}
                                        </h3>
                                        {field.description && <p className="text-gray-500 mt-1">{field.description}</p>}
                                    </div>
                                );
                            }

                            if (type === 'section') {
                                return (
                                    <div key={field.id} className="pt-8 pb-4 border-b-2 border-[#005380]/20 mb-4">
                                        <h2 className="text-2xl font-black text-[#005380] uppercase tracking-tight">
                                            {field.label || "Nueva Sección"}
                                        </h2>
                                        {field.description && <p className="text-gray-500 mt-2 font-medium">{field.description}</p>}
                                    </div>
                                );
                            }

                            if (type === 'paragraph') {
                                return (
                                    <div key={field.id} className="py-2">
                                        <div 
                                            className={`prose max-w-none text-gray-600 ${
                                                field.options?.size ? field.options.size : 'text-sm'
                                            } ${field.options?.align ? `text-${field.options.align}` : ''} ${field.options?.color ? field.options.color : ''}`}
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(field.label || field.description || "").replace(/\u00A0|&nbsp;/g, ' ')) }} 
                                        />
                                    </div>
                                );
                            }

                            if (type === 'image') {
                                return (
                                    <div key={field.id} className="py-4 flex flex-col items-center">
                                        {field.options?.src ? (
                                            <img 
                                                src={field.options.src} 
                                                alt={field.options.alt || ""} 
                                                className="max-w-full rounded-2xl shadow-lg border border-gray-100 object-contain max-h-[500px]"
                                            />
                                        ) : (
                                            <div className="p-10 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-gray-400 text-xs italic">
                                                Imagen no configurada
                                            </div>
                                        )}
                                        {field.label && <p className="mt-3 text-xs font-bold text-gray-500">{field.label}</p>}
                                    </div>
                                );
                            }

                            if (type === 'video') {
                                const videoId = field.options?.url?.includes('v=') ? field.options.url.split('v=')[1].split('&')[0] : field.options?.url?.split('/').pop();
                                return (
                                    <div key={field.id} className="py-4">
                                        {field.options?.url ? (
                                            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                                <iframe 
                                                    width="100%" 
                                                    height="100%" 
                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                    title="YouTube video player" 
                                                    frameBorder="0" 
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <div className="p-10 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-gray-400 text-xs italic text-center">
                                                URL de Video no configurada
                                            </div>
                                        )}
                                        {field.label && <p className="mt-3 text-xs font-bold text-gray-500 text-center">{field.label}</p>}
                                    </div>
                                );
                            }

                            // Standard Input Fields
                            return (
                                <div key={field.id} className="space-y-3 group">
                                    <div className="flex justify-between items-end px-1">
                                        <label className="block text-sm font-black text-[#005380] group-hover:text-[#2C67B0] transition-colors uppercase text-[10px] tracking-[0.1em]">
                                            {(() => {
                                                const text = field.label;
                                                const urlRegex = /(https?:\/\/[^\s]+)/g;
                                                const parts = text.split(urlRegex);
                                                return parts.map((part, i) => 
                                                    urlRegex.test(part) ? (
                                                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700 z-50 relative pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                                                            {part}
                                                        </a>
                                                    ) : part
                                                );
                                            })()}
                                            {field.is_required && <span className="text-red-500 font-black ml-0.5">*</span>}
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
                                                    multiple={field.options?.multiple}
                                                    value={formData[field.name] || (field.options?.multiple ? [] : "")}
                                                    onChange={(e) => {
                                                        if (field.options?.multiple) {
                                                            const values = Array.from(e.target.selectedOptions, option => option.value);
                                                            handleChange(field.name, values);
                                                        } else {
                                                            handleChange(field.name, e.target.value);
                                                        }
                                                    }}
                                                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none transition-all font-bold text-gray-600 ${field.options?.multiple ? 'custom-multiselect h-32' : 'appearance-none'} text-sm ${
                                                        hasError 
                                                        ? "border-red-200 focus:border-red-400 bg-red-50/10" 
                                                        : "focus:border-[#005380] focus:bg-white focus:ring-4 focus:ring-blue-500/5 group-hover:border-gray-200"
                                                    }`}
                                                >
                                                    {!field.options?.multiple && <option value="" disabled>{field.placeholder || "Selecciona una opción"}</option>}
                                                    {(field.options?.choices || field.metadata?.options || []).map((opt, i) => (
                                                        <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
                                                    ))}
                                                </select>
                                                {!field.options?.multiple && <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />}
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
                                        ) : type === "radio" ? (
                                            <div className="space-y-3">
                                                {(() => {
                                                    const rawOptions = field.options?.choices || field.options?.options || field.options || field.metadata?.options || [];
                                                    const optionsList = Array.isArray(rawOptions) ? rawOptions : [];
                                                    
                                                    if (optionsList.length === 0) {
                                                        return (
                                                            <div className="p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600 font-mono break-all">
                                                                Debug: {JSON.stringify(field)}
                                                            </div>
                                                        );
                                                    }

                                                    return optionsList.map((opt, i) => {
                                                        const val = typeof opt === 'object' ? opt.value : opt;
                                                        const label = typeof opt === 'object' ? opt.label : opt;
                                                        return (
                                                            <label key={i} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                                                                formData[field.name] === val 
                                                                ? 'border-[#005380] bg-blue-50/30 ring-1 ring-[#005380]' 
                                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                            }`}>
                                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors ${
                                                                    formData[field.name] === val ? 'border-[#005380]' : 'border-gray-300'
                                                                }`}>
                                                                    {formData[field.name] === val && (
                                                                        <div className="w-2.5 h-2.5 bg-[#005380] rounded-full" />
                                                                    )}
                                                                </div>
                                                                <input
                                                                    type="radio"
                                                                    name={field.name}
                                                                    value={val}
                                                                    checked={formData[field.name] === val}
                                                                    onChange={(e) => handleChange(field.name, val)}
                                                                    className="hidden"
                                                                />
                                                                <span className={`text-sm font-bold ${
                                                                    formData[field.name] === val ? 'text-[#005380]' : 'text-gray-600'
                                                                }`}>{label}</span>
                                                            </label>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        ) : type === "checkbox" ? (
                                            <div className="space-y-3">
                                                {(() => {
                                                     const rawOptions = field.options?.choices || field.options?.options || field.options || field.metadata?.options || [];
                                                     let optionsList = Array.isArray(rawOptions) ? rawOptions : [];

                                                     // FIX: Support for Single Boolean Checkbox (e.g. Terms & Conditions)
                                                     // If no options list but we have a label or it's a simple checkbox
                                                     if (optionsList.length === 0 && (field.options?.label || field.label)) {
                                                         optionsList = [{
                                                             label: field.options?.label || "Sí",
                                                             value: "1"
                                                         }];
                                                     }

                                                     if (optionsList.length === 0) {
                                                         return (
                                                             <div className="p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600 font-mono break-all">
                                                                 Error de configuración: Sin opciones definidas.
                                                             </div>
                                                         );
                                                     }

                                                    return optionsList.map((opt, i) => {
                                                        const val = typeof opt === 'object' ? opt.value : opt;
                                                        const label = typeof opt === 'object' ? opt.label : opt;
                                                        // Handle both array of values (multiple) and boolean (single) scenarios if needed
                                                        // For singular boolean checkboxes, we might store as "true"/"false" or array ["true"]
                                                        const currentValues = Array.isArray(formData[field.name]) ? formData[field.name] : [];
                                                        const isChecked = currentValues.includes(val) || formData[field.name] === val || formData[field.name] === true;
                                                        
                                                        return (
                                                            <label key={i} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                                                                isChecked 
                                                                ? 'border-[#005380] bg-blue-50/30 ring-1 ring-[#005380]' 
                                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                            }`}>
                                                                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${
                                                                    isChecked ? 'bg-[#005380] border-[#005380]' : 'border-gray-300 bg-white'
                                                                }`}>
                                                                    {isChecked && <CheckCircle size={12} className="text-white" />}
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    value={val}
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        // If it's the only option (like Accept Terms), send '1' or null
                                                                        if (optionsList.length === 1) {
                                                                             handleChange(field.name, e.target.checked ? "1" : null);
                                                                        } else {
                                                                            const newValues = isChecked 
                                                                                ? (Array.isArray(formData[field.name]) ? formData[field.name].filter(v => v !== val) : [])
                                                                                : [...(Array.isArray(formData[field.name]) ? formData[field.name] : []), val];
                                                                            handleChange(field.name, newValues);
                                                                        }
                                                                    }}
                                                                    className="hidden"
                                                                />
                                                                <span className={`text-sm font-bold ${
                                                                    isChecked ? 'text-[#005380]' : 'text-gray-600'
                                                                }`}>{label}</span>
                                                            </label>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        ) : type === "grid" || type === "checkbox_grid" ? (
                                            <div className="overflow-x-auto bg-gray-50/50 rounded-2xl border border-gray-100 p-1 md:p-6 group-hover:bg-white transition-all">
                                                <table className="w-full text-left border-collapse min-w-[500px]">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest"></th>
                                                            {(field.options?.columns || ["Col 1", "Col 2", "Col 3"]).map((col, idx) => (
                                                                <th key={idx} className="p-4 text-center text-[10px] font-black text-[#005380] uppercase tracking-widest bg-blue-50/30 rounded-t-xl min-w-[80px]">
                                                                    {typeof col === 'string' ? col : (col.label || `Col ${idx+1}`)}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {(field.options?.rows || ["Fila 1", "Fila 2"]).map((row, rIdx) => {
                                                            const rowName = typeof row === 'string' ? row : (row.label || `Fila ${rIdx+1}`);
                                                            return (
                                                                <tr key={rIdx} className="hover:bg-blue-50/10 transition-colors">
                                                                    <td className="p-4 text-sm font-bold text-gray-700">{rowName}</td>
                                                                    {(field.options?.columns || ["Col 1", "Col 2", "Col 3"]).map((col, cIdx) => {
                                                                        const colVal = typeof col === 'string' ? col : (col.value || col.label || `Val ${cIdx+1}`);
                                                                        const currentGridData = formData[field.name] || {};
                                                                        
                                                                        if (type === 'grid') {
                                                                            const isSelected = currentGridData[rowName] === colVal;
                                                                            return (
                                                                                <td key={cIdx} className="p-4 text-center">
                                                                                     <button 
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            const newData = { ...currentGridData, [rowName]: colVal };
                                                                                            handleChange(field.name, newData);
                                                                                        }}
                                                                                        className={`w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center transition-all ${isSelected ? 'border-[#005380] bg-[#005380] shadow-md scale-110' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                                                                     >
                                                                                         {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                                                                     </button>
                                                                                </td>
                                                                            );
                                                                        } else {
                                                                            const rowValues = Array.isArray(currentGridData[rowName]) ? currentGridData[rowName] : [];
                                                                            const isChecked = rowValues.includes(colVal);
                                                                            return (
                                                                                <td key={cIdx} className="p-4 text-center">
                                                                                     <button 
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            const newRowValues = isChecked 
                                                                                                ? rowValues.filter(v => v !== colVal)
                                                                                                : [...rowValues, colVal];
                                                                                            const newData = { ...currentGridData, [rowName]: newRowValues };
                                                                                            handleChange(field.name, newData);
                                                                                        }}
                                                                                        className={`w-6 h-6 rounded border-2 mx-auto flex items-center justify-center transition-all ${isChecked ? 'border-[#005380] bg-[#005380] shadow-md scale-110' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                                                                     >
                                                                                         {isChecked && <CheckCircle size={14} className="text-white" />}
                                                                                     </button>
                                                                                </td>
                                                                            );
                                                                        }
                                                                    })}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : type === "linear_scale" ? (
                                            <div className="py-2">
                                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 px-6 py-8 rounded-2xl border border-gray-100 group-hover:bg-white transition-all">
                                                    <span className="text-xs font-bold text-gray-400 order-2 md:order-1">{field.options?.min_label || "Bajo"}</span>
                                                    <div className="flex-1 flex justify-between items-center gap-2 md:gap-4 order-1 md:order-2 w-full md:w-auto">
                                                        {(() => {
                                                            const min = parseInt(field.options?.min || 1);
                                                            const max = parseInt(field.options?.max || 5);
                                                            const range = Array.from({ length: max - min + 1 }, (_, i) => i + min);
                                                            return range.map(val => (
                                                                <button
                                                                    key={val}
                                                                    type="button"
                                                                    onClick={() => handleChange(field.name, val)}
                                                                    className={`flex flex-col items-center gap-3 transition-all ${String(formData[field.name]) === String(val) ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                                                                >
                                                                    <span className={`text-xs font-black ${String(formData[field.name]) === String(val) ? 'text-[#005380]' : 'text-gray-400'}`}>{val}</span>
                                                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                                                        String(formData[field.name]) === String(val) 
                                                                        ? 'border-[#005380] bg-[#005380] shadow-lg shadow-blue-500/20' 
                                                                        : 'border-gray-300 bg-white'
                                                                    }`}>
                                                                        {String(formData[field.name]) === String(val) && <div className="w-2 h-2 bg-white rounded-full" />}
                                                                    </div>
                                                                </button>
                                                            ));
                                                        })()}
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-400 order-3">{field.options?.max_label || "Alto"}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                {/* Icon Wrapper based on Type */}
                                                {(type.includes("email") || type.includes("url")) && (
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                        {type.includes("email") ? <Mail size={16} /> : <LinkIcon size={16} />}
                                                    </div>
                                                )}
                                                
                                                <input
                                                    type={type.includes("email") ? "email" : type.includes("number") ? "number" : type === "date" ? "date" : type === "time" ? "time" : "text"}
                                                    value={formData[field.name] || ""}
                                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                                    placeholder={field.placeholder || "Escriba aquí..."}
                                                    className={`w-full ${type.includes("email") || type.includes("url") ? "pl-11" : "px-4"} pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none transition-all font-bold text-gray-600 placeholder-gray-300 text-sm ${
                                                        hasError 
                                                        ? "border-red-200 focus:border-red-400 bg-red-50/10" 
                                                        : "focus:border-[#005380] focus:bg-white focus:ring-4 focus:ring-blue-500/5 group-hover:border-gray-200"
                                                    }`}
                                                />
                                            </div>
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
                
                {/* SUCCESS STATE */}
                {formSubmitted && (
                    <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 animate-fadeIn">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2 text-center">¡Enviado con Éxito!</h3>
                        <p className="text-gray-500 text-center max-w-md mb-8">
                            Tus respuestas han sido registradas correctamente. Gracias por participar.
                        </p>
                        <button 
                            onClick={() => {
                                setFormSubmitted(false);
                                setFormData({});
                                setCurrentStep(0);
                                if (onCancel) onCancel();
                            }}
                            className="px-8 py-3 bg-[#005380] text-white font-bold rounded-xl hover:bg-[#2C67B0] transition-colors shadow-lg"
                        >
                            Volver / Finalizar
                        </button>
                    </div>
                )}

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

// End of file
