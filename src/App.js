import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./modules/home/Home";
import Login from "./modules/auths/Login";
import Register from "./modules/auths/Register";
import Dashboard from "./modules/dashboard/Dashboard";
import Documentos from "./modules/dashboard/Documentos";
import Trazabilidad from "./modules/dashboard/Trazabilidad";
import Formularios from "./modules/dashboard/Formularios";
import Comunicaciones from "./modules/dashboard/Comunicaciones";
import Administracion from "./modules/dashboard/Administracion";
import Integracion from "./modules/dashboard/Integracion";
import Portal from "./modules/dashboard/Portal";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import Circularmente from "./modules/micrositio/Circularmente";
import QuienesSomos from "./modules/home/nosotros/conocenos/quienesSomos";
import PortalTransparencia from "./modules/home/nosotros/conocenos/portalTransparencia";
import Estatutos from "./modules/home/nosotros/conocenos/estatutos";
import Valores from "./modules/home/nosotros/conocenos/valores";
import Presidencia from "./modules/home/nosotros/conocenos/presidencia";
import Aliados from "./modules/home/nosotros/conocenos/aliados";
import InformesAnuales from "./modules/home/nosotros/conocenos/informesAnuales";
import Planes from "./modules/home/nosotros/marcoNormativo/planes";
import Politicas from "./modules/home/nosotros/marcoNormativo/politicas";
import Resoluciones from "./modules/home/nosotros/marcoNormativo/resoluciones";
import ProyectosActivos from "./modules/home/nuestrosTrabajos/proyectosAlianzas/proyectosActivos";
import Sectoriales from "./modules/home/nuestrosTrabajos/proyectosAlianzas/sectoriales";
import Territoriales from "./modules/home/nuestrosTrabajos/proyectosAlianzas/territoriales";
import InclusionSocial from "./modules/home/nuestrosTrabajos/proyectosAlianzas/inclusionSocial";
import CasosExitos from "./modules/home/nuestrosTrabajos/proyectosAlianzas/casosExitos";
import Convocatorias from "./modules/home/nuestrosTrabajos/proyectosAlianzas/convocatorias";
import CadenaValor from "./modules/home/nuestrosTrabajos/lineasEstrategicas/cadenaValor";
import ConsumoResponsable from "./modules/home/nuestrosTrabajos/lineasEstrategicas/consumoResponsable"; // <-- IMPORTACIÓN AÑADIDA
import InclusionSocialProductiva from "./modules/home/nuestrosTrabajos/lineasEstrategicas/inclusionSocialProductiva";
import Innovacion from "./modules/home/nuestrosTrabajos/lineasEstrategicas/innovacion";
import ProyectoEstrategico from "./modules/home/nuestrosTrabajos/lineasEstrategicas/proyectoEstrategico";
import Certificaciones from "./modules/home/nuestrosTrabajos/E-Learning/certificaciones"; 
import Cursos from "./modules/home/nuestrosTrabajos/E-Learning/cursos";
import FinanciamientoReciclaje from "./modules/home/nuestrosTrabajos/E-Learning/financiamentoReciclaje";
import Profile from "./modules/dashboard/Profile";


export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/circularmente" element={<Circularmente />} />
          <Route path="/quines-somos" element={<QuienesSomos />} />
          <Route path="/portal-de-transparencia" element={<PortalTransparencia />} />
          <Route path="/estatutos" element={<Estatutos />} />
          <Route path="/valores" element={<Valores />} />
          <Route path="/presidencia" element={<Presidencia />} />
          <Route path="/aliados" element={<Aliados />} />
          <Route path="/informes-anuales" element={<InformesAnuales />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/polticas" element={<Politicas />} />
          <Route path="/resoluciones" element={<Resoluciones />} />
          <Route path="/proyectos-activos" element={<ProyectosActivos />} />
          <Route path="/sectoriales" element={<Sectoriales />} />
          <Route path="/territoriales" element={<Territoriales />} />
          <Route path="/inclusin-social" element={<InclusionSocial />} />
          <Route path="/casos-de-xito" element={<CasosExitos />} />
          <Route path="/convocatorias" element={<Convocatorias />} />
          <Route path="/cadenas-de-valor" element={<CadenaValor />} />
          
          {/* RUTA AÑADIDA */}
          <Route path="/consumo-responsable" element={<ConsumoResponsable />} /> 

          <Route path="/inclusin-social-y-productiva" element={<InclusionSocialProductiva />} />
          <Route path="/innovacin" element={<Innovacion />} />
          <Route path="/proyectos-estratgico" element={<ProyectoEstrategico />} />
          <Route path="/certificaciones" element={<Certificaciones />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/financiamiento-del-reciclaje" element={<FinanciamientoReciclaje />} />


          {/* Rutas privadas: cada página del dashboard tiene su propia ruta directa */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/documentos" element={<PrivateRoute><Documentos /></PrivateRoute>} />
          <Route path="/trazabilidad" element={<PrivateRoute><Trazabilidad /></PrivateRoute>} />
          <Route path="/formularios" element={<PrivateRoute><Formularios /></PrivateRoute>} />
          <Route path="/comunicaciones" element={<PrivateRoute><Comunicaciones /></PrivateRoute>} />
          <Route path="/administracion" element={<PrivateRoute><Administracion /></PrivateRoute>} />
          <Route path="/integracion" element={<PrivateRoute><Integracion /></PrivateRoute>} />
          <Route path="/portal" element={<PrivateRoute><Portal /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}