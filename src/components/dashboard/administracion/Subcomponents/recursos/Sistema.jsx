import React from "react";
import { 
  Settings, 
  BarChart2, 
  Users, 
  Activity, 
  Server, 
  FileText, 
  LayoutDashboard, 
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  Clock
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

export default function Sistema() {
  const sistemas = [
    {
      id: 1,
      nombre: "Gestión de Usuarios",
      icono: <Users size={24} />,
      version: "2.1.0",
      fecha: "09/09/2025",
      usuariosActivos: 8,
      disponibilidad: 100,
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Dashboard Analítico",
      icono: <LayoutDashboard size={24} />,
      version: "2.1.0",
      fecha: "09/09/2025",
      usuariosActivos: 2348,
      disponibilidad: 98,
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Gestor Documental",
      icono: <FileText size={24} />,
      version: "2.1.0",
      fecha: "09/09/2025",
      usuariosActivos: 1532,
      disponibilidad: 100,
      estado: "Activo",
    },
    {
      id: 4,
      nombre: "Formularios Normativos",
      icono: <ClipboardList size={24} />,
      version: "2.2.0-beta",
      fecha: "09/09/2025",
      usuariosActivos: 0,
      disponibilidad: 0,
      estado: "Mantenimiento",
    },
  ];

  // Helper para estilos según estado
  const getStatusConfig = (estado) => {
    switch (estado) {
      case "Activo":
        return {
          color: BRAND.green,
          darkColor: BRAND.darkGreen,
          bg: "#F0FDF4", // green-50
          badgeIcon: <CheckCircle size={14} />,
          text: "Operativo"
        };
      case "Mantenimiento":
        return {
          color: BRAND.orange,
          darkColor: BRAND.orange,
          bg: "#FFF5EB", // orange-50
          badgeIcon: <AlertTriangle size={14} />,
          text: "Mantenimiento"
        };
      default:
        return {
          color: BRAND.gray,
          darkColor: BRAND.gray,
          bg: "#F3F4F6",
          badgeIcon: <Clock size={14} />,
          text: "Desconocido"
        };
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">
      
      {/* ESPACIADOR SUPERIOR */}
      <div className="w-full"></div>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: BRAND.darkBlue }}>
          <Server className="text-blue-400" size={32} />
          Estado del Sistema
        </h1>
        <p className="text-gray-500 mt-1 text-lg ml-11">Monitoreo de módulos y disponibilidad de servicios</p>
      </div>

      {/* Grid de Sistemas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {sistemas.map((sistema) => {
          const statusStyle = getStatusConfig(sistema.estado);
          
          return (
            <div
              key={sistema.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden group"
            >
              {/* Borde superior de estado */}
              <div 
                className="h-1.5 w-full absolute top-0 left-0" 
                style={{ backgroundColor: statusStyle.darkColor }}
              ></div>

              <div className="p-6 flex-1 flex flex-col">
                
                {/* Header Card */}
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
                    {React.cloneElement(sistema.icono, { color: BRAND.darkBlue })}
                  </div>
                  <span 
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{ backgroundColor: statusStyle.bg, color: statusStyle.darkColor }}
                  >
                    {statusStyle.badgeIcon} {statusStyle.text}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1">{sistema.nombre}</h3>
                <p className="text-xs text-gray-400 mb-6 font-mono">
                  v{sistema.version} • Actualizado: {sistema.fecha}
                </p>

                {/* Métricas */}
                <div className="mt-auto space-y-4">
                  
                  {/* Usuarios */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Usuarios Activos</p>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-xl font-bold" style={{ color: BRAND.darkBlue }}>
                          {sistema.usuariosActivos.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Disponibilidad Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">Disponibilidad</span>
                      <span className="font-bold" style={{ color: statusStyle.darkColor }}>
                        {sistema.disponibilidad}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${sistema.disponibilidad}%`, 
                          backgroundColor: statusStyle.color 
                        }}
                      ></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex gap-3">
                <button 
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-white transition hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: BRAND.blue }}
                >
                  <Settings size={16} /> Configurar
                </button>
                <button 
                  className="flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-200 transition shadow-sm"
                  title="Ver Estadísticas"
                >
                  <BarChart2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}