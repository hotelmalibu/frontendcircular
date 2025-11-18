import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginRequest(email.trim(), password);
      login(res.data.data.user, res.data.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Credenciales incorrectas";
      setError(message);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col pt-20">
      
      {/* LÍNEAS SVG DECORATIVAS */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
      >
        {/* Líneas diagonales */}
        <line x1="0" y1="0" x2="1200" y2="800" stroke="#00AB6D" strokeWidth="2" />
        <line x1="0" y1="200" x2="1200" y2="600" stroke="#2C67B0" strokeWidth="1.5" />
        <line x1="200" y1="0" x2="1000" y2="800" stroke="#B1D357" strokeWidth="1" opacity="0.6" />
        <line x1="0" y1="600" x2="1200" y2="200" stroke="#00AB6D" strokeWidth="1.5" opacity="0.5" />
      </svg>

      

      {/* CONTENIDO PRINCIPAL */}
<div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 sm:px-6 lg:px-12 py-8 pt-24">
<div className="w-full max-w-md">
          {/* Contenedor del formulario - Glassmorphism */}
          <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 animate-slide-up">
            {/* Título */}
            <h2 className="text-3xl font-bold text-[#005280] mb-2 text-center">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600 text-sm text-center mb-8">
              Accede a tu plataforma de economía circular
            </p>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo de correo */}
              <div className="group">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AB6D] focus:border-transparent bg-gray-50 transition-all duration-200 group-hover:border-[#00AB6D]/50"
                />
              </div>

              {/* Campo de contraseña */}
              <div className="group">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AB6D] focus:border-transparent bg-gray-50 transition-all duration-200 group-hover:border-[#00AB6D]/50"
                  />
                  {/* Botón ver/ocultar contraseña */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00AB6D] transition-colors"
                    aria-label="Mostrar/ocultar contraseña"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Link de olvidaste contraseña */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#00AB6D] font-semibold hover:text-[#008A5C] transition-colors duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm text-center transition-all duration-300 animate-shake">
                  {error}
                </div>
              )}

              {/* Botón de iniciar sesión */}
              <button
                type="submit"
                className=" w-full text-white font-bold py-3 rounded-lg bg-gradient-to-r from-[#00AB6D] to-[#008A5C] hover:from-[#008A5C] hover:to-[#006F4C] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00AB6D] focus:ring-offset-2 focus:ring-offset-white mt-2"
              >
                Iniciar Sesión
              </button>
            </form>

            {/* Línea decorativa inferior */}
            <div className="h-1 w-24 bg-gradient-to-r from-[#2C67B0] to-[#00AB6D] rounded-full mx-auto my-2"></div>

            {/* Link de registro */}
            <p className="text-sm text-gray-600 text-center">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-[#00AB6D] font-bold hover:text-[#008A5C] transition-colors duration-200"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Eslogán */}
          <p className="text-white text-center text-xs font-semibold mt-8 opacity-80 tracking-wide">
            Impulsando el país hacia la economía circular
          </p>
        </div>
      </div>

      {/* Footer placeholder - agregar Footer aquí */}

      {/* ESTILOS ANIMACIONES */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.7s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}