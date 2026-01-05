import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Dashboard from "../../components/dashboard/formularios/Dashboard";
import Editor from "../../components/dashboard/formularios/Editor";
import Respuestas from "../../components/dashboard/formularios/Respuestas";
import Exportacion from "../../components/dashboard/formularios/Exportacion";
import Encuestas from "../../components/dashboard/formularios/Encuestas";
import { ClipboardList, Calendar, ShieldCheck } from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal
  gray: "#6B7280",
};

export default function Formularios() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Obtener fecha actual
  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tabs = [
    { name: "Dashboard", component: <Dashboard /> },
    { name: "Editor", component: <Editor onNavigate={setActiveTab} /> },
    { name: "Respuestas", component: <Respuestas /> },
    { name: "Encuestas", component: <Encuestas /> },
    { name: "Exportacion", component: <Exportacion /> },
  ];

  return (
    <div className="flex min-h-screen mt-8 bg-gray-50 font-sans text-gray-700">
      {/* Barra Lateral */}
      <Sidebar />

      {/* Contenido Principal */}
      <main className="flex-1 p-4 sm:p-8 pt-24 lg:pt-28 transition-all duration-300">
        <div className="max-w-7xl mx-auto">

          {/* Encabezado */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: BRAND.darkBlue }}>
                <ClipboardList className="text-blue-400" size={32} />
                Gestión de Formularios
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                Administra tus encuestas y analiza las respuestas.
              </p>
            </div>

          
          </div>

          {user ? (
            <div className="animate-fade-in-up bg-white shadow-md rounded-2xl p-6 border border-gray-100">
              {/* Menú de pestañas */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.name
                      ? "bg-[#2C67B0] text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#2C67B0]"
                      }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Contenido dinámico */}
              <div className="mt-4">
                {tabs.find((tab) => tab.name === activeTab)?.component}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">No hay usuario cargado.</p>
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
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
