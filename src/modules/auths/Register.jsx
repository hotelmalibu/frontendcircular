import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, getRoles } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== passwordConfirmation) {
      setError("La confirmación de contraseña no coincide.");
      return;
    }
    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
        role: selectedRole,
      });
      console.log("Registro exitoso:", res);
      // If the API returned the token and user, log the user in and go to dashboard
      const user = res?.data?.data?.user;
      const token = res?.data?.data?.token;
      if (user && token) {
        login(user, token);
        navigate("/dashboard", { replace: true });
      } else {
        // fallback: go to login
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Error en registro:", err);
      const message =
        err.response?.data?.message || err.message || "Revisar sus datos, contraseña muy débil o correo ya en uso.";
      setError(message);
    }
  };

  useEffect(() => {
    let mounted = true;
    getRoles()
      .then((r) => {
        if (!mounted) return;
        const items = r.data?.data || [];
        setRoles(items);
        // set default selected role to the last (lowest level) or first
        if (items.length > 0) {
          setSelectedRole(items[items.length - 1].slug || items[0].slug);
        }
      })
      .catch((e) => {
        console.error("No se pudieron cargar roles:", e);
      });
    return () => (mounted = false);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden pt-28">

      {/* LADO DERECHO: Formulario (50%) */}
      <div
        className="flex flex-col items-center justify-center bg-white relative px-6 lg:px-12"
        style={{ width: "100%", "@media (min-width: 1024px)": { width: "50%" } }}
      >
        {/* Contenedor del formulario con sombra */}
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-[#005380] mb-8 text-center">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            
            {/* Primera fila: Nombre y Correo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campo de nombre */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005380] focus:border-transparent bg-white"
                />
              </div>

              {/* Campo de correo */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="tuemail@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005380] focus:border-transparent bg-white"
                />
              </div>
            </div>

            {/* Segunda fila: Rol */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Seleccionar rol
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005380] focus:border-transparent bg-white"
              >
                <option value="">-- Selecciona un rol --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.slug}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tercera fila: Contraseña y Confirmación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campo de contraseña */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005380] focus:border-transparent bg-white"
                />
              </div>

              {/* Campo confirmar contraseña */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005380] focus:border-transparent bg-white"
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {/* Botón de registro */}
            <button
              type="submit"
              className="w-full text-white font-semibold py-3 rounded-lg hover:bg-[#003d5c] transition-colors shadow-md"
              style={{ backgroundColor: "#005380" }}
            >
              Registrarse
            </button>
          </form>

          {/* Link de iniciar sesión */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-[#4a9fd8] font-medium hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}