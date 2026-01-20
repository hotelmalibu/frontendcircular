// src/data/mockContent.js
import { Newspaper, Mic, Leaf } from "lucide-react";

// Configuración de estilo por tipo (Colores minimalistas basados en tus referencias)
export const contentTypeConfig = {
  "Noticias": {
    icon: Newspaper,
    color: "text-[#00AB6D]",
    bgColor: "bg-white",
    isSolid: false // Tarjeta con foto
  },
  "Podcast": {
    icon: Mic,
    color: "text-[#8B5CF6]",
    bgColor: "bg-white",
    isSolid: false
  },
  "Artículo": {
    icon: Leaf,
    color: "text-[#1E305D]",
    bgColor: "bg-gray-100",
    isSolid: false
  },
  "Documentos de interés": {
    icon: Newspaper,
    color: "text-[#1E305D]",
    bgColor: "bg-[#005380]",
    isSolid: true
  },
  "Gestión documental": {
    icon: Newspaper,
    color: "text-[#00AB6D]",
    bgColor: "bg-[#00AB6D]",
    isSolid: true
  }
};

export const allContentData = [
  {
    id: 1,
    type: "Noticias",
    topic: "Economía Circular",
    title: "Evitando los 10 errores comunes al escalar modelos circulares",
    excerpt: "Guía esencial para empresas que buscan transformar sus cadenas de valor sin perder rentabilidad.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    date: "22 Nov 2024",
    slug: "errores-comunes-escalar"
  },
  {
    id: 2,
    type: "Noticias",
    topic: "Biodiversidad",
    title: "Escalando la acción por la naturaleza: El marco global",
    excerpt: "Cómo la economía circular puede ayudar a cumplir el Marco Global de Biodiversidad.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    date: "10 Sep 2024",
    slug: "accion-por-naturaleza"
  },
  {
    id: 3,
    type: "Podcast",
    topic: "Retail",
    title: "Ep 203: ¿Por qué los minoristas deben adoptar la circularidad?",
    excerpt: "Conversaciones desde la Semana del Clima de Nueva York.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
    date: "01 Sep 2024",
    slug: "podcast-retail-circular"
  },
  {
    id: 4,
    type: "Artículo",
    topic: "Innovación",
    title: "Colaboración comercial: Un motor poderoso",
    excerpt: "Casos de estudio replicables sobre simbiosis industrial.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    date: "20 Ago 2024",
    slug: "colaboracion-comercial"
  }
];