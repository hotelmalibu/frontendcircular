import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, getRoles } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import Logo from "../../assets/fondosYlogos/Logo.png"; 
import LogoBlanco from "../../assets/fondosYlogos/Logo_blanco.png";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal
  darkGreen: "#8CB200",  // Verde Secundario
  gray: "#6B7280",
};

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    role: ""
  });
  
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let mounted = true;
    getRoles()
      .then((r) => {
        if (!mounted) return;
        const items = r.data?.data || [];
        setRoles(items);
        if (items.length > 0) {
          setFormData(prev => ({ ...prev, role: items[items.length - 1].slug || items[0].slug }));
        }
      })
      .catch((e) => {
        console.error("No se pudieron cargar roles:", e);
      });
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
        role: formData.role,
      });
      
      const user = res?.data?.data?.user;
      const token = res?.data?.data?.token;
      
      if (user && token) {
        login(user, token);
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Error en registro:", err);
      const message = err.response?.data?.message || err.message || "Error al registrarse.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full mt-24 flex bg-white font-sans overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA - BRANDING (40% Ancho) */}
      <div className="hidden lg:flex w-[50%] relative flex-col justify-between p-10 text-white"
           style={{ background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)` }}>
        
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {/* Contenido */}
        <div className="relative z-10 mt-10">
          <img src={LogoBlanco} alt="Visión Circular" className="h-12 w-auto mb-8" />
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Economía Circular <br/> <span style={{ color: BRAND.green }}>en acción</span>
          </h1>
          <p className="text-blue-100 text-sm mb-8 opacity-90 max-w-sm">
            Únete a la plataforma líder para la gestión y conexión de proyectos sostenibles en el país.
          </p>
          
          <div className="space-y-4 text-sm">
            
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#B1D357] shrink-0" />
              <span>Red de aliados estratégicos</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#B1D357] shrink-0" />
              <span>Reportes y métricas en tiempo real</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-blue-200/50">
          © {new Date().getFullYear()} Visión Circular.
        </div>
      </div>

      {/* SECCIÓN DERECHA - FORMULARIO (60% Ancho) */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-4 bg-gray-50/50">
        <div className="w-full max-w-xl bg-white  p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
          
          {/* Header Móvil */}
          <div className="lg:hidden flex justify-center mb-4">
             <img src={Logo} alt="Visión Circular" className="h-8 w-auto" />
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
            <p className="text-xs text-gray-500 mt-1">Ingresa tus datos para registrarte en la plataforma</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* GRID 1: Nombre y Email (Compacto) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 ml-1 mb-1 block">Nombre Completo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2C67B0]">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#2C67B0] focus:border-[#2C67B0] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 ml-1 mb-1 block">Correo Electrónico</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2C67B0]">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#2C67B0] focus:border-[#2C67B0] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ROL (Full Width pero compacto) */}
            <div>
              <label className="text-xs font-bold text-gray-700 ml-1 mb-1 block">Perfil de Usuario</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2C67B0]">
                  <Shield size={16} />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#2C67B0] focus:border-[#2C67B0] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Selecciona un rol...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.slug}>{r.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <ArrowRight size={14} className="rotate-90"/>
                </div>
              </div>
            </div>

            {/* GRID 2: Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 ml-1 mb-1 block">Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2C67B0]">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#2C67B0] focus:border-[#2C67B0] outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 ml-1 mb-1 block">Confirmar</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2C67B0]">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="passwordConfirmation"
                    placeholder="••••••••"
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    required
                    className="block w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#2C67B0] focus:border-[#2C67B0] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2 rounded-lg bg-red-50 border border-red-100 flex gap-2 items-center animate-pulse mt-2">
                <AlertCircle size={14} className="text-red-500" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#2C67B0] hover:bg-[#005380] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2C67B0] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.99]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "REGISTRARME"
              )}
            </button>

          </form>

          {/* Footer Login */}
          <div className="mt-5 text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="font-bold text-[#2C67B0] hover:text-[#005380] transition-colors hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}