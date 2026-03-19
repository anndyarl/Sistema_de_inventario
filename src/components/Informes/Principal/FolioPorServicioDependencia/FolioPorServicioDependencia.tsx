import "bootstrap/dist/css/bootstrap.min.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Form, Pagination, Button, Spinner, Modal, Collapse, ModalDialog } from "react-bootstrap";
import { RootState } from "../../../../store";
import { connect } from "react-redux";
import Layout from "../../../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { ArrowLeftRight, Eraser, FileEarmarkExcel, FiletypePdf, Plus, Search } from "react-bootstrap-icons";
import SkeletonLoader from "../../../Utils/SkeletonLoader";
import { Helmet } from "react-helmet-async";
import MenuInformes from "../../../Menus/MenuInformes";
import { Objeto } from "../../../Navegacion/Profile";
import { BlobProvider } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from "react-select";
import { DatosFirmas } from "../../../Altas/FirmarAltas/FirmarAltas";
import { useNavigate } from "react-router-dom";
import { DEPENDENCIA } from "../../../Inventario/RegistrarInventario/DatosCuenta";
import { listaFolioServicioDependenciaActions } from "../../../../redux/actions/Informes/Principal/FolioPorServicioDependencia/listaFolioServicioDependenciaActions";
import { obtenerfirmasAltasActions } from "../../../../redux/actions/Altas/FirmarAltas/obtenerfirmasAltasActions";
import { comboDependenciaDestinoActions } from "../../../../redux/actions/Traslados/Combos/comboDependenciaDestinoActions";
import { comboTrasladoServicioActions } from "../../../../redux/actions/Traslados/Combos/comboTrasladoServicioActions";
import { registroTrasladoMultipleActions } from "../../../../redux/actions/Informes/Principal/FolioPorServicioDependencia/registroTrasladoMultipleActions";
import DocumentoPDFServicioDependencia from "./DocumentoPDFServicioDependencia";
import { comboSerDepActions } from "../../../../redux/actions/Inventario/ModificarInventario/comboSerDepActions";
import { listadoTrasladosActions } from "../../../../redux/actions/Traslados/listadoTrasladosActions";
import Draggable from "react-draggable";

const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};

export interface ListaFolioServicioDependencia {

    //Principales
    aF_CLAVE: number;
    aF_CODIGO_GENERICO: string; //Nº inventario
    altaS_CORR: number;
    traS_CORR: number;
    estabL_CORR: number;

    //Buscar
    servicio: string;
    dependencia: string;

    //Listado   
    deP_CORR: number; //Dependencia Origen
    traS_ESTADO_AF: string;
    ctA_COD: string;
    aF_RESOLUCION: string;
    aF_FINGRESO: string;
    aF_MARCA: string;
    aF_MODELO: string;
    aF_SERIE: string;
    aF_ESPECIE: string; //Nombre especie
    aF_OBS: string;
    aF_FOLIO: string;
    ntraslado: number;
    valoR_LIBRO: number;
    aF_PRECIO: number;
    aF_PRECIO_REF: number;

    //Props formulario;
    seR_CORR: number;
    deP_CORR_DESTINO: number;
    traS_CO_REAL: string;
    traS_MEMO_REF: string;
    traS_FECHA_MEMO: string;
    traS_OBS: string;
    traS_NOM_ENTREGA: string;
    traS_NOM_RECIBE: string;
    traS_NOM_AUTORIZA: string;

}

interface SERVICIO {
    deP_CORR: number;
    descripcion: string;
}

interface DatosAltas {
    registroTrasladoMultipleActions: (FormularioTraslado: Record<string, any>) => Promise<boolean>;
    comboSerDepActions: (establ_corr: number) => void;//En buscador   
    listaFolioServicioDependencia: ListaFolioServicioDependencia[];
    listaFolioServicioDependenciaActions: (dep_corr: number, af_codigo_generico: string, establ_corr: number) => Promise<boolean>;
    // comboServicioInforme: SERVICIO[];
    comboSerDep: SERVICIO[];
    comboDependenciaDestino: DEPENDENCIA[];
    // comboServicioInformeActions: (establ_corr: number) => void;//En buscador   
    // comboServicioInformeFormActions: (establ_corr: number) => void;//En formulario  
    obtenerfirmasAltasActions: () => Promise<boolean>;
    // comboDependenciaOrigenActions: (comboServicioOrigen: string) => void; // Nueva prop para pasar el servicio seleccionado
    comboDependenciaDestinoActions: (comboServicioDestino: string) => void; // Nueva prop para pasar el servicio seleccionado
    listadoTrasladosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number) => Promise<boolean>;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto; //Objeto que obtiene los datos del usuario
    datosFirmas: DatosFirmas[];
}

