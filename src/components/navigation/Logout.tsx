import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { logout } from '../../redux/actions/auth/auth'; // Importa la acción de logout
import { connect } from 'react-redux';
import { RootState } from '../../redux/reducers';


interface LogoutProps {
  logout: () => void;
}

const Logout: React.FC<LogoutProps> = ({logout}) => {  
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
         {/* Modal  Cerrar sesión*/}    
         <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="d-flex align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-exclamation-circle me-2"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
          </svg>      
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p className="fs-5 mb-4">
          Si deseas salir, haz clic en <strong>"Cerrar Sesión"</strong> o selecciona <strong>"Cancelar"</strong> para continuar en la página.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center gap-3">
            <Button
              onClick={handleLogout}
              type="button"
              className="btn btn-danger"
            >
              Cerrar Sesión
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>    
        <div className="mt-1 ">
          <Button onClick={handleShowModal} className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center  text-dark" >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
          <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
        </svg>
        <div className='m-2'> Cerrar Sesión</div>           
          </Button>
        </div>
    </>
  );
}

//mapea los valores del estado global de Redux 
const mapStateToProps = (state: RootState) => ({
  logout: state.auth.logout

});

export default connect(mapStateToProps,
   {
    logout  
    })(Logout);
