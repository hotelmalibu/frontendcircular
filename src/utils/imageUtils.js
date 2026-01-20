/**
 * Image utilities for handling CORS and image loading
 */

// List of reliable CORS proxy services
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
export const getImageProxyUrl = (imageUrl, optionsOrIndex = 0) => {
  if (!imageUrl || typeof imageUrl !== 'string') return '';

  let proxyIndex = 0;
  let options = {};

  if (typeof optionsOrIndex === 'number') {
    proxyIndex = optionsOrIndex;
  } else if (typeof optionsOrIndex === 'object') {
    options = optionsOrIndex;
    // default to 0 (weserv) if object passed
  }

  // If the image is from our API domain, use a CORS proxy
  if (imageUrl.includes('api-ecocircular.creativostecnologicosit.com')) {
    const proxy = CORS_PROXIES[proxyIndex] || CORS_PROXIES[0];
    let finalUrl = `${proxy}${encodeURIComponent(imageUrl)}`;
    
    // Append Weserv specific parameters if using Weserv (index 0)
    if (proxy.includes('weserv.nl')) {
      if (options.width) finalUrl += `&w=${options.width}`;
      if (options.height) finalUrl += `&h=${options.height}`;
      if (options.quality) finalUrl += `&q=${options.quality}`;
      if (options.output) finalUrl += `&output=${options.output}`;
      else finalUrl += `&output=webp`; // Default to WebP for performance
    }
    
    return finalUrl;
  }

  // Return original URL for other domains
  return imageUrl;
};

/**
 * Get fallback proxy URLs for a given image URL
 * @param {string} imageUrl - Original image URL
 * @returns {Array} - Array of proxy URLs to try
 */
export const getImageProxyFallbacks = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('api-ecocircular.creativostecnologicosit.com')) {
    return [imageUrl].filter(Boolean);
  }

  return CORS_PROXIES.map(proxy => `${proxy}${encodeURIComponent(imageUrl)}`);
};

/**
 * Check if URL needs CORS proxy
 * @param {string} imageUrl - Image URL to check
 * @returns {boolean} - True if URL needs proxy
 */
export const needsCorsProxy = (imageUrl) => {
  return imageUrl && imageUrl.includes('api-ecocircular.creativostecnologicosit.com');
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
        console.warn('Failed to decode proxy URL:', error);
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
 * @param {Function} options.onLoad - Load callback
 * @param {Function} options.onError - Error callback
 * @param {Array} options.fallbacks - Fallback URLs to try
 * @returns {HTMLImageElement} - Image element
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
    console.log(`Failed to load image: ${allSrcs[currentSrcIndex - 1]}`);
    tryNextSrc();
  };

  // Start loading
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