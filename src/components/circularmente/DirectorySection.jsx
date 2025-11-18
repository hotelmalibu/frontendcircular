import { Building2, MapPin, Leaf, Phone, Mail, ExternalLink } from "lucide-react";

export default function DirectorySection({ selectedRegion, user }) {
  const empresas = [
    {
      id: 1,
      nombre: "Apropet",
      ciudad: "Bogotá",
      region: "Andina",
      materiales: "Resina PET reciclada",
      contacto: "+57 310 2890349",
      email: "info@apropet.com",
      tipo: "Transformadora",
    },
    {
      id: 2,
      nombre: "ArtePop",
      ciudad: "Bogotá",
      region: "Andina",
      materiales: "Materiales posindustriales",
      contacto: "+57 301 2293490",
      email: "contacto@artepop.com",
      tipo: "Transformadora",
    },
    {
      id: 3,
      nombre: "EcoRecicla",
      ciudad: "Medellín",
      region: "Andina",
      materiales: "Plástico, vidrio, papel",
      contacto: "+57 315 5678901",
      email: "ventas@ecorecicla.com",
      tipo: "Centro de Acopio",
    },
    {
      id: 4,
      nombre: "Verde Sostenible",
      ciudad: "Cali",
      region: "Pacífica",
      materiales: "Residuos electrónicos",
      contacto: "+57 320 4567890",
      email: "info@verdesostenible.com",
      tipo: "Recicladora",
    },
  ];

  if (!selectedRegion)
    return (null);

  const filtradas = empresas.filter((e) => e.region === selectedRegion.nombre);

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#F5F7FA] to-[#E8F0F7]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-[#00AB6D]" />
            <h2 className="text-4xl font-bold text-[#1E305D]">
              Región {selectedRegion.nombre}
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            {filtradas.length} empresa{filtradas.length !== 1 ? "s" : ""} aliada
            {filtradas.length !== 1 ? "s" : ""} en esta región
          </p>
        </div>

        {filtradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtradas.map((e) => (
              <div
                key={e.id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:border-[#00AB6D] transition-all duration-300 group"
              >
                {/* Header Tarjeta */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#00AB6D]/10 rounded-lg group-hover:bg-[#00AB6D]/20 transition-colors">
                      <Building2 className="w-5 h-5 text-[#00AB6D]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1E305D] text-lg">
                        {e.nombre}
                      </h3>
                      <span className="text-xs font-semibold text-[#00AB6D] bg-[#00AB6D]/10 px-2 py-1 rounded-full">
                        {e.tipo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información */}
                <div className="space-y-3 mb-6">
                  {/* Ubicación */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {e.ciudad}
                      </p>
                      <p className="text-xs text-gray-500">{selectedRegion.nombre}</p>
                    </div>
                  </div>

                  {/* Materiales */}
                  <div className="flex items-start gap-2">
                    <Leaf className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{e.materiales}</p>
                  </div>

                  {/* Contacto */}
                  {user && (
                    <>
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <a
                          href={`tel:${e.contacto}`}
                          className="text-sm text-[#00AB6D] font-semibold hover:underline"
                        >
                          {e.contacto}
                        </a>
                      </div>

                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <a
                          href={`mailto:${e.email}`}
                          className="text-sm text-[#00AB6D] font-semibold hover:underline"
                        >
                          {e.email}
                        </a>
                      </div>
                    </>
                  )}
                </div>

                {/* Botón */}
                {user && (
                  <button className="w-full bg-gradient-to-r from-[#00AB6D] to-[#008A5C] text-white font-bold py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                    Contactar
                    <ExternalLink size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-lg">
              No hay empresas en esta región aún
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
