import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Form, Modal, Col, Row, Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { BlobProvider, /*PDFDownloadLink*/ } from '@react-pdf/renderer';
import { Helmet } from "react-helmet-async";
import { Eraser, Printer, Search } from "react-bootstrap-icons";
import { RootState } from "../../../store";
import Layout from "../../../containers/hocs/layout/Layout";
import MenuAltas from "../../Menus/MenuAltas";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import DocumentoEtiquetasPDF from "./DocumentoEtiquetasPDF";
import ReactDOM from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Objeto } from "../../Navegacion/Profile";
import { quitarEtiquetasActions } from "../../../redux/actions/Altas/ImprimirEtiquetas/quitarEtiquetasActions";
import { obtenerEtiquetasAltasActions } from "../../../redux/actions/Altas/ImprimirEtiquetas/obtenerEtiquetasAltasActions";
interface FechasProps {
    fDesde: string;
    fHasta: string;
}
export interface ListaEtiquetas {
    aF_CODIGO_GENERICO: string;
    aF_CLAVE?: number;
    nrecepcion?: string;
    fechA_RECEPCION?: string;
    altaS_CORR?: number;
    n_FACTURA?: string;
    n_ORDEN_COMPRA?: string;
    fechA_FACTURA?: string;
    iD_GRUPO?: number;
    aF_DESCRIPCION: string;
    aF_UBICACION: string;
    aF_FECHA_ALTA: string;
    aF_NCUENTA: string;
    ctA_NOMBRE?: string;
    origen: string;
    deT_MARCA?: string;
    deT_MODELO?: string;
    deT_SERIE?: string;
    deT_OBS?: string;
    valoR_INGRESO?: number;
    aF_VIDAUTIL?: number;
    proV_RUN?: string;
    proV_NOMBRE?: string;
    qrImage?: string;
}

export interface DatosBajas {
    obtenerEtiquetasAltasActions: (fDesde: string, fHasta: string, establ_corr: number, altasCorr: number, af_codigo_generico: string) => Promise<boolean>;
    quitarEtiquetasActions: (etiquetas: Record<number, any>[]) => Promise<boolean>;
    listaEtiquetas: ListaEtiquetas[];
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
}

