import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination, Modal, Col, Row, Button, Spinner, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { connect } from "react-redux";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { RootState } from "../../../store";
import MenuAltas from "../../Menus/MenuAltas";
import Layout from "../../../containers/hocs/layout/Layout";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../../Navegacion/Profile";
import { ArrowClockwise, CheckCircle, Eraser, Eye, FiletypePdf, Pencil, PencilFill, Search } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { listaEstadoActions } from "../../../redux/actions/Altas/EstadoFirmas/listaEstadoActions";
import { obtieneVisadoCompletoActions } from "../../../redux/actions/Altas/EstadoFirmas/obtieneVisadoCompletoActions";
import { listaEstadoVisadoresActions } from "../../../redux/actions/Altas/EstadoFirmas/listaEstadoVisadoresActions";
import { listaAltasRegistradasActions } from "../../../redux/actions/Altas/AnularAltas/listaAltasRegistradasActions";
import { FileSignatureIcon } from "lucide-react";


export interface ListaEstadoFirmas {
    idocumento: number;
    altaS_CORR: number;
    estado: number;
    fecha: string;
}

interface ListaEstadoVisadores {
    id: number;
    idcargo: number;
    nombrecargo: string;
    jerarquia: number;
    firmado: number;
    altaS_CORR: number;
    imovimiento: number;
    firmante: string;
    temails: string;
}

interface ListaAltas {
    aF_CLAVE: number,
    ninv: string,
    altaS_CORR: number,
    aF_NUM_FAC: string,
    aF_OCO_NUMERO_REF: string,
    serv: string,
    dep: string,
    esp: string,
    ncuenta: string,
    marca: string,
    modelo: string,
    serie: string,
    estado: string,
    precio: string,
    fechA_ALTA: string,
    nrecep: string,
    estadO_FIRMA: number;
    idocumento: number;
    usuariO_CREA: string | number;
}
interface DatosBajas {
    listaEstado: ListaEstadoFirmas[];
    listaAltasRegistradas: ListaAltas[];
    listaAltasRegistradasActions: (fDesde: string, fHasta: string, establ_corr: number, altasCorr: number, af_codigo_generico: string) => Promise<boolean>;
    listaEstadoActions: (altasCorr: number, idDocumento: number, establ_corr: number) => Promise<boolean>;
    listaEstadoVisadoresActions: (altasCorr: number) => Promise<boolean>;
    obtieneVisadoCompletoActions: (idocumento: number) => Promise<boolean>;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
    documentoByte64: string;
    listaEstadoVisadores: ListaEstadoVisadores[];
}

