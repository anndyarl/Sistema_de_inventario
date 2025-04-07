import React, { ReactNode, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../redux/reducers";
import Sidebar from "../../../components/Navegacion/Sidebar";
import Navbar from "../../../components/Navegacion/Navbar";
import { List } from "react-bootstrap-icons";
import { Navigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../styles/bootstrap-5.3.3/dist/css/bootstrap.css";
import "../../../styles/Layout.css";
import useAutoLogout from "../../../hooks/useAutoLogout";
import "../../../styles/bootstrap-5.3.3/dist/css/bootstrap.min.css";
import "../../../styles/bootstrap-5.3.3/dist/js/bootstrap.bundle.min.js";
import { Container } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";


interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean | null;
  isDarkMode: boolean;
  token: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, isAuthenticated }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useAutoLogout(3.3e+6, 3.6e+6);

  if (isAuthenticated == false) {
    // Swal.fire({
    //   icon: "info",
    //   title: "Su sesión ha finalizado",
    //   text: `Por favor, vuelva a ingresar`,
    //   background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //   color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //   confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
    //   customClass: {
    //     popup: "custom-border", // Clase personalizada para el borde
    //   }
    // });
    return <Navigate to="/" />;
  }


  // Efectos de transición para la apertura del sidebar en móviles
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
      {/* Sidebar SIEMPRE visible en pantallas grandes */}
      <div className={`d-none d-md-block min-vh-100 ${isDarkMode ? "bg-color-dark" : "bg-color"} sidebar-left`}>
        <Sidebar />
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
            className={`d-md-none min-vh-100 ${isDarkMode ? "bg-color-dark" : "bg-color"} sidebar-left`}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <div id="page-content-wrapper" className="w-100">
        {/* Navbar para móviles */}
        <div className={`d-flex justify-content-between shadow-sm ${isDarkMode ? "bg-color-dark" : "bg-light"} d-md-none`}>
          <button className="navbar-toggler m-4" aria-label="button-mobile" type="button" onClick={toggleSidebar}>
            <List size={30} />
          </button>
          <Navbar />
        </div>

        {/* Navbar para escritorio */}
        <div className="d-none d-md-block mx-1 rounded-3">
          <Navbar />
        </div>

        {/* Contenido de la página */}
        <Container fluid className="mb-1 ">
          {children}
        </Container>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.validaApiLoginReducers.isAuthenticated,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
});

export default connect(mapStateToProps, {})(Layout);
