import api, { API_ORIGIN } from '../api';

export const publicDocumentUrl = (value) => {
  if (!value) return '';
  const candidate = typeof value === 'object' ? value.url || value.path : value;
  if (typeof candidate !== 'string' || !candidate.trim()) return '';
  try {
    const absolute = /^[a-z][a-z0-9+.-]*:/i.test(candidate) || candidate.startsWith('/');
    const url = new URL(absolute ? candidate : `/storage/${candidate}`, API_ORIGIN);
    if (!['https:', 'http:'].includes(url.protocol) || ![API_ORIGIN, window.location.origin].includes(url.origin) || url.username || url.password) return '';
    return url.href;
  } catch { return ''; }
};

export const isSecureFileUrl = (url) => {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === API_ORIGIN && !parsed.username && !parsed.password && /\/api\/(?:secure-file|form-attachment)\/[^/]+$/.test(parsed.pathname);
  } catch {
    return false;
  }
};

export const fetchSecureFile = async (url) => {
  if (!isSecureFileUrl(url)) throw new Error('La URL de archivo no pertenece a la API autorizada.');
  const response = await api.get(new URL(url, window.location.origin).href, { responseType: 'blob' });
  return URL.createObjectURL(response.data);
};

export const openDocumentFile = async (url, name = 'documento') => {
  if (!url) throw new Error('El documento no tiene un archivo disponible.');
  const parsed = new URL(url, window.location.origin);
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error('URL de archivo no permitida.');
  if (!isSecureFileUrl(url)) {
    window.open(parsed.href, '_blank', 'noopener,noreferrer');
    return;
  }
  const blobUrl = await fetchSecureFile(url);
  // Download instead of opening an authenticated response inside a page with an origin.
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = name;
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
};
