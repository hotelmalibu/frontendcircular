import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  MessageSquare,
  Settings,
  Building,
  LifeBuoy,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const { isSidebarCollapsed } = useSidebar();

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
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={24} /> },
    { 
      name: "Documentos", 
      path: "/documentos", 
      icon: <FileText size={24} />,
      permission: "view.documents" 
    },
    { 
      name: "Circularmente", 
      path: "/companies", 
      icon: <Building size={24} />,
      permission: "view.circularmente" 
    },
    { 
      name: "Formularios", 
      path: "/formularios", 
      icon: <ClipboardList size={24} />,
      permission: "view.forms" 
    },
    { 
      name: "Comunicaciones", 
      path: "/comunicaciones", 
      icon: <MessageSquare size={24} />,
      permission: "view.communications" 
    },
    { 
      name: "Soporte", 
      path: "/soporte", 
      icon: <LifeBuoy size={24} />,
      permission: "view.support" 
    },
    { 
      name: "Administración", 
      path: "/administracion", 
      icon: <Settings size={24} />,
      permission: "view.admin" 
    },
  ].filter(link => {
    if (!link) return false;
    // Si no requiere permiso, se muestra (ej. Dashboard)
    if (!link.permission) return true;
    // Si el usuario es admin, ve todo
    if (isAdmin) return true;
    // Verificar si el usuario tiene el permiso en su array
    return user?.permissions?.includes(link.permission);
  });

  return (
    <>
      {/* Spacer to maintain layout width in the flex container */}
      <div 
        className={`hidden md:block flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-20" : "w-72"
        }`} 
      />

      <aside 
        className={`hidden md:flex fixed left-0 top-28 bottom-0 md:flex-col bg-white border-r border-gray-200 shadow-sm z-30 transition-all duration-300 ease-in-out ${
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
      </aside>
    </>
  );
}
