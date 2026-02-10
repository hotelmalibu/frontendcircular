import { createContext, useState, useCallback } from "react";


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  // Inicializa desde localStorage de forma síncrona para evitar redirecciones
  // prematuras en rutas protegidas antes de que useEffect corra.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch (e) {
      return null;
    }
  });


  const login = useCallback((userData, tokenData) => {

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
      localStorage.setItem("user", JSON.stringify(userWithRole));
      localStorage.setItem("token", tokenData);
    } catch (e) {
      console.error("Error guardando en localStorage:", e);
    }
  }, []);


  const updateUser = useCallback((updatedUserData) => {
    const mergedUser = {
      ...user,
      ...updatedUserData,
    };

    setUser(mergedUser);

    try {
      localStorage.setItem("user", JSON.stringify(mergedUser));
    } catch (e) {
      console.error("Error actualizando usuario en localStorage:", e);
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (e) {
      console.error("Error eliminando de localStorage:", e);
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