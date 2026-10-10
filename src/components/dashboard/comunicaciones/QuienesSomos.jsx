import React, { useState, useEffect, useRef } from "react";
import ReactQuill from 'react-quill-new';
import DOMPurify from 'dompurify';
import 'react-quill-new/dist/quill.snow.css';
import {
    Users,
    Recycle,
    Globe,
    Zap,
    FileText,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    AlertCircle,
    Camera
} from "lucide-react";
import aboutUsApi from "../../../api/aboutUsApi";
import { extractFormErrors } from "../../../utils/errorUtils";
import { toast } from "react-hot-toast";
import { getImageProxyUrl } from "../../../utils/imageUtils";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  lightBlue: "#7FB8D9",  // Azul Claro
  lime: "#B1D357",       // Verde Lima
  green: "#00AB6D",      // Verde Principal
};

// --- BOTONES ESTILIZADOS ---
const ActionButton = ({ onClick, icon: Icon, color, label, disabled, type = "button" }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 border ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
        style={{
            backgroundColor: `${color}15`,
            borderColor: `${color}40`,
            color: color
        }}
    >
        {Icon && <Icon size={16} />}
        {label && <span>{label}</span>}
    </button>
);

export default function QuienesSomos() {
    const [loading, setLoading] = useState(true);
    const [savings, setSavings] = useState(false);

    // States for About Us
    const [aboutUs, setAboutUs] = useState({
        texto_index: "",
        toneladas: 0,
        recicladores: 0,
        proyectos: 0,
        municipios: 0
    });

    // States for Leader Quotes
    const [quotes, setQuotes] = useState([]);
    const [isEditingQuote, setIsEditingQuote] = useState(null); // ID of quote being edited
    const [editFormData, setEditFormData] = useState({ nombre: "", cargo: "", frase: "", file: null, preview: null });
    const [newQuote, setNewQuote] = useState({ nombre: "", cargo: "", frase: "", file: null, preview: null });
    const [showAddQuote, setShowAddQuote] = useState(false);

    const newFileInputRef = useRef(null);
    const editFileInputRef = useRef(null);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'clean'],
        ],
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'color', 'background', 'link'
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [aboutRes, quotesRes] = await Promise.all([
                aboutUsApi.getAboutUs(),
                aboutUsApi.getAllLeaderQuotes()
            ]);
            setAboutUs(aboutRes.data || aboutRes);
            const quotesData = quotesRes.data || quotesRes;
            setQuotes(Array.isArray(quotesData) ? quotesData : []);
        } catch (error) {
            toast.error("Error al cargar los datos");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAboutUs = async (e) => {
        e.preventDefault();
        setSavings(true);
        try {
            await aboutUsApi.updateAboutUs(aboutUs);
            toast.success("Contenido actualizado exitosamente");
        } catch (error) {
            const { message } = extractFormErrors(error);
            toast.error(message || "Error al actualizar contenido");
        } finally {
            setSavings(false);
        }
    };

    const handleNewFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("El archivo debe ser una imagen (JPG, PNG, WEBP)");
                return;
            }
            setNewQuote({
                ...newQuote,
                file: file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("El archivo debe ser una imagen (JPG, PNG, WEBP)");
                return;
            }
            setEditFormData({
                ...editFormData,
                file: file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const handleCreateQuote = async () => {
        if (!newQuote.nombre.trim()) {
            toast.error("Por favor ingresa el nombre del líder");
            return;
        }
        if (!newQuote.cargo.trim()) {
            toast.error("Por favor ingresa el cargo del líder");
            return;
        }
        if (!newQuote.frase.trim()) {
            toast.error("Por favor ingresa la frase o testimonio");
            return;
        }

        setSavings(true);
        try {
            const formData = new FormData();
            formData.append("nombre", newQuote.nombre.trim());
            formData.append("cargo", newQuote.cargo.trim());
            formData.append("frase", newQuote.frase.trim());
            if (newQuote.file) {
                formData.append("file", newQuote.file);
            }

            const res = await aboutUsApi.createLeaderQuote(formData);
            const created = res.data || res;
            setQuotes([...quotes, created]);
            setNewQuote({ nombre: "", cargo: "", frase: "", file: null, preview: null });
            setShowAddQuote(false);
            toast.success("Frase de líder y fotografía agregadas exitosamente");
        } catch (error) {
            const { message, missingFields } = extractFormErrors(error);
            if (missingFields.length > 0) {
                toast.error(`${message}: ${missingFields.join(", ")}`);
            } else {
                toast.error(message || "Error al crear la frase del líder");
            }
        } finally {
            setSavings(false);
        }
    };

    const startEditingQuote = (quote) => {
        setIsEditingQuote(quote.id);
        setEditFormData({
            nombre: quote.nombre || "",
            cargo: quote.cargo || "",
            frase: quote.frase || "",
            file: null,
            preview: quote.photo_url || quote.upload_file?.url || null
        });
    };

    const handleSaveEditQuote = async (id) => {
        if (!editFormData.nombre.trim()) {
            toast.error("El nombre del líder no puede estar vacío");
            return;
        }
        if (!editFormData.cargo.trim()) {
            toast.error("El cargo del líder no puede estar vacío");
            return;
        }
        if (!editFormData.frase.trim()) {
            toast.error("La frase del líder no puede estar vacía");
            return;
        }

        setSavings(true);
        try {
            const formData = new FormData();
            formData.append("nombre", editFormData.nombre.trim());
            formData.append("cargo", editFormData.cargo.trim());
            formData.append("frase", editFormData.frase.trim());
            if (editFormData.file) {
                formData.append("file", editFormData.file);
            }

            const res = await aboutUsApi.updateLeaderQuote(id, formData);
            const updated = res.data || res;
            setQuotes(quotes.map(q => q.id === id ? updated : q));
            setIsEditingQuote(null);
            setEditFormData({ nombre: "", cargo: "", frase: "", file: null, preview: null });
            toast.success("Frase, cargo y foto actualizados exitosamente");
        } catch (error) {
            const { message, missingFields } = extractFormErrors(error);
            if (missingFields.length > 0) {
                toast.error(`${message}: ${missingFields.join(", ")}`);
            } else {
                toast.error(message || "Error al actualizar la frase");
            }
        } finally {
            setSavings(false);
        }
    };

    const handleDeleteQuote = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta frase de líder?")) return;
        try {
            await aboutUsApi.deleteLeaderQuote(id);
            setQuotes(quotes.filter(q => q.id !== id));
            toast.success("Frase eliminada");
        } catch (error) {
            toast.error("Error al eliminar la frase");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C67B0]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">

            {/* SECCIÓN: TEXTO E IMPACTO */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-blue-50 text-[#2C67B0]">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: BRAND.blue }}>Contenido Principal e Impacto</h2>
                        <p className="text-sm text-gray-500">Edita el texto de bienvenida y las métricas de impacto</p>
                    </div>
                </div>

                <form onSubmit={handleUpdateAboutUs} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Texto Principal "¿Qué es Visión Circular ANDI?"</label>
                        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                            <ReactQuill
                                theme="snow"
                                value={aboutUs.texto_index || ""}
                                onChange={(content) => setAboutUs({ ...aboutUs, texto_index: content })}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Escribe el texto descriptivo aquí..."
                            />
                        </div>
                        <p className="text-xs text-gray-400">Este texto aparecerá en la sección superior de la vista de Quiénes Somos.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <Recycle size={16} className="text-[#B1D357]" /> Toneladas
                            </label>
                            <input
                                type="number"
                                value={aboutUs.toneladas || 0}
                                onChange={(e) => setAboutUs({ ...aboutUs, toneladas: parseInt(e.target.value) || 0 })}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2"
                                style={{ "--tw-ring-color": BRAND.blue }}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <Users size={16} className="text-[#B1D357]" /> Recicladores
                            </label>
                            <input
                                type="number"
                                value={aboutUs.recicladores || 0}
                                onChange={(e) => setAboutUs({ ...aboutUs, recicladores: parseInt(e.target.value) || 0 })}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <Zap size={16} className="text-[#B1D357]" /> Proyectos
                            </label>
                            <input
                                type="number"
                                value={aboutUs.proyectos || 0}
                                onChange={(e) => setAboutUs({ ...aboutUs, proyectos: parseInt(e.target.value) || 0 })}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <Globe size={16} className="text-[#B1D357]" /> Municipios
                            </label>
                            <input
                                type="number"
                                value={aboutUs.municipios || 0}
                                onChange={(e) => setAboutUs({ ...aboutUs, municipios: parseInt(e.target.value) || 0 })}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={savings}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all duration-200 shadow-lg shadow-blue-200 disabled:opacity-50 hover:opacity-90 cursor-pointer"
                            style={{ backgroundColor: BRAND.blue }}
                        >
                            <Save size={20} />
                            {savings ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </section>

            {/* SECCIÓN: VOCES DE LÍDERES */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-green-50 text-[#00AB6D]">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold" style={{ color: BRAND.blue }}>Voces de Nuestros Líderes</h2>
                            <p className="text-sm text-gray-500">Gestiona las fotos, nombres, cargos y testimonios de los líderes</p>
                        </div>
                    </div>
                    {!showAddQuote && (
                        <button
                            onClick={() => setShowAddQuote(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-200 shadow-md shadow-green-100 hover:opacity-95 cursor-pointer"
                            style={{ backgroundColor: BRAND.lime, color: BRAND.blue }}
                        >
                            <Plus size={20} />
                            Agregar Líder
                        </button>
                    )}
                </div>

                {/* Formulario para nuevo líder */}
                {showAddQuote && (
                    <div className="mb-8 p-6 rounded-2xl bg-gray-50 border-2 border-dashed border-[#00AB6D]/40 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center mb-5">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Agregar Nueva Voz de Líder</h3>
                                <p className="text-xs text-gray-500">Completa el nombre, cargo, foto y frase célebre</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddQuote(false);
                                    setNewQuote({ nombre: "", cargo: "", frase: "", file: null, preview: null });
                                }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5 mb-5">
                            {/* Upload de Foto */}
                            <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-xl bg-white text-center">
                                {newQuote.preview ? (
                                    <div className="relative group">
                                        <img
                                            src={newQuote.preview}
                                            alt="Preview"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-[#00AB6D]/30 shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setNewQuote({ ...newQuote, file: null, preview: null })}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow"
                                            title="Quitar foto"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => newFileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 hover:border-gray-400 transition-all text-gray-500"
                                    >
                                        <Camera size={26} className="text-gray-400 mb-1" />
                                        <span className="text-[10px] font-semibold text-gray-500">Subir Foto</span>
                                    </div>
                                )}
                                <input
                                    ref={newFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleNewFileChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => newFileInputRef.current?.click()}
                                    className="mt-2 text-xs font-semibold text-[#2C67B0] hover:underline"
                                >
                                    {newQuote.preview ? "Cambiar foto" : "Seleccionar imagen"}
                                </button>
                                <span className="text-[10px] text-gray-400 mt-0.5">JPG, PNG o WEBP (máx 5MB)</span>
                            </div>

                            {/* Nombre y Cargo */}
                            <div className="md:col-span-2 space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Nombre del Líder *
                                    </label>
                                    <input
                                        placeholder="Ej: Dra. María Fernanda Hernández"
                                        value={newQuote.nombre}
                                        onChange={(e) => setNewQuote({ ...newQuote, nombre: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#2C67B0] focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Cargo o Rol *
                                    </label>
                                    <input
                                        placeholder="Ej: Directora Ejecutiva Visión Circular ANDI"
                                        value={newQuote.cargo}
                                        onChange={(e) => setNewQuote({ ...newQuote, cargo: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#2C67B0] focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Editor de Frase */}
                        <div className="space-y-1 mb-5">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Frase o Testimonio *
                            </label>
                            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                                <ReactQuill
                                    theme="snow"
                                    value={newQuote.frase}
                                    onChange={(content) => setNewQuote({ ...newQuote, frase: content })}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Escribe la frase o testimonio aquí..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <ActionButton
                                icon={X}
                                color="#6B7280"
                                label="Cancelar"
                                onClick={() => {
                                    setShowAddQuote(false);
                                    setNewQuote({ nombre: "", cargo: "", frase: "", file: null, preview: null });
                                }}
                            />
                            <ActionButton
                                icon={Save}
                                color="#00AB6D"
                                label={savings ? "Guardando..." : "Guardar Líder"}
                                onClick={handleCreateQuote}
                                disabled={savings}
                            />
                        </div>
                    </div>
                )}

                {/* Listado de Líderes */}
                <div className="grid gap-4">
                    {quotes.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <AlertCircle className="mx-auto mb-2 opacity-30 text-gray-400" size={44} />
                            <p className="font-semibold text-gray-500">No hay frases de líderes registradas</p>
                            <p className="text-xs text-gray-400 mt-1">Haz clic en "Agregar Líder" para registrar el primero.</p>
                        </div>
                    ) : (
                        quotes.map((quote) => {
                            const isEditing = isEditingQuote === quote.id;
                            const rawPhoto = quote.photo_url || quote.upload_file?.url || quote.photo;
                            const photoSrc = rawPhoto ? getImageProxyUrl(rawPhoto) : null;

                            return (
                                <div
                                    key={quote.id}
                                    className="p-5 rounded-2xl border border-gray-200 hover:border-blue-300 bg-white transition-all duration-200 shadow-sm"
                                >
                                    {isEditing ? (
                                        /* MODO EDICIÓN COMPLETO */
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                                <h4 className="font-bold text-[#2C67B0] flex items-center gap-2">
                                                    <Edit2 size={16} /> Editando Líder: {quote.nombre}
                                                </h4>
                                                <button
                                                    onClick={() => setIsEditingQuote(null)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-5">
                                                {/* Cambio de Foto en Edición */}
                                                <div className="flex flex-col items-center justify-center p-3 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
                                                    {editFormData.preview ? (
                                                        <div className="relative group">
                                                            <img
                                                                src={editFormData.preview}
                                                                alt="Avatar"
                                                                className="w-20 h-20 rounded-full object-cover border-4 border-[#00AB6D]/40 shadow-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditFormData({ ...editFormData, file: null, preview: null })}
                                                                className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow"
                                                                title="Quitar foto"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={() => editFileInputRef.current?.click()}
                                                            className="w-20 h-20 rounded-full bg-white border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition text-gray-400"
                                                        >
                                                            <Camera size={22} className="mb-1" />
                                                            <span className="text-[9px] font-semibold">Subir Foto</span>
                                                        </div>
                                                    )}
                                                    <input
                                                        ref={editFileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleEditFileChange}
                                                        className="hidden"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => editFileInputRef.current?.click()}
                                                        className="mt-2 text-xs font-semibold text-[#2C67B0] hover:underline"
                                                    >
                                                        {editFormData.preview ? "Cambiar foto" : "Subir foto"}
                                                    </button>
                                                </div>

                                                {/* Inputs de Nombre y Cargo */}
                                                <div className="md:col-span-2 space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                            Nombre del Líder *
                                                        </label>
                                                        <input
                                                            value={editFormData.nombre}
                                                            onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
                                                            className="w-full p-2.5 rounded-lg border border-gray-300 font-bold focus:ring-2 focus:ring-[#2C67B0] outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                            Cargo o Rol *
                                                        </label>
                                                        <input
                                                            value={editFormData.cargo}
                                                            onChange={(e) => setEditFormData({ ...editFormData, cargo: e.target.value })}
                                                            className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#2C67B0] outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Edición de Frase */}
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                    Frase o Testimonio *
                                                </label>
                                                <div className="bg-white rounded-xl overflow-hidden border border-gray-300">
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={editFormData.frase}
                                                        onChange={(content) => setEditFormData({ ...editFormData, frase: content })}
                                                        modules={quillModules}
                                                        formats={quillFormats}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-2">
                                                <ActionButton
                                                    icon={X}
                                                    color="#6B7280"
                                                    label="Cancelar"
                                                    onClick={() => setIsEditingQuote(null)}
                                                />
                                                <ActionButton
                                                    icon={Save}
                                                    color="#00AB6D"
                                                    label={savings ? "Guardando..." : "Guardar Cambios"}
                                                    onClick={() => handleSaveEditQuote(quote.id)}
                                                    disabled={savings}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        /* MODO VISUALIZACIÓN CON ACCIONES CLARAS */
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                {/* Avatar Foto del Líder */}
                                                {photoSrc ? (
                                                    <img
                                                        src={photoSrc}
                                                        alt={quote.nombre}
                                                        className="w-14 h-14 rounded-full object-cover border-2 border-[#00AB6D]/40 shadow-sm flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-50 to-green-50 border-2 border-[#2C67B0]/20 flex items-center justify-center flex-shrink-0 text-[#2C67B0]">
                                                        <Users size={24} />
                                                    </div>
                                                )}

                                                <div className="space-y-1.5 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-bold text-base" style={{ color: BRAND.blue }}>
                                                            {quote.nombre}
                                                        </span>
                                                        <span
                                                            className="text-xs px-2.5 py-0.5 rounded-full uppercase tracking-tight font-semibold"
                                                            style={{ backgroundColor: `${BRAND.green}15`, color: BRAND.green }}
                                                        >
                                                            {quote.cargo}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="text-gray-600 text-sm leading-relaxed italic prose prose-sm max-w-none"
                                                        dangerouslySetInnerHTML={{
                                                            __html: DOMPurify.sanitize(String(quote.frase || "").replace(/\u00A0|&nbsp;/g, ' '))
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* BOTONES DE ACCIÓN PERMANENTEMENTE VISIBLES */}
                                            <div className="flex md:flex-col gap-2 self-end md:self-start flex-shrink-0">
                                                <button
                                                    onClick={() => startEditingQuote(quote)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2C67B0] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                                                    title="Modificar nombre, cargo, foto o frase"
                                                >
                                                    <Edit2 size={14} />
                                                    <span>Editar</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuote(quote.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                                                    title="Eliminar este testimonio"
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Eliminar</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

             <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
        .ql-container {
          min-height: 120px;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 120px;
          font-size: 0.875rem;
        }
      `}</style>
        </div>
    );
}
