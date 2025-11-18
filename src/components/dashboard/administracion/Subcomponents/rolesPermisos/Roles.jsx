  import React from "react";

  export default function Roles() {
    const roles = [
      {
        nombre: "Administrador",
        usuarios: "8 usuarios",
        color: "bg-green-200 text-green-800",
        descripcion: "Control total del sistema",
        permisos: [
          "usuarios: crear, editar, eliminar, ver",
          "contenido: crear, editar, eliminar, publicar, moderar",
          "configuración: editar, ver",
          "reportes: generar, exportar, ver",
          "seguridad: configurar, auditar",
        ],
      },
      {
        nombre: "Empresa",
        usuarios: "1247 usuarios",
        color: "bg-green-200 text-green-800",
        descripcion: "Gestión de productos y servicios circulares",
        permisos: [
          "productos: crear, editar, eliminar, ver",
          "contenido: crear, editar, ver",
          "reportes: ver",
          "perfil: editar, ver",
        ],
      },
      {
        nombre: "Autoridades",
        usuarios: "23 usuarios",
        color: "bg-green-200 text-green-800",
        descripcion: "Supervisión y regulación",
        permisos: [
          "productos: ver, moderar",
          "contenido: ver, moderar",
          "reportes: generar, ver",
          "usuarios: ver",
          "auditorías: ver",
        ],
      },
      {
        nombre: "Aliados",
        usuarios: "189 usuarios",
        color: "bg-green-200 text-green-800",
        descripcion: "Colaboración y partnerships",
        permisos: [
          "productos: ver, colaborar",
          "contenido: crear, editar, ver",
          "eventos: crear, gestionar",
          "reportes: ver",
        ],
      },
      {
        nombre: "Ciudadanía",
        usuarios: "1890 usuarios",
        color: "bg-green-200 text-green-800",
        descripcion: "Consumo responsable y participación",
        permisos: [
          "productos: ver",
          "contenido: ver, comentar",
          "perfil: editar, ver",
          "participación: votar, comentar",
        ],
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
        {roles.map((rol, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{rol.nombre}</h3>
              <span className={`text-sm px-2 py-1 rounded ${rol.color}`}>
                {rol.usuarios}
              </span>
            </div>
            <p className="text-gray-600 mb-3 text-sm">{rol.descripcion}</p>
            <ul className="text-sm text-gray-700 mb-4 list-disc list-inside">
              {rol.permisos.map((permiso, j) => (
                <li key={j}>{permiso}</li>
              ))}
            </ul>
            <div className="flex justify-between">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                Editar
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Ver detalles
              </button>
            </div>
          </div>
        ))}

        {/* Botones laterales */}
        <div className="flex flex-col justify-center items-center space-y-4">
          <button className="bg-white shadow-md border border-gray-200 px-6 py-3 rounded-lg w-full text-gray-800 flex items-center justify-center hover:bg-gray-100">
            <span className="mr-2 text-2xl">👤</span> Crear Rol
          </button>
          <button className="bg-white shadow-md border border-gray-200 px-6 py-3 rounded-lg w-full text-gray-800 flex items-center justify-center hover:bg-gray-100">
            <span className="mr-2 text-2xl">🧩</span> Reglas ABAC
          </button>
        </div>
      </div>
    );
  }