const ImprimirEtiqueta: React.FC<DatosBajas> = ({ obtenerEtiquetasAltasActions, quitarEtiquetasActions, listaEtiquetas, token, isDarkMode, objeto }) => {
    const [loading, setLoading] = useState(false);
    const [loadingQuitar, setLoadingQuitar] = useState(false);
    //-------------Modal-------------//
    const [mostrarModal, setMostrarModal] = useState(false);
    //------------Fin Modal----------//
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [error, setError] = useState<Partial<FechasProps> & {}>({});
    const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
    const elementosPorPagina = Paginacion.nPaginacion;

    const [Inventario, setInventario] = useState({
        fDesde: "",
        fHasta: "",
        altaS_CORR: 0,
        af_codigo_generico: ""
    });
    const [listaConQR, setListaConQR] = useState<ListaEtiquetas[]>([]);

    const listaAuto = async () => {
        if (token) {
            setLoading(true);
            if (listaEtiquetas.length === 0) {
                const resultado = await obtenerEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
                if (!resultado) {
                    Swal.fire({
                        icon: "warning",
                        title: "Sin Resultados",
                        text: "No hay registros disponibles para mostrar.",
                        confirmButtonText: "Ok",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
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
        if (listaEtiquetas.length === 0) {
            listaAuto();
        }
    }, [listaEtiquetas]);

    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        if (Inventario.fDesde > Inventario.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Validación específica para af_codigo_generico: solo permitir números
        if (name === "aF_CLAVE" && !/^[0-9]*$/.test(value)) {
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

        setPaginacion((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);

        if (Inventario.fDesde != "" || Inventario.fHasta != "") {
            if (validate()) {
                resultado = await obtenerEtiquetasAltasActions(Inventario.fDesde, Inventario.fHasta, objeto.Roles[0].codigoEstablecimiento, Inventario.altaS_CORR, Inventario.af_codigo_generico);
            }
        }
        else {
            resultado = await obtenerEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, Inventario.altaS_CORR, Inventario.af_codigo_generico);
        }
        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin Resultados",
                text: "No se encontraron resultados para la consulta realizada.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            resultado = await obtenerEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
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
            af_codigo_generico: "",
            altaS_CORR: 0,
            fDesde: "",
            fHasta: ""
        }));
    };

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
        setFilasSeleccionadas((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
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

    const handleGenerar = async () => {
        setLoading(true);

        // Seleccionar los nuevos activos
        const selectedIndices = filasSeleccionadas.map(Number);
        const activosSeleccionados = selectedIndices.map((index) => ({
            aF_CODIGO_GENERICO: listaEtiquetas[index].aF_CODIGO_GENERICO,
            aF_DESCRIPCION: listaEtiquetas[index].aF_DESCRIPCION,
            aF_FECHA_ALTA: listaEtiquetas[index].aF_FECHA_ALTA,
            aF_NCUENTA: listaEtiquetas[index].aF_NCUENTA,
            aF_UBICACION: listaEtiquetas[index].aF_UBICACION,
            origen: listaEtiquetas[index].origen
        }));

        const etiquetasConQR = await Promise.all(
            activosSeleccionados.map(async (item) => {

                const valueQR =
                    `Cod. Bien: ${item.aF_CODIGO_GENERICO}\n` +
                    `Nom. Bien: ${item.aF_DESCRIPCION}\n` +
                    `F. Alta: ${item.aF_FECHA_ALTA}\n` +
                    `Cta. Contable: ${item.aF_NCUENTA}\n` +
                    `Origen: ${item.origen.charAt(0).toUpperCase() + item.origen.slice(1).toLocaleLowerCase()}\n` +
                    `${import.meta.env.VITE_CSRF_INFO_PDF}${item.aF_CODIGO_GENERICO}`;
                const qrImage = await generateQRCodeBase64(valueQR);
                return { ...item, qrImage };
            })
        );


        setListaConQR(etiquetasConQR);

        // Muestra modal y finaliza la carga
        setMostrarModal(true);
        setLoading(false);
    };

    const handleQuitar = async () => {
        const selectedIndices = filasSeleccionadas.map(Number);
        const result = await Swal.fire({
            icon: "warning",
            title: "Quitar",
            text: "Confirme para quitar las etiquetas seleccionadas",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Confirmar y Quitar",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
            customClass: {
                popup: "custom-border", // Clase personalizada para el borde
            }
        });

        if (result.isConfirmed) {
            setLoadingQuitar(true);
            // Crear un array de objetos con aF_CLAVE y nombre
            const Formulario = selectedIndices.map((activo) => ({
                aF_CLAVE: Number(listaEtiquetas[activo].aF_CLAVE),
            }));

            const resultado = await quitarEtiquetasActions(Formulario);
            if (resultado) {
                Swal.fire({
                    icon: "success",
                    title: "Quitadas del listado",
                    text: "Se han quitado de la lista correctamente.",
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                    customClass: {
                        popup: "custom-border", // Clase personalizada para el borde
                    }
                });

                setLoadingQuitar(false);
                handleBuscar();
                setFilasSeleccionadas([]);
                obtenerEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
            } else {
                Swal.fire({
                    icon: "error",
                    title: ":'(",
                    text: "Hubo un problema al quitar la etiquetas",
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                    customClass: {
                        popup: "custom-border", // Clase personalizada para el borde
                    }
                });
                setLoadingQuitar(false);
            }

        }

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
                <title>Imprimir Etiquetas</title>
            </Helmet>
            <MenuAltas />
            <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                <h3 className="form-title fw-semibold border-bottom p-1">Imprimir Etiquetas</h3>
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
                                        max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
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
                                        max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
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

                    {/* Columna 5: Botones de Acción */}
                    <Col md={1}>
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

                            <Button onClick={handleLimpiar} variant={`${isDarkMode ? "secondary" : "primary"}`} className="w-100">
                                Limpiar
                                <Eraser className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row className="g-2">
                    {/* Columna 1: Tamaño de página */}
                    <Col lg={8} md={6} sm={12}>
                        {listaEtiquetas.length > 10 && (
                            <div className="d-flex align-items-center justify-content-lg-start justify-content-center">
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
                                    {[10, 20, 30, listaEtiquetas.length].map((val) => (
                                        <option key={val} value={val}>
                                            {val}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </Col>

                    {filasSeleccionadas.length > 0 ? (
                        <>
                            {/* Botón quitar del Listado */}
                            <Col lg={2} md={6} sm={12}>
                                <div className="d-flex justify-content-lg-end justify-content-end">
                                    <Button
                                        variant="danger"
                                        onClick={handleQuitar}
                                        disabled={loadingQuitar}
                                        className="w-100 w-lg-auto d-flex align-items-center justify-content-center"
                                    >
                                        {loadingQuitar ? (
                                            <>
                                                {" Quitar"}
                                                <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                            </>
                                        ) : (
                                            <>
                                                {"Quitar"}
                                                <span className="badge bg-light text-dark mx-2">
                                                    {filasSeleccionadas.length}
                                                </span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Col>

                            {/* Botón Generar Etiqueta */}
                            <Col lg={2} md={12} sm={12}>
                                <div className="d-flex justify-content-lg-end justify-content-end">
                                    <Button
                                        variant={isDarkMode ? "secondary" : "primary"}
                                        onClick={handleGenerar}
                                        disabled={listaEtiquetas.length === 0}
                                        className="w-100 w-lg-auto d-flex align-items-center justify-content-center"
                                    >
                                        {loading ? (
                                            <>
                                                {" Generar"}
                                                <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                            </>
                                        ) : (
                                            <>
                                                {"Generar"}
                                                <Printer className="flex-shrink-0 h-5 w-5 mx-2" aria-hidden="true" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Col>
                        </>
                    ) : (
                        <>
                            {/* Mensaje */}
                            <Col>
                                <div className="d-flex justify-content-lg-end justify-content-end">
                                    <strong className="alert alert-dark border p-2 mb-1 ">
                                        No hay filas seleccionadas
                                    </strong>
                                </div>
                            </Col>
                        </>
                    )}
                </Row>

                {/* Tabla */}
                {loading ? (
                    <SkeletonLoader rowCount={elementosPorPagina} />
                ) : (
                    <div className='table-responsive'>
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead className={` sticky-top z-0  ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                                <tr >
                                    <th style={{
                                        position: 'sticky',
                                        left: 0
                                    }}>
                                        <Form.Check
                                            className="check-danger"
                                            type="checkbox"
                                            onChange={handleSeleccionaTodos}
                                            checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                        />
                                    </th>

                                    {/* <th scope="col" className="text-nowrap">Estado</th> */}
                                    <th scope="col" className="text-nowrap">Nº Inventario</th>
                                    <th scope="col" className="text-nowrap">N° Alta</th>
                                    <th scope="col" className="text-nowrap">Descripción</th>
                                    <th scope="col" className="text-nowrap">Fecha Alta</th>
                                    <th scope="col" className="text-nowrap">Nº Cuenta</th>
                                    <th scope="col" className="text-nowrap">Ubicación</th>
                                    <th scope="col" className="text-nowrap">Origen</th>
                                    <th scope="col" className="text-nowrap">QR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elementosActuales.map((fila, index) => {
                                    const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                    return (
                                        <tr key={index}>
                                            <td style={{
                                                position: 'sticky',
                                                left: 0

                                            }}>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={() => setSeleccionaFilas(indexReal)}
                                                    checked={filasSeleccionadas.includes(indexReal.toString())}
                                                />
                                            </td>
                                            {/* <td className="text-nowrap">
                                                <span className="badge bg-primary  w-100">Impreso</span>
                                            </td> */}
                                            <td className="text-nowrap">{fila.aF_CODIGO_GENERICO}</td>
                                            <td className="text-nowrap">{fila.altaS_CORR}</td>
                                            <td className="text-nowrap">{fila.aF_DESCRIPCION}</td>
                                            <td className="text-nowrap">{fila.aF_FECHA_ALTA}</td>
                                            <td className="text-nowrap">{fila.aF_NCUENTA}</td>
                                            <td className="text-nowrap">{fila.aF_UBICACION}</td>
                                            <td className="text-nowrap">{fila.origen.charAt(0).toUpperCase() + fila.origen.slice(1).toLocaleLowerCase()}</td>
                                            <td className="text-nowrap">
                                                <QRCodeSVG
                                                    value={`Cod. Bien: ${fila.aF_CODIGO_GENERICO} Nom. Bien: ${fila.aF_DESCRIPCION} F. Alta: ${fila.aF_FECHA_ALTA} Cta. Contable: ${fila.aF_NCUENTA} URL: http://localhost:3002/Altas/InfoActivo?codigo_inventario=${fila.aF_CODIGO_GENERICO}`}
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
            </div>

            <Modal
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                dialogClassName="modal-right" size="lg">
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Etiquetas</Modal.Title>
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

        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaEtiquetas: state.obtenerEtiquetasAltasReducers.listaEtiquetas,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    objeto: state.validaApiLoginReducers,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    obtenerEtiquetasAltasActions,
    quitarEtiquetasActions
})(ImprimirEtiqueta);

