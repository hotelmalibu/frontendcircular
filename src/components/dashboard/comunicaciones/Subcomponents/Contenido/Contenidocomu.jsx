import React, { useState } from "react";
import { 
  Edit, 
  Eye, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  User,
  BarChart2,
  CheckCircle,
  Clock,
  FileEdit
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

export default function GestionDeContenido() {
  const [searchTerm, setSearchTerm] = useState("");

  const articulos = [
    {
      id: 1,
      titulo: "Innovaciones en Reciclaje de Plásticos 2025",
      autor: "María González",
      fecha: "09/09/2025",
      vistas: 2340,
      estado: "Publicado",
      categoria: "Tecnología",
    },
    {
      id: 2,
      titulo: "Economía Circular en el Sector Textil",
      autor: "Carlos Ruiz",
      fecha: "07/09/2025",
      vistas: 120,
      estado: "Pendiente revisión",
      categoria: "Industria",
    },
    {
      id: 3,
      titulo: "Guía de Compostaje Doméstico",
      autor: "Ana Martín",
      fecha: "04/09/2025",
      vistas: 0,
      estado: "Borrador",
      categoria: "Educación",
    },
    {
      id: 4,
      titulo: "Estrategias de Sostenibilidad Corporativa",
      autor: "Juan Pérez",
      fecha: "02/09/2025",
      vistas: 850,
      estado: "Publicado",
      categoria: "Negocios",
    },
  ];

  // Helper para estilos de estado
  const getStatusStyles = (estado) => {
    switch (estado) {
      case "Publicado":
        return { 
          bg: "#F0FDF4", 
          text: BRAND.darkGreen, 
          border: BRAND.green, 
          icon: <CheckCircle size={12} /> 
        };
      case "Pendiente revisión":
        return { 
          bg: "#FFF5EB", 
          text: BRAND.orange, 
          border: BRAND.orange, 
          icon: <Clock size={12} /> 
        };
      case "Borrador":
      default:
        return { 
          bg: "#F3F4F6", 
          text: BRAND.gray, 
          border: "#D1D5DB", 
          icon: <FileEdit size={12} /> 
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-700">
      
      {/* ESPACIADOR SUPERIOR */}
      <div className="w-full"></div>

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: BRAND.darkBlue }}>
            <FileText className="text-blue-400" size={32} />
            Gestión de Contenido
          </h1>
          <p className="text-gray-500 mt-1 text-lg ml-11">Administra blog, noticias y publicaciones</p>
        </div>
        
        <button
          className="flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-bold text-sm transform active:scale-95"
          style={{ backgroundColor: BRAND.blue }}
        >
          <Plus size={20} /> Nuevo Artículo
        </button>
      </div>

      {/* Barra de Herramientas (Búsqueda y Filtros) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título o autor..." 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm"
            style={{ "--tw-ring-color": BRAND.lightBlue }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition text-sm font-medium w-full justify-center sm:w-auto">
            <Filter size={16} /> Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition text-sm font-medium w-full justify-center sm:w-auto">
            <BarChart2 size={16} /> Métricas
          </button>
        </div>
      </div>

      {/* Lista de Artículos */}
      <div className="space-y-4">
        {articulos.map((articulo) => {
          const styles = getStatusStyles(articulo.estado);
          
          return (
            <div
              key={articulo.id}
              className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-200 transition-all duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
            >
              {/* Indicador lateral de color */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5" 
                style={{ backgroundColor: styles.text }}
              ></div>

              <div className="flex-1 pl-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                    {articulo.categoria}
                  </span>
                  <span 
                    className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border"
                    style={{ 
                      backgroundColor: styles.bg, 
                      color: styles.text,
                      borderColor: 'transparent'
                    }}
                  >
                    {styles.icon} {articulo.estado}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {articulo.titulo}
                </h3>
                
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={14} /> {articulo.autor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {articulo.fecha}
                  </span>
                  {articulo.vistas > 0 && (
                    <span className="flex items-center gap-1 text-blue-600 font-medium">
                      <BarChart2 size={14} /> {articulo.vistas.toLocaleString()} vistas
                    </span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <button 
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition border border-gray-200 hover:border-blue-200 text-sm font-medium"
                >
                  <Eye size={16} /> <span className="md:hidden lg:inline">Vista Previa</span>
                </button>
                
                <button 
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white transition hover:shadow-md text-sm font-medium"
                  style={{ backgroundColor: BRAND.darkGreen }}
                >
                  <Edit size={16} /> Editar
                </button>

                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        Mostrando {articulos.length} artículos
      </div>
    </div>
  );
}