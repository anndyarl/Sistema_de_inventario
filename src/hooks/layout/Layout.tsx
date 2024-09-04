import React, { ReactNode } from "react";
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/reducers';
import Sidebar from "../../components/navigation/Sidebar";
import Navbar from "../../components/navigation/Navbar";

import '../../styles/Layout.css';

interface OwnProps {
  children: ReactNode;
}

const Layout: React.FC<PropsFromRedux & OwnProps> = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-md-8 border p-4 rounded shadow-sm bg-white">
          <h1 className="form-heading">Sesión expirada</h1>
          <p className="form-heading fs-09em">
            No está autenticado. Por favor, inicie sesión nuevamente.
          </p>
          <div className="p-4 rounded shadow-sm bg-white d-flex justify-content-center">
            <a href="/Login" className="btn btn-primary">
              Clave Única
            </a>
          </div>
          <p className="botto-text">Diseñado por Departamento de Informática - Unidad de Desarrollo 2024</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="sidebar-container d-none d-md-flex flex-column border-right bg-color text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="flex-1 overflow-auto pt-3 pb-3">
          <nav className="mt-5">
            <Sidebar />
          </nav>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="main-content d-flex flex-column flex-grow-1">
        <Navbar />
        <main className="flex-grow-1 p-3 overflow-auto ">
          {children}
        </main>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = {
  // Add your actions here if needed
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Layout);