import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Factory,
  Globe2,
  Calendar,
  Layers,
  Recycle,
  AlertCircle,
  Maximize2
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getIntegrationDashboard } from "../../../../../api/integrationApi";

// --- METADATOS Y COORDENADAS DE REGIONES EN COLOMBIA ---
const REGIONS_CONFIG = {
  ANDINA: {
    id: "ANDINA",
    name: "Región Andina",
    shortName: "Andina",
    center: [5.8, -74.2],
    zoom: 6.8,
    departments: "Bogotá D.C., Antioquia, Cundinamarca, Santanderes, Eje Cafetero, Boyacá, Tolima, Huila",
    description: "Principal nodo industrial y de mayor concentración de transformación y valorización.",
    color: "#2C67B0",
  },
  CARIBE: {
    id: "CARIBE",
    name: "Región Caribe",
    shortName: "Caribe",
    center: [10.2, -74.5],
    zoom: 7.2,
    departments: "Atlántico, Bolívar, Magdalena, Cesar, Córdoba, La Guajira, Sucre",
    description: "Ecosistemas marino-costeros y fortalecimiento de cadenas de aprovechamiento del litoral.",
    color: "#00AB6D",
  },
  PACIFICA: {
    id: "PACIFICA",
    name: "Región Pacífica",
    shortName: "Pacífica",
    center: [3.8, -77.0],
    zoom: 7.0,
    departments: "Valle del Cauca, Chocó, Cauca, Nariño",
    description: "Foco en inclusión socio-productiva y formalización de gestores y recicladores de oficio.",
    color: "#8CB200",
  },
  ORINOQUIA: {
    id: "ORINOQUIA",
    name: "Región Orinoquía",
    shortName: "Orinoquía",
    center: [4.8, -71.5],
    zoom: 6.5,
    departments: "Meta, Casanare, Arauca, Vichada",
    description: "Desarrollo de capacidades logísticas y recolección en los llanos orientales.",
    color: "#E8AD00",
  },
  AMAZONICA: {
    id: "AMAZONICA",
    name: "Región Amazónica",
    shortName: "Amazónica",
    center: [0.9, -72.8],
    zoom: 6.2,
    departments: "Amazonas, Caquetá, Putumayo, Guaviare, Guainía, Vaupés",
    description: "Articulación territorial y protección de cuencas y ecosistemas de alta biodiversidad.",
    color: "#0D9488",
  },
  INSULAR: {
    id: "INSULAR",
    name: "Región Insular",
    shortName: "Insular",
    center: [12.58, -81.7],
    zoom: 8.5,
    departments: "San Andrés, Providencia y Santa Catalina",
    description: "Logística inversa y retorno de materiales para circularidad en territorio insular.",
    color: "#0284C7",
  },
};

const NATIONAL_VIEW = {
  id: "ALL",
  name: "Total Nacional",
  shortName: "Nacional (Todos)",
  center: [4.57, -74.29],
  zoom: 5.5,
  description: "Impacto consolidado de Visión Circular en todo el territorio colombiano.",
  departments: "Cobertura estratégica en todas las regiones del país",
  color: "#1E305D",
};

