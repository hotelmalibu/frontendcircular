import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Documentos", path: "/documentos" },
    { name: "Seguimiento", path: "/seguimiento" },
    { name: "Formularios", path: "/formularios" },
    { name: "Comunicaciones", path: "/comunicaciones" },
    { name: "Administración", path: "/administracion" },
    { name: "Integración", path: "/integracion" },
    { name: "Portal", path: "/portal" },
  ];

  return (
    // Sidebar blanco a la izquierda, oculto en móviles
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="px-6 py-12 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Menú</h2>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block w-full text-left px-4 py-3 rounded-md mb-2 transition-colors duration-150 text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                isActive ? "bg-gray-100 font-semibold" : ""
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-gray-100">
        <small className="text-xs text-gray-500">EcoCircular</small>
      </div>
    </aside>
  );
}
