import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Search, MapPin, Mail, Phone, Globe, User as UserIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import fondoMapa from '../../assets/fondo_mapaC.jpg';
import PyrcomLogo from '../../assets/empresaLogos/Pyrcom.png';
import AaroLogo from '../../assets/empresaLogos/Acebrí.png';
import AropetLogo from '../../assets/empresaLogos/Apropet.png';
import ArtepopLogo from '../../assets/empresaLogos/ArtePop.png';
import BarrplasticLogo from '../../assets/empresaLogos/Barrplastic.png';
import BiocirculoLogo from '../../assets/empresaLogos/Biocirculo.png';
import CajaplastLogo from '../../assets/empresaLogos/CajaplastFE.png';
import CartoneyapelLogo from '../../assets/empresaLogos/Cartonera.png';
import DpwateringLogo from '../../assets/empresaLogos/DPWatering.png';
import EsenttiaLogo from '../../assets/empresaLogos/Esenttia.png';
import LatpackLogo from '../../assets/empresaLogos/Latinpack.png';
import LaycoLogo from '../../assets/empresaLogos/Layco.png';
import ProcesadosMargaLogo from '../../assets/empresaLogos/Procesados.jpg';
import PlastypetLogo from '../../assets/empresaLogos/Plastypetco.png';
import RecicleneLogo from '../../assets/empresaLogos/Reciclene.png';
import RedpackLogo from '../../assets/empresaLogos/Redpack.jpg';
import EmpacorLogo from '../../assets/empresaLogos/Empacor.png';
import RmiReciclajeLogo from '../../assets/empresaLogos/RMI.png';
import RecuperacionDccLogo from '../../assets/empresaLogos/RCP.png';
import SonocoLogo from '../../assets/empresaLogos/Sonoco.png';

