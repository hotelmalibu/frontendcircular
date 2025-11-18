import React from "react";

export default function Table() {
  const data = [
    {
      id: 1,
      usuario: "Luis Martínez",
      rol: "Administrador",
      pedidos: 12,
      ultimoAcceso: "2025-10-21",
      estado: "Activo",
    },
    {
      id: 2,
      usuario: "María Gómez",
      rol: "Cliente",
      pedidos: 5,
      ultimoAcceso: "2025-10-20",
      estado: "Inactivo",
    },
    {
      id: 3,
      usuario: "Carlos Ruiz",
      rol: "Artesano",
      pedidos: 8,
      ultimoAcceso: "2025-10-19",
      estado: "Activo",
    },
  ];

  return (
    <div className="overflow-x-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Usuarios Registrados</h2>

      <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Usuario</th>
            <th className="py-2 px-4 border-b text-left">Rol</th>
            <th className="py-2 px-4 border-b text-left">Pedidos</th>
            <th className="py-2 px-4 border-b text-left">Último Acceso</th>
            <th className="py-2 px-4 border-b text-left">Estado</th>
            <th className="py-2 px-4 border-b text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 transition duration-150"
            >
              <td className="py-2 px-4 border-b">{item.usuario}</td>
              <td className="py-2 px-4 border-b">{item.rol}</td>
              <td className="py-2 px-4 border-b text-center">{item.pedidos}</td>
              <td className="py-2 px-4 border-b">{item.ultimoAcceso}</td>
              <td
                className={`py-2 px-4 border-b font-medium ${
                  item.estado === "Activo"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.estado}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 mr-2 transition">
                  Actualizar
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition">
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
