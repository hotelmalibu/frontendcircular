import React, { useState, useEffect } from "react";
import { MapPin, Activity, Leaf, Zap, Users, BarChart3, TrendingUp } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import fondoMapa from "../../assets/home/ImpactSection/fondo_mapa.jpg";

// Icono personalizado para los marcadores
const createCustomIcon = (intensity, cityName) => {
  const getColor = (intensity) => {
    switch (intensity) {
      case "high":
        return "#00AB6D";
      case "medium":
        return "#B1D357";
      case "low":
        return "#D4E5A0";
      default:
        return "#E0E0E0";
    }
  };

  const getSize = (intensity) => {
    switch (intensity) {
      case "high":
        return 32;
      case "medium":
        return 28;
      case "low":
        return 24;
      default:
        return 20;
    }
  };

  const color = getColor(intensity);
  const size = getSize(intensity);

  const svgIcon = `
    <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" opacity="0.3"/>
      <circle cx="16" cy="16" r="8" fill="${color}" stroke="white" stroke-width="2"/>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const ImpactSection = () => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  // Coordenadas reales de ciudades colombianas
  const regions = [
    {
      id: 1,
      name: "Bogotá",
      lat: 4.7110,
      lng: -74.0721,
      intensity: "high",
      sectors: ["Reciclaje", "Innovación", "Investigación"],
      projects: 8,
      description: "Centro de operaciones y desarrollo tecnológico",
    },
    {
      id: 2,
      name: "Medellín",
      lat: 6.2442,
      lng: -75.5812,
      intensity: "high",
      sectors: ["Producción", "Reciclaje", "Fortalecimiento"],
      projects: 6,
      description: "Hub de producción sostenible",
    },
    {
      id: 3,
      name: "Cali",
      lat: 3.4372,
      lng: -76.5225,
      intensity: "medium",
      sectors: ["Sensibilización", "Colaboración", "Reciclaje"],
      projects: 5,
      description: "Iniciativas comunitarias y colaborativas",
    },
    {
      id: 4,
      name: "Barranquilla",
      lat: 10.9639,
      lng: -74.7964,
      intensity: "medium",
      sectors: ["Fortalecimiento", "Producción"],
      projects: 4,
      description: "Apoyo a recicladores locales",
    },
    {
      id: 5,
      name: "Cartagena",
      lat: 10.3910,
      lng: -75.4794,
      intensity: "low",
      sectors: ["Sensibilización", "Investigación"],
      projects: 2,
      description: "Programas educativos costeros",
    },
    {
      id: 6,
      name: "Santa Marta",
      lat: 11.2404,
      lng: -74.2197,
      intensity: "low",
      sectors: ["Sostenibilidad", "Colaboración"],
      projects: 2,
      description: "Economía colaborativa verde",
    },
  ];

  // Sectores principales
  const sectors = [
    {
      id: 1,
      name: "Reciclaje",
      icon: Leaf,
      color: "#00AB6D",
      activity: "high",
      percentage: 95,
    },
    {
      id: 2,
      name: "Innovación",
      icon: Zap,
      color: "#9E1981",
      activity: "high",
      percentage: 85,
    },
    {
      id: 3,
      name: "Producción",
      icon: BarChart3,
      color: "#E8AD00",
      activity: "high",
      percentage: 78,
    },
    {
      id: 4,
      name: "Investigación",
      icon: Activity,
      color: "#2B65AC",
      activity: "medium",
      percentage: 65,
    },
    {
      id: 5,
      name: "Sensibilización",
      icon: Users,
      color: "#E15200",
      activity: "medium",
      percentage: 72,
    },
    {
      id: 6,
      name: "Fortalecimiento",
      icon: TrendingUp,
      color: "#8CB200",
      activity: "medium",
      percentage: 68,
    },
  ];

  // Componente para controlar el mapa
  const MapController = ({ regions }) => {
    const map = useMap();

    useEffect(() => {
      if (regions && regions.length > 0) {
        const group = L.featureGroup();
        regions.forEach((region) => {
          group.addLayer(L.marker([region.lat, region.lng]));
        });
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
      }
    }, [map, regions]);

    return null;
  };

  return (
    <section
  className="relative w-full py-12 px-6 md:px-12 lg:px-20 overflow-hidden bg-center bg-no-repeat"
  style={{
    backgroundImage: `url(${fondoMapa})`,
    backgroundSize: "cover", // 🔹 llena todo el espacio, se recorta un poco
  }}
>


      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER COMPACTO */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            Lo que está Pasando
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            Visualiza dónde estamos generando impacto y en qué sectores trabajamos
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL - ULTRA COMPACTO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* MAPA LEAFLET - COMPACTO */}
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl overflow-hidden">
            <h3 className="text-lg font-bold text-[#1E305D] mb-3 flex items-center gap-2">
              <MapPin className="text-[#00AB6D]" size={20} />
              Cobertura
            </h3>

            {/* MAPA LEAFLET */}
            <div
              className="relative w-full rounded-lg overflow-hidden border-2"
              style={{ borderColor: "#00AB6D", height: "300px" }}
              key={mapKey}
            >
              <MapContainer
                center={[6, -74.5]}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

                <MapController regions={regions} />

                {/* MARCADORES */}
                {regions.map((region) => (
                  <Marker
                    key={region.id}
                    position={[region.lat, region.lng]}
                    icon={createCustomIcon(region.intensity, region.name)}
                    eventHandlers={{
                      click: () =>
                        setActiveRegion(
                          activeRegion?.id === region.id ? null : region
                        ),
                    }}
                  >
                    <Popup className="leaflet-popup-custom" minWidth={200}>
                      <div className="text-sm">
                        <h4 className="font-bold text-[#1E305D] mb-1">
                          {region.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {region.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {region.sectors.map((sector, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-[#00AB6D]/10 text-[#00AB6D] font-semibold text-xs rounded-full"
                            >
                              {sector}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs font-bold text-[#00AB6D]">
                          {region.projects} proyectos
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* PANEL DE DETALLES - SUPER COMPACTO */}
            {activeRegion && (
              <div className="mt-3 p-3 bg-gradient-to-r from-[#00AB6D]/10 to-[#00AB6D]/5 rounded-lg border border-[#00AB6D] animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#1E305D] text-sm">
                      {activeRegion.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                      {activeRegion.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {activeRegion.sectors.slice(0, 2).map((sector, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-white text-[#00AB6D] font-semibold text-xs rounded-full"
                        >
                          {sector}
                        </span>
                      ))}
                      {activeRegion.sectors.length > 2 && (
                        <span className="text-xs text-gray-600">
                          +{activeRegion.sectors.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-[#00AB6D]">
                      {activeRegion.projects}
                    </p>
                    <p className="text-xs text-gray-600">proyectos</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTORES ACTIVOS - COMPACTO */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1E305D] mb-4 flex items-center gap-2">
              <Activity className="text-[#00AB6D]" size={20} />
              Sectores
            </h3>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2">
              {sectors.map((sector) => {
                const IconComponent = sector.icon;
                return (
                  <div key={sector.id} className="group">
                    {/* NOMBRE Y ICONO */}
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent
                        size={14}
                        style={{ color: sector.color }}
                        className="flex-shrink-0"
                      />
                      <span className="font-semibold text-xs text-gray-800 truncate">
                        {sector.name}
                      </span>
                    </div>

                    {/* BARRA DE PROGRESO */}
                    <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover:shadow-md"
                        style={{
                          backgroundColor: sector.color,
                          width: `${sector.percentage}%`,
                        }}
                      ></div>
                    </div>

                    {/* PORCENTAJE */}
                    <p className="text-xs font-bold text-gray-600 mt-0.5">
                      {sector.percentage}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA FINAL - COMPACTO */}
        <div className="text-center mt-6">
          <button className="group relative inline-flex items-center justify-center gap-2 bg-[#B1D357] text-[#ffffff] font-medium px-5 py-2 rounded-lg text-sm shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
            <span className="relative">Conoce más</span>
            <TrendingUp size={14} className="relative group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;