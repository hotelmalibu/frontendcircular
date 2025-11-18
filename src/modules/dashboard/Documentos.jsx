import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Administrador from "../../components/dashboard/documentos/Administrador";
import Biblioteca from "../../components/dashboard/documentos/Biblioteca";
import Dashboard from "../../components/dashboard/documentos/Dashboard";
import Editor from "../../components/dashboard/documentos/Editor";
import Estado from "../../components/dashboard/documentos/Estado";
import Explorador from "../../components/dashboard/documentos/Explorador";
import Versiones from "../../components/dashboard/documentos/Versiones";
import Buscador from "../../components/dashboard/documentos/Buscador";

export default function Documentos() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const tabs = [
    { name: "Dashboard", component: <Dashboard /> },
    { name: "Explorador", component: <Explorador /> },
    { name: "Buscador", component: <Buscador /> },
    { name: "Editor", component: <Editor /> },
    { name: "Estado", component: <Estado /> },
    { name: "Versiones", component: <Versiones /> },
    { name: "Biblioteca", component: <Biblioteca /> },
    { name: "Administrador", component: <Administrador /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Documentoss</h1>

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
