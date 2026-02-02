import React, { useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoBlanco from "../assets/fondosYlogos/Logo_blanco.png";
import Logo from "../assets/fondosYlogos/Logo.png";
import {
  User,
  LogOut,
  Home,
  ChevronDown,
  Bell,
  MessageSquare,
  LayoutDashboard,
  ShieldAlert,
  FileText,
  ClipboardList,
  Settings,
  Building,
  Menu,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { getAllProjects } from "../api/projectsApi";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0", // Azul Principal
  darkBlue: "#005380", // Azul Logo/Profundo
  lightBlue: "#7FB8D9", // Azul Claro
  green: "#B1D357", // Verde Principal
  green2: "#00AB6D", // Verde lines en modo transparente
  darkGreen: "#8CB200", // Verde Secundario
  gray: "#6B7280",
};

function MobileMenuDropdown({
  title,
  subsections,
  showWhiteBg,
  showHover,
  showWhiteText,
  onClose,
}) {
  const [open, setOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [openSubSubmenus, setOpenSubSubmenus] = useState({});

  const toggleSubmenu = (idx) => {
    setOpenSubmenus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleSubSubmenu = (parentIdx, itemIdx) => {
    const key = `${parentIdx}-${itemIdx}`;
    setOpenSubSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left py-4 px-4 font-bold uppercase text-sm transition-all flex justify-between items-center ${showWhiteText ? "text-white" : "text-gray-800"
          }`}
        style={{ color: !showWhiteText && open ? BRAND.blue : "" }}
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {open && (
        <div className="bg-gray-50/50 pb-2">
          {subsections.map((subsection, idx) => {
            const sectionPath = subsection.path || "#";
            return (
              <div key={idx} className="">
                {subsection.items && subsection.items.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(idx)}
                      className={`w-full text-left py-3 px-8 font-semibold text-xs uppercase tracking-wide flex justify-between items-center ${showWhiteText ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                      <span>{subsection.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${openSubmenus[idx] ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openSubmenus[idx] && (
                      <div
                        className="bg-gray-100/50 border-l-2 ml-8 mb-2"
                        style={{ borderColor: BRAND.lightBlue }}
                      >
                        {subsection.items.map((item, itemIdx) => {
                          if (item.subItems && item.subItems.length > 0) {
                            const subKey = `${idx}-${itemIdx}`;
                            return (
                              <div key={itemIdx}>
                                <button
                                  onClick={() => toggleSubSubmenu(idx, itemIdx)}
                                  className="w-full text-left py-2 px-4 text-sm flex justify-between items-center text-gray-600 hover:text-blue-600"
                                >
                                  <span>{item.label}</span>
                                  <ChevronDown
                                    className={`w-3 h-3 transition-transform ${openSubSubmenus[subKey]
                                      ? "rotate-180"
                                      : ""
                                      }`}
                                  />
                                </button>
                                {openSubSubmenus[subKey] && (
                                  <div className="pl-4 pb-2 border-l border-blue-50 ml-6">
                                    {item.subItems.map((subItem, subIdx) => {
                                      const hasProjects = subItem.projects && subItem.projects.length > 0;
                                      const projectsKey = `${subKey}-${subIdx}`;

                                      return (
                                        <div key={subIdx}>
                                          {hasProjects ? (
                                            <>
                                              <button
                                                onClick={() => setOpenSubSubmenus(prev => ({ ...prev, [projectsKey]: !prev[projectsKey] }))}
                                                className="w-full text-left py-2 px-2 text-xs flex justify-between items-center text-gray-500 hover:text-blue-600"
                                              >
                                                <span>{subItem.label}</span>
                                                <ChevronDown
                                                  className={`w-2 h-2 transition-transform ${openSubSubmenus[projectsKey] ? "rotate-180" : ""}`}
                                                />
                                              </button>
                                              {openSubSubmenus[projectsKey] && (
                                                <div className="pl-3 py-1 space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                                                  {subItem.projects.map((project, pIdx) => (
                                                    <Link
                                                      key={pIdx}
                                                      to={`/proyectos/${project.id}`}
                                                      onClick={onClose}
                                                      className="block py-1.5 px-3 text-[11px] text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 rounded transition-all"
                                                    >
                                                      {project.title}
                                                    </Link>
                                                  ))}
                                                </div>
                                              )}
                                            </>
                                          ) : (
                                            <Link
                                              to={subItem.path}
                                              onClick={onClose}
                                              className="block py-2 px-2 text-xs text-gray-500 hover:text-blue-600"
                                            >
                                              {subItem.label}
                                            </Link>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return (
                            <Link
                              key={itemIdx}
                              to={item.path}
                              onClick={onClose}
                              className="block py-2 px-4 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={sectionPath}
                    onClick={onClose}
                    className="block py-3 px-8 font-semibold text-xs uppercase tracking-wide text-gray-600 hover:text-blue-600"
                  >
                    {subsection.title}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MegaMenuDropdown({
  label,
  sections = [],
  path,
  showWhiteBg,
  showHover,
  showWhiteText,
  onOpenChange,
}) {
  const [open, setOpen] = useState(false);
  const [activeProjectsId, setActiveProjectsId] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
    onOpenChange(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
      onOpenChange(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const textColorClass = showWhiteText ? "text-white" : "text-gray-700";

  if (path) {
    return (
      <Link
        to={path}
        className={`text-base lg:text-base font-semibold fontfamily-montserrat transition-all menu-underline pb-1 ${textColorClass}`}
        style={{ "--hover-color": BRAND.blue }}
      >
        {label}
      </Link>
    );
  }

  return (
    <div
      className="relative group h-full flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={`text-base lg:text-base font-semibold fontfamily-montserrat transition-all menu-underline pb-1 ${open ? "active" : ""
          } ${textColorClass}`}
        style={{ "--hover-color": BRAND.blue }}
      >
        {label}
      </button>

      <div
        className={`fixed left-0 right-0 top-full bg-white shadow-xl transform transition-all duration-300 border-t border-gray-100 ${open
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-2"
          }`}
      >
        {/* Barra de gradiente superior */}
        <div
          className="h-1.5 w-full bg-gradient-to-r"
          style={{
            backgroundImage: `linear-gradient(to right, ${BRAND.green}, ${BRAND.blue}, ${BRAND.darkBlue})`,
          }}
        ></div>

        <div className="container mx-auto px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
            {sections.map((section, idx) => {
              const sectionPath = section.path || "#";
              return (
                <div
                  key={idx}
                  className="space-y-4 group/section"
                  style={{
                    animation: `slideInText 0.4s ease-out ${idx * 0.05}s both`,
                  }}
                >
                  {section.items && section.items.length > 0 ? (
                    <h3
                      className="font-bold text-gray-900 text-sm lg:text-sm uppercase tracking-wider border-b-2 border-transparent group-hover/section:border-blue-500 pb-2 transition-all duration-300 w-fit"
                      style={{
                        borderColor: open ? BRAND.green : "transparent",
                      }}
                    >
                      {section.title}
                    </h3>
                  ) : (
                    <Link
                      to={sectionPath}
                      className="font-bold text-gray-900 text-sm lg:text-sm uppercase tracking-wider border-b-2 border-transparent hover:border-blue-500 pb-2 block transition-all duration-300 w-fit hover:text-blue-600"
                    >
                      {section.title}
                    </Link>
                  )}

                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-2.5">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="group/item relative">
                          {item.subItems && item.subItems.length > 0 ? (
                            <div className="w-full">
                              <button className="w-full text-left flex items-center justify-between text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 py-0.5 font-medium group-hover/item:translate-x-1">
                                <span>{item.label}</span>
                                <ChevronDown
                                  size={14}
                                  className="text-gray-400 transition-transform duration-300 group-hover/item:-rotate-180"
                                />
                              </button>
                              <div className="overflow-hidden max-h-0 opacity-0 group-hover/item:max-h-[800px] group-hover/item:opacity-100 transition-all duration-500 ease-in-out">
                                <ul className="pl-3 mt-1 space-y-2 border-l-2 border-blue-100 ml-1 py-1">
                                  {item.subItems.map((sub, subIdx) => {
                                    const subKey = `${idx}-${itemIdx}-${subIdx}`;
                                    const isOpen = activeProjectsId === subKey;

                                    return (
                                      <li key={subIdx} className="relative">
                                        {sub.projects && sub.projects.length > 0 ? (
                                          <div className="relative">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveProjectsId(isOpen ? null : subKey);
                                              }}
                                              className={`w-full text-left flex items-center justify-between text-xs transition-all py-1.5 px-2 rounded-md ${isOpen ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-500 hover:text-blue-600 hover:font-semibold"
                                                }`}
                                            >
                                              <span>{sub.label}</span>
                                              <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`} />
                                            </button>

                                            {/* Sub-submenu de proyectos (Inline Accordion) */}
                                            {isOpen && (
                                              <div
                                                className="mt-2 ml-2 pl-3 border-l-2 border-blue-50 animate-in fade-in slide-in-from-top-2 duration-300"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                <ul className="space-y-1 mt-1 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                                                  {sub.projects.map((project, pIdx) => (
                                                    <li key={pIdx}>
                                                      <Link
                                                        to={`/proyectos/${project.id}`}
                                                        className="block text-[11px] text-gray-400 hover:text-blue-600 hover:bg-blue-50/50 px-2 py-1.5 rounded-md transition-all"
                                                        onClick={() => setOpen(false)}
                                                      >
                                                        {project.title}
                                                      </Link>
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <Link
                                            to={sub.path}
                                            className="block text-xs text-gray-500 hover:text-blue-600 hover:font-semibold transition-all py-1.5 px-2"
                                          >
                                            {sub.label}
                                          </Link>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <Link
                              to={item.path}
                              className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 block py-0.5 font-medium hover:translate-x-1"
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileDropdown({ user, logout, showWhiteText }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  // function ProfileDropdown (part of the file)

  const userFullName = user?.name
    ? `${user.name} ${user.lastName || ""}`.trim()
    : "Usuario";
  const userRole = user?.role || "Sin rol";
  // Si no hay avatar, usamos null para luego mostrar las iniciales
  const userAvatar = user?.avatar;

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isDashboardRoute = location.pathname === "/dashboard";
  const dashboardOrPortalPath = isDashboardRoute ? "/" : "/dashboard";
  const dashboardOrPortalLabel = isDashboardRoute ? "Portal" : "Dashboard";

  return (
    <div
      className="relative z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="flex items-center gap-3 hover:opacity-90 transition-opacity group py-2"
      >
        <div className="text-right hidden sm:block leading-tight">
          <p
            className={`text-sm font-bold ${showWhiteText ? "text-white" : "text-gray-800"
              }`}
          >
            {userFullName}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full border-2 border-white/50 group-hover:border-blue-400 transition-colors shadow-sm flex items-center justify-center overflow-hidden ${!userAvatar ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userFullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'; // Hide broken image
                e.target.parentNode.textContent = getInitials(userFullName); // Fallback to text
                e.target.parentNode.classList.add('bg-blue-600', 'text-white');
              }}
            />
          ) : (
            <span className="font-bold text-sm tracking-widest">{getInitials(userFullName)}</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`${showWhiteText ? "text-white" : "text-gray-500"
            } transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute right-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 transform transition-all duration-200 origin-top-right overflow-hidden ${open
          ? "opacity-100 visible scale-100"
          : "opacity-0 invisible scale-95"
          }`}
      >
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 sm:hidden">
          <p className="text-sm font-bold text-gray-800">{userFullName}</p>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>
        <div className="py-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <User size={16} className="text-gray-400" /> Mi Perfil
          </Link>
          <Link
            to={dashboardOrPortalPath}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <Home size={16} className="text-gray-400" />{" "}
            {dashboardOrPortalLabel}
          </Link>
          <hr className="my-1 border-gray-100" />
          <button
            onClick={logout}
            className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL NAVBAR ---
export default function Navbar({ onMenuClick }) {
  const { user, logout } = useContext(AuthContext);
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasOpenDropdown, setHasOpenDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [scrollDirection, setScrollDirection] = useState("up");

  // --- DATOS DINÁMICOS ---
  const [projectsList, setProjectsList] = useState([]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [projRes] = await Promise.all([
          getAllProjects({ per_page: 100 })
        ]);
        setProjectsList(projRes?.data?.items || []);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };
    fetchMenuData();
  }, []);

  const getProjectsByLineSubstr = (searchStr) => {
    if (!searchStr || !projectsList.length) return [];

    const search = searchStr.toLowerCase();
    return projectsList.filter(project => {
      // 1. Verificar Nombre de Categoría (Prioritario en muchos casos)
      const categoryName = (project.category_name || project.category?.name || "").toLowerCase();

      // 2. Verificar Etiqueta de Clasificación (Usado para 'Innovación' por ejemplo)
      const classificationLabel = (project.classification_type_label || "").toLowerCase();

      // 3. Verificar si el término de búsqueda está en alguno
      return categoryName.includes(search) || classificationLabel.includes(search);
    }).slice(0, 30); // Aumentar el límite para permitir scroll
  };

  // --- LÓGICA DE VISIBILIDAD ---
  const isPublicPage = location.pathname === "/";

  const internalPaths = [
    "/dashboard",
    "/documentos",
    "/companies",
    "/seguimiento",
    "/formularios",
    "/comunicaciones",
    "/administracion",
    "/integracion",
    "/profile",
  ];
  const isInternalPage =
    user && internalPaths.some((path) => location.pathname.startsWith(path));

  const transparentPaths = [
    "/circularmente",
    "/explorar",
    "/contenido",
    "/proyectos/",
    "/juntaDirecteEquipo",
    "/valores",
    "/lineas-estrategicas",
    "/informes-anuales",
    "/encuestas",
  ];
  const isTransparentNavPath = transparentPaths.some((path) => {
    // Para encuestas, solo la raíz '/encuestas' es transparente, el detalle no.
    if (path === "/encuestas") {
      return location.pathname === "/encuestas";
    }
    return location.pathname.startsWith(path);
  });

  const isInteracted =
    scrolled || isHovered || hasOpenDropdown || mobileMenuOpen;

  const isDashboardView = user && isPublicPage && !isInteracted;
  const isAuthPage = ["/login", "/quines-somos", "/alianzas", "/resoluciones", "/planes", "/polticas", "/register", "/forgot-password"].includes(
    location.pathname
  );

  let showWhiteBg;
  if (isAuthPage) {
    showWhiteBg = true;
  } else if (isTransparentNavPath) {
    showWhiteBg = isInteracted;
  } else if (isDashboardView) {
    showWhiteBg = false;
  } else {
    if (user) {
      showWhiteBg = true;
    } else {
      showWhiteBg = isInteracted;
    }
  }

  const showWhiteText = (isTransparentNavPath || isPublicPage) && !showWhiteBg;
  const currentLogo = isAuthPage ? Logo : showWhiteText ? LogoBlanco : Logo;

  // Define el color de la línea: VERDE si el texto es blanco (transparente), AZUL si es fondo blanco.
  const underlineColor = showWhiteText ? BRAND.green2 : BRAND.blue;
  // Define el ancho de la línea: 100% fijo si es transparente, 0% (animado a 100% en hover) si no.
  const underlineWidth = showWhiteText ? "100%" : "0";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
        setVisible(true);
      } else {
        setScrollDirection("up");
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(false);
  };

  const menuSections = [
    {
      name: "Nosotros",
      subsections: [
        {
          title: "Conócenos",
          items: [
            { label: "Razón y propósito", path: "/quines-somos" },
            { label: "Ética y transparencia", path: "/valores" },
            { label: "Junta Directiva - Equipo", path: "/juntaDirecteEquipo" },
            { label: "Líneas Estratégicas", path: "/lineas-estrategicas" },
            { label: "Informes", path: "/informes-anuales" },
            { label: "Encuestas", path: "/encuestas" },
            { label: "Alianzas", path: "/alianzas" },
          ],
        },
        {
          title: "Marco Normativo",
          items: [
            { label: "Resoluciones", path: "/resoluciones" },
            { label: "Planes", path: "/planes" },
            { label: "Políticas", path: "/polticas" },
          ],
        },
      ],
    },
    {
      name: "Nuestro Trabajo",
      subsections: [
        {
          title: "Proyectos y alianzas",
          items: [
            { label: "Portafolio de proyectos", path: "/proyectos-activos" },
            {
              label: "Líneas Estratégicas",
              path: null,
              subItems: [
                {
                  label: "Fortalecimiento",
                  path: null,
                  projects: getProjectsByLineSubstr("Fortalecimiento")
                },
                {
                  label: "Consumo Responsable",
                  path: null,
                  projects: getProjectsByLineSubstr("Consumo")
                },
                {
                  label: "Inclusión",
                  path: null,
                  projects: getProjectsByLineSubstr("Inclusión")
                },
                {
                  label: "Proyectos Estratégicos",
                  path: null,
                  projects: getProjectsByLineSubstr("Proyectos")
                },
                {
                  label: "Innovación",
                  path: null,
                  projects: getProjectsByLineSubstr("Innovación")
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Circularmente",
      path: "/circularmente",
      subsections: [],
    },
  ];

  // --- NOTIFICACIONES ---
  const [pendingCount, setPendingCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const notifRef = useRef(null);
  const alertRef = useRef(null);

  const isAdmin =
    user &&
    (user.role?.toLowerCase() === "admin" ||
      user.role_slug?.toLowerCase() === "admin" ||
      user.role?.toLowerCase() === "administrador");

  const isAfiliado =
    user &&
    (user.role_slug?.toLowerCase() === "afiliado" ||
      user.role?.toLowerCase() === "afiliado" ||
      user.role?.toLowerCase() === "afiliados");

  useEffect(() => {
    if (user && isAdmin) {
      const fetchCounts = async () => {
        try {
          const { getUsers, getSecurityLogs } = await import("../api/auth");

          // Notificaciones de Gestión (Usuarios pendientes y suspendidos)
          const resUsers = await getUsers();
          const users = Array.isArray(resUsers.data)
            ? resUsers.data
            : resUsers.data?.data || [];
          const pending = users.filter(
            (u) =>
              u.status?.toLowerCase() === "pending" ||
              u.status?.toLowerCase() === "pendiente" ||
              u.status?.toLowerCase() === "suspended" ||
              u.status?.toLowerCase() === "suspendido"
          ).length;
          setPendingCount(pending);

          // Alertas de Seguridad
          try {
            const resAlerts = await getSecurityLogs();
            const alerts = Array.isArray(resAlerts.data)
              ? resAlerts.data
              : resAlerts.data?.data || [];
            // Solo contar y mostrar las que no han sido vistas/revisadas
            const activeAlerts = alerts.filter((a) => !a.is_viewed);
            setRecentAlerts(activeAlerts.slice(0, 5));
            setAlertCount(activeAlerts.length);
          } catch (e) {
            console.log("Security logs endpoint not available yet.");
          }
        } catch (err) {
          console.error("Error fetching notif counts:", err);
        }
      };

      fetchCounts();
      const interval = setInterval(fetchCounts, 60000); // Poll cada minuto

      // Escuchar eventos cuando se marca una alerta como revisada
      const handleSecurityLogReviewed = () => {
        fetchCounts(); // Refrescar contadores inmediatamente
      };

      window.addEventListener("securityLogReviewed", handleSecurityLogReviewed);

      return () => {
        clearInterval(interval);
        window.removeEventListener(
          "securityLogReviewed",
          handleSecurityLogReviewed
        );
      };
    }
  }, [user, isAdmin]);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
      if (alertRef.current && !alertRef.current.contains(e.target)) {
        setShowAlertMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 font-sans ${user ? "" : "transition-all duration-500 ease-in-out"
        } ${user
          ? "translate-y-0 opacity-100"
          : visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        @keyframes slideInText { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .slide-in { animation: slideInText 0.6s ease-out; }
        .menu-underline { position: relative; display: inline-block; }
        .menu-underline::after { 
          content: ''; 
          position: absolute; 
          bottom: -4px; 
          left: 0; 
          width: ${underlineWidth}; 
          height: 3px; 
          background-color: ${underlineColor}; 
          transition: width 0.3s ease; 
          border-radius: 2px; 
        }
        /* Solo activamos el hover si la línea no está ya al 100% (modo normal) */
        ${!showWhiteText
          ? ".menu-underline:hover::after, .menu-underline.active::after { width: 100%; }"
          : ""
        }
        
        /* Hamburger Animation */
        .hamburger { display: flex; flex-direction: column; gap: 5px; cursor: pointer; padding: 5px; }
        .hamburger-line { width: 24px; height: 2px; transition: all 0.3s ease; border-radius: 4px; }
        .hamburger.active .hamburger-line:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); background-color: ${BRAND.blue
        }; }
        .hamburger.active .hamburger-line:nth-child(2) { opacity: 0; }
        .hamburger.active .hamburger-line:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); background-color: ${BRAND.blue
        }; }
        
        @media (max-width: 768px) { .nav-desktop { display: none; } }
        @media (min-width: 769px) { .nav-mobile { display: none; } }
      `}</style>

      {/* NAVBAR HEADER */}
      <header
        className={`flex items-center justify-between px-4 md:px-8 lg:px-24 py-4 transition-all duration-300 ${!showWhiteBg
          ? "bg-transparent"
          : "bg-white shadow-md border-b border-gray-100"
          }`}
      >
        {/* LOGO & TOGGLE */}
        <div className="flex items-center slide-in shrink-0 relative">
          {isInternalPage && !user?.role?.toLowerCase()?.includes("afiliado") && (
            <button
              onClick={toggleSidebar}
              className={`hidden md:flex absolute -left-1 md:-left-6 lg:-left-20 p-2 rounded-xl transition-all duration-300 transform active:scale-95 items-center justify-center ${showWhiteText
                ? "text-white hover:bg-white/20"
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              title={isSidebarCollapsed ? "Mostrar menú completo" : "Contraer menú"}
            >
              <Menu size={24} />
            </button>
          )}
          <Link
            to="/"
            className="flex items-center hover:scale-105 transition-transform duration-300 ml-4 md:ml-0"
          >
            <img
              src={currentLogo}
              alt="Visión Circular"
              className="h-12 md:h-[80px] w-auto object-contain"
            />
          </Link>
        </div>

        {/* Espaciador flexible */}
        {user && isInternalPage && !user.role?.toLowerCase()?.includes("afiliado") && (
          <div className="flex-1"></div>
        )}

        {/* MENÚ DESKTOP */}
        {(!user || (user && !isInternalPage) || (user && user.role?.toLowerCase()?.includes("afiliado"))) && (
          <nav className="nav-desktop flex items-center gap-8 lg:gap-16 flex-1 justify-center mx-4">
            {menuSections.map((section) => (
              <MegaMenuDropdown
                key={section.name}
                label={section.name}
                sections={section.subsections}
                path={section.path}
                showWhiteBg={showWhiteBg}
                showHover={isPublicPage || isTransparentNavPath}
                showWhiteText={showWhiteText}
                onOpenChange={setHasOpenDropdown}
              />
            ))}
          </nav>
        )}

        {/* BOTONES Y USUARIO */}
        <div className="flex items-center gap-3 md:gap-5 ml-auto">
          {/* Alertas y Notificaciones */}
          {user && (
            <div className="flex items-center gap-1">
              {/* Alertas y Notificaciones solo para Admins */}
              {isAdmin && (
                <>
                  {/* NOTIFICACIONES (Aprobaciones/Info) */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => {
                        setShowNotifMenu(!showNotifMenu);
                        setShowAlertMenu(false);
                      }}
                      title="Notificaciones de Gestión"
                      className={`relative p-2 rounded-full transition-all ${showWhiteText
                        ? "text-white hover:bg-white/20"
                        : "text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                        }`}
                    >
                      <Bell size={20} />
                      {pendingCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                          {pendingCount}
                        </span>
                      )}
                    </button>

                    {/* DROPDOWN NOTIFICACIONES */}
                    {showNotifMenu && (
                      <div className="absolute right-0 mt-2 top-full w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[70] animate-fadeIn">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                          <h4 className="font-bold text-gray-800">
                            Notificaciones
                          </h4>
                          {pendingCount > 0 && (
                            <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                              {pendingCount} Pendientes
                            </span>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {pendingCount > 0 ? (
                            <Link
                              to="/administracion"
                              onClick={() => setShowNotifMenu(false)}
                              className="p-4 flex gap-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                            >
                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                <User size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">
                                  Atención Requerida
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Tienes {pendingCount} usuarios esperando
                                  revisión o suspendidos.
                                </p>
                                <p className="text-[10px] text-blue-600 font-bold mt-1">
                                  Ir a Centro de Aprobaciones →
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <div className="p-10 text-center">
                              <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Bell size={24} />
                              </div>
                              <p className="text-sm text-gray-400">
                                No tienes notificaciones pendientes.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ALERTAS DE SEGURIDAD (ShieldAlert) */}
                  <div className="relative" ref={alertRef}>
                    <button
                      onClick={() => {
                        setShowAlertMenu(!showAlertMenu);
                        setShowNotifMenu(false);
                      }}
                      title="Centro de Alertas de Seguridad"
                      className={`relative p-2 rounded-full transition-all ${showWhiteText
                        ? "text-white hover:bg-white/20"
                        : "text-gray-500 hover:bg-gray-100 hover:text-orange-600"
                        }`}
                    >
                      <ShieldAlert size={20} />
                      {alertCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                          {alertCount}
                        </span>
                      )}
                    </button>

                    {/* DROPDOWN ALERTAS */}
                    {showAlertMenu && (
                      <div className="absolute right-0 mt-2 top-full w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[70] animate-fadeIn focus:outline-none">
                        <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                          <h4 className="font-bold text-orange-800 flex items-center gap-2">
                            <ShieldAlert size={16} /> Seguridad
                          </h4>
                          {alertCount > 0 && (
                            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                              {alertCount} Alertas
                            </span>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {recentAlerts.length > 0 ? (
                            <>
                              <div className="divide-y divide-gray-50">
                                {recentAlerts.map((alerta, idx) => (
                                  <div
                                    key={idx}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                                  >
                                    <p className="text-xs font-bold text-gray-800 truncate">
                                      {alerta.description}
                                    </p>
                                    <div className="flex justify-between items-center mt-1">
                                      <span className="text-[10px] text-gray-400">
                                        {new Date(
                                          alerta.created_at
                                        ).toLocaleDateString()}
                                      </span>
                                      <span className="text-[9px] font-bold uppercase text-orange-500 bg-orange-50 px-1.5 rounded">
                                        {alerta.type}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <Link
                                to="/administracion"
                                onClick={() => setShowAlertMenu(false)}
                                className="block p-3 text-center text-xs font-bold text-orange-600 bg-orange-50/50 hover:bg-orange-50 transition-colors border-t border-orange-100"
                              >
                                Ver historial completo
                              </Link>
                            </>
                          ) : (
                            <div className="p-10 text-center">
                              <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ShieldAlert size={24} />
                              </div>
                              <p className="text-sm text-gray-400">
                                Todo se ve seguro por ahora.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Menú de Perfil (Solo si hay usuario) */}
          {user ? (
            <div
              className={`pl-4 border-l ${showWhiteText ? "border-white/30" : "border-gray-200"
                }`}
            >
              <ProfileDropdown
                user={user}
                logout={logout}
                showWhiteText={showWhiteText}
              />
            </div>
          ) : null}

          {/* HAMBURGER (Mobile - Right) */}
          <button
            className={`nav-mobile ml-2 hamburger ${mobileMenuOpen ? "active" : ""
              }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú móvil"
          >
            <div
              className={`hamburger-line ${showWhiteText ? "bg-white" : "bg-gray-800"
                }`}
            ></div>
            <div
              className={`hamburger-line ${showWhiteText ? "bg-white" : "bg-gray-800"
                }`}
            ></div>
            <div
              className={`hamburger-line ${showWhiteText ? "bg-white" : "bg-gray-800"
                }`}
            ></div>
          </button>
        </div>
      </header>

      {/* MENÚ MÓVIL */}
      {/* MENÚ MÓVIL */}
      {mobileMenuOpen &&
        createPortal(
          <div
            className="nav-mobile fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-100 flex justify-end">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <LogOut size={20} className="rotate-180" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                {isInternalPage && !isAfiliado ? (
                  /* Menú Móvil Dashboard (Solo visible en páginas internas/dashboard para no afiliados) */
                  <div className="flex flex-col gap-2">
                    {[
                      {
                        name: "Dashboard",
                        path: "/dashboard",
                        icon: LayoutDashboard,
                      },
                      {
                        name: "Documentos",
                        path: "/documentos",
                        icon: FileText,
                      },
                      { name: "Circularmente", path: "/companies", icon: Building },
                      {
                        name: "Formularios",
                        path: "/formularios",
                        icon: ClipboardList,
                      },
                      {
                        name: "Comunicaciones",
                        path: "/comunicaciones",
                        icon: MessageSquare,
                      },
                      isAdmin && {
                        name: "Administración",
                        path: "/administracion",
                        icon: Settings,
                      },
                    ]
                      .filter(Boolean)
                      .map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={handleMobileMenuClick}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors font-medium border-b border-gray-50 last:border-0"
                        >
                          <link.icon
                            size={20}
                            className="text-gray-400 group-hover:text-blue-600"
                          />
                          <span>{link.name}</span>
                        </Link>
                      ))}

                    {/* Separador */}
                    <div className="my-2 border-t border-gray-100"></div>

                    {/* Opción para volver al Home si se necesita */}
                    <Link
                      to="/"
                      onClick={handleMobileMenuClick}
                      className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-700 font-medium"
                    >
                      <Home size={20} className="text-gray-400" />
                      <span>Ir al Inicio</span>
                    </Link>
                  </div>
                ) : (
                  /* Menú Móvil Público */
                  menuSections.map((section) => (
                    section.path ? (
                      <Link
                        key={section.name}
                        to={section.path}
                        onClick={handleMobileMenuClick}
                        className={`block py-4 px-4 font-bold uppercase text-sm border-b border-gray-100 ${showWhiteText ? "text-white" : "text-gray-800"}`}
                      >
                        {section.name}
                      </Link>
                    ) : (
                      <MobileMenuDropdown
                        key={section.name}
                        title={section.name}
                        subsections={section.subsections}
                        showWhiteBg={true}
                        showHover={false}
                        showWhiteText={false}
                        onClose={handleMobileMenuClick}
                      />
                    )
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