const FolioPorServicioDependencia: React.FC<DatosAltas> = ({ obtenerfirmasAltasActions, listaFolioServicioDependenciaActions, comboDependenciaDestinoActions, registroTrasladoMultipleActions, comboSerDepActions, listadoTrasladosActions, listaFolioServicioDependencia, comboSerDep, objeto, token, isDarkMode, datosFirmas }) => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarTodoModal, setMostrarTodoModal] = useState(false);
    const [mostrarModalTraslado, setMostrarModalTraslado] = useState(false);
    const [error, setError] = useState<Partial<ListaFolioServicioDependencia> & {}>({});
    const [loading, setLoading] = useState(false); // Estado para controlar la carga busqueda 
    const [paginaActual, setPaginaActual] = useState(1);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [Paginacion, setPaginacion] = useState({
        nPaginacion: 10
    });
    const elementosPorPagina = Paginacion.nPaginacion;
    const filasSeleccionadasPDF = listaFolioServicioDependencia.filter((_, index) =>
        filasSeleccionadas.includes(index.toString())
    );
    const navigate = useNavigate();
    const validateForm = () => {
        let tempErrors: Partial<any> & {} = {};
        if (!Traslados.deP_CORR_DESTINO) tempErrors.deP_CORR_DESTINO = "Campo obligatorio.";
        if (!Traslados.traS_OBS) tempErrors.traS_OBS = "Campo obligatorio.";
        if (!Traslados.traS_MEMO_REF) tempErrors.traS_MEMO_REF = "Campo obligatorio.";
        if (!Traslados.traS_FECHA_MEMO) tempErrors.traS_FECHA_MEMO = "Campo obligatorio.";
        if (!Traslados.traS_NOM_ENTREGA) tempErrors.traS_NOM_ENTREGA = "Campo obligatorio.";
        if (!Traslados.traS_NOM_RECIBE) tempErrors.traS_NOM_RECIBE = "Campo obligatorio.";
        if (!Traslados.traS_NOM_AUTORIZA) tempErrors.traS_NOM_AUTORIZA = "Campo obligatorio.";
        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    //Estado para buscar
    const [Buscar, setBuscar] = useState({
        af_codigo_generico: "",
        servicio: 0,
    });

    //Estado para completar fomulario traslado
    const [Traslados, setTraslados] = useState({
        usuario_crea: objeto.IdCredencial.toString(),
        deP_CORR_DESTINO: 0, //Dependencia destino
        traS_DET_CORR: 0,
        traS_CO_REAL: 0,
        traS_MEMO_REF: "",
        traS_FECHA_MEMO: "",
        traS_OBS: "",
        traS_NOM_ENTREGA: "",
        traS_NOM_RECIBE: "",
        traS_NOM_AUTORIZA: ""
    });

    const [Firma, setFirma] = useState({
        ajustarFirma: false,
        encargadoInventario: "",
        jefe: "",
        jefeInventario: ""
    });

    const servicioOptions = comboSerDep.map((item) => ({
        value: item.deP_CORR,
        label: item.descripcion,
    }));

    const handleServicioChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : 0;
        setBuscar((prevInventario) => ({ ...prevInventario, servicio: value }));
    };

    const servicioFormOptions = comboSerDep.map((item) => ({
        value: item.deP_CORR,
        label: item.descripcion,
    }));

    const handleServicioFormChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : 0;
        setTraslados((prevInventario) => ({ ...prevInventario, deP_CORR_DESTINO: value }));
    };

    // const listaAuto = async () => {
    //     if (listaFolioServicioDependencia.length === 0) {
    //         setLoading(true);
    //         const resultado = await listaFolioServicioDependenciaActions(0, objeto.Roles[0].codigoEstablecimiento);
    //         if (resultado) {
    //             setLoading(false);
    //         }
    //         else {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Error",
    //                 text: `Error en la solicitud. Por favor, intente nuevamente.`,
    //                 background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //                 color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //                 confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
    //                 customClass: {
    //                     popup: "custom-border", // Clase personalizada para el borde
    //                 }
    //             });
    //         }
    //     }
    // };

    useEffect(() => {
        if (token) {
            // listaAuto();
            if (comboSerDep.length === 0) {
                comboSerDepActions(objeto.Roles[0].codigoEstablecimiento);
            }
            // comboServicioInformeActions(objeto.Roles[0].codigoEstablecimiento);
        }
    }, [listaFolioServicioDependenciaActions, comboSerDepActions, listaFolioServicioDependencia.length, token]); // Asegúrate de incluir dependencias relevantes

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Convierte `value` a número
        let newValue: string | number = ["seR_CORR", "deP_CORR_DESTINO", "n_TRASLADO",].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setBuscar((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        setTraslados((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        setPaginacion((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));

        setFirma((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));

        if (name === "seR_CORR") {
            comboDependenciaDestinoActions(value);
        }
    };

    const handleCheck = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        // Copia del estado actual
        const prev = structuredClone(Firma);
        const updatedState = { ...prev, [name]: checked };
        //Limpia Todo al deshabilitar check
        if (name === "ajustarFirma") {
            if (!checked) {
                const cleanedState = {
                    ...updatedState,
                    //texto
                    encargadoInventario: "",
                    jefe: "",
                    jefeInventario: ""
                };

                setIsExpanded(false);
                setFirma(cleanedState);
            } else {
                setIsExpanded(true);
                setFirma(updatedState);
            }
            return;
        }
        let encargadoInventario = prev.encargadoInventario || "";

        updatedState.encargadoInventario = encargadoInventario;
        setFirma(updatedState);
    }, [Firma, datosFirmas, objeto]);


    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);
        setFilasSeleccionadas([]);
        if (
            (!Buscar.servicio || Buscar.servicio === 0) &&
            Buscar.af_codigo_generico.trim() === ""
        ) {
            Swal.fire({
                icon: "warning",
                title: "Faltan filtros",
                text: "Debe seleccionar un servicio o ingresar un Nº inventario.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: { popup: "custom-border" }
            });
            setLoading(false);
            return;
        }
        resultado = await listaFolioServicioDependenciaActions(Buscar.servicio, Buscar.af_codigo_generico, objeto.Roles[0].codigoEstablecimiento);

        setError({});
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
            af_codigo_generico: "",
            servicio: 0
        }));
    };

    const handleLimpiarFormulario = () => {
        setTraslados((prev) => ({
            ...prev,
            deP_CORR_DESTINO: 0, //Dependencia destino
            traS_DET_CORR: 0,
            traS_CO_REAL: 0,
            traS_MEMO_REF: "",
            traS_FECHA_MEMO: "",
            traS_OBS: "",
            traS_NOM_ENTREGA: "",
            traS_NOM_RECIBE: "",
            traS_NOM_AUTORIZA: ""
        }));
    }
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

    const handleSubmitTraslado = async () => {
        if (validateForm()) {
            const result = await Swal.fire({
                icon: "info",
                title: "Confirmar Traslado",
                text: "¿Confirma que desea trasladar los artículos seleccionados con los datos proporcionados?",
                showCancelButton: true,
                confirmButtonText: "Confirmar y Trasladar",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });

            if (result.isConfirmed) {
                setLoading(true);
                const activosSeleccionados = filasSeleccionadasPDF.map((item) => ({
                    aF_CLAVE: item.aF_CLAVE,
                    aF_CODIGO_GENERICO: item.aF_CODIGO_GENERICO,
                    deP_CORR: item.deP_CORR,//Dependencia Origen
                    usuariO_CREA: objeto.IdCredencial.toString(),
                    estabL_CORR: objeto.Roles[0].codigoEstablecimiento,
                    deP_CORR_DESTINO: Traslados.deP_CORR_DESTINO, //dependencia Destino
                    traS_CO_REAL: Traslados.traS_CO_REAL,
                    traS_MEMO_REF: Traslados.traS_MEMO_REF,
                    traS_FECHA_MEMO: Traslados.traS_FECHA_MEMO,
                    traS_OBS: Traslados.traS_OBS,
                    traS_NOM_ENTREGA: Traslados.traS_NOM_ENTREGA,
                    traS_NOM_RECIBE: Traslados.traS_NOM_RECIBE,
                    traS_NOM_AUTORIZA: Traslados.traS_NOM_AUTORIZA
                }));

                const resultado = await registroTrasladoMultipleActions(activosSeleccionados);

                // console.log("datosTraslado", activosSeleccionados);

                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Registro Exitoso",
                        text: `Su traslado ha sido registrado exitosamente`,
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: { popup: "custom-border" }
                    });

                    // Limpiar
                    setFilasSeleccionadas([]);
                    setMostrarModalTraslado(false);
                    listaFolioServicioDependenciaActions(Buscar.servicio, Buscar.af_codigo_generico, objeto.Roles[0].codigoEstablecimiento); //Actualiza lisa de folio servicio dependencia
                    listadoTrasladosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento); //actualixza listado de traslados
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un problema al intentar trasladar los activos.",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: { popup: "custom-border" }
                    });
                }
                setLoading(false);
            }
        }
    };


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
                "Nº Traslado",
                "Valor Inicial",
                "Cta Contable"]
        ];

        // Convertir datos a array de arrays
        const datos = listaFolioServicioDependencia.map((item) => [
            item.aF_CODIGO_GENERICO ?? "",
            item.aF_ESPECIE ?? "",
            item.aF_MARCA ?? "",
            item.aF_MODELO ?? "",
            item.aF_SERIE ?? "",
            item.aF_OBS ?? "",
            item.aF_FINGRESO ?? "",
            item.altaS_CORR ?? "",
            item.traS_ESTADO_AF ?? "",
            item.ntraslado ?? "",
            item.aF_PRECIO ?? "",
            item.ctA_COD ?? ""
        ]);

        // Crear hoja de cálculo
        const worksheet = XLSX.utils.aoa_to_sheet([...encabezados, ...datos]);

        // Aplicar anchos de columna
        worksheet["!cols"] = [
            { wch: 12 }, // N° Inventario
            { wch: 12 }, // Especie
            { wch: 12 }, // Marca
            { wch: 12 }, // Modelo
            { wch: 12 }, // Serie
            // { wch: 150 },  // Observacion
            { wch: 12 },  // Fecha Ingreso
            { wch: 12 }, // Nº Alta 
            { wch: 12 }, // Estado
            { wch: 12 },  // Nº Traslado
            { wch: 12 },  // Valor Inicial
            { wch: 12 },  // Cta Contable
        ];

        // Aplicar color de fondo a los encabezados
        const range = XLSX.utils.decode_range(worksheet["!ref"]!);
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: C }); // Celda del encabezado
            if (!worksheet[cellRef]) continue;

            worksheet[cellRef].s = {
                fill: { fgColor: { rgb: "#0d6efd" } },
                font: { bold: true, color: { rgb: "#0d6efd" } }
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

    // Función para redirigir al registro de inventario
    const handleAgregar = () => {
        navigate("/Inventario/FormInventario");
    };


    // Función para exportar a Word
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
            <div className="table-responsive position-relative z-0 hide-scrollbar" >
                <div style={{ maxHeight: "80vh" }}>
                    <form>
                        <div className={`border border-botom p-2 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                            <h3 className="form-title fw-semibold border-bottom p-1">Detalles de Bienes por Dependencia</h3>
                            <Row className="border rounded p-2 m-2">
                                <Col sm={12} md={12} lg={3}>
                                    {/* Servicio/Dependencia */}
                                    <div className="mb-1 z-1000">
                                        <label className="fw-semibold">
                                            Servicio / Dependencia
                                        </label>
                                        <Select
                                            options={servicioOptions}
                                            onChange={handleServicioChange}
                                            name="servicio"
                                            value={servicioOptions.find((option) => option.value === Buscar.servicio) || null}
                                            placeholder="Buscar"
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
                                                    height: 100
                                                }),
                                                option: (base, { isFocused, isSelected }) => ({
                                                    ...base,
                                                    backgroundColor: isSelected ? "#6c757d" : isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                                                    color: isSelected ? "white" : isFocused ? "white" : isDarkMode ? "white" : "#212529",
                                                }),
                                            }}
                                        />
                                    </div>

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
                                            maxLength={12}
                                            value={Buscar.af_codigo_generico}
                                        />
                                    </div>
                                </Col>
                                <Col lg={2} md={4}>
                                    <div className="mb-1 mt-4">
                                        <Button onClick={handleBuscar}
                                            variant={`${isDarkMode ? "secondary" : "primary"}`}
                                            className="mx-1 mb-1 w-100"
                                            disabled={loading}>
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
                                            className="mx-1 mb-1 w-100">
                                            Limpiar
                                            <Eraser className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                        </Button>

                                    </div>
                                </Col>

                            </Row>
                            <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                                {/* Tamaño de página */}
                                <Col xs={12} lg={4}>
                                    {listaFolioServicioDependencia.length > 10 && (
                                        <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                                            <label htmlFor="nPaginacion" className="form-label fw-semibold mb-0 me-2">
                                                Tamaño de página:
                                            </label>
                                            <select
                                                aria-label="Seleccionar tamaño de página"
                                                className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                name="nPaginacion"
                                                onChange={handleChange}
                                                value={Paginacion.nPaginacion}
                                            >
                                                {[10, 15, 20, 25, 50, 100].map((val) => (
                                                    <option key={val} value={val}>{val}</option>
                                                ))}
                                            </select>

                                        </div>
                                    )}
                                </Col>

                                {listaFolioServicioDependencia.length > 0 && (
                                    <>
                                        {/* Botón o mensaje */}
                                        <Col xs={12} lg={6}>
                                            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-end align-items-stretch">
                                                {filasSeleccionadas.length > 0 ? (<>
                                                    {/* Botón Exportar */}
                                                    <Button
                                                        variant={`primary`}
                                                        onClick={() => setMostrarModal(true)}
                                                        className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-sm-auto d-flex align-items-center justify-content-center"
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <FiletypePdf
                                                                    className="flex-shrink-0 h-5 w-5 mx-2"
                                                                    aria-hidden="true"
                                                                />
                                                                Exportar
                                                                <Spinner
                                                                    as="span"
                                                                    animation="border"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                    className="mx-2"
                                                                />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiletypePdf
                                                                    className="flex-shrink-0 h-5 w-5 mx-1"
                                                                    aria-hidden="true"
                                                                />
                                                                Exportar
                                                                <span className="badge bg-light text-dark mx-2 mt-1">
                                                                    {filasSeleccionadas.length}
                                                                </span>
                                                            </>
                                                        )}
                                                    </Button>
                                                    {/* Botón Trasladar */}
                                                    <Button
                                                        variant="warning text-dark"
                                                        onClick={() => setMostrarModalTraslado(true)}
                                                        disabled={listaFolioServicioDependencia.length === 0}
                                                        className="p-2 mb-2 mb-sm-0 mx-sm-0 w-100 d-flex align-items-center justify-content-center"
                                                    >
                                                        Trasladar
                                                        <span className="badge bg-light text-dark mx-1 mt-1">
                                                            {filasSeleccionadas.length}
                                                        </span>
                                                    </Button>

                                                </>
                                                ) : (
                                                    <div className="d-flex justify-content-center justify-content-lg-end w-100">
                                                        <strong className="alert alert-dark border p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-lg-auto text-center ">
                                                            No hay filas seleccionadas
                                                        </strong>
                                                    </div>
                                                )}
                                                <Button
                                                    variant={`secondary`}
                                                    onClick={() => setMostrarTodoModal(true)}
                                                    className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-sm-auto d-flex align-items-center justify-content-center"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <FiletypePdf
                                                                className="flex-shrink-0 h-5 w-5 mx-2"
                                                                aria-hidden="true"
                                                            />
                                                            Exportar todo
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                                className="mx-2"
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiletypePdf
                                                                className="flex-shrink-0 h-5 w-5 mx-1"
                                                                aria-hidden="true"
                                                            />
                                                            Exportar todo
                                                            <span className="badge bg-light text-dark mx-2 mt-1">
                                                                {listaFolioServicioDependencia.length}
                                                            </span>
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={handleAgregar}
                                                    disabled={loading}
                                                    variant={`btn btn-success`}
                                                    className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-sm-auto d-flex align-items-center justify-content-center">
                                                    Agregar
                                                    <Plus className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                                </Button>
                                            </div>
                                        </Col>
                                    </>
                                )}
                            </Row>
                            {listaFolioServicioDependencia.length > 0 ? (
                                <>
                                    {/* Tabla*/}
                                    {loading ? (
                                        <>
                                            {/* <SkeletonLoader rowCount={elementosPorPagina} /> */}
                                            <SkeletonLoader rowCount={10} columnCount={10} />
                                        </>
                                    ) : (
                                        <div className='table-responsive position-relative z-0'>
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
                                                        <th scope="col" className="text-nowrap">N° Inventario</th>
                                                        <th scope="col" className="text-nowrap">Especie</th>
                                                        <th scope="col" className="text-nowrap">Marca</th>
                                                        <th scope="col" className="text-nowrap">Modelo</th>
                                                        <th scope="col" className="text-nowrap">Serie</th>
                                                        <th scope="col" className="text-nowrap">Observación</th>
                                                        <th scope="col" className="text-nowrap">Fecha Ingreso</th>
                                                        <th scope="col" className="text-nowrap">Nº Alta</th>
                                                        <th scope="col" className="text-nowrap">Estado</th>
                                                        <th scope="col" className="text-nowrap">Nº Traslado</th>
                                                        <th scope="col" className="text-nowrap">Valor Inicial</th>
                                                        <th scope="col" className="text-nowrap">Cta Contable</th>

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
                                                                <td className="text-nowrap">{Lista.aF_ESPECIE}</td>
                                                                <td className="text-nowrap">{Lista.aF_MARCA}</td>
                                                                <td className="text-nowrap">{Lista.aF_MODELO}</td>
                                                                <td className="text-nowrap">{Lista.aF_SERIE}</td>
                                                                <td>{Lista.aF_OBS}</td>
                                                                <td className="text-nowrap">{Lista.aF_FINGRESO}</td>
                                                                <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                                                <td className="text-nowrap">{Lista.traS_ESTADO_AF}</td>
                                                                <td className="text-nowrap">{Lista.ntraslado}</td>
                                                                <td className="text-nowrap"> ${(Lista.aF_PRECIO ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</td>
                                                                <td className="text-nowrap">{Lista.ctA_COD}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Paginador */}
                                    <div className="paginador-container position-relative z-0">
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
                            ) : (
                                <>
                                    <div style={{ height: "50vh", overflowY: "auto" }} className="mt-2">
                                        <p className={`text-center  pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                                            No hay resultados para mostrar.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div >
            {/* Modal selecciona todo*/}
            < Modal show={mostrarTodoModal} onHide={() => setMostrarTodoModal(false)} dialogClassName="modal-right" size="xl"
                centered={false}
                animation={false}
                handle=".modal-header"
                cancel=".modal-body"
                dialogAs={(props) => (
                    <Draggable
                        handle=".modal-header"
                        cancel=".modal-body"
                    >
                        <ModalDialog {...props} />
                    </Draggable>
                )} >
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""}
                    style={{
                        cursor: "move",
                        userSelect: "none"
                    }}
                    closeButton>
                    <Modal.Title className="fw-semibold">Firmar / Exportar</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form>
                        <Row>
                            <Col md={2}>
                                <Form.Check
                                    onChange={handleCheck}
                                    name="ajustarFirma"
                                    type="checkbox"
                                    label="Ajustar firma"
                                    style={{ transform: 'scale(1)' }}
                                    className="form-switch mx-2 "
                                    checked={Firma.ajustarFirma}
                                /></Col>
                        </Row>
                        <Collapse in={isExpanded} dimension="height">
                            <Row className="m-1 p-3 rounded rounded-4 border">
                                <p className={`text-center m-2 px-5 pt-1 pb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                                    Ingrese los nombres de cada firmante
                                </p>
                                {/* Unidad Inventario */}
                                <Col md={4}>

                                    <input
                                        aria-label="encargadoInventario"
                                        type="text"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        maxLength={30}
                                        name="encargadoInventario"
                                        placeholder="Escriba un nombre..."
                                        onChange={handleChange}
                                        value={Firma.encargadoInventario}
                                    />
                                    <p className="fw-semibold text-center">Encargado</p>
                                </Col>

                                {/* Finanzas */}
                                <Col md={4}>
                                    <input
                                        aria-label="jefe"
                                        type="text"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        maxLength={30}
                                        name="jefe"
                                        placeholder="Escriba un nombre..."
                                        onChange={handleChange}
                                        value={Firma.jefe}
                                    />
                                    <p className="fw-semibold text-center">Jefe</p>
                                </Col>

                                {/* Unidades específicas */}
                                <Col md={4}>
                                    <input
                                        aria-label="jefeInventario"
                                        type="text"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        maxLength={30}
                                        name="jefeInventario"
                                        placeholder="Escriba un nombre..."
                                        onChange={handleChange}
                                        value={Firma.jefeInventario}

                                    />
                                    <p className="fw-semibold text-center">Jefe Inventario</p>
                                </Col>
                            </Row>
                        </Collapse>
                        {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                        <BlobProvider document={
                            <DocumentoPDFServicioDependencia
                                row={listaFolioServicioDependencia}
                                Firma={Firma}
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
            </Modal >
            {/*Modal para seleccion*/}

            < Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="xl"
                centered={false}
                animation={false}
                handle=".modal-header"
                cancel=".modal-body"
                dialogAs={(props) => (
                    <Draggable
                        handle=".modal-header"
                        cancel=".modal-body"
                    >
                        <ModalDialog {...props} />
                    </Draggable>
                )}>
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""}
                    style={{
                        cursor: "move",
                        userSelect: "none"
                    }}
                    closeButton>
                    <Modal.Title className="fw-semibold">Folio por Servicio Dependencia</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form>
                        <Row>
                            <Col md={2}>
                                <Form.Check
                                    onChange={handleCheck}
                                    name="ajustarFirma"
                                    type="checkbox"
                                    label="Ajustar firma"
                                    style={{ transform: 'scale(1)' }}
                                    className="form-switch mx-2 "
                                    checked={Firma.ajustarFirma}
                                /></Col>
                        </Row>
                        <Collapse in={isExpanded} dimension="height">
                            <Row className="m-1 p-3 rounded rounded-4 border">
                                <p className={`text-center m-2 px-5 pt-1 pb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                                    Ingrese los nombres de cada firmante
                                </p>
                                {/* Unidad Inventario */}
                                <Col md={4}>

                                    <input
                                        aria-label="encargadoInventario"
                                        type="text"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        maxLength={30}
                                        name="encargadoInventario"
                                        placeholder="Escriba un nombre..."
                                        onChange={handleChange}
                                        value={Firma.encargadoInventario}
                                    />
                                    <p className="fw-semibold text-center">Encargado</p>
                                </Col>

                                {/* Finanzas */}
                                <Col md={4}>
                                    <input
                                        aria-label="jefe"
                                        type="text"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        maxLength={30}
                                        name="jefe"
                                        placeholder="Escriba un nombre..."
                                        onChange={handleChange}
                                        value={Firma.jefe}
                                    />
                                    <p className="fw-semibold text-center">Jefe</p>
                                </Col>

                                {/* Unidades específicas */}
                                <Col md={4}>
                                    <input
                                        aria-label="jefeInventario"
                                        type="text"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        maxLength={30}
                                        name="jefeInventario"
                                        placeholder="Escriba un nombre..."
                                        onChange={handleChange}
                                        value={Firma.jefeInventario}

                                    />
                                    <p className="fw-semibold text-center">Jefe Inventario</p>
                                </Col>
                            </Row>
                        </Collapse>
                        {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                        <BlobProvider document={
                            <DocumentoPDFServicioDependencia
                                row={filasSeleccionadasPDF}
                                Firma={Firma}
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
            </Modal >
            {/* Formulario de traslados */}
            < Modal show={mostrarModalTraslado} onHide={() => setMostrarModalTraslado(false)}
                size="lg"
                dialogClassName="modal-right"
                backdrop="static"
            //  keyboard={false}  // Evita el cierre al presionar la tecla Esc
            >
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title className="fw-semibold">
                        Bienes a Trasladar: {filasSeleccionadasPDF.length}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <h5 className="fw-semibold">Ubicación del centro de destino</h5>
                    <p className={`text-start  pt-1 pb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                        (Escoga su propio centro para traslados internos)
                    </p>
                    <form>
                        <Col >
                            <div className="d-flex flex-column flex-sm-row justify-content-end align-items-stretch">
                                {/* Botón Trasladar */}
                                <Button
                                    variant="warning"
                                    onClick={handleSubmitTraslado}
                                    className="p-2 mb-2 mb-sm-0 mx-sm-1"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            Trasladar
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />

                                        </>
                                    ) : (
                                        <>
                                            Trasladar
                                            <ArrowLeftRight className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleLimpiarFormulario}
                                    className="p-2 mb-2 mb-sm-0 mx-sm-1"
                                >
                                    Limpiar
                                    <Eraser className={"flex-shrink-0 h-5 w-5 mx-1"} aria-hidden="true" />
                                </Button>
                            </div>
                        </Col>
                        <Row>
                            <Col md={6}>
                                <div className="mb-1 position-relative z-1">
                                    <label className="fw-semibold">
                                        Servicio / Dependencia Destino
                                    </label>
                                    <Select
                                        options={servicioFormOptions}
                                        onChange={handleServicioFormChange}
                                        name="servicio"
                                        value={servicioFormOptions.find((option) => option.value === Traslados.deP_CORR_DESTINO) || null}
                                        placeholder="Buscar"
                                        className={`form-select-container ${error.traS_OBS ? "is-invalid" : ""}`}
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
                                                height: 100
                                            }),
                                            option: (base, { isFocused, isSelected }) => ({
                                                ...base,
                                                backgroundColor: isSelected ? "#6c757d" : isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                                                color: isSelected ? "white" : isFocused ? "white" : isDarkMode ? "white" : "#212529",
                                            }),
                                        }}
                                    />
                                    {error.deP_CORR_DESTINO && (
                                        <div className="invalid-feedback">{error.deP_CORR_DESTINO}</div>
                                    )}
                                </div>
                                {/* N° Memo Ref */}
                                <div className="mb-1">
                                    <label className="fw-semibold">
                                        N° Memo Ref
                                    </label>
                                    <input
                                        aria-label="traS_MEMO_REF"
                                        type="text"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.traS_MEMO_REF ? "is-invalid" : ""}`}
                                        maxLength={50}
                                        name="traS_MEMO_REF"
                                        onChange={handleChange}
                                        value={Traslados.traS_MEMO_REF}
                                    />
                                    {error.traS_MEMO_REF && (
                                        <div className="invalid-feedback">{error.traS_MEMO_REF}</div>
                                    )}
                                </div>
                                {/* Fecha Memo */}
                                <div className="mb-1">
                                    <label className="fw-semibold">
                                        Fecha Memo
                                    </label>
                                    <input
                                        aria-label="traS_FECHA_MEMO"
                                        type="date"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.traS_FECHA_MEMO ? "is-invalid" : ""}`}
                                        name="traS_FECHA_MEMO"
                                        onChange={handleChange}
                                        value={Traslados.traS_FECHA_MEMO}
                                        max={new Date().toISOString().split("T")[0]}
                                    />
                                    {error.traS_FECHA_MEMO && (
                                        <div className="invalid-feedback">{error.traS_FECHA_MEMO}</div>
                                    )}
                                </div>
                                {/* Observaciones */}
                                <div className="mb-1">
                                    <label className="fw-semibold">
                                        Observaciones
                                    </label>
                                    <textarea
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.traS_OBS ? "is-invalid" : ""}`}
                                        aria-label="traS_OBS"
                                        name="traS_OBS"
                                        rows={6}
                                        maxLength={500}
                                        style={{ minHeight: "8px", resize: "none" }}
                                        onChange={handleChange}
                                        value={Traslados.traS_OBS}
                                    />
                                    {error.traS_OBS && (
                                        <div className="invalid-feedback">{error.traS_OBS}</div>
                                    )}
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="border border-1 mt-4 p-4 pb-5 rounded-2">
                                    <h5 className="fw-semibold mb-4">Datos de Recepción</h5>
                                    {/* Entregado Por */}
                                    <div className="mb-1">
                                        <label className="fw-semibold">
                                            Entregado Por
                                        </label>
                                        <input
                                            aria-label="traS_NOM_ENTREGA"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                                                } ${error.traS_NOM_ENTREGA ? "is-invalid" : ""}`}
                                            maxLength={50}
                                            name="traS_NOM_ENTREGA"
                                            onChange={handleChange}
                                            value={Traslados.traS_NOM_ENTREGA}
                                        />
                                        {error.traS_NOM_ENTREGA && (
                                            <div className="invalid-feedback">{error.traS_NOM_ENTREGA}</div>
                                        )}
                                    </div>
                                    {/* Recibido Por */}
                                    <div className="mb-1">
                                        <label className="fw-semibold">
                                            Recibido Por
                                        </label>
                                        <input
                                            aria-label="traS_NOM_RECIBE"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                                                } ${error.traS_NOM_RECIBE ? "is-invalid" : ""}`}
                                            maxLength={50}
                                            name="traS_NOM_RECIBE"
                                            onChange={handleChange}
                                            value={Traslados.traS_NOM_RECIBE}
                                        />
                                        {error.traS_NOM_RECIBE && (
                                            <div className="invalid-feedback">{error.traS_NOM_RECIBE}</div>
                                        )}
                                    </div>
                                    {/* Jefe que Autoriza */}
                                    <div className="mb-1">
                                        <label className="fw-semibold">
                                            Jefe que Autoriza
                                        </label>
                                        <input
                                            aria-label="traS_NOM_AUTORIZA"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.traS_NOM_AUTORIZA ? "is-invalid" : ""}`}
                                            maxLength={50}
                                            name="traS_NOM_AUTORIZA"
                                            onChange={handleChange}
                                            value={Traslados.traS_NOM_AUTORIZA}
                                        />
                                        {error.traS_NOM_AUTORIZA && (
                                            <div className="invalid-feedback">{error.traS_NOM_AUTORIZA}</div>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </form>
                </Modal.Body>
            </Modal >

        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaFolioServicioDependencia: state.listaFolioServicioDependenciaReducers.listaFolioServicioDependencia,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    // comboServicioInforme: state.comboServicioInformeReducers.comboServicioInforme,
    comboDependenciaDestino: state.comboDependenciaDestinoReducer.comboDependenciaDestino,
    objeto: state.validaApiLoginReducers,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    comboSerDep: state.comboServDepReducers.comboSerDep,
});

export default connect(mapStateToProps, {
    registroTrasladoMultipleActions,
    listaFolioServicioDependenciaActions,
    obtenerfirmasAltasActions,
    // comboServicioInformeActions,
    comboTrasladoServicioActions,
    comboDependenciaDestinoActions,
    comboSerDepActions,
    listadoTrasladosActions
})(FolioPorServicioDependencia);
