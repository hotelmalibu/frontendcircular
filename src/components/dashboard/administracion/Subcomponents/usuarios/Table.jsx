import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Plus,
  X,
  User,
  Mail,
  Lock,
  Shield
} from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "../../../../../api/users";
import { getPublicRoles } from "../../../../../api/auth";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja (Alertas)
  yellow: "#E8AD00",     // Amarillo
  gray: "#6B7280",
};

export default function Table() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // For Edit/Delete
  const [saving, setSaving] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: ""
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      console.log("Users API Response:", res.data);

      let usersArray = [];
      if (Array.isArray(res.data)) {
        usersArray = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        usersArray = res.data.data;
      } else if (res.data && typeof res.data === 'object') {
        const possibleArray = Object.values(res.data).find(val => Array.isArray(val));
        if (possibleArray) {
          usersArray = possibleArray;
        } else {
          usersArray = Object.values(res.data);
        }
      }

      usersArray = usersArray.filter(item => item && typeof item === 'object' && !Array.isArray(item));
      setUsers(usersArray);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      const msg = err.response?.data?.message || err.message || "Error desconocido";
      setError(`Error: ${msg} (Status: ${err.response?.status})`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getPublicRoles();
      if (res.data?.data?.items) {
        setRoles(res.data.data.items);
      } else if (Array.isArray(res.data)) {
        setRoles(res.data);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // OPEN CREATE MODAL
  const openCreateModal = () => {
    setCurrentUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_id: roles.length > 0 ? roles[roles.length - 1].id : ""
    });
    setIsModalOpen(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (user) => {
    setCurrentUser(user);
    // Find role_id from user object. 
    // Usually user.role_id exists, or user.roles[0].id, or user.role.id
    const userRoleId = user.role_id || (user.roles && user.roles.length > 0 ? user.roles[0].id : "") || (user.role ? user.role.id : "");

    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Empty for edit unless changing
      password_confirmation: "",
      role_id: userRoleId
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentUser) {
        // Edit
        const dataToSend = {
          name: formData.name,
          email: formData.email,
          role_id: formData.role_id
        };
        // Only verify passwords if provided
        if (formData.password) {
          if (formData.password !== formData.password_confirmation) {
            alert("Las contraseñas no coinciden");
            setSaving(false);
            return;
          }
          dataToSend.password = formData.password;
          dataToSend.password_confirmation = formData.password_confirmation;
        }

        await updateUser(currentUser.id, dataToSend);
      } else {
        // Create
        if (formData.password !== formData.password_confirmation) {
          alert("Las contraseñas no coinciden");
          setSaving(false);
          return;
        }
        await createUser(formData);
      }
      setIsModalOpen(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Error al guardar usuario: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const clickDelete = (user) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await deleteUser(currentUser.id);
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error al eliminar usuario");
    } finally {
      setSaving(false);
    }
  };

  // Filtro simple
  const filteredData = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans text-gray-700">

      {/* ESPACIADOR SUPERIOR */}
      <div className="w-full "></div>

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ color: BRAND.darkBlue }}>
            Usuarios Registrados
          </h1>
          <p className="text-gray-500 mt-1">Gestión de acceso y roles de la plataforma</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold shadow-lg shadow-blue-900/10 hover:shadow-xl transition-all active:scale-95"
          style={{ backgroundColor: BRAND.blue }}
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      {/* Barra de Herramientas */}
      <div className="bg-white p-4 rounded-t-2xl shadow-sm border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm"
            style={{ "--tw-ring-color": BRAND.lightBlue }}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-blue-600 transition text-sm font-medium">
          <Filter size={16} /> Filtros Avanzados
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-b-2xl shadow-sm overflow-hidden border border-t-0 border-gray-100">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
            <p className="text-gray-400 text-sm">Cargando usuarios...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 text-red-500">
            <AlertCircle size={32} className="mb-2" />
            <p>{error}</p>
            <button onClick={fetchUsers} className="mt-2 text-blue-600 underline text-sm">Reintentar</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Creado</th>
                    <th className="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.length > 0 ? (
                    filteredData.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/80 transition duration-150 group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{user.name || "Sin Nombre"}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {user.role?.name || user.roles?.[0]?.name || "Sin Rol"}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span className="text-sm text-gray-500">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 transition-all">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 rounded-xl text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                              title="Editar usuario"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => clickDelete(user)}
                              className="p-2 rounded-xl text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                              title="Eliminar usuario"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación simple */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">Mostrando <span className="font-bold text-gray-700">{filteredData.length}</span> usuarios</p>
              <div className="flex gap-1">
                <button className="p-1 rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-50" disabled>
                  <ChevronLeft size={20} />
                </button>
                <button className="p-1 rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-50" disabled>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODAL CREAR/EDITAR */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center" style={{ backgroundColor: BRAND.darkBlue }}>
              <h3 className="text-lg font-bold text-white">
                {currentUser ? "Editar Usuario" : "Nuevo Usuario"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
              </div>

              {/* Rol */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Rol de Usuario</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                  >
                    <option value="">Seleccionar Rol</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passwords (Optional on Edit) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    {currentUser ? "Nueva Contraseña (Opcional)" : "Contraseña"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!currentUser}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      required={!!formData.password}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
                >
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  {currentUser ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* CONFIRM DELETE MODAL */}
      {isDeleteModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar Usuario?</h3>
            <p className="text-sm text-gray-500 mb-6">
              ¿Estás seguro de que deseas eliminar a <strong>{currentUser?.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
              >
                {saving && <Loader2 className="animate-spin" size={16} />}
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}