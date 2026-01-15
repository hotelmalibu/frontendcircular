import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./modules/home/Home";
import Login from "./modules/auths/Login";
import ForgotPassword from "./modules/auths/ForgotPassword";
import Register from "./modules/auths/Register";
import Dashboard from "./modules/dashboard/Dashboard";
import Documentos from "./modules/dashboard/Documentos";
import Empresas from "./modules/dashboard/Empresas";
import Trazabilidad from "./modules/dashboard/Trazabilidad";
import Formularios from "./modules/dashboard/Formularios";
import Comunicaciones from "./modules/dashboard/Comunicaciones";
import Administracion from "./modules/dashboard/Administracion";
import Integracion from "./modules/dashboard/Integracion";
import AxiosInterceptor from "./components/common/AxiosInterceptor";

import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import Circularmente from "./modules/micrositio/Circularmente";
import QuienesSomos from "./modules/home/nosotros/conocenos/quienesSomos";
import Valores from "./modules/home/nosotros/conocenos/valores";
import JuantaDirectiva from "./modules/home/nosotros/conocenos/juntaDirecteEquipo";
import InformesAnuales from "./modules/home/nosotros/conocenos/informesAnuales";
import Planes from "./modules/home/nosotros/marcoNormativo/planes";
import Politicas from "./modules/home/nosotros/marcoNormativo/politicas";
import Resoluciones from "./modules/home/nosotros/marcoNormativo/resoluciones";
import ProyectosActivos from "./modules/home/nuestrosTrabajos/proyectosAlianzas/proyectosActivos";
import InclusionSocial from "./modules/home/nuestrosTrabajos/proyectosAlianzas/inclusionSocial";
import CasosExitos from "./modules/home/nuestrosTrabajos/proyectosAlianzas/casosExitos";
import Convocatorias from "./modules/home/nuestrosTrabajos/proyectosAlianzas/convocatorias";
import LineasEstrategicasPage from "./modules/home/nuestrosTrabajos/lineasEstrategicas/index";
import PublicSurveysPage from "./modules/home/nosotros/conocenos/PublicSurveysPage";
import PublicSurveyDetail from "./modules/home/nosotros/conocenos/PublicSurveyDetail";
import Profile from "./modules/dashboard/Profile";

import ExplorePage from "./components/pagesExplorar/ExplorePage";
import ContentDetailPage from "./components/pagesExplorar/ContentDetailPage";
import ContentDetailProject from "./components/pagesProyectos/ContentDetailProject";
import NotFound from "./modules/home/NotFound";

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
      
      <Routes>
        {/* Pages with Navbar and Footer */}
        <Route element={<MainLayout />}>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/circularmente" element={<Circularmente />} />
          <Route path="/quines-somos" element={<QuienesSomos />} />
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

          {/* Rutas privadas */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/documentos" element={<PrivateRoute><Documentos /></PrivateRoute>} />
          <Route path="/companies" element={<PrivateRoute><Empresas /></PrivateRoute>} />
          <Route path="/trazabilidad" element={<PrivateRoute><Trazabilidad /></PrivateRoute>} />
          <Route path="/formularios" element={<PrivateRoute><Formularios /></PrivateRoute>} />
          <Route path="/comunicaciones" element={<PrivateRoute><Comunicaciones /></PrivateRoute>} />
          <Route path="/administracion" element={<PrivateRoute><Administracion /></PrivateRoute>} />
          <Route path="/integracion" element={<PrivateRoute><Integracion /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Rutas para explorar contenido */}
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/contenido/:slug" element={<ContentDetailPage />} />
          <Route path="/proyectos/:id" element={<ContentDetailProject />} />
        </Route>

        {/* Survey Detail WITHOUT MainLayout to prevent 404 flash */}
        <Route path="/encuestas/:id" element={<PublicSurveyDetail />} />

        {/* Catch-all 404 WITHOUT Layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
