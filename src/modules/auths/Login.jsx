import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
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

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await loginRequest(email.trim(), password);
      login(res.data.data.user, res.data.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Credenciales incorrectas. Inténtalo nuevamente.";

      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (message.toLowerCase().includes('suspen')) {
        setError(message);
      } else {
        if (newAttempts === 3) {
          setShowWarningModal(true);
        }
        setError(message);
      }

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
            Impulsando el país hacia la <span style={{ color: BRAND.green }}>economía circular</span>.
          </h1>
          <p className="text-white text-xl font-bold max-w-md leading-relaxed opacity-90 drop-shadow-sm">
            Conecta con aliados estrategicos en una sola plataforma integral
          </p>
        </div>


      </div>

      {/* SECCIÓN DERECHA - FORMULARIO */}
      <div className="w-full lg:w-1/2 flex mt-24 items-center justify-center p-8 bg-gray-50/50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">

          {/* Header Móvil (Logo visible solo en móvil) */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={Logo} alt="Visión Circular" className="h-12 w-auto" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Hola de nuevo!</h2>
            <p className="text-gray-500">Ingresa tus credenciales para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Input Email */}
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
                  autoComplete="email"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2C67B0]/20 focus:border-[#2C67B0] transition-all duration-200"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-700">Contraseña</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#2C67B0] hover:text-[#005380] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2C67B0] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2C67B0]/20 focus:border-[#2C67B0] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3 items-start animate-shake">
                <div className="text-red-500 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
                </div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold bg-[#B1D357] hover:bg-[#9CB84D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B1D357] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.99] text-[#005380]" // Texto azul oscuro para contraste en fondo verde
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  INGRESAR AL SISTEMA <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Aún no tienes una cuenta?{" "}
              <Link to="/register" className="font-bold text-[#2C67B0] hover:text-[#005380] transition-colors">
                Solicitar acceso
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modal Global de Advertencia de Suspensión */}
      {showWarningModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100 border-l-4 border-yellow-500">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-4 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Advertencia de Seguridad
              </h3>
              <p className="text-gray-600 mb-6">
                Has fallado <strong>3 intentos</strong> de inicio de sesión.
                <br /><br />
                Si alcanzas los <strong>5 intentos fallidos</strong>, tu cuenta será suspendida temporalmente por seguridad.
                <br />
                Podrás intentar de nuevo en algunas horas.
              </p>
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full px-4 py-3 bg-[#2C67B0] text-white rounded-xl font-bold hover:bg-[#005380] transition shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}