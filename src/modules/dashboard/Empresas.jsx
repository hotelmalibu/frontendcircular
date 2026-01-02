import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Companies from "../../components/dashboard/Companies";
import { UserX } from "lucide-react";



export default function Empresas() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen mt-8 bg-gray-50 font-sans text-gray-700">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 lg:pt-28 transition-all duration-300">
        <div className="max-w-7xl mx-auto">



          {user ? (
            <div className="animate-fade-in-up min-h-[500px]">
              {/* El componente Companies ahora se renderiza dentro del layout controlado */}
              <Companies />
            </div>
          ) : (
            /* Estado Vacío / No Autenticado */
            <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-3xl shadow-sm border border-dashed border-gray-300 text-center p-8">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <UserX size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Acceso Restringido</h3>
              <p className="text-gray-500">Por favor, inicia sesión para gestionar las empresas.</p>
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