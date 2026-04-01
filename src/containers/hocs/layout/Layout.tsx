"use client"

import type React from "react"
import { type ReactNode, useState, useMemo, useEffect } from "react"
import { connect, useDispatch } from "react-redux"
import type { RootState } from "../../../redux/reducers"
import Sidebar from "../../../components/Navegacion/Sidebar"
import Navbar from "../../../components/Navegacion/Navbar"
import { List, X } from "react-bootstrap-icons"
import { Navigate } from "react-router-dom"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "../../../styles/bootstrap-5.3.3/dist/css/bootstrap.css"
import "../../../styles/Layout.css"
import useAutoLogout from "../../../hooks/useAutoLogout"
import "../../../styles/bootstrap-5.3.3/dist/css/bootstrap.min.css"
import "../../../styles/bootstrap-5.3.3/dist/js/bootstrap.bundle.min.js"
import { Container } from "react-bootstrap"
import { AnimatePresence, motion } from "framer-motion"
import Footer from "../../../components/Navegacion/Footer.js"
import { listaVersionamientoActions } from "../../../redux/actions/Configuracion/listaVersionamientoActions.js"
import { setSidebarCollapsedActions } from "../../../redux/actions/Otros/setSidebarCollapsedActions.js"
import "react-toastify/dist/ReactToastify.css";
import MobileBar from "../../../components/Navegacion/MobileBar.js"
import Profile from "../../../components/Navegacion/Profile.js"

// Constantes para tiempos de sesión (en milisegundos)
export const TIEMPOS_SESION = {
  30: {
    minutos: 30,
    mensaje: 30 * 60 * 1000,
    cerrar: 31 * 60 * 1000
  },
  40: {
    minutos: 40,
    mensaje: 40 * 60 * 1000,
    cerrar: 41 * 60 * 1000
  },
  60: {
    minutos: 60,
    mensaje: 60 * 60 * 1000,
    cerrar: 61 * 60 * 1000
  }
} as const;

export const getTiemposSesion = (minutos: number) => {
  return TIEMPOS_SESION[minutos as keyof typeof TIEMPOS_SESION] || TIEMPOS_SESION[30];
};

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean | null;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  tiempoSesion: number;
  activo?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isDarkMode,
  isAuthenticated,
  isSidebarCollapsed,
  tiempoSesion,
  activo
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Cerrar sidebar al cambiar de ruta (opcional)
  useEffect(() => {
    const handleRouteChange = () => {
      setSidebarOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const toggleSidebarCollapse = () => {
    dispatch(setSidebarCollapsedActions());
  };

  const { mensaje, cerrar } = useMemo(() => {
    return getTiemposSesion(tiempoSesion);
  }, [tiempoSesion]);

  useAutoLogout(mensaje, cerrar);

  if (isAuthenticated === false) {
    return <Navigate to="/" />;
  }

  // Animaciones mejoradas para el sidebar móvil
  const sidebarVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.2
      }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.25,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "tween",
        ease: "easeIn",
        duration: 0.2
      }
    }
  };

  // Overlay para cerrar al hacer clic fuera
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className={`d-flex min-vh-100 ${isDarkMode ? "darkModePrincipal" : ""}`}>
      {/* Sidebar siempre visible en pantallas grandes */}
      <div className={`d-none d-md-block min-vh-100 z-1050 ${isDarkMode ? "bg-color-dark" : "bg-color"} sidebar-left`}>
        <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
      </div>

      {/* Sidebar móvil con overlay y animación */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <>
            {/* Overlay oscuro detrás del sidebar */}
            <motion.div
              className="sidebar-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              onClick={toggleSidebar}
            />

            {/* Sidebar móvil con animación deslizante */}
            <motion.div
              className={`position-fixed top-0 start-0 h-100 z-1050 ${isDarkMode ? "bg-color-dark" : "bg-color"}`}
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Sidebar isCollapsed={false} onToggleCollapse={() => { }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contenedor principal */}
      <div id="page-content-wrapper" className="d-flex flex-column w-100">
        {/* Navbar (móvil) */}
        <div className={`d-flex justify-content-between align-items-center shadow-sm p-2  ${isDarkMode ? "bg-color-dark" : "bg-light"} d-md-none`}>
          <button
            className="navbar-toggler border-0 bg-transparent p-2 position-custom-buttonSidebar"
            aria-label="button-mobile"
            type="button"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <X size={31} className="text-white" />
            ) : (
              <List size={28} className={isDarkMode ? "text-white" : "text-dark"} />
            )}
          </button>

          <Navbar />

          <Profile activo={activo} />
        </div>

        {/* Navbar (escritorio) */}
        <div className={`d-none d-md-flex justify-content-end align-items-center p-2 ${isDarkMode ? "bg-color-dark" : "bg-light"}`}>
          <Navbar />
          <Profile activo={activo} />
        </div>

        {/* Contenido principal */}
        <div className="flex-grow-1">
          <Container fluid className="p-1">
            {children}
          </Container>
        </div>

        {/* Footer */}
        <div className={`d-none d-md-block ${isDarkMode ? "bg-color-dark" : "bg-light"}`}>
          <Footer activo={activo} />
        </div>

        {/* MobileBar */}
        <MobileBar />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.validaApiLoginReducers.isAuthenticated,
  isDarkMode: state.darkModeReducer.isDarkMode,
  isSidebarCollapsed: state.setSidebarCollapsedReducer.isSidebarCollapsed,
  tiempoSesion: state.preferenciasReducers?.tiempoSesion || 30,
});

export default connect(mapStateToProps, {
  listaVersionamientoActions,
})(Layout);