import React from "react";

export default function PermisosTable() {
  const funcionalidades = [
    {
      nombre: "Dashboard Completo",
      roles: ["✔️", "⚙️", "✔️", "✔️", "✖️"],
    },
    {
      nombre: "Gestión de Usuarios",
      roles: ["✔️", "⚙️", "✖️", "✖️", "✖️"],
    },
    {
      nombre: "Formularios Dinámicos",
      roles: ["✔️", "✔️", "✔️", "✖️", "✖️"],
    },
    {
      nombre: "Comunicaciones Masivas",
      roles: ["✔️", "✖️", "✖️", "✔️", "✖️"],
    },
    {
      nombre: "Portal Público",
      roles: ["✔️", "👁️", "✔️", "✖️", "👁️"],
    },
  ];

  const headers = [
    "Administrador",
    "Empresa",
    "Autoridades",
    "Aliados",
    "Ciudadanía",
  ];

  return (
    <div className="mt-10 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        Matriz de Permisos por Funcionalidad
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Funcionalidad</th>
              {headers.map((rol, i) => (
                <th
                  key={i}
                  className="py-2 px-4 border-b text-center text-sm font-medium text-gray-700"
                >
                  {rol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {funcionalidades.map((item, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 transition duration-150 text-center"
              >
                <td className="py-2 px-4 border-b text-left font-medium text-gray-800">
                  {item.nombre}
                </td>
                {item.roles.map((permiso, j) => (
                  <td key={j} className="py-2 px-4 border-b">
                    {permiso}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
