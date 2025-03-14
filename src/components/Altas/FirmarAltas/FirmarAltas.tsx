import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Pagination, Form, Modal, Col, Row, Collapse, Button } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import SignatureCanvas from 'react-signature-canvas';

// import { pdf } from "@react-pdf/renderer";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { RootState } from "../../../store";
import { registrarBajasActions } from "../../../redux/actions/Bajas/registrarBajasActions";
import { listaBajasActions } from "../../../redux/actions/Bajas/listaBajasActions";
import MenuAltas from "../../Menus/MenuAltas";
import Layout from "../../../containers/hocs/layout/Layout";
import DocumentoPDF from './DocumentoPDF';
import { BlobProvider, /*PDFDownloadLink*/ } from '@react-pdf/renderer';
import { Helmet } from "react-helmet-async";
import { obtenerfirmasAltasActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerfirmasAltasActions";
import { obtenerUnidadesActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerUnidadesActions";
import { Pencil } from "react-bootstrap-icons";


export interface ListaBajas {
    bajaS_CORR: string;
    aF_CLAVE: number;
    id: number;
    vutiL_RESTANTE: number;
    vutiL_AGNOS: number;
    useR_MOD: number;
    saldO_VALOR: number;
    observaciones: string;
    nresolucion: number;
    ncuenta: string;
    iniciaL_VALOR: number;
    fechA_BAJA: string;
    especie: string;
    deP_ACUMULADA: number;
}
interface DatosFirmas {
    nombre: string,
    rut: string,
    estabL_CORR: string,
    estado: string,
    firma: boolean,
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
    listaBajas: ListaBajas[];
    comboUnidades: Unidades[];
    obtenerUnidadesActions: () => Promise<boolean>;
    listaBajasActions: () => Promise<boolean>;
    registrarBajasActions: (activos: { aF_CLAVE: number; bajaS_CORR: string; nresolucion: number; observaciones: string; fechA_BAJA: string }[]) => Promise<boolean>;
    obtenerfirmasAltasActions: () => Promise<boolean>;
    datosFirmas: DatosFirmas[];
    token: string | null;
    isDarkMode: boolean;
}

const FirmarAltas: React.FC<DatosBajas> = ({ listaBajas, listaBajasActions, obtenerfirmasAltasActions, obtenerUnidadesActions, token, isDarkMode, comboUnidades, datosFirmas }) => {
    const [loading, setLoading] = useState(false);
    const [_, setError] = useState<Partial<ListaBajas>>({});
    const [__, setIsDisabled] = useState(true);

    const [isExpanded, setIsExpanded] = useState(false);
    //-------------Modal-------------//
    const [mostrarModal, setMostrarModal] = useState<number | null>(null);
    // const [filaActiva, setFilaActiva] = useState<ListaBajas | null>(null);
    //------------Fin Modal----------//
    const [filaSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;
    const sigCanvas = useRef<SignatureCanvas>(null);
    // const [isSigned, setIsSigned] = useState(false);
    const [signatureImage, setSignatureImage] = useState<string | undefined>();
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
        firmanteFinanzas: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setAltaInventario((prevAltaInventario) => ({
            ...prevAltaInventario,
            [name]: value,
        }));
    }

    const handleCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        setAltaInventario((prev) => {
            const updatedState = { ...prev, [name]: checked };

            if (name === "ajustarFirma" && !checked) {
                return {
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
                };
            }

            let firmanteInventario = prev.firmanteInventario || "";
            let firmanteFinanzas = prev.firmanteFinanzas || "";

            // Buscar firmantes en la lista de datosFirmas
            for (const firma of datosFirmas) {
                const nombreCompleto = `${firma.nombre} ${firma.apellidO_PATERNO} ${firma.apellidO_MATERNO}`;

                // Firmante de Inventario
                if (firma.iD_UNIDAD === 1) {
                    if (name === "titularInventario" && checked && firma.rol === "TITULAR") {
                        firmanteInventario = nombreCompleto;
                        updatedState.subroganteInventario = false;
                    } else if (name === "subroganteInventario" && checked && firma.rol === "SUBROGANTE") {
                        firmanteInventario = nombreCompleto;
                        updatedState.titularInventario = false;
                    }
                }

                // Firmante de Finanzas
                if (firma.iD_UNIDAD === 2) {
                    if (name === "titularFinanzas" && checked && firma.rol === "TITULAR") {
                        firmanteFinanzas = nombreCompleto;
                        updatedState.subroganteFinanzas = false;
                    } else if (name === "subroganteFinanzas" && checked && firma.rol === "SUBROGANTE") {
                        firmanteFinanzas = nombreCompleto;
                        updatedState.titularFinanzas = false;
                    }
                }

                // Si ya encontramos ambos firmantes, salimos del loop
                if (firmanteInventario && firmanteFinanzas) break;
            }

            updatedState.firmanteInventario = firmanteInventario;
            updatedState.firmanteFinanzas = firmanteFinanzas;

            setIsDisabled(false);
            setIsExpanded(true);

            return updatedState;
        });
    }, [setAltaInventario, datosFirmas]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
            const firma = sigCanvas.current.toDataURL('image/png'); //capta la firma dibujada en una imagen
            setSignatureImage(firma);// Asigna la imagen al estado para poder renderizarlo
        } else {
            setError((prev) => ({ ...prev, firma: "La firma es obligatoria." }));
        }
    };

    useEffect(() => {
        const fetchBajas = async () => {
            if (token && listaBajas.length === 0) {
                setLoading(true);
                try {
                    const resultado = await listaBajasActions();
                    if (!resultado) {
                        throw new Error("Error al cargar la lista de bajas");
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `Error en la solicitud. Por favor, recargue nuevamente la página.`,
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBajas();
    }, [listaBajasActions, token, listaBajas.length, isDarkMode]);

    const setSeleccionaFila = (index: number) => {
        setMostrarModal(index); //Abre modal del indice seleccionado
        if (datosFirmas.length === 0) { obtenerfirmasAltasActions(); }
        if (comboUnidades.length === 0) { obtenerUnidadesActions(); }
        setFilaSeleccionada(prev =>
            prev.includes(index.toString())
                ? prev.filter(rowIndex => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
    };

    const handleCerrarModal = (index: number) => {
        setFilaSeleccionada((prevSeleccionadas) =>
            prevSeleccionadas.filter((fila) => fila !== index.toString())
        );
        setMostrarModal(null); //Cierra modal del indice seleccionado   
        setSignatureImage("");// Limpia la firma
    };

    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaBajas.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaBajas, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Math.ceil(listaBajas.length / elementosPorPagina);
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
    const isFirefox = typeof navigator !== "undefined" && navigator.userAgent.includes("Firefox");

    return (
        <Layout>
            <Helmet>
                <title>Firmar Altas</title>
            </Helmet>
            <MenuAltas />
            <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                <h3 className="form-title fw-semibold border-bottom p-1">Firmar Altas</h3>
                {loading ? (
                    <SkeletonLoader rowCount={elementosPorPagina} />
                ) : (
                    <div className='table-responsive'>
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                                <tr>
                                    <th scope="col" className="text-nowrap text-center"></th>
                                    <th scope="col" className="text-nowrap text-center">Codigo</th>
                                    <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                                    <th scope="col" className="text-nowrap text-center">Vida útil</th>
                                    <th scope="col" className="text-nowrap text-center">En años</th>
                                    <th scope="col" className="text-nowrap text-center">N° Cuenta</th>
                                    <th scope="col" className="text-nowrap text-center">Especie</th>
                                    <th scope="col" className="text-nowrap text-center">Depreciación Acumulada</th>

                                </tr>
                            </thead>
                            <tbody>
                                {elementosActuales.map((fila, index) => (
                                    <tr key={indicePrimerElemento + index}>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                onChange={() => setSeleccionaFila(index)}
                                                checked={filaSeleccionada.includes(
                                                    (indicePrimerElemento + index).toString()
                                                )}
                                            />
                                        </td>
                                        <td className="text-nowrap text-center">{fila.bajaS_CORR}</td>
                                        <td className="text-nowrap text-center">{fila.aF_CLAVE}</td>
                                        <td className="text-nowrap text-center">{fila.vutiL_RESTANTE}</td>
                                        <td className="text-nowrap text-center">{fila.vutiL_AGNOS}</td>
                                        <td className="text-nowrap text-center">{fila.ncuenta}</td>
                                        <td className="text-nowrap text-center">{fila.especie}</td>
                                        <td className="text-nowrap text-center">{fila.deP_ACUMULADA}</td>
                                    </tr>
                                ))}
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
            {elementosActuales.map((fila, index) => (
                <div key={index}>
                    <Modal
                        show={mostrarModal === index}
                        onHide={() => handleCerrarModal(index)}
                        dialogClassName="modal-right" size="lg">
                        <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                            <Modal.Title className="fw-semibold">Firmar Alta</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                            <form onSubmit={handleSubmit}>
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

                                    <Button
                                        type="submit"
                                        variant={isDarkMode ? "secondary" : "primary"}
                                        disabled={
                                            !(
                                                (AltaInventario.titularInventario || AltaInventario.subroganteInventario) ||
                                                (AltaInventario.firmanteFinanzas || AltaInventario.unidadAdministrativa)
                                            )
                                        }

                                    >
                                        <Pencil className="flex-shrink-0 h-5 w-5 mx-1 ms-0" aria-hidden="true" />
                                        Firmar
                                    </Button>


                                </div>

                                <Collapse in={isExpanded} dimension="height">
                                    <Row className="m-1 p-3 rounded rounded-4 border">
                                        <p className="border-bottom mb-2">Seleccione quienes firmarán el alta</p>
                                        {/* Ajustar Firma | Unidad Inventario */}
                                        <Col md={4} >
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
                                        <Col md={4}>
                                            <p className="border-bottom fw-semibold text-center">Unidad Finanzas</p>
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
                                        <Col md={4}>
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
                                        </Col>
                                    </Row>
                                </Collapse>
                                {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                                <BlobProvider document={
                                    <DocumentoPDF
                                        row={fila}
                                        firma={signatureImage}
                                        AltaInventario={AltaInventario}
                                        firmanteInventario={AltaInventario.firmanteInventario}
                                        firmanteFinanzas={AltaInventario.firmanteFinanzas}
                                    />
                                }>
                                    {({ url, loading }) =>
                                        loading ? (
                                            <p>Generando vista previa...</p>
                                        ) : (

                                            <iframe
                                                src={url ? `${url}${isFirefox ? "" : "#toolbar=0&navpanes=0&scrollbar=1"}` : ''}
                                                title="Vista Previa del PDF"
                                                style={{
                                                    width: "100%",
                                                    height: "900px",
                                                    border: "none",
                                                    pointerEvents: isFirefox ? "none" : "auto", // Deshabilita interacciones en Firefox
                                                }}
                                            ></iframe>

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
                </div>
            ))
            }
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaBajas: state.datosListaBajasReducers.listaBajas,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboUnidades: state.obtenerUnidadesReducers.comboUnidades,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas
});

export default connect(mapStateToProps, {
    listaBajasActions,
    registrarBajasActions,
    obtenerfirmasAltasActions,
    obtenerUnidadesActions
})(FirmarAltas);

