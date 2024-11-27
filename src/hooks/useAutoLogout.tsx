import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import { logout } from "../redux/actions/auth/auth";

const useAutoLogout = (warningTime: number, logoutTime: number) => {
    const warningTimeout = useRef<number | null>(null);
    const logoutTimeout = useRef<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();

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
                text: "Si desea continuar presione Si o recargue nuevamente",
                showCancelButton: true,
                confirmButtonText: "Sí",
                cancelButtonText: "No",
                backdrop: true, // Asegura que no se cierre al hacer clic fuera
                allowOutsideClick: false, // Evita el cierre cuando se haga clic fuera del modal
            }).then((result) => {
                // Si se confirma, reiniciamos los temporizadores
                if (result.isConfirmed) {
                    resetTimers(); // Reinicia los temporizadores si el usuario confirma
                }
                // Si se presiona No, cerramos la sesión
                else if (result.dismiss === Swal.DismissReason.cancel) {
                    dispatch(logout()); // Cierra la sesión                  
                    return <Navigate to="/" />;
                }
            });
        }, warningTime);

        logoutTimeout.current = window.setTimeout(() => {
            dispatch(logout());
            Swal.fire({
                icon: "info",
                title: "Su sesión ha expirado :'(",
                text: `Vuelva a ingresar`,
            });
            return <Navigate to="/" />;
        }, logoutTime);
    };

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

    return null; // No renderiza nada, es solo para la lógica
};

export default useAutoLogout;
