import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Form, Modal, Col, Row, Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { BlobProvider, /*PDFDownloadLink*/ } from '@react-pdf/renderer';
import { Helmet } from "react-helmet-async";
import { Eraser, Search } from "react-bootstrap-icons";
import { obtenerEtiquetasAltasActions } from "../../../redux/actions/Altas/ImprimirEtiquetas/obtenerEtiquetasAltasActions";
import { RootState } from "../../../store";
import Layout from "../../../containers/hocs/layout/Layout";
import MenuAltas from "../../Menus/MenuAltas";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import DocumentoEtiquetasPDF from "./DocumentoEtiquetasPDF";
import ReactDOM from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};

export interface ListaEtiquetas {
    aF_CODIGO_LARGO: string,
    aF_DESCRIPCION: string,
    aF_UBICACION: string,
    aF_FECHA_ALTA: string,
    aF_NCUENTA: string
    qrImage?: string
}

export interface DatosBajas {
    obtenerEtiquetasAltasActions: (af_codigo_generico: string) => Promise<boolean>;
    listaEtiquetas: ListaEtiquetas[];
    token: string | null;
    isDarkMode: boolean;
    nPaginacion: number; //número de paginas establecido desde preferencias
}

const ImprimirEtiqueta: React.FC<DatosBajas> = ({ obtenerEtiquetasAltasActions, listaEtiquetas, token, isDarkMode, nPaginacion }) => {
    const [loading, setLoading] = useState(false);
    //-------------Modal-------------//
    const [mostrarModal, setMostrarModal] = useState<number | null>(null);
    //------------Fin Modal----------//
    const [filaSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = nPaginacion;
    const [Inventario, setInventario] = useState({
        af_codigo_generico: ""
    });
    const [listaConQR, setListaConQR] = useState<ListaEtiquetas[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Si el campo es "af_codigo_generico", validamos que solo tenga números
        if (name === "af_codigo_generico") {
            // Solo números usando una expresión regular
            const soloNumeros = /^[0-9]*$/;

            if (!soloNumeros.test(value)) {
                return; // No actualiza el estado si hay caracteres inválidos
            }

            setInventario((prevState) => ({
                ...prevState,
                [name]: value,
            }));
            return;
        }
    };

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);
        resultado = await obtenerEtiquetasAltasActions(Inventario.af_codigo_generico);
        if (!resultado) {
            Swal.fire({
                icon: "error",
                title: ":'(",
                text: "No se encontraron resultados, inténte otro registro.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
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
            af_codigo_generico: ""
        }));
    };
    const fetchBajas = async () => {
        if (token) {
            setLoading(true);
            try {
                const resultado = await obtenerEtiquetasAltasActions(Inventario.af_codigo_generico);
                if (!resultado) {
                    throw new Error("Error al cargar la lista de bajas");
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Error en la solicitud. Por favor, intente nuevamente.`,
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

    useEffect(() => {
        if (listaEtiquetas.length > 0) {
            generarQRs();
        }
    }, [listaEtiquetas]);


    const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
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
        setMostrarModal(index)
        setFilasSeleccionadas((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
    };

    const handleCerrarModal = (index: number) => {
        setFilaSeleccionada((prevSeleccionadas) =>
            prevSeleccionadas.filter((fila) => fila !== index.toString())
        );
        setMostrarModal(null); //Cierra modal del indice seleccionado       
    };
    const generateQRCodeBase64 = (value: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const container = document.createElement("div");
            container.style.position = "fixed";
            container.style.top = "-10000px"; // fuera de la pantalla

            document.body.appendChild(container);

            // Renderizamos el componente QR temporalmente
            ReactDOM.render(<QRCodeSVG value={value} size={100} />, container);

            setTimeout(() => {
                try {
                    const svgElement = container.querySelector("svg");

                    if (!svgElement) {
                        throw new Error("No se encontró el SVG del QR.");
                    }

                    const svgData = new XMLSerializer().serializeToString(svgElement);
                    const img = new Image();

                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        if (ctx) {
                            ctx.drawImage(img, 0, 0);
                            const pngData = canvas.toDataURL("image/png");
                            document.body.removeChild(container);
                            resolve(pngData);
                        } else {
                            document.body.removeChild(container);
                            reject("Error al obtener el contexto del canvas.");
                        }
                    };

                    img.onerror = () => {
                        document.body.removeChild(container);
                        reject("Error al cargar la imagen del QR.");
                    };

                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                } catch (err) {
                    document.body.removeChild(container);
                    reject(err);
                }
            }, 100); // delay leve para asegurarse de que renderice
        });
    };


    const generarQRs = async () => {
        const etiquetasConQR = await Promise.all(
            listaEtiquetas.map(async (item) => {
                const valueQR = `Cod. Bien: ${item.aF_CODIGO_LARGO} Nom. Bien: ${item.aF_DESCRIPCION} F. Alta: ${item.aF_FECHA_ALTA} Cta. Contable: ${item.aF_NCUENTA}`;
                const qrImage = await generateQRCodeBase64(valueQR);
                console.log("QR generado:", qrImage);
                return { ...item, qrImage };
            })
        );

        setListaConQR(etiquetasConQR);
    };


    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaEtiquetas.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaEtiquetas, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Math.ceil(listaEtiquetas.length / elementosPorPagina);
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    return (
        <Layout>
            <Helmet>
                <title>Imprimir etiquetas</title>
            </Helmet>
            <MenuAltas />
            <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                <h3 className="form-title fw-semibold border-bottom p-1">Imprimir etiquetas</h3>
                <Row>
                    <Col md={2}>
                        <div className="mb-1">
                            <label htmlFor="af_codigo_generico" className="fw-semibold">Nº Inventario</label>
                            <input
                                aria-label="af_codigo_generico"
                                type="text"
                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="af_codigo_generico"
                                size={10}
                                placeholder="Eje: 1000000008"
                                onChange={handleChange}
                                value={Inventario.af_codigo_generico}
                            />
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
                                        < Search className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                    </>
                                )}
                            </Button>
                            <Button onClick={handleLimpiar}
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                className="mx-1 mb-1">
                                Limpiar
                                <Eraser className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                            </Button>
                        </div>
                    </Col>
                </Row>
                {loading ? (
                    <SkeletonLoader rowCount={elementosPorPagina} />
                ) : (
                    <div className='table-responsive'>
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                                <tr>
                                    <Form.Check
                                        className="check-danger"
                                        type="checkbox"
                                        onChange={handleSeleccionaTodos}
                                        checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                    />
                                    <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                                    <th scope="col" className="text-nowrap text-center">Descripción</th>
                                    <th scope="col" className="text-nowrap text-center">Fecha Alta</th>
                                    <th scope="col" className="text-nowrap text-center">Nº Cuenta</th>
                                    <th scope="col" className="text-nowrap text-center">Ubicación</th>
                                    <th scope="col" className="text-nowrap text-center">QR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elementosActuales.map((fila, index) => {
                                    const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                    return (
                                        <tr key={index}>
                                            <td style={{
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 2,

                                            }}>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={() => setSeleccionaFilas(indexReal)}
                                                    checked={filasSeleccionadas.includes(indexReal.toString())}
                                                />
                                            </td>
                                            <td className="text-nowrap">{fila.aF_CODIGO_LARGO}</td>
                                            <td className="text-nowrap">{fila.aF_DESCRIPCION}</td>
                                            <td className="text-nowrap">{fila.aF_FECHA_ALTA}</td>
                                            <td className="text-nowrap">{fila.aF_NCUENTA}</td>
                                            <td className="text-nowrap">{fila.aF_UBICACION}</td>
                                            <td className="text-nowrap text-center">
                                                <QRCodeSVG
                                                    value={`Cod. Bien: ${fila.aF_CODIGO_LARGO} Nom. Bien: ${fila.aF_DESCRIPCION} F. Alta: ${fila.aF_FECHA_ALTA} Cta. Contable: ${fila.aF_NCUENTA}`}
                                                    size={50}
                                                    level="H"
                                                />
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
            {
                elementosActuales.map((fila, index) => (
                    <div key={index}>
                        <Modal
                            show={mostrarModal === index}
                            onHide={() => handleCerrarModal(index)}
                            dialogClassName="modal-right" size="lg">
                            <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                                <Modal.Title className="fw-semibold">Consulta Inventario Especies</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                                <form>

                                    {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                                    <BlobProvider document={<DocumentoEtiquetasPDF row={listaConQR} />
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
                        </Modal>
                    </div>
                ))
            }
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaEtiquetas: state.obtenerEtiquetasAltasReducers.listaEtiquetas,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    obtenerEtiquetasAltasActions,
})(ImprimirEtiqueta);

