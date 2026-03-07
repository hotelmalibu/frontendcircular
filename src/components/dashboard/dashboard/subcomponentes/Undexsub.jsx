import {
  Bell,
  Activity,
  AlertTriangle,
  AlertOctagon,
  Shield,
  Users,
  BarChart as BarChartIcon
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import React, { useState, useEffect, useMemo } from "react";
import { getUsers, getSecurityLogs, getActiveSessions } from "../../../../api/auth";

import QuienesSomos from "../../comunicaciones/QuienesSomos";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja (Alertas Críticas)
  yellow: "#E8AD00",     // Amarillo (Advertencias)
  purple: "#9E1981",     // Morado (Acentos)
  gray: "#6B7280",
};

const COLORS = [BRAND.blue, BRAND.green, BRAND.purple, BRAND.orange, BRAND.lightBlue, BRAND.darkGreen];

export default function Undexsub() {

  const [alertas, setAlertas] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: "0",
    activeSessions: "0",
    criticalAlerts: "0",
    blockedAccesses: "0"
  });

  const loadData = React.useCallback(async () => {
    try {
      // 1. Peticiones en paralelo para mayor velocidad
      const [resUsers, resSessions, resAlerts] = await Promise.all([
        getUsers({ per_page: 1 }), // Solo queremos el total inicialmente
        getActiveSessions().catch(() => ({ data: { count: 0 } })),
        getSecurityLogs({ per_page: 5 }).catch(() => ({ data: [] }))
      ]);

      // Procesar Usuarios
      let userList = [];
      const resUsersData = resUsers.data;
      if (Array.isArray(resUsersData)) {
        userList = resUsersData;
      } else if (resUsersData?.data && Array.isArray(resUsersData.data)) {
        userList = resUsersData.data;
      }

      // El total real viene de la paginación del backend
      const totalUsersCount = resUsers.data?.total || resUsers.total || userList.length;

      // Filter out non-user objects if necessary
      const validUsers = userList.filter(u => u.id && (u.name || u.email));
      setUsersList(validUsers);

      // 2. Sesiones
      const sessionsCount = resSessions.data?.count || 0;

      // 3. Alertas
      const realAlerts = Array.isArray(resAlerts.data) ? resAlerts.data : (resAlerts.data?.data || []);

      // Si el backend no soporta conteo filtrado directamente, pedimos una muestra para los charts
      // pero para el dashboard principal, intentamos obtener los totales reales
      setDashboardStats({
        totalUsers: totalUsersCount.toLocaleString(),
        activeSessions: sessionsCount.toString(),
        criticalAlerts: (resAlerts.data?.total || resAlerts.total || realAlerts.filter(a => a.type === 'critical').length).toString(),
        blockedAccesses: "0" // Este requiere un filtro específico en backend para ser exacto
      });

      setAlertas(realAlerts.map(a => ({
        titulo: a.description || "Alerta de seguridad",
        descripcion: a.user_email ? `Usuario: ${a.user_email}` : "Actividad sospechosa",
        fecha: new Date(a.created_at).toLocaleString('es-ES'),
        tipo: a.type || "info"
      })));

      // Opcional: Si necesitamos data para gráficas, cargar una muestra más grande en segundo plano
      getUsers({ per_page: 100 }).then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setUsersList(list.filter(u => u.id && (u.name || u.email)));
      });

    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);



  // --- PROCESAMIENTO DE DATOS ---

  // 1. Distribución de Roles (Pie Chart) - Lógica Robustecida
  const userRolesData = useMemo(() => {
    const roleCounts = {};
    usersList.forEach(user => {
      // Intenta extraer el nombre del rol de varias formas posibles
      let roleName = "Sin Rol";
      if (user.role) {
        if (typeof user.role === 'string') roleName = user.role;
        else if (user.role.name) roleName = user.role.name;
      } else if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
        roleName = user.roles[0].name || user.roles[0];
      }

      // Normalizar nombre del rol
      roleName = roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();

      roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
    });

    return Object.keys(roleCounts).map(role => ({
      name: role,
      value: roleCounts[role]
    }));
  }, [usersList]);

  // 2. Usuarios por Mes (Bar Chart)
  const usersByMonthData = useMemo(() => {
    const months = {};
    usersList.forEach(user => {
      if (!user.created_at) return;
      const date = new Date(user.created_at);
      // Clave ordenable: "2023-01"
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[key] = (months[key] || 0) + 1;
    });

    // Convertir a array y ordenar cronológicamente
    let chartData = Object.keys(months).sort().map(key => {
      const [year, month] = key.split('-');
      const dateObj = new Date(parseInt(year), parseInt(month) - 1);
      // Nombre corto: "Ene 24" o "Ene"
      const monthName = dateObj.toLocaleString('es-ES', { month: 'short' });
      const displayName = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year.slice(2)}`; // Ene 24

      return {
        name: displayName,
        fullDate: key,
        cantidad: months[key]
      };
    });

    // Si hay muchos datos, quizás mostrar solo los últimos 12 meses
    if (chartData.length > 12) {
      chartData = chartData.slice(chartData.length - 12);
    }

    return chartData;
  }, [usersList]);


  const stats = [
    {
      titulo: "Usuarios Totales",
      valor: dashboardStats.totalUsers,
      iconColor: BRAND.green,
      bgIcon: "bg-[#B1D357]/20",
      icono: <Activity color={BRAND.darkGreen} size={24} />,
    },
    {
      titulo: "Sesiones Activas",
      valor: dashboardStats.activeSessions,
      iconColor: BRAND.blue,
      bgIcon: "bg-[#2C67B0]/10",
      icono: <Bell color={BRAND.blue} size={24} />,
    },
    {
      titulo: "Alertas Críticas",
      valor: dashboardStats.criticalAlerts,
      iconColor: BRAND.orange,
      bgIcon: "bg-[#E15200]/10",
      icono: <AlertTriangle color={BRAND.orange} size={24} />,
    },
    {
      titulo: "Accesos Bloqueados",
      valor: dashboardStats.blockedAccesses,
      iconColor: BRAND.purple,
      bgIcon: "bg-[#9E1981]/10",
      icono: <AlertOctagon color={BRAND.purple} size={24} />,
    },
  ];

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">

      {/* Header Superior */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: BRAND.darkBlue }}>
            Resumen de Actividad
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Visualización de métricas clave y seguridad</p>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-500 transition-colors">
                  {item.titulo}
                </p>
                <h3 className="text-3xl font-black mt-2 leading-none" style={{ color: BRAND.darkBlue }}>
                  {item.valor}
                </h3>
              </div>
              <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${item.bgIcon}`}>
                {item.icono}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Columna Izquierda (2/3) - Alertas */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <Shield style={{ color: BRAND.orange }} /> Centro de Alertas
            </h2>
            <div className="space-y-3">
              {alertas.length > 0 ? (
                alertas.slice(0, 4).map((alerta, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border-l-4 transition-all hover:bg-gray-50 bg-white border border-gray-100"
                    style={{
                      borderColor: alerta.tipo === "crítica" ? BRAND.orange : alerta.tipo === "advertencia" ? BRAND.yellow : BRAND.blue,
                      borderLeftWidth: '4px'
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          color: alerta.tipo === "crítica" ? BRAND.orange : alerta.tipo === "advertencia" ? BRAND.yellow : BRAND.blue,
                          backgroundColor: alerta.tipo === "crítica" ? '#FFF5EB' : alerta.tipo === "advertencia" ? '#FFFBEB' : '#EFF6FF'
                        }}
                      >
                        {alerta.tipo}
                      </span>
                      <span className="text-xs text-gray-400">{alerta.fecha.split(',')[0]}</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm">{alerta.titulo}</h4>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400 italic">No hay alertas de seguridad recientes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha (1/3) - Distribución de Usuarios */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
              <Users size={20} className="text-[#B1D357]" /> Usuarios por Rol
            </h3>
            <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRolesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userRolesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Inferior - Crecimiento de Usuarios (Gráfica de Barras) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
            <BarChartIcon className="text-blue-500" /> Crecimiento de Usuarios
          </h2>
          <div className="text-sm text-gray-400">
            Registros por mes
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usersByMonthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar
                dataKey="cantidad"
                name="Usuarios Registrados"
                radius={[6, 6, 0, 0]}
                barSize={50}
                fill={BRAND.blue}
              />
            </BarChart>
          </ResponsiveContainer>
          {usersByMonthData.length === 0 && (
            <div className="flex h-full items-center justify-center -mt-80">
              <p className="text-gray-400 italic">No hay datos de registro disponibles</p>
            </div>
          )}
        </div>
      </div>
      {/* Sección: Gestión de Quiénes Somos */}
      <div className="mt-12 pt-12 border-t border-gray-200">
        <div className="mb-8">
          <h2 className="text-2xl font-black flex items-center gap-3" style={{ color: BRAND.darkBlue }}>
            <Activity className="text-green-500" size={28} />
            Gestión de Contenido: Quiénes Somos
          </h2>
          <p className="text-gray-500 mt-2">
            Administra el texto principal y las frases de los líderes que aparecen en la página pública.
          </p>
        </div>
        <QuienesSomos />
      </div>
    </div>
  );
}