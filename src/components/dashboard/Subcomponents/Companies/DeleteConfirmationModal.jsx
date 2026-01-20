import React from 'react';
import ReactDOM from 'react-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';



const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, companyName, loading }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-[#005380] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
       {/* Modal Content */}
       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-fadeIn scale-100 border border-gray-100">
          
          {/* Header decorative line */}
          <div className="h-2 w-full bg-red-500"></div>

          <div className="p-8 text-center">
             <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6 border-4 border-red-100">
                <AlertTriangle className="h-10 w-10 text-red-500" />
             </div>
             
             <h3 className="text-2xl font-bold text-gray-900 mb-3">¿Eliminar Empresa?</h3>
             
             <p className="text-gray-500 mb-8 leading-relaxed">
               ¿Estás seguro que deseas eliminar a <span className="font-bold text-gray-800 blok">{companyName}</span>?
               <br/>
               <span className="text-sm text-red-500 font-medium mt-2 block">Esta acción es irreversible.</span>
             </p>

             <div className="flex gap-4 justify-center">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all w-full"
                >
                  Cancelar
                </button>
                <button
                   onClick={onConfirm}
                   disabled={loading}
                   className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/30 transform active:scale-95 w-full"
                >
                   {loading ? (
                     <span className="animate-pulse">Eliminando...</span>
                   ) : (
                     <>
                      <Trash2 size={20} />
                      Eliminar
                     </>
                   )}
                </button>
             </div>
          </div>
       </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmationModal;
