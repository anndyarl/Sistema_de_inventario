import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Pagination, Form, Modal, Col, Row, Collapse, Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
// import Swal from "sweetalert2";
// import SignatureCanvas from 'react-signature-canvas';
// import { pdf } from "@react-pdf/renderer";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { RootState } from "../../../store";
import MenuAltas from "../../Menus/MenuAltas";
import Layout from "../../../containers/hocs/layout/Layout";
import DocumentoPDF from './DocumentoPDF';
import { BlobProvider, /*PDFDownloadLink*/ } from '@react-pdf/renderer';
import { Helmet } from "react-helmet-async";
import { Objeto } from "../../Navegacion/Profile";
import { Eraser, FiletypePdf, Search } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { obtenerfirmasAltasActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerfirmasAltasActions";
import { obtenerUnidadesActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerUnidadesActions";
import { listaAltasRegistradasActions } from "../../../redux/actions/Altas/AnularAltas/listaAltasRegistradasActions";
import { registrarBienesBajasActions } from "../../../redux/actions/Bajas/ListadoGeneral/registrarBienesBajasActions";

interface FechasProps {
    fDesde: string;
    fHasta: string;
}
export interface ListaAltas {
    aF_CLAVE: number,
    ninv: string,
    altaS_CORR: number,
    serv: string,
    dep: string,
    esp: string,
    ncuenta: string,
    marca: string,
    modelo: string,
    serie: string,
    estado: string,
    precio: number,
    fechA_ALTA: string,
    nrecep: string
}
export interface DatosFirmas {
    nombre: string,
    rut: string,
    estabL_CORR: string,
    estado: string,
    firma: string,
    rol: string,
    apellidO_MATERNO: string,
    apellidO_PATERNO: string,
    nombrE_USUARIO: string,
    descripcion: string,
    url: string,
    iD_UNIDAD: number
}
interface Unidades {
    iD_UNIDAD: number,
    nombre: string
}
interface DatosBajas {
    listaAltasRegistradas: ListaAltas[];
    comboUnidades: Unidades[];
    obtenerUnidadesActions: () => Promise<boolean>;
    listaAltasRegistradasActions: (fDesde: string, fHasta: string, establ_corr: number, altasCorr: number, af_codigo_generico: string) => Promise<boolean>;
    obtenerfirmasAltasActions: () => Promise<boolean>;
    datosFirmas: DatosFirmas[];
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
    nPaginacion: number; //número de paginas establecido desde preferencias
}

const FirmarAltas: React.FC<DatosBajas> = ({ listaAltasRegistradasActions, obtenerfirmasAltasActions, listaAltasRegistradas, token, isDarkMode, datosFirmas, nPaginacion, objeto }) => {
    const [loading, setLoading] = useState(false);
    const [__, setIsDisabled] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    //-------------Modal-------------//
    // const [mostrarModal, setMostrarModal] = useState<number | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    // const [filaActiva, setFilaActiva] = useState<listaAltasRegistradas | null>(null);
    //------------Fin Modal----------//   
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [error, setError] = useState<Partial<FechasProps> & {}>({});
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = nPaginacion;

    const filasSeleccionadasPDF = listaAltasRegistradas.filter((_, index) =>
        filasSeleccionadas.includes(index.toString())
    );
    // const sigCanvas = useRef<SignatureCanvas>(null);
    // const [isSigned, setIsSigned] = useState(false);
    // const [signatureImage, setSignatureImage] = useState<string | undefined>();
    // const [fechaDescarga, setfechaDescarga] = useState<string | undefined>();

    // const clearSignature = () => {
    //     if (sigCanvas.current) {
    //         sigCanvas.current.clear();
    //         setIsSigned(false);
    //     }
    // };

    // const handleSignatureEnd = () => {
    //     setIsSigned(sigCanvas.current ? !sigCanvas.current.isEmpty() : false);
    // };
    const [Inventario, setInventario] = useState({
        fDesde: "",
        fHasta: "",
        altaS_CORR: 0,
        af_codigo_generico: ""
    });

    const [AltaInventario, setAltaInventario] = useState({
        unidadAdministrativa: null,
        ajustarFirma: false,
        titularInventario: false,
        subroganteInventario: false,
        finanzas: false,
        titularFinanzas: false,
        subroganteFinanzas: false,
        administrativa: false,
        titularDemandante: false,
        subroganteDemandante: false,
        firmanteInventario: "",
        firmanteFinanzas: "",
        visadoInventario: "",
        visadoFinanzas: ""
    });


    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        if (Inventario.fDesde > Inventario.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Validación específica para af_codigo_generico: solo permitir números
        if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
            return; // Salir si contiene caracteres no numéricos
        }

        // Convertir a número solo si el campo está en la lista
        const camposNumericos = ["altaS_CORR"];
        const newValue: string | number = camposNumericos.includes(name)
            ? parseFloat(value) || 0
            : value;

        // Actualizar estado
        setInventario((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    function detectarTipo(base64: string): string {
        if (base64.startsWith("/9j/")) return "jpeg";
        if (base64.startsWith("iVBOR")) return "png";
        if (base64.startsWith("R0lGOD")) return "gif";
        return "png"; // fallback
    }
    const handleCheck = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        // Copia del estado actual
        const prev = structuredClone(AltaInventario);
        const updatedState = { ...prev, [name]: checked };

        if (name === "ajustarFirma" && !checked) {
            const cleanedState = {
                ...updatedState,
                finanzas: false,
                administrativa: false,
                titularInventario: false,
                subroganteInventario: false,
                titularFinanzas: false,
                subroganteFinanzas: false,
                titularDemandante: false,
                subroganteDemandante: false,
                firmanteInventario: "",
                firmanteFinanzas: "",
                visadoInventario: "",
                visadoFinanzas: "",
            };
            setIsDisabled(false);
            setIsExpanded(true);
            setAltaInventario(cleanedState);
            return;
        }


        let firmanteInventario = prev.firmanteInventario || "";
        let firmanteFinanzas = prev.firmanteFinanzas || "";
        let visadoInventario = prev.visadoInventario || "";
        let visadoFinanzas = prev.visadoFinanzas || "";

        for (const firma of datosFirmas) {

            const nombreCompleto = `${firma.nombre} ${firma.apellidO_PATERNO} ${firma.apellidO_MATERNO}`;

            const FIRMA = `data:image/${detectarTipo};base64,${firma.firma}`;
            console.log("FIRMA", FIRMA)
            // const FIRMA = `${firma.firma}`;
            if (firma.iD_UNIDAD === 1) {
                if (name === "titularInventario" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablicimiento.toString()) {
                    firmanteInventario = nombreCompleto;
                    visadoInventario = FIRMA;
                    updatedState.subroganteInventario = false;
                }
                if (name === "subroganteInventario" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablicimiento.toString()) {
                    firmanteInventario = nombreCompleto;
                    visadoInventario = FIRMA;
                    updatedState.titularInventario = false;
                }
            }

            if (firma.iD_UNIDAD === 2) {
                if (name === "titularFinanzas" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablicimiento.toString()) {
                    firmanteFinanzas = nombreCompleto;
                    visadoFinanzas = FIRMA;
                    updatedState.subroganteFinanzas = false;
                }
                if (name === "subroganteFinanzas" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablicimiento.toString()) {
                    firmanteFinanzas = nombreCompleto;
                    visadoFinanzas = FIRMA;
                    updatedState.titularFinanzas = false;
                }
            }
        }

        updatedState.firmanteInventario = firmanteInventario;
        updatedState.firmanteFinanzas = firmanteFinanzas;
        updatedState.visadoInventario = visadoInventario;
        updatedState.visadoFinanzas = visadoFinanzas;
        setIsDisabled(false);
        setIsExpanded(true);
        setAltaInventario(updatedState);
    }, [AltaInventario, datosFirmas, objeto]);

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);

        if (Inventario.fDesde != "" || Inventario.fHasta != "") {
            if (validate()) {
                resultado = await listaAltasRegistradasActions(Inventario.fDesde, Inventario.fHasta, objeto.Roles[0].codigoEstablicimiento, Inventario.altaS_CORR, Inventario.af_codigo_generico);
            }
        }
        else {
            resultado = await listaAltasRegistradasActions("", "", objeto.Roles[0].codigoEstablicimiento, Inventario.altaS_CORR, Inventario.af_codigo_generico);
        }

        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin Resultados",
                text: "El Nº de Inventario consultado no se encuentra en este listado.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            resultado = await listaAltasRegistradasActions("", "", objeto.Roles[0].codigoEstablicimiento, 0, "");
            setLoading(false); //Finaliza estado de carga
            return;
        } else {
            paginar(1);
            setLoading(false); //Finaliza estado de carga
        }

    };

    const handleLimpiar = () => {
        setInventario((prevInventario) => ({
            ...prevInventario,
            fDesde: "",
            fHasta: "",
            altaS_CORR: 0,
            af_codigo_generico: ""
        }));
    };

    const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            if (datosFirmas.length === 0) { obtenerfirmasAltasActions(); }
            setFilasSeleccionadas(
                elementosActuales.map((_, index) =>
                    (indicePrimerElemento + index).toString()
                )
            );
        } else {
            setFilasSeleccionadas([]);
        }
    };

    const setSeleccionaFilas = (index: number) => {
        if (datosFirmas.length === 0) { obtenerfirmasAltasActions(); }
        setFilasSeleccionadas((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
    };

    const listaAltasAuto = async () => {
        if (token) {
            if (listaAltasRegistradas.length === 0) {
                setLoading(true);
                const resultado = await listaAltasRegistradasActions("", "", objeto.Roles[0].codigoEstablicimiento, 0, "");
                if (resultado) {
                    setLoading(false);
                }
                // else {
                //   Swal.fire({
                //     icon: "error",
                //     title: "Error",
                //     text: `Error en la solicitud. Por favor, intente nuevamente.`,
                //     background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                //     color: `${isDarkMode ? "#ffffff" : "000000"}`,
                //     confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                //     customClass: {
                //       popup: "custom-border", // Clase personalizada para el borde
                //     }
                //   });
                // }
            }
        }
    };

    useEffect(() => {
        listaAltasAuto();
    }, [listaAltasRegistradasActions, token, listaAltasRegistradas.length, isDarkMode]);

    // const setSeleccionaFila = (index: number) => {
    //     setMostrarModal(index); //Abre modal del indice seleccionado
    //     if (datosFirmas.length === 0) { obtenerfirmasAltasActions(); }
    //     if (comboUnidades.length === 0) { obtenerUnidadesActions(); }
    //     setFilasSeleccionadas(prev =>
    //         prev.includes(index.toString())
    //             ? prev.filter(rowIndex => rowIndex !== index.toString())
    //             : [...prev, index.toString()]
    //     );
    // };

    // const handleCerrarModal = (index: number) => {
    //     setFilasSeleccionadas((prevSeleccionadas) =>
    //         prevSeleccionadas.filter((fila) => fila !== index.toString())
    //     );
    // setMostrarModal(null); //Cierra modal del indice seleccionado   
    // setSignatureImage("");// Limpia la firma
    // };

    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaAltasRegistradas.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaAltasRegistradas, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Math.ceil(listaAltasRegistradas.length / elementosPorPagina);
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    // const handleDescargarPDF = async (fila: any) => {
    //     const fecha = Date.now();
    //     const fechaDescarga = new Date(fecha).toLocaleString('es-CL');
    //     setfechaDescarga(fechaDescarga);// Asigna la imagen al estado para poder renderizarlo
    //     const blob = await pdf(<DocumentoPDF row={fila} firma={signatureImage} fechaDescarga={fechaDescarga} AltaInventario={AltaInventario} />).toBlob();
    //     const link = document.createElement("a");
    //     link.href = URL.createObjectURL(blob);
    //     link.download = `Firma_Alta_${fila?.aF_CLAVE}.pdf`;

    //     link.click();
    // };


    return (
        <Layout>
            <Helmet>
                <title>Firmar Altas</title>
            </Helmet>
            <MenuAltas />
            <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                <h3 className="form-title fw-semibold border-bottom p-1">Firmar Altas</h3>
                <Row className="border rounded p-2 m-2">
                    <Col md={3}>
                        <div className="mb-2">
                            <div className="flex-grow-1 mb-2">
                                <label htmlFor="fDesde" className="form-label fw-semibold small">Desde</label>
                                <div className="input-group">
                                    <input
                                        aria-label="Fecha Desde"
                                        type="date"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fDesde ? "is-invalid" : ""}`}
                                        name="fDesde"
                                        onChange={handleChange}
                                        value={Inventario.fDesde}
                                    />
                                </div>
                                {error.fDesde && <div className="invalid-feedback d-block">{error.fDesde}</div>}
                            </div>

                            <div className="flex-grow-1">
                                <label htmlFor="fHasta" className="form-label fw-semibold small">Hasta</label>
                                <div className="input-group">
                                    <input
                                        aria-label="Fecha Hasta"
                                        type="date"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fHasta ? "is-invalid" : ""}`}
                                        name="fHasta"
                                        onChange={handleChange}
                                        value={Inventario.fHasta}
                                    />
                                </div>
                                {error.fHasta && <div className="invalid-feedback d-block">{error.fHasta}</div>}

                            </div>
                            <small className="fw-semibold">Filtre los resultados por fecha de alta.</small>
                        </div>
                    </Col>

                    <Col md={2}>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label htmlFor="af_codigo_generico" className="form-label fw-semibold small">Nº Inventario</label>
                                <input
                                    aria-label="af_codigo_generico"
                                    type="text"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="af_codigo_generico"
                                    placeholder="Ej: 1000000008"
                                    onChange={handleChange}
                                    value={Inventario.af_codigo_generico}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="altaS_CORR" className="form-label fw-semibold small">Nº Alta</label>
                                <input
                                    aria-label="altaS_CORR"
                                    type="text"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="altaS_CORR"
                                    placeholder="Ej: 0"
                                    onChange={handleChange}
                                    value={Inventario.altaS_CORR}
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
                            <Button onClick={handleLimpiar}
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                className="mx-1 mb-1">
                                Limpiar
                                <Eraser className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                            </Button>
                        </div>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end">
                    {filasSeleccionadas.length > 0 ? (
                        <>
                            <Button
                                onClick={() => setMostrarModal(true)}
                                disabled={listaAltasRegistradas.length === 0}
                                variant={isDarkMode ? "secondary" : "primary"}
                                className="mx-1 mb-1"
                            >
                                Exportar
                                <FiletypePdf
                                    className="flex-shrink-0 h-5 w-5 ms-1"
                                    aria-hidden="true"
                                />

                            </Button>

                        </>
                    ) : (
                        <strong className="alert alert-dark border m-1 p-2">
                            No hay filas seleccionadas
                        </strong>
                    )}
                </div>
                {/* Tabla*/}
                {loading ? (
                    <SkeletonLoader rowCount={elementosPorPagina} />
                ) : (
                    <div className='table-responsive'>
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                                <tr>
                                    <th style={{
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 0,

                                    }}>
                                        <Form.Check
                                            className="check-danger"
                                            type="checkbox"
                                            onChange={handleSeleccionaTodos}
                                            checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                        />
                                    </th>
                                    <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                                    <th scope="col" className="text-nowrap text-center">N° Alta</th>
                                    <th scope="col" className="text-nowrap text-center">Fecha Alta</th>
                                    <th scope="col" className="text-nowrap text-center">Servicio</th>
                                    <th scope="col" className="text-nowrap text-center">Dependencia</th>
                                    <th scope="col" className="text-nowrap text-center">Especie</th>
                                    <th scope="col" className="text-nowrap text-center">N° Cuenta</th>
                                    <th scope="col" className="text-nowrap text-center">Marca</th>
                                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                                    <th scope="col" className="text-nowrap text-center">Serie</th>
                                    <th scope="col" className="text-nowrap text-center">Estado</th>
                                    <th scope="col" className="text-nowrap text-center">Precio</th>
                                    <th scope="col" className="text-nowrap text-center">N° Recepcion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elementosActuales.map((Lista, index) => {
                                    const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                    return (
                                        <tr key={index}>
                                            <td style={{
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 2,

                                            }}>
                                                {/* <Form.Check
                                                type="checkbox"
                                                onChange={() => setSeleccionaFila(index)}
                                                checked={filasSeleccionadas.includes(
                                                    (indicePrimerElemento + index).toString()
                                                )}
                                            /> */}
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={() => setSeleccionaFilas(indexReal)}
                                                    checked={filasSeleccionadas.includes(indexReal.toString())}
                                                />
                                            </td>
                                            <td className="text-nowrap">{Lista.ninv}</td>
                                            <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                            <td className="text-nowrap">{Lista.fechA_ALTA}</td>
                                            <td className="text-nowrap">{Lista.serv}</td>
                                            <td className="text-nowrap">{Lista.dep}</td>
                                            <td className="text-nowrap">{Lista.esp}</td>
                                            <td className="text-nowrap">{Lista.ncuenta}</td>
                                            <td className="text-nowrap">{Lista.marca}</td>
                                            <td className="text-nowrap">{Lista.modelo}</td>
                                            <td className="text-nowrap">{Lista.serie}</td>
                                            <td className="text-nowrap">{Lista.estado}</td>
                                            <td className="text-nowrap">
                                                ${(Lista.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            <td className="text-nowrap">{Lista.nrecep}</td>
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

            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="lg">
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Firmar Alta</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form >
                        <div className="d-flex justify-content-between p-2">
                            <div className="d-flex align-items-center  rounded p-2 mb-3 shadow-sm">
                                <p className="fw-semibold mb-0 me-3">
                                    Ajustar firma:
                                </p>
                                <Form.Check
                                    onChange={handleCheck}
                                    name="ajustarFirma"
                                    type="checkbox"
                                    className="form-switch"
                                    checked={AltaInventario.ajustarFirma}
                                    label=""
                                />
                            </div>
                        </div>

                        <Collapse in={isExpanded} dimension="height">
                            <Row className="m-1 p-3 rounded rounded-4 border">
                                <p className="border-bottom mb-2">Seleccione quienes firmarán el alta</p>
                                {/* Ajustar Firma | Unidad Inventario */}
                                <Col md={6} >
                                    <p className="border-bottom fw-semibold text-center">Unidad Inventario</p>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.ajustarFirma}
                                            name="titularInventario"
                                            type="checkbox"
                                            checked={AltaInventario.titularInventario}
                                        />
                                        <label htmlFor="titularInventario" className="ms-2">Titular Inventario</label>
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.ajustarFirma}
                                            name="subroganteInventario"
                                            type="checkbox"
                                            checked={AltaInventario.subroganteInventario}
                                        />
                                        <label htmlFor="subroganteInventario" className="ms-2">Subrogante Inventario</label>
                                    </div>
                                </Col>

                                {/* Opcional1 | Unidad Finanzas*/}
                                <Col md={6}>
                                    <p className="border-bottom fw-semibold text-center">Departamento de Finanzas</p>
                                    <div className="d-flex">
                                        <label htmlFor="finanzas" className="me-2">Opcional</label>
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.ajustarFirma}
                                            name="finanzas"
                                            type="checkbox"
                                            className="form-switch"
                                            checked={AltaInventario.finanzas}
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.finanzas}
                                            name="titularFinanzas"
                                            type="checkbox"
                                            checked={AltaInventario.titularFinanzas}
                                        />
                                        <label htmlFor="titularFinanzas" className="ms-2">Titular Finanzas</label>
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.finanzas}
                                            name="subroganteFinanzas"
                                            type="checkbox"
                                            checked={AltaInventario.subroganteFinanzas}
                                        />
                                        <label htmlFor="subroganteFinanzas" className="ms-2">Subrogante Finanzas</label>
                                    </div>
                                </Col>

                                {/* Opcional2 | Unidad Administrativa */}
                                {/* <Col md={4}>
                                            <p className="border-bottom fw-semibold text-center">Unidad Administrativa</p>
                                            <div className="d-flex">
                                                <label htmlFor="administrativa" className="me-2">Opcional</label>
                                                <Form.Check
                                                    onChange={handleCheck}
                                                    disabled={!AltaInventario.ajustarFirma}
                                                    name="administrativa"
                                                    type="checkbox"
                                                    className="form-switch"
                                                    checked={AltaInventario.administrativa}
                                                />
                                            </div>

                                            <div className="mb-1">
                                                <label className="fw-semibold">
                                                    Seleccione una Unidad
                                                </label>
                                                <select
                                                    aria-label="unidadAdministrativa"
                                                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                    name="unidadAdministrativa"
                                                    onChange={handleChange}
                                                    disabled={!AltaInventario.administrativa}
                                                >
                                                    <option value="">Seleccionar</option>
                                                    {comboUnidades.map((traeUnidades) => (
                                                        <option key={traeUnidades.iD_UNIDAD} value={traeUnidades.nombre}>
                                                            {traeUnidades.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </Col> */}
                            </Row>
                        </Collapse>
                        {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                        <BlobProvider document={
                            <DocumentoPDF
                                row={filasSeleccionadasPDF}
                                AltaInventario={AltaInventario}
                                firmanteInventario={AltaInventario.firmanteInventario}
                                firmanteFinanzas={AltaInventario.firmanteFinanzas}
                                visadoInventario={AltaInventario.visadoInventario}
                                visadoFinanzas={AltaInventario.visadoFinanzas}
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
                                    // <iframe
                                    //     src={url ? `${url}${isFirefox ? "" : "#toolbar=0&navpanes=0&scrollbar=1"}` : ''}
                                    //     title="Vista Previa del PDF"
                                    //     style={{
                                    //         width: "100%",
                                    //         height: "900px",
                                    //         border: "none",
                                    //         pointerEvents: isFirefox ? "none" : "auto", // Deshabilita interacciones en Firefox
                                    //     }}
                                    // ></iframe>

                                )
                            }
                        </BlobProvider>
                        {/* <div className="mb-3 "> */}
                        {/* <label htmlFor="signature" className="fw-semibold">Ingrese su firma</label>
                                    <div className={`border ${isDarkMode ? "border-secondary" : "border-primary"} rounded p-2`}>
                                        <SignatureCanvas
                                            ref={sigCanvas}
                                            canvasProps={{
                                                className: 'signature-canvas',
                                            }}
                                            backgroundColor={isDarkMode ? '#343a40' : '#f8f9fa'}
                                            penColor={isDarkMode ? '#ffffff' : '#000000'}
                                            onEnd={handleSignatureEnd}
                                        />
                                    </div> */}
                        {/* {filaActiva && (
                                        <PDFDownloadLink
                                            document={<DocumentoPDF row={filaActiva} firma={signatureImage} fechaDescarga={fechaDescarga} AltaInventario={AltaInventario} />}
                                            fileName={`Alta_${filaActiva?.aF_CLAVE}.pdf`}
                                        >
                                            {loading ? (
                                                <button className="btn btn-secondary">Generando PDF...</button>
                                            ) : (
                                                <button className="btn btn-primary">Descargar PDF</button>
                                            )
                                            }
                                        </PDFDownloadLink>
                                    )} */}
                        {/* {error.signature && <div className="text-danger">{error.signature}</div>} */}
                        {/* <div className="mt-2 d-flex justify-content-between">
                                        <Button
                                            type="button"
                                            variant={isDarkMode ? "outline-secondary" : "outline-primary"}
                                            onClick={clearSignature}
                                            disabled={!isSigned}
                                        >
                                            Limpiar firma
                                        </Button>

                                        <Button type="submit" variant={isDarkMode ? "secondary" : "primary"}>
                                            <Pencil className="flex-shrink-0 h-5 w-5 mx-1 ms-0" aria-hidden="true" />
                                            Firmar
                                        </Button>
                                    </div> */}
                        {/* </div> */}
                        {/* <div className="d-flex justify-content-end mb-2">
                                    <button className="btn btn-primary" disabled onClick={() => handleDescargarPDF(fila)}>
                                        Descargar PDF
                                    </button>
                                </div> */}
                    </form>
                </Modal.Body>
            </Modal>
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaAltasRegistradas: state.listaAltasRegistradasReducers.listaAltasRegistradas,
    objeto: state.validaApiLoginReducers,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboUnidades: state.obtenerUnidadesReducers.comboUnidades,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    listaAltasRegistradasActions,
    registrarBienesBajasActions,
    obtenerfirmasAltasActions,
    obtenerUnidadesActions
})(FirmarAltas);
