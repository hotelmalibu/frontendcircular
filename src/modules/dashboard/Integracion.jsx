import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import APIs from "../../components/dashboard/integracion/APIs";
import Configuracion from "../../components/dashboard/integracion/Configuracion";
import Dashboard from "../../components/dashboard/integracion/Dashboard";
import Feeds from "../../components/dashboard/integracion/Feeds";
import Logs from "../../components/dashboard/integracion/Logs";
import RedesSociales from "../../components/dashboard/integracion/RedesSociales";

export default function Integracion() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const tabs = [
    { name: "Dashboard", component: <Dashboard /> },
    { name: "APIs", component: <APIs /> },
    { name: "Redes Sociales", component: <RedesSociales /> },
    { name: "Feeds", component: <Feeds /> },
    { name: "Logs", component: <Logs /> },
    { name: "Configuración", component: <Configuracion /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Integración</h1>

          {user ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              {/* Menú de pestañas */}
              <div className="flex flex-wrap justify-center gap-3 mb-6 border-b pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeTab === tab.name
                        ? "bg-[#004b72] text-white shadow"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Contenido dinámico */}
              <div className="text-center mt-4">
                {tabs.find((tab) => tab.name === activeTab)?.component}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay usuario cargado.</p>
          )}
        </div>
      </main>
    </div>
  );
}
