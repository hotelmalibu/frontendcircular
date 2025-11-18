import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PDFViewer({ file }) {
  const plugin = defaultLayoutPlugin();

  return (
    <div className="w-full h-[80vh] rounded-xl overflow-hidden mt-6 border border-gray-300">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={file} plugins={[plugin]} />
      </Worker>
    </div>
  );
}
