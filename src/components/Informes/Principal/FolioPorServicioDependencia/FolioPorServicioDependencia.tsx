import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Row, Col, Form, Pagination, Button, Spinner, Modal, Collapse } from "react-bootstrap";
import { RootState } from "../../../../store";
import { connect } from "react-redux";
import Layout from "../../../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { BoxArrowDown, Eraser, FileEarmarkExcel, Search } from "react-bootstrap-icons";
import SkeletonLoader from "../../../Utils/SkeletonLoader";
import { Helmet } from "react-helmet-async";
import MenuInformes from "../../../Menus/MenuInformes";
import { comboServicioInformeActions } from "../../../../redux/actions/Informes/Principal/FolioPorServicioDependencia/comboServicioInformeActions";
import { Objeto } from "../../../Navegacion/Profile";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoPDF from "./DocumentoPDFServicioDependencia";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from "react-select";
import { listaFolioServicioDependenciaActions } from "../../../../redux/actions/Informes/Principal/FolioPorServicioDependencia/listaFolioServicioDependenciaActions";
import { DatosFirmas } from "../../../Altas/FirmarAltas/FirmarAltas";
import { obtenerfirmasAltasActions } from "../../../../redux/actions/Altas/FirmarAltas/obtenerfirmasAltasActions";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};

export interface ListaFolioServicioDependencia {
    servicio: string;
    dependencia: string;
    cuenta: string;
    especie: string;
    tipo: string;
    traS_ESTADO_AF: string;
    deP_CORR: number;
    deP_COD: string;
    seR_CORR: number;
    seR_COD: string;
    ctA_COD: string;
    altaS_CORR: number;
    aF_CANTIDAD: string;
    aF_RESOLUCION: string;
    aF_CODIGO_GENERICO: string;
    aF_FINGRESO: string;
    traS_CORR: number;
    aF_ESPECIE: string;
    aF_MARCA: string;
    aF_MODELO: string;
    aF_SERIE: string;
    aF_OBS: string;
    aF_FOLIO: string;
    ntraslado: number;
    deP_CORR_DESTINO: number;
    aF_CLAVE: number;
    valoR_LIBRO: number;
    vidA_UTIL: string;
    vutiL_RESTANTE: string;
    estabL_CORR: number;
}

interface SERVICIO {
    deP_CORR: number;
    descripcion: string;
}

interface DatosAltas {
    listaFolioServicioDependencia: ListaFolioServicioDependencia[];
    listaFolioServicioDependenciaActions: (dep_corr: number, establ_corr: number) => Promise<boolean>;
    comboServicioInforme: SERVICIO[];
    comboServicioInformeActions: (establ_corr: number) => void;
    obtenerfirmasAltasActions: () => Promise<boolean>;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto; //Objeto que obtiene los datos del usuario
    nPaginacion: number; //número de paginas establecido desde preferencias
    datosFirmas: DatosFirmas[];
}

