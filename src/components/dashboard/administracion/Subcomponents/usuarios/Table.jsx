import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  User,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getUsers } from "../../../../../api/auth";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
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
        // Attempt to find an array property or use values
        const possibleArray = Object.values(res.data).find(val => Array.isArray(val));
        if (possibleArray) {
          usersArray = possibleArray;
        } else {
          usersArray = Object.values(res.data);
        }
      }

      // Filter to ensure we only have objects (users)
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
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition shadow-sm font-medium text-sm">
            <Download size={16} /> Exportar
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 text-white rounded-xl shadow-md hover:shadow-lg transition font-bold text-sm"
            style={{ backgroundColor: BRAND.blue }}
          >
            <User size={18} /> Nuevo Usuario
          </button>
        </div>
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
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                              title="Editar usuario"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Eliminar usuario"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                            >
                              <MoreVertical size={18} />
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

            {/* Paginación simple (Visual por ahora, ya que la API no paginaba en el snippet) */}
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
    </div>
  );
}