import React from "react";
import Layout from "../hocs/layout/Layout";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/actions/auth/auth";

interface Props {
  logout: () => void;
  isDarkMode: boolean
}

const Error404: React.FC<Props> = ({ isDarkMode }) => {

  const navigate = useNavigate();

  const HandleVolver = () => {
    navigate("/");
  }
  return (
    <Layout>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-md-8 text-center">
          <h1 className="display-6 mb-4">404 - Recurso no encontrado</h1>
          <p className={`fs-5 mb-4`}>
            Lo sentimos, el recurso que estás buscando (o una de sus dependencias) podría haber sido eliminado, cambiado de nombre o no estar disponible temporalmente.
          </p>
          <p className="fs-6 mb-5">
            Por favor, revisa la URL e intenta de nuevo o regresa a la página principal.
          </p>
          <div className="p-4 rounded d-inline-block ">
            <Button onClick={HandleVolver} className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  px-4 py-2`}>
              Volver
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};


const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  logout
})(Error404);

