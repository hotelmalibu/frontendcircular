import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Index from "../../components/dashboard/dashboard/Index";
import { LayoutDashboard, Calendar, UserX, ShieldCheck } from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal
  gray: "#6B7280",
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // Obtener fecha actual para el saludo
  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-700">
      {/* Barra Lateral */}
      <Sidebar />

      {/* Contenido Principal */}
      <main className="flex-1 p-4 sm:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          
          {/* Encabezado del Dashboard */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: BRAND.darkBlue }}>
                <LayoutDashboard className="text-blue-400" size={32} />
                Panel de Control
              </h1>
              {user && (
                <p className="text-gray-500 mt-2 text-lg">
                  Hola, <span className="font-semibold" style={{ color: BRAND.blue }}>{user.name}</span>. 
                  Bienvenido de nuevo.
                </p>
              )}
            </div>

            {/* Widget de Fecha / Rol */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <Calendar size={16} style={{ color: BRAND.green }} />
                <span className="capitalize">{today}</span>
              </div>
              {user?.role && (
                <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                  <ShieldCheck size={12} />
                  <span className="uppercase">{user.role}</span>
                </div>
              )}
            </div>
          </div>

          {/* Área de Contenido Dinámico */}
          {user ? (
            <div className="animate-fade-in-up">
              {/* El componente Index ahora tiene el control total del ancho y diseño */}
              <Index />
            </div>
          ) : (
            /* Estado Vacío / No Autenticado */
            <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-3xl shadow-sm border border-dashed border-gray-300 text-center p-8">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <UserX size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sesión no detectada</h3>
              <p className="text-gray-500 max-w-md">
                No hemos podido cargar la información del usuario. Por favor, intenta recargar la página o inicia sesión nuevamente.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Estilos para animación suave */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}