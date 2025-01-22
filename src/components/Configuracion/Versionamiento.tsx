import React from "react"
import { connect } from "react-redux";
import { RootState } from "../../store";

interface Props {
    isDarkMode: boolean;
}
const Versionamiento: React.FC<Props> = ({ isDarkMode }) => {
    return (
        <>
            {/* 
                Esquema de versionamiento: MAJOR.MINOR.PATCH.BUILD
                Ejemplo: v1.0.0.1

                MAJOR: Versión principal (1) 
                        - Indica lanzamientos importantes o incompatibles hacia atrás. 
                        - Cambia solo en actualizaciones significativas.

                MINOR: Funcionalidades menores (0) 
                        - Representa nuevas funcionalidades compatibles o mejoras significativas. 
                        - Cambia cuando se agregan mejoras importantes.

                PATCH: Correcciones de errores (0) 
                        - Refleja arreglos de errores o mejoras menores. 
                        - Cambia para actualizaciones sin impacto en las funcionalidades principales.

                BUILD: Número de compilación interna (1) 
                        - Cambia con cada commit o build. 
                        - Útil para rastrear versiones internas o iteraciones.
                */}

            <div className="d-flex border-bottom justify-content-between align-items-center p-2">
                <p>Última versión: v1.0.0.1</p>
            </div>

            <div className="overflow-auto">
                <table className={`table  ${isDarkMode ? "table-dark" : "table-hover "}`} >
                    <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                        <tr>
                            <th>Versión</th>
                            <th>Fecha</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>v1.0.0.1</td>
                            <td>01-31-2025</td>
                            <td>
                                Primera versión del nuevo sistema de inventario desarrollado en React, diseñado y elaborado por el Departamento de Informática del Servicio de Salud Metropolitano Sur Oriente.
                                Esta versión inicial sienta las bases para una gestión eficiente de los recursos institucionales, proporcionando una plataforma moderna y escalable que permitirá implementar futuras mejoras y funcionalidades adicionales.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});
export default connect(mapStateToProps, {
})(Versionamiento);
