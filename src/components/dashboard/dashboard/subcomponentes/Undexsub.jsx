import {
  Bell,
  ShieldAlert,
  Activity,
  AlertTriangle,
  AlertOctagon,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function Undexsub() {
  // Datos de ejemplo
  const graficoImpacto = [
    { mes: "Ene", valor: 100 },
    { mes: "Feb", valor: 180 },
    { mes: "Mar", valor: 250 },
    { mes: "Abr", valor: 300 },
    { mes: "May", valor: 340 },
  ];

  const graficoRed = [
    { tipo: "Energía", valor: 80 },
    { tipo: "Residuos", valor: 65 },
    { tipo: "Agua", valor: 90 },
    { tipo: "CO₂", valor: 75 },
  ];

  const alertas = [
    {
      titulo: "Múltiples intentos de acceso fallidos",
      descripcion:
        "Intentos desde usuario: user@ecologicproject.com en 5 minutos consecutivos",
      fecha: "18/09/2025 - 10:23 AM",
      tipo: "crítica",
    },
    {
      titulo: "Cambio de permisos críticos",
      descripcion: "El usuario admin@ecologic.com modificó roles administrativos",
      fecha: "17/09/2025 - 08:47 AM",
      tipo: "advertencia",
    },
    {
      titulo: "Acceso desde nueva ubicación",
      descripcion:
        "Ingreso detectado desde IP 190.85.32.11 (Bogotá, Colombia)",
      fecha: "16/09/2025 - 09:12 AM",
      tipo: "info",
    },
  ];

  const stats = [
    {
      titulo: "Usuarios Totales",
      valor: "2,345",
      color: "bg-green-100 text-green-700",
      icono: <Activity className="text-green-600" size={20} />,
    },
    {
      titulo: "Sesiones Activas",
      valor: "97",
      color: "bg-blue-100 text-blue-700",
      icono: <Bell className="text-blue-600" size={20} />,
    },
    {
      titulo: "Alertas Críticas",
      valor: "1,324",
      color: "bg-yellow-100 text-yellow-700",
      icono: <AlertTriangle className="text-yellow-600" size={20} />,
    },
    {
      titulo: "Accesos Bloqueados",
      valor: "22",
      color: "bg-red-100 text-red-700",
      icono: <AlertOctagon className="text-red-600" size={20} />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row justify-end mb-6 gap-3">
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
          <RefreshCw size={18} /> Actualizar
        </button>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition w-full sm:w-auto">
          <Download size={18} /> Exportar
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-sm bg-white p-5 border hover:shadow-md transition flex justify-between items-center"
          >
            <div>
              <h3 className="text-gray-600 text-sm font-medium">{item.titulo}</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {item.valor}
              </p>
            </div>
            <div className={`p-2 rounded-full ${item.color}`}>{item.icono}</div>
          </div>
        ))}
      </div>

      {/* Alertas de seguridad */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <ShieldAlert className="text-red-500" /> Alertas de Seguridad Activas
        </h2>

        <div className="space-y-4">
          {alertas.map((alerta, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between hover:shadow-sm transition text-left bg-gray-50"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{alerta.titulo}</p>
                <p className="text-sm text-gray-600 mt-1">{alerta.descripcion}</p>
                <p className="text-xs text-gray-500 mt-2">{alerta.fecha}</p>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    alerta.tipo === "crítica"
                      ? "bg-red-100 text-red-700"
                      : alerta.tipo === "advertencia"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {alerta.tipo.charAt(0).toUpperCase() + alerta.tipo.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impacto Ambiental */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          Impacto Ambiental
        </h2>

        {/* Stats Ambientales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <p className="text-gray-600 text-sm">Actividad del Sistema</p>
            <p className="text-2xl font-semibold text-green-700">340,820 pts</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <p className="text-gray-600 text-sm">Reducción de CO₂</p>
            <p className="text-2xl font-semibold text-green-700">152.8 kg</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <p className="text-gray-600 text-sm">Ahorro Energético</p>
            <p className="text-2xl font-semibold text-green-700">45,600 kWh</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h3 className="font-medium mb-3 text-gray-700">
              Actividad del Sistema
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={graficoImpacto}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border">
            <h3 className="font-medium mb-3 text-gray-700">
              Energía vs Reducción
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={graficoRed}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#16a34a" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
