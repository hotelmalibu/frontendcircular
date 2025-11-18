import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import {  User } from "lucide-react";

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-20 pt-32">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <User className="text-blue-500" /> Información del Usuario
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-gray-600 text-sm">Nombre</p>
              <p className="text-lg font-semibold text-blue-700">{user.name}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg font-semibold text-blue-700">{user.email}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-gray-600 text-sm">Rol</p>
              <p className="text-lg font-semibold text-blue-700">
                {user.role || "Sin rol asignado"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}