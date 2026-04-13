import React, { useState, useEffect } from "react";
import { getVisionCircularForms, deleteVisionCircularForm } from "../../../api/visionCircularFormsApi";
import { Trash2, FileText, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const BRAND = {
  blue: "#2C67B0",
  darkBlue: "#005380",
  lightBlue: "#7FB8D9",
  green: "#B1D357",
  gray: "#6B7280",
};

export default function VisionCircularFormsModule() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await getVisionCircularForms();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Error al cargar los formularios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este formulario?")) {
      try {
        await deleteVisionCircularForm(id);
        toast.success("Formulario eliminado con éxito");
        fetchForms();
        if (selectedForm?.id === id) {
          setSelectedForm(null);
        }
      } catch (error) {
        console.error("Error deleting form:", error);
        toast.error("Error al eliminar el formulario");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 font-sans">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: BRAND.darkBlue }}>
            <FileText size={24} style={{ color: BRAND.green }} />
            Solicitudes de Unión a Visión Circular
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestione la información de las organizaciones interesadas en unirse a Visión Circular.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de formularios */}
        <div className={`lg:col-span-1 border border-gray-200 rounded-xl overflow-hidden flex flex-col bg-gray-50 ${selectedForm ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="font-bold text-gray-700">Listado de Registros ({forms.length})</h3>
          </div>
          
          <div className="overflow-y-auto max-h-[600px] flex-1 p-2 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: BRAND.blue }}></div>
              </div>
            ) : forms.length === 0 ? (
              <p className="text-center text-gray-500 p-8">No hay registros disponibles.</p>
            ) : (
              forms.map((form) => (
                <div 
                  key={form.id} 
                  onClick={() => setSelectedForm(form)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedForm?.id === form.id 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-gray-800 line-clamp-1 truncate pr-2" title={form.company_name}>
                      {form.company_name}
                    </h4>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {new Date(form.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-2">{form.contact_name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {form.principal_vocation}
                    </span>
                    {form.confirm_interest ? (
                      <span className="text-[10px] text-green-600 flex items-center gap-1 font-medium"><CheckCircle size={12} /> Contactar</span>
                    ) : (
                      <span className="text-[10px] text-gray-400 flex items-center gap-1"><XCircle size={12} /> No llamar</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detalle del formulario */}
        <div className={`lg:col-span-2 border border-gray-200 rounded-xl bg-white flex flex-col min-h-[500px] ${!selectedForm ? 'hidden lg:flex lg:items-center lg:justify-center' : 'flex'}`}>
          {!selectedForm ? (
             <div className="text-center text-gray-400 p-8">
               <FileText size={48} className="mx-auto mb-3 opacity-20" />
               <p>Seleccione un registro de la lista ver los detalles</p>
             </div>
          ) : (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50 rounded-t-xl">
                <div>
                   <button className="lg:hidden text-blue-600 text-sm font-bold mb-4 flex items-center gap-1" onClick={() => setSelectedForm(null)}>
                     ← Volver a la lista
                   </button>
                   <h3 className="text-2xl font-bold text-gray-800 mb-1">{selectedForm.company_name}</h3>
                   <p className="text-sm text-gray-500">
                     Recibido el {new Date(selectedForm.created_at).toLocaleString()}
                   </p>
                </div>
                <button 
                  onClick={() => handleDelete(selectedForm.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar registro"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-8">
                
                {/* Sección Empresa */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Información de la Empresa / Organización</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Nombre de la empresa</span>
                      <p className="font-semibold text-gray-800">{selectedForm.company_name}</p>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Sector económico</span>
                      <p className="font-medium text-gray-800">{selectedForm.economic_sector}</p>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Vocación principal</span>
                      <p className="font-medium text-gray-800">{selectedForm.principal_vocation}</p>
                    </div>
                    {selectedForm.principal_vocation === 'Otros' && selectedForm.other_vocation && (
                      <div>
                        <span className="block text-xs text-gray-500 mb-1">Otra vocación (Especificada)</span>
                        <p className="font-medium text-gray-800">{selectedForm.other_vocation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sección Contacto */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Información de Contacto</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 bg-blue-50 p-4 rounded-xl">
                    <div>
                      <span className="block text-xs text-blue-400 mb-1">Nombre completo</span>
                      <p className="font-bold text-blue-900">{selectedForm.contact_name}</p>
                    </div>
                    <div>
                      <span className="block text-xs text-blue-400 mb-1">Cargo / Rol</span>
                      <p className="font-semibold text-blue-800">{selectedForm.contact_role}</p>
                    </div>
                    <div>
                      <span className="block text-xs text-blue-400 mb-1">Correo electrónico</span>
                      <a href={`mailto:${selectedForm.contact_email}`} className="font-medium text-blue-600 hover:underline break-all">
                        {selectedForm.contact_email}
                      </a>
                    </div>
                    <div>
                      <span className="block text-xs text-blue-400 mb-1">Teléfono</span>
                      <a href={`tel:${selectedForm.contact_phone}`} className="font-medium text-blue-600 hover:underline">
                        {selectedForm.contact_phone}
                      </a>
                    </div>
                    <div>
                      <span className="block text-xs text-blue-400 mb-1">Ciudad / Municipio</span>
                      <p className="font-medium text-blue-800">{selectedForm.contact_city}</p>
                    </div>
                  </div>
                </div>

                {/* Sección Solicitud */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Interés de Articulación</h4>
                  <div className={`p-4 rounded-xl border ${selectedForm.confirm_interest ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-start gap-3">
                      {selectedForm.confirm_interest ? (
                        <CheckCircle size={24} className="text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={24} className="text-gray-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-bold ${selectedForm.confirm_interest ? 'text-green-800' : 'text-gray-700'}`}>
                          {selectedForm.confirm_interest 
                            ? "Sí, confirma su interés en que el equipo se comunique para agendar un espacio."
                            : "No confirma interés de contacto en este momento."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
