import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../../assets/fondosYlogos/Logo.png";
import LogoBlanco from "../../assets/fondosYlogos/Logo_blanco.png";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
    blue: "#2C67B0",       // Azul Principal
    darkBlue: "#005380",   // Azul Logo/Profundo (Fondo lateral)
    lightBlue: "#7FB8D9",  // Azul Claro
    green: "#B1D357",      // Verde Principal (Botón de acción)
    darkGreen: "#8CB200",  // Verde Hover
    gray: "#6B7280",
};

export default function ForgotPassword() {
    return (
        <div className="min-h-screen w-full flex bg-white font-sans">

            {/* SECCIÓN IZQUIERDA - BRANDING (Solo visible en desktop) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 text-white"
                style={{ backgroundColor: BRAND.darkBlue }}>

                {/* Elementos Decorativos de Fondo (Círculos difuminados) */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2C67B0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#B1D357] rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2 animate-blob animation-delay-2000"></div>

                {/* Contenido Izquierda */}
                <div className="relative z-10">
                    <img src={LogoBlanco} alt="Visión Circular" className="h-16 w-auto mb-8" />
                </div>

                <div className="relative z-10 mb-24">
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Seguridad y <span style={{ color: BRAND.green }}>Control</span>.
                    </h1>
                    <p className="text-blue-100 text-lg max-w-md leading-relaxed">
                        Mantenemos tus datos seguros mientras impulsamos la economía circular.
                    </p>
                </div>
            </div>

            {/* SECCIÓN DERECHA - CONTENIDO */}
            <div className="w-full lg:w-1/2 flex mt-24 items-center justify-center p-8 bg-gray-50/50">
                <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 text-center">

                    {/* Header Móvil (Logo visible solo en móvil) */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <img src={Logo} alt="Visión Circular" className="h-12 w-auto" />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Recuperar Contraseña</h2>
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-6">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Para cambiar su contraseña, por favor contacte al <span className="font-bold text-[#2C67B0]">administrador del sistema</span>.
                            </p>
                        </div>

                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center gap-2 font-bold text-[#2C67B0] hover:text-[#005380] transition-colors group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Volver al Inicio de Sesión
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
        </div>
    );
}