const FolioPorServicioDependencia: React.FC<DatosAltas> = ({ obtenerfirmasAltasActions, listaFolioServicioDependenciaActions, comboServicioInformeActions, listaFolioServicioDependencia, comboServicioInforme, objeto, token, isDarkMode, nPaginacion, datosFirmas }) => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [_, setError] = useState<Partial<ListaFolioServicioDependencia> & {}>({});
    const [loading, setLoading] = useState(false); // Estado para controlar la carga busqueda 
    const [paginaActual, setPaginaActual] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [__, setIsDisabled] = useState(true);
    const elementosPorPagina = nPaginacion;
    const filasSeleccionadasPDF = listaFolioServicioDependencia.filter((_, index) =>
        filasSeleccionadas.includes(index.toString())
    );

    const [Buscar, setBuscar] = useState({
        servicio: 0,
    });
    const [Inventario, setInventario] = useState({
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

    const servicioOptions = comboServicioInforme.map((item) => ({
        value: item.deP_CORR,
        label: item.descripcion,
    }));

    const handleServicioChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : 0;
        setBuscar((prevInventario) => ({ ...prevInventario, servicio: value }));

    };
    const listaAuto = async () => {
        if (listaFolioServicioDependencia.length === 0) {
            setLoading(true);
            const resultado = await listaFolioServicioDependenciaActions(0, objeto.Establecimiento);
            if (resultado) {
                setLoading(false);
            }
            else {
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
            }
        }
    };

    useEffect(() => {
        if (token) {
            listaAuto();
            comboServicioInformeActions(objeto.Establecimiento);
        }
    }, [listaFolioServicioDependenciaActions, comboServicioInformeActions, listaFolioServicioDependencia.length, comboServicioInforme.length, token]); // Asegúrate de incluir dependencias relevantes

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);
        resultado = await listaFolioServicioDependenciaActions(Buscar.servicio, objeto.Establecimiento);

        //resetea campos una vez hecha la busqueda
        setInventario((prevState) => ({
            ...prevState,
            servicio: 0,
        }));
        setError({});
        if (!resultado) {
            Swal.fire({
                icon: "error",
                title: ":'(",
                text: "No se encontraron resultados, inténte otro registro.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
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
        setBuscar((prevInventario) => ({
            ...prevInventario,
            servicio: 0
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
    function detectarTipo(base64: string): string {
        if (base64.startsWith("/9j/")) return "jpeg";
        if (base64.startsWith("iVBOR")) return "png";
        if (base64.startsWith("R0lGOD")) return "gif";
        return "png"; // fallback
    }
    const handleCheck = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        // Copia del estado actual
        const prev = structuredClone(Inventario);
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
            setInventario(cleanedState);
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
                if (name === "titularInventario" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Establecimiento.toString()) {
                    firmanteInventario = nombreCompleto;
                    visadoInventario = FIRMA;
                    updatedState.subroganteInventario = false;
                }
                if (name === "subroganteInventario" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Establecimiento.toString()) {
                    firmanteInventario = nombreCompleto;
                    visadoInventario = FIRMA;
                    updatedState.titularInventario = false;
                }
            }

            if (firma.iD_UNIDAD === 2) {
                if (name === "titularFinanzas" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Establecimiento.toString()) {
                    firmanteFinanzas = nombreCompleto;
                    visadoFinanzas = FIRMA;
                    updatedState.subroganteFinanzas = false;
                }
                if (name === "subroganteFinanzas" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Establecimiento.toString()) {
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
        setInventario(updatedState);
    }, [Inventario, datosFirmas, objeto]);


    // Lógica de Paginación actualizada
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () =>
            listaFolioServicioDependencia.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaFolioServicioDependencia, indicePrimerElemento, indiceUltimoElemento]
    );
    // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
    const totalPaginas = Array.isArray(listaFolioServicioDependencia)
        ? Math.ceil(listaFolioServicioDependencia.length / elementosPorPagina)
        : 0;
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    // Función para exportar a Excel
    // const exportarExcel = (listaAltas: ListaAltas[], fileName: string = "reporte.xlsx") => {
    //     const worksheet = XLSX.utils.json_to_sheet(listaAltas);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    //     const dataBlob = new Blob([excelBuffer], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    //     });

    //     saveAs(dataBlob, fileName);
    // };

    // 📂 Función para exportar a Excel
    const exportarExcel = (listaFolioServicioDependencia: any[], fileName: string = "Reporte.xlsx") => {
        setLoading(true);
        // Definir los encabezados
        const encabezados = [
            ["N° Inventario",
                "Especie",
                "Marca",
                "Modelo",
                "Serie",
                "Observación",
                "Fecha Ingreso",
                "Nº Alta",
                "Estado",
                "Nº Traslado"]
        ];

        // Convertir datos a array de arrays
        const datos = listaFolioServicioDependencia.map((item) => [
            item.aF_CLAVE ?? "",
            item.especie ?? "",
            item.aF_MARCA ?? "",
            item.aF_MODELO ?? "",
            item.aF_SERIE ?? "",
            item.aF_OBS ?? "",
            item.aF_FINGRESO ?? "",
            item.altaS_CORR ?? "",
            item.traS_ESTADO_AF ?? "",
            item.ntraslado ?? ""
        ]);

        // Crear hoja de cálculo
        const worksheet = XLSX.utils.aoa_to_sheet([...encabezados, ...datos]);

        // Aplicar anchos de columna
        worksheet["!cols"] = [
            { wch: 12 }, // N° Inventario
            { wch: 150 }, // Especie
            { wch: 12 }, // Marca
            { wch: 12 }, // Modelo
            { wch: 12 }, // Serie
            // { wch: 150 },  // Observacion
            { wch: 12 },  // Fecha Ingreso
            { wch: 12 }, // Nº Alta 
            { wch: 12 }, // Estado
            { wch: 12 },  // Nº Traslado
        ];

        // Aplicar color de fondo a los encabezados
        const range = XLSX.utils.decode_range(worksheet["!ref"]!);
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: C }); // Celda del encabezado
            if (!worksheet[cellRef]) continue;

            worksheet[cellRef].s = {
                fill: { fgColor: { rgb: "000000" } }, // Fondo amarillo
                font: { bold: true, color: { rgb: "FFFFFF" } } // Texto blanco en negrita
            };
        }

        // Crear libro de Excel
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

        // Descargar el archivo
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fileName);
        setLoading(false);
    };

    // 📂 Función para exportar a Word
    // const exportarWord = () => {
    //     setLoading(true);
    //     const doc = new Document({
    //         styles: {
    //             paragraphStyles: [
    //                 {
    //                     id: "tableCellHeader",
    //                     name: "tableCellHeader",
    //                     basedOn: "Normal",
    //                     run: {
    //                         size: 10,
    //                         color: "FFFFFF",
    //                         bold: true,
    //                     },
    //                 },
    //                 {
    //                     id: "tableCell",
    //                     name: "tableCell",
    //                     basedOn: "Normal",
    //                     run: {
    //                         size: 10,
    //                         bold: true,
    //                     },
    //                 },
    //             ],
    //         },
    //         sections: [
    //             {
    //                 children: [
    //                     new Paragraph({
    //                         text: "Detalles de Bienes por Dependencia",
    //                         heading: "Heading1",
    //                     }),
    //                     new Table({
    //                         width: { size: 100, type: WidthType.PERCENTAGE }, // Ajustar la tabla al 100% del ancho
    //                         rows: [
    //                             // Encabezado de la tabla
    //                             new TableRow({
    //                                 children: [
    //                                     new TableCell({
    //                                         children: [new Paragraph({ text: "Nº Inventario", style: "tableCellHeader" })],
    //                                         shading: { fill: "004485" }, // Fondo gris
    //                                     }),
    //                                     new TableCell({
    //                                         children: [new Paragraph({ text: "Especie", style: "tableCellHeader" })],
    //                                         shading: { fill: "004485" },
    //                                     }),
    //                                     new TableCell({
    //                                         children: [new Paragraph({ text: "Marca", style: "tableCellHeader" })],
    //                                         shading: { fill: "004485" },
    //                                     }),
    //                                     new TableCell({
    //                                         children: [new Paragraph({ text: "Modelo", style: "tableCellHeader" })],
    //                                         shading: { fill: "004485" },
    //                                     }),
    //                                     new TableCell({
    //                                         children: [new Paragraph({ text: "Serie", style: "tableCellHeader" })],
    //                                         shading: { fill: "004485" },
    //                                     }),
    //                                     // new TableCell({
    //                                     //     children: [new Paragraph({ text: "Observación", style: "tableCellHeader" })],
    //                                     //     shading: { fill: "004485" },
    //                                     // }),
    //                                     new TableCell({
    //                                         children: [new Paragraph({ text: "Fecha Ingreso", style: "tableCellHeader" })],
    //                                         shading: { fill: "004485" },
    //                                     }),
    //                                     new TableCell({
    //                                         children: [new Paragraph({ text: "Nº Alta", style: "tableCellHeader" })],
    //                                         shading: { fill: "004485" },
    //                                     }),
    //                                     new TableCell({
    //                                         children: [new Paragraph({ text: "Estado", style: "tableCellHeader" })],
    //                                         shading: { fill: "004485" },
    //                                     }),
    //                                     new TableCell({
    //                                         children: [new Paragraph({ text: "Nº Traslado", style: "tableCellHeader" })],
    //                                         shading: { fill: "004485" },
    //                                     }),
    //                                 ],
    //                             }),
    //                             // Filas dinámicas con datos
    //                             ...listaFolioServicioDependencia.map((item) =>
    //                                 new TableRow({
    //                                     children: [
    //                                         new TableCell({ children: [new Paragraph({ text: item.aF_CODIGO_GENERICO.toString(), style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.especie, style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.aF_MARCA, style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.aF_SERIE, style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.aF_OBS, style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.aF_FINGRESO, style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.altaS_CORR.toString(), style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.traS_ESTADO_AF, style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.ntraslado.toString(), style: "tableCell" })] }),
    //                                     ],
    //                                 })
    //                             ),
    //                         ],
    //                     }),
    //                 ],
    //             },
    //         ],
    //     });

    //     Packer.toBlob(doc).then((blob) => {
    //         saveAs(blob, `Reporte_FolioPorServicioDependencia.docx`);
    //         setLoading(false); //evita que quede cargando
    //     }).catch(() => {
    //         // console.error("Error al generar el documento:", error);
    //         setLoading(false);
    //     });

    // };

    return (
        <Layout>
            <Helmet>
                <title>Detalles de Bienes por Dependencia</title>
            </Helmet>
            <MenuInformes />
            <form>
                <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                    <h3 className="form-title fw-semibold border-bottom p-1">Detalles de Bienes por Dependencia</h3>
                    <Row>
                        <Col md={3}>
                            {/* Servicio */}
                            <div className="mb-1">
                                <label className="fw-semibold">
                                    Servicio
                                </label>
                                <Select
                                    options={servicioOptions}
                                    onChange={handleServicioChange}
                                    name="servicio"
                                    value={servicioOptions.find((option) => option.value === Buscar.servicio) || null}
                                    placeholder="Buscar"
                                    className={`form-select-container `}
                                    classNamePrefix="react-select"
                                    isClearable
                                    isSearchable
                                    styles={{
                                        control: (baseStyles) => ({
                                            ...baseStyles,
                                            backgroundColor: isDarkMode ? "#212529" : "white", // Fondo oscuro
                                            color: isDarkMode ? "white" : "#212529", // Texto blanco
                                            borderColor: isDarkMode ? "rgb(108 117 125)" : "#a6a6a66e", // Bordes
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: isDarkMode ? "white" : "#212529", // Color del texto seleccionado
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: isDarkMode ? "#212529" : "white", // Fondo del menú desplegable
                                            color: isDarkMode ? "white" : "#212529",
                                        }),
                                        option: (base, { isFocused, isSelected }) => ({
                                            ...base,
                                            backgroundColor: isSelected ? "#6c757d" : isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                                            color: isSelected ? "white" : isFocused ? "white" : isDarkMode ? "white" : "#212529",
                                        }),
                                    }}
                                />
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="mb-1 mt-4">
                                <Button onClick={handleBuscar}
                                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                                    className="mx-1 mb-1">
                                    {loading ? (
                                        <>
                                            {" Buscar"}
                                            <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                        </>
                                    ) : (
                                        <>
                                            {"Buscar"}
                                            <Search className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
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
                    <div className="d-flex justify-content-end">
                        {filasSeleccionadas.length > 0 ? (
                            <Button
                                onClick={() => setMostrarModal(true)} disabled={listaFolioServicioDependencia.length === 0}
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                className="mx-1 mb-1">
                                {mostrarModal ? (
                                    <>
                                        {" Exportar"}
                                        <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                    </>
                                ) : (
                                    <>
                                        {"Exportar"}
                                        <BoxArrowDown className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <strong className="alert alert-dark border m-1 p-2">
                                No hay filas seleccionadas
                            </strong>
                        )}
                    </div>
                    {/* Tabla*/}
                    {loading ? (
                        <>
                            {/* <SkeletonLoader rowCount={elementosPorPagina} /> */}
                            <SkeletonLoader rowCount={10} columnCount={10} />
                        </>
                    ) : (
                        <div className='table-responsive'>
                            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                                <thead className={`sticky-top  z-0 ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
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
                                        <th scope="col" className="text-nowrap text-center">Especie</th>
                                        <th scope="col" className="text-nowrap text-center">Marca</th>
                                        <th scope="col" className="text-nowrap text-center">Modelo</th>
                                        <th scope="col" className="text-nowrap text-center">Serie</th>
                                        <th scope="col" className="text-nowrap text-center">Observación</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Ingreso</th>
                                        <th scope="col" className="text-nowrap text-center">Nº Alta</th>
                                        <th scope="col" className="text-nowrap text-center">Estado</th>
                                        <th scope="col" className="text-nowrap text-center">Nº Traslado</th>
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
                                                    zIndex: 0,

                                                }}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        onChange={() => setSeleccionaFilas(indexReal)}
                                                        checked={filasSeleccionadas.includes(indexReal.toString())}
                                                    />
                                                </td>
                                                <td className="text-nowrap">{Lista.aF_CODIGO_GENERICO}</td>
                                                <td className="text-nowrap">{Lista.especie}</td>
                                                <td className="text-nowrap">{Lista.aF_MARCA}</td>
                                                <td className="text-nowrap">{Lista.aF_MODELO}</td>
                                                <td className="text-nowrap">{Lista.aF_SERIE}</td>
                                                <td className="text-nowrap">{Lista.aF_OBS}</td>
                                                <td className="text-nowrap">{Lista.aF_FINGRESO}</td>
                                                <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                                <td className="text-nowrap">{Lista.traS_ESTADO_AF}</td>
                                                <td className="text-nowrap">{Lista.ntraslado}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

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
                </div>
            </form>

            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="xl">
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Folio por Servicio Dependencia</Modal.Title>
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
                                    checked={Inventario.ajustarFirma}
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
                                            disabled={!Inventario.ajustarFirma}
                                            name="titularInventario"
                                            type="checkbox"
                                            checked={Inventario.titularInventario}
                                        />
                                        <label htmlFor="titularInventario" className="ms-2">Titular Inventario</label>
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!Inventario.ajustarFirma}
                                            name="subroganteInventario"
                                            type="checkbox"
                                            checked={Inventario.subroganteInventario}
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
                                            disabled={!Inventario.ajustarFirma}
                                            name="finanzas"
                                            type="checkbox"
                                            className="form-switch"
                                            checked={Inventario.finanzas}
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!Inventario.finanzas}
                                            name="titularFinanzas"
                                            type="checkbox"
                                            checked={Inventario.titularFinanzas}
                                        />
                                        <label htmlFor="titularFinanzas" className="ms-2">Titular Finanzas</label>
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!Inventario.finanzas}
                                            name="subroganteFinanzas"
                                            type="checkbox"
                                            checked={Inventario.subroganteFinanzas}
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
                                AltaInventario={Inventario}
                                firmanteInventario={Inventario.firmanteInventario}
                                firmanteFinanzas={Inventario.firmanteFinanzas}
                                visadoInventario={Inventario.visadoInventario}
                                visadoFinanzas={Inventario.visadoFinanzas}
                            />
                        }>
                            {({ url, loading }) =>
                                loading ? (
                                    <p>Generando vista previa...</p>
                                ) : (

                                    <>
                                        {/* Botones para exportar a Excel y Word */}
                                        <div className="mt-3 d-flex justify-content-end gap-2 mb-1">
                                            <Button
                                                onClick={() => exportarExcel(listaFolioServicioDependencia)}
                                                variant="success">
                                                Descargar Excel
                                                <FileEarmarkExcel className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                            </Button>
                                            {/* <Button
                                            onClick={() => exportarWord()}
                                            variant="primary">
                                            Descargar Word
                                            <FileEarmarkWord className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                        </Button> */}
                                        </div>
                                        {/* Frame para vista previa del PDF */}
                                        <iframe
                                            src={url ? `${url}` : ""}
                                            title="Vista Previa del PDF"
                                            style={{
                                                width: "100%",
                                                height: "900px",
                                                border: "none"
                                            }}
                                        ></iframe>
                                    </>

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
    listaFolioServicioDependencia: state.listaFolioServicioDependenciaReducers.listaFolioServicioDependencia,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboServicioInforme: state.comboServicioInformeReducers.comboServicioInforme,
    objeto: state.validaApiLoginReducers,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    listaFolioServicioDependenciaActions,
    obtenerfirmasAltasActions,
    comboServicioInformeActions
})(FolioPorServicioDependencia);
