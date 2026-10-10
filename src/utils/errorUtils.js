/**
 * Diccionario de traducción de nombres técnicos de campos a nombres legibles en español
 */
export const FIELD_LABELS = {
  document_type_id: "Tipo de documento",
  category_id: "Categoría",
  name: "Nombre",
  title: "Título",
  description: "Descripción / Contenido",
  version: "Versión",
  file: "Archivo adjunto",
  files: "Archivos",
  status: "Estado",
  expires_at: "Fecha de expiración",
  start_datetime: "Fecha y hora de inicio",
  end_datetime: "Fecha y hora de finalización",
  event_type: "Tipo de evento",
  location_name: "Lugar del evento",
  location_address: "Dirección del evento",
  meeting_link: "Enlace de reunión virtual",
  max_attendees: "Capacidad máxima",
  nombre: "Nombre del líder",
  cargo: "Cargo",
  frase: "Frase o testimonio",
  email: "Correo electrónico",
  password: "Contraseña",
  author: "Autor",
  start_date: "Fecha de inicio",
  end_date: "Fecha de finalización",
  cover_image: "Imagen de portada",
  project_type_id: "Tipo de proyecto",
  classification_type_id: "Clasificación",
  brochure_file: "Brochure / Portafolio",
  logo: "Logo institucional",
  phone: "Teléfono",
  address: "Dirección",
  website_url: "Sitio web",
};

/**
 * Extrae y formatea errores de validación de una respuesta HTTP de Laravel / API
 * @param {Error|Object} error - Error capturado en el bloque catch
 * @param {string} defaultMessage - Mensaje por defecto en caso de no haber detalles
 * @returns {{ message: string, fieldErrors: Record<string, string>, missingFields: string[], detailsList: string[] }}
 */
export const extractFormErrors = (error, defaultMessage = "Error al procesar la solicitud") => {
  const response = error?.response?.data;
  const rawErrors = response?.errors || error?.errors;
  const backendMessage = response?.message || error?.message;

  const fieldErrors = {};
  const missingFields = [];
  const detailsList = [];

  if (rawErrors && typeof rawErrors === "object") {
    Object.entries(rawErrors).forEach(([field, msgs]) => {
      const label = FIELD_LABELS[field] || field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      const msgArray = Array.isArray(msgs) ? msgs : [msgs];
      const cleanMsg = msgArray.join(", ");

      fieldErrors[field] = cleanMsg;
      missingFields.push(label);
      detailsList.push(`${label}: ${cleanMsg}`);
    });
  }

  let finalMessage = defaultMessage;

  if (detailsList.length > 0) {
    finalMessage = `Faltan campos por completar o corregir:\n${detailsList.map(d => `• ${d}`).join("\n")}`;
  } else if (backendMessage && !backendMessage.includes("Los datos proporcionados no son válidos")) {
    finalMessage = backendMessage;
  } else if (missingFields.length > 0) {
    finalMessage = `Por favor complete los campos obligatorios: ${missingFields.join(", ")}`;
  }

  return {
    message: finalMessage,
    fieldErrors,
    missingFields,
    detailsList,
  };
};
