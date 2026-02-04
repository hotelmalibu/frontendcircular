import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "../../api/auth";
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
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await forgotPassword(email.trim());
            setIsSent(true);
        } catch (err) {
            console.error("Error al enviar enlace:", err);
            setError(err.response?.data?.message || "No se pudo enviar el enlace. Verifica tu correo.");
        } finally {
            setIsLoading(false);
        }
    };

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
                <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">

                    {/* Header Móvil (Logo visible solo en móvil) */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <img src={Logo} alt="Visión Circular" className="h-12 w-auto" />
                    </div>

                    {!isSent ? (
                        <>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h2>
                                <p className="text-gray-500">Ingresa tu correo para recibir un enlace de restauración.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Correo Electrónico</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2C67B0] transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="usuario@empresa.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2C67B0]/20 focus:border-[#2C67B0] transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold bg-[#B1D357] hover:bg-[#9CB84D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B1D357] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 text-[#005380]"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "ENVIAR ENLACE"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center animate-fadeIn">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-green-100 rounded-full text-green-600">
                                    <CheckCircle2 size={48} />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Correo Enviado!</h2>
                            <p className="text-gray-600 mb-8 text-lg">
                                Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor revisa tu bandeja de entrada.
                            </p>
                            <Link
                                to="/login"
                                className="w-full inline-flex justify-center items-center gap-2 py-4 px-4 bg-[#2C67B0] text-white rounded-xl font-bold hover:bg-[#005380] transition shadow-md"
                            >
                                VOLVER AL INICIO
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
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