// --- ICONO PERSONALIZADO PARA EL MAPA ---
const createCustomIcon = (isActive, color = "#2C67B0") => new L.DivIcon({
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; cursor: pointer;">
      ${isActive ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: ${color}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
      <div style="position: relative; width: ${isActive ? '24px' : '20px'}; height: ${isActive ? '24px' : '20px'}; border-radius: 50%; background-color: ${color}; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
        <div style="width: 6px; height: 6px; border-radius: 50%; background-color: #ffffff;"></div>
      </div>
    </div>
  `,
  className: 'custom-region-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// --- CONTROLADOR DE VUELO EN EL MAPA ---
const MapController = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target && target.center) {
      map.flyTo(target.center, target.zoom, { duration: 1.2, easeLinearity: 0.25 });
    }
  }, [target, map]);
  return null;
};

// --- FORMATEADOR DE NÚMEROS ---
const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return Number(num).toLocaleString("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const ImpactSection = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [activeRegionId, setActiveRegionId] = useState("ALL");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getIntegrationDashboard(selectedYear);
        if (isMounted) {
          if (response && response.data) {
            setDashboardData(response.data);
          } else if (response && response.message && response.message !== "OK") {
            setError(response.message);
          }
        }
      } catch (err) {
        console.error("Error fetching territorial impact data:", err);
        if (isMounted) {
          const msg = err.response?.data?.message || "No se pudo sincronizar la información del mapa";
          setError(msg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Combine static region configs with live API data
  const regionsList = useMemo(() => {
    const rawList = dashboardData?.coberturaRegiones || [];
    return Object.keys(REGIONS_CONFIG).map((key) => {
      const config = REGIONS_CONFIG[key];
      const apiItem = rawList.find(
        (r) => r.region && r.region.trim().toUpperCase() === key
      ) || {
        region: key,
        municipios: 0,
        toneladas: 0,
        gestores: 0,
        transformadores: 0,
      };

      const totalTons = dashboardData?.totalToneladasTrazadasAnioAnterior || 1;
      const percentage = totalTons > 0 ? ((apiItem.toneladas / totalTons) * 100) : 0;

      return {
        ...config,
        municipios: apiItem.municipios || 0,
        toneladas: apiItem.toneladas || 0,
        gestores: apiItem.gestores || 0,
        transformadores: apiItem.transformadores || 0,
        percentage: percentage,
      };
    });
  }, [dashboardData]);

  // Active target object (either specific region or National)
  const currentTarget = useMemo(() => {
    if (activeRegionId === "ALL") {
      const totalTons = dashboardData?.totalToneladasTrazadasAnioAnterior || 0;
      const totalGestores = dashboardData?.totalGestoresVinculados || 0;
      const totalTransf = dashboardData?.totalTransformadoresVinculados || 0;
      const totalMun = dashboardData?.totalMunicipiosCubiertos || 0;

      return {
        ...NATIONAL_VIEW,
        toneladas: totalTons,
        gestores: totalGestores,
        transformadores: totalTransf,
        municipios: totalMun,
        percentage: 100,
      };
    }
    return regionsList.find((r) => r.id === activeRegionId) || regionsList[0] || NATIONAL_VIEW;
  }, [activeRegionId, regionsList, dashboardData]);

  // Totals for top cards
  const totalTons = dashboardData?.totalToneladasTrazadasAnioAnterior ?? 0;
  const totalGestores = dashboardData?.totalGestoresVinculados ?? 0;
  const totalTransf = dashboardData?.totalTransformadoresVinculados ?? 0;
  const totalMun = dashboardData?.totalMunicipiosCubiertos ?? 0;
  const anio = dashboardData?.anioConsultado ?? selectedYear;

  return (
    <section className="py-6 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* HEADER COMPACTO CON TEXTOS EXACTOS SOLICITADOS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="text-left max-w-3xl">
            <span className="text-[#2C67B0] font-bold text-xs uppercase tracking-[0.25em] mb-1.5 block">
              Presencia Nacional
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E305D] tracking-tight mb-2">
              Nuestro Impacto <span className="text-[#00AB6D]">Territorial</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">
              Articulamos acciones estratégicas en las regiones clave para consolidar nodos de economía circular escalables y sostenibles.
            </p>
          </div>

          {/* SELECTOR DE AÑO COMPACTO */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl self-start md:self-auto shadow-sm">
            <Calendar size={15} className="text-[#2C67B0]" />
            <label htmlFor="impact-year" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Año:
            </label>
            <select
              id="impact-year"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value));
                setActiveRegionId("ALL");
              }}
              className="bg-transparent text-[#1E305D] font-bold text-sm focus:outline-none cursor-pointer border-none py-0.5"
            >
              {[2025, 2024, 2023].map((y) => (
                <option key={y} value={y} className="text-gray-900">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MENSAJE DE ERROR SI APLICA */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-3 text-red-700 text-xs">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* CARDS DE TOTALES NACIONALES (COMPACTAS) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="bg-gradient-to-br from-white to-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3.5 hover:border-[#2C67B0]/40 transition-colors">
            <div className="p-2.5 bg-[#2C67B0]/10 rounded-xl text-[#2C67B0] flex-shrink-0">
              <Recycle size={20} />
            </div>
            <div className="min-w-0">
              <span className="block text-lg md:text-xl font-extrabold text-[#1E305D] leading-tight truncate">
                {loading ? "..." : `${formatNumber(totalTons, 1)} t`}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate block">
                Toneladas Trazadas ({anio})
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3.5 hover:border-[#00AB6D]/40 transition-colors">
            <div className="p-2.5 bg-[#00AB6D]/10 rounded-xl text-[#00AB6D] flex-shrink-0">
              <Users size={20} />
            </div>
            <div className="min-w-0">
              <span className="block text-lg md:text-xl font-extrabold text-[#1E305D] leading-tight truncate">
                {loading ? "..." : formatNumber(totalGestores)}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate block">
                Gestores Vinculados
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3.5 hover:border-[#8CB200]/40 transition-colors">
            <div className="p-2.5 bg-[#8CB200]/10 rounded-xl text-[#8CB200] flex-shrink-0">
              <Factory size={20} />
            </div>
            <div className="min-w-0">
              <span className="block text-lg md:text-xl font-extrabold text-[#1E305D] leading-tight truncate">
                {loading ? "..." : formatNumber(totalTransf)}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate block">
                Transformadores
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3.5 hover:border-[#E8AD00]/40 transition-colors">
            <div className="p-2.5 bg-[#E8AD00]/10 rounded-xl text-[#E8AD00] flex-shrink-0">
              <Globe2 size={20} />
            </div>
            <div className="min-w-0">
              <span className="block text-lg md:text-xl font-extrabold text-[#1E305D] leading-tight truncate">
                {loading ? "..." : formatNumber(totalMun)}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate block">
                Municipios Cubiertos
              </span>
            </div>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: MAPA + PANEL REGIONAL EN UNA SOLA VISTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

          {/* COLUMNA MAPA LEAFLET / OPENSTREETMAP (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-gray-50 rounded-2xl overflow-hidden shadow-inner border border-gray-200 h-[380px] md:h-[430px] relative">
            <MapContainer
              center={[4.57, -74.29]}
              zoom={5.5}
              style={{ height: "100%", width: "100%", background: "#f8fafc" }}
              zoomControl={false}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
              />
              <MapController target={currentTarget} />

              {regionsList.map((r) => (
                <Marker
                  key={r.id}
                  position={r.center}
                  icon={createCustomIcon(activeRegionId === r.id, r.color)}
                  eventHandlers={{
                    click: () => setActiveRegionId(r.id),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                    <div className="text-xs p-1">
                      <p className="font-bold text-[#1E305D]">{r.name}</p>
                      <p className="text-gray-600 font-semibold">{formatNumber(r.toneladas, 1)} t trazadas</p>
                      <p className="text-gray-400 text-[10px]">{r.municipios} municipios | {r.gestores} gestores</p>
                    </div>
                  </Tooltip>
                </Marker>
              ))}

              <ZoomControl position="bottomright" />
            </MapContainer>

            {/* BOTÓN FLOTANTE VISTA NACIONAL */}
            <div className="absolute top-3 right-3 z-[1000]">
              <button
                onClick={() => setActiveRegionId("ALL")}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md backdrop-blur-md transition-all ${
                  activeRegionId === "ALL"
                    ? "bg-[#1E305D] text-white border border-[#1E305D]"
                    : "bg-white/90 text-gray-700 hover:bg-white border border-gray-200"
                }`}
                title="Restablecer a vista general de Colombia"
              >
                <Maximize2 size={13} />
                <span>Vista Nacional</span>
              </button>
            </div>

            {/* BADGE INFORMATIVO FLOTANTE INFERIOR */}
            <div className="absolute bottom-3 left-3 z-[1000] hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/60 px-3 py-1.5 rounded-xl shadow-sm">
              <MapPin size={13} className="text-[#00AB6D]" />
              <span className="text-[11px] text-gray-600 font-medium">
                Haz clic en los marcadores para explorar cada región
              </span>
            </div>
          </div>

          {/* COLUMNA DETALLE Y SELECTOR DE REGIONES (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-3 justify-between">

            {/* SELECTOR HORIZONTAL DE REGIONES (CHIPS COMPACTOS) */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={13} className="text-[#2C67B0]" /> Regiones ({anio})
                </span>
                <span className="text-[11px] text-gray-400">
                  {activeRegionId === "ALL" ? "Consolidado" : currentTarget.name}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveRegionId("ALL")}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all border ${
                    activeRegionId === "ALL"
                      ? "bg-[#1E305D] text-white border-[#1E305D] shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-white hover:border-gray-300"
                  }`}
                >
                  Nacional
                </button>

                {regionsList.map((r) => {
                  const isActive = activeRegionId === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setActiveRegionId(r.id)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 border ${
                        isActive
                          ? "bg-white text-[#1E305D] border-gray-300 shadow-md font-bold ring-1 ring-[#00AB6D]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-white hover:border-gray-300"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: r.color }}
                      />
                      <span>{r.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TARJETA DE DETALLE DE LA REGIÓN SELECCIONADA */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTarget.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-[#1E305D] rounded-2xl p-4 md:p-5 text-white relative overflow-hidden shadow-lg flex-1 flex flex-col justify-between"
              >
                {/* Background glow */}
                <div
                  className="absolute top-0 right-0 w-36 h-36 rounded-full blur-2xl opacity-20 -mr-10 -mt-10"
                  style={{ backgroundColor: currentTarget.color || "#00AB6D" }}
                />

                <div className="relative z-10">
                  {/* Top line with region name & percentage badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">
                        Detalle Territorial
                      </span>
                      <h3 className="text-lg md:text-xl font-extrabold text-white leading-tight">
                        {currentTarget.name}
                      </h3>
                    </div>

                    <div className="text-right flex-shrink-0 bg-white/10 px-2.5 py-1 rounded-xl border border-white/10">
                      <span className="text-sm font-extrabold text-[#B1D357] block leading-tight">
                        {currentTarget.percentage ? `${currentTarget.percentage.toFixed(1)}%` : "0%"}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-white/60 tracking-wider">
                        del Total
                      </span>
                    </div>
                  </div>

                  {/* Barra de progreso visual del volumen */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(currentTarget.percentage || 0, 100)}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: currentTarget.color || "#B1D357" }}
                    />
                  </div>

                  {/* Descripción / Departamentos */}
                  <p className="text-xs text-white/80 leading-relaxed font-light mb-3">
                    {currentTarget.description}
                  </p>
                  <p className="text-[11px] text-white/60 font-medium line-clamp-2 mb-3">
                    <strong className="text-white/80">Cobertura:</strong> {currentTarget.departments}
                  </p>
                </div>

                {/* Métricas 2x2 compactas */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 relative z-10">
                  <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                    <span className="text-[10px] text-white/60 uppercase font-bold block mb-0.5">
                      Toneladas
                    </span>
                    <span className="text-sm md:text-base font-extrabold text-[#B1D357] leading-none">
                      {loading ? "..." : `${formatNumber(currentTarget.toneladas, 1)} t`}
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                    <span className="text-[10px] text-white/60 uppercase font-bold block mb-0.5">
                      Municipios
                    </span>
                    <span className="text-sm md:text-base font-extrabold text-white leading-none">
                      {loading ? "..." : formatNumber(currentTarget.municipios)}
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                    <span className="text-[10px] text-white/60 uppercase font-bold block mb-0.5">
                      Gestores
                    </span>
                    <span className="text-sm md:text-base font-extrabold text-white leading-none">
                      {loading ? "..." : formatNumber(currentTarget.gestores)}
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                    <span className="text-[10px] text-white/60 uppercase font-bold block mb-0.5">
                      Transformadores
                    </span>
                    <span className="text-sm md:text-base font-extrabold text-white leading-none">
                      {loading ? "..." : formatNumber(currentTarget.transformadores)}
                    </span>
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
