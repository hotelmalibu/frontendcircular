import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";

export default function Terminos() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2C67B0] hover:text-[#005380] mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2C67B0] flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Términos de Uso</h1>
            <p className="text-sm text-gray-500">Última actualización: {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">1. Aceptación de los Términos</h2>
            <p>
              El acceso y uso de la plataforma digital de Visión Circular ANDI están sujetos a los presentes Términos de Uso y a las leyes aplicables de la República de Colombia. Al utilizar este sitio web, usted acepta cumplir con estos términos en su totalidad.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">2. Propósito de la Plataforma</h2>
            <p>
              Visión Circular es una iniciativa gremial orientada a articular esfuerzos del sector empresarial, la academia y la sociedad civil para acelerar la transición hacia modelos de economía circular, con énfasis en el aprovechamiento de envases y empaques.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">3. Propiedad Intelectual y Uso del Contenido</h2>
            <p>
              Todos los contenidos, publicaciones, informes técnicos, infografías, metodologías, marcas y logotipos disponibles en la plataforma son propiedad de la ANDI o de sus respectivos titulares. Se autoriza su consulta y descarga con fines informativos, pedagógicos y de sostenibilidad, citando siempre la fuente correspondiente.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">4. Registro y Cuentas de Afiliados</h2>
            <p>
              Las entidades y usuarios que dispongan de credenciales de acceso para áreas privadas son responsables de mantener la confidencialidad de sus contraseñas y de la veracidad de la información reportada en formularios y encuestas sectoriales.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">5. Contacto</h2>
            <p>
              Para consultas relacionadas con estos términos, puede comunicarse a través del correo electrónico oficial:{" "}
              <a href="mailto:info@ecocircular.gov.co" className="text-[#00AB6D] font-semibold hover:underline">
                info@ecocircular.gov.co
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
