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
import Footer from "../../../components/Navegacion/Footer.js";
import { listaVersionamientoActions } from "../../../redux/actions/Configuracion/listaVersionamientoActions.js";
interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean | null;
  isDarkMode: boolean;
  token: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, isAuthenticated, token }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // useAutoLogout(3.3e+6, 3.6e+6);
  useAutoLogout(600000, 660000);

  console.log("token", token);
  console.log("isAuthenticated", isAuthenticated);

  if (isAuthenticated == false) {
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

  // useEffect(() => {
  //   const [navEntry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];

  //   if (navEntry?.type === "reload") {

  //     console.log("La página fue refrescada");
  //   }
  // }, []);

  return (
    <div className={`d-flex min-vh-100 ${isDarkMode ? "darkModePrincipal" : ""}`}>

      {/* Sidebar siempre visible en pantallas grandes */}
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

      {/* Contenedor principal */}
      <div id="page-content-wrapper" className="d-flex flex-column justify-content-between w-100">

        {/* Navbar (móvil) */}
        <div className={`d-flex justify-content-between shadow-sm ${isDarkMode ? "bg-color-dark" : "bg-light"} d-md-none`}>
          <button className="navbar-toggler m-4" aria-label="button-mobile" type="button" onClick={toggleSidebar}>
            <List size={30} />
          </button>
          <Navbar />
        </div>

        {/* Navbar (escritorio) */}
        <div className="d-none d-md-block mx-1 rounded-3">
          <Navbar />
        </div>

        {/* Contenido (ocupa el espacio entre Navbar y Footer) */}
        <div className="flex-grow-1">
          <Container fluid className="my-3">
            {children}
          </Container>
        </div>

        {/* Footer siempre al final */}
        <Footer />
      </div>
    </div>
  );

};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.validaApiLoginReducers.isAuthenticated,
  isDarkMode: state.darkModeReducer.isDarkMode,
  token: state.loginReducer.token
});

export default connect(mapStateToProps, {
  listaVersionamientoActions
})(Layout);
