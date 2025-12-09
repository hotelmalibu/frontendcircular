import React, { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  Clock, 
  User, 
  Shield, 
  FileText,
  Filter,
  Search,
  MoreVertical,
  AlertCircle
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

export default function AprobacionesList() {
  const [filterStatus, setFilterStatus] = useState("Todos");

  const solicitudes = [
    {
      id: 1,
      titulo: "Acceso a módulo: formularios_normativos",
      tipo: "Acceso Módulo",
      usuario: "coordinador@org.org",
      modulo: "formularios_normativos",
      nivel: "de acceso",
      estado: "En Revisión",
      fecha: "17/09/2025",
      asignado: "Laura Sánchez",
    },
    {
      id: 2,
      titulo: "Cambio de permisos: empresa.regional@ejemplo.com",
      tipo: "Gestión Permisos",
      usuario: "empresa.regional@ejemplo.com",
      permisos_actuales: ["productos:ver"],
      permisos_solicitados: ["productos:ver", "reportes:generar"],
      justificacion: "Reasignación de funciones gerenciales",
      estado: "Pendiente",
      fecha: "07/09/2025",
      asignado: "Carlos Ruiz",
    },
    {
      id: 3,
      titulo: "Solicitud de registro: david.lopez@greencircle.org",
      tipo: "Nuevo Usuario",
      organizacion: "Green Circle Foundation",
      rol: "Ciudadanía",
      estado: "Pendiente",
      fecha: "03/09/2025",
      asignado: "Laura Sánchez",
    },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "En Revisión":
        return { bg: "#EFF6FF", text: BRAND.blue, border: BRAND.blue, icon: <Clock size={14}/> };
      case "Pendiente":
        return { bg: "#FFFBEB", text: BRAND.yellow, border: BRAND.yellow, icon: <AlertCircle size={14}/> };
      case "Aprobado":
        return { bg: "#F0FDF4", text: BRAND.darkGreen, border: BRAND.green, icon: <CheckCircle size={14}/> };
      case "Rechazado":
        return { bg: "#FEF2F2", text: BRAND.orange, border: BRAND.orange, icon: <XCircle size={14}/> };
      default:
        return { bg: "#F3F4F6", text: BRAND.gray, border: "#D1D5DB", icon: null };
    }
  };

  const filteredSolicitudes = filterStatus === "Todos" 
    ? solicitudes 
    : solicitudes.filter(s => s.estado === filterStatus);

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
          <p className="text-gray-500 mt-1 text-lg ml-11">Gestiona solicitudes de acceso y permisos</p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
        
        {/* Tabs de Filtro */}
        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          {["Todos", "Pendiente", "En Revisión", "Aprobado"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                filterStatus === status
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
      <div className="space-y-4">
        {filteredSolicitudes.length === 0 ? (
           <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">No hay solicitudes en esta categoría.</p>
           </div>
        ) : (
          filteredSolicitudes.map((s) => {
            const styles = getStatusStyles(s.estado);
            
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
                          {s.tipo}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12}/> {s.fecha}
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 lg:hidden">
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
                      {s.titulo}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      {s.usuario && (
                        <div className="flex items-start gap-2">
                          <User size={16} className="text-gray-400 mt-0.5 flex-shrink-0"/>
                          <span className="break-all"><strong>Usuario:</strong> {s.usuario}</span>
                        </div>
                      )}
                      {s.organizacion && (
                        <div className="flex items-start gap-2">
                          <Shield size={16} className="text-gray-400 mt-0.5 flex-shrink-0"/>
                          <span><strong>Organización:</strong> {s.organizacion}</span>
                        </div>
                      )}
                      {s.modulo && (
                        <div className="flex items-start gap-2">
                          <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0"/>
                          <span><strong>Módulo:</strong> {s.modulo}</span>
                        </div>
                      )}
                      {s.justificacion && (
                        <div className="md:col-span-2 flex items-start gap-2 border-t border-gray-200 pt-2 mt-1">
                          <Info size={16} className="text-gray-400 mt-0.5 flex-shrink-0"/>
                          <span className="italic">"{s.justificacion}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna de Acción y Estado */}
                  <div className="flex flex-col justify-between items-end gap-4 min-w-[200px] border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                    
                    <div className="flex items-center gap-2 self-start lg:self-end">
                      <span className="text-xs text-gray-500 mr-1">Estado:</span>
                      <span 
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                        style={{ 
                          backgroundColor: styles.bg, 
                          color: styles.text,
                          borderColor: 'transparent'
                        }}
                      >
                        {styles.icon}
                        {s.estado}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex gap-2 w-full">
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-green-600 hover:border-green-200 transition shadow-sm text-sm font-medium group">
                          <CheckCircle size={16} className="group-hover:text-green-600 text-gray-400 transition-colors"/> Aprobar
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition shadow-sm text-sm font-medium group">
                          <XCircle size={16} className="group-hover:text-red-600 text-gray-400 transition-colors"/> Rechazar
                        </button>
                      </div>
                      <button className="w-full py-1.5 text-xs font-medium text-gray-400 hover:text-blue-600 transition flex items-center justify-center gap-1">
                        Ver historial completo
                      </button>
                    </div>

                    <div className="text-xs text-gray-400 self-start lg:self-end mt-auto">
                      Asignado a: <span className="font-medium text-gray-600">{s.asignado}</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}