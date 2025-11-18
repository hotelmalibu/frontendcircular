import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoBlanco from "../assets/Logo_blanco.png";
import Logo from "../assets/Logo.png";
import DefaultAvatar from "../assets/default-avatar.png";
import { AlertCircle, Bell, User, LogOut, Home, Search, Shield, Handshake, Building, Gavel, Menu } from "lucide-react";



// Componente para mostrar el rol del usuario con colores e íconos del manual de marca
function UserRoleBadge({ role }) {
  const roleStyles = {
    Administrador: {
      icon: <Shield size={14} />,
      bg: "#1E305D",
      text: "#FFFFFF",
    },
    Empresa: {
      icon: <Building size={14} />,
      bg: "#00AB6D",
      text: "#FFFFFF",
    },
    Autoridades: {
      icon: <Gavel size={14} />,
      bg: "#E8AD00",
      text: "#1E305D",
    },
    Aliados: {
      icon: <Handshake size={14} />,
      bg: "#2C67B0",
      text: "#FFFFFF",
    },
    Ciudadanía: {
      icon: <User size={14} />,
      bg: "#B1D357",
      text: "#1E305D",
    },
  };

  const selected = roleStyles[role] || {
    icon: <User size={14} />,
    bg: "#E5E7EB",
    text: "#374151",
  };

  return (
    <p
      className="flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1 inline-flex shadow-sm transition-transform duration-200 hover:scale-105"
      style={{ backgroundColor: selected.bg, color: selected.text }}
    >
      {selected.icon}
      <span>{role}</span>
    </p>
  );
}



