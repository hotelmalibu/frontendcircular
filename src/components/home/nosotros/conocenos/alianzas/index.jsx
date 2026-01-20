import React from "react";

// Importación de Logos de Alianzas
import LogoExpra from "../../../../../assets/logosAlianza/expra.png";
import LogoCtc from "../../../../../assets/logosAlianza/ctc.webp";
import LogoBid from "../../../../../assets/logosAlianza/bid.jpg";
import LogoEnec from "../../../../../assets/logosAlianza/enec.webp";
import LogoGiz from "../../../../../assets/logosAlianza/giz.png";
import LogoGpap from "../../../../../assets/logosAlianza/gpap.avif";
import LogoPrevent from "../../../../../assets/logosAlianza/prevent.png";
import LogoForum from "../../../../../assets/logosAlianza/forum.png";
import LogoBogota from "../../../../../assets/logosAlianza/bogota_circular.webp";

export default function Index() {
  return (
    <section className="bg-gradient-to-b from-white via-[#E8F0F8] to-[#F0F7E8] py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* SECCIÓN 1: Alianzas Internacionales y Regionales */}
        <div
          className="mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#1E305D] mb-8 text-center uppercase">
            Alianzas y espacios estratégicos <br />
            <span className="text-[#00AB6D]">internacionales y regionales</span>
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-items-center">
            {[
              { name: "EXPRA", logo: LogoExpra },
              { name: "CTC", logo: LogoCtc },
              { name: "BID", logo: LogoBid },
              { name: "ENEC", logo: LogoEnec },
              { name: "GIZ", logo: LogoGiz },
              { name: "Global Plastic Action Partnership", logo: LogoGpap },
              { name: "PREVENT Waste Alliance", logo: LogoPrevent },
              { name: "The Consumer Goods Forum", logo: LogoForum },
            ].map((partner, idx) => {
              const needsExtraSize = ["GIZ", "ENEC", "PREVENT Waste Alliance", "BID", "The Consumer Goods Forum"].includes(partner.name);
              return (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-full h-32 flex items-center justify-center group hover:shadow-md transition-all duration-300"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className={`max-h-full max-w-full object-contain transition-transform duration-300 ${needsExtraSize ? 'scale-110' : 'scale-90'}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 2: Alianzas Nacionales */}
        <div
          className="mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#1E305D] mb-8 text-center uppercase">
            Alianzas y espacios estratégicos <br />
            <span className="text-[#00AB6D]">nacionales</span>
          </h3>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: "Bogotá Circular", logo: LogoBogota },
              { name: "Mesa Distrital de Economía Circular de Cali", logo: null },
            ].map((partner, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full md:w-80 h-32 flex items-center justify-center group hover:shadow-md transition-all duration-300"
              >
                {partner.logo ? (
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain scale-90"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-[10px] font-black text-[#00AB6D] uppercase tracking-widest mb-1 opacity-50">Próximamente</p>
                    <p className="text-sm font-bold text-[#1E305D] leading-tight">{partner.name}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
