import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Aprobaciones from "../../components/dashboard/administracion/Aprobaciones";
import Usuarios from "../../components/dashboard/administracion/Usuarios";
import RolesPermisos from "../../components/dashboard/administracion/RolesPermisos";
import SecurityLogs from "../../components/dashboard/administracion/Subcomponents/security/SecurityLogs";
import {
  Settings,
  Users,
  ShieldCheck,
  FileCheck,
  ShieldAlert,
  UserX
} from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal
  gray: "#6B7280",
};

export default function Administracion() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Aprobaciones");

  const tabs = [
    { name: "Aprobaciones", label: "Aprobaciones", icon: <FileCheck size={18} />, component: <Aprobaciones /> },
    { name: "Usuarios", label: "Gestión de Usuarios", icon: <Users size={18} />, component: <Usuarios /> },
    { name: "Roles y Permisos", label: "Roles y Permisos", icon: <ShieldCheck size={18} />, component: <RolesPermisos /> },
    { name: "Seguridad", label: "Seguridad", icon: <ShieldAlert size={18} />, component: <SecurityLogs /> },
  ];

  return (
    <div className="flex min-h-screen mt-8 bg-gray-50 font-sans text-gray-700">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 pt-24 lg:pt-28 transition-all duration-300">
        <div className="max-w-7xl mx-auto">

          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: BRAND.darkBlue }}>
              <Settings className="text-blue-400" size={32} />
              Panel de Administración
            </h1>
            <p className="text-gray-500 mt-2 text-lg ml-11">
              Control de acceso, gestión de usuarios y configuración del sistema
            </p>
          </div>

          {user ? (
            <div className="space-y-6">
              {/* Menú de Navegación (Tabs) */}
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 inline-flex flex-wrap gap-2 w-full lg:w-auto">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex-1 lg:flex-none justify-center whitespace-nowrap ${isActive
                        ? "text-white shadow-md transform scale-105"
                        : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                      style={{
                        backgroundColor: isActive ? BRAND.blue : 'transparent'
                      }}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Contenido Dinámico */}
              <div className="animate-fade-in-up min-h-[500px]">
                {tabs.find((tab) => tab.name === activeTab)?.component}
              </div>
            </div>
          ) : (
            /* Estado Vacío / No Autenticado */
            <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-3xl shadow-sm border border-dashed border-gray-300 text-center p-8">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <UserX size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sesión no iniciada</h3>
              <p className="text-gray-500">Por favor, inicia sesión para acceder a las herramientas administrativas.</p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}