// Componente separado para el menú móvil anidado
function MobileMenuDropdown({ title, subsections, showWhiteBg, showHover, showWhiteText, onClose }) {
  const [open, setOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (idx) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left py-3 px-4 font-semibold uppercase text-sm transition-all flex justify-between items-center menu-underline ${
          open ? "active" : ""
        } ${
          // show white text on circular path when navbar transparent
          showWhiteText ? "text-white" : (showHover ? (showWhiteBg ? "text-gray-800 hover:text-[#00AB6D]" : "text-white hover:text-[#00AB6D]") : "text-gray-700")
        }`}
      >
        <span>{(title)}</span>
        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="pl-0 pb-0 space-y-0">
          {subsections.map((subsection, idx) => {
            
            // --- LÓGICA DE RUTA COMPLEJA ---
            let sectionPath;
            const titleLower = subsection.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w/-]/g, "");

            if (subsection.title === "Directorio") {
              sectionPath = "/circularmente/directorio";
            } else if (subsection.title === "Herramientas digitales") {
              sectionPath = "/circularmente/herramientas-digitales";
            } else if (subsection.title === "Micrositio") {
              sectionPath = "/circularmente";
            } else {
              // Intenta generar una ruta a partir del título, como en la versión anterior
              sectionPath = "/" + titleLower;
            }
            // --- FIN DE LÓGICA DE RUTA ---

            return (
              <div key={idx} className="border-t border-gray-300/50">
                {subsection.items.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(idx)}
                      className={`w-full text-left py-2 px-8 font-semibold uppercase text-xs transition-all flex justify-between items-center ${
                        showWhiteText ? "text-white" : (showHover ? (showWhiteBg ? "text-gray-700 hover:text-[#00AB6D]" : "text-gray-300 hover:text-[#00AB6D]") : "text-gray-700")
                      }`}
                    >
                      <span>{(subsection.title)}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${openSubmenus[idx] ? "rotate-180" : ""}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {openSubmenus[idx] && (
                      <div className="pl-4 pb-0 space-y-0 bg-gray-100/20">
                        {subsection.items.map((item, itemIdx) => {
                          const itemPath = "/" + item
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^\w/-]/g, "");
                          return (
                            <Link
                              key={itemIdx}
                              to={itemPath}
                              onClick={onClose}
                              className={`block py-2 px-12 text-xs transition-colors ${
                                showWhiteText ? "text-white" : (showHover ? (showWhiteBg ? "text-gray-600 hover:text-[#00AB6D]" : "text-gray-400 hover:text-[#00AB6D]") : "text-gray-700")
                              }`}
                            >
                              {item}
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
                    className={`block py-2 px-8 font-semibold uppercase text-xs transition-colors ${
                      showWhiteText ? "text-white" : (showWhiteBg ? "text-gray-700 hover:text-[#00AB6D]" : "text-gray-300 hover:text-[#00AB6D]")
                    }`}
                  >
                    {(subsection.title)}
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



// Componente para el mega menú desktop
function MegaMenuDropdown({ label, sections = [], showWhiteBg, showHover, showWhiteText, onOpenChange }) {
  const [open, setOpen] = useState(false);
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

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={`text-base lg:text-base font-semibold fontfamily-montserrat transition-all menu-underline pb-1 ${
          open ? "active" : ""
        } ${
          showWhiteText ? "text-white" : (showHover ? (showWhiteBg ? "text-gray-700 hover:text-[#00AB6D]" : "text-white hover:text-[#00AB6D]") : "text-gray-700")
        }`}
      >
        {(label)} 
      </button>

      <div
        className={`fixed left-0 right-0 top-full bg-gradient-to-b from-white to-gray-50 shadow-2xl transform transition-all duration-400 ${
          open
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <div className="h-1 bg-gradient-to-r from-[#00AB6D] via-[#2C67B0] to-[#1E305D]"></div>

        <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {sections.map((section, idx) => {
              
              // --- LÓGICA DE RUTA COMPLEJA ---
              let sectionPath;
              const titleLower = section.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w/-]/g, "");

              if (section.title === "Directorio") {
                sectionPath = "/circularmente/directorio";
              } else if (section.title === "Herramientas digitales") {
                sectionPath = "/circularmente/herramientas-digitales";
              } else if (section.title === "Micrositio") {
                sectionPath = "/circularmente";
              } else {
                sectionPath = "/" + titleLower;
              }
              // --- FIN DE LÓGICA DE RUTA ---

              return (
                <div 
                  key={idx} 
                  className="space-y-4 group/section"
                  style={{
                    animation: `slideInText 0.6s ease-out ${idx * 0.1}s both`
                  }}
                >
                  {section.items.length > 0 ? (
                    <h3 className={`font-bold ${showWhiteText ? 'text-white' : 'text-gray-900'} text-sm lg:text-base uppercase tracking-wide border-b-2 border-gray-200 pb-2 group-hover/section:border-[#00AB6D] transition-colors duration-300`}>
                      {section.title}
                    </h3>
                  ) : (
                    <Link
                      to={sectionPath}
                      className={`font-bold ${showWhiteText ? 'text-white' : 'text-gray-900'} text-sm lg:text-base uppercase tracking-wide border-b-2 border-gray-200 pb-2 block ${showHover ? 'hover:text-[#00AB6D]' : ''} transition-all duration-300`}
                    >
                      {section.title}
                    </Link>
                  )}

                  {section.items.length > 0 && (
                    <ul className="space-y-3">
                      {section.items.map((item, itemIdx) => {
                        const itemPath = "/" + item
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^\w/-]/g, "");
                        return (
                          <li 
                            key={itemIdx}
                            style={{
                              animation: `slideInText 0.6s ease-out ${idx * 0.1 + itemIdx * 0.05}s both`
                            }}
                          >
                            <Link
                              to={itemPath}
                              className={`${showWhiteText ? 'text-white' : 'text-gray-600'} ${showHover ? 'hover:text-[#00AB6D]' : ''} text-xs lg:text-sm transition-all duration-200 block py-1 font-medium ${showHover ? 'hover:translate-x-1' : ''}`}
                            >
                              {item}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00AB6D]/5 to-[#2C67B0]/5 rounded-full -z-10 pointer-events-none"></div>
      </div>
    </div>
  );
}



// Componente para el dropdown de perfil
function ProfileDropdown({ user, logout, showHover, showWhiteText }) {
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


  const userFullName = user?.name ? `${user.name} ${user.lastName || ''}`.trim() : 'Usuario';
  const userRole = user?.role || 'Sin rol';
  const userAvatar = user?.avatar || DefaultAvatar;
  
  // Rutas simplificadas a /dashboard (sin role en la URL) por el momento
  const isDashboardRoute = location.pathname === '/dashboard';
  const dashboardOrPortalPath = isDashboardRoute ? '/' : '/dashboard';
  const dashboardOrPortalLabel = isDashboardRoute ? 'Portal' : 'Dashboard';


  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Avatar clickeable */}
      <button
        type="button"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
      >
        <div className="text-right hidden sm:block">
          <p className={`text-xs md:text-sm font-semibold ${showWhiteText ? 'text-white' : 'text-gray-800'}`}>{userFullName}</p>
          <UserRoleBadge role={userRole} />
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-gray-300 group-hover:border-[#00AB6D] transition-colors bg-white flex items-center justify-center overflow-hidden">
          <img
            src={userAvatar}
            alt={userFullName}
            className="max-w-full max-h-full object-center object-contain"
            onError={(e) => (e.target.src = DefaultAvatar)}
          />
        </div>
      </button>


      {/* Dropdown menu */}
      <div
        className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg transform transition-all duration-300 z-40 ${
          open
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div className="py-2">
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-2 text-sm ${showWhiteText ? 'text-white' : 'text-gray-700'} hover:bg-gray-100 ${showHover ? 'hover:text-[#00AB6D]' : ''} transition-colors`}
          >
            <User size={16} />
            Mi Perfil
          </Link>
          <Link
            to={dashboardOrPortalPath}
            className={`flex items-center gap-3 px-4 py-2 text-sm ${showWhiteText ? 'text-white' : 'text-gray-700'} hover:bg-gray-100 ${showHover ? 'hover:text-[#00AB6D]' : ''} transition-colors`}
          >
            <Home size={16} />
            {dashboardOrPortalLabel}
          </Link>
          <hr className="my-2" />
          <button
            onClick={logout}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}



// Componente principal Navbar
export default function Navbar({ onMenuClick }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasOpenDropdown, setHasOpenDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount] = useState(23);
  const [alertCount] = useState(10);

const hideMenus = false;
const isPublicPage = location.pathname === '/';
const isDashboardView = user && isPublicPage && !scrolled && !isHovered && !hasOpenDropdown;
const isLogin = location.pathname === "/login";
const isRegister = location.pathname === "/register";
const isDashboard = location.pathname.startsWith("/dashboard");

// Mostrar estilos hover solo en la vista welcome (/)
const showHover = isPublicPage;

// Mostrar el botón "Registrarse" en estilo color (verde) cuando se usa el logo color.
// Logo color se muestra cuando NO estamos en la vista welcome sin interacción.
const showColoredRegister = !(isPublicPage && !scrolled && !isHovered && !hasOpenDropdown);

// NUEVA LÓGICA - Navbar blanco en Login/Register
const isAuthPage = isLogin || isRegister;

const showWhiteBg = isAuthPage
  ? true
  : (user && isPublicPage && !scrolled && !isHovered && !hasOpenDropdown
    ? false
    : (isDashboardView ? false : (user ? true : (scrolled || isHovered || hasOpenDropdown))));

// Si estamos en /circularmente y la navbar está transparente (no showWhiteBg), forzamos texto blanco y logo blanco
const isCircularPath = location.pathname.startsWith('/circularmente');
const showWhiteText = isCircularPath && !showWhiteBg;

// Logo: color logo on all pages except the public welcome view when not scrolled/hovered/open
const currentLogo = isAuthPage
  ? Logo
  : (showWhiteText ? LogoBlanco : (isPublicPage && !scrolled && !isHovered && !hasOpenDropdown ? LogoBlanco : Logo));



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

  // (moved) - declarations for auth and logo logic are declared earlier to avoid TDZ

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
            "Quiénes somos",
            "Portal de transparencia",
            "Estatutos",
            "Valores",
            "Presidencia",
            "Aliados",
            "Informes anuales"
          ]
        },
        {
          title: "Marco Normativo",
          items: [
            "Resoluciones",
            "Planes",
            "Políticas"
          ]
        }
      ]
    },
    {
      name: "Nuestro Trabajo",
      subsections: [
        {
          title: "Proyectos y alianzas",
          items: [
            "Proyectos activos",
            "Sectoriales",
            "Territoriales",
            "Inclusión Social",
            "Casos de éxito",
            "Convocatorias"
          ]
        },
        {
          title: "Líneas estratégicas",
          items: [
            "Cadenas de valor",
            "Innovación",
            "Inclusión Social y Productiva",
            "Proyectos estratégico",
            "Consumo Responsable"
          ]
        },
        {
          title: "Sectores",
          items: []
        },
        {
          title: "e-learning",
          items: [
            "Cursos",
            "Certificaciones",
            "Financiamiento del reciclaje"
          ]
        }
      ]
    },
    {
        name: "Circularmente",
      subsections: [
        {
          title: "Micrositio",
          items: [] 
        },
        {
            title: "Directorio",
            items: []
          },
          {
            title: "Herramientas digitales",
            items: []
          }
        
        ]
      }
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 ${user ? '' : 'transition-all duration-500 ease-in-out'} ${
        user ? 'translate-y-0 opacity-100' : (visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0")
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        @keyframes slideInText {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes hamburgerTop {
          from {
            transform: rotate(0deg) translateY(0);
          }
          to {
            transform: rotate(45deg) translateY(10px);
          }
        }

        @keyframes hamburgerBottom {
          from {
            transform: rotate(0deg) translateY(0);
          }
          to {
            transform: rotate(-45deg) translateY(-10px);
          }
        }

        @keyframes hamburgerMiddle {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .slide-in {
          animation: slideInText 0.6s ease-out;
        }

        .menu-underline {
            position: relative;
            display: inline-block;
            border-bottom: 2px solid;
            border-bottom-color: ${showWhiteBg ? 'transparent' : '#00AB6D'} !important; 
        }

        .menu-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #00AB6D;
          transition: width 0.3s ease;
        }

        .menu-underline:hover::after,
        .menu-underline.active::after {
          width: 100%;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
        }

        .hamburger-line {
          width: 25px;
          height: 3px;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .hamburger.active .hamburger-line:nth-child(1) {
          animation: hamburgerTop 0.3s ease forwards;
          background-color: #00AB6D;
        }

        .hamburger.active .hamburger-line:nth-child(2) {
          animation: hamburgerMiddle 0.3s ease forwards;
          background-color: #00AB6D;
        }

        .hamburger.active .hamburger-line:nth-child(3) {
          animation: hamburgerBottom 0.3s ease forwards;
          background-color: #00AB6D;
        }

        @media (max-width: 768px) {
          .nav-desktop {
            display: none;
          }
        }

        @media (min-width: 769px) {
          .nav-mobile {
            display: none;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <header
        className={`flex items-center justify-between px-4 md:px-24 py-4 transition-all duration-300 ${
        isDashboardView
          ? "bg-transparent"
          : user
          ? "bg-white shadow-lg"
          : (showWhiteBg ? "bg-white/95 shadow-lg" : "bg-transparent")
}`}
      >
        {/* HAMBURGER MENU - Izquierda */}
        {user && isPublicPage && (
          <button
            onClick={onMenuClick}
            className="md:hidden text-white hover:text-gray-200 transition-colors mr-4"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        )}

        {/* LOGO - APLICAMOS ML-4/MD:ML-8 */}
        <div className="flex items-center slide-in ml-4 md:ml-11">
          <Link to="/" className="flex items-center hover:scale-105 transition-transform duration-300">
            <img
              src={currentLogo}
              alt="Visión Circular"
              className="h-12 md:h-[80px] w-auto object-contain"
            />
          </Link>
        </div>

        {/* BUSCADOR - Solo con login */}
        {(user && isPublicPage) || location.pathname.startsWith("/dashboard") && (
          <div className="flex-1 flex mx-8 hidden md:block">
            <div className="relative w-full max-w-lg ml-auto">
              <button className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${showHover ? 'hover:text-[#00AB6D]' : ''}`}>
                <Search size={18} />
              </button>
              <input
                type="text"
                placeholder="Búsqueda Global"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 rounded-full border text-sm focus:outline-none focus:border-[#00AB6D] transition-all ${
                  isDashboardView
                    ? "bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
                    : "bg-gray-100 border-gray-300 text-gray-700 placeholder-gray-500"
                }`}
              />
            </div>
          </div>
        )}

        {/* MENÚ DESKTOP - Reducimos el margen izquierdo del NAV a mx-4 para compensar el logo */}
          {(!user || (user && !location.pathname.startsWith("/dashboard"))) && (
            <nav className="nav-desktop flex items-center gap-8 lg:gap-20 flex-1 justify-center mx-4">
              {menuSections.map((section) => (
                <MegaMenuDropdown
                  key={section.name}
                  label={section.name}
                  sections={section.subsections}
                  showWhiteBg={showWhiteBg}
                  showHover={isPublicPage}
                  showWhiteText={showWhiteText}
                  onOpenChange={setHasOpenDropdown}
                />
              ))}
            </nav>
          )}


        {/* BOTONES Y USUARIO - DERECHA */}
        <div className="flex items-center gap-3 md:gap-4 ml-auto">
          {user ? (
            <>
              {/* CUANDO ESTÁ LOGUEADO */}
              {(isPublicPage || location.pathname.startsWith("/dashboard")) && (
                <>
                  <button className={`hover:opacity-80 text-white px-2 md:px-3 py-2 rounded-2xl text-xs md:text-sm transition-all flex items-center gap-2 font-medium relative ${
                    isDashboardView
                      ? "bg-white/20 hover:bg-white/30"
                      : "bg-[#006F63] hover:bg-[#008B76]"
                  }`}>
                    <AlertCircle size={16} />
                    <span className="hidden sm:inline">Alertas</span>
                    {alertCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {alertCount}
                      </span>
                    )}
                  </button>
                  <button className={`hover:opacity-80 text-white px-2 md:px-3 py-2 rounded-2xl text-xs md:text-sm transition-all flex items-center gap-2 font-medium relative ${
                    isDashboardView
                      ? "bg-white/20 hover:bg-white/30"
                      : "bg-[#006F63] hover:bg-[#008B76]"
                  }`}>
                    <Bell size={16} />
                    <span className="hidden sm:inline">Notificaciones</span>
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* PROFILE DROPDOWN */}
              <ProfileDropdown user={user} logout={logout} showHover={showHover} showWhiteText={showWhiteText} />
            </>
          ) : (
            <>
              {/* CUANDO NO ESTÁ LOGUEADO */}
              <Link
                to="/login"
                className={`px-2 md:px-4 py-2 text-xs md:text-sm rounded-full transition-all font-medium ${
                  showWhiteBg
                    ? "bg-[#004b72] text-white hover:bg-[#003a54]"
                    : "bg-[#004b72] text-white hover:bg-[#005d8a]"
                }`}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className={`px-2 md:px-4 py-2 rounded-full text-xs md:text-sm transition-all font-semibold hover:scale-105 duration-300 ${
                  showColoredRegister
                    ? "bg-[#00AB6D] text-white hover:bg-[#009a5e]"
                    : "bg-white text-[#00AB6D] hover:shadow-lg"
                }`}
              >
                Registrarse
              </Link>
            </>
          )}

          {/* HAMBURGER */}
          <button
            className={`nav-mobile ml-4 hamburger ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú móvil"
          >
            <div className={`hamburger-line ${showWhiteBg ? "bg-gray-700" : "bg-white"}`}></div>
            <div className={`hamburger-line ${showWhiteBg ? "bg-gray-700" : "bg-white"}`}></div>
            <div className={`hamburger-line ${showWhiteBg ? "bg-gray-700" : "bg-white"}`}></div>
          </button>
        </div>
      </header>

      {/* MENÚ MÓVIL */}
      {mobileMenuOpen && !hideMenus && (
        <div className={`nav-mobile fixed left-0 right-0 top-20 transition-all duration-300 max-h-[calc(100vh-80px)] overflow-y-auto ${
          showWhiteBg ? "bg-white/95 shadow-lg" : "bg-gray-900/95"
        }`}>
          <nav className="container mx-auto px-4 py-6 space-y-0">
            {menuSections.map((section) => (
              <MobileMenuDropdown
                key={section.name}
                title={section.name}
                subsections={section.subsections}
                showWhiteBg={showWhiteBg}
                showHover={isPublicPage}
                showWhiteText={showWhiteText}
                onClose={handleMobileMenuClick}
              />
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
