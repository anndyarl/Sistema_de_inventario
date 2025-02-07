import React, { useEffect, useState } from "react";
import { login, logout } from "../../redux/actions/auth/auth";
import { connect } from "react-redux";
import { RootState } from "../../store";
import { NavLink, useNavigate } from "react-router-dom";
import { validaApiloginActions } from "../../redux/actions/auth/validaApiloginActions";


interface Props {
  login: (usuario: string, password: string) => Promise<boolean>;
  validaApiloginActions: (rut: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

const ValidaPortal: React.FC<Props> = ({ login, logout, validaApiloginActions }) => {
  const navigate = useNavigate(); // Hook para redirigir
  const [showButton, setShowButton] = useState(false);
  // Leer las variables de entorno al cargar el componente
  const usuario = import.meta.env.VITE_USUARIO_API_LOGIN;
  const password = import.meta.env.VITE_PASSWORD_API_LOGIN;

  useEffect(() => {
    // Espera 5 segundos y muestra el botón
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 20000);

    // Limpia el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    capturarDatosPersona();
  }, []);

  // Función para capturar los datos desde la URL y Validar Sesion
  const capturarDatosPersona = async () => {
    const params = new URLSearchParams(window.location.search);
    const datosPersona = params.get("datosPersona");
    if (datosPersona) {
      try {
        const datos = JSON.parse(decodeURIComponent(datosPersona));
        const rutUsuario = datos.sub;

        await login(usuario, password); //Obtiene el token
        const esValido = await validaApiloginActions(rutUsuario);// Valida usuario en Api login
        if (esValido) {
          navigate("/Inicio");
        } else {
          await logout();//Eliminados el token
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
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-md-8 text-center">
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary me-2" role="status" />
            <p className="fw-normal">Un momento...</p>
          </div>
          {showButton && ( // Muestra el botón después de 5 segundos
            <div className="m-4 rounded d-inline-block">
              <p className="fw-normal mb-2">  El proceso está tardando más de lo esperado. Si lo prefiere, puede volver a intentarlo.</p>
              <NavLink to="/" className="btn btn-primary text-decoration-none">
                Reintentar
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Conectar el componente a Redux
const mapStateToProps = (_: RootState) => ({

});

export default connect(mapStateToProps, {
  login,
  logout,
  validaApiloginActions,
})(ValidaPortal);
