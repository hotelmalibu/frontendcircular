import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getUsers, updateUserStatus } from "../../../../../api/auth";
import {
  CheckCircle,
  XCircle,
  User,
  Shield,
  Search,
  AlertCircle,
  Calendar,
  UserX,
  Unlock
} from "lucide-react";

import FeedbackModal from "../../../../common/FeedbackModal";

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



export default function AprobacionesList() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [error, setError] = useState(null);
  
  // Estado para el modal de confirmación
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    userId: null,
    action: null, // 'suspend'
    userName: ''
  });

  // Estados para el Modal de Feedback
  const [feedback, setFeedback] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: ""
  });

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      // Usamos getUsers en lugar de getApprovals para ver a TODOS los usuarios (incluidos activos)
      const res = await getUsers();
      const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setSolicitudes(items);
      setError(null);
    } catch (err) {
      console.error("Error fetching approvals:", err);
      setError("No se pudieron cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, newStatus) => {
    try {
      const res = await updateUserStatus(userId, newStatus);
      console.log("Status update response:", res.data);
      // Refresh list
      await fetchApprovals();

      let title = "Operación Exitosa";
      let msg = "La operación se completó correctamente.";
      let type = "success";

      if (newStatus === 'active') {
        title = "¡Usuario Aprobado!";
        msg = "El usuario ha sido activado y aprobado con éxito.";
      }
      if (newStatus === 'rejected') {
        title = "Usuario Rechazado";
        msg = "La solicitud de registro ha sido rechazada.";
        type = "error" // Aunque sea éxito de operación, visualmente puede ser rojo o warning. Usaremos error para indicar rechazo/baja.
      }
      if (newStatus === 'suspended') {
        title = "Usuario Suspendido";
        msg = "La cuenta del usuario ha sido suspendida.";
        type = "warning";
      }
      if (newStatus === 'pending') {
          title = "Usuario Pendiente";
          msg = "El usuario ha sido movido a estado pendiente.";
          type = "info";
      }

      setFeedback({
        isOpen: true,
        type: type,
        title: title,
        message: msg
      });

    } catch (err) {
      console.error("Error updating status:", err);
      setFeedback({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Error al procesar la solicitud: " + (err.response?.data?.message || err.message)
      });
    }
  };

  const openSuspendConfirmation = (user) => {
    setConfirmModal({
        isOpen: true,
        userId: user.id,
        action: 'suspend',
        userName: user.name
    });
  };

  const handleConfirmAction = () => {
      if (confirmModal.action === 'suspend' && confirmModal.userId) {
          handleAction(confirmModal.userId, 'suspended');
      }
      setConfirmModal({ isOpen: false, userId: null, action: null, userName: '' });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pendiente":
      case "pending":
        return { bg: "#FFFBEB", text: BRAND.yellow, border: BRAND.yellow, icon: <AlertCircle size={14} /> };
      case "Aprobado":
      case "active":
        return { bg: "#F0FDF4", text: BRAND.darkGreen, border: BRAND.green, icon: <CheckCircle size={14} /> };
      case "Rechazado":
      case "rejected":
        return { bg: "#FEF2F2", text: BRAND.orange, border: BRAND.orange, icon: <XCircle size={14} /> };
      case "suspended":
        return { bg: "#FFF1F2", text: "#BE123C", border: "#BE123C", icon: <UserX size={14} /> };
      default:
        return { bg: "#F3F4F6", text: BRAND.gray, border: "#D1D5DB", icon: null };
    }
  };

  const filteredSolicitudes = solicitudes.filter(s => {
    if (filterStatus === "Todos") return true;
    if (filterStatus === "Pendiente") return s.status === 'pending';
    if (filterStatus === "Aprobado") return s.status === 'active';
    if (filterStatus === "Rechazado") return s.status === 'rejected';
    if (filterStatus === "Suspendido") return s.status === 'suspended';
    return s.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-700">

      {/* ESPACIADOR SUPERIOR */}
      <div className="w-full "></div>

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: BRAND.darkBlue }}>
            <Shield className="text-blue-400" size={32} />
            Centro de Aprobaciones
          </h1>
          <p className="text-gray-500 mt-1 text-lg ml-11">Gestiona solicitudes de registro de nuevos usuarios</p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">

        {/* Tabs de Filtro */}
        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          {["Todos", "Pendiente", "Aprobado", "Rechazado", "Suspendido"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${filterStatus === status
                ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar solicitud..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm"
            style={{ "--tw-ring-color": BRAND.lightBlue }}
          />
        </div>
      </div>

      {/* Lista de Solicitudes */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSolicitudes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">{error || "No hay solicitudes en esta categoría."}</p>
            </div>
          ) : (
            filteredSolicitudes.map((s) => {
              const styles = getStatusStyles(s.status);

              return (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 relative overflow-hidden"
                >
                  {/* Borde lateral de estado */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: styles.text }}
                  ></div>

                  <div className="flex flex-col lg:flex-row gap-6 pl-3">

                    {/* Información Principal */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                            SOLICITUD DE REGISTRO
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar size={12} /> {new Date(s.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
                        Nuevo usuario: {s.name}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-start gap-2">
                          <User size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="break-all"><strong>Email:</strong> {s.email}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Shield size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Rol solicitado:</strong> {s.roles?.[0]?.name || 'Sin rol'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Columna de Acción y Estado */}
                    <div className="flex flex-col justify-between items-end gap-4 min-w-[200px] border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">

                      <div className="flex items-center gap-2 self-start lg:self-end">
                        <span className="text-xs text-gray-500 mr-1">Estado:</span>

                          <div className="flex items-center gap-2 group/edit">
                            <span
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border`}
                              style={{
                                backgroundColor: styles.bg,
                                color: styles.text,
                                borderColor: 'transparent'
                              }}
                            >
                              {styles.icon}
                              {s.status === 'pending' ? 'Pendiente' : (s.status === 'active' ? 'Activado' : (s.status === 'rejected' ? 'Rechazado' : (s.status === 'suspended' ? 'Suspendido' : s.status)))}
                            </span>
                          </div>
                      </div>

                      {s.status === 'pending' && (
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={() => handleAction(s.id, 'active')}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-green-600 hover:border-green-200 transition shadow-sm text-sm font-medium group text-nowrap">
                              <CheckCircle size={16} className="group-hover:text-green-600 text-gray-400 transition-colors" /> Aprobar
                            </button>
                            <button
                              onClick={() => handleAction(s.id, 'rejected')}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition shadow-sm text-sm font-medium group text-nowrap">
                              <XCircle size={16} className="group-hover:text-red-600 text-gray-400 transition-colors" /> Rechazar
                            </button>
                          </div>
                        </div>
                      )}

                      {s.status === 'active' && (
                          <div className="flex flex-col gap-2 w-full">
                              {(s.lockout_until && new Date(s.lockout_until) > new Date()) ? (
                                  <button
                                      onClick={() => handleAction(s.id, 'active')}
                                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 text-orange-700 rounded-lg hover:bg-orange-600 hover:text-white transition shadow-sm text-sm font-bold group">
                                      <Unlock size={16} /> Desbloquear
                                  </button>
                              ) : (
                                  <button
                                      onClick={() => openSuspendConfirmation(s)}
                                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 border border-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm text-sm font-bold group">
                                      <UserX size={16} /> Suspender
                                  </button>
                              )}
                          </div>
                      )}

                      {s.status === 'rejected' && (
                          <div className="flex flex-col gap-2 w-full">
                              <button
                                  onClick={() => handleAction(s.id, 'pending')}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-600 hover:text-white transition shadow-sm text-sm font-bold group">
                                  <AlertCircle size={16} /> Mover a Pendiente
                              </button>
                          </div>
                      )}

                      {s.status === 'suspended' && (
                        <div className="flex flex-col gap-2 w-full">
                          <button
                            onClick={() => handleAction(s.id, 'active')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 border border-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition shadow-sm text-sm font-bold group">
                            <CheckCircle size={16} /> Activar Cuenta
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      <FeedbackModal
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        autoClose={3000}
      />

        {/* Modal de Confirmación de Suspensión */}
        {confirmModal.isOpen && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                            <UserX size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            ¿Suspender Usuario?
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Estás a punto de suspender la cuenta de <strong>{confirmModal.userName}</strong>.
                            El usuario perderá el acceso al sistema hasta que sea reactivado.
                        </p>
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
                            >
                                Sí, Suspender
                            </button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )}
    </div>
  );
}