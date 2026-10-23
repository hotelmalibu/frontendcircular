import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import BannerEditor from "../../components/dashboard/banners/BannerEditor";
import CarouselEditor from "../../components/dashboard/banners/CarouselEditor";
import bannerService from "../../services/bannerService";
import { toast } from "react-hot-toast";
import {
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Users,
  Compass,
  FileText,
  ClipboardList,
  UserX,
  RotateCcw,
  Building2,
} from "lucide-react";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal
  emerald: "#00AB6D",    // Verde Secundario
  gray: "#6B7280",
};

export default function Banners() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("inicio");

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const tabs = [
    {
      id: "inicio",
      label: "1. Inicio",
      icon: <Sparkles size={17} />,
      isCarousel: true,
    },
    {
      id: "etica-transparencia",
      label: "2. Ética y Transparencia",
      icon: <ShieldCheck size={17} />,
      isCarousel: false,
    },
    {
      id: "junta-equipo",
      label: "3. Junta Directiva y Equipo",
      icon: <Users size={17} />,
      isCarousel: false,
    },
    {
      id: "lineas-estrategicas",
      label: "4. Líneas Estratégicas",
      icon: <Compass size={17} />,
      isCarousel: false,
    },
    {
      id: "informes",
      label: "5. Informes",
      icon: <FileText size={17} />,
      isCarousel: false,
    },
    {
      id: "encuestas",
      label: "6. Encuestas",
      icon: <ClipboardList size={17} />,
      isCarousel: false,
    },
    {
      id: "circularmente",
      label: "7. Circularmente",
      icon: <Building2 size={17} />,
      isCarousel: false,
    },
  ];

  const handleResetAllBanners = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas restablecer TODOS los banners de las 6 páginas a sus valores predeterminados de fábrica?"
      )
    ) {
      bannerService.resetAllBanners();
      toast.success("Todos los banners han sido restablecidos a los valores iniciales");
      // Trigger small re-render
      setActiveTab((prev) => prev);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-700">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1
                className="text-3xl font-bold flex items-center gap-3"
                style={{ color: BRAND.darkBlue }}
              >
                <ImageIcon className="text-blue-500" size={32} />
                Gestión de Banners
              </h1>
              <p className="text-gray-500 mt-2 text-base sm:text-lg sm:ml-11">
                Personaliza las imágenes de cabecera, títulos y descripciones de las páginas principales
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetAllBanners}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl shadow-xs transition-all w-fit"
              title="Restablecer todos los 6 banners a valores de fábrica"
            >
              <RotateCcw size={15} />
              Restablecer Todos
            </button>
          </div>

          {user ? (
            <div className="space-y-6">
              {/* Tab Navigation Menu */}
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-2 w-full">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex-1 sm:flex-none justify-center whitespace-nowrap ${
                        isActive
                          ? "text-white shadow-md transform scale-[1.02]"
                          : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                      style={{
                        backgroundColor: isActive ? BRAND.blue : "transparent",
                      }}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Content */}
              <div className="animate-fade-in-up min-h-[500px]">
                {activeTab === "inicio" ? (
                  <CarouselEditor pageKey="inicio" />
                ) : (
                  <BannerEditor key={activeTab} pageKey={activeTab} />
                )}
              </div>
            </div>
          ) : (
            /* Empty / Unauthenticated state */
            <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-3xl shadow-sm border border-dashed border-gray-300 text-center p-8">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <UserX size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sesión no iniciada</h3>
              <p className="text-gray-500">
                Por favor, inicia sesión para acceder al panel de banners.
              </p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
