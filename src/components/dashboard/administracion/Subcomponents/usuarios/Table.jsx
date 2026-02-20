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
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "../../../../../api/users";
import { getRoles, getPermissions } from "../../../../../api/auth";
import { toast } from "react-hot-toast";
import ConfirmModal from "../../../../common/ConfirmModal";

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
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // For Edit/Delete
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    permissions: [] // Array of permission IDs
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPermissions();
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
      const res = await getRoles();
      console.log("Roles API Response:", res.data);
      
      let rolesArray = [];
      // Case 1: Direct array
      if (Array.isArray(res.data)) {
        rolesArray = res.data;
      } 
      // Case 2: Wrappers like { data: [...] } or { data: { items: [...] } }
      else if (res.data?.data) {
         if (Array.isArray(res.data.data)) {
            rolesArray = res.data.data;
         } else if (res.data.data?.items && Array.isArray(res.data.data.items)) {
            rolesArray = res.data.data.items;
         }
      } 
      // Case 3: Object with numeric keys (rare but possible in some PHP setups)
      else if (res.data && typeof res.data === 'object') {
        const possibleArray = Object.values(res.data).find(val => Array.isArray(val));
        if (possibleArray) {
           rolesArray = possibleArray;
        } else {
           // Fallback: try to treat the object itself as a collection if it looks like one, 
           // but normally we expect an array.
           // For safety, let's see if Object.values gives us what we want if it's not empty
           const values = Object.values(res.data);
           if (values.length > 0 && values.every(v => typeof v === 'object' && v.id)) {
              rolesArray = values;
           }
        }
      }

      setRoles(rolesArray);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await getPermissions();
      const allPerms = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      // Sort alphabetically for better UX
      setPermissions([...allPerms].sort((a,b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  const togglePermission = (permId) => {
    setFormData(prev => {
      const isSelected = prev.permissions.includes(permId);
      if (isSelected) {
        return { ...prev, permissions: prev.permissions.filter(id => id !== permId) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permId] };
      }
    });
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
      role_id: roles.length > 0 ? roles[roles.length - 1].id : "",
      permissions: []
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
      role_id: userRoleId,
      permissions: user.permissions_ids 
        ? user.permissions_ids.map(id => Number(id)) 
        : (user.user_permissions ? user.user_permissions.map(p => Number(p.id)) : 
          (user.userPermissions ? user.userPermissions.map(p => Number(p.id)) : []))
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
          role_id: formData.role_id,
          permissions: formData.permissions
        };
        // Only verify passwords if provided
        if (formData.password) {
          if (formData.password !== formData.password_confirmation) {
            toast.error("Las contraseñas no coinciden");
            setSaving(false);
            return;
          }
          dataToSend.password = formData.password;
          dataToSend.password_confirmation = formData.password_confirmation;
        }

        await updateUser(currentUser.id, dataToSend);
        toast.success("Usuario actualizado correctamente");
      } else {
        // Create
        if (formData.password !== formData.password_confirmation) {
          toast.error("Las contraseñas no coinciden");
          setSaving(false);
          return;
        }
        await createUser(formData);
        toast.success("Usuario creado correctamente");
      }
      setIsModalOpen(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error("Error al guardar usuario: " + (err.response?.data?.message || err.message));
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
      toast.success("Usuario eliminado correctamente");
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Error al eliminar usuario");
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden animate-fadeIn mx-2 sm:mx-4">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0" style={{ backgroundColor: BRAND.darkBlue }}>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                {currentUser ? "Editar Usuario" : "Nuevo Usuario"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* COLUMNA IZQUIERDA: INFORMACIÓN BÁSICA */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Información de Cuenta</h4>
                  
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

                  {/* Passwords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">
                        {currentUser ? "Nueva Clave" : "Contraseña"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required={!currentUser}
                          className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 transition"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">
                        Confirmar
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                          type={showPassword ? "text" : "password"}
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
                </div>

                {(() => {
                  const selectedRole = roles.find(r => String(r.id) === String(formData.role_id));
                  // Check inclusive for 'afiliados' (plural) and 'afiliado' (singular)
                  const isAfiliadoRole = selectedRole?.slug === 'afiliados' || 
                                         selectedRole?.slug === 'afiliado' || 
                                         selectedRole?.name?.toLowerCase().includes('afiliado');
                  
                  if (isAfiliadoRole) {
                    return (
                       <div className="flex flex-col h-full bg-blue-50/30 rounded-2xl border border-blue-100 p-8 items-center justify-center text-center">
                          <Shield size={48} className="text-blue-200 mb-4" />
                          <h4 className="text-blue-800 font-bold mb-2">Rol de Afiliado</h4>
                          <p className="text-sm text-blue-600 max-w-xs">
                            Los usuarios con rol de <strong>Afiliado</strong> tienen un conjunto de permisos predefinidos y no requieren configuración adicional de accesos directos.
                          </p>
                       </div>
                    );
                  }

                  return (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Permisos Directos</h4>
                        {formData.role_id && (
                          <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                            {selectedRole?.name}
                          </span>
                        )}
                      </div>
                      
                      {currentUser ? (
                        <div className="flex-1 min-h-[300px] lg:min-h-0 bg-gray-50/50 rounded-2xl border border-gray-100 p-4 overflow-y-auto custom-scrollbar">
                          <div className="grid grid-cols-1 gap-2">
                            {permissions.map((perm) => {
                              const isInherited = selectedRole?.permissions?.some(p => p.id === perm.id || p.slug === perm.slug);
                              const isDirect = formData.permissions.includes(perm.id);

                              return (
                                <label 
                                  key={perm.id} 
                                  className={`flex items-center gap-3 p-3 rounded-xl transition-all border cursor-pointer group shadow-sm ${
                                    isInherited 
                                      ? "bg-blue-50/30 border-blue-100 opacity-80 cursor-default" 
                                      : isDirect
                                        ? "bg-white border-blue-200 ring-1 ring-blue-50" 
                                        : "bg-white border-transparent hover:border-gray-200"
                                  }`}
                                >
                                  <div className="flex-shrink-0">
                                    <input
                                      type="checkbox"
                                      checked={isInherited || isDirect}
                                      disabled={isInherited}
                                      onChange={() => togglePermission(perm.id)}
                                      className={`w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 transition-all ${isInherited ? 'cursor-default' : 'cursor-pointer'}`}
                                    />
                                  </div>
                                  <div className="flex flex-col overflow-hidden">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-sm font-bold truncate ${isInherited ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'}`}>
                                        {perm.name}
                                      </span>
                                      {isInherited && (
                                        <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md font-black uppercase">Del Rol</span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-mono uppercase">
                                      {perm.slug}
                                    </span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                          <Shield size={40} className="text-gray-300 mb-3" />
                          <p className="text-sm text-gray-500 font-medium">
                            Crea el usuario primero para asignarle permisos individuales.
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100/50">
                        <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                          <strong>Herencia:</strong> Los permisos marcados como <span className="font-black">"DEL ROL"</span> ya están asignados por el perfil elegido. Los adicionales son <span className="font-black">directos</span> al usuario.
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </form>

            {/* Sticky/Fixed Footer for Action Buttons */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSave(e)}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl flex items-center gap-2 disabled:opacity-70 active:scale-95 transition-all"
                style={{ backgroundColor: BRAND.blue }}
              >
                {saving && <Loader2 className="animate-spin" size={18} />}
                {currentUser ? "Guardar Cambios" : "Crear Usuario"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="¿Eliminar Usuario?"
        message={`¿Estás seguro de que deseas eliminar a "${currentUser?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={saving}
      />

    </div>
  );
}