import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../components/auth/PasswordStrengthMeter";
import { register, getPublicRoles } from "../../api/auth";
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
    AlertCircle,
    Info,
    CheckCircle
} from "lucide-react";

import Logo from "../../assets/fondosYlogos/Logo.png";
import LogoBlanco from "../../assets/fondosYlogos/Logo_blanco.png";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
    blue: "#2C67B0",
    darkBlue: "#005380",
    lightBlue: "#7FB8D9",
    green: "#B1D357",
    darkGreen: "#8CB200",
    gray: "#6B7280",
};

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        role_id: ""
    });

    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await getPublicRoles();
                const items = res.data?.data?.items || [];

                // Filtrar para mostrar solo roles de afiliados
                const filteredRoles = items.filter(role =>
                    role.name.toLowerCase().includes('afiliado')
                );

                setRoles(filteredRoles);

                // Seleccionar automáticamente el primer rol de la lista filtrada
                if (filteredRoles.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        role_id: filteredRoles[0].id
                    }));
                }

            } catch (error) {
                console.error("Error cargando roles:", error);
                setError("Error al cargar los roles disponibles.");
            } finally {
                setLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    };



    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.passwordConfirmation) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setIsLoading(true);
        try {
            await register({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                password_confirmation: formData.passwordConfirmation,
                role_id: parseInt(formData.role_id),
            });

            // No logueamos inmediatamente, mostramos modal de éxito
            setShowSuccessModal(true);

        } catch (err) {
            console.error("Error registrando:", err);
            const msg = err.response?.data?.message || "Error en el registro.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full mt-24 flex bg-white font-sans overflow-hidden">

            {/* SECCIÓN IZQUIERDA */}
            <div className="hidden lg:flex w-[50%] relative flex-col justify-between p-10 text-white"
                style={{ background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)` }}>

                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="relative z-10 mt-10">
                    <img src={LogoBlanco} className="h-12 w-auto mb-8" alt="Logo" />

                    <h1 className="text-5xl font-bold leading-tight mb-4">
                        Economía Circular <br />
                        <span style={{ color: BRAND.green }}>en acción</span>
                    </h1>

                    <p className="text-blue-100 text-sm mb-8 opacity-90 max-w-sm">
                        Únete a la plataforma líder para la gestión sostenible en el país.
                    </p>

                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-[#B1D357]" size={18} />
                            <span>Red de aliados estratégicos</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-[#B1D357]" size={18} />
                            <span>Reportes en tiempo real</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-[10px] text-blue-200/50">
                    © {new Date().getFullYear()} Visión Circular.
                </div>
            </div>

            {/* SECCIÓN DERECHA */}
            <div className="w-full lg:w-[60%] flex items-center justify-center p-4 bg-gray-50/50">
                <div className="w-full max-w-xl bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">

                    {/* LOGO MÓVIL */}
                    <div className="lg:hidden flex justify-center mb-4">
                        <img src={Logo} className="h-8 w-auto" alt="Logo" />
                    </div>

                    <div className="mb-6 text-center">
                        <h2 className="text-3xl font-bold">Crear Cuenta</h2>
                        <p className="text-xs text-gray-500 mt-1">Regístrate para continuar</p>
                    </div>

                    {/* FORMULARIO */}
                    <form onSubmit={handleSubmit} className="space-y-3">

                        {/* GRID: Nombre + Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            {/* Nombre */}
                            <div>
                                <label className="text-xs font-bold ml-1 block mb-1">Nombre Completo</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        placeholder="Tu nombre"
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-[#2C67B0]"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-xs font-bold ml-1 block mb-1">Correo Electrónico</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        placeholder="correo@ejemplo.com"
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-[#2C67B0]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ROLES con loading */}
                        <div>
                            <label className="text-xs font-bold ml-1 block mb-1">Perfil de Usuario</label>

                            <div className="relative">
                                <Shield className="absolute left-3 top-3 text-gray-400" size={16} />

                                <select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={handleChange}
                                    disabled={loadingRoles}
                                    className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        {loadingRoles ? "Cargando roles..." : "Selecciona un rol"}
                                    </option>

                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>

                                <ArrowRight className="absolute right-3 top-3 rotate-90 text-gray-400" size={14} />
                            </div>
                        </div>

                        {/* GRID: contraseñas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            {/* Contraseña */}
                            <div>
                                <label className="text-xs font-bold ml-1 block mb-1">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={16} />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar */}
                            <div>
                                <label className="text-xs font-bold ml-1 block mb-1">Confirmar</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={16} />

                                    <input
                                        type={showPasswordConfirmation ? "text" : "password"}
                                        name="passwordConfirmation"
                                        placeholder="••••••••"
                                        value={formData.passwordConfirmation}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswordConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <PasswordStrengthMeter password={formData.password} />

                        {/* ERROR */}
                        {error && (
                            <div className="p-2 rounded-lg bg-red-50 border border-red-100 flex gap-2 items-center mt-2">
                                <AlertCircle size={14} className="text-red-500" />
                                <p className="text-xs text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={isLoading || loadingRoles}
                            className="w-full mt-4 flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#2C67B0] hover:bg-[#005380] disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "REGISTRARME"}
                        </button>

                    </form>

                    {/* Footer */}
                    <div className="mt-5 text-center pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login" className="font-bold text-[#2C67B0] hover:text-[#005380] hover:underline">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>

                </div>
            </div>

            {/* MODAL DE ÉXITO PENDIENTE */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#005380] bg-opacity-60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fadeIn transform transition-all p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: BRAND.green }}></div>

                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-inner">
                                <CheckCircle size={40} />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-3">¡Registro Recibido!</h3>
                        
                        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-6 text-left flex gap-3">
                            <Info size={20} className="text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-green-800 leading-relaxed">
                                Te hemos enviado un <strong>correo de verificación</strong>. Por favor, verifica tu cuenta para que un administrador pueda habilitar tu acceso.
                            </p>
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-6 text-left flex gap-3">
                            <Shield size={20} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Una vez verificado el correo, tu cuenta será revisada y aprobada por el equipo administrativo.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-3.5 px-6 rounded-xl text-white font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                            style={{ backgroundColor: BRAND.blue }}
                        >
                            Entendido, ir al Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