// --- DATOS DE EMPRESAS REALES DE LA MAQUETA ---
const allEmpresas = [
  // VENDEN PRODUCTOS
  {
    id: 1,
    name: 'PYRCOM',
    region: 'Bogotá',
    tipo: 'Plástico Rígido',
    descripcion: 'Resina PP y PET reciclada, Aceite de pirólisis',
    logo: PyrcomLogo,
    contacto: 'Helmer Acevedo',
    telefono: '+573174986921',
    email: 'Info@pyrcom.com.co',
    servicios: ['Resina PP reciclada', 'Resina PET reciclada', 'Aceite de pirólisis'],
    website: 'www.pyrcom.com.co',
    categoria: 'venden_productos'
  },
  {
    id: 2,
    name: 'APROPET',
    region: 'Bogotá',
    tipo: 'Plástico Rígido',
    descripcion: 'Resina PET reciclada, Materiales posindustriales',
    logo: AropetLogo,
    contacto: 'Liz Fonseca',
    telefono: '+573102890349',
    email: 'lfonseca@apropet.com',
    servicios: ['Resina PET reciclada', 'Materiales posindustriales'],
    website: 'www.apropet.com',
    categoria: 'venden_productos'
  },
  {
    id: 3,
    name: 'BioCirculo',
    region: 'Medellín',
    tipo: 'Plástico Rígido',
    descripcion: 'Venta de resinas, Productos plásticos',
    logo: BiocirculoLogo,
    contacto: 'Comercial',
    telefono: '+573188132817',
    email: 'commercial@biocirculo.com',
    servicios: ['Venta de resinas', 'Productos plásticos', 'Asesorías en ecodiseño'],
    website: 'www.biocirculo.com',
    categoria: 'venden_productos'
  },
  {
    id: 4,
    name: 'Barr Plastic',
    region: 'Barranquilla',
    tipo: 'Plástico Flexible',
    descripcion: 'Plásticos rígidos y flexibles de baja densidad',
    logo: BarrplasticLogo,
    contacto: 'Comercial',
    telefono: '+573108993638',
    email: 'barrplastic@gmail.com',
    servicios: ['Plásticos rígidos', 'Plásticos flexibles de baja densidad'],
    website: 'www.barrplastic.com',
    categoria: 'venden_productos'
  },
  {
    id: 5,
    name: 'CajaPlast FE',
    region: 'Bogotá',
    tipo: 'Plástico Rígido',
    descripcion: 'Resina reciclada de alta y baja densidad',
    logo: CajaplastLogo,
    contacto: 'Fabio Espitia',
    telefono: '+573213366471',
    email: 'commercial@cajaplastfe.com',
    servicios: ['Resina reciclada', 'Protección de marca', 'Tratamiento de agua'],
    website: 'www.cajaplastfe.com',
    categoria: 'venden_productos'
  },
  {
    id: 6,
    name: 'LayCo',
    region: 'Cali',
    tipo: 'Madera Plástica',
    descripcion: 'Productos en madera plástica',
    logo: LaycoLogo,
    contacto: 'LayCo',
    telefono: '+573104567890',
    email: 'layco@laycolimitada.com',
    servicios: ['Productos en madera plástica'],
    website: 'www.layco.com.co',
    categoria: 'venden_productos'
  },
  {
    id: 7,
    name: 'PlastyPet',
    region: 'Medellín',
    tipo: 'Plástico Rígido',
    descripcion: 'Resinas peletizadas PCR, bolsas de polietileno',
    logo: PlastypetLogo,
    contacto: 'Viviana Gordillo',
    telefono: '+573203046309',
    email: 'viviana.gordillo@plastypetco.com',
    servicios: ['Resinas peletizadas PCR', 'Bolsas de polietileno', 'Productos eco amigables'],
    website: 'www.plastypetco.com',
    categoria: 'venden_productos'
  },
  {
    id: 8,
    name: 'RedPack',
    region: 'Guadalajara de Buga',
    tipo: 'Cartón',
    descripcion: 'Cartón y sacos de papel, Resinas peletizadas PCR',
    logo: RedpackLogo,
    contacto: 'Cristina Vásquez Monsalve',
    telefono: '+573164243425',
    email: 'gerencia@redpack.com.co',
    servicios: ['Cartón y sacos de papel', 'Resinas peletizadas PCR', 'Gestión de papel kraft'],
    website: 'www.redpack.com.co',
    categoria: 'venden_productos'
  },

  // OFRECEN SERVICIOS
  {
    id: 9,
    name: 'ArtePop',
    region: 'Bogotá',
    tipo: 'Consultoría',
    descripcion: 'Diseño, protección de marca, proyectos de economía circular',
    logo: ArtepopLogo,
    contacto: 'Adriana María González',
    telefono: '+573012293490',
    email: 'a.gonzalez@artepop.co',
    servicios: ['Protección de marca', 'Diseño de productos', 'Diseño de campañas', 'Proyectos de economía circular', 'Agricultura urbana'],
    website: 'www.artepop.co',
    categoria: 'ofrecen_servicios'
  },
  {
    id: 10,
    name: 'DP Watering',
    region: 'Bogotá',
    tipo: 'Servicios Agua',
    descripcion: 'Sistemas para producción de agua potable, pura y ultrapura',
    logo: DpwateringLogo,
    contacto: 'Andrés Martinez',
    telefono: '+573206935361',
    email: 'd.lozano@dpwatering.com',
    servicios: ['Agua potable', 'Agua de proceso', 'Agua pura', 'Agua ultrapura', 'Sistemas de tratamiento'],
    website: 'www.dpwatering.com',
    categoria: 'ofrecen_servicios'
  },
  {
    id: 11,
    name: 'CartoXA',
    region: 'Cali',
    tipo: 'Servicios Papel',
    descripcion: 'Papel kraft, cartón corrugado, embalajes especializados',
    logo: CartoneyapelLogo,
    contacto: 'Clara Ines Muriel',
    telefono: '+573113426169',
    email: 'commercial@cartopacifico.com',
    servicios: ['Papel kraft', 'Cartón corrugado', 'Embalajes de alimentos', 'Embalajes bebidas', 'Pulpa moldeada'],
    website: 'www.cartopacifico.com',
    categoria: 'ofrecen_servicios'
  },
  {
    id: 12,
    name: 'ACEBRI',
    region: 'Bogotá',
    tipo: 'Manufactura',
    descripcion: 'Fabricación de empaques, aditivos biodegradables, madera plástica',
    logo: AaroLogo,
    contacto: 'Ventas',
    telefono: '+573162863685',
    email: 'ventas@acebri.com',
    servicios: ['Empaques plásticos', 'Aditivos biodegradables', 'Madera plástica'],
    website: 'www.acebri.com',
    categoria: 'ofrecen_servicios'
  },
  {
    id: 13,
    name: 'Esenttia',
    region: 'Bogotá',
    tipo: 'Manufactura',
    descripcion: 'Empaques y bienes para transporte, textiles, alimentos y construcción',
    logo: EsenttiaLogo,
    contacto: 'Servicio al Cliente',
    telefono: '+576015960220',
    email: 'servicioalcliente@esenttia.co',
    servicios: ['Empaques transporte', 'Empaques textiles', 'Empaques alimentos', 'Bienes construcción'],
    website: 'www.esenttia.co',
    categoria: 'ofrecen_servicios'
  },
  {
    id: 14,
    name: 'LatiPack',
    region: 'Medellín',
    tipo: 'Manufactura',
    descripcion: 'Elaboración de cajas para empaques, embalaje de alimentos',
    logo: LatpackLogo,
    contacto: 'Comercial',
    telefono: '+573162863685',
    email: 'ventas@latinpack.com.co',
    servicios: ['Cajas para empaques', 'Embalaje de alimentos', 'Cajas de cartón'],
    website: 'www.latinpack.com.co',
    categoria: 'ofrecen_servicios'
  },
  {
    id: 15,
    name: 'Procesados Margarita',
    region: 'Barranquilla',
    tipo: 'Manufactura',
    descripcion: 'Cabos de plástico, empaques de huevos, fibras para escobas',
    logo: ProcesadosMargaLogo,
    contacto: 'Johan Stiven Toledo',
    telefono: '+576014078319',
    email: 'resolinhe01@hotmail.com',
    servicios: ['Cabos de plástico', 'Empaques de huevos', 'Fibras para escobas', 'Láminas para rosas'],
    website: 'www.procesadosmargarita.com',
    categoria: 'ofrecen_servicios'
  },
  {
    id: 16,
    name: 'Reciclene',
    region: 'Cali',
    tipo: 'Gestión Residuos',
    descripcion: 'Protección de marca, manejo de residuos',
    logo: RecicleneLogo,
    contacto: 'Jennifer Garrido',
    telefono: '+573133436142',
    email: 'Lrojas@reciclene.com.co',
    servicios: ['Manejo de residuos', 'Protección de marca', 'Gestión ambiental'],
    website: 'www.reciclene.com.co',
    categoria: 'ofrecen_servicios'
  },

  // COMERCIALIZACIÓN DE MATERIALES - NUEVAS EMPRESAS
  {
    id: 17,
    name: 'Empacor',
    region: 'Bogotá',
    tipo: 'Comercialización',
    descripcion: 'Papel chip, conversión de cintas y hojas, tubos core',
    logo: EmpacorLogo,
    contacto: 'Johana Ochoa',
    telefono: '+573053493700',
    email: 'johana.ochoa@empacor.com',
    servicios: ['Papel chip', 'Conversión de cintas', 'Conversión de hojas', 'Tubos core', 'Comercialización de papel'],
    website: 'www.empacor.com',
    categoria: 'comercializacion'
  },
  {
    id: 18,
    name: 'Recuperación DCC',
    region: 'Bogotá',
    tipo: 'Comercialización',
    descripcion: 'Protección de marca, manejo de residuos, comercialización de materiales',
    logo: RecuperacionDccLogo,
    contacto: 'Omar Saavedra',
    telefono: '+573183803123',
    email: 'recuperaciondccinfo@gmail.com',
    servicios: ['Protección de marca', 'Manejo de residuos', 'Comercialización de materiales reciclados'],
    website: 'www.recuperaciondcc.com',
    categoria: 'comercializacion'
  },
  {
    id: 19,
    name: 'RMI Reciclaje',
    region: 'Guadalajara de Buga',
    tipo: 'Comercialización',
    descripcion: 'Plásticos, cartón, papel, vidrio, metales y chatarra',
    logo: RmiReciclajeLogo,
    contacto: 'Diego Martinez',
    telefono: '+573166347209',
    email: 'contacto@reciclaje-rmi.com',
    servicios: ['Comercialización de plásticos', 'Comercialización de cartón', 'Compra de chatarra', 'Gestión de residuos', 'Resinas peletizadas PCR'],
    website: 'www.reciclaje-rmi.com',
    categoria: 'comercializacion'
  },
  {
    id: 20,
    name: 'Sonoco',
    region: 'Cali',
    tipo: 'Comercialización',
    descripcion: 'Cartón y sacos de papel kraft, productos de papel',
    logo: SonocoLogo,
    contacto: 'Johana Ochoa',
    telefono: '+573053493700',
    email: 'johana.ochoa@sonoco.com',
    servicios: ['Cartón y sacos de papel kraft', 'Gestión de sacos de papel', 'RCD (Reciclaje de contenedores de desechos)', 'Consulta de condiciones de compra'],
    website: 'www.sonoco.com',
    categoria: 'comercializacion'
  }
];

