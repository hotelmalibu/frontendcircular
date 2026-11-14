/**
 * Image utilities for handling CORS and image loading
 */
import { API_ORIGIN } from '../api';

// List of reliable CORS proxy services
const CORS_PROXIES = [
  'https://images.weserv.nl/?url=',        // Fastest + supports resizing
  'https://api.allorigins.win/raw?url=',   // Fallback 1
  'https://corsproxy.io/?',                // Fallback 2
  'https://cors-anywhere.herokuapp.com/'   // Fallback 3
];

/**
 * Get proxy URL for images to avoid CORS issues
 * @param {string} imageUrl - Original image URL
 * @param {number|Object} optionsOrIndex - Proxy index (number) or Options object { width, height, quality }
 * @returns {string} - Proxy URL or original URL
 */
export const getImageProxyUrl = (imageUrl) => {
  // If it's an object with url or path property
  if (imageUrl && typeof imageUrl === 'object') {
    imageUrl = imageUrl.url || imageUrl.path || imageUrl.directUrl || '';
  }

  if (!imageUrl || typeof imageUrl !== 'string') return '';

  // Data URLs or blobs shouldn't be modified or proxied
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    return imageUrl;
  }

  let value = imageUrl.trim();
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
  if (hasScheme && !/^https?:\/\//i.test(value)) return '';

  if (value.startsWith('NEWS')) {
    value = `/storage/news/${value}`;
  } else if (value.startsWith('COVER')) {
    value = `/storage/projects/covers/${value}`;
  } else if (!hasScheme && !value.startsWith('/')) {
    value = `/storage/${value.replace(/^storage\//, '')}`;
  }

  try {
    const url = new URL(value, `${API_ORIGIN}/`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return '';
    if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && url.origin !== API_ORIGIN) {
      // Signed links must be issued by Laravel with the correct APP_URL; changing their host invalidates them.
      if (url.searchParams.has('signature')) return '';
      return new URL(`${url.pathname}${url.search}${url.hash}`, `${API_ORIGIN}/`).href;
    }
    return url.href;
  } catch {
    return '';
  }
};

/**
 * Get fallback proxy URLs for a given image URL
 * @param {string} imageUrl - Original image URL
 * @returns {Array} - Array of proxy URLs to try
 */
export const getImageProxyFallbacks = (imageUrl) => {
  return [imageUrl].filter(Boolean);
};

/**
 * Check if URL needs CORS proxy
 * @param {string} imageUrl - Image URL to check
 * @returns {boolean} - True if URL needs proxy
 */
export const needsCorsProxy = (imageUrl) => {
  return false;
};

/**
 * Extract original URL from proxy URL
 * @param {string} proxyUrl - Proxy URL
 * @returns {string} - Original URL or proxy URL if not a proxy
 */
export const extractOriginalUrl = (proxyUrl) => {
  if (!proxyUrl) return '';

  for (const proxy of CORS_PROXIES) {
    if (proxyUrl.startsWith(proxy)) {
      try {
        const encodedUrl = proxyUrl.substring(proxy.length);
        return decodeURIComponent(encodedUrl);
      } catch (error) {
        return proxyUrl;
      }
    }
  }

  return proxyUrl;
};

/**
 * Create an image element with error handling and fallback support
 * @param {string} src - Image source URL
 * @param {Object} options - Image options
 */
export const createImageWithFallback = (src, options = {}) => {
  const { onLoad, onError, fallbacks = [] } = options;
  const img = new Image();

  let currentSrcIndex = 0;
  const allSrcs = [src, ...fallbacks].filter(Boolean);

  const tryNextSrc = () => {
    if (currentSrcIndex >= allSrcs.length) {
      if (onError) onError(new Error('All image sources failed'));
      return;
    }

    img.src = allSrcs[currentSrcIndex];
    currentSrcIndex++;
  };

  img.onload = () => {
    if (onLoad) onLoad(img.src);
  };

  img.onerror = () => {
    tryNextSrc();
  };

  tryNextSrc();

  return img;
};

const imageUtils = {
  getImageProxyUrl,
  getImageProxyFallbacks,
  needsCorsProxy,
  extractOriginalUrl,
  createImageWithFallback,
  CORS_PROXIES
};

export default imageUtils;
