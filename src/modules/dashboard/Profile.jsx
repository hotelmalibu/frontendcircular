import { useContext, useState, useEffect, useRef } from "react";
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
  RefreshCw,
  Camera,
  Trash2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { updateUser as updateUserInfo, uploadUserAvatar, deleteUserAvatar } from "../../api/users";
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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

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

  // Foto de perfil actual (prioriza user.avatar o almacenamiento persistente)
  const userAvatar = user?.avatar || (user?.id ? localStorage.getItem(`user_avatar_${user.id}`) : null);

  // Compresor de imagen en el cliente para subidas rápidas y seguras
  const compressImage = (file, maxWidth = 600, maxHeight = 600, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              maxHeight = height;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 10MB.");
      return;
    }

    setUploadingAvatar(true);
    const loadingToast = toast.loading("Actualizando foto de perfil...");

    try {
      // 1. Comprimir en el navegador
      const compressedDataUrl = await compressImage(file, 600, 600, 0.85);

      // 2. Preparar FormData para la API
      const avatarFormData = new FormData();
      avatarFormData.append("avatar", file);

      let savedAvatarUrl = compressedDataUrl;

      // 3. Subir a la API
      try {
        const res = await uploadUserAvatar(user.id, avatarFormData);
        if (res.data?.avatar) {
          savedAvatarUrl = res.data.avatar;
        }
      } catch (apiErr) {
        console.warn("API upload avatar error, usando persistencia local:", apiErr);
        try {
          await updateUserInfo(user.id, { avatar: compressedDataUrl });
        } catch (_) {}
      }

      // 4. Actualizar estado y almacenamiento
      if (user?.id) {
        localStorage.setItem(`user_avatar_${user.id}`, savedAvatarUrl);
      }
      updateUser({
        ...user,
        avatar: savedAvatarUrl
      });

      toast.success("Foto de perfil actualizada exitosamente", { id: loadingToast });
    } catch (err) {
      console.error("Error al procesar la foto:", err);
      toast.error("No se pudo actualizar la foto de perfil", { id: loadingToast });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async (e) => {
    e.stopPropagation();
    if (!userAvatar) return;

    setUploadingAvatar(true);
    const loadingToast = toast.loading("Eliminando foto de perfil...");

    try {
      try {
        await deleteUserAvatar(user.id);
      } catch (apiErr) {
        console.warn("API delete avatar error:", apiErr);
      }

      if (user?.id) {
        localStorage.removeItem(`user_avatar_${user.id}`);
      }
      updateUser({
        ...user,
        avatar: null
      });

      toast.success("Foto de perfil eliminada", { id: loadingToast });
    } catch (err) {
      console.error("Error al eliminar foto:", err);
      toast.error("No se pudo eliminar la foto de perfil", { id: loadingToast });
    } finally {
      setUploadingAvatar(false);
    }
  };

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

      <main className="flex-1 p-4 sm:p-8">
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
                  {/* Avatar con selector de foto interactivo */}
                  <div className="relative group">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-[#005380] to-[#2C67B0] flex items-center justify-center text-4xl font-bold text-white shadow-lg overflow-hidden cursor-pointer relative transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]"
                      style={{ backgroundColor: BRAND.blue }}
                      title="Haz clic para cambiar tu foto de perfil"
                    >
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userData.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>{userData.name.charAt(0).toUpperCase()}</span>
                      )}

                      {/* Overlay en hover */}
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center text-white text-xs font-semibold gap-1 p-2 text-center">
                        {uploadingAvatar ? (
                          <Loader2 className="animate-spin text-white" size={24} />
                        ) : (
                          <>
                            <Camera size={22} className="text-white drop-shadow" />
                            <span className="text-[11px] leading-tight font-medium">Cambiar foto</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Botón flotante de cámara */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute bottom-0 right-0 p-2.5 rounded-full bg-white text-gray-700 shadow-md border border-gray-200 hover:text-[#2C67B0] hover:border-[#2C67B0]/30 hover:scale-110 active:scale-95 transition-all"
                      title="Cambiar foto de perfil"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="animate-spin text-[#2C67B0]" size={16} />
                      ) : (
                        <Camera size={16} />
                      )}
                    </button>

                    {/* Botón flotante para eliminar foto si ya tiene una */}
                    {userAvatar && !uploadingAvatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute top-0 right-0 p-1.5 rounded-full bg-white text-red-500 shadow-md border border-gray-200 hover:bg-red-50 hover:text-red-700 hover:scale-110 active:scale-95 transition-all"
                        title="Eliminar foto de perfil"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}

                    {/* Input de archivo oculto */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarSelect}
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                    />
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
