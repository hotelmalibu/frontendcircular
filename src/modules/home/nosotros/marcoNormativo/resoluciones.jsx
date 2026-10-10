import React, { useState, useEffect } from "react";
// --- IMPORTACIONES DE LIBRERÍAS ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Package, ShoppingCart, Factory, Truck, Box, FileText, PackageOpen,
  Target, MapPin, Lightbulb, GraduationCap, GlassWater, Recycle, Download
} from 'lucide-react';
import { getResolucionesNormativas, INITIAL_RESOLUCIONES } from "../../../../services/marcoNormativoService";

// Colores del manual de marca oficial
const COLOR_AZUL_PRINCIPAL = '#1E305D';
const COLOR_AZUL_SECUNDARIO = '#2C67B0';
const COLOR_VERDE_PRINCIPAL = '#B1D357';
const COLOR_GRIS_TEXTO = '#1E305D';
const COLOR_BARRA_START = '#B1D357';
const COLOR_BARRA_END = '#808E59';


// --- DATOS PARA GRÁFICOS DINÁMICOS ---
const metasCumplimiento = [
  { year: 2021, percent: 10 }, { year: 2022, percent: 12 }, { year: 2023, percent: 14 },
  { year: 2024, percent: 16 }, { year: 2025, percent: 18 }, { year: 2026, percent: 20 },
  { year: 2027, percent: 22 }, { year: 2028, percent: 24 }, { year: 2029, percent: 27 },
  { year: 2030, percent: 30 },
];

const coberturaGeografica = [
  { year: 2022, city: "San Andrés, Providencia y Santa Catalina", coords: [12.5847, -81.7006] },
  { year: 2023, city: "Cúcuta", coords: [7.8939, -72.5078] },
  { year: 2024, city: "Pasto", coords: [1.2136, -77.2811] },
  { year: 2025, city: "Riohacha", coords: [11.5442, -72.9072] },
  { year: 2026, city: "Florencia", coords: [1.6144, -75.6061] },
  { year: 2027, city: "Yopal", coords: [5.3377, -72.3908] },
  { year: 2028, city: "Quibdó", coords: [5.6947, -76.6611] },
];

const metodologiaCriterios = [
  { name: "Meta cuantitativa", icon: Target }, { name: "Cobertura geográfica", icon: MapPin },
  { name: "Innovación", icon: Lightbulb }, { name: "Educación", icon: GraduationCap },
];

