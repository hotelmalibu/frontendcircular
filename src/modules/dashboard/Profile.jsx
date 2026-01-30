import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import {
  User,
  Mail,
  Shield,
  Calendar,
  MapPin,
  Edit2,
  Save,
  X,
  Lock,
  Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { updateUser as updateUserInfo } from "../../api/users";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  gray: "#6B7280",
};

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: ""
  });

  // Sync form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const nameChanged = formData.name !== (user?.name || "");
  const emailChanged = formData.email !== (user?.email || "");

  // Fallback seguro por si el contexto aún no carga
  const userData = user || {
    name: "Usuario Cargando...",
    email: "cargando@ejemplo.com",
    role: "Invitado"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Nombre y correo son obligatorios");
      return;
    }

    if (!formData.password) {
      setIsConfirming(true);
      return;
    }

    setLoading(true);
    try {
      // Llamada a la API para actualizar
      // Nota: El backend debe validar la contraseña enviada en el body
      const response = await updateUserInfo(user.id, {
        name: formData.name,
        email: formData.email,
        current_password: formData.password // Enviamos la contraseña para validación
      });

      if (response.data) {
        // Actualizar contexto global
        updateUser(response.data);
        toast.success("Perfil actualizado. Para ver todos los cambios reflejados, por favor cierra sesión e inicia de nuevo.", {
          duration: 6000,
        });
        setIsEditing(false);
        setIsConfirming(false);
        setFormData(prev => ({ ...prev, password: "" }));
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      const errorMsg = error.response?.data?.message || "Error al actualizar el perfil. Verifica tu contraseña.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsConfirming(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: ""
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-700">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto">


          {/* Tarjeta Principal de Perfil */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

            {/* Banner Decorativo */}
            <div
              className="h-40 w-full relative"
              style={{ background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)` }}
            >
              {/* Patrón decorativo opcional o imagen de fondo */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            {/* Contenido del Perfil */}
            <div className="px-8 pb-8 relative">

              {/* Sección Avatar y Nombre (Flotante sobre el banner) */}
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between -mt-16 mb-8 gap-4">

                <div className="flex items-end gap-6">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400 shadow-md overflow-hidden">
                      {/* Si hubiera imagen: <img src={user.avatar} ... /> */}
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Nombre y Rol */}
                  <div className="mb-0">
                    <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-sm font-medium px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        <Shield size={12} />
                        {userData.role || "Sin rol asignado"}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={12} /> Colombia
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón de Editar */}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow-md"
                  >
                    <Edit2 size={18} />
                    Editar Perfil
                  </button>
                )}

              </div>

              {/* Grid de Información Detallada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tarjeta de Información Básica */}
                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                      Detalles de Contacto
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white rounded-lg text-blue-600 shadow-sm border border-gray-100">
                        <User size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Nombre Completo</p>
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              disabled={emailChanged}
                              className={`w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${emailChanged ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                              placeholder="Tu nombre completo"
                            />
                            {emailChanged && (
                              <p className="text-[10px] text-orange-600 mt-1 italic">
                                Para cambiar el nombre, descarta los cambios en el correo.
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-800 font-medium text-base">{userData.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white rounded-lg text-blue-600 shadow-sm border border-gray-100">
                        <Mail size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Correo Electrónico</p>
                        {isEditing ? (
                          <>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={nameChanged}
                              className={`w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${nameChanged ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                              placeholder="correo@ejemplo.com"
                            />
                            {nameChanged && (
                              <p className="text-[10px] text-orange-600 mt-1 italic">
                                Para cambiar el correo, descarta los cambios en el nombre.
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-800 font-medium text-base">{userData.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tarjeta de Información de Cuenta */}
                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-200 pb-2">
                    Información de Cuenta
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white rounded-lg text-green-600 shadow-sm border border-gray-100">
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Rol del Sistema</p>
                        <p className="text-gray-800 font-medium text-base capitalize">
                          {userData.role || "Usuario Estandar"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white rounded-lg text-orange-500 shadow-sm border border-gray-100">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Miembro Desde</p>
                        <p className="text-gray-800 font-medium text-base">Septiembre 2025</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sección de Confirmación / Botones de Guardar */}
              {isEditing && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  {isConfirming ? (
                    <div className="max-w-md mx-auto bg-blue-50 p-6 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-3 mb-4 text-blue-800">
                        <Lock size={20} />
                        <h4 className="font-bold">Confirmar Cambios</h4>
                      </div>
                      <p className="text-sm text-blue-700 mb-4">
                        Por seguridad, ingresa tu contraseña actual para guardar los cambios en tu nombre o correo.
                      </p>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Contraseña actual"
                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        autoFocus
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleUpdate}
                          disabled={loading}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                          Confirmar y Guardar
                        </button>
                        <button
                          onClick={() => setIsConfirming(false)}
                          className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                          Regresar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 px-6 py-2.5 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                      >
                        <X size={18} />
                        Cancelar
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        disabled={!nameChanged && !emailChanged}
                      >
                        <Save size={18} />
                        Guardar Cambios
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div >
      </main >
    </div >
  );
}
