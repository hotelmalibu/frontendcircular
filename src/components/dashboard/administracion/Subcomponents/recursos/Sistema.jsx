import React from "react";

export default function Sistema() {
  const sistemas = [
    {
      nombre: "Gestión de Usuarios",
      version: "2.1.0",
      fecha: "9/9/2025",
      usuariosActivos: 8,
      disponibilidad: "100%",
      estado: "Activo",
      color: "bg-green-100 text-green-700",
    },
    {
      nombre: "Dashboard Analítico",
      version: "2.1.0",
      fecha: "9/9/2025",
      usuariosActivos: 2348,
      disponibilidad: "100%",
      estado: "Activo",
      color: "bg-green-100 text-green-700",
    },
    {
      nombre: "Documentos",
      version: "2.1.0",
      fecha: "9/9/2025",
      usuariosActivos: 1532,
      disponibilidad: "100%",
      estado: "Activo",
      color: "bg-green-100 text-green-700",
    },
    {
      nombre: "Formularios Normativos",
      version: "2.1.0",
      fecha: "9/9/2025",
      usuariosActivos: 0,
      disponibilidad: "0%",
      estado: "Mantenimiento",
      color: "bg-red-600 text-white",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sistemas.map((sistema, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between border border-gray-200"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {sistema.nombre}
                </h3>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${sistema.color}`}
                >
                  {sistema.estado}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-4">
                Versión {sistema.version} • Actualizado {sistema.fecha}
              </p>

              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {sistema.usuariosActivos}
                  </p>
                  <p className="text-gray-500 text-sm">Usuarios Activos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {sistema.disponibilidad}
                  </p>
                  <p className="text-gray-500 text-sm">Disponibilidad</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded text-sm">
                Configurar
              </button>
              <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm">
                Estadísticas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
