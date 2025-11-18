import React from "react";

export default function SeguridadConfig() {
  const modulos = [
    {
      titulo: "OAuth2/JWT",
      descripcion: "Configuración de autenticación",
      estado: "Activo",
      color: "bg-green-100 text-green-700",
      botones: ["Configurar"],
    },
    {
      titulo: "Single Sign-On",
      descripcion: "Integración SAML 2.0",
      estado: "Activo",
      color: "bg-green-100 text-green-700",
      botones: ["Configurar"],
    },
    {
      titulo: "Gestión de Sesiones",
      descripcion: "Control de sesiones activas",
      estado: "Activo",
      color: "bg-green-100 text-green-700",
      botones: ["Ver sesiones"],
    },
    {
      titulo: "Política de Contraseñas",
      descripcion: "Configuración de seguridad",
      estado: "Editar",
      color: "bg-yellow-100 text-yellow-700",
      botones: ["Configurar"],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {modulos.map((m, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between border border-gray-200"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {m.titulo}
            </h3>
            <p className="text-gray-500 text-sm mb-3">{m.descripcion}</p>
            <span
              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${m.color}`}
            >
              {m.estado}
            </span>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {m.botones.map((b, j) => (
              <button
                key={j}
                className="bg-gray-800 hover:bg-gray-900 text-white text-sm px-4 py-2 rounded-md"
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
