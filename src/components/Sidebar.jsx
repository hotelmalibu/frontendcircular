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
  Building,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
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
    <aside 
      className={`hidden md:flex mt-20 md:flex-col bg-white border-r border-gray-200 h-screen sticky top-0 shadow-sm z-30 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? "w-20" : "w-72"
      }`}
    >
      <nav className="flex-1 overflow-y-auto px-3 space-y-1 mt-4 custom-scrollbar">
        {!isSidebarCollapsed && (
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest animate-fadeIn">
            Menu Principal
          </p>
        )}
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center transition-all duration-200 group relative ${
                isSidebarCollapsed ? "justify-center px-0 py-3 mx-2" : "gap-3 px-4 py-3"
              } rounded-xl ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium shadow-sm ring-1 ring-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`
            }
            title={isSidebarCollapsed ? link.name : ""}
          >
            {({ isActive }) => (
              <>
                <span className={`transition-colors duration-200 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {link.icon}
                </span>
                {!isSidebarCollapsed && (
                  <span className="truncate animate-fadeIn">{link.name}</span>
                )}
                {isSidebarCollapsed && isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className={`p-3 border-t border-gray-100 flex flex-col gap-2`}>
        <button
          onClick={handleLogout}
          className={`flex items-center transition-all duration-200 group cursor-pointer rounded-xl ${
            isSidebarCollapsed ? "justify-center px-0 py-3 mx-2" : "gap-3 px-4 py-3"
          } text-gray-500 hover:bg-red-50 hover:text-red-600`}
          title={isSidebarCollapsed ? "Cerrar Sesión" : ""}
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0" />
          {!isSidebarCollapsed && <span className="font-medium animate-fadeIn">Cerrar Sesión</span>}
        </button>

        {/* Botón flotante para expandir si se desea desde abajo (opcional) */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center p-2 text-gray-300 hover:text-blue-500 transition-colors"
        >
          <ChevronRight 
            size={18} 
            className={`transition-transform duration-500 ${isSidebarCollapsed ? "" : "rotate-180"}`} 
          />
        </button>
      </div>
    </aside>
  );
}