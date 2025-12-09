import React, { useState } from "react";
import { 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical, 
  User, 
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja (Alertas)
  yellow: "#E8AD00",     // Amarillo
  gray: "#6B7280",
};

export default function Table() {
  const [searchTerm, setSearchTerm] = useState("");

  const data = [
    {
      id: 1,
      usuario: "Luis Martínez",
      email: "l.martinez@ejemplo.com",
      rol: "Administrador",
      pedidos: 12,
      ultimoAcceso: "2025-10-21",
      estado: "Activo",
    },
    {
      id: 2,
      usuario: "María Gómez",
      email: "m.gomez@ejemplo.com",
      rol: "Cliente",
      pedidos: 5,
      ultimoAcceso: "2025-10-20",
      estado: "Inactivo",
    },
    {
      id: 3,
      usuario: "Carlos Ruiz",
      email: "c.ruiz@ejemplo.com",
      rol: "Artesano",
      pedidos: 8,
      ultimoAcceso: "2025-10-19",
      estado: "Activo",
    },
    {
      id: 4,
      usuario: "Ana Torres",
      email: "a.torres@ejemplo.com",
      rol: "Cliente",
      pedidos: 2,
      ultimoAcceso: "2025-10-22",
      estado: "Activo",
    },
  ];

  // Filtro simple para el ejemplo visual
  const filteredData = data.filter(item => 
    item.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans text-gray-700">
      
      {/* ESPACIADOR SUPERIOR */}
      <div className="w-full "></div>

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ color: BRAND.darkBlue }}>
            Usuarios Registrados
          </h1>
          <p className="text-gray-500 mt-1">Gestión de acceso y roles de la plataforma</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition shadow-sm font-medium text-sm">
              <Download size={16} /> Exportar
           </button>
           <button 
              className="flex items-center gap-2 px-5 py-2 text-white rounded-xl shadow-md hover:shadow-lg transition font-bold text-sm"
              style={{ backgroundColor: BRAND.blue }}
           >
              <User size={18} /> Nuevo Usuario
           </button>
        </div>
      </div>

      {/* Barra de Herramientas */}
      <div className="bg-white p-4 rounded-t-2xl shadow-sm border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm"
            style={{ "--tw-ring-color": BRAND.lightBlue }}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-blue-600 transition text-sm font-medium">
           <Filter size={16} /> Filtros Avanzados
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-b-2xl shadow-sm overflow-hidden border border-t-0 border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="py-4 px-6 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Pedidos</th>
                <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Último Acceso</th>
                <th className="py-4 px-6 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50/80 transition duration-150 group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {item.usuario.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.usuario}</p>
                        <p className="text-xs text-gray-500">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.rol}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className="text-sm font-semibold text-gray-700">{item.pedidos}</span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500">{item.ultimoAcceso}</span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span 
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        item.estado === "Activo"
                          ? "bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]" // Verde semántico
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.estado === "Activo" ? "bg-green-500" : "bg-gray-400"}`}></span>
                      {item.estado}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Editar usuario"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button 
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación (Visual) */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
           <p className="text-sm text-gray-500">Mostrando <span className="font-bold text-gray-700">{filteredData.length}</span> de 4 resultados</p>
           <div className="flex gap-1">
              <button className="p-1 rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-50">
                 <ChevronLeft size={20}/>
              </button>
              <button className="p-1 rounded-md text-gray-400 hover:bg-gray-100">
                 <ChevronRight size={20}/>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}