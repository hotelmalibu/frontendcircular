import React, { Suspense, lazy, useContext } from "react";
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import AxiosInterceptor from "./components/common/AxiosInterceptor";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import DefaultLoader from "./components/common/DefaultLoader";
import ScrollToTop from "./components/common/ScrollToTop";

// --- LAZY LOADED COMPONENTS ---

// Auth
const Login = lazy(() => import("./modules/auths/Login"));
const ForgotPassword = lazy(() => import("./modules/auths/ForgotPassword"));
const ResetPassword = lazy(() => import("./modules/auths/ResetPassword"));
const Register = lazy(() => import("./modules/auths/Register"));
const VerifyEmail = lazy(() => import("./modules/auths/VerifyEmail"));

// Public Pages (Home & Microsite)
const Home = lazy(() => import("./modules/home/Home"));
const Circularmente = lazy(() => import("./modules/micrositio/Circularmente"));

// Public - Conócenos
const QuienesSomos = lazy(() => import("./modules/home/nosotros/conocenos/quienesSomos"));
const Alianzas = lazy(() => import("./modules/home/nosotros/conocenos/alianzas"));
const Valores = lazy(() => import("./modules/home/nosotros/conocenos/valores"));
const JuantaDirectiva = lazy(() => import("./modules/home/nosotros/conocenos/juntaDirecteEquipo"));
const InformesAnuales = lazy(() => import("./modules/home/nosotros/conocenos/informesAnuales"));
const PublicSurveysPage = lazy(() => import("./modules/home/nosotros/conocenos/PublicSurveysPage"));
const PublicSurveyDetail = lazy(() => import("./modules/home/nosotros/conocenos/PublicSurveyDetail"));

// Public - Marco Normativo
const Planes = lazy(() => import("./modules/home/nosotros/marcoNormativo/planes"));
const Politicas = lazy(() => import("./modules/home/nosotros/marcoNormativo/politicas"));
const Resoluciones = lazy(() => import("./modules/home/nosotros/marcoNormativo/resoluciones"));

// Public - Nuestros Trabajos
const ProyectosActivos = lazy(() => import("./modules/home/nuestrosTrabajos/proyectosAlianzas/proyectosActivos"));
const LineasEstrategicasPage = lazy(() => import("./modules/home/nuestrosTrabajos/lineasEstrategicas/index"));
const VisionCircularFormPage = lazy(() => import("./components/pagesProyectos/VisionCircularFormPage"));

// Public - Legales
const Terminos = lazy(() => import("./modules/home/Terminos"));
const Privacidad = lazy(() => import("./modules/home/Privacidad"));

// Dashboard (Protected)
const Dashboard = lazy(() => import("./modules/dashboard/Dashboard"));
const Documentos = lazy(() => import("./modules/dashboard/Documentos"));
const Empresas = lazy(() => import("./modules/dashboard/Empresas"));
const Formularios = lazy(() => import("./modules/dashboard/Formularios"));
const Comunicaciones = lazy(() => import("./modules/dashboard/Comunicaciones"));
const Administracion = lazy(() => import("./modules/dashboard/Administracion"));
const Soporte = lazy(() => import("./modules/dashboard/Soporte"));
const Integracion = lazy(() => import("./modules/dashboard/Integracion"));
const Profile = lazy(() => import("./modules/dashboard/Profile"));
const Banners = lazy(() => import("./modules/dashboard/Banners"));

// Explorar & Projects
const ExplorePage = lazy(() => import("./components/pagesExplorar/ExplorePage"));
const ContentDetailPage = lazy(() => import("./components/pagesExplorar/ContentDetailPage"));
const ContentDetailProject = lazy(() => import("./components/pagesProyectos/ContentDetailProject"));

const NotFound = lazy(() => import("./modules/home/NotFound"));

