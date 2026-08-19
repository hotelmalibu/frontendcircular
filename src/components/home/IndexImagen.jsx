import { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import fondo1 from '../../assets/home/Carrusel/Index_imagen_1.jpg';
import fondo3 from '../../assets/home/Carrusel/Index_imagen_3.jpeg';
import fondo4 from '../../assets/home/Carrusel/Index_imagen_4.png';

const SLIDES = [
  {
    image: fondo3,
    title: 'Impulsando el país hacia',
    subtitle: 'la economía circular',
    description: 'Articulamos actores y desarrollamos estrategias competitivas que garantizan el cumplimiento normativo y contribuyen a las metas ESG corporativas.',
    button1: 'Sobre nosotros',
    button2: 'Conoce nuestras estrategias'
  },
  {
    image: fondo1,
    title: 'Impulsando el país hacia',
    subtitle: 'la economía circular',
    description: 'Articulamos actores y desarrollamos estrategias competitivas que garantizan el cumplimiento normativo y contribuyen a las metas ESG corporativas.',
    button1: 'Sobre nosotros',
    button2: 'Conoce nuestras estrategias'
  },
  {
    image: fondo4,
    title: 'Impulsando el país hacia',
    subtitle: 'la economía circular',
    description: 'Articulamos actores y desarrollamos estrategias competitivas que garantizan el cumplimiento normativo y contribuyen a las metas ESG corporativas.',
    button1: 'Sobre nosotros',
    button2: 'Conoce nuestras estrategias'
  }
];

export default function IndexImagen() {
  const { user } = useContext(AuthContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    if (currentSlide >= SLIDES.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide]);

  const [isAutoplay] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [progress, setProgress] = useState(0);




  // Duraciones personalizadas para cada slide
  const getDuration = useCallback((slideIndex) => {
    return 8; // Todas las imágenes: 8 segundos
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (!isAutoplay) return;


    const duration = getDuration(currentSlide);


    const slideTimer = setInterval(() => {
      setProgress(0);
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, duration * 1000);


    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const duration = getDuration(currentSlide);
        if (prev >= duration * 100) return 0;
        return prev + (100 / (duration * 10));
      });
    }, 100);


    return () => {
      clearInterval(slideTimer);
      clearInterval(progressTimer);
    };
  }, [isAutoplay, currentSlide, getDuration]);





  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };


  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden">
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }


        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        @keyframes floatCircle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }


        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 171, 109, 0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 171, 109, 0.6);
            transform: scale(1.05);
          }
        }


        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }


        @keyframes slideInIndicator {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }


        @keyframes dotPulse {
          0% {
            r: 2px;
            opacity: 1;
          }
          100% {
            r: 5px;
            opacity: 0;
          }
        }


        @keyframes arrowSlide {
          0% { transform: translateX(0); }
          50% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }


        .carousel-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          filter: brightness(0.7);
        }


        .carousel-bg-transition {
          transition: opacity 1.5s ease-in-out;
        }


        .floating-circle {
          animation: floatCircle 8s ease-in-out infinite;
        }


        .animate-on-load {
          opacity: 0;
        }


        .animate-on-load.loaded {
          animation: slideInLeft 0.8s ease-out forwards;
        }


        .animate-on-load.loaded:nth-child(2) {
          animation: slideInLeft 0.8s ease-out 0.1s forwards;
        }


        .animate-on-load.loaded:nth-child(3) {
          animation: slideInLeft 0.8s ease-out 0.2s forwards;
        }


        .animate-on-load.loaded:nth-child(4) {
          animation: slideInUp 0.8s ease-out 0.3s forwards;
        }


        .animate-buttons {
          opacity: 0;
        }


        .animate-buttons.loaded {
          animation: slideInUp 0.8s ease-out 0.4s forwards;
        }


        .btn-primary {
          background: #00AB6D;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }


        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #00AB6D, #B1D357);
          transition: left 0.3s ease;
          z-index: -1;
        }


        .btn-primary:hover {
          background: #00AB6D;
        }


        .btn-primary:hover::before {
          left: 0;
        }


        .btn-primary:hover svg {
          animation: arrowSlide 0.6s ease-in-out infinite;
        }


        .btn-secondary {
          border: 2px solid rgba(255, 255, 255, 0.8);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }


        .btn-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          right: -100%;
          width: 100%;
          height: 100%;
          background: rgba(0, 171, 109, 0.1);
          transition: right 0.3s ease;
          z-index: -1;
        }


        .btn-secondary:hover {
          border-color: white;
          box-shadow: 0 0 30px rgba(0, 171, 109, 0.2);
        }


        .btn-secondary:hover::before {
          right: 0;
        }


        .btn-secondary:hover svg {
          animation: arrowSlide 0.6s ease-in-out infinite;
        }


        .nav-indicator-item {
          animation: slideInIndicator 0.6s ease-out forwards;
        }


        .nav-indicator-item:nth-child(1) { animation-delay: 0.1s; }
        .nav-indicator-item:nth-child(2) { animation-delay: 0.2s; }
        .nav-indicator-item:nth-child(3) { animation-delay: 0.3s; }
        .nav-indicator-item:nth-child(4) { animation-delay: 0.4s; }


        .dot-pulse {
          animation: dotPulse 2s ease-out infinite;
        }


        .counter-container {
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
        }


        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>


      {/* Fondo con transición suave (crossfade) */}
      <div className="absolute inset-0">
        {SLIDES.map((s, index) => (
          <div
            key={index}
            className={`carousel-bg carousel-bg-transition ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            style={{ backgroundImage: `url(${s.image})` }}
          ></div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E305D]/60 via-[#2C67B0]/40 to-transparent z-[1]"></div>
      </div>


      {/* Elementos decorativos animados (Manual de marca) */}
      <div className={`absolute inset-0 z-[2] pointer-events-none overflow-hidden ${hasLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.8s ease-out' }}>
        <div className="floating-circle absolute top-20 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#00AB6D]/20 to-[#2C67B0]/10 blur-2xl"></div>
        <div className="floating-circle absolute bottom-32 left-32 w-60 h-60 rounded-full bg-gradient-to-br from-[#2C67B0]/15 to-[#1E305D]/10 blur-3xl" style={{ animationDelay: '2s' }}></div>
        <div className="floating-circle absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-[#00AB6D]/25 to-transparent blur-xl" style={{ animationDelay: '2s' }}></div>
      </div>


      {/* ========== INDICADORES LATERALES  ========== */}
      <div className="absolute left-2 md:left-12  mt-6 lg:left-6 top-1/2 -translate-y-[125px] z-20 flex flex-col items-center gap-10 md:translate-x-16 translate-x-0">
        {SLIDES.map((_, index) => (
          <div key={index} className="nav-indicator-item">
            {index === currentSlide ? (
              // CONTADOR - Contenido dentro del círculo
              <div className="counter-container relative w-10 h-10 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300">
                <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 120 120">

                  {/* Círculo de progreso */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#grad)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(progress / getDuration(index)) * 314.159} 314.159`}
                    style={{ transition: 'stroke-dasharray 0.1s linear' }}
                  />


                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#F5F5F5" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                  </defs>
                </svg>


                {/* Número blanco puro */}
                <div className="text-xs md:text-sm font-bold text-white drop-shadow-[0_2px_6_rgba(0,0,0,0.3)]">
                  {index + 1}
                </div>
              </div>
            ) : (
              // PUNTO PULSANTE - Clickeable
              <button
                type="button"
                onClick={() => {
                  setCurrentSlide(index);
                  setProgress(0);
                }}
                className="w-3 h-3 rounded-full bg-white/80 hover:bg-white transition-all duration-300 cursor-pointer hover:scale-150 translate-x-[10px]"
                aria-label={`Ir al slide ${index + 1}`}
              >
                {/* Pulso */}
                <svg className="absolute w-3 h-3 -inset-0.5" viewBox="-4 6 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="2"
                    fill="white"
                    opacity="0.8"
                    className="dot-pulse"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>


      {/* Contenido principal */}
      <div className="relative z-10 w-full min-h-[100vh] flex items-center pt-32 pb-20 md:translate-x-16 translate-x-0">

        <div className="w-full md:w-2/3 lg:w-1/2 pl-16 md:pl-24 text-left">
          {/* Títulos con animación SOLO AL CARGAR */}
          <div className="mb-6">
            <h1 className={`animate-on-load ${hasLoaded ? 'loaded' : ''} text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2`}>
              <span className="block whitespace-normal md:whitespace-nowrap">{SLIDES[currentSlide]?.title}</span>
              <span className="block whitespace-normal md:whitespace-nowrap">{SLIDES[currentSlide]?.subtitle}</span>
            </h1>
          </div>


          {/* Descripción */}
          <p className={`animate-on-load ${hasLoaded ? 'loaded' : ''} text-gray-100 text-base md:text-lg max-w-2xl leading-relaxed mb-8`}>
            {SLIDES[currentSlide]?.description}
          </p>


          {/* Botones estilo Citeo */}
          <div className={`animate-buttons ${hasLoaded ? 'loaded' : ''} flex flex-col gap-4 w-fit`}>
            <div className="flex flex-wrap gap-4">
              {/* Botón secundario - Contorno limpio */}
              <Link to="/quines-somos" className="btn-secondary group relative px-8 py-3 rounded-full font-semibold text-white bg-transparent transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  {SLIDES[currentSlide]?.button1}
                  <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              {/* Botón primario - */}
              <Link to="/lineas-estrategicas" className="btn-primary group relative px-8 py-3 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <span className="relative z-10 flex items-center gap-2">
                  {SLIDES[currentSlide]?.button2}
                  <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Nuevo botón: Únase a Visión Circular (Solo si no hay usuario) */}
            {!user && (
              <Link
                to="/unirse"
                className="flex items-center justify-center gap-2 w-full px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 bg-white text-[#2C67B0] hover:bg-gray-100 border-2 border-[#2C67B0]/10"
              >
                Únase a Visión Circular
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>


      {/* 🔽 Botón Scroll Mejorado */}
      <button
        type="button"
        onClick={handleScrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center group focus:outline-none"
        aria-label="Desplazarse hacia abajo"
      >
        {/* Contenedor animado flotante */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#00AB6D]/15 to-[#2C67B0]/20 border border-white/40 backdrop-blur-sm shadow-[0_0_25px_rgba(0,171,109,0.25)] animate-[float_3s_ease-in-out_infinite] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_#00AB6D66]">


          {/* Flecha */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="relative w-6 h-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] group-hover:translate-y-1 transition-transform duration-300"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>



        {/* Animaciones personalizadas */}
        <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
  `}</style>
      </button>
    </section>
  );
}