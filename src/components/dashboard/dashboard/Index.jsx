import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Undexsub from "./subcomponentes/Undexsub";
import UndexAfiliado from "./subcomponentes/UndexAfiliado";
import { ShieldCheck, Bell, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  lightBlue: "#7FB8D9",  // Azul Claro
  lime: "#B1D357",       // Verde Lima
  green: "#00AB6D",      // Verde Principal
};

export default function Index() {
  const { user } = useContext(AuthContext);
  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  const [suspendedUsersCount, setSuspendedUsersCount] = useState(0);

  // Definiciones de estado de usuario
  // Definiciones de estado de usuario
  const isAfiliado = user?.role_slug === 'afiliado' || 
                     user?.role_slug === 'afiliados' ||
                     user?.role?.toLowerCase().includes('afiliado');
  const hasDashboardPermission = user?.permissions?.includes('view.dashboard');
  const hasSupportPermission = user?.permissions?.includes('view.support');
  const hasAnyPermission = user?.permissions && user.permissions.length > 0;

  // Cargar datos contextuales para usuarios con permisos específicos
  useEffect(() => {
    if (hasSupportPermission && !hasDashboardPermission) {
      const fetchCounts = async () => {
        try {
          const { getUsers } = await import("../../../api/auth");
          // Obtenemos una lista para filtrar localmente de forma inclusiva
          const res = await getUsers({ per_page: 100 }).catch(() => ({ data: [] }));
          const items = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.items || []);

          const pending = items.filter(u => 
            u.status?.toLowerCase() === 'pending' || 
            u.status?.toLowerCase() === 'pendiente'
          ).length;

          const suspended = items.filter(u => 
            u.status?.toLowerCase() === 'suspended' || 
            u.status?.toLowerCase() === 'suspendido' ||
            u.status?.toLowerCase() === 'suspendida'
          ).length;

          setPendingUsersCount(pending);
          setSuspendedUsersCount(suspended);
        } catch (e) {
          console.error("Error al cargar contadores de Dashboard:", e);
        }
      };

      fetchCounts();
    }
  }, [hasSupportPermission, hasDashboardPermission]);

  // Mapeo de traducciones y descripciones para permisos
  const permissionMetadata = {
    'view.support': {
      title: 'GESTIÓN DE SOPORTE',
      desc: 'Gestión de registros y aprobaciones de acceso.',
      notifs: [
        { label: 'Pendientes de revisión', count: pendingUsersCount, color: 'text-orange-600' },
        { label: 'Usuarios suspendidos', count: suspendedUsersCount, color: 'text-red-600' }
      ],
      link: '/soporte'
    },
    'view.documents': {
      title: 'CENTRO DE DOCUMENTOS',
      desc: 'Acceso y gestión de la biblioteca de documentos.',
      link: '/documentos'
    },
    'view.circularmente': {
      title: 'CIRCULARMENTE',
      desc: 'Visualización de empresas y encadenamientos.',
      link: '/companies'
    },
    'view.forms': {
      title: 'FORMULARIOS',
      desc: 'Gestión de encuestas y recolección de datos.',
      link: '/formularios'
    },
    'view.communications': {
      title: 'COMUNICACIONES',
      desc: 'Gestión de noticias y comunicados.',
      link: '/comunicaciones'
    },
    'view.admin': {
      title: 'ADMINISTRACIÓN SISTEMA',
      desc: 'Configuración global y gestión de roles.',
      link: '/administracion'
    }
  };

  // 1. Si es Afiliado, SIEMPRE muestra su dashboard específico (UndexAfiliado)
  // Esto tiene prioridad sobre cualquier otro permiso para este rol específico.
  if (isAfiliado) {
    return <UndexAfiliado />;
  }

  // 2. Si tiene el permiso explícito de Dashboard (Admin), ve la vista administrativa
  if (hasDashboardPermission) {
    return <Undexsub />;
  }

  // 2. Si tiene otros permisos (pero no el de dashboard) o no es un afiliado estándar,
  // mostramos una pantalla de bienvenida neutra para que use el menú lateral.
  if (hasAnyPermission || !isAfiliado) {
    return (
      <>
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between w-full max-w-7xl mb-8 p-6 lg:p-8 bg-white rounded-3xl border border-gray-100 shadow-sm gap-6 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-6 text-center lg:text-left">
            <div className="p-3 rounded-2xl shadow-sm flex-shrink-0" style={{ backgroundColor: `${BRAND.blue}15`, color: BRAND.blue }}>
              <ShieldCheck size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Panel de Control</h2>
              <p className="text-gray-500 text-sm font-medium">
                Hola, <span className="font-bold" style={{ color: BRAND.blue }}>{user?.name}</span>. Tienes acceso a los siguientes módulos y notificaciones:
              </p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-full text-[10px] text-gray-400 font-black tracking-widest uppercase border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Sesión Activa
          </div>
        </div>

        {/* Visualización de Permisos Mejorada en Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {user?.permissions?.map((permSlug) => {
            const meta = permissionMetadata[permSlug] || {
              title: permSlug.replace('view.', '').replace('.', ' ').toUpperCase(),
              desc: 'Acceso habilitado según tu perfil de usuario.'
            };

            return (
              <div 
                key={permSlug}
                className="group flex flex-col p-6 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-xl text-left relative overflow-hidden"
                style={{ "--hover-border": BRAND.blue }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:text-white transition-all duration-300" 
                    style={{ color: BRAND.blue }}
                  >
                    <ShieldCheck size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-gray-800 tracking-wider transition-colors" style={{ color: "inherit" }}>
                      {meta.title}
                    </h4>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {meta.desc}
                </p>

                {meta.notifs ? (
                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
                    {meta.notifs.map((n, idx) => n.count > 0 && (
                      <div key={idx} className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <Bell size={14} className={n.color} />
                            <span className={`text-xs font-bold ${n.color}`}>
                              {n.count} {n.label}
                            </span>
                         </div>
                      </div>
                    ))}
                    {meta.link && (
                      <Link to={meta.link} className="self-end mt-2 p-2 rounded-lg bg-white shadow-sm transition-all hover:opacity-80" style={{ color: BRAND.blue }}>
                        <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                ) : (
                  meta.link && (
                    <Link to={meta.link} className="mt-auto flex items-center gap-1.5 text-xs font-bold transition-colors group/link hover:opacity-80" style={{ color: BRAND.blue }}>
                      Ir a la sección <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  )
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full text-xs text-gray-400 font-bold tracking-widest uppercase border border-gray-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Usa el menú lateral para navegar
        </div>
      </>
    );
  }

  // 3. Por defecto (Roles sin dashboard específico y sin permisos especiales)
  // (El código de arriba cubre la mayoría de casos, pero esto sirve de fallback seguro)
  return  (
    <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed">
      <ShieldCheck size={48} className="mb-4 text-gray-200" />
      <h3 className="text-lg font-bold text-gray-500">Bienvenido al Panel</h3>
      <p className="text-sm">Selecciona una opción del menú lateral para comenzar.</p>
    </div>
  );
}