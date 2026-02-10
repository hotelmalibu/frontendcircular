import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import NotFound from "../modules/home/NotFound";

export default function PrivateRoute({ children, adminOnly = false, permission = null }) {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      api.get('/auth/active-sessions')
        .catch(() => {});
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role_slug === 'administrador' ||
    user.role?.toLowerCase() === 'admin' ||
    user.role?.toLowerCase() === 'administrador';

  // Permitir si es admin O si tiene el permiso requerido
  const hasPermission = permission ? user.permissions?.includes(permission) : true;
  const isAuthorized = isAdmin || (permission ? hasPermission : !adminOnly);

  if (!isAuthorized) {
    return <NotFound />;
  }

  return children;
}
