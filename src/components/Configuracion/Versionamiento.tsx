import React, { useEffect, useMemo, useState } from "react"
import { connect } from "react-redux";
import { RootState } from "../../store";
import { listaVersionamientoActions } from "../../redux/actions/Configuracion/listaVersionamientoActions";
import { Pagination } from "react-bootstrap";

export interface ListaVersionamiento {
    numerO_VERSION: number;
    cambios: string;
    fecha: number;
    descripcion: string;
}
interface Props {
    isDarkMode: boolean;
    listaVersionamiento: ListaVersionamiento[];
    listaVersionamientoActions: () => void;
}
const Versionamiento: React.FC<Props> = ({ listaVersionamientoActions, isDarkMode, listaVersionamiento }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 5;


    useEffect(() => {
        if (listaVersionamiento.length === 0) { listaVersionamientoActions() }
    }, [listaVersionamiento, listaVersionamientoActions])

    // Lógica de Paginación actualizada
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () =>
            listaVersionamiento.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaVersionamiento, indicePrimerElemento, indiceUltimoElemento]
    );
    // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
    const totalPaginas = Array.isArray(listaVersionamiento)
        ? Math.ceil(listaVersionamiento.length / elementosPorPagina)
        : 0;
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    const version = listaVersionamiento[0]?.numerO_VERSION || "";
    return (
        <>
            {/* Solo es un ejemplo pero no significa que se tomara este tipo de versionamiento
                Esquema de versionamiento: MAJOR.MINOR.PATCH.BUILD
                Ejemplo: v0.0.0.1

                MAJOR: Versión principal (1) 
                        - Indica l anzamientos importantes o incompatibles hacia atrás. 
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

            <div className="border-bottom p-2">
                <p className="mb-2 fw-semibold">Versión Actual: {version}</p>
                <p>Nuevo sistema de inventario desarrollado, diseñado y elaborado por el Departamento de Informática del Servicio de Salud Metropolitano Sur Oriente.
                    Esta versión inicial sienta las bases para una gestión eficiente de los recursos institucionales, proporcionando una plataforma moderna, eficiente y escalable que permitirá implementar futuras mejoras y funcionalidades adicionales.
                </p>
            </div>
            {/* Tabla*/}
            <div className='table-responsive'>
                <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                    <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                        <tr>
                            <th scope="col" className="text-nowrap text-center">Versión</th>
                            <th scope="col" className="text-nowrap text-center">Cambios</th>
                            <th scope="col" className="text-nowrap text-center">Fecha</th>
                            <th scope="col" className="text-nowrap text-center">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elementosActuales.map((Lista, index) => {
                            let indexReal = indicePrimerElemento + index; // Índice real basado en la página
                            return (
                                <tr key={indexReal}>
                                    <td className="text-nowrap">{Lista.numerO_VERSION}</td>
                                    <td className="text-nowrap">{Lista.cambios}</td>
                                    <td className="text-nowrap">{Lista.fecha}</td>
                                    <td>
                                        {Lista.descripcion.split(/(?=(REQ_S\d+_\d+|FIX\d+|INC\d+))/).map((linea, index) => (
                                            <div key={index}>
                                                {linea.trim()}
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div >
            {/* Paginador */}
            <div className="paginador-container">
                <Pagination className="paginador-scroll">
                    <Pagination.First
                        onClick={() => paginar(1)}
                        disabled={paginaActual === 1}
                    />
                    <Pagination.Prev
                        onClick={() => paginar(paginaActual - 1)}
                        disabled={paginaActual === 1}
                    />

                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={i + 1 === paginaActual}
                            onClick={() => paginar(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => paginar(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                    />
                    <Pagination.Last
                        onClick={() => paginar(totalPaginas)}
                        disabled={paginaActual === totalPaginas}
                    />
                </Pagination>
            </div>
        </>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode,
    listaVersionamiento: state.listaVersionamientoReducers.listaVersionamiento
});
export default connect(mapStateToProps, {
    listaVersionamientoActions
})(Versionamiento);
