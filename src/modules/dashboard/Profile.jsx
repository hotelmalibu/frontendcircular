import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import {
  User,
  Mail,
  Shield,
  Edit3,
  Camera,
  Calendar,
  MapPin
} from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  gray: "#6B7280",
};

export default function Profile() {
  const { user } = useContext(AuthContext);

  // Fallback seguro por si el contexto aún no carga
  const userData = user || {
    name: "Usuario Cargando...",
    email: "cargando@ejemplo.com",
    role: "Invitado"
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-700">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto">


          {/* Tarjeta Principal de Perfil */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

            {/* Banner Decorativo */}
            <div
              className="h-40 w-full relative"
              style={{ background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)` }}
            >
              {/* Patrón decorativo opcional o imagen de fondo */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            {/* Contenido del Perfil */}
            <div className="px-8 pb-8 relative">

              {/* Sección Avatar y Nombre (Flotante sobre el banner) */}
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between -mt-16 mb-8 gap-4">

                <div className="flex items-end gap-6">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400 shadow-md overflow-hidden">
                      {/* Si hubiera imagen: <img src={user.avatar} ... /> */}
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Nombre y Rol */}
                  <div className="mb-0">
                    <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-sm font-medium px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        <Shield size={12} />
                        {userData.role || "Sin rol asignado"}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={12} /> Colombia
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Grid de Información Detallada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tarjeta de Información Básica */}
                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-200 pb-2">
                    Detalles de Contacto
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white rounded-lg text-blue-600 shadow-sm border border-gray-100">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Nombre Completo</p>
                        <p className="text-gray-800 font-medium text-base">{userData.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white rounded-lg text-blue-600 shadow-sm border border-gray-100">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Correo Electrónico</p>
                        <p className="text-gray-800 font-medium text-base">{userData.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tarjeta de Información de Cuenta */}
                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-200 pb-2">
                    Información de Cuenta
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white rounded-lg text-green-600 shadow-sm border border-gray-100">
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Rol del Sistema</p>
                        <p className="text-gray-800 font-medium text-base capitalize">
                          {userData.role || "Usuario Estandar"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white rounded-lg text-orange-500 shadow-sm border border-gray-100">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Miembro Desde</p>
                        <p className="text-gray-800 font-medium text-base">Septiembre 2025</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}