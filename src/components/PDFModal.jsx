import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import PDFViewer from "./PDFViewer";

export default function PDFModal({ file, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0 
        bg-[rgba(0,0,0,0.35)] 
        backdrop-blur-md
        flex items-center justify-center 
        z-[9999]
      "
    >
      {/* CONTENEDOR PRINCIPAL */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="
          relative 
          bg-white 
          rounded-2xl 
          shadow-[0_15px_50px_rgba(0,0,0,0.25)]
          border border-[#C8DDF0]
          w-[95%] 
          md:w-[85%] 
          lg:w-[75%]
          h-[90vh]
          flex flex-col
          overflow-hidden
        "
      >
        {/* CABECERA */}
        <div
          className="
            flex items-center justify-between
            py-3 px-6 
            bg-gradient-to-r from-[#EFF6FB] to-[#F9FCFF]
            border-b border-[#DCE6F2] 
            text-[#1E305D] 
            font-semibold text-lg
            rounded-t-2xl
            shadow-sm
          "
        >
          <span>Visualización del documento</span>
          <button
            onClick={onClose}
            className="
              flex items-center justify-center
              w-9 h-9
              bg-white 
              border border-[#BFD7EA] 
              rounded-full 
              shadow-md 
              hover:bg-[#1E305D] 
              hover:text-white 
              hover:shadow-[0_0_12px_#1E305D]
              transition-all 
              duration-200
              active:scale-95
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VISOR PDF */}
        <div
          className="
            flex-1 
            bg-[#F9FBFC] 
            overflow-hidden 
            flex items-center justify-center
          "
        >
          <div
            className="
              w-full h-full 
              rounded-b-2xl 
              overflow-hidden
              shadow-inner
              p-2
            "
          >
            <PDFViewer file={file} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
