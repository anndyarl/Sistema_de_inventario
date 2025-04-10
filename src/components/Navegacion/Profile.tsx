import React, { useEffect, useState } from "react";
import { LogOut, UserCircle } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/Profile.css";
import { RootState } from "../../redux/reducers";
import { Navigate } from 'react-router-dom';
import { Building, Database, Gear, Geo, Git } from "react-bootstrap-icons";
import { Col, Modal, Row, Spinner } from "react-bootstrap";
import General from "../Configuracion/General";
import Datos from "../Configuracion/Datos";
import Firma from "../Configuracion/Firma";
import Versionamiento from "../Configuracion/Versionamiento";
import Indicadores from "../Configuracion/Indicadores";
import { indicadoresActions } from "../../redux/actions/Otros/indicadoresActions";
import { logout } from "../../redux/actions/auth/auth";
import { connect, useDispatch } from "react-redux";
import { ESTABLECIMIENTO } from "../Traslados/RegistrarTraslados";
import { comboEstablecimientosProfileActions } from "../../redux/actions/auth/comboEstablecimientosProfileActions";
import { AppDispatch } from "../../store";

const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
export interface NavItem {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface IndicadoresProps {
  valor: number;
}

interface Roles {
  NombreRol: string;
  Descripcion: string;
  IdRol: number;
  IdAplicacion: number;
}

export interface Objeto {
  IdCredencial: number;
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Correo: string;
  Roles: Roles[];
  Establecimiento: number;
  Usr_run: string;
  error: string | null;
  isAuthenticated: boolean;
}

interface ProfileProps {
  logout: () => void;
  indicadoresActions: () => Promise<boolean>;
  comboEstablecimiento: ESTABLECIMIENTO[];

