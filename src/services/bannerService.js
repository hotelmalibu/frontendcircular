import clientLogger from '../utils/clientLogger';
import fondo1 from "../assets/home/Carrusel/Index_imagen_1.jpg";
import fondo3 from "../assets/home/Carrusel/Index_imagen_3.jpeg";
import fondo4 from "../assets/home/Carrusel/Index_imagen_4.png";
import ethicsHero from "../assets/home/nosotros/conocenos/valores/ethics_hero_dark.jpg";
import groupPhoto from "../assets/imgEquipo/group_photo.jpg";
import lineasBanner from "../assets/lineasestrategicas/Banner.png";
import fondoEncuestas from "../assets/fondosYlogos/fondo_encuestas.png";
import fondoCircularmente from "../assets/fondosYlogos/fondo_circularmente.jpg";
import { updateBannerApi } from "../api/bannersApi";

const STORAGE_KEY = "vision_circular_banners_config";
const EVENT_NAME = "vision_circular_banner_updated";

/**
 * Default banner structures and contents for the 6 target pages
 */
export const DEFAULT_BANNERS = {
  inicio: {
    id: "inicio",
    name: "Inicio",
    route: "/",
    descriptionLabel: "Carrusel principal de la página de inicio",
    type: "carousel",
    slides: [
      {
        id: "slide-1",
        image: fondo3,
        defaultImage: fondo3,
        title: "Impulsando el país hacia",
        subtitle: "la economía circular",
        description:
          "Articulamos actores y desarrollamos estrategias competitivas que garantizan el cumplimiento normativo y contribuyen a las metas ESG corporativas.",
        button1: "Sobre nosotros",
        button1_link: "/quines-somos",
        button2: "Conoce nuestras estrategias",
        button2_link: "/lineas-estrategicas",
      },
      {
        id: "slide-2",
        image: fondo1,
        defaultImage: fondo1,
        title: "Impulsando el país hacia",
        subtitle: "la economía circular",
        description:
          "Articulamos actores y desarrollamos estrategias competitivas que garantizan el cumplimiento normativo y contribuyen a las metas ESG corporativas.",
        button1: "Sobre nosotros",
        button1_link: "/quines-somos",
        button2: "Conoce nuestras estrategias",
        button2_link: "/lineas-estrategicas",
      },
      {
        id: "slide-3",
        image: fondo4,
        defaultImage: fondo4,
        title: "Impulsando el país hacia",
        subtitle: "la economía circular",
        description:
          "Articulamos actores y desarrollamos estrategias competitivas que garantizan el cumplimiento normativo y contribuyen a las metas ESG corporativas.",
        button1: "Sobre nosotros",
        button1_link: "/quines-somos",
        button2: "Conoce nuestras estrategias",
        button2_link: "/lineas-estrategicas",
      },
    ],
  },
  "etica-transparencia": {
    id: "etica-transparencia",
    name: "Ética y Transparencia",
    route: "/valores",
    descriptionLabel: "Banner de la página Ética y Transparencia",
    type: "hero",
    image: ethicsHero,
    defaultImage: ethicsHero,
    tag: "Transparencia Institucional",
    title: "Portal de Ética y Transparencia",
    description:
      "Nuestra gestión se fundamenta en principios de integridad, responsabilidad y coherencia. Construimos confianza a través de la claridad total en cada proceso.",
  },
  "junta-equipo": {
    id: "junta-equipo",
    name: "Junta Directiva y Equipo",
    route: "/juntaDirecteEquipo",
    descriptionLabel: "Banner de la página Junta Directiva y Equipo",
    type: "hero",
    image: groupPhoto,
    defaultImage: groupPhoto,
    title: "EL EQUIPO QUE IMPULSA LA ECONOMÍA CIRCULAR",
    description:
      "Articulamos actores, conocimiento y soluciones para hacer de la economía circular una realidad en el país.",
  },
  "lineas-estrategicas": {
    id: "lineas-estrategicas",
    name: "Líneas Estratégicas",
    route: "/lineas-estrategicas",
    descriptionLabel: "Banner de la página Líneas Estratégicas",
    type: "hero",
    image: lineasBanner,
    defaultImage: lineasBanner,
    title: "Líneas Estratégicas",
    description:
      "Estrategias integrales diseñadas para transformar el modelo productivo del país hacia una economía circular.",
  },
  informes: {
    id: "informes",
    name: "Informes",
    route: "/informes-anuales",
    descriptionLabel: "Banner de la página Informes Anuales y Documentos",
    type: "hero",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop",
    defaultImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop",
    title: "Informes Anuales y Documentos",
    description:
      "Accede a nuestra biblioteca de informes de gestión, balances y documentación de interés público.",
  },
  encuestas: {
    id: "encuestas",
    name: "Encuestas",
    route: "/encuestas",
    descriptionLabel: "Banner de la página de Encuestas Públicas",
    type: "hero",
    image: fondoEncuestas,
    defaultImage: fondoEncuestas,
    title: "Profundiza más con nosotros",
    description:
      "Un espacio estratégico diseñado para las empresas que desean sumarse al colectivo Visión Circular. Inicia tu proceso de vinculación y participa en la transformación sostenible.",
  },
  circularmente: {
    id: "circularmente",
    name: "Circularmente",
    route: "/circularmente",
    descriptionLabel: "Banner de la página Circularmente (Micrositio)",
    type: "hero",
    image: fondoCircularmente,
    defaultImage: fondoCircularmente,
    title: "Circularmente",
    subtitle: "Conecta con transformadores líderes en economía circular.",
    description:
      "La plataforma impulsa la economía circular de envases y empaques.",
  },
};

