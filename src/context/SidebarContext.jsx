import React, { createContext, useState, useContext } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  // Inicializamos desde localStorage si existe para persistir la preferencia
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", newState);
      return newState;
    });
  };

  return (
    <SidebarContext.Provider value={{ isSidebarCollapsed, toggleSidebar, setIsSidebarCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
