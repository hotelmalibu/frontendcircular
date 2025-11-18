import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Aprobaciones from "../../components/dashboard/administracion/Aprobaciones";
import LogAuditoria from "../../components/dashboard/administracion/LogsAuditoria";
import Usuarios from "../../components/dashboard/administracion/Usuarios";
import RolesPermisos from "../../components/dashboard/administracion/RolesPermisos";
import Seguridad from "../../components/dashboard/administracion/Seguridad";
import Recursos from "../../components/dashboard/administracion/Recursos";

export default function Administracion() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Aprobaciones");

  const tabs = [
    { name: "Aprobaciones", component: <Aprobaciones /> },
    { name: "Usuarios", component: <Usuarios /> },
    { name: "Roles y Permisos", component: <RolesPermisos /> },
    { name: "Seguridad", component: <Seguridad /> },
    { name: "Recursos", component: <Recursos /> },
    { name: "Logs Auditoría", component: <LogAuditoria /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Administración</h1>

          {user ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              {/* Menú de botones */}
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
