import React from 'react';
import CORSImage from '../common/CORSImage';
import { getImageProxyUrl, getImageProxyFallbacks, needsCorsProxy } from '../../utils/imageUtils';

const CORSImageTest = () => {
  // Test URLs
  const testUrls = [
    'https://api-ecocircular.creativostecnologicosit.com/storage/news/NEWS692734feddf21.jpeg',
    'https://api-ecocircular.creativostecnologicosit.com/storage/news/NEWS69278f3e87769.jpeg',
    'https://example.com/regular-image.jpg', // Non-CORS image for comparison
  ];

  const testImage = (url, index) => {
    const proxyUrl = getImageProxyUrl(url);
    const fallbacks = getImageProxyFallbacks(url);
    const needsProxy = needsCorsProxy(url);

    return (
      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold mb-2">Test {index + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Original:</strong> {url.length > 50 ? url.substring(0, 50) + '...' : url}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Needs Proxy:</strong> {needsProxy ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Proxy URL:</strong> {proxyUrl.length > 50 ? proxyUrl.substring(0, 50) + '...' : proxyUrl}
            </p>
          </div>
          <div>
            <CORSImage 
              src={url}
              alt={`Test image ${index + 1}`}
              className="w-full h-32 object-cover rounded"
              showCorsWarning={true}
              onLoad={(src) => console.log(`Test ${index + 1} loaded:`, src)}
              onError={(error) => console.error(`Test ${index + 1} failed:`, error)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CORS Image Handling Test</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-blue-900 mb-2">Instructions</h2>
        <p className="text-blue-800 text-sm">
          This page tests the CORS image handling functionality. Each test shows:
        </p>
        <ul className="text-blue-800 text-sm mt-2 list-disc list-inside">
          <li>Original image URL</li>
          <li>Whether it needs a CORS proxy</li>
          <li>Generated proxy URL</li>
          <li>Actual image rendering with fallback handling</li>
        </ul>
      </div>

      {testUrls.map((url, index) => testImage(url, index))}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Fallback URLs Generated</h3>
        {testUrls.map((url, index) => {
          const fallbacks = getImageProxyFallbacks(url);
          return (
            <div key={index} className="mb-2">
              <p className="text-sm font-medium">Test {index + 1} Fallbacks:</p>
              <ul className="text-xs text-gray-600 list-disc list-inside">
                {fallbacks.map((fallback, fIndex) => (
                  <li key={fIndex}>
                    {fallback.length > 80 ? fallback.substring(0, 80) + '...' : fallback}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CORSImageTest;