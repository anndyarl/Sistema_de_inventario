import React from "react";
import { RootState } from "../../store";
import { connect } from "react-redux";

interface Props {
  isDarkMode: boolean;
}
const Denegado: React.FC<Props> = ({ isDarkMode }) => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-8 text-center">
        <h1 className="display-6 mb-4">Acceso Denegado</h1>
        <p className="fs-5 mb-4">
          Su solicitud no ha podido ser procesada debido a que su usuario no cuenta con los permisos necesarios para acceder a esta funcionalidad.
        </p>
        <p className="fs-6 mb-5">
          Si considera que este es un error, por favor, comuníquese con el Departamento de Informática para gestionar los permisos requeridos.
        </p>
        <div className="p-4 rounded d-inline-block">
          <a href="/" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"} px-4 py-2`}>
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};


const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(Denegado);

