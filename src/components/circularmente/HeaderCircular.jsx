import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react"; 
import fondoCircularmente from "../../assets/fondo_circularmente.jpg";
import { useNavigate } from "react-router-dom";

export default function HeaderCircular({ user, onLoginClick, onRegisterClick }) {
  const navigate = useNavigate();
  return (
  <header
  className="relative flex flex-col items-center justify-center text-center h-screen font-[Montserrat] bg-cover bg-center"
  style={{
    backgroundImage: `url(${fondoCircularmente})`,
  }}
>


      {/* Contenido animado */}
      <motion.div
        className="relative z-10 px-6 max-w-5xl flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        

        {/* Título Principal */}
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-white drop-shadow-2xl tracking-tight leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        >
          Circularmente
        </motion.h1>


        {/* Descripción */}
        <motion.p
          className="text-lg md:text-xl text-[#b9e31b] mt-6 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        >
          Conecta con transformadores líderes en reciclaje y sostenibilidad.
          <br />
          <span className="font-semibold text-[#b9e31b]">
            La plataforma profesional que impulsa la economía circular en
            Colombia.
          </span>
        </motion.p>

        {/* Botones CTA */}
        <motion.div
          className="mt-10 flex justify-center gap-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        >
          {!user ? (
            <>
             <button
                onClick={() => navigate("/login")}
                className="group bg-gradient-to-b from-[#007f4f] to-[#00ab6d] justify-center text-white px-12 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 w-64"
              >
                Iniciar Sesión
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={() => navigate("/register")}
                className="group border-2 border-white justify-center text-white px-12 py-4 rounded-xl font-bold hover:bg-white hover:text-[#00AB6D] hover:scale-105 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm w-64"
              >
                Registrarse
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>


            </>
          ) : (
            <button 
            onClick={() => navigate("/dashboard")}
            className="group bg-[#B1D357] text-[#0a2342] px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Ir al Dashboard
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          )}
        </motion.div>
      </motion.div>
    </header>
  );
}
