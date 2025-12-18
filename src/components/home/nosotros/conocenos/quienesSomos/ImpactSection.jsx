import React, { useState, useEffect } from "react";
import { MapPin, Activity, Leaf, Zap, Users, TrendingUp } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- DATOS ACTUALIZADOS ---
const regions = [
  { id: 1, name: "Región Pacífica", lat: 3.85, lng: -77.08, gestores: 108, description: "Mayor concentración de gestores y proyectos marino-costeros." },
  { id: 2, name: "Región Caribe", lat: 10.40, lng: -75.50, gestores: 29, description: "Proyectos en Barranquilla, Cartagena y Puerto Colombia." },
  { id: 3, name: "Región Andina", lat: 4.71, lng: -74.07, gestores: 11, description: "Centro de operaciones principal (Bogotá, Medellín)." },
  { id: 4, name: "Región Orinoquía", lat: 4.15, lng: -73.63, gestores: 25, description: "Expansión en gestores y transformadores." },
  { id: 5, name: "Amazonía", lat: -1.47, lng: -71.94, gestores: 3, description: "Presencia inicial con gestores locales." },
];

const ejes = [
  { id: 1, name: "Innovación", icon: Zap, color: "#9E1981", percentage: 92 },
  { id: 2, name: "Inclusión Social", icon: Users, color: "#E15200", percentage: 88 },
  { id: 3, name: "Fortalecimiento", icon: TrendingUp, color: "#8CB200", percentage: 85 },
  { id: 4, name: "Estrategias Territoriales", icon: Leaf, color: "#2B65AC", percentage: 80 },
  { id: 5, name: "Sensibilización", icon: Activity, color: "#E8AD00", percentage: 75 },
];

// --- MAPA ---
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
      map.setView([activeRegion.lat, activeRegion.lng], 7, { animate: true });
    } else {
      map.setView([4.57, -74.29], 5, { animate: true });
    }
  }, [activeRegion, map]);
  return null;
};

// --- COMPONENTE PRINCIPAL ---
const ImpactWithMap = () => {
  const [activeRegion, setActiveRegion] = useState(regions[0]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E305D] mb-3">
            Nuestro Impacto Territorial
          </h2>
          <p className="text-gray-600 text-base max-w-3xl mx-auto">
            Visualiza dónde estamos generando impacto y en qué ejes estratégicos trabajamos
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
          
          {/* MAPA (7 columnas) */}
          <div className="lg:col-span-7 relative h-[300px] lg:h-auto">
            <MapContainer center={[4.57, -74.29]} zoom={5} style={{ height: "100%", width: "100%" }} zoomControl={false}>
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

            {/* Etiqueta región activa */}
            <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-lg shadow-md z-[1000]">
              <p className="text-xs text-gray-500 uppercase font-bold">Región activa</p>
              <p className="text-lg font-bold text-[#1E305D]">{activeRegion.name}</p>
            </div>
          </div>

          {/* PANEL DERECHO (5 columnas) */}
          <div className="lg:col-span-5 p-6 flex flex-col">
            
            {/* Botones regiones en wrap */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase flex items-center gap-2">
                <MapPin size={16} /> Selecciona una región
              </h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setActiveRegion(region)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all border ${
                      activeRegion.id === region.id
                        ? "bg-[#00AB6D] text-white border-[#00AB6D]"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#00AB6D]"
                    }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>

              {/* Descripción dinámica */}
              <div className="mt-5 p-4 bg-[#00AB6D]/10 rounded-xl border border-[#00AB6D]/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#1E305D] text-lg">{activeRegion.name}</h4>
                    <p className="text-sm text-gray-700 leading-snug">{activeRegion.description}</p>
                  </div>
                  <div className="text-center pl-4 border-l border-[#00AB6D]/30">
                    <span className="block text-2xl font-bold text-[#00AB6D]">{activeRegion.gestores}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-500">Gestores</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 mb-6"></div>

            {/* Ejes estratégicos en grid 2 columnas */}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase flex items-center gap-2">
                <Activity size={16} /> Progreso por Eje Estratégico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ejes.map((eje) => {
                  const Icon = eje.icon;
                  return (
                    <div key={eje.id}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                          <Icon size={14} style={{ color: eje.color }} />
                          <span className="text-sm font-semibold text-gray-700">{eje.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-600">{eje.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all" 
                          style={{ width: `${eje.percentage}%`, backgroundColor: eje.color }}
                        />
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