
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResponderFormulario from "../../../../components/dashboard/formularios/Subcomponents/Encuestas/ResponderFormulario";
import { ChevronLeft } from "lucide-react";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";

export default function PublicSurveyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#005380]/10 border-t-[#005380] rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">Validando encuesta...</p>
             </div>
             <div className="hidden">
                <ResponderFormulario 
                    formId={id} 
                    onCancel={() => navigate('/encuestas')}
                    onSuccess={() => navigate('/encuestas')}
                    onLoad={() => setLoading(false)}
                />
             </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-[#FDFDFD] pt-28 pb-20 px-4 md:px-8">
            {/* Simple Clean Back Button - Moved down to avoid overlap */}
            <div className="max-w-7xl mx-auto mb-4">
                <button 
                    onClick={() => navigate('/encuestas')}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#005380] font-bold transition-all group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm uppercase tracking-widest">Volver a encuestas</span>
                </button>
            </div>

            {/* Survey Container - Expanded */}
            <div className="max-w-7xl mx-auto">
                <ResponderFormulario 
                    formId={id} 
                    onCancel={() => navigate('/encuestas')}
                    onSuccess={() => navigate('/encuestas')}
                    onLoad={() => setLoading(false)}
                />
            </div>
        </main>
        <Footer />
    </div>
  );
}