// Helper component for pages with shared layout
const MainLayout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Rutas internas del dashboard donde NO se muestra el footer
  const internalPaths = [
    "/documentos",
    "/empresas",
    "/companies",
    "/seguimiento",
    "/formularios",
    "/comunicaciones",
    "/administracion",
    "/soporte",
    "/integracion",
    "/banners",
  ];

  const isInternalRoute = internalPaths.some((p) =>
    location.pathname === p || location.pathname.startsWith(p + "/")
  );

  // En /dashboard, /perfil y /profile: solo mostrar footer si es afiliado
  const isDashboardOrProfile =
    location.pathname === "/dashboard" ||
    location.pathname === "/perfil" ||
    location.pathname.startsWith("/perfil/") ||
    location.pathname === "/profile" ||
    location.pathname.startsWith("/profile/");

  const isAfiliado =
    user &&
    (user.role_slug?.toLowerCase().includes("afiliado") ||
      user.role?.toLowerCase().includes("afiliado"));

  const showFooter =
    !isInternalRoute && !(isDashboardOrProfile && user && !isAfiliado);

  // Determinar si la página actual usa un Navbar transparente/hero que NO necesita padding superior
  const transparentPaths = [
    "/circularmente",
    "/junta-directiva-equipo",
    "/juntaDirecteEquipo",
    "/valores",
    "/lineas-estrategicas",
    "/informes-anuales",
    "/encuestas",
    "/quienes-somos",
    "/quines-somos",
    "/alianzas",
    "/resoluciones",
    "/planes",
    "/politicas",
    "/polticas",
    "/proyectos",
    "/proyectos-activos",
    "/login",
    "/register",
    "/forgot-password",
    "/unirse",
  ];

  const isTransparentPath = transparentPaths.some((p) =>
    location.pathname === p || location.pathname.startsWith(p + "/")
  ) || location.pathname === "/"; // Home también es transparente

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 ${!isTransparentPath ? "page-top-padding" : ""}`}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <AxiosInterceptor />
      <Toaster position="top-center" reverseOrder={false} />

      <Suspense fallback={<DefaultLoader />}>
        <Routes>
          {/* Pages with Navbar and Footer */}
          {/* Rutas con Navbar y Footer (Públicas y Privadas generales) */}
          <Route element={<MainLayout />}>
            {/* Rutas públicas canónicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/circularmente" element={<Circularmente />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/alianzas" element={<Alianzas />} />

            <Route path="/valores" element={<Valores />} />
            <Route path="/junta-directiva-equipo" element={<JuantaDirectiva />} />
            <Route path="/informes-anuales" element={<InformesAnuales />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/politicas" element={<Politicas />} />
            <Route path="/resoluciones" element={<Resoluciones />} />
            <Route path="/proyectos" element={<ProyectosActivos />} />
            <Route path="/lineas-estrategicas" element={<LineasEstrategicasPage />} />
            <Route path="/encuestas" element={<PublicSurveysPage />} />
            <Route path="/unirse" element={<VisionCircularFormPage />} />

            {/* Rutas legales */}
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<Privacidad />} />

            {/* Rutas privadas generales */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />

            {/* Rutas para explorar contenido */}
            <Route path="/explorar" element={<ExplorePage />} />
            <Route path="/contenido/:slug" element={<ContentDetailPage />} />
            <Route path="/proyectos/:id" element={<ContentDetailProject />} />

            {/* Redirecciones de compatibilidad retroactiva dentro de MainLayout */}
            <Route path="/quines-somos" element={<Navigate to="/quienes-somos" replace />} />
            <Route path="/polticas" element={<Navigate to="/politicas" replace />} />
            <Route path="/juntaDirecteEquipo" element={<Navigate to="/junta-directiva-equipo" replace />} />
            <Route path="/proyectos-activos" element={<Navigate to="/proyectos" replace />} />
            <Route path="/profile" element={<Navigate to="/perfil" replace />} />
            <Route path="/terms" element={<Navigate to="/terminos" replace />} />
            <Route path="/privacy" element={<Navigate to="/privacidad" replace />} />
          </Route>

          {/* Dashboard Routes with shared MainLayout to prevent remounts */}
          <Route element={<MainLayout />}>
            <Route path="/documentos" element={<PrivateRoute permission="view.documents"><Documentos /></PrivateRoute>} />
            <Route path="/empresas" element={<PrivateRoute permission="view.circularmente"><Empresas /></PrivateRoute>} />
            <Route path="/formularios" element={<PrivateRoute permission="view.forms"><Formularios /></PrivateRoute>} />
            <Route path="/comunicaciones" element={<PrivateRoute permission="view.communications"><Comunicaciones /></PrivateRoute>} />
            <Route path="/administracion" element={<PrivateRoute permission="view.admin"><Administracion /></PrivateRoute>} />
            <Route path="/banners" element={<PrivateRoute permission="view.banners"><Banners /></PrivateRoute>} />
            <Route path="/soporte" element={<PrivateRoute permission="view.support"><Soporte /></PrivateRoute>} />
            <Route path="/integracion" element={<PrivateRoute adminOnly={true}><Integracion /></PrivateRoute>} />

            {/* Redirección de compatibilidad para empresas */}
            <Route path="/companies" element={<Navigate to="/empresas" replace />} />
          </Route>

          {/* Survey Detail WITHOUT MainLayout to prevent 404 flash */}
          <Route path="/encuestas/:id" element={<PublicSurveyDetail />} />

          {/* Catch-all 404 WITHOUT Layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}
