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
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import { toast } from "react-hot-toast";
import { updateUser as updateUserInfo } from "../../api/users";
import PasswordStrengthMeter from "../../components/auth/PasswordStrengthMeter";
import { changePassword, resendVerification, getCurrentUser } from "../../api/auth";

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
  const [resending, setResending] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

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

  // Fetch latest user data on mount to sync verification status
  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res.data?.user) {
          updateUser(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching latest user data:", error);
      }
    };
    fetchLatestUser();
  }, [updateUser]);

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
    // 1. Validaciones básicas
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Nombre y correo son obligatorios");
      return;
    }

    // Validación de nueva contraseña
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
         toast.error("las nuevas contraseñas no coinciden.");
         return;
      }
      if (formData.newPassword.length < 8) {
         toast.error("La nueva contraseña debe tener al menos 8 caracteres.");
         return;
      }
    }

    // 2. Pedir confirmación (contraseña actual)
    // Si no está escribiendo la contraseña de confirmación Y (está editando datos sensibles OR quiere cambiar pass)
    if (!formData.password) {
      setIsConfirming(true);
      return;
    }

    setLoading(true);
    try {
      let res = null;
      // 3. Actualizar información básica (Nombre/Email)
      // Solo si cambiaron
      if (nameChanged || emailChanged) {
          res = await updateUserInfo(user.id, {
            name: formData.name,
            email: formData.email,
            current_password: formData.password 
          });
      }

      // 4. Actualizar contraseña (si se solicitó)
      if (formData.newPassword) {
          await changePassword({
              current_password: formData.password,
              password: formData.newPassword,
              password_confirmation: formData.confirmNewPassword
          });
      }

      // Si todo sale bien:
      // Actualizar contexto global con los datos devueltos por la API (incluye email_verified_at)
      if (res?.data?.data) {
        // Mapear los datos de la API al formato esperado por el contexto (updateUser mergea)
        const userDataFromApi = res.data.data;
        updateUser({
          ...user,
          name: userDataFromApi.name,
          email: userDataFromApi.email,
          email_verified_at: userDataFromApi.email_verified_at
        });
      }

      toast.success(
        emailChanged 
          ? "Perfil actualizado. Se ha enviado un enlace de verificación a tu nuevo correo. Por seguridad, si los cambios no se reflejan tras verificar, por favor cierra sesión e inicia nuevamente."
          : "Perfil actualizado correctamente.", 
        {
          duration: 6000,
        }
      );

      // Resetear estados
      setIsEditing(false);
      setIsConfirming(false);
      setFormData(prev => ({ 
        ...prev, 
        password: "", 
        newPassword: "", 
        confirmNewPassword: "" 
      }));

    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      const errorMsg = error.response?.data?.message || 
        (error.response?.data?.errors ? Object.values(error.response.data.errors)[0][0] : "Error al actualizar el perfil.");
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await resendVerification();
      toast.success("Correo de verificación enviado. Revisa tu bandeja de entrada.");
    } catch (error) {
      console.error("Error al reenviar verificación:", error);
      toast.error("Error al enviar el correo. Intenta de nuevo más tarde.");
    } finally {
      setResending(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsConfirming(false);
    setShowCurrentPassword(false);
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
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
                            <p className="text-gray-800 font-medium text-base break-all m-0">{userData.email}</p>
                            <div className="flex items-center gap-2">
                              {user?.email_verified_at ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 whitespace-nowrap">
                                  <CheckCircle size={10} />
                                  VERIFICADO
                                </span>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 whitespace-nowrap">
                                    <AlertCircle size={10} />
                                    PENDIENTE
                                  </span>
                                  <button
                                    onClick={handleResendVerification}
                                    disabled={resending}
                                    className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1 disabled:opacity-50 whitespace-nowrap uppercase"
                                  >
                                    <RefreshCw size={10} className={resending ? "animate-spin" : ""} />
                                    REENVIAR
                                  </button>
                                  <p className="text-[9px] text-gray-400 w-full mt-1 italic">
                                    Si ya verificaste y no ves el cambio, intenta cerrar e iniciar sesión.
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
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




                 {/* Tarjeta de Seguridad (Contraseña) */}
                 <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 mt-6 md:col-span-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-200 pb-2">
                    Seguridad
                  </h3>

                  <div className="space-y-4">
                     <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white rounded-lg text-red-500 shadow-sm border border-gray-100">
                        <Lock size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Contraseña</p>
                        {isEditing ? (
                             <div className="mt-2 space-y-3 max-w-md">
                                <p className="text-xs text-gray-400">Dejar en blanco para mantener la actual.</p>
                                
                                 <div className="relative">
                                  <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword || ""}
                                    onChange={handleInputChange}
                                    placeholder="Nueva contraseña"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-10"
                                    autoComplete="new-password"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                  >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                  </button>
                                </div>

                                {formData.newPassword && (
                                   <>
                                      <PasswordStrengthMeter password={formData.newPassword} />
                                      
                                      <div className="relative">
                                        <input
                                          type={showConfirmPassword ? "text" : "password"}
                                          name="confirmNewPassword"
                                          value={formData.confirmNewPassword || ""}
                                          onChange={handleInputChange}
                                          placeholder="Confirmar nueva contraseña"
                                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-10"
                                          autoComplete="new-password"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                      </div>
                                   </>
                                )}
                             </div>
                        ) : (
                          <p className="text-gray-800 font-medium text-base">••••••••</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {isEditing && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
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
                    disabled={!nameChanged && !emailChanged && !formData.newPassword}
                  >
                    <Save size={18} />
                    Guardar Cambios
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Modal Global de Confirmación */}
          {isConfirming && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: BRAND.blue }}></div>
                
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <Lock size={40} />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3">Confirmar Cambios</h3>
                
                <p className="text-gray-500 text-sm mb-6">
                  Por seguridad, ingresa tu contraseña actual para guardar los cambios {(nameChanged || emailChanged) ? "en tu perfil" : "de contraseña"}.
                </p>

                {emailChanged && (
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 mb-6 text-left flex gap-2">
                    <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-orange-800 leading-tight">
                      <strong>Aviso:</strong> Al cambiar tu correo electrónico, tu cuenta volverá a estado <strong>pendiente de verificación</strong> y recibirás un nuevo enlace de activación.
                    </p>
                  </div>
                )}

                <div className="relative mb-6">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Contraseña actual"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Confirmar y Guardar
                  </button>
                  <button
                    onClick={() => {
                        setIsConfirming(false);
                        setShowCurrentPassword(false);
                        setFormData(prev => ({ ...prev, password: "" }));
                    }}
                    className="w-full py-3 bg-white text-gray-500 font-medium rounded-xl hover:text-gray-800 transition-colors"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
