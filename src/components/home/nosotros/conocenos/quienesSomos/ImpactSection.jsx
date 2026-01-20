import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Activity, 
  Zap, 
  Users, 
  BarChart3, 
  Globe2,
  Anchor,
  Compass
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- DATA: ZONAS DE INFLUENCIA ---
const zones = [
  { 
    id: "atlantic", 
    name: "Corredor Caribe", 
    center: [10.6, -75.2], 
    zoom: 8,
    cities: ["Cartagena - Bolívar", "Barranquilla - Puerto Colombia", "Santa Marta"],
    description: "Foco principal de estrategias marino-costeras. Integración de ecosistemas de aprovechamiento y protección de manglares.",
    impact: 85
  },
  { 
    id: "central", 
    name: "Nodo Central", 
    center: [5.5, -74.5], 
    zoom: 7,
    cities: ["Bogotá D.C.", "Medellín", "Cali"],
    description: "Epicentro de innovación y transformación industrial. Desarrollo de biomateriales y fortalecimiento de transformadores.",
    impact: 92
  },
  { 
    id: "pacific", 
    name: "Eje Pacífico", 
    center: [3.8, -77.0], 
    zoom: 8,
    cities: ["Buenaventura", "Quibdó"],
    description: "Programas de inclusión social y empleos verdes en comunidades costeras.",
    impact: 78
  }
];

const impactLines = [
  { id: 1, name: "Innovación CTeI", icon: Zap, percentage: 94 },
  { id: 2, name: "Inclusión Social", icon: Users, percentage: 88 },
  { id: 3, name: "Transformación", icon: BarChart3, percentage: 82 },
];

// --- CUSTOM MAP ICON ---
const createCustomIcon = (isActive) => new L.DivIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 bg-${isActive ? '[#B1D357]' : '[#2C67B0]'}/20 rounded-full animate-ping"></div>
      <div class="relative w-6 h-6 bg-${isActive ? '[#B1D357]' : '[#2C67B0]'} rounded-full border-4 border-white shadow-xl flex items-center justify-center">
        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
    </div>
  `,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const MapController = ({ zone }) => {
  const map = useMap();
  React.useEffect(() => {
    if (zone) {
      map.flyTo(zone.center, zone.zoom, { duration: 1.5 });
    }
  }, [zone, map]);
  return null;
};

const ImpactSection = () => {
  const [activeZone, setActiveZone] = useState(zones[0]);

  return (
    <section className="pt-8 pb-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B1D357]/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2C67B0]/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div>
            <span className="text-[#2C67B0] font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Presencia Nacional</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E305D] mb-6">
              Nuestro Impacto <span className="text-[#B1D357]">Territorial</span>
            </h2>
            <div className="w-24 h-1.5 bg-[#B1D357] mx-auto rounded-full mb-8" />
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light mb-12">
              Articulamos acciones estratégicas en las regiones clave para consolidar nodos de economía circular escalables y sostenibles.
            </p>

            {/* Statistics moved to header */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
               {[
                 { label: "Municipios", value: "+25", icon: Globe2 },
                 { label: "Empresas", value: "350+", icon: Users },
                 { label: "Proyectos", value: "14", icon: BarChart3 },
               ].map((stat, i) => (
                 <div key={i} className="flex items-center gap-4">
                   <div className="p-3 bg-[#2C67B0]/10 rounded-xl text-[#2C67B0]">
                     <stat.icon size={20} />
                   </div>
                   <div className="text-left">
                      <span className="block text-xl font-bold text-[#1E305D] leading-none">{stat.value}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* MAP COLUMN */}
          <div className="lg:col-span-8 bg-gray-50 rounded-[3rem] overflow-hidden shadow-inner border border-gray-100 min-h-[500px] relative">
            <MapContainer 
              center={[4.5, -74.0]} 
              zoom={5} 
              style={{ height: "100%", width: "100%", background: "#f8fafc" }}
              zoomControl={false}
              scrollWheelZoom={false}
            >
              <TileLayer 
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapController zone={activeZone} />
              {zones.map((zone) => (
                <Marker 
                  key={zone.id} 
                  position={zone.center} 
                  icon={createCustomIcon(activeZone.id === zone.id)}
                  eventHandlers={{ click: () => setActiveZone(zone) }}
                />
              ))}
              <ZoomControl position="bottomright" />
            </MapContainer>

            {/* Floating Map Label */}
            <div className="absolute top-8 left-8 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 max-w-xs z-[1000]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#1E305D] rounded-xl text-white">
                  <Compass size={18} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enfoque Actual</span>
              </div>
              <h3 className="text-xl font-bold text-[#1E305D] mb-2">{activeZone.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Ciudades clave: {activeZone.cities.join(", ")}
              </p>
            </div>
          </div>

          {/* INFO COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Zone Selector Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-4 flex items-center gap-2">
                <MapPin size={14} className="text-[#2C67B0]" /> Seleccionar Nodo
              </h3>
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone)}
                  className={`w-full text-left p-5 rounded-3xl transition-all border ${
                    activeZone.id === zone.id
                      ? "bg-white shadow-xl border-[#B1D357] -translate-x-2"
                      : "bg-gray-50 border-transparent hover:bg-white hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${activeZone.id === zone.id ? 'text-[#1E305D]' : 'text-gray-400'}`}>
                      {zone.name}
                    </span>
                    {activeZone.id === zone.id && (
                      <div className="w-2 h-2 rounded-full bg-[#B1D357]" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Dynamic Details Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeZone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 bg-[#1E305D] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-[#B1D357]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl">
                       <Anchor size={24} className="text-[#B1D357]" />
                    </div>
                    <div className="text-right">
                      <span className="block text-3xl font-bold text-[#B1D357]">{activeZone.impact}%</span>
                      <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Ejecución</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-3">{activeZone.name}</h4>
                  <p className="text-sm text-white/70 leading-relaxed font-light mb-8 italic">
                    "{activeZone.description}"
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/10">
                    <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <Activity size={14} /> Métricas por Línea
                    </h5>
                    <div className="space-y-4">
                      {impactLines.map((line) => (
                        <div key={line.id}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-bold text-white/80">{line.name}</span>
                            <span className="text-[10px] font-bold text-[#B1D357]">{line.percentage}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${line.percentage}%` }}
                              className="h-full bg-gradient-to-r from-[#B1D357] to-[#8fb23a] rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
