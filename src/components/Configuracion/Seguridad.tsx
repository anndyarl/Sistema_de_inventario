import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setTiempoSesionActions } from "../../redux/actions/Configuracion/preferenciasActions";

// Constantes para las opciones de tiempo
const OPCIONES_TIEMPO = [30, 40, 60] as const;
type TiempoOpcion = typeof OPCIONES_TIEMPO[number];

interface Props {
    isDarkMode: boolean;
    tiempoSesion: number; // Viene de Redux con el valor persistido
}

const Seguridad: React.FC<Props> = ({ isDarkMode, tiempoSesion }) => {
    const dispatch = useDispatch();

    // Estado local sincronizado con Redux
    const [tiempoLocal, setTiempoLocal] = useState<TiempoOpcion>(tiempoSesion as TiempoOpcion);
    const [cargado, setCargado] = useState(false);

    // Efecto para cargar desde localStorage al iniciar (respaldo)
    useEffect(() => {
        const tiempoGuardado = localStorage.getItem("tiempoSesion");
        if (tiempoGuardado && !cargado) {
            const parsed = parseInt(tiempoGuardado, 10) as TiempoOpcion;
            if (OPCIONES_TIEMPO.includes(parsed)) {
                // Si hay un valor guardado diferente al de Redux, actualizamos Redux
                if (parsed !== tiempoSesion) {
                    dispatch(setTiempoSesionActions(parsed));
                }
                setTiempoLocal(parsed);
            }
        }
        setCargado(true);
    }, []);

    useEffect(() => {
        setTiempoLocal(tiempoSesion as TiempoOpcion);
    }, [tiempoSesion]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = parseInt(e.target.value, 10) as TiempoOpcion;
        setTiempoLocal(newValue);
        dispatch(setTiempoSesionActions(newValue));

        // Guardar en localStorage para persistencia adicional
        localStorage.setItem("tiempoSesion", newValue.toString());
    };

    const formatearTiempo = (minutos: number): string => {
        if (minutos >= 60) {
            const horas = minutos / 60;
            return `${horas} hora${horas > 1 ? 's' : ''}`;
        }
        return `${minutos} minutos`;
    };

    return (
        <div className="d-flex border-bottom justify-content-between align-items-center p-2">
            <div className="d-flex">
                <p className="fw-normal mb-0 fs-09em">
                    <strong>Tiempo de sesión</strong>
                </p>
                <span className="badge bg-info text-dark mx-1 align-content-center" >
                    {formatearTiempo(tiempoLocal)}
                </span>
            </div>
            <select
                aria-label="tiempo de sesión"
                className={`form-select w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                value={tiempoLocal}
                onChange={handleChange}
            >
                {OPCIONES_TIEMPO.map((val) => (
                    <option key={val} value={val}>
                        {val} minutos {val >= 60 ? `(${val / 60} hora${val > 60 ? 's' : ''})` : ''}
                    </option>
                ))}
            </select>

        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode,
    tiempoSesion: state.preferenciasReducers?.tiempoSesion || 30, // Valor persistido
});

// Exportar con connect y la acción
export default connect(mapStateToProps, {
    setTiempoSesionActions
})(Seguridad);