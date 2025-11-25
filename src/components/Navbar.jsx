import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoBlanco from "../assets/Logo_blanco.png";
import Logo from "../assets/Logo.png";
import DefaultAvatar from "../assets/default-avatar.png";
// Nota: Puedes eliminar Building y Gavel de las importaciones si ya no las usarás en ningún otro lado, 
// pero las dejo aquí para evitar errores si las mueves a otro sitio.
import { User, LogOut, Home, Shield, Handshake, Building, Gavel, Menu, ChevronDown, Bell, MessageSquare } from "lucide-react";

// --- COMPONENTES AUXILIARES (Badge, Menús) ---

function UserRoleBadge({ role }) {
  // CONFIGURACIÓN DE ROLES ACTUALIZADA: Solo Administrador y Aliados
  const roleStyles = {
    Administrador: { icon: <Shield size={14} />, bg: "#1E305D", text: "#FFFFFF" },
    Aliados: { icon: <Handshake size={14} />, bg: "#2C67B0", text: "#FFFFFF" },
  };

  // Si el rol no es Administrador ni Aliados, usará el estilo gris por defecto (Default)
  const selected = roleStyles[role] || { icon: <User size={14} />, bg: "#E5E7EB", text: "#374151" };

  return (
    <p className="flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1 inline-flex shadow-sm transition-transform duration-200 hover:scale-105" style={{ backgroundColor: selected.bg, color: selected.text }}>
      {selected.icon} <span>{role}</span>
    </p>
  );
}