// --- Icono de Lata para Metal ---
const CanIcon = ({ size = 48, color = "#333333" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 4V20C18 21.1046 15.3137 22 12 22C8.68629 22 6 21.1046 6 20V4C6 2.89543 8.68629 2 12 2C15.3137 2 18 2.89543 18 4Z" stroke={color} strokeWidth="2" />
    <path d="M6 4C6 5.10457 8.68629 6 12 6C15.3137 6 18 5.10457 18 4" stroke={color} strokeWidth="2" />
    <path d="M6 16C6 17.1046 8.68629 18 12 18C15.3137 18 18 17.1046 18 16" stroke={color} strokeWidth="2" />
  </svg>
);

// --- Icono Personalizado para Leaflet ---
const customLeafletIcon = L.divIcon({
  html: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${COLOR_VERDE_PRINCIPAL}" stroke="white" stroke-width="1"/>
      <circle cx="12" cy="9" r="2.5" fill="white" />
    </svg>`,
  className: "", iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
});


export default function Index() {
  const [resolucionesList, setResolucionesList] = useState(INITIAL_RESOLUCIONES);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getResolucionesNormativas();
        setResolucionesList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn("Error cargando resoluciones:", err);
        setResolucionesList([]);
      }
    };

    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("normativasUpdated", handleUpdate);
    return () => window.removeEventListener("normativasUpdated", handleUpdate);
  }, []);

  return (
    <div className="mt-24 font-sans min-h-screen" style={{ color: '#e6e6e6ff' }}>


      <div className="px-6 py-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-sans font-extrabold text-center mb-12 uppercase" style={{ color: COLOR_AZUL_PRINCIPAL }}>
          Marco Normativo
        </h1>

        {/* --- SECCIÓN RESOLUCIONES 1407 Y 1342 --- */}
        <section
          className="mb-16 p-8 rounded-xl shadow-lg"
          style={{ backgroundColor: COLOR_AZUL_SECUNDARIO }} // Fondo azul
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">

            <div className="flex flex-col items-center md:items-start flex-shrink-0">
              <h3 className="font-sans font-thin text-3xl text-gray-200 tracking-wider">RESOLUCIÓN</h3>
              <div className="flex items-baseline my-2">
                <span className="font-display font-bold text-7xl text-white">1407</span>
                <span className="font-sans text-3xl text-gray-200 ml-3">de 2018</span>
              </div>
              <div className="flex items-baseline">
                <span className="font-display font-bold text-7xl text-white">1342</span>
                <span className="font-sans text-3xl text-gray-200 ml-3">de 2020</span>
              </div>
              <div className="flex items-baseline mt-2">
                <span className="font-display font-bold text-7xl text-white">803</span>
                <span className="font-sans text-3xl text-gray-200 ml-3">de 2024</span>
              </div>
              <p className="text-sm text-gray-300 mt-4">Ministerio de Ambiente y Desarrollo Sostenible.</p>
            </div>

            <div className="md:w-1/2 text-left md:border-l-2 border-gray-400 border-opacity-50 pl-8">
              <div className="flex flex-wrap justify-start gap-5 text-gray-200 mb-6">
                <Package size={32} /> <ShoppingCart size={32} /> <GlassWater size={32} />
                <Recycle size={32} /> <Box size={32} />
              </div>
              <p className="italic text-gray-100 text-lg leading-relaxed">
                "Por la cual se reglamenta la gestión ambiental de los residuos de envases y empaques de papel, cartón, plástico, vidrio, metal y se toman otras determinaciones".
              </p>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN ACTORES ESTRATÉGICOS (MOVIDA ARRIBA) --- */}
        <section className="mb-16 p-8 bg-white rounded-xl shadow-lg border-t-4" style={{ borderColor: COLOR_VERDE_PRINCIPAL }}>
          <h2 className="text-3xl font-sans font-bold text-center mb-4" style={{ color: COLOR_AZUL_SECUNDARIO }}>
            Actores Estratégicos de Relacionamiento
          </h2>
          <h3 className="text-2xl font-sans font-bold mb-8 text-center" style={{ color: COLOR_AZUL_PRINCIPAL }}>
            Cadena de Valor Circular
          </h3>
          <div className="flex flex-wrap justify-center gap-6">

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <Factory size={40} className="flex-shrink-0" style={{ color: COLOR_AZUL_SECUNDARIO }} />
              <div>
                <h4 className="font-semibold text-lg" style={{ color: COLOR_GRIS_TEXTO }}>Fabricante de Envases y Empaques / Proveedor de Materias Primas</h4>
                <p className="text-sm text-gray-500">Origen de los materiales.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <Package size={40} className="flex-shrink-0" style={{ color: COLOR_AZUL_SECUNDARIO }} />
              <div>
                <h4 className="font-semibold text-lg" style={{ color: COLOR_GRIS_TEXTO }}>Regulado como Productor</h4>
                <p className="text-sm text-gray-500">Empresas que ponen productos en el mercado.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <Truck size={40} className="flex-shrink-0" style={{ color: COLOR_AZUL_SECUNDARIO }} />
              <div>
                <h4 className="font-semibold text-lg" style={{ color: COLOR_GRIS_TEXTO }}>Distribución y Comercializadores</h4>
                <p className="text-sm text-gray-500">Llegan los productos al punto de venta.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <ShoppingCart size={40} className="flex-shrink-0" style={{ color: COLOR_AZUL_SECUNDARIO }} />
              <div>
                <h4 className="font-semibold text-lg" style={{ color: COLOR_GRIS_TEXTO }}>Consumidores</h4>
                <p className="text-sm text-gray-500">Uso y descarte inicial de los productos.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <Recycle size={40} className="flex-shrink-0" style={{ color: COLOR_AZUL_SECUNDARIO }} />
              <div>
                <h4 className="font-semibold text-lg" style={{ color: COLOR_GRIS_TEXTO }}>Transformadoras</h4>
                <p className="text-sm text-gray-500">Procesamiento y reintroducción de materiales.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 1: ¿A QUIÉNES ESTÁ DIRIGIDA? */}
        <section className="mb-16 p-6 bg-white rounded-xl shadow-lg border-t-4" style={{ borderColor: COLOR_AZUL_SECUNDARIO }}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-2/3 text-left">
              <h2 className="text-4xl font-display font-bold mb-6" style={{ color: COLOR_AZUL_PRINCIPAL }}>
                1. ¿A QUIÉNES ESTÁ DIRIGIDA?
              </h2>
              <ul className="list-none text-lg text-gray-700 space-y-3">
                <li className="flex items-center"><span className="text-xl mr-3" style={{ color: COLOR_AZUL_SECUNDARIO }}>◆</span> Productor</li>
                <li className="flex items-center"><span className="text-xl mr-3" style={{ color: COLOR_AZUL_SECUNDARIO }}>◆</span> Importador</li>
                <li className="flex items-center"><span className="text-xl mr-3" style={{ color: COLOR_AZUL_SECUNDARIO }}>◆</span> Sea titular de marca exhibida</li>
                <li className="flex items-center"><span className="text-xl mr-3" style={{ color: COLOR_AZUL_SECUNDARIO }}>◆</span> Ponga en el mercado envases y empaques de un solo uso</li>
              </ul>
            </div>
            <div className="lg:w-1/3 flex justify-center items-center p-4">
              <span className="text-9xl opacity-70">🏭</span>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN 2: OBLIGACIONES DEL PRODUCTOR --- */}
        <section className="mb-16 p-8 bg-white rounded-xl shadow-lg border-t-4" style={{ borderColor: COLOR_AZUL_SECUNDARIO }}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 text-left">
              <h2 className="text-4xl font-display font-bold mb-6" style={{ color: COLOR_AZUL_PRINCIPAL }}>
                2. OBLIGACIONES DEL PRODUCTOR
              </h2>
              <ul className="list-none text-lg text-gray-700 space-y-3">
                <li className="flex items-center">
                  <span className="text-xl mr-3" style={{ color: COLOR_AZUL_SECUNDARIO }}>◆</span> Alcanzar las metas de aprovechamiento de envases y empaques fijadas en la resolución
                </li>
                <li className="flex items-center">
                  <span className="text-xl mr-3" style={{ color: COLOR_AZUL_SECUNDARIO }}>◆</span> Presentar e implementar el plan de gestión ambiental
                </li>
                <li className="flex items-center">
                  <span className="text-xl mr-3" style={{ color: COLOR_AZUL_SECUNDARIO }}>◆</span> Garantizar una cobertura geográfica
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 flex justify-center items-center p-4 gap-4 text-gray-600">
              <span className="text-7xl opacity-80">🍾</span>
              <span className="text-7xl opacity-80">🥫</span>
              <span className="text-7xl opacity-80">🧴</span>
              <span className="text-7xl opacity-80">♻️</span>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN 3: ¿QUÉ ESTÁ REGULADO? --- */}
        <section className="mb-16 p-8 bg-white rounded-xl shadow-lg border-t-4" style={{ borderColor: COLOR_AZUL_SECUNDARIO }}>
          <h2 className="text-4xl font-display font-bold text-center mb-10" style={{ color: COLOR_AZUL_PRINCIPAL }}>
            3. ¿QUÉ ESTÁ REGULADO?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <FileText size={48} className="mb-3" style={{ color: COLOR_GRIS_TEXTO }} />
              <h4 className="text-lg font-semibold" style={{ color: COLOR_GRIS_TEXTO }}>Papel</h4>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <PackageOpen size={48} className="mb-3" style={{ color: COLOR_GRIS_TEXTO }} />
              <h4 className="text-lg font-semibold" style={{ color: COLOR_GRIS_TEXTO }}>Cartón</h4>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <GlassWater size={48} className="mb-3" style={{ color: COLOR_GRIS_TEXTO }} />
              <h4 className="text-lg font-semibold" style={{ color: COLOR_GRIS_TEXTO }}>Vidrio</h4>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="mb-3">
                <CanIcon size={48} color={COLOR_GRIS_TEXTO} />
              </div>
              <h4 className="text-lg font-semibold" style={{ color: COLOR_GRIS_TEXTO }}>Metal</h4>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN 4: METAS DE CUMPLIMIENTO (Con degradado en barras) --- */}
        <section className="mb-16 p-8 bg-white rounded-xl shadow-lg border-t-4" style={{ borderColor: COLOR_VERDE_PRINCIPAL }}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/3 text-left">
              <h2 className="text-4xl font-display font-bold mb-2" style={{ color: COLOR_AZUL_PRINCIPAL }}>
                4. METAS DE CUMPLIMIENTO
              </h2>
              <p className="text-lg text-gray-500 mb-6">Aprovechamiento de los residuos recolectados</p>
              <ul className="list-none text-lg text-gray-700 space-y-3">
                <li className="flex items-center"><span className="text-xl mr-3" style={{ color: COLOR_VERDE_PRINCIPAL }}>◆</span> Reciclaje</li>
                <li className="flex items-center"><span className="text-xl mr-3" style={{ color: COLOR_VERDE_PRINCIPAL }}>◆</span> Coprocesamiento</li>
                <li className="flex items-center"><span className="text-xl mr-3" style={{ color: COLOR_VERDE_PRINCIPAL }}>◆</span> Valorización energética</li>
              </ul>
            </div>

            <div className="lg:w-2/3 w-full" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metasCumplimiento} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLOR_BARRA_START} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={COLOR_BARRA_END} stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis unit="%" />
                  <Tooltip formatter={(value) => [`${value}%`, "Meta"]} />
                  <Bar dataKey="percent" fill="url(#colorBar)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>

        {/* --- SECCIÓN 5: COBERTURA GEOGRÁFICA --- */}
        <section className="mb-16 p-8 bg-white rounded-xl shadow-lg border-t-4" style={{ borderColor: COLOR_AZUL_SECUNDARIO }}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 text-left">
              <h2 className="text-4xl font-display font-bold mb-6" style={{ color: COLOR_AZUL_PRINCIPAL }}>
                5. COBERTURA GEOGRÁFICA MÍNIMA
              </h2>
              <ul className="list-none text-lg text-gray-700 space-y-3">
                {coberturaGeografica.map((item) => (
                  <li key={item.year} className="flex items-center">
                    <span className="text-xl mr-3 font-bold" style={{ color: COLOR_AZUL_SECUNDARIO }}>◆ {item.year}:</span> {item.city}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 w-full h-80 rounded-lg overflow-hidden border-2" style={{ borderColor: COLOR_AZUL_SECUNDARIO }}>
              <MapContainer
                center={[4.5709, -74.2973]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {coberturaGeografica.map((item) => (
                  <Marker key={item.year} position={item.coords} icon={customLeafletIcon}>
                    <Popup>{item.city} ({item.year})</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

          </div>
        </section>

        {/* --- SECCIÓN 6: METODOLOGÍA MULTICRITERIO --- */}
        <section className="mb-16 p-8 bg-white rounded-xl shadow-lg border-t-4" style={{ borderColor: COLOR_VERDE_PRINCIPAL }}>
          <h2 className="text-4xl font-display font-bold text-center mb-10" style={{ color: COLOR_AZUL_PRINCIPAL }}>
            6. METODOLOGÍA MULTICRITERIO
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/3 flex justify-center items-center p-4">
              <Recycle size={150} style={{ color: COLOR_VERDE_PRINCIPAL }} strokeWidth={1} />
            </div>
            <div className="lg:w-2/3 text-left">
              <div
                className="w-full p-6 rounded-lg"
                style={{ backgroundColor: COLOR_AZUL_SECUNDARIO }} // Fondo azul para la lista
              >
                <h3 className="text-2xl font-bold text-white mb-4 border-b-2 border-white pb-2">CRITERIO</h3>
                <ul className="list-none text-lg text-white space-y-4">
                  {metodologiaCriterios.map((criterio, index) => {
                    const IconComponent = criterio.icon;
                    return (
                      <li key={index} className="flex items-center gap-3">
                        <IconComponent size={24} />
                        <span>{criterio.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>


        {/* Contenedor de Resoluciones en Formato Grid (Estilo Noticias) */}
        <div className="mt-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="bg-[#B1D357] text-[#1E305D] text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-wider shadow-sm">
              Repositorio Regulatorio
            </span>
            <h2
              className="text-3xl md:text-4xl font-sans font-extrabold mt-3"
              style={{ color: COLOR_AZUL_PRINCIPAL }}
            >
              Resoluciones Oficiales
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Descarga y consulta las resoluciones ministeriales oficiales sobre gestión de envases, empaques y plásticos.
            </p>
          </div>

          {resolucionesList.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white max-w-xl mx-auto p-8 shadow-sm">
              <FileText size={48} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#1E305D]">No hay resoluciones registradas</h3>
              <p className="text-xs text-gray-500 mt-1">Actualmente no se han publicado resoluciones.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {resolucionesList.map((res, index) => {
                const bannerImg = res.banner || res.image || res.cover;
                return (
                  <div
                    key={res.id || index}
                    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
                  >
                    {/* Portada / Banner superior si existe */}
                    {bannerImg ? (
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={bannerImg}
                          alt={res.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-[#B1D357] text-[#1E305D] text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                          {res.year || "Resolución"}
                        </div>
                      </div>
                    ) : (
                      <div className="px-6 pt-6 pb-1 flex items-center justify-between">
                        <span className="bg-[#B1D357] text-[#1E305D] text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                          {res.year || "Resolución"}
                        </span>
                      </div>
                    )}

                    {/* Cuerpo de la tarjeta */}
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">
                        {res.entity || "Ministerio de Ambiente y Desarrollo Sostenible"}
                      </p>
                      <h3
                        className="text-xl font-bold leading-snug mb-3 line-clamp-2"
                        style={{ color: COLOR_AZUL_PRINCIPAL }}
                      >
                        {res.title || `Resolución ${res.year}`}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1 text-justify">
                        {res.desc}
                      </p>

                      {/* Botón de Descarga */}
                      {res.file && (
                        <a
                          href={res.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm transition-all duration-300 bg-[#B1D357] text-[#1E305D] hover:bg-[#9cb84d] hover:shadow-md active:scale-95 mt-auto"
                        >
                          <Download size={16} />
                          Descargar Documento
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-10"></div>
      </div>
    </div>
  );
}