const categoriasFiltro = [
  { id: 'todos', nombre: 'Todos', color: '#00AB6D' },
  { id: 'venden_productos', nombre: 'Venden Productos', color: '#2C67B0' },
  { id: 'ofrecen_servicios', nombre: 'Ofrecen Servicios', color: '#00AB6D' },
  { id: 'comercializacion', nombre: 'Comercialización', color: '#B1D357' }
];

// --- COMPONENTE PRINCIPAL ---
export default function MapSection() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [empresasFiltradas, setEmpresasFiltradas] = useState(user ? allEmpresas : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  useEffect(() => {
    if (!user) {
      setEmpresasFiltradas([]);
      return;
    }
    let filtradas = allEmpresas;
    if (categoriaSeleccionada !== 'todos') {
      filtradas = filtradas.filter(e => e.categoria === categoriaSeleccionada);
    }
    if (searchTerm.trim()) {
      filtradas = filtradas.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setEmpresasFiltradas(filtradas);
  }, [categoriaSeleccionada, user, searchTerm]);

  return (
    <div
      className="relative w-full min-h-screen bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: `url(${fondoMapa})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      
      {/* Contenido Principal */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        
        {/* SECCIÓN 1: Acceso Requerido (sin login) */}
        {!user && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <MapPin className="w-20 h-20 text-[#1E305D] mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#1E305D] mb-3">Acceso Requerido</h1>
              <p className="text-lg md:text-xl text-[#1E305D]">
                Inicia sesión para ver el directorio de empresas aliadas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4 w-full max-w-sm"
            >
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-[#00AB6D] to-[#008A5C] hover:from-[#009B5F] hover:to-[#007A4E] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                Iniciar Sesión →
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-gradient-to-r from-[#B1D357] to-[#9AC844] hover:from-[#A8C84E] hover:to-[#90B53D] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                Registrarse →
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-20 pt-12 border-t border-white/30 max-w-2xl"
            >
              <MapPin className="w-16 h-16 text-[#1E305D] mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E305D] mb-2">
                Directorio de Empresas
              </h2>
              <p className="text-base md:text-lg text-[#1E305D]">
                Selecciona una región para ver las empresas aliadas en economía circular.
              </p>
            </motion.div>
          </div>
        )}

        {/* SECCIÓN 2: Directorio de Empresas (con login) */}
        {user && (
          <div className="flex-1 flex flex-col py-8 px-6 md:px-12 lg:px-20">
            
            {/* Búsqueda y Filtros */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {/* Búsqueda */}
              <div className="mb-6 relative">
                <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar empresa por nombre o región..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AB6D] focus:ring-2 focus:ring-[#00AB6D]/20 text-sm bg-white/95 backdrop-blur-md"
                />
              </div>

              {/* Filtros por Categoría */}
              <div className="flex flex-wrap gap-3">
                {categoriasFiltro.map(cat => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCategoriaSeleccionada(cat.id)}
                    className={`px-4 py-2 rounded-full font-bold transition-all duration-300 text-sm ${
                      categoriaSeleccionada === cat.id
                        ? 'text-white shadow-lg scale-105'
                        : 'bg-white/70 text-gray-700 hover:bg-white/90'
                    }`}
                    style={{
                      backgroundColor: categoriaSeleccionada === cat.id ? cat.color : undefined
                    }}
                  >
                    {cat.nombre}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Grid de Empresas */}
            <div className="flex-1">
              {empresasFiltradas.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12"
                >
                  {empresasFiltradas.map((empresa, idx) => (
                    <motion.div
                      key={empresa.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedEmpresa(empresa)}
                      className={`rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 ${
                        selectedEmpresa?.id === empresa.id
                          ? 'border-[#00AB6D] bg-white/95'
                          : 'border-white/30 bg-white/90 hover:border-[#00AB6D]/50'
                      }`}
                    >
                      {/* Logo */}
                      <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden p-2 border-b border-gray-200 group-hover:from-[#00AB6D]/10 group-hover:to-[#2C67B0]/10 transition-all">
                        <img 
                          src={empresa.logo} 
                          alt={empresa.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      {/* Contenido */}
                      <div className="p-3">
                        {/* Nombre */}
                        <h4 className="font-bold text-[#1E305D] text-sm mb-1 line-clamp-2">{empresa.name}</h4>

                        {/* Badge Categoría */}
                        <div className="mb-2">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-bold text-white inline-block"
                            style={{
                              backgroundColor: empresa.categoria === 'venden_productos' 
                                ? '#2C67B0' 
                                : empresa.categoria === 'ofrecen_servicios' 
                                ? '#00AB6D' 
                                : '#B1D357'
                            }}
                          >
                            {empresa.categoria === 'venden_productos' ? '📦 Productos' : empresa.categoria === 'ofrecen_servicios' ? '🔧 Servicios' : '🛒 Comercialización'}
                          </span>
                        </div>

                        {/* Región */}
                        <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                          <MapPin size={12} className="flex-shrink-0" />
                          {empresa.region}
                        </p>

                        {/* Descripción */}
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{empresa.descripcion}</p>

                        {/* Botón Ver Detalles */}
                        <button className="w-full bg-gradient-to-r from-[#00AB6D] to-[#008A5C] hover:from-[#009B5F] hover:to-[#007A4E] text-white font-bold py-2 rounded-lg text-xs transition-all duration-300 hover:shadow-lg">
                          Ver Detalles
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <MapPin size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium text-lg">
                    {searchTerm ? 'No se encontraron empresas' : 'No hay empresas disponibles'}
                  </p>
                </div>
              )}
            </div>

            {/* ENCABEZADO ABAJO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center py-6 border-t border-white/30 mt-12"
            >
              <MapPin className="w-14 h-14 text-[#1E305D] mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#1E305D] mb-1.5">
                Directorio de Empresas
              </h2>
              <p className="text-sm md:text-base text-[#1E305D] max-w-2xl mx-auto">
                Selecciona una región para ver las empresas aliadas en economía circular.
              </p>
            </motion.div>
          </div>
        )}

        {/* MODAL DETALLE EMPRESA */}
        {selectedEmpresa && user && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pt-20"
            onClick={() => setSelectedEmpresa(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[calc(100vh-120px)] overflow-hidden flex flex-col"
            >
              {/* Header con Close Button */}
              <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex gap-4 flex-1">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                    <img 
                      src={selectedEmpresa.logo} 
                      alt={selectedEmpresa.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1E305D] mb-1">{selectedEmpresa.name}</h3>
                    <p className="text-sm text-gray-600">{selectedEmpresa.descripcion}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmpresa(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Contenido - Sin Scroll */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* Información de Contacto */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <MapPin size={18} className="text-[#00AB6D] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Región</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedEmpresa.region}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <UserIcon size={18} className="text-[#2C67B0] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Contacto</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedEmpresa.contacto}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Phone size={18} className="text-[#00AB6D] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Teléfono</p>
                      <a href={`tel:${selectedEmpresa.telefono}`} className="text-sm font-semibold text-[#00AB6D] hover:underline">
                        {selectedEmpresa.telefono}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Mail size={18} className="text-[#2C67B0] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Email</p>
                      <a href={`mailto:${selectedEmpresa.email}`} className="text-sm font-semibold text-[#2C67B0] hover:underline truncate">
                        {selectedEmpresa.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-[#B1D357] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Sitio Web</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedEmpresa.website}</p>
                    </div>
                  </div>
                </div>

                {/* Productos/Servicios */}
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-3">
                    {selectedEmpresa.categoria === 'venden_productos' ? '📦 Productos:' : selectedEmpresa.categoria === 'ofrecen_servicios' ? '🔧 Servicios:' : '🛒 Materiales:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmpresa.servicios.map((servicio, idx) => (
                      <span key={idx} className="bg-[#00AB6D]/15 text-[#00AB6D] px-3 py-1.5 rounded-full text-xs font-medium border border-[#00AB6D]/30">
                        {servicio}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}