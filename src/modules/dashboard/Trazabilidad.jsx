import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Dashboard from "../../components/dashboard/trazabilidad/Dashboard";
import Evidencias from "../../components/dashboard/trazabilidad/Evidencias";
import Formularios from "../../components/dashboard/trazabilidad/Formularios";
import Metricas from "../../components/dashboard/trazabilidad/Metricas";
import NormasPoliticas from "../../components/dashboard/trazabilidad/NormasPoliticas";
import Reportes from "../../components/dashboard/trazabilidad/Reportes";
import TrazabilidadComp from "../../components/dashboard/trazabilidad/Trazabilidad";

export default function Trazabilidad() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const tabs = [
    { name: "Dashboard", component: <Dashboard /> },
    { name: "Trazabilidad", component: <TrazabilidadComp /> },
    { name: "Evidencias", component: <Evidencias /> },
    { name: "Formularios", component: <Formularios /> },
    { name: "Métricas", component: <Metricas /> },
    { name: "Normas y Políticas", component: <NormasPoliticas /> },
    { name: "Reportes", component: <Reportes /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Trazabilidad</h1>

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
