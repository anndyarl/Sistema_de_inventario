"use client"

import type React from "react"
import { type ReactNode, useState } from "react"
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
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MobileBar from "../../../components/Navegacion/MobileBar.js"
import Profile from "../../../components/Navegacion/Profile.js"

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean | null;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, isAuthenticated, isSidebarCollapsed }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
    dispatch(setSidebarCollapsedActions());
  }

  useAutoLogout(3.3e6, 3.6e6);
  // useAutoLogout(5000, 10000);

  if (isAuthenticated == false) {
    return <Navigate to="/" />
  }

  // useEffect(() => {
  //   if (!isAuthenticated) return;

  //   const socket = new WebSocket("ws://localhost:5076/ws/notificaciones");

  //   socket.onopen = () => {
  //     console.log("WebSocket conectado desde Layout");
  //     socket.send("Alta"); // Solo si quieres
  //   };

  //   socket.onmessage = (event) => {
  //     console.log("WebSocket mensaje recibido:", event.data);

  //     if (event.data.includes("alta_creada")) {
  //       toast(
  //         <div>
  //           <p>Se ha creado una nueva alta</p>
  //           <button
  //             onClick={() => {                // Acción que quieras ejecutar
  //               console.log("Botón clickeado");
  //               toast.dismiss(); // Cierra el toast
  //               navigate("/Altas/FirmarAltas");
  //             }}
  //             style={{
  //               marginTop: "5px",
  //               background: "#007bff",
  //               color: "white",
  //               border: "none",
  //               padding: "5px 10px",
  //               borderRadius: "4px",
  //               cursor: "pointer"
  //             }}
  //           >
  //             Ver detalles
  //           </button>
  //         </div>,
  //         {
  //           autoClose: false, // No se cierra automáticamente
  //           position: "bottom-right"
  //         }
  //       );
  //     }

  //   };

  //   socket.onclose = () => {
  //     console.log("🔌 WebSocket cerrado");
  //   };

  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, [isAuthenticated]);


  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  }

  const sidebarTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.01,
  }

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
            <Sidebar
              isCollapsed={false}
              onToggleCollapse={() => { }} // En móvil no se usa
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor principal */}
      <div id="page-content-wrapper" className="d-flex flex-column">
        {/* Navbar (móvil) */}
        <div className={`d-flex justify-content-around align-content-center shadow-sm sticky-top z-1050  ${isDarkMode ? "bg-color-dark" : "bg-light"} d-md-none`}>
          <button className="p-3 navbar-toggler" aria-label="button-mobile" type="button" onClick={toggleSidebar}>
            <AnimatePresence mode="wait">
              {sidebarOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ scale: 0.8, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0.1, rotate: 90 }}
                  transition={{ duration: 0.1 }}
                >
                  <X size={40} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu-icon"
                  initial={{ scale: 0.8, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0.1, rotate: -90 }}
                  transition={{ duration: 0.1 }}
                >
                  <List size={35} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <Navbar />
          <Profile />
        </div>

        {/* Navbar (escritorio) */}
        <div className={`d-none d-md-flex justify-content-end align-content-center sticky-top z-1050  ${isDarkMode ? "bg-color-dark" : "bg-light"}`}>
          <Navbar />
          <Profile />
        </div>

        {/* Contenido (ocupa el espacio entre Navbar y Footer) */}
        <div className="flex-grow-1">
          <Container fluid>
            {children}
          </Container>
        </div>

        {/* Footer siempre al final */}
        <div className="d-none d-md-block sticky-bottom z-1 d-none w-100">
          <Footer />
        </div>
        {/* MobileBar solo visible en móviles */}
        <MobileBar />
      </div>
      {/* <ToastContainer position="bottom-right" autoClose={60000} /> */}
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.validaApiLoginReducers.isAuthenticated,
  isDarkMode: state.darkModeReducer.isDarkMode,
  isSidebarCollapsed: state.setSidebarCollapsedReducer.isSidebarCollapsed,
  token: state.loginReducer.token,
})

export default connect(mapStateToProps, {
  listaVersionamientoActions,
})(Layout)
