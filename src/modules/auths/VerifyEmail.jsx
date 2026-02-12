
import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import axios from "../../api"; // Adjust import based on your project structure
import { AuthContext } from "../../context/AuthContext";
import { getCurrentUser } from "../../api/auth";

export default function VerifyEmail() {
    const { isAuthenticated, updateUser } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("Verificando tu correo electrónico...");

    const id = searchParams.get("id");
    const hash = searchParams.get("hash");

    useEffect(() => {
        const verify = async () => {
            // Buscamos el id y hash tanto en los segmentos de la ruta como en el query string (?id=...)
            const finalId = id || searchParams.get("id");
            const finalHash = hash || searchParams.get("hash");

            if (!finalId || !finalHash) {
                setStatus("error");
                setMessage("Enlace de verificación inválido o incompleto.");
                return;
            }

            try {
                // Preparamos los parámetros de seguridad (signature, expires) para la API
                const params = new URLSearchParams(searchParams);
                // Evitamos duplicar id y hash en el query string de la petición API
                params.delete("id");
                params.delete("hash");
                const queryParams = params.toString();
                
                // Llamamos a la API con los datos correctos
                const url = `/auth/email/verify/${finalId}/${finalHash}${queryParams ? `?${queryParams}` : ''}`;
                
                await axios.get(url);
                
                // Si el usuario está autenticado, refrescamos sus datos para actualizar el estado de verificación
                if (isAuthenticated) {
                    try {
                        const res = await getCurrentUser();
                        if (res.data?.user) {
                            updateUser(res.data.user);
                        }
                    } catch (e) {
                        console.error("Error refreshing user data after verification:", e);
                    }
                }

                setStatus("success");
                setMessage("¡Tu correo ha sido verificado exitosamente!");
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
                setMessage(error.response?.data?.message || "Hubo un problema al verificar tu correo.");
            }
        };

        verify();
    }, [id, hash, searchParams, isAuthenticated, updateUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
                
                {status === "verifying" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificando...</h2>
                        <p className="text-gray-500">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center animate-fadeIn">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Verificado!</h2>
                        <p className="text-gray-600 mb-8">{message}</p>
                        
                        <button 
                            onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
                            className="flex items-center justify-center gap-2 bg-[#2C67B0] hover:bg-[#005380] text-white px-6 py-3 rounded-xl font-bold transition-all w-full"
                        >
                            {isAuthenticated ? "Ir a mi Perfil" : "Ir al Login"} <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center animate-fadeIn">
                        <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500">
                            <XCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                        <p className="text-red-500 mb-8">{message}</p>
                        
                        <button 
                            onClick={() => navigate("/login")}
                            className="text-gray-500 hover:text-gray-800 font-medium text-sm underline"
                        >
                            Volver al inicio
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
