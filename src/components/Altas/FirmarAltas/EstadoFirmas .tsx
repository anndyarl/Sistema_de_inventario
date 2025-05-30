import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Modal, Col, Row, Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { RootState } from "../../../store";
import MenuAltas from "../../Menus/MenuAltas";
import Layout from "../../../containers/hocs/layout/Layout";
import { BlobProvider } from '@react-pdf/renderer';
import { Helmet } from "react-helmet-async";
import { Objeto } from "../../Navegacion/Profile";
import { Eye, Search } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { listaEstadoFirmasActions } from "../../../redux/actions/Altas/FirmarAltas/listaEstadoFirmasActions";
import DocumentoEstadodFirmaPDF from "./DocumentoEstadodFirmaPDF";

export interface ListaEstadoFirmas {
    altaS_CORR: number;
    idcargo: number;
    jerarquia: number;
    firmado: number;
    imovimiento: number;
}

interface DatosBajas {
    listaEstadoFirmas: ListaEstadoFirmas[];
    listaEstadoFirmasActions: (altasCorr: number) => Promise<boolean>;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
    nPaginacion: number; //número de paginas establecido desde preferencias
}

const EstadoFirmas: React.FC<DatosBajas> = ({ listaEstadoFirmasActions, listaEstadoFirmas, token, isDarkMode, nPaginacion }) => {
    const [loading, setLoading] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [filasSeleccionadas, _] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = nPaginacion;
    const filasSeleccionadasPDF = listaEstadoFirmas.filter((_, index) =>
        filasSeleccionadas.includes(index.toString())
    );
    const [Buscar, setBuscar] = useState({
        altaS_CORR: 0,
    });
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Validación específica para af_codigo_generico: solo permitir números
        if (name === "altaS_CORR" && !/^[0-9]*$/.test(value)) {
            return; // Salir si contiene caracteres no numéricos
        }

        // Convertir a número solo si el campo está en la lista
        const camposNumericos = ["altaS_CORR"];
        const newValue: string | number = camposNumericos.includes(name)
            ? parseFloat(value) || 0
            : value;

        // Actualizar estado
        setBuscar((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);

        resultado = await listaEstadoFirmasActions(Buscar.altaS_CORR);
        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin Resultados",
                text: "El Nº de Alta consultado no se encuentra en este listado.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            resultado = await listaEstadoFirmasActions(0);
            setLoading(false); //Finaliza estado de carga
            return;
        } else {
            paginar(1);
            setLoading(false); //Finaliza estado de carga
        }

    };


    const listaAltasAuto = async () => {
        if (token) {
            if (listaEstadoFirmas.length === 0) {
                setLoading(true);
                const resultado = await listaEstadoFirmasActions(0);
                if (resultado) {
                    setLoading(false);
                }
            }
        }
    };

    useEffect(() => {
        listaAltasAuto();
    }, [listaEstadoFirmasActions]);


    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaEstadoFirmas.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaEstadoFirmas, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Math.ceil(listaEstadoFirmas.length / elementosPorPagina);
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    return (
        <Layout>
            <Helmet>
                <title>Estado Firmas</title>
            </Helmet>
            <MenuAltas />
            <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                <h3 className="form-title fw-semibold border-bottom p-1">Estado Firmas</h3>
                <Row className="border rounded p-2 m-2">

                    <Col md={2}>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label htmlFor="altaS_CORR" className="form-label fw-semibold small">Nº Alta</label>
                                <input
                                    aria-label="altaS_CORR"
                                    type="text"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="altaS_CORR"
                                    placeholder="Ej: 0"
                                    onChange={handleChange}
                                    value={Buscar.altaS_CORR}
                                />
                            </div>
                        </div>
                    </Col>

                    <Col md={5}>
                        <div className="mb-1 mt-4">
                            <Button onClick={handleBuscar}
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                className="mx-1 mb-1">
                                {loading ? (
                                    <>
                                        {" Buscar"}
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="ms-1"
                                        />
                                    </>
                                ) : (
                                    <>
                                        {" Buscar"}
                                        < Search className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                    </>
                                )}
                            </Button>

                        </div>
                    </Col>
                </Row>
                {/* Tabla*/}
                {loading ? (
                    <SkeletonLoader rowCount={elementosPorPagina} />
                ) : (
                    <div className='table-responsive'>
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                                <tr>
                                    <th scope="col" className="text-nowrap">N° Alta</th>
                                    <th scope="col" className="text-nowrap">Id Cargo</th>
                                    <th scope="col" className="text-nowrap">Firmantes</th>
                                    <th scope="col" className="text-nowrap">Estado Firma</th>
                                    <th scope="col" className="text-nowrap">Id movimiento</th>
                                    <th scope="col" className="text-nowrap">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elementosActuales.map((Lista, index) => {
                                    // const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                    return (
                                        <tr key={index}>
                                            <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                            <td className="text-nowrap">{Lista.idcargo}</td>
                                            <td className="text-nowrap">
                                                {
                                                    Lista.jerarquia === 1 ? "Unindad de Inventario" :
                                                        Lista.jerarquia === 2 ? "Departamento de Finanzas" :
                                                            Lista.jerarquia === 3 ? "Unidad de Abastecimiento" : "Desconocido"
                                                }
                                            </td>
                                            <td className="text-nowrap">
                                                {
                                                    Lista.firmado === 0 ? <p className="bg-warning text-white text-center p-1">Pendiente</p> :
                                                        Lista.firmado === 1 ? <p className="bg-success text-white text-center p-1">Firmado</p> :
                                                            Lista.firmado === 2 ? <p className="bg-success text-white text-center p-1">Rechazado</p> : "Desconocido"
                                                }
                                            </td>
                                            <td className="text-nowrap">{Lista.imovimiento}</td>
                                            <td style={{
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 2
                                            }}>
                                                {Lista.firmado === 1 ? (

                                                    <Button
                                                        type="button"
                                                    // onChange={() => setSeleccionaFilas(indexReal)}
                                                    >
                                                        Ver
                                                        < Eye className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                                    </Button>

                                                ) : (
                                                    <Button
                                                        type="button"
                                                        disabled
                                                    // onChange={() => setSeleccionaFilas(indexReal)}
                                                    >
                                                        Ver
                                                        < Eye className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                                    </Button>
                                                )}

                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="paginador-container">
                    <Pagination className="paginador-scroll">
                        <Pagination.First onClick={() => paginar(1)} disabled={paginaActual === 1} />
                        <Pagination.Prev onClick={() => paginar(paginaActual - 1)} disabled={paginaActual === 1} />
                        {Array.from({ length: totalPaginas }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === paginaActual}
                                onClick={() => paginar(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => paginar(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
                        <Pagination.Last onClick={() => paginar(totalPaginas)} disabled={paginaActual === totalPaginas} />
                    </Pagination>
                </div>
            </div>

            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="xl">
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Estado Firmas</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form >

                        {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                        <BlobProvider document={
                            <DocumentoEstadodFirmaPDF
                                row={filasSeleccionadasPDF}
                            />
                        }>
                            {({ url, loading }) =>
                                loading ? (
                                    <p>Generando vista previa...</p>
                                ) : (
                                    <iframe
                                        src={url ? `${url}` : ""}
                                        title="Vista Previa del PDF"
                                        style={{
                                            width: "100%",
                                            height: "900px",
                                            border: "none"
                                        }}
                                    ></iframe>
                                )
                            }
                        </BlobProvider>
                    </form>
                </Modal.Body>
            </Modal >
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaEstadoFirmas: state.listaEstadoFirmasReducers.listaEstadoFirmas,
    objeto: state.validaApiLoginReducers,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});


export default connect(mapStateToProps, {
    listaEstadoFirmasActions,
})(EstadoFirmas);

