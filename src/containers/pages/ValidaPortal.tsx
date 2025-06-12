import React, { useEffect, useState } from "react";
import { login, logout } from "../../redux/actions/auth/auth";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { validaApiloginActions } from "../../redux/actions/auth/validaApiloginActions";
import { Helmet } from "react-helmet-async";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  login: (usuario: string, password: string) => Promise<boolean>;
  validaApiloginActions: (rut: string) => Promise<number>;
  logout: () => void;
  isDarkMode: boolean;
}

const ValidaPortal: React.FC<Props> = ({ login, logout, validaApiloginActions, isDarkMode }) => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const usuario = import.meta.env.VITE_USUARIO_API_LOGIN;
  const password = import.meta.env.VITE_PASSWORD_API_LOGIN;
  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    // Limpieza "forzada" por si queda algo colgando en el almacenamiento
    localStorage.removeItem("token");
    sessionStorage.clear();
    // dispatch(logout()); // Esto depende de lo que haga internamente tu logout

    // continuar flujo normal...
  }, [])

  const capturarDatosPersona = async () => {
    const params = new URLSearchParams(window.location.search);
    const datosPersona = params.get("datosPersona");
    if (datosPersona) {
      try {
        const datos = JSON.parse(decodeURIComponent(datosPersona));
        const rutUsuario = datos.sub;

        const obtieneToken = await login(usuario, password);
        if (obtieneToken) {
          const esValido = await validaApiloginActions(rutUsuario);
          if (esValido == 1) {
            navigate("/Inicio");
          }
          else if (esValido == 0) {
            dispatch(logout());
            navigate("/Denegado");
          }
          else {
            localStorage.removeItem("token"),
              sessionStorage.clear(), // o removeItem específico
              dispatch(logout());
            navigate("/");
            Swal.fire({
              icon: "warning",
              title: "Error de Conexión",
              text: "Se ha perdido la comunicación con el servidor. Le recomendamos intentar más tarde. Si el problema continúa, por favor, comuníquese con el equipo de Mesa de Ayuda o Desarrollo.",
              background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
              color: `${isDarkMode ? "#ffffff" : "000000"}`,
              confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
              customClass: {
                popup: "custom-border", // Clase personalizada para el borde
              }
            });
          }
        }
      } catch (error) {
        // console.error("Error al procesar datosPersona:", error);
      }
    } else {
      // console.error("No se encontraron datosPersona en la URL.");
    }
  };
  const messages = [
    "Validando credenciales...",
    "Por favor, espere un momento...",
    "Accediendo al sistema de inventario..."
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <>
      <Helmet>
        <title>Validando credenciales...</title>
      </Helmet>
      <div className={`d-flex justify-content-center align-items-center vh-100 ${isDarkMode ? "bg-color-dark" : ""}`}>
        <div className="col-12 col-md-8 text-center">
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "200px" }}>
            <div className="spinner-border text-primary mb-3" role="status" />

            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                className={`${isDarkMode ? "text-white" : "text-muted"} mb-1`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 1 }}
              >
                {messages[currentIndex]}
              </motion.p>
            </AnimatePresence>
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
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  login,
  logout,
  validaApiloginActions,
})(ValidaPortal);
