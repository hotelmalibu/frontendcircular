import React from "react";
// --- IMPORTACIONES DE LIBRERÍAS ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Files, GlassWater, Trash2, Recycle, Target, MapPin, Lightbulb, GraduationCap,
  Package, ShoppingCart, Factory, Truck, Box
} from 'lucide-react';



// PDFs (se mantienen)
import pdf1407 from "../../../../assets/marconormativo/resoluciones/resolucion-1407-de-2018.pdf";
import pdf1342 from "../../../../assets/marconormativo/resoluciones/resolucion-1342-de-2020.pdf";
import pdf0803 from "../../../../assets/marconormativo/resoluciones/RES.-0803-DE-24-JUN-2024-REDUCCION-GRADUAL-DE-PRODUCCION-Y-CONSUMO-CIERTOS-PRODUCTOS-PLASTICOS-4 (1).pdf";
import decreto1381 from "../../../../assets/marconormativo/resoluciones/DECRETO_1381_DE_2024.pdf";
import decreto0670 from "../../../../assets/marconormativo/resoluciones/decreto-0670-del-17-de-junio-de-2025-1.pdf";

// Colores del manual de marca
const COLOR_AZUL_PRINCIPAL = '#1E305D';
const COLOR_AZUL_SECUNDARIO = '#2C67B0';
const COLOR_VERDE_PRINCIPAL = '#00AB6D';
const COLOR_GRIS_TEXTO = '#333333';
const COLOR_BARRA_START = '#00AB6D';
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

  const handleLinkHover = (e, isHovering) => {
    e.target.style.color = isHovering ? COLOR_VERDE_PRINCIPAL : COLOR_AZUL_SECUNDARIO;
  };

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
                <span className="font-display font-bold text-4xl text-white ml-2">RES.</span>
                <span className="font-sans text-3xl text-gray-200 ml-3">de 2024</span>
              </div>
              <div className="flex items-baseline mt-2">
                <span className="font-display font-bold text-7xl text-white">1381</span>
                <span className="font-display font-bold text-4xl text-white ml-2">DEC.</span>
                <span className="font-sans text-3xl text-gray-200 ml-3">de 2024</span>
              </div>
              <div className="flex items-baseline mt-2">
                <span className="font-display font-bold text-7xl text-white">0670</span>
                <span className="font-display font-bold text-4xl text-white ml-2">DEC.</span>
                <span className="font-sans text-3xl text-gray-200 ml-3">de 2025</span>
              </div>
              <p className="text-sm text-gray-300 mt-4">Ministerio de Ambiente y Desarrollo Sostenible.</p>
            </div>

            <div className="md:w-1/2 text-left md:border-l-2 border-gray-400 border-opacity-50 pl-8">
              <div className="flex flex-wrap justify-start gap-5 text-gray-200 mb-6">
                <Package size={32} /> <ShoppingCart size={32} /> <GlassWater size={32} />
                <Recycle size={32} /> <Trash2 size={32} /> <Box size={32} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md">
              <Factory size={40} className="flex-shrink-0" style={{ color: COLOR_AZUL_SECUNDARIO }} />
              <div>
                <h4 className="font-semibold text-lg" style={{ color: COLOR_GRIS_TEXTO }}>Fabricante de Envases y Empaques / Proveedor de Materias Primas</h4>
                <p className="text-sm text-gray-500">Origen de los materiales.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md">
              <Package size={40} className="flex-shrink-0" style={{ color: COLOR_AZUL_SECUNDARIO }} />
              <div>
                <h4 className="font-semibold text-lg" style={{ color: COLOR_GRIS_TEXTO }}>Regulado como Productor</h4>
                <p className="text-sm text-gray-500">Empresas que ponen productos en el mercado.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md">
              <Truck size={40} className="flex-shrink-0" style={{ color: COLOR_AZUL_SECUNDARIO }} />
              <div>
                <h4 className="font-semibold text-lg" style={{ color: COLOR_GRIS_TEXTO }}>Distribución y Comercializadores</h4>
                <p className="text-sm text-gray-500">Llegan los productos al punto de venta.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md">
              <ShoppingCart size={40} className="flex-shrink-0" style={{ color: COLOR_AZUL_SECUNDARIO }} />
              <div>
                <h4 className="font-semibold text-lg" style={{ color: COLOR_GRIS_TEXTO }}>Consumidores</h4>
                <p className="text-sm text-gray-500">Uso y descarte inicial de los productos.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md">
              <Trash2 size={40} className="flex-shrink-0" style={{ color: COLOR_AZUL_SECUNDARIO }} />
              <div>
                <h4 className="font-semibold text-lg" style={{ color: COLOR_GRIS_TEXTO }}>Gestores</h4>
                <p className="text-sm text-gray-500">Recolección y pre-tratamiento de residuos.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md">
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
              <Files size={48} className="mb-3" style={{ color: COLOR_GRIS_TEXTO }} />
              <h4 className="text-lg font-semibold" style={{ color: COLOR_GRIS_TEXTO }}>Papel y cartón</h4>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <GlassWater size={48} className="mb-3" style={{ color: COLOR_GRIS_TEXTO }} />
              <h4 className="text-lg font-semibold" style={{ color: COLOR_GRIS_TEXTO }}>Vidrio</h4>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Trash2 size={48} className="mb-3" style={{ color: COLOR_GRIS_TEXTO }} />
              <h4 className="text-lg font-semibold" style={{ color: COLOR_GRIS_TEXTO }}>Basuras</h4>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Box size={48} className="mb-3" style={{ color: COLOR_GRIS_TEXTO }} />
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


        {/* Contenedor de los Links a PDF (Sin cambios) */}
        <div className="text-center max-w-3xl mx-auto p-10 bg-white rounded-2xl shadow-xl space-y-8">
          <h2
            className="text-3xl md:text-4xl font-sans font-bold"
            style={{ color: COLOR_AZUL_PRINCIPAL }}
          >
            Descarga de Documentos Oficiales
          </h2>

          <div className="space-y-6">
            {[
              {
                year: '1407 de 2018',
                file: pdf1407,
                desc:
                  'Regula la gestión de residuos de envases y empaques de papel, cartón, plástico, vidrio y metal. Obliga a los productores a implementar planes para su recolección y reciclaje, promoviendo la economía circular en Colombia.'
              },
              {
                year: '1342 de 2020',
                file: pdf1342,
                desc:
                  'Modifica la Resolución 1407 de 2018, ajustando plazos, definiciones y responsabilidades. Busca fortalecer el cumplimiento ambiental y mejorar la gestión de residuos de envases y empaques.'
              },
              {
                year: '0803 de 2024',
                file: pdf0803,
                desc:
                  'Reglamenta la Ley 2232 de 2022 para reducir gradualmente los plásticos de un solo uso. Promueve materiales alternativos y el uso de contenido reciclado para proteger el ambiente.'
              },
              {
                year: 'Decreto 1381 de 2024',
                file: decreto1381,
                desc:
                  'Establece medidas para la gestión integral de residuos y promueve la transición hacia modelos de economía circular, fortaleciendo la normativa ambiental vigente.'
              },
              {
                year: '0670 de 2025',
                file: decreto0670,
                desc:
                  'Decreto 0670 del 17 de junio de 2025. Fortalece las medidas de gestión ambiental y economía circular, estableciendo nuevos lineamientos para el cumplimiento normativo.'
              }
            ].map((res, index) => (
              <div
                key={index}
                className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 text-left bg-gray-50 hover:bg-gray-100"
              >
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ color: COLOR_AZUL_PRINCIPAL }}
                >
                  Resolución {res.year}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed text-justify">
                  {res.desc}
                </p>
                <a
                  href={res.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white px-5 py-2 rounded-lg font-medium transition-all duration-300"
                  style={{
                    backgroundColor: COLOR_AZUL_PRINCIPAL,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                >
                  Ver Documento
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="h-10"></div>
      </div>
    </div>
  );
}