const EstadoFirmas: React.FC<DatosBajas> = ({ listaEstadoActions, obtieneVisadoCompletoActions, listaEstadoVisadoresActions, listaAltasRegistradasActions, listaAltasRegistradas, listaEstadoVisadores, listaEstado, token, isDarkMode, documentoByte64, objeto }) => {
    const [loading, setLoading] = useState(false);
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
    const elementosPorPagina = Paginacion.nPaginacion;
    const [mostrarModalEstado, setMostrarModalEstado] = useState(false);
    const [__, setElementoSeleccionado] = useState<ListaEstadoFirmas[]>([]);
    const [_, setEditarCampo] = useState<string | null>(null);
    const [PaginacionModificar, setPaginacionModificar] = useState({ nPaginacionModificar: 10 });
    const elementosPorPaginaModificar = PaginacionModificar.nPaginacionModificar;
    const [paginaActualModificar, setPaginaActualModificar] = useState(1);
    const [mostrarModalModificar, setMostrarModalModificar] = useState(false);

    const [CuerpoDocumentoPDF, setCuerpoDocumentoPDF] = useState("");
    const [Buscar, setBuscar] = useState({
        altaS_CORR: 0,
        idDocumento: 0,
        CuerpoDocumento: ""
    });

    const [InventarioModificar, setInventarioModificar] = useState<ListaAltas[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Solo permitir números
        if ((name === "altaS_CORR" || name === "idDocumento") && !/^[0-9]*$/.test(value)) {
            return; // Salir si contiene caracteres no numéricos
        }

        // Actualizar estado
        setBuscar((prevState) => ({
            ...prevState,
            [name]: value.replace(/^0+/, "")
        }));

        setPaginacion((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        setPaginacionModificar((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);

        resultado = await listaEstadoActions(Buscar.altaS_CORR, Buscar.idDocumento, objeto.Roles[0].codigoEstablecimiento);
        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin Resultados",
                text: "No se encontraron resultados para la consulta realizada.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            resultado = await listaEstadoActions(0, 0, objeto.Roles[0].codigoEstablecimiento);
            setLoading(false); //Finaliza estado de carga
        } else {
            paginar(1);
            setLoading(false); //Finaliza estado de carga
        }
    };

    const handleRefrescar = async () => {
        setLoadingRefresh(true); //Finaliza estado de carga
        const resultado = await listaEstadoActions(0, 0, objeto.Roles[0].codigoEstablecimiento);
        if (!resultado) {
            setLoadingRefresh(false);
        } else {
            paginar(1);
            setLoadingRefresh(false);
        }
    };

    const listaAuto = async () => {
        if (token) {
            if (listaEstado.length === 0) {
                setLoading(true);
                const resultado = await listaEstadoActions(0, 0, objeto.Roles[0].codigoEstablecimiento);
                if (!resultado) {
                    Swal.fire({
                        icon: "warning",
                        title: "Sin Resultados",
                        text: "No hay registros disponibles para mostrar.",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                    setLoading(false);
                }
                else {
                    setLoading(false);
                }
            }
        }
    };

    useEffect(() => {
        // Solo copia cuando el modal está abierto y hay datos nuevos
        if (mostrarModalModificar && listaAltasRegistradas.length > 0) {
            setInventarioModificar(
                listaAltasRegistradas.map(item => ({ ...item }))
            );
        }
        listaAuto();
        if (!documentoByte64) return;
        const tipo = detectarTipo(documentoByte64);
        const visadoBase64 = `data:application/${tipo};base64,${documentoByte64}`;
        setCuerpoDocumentoPDF(visadoBase64);

    }, [
        documentoByte64,
        listaEstado.length,
        listaEstadoVisadores.length,
        mostrarModalModificar,
        listaAltasRegistradas // <-- solo escucha cambios en estos
    ]);
    // useEffect(() => {
    //     const socket = new WebSocket("ws://localhost:5076/ws/notificaciones");

    //     socket.onopen = () => {
    //         console.log("Conectado al WebSocket");

    //         // Enviar el mensaje que tu backend espera
    //         socket.send("solicitar_estado");
    //     };

    //     socket.onmessage = async (event) => {
    //         console.log("Mensaje recibido del WebSocket:", event.data);

    //         if (event.data === "Nueva alta creada...") {
    //             await listaEstadoActions(0, 0, objeto.Roles[0].codigoEstablecimiento);
    //         }
    //     };

    //     socket.onclose = () => {
    //         console.log("🔌 Conexión WebSocket cerrada");
    //     };

    //     socket.onerror = (err) => {
    //         console.error("Error en WebSocket:", err);
    //     };

    //     return () => {
    //         socket.close();
    //     };
    // }, [documentoByte64, objeto.Roles]);

    const handleLimpiar = () => {
        setBuscar((prevInventario) => ({
            ...prevInventario,
            altaS_CORR: 0,
            idDocumento: 0,
        }));
    };

    function detectarTipo(base64: string): string {
        if (base64.startsWith("JVBERi0")) return "pdf";
        if (base64.startsWith("/9j/")) return "jpeg";
        if (base64.startsWith("iVBOR")) return "png";
        if (base64.startsWith("R0lGOD")) return "gif";
        return "png"; // fallback
    };

    const handleObtenerVisado = useCallback((index: number, idocumento: number) => {
        setMostrarModal(true);
        setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));
        obtieneVisadoCompletoActions(idocumento); // solo dispara la acción
    }, []);

    const handleObtenerEstadoVisadores = useCallback((index: number, altaS_CORR: number) => {
        setMostrarModalEstado(true);
        setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));
        listaEstadoVisadoresActions(altaS_CORR); // solo dispara la acción
        // console.log(listaEstadoVisadores);
    }, []);

    const handleAbrirModalModificar = (altaS_CORR: number) => {
        setMostrarModalModificar(true);
        // Ejecuta la acción que actualizará listaAltasRegistradas en el reducer
        listaAltasRegistradasActions("", "", objeto.Roles[0].codigoEstablecimiento, altaS_CORR, "");
        setInventarioModificar(
            listaAltasRegistradas.map(item => ({ ...item }))
        );
        paginarModificar(1);
    };
    const handleBlur = () => {
        setEditarCampo(null);
    };

    const handleCambiaNCuenta = (indexVisible: number, nuevaCuenta: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, ncuenta: nuevaCuenta } : item
            )
        );
    };
    const handleCambiaMarca = (indexVisible: number, nuevaMarca: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, marca: nuevaMarca } : item
            )
        );
    };

    const handleCambiaModelo = (indexVisible: number, nuevaModelo: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, modelo: nuevaModelo } : item
            )
        );
    };

    const handleCambiaSerie = (indexVisible: number, nuevaSerie: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, serie: nuevaSerie } : item
            )
        );
    };

    const handleCambiaPrecio = (indexVisible: number, nuevaPrecio: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, precio: nuevaPrecio } : item
            )
        );
    };


    //Listado estado visadores
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaEstado.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaEstado, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Math.ceil(listaEstado.length / elementosPorPagina);
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    //Listado modificar
    const indiceUltimoElementoModificar = paginaActualModificar * elementosPorPaginaModificar;
    const indicePrimerElementoModificar = indiceUltimoElementoModificar - elementosPorPaginaModificar;
    const elementosActualesModificar = useMemo(
        () => InventarioModificar.slice(indicePrimerElementoModificar, indiceUltimoElementoModificar),
        [InventarioModificar, indicePrimerElementoModificar, indiceUltimoElementoModificar]
    );
    const totalPaginasModificar = Math.ceil(InventarioModificar.length / elementosPorPaginaModificar);
    const paginarModificar = (numeroPaginaModificar: number) => setPaginaActualModificar(numeroPaginaModificar);

    return (
        <Layout>
            <Helmet>
                <title>Estado Firmas</title>
            </Helmet>
            <MenuAltas />
            <div className="table-responsive position-relative z-0 hide-scrollbar" >
                <div style={{ maxHeight: "80vh" }}>
                    <div className={`border border-botom p-2 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                        <h3 className="form-title fw-semibold border-bottom p-1">Estado Firmas</h3>
                        <Row className="border rounded p-2 m-2">
                            <Col lg={2} md={4}>
                                <div className="mb-2">
                                    <div className="mb-2">
                                        <label htmlFor="altaS_CORR" className="form-label fw-semibold small">Nº Alta</label>
                                        <input
                                            aria-label="altaS_CORR"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="altaS_CORR"
                                            placeholder="0"
                                            onChange={handleChange}
                                            maxLength={8}
                                            value={Buscar.altaS_CORR}
                                        />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <div className="mb-2">
                                        <label htmlFor="idDocumento" className="form-label fw-semibold small">Nº Documento</label>
                                        <input
                                            aria-label="idDocumento"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="idDocumento"
                                            placeholder="0"
                                            onChange={handleChange}
                                            maxLength={8}
                                            value={Buscar.idDocumento}
                                        />
                                    </div>
                                </div>
                            </Col>

                            {/* Columna 5: Botones de Acción */}
                            <Col lg={2} md={4}>
                                <div className="d-flex flex-column gap-2 mt-4">
                                    <Button
                                        onClick={handleBuscar}
                                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                                        className="w-100"
                                    // disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                Buscar
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
                                            </>
                                        ) : (
                                            <>
                                                Buscar
                                                <Search className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                            </>
                                        )}
                                    </Button>
                                    <Button onClick={handleRefrescar}
                                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                                        className="w-100">
                                        {loadingRefresh ? (
                                            <>
                                                {" Refrescar "}
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
                                                {" Refrescar "}
                                                <ArrowClockwise className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                            </>
                                        )}
                                    </Button>

                                    <Button onClick={handleLimpiar} variant={`${isDarkMode ? "secondary" : "primary"}`} className="w-100">
                                        Limpiar
                                        <Eraser className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between mb-1">
                            {/* Tamaño de página */}
                            <Col xs={12} lg="auto">
                                {listaEstado.length > 10 && (
                                    <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                                        <label htmlFor="nPaginacion" className="form-label fw-semibold mb-0 me-2">
                                            Tamaño de página:
                                        </label>
                                        <select
                                            aria-label="Seleccionar tamaño de página"
                                            className={`form-select form-select-sm w-auto rounded-1 ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="nPaginacion"
                                            onChange={handleChange}
                                            value={Paginacion.nPaginacion}
                                        >
                                            {[10, 15, 20, 25, 50, 100].map((val) => (
                                                <option key={val} value={val}>
                                                    {val}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </Col>
                        </Row>
                        {listaEstado.length > 0 ? (
                            <>
                                {/* Tabla*/}
                                {loading || loadingRefresh ? (
                                    <SkeletonLoader rowCount={elementosPorPagina} />
                                ) : (
                                    <div className="table-responsive">
                                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                                            <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                                                <tr>
                                                    <th scope="col" className="text-center">N° DOCUMENTO</th>
                                                    <th scope="col" className="text-center">Nº Alta</th>
                                                    <th scope="col" className="text-center">Estado Solicitud</th>
                                                    <th scope="col" className="text-center">Última Actualización</th>
                                                    <th scope="col" className="text-start">Acción</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {elementosActuales.map((Lista, index) => {
                                                    // const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                                    return (
                                                        <tr key={index}>
                                                            <td className="text-nowrap text-center">{Lista.idocumento}</td>
                                                            <td className="text-nowrap text-center">{Lista.altaS_CORR}</td>
                                                            <td className="text-center w-30">
                                                                <Button
                                                                    onClick={() => handleObtenerEstadoVisadores(index, Lista.altaS_CORR)}
                                                                    variant="light"
                                                                    size="sm"
                                                                    className={`rounded border-0 fw-semibold  
                                                                  ${Lista.estado === 0 ? "bg-warning text-white" :
                                                                            Lista.estado === 1 ? "bg-success text-white" :
                                                                                Lista.estado === 2 ? "bg-danger text-white" : "bg-secondary text-white"}`}
                                                                >
                                                                    {Lista.estado === 0 && "Enviada"}
                                                                    {Lista.estado === 1 && "Firmada"}
                                                                    {Lista.estado === 2 && "Rechazada"}
                                                                    <Eye className="mx-2" width={18} height={18} />
                                                                </Button>
                                                            </td>
                                                            <td className="text-center">{Lista.fecha === "0" ? "-" : Lista.fecha}</td>
                                                            <td
                                                                className="text-nowrap"
                                                                style={{
                                                                    position: 'sticky',
                                                                    left: 0,
                                                                }}>

                                                                {Lista.estado === 1 ? (
                                                                    <>
                                                                        <OverlayTrigger
                                                                            placement="right"
                                                                            overlay={<Tooltip id="tooltip-estado">Documento Firmado</Tooltip>}
                                                                        >
                                                                            <Button type="button" className="fw-semibold mx-1"
                                                                                onClick={() => handleObtenerVisado(index, Lista.idocumento)}
                                                                            >
                                                                                Ver
                                                                                < Eye className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                        <Button type="button" variant="secondary" className="fw-semibold mx-1"
                                                                            onClick={() => handleAbrirModalModificar(Lista.altaS_CORR)}
                                                                        >
                                                                            Modificar
                                                                            <PencilFill className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <Button type="button" disabled>
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
                                <div className="paginador-container position-relative z-0">
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
                            </>
                        ) : (
                            <>
                                <p className={`text-center  pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                                    No hay resultados para mostrar.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/*Modal PDF */}
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="xl">
                <Modal.Header className={`modal-header text-white bg-success`} closeButton>
                    <Modal.Title className="fw-semibold">
                        <CheckCircle className={"flex-shrink-0 h-5 w-5 mx-2 mb-1"} aria-hidden="true" />Documento firmado
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form>
                        {CuerpoDocumentoPDF.includes("application/pdf") ? (
                            <iframe
                                src={CuerpoDocumentoPDF}
                                title="Vista Previa del PDF"
                                style={{
                                    width: "100%",
                                    height: "900px",
                                    border: "none"
                                }}
                            ></iframe>
                        ) : (
                            <img
                                src={CuerpoDocumentoPDF}
                                alt="Documento"
                                style={{
                                    width: "100%",
                                    maxHeight: "900px",
                                    objectFit: "contain"
                                }}
                            />
                        )}
                    </form>
                </Modal.Body>
            </Modal>
            {/*Modal Estado Visadores */}
            <Modal show={mostrarModalEstado} onHide={() => setMostrarModalEstado(false)} size="lg">
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title className="fw-semibold">Estado Visadores</Modal.Title>
                </Modal.Header>
                {/* <div className={` d-flex justify-content-end p-4 border-bottom ${isDarkMode ? "darkModePrincipal" : ""}`}>
                      <Button variant={`${isDarkMode ? "secondary" : "primary"}`} onClick={handleExportPDF}>
                        Exportar a PDF
                      </Button>
                    </div> */}
                <Modal.Body id="pdf-content" className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <div className="table-responsive">
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead>
                                <tr>
                                    <th className="text-nowrap">Nº Alta</th>
                                    <th className="text-nowrap">Firmante</th>
                                    <th className="text-nowrap">Cargo</th>
                                    <th className="text-nowrap">Correo</th>
                                    <th className="text-nowrap">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaEstadoVisadores.length ? (
                                    listaEstadoVisadores.map((item, index) => (
                                        <tr key={index}>

                                            <td>{item.altaS_CORR}</td>
                                            <td>{item.firmante}</td>
                                            <td>{item.nombrecargo}</td>
                                            <td>
                                                <a href={`mailto:${item.temails}`} className="text-blue-500 underline">
                                                    {item.temails}
                                                </a>
                                            </td>
                                            <td>{
                                                item.firmado === 0 ? <p className="badge bg-warning w-100">Pendiente</p>
                                                    : item.firmado === 1 ? <p className="badge bg-success w-100">Firmado</p>
                                                        : item.firmado === 2 ? <p className="badge bg-danger w-100">Rechazado</p>
                                                            : item.firmado === 3 ? <p className="badge bg-danger w-100">Rechazado</p> : <p className="fw-bold">-</p>
                                            }</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="text-center">No hay registros</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal Modificar */}
            <Modal show={mostrarModalModificar} onHide={() => setMostrarModalModificar(false)} fullscreen style={{ top: "3%", width: '100%', maxWidth: "98%", left: "1%", borderRadius: "10px", maxHeight: "90vh" }}>
                <Modal.Header className={`bg-secondary`} style={{ paddingRight: "3%" }} closeButton>
                    <Modal.Title className="fw-semibold text-white">
                        <Pencil className={"flex-shrink-0 h-5 w-5 mx-2 mb-1 "} aria-hidden="true" />Modificar</Modal.Title>
                </Modal.Header>
                <Modal.Body id="pdf-content" className={`me-5 p-4 ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                        <Col xs={12} lg="auto">
                            {listaAltasRegistradas.length > 10 && (
                                <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                                    <label htmlFor="nPaginacionModificar" className="form-label fw-semibold mb-0 me-2">
                                        Tamaño de página:
                                    </label>
                                    <select
                                        aria-label="Seleccionar tamaño de página"
                                        className={`form-select form-select-sm w-auto rounded-1 ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        name="nPaginacionModificar"
                                        onChange={handleChange}
                                        value={PaginacionModificar.nPaginacionModificar}
                                    >
                                        {[10, 15, 20, 25, 50, 100].map((val) => (
                                            <option key={val} value={val}>
                                                {val}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </Col>
                        <Col xs={12} lg={2}>
                            <div className="d-flex justify-content-center justify-content-lg-end w-100">
                                <Button
                                    onClick={() => setMostrarModal(true)}
                                    disabled={listaAltasRegistradas.length === 0}
                                    variant={isDarkMode ? "secondary" : "primary"}
                                    className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-sm-auto"
                                >
                                    {/* <FiletypePdf
                                        className="flex-shrink-0 h-5 w-5 mx-1 mb-1"
                                        aria-hidden="true"
                                    /> */}
                                    Exportar
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <div className="table-responsive">
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead>
                                <tr>
                                    <th scope="col" className="text-nowrap">N° Inventario</th>
                                    <th scope="col" className="text-nowrap">N° Alta</th>
                                    <th scope="col" className="text-nowrap">Fecha Alta</th>
                                    <th scope="col" className="text-nowrap">Nº Factura</th>
                                    <th scope="col" className="text-nowrap">Orden de Compra</th>
                                    <th scope="col" className="text-nowrap">Servicio</th>
                                    <th scope="col" className="text-nowrap">Dependencia</th>
                                    <th scope="col" className="text-nowrap">Especie</th>
                                    <th scope="col" className="text-nowrap">N° Cuenta</th>
                                    <th scope="col" className="text-nowrap">Marca</th>
                                    <th scope="col" className="text-nowrap">Modelo</th>
                                    <th scope="col" className="text-nowrap">Serie</th>
                                    <th scope="col" className="text-nowrap">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elementosActualesModificar.map((Lista, index) => {
                                    const indexReal = indicePrimerElementoModificar + index;
                                    return (
                                        <tr key={index}>
                                            <td className="text-nowrap">{Lista.ninv}</td>
                                            <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                            <td className="text-nowrap">{Lista.fechA_ALTA}</td>
                                            <td className="text-nowrap">{Lista.aF_NUM_FAC}</td>
                                            <td className="text-nowrap">{Lista.aF_OCO_NUMERO_REF}</td>
                                            <td className="text-nowrap">{Lista.serv}</td>
                                            <td className="text-nowrap">{Lista.dep}</td>
                                            <td className="text-nowrap">{Lista.esp}</td>
                                            <td className={`${isDarkMode ? "text-light" : "text-dark"}`} style={{ height: "100%" }} onClick={() => setEditarCampo(indexReal.toString())}>
                                                <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                    <Form.Control
                                                        type="text"
                                                        value={Lista.ncuenta}
                                                        onChange={(e) => handleCambiaNCuenta(index, e.target.value)}
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        maxLength={11}
                                                        placeholder="-"
                                                        pattern="\d*"
                                                        data-index={indexReal}
                                                    />
                                                </div>
                                            </td>
                                            <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                    <Form.Control
                                                        type="text"
                                                        value={Lista.marca}
                                                        onChange={(e) => handleCambiaMarca(index, e.target.value)}
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        maxLength={50}
                                                        placeholder="-"
                                                        pattern="\d*"
                                                        data-index={indexReal}
                                                    />
                                                </div>
                                            </td>
                                            <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                    <Form.Control
                                                        type="text"
                                                        value={Lista.modelo}
                                                        onChange={(e) => handleCambiaModelo(index, e.target.value)}
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        maxLength={50}
                                                        placeholder="-"
                                                        pattern="\d*"
                                                        data-index={indexReal}
                                                    />
                                                </div>
                                            </td>
                                            <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                    <Form.Control
                                                        type="text"
                                                        value={Lista.serie}
                                                        onChange={(e) => handleCambiaSerie(index, e.target.value)}
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        maxLength={20}
                                                        placeholder="-"
                                                        pattern="\d*"
                                                        data-index={indexReal}
                                                    />
                                                </div>
                                            </td>
                                            <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                    <Form.Control
                                                        type="text"
                                                        value={Lista.precio}
                                                        onChange={(e) => handleCambiaPrecio(index, e.target.value)}
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        maxLength={20}
                                                        placeholder="-"
                                                        pattern="\d*"
                                                        data-index={indexReal}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="paginador-container position-relative z-0">
                            <Pagination className="paginador-scroll">
                                <Pagination.First onClick={() => paginarModificar(1)} disabled={paginaActualModificar === 1} />
                                <Pagination.Prev onClick={() => paginarModificar(paginaActualModificar - 1)} disabled={paginaActualModificar === 1} />
                                {Array.from({ length: totalPaginasModificar }, (_, i) => (
                                    <Pagination.Item
                                        key={i + 1}
                                        active={i + 1 === paginaActualModificar}
                                        onClick={() => paginarModificar(i + 1)}
                                    >
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => paginarModificar(paginaActualModificar + 1)} disabled={paginaActualModificar === totalPaginasModificar} />
                                <Pagination.Last onClick={() => paginarModificar(totalPaginasModificar)} disabled={paginaActualModificar === totalPaginasModificar} />
                            </Pagination>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaAltasRegistradas: state.listaAltasRegistradasReducers.listaAltasRegistradas,
    listaEstado: state.listaEstadoReducers.listaEstado,
    listaEstadoVisadores: state.listaEstadoVisadoresReducers.listaEstadoVisadores,
    documentoByte64: state.obtieneVisadoCompletoReducers.documentoByte64,
    objeto: state.validaApiLoginReducers,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode
});


export default connect(mapStateToProps, {
    listaAltasRegistradasActions,
    listaEstadoActions,
    obtieneVisadoCompletoActions,
    listaEstadoVisadoresActions
})(EstadoFirmas);

