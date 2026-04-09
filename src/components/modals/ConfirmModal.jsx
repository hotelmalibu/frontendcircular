import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar acción", 
  message = "¿Estás seguro de continuar?", 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  isDanger = true 
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1229]/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Botón Cerrar Esquina */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-5 rounded-full ${isDanger ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-[#2C67B0]'}`}>
              <AlertTriangle size={32} />
            </div>
            
            <h3 className="text-2xl font-black text-center text-[#1E305D] mb-3 leading-tight tracking-tight">
              {title}
            </h3>
            <p className="text-center text-gray-600 mb-8 px-2 font-medium">
              {message}
            </p>

            <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
              <button 
                onClick={onClose}
                className="w-full sm:flex-1 px-5 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                {cancelText}
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`w-full sm:flex-1 px-5 py-3 text-sm font-bold text-white rounded-xl transition-all duration-200 shadow-md ${
                  isDanger 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                    : 'bg-[#2C67B0] hover:bg-[#1E4D8A] shadow-blue-200'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
