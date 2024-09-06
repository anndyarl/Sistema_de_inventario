import React, { ReactNode, useState, useEffect } from "react";
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import Sidebar from "../../components/navigation/Sidebar";
import Navbar from "../../components/navigation/Navbar";
import Logout from "../../components/navigation/Logout";
import { List, X } from 'react-bootstrap-icons';

import '../../styles/Layout.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../styles/Layout.css'
import { useLocation } from "react-router-dom";
import { setNRecepcion } from '../../redux/actions/Inventario/Datos_inventariosActions';
import {InventarioProps} from '../../components/Inventario/Datos_inventario'


interface OwnProps {
  children: ReactNode;
  nRecepcion: string; // Recibir nRecepcion desde Redux
}

const Layout: React.FC<PropsFromRedux & OwnProps> = ({ children, isAuthenticated, nRecepcion }) => {
  const [data, setData] = useState<InventarioProps>({
    nRecepcion: '',
    fechaRecepcion: '',
    nOrdenCompra: '',
    horaRecepcion: '',
    nFactura: '',
    origenPresupuesto: '',
    montoRecepcion: '',
    fechaFactura: '',
    rutProveedor: '',
    nombreProveedor: '',
  });

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

  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname; // Obtén la ruta actual
  
  useEffect(() => {
    // Verifica si la ruta actual NO es '/formulario' para despachar la acción
    if (currentPath !== '/Inventario') {
      dispatch(setNRecepcion(data.nRecepcion));
      console.log(`Despachando nRecepcion: ${data.nRecepcion} al cambiar de ruta a ${currentPath}`);
    }
  }, [currentPath, dispatch, data.nRecepcion]);


  if (!isAuthenticated) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100 fixed">
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
              <div className="d-flex justify-content-between align-items-center">

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

                <button className="btn btn-link text-white d-md-none" onClick={toggleSidebar}>
                  <X size={24} />
                </button>
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
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  nRecepcion: state.datos_inventarioReducer.nRecepcion // Asegúrate de mapear el estado de nRecepcion
});

const mapDispatchToProps = {
  setNRecepcion
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Layout);