/**
 * Compress an image file on the client side using Canvas.
 * Produces crisp, lightweight WebP/JPEG data URLs (typically ~100-250KB)
 * to prevent localStorage quota exhaustion.
 */
export const compressImageFile = (file, maxWidth = 1920, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (!file.type.startsWith("image/")) {
      return reject(new Error("El archivo seleccionado no es una imagen válida"));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try webp first, fallback to jpeg
        let dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Error al procesar la imagen"));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });
};

/**
 * Retrieve all banners from localStorage merged with defaults
 */
export const getAllBanners = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...DEFAULT_BANNERS };

    const parsed = JSON.parse(saved);
    const merged = { ...DEFAULT_BANNERS };

    Object.keys(DEFAULT_BANNERS).forEach((key) => {
      if (parsed[key]) {
        if (DEFAULT_BANNERS[key].type === "carousel") {
          merged[key] = {
            ...DEFAULT_BANNERS[key],
            ...parsed[key],
            slides: Array.isArray(parsed[key].slides) && parsed[key].slides.length > 0
              ? parsed[key].slides.map((s, idx) => ({
                  ...DEFAULT_BANNERS[key].slides[idx],
                  ...s,
                  defaultImage: DEFAULT_BANNERS[key].slides[idx]?.defaultImage || s.defaultImage || s.image,
                }))
              : DEFAULT_BANNERS[key].slides,
          };
        } else {
          merged[key] = {
            ...DEFAULT_BANNERS[key],
            ...parsed[key],
            defaultImage: DEFAULT_BANNERS[key].defaultImage,
          };
        }
      }
    });

    return merged;
  } catch (error) {
    clientLogger.warn("Error reading banners from storage, using defaults:", error);
    return { ...DEFAULT_BANNERS };
  }
};

/**
 * Retrieve a specific banner configuration by page key
 */
export const getBanner = (pageKey) => {
  const all = getAllBanners();
  return all[pageKey] || DEFAULT_BANNERS[pageKey] || null;
};

/**
 * Save updated banner configuration for a page
 */
export const saveBanner = (pageKey, bannerData) => {
  try {
    const all = getAllBanners();
    all[pageKey] = {
      ...all[pageKey],
      ...bannerData,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    // Dispatch custom event for real-time reactive sync across components
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          detail: { pageKey, data: all[pageKey] },
        })
      );
    }

    // Attempt backend sync in background
    updateBannerApi(pageKey, all[pageKey]).catch(() => {
      // Background sync fail is silently handled as client storage is primary
    });

    return all[pageKey];
  } catch (error) {
    clientLogger.error("Error saving banner:", error);
    throw error;
  }
};

/**
 * Reset a single page's banner back to original default
 */
export const resetBanner = (pageKey) => {
  try {
    const all = getAllBanners();
    if (DEFAULT_BANNERS[pageKey]) {
      all[pageKey] = { ...DEFAULT_BANNERS[pageKey] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(EVENT_NAME, {
            detail: { pageKey, data: all[pageKey] },
          })
        );
      }
    }
    return all[pageKey];
  } catch (error) {
    clientLogger.error("Error resetting banner:", error);
    throw error;
  }
};

/**
 * Reset all banners back to original defaults
 */
export const resetAllBanners = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          detail: { all: DEFAULT_BANNERS },
        })
      );
    }
    return { ...DEFAULT_BANNERS };
  } catch (error) {
    clientLogger.error("Error resetting all banners:", error);
    throw error;
  }
};

/**
 * Helper hook / listener to subscribe to banner updates
 */
export const subscribeToBannerUpdates = (callback) => {
  if (typeof window === "undefined") return () => {};

  const handler = (event) => {
    callback(event.detail);
  };

  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};

const bannerService = {
  DEFAULT_BANNERS,
  getAllBanners,
  getBanner,
  saveBanner,
  resetBanner,
  resetAllBanners,
  compressImageFile,
  subscribeToBannerUpdates,
};

export default bannerService;
