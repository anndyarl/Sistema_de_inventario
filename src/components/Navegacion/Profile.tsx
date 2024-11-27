"use client";

import React, { useState } from "react";
import { Sun, Moon, LogOut, User2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/Profile.css";
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers";
import { logout } from "../../redux/actions/auth/auth";
import { Navigate, NavLink } from "react-router-dom";
import { Building, Coin, Gear, Geo } from "react-bootstrap-icons";
import ondas from "../../assets/img/ondas.png"
interface ProfileProps {
  // onToggleDarkMode: () => void;
  // isDarkMode: boolean;
  logout: () => Promise<boolean>;
}

const Profile: React.FC<ProfileProps> = ({
  // onToggleDarkMode,
  // isDarkMode,
  logout,

}) => {
  const [isOpen, setIsOpen] = useState(false);
  const togglePanel = () => { setIsOpen((prev) => !prev); };
  const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
  };
  const panelVariants = {
    initial: { opacity: 0, x: 100 }, // Comienza con transparencia y desplazamiento desde la izquierda
    animate: { opacity: 1, x: 0 }, // Llega a opacidad completa y posición natural
    exit: { opacity: 0, x: 100 }, // Se desvanece hacia la derecha en la salida
  };

  const panelTransition = {
    type: "tween",
    easeOut: [0, 0, 0.58, 1],
    duration: 0.2,
  };
  const handleLogout = async () => {
    let resultado = await logout();
    if (resultado) {
      return <Navigate to="/" />;
    }
  };
  return (
    <>
      <button type="button" onClick={togglePanel} className="btn btn-outline-light text-black w-100 ">
        <User2
          className={classNames("flex-shrink-0", "h-3 w-3")}
          aria-hidden="true"
        />
        <span className="font-bold ">Andy Riquelme  </span>
      </button >
      <AnimatePresence >
        {isOpen && (
          <motion.div
            className="slide-panel-overlay slide-panel bg-color color-white"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={panelVariants}
            transition={panelTransition}
            onClick={togglePanel}
          >
            <motion.div onClick={(e) => e.stopPropagation()}>
              <button className="navbar-nav fs-1 nav-link close-btn mx-1 mt-0 p-0 text-white close-btn" onClick={togglePanel}>×</button>
              <h3 className="fw-semibold  p-1 text-center border-bottom text-white">Andy Riquelme</h3>
              <p className="mb-2 fw-fw-normal  fs-6 fs-md-5 fs-lg-4 text-white">
                <strong> <Coin
                  className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                  aria-hidden="true"
                />UTM: </strong> $47.396
              </p>
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
                className="navbar-nav nav-link mb-2 fw-fw-normal fs-6 fs-md-5 fs-lg-4 text-white"
              >
                <strong> <Gear
                  className={classNames("m-1 flex-shrink-0", "h-5 w-5")}
                  aria-hidden="true"
                />Configuración</strong>
              </NavLink>
              <button onClick={handleLogout} type="button" className="btn btn-outline-light w-100 border-light fs-6 fs-md-5 fs-lg-4 ">
                Cerrar Sesión
                <LogOut
                  className={classNames("ms-1 p-1 flex-shrink-0", "h-5 w-5")}
                  aria-hidden="true"
                />
              </button>
              <div className="bg-color position-values-4">
                <img
                  src={ondas}
                  alt="ondas"
                  width={200}
                  className="img-fluid"
                />
              </div>

              {/* <div className="d-flex justify-content-around align-content-center ">
              <p className="navbar-nav nav-item nav-link mb-1">
                <strong>Modo </strong>
              </p>
              <div className={`button-moon-sun w-50  ${isDarkMode ? "bg-primary" : "bg-warning"}`}>
                <motion.div
                  className="icon-moon-sun "
                  style={{
                    transform: isDarkMode
                      ? "translateX(330%)"
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
                <button
                  onClick={onToggleDarkMode}
                  className="w-100 h-100 border-0 bg-transparent text-dark"
                  aria-label={
                    isDarkMode
                      ? "Cambiar a modo claro"
                      : "Cambiar a modo oscuro"
                  }
                ></button>
              </div>
            </div> */}

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
});

export default connect(mapStateToProps, {
  logout,
})(Profile);
