import React, { useState, useEffect } from "react";
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
    AlertCircle
} from "lucide-react";
import aboutUsApi from "../../../api/aboutUsApi";
import { toast } from "react-hot-toast";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  lightBlue: "#7FB8D9",  // Azul Claro
  lime: "#B1D357",       // Verde Lima
  green: "#00AB6D",      // Verde Principal
};

// --- BOTONES ESTILIZADOS ---
const ActionButton = ({ onClick, icon: Icon, color, label, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 border ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
            backgroundColor: `${color}10`,
            borderColor: `${color}40`,
            color: color
        }}
    >
        <Icon size={16} />
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
    const [newQuote, setNewQuote] = useState({ nombre: "", cargo: "", frase: "" });
    const [showAddQuote, setShowAddQuote] = useState(false);

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
            setAboutUs(aboutRes.data);
            setQuotes(quotesRes.data);
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
            toast.error("Error al actualizar contenido");
        } finally {
            setSavings(false);
        }
    };

    const handleCreateQuote = async () => {
        if (!newQuote.nombre || !newQuote.cargo || !newQuote.frase) {
            toast.error("Por favor completa todos los campos");
            return;
        }
        setSavings(true);
        try {
            const res = await aboutUsApi.createLeaderQuote(newQuote);
            setQuotes([...quotes, res.data]);
            setNewQuote({ nombre: "", cargo: "", frase: "" });
            setShowAddQuote(false);
            toast.success("Frase de líder agregada");
        } catch (error) {
            toast.error("Error al crear la frase");
        } finally {
            setSavings(false);
        }
    };

    const handleDeleteQuote = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta frase?")) return;
        try {
            await aboutUsApi.deleteLeaderQuote(id);
            setQuotes(quotes.filter(q => q.id !== id));
            toast.success("Frase eliminada");
        } catch (error) {
            toast.error("Error al eliminar la frase");
        }
    };

    const handleUpdateQuote = async (id, updatedData) => {
        try {
            const res = await aboutUsApi.updateLeaderQuote(id, updatedData);
            setQuotes(quotes.map(q => q.id === id ? res.data : q));
            setIsEditingQuote(null);
            toast.success("Frase actualizada");
        } catch (error) {
            toast.error("Error al actualizar la frase");
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
                                value={aboutUs.texto_index}
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
                                value={aboutUs.toneladas}
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
                                value={aboutUs.recicladores}
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
                                value={aboutUs.proyectos}
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
                                value={aboutUs.municipios}
                                onChange={(e) => setAboutUs({ ...aboutUs, municipios: parseInt(e.target.value) || 0 })}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={savings}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all duration-200 shadow-lg shadow-blue-200 disabled:opacity-50 hover:opacity-90"
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
                            <p className="text-sm text-gray-500">Gestiona las frases y testimonios de los líderes</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddQuote(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 shadow-md shadow-green-100 hover:opacity-90"
                        style={{ backgroundColor: BRAND.lime, color: BRAND.blue }}
                    >
                        <Plus size={20} />
                        Agregar Frase
                    </button>
                </div>

                {/* Modal/Formulario para nueva frase */}
                {showAddQuote && (
                    <div className="mb-8 p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Nueva Frase de Líder</h3>
                            <button onClick={() => setShowAddQuote(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                                placeholder="Nombre del Líder"
                                value={newQuote.nombre}
                                onChange={(e) => setNewQuote({ ...newQuote, nombre: e.target.value })}
                                className="w-full p-3 rounded-xl border border-gray-200"
                            />
                            <input
                                placeholder="Cargo"
                                value={newQuote.cargo}
                                onChange={(e) => setNewQuote({ ...newQuote, cargo: e.target.value })}
                                className="w-full p-3 rounded-xl border border-gray-200"
                            />
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-4">
                            <ReactQuill
                                theme="snow"
                                value={newQuote.frase}
                                onChange={(content) => setNewQuote({ ...newQuote, frase: content })}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Escribe la frase aquí..."
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <ActionButton icon={Save} color="#2C67B0" label="Crear Frase" onClick={handleCreateQuote} disabled={savings} />
                        </div>
                    </div>
                )}

                <div className="grid gap-4">
                    {quotes.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <AlertCircle className="mx-auto mb-2 opacity-20" size={48} />
                            <p>No hay frases de líderes registradas</p>
                        </div>
                    ) : (
                        quotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="group p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/10 transition-all duration-200 relative"
                            >
                                {isEditingQuote === quote.id ? (
                                    <div className="space-y-4 animate-in fade-in duration-200">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <input
                                                value={quote.nombre}
                                                onChange={(e) => setQuotes(quotes.map(q => q.id === quote.id ? { ...q, nombre: e.target.value } : q))}
                                                className="p-2 rounded-lg border border-gray-200 font-bold"
                                            />
                                            <input
                                                value={quote.cargo}
                                                onChange={(e) => setQuotes(quotes.map(q => q.id === quote.id ? { ...q, cargo: e.target.value } : q))}
                                                className="p-2 rounded-lg border border-gray-200 text-sm"
                                            />
                                        </div>
                                        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                                            <ReactQuill
                                                theme="snow"
                                                value={quote.frase}
                                                onChange={(content) => setQuotes(quotes.map(q => q.id === quote.id ? { ...q, frase: content } : q))}
                                                modules={quillModules}
                                                formats={quillFormats}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <ActionButton icon={X} color="#6B7280" label="Cancelar" onClick={() => setIsEditingQuote(null)} />
                                            <ActionButton icon={Save} color="#2C67B0" label="Guardar" onClick={() => handleUpdateQuote(quote.id, quote)} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold" style={{ color: BRAND.blue }}>{quote.nombre}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-full uppercase tracking-tighter font-semibold"
                                                    style={{ backgroundColor: `${BRAND.green}15`, color: BRAND.green }}
                                                >
                                                    {quote.cargo}
                                                </span>
                                            </div>
                                            <div className="text-gray-600 text-sm leading-relaxed italic prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(quote.frase || "").replace(/\u00A0|&nbsp;/g, ' ')) }} />
                                        </div>
                                        <div className="flex md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => setIsEditingQuote(quote.id)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteQuote(quote.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
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
