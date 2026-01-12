import React, { useState, useRef, useEffect, useMemo } from 'react';
import { getImageProxyFallbacks, needsCorsProxy } from '../../utils/imageUtils';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable Image component with CORS handling and fallback support
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - CSS classes
 * @param {Function} props.onLoad - Load callback
 * @param {Function} props.onError - Error callback
 * @param {boolean} props.showCorsWarning - Whether to show CORS info
 * @param {Object} props.imgProps - Additional props for the img element
 */
const CORSImage = ({
  src,
  alt = '',
  className = '',
  onLoad,
  onError,
  showCorsWarning = false,
  imgProps = {},
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageKey, setImageKey] = useState(0); // Force re-render on fallback
  const imgRef = useRef(null);

  const fallbackUrls = useMemo(() => getImageProxyFallbacks(src), [src]);
  const isCorsImage = needsCorsProxy(src);

  useEffect(() => {
    if (src) {
      setCurrentSrc(fallbackUrls[0]);
      setError(null);
      setLoading(true);
    }
  }, [src, imageKey, fallbackUrls]);

  const handleImageError = () => {
    const currentIndex = fallbackUrls.indexOf(currentSrc);

    if (currentIndex < fallbackUrls.length - 1) {
      // Try next fallback
      const nextSrc = fallbackUrls[currentIndex + 1];
      console.log(`Image failed, trying fallback: ${nextSrc}`);
      setCurrentSrc(nextSrc);
    } else {
      // All fallbacks failed
      const errorMsg = `Failed to load image from all sources: ${fallbackUrls.join(', ')}`;
      console.error(errorMsg);
      setError(errorMsg);
      setLoading(false);

      if (onError) {
        onError(new Error(errorMsg));
      }
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError(null);
    if (onLoad) {
      onLoad(currentSrc);
    }
  };

  const handleRetry = () => {
    setImageKey(prev => prev + 1);
    setError(null);
    setLoading(true);
  };

  if (!src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded flex flex-col items-center justify-center p-4 ${className}`}>
        <AlertCircle size={24} className="text-red-400 mb-2" />
        <p className="text-red-600 text-xs text-center mb-2">Failed to load image</p>
        <button
          onClick={handleRetry}
          className="text-red-500 hover:text-red-700 text-xs underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading="lazy"
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...imgProps}
      />

      {isCorsImage && showCorsWarning && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Proxy
        </div>
      )}
    </div>
  );
};

export default CORSImage;