  objeto: Objeto;
  utm: IndicadoresProps;
  uf: IndicadoresProps;
  dolar: IndicadoresProps;
  bitcoin: IndicadoresProps;
  ipc: IndicadoresProps;
  isDarkMode: boolean;
  token: string | null;
}

const Profile: React.FC<ProfileProps> = ({ logout, indicadoresActions, comboEstablecimiento, objeto, utm, uf, dolar, ipc, isDarkMode, token }) => {

  const [isOpen, setIsOpen] = useState(false);
  const togglePanel = () => { setIsOpen((prev) => !prev); };
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const cargaIndicadores = async () => {

    if (uf.valor === 0 && utm.valor === 0 && dolar.valor === 0 && ipc.valor === 0) {
      setLoading(true);
      const resultado = await indicadoresActions();
      if (resultado) {
        setLoading(false);
      }
    }
  }
  useEffect(() => {
    if (token) {
      cargaIndicadores();
    }
  }, [indicadoresActions, comboEstablecimientosProfileActions]);

  const handleLogout = () => {
    dispatch(logout());
    return <Navigate to="/" />;
  };

  //Efectos de transicion apertura profile
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

  //Primera Letra en mayúscula
  const PrimeraMayuscula = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  //Busca Establecimiento del usuario
  let establecimientoUsuario = "Sin Información";
  for (let i = 0; i < comboEstablecimiento.length; i++) {
    if (String(comboEstablecimiento[i].codigo) === String(objeto.Establecimiento)) {
      establecimientoUsuario = comboEstablecimiento[i].descripcion;
      break;
    }
  }

  return (
    <>
      <div className="d-flex w-50 justify-content-end mx-2 align-items-center ">
        <button type="button" onClick={togglePanel} className={`p-2 rounded ${isDarkMode ? "text-light" : "text-dark"} nav-item nav-link d-flex`}>
          <UserCircle
            className={classNames("mx-1", `${isDarkMode ? "text-white" : ""}`, "flex-shrink-0", "h-5 w-5")}
            aria-hidden="true"
          />
          <span className={`d-none d-md-inline ${isDarkMode ? "text-white" : ""}`}>
            <p className="fs-09em"> {objeto?.Nombre && PrimeraMayuscula(objeto.Nombre)} {objeto?.Nombre && PrimeraMayuscula(objeto.Apellido1)}</p>
          </span>
        </button >
      </div>

      <AnimatePresence >
        {isOpen && (
          <motion.div
            className={`slide-panel-overlay slide-panel ${isDarkMode ? "bg-color-dark" : "bg-light"}  `}
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
                  className={`btn fs-2 p-0 ${isDarkMode ? "text-light" : "text-dark"}`}
                  onClick={togglePanel}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
              <div className="flex-grow-1 min-vh-100 ">
                <div className="text-center fw-semibold fs-4 border-bottom mb-4">
                  <p className="fs-5"> {objeto?.Nombre && PrimeraMayuscula(objeto.Nombre)} {objeto?.Nombre && PrimeraMayuscula(objeto.Apellido1)} {objeto?.Nombre && PrimeraMayuscula(objeto.Apellido2)}
                  </p>
                </div>
                <p className="mb-2 fw-fw-normal  fs-6 fs-md-5 fs-lg-4">
                  <strong> <Building
                    className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                    aria-hidden="true"
                  />
                    Dependencia: </strong> {objeto.Roles[0].NombreRol}
                </p>
                <p className="mb-2 fw-fw-normal  fs-6 fs-md-5 fs-lg-4 ">
                  <strong> <Geo
                    className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                    aria-hidden="true"
                  /> Establecimiento: </strong>{establecimientoUsuario}

                </p>
                <button onClick={() => setMostrarModal(true)} className={`fw-fw-normal p-1 border-bottom  ${isDarkMode ? "text-light" : "text-dark"} nav-item nav-link mb-4 mb-2 fs-6 fs-md-5 fs-lg-4 w-100 text-start p-0`}>
                  <strong> <Gear
                    className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                    aria-hidden="true"
                  />Configuración</strong>
                </button>


                <Row className="g-2 mb-5">
                  {[
                    { title: "UTM", value: `$${utm.valor.toLocaleString("es-ES", { minimumFractionDigits: 0 })}` },
                    { title: "UF", value: `$${uf.valor.toLocaleString("es-ES", { minimumFractionDigits: 0 })}` },
                    { title: "Dólar", value: `$${dolar.valor.toLocaleString("es-ES", { minimumFractionDigits: 0 })}` },
                    { title: "IPC", value: `${ipc.valor.toLocaleString("es-ES", { minimumFractionDigits: 0 })}%` },
                  ].map((item, index) => (
                    <Col lg={6} md={6} sm={12} key={index}>
                      <div
                        className={`text-center bg-secondary p-1 text-white border-0 shadow-sm rounded h-100 d-flex flex-column align-items-center justify-content-center`}
                      >
                        <div className="mb-1 ">
                          <strong className="no-cursor">{item.title}</strong>
                        </div>

                        {loading ? (
                          <>
                            <Spinner className="fs-6" />
                          </>
                        ) : (
                          < div className="fw-semibold no-cursor">{item.value}</div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>

                <button onClick={handleLogout} type="button" className={`p-2 rounded ${isDarkMode ? "text-light" : "text-dark"} nav-item nav-link w-100 border-bottom rounded rounded-0 fs-6 fs-md-5 fs-lg-4`}>
                  Cerrar Sesión
                  <LogOut
                    className="ms-1 p-1 flex-shrink-0 h-5 w-5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence >

      <Modal size="xl" show={mostrarModal} onHide={() => setMostrarModal(false)} /* backdrop="static" keyboard={false} */>
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title>Preferencias</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <ModalContent />
        </Modal.Body>
      </Modal>
    </>
  );
};

const ModalContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('General');
  const navigation: NavItem[] = [
    { name: 'General', icon: Gear },
    { name: 'Datos', icon: Database },
    // { name: 'Firma', icon: Signature },
    // { name: 'Indicadores', icon: BarChart },
    { name: 'Versionamiento', icon: Git },
  ];

  const handleClick = (name: string) => {
    setActiveTab(name);
  };

  return (
    <Row>
      <Col md={4}>
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => handleClick(item.name)}
            type="button"
            className={`  ${activeTab === item.name ? 'bg-secondary text-white' : ''} btn btn-outline-secondary fw-semibold d-flex align-items-center py-2 px-3 mb-2 rounded w-100 border-0 `}
          >
            <item.icon className={classNames('me-3 flex-shrink-0', 'h-5 w-5')} aria-hidden="true" />
            {item.name}
          </button>
        ))}
      </Col>
      <Col md={8}>
        {activeTab === 'General' && <General />}
        {activeTab === 'Datos' && <Datos />}
        {activeTab === 'Firma' && <Firma />}
        {activeTab === 'Indicadores' && <Indicadores />}
        {activeTab === 'Versionamiento' && <Versionamiento />}
      </Col>
    </Row >
  );
};

const mapStateToProps = (state: RootState) => ({
  comboEstablecimiento: state.comboEstablecimientosProfileReducers.comboEstablecimiento,
  objeto: state.validaApiLoginReducers,
  logout: state.loginReducer.logout,
  utm: state.indicadoresReducers.utm,
  uf: state.indicadoresReducers.uf,
  dolar: state.indicadoresReducers.dolar,
  bitcoin: state.indicadoresReducers.bitcoin,
  ipc: state.indicadoresReducers.ipc,
  isDarkMode: state.darkModeReducer.isDarkMode,
  token: state.loginReducer.token,
});

export default connect(mapStateToProps, {
  logout,
  indicadoresActions
})(Profile);

