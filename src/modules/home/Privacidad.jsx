import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function Privacidad() {
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
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#00AB6D] flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Política de Privacidad y Tratamiento de Datos</h1>
            <p className="text-sm text-gray-500">En cumplimiento de la Ley 1581 de 2012 (Habeas Data) de Colombia</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">1. Responsable del Tratamiento</h2>
            <p>
              La Asociación Nacional de Empresarios de Colombia (ANDI) y el colectivo Visión Circular son los responsables del tratamiento de los datos personales recolectados a través de esta plataforma digital.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">2. Finalidad del Tratamiento de Datos</h2>
            <p>
              Los datos suministrados por personas naturales y representantes de empresas serán utilizados para:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Gestión del registro, acceso y autenticación en la plataforma.</li>
              <li>Consolidación estadística de indicadores de circularidad y cumplimiento de metas sectoriales.</li>
              <li>Envío de comunicaciones técnicas, convocatorias a eventos y boletines informativos.</li>
              <li>Atención de peticiones, consultas de soporte y gestión de tickets de ayuda.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">3. Derechos del Titular</h2>
            <p>
              De conformidad con la normatividad vigente, usted tiene derecho a conocer, actualizar, rectificar y suprimir sus datos personales, así como revocar la autorización otorgada para su tratamiento.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">4. Canales para Ejercer sus Derechos</h2>
            <p>
              Para ejercer sus derechos de Habeas Data, puede escribir a{" "}
              <a href="mailto:info@ecocircular.gov.co" className="text-[#00AB6D] font-semibold hover:underline">
                info@ecocircular.gov.co
              </a> indicando en el asunto "Solicitud de Tratamiento de Datos Personales".
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
