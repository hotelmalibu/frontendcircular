import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Companies from "../../components/dashboard/Companies";

export default function Empresas() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-0">
        {user ? (
          <Companies />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-600">No hay usuario cargado.</p>
          </div>
        )}
      </main>
    </div>
  );
}