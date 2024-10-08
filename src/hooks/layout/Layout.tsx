import React, { ReactNode, useState, useEffect } from "react";
import { connect } from 'react-redux';
import { RootState } from '../../redux/reducers';
import Sidebar from "../../components/navigation/Sidebar";
import Navbar from "../../components/navigation/Navbar";
import Logout from "../../components/navigation/Logout";
import { List, X } from 'react-bootstrap-icons';

import '../../styles/Layout.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../styles/bootstrap-5.3.3/dist/css/bootstrap.css';
import '../../styles/Layout.css'

import { Navigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean | null;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated }) => {


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isDesktop]);


  if (!isAuthenticated) {
    return <Navigate to='/' />;

  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Mobile Navbar */}
      <nav className="navbar navbar-expand-md navbar-light bg-light d-md-none">
        <div className="container-fluid">
          <button className="navbar-toggler border-0" type="button" onClick={toggleSidebar}>
            <List size={24} />
          </button>
          <a className="navbar-brand" href="#">SSMSO</a>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className={`bg-color ${sidebarOpen ? 'd-block' : 'd-none'} d-md-block`}
          style={{
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            transition: 'all 0.3s',
            position: isDesktop ? 'relative' : 'fixed',
            top: 0,
            bottom: 0,
            left: isDesktop ? '0' : (sidebarOpen ? '0' : '-250px'),
            zIndex: 1000
          }}
        >
          <div className="d-flex flex-column h-100">
            <div className="p-3">
              <div className="d-flex justify-content-center align-items-center ml-4">
                {/*Logout */}
                <div className="dropdown">
                  <a
                    className="btn btn-border-none text-white outline-none dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user"></i>
                    <span className="fs-6">Andy Riquelme</span>
                  </a>
                  <div className="dropdown-menu" aria-labelledby="userDropdown">
                    <Logout />
                  </div>
                </div>

                {/* <button className="btn btn-link text-white d-md-none" onClick={toggleSidebar}>
                  <X size={24} />
                </button> */}
              </div>
            </div>
            <div className="flex-grow-1 overflow-auto">
              <Sidebar />
            </div>
          </div>

        </div>

        <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: isDesktop ? '0' : (sidebarOpen ? '250px' : '0'), transition: 'margin-left 0.3s' }}>
          {/* Desktop Navbar */}
          <div className="d-none d-md-block ">
            <Navbar />
          </div>

          {/* Main Content */}
          <div className="flex-grow-1 p-3 overflow-auto">
            <div className="container">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {

})(Layout);