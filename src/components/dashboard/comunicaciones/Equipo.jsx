import React, { useState, useEffect } from "react";
import {
    Users,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    ArrowUp,
    ArrowDown,
    Image as ImageIcon
} from "lucide-react";
import teamApi from "../../../api/teamApi";
import { toast } from "react-hot-toast";
import ConfirmModal from "../../modals/ConfirmModal";

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

const STYLE_OPTIONS = [
    { value: "INNOVACION", label: "Innovación" },
    { value: "ADMINISTRATIVA", label: "Administrativa y Financiera" },
    { value: "CIRCULARIDAD", label: "Circularidad y Regionales" },
    { value: "PROYECTOS", label: "Proyectos y Sostenibilidad" },
    { value: "RED", label: "Coordinador de Proyectos" },
];

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') && !path.includes('localhost')) return path;

    // Extraer solo la parte final si por error viene con localhost
    const cleanPath = path.replace(/^(https?:\/\/localhost(:\d+)?\/)?(storage\/)?/, '');
    return `https://api-ecocircular.creativostecnologicosit.com/storage/${cleanPath}`;
};

export default function Equipo() {
    const [loading, setLoading] = useState(true);
    const [savings, setSavings] = useState(false);
    const [members, setMembers] = useState([]);

    // States for Editing & Modals
    const [isEditingMember, setIsEditingMember] = useState(null);
    const [showAddMember, setShowAddMember] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        style_type: "CIRCULARIDAD",
        featured: false,
        photoDetails: null
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await teamApi.getAllMembers();
            // Expected to return array of members sorted by sort_order
            setMembers(res || []);
        } catch (error) {
            toast.error("Aún no hay conexión con el servidor (Equipo)");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, photoDetails: file });
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            style_type: "CIRCULARIDAD",
            featured: false,
            photoDetails: null
        });
        setPhotoPreview(null);
        setShowAddMember(false);
        setIsEditingMember(null);
    };

    const handleCreateMember = async () => {
        if (!formData.name || !formData.role) {
            toast.error("Por favor completa nombre y cargo");
            return;
        }
        if (!formData.photoDetails) {
            toast.error("Por favor sube una foto");
            return;
        }

        setSavings(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("role", formData.role);
            data.append("style_type", formData.style_type);
            data.append("featured", formData.featured ? 1 : 0);
            data.append("photo", formData.photoDetails);

            const res = await teamApi.createMember(data);
            setMembers([...members, res]);
            toast.success("Miembro de equipo agregado");
            resetForm();
        } catch (error) {
            console.error(error);
            const backendError = error.response?.data?.errors;
            if (backendError) {
                const firstErrorMessage = Object.values(backendError)[0][0];
                toast.error(`Validación: ${firstErrorMessage}`);
            } else {
                toast.error(error.response?.data?.message || "Error al agregar el miembro en la base de datos");
            }
        } finally {
            setSavings(false);
        }
    };

    const handleUpdateMember = async (id) => {
        setSavings(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("role", formData.role);
            data.append("style_type", formData.style_type);
            data.append("featured", formData.featured ? 1 : 0);
            if (formData.photoDetails) {
                data.append("photo", formData.photoDetails);
            }

            const res = await teamApi.updateMember(id, data);
            setMembers(members.map(m => m.id === id ? res : m));
            toast.success("Miembro actualizado");
            resetForm();
        } catch (error) {
            console.error(error);
            const backendError = error.response?.data?.errors;
            if (backendError) {
                const firstErrorMessage = Object.values(backendError)[0][0];
                toast.error(`Validación: ${firstErrorMessage}`);
            } else {
                toast.error(error.response?.data?.message || "Error al actualizar el miembro en la base de datos");
            }
        } finally {
            setSavings(false);
        }
    };

    const handleDeleteMember = async (id) => {
        try {
            await teamApi.deleteMember(id);
            setMembers(members.filter(m => m.id !== id));
            toast.success("Miembro eliminado");
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar el miembro de la base de datos");
        }
    };

    const handleEditClick = (member) => {
        setFormData({
            name: member.name,
            role: member.role,
            style_type: member.style_type || "CIRCULARIDAD",
            featured: member.featured === 1 || member.featured === true,
            photoDetails: null
        });
        setPhotoPreview(getImageUrl(member.photo_url));
        setIsEditingMember(member.id);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const moveMember = async (index, direction) => {
        const newMembers = [...members];
        if (direction === 'up' && index > 0) {
            [newMembers[index - 1], newMembers[index]] = [newMembers[index], newMembers[index - 1]];
        } else if (direction === 'down' && index < newMembers.length - 1) {
            [newMembers[index + 1], newMembers[index]] = [newMembers[index], newMembers[index + 1]];
        } else {
            return; // No movement
        }

        // Update sort_order locally
        const reordered = newMembers.map((m, i) => ({ ...m, sort_order: i }));
        setMembers(reordered);

        // Push update to server
        try {
            await teamApi.updateMembersOrder(reordered.map(m => m.id));
            toast.success("Orden actualizado");
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar el orden en la base de datos");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C67B0]"></div>
            </div>
        );
    }

    const isFormOpen = showAddMember || isEditingMember;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-blue-50 text-[#2C67B0]">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#005380]">Equipo de Trabajo</h2>
                            <p className="text-sm text-gray-500">Gestiona los miembros, sus cargos y el orden (quién va primero).</p>
                        </div>
                    </div>
                    {!isFormOpen && (
                        <button
                            onClick={() => setShowAddMember(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B1D357] text-[#005380] font-bold hover:bg-[#9cb84d] transition-all duration-200 shadow-md shadow-green-100"
                        >
                            <Plus size={20} />
                            Agregar Miembro
                        </button>
                    )}
                </div>

                {/* Formulario */}
                {isFormOpen && (
                    <div className="mb-8 p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">
                                {isEditingMember ? "Editar Miembro" : "Nuevo Miembro"}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-12 gap-6 mb-4">
                            {/* Photo Upload */}
                            <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center">
                                <label className="cursor-pointer group relative w-full aspect-[4/5] bg-white border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-blue-400 flex flex-col items-center justify-center transition-all">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover object-top" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <ImageIcon size={32} className="mx-auto text-gray-300 mb-2 group-hover:text-blue-400" />
                                            <span className="text-sm text-gray-500 font-medium">Subir Foto</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                        <span className="text-white font-bold drop-shadow-md flex items-center gap-2">
                                            <Edit2 size={16} /> Cambiar
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                                <p className="text-xs text-center text-gray-400 mt-2">Recomendado: 4:5 vertical</p>
                            </div>

                            <div className="md:col-span-8 lg:col-span-9 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Nombre Completo</label>
                                        <input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ej. Juan Pérez"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Cargo</label>
                                        <input
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ej. Coordinador Regional"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 items-center">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Estilo Visual (Departamento)</label>
                                        <select
                                            value={formData.style_type}
                                            onChange={(e) => setFormData({ ...formData, style_type: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {STYLE_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-3 pt-6">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="featured" className="text-sm font-bold text-gray-700 cursor-pointer">
                                            Destacar miembro (Directora/Líder)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 border-t border-gray-200 pt-4">
                            <ActionButton icon={X} color="#6B7280" label="Cancelar" onClick={resetForm} />
                            {isEditingMember ? (
                                <ActionButton icon={Save} color="#2C67B0" label="Guardar" onClick={() => handleUpdateMember(isEditingMember)} disabled={savings} />
                            ) : (
                                <ActionButton icon={Save} color="#2C67B0" label="Crear" onClick={handleCreateMember} disabled={savings} />
                            )}
                        </div>
                    </div>
                )}

                {/* Lista de Miembros Ordenable */}
                <div className="space-y-3">
                    {members.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <Users className="mx-auto mb-2 opacity-20" size={48} />
                            <p className="font-medium">No hay miembros registrados</p>
                            <p className="text-sm mt-1">Haz clic en "Agregar Miembro" para empezar.</p>
                        </div>
                    ) : (
                        members.map((member, index) => (
                            <div
                                key={member.id}
                                className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/20 hover:shadow-md transition-all duration-300 bg-white"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Controles de orden */}
                                    <div className="flex flex-col gap-1 items-center justify-center mr-2">
                                        <button
                                            onClick={() => moveMember(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 transition-colors"
                                            title="Subir"
                                        >
                                            <ArrowUp size={16} strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={() => moveMember(index, 'down')}
                                            disabled={index === members.length - 1}
                                            className="p-1 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 transition-colors"
                                            title="Bajar"
                                        >
                                            <ArrowDown size={16} strokeWidth={3} />
                                        </button>
                                    </div>

                                    {/* Foto Thumbnail */}
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                        {member.photo_url ? (
                                            <img src={getImageUrl(member.photo_url)} alt={member.name} className="w-full h-full object-cover object-top" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <h4 className="font-bold text-[#1E305D] text-lg flex items-center gap-2">
                                            {member.name}
                                            {member.featured && (
                                                <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                    Destacado
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-gray-600 font-medium text-sm">{member.role}</p>
                                        <span className="text-xs text-gray-400 mt-1 inline-block">ID Estilo: {member.style_type || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(member)}
                                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                                        title="Editar"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setMemberToDelete(member)}
                                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <p className="text-xs text-gray-400 text-center mt-6">
                    Mueve a las personas arriba o abajo usando las flechas de la izquierda para cambiar el orden en la página principal.
                </p>
            </section>

            {/* Modal Global de Confirmación */}
            <ConfirmModal
                isOpen={!!memberToDelete}
                onClose={() => setMemberToDelete(null)}
                onConfirm={() => memberToDelete && handleDeleteMember(memberToDelete.id)}
                title="Eliminar Miembro"
                message={`¿Estás seguro de que deseas eliminar permanentemente a ${memberToDelete?.name}? Esta acción no se puede deshacer.`}
                confirmText="Sí, eliminar"
                isDanger={true}
            />
        </div>
    );
}
