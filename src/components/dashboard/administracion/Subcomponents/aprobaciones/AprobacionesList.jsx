import React, { useState, useEffect } from "react";
import { getUsers, updateUserStatus } from "../../../../../api/auth";
import {
  CheckCircle,
  XCircle,
  Info,
  User,
  Shield,
  FileText,
  Search,
  MoreVertical,
  AlertCircle,
  Calendar,
  UserX,
  Edit2
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
  const [editingId, setEditingId] = useState(null);

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

                        {editingId === s.id ? (
                          <div className="flex items-center gap-2 animate-fadeIn">
                            <select
                              value={s.status}
                              onChange={(e) => {
                                handleAction(s.id, e.target.value);
                                setEditingId(null);
                              }}
                              autoFocus
                              onBlur={() => setEditingId(null)}
                              className="text-xs border border-blue-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="active">Activo</option>
                              <option value="suspended">Suspendido</option>
                              <option value="rejected">Rechazado</option>
                            </select>
                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                              <XCircle size={16} />
                            </button>
                          </div>
                        ) : (
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
                            <button
                              onClick={() => setEditingId(s.id)}
                              className="text-blue-500 hover:text-blue-700 transition-all p-1"
                              title="Cambiar estado manualmente"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        )}
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
    </div>
  );
}