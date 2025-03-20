// ClaveUnica.tsx
import React, { useState } from "react";
// import { DatosPersona } from "../../redux/interfaces"; 
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers"; // Asegúrate de tener este tipo definido correctamente
import { Navigate } from "react-router-dom";
// import { useAppDispatch } from "../../hooks/hook";
import ssmso_background from "../../assets/img/ssmso_imagen.png";
import ssmso_logo from "../../assets/img/SSMSO-LOGO.png"
import ondas from "../../assets/img/ondas.png"
import { Button, Spinner } from "react-bootstrap";
// import { useAppDispatch } from "../../hooks/hook";
interface Props {
  isAuthenticated: boolean | null;
  isDarkMode: boolean;
}

const ClaveUnica: React.FC<Props> = ({ isAuthenticated, isDarkMode }) => {
  const [loading, setLoading] = useState(false);

  // Función para redirigir a Clave Única
  const handleEnviar = () => {
    setLoading(true);
    const redirectUrl = import.meta.env.VITE_CSRF_CLAVE_UNICA;
    window.location.href = redirectUrl;
  };

  if (isAuthenticated) {
    return <Navigate to="/Inicio" />;
  }
  return (
    <div className="vh-100 d-flex flex-column">
      <div className="body d-md-flex align-items-center justify-content-between flex-grow-1">

        <div className={`box-2 d-flex flex-column w-100 h-100 justify-content-center align-items-center text-center ${isDarkMode ? "darkModePrincipal" : ""}`}>
          <div className="mt-5">
            <img
              src={ssmso_logo}
              alt="SSMSO-LOGO"
              width={150}
              className="img-fluid mb-5"
            />

          </div>
          <h4 className="border-bottom mb-3 w-100">
            Sistema de Inventario
          </h4>

          <p className="fs-09em mb-1">
            Subdirección Administrativa | Departamento de Finanzas | Unidad de Inventarios
          </p>
          <p className="fs-09em mb-3">
            Servicio de Salud Metropolitano Sur Oriente
          </p>
          <Button onClick={handleEnviar} disabled={loading == true}
            className={`btn btn-primary text-center mb-2 border-0 ${isDarkMode ? "bg-secondary" : "bg-primary"}`} type="submit" >
            {loading ? (
              <>
                {" Un momento... "}
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              </>
            ) : (
              "Clave Única"
            )}
          </Button>

          {/* <a href="/Login" className={`btn  ${isDarkMode ? "btn-secondary" : "btn-primary"} mb-4`}>
            Clave Única demo
          </a> */}

          <footer className="mt-auto fs-05em m-1">
            Diseñado por el Departamento de Informática | Unidad de Desarrollo 2025
          </footer>
        </div>
        <div className={`mt-md-0 text-center w-100  h-100 align-content-center d-none d-md-block ${isDarkMode ? "bg-color-dark" : "bg-color"}`}>

          <img
            src={ssmso_background}
            // width={}
            alt="Imagen de Fondo"
            className="img-fluid rounded position-relative z-1"
          />
          {/* <div className="d-flex barra">
            <div className="text-bg-primary azul"></div>
            <div className="text-bg-danger rojo"></div>
          </div> */}
          <img
            src={ondas}
            alt="ondas"
            width={200}
            className="img-fluid position-values-1 d-none d-md-block"
          />

          <img
            src={ondas}
            alt="ondas"
            width={200}
            className="img-fluid position-values-2 d-none d-md-block" />

        </div>
        <img
          src={ondas}
          alt="ondas"
          width={200}
          className="img-fluid position-values-3 d-none d-md-block" />
      </div >
      <img
        src={ondas}
        alt="ondas"
        width={200}
        className="img-fluid position-values-4 d-none d-md-block" />

    </div >

  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.validaApiLoginReducers.isAuthenticated,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(ClaveUnica);
