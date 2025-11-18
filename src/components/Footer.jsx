import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Logo from "../assets/Logo_blanco.png";
import fondoFooter from "../assets/fondo_footer.jpg";

export default function Footer() {
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
      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start text-center md:text-left">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <img src={Logo} alt="EcoCircular Logo" className="h-20 w-auto object-contain mb-2" />
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-semibold mb-2">Navegación</h4>
            <ul className="space-y-1 text-sm text-white/90">
              <li><Link to="/about" className="hover:text-[#00AB6D] transition-colors">Conócenos</Link></li>
              <li><Link to="/projects" className="hover:text-[#00AB6D] transition-colors">Proyectos</Link></li>
              <li><Link to="/comunicaciones" className="hover:text-[#00AB6D] transition-colors">Comunicaciones</Link></li>
              <li><Link to="/marco" className="hover:text-[#00AB6D] transition-colors">Marco Normativo</Link></li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-semibold mb-2">Servicios</h4>
            <ul className="space-y-1 text-sm text-white/90">
              <li><Link to="/cursos" className="hover:text-[#00AB6D] transition-colors">Cursos E-learning</Link></li>
              <li><Link to="/herramientas" className="hover:text-[#00AB6D] transition-colors">Herramientas Digitales</Link></li>
              <li><Link to="/directorio" className="hover:text-[#00AB6D] transition-colors">Directorio</Link></li>
              <li><Link to="/contact" className="hover:text-[#00AB6D] transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold mb-2">Contáctenos</h4>
            <address className="not-italic text-sm text-white/90 space-y-1 leading-relaxed">
              <div>Carrera 13 # 25-405. Bogotá D.C.</div>
              <div>+57 1 381-3000</div>
              <div>
                <a href="mailto:info@ecocircular.gov.co" className="hover:text-[#00AB6D] transition-colors">
                  info@ecocircular.gov.co
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Botón subir (más cerca de la línea) */}
        <div className="flex justify-center md:justify-end mt-6">
          <button
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

        {/* Línea divisoria (menos espacio arriba y abajo) */}
        <div className="container mx-auto px-6">
          <div className="w-full border-t border-[#8CB200] my-1" />
        </div>
      </div>

      {/* Barra inferior (pegada a la línea) */}
      <div className="relative z-10 bg-black/40">
        <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row justify-between items-center text-xs text-white/80 gap-2 sm:gap-0">
          <div>© {new Date().getFullYear()} Visión Circular Colombia. Todos los derechos reservados.</div>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-[#00AB6D] transition-colors">Términos de uso</Link>
            <Link to="/privacy" className="hover:text-[#00AB6D] transition-colors">Política de privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
