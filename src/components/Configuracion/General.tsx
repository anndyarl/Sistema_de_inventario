import React from "react"
import { connect, useDispatch } from "react-redux";
import { darkModeActions } from "../../redux/actions/Otros/darkModeActions";
import { motion } from "framer-motion";
import { Moon, Sun } from "react-bootstrap-icons";
import { RootState } from "../../store";
import { Navigate } from "react-router-dom";
import { logout } from "../../redux/actions/auth/auth";

interface Props {
    isDarkMode: boolean;
    logout: () => Promise<boolean>;
}
const General: React.FC<Props> = ({ logout, isDarkMode }) => {
    const dispatch = useDispatch();

    const onToggleDarkMode = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(darkModeActions());
    };
    const handleLogout = async () => {
        let resultado = await logout();
        if (resultado) {
            return <Navigate to="/" />;
        }
    };
    return (
        <>
            <div className="d-flex border-bottom justify-content-between align-items-center p-2">
                <p>Tema</p>
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
            <div className="d-flex border-bottom justify-content-between align-items-center p-2">
                <p>Cerrar sesión</p>
                <button onClick={handleLogout} type="button" className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-secondary"} `}>
                    Cerrar Sesión
                </button>
            </div>
        </>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
    logout,
})(General);

