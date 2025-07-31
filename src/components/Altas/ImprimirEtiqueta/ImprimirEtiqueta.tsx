import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Form, Modal, Col, Row, Button, Spinner, CloseButton } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { BlobProvider, /*PDFDownloadLink*/ } from '@react-pdf/renderer';
import { Helmet } from "react-helmet-async";
import { ArrowCounterclockwise, Eraser, Printer, Search } from "react-bootstrap-icons";
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
import { obtenerReimpresionEtiquetasAltasActions } from "../../../redux/actions/Altas/ImprimirEtiquetas/obtenerReimpresionEtiquetasAltasActions";
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
    obtenerReimpresionEtiquetasAltasActions: (fDesde: string, fHasta: string, establ_corr: number, altasCorr: number, af_codigo_generico: string) => Promise<boolean>;
    quitarEtiquetasActions: (etiquetas: Record<number, any>[]) => Promise<boolean>;
    listaEtiquetas: ListaEtiquetas[];
    listaReimpresionEtiquetas: ListaEtiquetas[];
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
}

const ImprimirEtiqueta: React.FC<DatosBajas> = ({ obtenerEtiquetasAltasActions, obtenerReimpresionEtiquetasAltasActions, quitarEtiquetasActions, listaEtiquetas, listaReimpresionEtiquetas, token, isDarkMode, objeto }) => {
    const [error, setError] = useState<Partial<FechasProps> & {}>({});

    //----------------Lista con Estado Etiqueta N(Lista General) --------------------//
    const [loading, setLoading] = useState(false);
    // const [loadingQuitar, setLoadingQuitar] = useState(false);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
    const elementosPorPagina = Paginacion.nPaginacion;
    const [mostrarModal, setMostrarModal] = useState(false);

    //----------------Lista con Estado Etiqueta S(Reimpresión) --------------------//
    const [loadingReimprimir, setLoadingReimprimir] = useState(false);
    const [filasSeleccionadasReimprimir, setFilasSeleccionadasReimprimir] = useState<string[]>([]);
    const [paginaActual1, setPaginaActual1] = useState(1);
    const [Paginacion1, setPaginacion1] = useState({ nPaginacion1: 10 });
    const elementosPorPagina1 = Paginacion1.nPaginacion1;
    const [mostrarModalLista, setMostrarModalLista] = useState(false);
    const [mostrarModalReimprimir, setMostrarModalReimprimir] = useState(false);
    const [listaQRInicial, setListaQRInicial] = useState<ListaEtiquetas[]>([]);
    const [listaQRReimpresion, setListaQRReimpresion] = useState<ListaEtiquetas[]>([]);
    const [Inventario, setInventario] = useState({
        fDesde: "",
        fHasta: "",
        altaS_CORR: 0,
        af_codigo_generico: ""
    });

    const [Reimprimir, setReimprimir] = useState({
        fDesdeR: "",
        fHastaR: "",
        altaS_CORRr: 0,
        af_codigo_genericoR: ""
    });

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
        if (listaEtiquetas.length === 0) { listaAuto(); }
        if (listaReimpresionEtiquetas.length === 0) {
            obtenerReimpresionEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
        }
    }, [listaEtiquetas, listaReimpresionEtiquetas]);

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
        setReimprimir((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));

        setPaginacion((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));

        setPaginacion1((prevState) => ({
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
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            resultado = await obtenerEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
            setLoading(false); //Finaliza estado de carga
            paginar(1);
            return;
        } else {
            paginar(1);
            setLoading(false); //Finaliza estado de carga
        }

    };

    const handleBuscarReimprimir = async () => {
        let resultado = false;
        setLoadingReimprimir(true);

        if (Reimprimir.fDesdeR != "" || Reimprimir.fHastaR != "") {
            if (validate()) {
                resultado = await obtenerReimpresionEtiquetasAltasActions(Reimprimir.fDesdeR, Reimprimir.fHastaR, objeto.Roles[0].codigoEstablecimiento, Reimprimir.altaS_CORRr, Inventario.af_codigo_generico);
            }
        }
        else {
            resultado = await obtenerReimpresionEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, Reimprimir.altaS_CORRr, Reimprimir.af_codigo_genericoR);
        }
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
            resultado = await obtenerReimpresionEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
            setLoadingReimprimir(false); //Finaliza estado de carga
            paginar1(1);
            return;
        } else {
            paginar1(1);
            setLoadingReimprimir(false); //Finaliza estado de carga
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

    const handleLimpiarReimprimir = () => {
        setInventario((prevInventario) => ({
            ...prevInventario,
            af_codigo_genericoR: "",
            altaS_CORRr: 0,
            fDesdeR: "",
            fHastaR: ""
        }));
    };


    //----------------Lista con Estado Etiqueta N(Lista General) --------------------//
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
    //----------------Lista con Estado Etiqueta S(Reimpresión) --------------------//
    const handleSeleccionaReimprimirTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setFilasSeleccionadasReimprimir(
                elementosActuales1.map((_, index) =>
                    (indicePrimerElemento1 + index).toString()
                )
            );
        } else {
            setFilasSeleccionadasReimprimir([]);
        }
    };

    const setSeleccionaFilasReimprimir = (index: number) => {
        setFilasSeleccionadasReimprimir((prev) =>
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
        setListaQRInicial([]);
        setListaQRReimpresion([]);
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

        const activosSeleccionadoAFClave = selectedIndices.map((activo) => ({
            aF_CLAVE: Number(listaEtiquetas[activo].aF_CLAVE),
        }));

        quitarEtiquetasActions(activosSeleccionadoAFClave);
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

        obtenerReimpresionEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
        setListaQRInicial(etiquetasConQR);
        // Muestra modal y finaliza la carga
        setMostrarModal(true);
        setLoading(false);
    };

    const handleGenerarReimpresion = async () => {
        setListaQRInicial([]);
        setListaQRReimpresion([]);
        setLoadingReimprimir(true);
        // Seleccionar los nuevos activos
        const selectedIndices = filasSeleccionadasReimprimir.map(Number);
        const activosSeleccionados = selectedIndices.map((index) => ({
            aF_CODIGO_GENERICO: listaReimpresionEtiquetas[index].aF_CODIGO_GENERICO,
            aF_DESCRIPCION: listaReimpresionEtiquetas[index].aF_DESCRIPCION,
            aF_FECHA_ALTA: listaReimpresionEtiquetas[index].aF_FECHA_ALTA,
            aF_NCUENTA: listaReimpresionEtiquetas[index].aF_NCUENTA,
            aF_UBICACION: listaReimpresionEtiquetas[index].aF_UBICACION,
            origen: listaReimpresionEtiquetas[index].origen
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

        setListaQRReimpresion(etiquetasConQR);
        // Muestra modal y finaliza la carga
        setMostrarModalReimprimir(true);
        setLoadingReimprimir(false);
    };

    // const handleQuitar = async () => {
    //     const selectedIndices = filasSeleccionadas.map(Number);
    //     const result = await Swal.fire({
    //         icon: "warning",
    //         title: "Quitar",
    //         text: "Confirme para quitar las etiquetas seleccionadas",
    //         showDenyButton: false,
    //         showCancelButton: true,
    //         confirmButtonText: "Confirmar y Quitar",
    //         background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //         color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //         confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
    //         customClass: {
    //             popup: "custom-border", // Clase personalizada para el borde
    //         }
    //     });

    //     if (result.isConfirmed) {
    //         setLoadingQuitar(true);
    //         // Crear un array de objetos con aF_CLAVE y nombre
    //         const Formulario = selectedIndices.map((activo) => ({
    //             aF_CLAVE: Number(listaEtiquetas[activo].aF_CLAVE),
    //         }));

    //         const resultado = await quitarEtiquetasActions(Formulario);
    //         if (resultado) {
    //             Swal.fire({
    //                 icon: "success",
    //                 title: "Quitadas del listado",
    //                 text: "Se han quitado de la lista correctamente.",
    //                 background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //                 color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //                 confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
    //                 customClass: {
    //                     popup: "custom-border", // Clase personalizada para el borde
    //                 }
    //             });

    //             setLoadingQuitar(false);
    //             handleBuscar();
    //             setFilasSeleccionadas([]);
    //             obtenerEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
    //         } else {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: ":'(",
    //                 text: "Hubo un problema al quitar la etiquetas",
    //                 background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //                 color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //                 confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
    //                 customClass: {
    //                     popup: "custom-border", // Clase personalizada para el borde
    //                 }
    //             });
    //             setLoadingQuitar(false);
    //         }

    //     }

    // };

    const handleCerrarModal = () => {

        Swal.fire({
            icon: "info",
            title: "Reimpresión disponible",
            text: "Para ver todas las etiquetas que ya han sido generadas, haga clic en el botón 'Reimprimir'.",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: { popup: "custom-border" },
            allowOutsideClick: false,
            confirmButtonText: "Reimprimir",
            showCancelButton: true, // Agrega un segundo botón
            cancelButtonText: "Cerrar", // Texto del botón
            willClose: () => {
                document.body.style.overflow = "auto"; // Restaura el scroll
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setMostrarModalLista(true);
            }
        });
        handleBuscar();
        setMostrarModal(false);
        setFilasSeleccionadas([]);
    };

    //----------------Lista con Estado Etiqueta N(Lista General) --------------------//
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaEtiquetas.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaEtiquetas, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Math.ceil(listaEtiquetas.length / elementosPorPagina);
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    //----------------Lista con Estado Etiqueta S(Reimpresión) --------------------//
    const indiceUltimoElemento1 = paginaActual1 * elementosPorPagina1;
    const indicePrimerElemento1 = indiceUltimoElemento1 - elementosPorPagina1;
    const elementosActuales1 = useMemo(
        () => listaReimpresionEtiquetas.slice(indicePrimerElemento1, indiceUltimoElemento1),
        [listaReimpresionEtiquetas, indicePrimerElemento1, indiceUltimoElemento1]
    );
    const totalPaginas1 = Math.ceil(listaReimpresionEtiquetas.length / elementosPorPagina1);
    const paginar1 = (numeroPagina: number) => setPaginaActual1(numeroPagina);

    return (
        <Layout>
            <Helmet>
                <title>Imprimir Etiquetas</title>
            </Helmet>
            <MenuAltas />
            <div className={`border border-botom p-2 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                <h3 className="form-title fw-semibold border-bottom p-1">Imprimir Etiquetas</h3>
                <Row className="border rounded p-2 m-2">
                    <Col lg={3} md={4}>
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
                    <Col lg={1} md={4}>
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

                <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                    {/* Tamaño de página */}
                    <Col xs={12} lg="auto">
                        {listaEtiquetas.length > 10 && (
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

                    {/* Botones y mensajes */}
                    <Col xs={12} lg={4}>
                        <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-end align-items-stretch">
                            {filasSeleccionadas.length > 0 ? (
                                <>
                                    {/* Botón Generar */}
                                    <Button
                                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                                        onClick={handleGenerar}
                                        disabled={listaEtiquetas.length === 0}
                                        className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 d-flex align-items-center justify-content-center"
                                    >
                                        {loading ? (
                                            <>
                                                Generar
                                                <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                            </>
                                        ) : (
                                            <>
                                                <Printer className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                                                Generar
                                                <span className="badge bg-light text-dark mx-1 mt-1">
                                                    {filasSeleccionadas.length}
                                                </span>
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <div className="d-flex justify-content-center justify-content-lg-end w-100">
                                    <strong className="alert alert-dark border p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-lg-auto text-center ">
                                        No hay filas seleccionadas
                                    </strong>
                                </div>
                            )}

                            {/* Botón Reimprimir */}
                            <Button
                                variant="warning"
                                onClick={() => setMostrarModalLista(true)}
                                disabled={loadingReimprimir}
                                className="p-2 mb-2 mb-sm-0 mx-sm-0 w-100 d-flex align-items-center justify-content-center"
                            >
                                {loadingReimprimir ? (
                                    <>
                                        Reimprimir
                                        <Spinner as="span" className="flex-shrink-0 h-5 w-5" animation="border" size="sm" role="status" aria-hidden="true" />
                                    </>
                                ) : (
                                    <>
                                        Reimprimir
                                        <ArrowCounterclockwise className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* Listado Principal */}
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
            {/*Modal Imprimir Etiquetas */}
            <Modal
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                dialogClassName="modal-right" size="lg"
                backdrop="static" // Evita que se cierre al hacer clic afuera
                keyboard={false}>
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""}>
                    <div className="d-flex justify-content-between w-100">
                        <Modal.Title className="fw-semibold">Imprimir Etiquetas</Modal.Title>
                        <Button
                            variant="transparent"
                            className="border-0"
                            onClick={handleCerrarModal}
                        >
                            <CloseButton
                                aria-hidden="true"
                                className={"flex-shrink-0 h-5 w-5"}
                            />
                        </Button>
                    </div>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form>
                        {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                        <BlobProvider document={<DocumentoEtiquetasPDF row={listaQRInicial} />
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


            {/*Modal listado ReImprimir */}
            <Modal show={mostrarModalLista} onHide={() => setMostrarModalLista(false)}
                dialogClassName="draggable-modal"
                fullscreen
            >
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Reimprimir Etiquetas</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <Row className="border rounded p-2 m-2">
                        <Col lg={3} md={4}>
                            <div className="mb-2">
                                <div className="flex-grow-1 mb-2">
                                    <label htmlFor="fDesdeR" className="form-label fw-semibold small">Desde</label>
                                    <div className="input-group">
                                        <input
                                            aria-label="Fecha Desde"
                                            type="date"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fDesde ? "is-invalid" : ""}`}
                                            name="fDesdeR"
                                            onChange={handleChange}
                                            value={Reimprimir.fDesdeR}
                                            max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                                        />
                                    </div>
                                    {error.fDesde && <div className="invalid-feedback d-block">{error.fDesde}</div>}
                                </div>

                                <div className="flex-grow-1">
                                    <label htmlFor="fHastaR" className="form-label fw-semibold small">Hasta</label>
                                    <div className="input-group">
                                        <input
                                            aria-label="Fecha Hasta"
                                            type="date"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fHasta ? "is-invalid" : ""}`}
                                            name="fHastaR"
                                            onChange={handleChange}
                                            value={Reimprimir.fHastaR}
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
                                        name="af_codigo_genericoR"
                                        placeholder="Ej: 1000000008"
                                        onChange={handleChange}
                                        value={Reimprimir.af_codigo_genericoR}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="altaS_CORRr" className="form-label fw-semibold small">Nº Alta</label>
                                    <input
                                        aria-label="altaS_CORRr"
                                        type="text"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        name="altaS_CORRr"
                                        placeholder="Ej: 0"
                                        onChange={handleChange}
                                        value={Reimprimir.altaS_CORRr}
                                    />
                                </div>
                            </div>
                        </Col>

                        {/* Columna 5: Botones de Acción */}
                        <Col lg={1} md={4}>
                            <div className="d-flex flex-column gap-2 mt-4">
                                <Button
                                    onClick={handleBuscarReimprimir}
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

                                <Button onClick={handleLimpiarReimprimir} variant={`${isDarkMode ? "secondary" : "primary"}`} className="w-100">
                                    Limpiar
                                    <Eraser className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                        {/* Tamaño de página */}
                        <Col xs={12} lg="auto">
                            {listaReimpresionEtiquetas.length > 10 && (
                                <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                                    <label htmlFor="nPaginacion1" className="form-label fw-semibold mb-0 me-2">
                                        Tamaño de página:
                                    </label>
                                    <select
                                        aria-label="Seleccionar tamaño de página"
                                        className={`form-select form-select-sm w-auto rounded-1 ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        name="nPaginacion1"
                                        onChange={handleChange}
                                        value={Paginacion1.nPaginacion1}
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

                        {/* Botones o mensaje */}
                        <Col xs={12} lg={2}>
                            {filasSeleccionadasReimprimir.length > 0 ? (
                                <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-end">
                                    <Button
                                        variant={isDarkMode ? "secondary" : "primary"}
                                        onClick={handleGenerarReimpresion}
                                        disabled={loadingReimprimir}
                                        className="p-2 mb-2 mb-sm-0 mx-sm-0 w-100"
                                    >
                                        {loadingReimprimir ? (
                                            <>
                                                Generar
                                                <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                            </>
                                        ) : (
                                            <>
                                                <Printer className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                                                Generar
                                                <span className="badge bg-light text-dark mx-1 mt-1">
                                                    {filasSeleccionadasReimprimir.length}
                                                </span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-center justify-content-lg-end">
                                    <strong className="alert alert-dark border p-2 mb-2 mb-sm-0 mx-sm-0 w-100 w-lg-auto text-center">
                                        No hay filas seleccionadas
                                    </strong>
                                </div>
                            )}
                        </Col>
                    </Row>

                    {/* Tabla Reimprimir */}
                    <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="mt-2">
                        {loadingReimprimir ? (
                            <>
                                {/* <SkeletonLoader rowCount={elementosPorPagina} /> */}
                                <SkeletonLoader rowCount={10} columnCount={10} />
                            </>
                        ) : (
                            <div className='table-responsive position-relative z-0'>
                                <div style={{ maxHeight: "70vh" }}>
                                    <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                                        <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                                            <tr>
                                                <th style={{ position: 'sticky', left: 0 }}>
                                                    <Form.Check
                                                        className="check-danger"
                                                        type="checkbox"
                                                        onChange={handleSeleccionaReimprimirTodos}
                                                        checked={filasSeleccionadasReimprimir.length === elementosActuales1.length && elementosActuales1.length > 0}
                                                    />
                                                </th>
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
                                            {elementosActuales1.map((fila, index) => {
                                                const indexReal = indicePrimerElemento1 + index; // Índice real basado en la página
                                                return (
                                                    <tr key={index}>
                                                        <td style={{ position: 'sticky', left: 0 }}>
                                                            <Form.Check
                                                                type="checkbox"
                                                                onChange={() => setSeleccionaFilasReimprimir(indexReal)}
                                                                checked={filasSeleccionadasReimprimir.includes(indexReal.toString())}
                                                            />
                                                        </td>
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
                            </div>
                        )}
                    </div>
                    {/* Paginador */}
                    <div className="paginador-container position-relative z-0">
                        <Pagination className="paginador-scroll">
                            <Pagination.First
                                onClick={() => paginar1(1)}
                                disabled={paginaActual1 === 1}
                            />
                            <Pagination.Prev
                                onClick={() => paginar1(paginaActual1 - 1)}
                                disabled={paginaActual1 === 1}
                            />

                            {Array.from({ length: totalPaginas1 }, (_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === paginaActual1}
                                    onClick={() => paginar1(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => paginar1(paginaActual1 + 1)}
                                disabled={paginaActual1 === totalPaginas1}
                            />
                            <Pagination.Last
                                onClick={() => paginar1(totalPaginas1)}
                                disabled={paginaActual1 === totalPaginas1}
                            />
                        </Pagination>
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal ReImprimir Etiquetas */}
            <Modal
                show={mostrarModalReimprimir}
                onHide={() => setMostrarModalReimprimir(false)}
                dialogClassName="modal-right" size="lg"
                backdrop="static" // Evita que se cierre al hacer clic afuera
                keyboard={false}>
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Reimprimir Etiquetas</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form>
                        {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                        <BlobProvider document={<DocumentoEtiquetasPDF row={listaQRReimpresion} />
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
    listaReimpresionEtiquetas: state.obtenerReimpresionEtiquetasAltasReducers.listaReimpresionEtiquetas,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    objeto: state.validaApiLoginReducers,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    obtenerEtiquetasAltasActions,
    obtenerReimpresionEtiquetasAltasActions,
    quitarEtiquetasActions
})(ImprimirEtiqueta);

