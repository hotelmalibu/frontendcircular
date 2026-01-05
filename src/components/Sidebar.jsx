import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  MessageSquare,
  Settings,
  LogOut,
  Building
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin = user && (
    user.role?.toLowerCase() === 'admin' ||
    user.role_slug?.toLowerCase() === 'admin' ||
    user.role?.toLowerCase() === 'administrador'
  );

  const isAfiliado = user && (
    user.role_slug === 'afiliado' ||
    user.role?.toLowerCase() === 'afiliado' ||
    user.role?.toLowerCase() === 'afiliados'
  );

  // No mostrar sidebar para afiliados por ahora
  if (isAfiliado) return null;

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Documentos", path: "/documentos", icon: <FileText size={20} /> },
    { name: "Circularmente", path: "/companies", icon: <Building size={20} /> },
    { name: "Formularios", path: "/formularios", icon: <ClipboardList size={20} /> },
    { name: "Comunicaciones", path: "/comunicaciones", icon: <MessageSquare size={20} /> },
    isAdmin && { name: "Administración", path: "/administracion", icon: <Settings size={20} /> },
  ].filter(Boolean);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex mt-20 md:flex-col w-72 bg-white border-r border-gray-200 h-screen sticky top-0 shadow-sm z-30">
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 mt-4">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wider">Menu Principal</p>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? "bg-blue-50 text-blue-700 font-medium shadow-sm ring-1 ring-blue-100"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-colors duration-200 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 flex flex-col gap-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-200 group cursor-pointer"
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}