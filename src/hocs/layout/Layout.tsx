import React, { ReactNode, useState, useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers";
import Sidebar from "../../components/navigation/Sidebar";
import Navbar from "../../components/navigation/Navbar";
import { List } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate, useLocation } from "react-router-dom";

import "../../styles/Layout.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../styles/bootstrap-5.3.3/dist/css/bootstrap.css";
import "../../styles/Layout.css";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean | null;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const location = useLocation();

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
  }, [isDesktop]);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.1,
    // delay: 0.02,
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Mobile Navbar */}
      <nav className="navbar navbar-expand-md navbar-light bg-light d-md-none">
        <div className="container-fluid">
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={toggleSidebar}
          >
            <List size={24} />
          </button>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className={`bg-color ${
            sidebarOpen ? "d-block" : "d-none"
          } d-md-block`}
          style={{
            width: "250px",
            minWidth: "250px",
            maxWidth: "250px",
            transition: "all 0.3s",
            position: isDesktop ? "relative" : "fixed",
            top: 0,
            bottom: 0,
            left: isDesktop ? "0" : sidebarOpen ? "0" : "-250px",
            zIndex: 1000,
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
          <div className="d-none d-md-block ">
            <Navbar />
          </div>

          {/* Main Content with Talana-like Transition */}
          <div className="flex-grow-1 p-3 overflow-auto">
            <div className="container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.loginReducer.isAuthenticated,
});

export default connect(mapStateToProps, {})(Layout);
