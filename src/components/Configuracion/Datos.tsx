import React from "react"
import { RootState } from "../../store";
import { connect } from "react-redux";
import { limpiarDataActions } from "../../redux/actions/Configuracion/limparDataActions";
import Swal from "sweetalert2";

interface Props {
    isDarkMode: boolean;
    limpiarDataActions: () => Promise<boolean>;
}
const Datos: React.FC<Props> = ({ limpiarDataActions, isDarkMode }) => {

    const handleLimpiarData = async () => {
        const confirmResult = await Swal.fire({
            icon: "warning",
            title: "Se limpiaran todos los datos",
            text: "¿Desea Continuar?",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Salir",
            backdrop: true, // Asegura que no se cierre al hacer clic fuera
            allowOutsideClick: false, // Evita el cierre cuando se haga clic fuera del modal
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
                popup: "custom-border", // Clase personalizada para el borde
            }
        });
        // Si se confirma, reiniciamos los temporizadores
        if (confirmResult.isConfirmed) {
            let resultado = await limpiarDataActions();
            if (resultado) {
                Swal.fire({
                    icon: "info",
                    title: "Datos Limpiados",
                    text: "Se ha limpiado correctamente todos los datos en formularios y tablas",
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "Salir",
                    backdrop: true, // Asegura que no se cierre al hacer clic fuera
                    allowOutsideClick: false, // Evita el cierre cuando se haga clic fuera del modal
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    customClass: {
                        popup: "custom-border", // Clase personalizada para el borde
                    }

                });
            }
        }
    }

    return (
        <>
            <div className="d-flex border-bottom justify-content-between align-items-center p-2">
                <p>Limpiar todos los datos en formularios y tablas</p>
                <button onClick={handleLimpiarData} type="button" className="btn btn-danger">
                    Limpiar todo
                </button>
            </div>
        </>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
    limpiarDataActions
})(Datos);