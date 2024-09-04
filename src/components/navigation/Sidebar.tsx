import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { House, Box, ArrowsMove, PlusCircle, DashCircle, Heart, FileText, Gear, List, X} from 'react-bootstrap-icons';
import { Button, Modal } from 'react-bootstrap';

import { logout } from '../../redux/actions/auth/auth'; // Importa la acción de logout
import { connect } from 'react-redux';
import { RootState } from '../../redux/reducers';


// Function to combine classes conditionally
const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  
}

interface SidebarProps {
  logout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({logout}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation: NavItem[] = [
    { name: 'Home', href: '/Home', icon: House },
    { name: 'Inventario', href: '/Inventario', icon: Box },
    { name: 'Traslados', href: '/Traslados', icon: ArrowsMove },
    { name: 'Altas', href: '/Altas', icon: PlusCircle },
    { name: 'Bajas', href: '/Bajas', icon: DashCircle },
    { name: 'Donaciones', href: '/Donaciones', icon: Heart },
    { name: 'Informes', href: '/Informes', icon: FileText },
    { name: 'Configuración', href: '/Configuracion', icon: Gear }
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModal(false);  
  }
  const handleLogout = () => {
    logout(); // Llama a la acción de logout
  };
  const handleShowModal = () => {
    setShowModal(true); // Cambia el estado para mostrar el modal
  };



  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="d-md-none btn btn-primary position-fixed top-0 start-0 mt-2 ms-2 z-3"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <List size={24} />
      </button>

      {/* Sidebar */}
      <div className={classNames(
        "sidebar bg-color text-white",
        "position-fixed top-0 start-0 bottom-0",
        "d-flex flex-column",
        "p-3",
        "transition-all duration-300",
        isOpen ? "translate-x-0" : "-translate-x-100",
        "d-md-flex"
      )} style={{width: '250px', zIndex: 1030}}>

        {/* <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="m-0">Menu</h5>
          <button 
            className="d-md-none btn btn-outline-light"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div> */}

        <nav className="flex-grow-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => classNames(
                isActive ? 'bg-light text-dark' : 'text-white',
                'd-flex align-items-center py-2 px-3 mb-2 rounded text-decoration-none'
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon
                className={classNames(
                  'me-3 flex-shrink-0',
                  'h-5 w-5'
                )}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>

         {/* Modal  Cerrar sesión*/}    
         <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" className="bi bi-exclamation-circle mr-1 mb-1" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
          </svg>
           </Modal.Title>
          </Modal.Header>
          <Modal.Body>
           
                <p className="form-heading fs-09em">
                   Si desea salir haz clic en Cerrar Sesion o en Cancel para continuar en la pagina
                </p>              
                <form  onSubmit={handleSubmit}>   
                   <div className="form-group d-flex justify-content-center">                                  
                   <div className="form-group d-flex justify-content-center">                                  
                      <Button onClick={handleLogout}  type="submit" className="btn btn-danger text-center me-2">Cerrar Sesión</Button>
                      <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">Cancelar</Button>      
                    </div>  
                    </div>
                </form>              
      
          </Modal.Body>
        </Modal>
    
        <div className="mt-auto">
          <Button onClick={handleShowModal} className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center" >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
          <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
        </svg>
        <div className='m-2'> Cerrar Sesión</div>           
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none"
          onClick={toggleSidebar}
          style={{zIndex: 1020}}
        ></div>
      )}
    </>
  );
}

//mapea los valores del estado global de Redux 
const mapStateToProps = (state: RootState) => ({
  logout: state.logout

});

export default connect(mapStateToProps,
   {
    logout  
    })(Sidebar);
