import React, { ReactNode, useState, useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../redux/reducers";
import Sidebar from "../../../components/Navegacion/Sidebar";
import Navbar from "../../../components/Navegacion/Navbar";
import { List } from "react-bootstrap-icons";
import { motion, AnimatePresence, easeIn } from "framer-motion";
import { Navigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../styles/bootstrap-5.3.3/dist/css/bootstrap.css"
import "../../../styles/Layout.css"
import useAutoLogout from "../../../hooks/useAutoLogout";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean | null;
  token: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated, token }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  //Se pasan parametros del tiempo en milisegundos en que se mostrará mensaje y cierre de sesion por inactividad
  useAutoLogout(300000, 600000);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
    token
  }, [isDesktop, token]);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const pageVariants = {
    // initial: { opacity: 0, scale: 0.98 },
    // in: { opacity: 1, scale: 1 },
    initial: { opacity: 0, x: -100, }, // Comienza con transparencia y desplazamiento desde la izquierda
    in: { opacity: 1, x: 0, }, // Llega a opacidad completa y posición natural
  };

  const pageTransition = {
    type: "tween",
    easeIn: "anticipate",
    duration: 0.2,
    // delay: 0.03,
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Mobile Navbar */}
      <nav className="navbar navbar-expand-md navbar-light bg-light d-md-none border-bottom">
        <div className="container-fluid">
          <button className="navbar-toggler border-bottom" aria-label="button-mobile" type="button" onClick={toggleSidebar}>
            <List size={24} />
          </button>
          <Navbar />
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Background de Sidebar */}
        <div
          className={`bg-color sidebar-left ${sidebarOpen ? "d-block" : "d-none"} d-md-block`}
          style={{
            position: isDesktop ? "relative" : "fixed",
            left: isDesktop ? "0" : sidebarOpen ? "0" : "-250px",
          }}
        >
          <Sidebar />
        </div>

        <div
          className="flex-grow-1 d-flex flex-column"
          style={{
            marginLeft: isDesktop ? "0" : sidebarOpen ? "250px" : "0",
            transition: "margin-left 0.3s",
          }}
        >
          {/* Desktop Navbar */}
          <div className="d-none d-md-block navbar-header">
            <Navbar />
          </div>

          {/* Main Content with Talana-like Transition */}
          <div className="flex-grow-1 p-3 overflow-auto">
            {/* <AnimatePresence mode="wait">
                <motion.div key={location.pathname} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}> */}
            {children}
            {/* </motion.div>
              </AnimatePresence> */}
          </div>
        </div>
      </div>

    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.loginReducer.isAuthenticated,
  token: state.loginReducer.token
});

export default connect(mapStateToProps, {

})(Layout);
