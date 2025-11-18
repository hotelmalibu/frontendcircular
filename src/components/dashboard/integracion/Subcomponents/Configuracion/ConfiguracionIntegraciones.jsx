import { Lock, Link, RefreshCcw, Bell, Save, RotateCcw, Edit3, Play, DollarSign, RefreshCw } from "lucide-react";

export default function ConfiguracionYAdministracion() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      {/* Título principal */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Configuración y Administración
        </h2>
        <p className="text-sm text-gray-500">
          Gestión de credenciales, webhooks y parámetros del sistema
        </p>
      </div>

      {/* Submenú */}
      <div className="flex space-x-6 border-b pb-2">
        <button className="flex items-center text-teal-700 font-medium border-b-2 border-teal-600 pb-2">
          <Lock className="w-4 h-4 mr-2 text-gray-500" />
          Credenciales
        </button>
        <button className="flex items-center text-gray-600 hover:text-teal-700 transition pb-2">
          <Link className="w-4 h-4 mr-2 text-gray-500" />
          Webhooks
        </button>
        <button className="flex items-center text-gray-600 hover:text-teal-700 transition pb-2">
          <RefreshCcw className="w-4 h-4 mr-2 text-gray-500" />
          Sincronización
        </button>
        <button className="flex items-center text-gray-600 hover:text-teal-700 transition pb-2">
          <Bell className="w-4 h-4 mr-2 text-gray-500" />
          Notificaciones
        </button>
      </div>

      {/* Título de sección principal */}
      <div className="text-left mt-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-800">
          Gestión de Credenciales y API Keys
        </h3>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Línea Base */}
        <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-5 text-left">
          <h4 className="text-base font-semibold text-gray-800 mb-1">
            API Línea Base
          </h4>
          <p className="text-sm text-green-600 mb-3 flex items-center">
            ● Válida hasta 2026-03-15
          </p>
          <div className="flex space-x-2">
            <button className="bg-blue-100 text-gray-800 text-sm px-3 py-1 rounded hover:bg-blue-200 transition flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" />
              Renovar
            </button>
            <button className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-200 transition flex items-center">
              <Edit3 className="w-4 h-4 mr-1" />
              Editar
            </button>
            <button className="bg-green-100 text-gray-700 text-sm px-3 py-1 rounded hover:bg-green-200 transition flex items-center">
              <Play className="w-4 h-4 mr-1" />
              Probar
            </button>
          </div>
        </div>

        {/* SMS Gateway */}
        <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-5 text-left">
          <h4 className="text-base font-semibold text-gray-800 mb-1">
            SMS Gateway (Twilio)
          </h4>
          <p className="text-sm text-green-600 mb-3 flex items-center">
            ● Saldo: $234.56 USD
          </p>
          <div className="flex space-x-2">
            <button className="bg-amber-100 text-gray-800 text-sm px-3 py-1 rounded hover:bg-amber-200 transition flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Recargar
            </button>
            <button className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-200 transition flex items-center">
              <Edit3 className="w-4 h-4 mr-1" />
              Editar
            </button>
            <button className="bg-green-100 text-gray-700 text-sm px-3 py-1 rounded hover:bg-green-200 transition flex items-center">
              <Play className="w-4 h-4 mr-1" />
              Probar
            </button>
          </div>
        </div>
      </div>

      {/* Botones inferiores */}
      <div className="flex justify-center gap-6 mt-8">
        <button className="bg-teal-700 hover:bg-teal-800 text-white text-sm px-5 py-2 rounded-lg flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Guardar Configuración
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-5 py-2 rounded-lg flex items-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          Restablecer Defaults
        </button>
      </div>
    </div>
  );
}
