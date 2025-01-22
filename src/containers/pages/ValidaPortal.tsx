import React, { useEffect, useState } from "react";
import { login } from "../../redux/actions/auth/auth";
import { connect } from "react-redux";
import { RootState } from "../../store";
import { NavLink, useNavigate } from "react-router-dom";
import { validaPortalActions } from "../../redux/actions/auth/validaPortalActions";

interface Props {
  login: (usuario: string, password: string) => void;
  validaPortalActions: (datosPersona: string, solicitudes: string) => void;
}

const ValidaPortal: React.FC<Props> = ({ login, validaPortalActions }) => {
  const navigate = useNavigate(); // Hook para redirigir
  const [showButton, setShowButton] = useState(false);
  // Leer las variables de entorno al cargar el componente
  const usuario = import.meta.env.VITE_USUARIO_API_LOGIN;
  const password = import.meta.env.VITE_PASSWORD_API_LOGIN;

  // Función para capturar los datos desde la URL
  const capturarDatosPersona = async () => {
    const params = new URLSearchParams(window.location.search);
    const datosPersona = params.get("datosPersona");
    if (datosPersona) {
      try {
        // Convertir los datos a un objeto JSON
        const datos = JSON.parse(decodeURIComponent(datosPersona));
        const rutUsuario = datos.sub; // Obtengo solo rut del usuario para validarlo en método validaportal
        // Ejecutar la función login con las credenciales de la API
        await login(usuario, password); // Obtengo el token correspondiente     
        validaPortalActions(rutUsuario, "1"); // Valida el usuario        
        navigate("/Inicio");

        // console.log("rut user", user);
      } catch (error) {
        console.error("Error al convertir datosPersona a JSON:", error);
      }
    } else {
      console.error("No se encontraron datosPersona en la URL.");
    }
  };

  // Capturar datos de la persona al cargar el componente
  useEffect(() => {
    capturarDatosPersona();
  }, []);

  useEffect(() => {
    // Espera 5 segundos y muestra el botón
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 10000);

    // Limpia el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

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
  validaPortalActions,
})(ValidaPortal);
