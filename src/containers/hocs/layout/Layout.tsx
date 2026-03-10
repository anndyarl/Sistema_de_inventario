"use client"

import type React from "react"
import { type ReactNode, useState, useMemo } from "react"
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
    mensaje: 30 * 60 * 1000, // 1,800,000 ms (30 minutos)
    cerrar: 31 * 60 * 1000    // 1,860,000 ms (31 minutos)
  },
  40: {
    minutos: 40,
    mensaje: 40 * 60 * 1000, // 2,400,000 ms (40 minutos)
    cerrar: 41 * 60 * 1000    // 2,460,000 ms (41 minutos)
  },
  60: {
    minutos: 60,
    mensaje: 60 * 60 * 1000, // 3,600,000 ms (60 minutos)
    cerrar: 61 * 60 * 1000    // 3,660,000 ms (61 minutos)
  }
} as const;

// Helper para obtener tiempos de sesión
export const getTiemposSesion = (minutos: number) => {
  return TIEMPOS_SESION[minutos as keyof typeof TIEMPOS_SESION] || TIEMPOS_SESION[30];
};

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean | null;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  tiempoSesion: number; // Viene de Redux con el valor persistido
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

  const toggleSidebarCollapse = () => {
    dispatch(setSidebarCollapsedActions());
  };

  // Obtener tiempos en milisegundos basados en la configuración persistida de Redux
  const { mensaje, cerrar } = useMemo(() => {
    return getTiemposSesion(tiempoSesion);
  }, [tiempoSesion]);

  // Hook de auto logout con los tiempos calculados
  useAutoLogout(mensaje, cerrar);

  // Redireccionar si no está autenticado
  if (isAuthenticated === false) {
    return <Navigate to="/" />;
  }

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  const sidebarTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.01,
  };

  return (
    <div className={`d-flex min-vh-100 ${isDarkMode ? "darkModePrincipal" : ""}`}>
      {/* Sidebar siempre visible en pantallas grandes */}
      <div className={`d-none d-md-block min-vh-100 z-1050 ${isDarkMode ? "bg-color-dark" : "bg-color"} sidebar-left`}>
        <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
      </div>

      {/* Sidebar con animación en móviles */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            transition={sidebarTransition}
            className={`d-md-none min-vh-100 ${isDarkMode ? "bg-color-dark" : "bg-color"}`}
          >
            <Sidebar isCollapsed={false} onToggleCollapse={() => { }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor principal */}
      <div id="page-content-wrapper" className="d-flex flex-column w-100">
        {/* Navbar (móvil) */}
        <div className={`d-flex justify-content-around align-content-center shadow-sm ${isDarkMode ? "bg-color-dark" : "bg-light"} d-md-none`}>
          <button className="p-3 navbar-toggler" aria-label="button-mobile" type="button" onClick={toggleSidebar}>
            {sidebarOpen ?
              <X size={35} className={`${isDarkMode ? "text-white" : ""}`} /> :
              <List size={35} className={`${isDarkMode ? "text-white" : ""}`} />
            }
          </button>
          <Navbar />
          <Profile activo={activo} />
        </div>

        {/* Navbar (escritorio) */}
        <div className={`d-none d-md-flex justify-content-end align-content-center ${isDarkMode ? "bg-color-dark" : "bg-light"}`}>
          <Navbar />
          <Profile activo={activo} />
        </div>

        {/* Contenido principal */}
        <div className="flex-grow-1">
          <Container fluid>
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
  tiempoSesion: state.preferenciasReducers?.tiempoSesion || 30, // Valor persistido de Redux
});

export default connect(mapStateToProps, {
  listaVersionamientoActions,
})(Layout);