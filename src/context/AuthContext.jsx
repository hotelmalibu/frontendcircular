import { createContext, useState, useCallback } from "react";


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  // Inicializa buscando en localStorage (persistente) o sessionStorage (temporal)
  const [user, setUser] = useState(() => {
    try {
      const savedLocal = localStorage.getItem("user");
      const savedSession = sessionStorage.getItem("user");
      return savedLocal ? JSON.parse(savedLocal) : (savedSession ? JSON.parse(savedSession) : null);
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
    } catch (e) {
      return null;
    }
  });


  const login = useCallback((userData, tokenData, remember = false) => {

    const userWithRole = {
      ...userData,
      // Extraer rol del array 'roles' si existe (Laravel Roles lo devuelve así)
      role: userData?.role || (userData?.roles && userData.roles.length > 0 ? userData.roles[0].name : "Sin rol"),
      role_slug: userData?.role_slug || (userData?.roles && userData.roles.length > 0 ? userData.roles[0].slug : null),
      permissions: userData?.permissions || [],
    };

    setUser(userWithRole);
    setToken(tokenData);

    try {
      if (remember) {
        localStorage.setItem("user", JSON.stringify(userWithRole));
        localStorage.setItem("token", tokenData);
        // También guardamos el email para pre-completar el form
        localStorage.setItem("remembered_email", userWithRole.email);
      } else {
        sessionStorage.setItem("user", JSON.stringify(userWithRole));
        sessionStorage.setItem("token", tokenData);
        // Al no recordar, limpiamos el email recordado previo por privacidad
        localStorage.removeItem("remembered_email");
      }
    } catch (e) {
      console.error("Error guardando datos de sesión:", e);
    }
  }, []);


  const updateUser = useCallback((updatedUserData) => {
    const mergedUser = {
      ...user,
      ...updatedUserData,
    };

    setUser(mergedUser);

    try {
      if (localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(mergedUser));
      } else if (sessionStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(mergedUser));
      }
    } catch (e) {
      console.error("Error actualizando usuario en almacenamiento:", e);
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } catch (e) {
      console.error("Error eliminando de almacenamiento:", e);
    }
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};