import React from "react";
import { ExternalLink } from "lucide-react";

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
import LogoCali from "../../../../../assets/logosAlianza/alcaldia_cali.png";

export default function Index() {
  return (
    <section className="bg-gradient-to-b from-white via-[#E8F0F8] to-[#F0F7E8] py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* SECCIÓN 1: Alianzas Internacionales y Regionales */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-[#1E305D] mb-8 text-center uppercase">
            Alianzas y espacios estratégicos <br />
            <span className="text-[#00AB6D]">internacionales y regionales</span>
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-items-center">
            {[
              { name: "EXPRA", logo: LogoExpra, url: "https://www.expra.net/" },
              { name: "CTC", logo: LogoCtc, url: "https://cleantechcolombia.com/es/" },
              { name: "BID", logo: LogoBid, url: "https://www.iadb.org/es" },
              { name: "ENEC", logo: LogoEnec, url: "https://www.minambiente.gov.co/asuntos-ambientales-sectorial-y-urbana/estrategia-nacional-de-economia-circular/" },
              { name: "GIZ", logo: LogoGiz, url: "https://www.giz.de/en" },
              { name: "Global Plastic Action Partnership", logo: LogoGpap, url: "https://globalplasticaction.org/" },
              { name: "PREVENT Waste Alliance", logo: LogoPrevent, url: "https://prevent-waste.net/" },
              { name: "The Consumer Goods Forum", logo: LogoForum, url: "https://www.theconsumergoodsforum.com/" },
            ].map((partner, idx) => {
              const needsExtraSize = ["GIZ", "ENEC", "PREVENT Waste Alliance", "BID", "The Consumer Goods Forum"].includes(partner.name);
              return (
                <a
                  key={idx}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Ir a ${partner.name}`}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-full h-32 flex items-center justify-center group hover:shadow-md hover:-translate-y-0.5 hover:border-[#00AB6D]/30 transition-all duration-300 relative cursor-pointer"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className={`max-h-full max-w-full object-contain transition-transform duration-300 ${needsExtraSize ? 'scale-100 group-hover:scale-[1.03]' : 'scale-90 group-hover:scale-[0.93]'}`}
                  />
                  <ExternalLink className="absolute top-2.5 right-2.5 w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-[#00AB6D] transition-opacity duration-300" />
                </a>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 2: Alianzas Nacionales */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-[#1E305D] mb-8 text-center uppercase">
            Alianzas y espacios estratégicos <br />
            <span className="text-[#00AB6D]">nacionales</span>
          </h3>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { 
                name: "Bogotá Región Circular", 
                logo: LogoBogota, 
                url: "https://www.ambientebogota.gov.co/bogota-regioncircular" 
              },
              { 
                name: "Mesa Distrital de Economía Circular de Cali", 
                logo: LogoCali, 
                url: "https://www.cali.gov.co/" 
              },
            ].map((partner, idx) => (
              <a
                key={idx}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Ir a ${partner.name}`}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full md:w-80 h-32 flex items-center justify-center group hover:shadow-md hover:-translate-y-0.5 hover:border-[#00AB6D]/30 transition-all duration-300 relative cursor-pointer"
              >
                {partner.logo ? (
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain scale-90 group-hover:scale-[0.93] transition-transform duration-300"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-[10px] font-black text-[#00AB6D] uppercase tracking-widest mb-1 opacity-50">Próximamente</p>
                    <p className="text-sm font-bold text-[#1E305D] leading-tight">{partner.name}</p>
                  </div>
                )}
                <ExternalLink className="absolute top-2.5 right-2.5 w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-[#00AB6D] transition-opacity duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
