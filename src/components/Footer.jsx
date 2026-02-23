import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Instagram, Facebook, Linkedin } from "lucide-react";
import Logo from "../assets/fondosYlogos/Logo_blanco.png";
import fondoFooter from "../assets/fondosYlogos/fondo_footer.jpg";
import HelpdeskModal from "./modals/HelpdeskModal";
import TicketStatusModal from "./modals/TicketStatusModal";

export default function Footer() {
  const [isHelpdeskOpen, setIsHelpdeskOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="relative text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fondoFooter})` }}
    >
      {/* Modals */}
      <HelpdeskModal
        isOpen={isHelpdeskOpen}
        onClose={() => setIsHelpdeskOpen(false)}
      />

      <TicketStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">

          {/* Logo & Intro - Left Side */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
            <img src={Logo} alt="EcoCircular Logo" className="h-20 w-auto object-contain mb-4" />
            <p className="text-white/80 text-sm leading-relaxed">
              Impulsando el país hacia la economía circular
            </p>
          </div>

          {/* Info & Socials - Right Side Group */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-12 lg:gap-16 text-center md:text-left">

            {/* Contacto */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Contáctenos</h4>
              <address className="not-italic text-sm text-white/90 space-y-2 leading-relaxed flex flex-col items-center md:items-start">
                <div>Carrera 13 # 25-405. Bogotá D.C.</div>
                <div>+57 1 381-3000</div>
                <div>
                  <a href="mailto:info@ecocircular.gov.co" className="hover:text-[#00AB6D] transition-colors font-medium">
                    info@ecocircular.gov.co
                  </a>
                </div>
              </address>
            </div>

            {/* Redes Sociales */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Síguenos</h4>
              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href="https://www.instagram.com/visioncircularandi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full 
                            bg-white/10 border border-white/20 hover:bg-[#00AB6D] hover:border-[#00AB6D] transition-all duration-300"
                >
                  <Instagram size={20} className="text-white" />
                </a>

                <a
                  href="https://www.facebook.com/VisionCircularANDI/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full 
                            bg-white/10 border border-white/20 hover:bg-[#00AB6D] hover:border-[#00AB6D] transition-all duration-300"
                >
                  <Facebook size={20} className="text-white" />
                </a>

                <a
                  href="https://www.linkedin.com/in/andivision3030/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full 
                            bg-white/10 border border-white/20 hover:bg-[#00AB6D] hover:border-[#00AB6D] transition-all duration-300"
                >
                  <Linkedin size={20} className="text-white" />
                </a>
              </div>
            </div>

            {/* Soporte */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white uppercase tracking-wider">Mesa de Ayuda</h4>
              <div className="text-sm text-white/90 space-y-3 flex flex-col items-center md:items-start min-w-[200px]">
                <button
                  type="button"
                  aria-label="Reportar problema técnico"
                  onClick={() => setIsHelpdeskOpen(true)}
                  className="w-full text-left hover:text-[#00AB6D] transition-all font-bold border border-white/20 rounded-xl px-5 py-3 hover:bg-white/10 flex items-center justify-center md:justify-start gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Soporte Técnico
                </button>
                <button
                  type="button"
                  aria-label="Consultar estado de ticket"
                  onClick={() => setIsStatusModalOpen(true)}
                  className="w-full text-left hover:text-[#00AB6D] transition-all font-bold border border-white/20 rounded-xl px-5 py-3 hover:bg-white/10 flex items-center justify-center md:justify-start gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  Consultar Estado
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Botón subir */}
        <div className="flex justify-center md:justify-end mt-4">
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex flex-col items-center justify-center gap-1 text-white/60 hover:text-[#00AB6D] transition-all duration-300"
            aria-label="Volver al principio"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-white/40 hover:border-[#00AB6D] transition-all duration-300 group-hover:bg-[#00AB6D]/10">
              <ArrowUp size={15} className="group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span className="text-xs font-semibold tracking-wide">Arriba</span>
          </button>
        </div>

        {/* Línea divisoria */}
        <div className="container mx-auto px-6">
          <div className="w-full border-t border-[#8CB200] my-1" />
        </div>
      </div>

      {/* Barra inferior */}
      <div className="relative z-10 bg-black/40">
        <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row justify-between items-center text-xs text-white/80 gap-2 sm:gap-0">
          <div>© {new Date().getFullYear()} Visión Circular ANDI. Todos los derechos reservados.</div>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-[#00AB6D] transition-colors">Términos de uso</Link>
            <Link to="/privacy" className="hover:text-[#00AB6D] transition-colors">Política de privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
