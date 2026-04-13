import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVisionCircularForm } from '../../api/visionCircularFormsApi';
import Footer from '../Footer';

const BRAND = {
  blue: "#2C67B0",
  darkBlue: "#005380",
  lightBlue: "#7FB8D9",
  green: "#B1D357",
  darkGreen: "#8CB200",
};

export default function VisionCircularFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    economic_sector: '',
    principal_vocation: '',
    other_vocation: '',
    contact_name: '',
    contact_role: '',
    contact_email: '',
    contact_phone: '',
    contact_city: '',
    confirm_interest: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const dataToSubmit = {
        ...formData,
        confirm_interest: formData.confirm_interest === "true" || formData.confirm_interest === true
      };
      
      await createVisionCircularForm(dataToSubmit);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError("Ocurrió un error al enviar el formulario. Por favor, inténtelo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Gracias por su interés!</h2>
          <p className="text-gray-600 mb-8">Hemos recibido su información correctamente. Nos pondremos en contacto pronto.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition">
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="pt-32 pb-16 px-4 md:px-8 max-w-4xl mx-auto w-full flex-grow">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          <div className="p-8 md:p-12 border-b border-gray-100" style={{ backgroundColor: `${BRAND.darkBlue}05` }}>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: BRAND.darkBlue }}>
              Conoce más sobre Visión Circular ANDI
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Gracias por tu interés en conocer más sobre Visión Circular ANDI. A través de este formulario recopilamos información básica que nos permitirá contactarlo y agendar un espacio para presentarle en detalle nuestro modelo, líneas estratégicas y oportunidades de articulación.
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed text-sm">
              Su información será utilizada únicamente para este fin y tratada con total confidencialidad. Cuando envíe este formulario, no recopilará automáticamente sus detalles, como el nombre y la dirección de correo electrónico, a menos que lo proporcione usted mismo.
            </p>
            <p className="mt-4 text-sm font-semibold text-gray-500">* Campos obligatorios</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
            
            {/* Empresa u Organización */}
            <div className="space-y-6">
              <div className="border-b-2 pb-2" style={{ borderColor: BRAND.lightBlue }}>
                <h2 className="text-2xl font-bold" style={{ color: BRAND.blue }}>Información de la empresa u organización</h2>
                <p className="text-gray-500 text-sm mt-1">En esta sección recopilaremos los datos esenciales de la empresa u organización, con el propósito de identificar su actividad, sector productivo y vocación.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">¿Cuál es el nombre de la empresa u organización? *</label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition"
                    style={{ focusRingColor: BRAND.blue }}
                    placeholder="Escriba el nombre"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">¿A qué sector económico pertenece la empresa? *</label>
                  <input
                    type="text"
                    name="economic_sector"
                    required
                    value={formData.economic_sector}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition"
                    placeholder="Ej. Manufactura, Servicios..."
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-700 mb-3">¿Cuál es la vocación principal de la empresa? *</label>
                <div className="space-y-3 pl-2">
                  {['Producción', 'Transformación', 'Comercialización', 'Gestión de residuos', 'Otros'].map((vocation) => (
                    <label key={vocation} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="principal_vocation"
                        value={vocation}
                        checked={formData.principal_vocation === vocation}
                        onChange={handleChange}
                        required
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition">{vocation}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.principal_vocation === 'Otros' && (
                <div className="mt-4 pl-8 border-l-4 border-blue-200">
                  <label className="block text-sm font-bold text-gray-700 mb-2">En caso tal de que su respuesta haya sido 'Otros', indique cual *</label>
                  <input
                    type="text"
                    name="other_vocation"
                    required
                    value={formData.other_vocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition"
                    placeholder="Especifique su vocación"
                  />
                </div>
              )}
            </div>

            {/* Información de contacto */}
            <div className="space-y-6">
              <div className="border-b-2 pb-2" style={{ borderColor: BRAND.lightBlue }}>
                <h2 className="text-2xl font-bold" style={{ color: BRAND.blue }}>Información de contacto</h2>
                <p className="text-gray-500 text-sm mt-1">En esta sección solicitamos la información de la persona designada para establecer la comunicación.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">¿Cuál es el nombre y apellidos de la persona de contacto? *</label>
                  <input
                    type="text"
                    name="contact_name"
                    required
                    value={formData.contact_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">¿Cuál es el cargo o rol dentro de la organización? *</label>
                  <input
                    type="text"
                    name="contact_role"
                    required
                    value={formData.contact_role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">¿Cuál es el correo electrónico de contacto? *</label>
                  <input
                    type="email"
                    name="contact_email"
                    required
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Número de contacto *</label>
                  <input
                    type="tel"
                    name="contact_phone"
                    required
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">¿En qué ciudad o municipio se encuentra? *</label>
                  <input
                    type="text"
                    name="contact_city"
                    required
                    value={formData.contact_city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Solicitud de contacto */}
            <div className="space-y-6">
              <div className="border-b-2 pb-2" style={{ borderColor: BRAND.lightBlue }}>
                <h2 className="text-2xl font-bold" style={{ color: BRAND.blue }}>Solicitud de contacto</h2>
                <p className="text-gray-500 text-sm mt-1">En esta sección confirmamos el interés de la organización en recibir un contacto.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 block">¿Confirma su interés en que el equipo de Visión Circular ANDI se comunique para agendar un espacio y profundizar la información? *</label>
                <div className="space-y-3 pl-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="confirm_interest"
                      value="true"
                      checked={formData.confirm_interest === "true" || formData.confirm_interest === true}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition font-medium">Si</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="confirm_interest"
                      value="false"
                      checked={formData.confirm_interest === "false" || formData.confirm_interest === false}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition font-medium">No</span>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all w-full md:w-auto"
                style={{ backgroundColor: loading ? BRAND.gray : BRAND.green, color: BRAND.darkBlue }}
              >
                {loading ? 'Enviando...' : 'Enviar Formulario'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
