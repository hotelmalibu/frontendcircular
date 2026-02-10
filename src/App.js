import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import AxiosInterceptor from "./components/common/AxiosInterceptor";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import DefaultLoader from "./components/common/DefaultLoader";

// --- LAZY LOADED COMPONENTS ---

// Auth
const Login = lazy(() => import("./modules/auths/Login"));
const ForgotPassword = lazy(() => import("./modules/auths/ForgotPassword"));
const ResetPassword = lazy(() => import("./modules/auths/ResetPassword"));
const Register = lazy(() => import("./modules/auths/Register"));

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
const InclusionSocial = lazy(() => import("./modules/home/nuestrosTrabajos/proyectosAlianzas/inclusionSocial"));
const CasosExitos = lazy(() => import("./modules/home/nuestrosTrabajos/proyectosAlianzas/casosExitos"));
const Convocatorias = lazy(() => import("./modules/home/nuestrosTrabajos/proyectosAlianzas/convocatorias"));
const LineasEstrategicasPage = lazy(() => import("./modules/home/nuestrosTrabajos/lineasEstrategicas/index"));

// Dashboard (Protected)
const Dashboard = lazy(() => import("./modules/dashboard/Dashboard"));
const Documentos = lazy(() => import("./modules/dashboard/Documentos"));
const Empresas = lazy(() => import("./modules/dashboard/Empresas"));
const Trazabilidad = lazy(() => import("./modules/dashboard/Trazabilidad"));
const Formularios = lazy(() => import("./modules/dashboard/Formularios"));
const Comunicaciones = lazy(() => import("./modules/dashboard/Comunicaciones"));
const Administracion = lazy(() => import("./modules/dashboard/Administracion"));
const Soporte = lazy(() => import("./modules/dashboard/Soporte"));
const Integracion = lazy(() => import("./modules/dashboard/Integracion"));
const Profile = lazy(() => import("./modules/dashboard/Profile"));

// Explorar & Projects
const ExplorePage = lazy(() => import("./components/pagesExplorar/ExplorePage"));
const ContentDetailPage = lazy(() => import("./components/pagesExplorar/ContentDetailPage"));
const ContentDetailProject = lazy(() => import("./components/pagesProyectos/ContentDetailProject"));

const NotFound = lazy(() => import("./modules/home/NotFound"));

// Helper component for pages with shared layout
const MainLayout = () => (
  <>
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <AxiosInterceptor />
      <Toaster position="top-center" reverseOrder={false} />

      <Suspense fallback={<DefaultLoader />}>
        <Routes>
        {/* Pages with Navbar and Footer */}
        {/* Rutas con Navbar y Footer (Públicas y Privadas generales) */}
        <Route element={<MainLayout />}>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/circularmente" element={<Circularmente />} />
          <Route path="/quines-somos" element={<QuienesSomos />} />
          <Route path="/alianzas" element={<Alianzas />} />

          <Route path="/valores" element={<Valores />} />
          <Route path="/juntaDirecteEquipo" element={<JuantaDirectiva />} />
          <Route path="/informes-anuales" element={<InformesAnuales />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/polticas" element={<Politicas />} />
          <Route path="/resoluciones" element={<Resoluciones />} />
          <Route path="/proyectos-activos" element={<ProyectosActivos />} />
          <Route path="/inclusin-social" element={<InclusionSocial />} />
          <Route path="/casos-de-xito" element={<CasosExitos />} />
          <Route path="/convocatorias" element={<Convocatorias />} />
          <Route path="/lineas-estrategicas" element={<LineasEstrategicasPage />} />
          <Route path="/encuestas" element={<PublicSurveysPage />} />

          {/* Rutas privadas generales */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Rutas para explorar contenido */}
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/contenido/:slug" element={<ContentDetailPage />} />
          <Route path="/proyectos/:id" element={<ContentDetailProject />} />
        </Route>

        {/* Rutas de Administrador (Protección antes del Layout para permitir 404 limpio) */}
        <Route element={<PrivateRoute permission="view.documents"><MainLayout /></PrivateRoute>}>
          <Route path="/documentos" element={<Documentos />} />
        </Route>
        <Route element={<PrivateRoute permission="view.circularmente"><MainLayout /></PrivateRoute>}>
          <Route path="/companies" element={<Empresas />} />
        </Route>
        <Route element={<PrivateRoute adminOnly={true}><MainLayout /></PrivateRoute>}>
          <Route path="/trazabilidad" element={<Trazabilidad />} />
        </Route>
        <Route element={<PrivateRoute permission="view.forms"><MainLayout /></PrivateRoute>}>
          <Route path="/formularios" element={<Formularios />} />
        </Route>
        <Route element={<PrivateRoute permission="view.communications"><MainLayout /></PrivateRoute>}>
          <Route path="/comunicaciones" element={<Comunicaciones />} />
        </Route>
        <Route element={<PrivateRoute permission="view.admin"><MainLayout /></PrivateRoute>}>
          <Route path="/administracion" element={<Administracion />} />
        </Route>
        <Route element={<PrivateRoute permission="view.support"><MainLayout /></PrivateRoute>}>
          <Route path="/soporte" element={<Soporte />} />
        </Route>
        <Route element={<PrivateRoute adminOnly={true}><MainLayout /></PrivateRoute>}>
          <Route path="/integracion" element={<Integracion />} />
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
