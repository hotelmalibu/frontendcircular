import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import NotFound from "../modules/home/NotFound";

export default function PrivateRoute({ children, adminOnly = false }) {
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

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  const isAdmin = user.role_slug === 'administrador' ||
    user.role?.toLowerCase() === 'admin' ||
    user.role?.toLowerCase() === 'administrador';

  // If route is admin only and user is not admin, show 404
  if (adminOnly && !isAdmin) {
    return <NotFound />;
  }

  // When used as a wrapper, render the children if authenticated and authorized
  return children;
}
