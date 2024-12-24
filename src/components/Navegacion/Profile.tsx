"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, LogOut, UserCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/Profile.css";
import { connect, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
import { logout } from "../../redux/actions/auth/auth";
import { Navigate, NavLink } from "react-router-dom";
import { Building, Coin, CurrencyBitcoin, CurrencyDollar, Gear, Geo } from "react-bootstrap-icons";
import ondas from "../../assets/img/ondas.png"
import { indicadoresActions } from "../../redux/actions/Otros/indicadoresActions";
import { Col, Row } from "react-bootstrap";
import { darkModeActions } from "../../redux/actions/Otros/darkModeActions";
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

const Profile: React.FC<ProfileProps> = ({
  logout,
  indicadoresActions,
  utm,
  uf,
  dolar,
  bitcoin,
  ipc,
  isDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const togglePanel = () => { setIsOpen((prev) => !prev); };
  const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
  };
  const dispatch = useDispatch();


  const onToggleDarkMode = () => {
    //Dispara accion Modo Oscuro al estado global de redux
    dispatch(darkModeActions());
  };
  const panelVariants = {
    initial: { opacity: 0, x: 100 }, // Comienza con transparencia y desplazamiento desde la izquierda
    animate: { opacity: 1, x: 0 }, // Llega a opacidad completa y posición natural
    exit: { opacity: 0, x: 100 }, // Se desvanece hacia la derecha en la salida
  };

  //aqui se hace la petición a la api mindicador.cl
  useEffect(() => {
    if (uf.valor === 0 || utm.valor === 0 || dolar.valor === 0 || bitcoin.valor === 0 || ipc.valor === 0) {
      indicadoresActions();
    }
  }, [indicadoresActions]);


  const panelTransition = {
    type: "tween",
    easeOut: [0, 0, 0.58, 1],
  };
  const handleLogout = async () => {
    let resultado = await logout();
    if (resultado) {
      return <Navigate to="/" />;
    }
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
              <div className="flex-grow-1 min-vh-100">
                <button className="navbar-nav fs-1 nav-link close-btn mx-1 mt-0 p-0 text-white close-btn" onClick={togglePanel}>×</button>
                <h3 className="fw-semibold  p-1 text-center border-bottom text-white">Andy Riquelme</h3>
                <Row className="g-1">
                  <Col>
                    <p className="mb-2 fw-fw-normal  fs-6 fs-md-5 fs-lg-4 text-white">
                      <strong> <Coin
                        className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />UTM: </strong>${utm.valor.toLocaleString("es-ES", { minimumFractionDigits: 0, })}
                    </p>
                    <p className="mb-2 fw-fw-normal  fs-6 fs-md-5 fs-lg-4 text-white">
                      <strong> <Coin
                        className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />UF: </strong>${uf.valor.toLocaleString("es-ES", { minimumFractionDigits: 0, })}
                    </p>
                  </Col>
                  <Col>
                    <p className="mb-2 fw-fw-normal  fs-6 fs-md-5 fs-lg-4 text-white">
                      <strong> <CurrencyDollar
                        className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />Dólar: </strong>${dolar.valor.toLocaleString("es-ES", { minimumFractionDigits: 0, })}
                    </p>
                    <p className="mb-2 fw-fw-normal fs-6 fs-md-5 fs-lg-4 text-white">
                      <strong> <Coin
                        className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />IPC: </strong>{ipc.valor.toLocaleString("es-ES", { minimumFractionDigits: 0, })}%
                    </p>
                    {/* <p className="mb-2 fw-fw-normal fs-6 fs-md-5 fs-lg-4 text-white">
                    <strong> <CurrencyBitcoin
                      className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                      aria-hidden="true"
                    />Bitcoin: </strong>${bitcoin.valor.toLocaleString("es-ES", { minimumFractionDigits: 0, })}
                  </p> */}
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
                <NavLink
                  key="Configuracion"
                  to="/Configuracion"
                  className="navbar-nav nav-link  fw-fw-normal fs-6 fs-md-5 fs-lg-4 text-white"
                >
                  <strong> <Gear
                    className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                    aria-hidden="true"
                  />Configuración</strong>
                </NavLink>

                <div className="d-flex justify-content-around m-3">
                  <p>
                    <strong className="text-white">
                      {isDarkMode ? (
                        <p>Modo Oscuro</p>
                      ) : (
                        <p>Modo Claro</p>
                      )} </strong>
                  </p>
                  <div className={`button-moon-sun w-25  ${isDarkMode ? "bg-primary" : "bg-warning"}`}>
                    <motion.div
                      className="icon-moon-sun"
                      style={{
                        transform: isDarkMode
                          ? "translateX(160%)"
                          : "translateX(10%)",
                      }}
                      aria-hidden="true"
                    >
                      {isDarkMode ? (
                        <Moon className="text-dark" size={18} />
                      ) : (
                        <Sun className="text-dark" size={18} />
                      )}
                    </motion.div>
                    <button aria-label="sun-moon" onClick={onToggleDarkMode} className="w-100 h-100 border-0 bg-transparent text-dark"></button>
                  </div>
                </div>
                <button onClick={handleLogout} type="button" className="btn btn-outline-light w-100 border-light fs-6 fs-md-5 fs-lg-4 ">
                  Cerrar Sesión
                  <LogOut
                    className="ms-1 p-1 flex-shrink-0 h-5 w-5"
                    aria-hidden="true"
                  />
                </button>
                {/* <div className="position-values-4 d-none d-lg-block">
                  <img
                    src={ondas}
                    alt="ondas"
                    width={200}
                    className="img-fluid"
                  />
                </div> */}
              </div>
            </motion.div>
          </motion.div>

        )}
      </AnimatePresence>

    </>
  );
};

//mapea los valores del estado global de Redux
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
