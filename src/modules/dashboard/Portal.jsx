import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";

export default function Portal() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Portal</h1>
          {user ? (
            <div className="bg-white shadow-md rounded-lg p-6 w-96 text-center">
              <p className="mb-2"><strong>Portal</strong> </p>
            </div>
          ) : (
            <p>No hay usuario cargado.</p>
          )}
        </div>
      </main>
    </div>
  );
}