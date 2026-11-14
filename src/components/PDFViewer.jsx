import React, { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { fetchSecureFile, isSecureFileUrl } from '../utils/secureFiles';

const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

export default function PDFViewer({ file }) {
  const plugin = defaultLayoutPlugin();
  const [source, setSource] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    let objectUrl;
    setSource('');
    setError(false);
    if (!isSecureFileUrl(file)) {
      setSource(file);
    } else {
      fetchSecureFile(file).then((url) => {
        objectUrl = url;
        if (active) setSource(url);
        else URL.revokeObjectURL(url);
      }).catch(() => { if (active) setError(true); });
    }
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [file]);

  return (
    <div className="w-full h-[80vh] rounded-xl overflow-hidden mt-6 border border-gray-300">
      <Worker workerUrl={workerUrl}>
        {source ? <Viewer fileUrl={source} plugins={[plugin]} transformGetDocumentParams={(options) => ({ ...options, isEvalSupported: false })} /> : <p>{error ? 'No se pudo cargar el documento.' : 'Cargando documento…'}</p>}
      </Worker>
    </div>
  );
}
