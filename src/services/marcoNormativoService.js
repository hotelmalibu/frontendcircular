import clientLogger from '../utils/clientLogger';
import { createDocument, getDocumentTypes } from "../api/documentsApi";
import { getImageProxyUrl } from "../utils/imageUtils";

// Paleta oficial Visión Circular (Estricta según directriz de diseño)
export const BRAND = {
  navy: "#1E305D",       // Azul Principal (Texto, títulos y destacados)
  blue: "#2C67B0",       // Azul Secundario (Botones de acción, enlaces)
  green: "#B1D357",      // Verde Principal oficial (Fondos y botones)
  lime: "#B1D357",       // Verde Claro oficial
  textDark: "#1E305D",   // Texto principal
  gray: "#6B7280"
};

// 1. RESOLUCIONES: Vacío por defecto para que el usuario las agregue directamente
export const INITIAL_RESOLUCIONES = [];

// 2. POLÍTICAS Y DECRETOS: Vacío por defecto para que el usuario las agregue directamente
export const INITIAL_POLITICAS = [];

// 3. PLANES Y ESTRATEGIAS: Vacío por defecto para que el usuario los agregue directamente
export const INITIAL_PLANES = [];

// Claves de LocalStorage versión 6 (completamente vacías sin normativas por defecto)
const STORAGE_KEYS = {
  resoluciones: "marco_normativo_resoluciones_v6",
  politicas: "marco_normativo_politicas_v6",
  planes: "marco_normativo_planes_v6"
};

// Limpiar cualquier residuo de versiones anteriores o datos por defecto para que inicie 100% vacío
try {
  const RESET_KEY = "marco_normativo_fresh_empty_v6";
  if (typeof localStorage !== "undefined" && !localStorage.getItem(RESET_KEY)) {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("marco_normativo_") && key !== RESET_KEY) {
        localStorage.removeItem(key);
      }
    });
    localStorage.setItem(RESET_KEY, "true");
  }
} catch (e) {
  // Ignorar errores en entornos sin localStorage
}

// Cargar elementos agregados por el usuario
export const getStoredNormativas = (section) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[section]);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    clientLogger.error("Error leyendo storage de " + section, e);
  }
  return [];
};

const saveStoredNormativas = (section, items) => {
  try {
    localStorage.setItem(STORAGE_KEYS[section], JSON.stringify(items));
  } catch (e) {
    clientLogger.error("Error guardando storage de " + section, e);
  }
};

/**
 * Obtener Resoluciones (Marco Normativo)
 */
export const getResolucionesNormativas = async () => {
  return getStoredNormativas("resoluciones");
};

/**
 * Obtener Políticas (Marco Normativo)
 */
export const getPoliticasNormativas = async () => {
  return getStoredNormativas("politicas");
};

/**
 * Obtener Planes (Marco Normativo)
 */
export const getPlanesNormativas = async () => {
  return getStoredNormativas("planes");
};

/**
 * Añadir una nueva normativa (Exclusivo administradores)
 */
