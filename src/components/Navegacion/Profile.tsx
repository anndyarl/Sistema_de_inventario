"use client";

import React, { useState } from "react";
import { LogOut, Signature, UserCircle } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/Profile.css";
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers";
import { logout } from "../../redux/actions/auth/auth";
import { Navigate } from 'react-router-dom';
import { BarChart, Building, Coin, CurrencyDollar, Database, Gear, Geo, Git } from "react-bootstrap-icons";
import { indicadoresActions } from "../../redux/actions/Otros/indicadoresActions";
import { Col, Modal, Row } from "react-bootstrap";

import General from "../Configuracion/General";
import Datos from "../Configuracion/Datos";
import Firma from "../Configuracion/Firma";
import Versionamiento from "../Configuracion/Versionamiento";
import Indicadores from "../Configuracion/Indicadores";
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

interface ProfileProps {
  logout: () => Promise<boolean>;
  indicadoresActions: () => Promise<boolean>;
  utm: IndicadoresProps;
  uf: IndicadoresProps;
  dolar: IndicadoresProps;
  bitcoin: IndicadoresProps;
  ipc: IndicadoresProps;
  isDarkMode: boolean;
}

const Profile: React.FC<ProfileProps> = ({ logout, isDarkMode }) => {

  const [isOpen, setIsOpen] = useState(false);
  const togglePanel = () => { setIsOpen((prev) => !prev); };
  const [mostrarModal, setMostrarModal] = useState(false);

  // useEffect(() => {
  //   if (uf.valor === 0 || utm.valor === 0 || dolar.valor === 0 || bitcoin.valor === 0 || ipc.valor === 0) {
  //     indicadoresActions();
  //   }
  // }, [indicadoresActions]);

  const handleLogout = async () => {
    let resultado = await logout();
    if (resultado) {
      return <Navigate to="/" />;
    }
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
  };


  return (
    <>
      <div className="d-flex w-50 justify-content-end mx-2">
        <button type="button" onClick={togglePanel} className="btn btn-outline-secondary border-0">
          <UserCircle
            className={classNames("mx-1", `${isDarkMode ? "text-white" : ""}`, "flex-shrink-0", "h-5 w-5")}
            aria-hidden="true"
          />
          <span className={`d-none d-md-inline ${isDarkMode ? "text-white" : ""}`}>
            Andy Riquelme
          </span>
        </button >
      </div>

      <AnimatePresence >
        {isOpen && (
          <motion.div
            className={`slide-panel-overlay slide-panel ${isDarkMode ? "bg-color-dark" : "bg-color"} color-white`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={panelVariants}
            transition={panelTransition}
            onClick={togglePanel}
          >
            <motion.div onClick={(e) => e.stopPropagation()}>
              <div className="flex-grow-1 min-vh-100 ">
                <Row>
                  <div className="row p-1 align-items-center">
                    <Col md={10}>
                      <div className="fw-semibold fs-3 text-end text-white">Andy Riquelme</div>
                    </Col>
                    <Col md={2}>
                      <button className="fw-semibold fs-2 close-btn  text-end text-white" onClick={togglePanel}>×</button>
                    </Col>
                  </div>
                </Row>
                <Row className="g-1">
                  <Col>
                    <p className="mb-2 fw-fw-normal  fs-6 fs-md-5 fs-lg-4 text-white">
                      <strong> <Coin
                        className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      /> UTM: </strong>
                      {/* ${utm.valor.toLocaleString("es-ES", { minimumFractionDigits: 0, })} */}
                    </p>
                    <p className="mb-2 fw-fw-normal  fs-6 fs-md-5 fs-lg-4 text-white">
                      <strong> <Coin
                        className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />UF: </strong>
                      {/* ${uf.valor.toLocaleString("es-ES", { minimumFractionDigits: 0, })} */}
                    </p>
                  </Col>
                  <Col>
                    <p className="mb-2 fw-fw-normal  fs-6 fs-md-5 fs-lg-4 text-white">
                      <strong> <CurrencyDollar
                        className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />Dólar: </strong>
                      {/* ${dolar.valor.toLocaleString("es-ES", { minimumFractionDigits: 0, })} */}
                    </p>
                    <p className="mb-2 fw-fw-normal fs-6 fs-md-5 fs-lg-4 text-white">
                      <strong> <Coin
                        className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />IPC: </strong>
                      {/* {ipc.valor.toLocaleString("es-ES", { minimumFractionDigits: 0, })}% */}
                    </p>
                  </Col>
                </Row>
                <p className="mb-2 fw-fw-normal  fs-6 fs-md-5 fs-lg-4 text-white">
                  <strong> <Building
                    className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                    aria-hidden="true"
                  />Dependencia: </strong> Finanzas
                </p>
                <p className="mb-0 fw-fw-normal  fs-6 fs-md-5 fs-lg-4 text-white">
                  <strong> <Geo
                    className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                    aria-hidden="true"
                  /> Establecimiento: </strong> Hospital San José de Maipo
                </p>
                <button onClick={() => setMostrarModal(true)} className="navbar-nav nav-link fw-fw-normal nav-item text-white fs-6 fs-md-5 fs-lg-4 w-100 text-start mb-2">
                  <strong> <Gear
                    className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                    aria-hidden="true"
                  />Configuración</strong>
                </button>

                <button onClick={handleLogout} type="button" className="btn btn-outline-light w-100 border-light fs-6 fs-md-5 fs-lg-4 ">
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
      </AnimatePresence>

      <Modal size="lg" show={mostrarModal} onHide={() => setMostrarModal(false)} /* backdrop="static" keyboard={false} */>
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
    { name: 'Firma', icon: Signature },
    { name: 'Indicadores', icon: BarChart },
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
  logout: state.loginReducer.logout,
  utm: state.indicadoresReducers.utm,
  uf: state.indicadoresReducers.uf,
  dolar: state.indicadoresReducers.dolar,
  bitcoin: state.indicadoresReducers.bitcoin,
  ipc: state.indicadoresReducers.ipc,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  logout,
  indicadoresActions,
})(Profile);

