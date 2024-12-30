import React, { ReactNode, useState, useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../redux/reducers";
import Sidebar from "../../../components/Navegacion/Sidebar";
import Navbar from "../../../components/Navegacion/Navbar";
import { List } from "react-bootstrap-icons";
import { Navigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../styles/bootstrap-5.3.3/dist/css/bootstrap.css"
import "../../../styles/Layout.css"
import useAutoLogout from "../../../hooks/useAutoLogout";
import "../../../styles/bootstrap-5.3.3/dist/css/bootstrap.min.css"
import "../../../styles/bootstrap-5.3.3/dist/js/bootstrap.bundle.min.js"
import { Container } from "react-bootstrap";
import ssmso_negro from "../../../assets/img/ssmso_negro.png"

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean | null;
  isDarkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated, isDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //Se pasan parametros del tiempo en milisegundos en que se mostrará mensaje y cierre de sesion por inactividad
  useAutoLogout(300000, 600000);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsDesktop(window.innerWidth >= 768);
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <div className={`d-flex min-vh-100 ${isDarkMode ? "darkModePrincipal" : ""}`}>
        {/* Background de Sidebar */}
        <div className={`min-vh-100 ${isDarkMode ? "bg-color-dark" : "bg-color"} sidebar-left ${sidebarOpen ? "d-block" : "d-none"} d-md-block`}>
          <Sidebar />
        </div>

        <div id="page-content-wrapper" className="w-100">
          {/* Mobile Navbar */}
          <div className={`d-flex justify-content-between shadow-sm ${isDarkMode ? "bg-color-dark" : "bg-light"} d-md-none`}>
            <button className="navbar-toggler m-4 " aria-label="button-mobile" type="button" onClick={toggleSidebar}>
              <List size={30}></List>
            </button>
            <Navbar />
          </div>

          <div className="d-none d-md-block mx-2 mt-1 mb-1 rounded-3">
            <Navbar />
          </div>

          {/* Contenido de la paginas */}
          <Container fluid className="mb-1">
            {children}
          </Container>
        </div>

      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.loginReducer.isAuthenticated,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {

})(Layout);
