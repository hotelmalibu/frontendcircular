import React, { useEffect, useState } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "../../../../../api/auth";
import { Trash2, Edit, Plus, X, Shield, Users } from "lucide-react";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "", // Some APIs might not use this, but good to have
    slug: "", // Optional depending on backend logic
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await getRoles();
      console.log("Roles API Response:", res.data); // Debug for user

      let rolesArray = [];

      // Attempt to find the array in common API patterns
      if (Array.isArray(res.data)) {
        rolesArray = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        rolesArray = res.data.data;
      } else if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        // Handle paginated responses where data might be nested deeper
        rolesArray = res.data.data.data;
      } else if (res.data && typeof res.data === 'object') {
        // Fallback: if it's an object but not the expected structure, try to find any array property or convert object values?
        // For now, let's just log warning and default to empty if we can't find an array.
        console.warn("Could not identify roles array in response:", res.data);
      }

      setRoles(rolesArray);
      setError(null);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError("No se pudieron cargar los roles.");
      setRoles([]); // Ensure it's always an array even on error
    } finally {
      setLoading(false);
    }
  };

  const openModal = (role = null) => {
    if (role) {
      setCurrentRole(role);
      setFormData({ name: role.name, description: role.description || "", slug: role.slug || "" });
    } else {
      setCurrentRole(null);
      setFormData({ name: "", description: "", slug: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRole(null);
    setFormData({ name: "", description: "", slug: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRole) {
        await updateRole(currentRole.id, formData);
      } else {
        await createRole(formData);
      }
      fetchRoles();
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
      fetchRoles();
    } catch (err) {
      console.error("Error deleting role:", err);
      alert("No se pudo eliminar el rol.");
    }
  };

  if (loading) return <div className="p-4 text-center">Cargando roles...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 rounded-lg min-h-[500px]">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {roles.map((rol) => (
          <div
            key={rol.id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{rol.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Shield size={12} /> {rol.level || "N/A"}
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm min-h-[40px]">
                {rol.description || "Sin descripción"}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Users size={16} /> <span>{rol.users_count || 0} usuarios</span>
              </div>
            </div>

            <div className="flex justify-between border-t pt-4 mt-2">
              <button
                onClick={() => openModal(rol)}
                className="flex items-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded text-sm transition-colors"
              >
                <Edit size={16} /> Editar
              </button>
              <button
                onClick={() => handleDelete(rol.id)}
                className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded text-sm transition-colors"
              >
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          </div>
        ))}

        {/* Create Role Card/Button */}
        <div className="flex flex-col justify-center items-center space-y-4">
          <button
            onClick={() => openModal()}
            className="group bg-white shadow-md border-2 border-dashed border-gray-300 px-6 py-8 rounded-xl w-full text-gray-600 hover:border-[#004b72] hover:text-[#004b72] transition-all flex flex-col items-center justify-center h-full"
          >
            <div className="bg-gray-100 p-3 rounded-full group-hover:bg-blue-50 transition-colors mb-2">
              <Plus size={32} />
            </div>
            <span className="font-semibold text-lg">Crear Nuevo Rol</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {currentRole ? "Editar Rol" : "Crear Nuevo Rol"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004b72]"
                  placeholder="Ej: Editor, Supervisor"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Descripción
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004b72]"
                  placeholder="Breve descripción de las responsabilidades..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004b72] text-white rounded-lg hover:bg-[#003855] transition-colors shadow-md"
                >
                  {currentRole ? "Guardar Cambios" : "Crear Rol"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
