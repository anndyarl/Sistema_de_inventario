import React, { useState } from "react"
import { connect, useDispatch } from "react-redux";
import { darkModeActions } from "../../redux/actions/Otros/darkModeActions";
import { motion } from "framer-motion";
import { Moon, Sun } from "react-bootstrap-icons";
import { RootState } from "../../store";
import { logout } from "../../redux/actions/auth/auth";
import { setMostrarNPaginacionActions } from "../../redux/actions/Otros/mostrarNPaginacionActions";

interface Props {
    isDarkMode: boolean;
    logout: () => void;
    nPaginacion: number; //número de paginas establecido desde preferencias
}
const General: React.FC<Props> = ({ logout, isDarkMode, nPaginacion }) => {
    const dispatch = useDispatch();

    const onToggleDarkMode = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(darkModeActions());
    };
    const handleLogout = async () => {
        logout();
    };

    const [_, setPaginacion] = useState({
        paginacion: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Convierte `value` a número
        let newValue: string | number = ["paginacion"].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setPaginacion((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
        if (name === "paginacion") {
            dispatch(setMostrarNPaginacionActions(newValue as number));
        }
    };
    return (
        <>
            <div className="d-flex border-bottom justify-content-between align-items-center p-2">
                <p className="fw-normal">Tema</p>
                <div className="d-flex align-items-center">

                    <strong className="fw-semibold">
                        {isDarkMode ? (
                            <p>Oscuro</p>
                        ) : (
                            <p>Claro</p>
                        )} </strong>

                    <div className={`button-moon-sun position-relative z-0 mx-2 align-items-center pt0 ${isDarkMode ? "bg-primary text-dark" : "bg-warning"}`} style={{ width: "60px", height: "20px" }}>
                        <motion.div
                            className="icon-moon-sun"
                            style={{
                                transform: isDarkMode
                                    ? "translateX(183%)"
                                    : "translateX(10%)",
                            }}
                            aria-hidden="true"
                        >
                            {isDarkMode ? (
                                <Moon className="fw-semibold" size={12} />
                            ) : (
                                <Sun className="fw-semibold" size={12} />
                            )}
                        </motion.div>
                        <button aria-label="sun-moon" onClick={onToggleDarkMode} className="w-100 h-100 border-0 bg-transparent position-absolute z-1  "></button>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center border-bottom p-3">
                <h6 className="fw-normal m-0">Tamaño máximo de la página</h6>
                <div className="d-flex align-items-center">
                    <p className="fw-semibold mb-0 me-2">Mostrar</p>
                    <select
                        aria-label="Paginación"
                        className={`form-select w-auto mx-2 ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                        name="paginacion"
                        onChange={handleChange}
                        value={nPaginacion || 10}
                    >
                        {[10, 15, 20, 25, 50, 100].map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                    <p className="fw-semibold mb-0">conversaciones por página</p>
                </div>
            </div>
            <div className="d-flex border-bottom justify-content-between align-items-center p-2">
                <p className="fw-normal">Cerrar sesión</p>
                <button onClick={handleLogout} type="button" className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-secondary"} `}>
                    Cerrar Sesión
                </button>
            </div>
        </>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    logout,
})(General);

