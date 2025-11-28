// src/data/mockContentData.js
import proyecto1 from "../assets/home/Proyectos/proyecto1.png";
import proyecto2 from "../assets/home/Proyectos/proyecto2.png";
import proyecto3 from "../assets/home/Proyectos/proyecto3.png";
import proyecto4 from "../assets/home/Proyectos/proyecto4.png";
import proyecto5 from "../assets/home/Proyectos/proyecto5.png";
import proyecto6 from "../assets/home/Proyectos/proyecto6.png";

export const projectsData = [
  {
    id: 1,
    title: "Fortalecimiento de Recicladores de Oficio",
    type: "FORTALECIMIENTO",
    color: "#1E305D",
    image: proyecto1,
    shortDescription: "Programa de inclusión y formalización de recicladores con capacitación, equipamiento y vinculación a la cadena de valor.",
    // Datos extendidos para el detalle
    date: "Marzo 2024 - Presente",
    location: "Bogotá y Cundinamarca",
    stats: [
      { label: "Recicladores beneficiados", value: "1,200+" },
      { label: "Material recuperado", value: "500 Ton" },
      { label: "Municipios", value: "12" }
    ],
    challenge: "La informalidad en el oficio del reciclaje impide el acceso a seguridad social, precios justos y condiciones dignas de trabajo para miles de familias.",
    solution: "Implementamos un modelo integral que incluye dotación de uniformes y EPP, capacitación en manejo de residuos y habilidades blandas, y conexión directa con la industria transformadora.",
    impact: "Hemos logrado incrementar los ingresos promedio de los recicladores en un 35% y formalizar a 3 cooperativas nuevas en el último año."
  },
  {
    id: 2,
    title: "Modelos de Negocio Circular",
    type: "INNOVACIÓN",
    color: "#00AB6D",
    image: proyecto2,
    shortDescription: "Desarrollo de soluciones innovadoras para la transformación de residuos en nuevos productos de alto valor.",
    date: "Enero 2023 - Diciembre 2024",
    location: "Nacional",
    stats: [
      { label: "Startups incubadas", value: "15" },
      { label: "Prototipos validados", value: "28" },
      { label: "Inversión gestionada", value: "$200M" }
    ],
    challenge: "El 78% de los residuos aprovechables terminan en rellenos sanitarios por falta de tecnologías de transformación accesibles.",
    solution: "Creamos una incubadora de negocios verdes que financia y asesora técnicamente a emprendedores que crean productos a partir de plástico post-consumo y biomasa.",
    impact: "Desarrollo de madera plástica certificada para construcción de vivienda de interés social."
  },
  { 
    id: 3, 
    title: "Sensibilización al Consumidor", 
    type: "PEDAGOGÍA", 
    color: "#1E305D", 
    image: proyecto3, 
    shortDescription: "Campañas educativas para promover la separación en la fuente.", 
    date: "Continuo", 
    location: "Medellín", 
    stats: [], 
    challenge: "...", 
    solution: "...", 
    impact: "..." 
  },
  { 
    id: 4, 
    title: "Investigación en Materiales", 
    type: "INVESTIGACIÓN", 
    color: "#00AB6D", 
    image: proyecto4, 
    shortDescription: "Estudios sobre nuevos materiales.", 
    date: "2024", 
    location: "Cali", 
    stats: [], 
    challenge: "...", 
    solution: "...", 
    impact: "..." 
  },
  { 
    id: 5, 
    title: "Producción Sostenible Local", 
    type: "PRODUCCIÓN", 
    color: "#1E305D", 
    image: proyecto5, 
    shortDescription: "Iniciativas con productores locales.", 
    date: "2023", 
    location: "Caribe", 
    stats: [], 
    challenge: "...", 
    solution: "...", 
    impact: "..." 
  },
  { 
    id: 6, 
    title: "Economía Colaborativa Verde", 
    type: "ECONOMÍA", 
    color: "#00AB6D", 
    image: proyecto6, 
    shortDescription: "Plataformas digitales de intercambio.", 
    date: "2024", 
    location: "Virtual", 
    stats: [], 
    challenge: "...", 
    solution: "...", 
    impact: "..." 
  },
  // NUEVA NOTICIA DE INVESTIGACIÓN
  {
    id: 7,
    title: "Bio-materiales de Residuos Agroindustriales",
    type: "INVESTIGACIÓN",
    color: "#00AB6D", // Color verde para investigación/innovación
    image: proyecto4, // Reutilizando imagen (Importar una nueva si es necesario)
    shortDescription: "Análisis de viabilidad para crear empaques compostables a partir de fibra de plátano y yuca.",
    date: "Febrero 2024 - En curso",
    location: "Eje Cafetero",
    stats: [
      { label: "Universidades aliadas", value: "3" },
      { label: "Prototipos de empaque", value: "8" },
      { label: "Tasa de degradación", value: "90 días" }
    ],
    challenge: "La industria agrícola genera toneladas de biomasa que actualmente se desperdician o queman, generando CO2, mientras seguimos dependiendo de plásticos de un solo uso.",
    solution: "Estamos caracterizando física y químicamente fibras residuales para desarrollar un biopolímero que reemplace las bandejas de icopor en supermercados.",
    impact: "Se ha logrado un prototipo funcional que soporta humedad y es 100% compostable en condiciones domésticas."
  },
  // NUEVA NOTICIA DE PRODUCCIÓN
  {
    id: 8,
    title: "Ecodiseño en Mobiliario Urbano",
    type: "PRODUCCIÓN",
    color: "#1E305D", // Color azul para producción
    image: proyecto5, // Reutilizando imagen (Importar una nueva si es necesario)
    shortDescription: "Línea de producción de parques infantiles utilizando 100% plástico reciclado post-consumo.",
    date: "Enero 2024 - Diciembre 2024",
    location: "Barranquilla",
    stats: [
      { label: "Parques instalados", value: "10" },
      { label: "Plástico desviado", value: "45 Ton" },
      { label: "Empleos verdes", value: "22" }
    ],
    challenge: "El déficit de espacio público de calidad en zonas vulnerables y la acumulación de plásticos rígidos en zonas costeras.",
    solution: "Establecimos una planta de transformación semi-industrial que convierte tapas y envases de detergente en madera plástica de alta resistencia para mobiliario.",
    impact: "Instalación de parques duraderos que no requieren mantenimiento con químicos y reducción de la contaminación marina local."
  }
];