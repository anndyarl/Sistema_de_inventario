import React from "react";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { Ban } from "react-bootstrap-icons";
import { Navigate } from "react-router-dom";

interface Props {
  isDarkMode: boolean;
  isAuthenticated: boolean | null;
}
const Denegado: React.FC<Props> = ({ isDarkMode, isAuthenticated }) => {

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-8 text-center">
        <Ban className="flex-shrink-0 w-100 fs-1 mb-2" aria-hidden="true" />
        <h1 className="display-6 mb-4">Acceso Denegado</h1>
        <p className="fs-5 mb-4">
          Su usuario no cuenta con los permisos necesarios para acceder a esta funcionalidad.
        </p>
        <p className="fs-6 mb-5">
          Si considera que este es un error, por favor, comuníquese con el Departamento de Informática para gestionar los permisos correspondientes.
        </p>
        <div className="p-4 rounded d-inline-block">
          <a href="/" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"} px-4 py-2`}>
            Volver
          </a>
        </div>
      </div>
    </div>
  );
};


const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkModeReducer.isDarkMode,
  isAuthenticated: state.validaApiLoginReducers.isAuthenticated
});

export default connect(mapStateToProps, {
})(Denegado);

