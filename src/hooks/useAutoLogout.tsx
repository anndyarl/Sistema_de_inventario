import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../redux/actions/auth/auth";
import { useSelector } from "react-redux";
import { RootState } from "../store"; // Ajusta la ruta a tu store de Redux

const useAutoLogout = (warningTime: number, logoutTime: number) => {
    const warningTimeout = useRef<number | null>(null);
    const logoutTimeout = useRef<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    // Accede al estado global de Redux para el modo nocturno
    const isDarkMode = useSelector((state: RootState) => state.darkModeReducer.isDarkMode);
    const origenLogin = useSelector((state: RootState) => state.loginReducer.origenLogin);

    useEffect(() => {
        //Inicializando auto logout
        const handleActivity = () => {
            //Si hay Actividad detectada, reinicia los temporizadores
            resetTimers();
        };

        // Listeners de actividad del usuario
        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("keydown", handleActivity);

        // Inicializar los temporizadores
        resetTimers();

        return () => {
            //Limpiando listeners y temporizadores
            if (warningTimeout.current !== null) {
                window.clearTimeout(warningTimeout.current);
            }
            if (logoutTimeout.current !== null) {
                window.clearTimeout(logoutTimeout.current);
            }
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("keydown", handleActivity);
        };
    }, [dispatch, warningTime, logoutTime]);

    const resetTimers = () => {

        if (warningTimeout.current !== null) {
            window.clearTimeout(warningTimeout.current);
        }
        if (logoutTimeout.current !== null) {
            window.clearTimeout(logoutTimeout.current);
        }

        // Configura nuevos temporizadores
        warningTimeout.current = window.setTimeout(() => {
            Swal.fire({
                icon: "warning",
                title: "Su sesión expirará pronto",
                text: "¿Desea Continuar?",
                showCancelButton: true,
                confirmButtonText: "Continuar",
                cancelButtonText: "Salir",
                backdrop: true, // Asegura que no se cierre al hacer clic fuera
                allowOutsideClick: false, // Evita el cierre cuando se haga clic fuera del modal
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            }).then((result) => {
                // Si se confirma, reiniciamos los temporizadores
                if (result.isConfirmed) {
                    resetTimers(); // Reinicia los temporizadores si el usuario confirma
                    // const redirectUrl = import.meta.env.VITE_CSRF_CLAVE_UNICA;
                    // window.location.href = redirectUrl;
                    // navigate(`/ValidaPortal`);
                    const usuario = import.meta.env.VITE_USUARIO_API_LOGIN;
                    const password = import.meta.env.VITE_PASSWORD_API_LOGIN;
                    dispatch(login(usuario, password));
                }
                // Si se presiona No, cerramos la sesión
                else if (result.dismiss === Swal.DismissReason.cancel) {

                    if (origenLogin === 0) {
                        console.log("Valor 0 regresa a Gestor Documental");
                        dispatch(logout());
                        const redirectUrl = import.meta.env.VITE_ORIGEN_LOGIN
                        window.location.href = redirectUrl
                        return;
                    }
                    else {
                        console.log("Valor 1 regresa a login Original");
                        dispatch(logout());
                        navigate("/");;
                    }
                }
            });
        }, warningTime);

        logoutTimeout.current = window.setTimeout(() => {
            Swal.fire({
                icon: "info",
                title: "Su sesión expiró",
                text: `Por favor, vuelva a ingresar`,
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            if (origenLogin === 0) {
                // console.log("Valor 0 regresa a Gestor Documental");
                dispatch(logout());
                const redirectUrl = import.meta.env.VITE_ORIGEN_LOGIN
                window.location.href = redirectUrl
                return;
            }
            else {
                // console.log("Valor 1 regresa a login Original");
                dispatch(logout());
                navigate("/");;
            }
        }, logoutTime);
    };


    return null; // No renderiza nada, es solo para la lógica
};

export default useAutoLogout;

