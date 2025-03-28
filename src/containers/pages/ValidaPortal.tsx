import React, { useEffect, useState } from "react";
import { login, logout } from "../../redux/actions/auth/auth";
import { connect } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { validaApiloginActions } from "../../redux/actions/auth/validaApiloginActions";
import { Helmet } from "react-helmet-async";
import { Button } from "react-bootstrap";

interface Props {
  login: (usuario: string, password: string) => Promise<boolean>;
  validaApiloginActions: (rut: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isDarkMode: boolean;
}

const ValidaPortal: React.FC<Props> = ({ login, logout, validaApiloginActions, isDarkMode }) => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const [dots, setDots] = useState(""); // Estado para los puntos suspensivos

  const usuario = import.meta.env.VITE_USUARIO_API_LOGIN;
  const password = import.meta.env.VITE_PASSWORD_API_LOGIN;

  useEffect(() => {
    // Temporizador para mostrar el botón después de 20 segundos
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    capturarDatosPersona();
  }, []);

  const capturarDatosPersona = async () => {
    const params = new URLSearchParams(window.location.search);
    const datosPersona = params.get("datosPersona");
    if (datosPersona) {
      try {
        const datos = JSON.parse(decodeURIComponent(datosPersona));
        const rutUsuario = datos.sub;

        await login(usuario, password);
        const esValido = await validaApiloginActions(rutUsuario);

        if (esValido) {
          navigate("/Inicio");
        } else {
          await logout();
          navigate("/Denegado");
        }
      } catch (error) {
        console.error("Error al procesar datosPersona:", error);
      }
    } else {
      console.error("No se encontraron datosPersona en la URL.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Redirigiendo{dots}</title>
      </Helmet>
      <div className={`d-flex justify-content-center align-items-center vh-100 ${isDarkMode ? "bg-color-dark" : ""}`}>
        <div className="col-12 col-md-8 text-center">
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary me-2" role="status" />
            <p className={`${isDarkMode ? "text-white" : "text-muted"}`}>
              Redirigiendo, un momento
              <span className="dots-animation">...</span>
            </p>
          </div>
          {showButton && (
            <div className="m-4 rounded d-inline-block">
              <p className={`${isDarkMode ? "text-white" : "text-muted"} mb-2`}>
                El proceso está tardando más de lo esperado. Si lo prefiere, puede volver a intentarlo.
              </p>
              <Button variant={`${isDarkMode ? "secondary" : "primary"}`} onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkModeReducer.isDarkMode,
});

export default connect(mapStateToProps, {
  login,
  logout,
  validaApiloginActions,
})(ValidaPortal);