export const addNormativa = async (section, data) => {
  let fileUrl = data.fileUrl || null;

  // Si envió un archivo físico, intentar subirlo con timeout controlado para que nunca se quede trabado
  if (data.file instanceof File) {
    try {
      const uploadPromise = (async () => {
        const typesRes = await getDocumentTypes();
        const types = typesRes?.data || [];
        let matchedTypeId = "";
        if (section === "resoluciones") {
          matchedTypeId = types.find(t => t.name?.toLowerCase().includes("resoluci"))?.id || "";
        } else if (section === "politicas") {
          matchedTypeId = types.find(t => t.name?.toLowerCase().includes("polític") || t.name?.toLowerCase().includes("politic"))?.id || "";
        } else if (section === "planes") {
          matchedTypeId = types.find(t => t.name?.toLowerCase().includes("plan"))?.id || "";
        }

        const formData = new FormData();
        formData.append("name", data.title || data.name);
        formData.append("description", data.desc || data.description || "");
        formData.append("version", "MARCO_NORMATIVO_1.0");
        formData.append("status", "approved");
        if (matchedTypeId) formData.append("document_type_id", matchedTypeId);
        formData.append("file", data.file);

        const uploaded = await createDocument(formData);
        if (uploaded?.data?.upload_file?.url) {
          return getImageProxyUrl(uploaded.data.upload_file.url);
        }
        return null;
      })();

      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 2500));
      const uploadedUrl = await Promise.race([uploadPromise, timeoutPromise]);
      fileUrl = uploadedUrl || URL.createObjectURL(data.file);
    } catch (err) {
      fileUrl = URL.createObjectURL(data.file);
    }
  }

  // Soporte para imagen de portada / banner
  let bannerUrl = null;
  if (data.bannerFile instanceof File || data.imageFile instanceof File) {
    const fileImg = data.bannerFile || data.imageFile;
    try {
      bannerUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(fileImg);
      });
    } catch (e) {
      clientLogger.warn("Error leyendo imagen de portada:", e);
    }
  } else if (data.bannerUrl) {
    bannerUrl = data.bannerUrl;
  }

  const newItem = {
    id: `norm-${Date.now()}`,
    title: data.title || data.name,
    year: data.year || new Date().getFullYear().toString(),
    entity: data.entity || (section === "resoluciones" ? "Ministerio de Ambiente y Desarrollo Sostenible" : "Gobierno Nacional"),
    desc: data.desc || data.description || "",
    description: data.desc || data.description || "",
    file: fileUrl,
    pdf: fileUrl,
    banner: bannerUrl,
    image: bannerUrl,
    cover: bannerUrl,
    color: section === "politicas" ? (data.color || BRAND.green) : section === "planes" ? (data.color || BRAND.blue) : undefined,
    isBuiltIn: false,
    createdAt: new Date().toISOString()
  };

  const current = getStoredNormativas(section);
  current.unshift(newItem);
  saveStoredNormativas(section, current);

  // Disparar evento para que la vista pública se actualice en tiempo real
  window.dispatchEvent(new CustomEvent("normativasUpdated", { detail: { section } }));

  return newItem;
};

/**
 * Actualizar una normativa existente
 */
export const updateNormativa = async (section, id, data) => {
  const current = getStoredNormativas(section);
  const index = current.findIndex(item => item.id === id);

  if (index !== -1) {
    let fileUrl = data.fileUrl !== undefined ? data.fileUrl : (current[index].file || current[index].pdf);

    if (data.file instanceof File) {
      try {
        const uploadPromise = (async () => {
          const formData = new FormData();
          formData.append("name", data.title || data.name);
          formData.append("description", data.desc || data.description || "");
          formData.append("version", "MARCO_NORMATIVO_1.0");
          formData.append("status", "approved");
          formData.append("file", data.file);
          const uploaded = await createDocument(formData);
          if (uploaded?.data?.upload_file?.url) {
            return getImageProxyUrl(uploaded.data.upload_file.url);
          }
          return null;
        })();

        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 2500));
        const uploadedUrl = await Promise.race([uploadPromise, timeoutPromise]);
        fileUrl = uploadedUrl || URL.createObjectURL(data.file);
      } catch (err) {
        fileUrl = URL.createObjectURL(data.file);
      }
    }

    // Procesar banner: si subió archivo nuevo, usarlo; si quitó la imagen o está vacía, dejar null; si mantuvo URL, preservarla
    let bannerUrl = null;
    if (data.bannerFile instanceof File || data.imageFile instanceof File) {
      const fileImg = data.bannerFile || data.imageFile;
      try {
        bannerUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(fileImg);
        });
      } catch (e) {
        clientLogger.warn("Error leyendo imagen de portada:", e);
      }
    } else if (data.bannerPreview === null || data.bannerUrl === "" || data.bannerUrl === null) {
      // El usuario quitó explícitamente la imagen
      bannerUrl = null;
    } else if (data.bannerUrl) {
      bannerUrl = data.bannerUrl;
    } else {
      bannerUrl = current[index].banner || current[index].image || null;
    }

    current[index] = {
      ...current[index],
      title: data.title || data.name || current[index].title,
      year: data.year || current[index].year,
      entity: data.entity || current[index].entity,
      desc: data.desc || data.description || current[index].desc,
      description: data.desc || data.description || current[index].description,
      file: fileUrl,
      pdf: fileUrl,
      banner: bannerUrl,
      image: bannerUrl,
      cover: bannerUrl,
      updatedAt: new Date().toISOString()
    };

    saveStoredNormativas(section, current);
    window.dispatchEvent(new CustomEvent("normativasUpdated", { detail: { section } }));
    return current[index];
  }

  throw new Error("No se encontró la normativa a actualizar.");
};

/**
 * Eliminar una normativa
 */
export const deleteNormativa = async (section, id) => {
  const current = getStoredNormativas(section);
  const filtered = current.filter(item => item.id !== id);
  saveStoredNormativas(section, filtered);
  window.dispatchEvent(new CustomEvent("normativasUpdated", { detail: { section } }));
  return true;
};
