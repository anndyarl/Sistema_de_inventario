// ClaveUnica.tsx
import React, { useState } from "react";
// import { DatosPersona } from "../../redux/interfaces"; 
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers"; // Asegúrate de tener este tipo definido correctamente
import { Navigate, useNavigate } from "react-router-dom";
// import { useAppDispatch } from "../../hooks/hook";
import ssmso_logo from "../../assets/img/SSMSO-LOGO.png"
import ondas from "../../assets/img/ondas.png"
import { Button, Spinner } from "react-bootstrap";
// import { useAppDispatch } from "../../hooks/hook";
interface Props {
  isAuthenticated: boolean | null;
  isDarkMode: boolean;
  // token: string | null;
}

const ClaveUnica: React.FC<Props> = ({ isAuthenticated, isDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir
  // Función para redirigir a Clave Única
  const handleClaveUnica = () => {
    setLoading(true);
    const redirectUrl = import.meta.env.VITE_CSRF_CLAVE_UNICA;
    window.location.href = redirectUrl;
    // window.open(redirectUrl, "_blank")
  };

  const handlePrueba = () => {
    navigate("/Login");
  };

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('/service-worker.js')
  //     .then(() => console.log('Service Worker registrado'));
  // }
  // console.log("token", token);
  // console.log("isAuthenticated", isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/Inicio" />;
  }
  return (
    <div className="vh-100 d-flex flex-column">
      <div className="body d-md-flex align-items-center justify-content-between flex-grow-1">

        {/* Sección Izquierda - Login */}
        <div className={`d-flex flex-column w-100 h-100 justify-content-between align-items-center text-center ${isDarkMode ? "darkModePrincipal" : ""}`}>

          {/* Logo */}
          <div className="mt-2">
            <img
              src={ssmso_logo}
              alt="SSMSO Logo"
              width={150}
              className="img-fluid mx-2"
            />
          </div>

          {/* Botón de acceso */}
          <div className="border-top border-bottom p-5 row justify-content-center ">
            <h5 className="fw-semibold fs-09em">Acceso con Clave Única</h5>

            <Button
              onClick={handleClaveUnica}
              disabled={loading}
              variant="primary"
              className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}
              type="submit"
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="mt-1 mx-2" role="status" aria-hidden="true" />
                  Iniciar sesión
                </>
              ) : (
                <>
                  <svg width="24" height="24" className="mx-1" viewBox="0 0 25 25" fill="none">
                    <path d="M12.4998 13.8956C12.9835 13.8956 13.3756 14.2878 13.3756 14.7715C13.3756 15.2552 12.9835 15.6473 12.4998 15.6473C12.0161 15.6473 11.6239 15.2552 11.6239 14.7715C11.6239 14.2878 12.0161 13.8956 12.4998 13.8956Z" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.631 1.70078C11.631 1.21768 12.0227 0.82605 12.5058 0.82605H15.9585C16.4416 0.82605 16.8333 1.21768 16.8333 1.70078C16.8333 2.18387 16.4416 2.5755 15.9585 2.5755H13.3805V9.35701C15.9909 9.77835 17.9845 12.0421 17.9845 14.7714C17.9845 17.8006 15.5289 20.2562 12.4998 20.2562C9.47065 20.2562 7.01505 17.8006 7.01505 14.7714C7.01505 12.0379 9.01473 9.77145 11.631 9.35509V1.70078ZM8.7645 14.7714C8.7645 12.7085 10.4368 11.0361 12.4998 11.0361C14.5627 11.0361 16.2351 12.7085 16.2351 14.7714C16.2351 16.8344 14.5627 18.5067 12.4998 18.5067C10.4368 18.5067 8.7645 16.8344 8.7645 14.7714Z" fill="white" />
                    <path d="M16.7507 5.65748C16.313 5.45302 15.7924 5.64209 15.5879 6.07979C15.3835 6.51748 15.5725 7.03806 16.0102 7.24252C18.8442 8.56635 20.8048 11.4409 20.8048 14.7716C20.8048 19.3583 17.0865 23.0766 12.4998 23.0766C7.91305 23.0766 4.19477 19.3583 4.19477 14.7716C4.19477 11.4517 6.14272 8.58499 8.96185 7.25542C9.39879 7.04935 9.58595 6.52809 9.37988 6.09115C9.17381 5.6542 8.65254 5.46705 8.2156 5.67312C4.80707 7.28066 2.44531 10.7494 2.44531 14.7716C2.44531 20.3245 6.94686 24.826 12.4998 24.826C18.0527 24.826 22.5543 20.3245 22.5543 14.7716C22.5543 10.7363 20.1771 7.25811 16.7507 5.65748Z" fill="white" />
                  </svg>
                  Iniciar sesión
                </>
              )}
            </Button>

            <Button
              onClick={handlePrueba}
              disabled={loading}
              variant="primary"
              className={`btn mt-2 ${isDarkMode ? "btn-secondary" : "btn-primary"}`}
              type="submit"
            >
              Acceso prueba
            </Button>
          </div>

          {/* Footer */}
          <footer className="fs-09em mb-2">
            Departamento de Informática | Unidad de Desarrollo 2025
          </footer>
        </div>

        {/* Sección Derecha - Info */}
        <div className={`mt-md-0 text-center w-100 h-100 align-content-center d-none d-md-block ${isDarkMode ? "bg-color-dark" : "bg-color"}`}>
          <h4 className="fw-bold text-uppercase text-white border-bottom border-6 pb-2 mb-3 w-50 mx-auto position-relative z-1">
            Sistema de Inventario
          </h4>
          <p className="fs-05em mb-1 text-white">
            Subdirección Administrativa | Departamento de Finanzas | Unidad de Inventarios
          </p>
          <p className="fs-05em mb-3 text-white">
            Servicio de Salud Metropolitano Sur Oriente
          </p>

          {/* Ondas decorativas */}
          {[...Array(9)].map((_, i) => (
            <img
              key={i}
              src={ondas}
              alt="ondas decorativas"
              width={150}
              className={`img-fluid position-values-${i + 1} d-none d-md-block`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.validaApiLoginReducers.isAuthenticated,
  isDarkMode: state.darkModeReducer.isDarkMode,
  token: state.loginReducer.token
});

export default connect(mapStateToProps, {
})(ClaveUnica);