function MobileMenuDropdown({ title, subsections, showWhiteBg, showHover, showWhiteText, onClose }) {
  const [open, setOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [openSubSubmenus, setOpenSubSubmenus] = useState({});

  const toggleSubmenu = (idx) => {
    setOpenSubmenus(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleSubSubmenu = (parentIdx, itemIdx) => {
    const key = `${parentIdx}-${itemIdx}`;
    setOpenSubSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left py-3 px-4 font-semibold uppercase text-sm transition-all flex justify-between items-center menu-underline ${open ? "active" : ""} ${showWhiteText ? "text-white" : (showHover ? (showWhiteBg ? "text-gray-800 hover:text-[#00AB6D]" : "text-white hover:text-[#00AB6D]") : "text-gray-700")}`}
      >
        <span>{title}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="pl-0 pb-0 space-y-0">
          {subsections.map((subsection, idx) => {
            const sectionPath = subsection.path || "#";

            return (
              <div key={idx} className="border-t border-gray-300/50">
                {subsection.items && subsection.items.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(idx)}
                      className={`w-full text-left py-2 px-8 font-semibold uppercase text-xs transition-all flex justify-between items-center ${showWhiteText ? "text-white" : (showHover ? (showWhiteBg ? "text-gray-700 hover:text-[#00AB6D]" : "text-gray-300 hover:text-[#00AB6D]") : "text-gray-700")}`}
                    >
                      <span>{subsection.title}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openSubmenus[idx] ? "rotate-180" : ""}`} />
                    </button>
                    
                    {openSubmenus[idx] && (
                      <div className="pl-4 pb-0 space-y-0 bg-gray-100/20">
                        {subsection.items.map((item, itemIdx) => {
                          if (item.subItems && item.subItems.length > 0) {
                            const subKey = `${idx}-${itemIdx}`;
                            return (
                              <div key={itemIdx}>
                                <button
                                  onClick={() => toggleSubSubmenu(idx, itemIdx)}
                                  className={`w-full text-left py-2 px-12 text-xs flex justify-between items-center transition-colors ${showWhiteText ? "text-white" : (showHover ? (showWhiteBg ? "text-gray-600 hover:text-[#00AB6D]" : "text-gray-400 hover:text-[#00AB6D]") : "text-gray-700")}`}
                                >
                                  <span>{item.label}</span>
                                  <ChevronDown className={`w-3 h-3 transition-transform ${openSubSubmenus[subKey] ? "rotate-180" : ""}`} />
                                </button>
                                {openSubSubmenus[subKey] && (
                                  <div className="pl-4 bg-gray-200/20">
                                    {item.subItems.map((subItem, subIdx) => (
                                      <Link
                                        key={subIdx}
                                        to={subItem.path}
                                        onClick={onClose}
                                        className={`block py-2 px-16 text-[10px] uppercase tracking-wider transition-colors ${showWhiteText ? "text-gray-300" : "text-gray-500 hover:text-[#00AB6D]"}`}
                                      >
                                        {subItem.label}
                                      </Link>
                                    ))}
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
                              className={`block py-2 px-12 text-xs transition-colors ${showWhiteText ? "text-white" : (showHover ? (showWhiteBg ? "text-gray-600 hover:text-[#00AB6D]" : "text-gray-400 hover:text-[#00AB6D]") : "text-gray-700")}`}
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
                    className={`block py-2 px-8 font-semibold uppercase text-xs transition-colors ${showWhiteText ? "text-white" : (showWhiteBg ? "text-gray-700 hover:text-[#00AB6D]" : "text-gray-300 hover:text-[#00AB6D]")}`}
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

function MegaMenuDropdown({ label, sections = [], showWhiteBg, showHover, showWhiteText, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const handleMouseEnter = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); onOpenChange(true); };
  const handleMouseLeave = () => { timeoutRef.current = setTimeout(() => { setOpen(false); onOpenChange(false); }, 300); };
  useEffect(() => { return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }; }, []);

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button type="button" className={`text-base lg:text-base font-semibold fontfamily-montserrat transition-all menu-underline pb-1 ${open ? "active" : ""} ${showWhiteText ? "text-white" : (showHover ? (showWhiteBg ? "text-gray-700 hover:text-[#00AB6D]" : "text-white hover:text-[#00AB6D]") : "text-gray-700")}`}>
        {label}
      </button>
      <div className={`fixed left-0 right-0 top-full bg-gradient-to-b from-white to-gray-50 shadow-2xl transform transition-all duration-400 ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"}`}>
        <div className="h-1 bg-gradient-to-r from-[#00AB6D] via-[#2C67B0] to-[#1E305D]"></div>
        <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-start">
            {sections.map((section, idx) => {
              const sectionPath = section.path || "#";
              return (
                <div key={idx} className="space-y-4 group/section" style={{ animation: `slideInText 0.6s ease-out ${idx * 0.1}s both` }}>
                  {section.items && section.items.length > 0 ? (
                    <h3 className={`font-bold ${showWhiteText ? 'text-white' : 'text-gray-900'} text-sm lg:text-base uppercase tracking-wide border-b-2 border-gray-200 pb-2 group-hover/section:border-[#00AB6D] transition-colors duration-300`}>
                      {section.title}
                    </h3>
                  ) : (
                    <Link to={sectionPath} className={`font-bold ${showWhiteText ? 'text-white' : 'text-gray-900'} text-sm lg:text-base uppercase tracking-wide border-b-2 border-gray-200 pb-2 block ${showHover ? 'hover:text-[#00AB6D]' : ''} transition-all duration-300`}>
                      {section.title}
                    </Link>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-2">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="group/item relative"> 
                          {item.subItems && item.subItems.length > 0 ? (
                            <div className="w-full">
                              <button className={`w-full text-left flex items-center justify-between ${showWhiteText ? 'text-white' : 'text-gray-600'} ${showHover ? 'hover:text-[#00AB6D]' : ''} text-xs lg:text-sm transition-all duration-200 py-1 font-medium`}>
                                <span>{item.label}</span>
                                <ChevronDown size={14} className="text-[#00AB6D] transition-transform duration-300 group-hover/item:-rotate-180" />
                              </button>
                              <div className="overflow-hidden max-h-0 opacity-0 group-hover/item:max-h-[500px] group-hover/item:opacity-100 transition-all duration-500 ease-in-out">
                                <ul className="pl-3 mt-1 space-y-2 border-l-2 border-[#00AB6D]/30 ml-1 py-1">
                                  {item.subItems.map((sub, subIdx) => (
                                    <li key={subIdx}>
                                      <Link to={sub.path} className="block text-xs text-gray-500 hover:text-[#00AB6D] hover:translate-x-1 transition-all py-1">
                                        {sub.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <Link to={item.path} className={`${showWhiteText ? 'text-white' : 'text-gray-600'} ${showHover ? 'hover:text-[#00AB6D]' : ''} text-xs lg:text-sm transition-all duration-200 block py-1 font-medium ${showHover ? 'hover:translate-x-1' : ''}`}>
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

function ProfileDropdown({ user, logout, showHover, showWhiteText }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const handleMouseEnter = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); };
  const handleMouseLeave = () => { timeoutRef.current = setTimeout(() => { setOpen(false); }, 300); };
  const userFullName = user?.name ? `${user.name} ${user.lastName || ''}`.trim() : 'Usuario';
  const userRole = user?.role || 'Sin rol';
  const userAvatar = user?.avatar || DefaultAvatar;
  const isDashboardRoute = location.pathname === '/dashboard';
  const dashboardOrPortalPath = isDashboardRoute ? '/' : '/dashboard';
  const dashboardOrPortalLabel = isDashboardRoute ? 'Portal' : 'Dashboard';

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button type="button" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
        <div className="text-right hidden sm:block">
          <p className={`text-xs md:text-sm font-semibold ${showWhiteText ? 'text-white' : 'text-gray-800'}`}>{userFullName}</p>
          <UserRoleBadge role={userRole} />
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-gray-300 group-hover:border-[#00AB6D] transition-colors bg-white flex items-center justify-center overflow-hidden">
          <img src={userAvatar} alt={userFullName} className="max-w-full max-h-full object-center object-contain" onError={(e) => (e.target.src = DefaultAvatar)} />
        </div>
      </button>
      <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg transform transition-all duration-300 z-40 ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
        <div className="py-2">
          <Link to="/profile" className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#00AB6D] transition-colors`}>
            <User size={16} /> Mi Perfil
          </Link>
          <Link to={dashboardOrPortalPath} className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#00AB6D] transition-colors`}>
            <Home size={16} /> {dashboardOrPortalLabel}
          </Link>
          <hr className="my-2" />
          <button onClick={logout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium">
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
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasOpenDropdown, setHasOpenDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [scrollDirection, setScrollDirection] = useState("up");

  // --- LÓGICA DE VISIBILIDAD Y ESTILOS ---
  const hideMenus = false;
  const isPublicPage = location.pathname === '/';
  
  // Rutas que se comportan como "Internas/Dashboard" (ocultan el menú público y usan layout limpio)
  const internalPaths = ["/dashboard", "/documentos", "/seguimiento", "/formularios", "/comunicaciones", "/administracion", "/integracion"];
  const isInternalPage = user && internalPaths.some(path => location.pathname.startsWith(path));

 
  const transparentPaths = [
    '/circularmente',
    '/explorar',
    '/contenido',
    '/proyectos/'
  ];

  // Comprobamos si la ruta actual empieza con alguna de las definidas arriba
  const isTransparentNavPath = transparentPaths.some(path => location.pathname.startsWith(path));

  const isInteracted = scrolled || isHovered || hasOpenDropdown || mobileMenuOpen;
  
  // DashboardView (Home logueado sin scroll) - Fondo transparente
  const isDashboardView = (user && isPublicPage && !isInteracted);

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isAuthPage = isLogin || isRegister;
  const showHover = isPublicPage || isTransparentNavPath;

  let showWhiteBg;
  if (isAuthPage) {
    showWhiteBg = true;
  } else if (isTransparentNavPath) {
    showWhiteBg = isInteracted;
  } else if (isDashboardView) {
    showWhiteBg = false;
  } else {
    // Para Home Page público sin usuario: si no hay interacción, es transparente.
    if (user) {
      showWhiteBg = true; 
    } else {
      showWhiteBg = isInteracted;
    }
  }

  const showWhiteText = ((isTransparentNavPath || isPublicPage) && !showWhiteBg);

  // Logo a mostrar
  const currentLogo = isAuthPage
    ? Logo
    : (showWhiteText ? LogoBlanco : Logo);

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
            { 
              label: "Líneas estratégicas", 
              path: "#",
              subItems: [
                { label: "Cadenas de valor", path: "/cadenas-de-valor" },
                { label: "Innovación", path: "/innovacin" },
                { label: "Inclusión Social y Productiva", path: "/inclusin-social-y-productiva" },
                { label: "Proyectos estratégico", path: "/proyectos-estratgico  " },
                { label: "Consumo Responsable", path: "/consumo-responsable" },
                { label: "Pedagogía", path: "/pedagogia" }
              ]
            },
            { label: "Junta Directiva - Equipo", path: "/juntaDirecteEquipo" },
            { label: "Informes", path: "/informes-anuales" },
          ]
        },
        {
          title: "Marco Normativo",
          items: [
            { label: "Resoluciones", path: "/resoluciones" },
            { label: "Planes", path: "/planes" },
            { label: "Políticas", path: "/polticas" },
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
            { label: "Proyectos activos", path: "/proyectos-activos" },
            { label: "Sectoriales", path: "/sectoriales" },
            { label: "Territoriales", path: "/territoriales" },
            { label: "Inclusión Social", path: "/inclusion-social" },
            { label: "Casos de éxito", path: "/casos-de-exito" },
            { label: "Convocatorias", path: "/convocatorias" }
          ]
        },
        {
          title: "Sectores",
          items: [],
          path: "/sectores"
        },
        {
          title: "e-learning",
          items: [
            { label: "Cursos", path: "/cursos" },
            { label: "Certificaciones", path: "/certificaciones" },
            { label: "Financiamiento del reciclaje", path: "/financiamiento-del-reciclaje" }
          ]
        }
      ]
    },
    {
      name: "Circularmente",
      subsections: [
        { title: "Micrositio", path: "/circularmente", items: [] },
        { title: "Directorio", path: "/circularmente/directorio", items: [] },
        { title: "Herramientas digitales", path: "/circularmente/herramientas-digitales", items: [] }
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
        @keyframes slideInText { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes hamburgerTop { from { transform: rotate(0deg) translateY(0); } to { transform: rotate(45deg) translateY(10px); } }
        @keyframes hamburgerBottom { from { transform: rotate(0deg) translateY(0); } to { transform: rotate(-45deg) translateY(-10px); } }
        @keyframes hamburgerMiddle { from { opacity: 1; } to { opacity: 0; } }
        .slide-in { animation: slideInText 0.6s ease-out; }
        .menu-underline { position: relative; display: inline-block; border-bottom: 2px solid; border-bottom-color: ${showWhiteBg ? 'transparent' : '#00AB6D'} !important; }
        .menu-underline::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background-color: #00AB6D; transition: width 0.3s ease; }
        .menu-underline:hover::after, .menu-underline.active::after { width: 100%; }
        .hamburger { display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
        .hamburger-line { width: 25px; height: 3px; transition: all 0.3s ease; border-radius: 2px; }
        .hamburger.active .hamburger-line:nth-child(1) { animation: hamburgerTop 0.3s ease forwards; background-color: #00AB6D; }
        .hamburger.active .hamburger-line:nth-child(2) { animation: hamburgerMiddle 0.3s ease forwards; background-color: #00AB6D; }
        .hamburger.active .hamburger-line:nth-child(3) { animation: hamburgerBottom 0.3s ease forwards; background-color: #00AB6D; }
        @media (max-width: 768px) { .nav-desktop { display: none; } }
        @media (min-width: 769px) { .nav-mobile { display: none; } }
      `}</style>

      {/* NAVBAR HEADER */}
      <header className={`flex items-center justify-between px-4 md:px-24 py-4 transition-all duration-300 ${!showWhiteBg ? "bg-transparent" : "bg-white shadow-lg"}`}>
        
        {/* HAMBURGER MENU - Izquierda (Móvil) */}
        {user && isPublicPage && (
          <button onClick={onMenuClick} className="md:hidden text-white hover:text-gray-200 transition-colors mr-4" aria-label="Abrir menú">
            <Menu size={24} />
          </button>
        )}

        {/* LOGO */}
        <div className="flex items-center slide-in ml-4 md:ml-11">
          <Link to="/" className="flex items-center hover:scale-105 transition-transform duration-300">
            <img src={currentLogo} alt="Visión Circular" className="h-12 md:h-[80px] w-auto object-contain" />
          </Link>
        </div>

        {/* Espaciador flexible si no hay menú desktop */}
        {!(!user || (user && !isInternalPage)) && <div className="flex-1"></div>}

        {/* MENÚ DESKTOP (Solo visible si NO estamos en las vistas Internas/Dashboard) */}
        {(!user || (user && !isInternalPage)) && (
          <nav className="nav-desktop flex items-center gap-8 lg:gap-20 flex-1 justify-center mx-4">
            {menuSections.map((section) => (
              <MegaMenuDropdown key={section.name} label={section.name} sections={section.subsections} showWhiteBg={showWhiteBg} showHover={isPublicPage || isTransparentNavPath} showWhiteText={showWhiteText} onOpenChange={setHasOpenDropdown} />
            ))}
          </nav>
        )}

        {/* BOTONES Y USUARIO */}
        <div className="flex items-center gap-3 md:gap-4 ml-auto">
          
          {/* BOTONES DE ALERTAS Y NOTIFICACIONES (Solo logueado) */}
          {user && (
            <div className="flex items-center gap-2 mr-2">
              <button className={`relative p-2 rounded-full transition-all ${showWhiteText ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100 hover:text-[#00AB6D]'}`}>
                <Bell size={20} />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button className={`p-2 rounded-full transition-all ${showWhiteText ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100 hover:text-[#00AB6D]'}`}>
                <MessageSquare size={20} />
              </button>
            </div>
          )}

          {user ? (
            <>
              <ProfileDropdown user={user} logout={logout} showHover={showHover} showWhiteText={showWhiteText} />
            </>
          ) : (
            <></>
          )}

          {/* HAMBURGER (Menú móvil derecho) - Solo visible si NO es página interna */}
          {!isInternalPage && (
            <button className={`nav-mobile ml-4 hamburger ${mobileMenuOpen ? "active" : ""}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menú móvil">
              <div className={`hamburger-line ${showWhiteText ? "bg-white" : "bg-gray-700"}`}></div>
              <div className={`hamburger-line ${showWhiteText ? "bg-white" : "bg-gray-700"}`}></div>
              <div className={`hamburger-line ${showWhiteText ? "bg-white" : "bg-gray-700"}`}></div>
            </button>
          )}
        </div>
      </header>

      {/* MENÚ MÓVIL (Solo si NO es página interna) */}
      {mobileMenuOpen && !hideMenus && !isInternalPage && (
        <div className={`nav-mobile fixed left-0 right-0 top-20 transition-all duration-300 max-h-[calc(100vh-80px)] overflow-y-auto ${showWhiteBg ? "bg-white/95 shadow-lg" : "bg-gray-900/95"}`}>
          <nav className="container mx-auto px-4 py-6 space-y-0">
            {menuSections.map((section) => (
              <MobileMenuDropdown key={section.name} title={section.name} subsections={section.subsections} showWhiteBg={showWhiteBg} showHover={isPublicPage} showWhiteText={showWhiteText} onClose={handleMobileMenuClick} />
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}