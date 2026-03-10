import React, { useEffect, useState } from "react";
import { LogOut, UserCircle } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/Profile.css";
import { RootState } from "../../redux/reducers";
import { Navigate } from 'react-router-dom';
import { Building, Download, Geo, Gear } from "react-bootstrap-icons";
import { Col, Modal, Row, Spinner } from "react-bootstrap";
import { indicadoresActions } from "../../redux/actions/Otros/indicadoresActions";
import { logout } from "../../redux/actions/auth/authActions";
import { connect, useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import Preferencias from "../Configuracion/Preferencias";


interface Roles {
  NombreRol: string;
  Descripcion: string;
  IdRol: number;
  IdAplicacion: number;
  codigoEstablecimiento: number;
  nombreEstablecimiento: string;
}

export interface Objeto {
  IdCredencial: number;
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Correo: string;
  Roles: Roles[];
  Establecimiento: number;
  usr_run: string;
  error: string | null;
  isAuthenticated: boolean;
}

export interface IndicadoresProps {
  valor: number;
}

interface ProfileProps {
  logout: () => void;
  indicadoresActions: () => Promise<boolean>;
  objeto: Objeto;
  utm: IndicadoresProps;
  uf: IndicadoresProps;
  dolar: IndicadoresProps;
  bitcoin: IndicadoresProps;
  ipc: IndicadoresProps;
  isDarkMode: boolean;
  token: string | null;
  origenLogin: number;
  activo?: string;
}

const Profile: React.FC<ProfileProps> = ({
  logout,
  indicadoresActions,
  objeto,
  utm,
  uf,
  dolar,
  ipc,
  isDarkMode,
  token,
  origenLogin,
  activo = "General"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  const cargaIndicadores = async () => {
    if (uf.valor === 0 && utm.valor === 0 && dolar.valor === 0 && ipc.valor === 0) {
      setLoading(true);
      const resultado = await indicadoresActions();
      if (resultado) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (token) {
      cargaIndicadores();
    }
  }, [indicadoresActions]);

  const handleLogout = () => {
    if (origenLogin === 0) {
      dispatch(logout());
      const redirectUrl = import.meta.env.VITE_ORIGEN_LOGIN;
      window.location.href = redirectUrl;
      return;
    } else {
      dispatch(logout());
      return <Navigate to="/" />;
    }
  };

  const PrimeraMayuscula = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const panelVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  const panelTransition = {
    type: "tween",
    easeOut: [0, 0, 0.58, 1],
    duration: 0.2
  };

  const indicadoresData = [
    { title: "UTM", value: `$${utm.valor.toLocaleString("es-ES", { minimumFractionDigits: 0 })}` },
    { title: "UF", value: `$${uf.valor.toLocaleString("es-ES", { minimumFractionDigits: 0 })}` },
    { title: "Dólar", value: `$${dolar.valor.toLocaleString("es-ES", { minimumFractionDigits: 0 })}` },
    { title: "IPC", value: `${ipc.valor.toLocaleString("es-ES", { minimumFractionDigits: 0 })}%` },
  ];

  return (
    <>
      {/* Botón de perfil */}
      <div className="d-flex justify-content-end align-content-center p-3">
        <button
          type="button"
          onClick={togglePanel}
          className={`d-flex justify-content-end align-items-center rounded p-1 ${isDarkMode ? "text-light" : "text-dark"} nav-item nav-link`}
        >
          <UserCircle
            className={`${isDarkMode ? "text-white" : "text-muted"}`}
            size={30}
            aria-hidden="true"
          />
          <span className={`d-none d-md-inline ${isDarkMode ? "text-white" : ""}`}>
            <p className="fs-09em ms-1">
              {objeto?.Nombre && PrimeraMayuscula(objeto.Nombre)} {objeto?.Apellido1 && PrimeraMayuscula(objeto.Apellido1)}
            </p>
          </span>
        </button>
      </div>

      {/* Panel deslizante */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`slide-panel-overlay slide-panel ${isDarkMode ? "bg-color-dark" : "bg-light"}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={panelVariants}
            transition={panelTransition}
            onClick={togglePanel}
          >
            <motion.div onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-end">
                <button
                  className={`btn fs-1 ${isDarkMode ? "text-light" : "text-dark"}`}
                  onClick={togglePanel}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              <div className="flex-grow-1 min-vh-100">
                {/* Nombre completo */}
                <div className="text-center fw-semibold fs-4 border-bottom mb-4">
                  <p className="fs-5">
                    {objeto?.Nombre && PrimeraMayuscula(objeto.Nombre)} {objeto?.Apellido1 && PrimeraMayuscula(objeto.Apellido1)} {objeto?.Apellido2 && PrimeraMayuscula(objeto.Apellido2)}
                  </p>
                </div>

                {/* Información del usuario */}
                <p className="mb-2 fw-normal fs-6 fs-md-5 fs-lg-4">
                  <strong>
                    <Building className="m-1 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                    Dependencia:
                  </strong> {objeto.Roles[0]?.NombreRol}
                </p>

                <p className="mb-2 fw-normal fs-6 fs-md-5 fs-lg-4">
                  <strong>
                    <Geo className="m-1 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                    Establecimiento:
                  </strong> {objeto.Roles[0]?.nombreEstablecimiento}
                </p>

                {/* Botón Configuración */}
                <button
                  onClick={() => setMostrarModal(true)}
                  className={`fw-normal p-1 border-bottom ${isDarkMode ? "text-light" : "text-dark"} nav-item nav-link mb-4 fs-6 fs-md-5 fs-lg-4 w-100 text-start p-0`}
                >
                  <strong>
                    <Gear className="m-1 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                    Configuración
                  </strong>
                </button>

                {/* Manual de usuario */}
                <a
                  href="/manual_usuario.pdf"
                  download="manual_usuario.pdf"
                  className={`fw-normal p-1 border-bottom ${isDarkMode ? "text-light" : "text-dark"} nav-item nav-link mb-4 fs-6 fs-md-5 fs-lg-4 w-100 text-start p-0`}
                >
                  <strong>
                    <Download className="m-1 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                    Manual de usuario
                  </strong>
                </a>

                {/* Indicadores */}
                <Row className="g-2 mb-5">
                  {indicadoresData.map((item, index) => (
                    <Col lg={6} md={6} sm={12} key={index}>
                      <div className="text-center bg-secondary p-1 text-white border-0 shadow-sm rounded h-100 d-flex flex-column align-items-center justify-content-center">
                        <div className="mb-1">
                          <strong className="no-cursor">{item.title}</strong>
                        </div>
                        {loading ? (
                          <Spinner className="fs-6" />
                        ) : (
                          <div className="fw-semibold no-cursor">{item.value}</div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* Botón Cerrar Sesión */}
                <button
                  onClick={handleLogout}
                  type="button"
                  className={`p-2 rounded ${isDarkMode ? "text-light" : "text-dark"} nav-item nav-link w-100 border-bottom rounded-0 fs-6 fs-md-5 fs-lg-4`}
                >
                  Cerrar Sesión
                  <LogOut className="ms-1 p-1 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Preferencias */}
      <Modal
        size="xl"
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
      >
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title>Preferencias</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <Preferencias isDarkMode={isDarkMode} activo={activo} />
        </Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  objeto: state.validaApiLoginReducers,
  logout: state.loginReducer.logout,
  utm: state.indicadoresReducers.utm,
  uf: state.indicadoresReducers.uf,
  dolar: state.indicadoresReducers.dolar,
  bitcoin: state.indicadoresReducers.bitcoin,
  ipc: state.indicadoresReducers.ipc,
  isDarkMode: state.darkModeReducer.isDarkMode,
  token: state.loginReducer.token,
  origenLogin: state.loginReducer.origenLogin,
});

export default connect(mapStateToProps, {
  logout,
  indicadoresActions
})(Profile);