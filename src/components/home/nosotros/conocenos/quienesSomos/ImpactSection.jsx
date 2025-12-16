import React, { useState, useEffect } from "react";
import { MapPin, Activity, Leaf, Zap, Users, BarChart3, TrendingUp } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- DATOS ---
const regions = [
  { id: 1, name: "Bogotá", lat: 4.7110, lng: -74.0721, projects: 8, description: "Centro de operaciones y desarrollo." },
  { id: 2, name: "Medellín", lat: 6.2442, lng: -75.5812, projects: 6, description: "Hub de producción sostenible." },
  { id: 3, name: "Cali", lat: 3.4372, lng: -76.5225, projects: 5, description: "Iniciativas comunitarias." },
  { id: 4, name: "Barranquilla", lat: 10.9639, lng: -74.7964, projects: 4, description: "Apoyo a recicladores locales." },
  { id: 5, name: "Cartagena", lat: 10.3910, lng: -75.4794, projects: 2, description: "Programas educativos." },
  { id: 6, name: "Santa Marta", lat: 11.2404, lng: -74.2197, projects: 2, description: "Economía colaborativa." },
];

const sectors = [
  { id: 1, name: "Reciclaje", icon: Leaf, color: "#00AB6D", percentage: 95 },
  { id: 2, name: "Innovación", icon: Zap, color: "#9E1981", percentage: 85 },
  { id: 3, name: "Producción", icon: BarChart3, color: "#E8AD00", percentage: 78 },
  { id: 4, name: "Investigación", icon: Activity, color: "#2B65AC", percentage: 65 },
  { id: 5, name: "Sensibilización", icon: Users, color: "#E15200", percentage: 72 },
  { id: 6, name: "Fortalecimiento", icon: TrendingUp, color: "#8CB200", percentage: 68 },
];

// --- COMPONENTES DEL MAPA ---
const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapController = ({ activeRegion }) => {
  const map = useMap();
  useEffect(() => {
    if (activeRegion) {
      map.setView([activeRegion.lat, activeRegion.lng], 12, { animate: true });
    } else {
      map.setView([4.5709, -74.2973], 5, { animate: true });
    }
  }, [activeRegion, map]);
  return null;
};

// --- COMPONENTE PRINCIPAL ---
const ImpactWithMap = () => {
  const [activeRegion, setActiveRegion] = useState(regions[0]);

  return (
    <section
      className="relative w-full bg-center"
    >
      

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E305D] mb-2 leading-tight">
            Lo que está Pasando
          </h2>
          <p className="text-grey/90 text-sm md:text-base max-w-2xl mx-auto">
            Visualiza dónde estamos generando impacto y en qué sectores trabajamos
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL: GLASSMORPHISM */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          
          {/* COLUMNA IZQUIERDA: MAPA (7 columnas) */}
          <div className="lg:col-span-7 relative h-[300px] lg:h-auto border-r border-gray-200">
            <MapContainer center={[4.71, -74.07]} zoom={5} style={{ height: "100%", width: "100%" }} zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <MapController activeRegion={activeRegion} />
              {regions.map((region) => (
                <Marker 
                  key={region.id} 
                  position={[region.lat, region.lng]} 
                  icon={customIcon}
                  eventHandlers={{ click: () => setActiveRegion(region) }}
                />
              ))}
            </MapContainer>
            {/* Etiqueta flotante sobre el mapa */}
            <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-lg shadow-md z-[1000]">
                <p className="text-xs text-gray-500 uppercase font-bold">Ubicación Actual</p>
                <p className="text-lg font-bold text-[#1E305D]">{activeRegion.name}</p>
            </div>
          </div>

          {/* COLUMNA DERECHA: DATOS (5 columnas) */}
          <div className="lg:col-span-5 p-6 flex flex-col h-full">
            
            {/* 1. SELECCIÓN DE CIUDADES (Botones, sin scroll) */}
            <div className="mb-6">
               <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase flex items-center gap-2">
                 <MapPin size={16} /> Selecciona una región
               </h3>
               <div className="flex flex-wrap gap-2">
                 {regions.map((region) => (
                   <button
                     key={region.id}
                     onClick={() => setActiveRegion(region)}
                     className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all border ${
                       activeRegion.id === region.id
                         ? "bg-[#1E305D] text-white border-[#1E305D]"
                         : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#00AB6D]"
                     }`}
                   >
                     {region.name}
                   </button>
                 ))}
               </div>
               
               {/* Descripción dinámica */}
               <div className="mt-4 p-4 bg-[#00AB6D]/10 rounded-xl border border-[#00AB6D]/20 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-[#1E305D] text-lg">{activeRegion.name}</h4>
                        <p className="text-sm text-gray-700 leading-snug">{activeRegion.description}</p>
                    </div>
                    <div className="text-center pl-4 border-l border-[#00AB6D]/30">
                        <span className="block text-2xl font-bold text-[#00AB6D]">{activeRegion.projects}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-500">Proyectos</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="w-full h-px bg-gray-200 mb-6"></div>

            {/* 2. SECTORES Y PORCENTAJES (Lista compacta) */}
            <div className="flex-1">
               <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase flex items-center gap-2">
                 <Activity size={16} /> Impacto por Sector
               </h3>
               <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                 {sectors.map((sector) => {
                   const Icon = sector.icon;
                   return (
                     <div key={sector.id} className="group">
                        <div className="flex justify-between items-center mb-1">
                           <div className="flex items-center gap-1.5">
                              <Icon size={14} style={{ color: sector.color }} />
                              <span className="text-xs font-semibold text-gray-700">{sector.name}</span>
                           </div>
                           <span className="text-xs font-bold text-gray-500">{sector.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                           <div 
                             className="h-full rounded-full" 
                             style={{ width: `${sector.percentage}%`, backgroundColor: sector.color }}
                           ></div>
                        </div>
                     </div>
                   );
                 })}
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactWithMap;