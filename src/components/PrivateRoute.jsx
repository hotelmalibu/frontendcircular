import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Validar sesión en cada navegación a ruta privada.
    // Si el usuario está suspendido, el backend devolverá 403 y el AxiosInterceptor hará logout.
    if (user) {
        api.get('/auth/active-sessions')
           .catch(() => {
               // El interceptor maneja los errores críticos (403/401)
               // Los errores silenciosos no necesitan acción aquí
           });
    }
  }, [user]);

  // When used as a wrapper, render the children if authenticated
  return user ? children : <Navigate to="/login" replace />;
}
