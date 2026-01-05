import React, { useEffect, useState } from "react";
import { getRoles, createRole, updateRole, deleteRole, getPermissions, getUsers } from "../../../../../api/auth";
import {
  Trash2,
  Edit,
  Plus,
  X,
  Shield,
  Users,
  AlertCircle,
  CheckSquare,
  Square
} from "lucide-react";

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

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    permissions: [] // Array of permission IDs
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes, usersRes] = await Promise.all([
        getRoles(),
        getPermissions().catch(e => ({ data: [] })),
        getUsers().catch(e => ({ data: [] }))
      ]);

      // --- PARSE ROLES ---
      let rolesArray = [];
      if (Array.isArray(rolesRes.data)) {
        rolesArray = rolesRes.data;
      } else if (rolesRes.data?.data && Array.isArray(rolesRes.data.data)) {
        rolesArray = rolesRes.data.data;
      } else if (rolesRes.data?.data?.items && Array.isArray(rolesRes.data.data.items)) {
        rolesArray = rolesRes.data.data.items;
      } else if (rolesRes.data && typeof rolesRes.data === 'object') {
        const possibleArray = Object.values(rolesRes.data).find(val => Array.isArray(val));
        rolesArray = possibleArray || Object.values(rolesRes.data);
      }
      rolesArray = rolesArray.filter(item => typeof item === 'object');

      // --- PARSE USERS FOR COUNT ---
      let usersArray = [];
      if (Array.isArray(usersRes.data)) {
        usersArray = usersRes.data;
      } else if (usersRes.data?.data && Array.isArray(usersRes.data.data)) {
        usersArray = usersRes.data.data;
      }

      // Merge counts into roles
      rolesArray = rolesArray.map(role => {
        // Find users that have this role. Assuming user has 'roles' array or 'role_id'
        const count = usersArray.filter(u => {
          // Check if user has 'roles' array containing this role ID
          if (u.roles && Array.isArray(u.roles)) {
            return u.roles.some(r => r.id === role.id);
          }
          // Check if user has 'role_id' property
          if (u.role_id === role.id) return true;

          return false;
        }).length;

        return { ...role, users_count: count };
      });

      setRoles(rolesArray);

      // --- PARSE PERMISSIONS ---
      let permsArray = [];
      if (Array.isArray(permissionsRes.data)) {
        permsArray = permissionsRes.data;
      } else if (permissionsRes.data?.data && Array.isArray(permissionsRes.data.data)) {
        permsArray = permissionsRes.data.data;
      } else if (permissionsRes.data?.data?.items && Array.isArray(permissionsRes.data.data.items)) {
        permsArray = permissionsRes.data.data.items;
      }
      setPermissions(permsArray);

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (role = null) => {
    if (role) {
      setCurrentRole(role);
      // Map existing permissions if the API returns them nested in the role
      const rolePerms = role.permissions ? role.permissions.map(p => p.id) : [];
      setFormData({
        name: role.name,
        description: role.description || "",
        slug: role.slug || "",
        permissions: rolePerms
      });
    } else {
      setCurrentRole(null);
      setFormData({ name: "", description: "", slug: "", permissions: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRole(null);
    setFormData({ name: "", description: "", slug: "", permissions: [] });
  };

  const togglePermission = (permId) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(permId);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter(id => id !== permId) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRole) {
        await updateRole(currentRole.id, formData);
      } else {
        await createRole(formData);
      }
      fetchData(); // Reload all
      closeModal();
    } catch (err) {
      console.error("Error saving role:", err);
      alert("Error al guardar el rol. Verifica los datos.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este rol?")) return;
    try {
      await deleteRole(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting role:", err);
      alert("No se pudo eliminar el rol.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 mb-4" style={{ borderColor: BRAND.blue }}></div>
        <p className="text-gray-500 font-medium">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
        <AlertCircle size={48} style={{ color: BRAND.orange }} className="mb-4" />
        <p className="text-gray-800 font-semibold text-lg">{error}</p>
        <button onClick={fetchData} className="mt-4 text-blue-600 hover:underline">Intentar de nuevo</button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">

      {/* ESPACIADOR SUPERIOR */}
      <div className="w-full "></div>

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: BRAND.darkBlue }}>
            <Shield className="text-blue-400" size={32} />
            Gestión de Roles
          </h1>
          <p className="text-gray-500 mt-1 text-lg ml-11">Define permisos y niveles de acceso</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {/* Tarjeta de Crear Nuevo Rol */}
        <button
          onClick={() => openModal()}
          className="group flex flex-col items-center justify-center h-full min-h-[220px] bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="p-4 rounded-full bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Plus size={32} />
          </div>
          <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors">Crear Nuevo Rol</span>
          <span className="text-sm text-gray-400 mt-1">Añadir permisos personalizados</span>
        </button>

        {/* Lista de Roles */}
        {roles.map((rol) => (
          <div
            key={rol.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden group"
          >
            {/* Borde Superior */}
            <div className="h-1.5 w-full absolute top-0 left-0" style={{ backgroundColor: BRAND.blue }}></div>

            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-700">
                  <Shield size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(rol)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(rol.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{rol.name}</h3>

              <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10 leading-relaxed">
                {rol.description || "Sin descripción definida para este rol."}
              </p>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  <Users size={12} />
                  <span>{rol.users_count || (rol.users ? rol.users.length : 0)} Usuarios</span>
                </div>
                {rol.level && (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                    Nivel {rol.level}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#005380] bg-opacity-60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 animate-fadeIn transform transition-all scale-100 flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {currentRole ? "Editar Rol" : "Nuevo Rol"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Define los detalles y permisos</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <div className="overflow-y-auto p-6 flex-1">
              <form id="roleForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                    Nombre del Rol <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm font-medium text-gray-700"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                    placeholder="Ej: Administrador, Editor..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                    Descripción
                  </label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm text-gray-700 resize-none"
                    style={{ "--tw-ring-color": BRAND.lightBlue }}
                    placeholder="Descripción del rol..."
                  />
                </div>

                {/* PERMISOS SECTION */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">
                    Permisos del Sistema
                  </label>

                  {permissions.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center text-sm text-gray-500">
                      No hay permisos definidos en el sistema.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                      {permissions.map(perm => (
                        <div
                          key={perm.id}
                          onClick={() => togglePermission(perm.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.permissions.includes(perm.id)
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-100 hover:bg-gray-50"
                            }`}
                        >
                          <div className={`mt-0.5 ${formData.permissions.includes(perm.id) ? "text-blue-600" : "text-gray-300"}`}>
                            {formData.permissions.includes(perm.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${formData.permissions.includes(perm.id) ? "text-blue-800" : "text-gray-700"}`}>
                              {perm.name}
                            </p>
                            {perm.description && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{perm.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="roleForm"
                  className="flex-1 px-4 py-2.5 text-white rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition font-bold text-sm"
                  style={{ backgroundColor: BRAND.blue }}
                >
                  {currentRole ? "Guardar Cambios" : "Crear Rol"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}