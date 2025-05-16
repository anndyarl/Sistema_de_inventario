import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Row, Col, Form, Pagination, Button, Spinner, Modal, Collapse } from "react-bootstrap";
import { RootState } from "../../../../store";
import { connect } from "react-redux";
import Layout from "../../../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { ArrowsMove, Eraser, FileEarmarkExcel, FiletypePdf, Plus, Search } from "react-bootstrap-icons";
import SkeletonLoader from "../../../Utils/SkeletonLoader";
import { Helmet } from "react-helmet-async";
import MenuInformes from "../../../Menus/MenuInformes";
import { Objeto } from "../../../Navegacion/Profile";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoPDF from "./DocumentoPDFServicioDependencia";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from "react-select";
import { DatosFirmas } from "../../../Altas/FirmarAltas/FirmarAltas";
import { useNavigate } from "react-router-dom";
import { DEPENDENCIA } from "../../../Inventario/RegistrarInventario/DatosCuenta";
import { listaFolioServicioDependenciaActions } from "../../../../redux/actions/Informes/Principal/FolioPorServicioDependencia/listaFolioServicioDependenciaActions";
import { comboServicioInformeActions } from "../../../../redux/actions/Informes/Principal/FolioPorServicioDependencia/comboServicioInformeActions";
import { obtenerfirmasAltasActions } from "../../../../redux/actions/Altas/FirmarAltas/obtenerfirmasAltasActions";
import { comboDependenciaDestinoActions } from "../../../../redux/actions/Traslados/Combos/comboDependenciaDestinoActions";
import { comboTrasladoServicioActions } from "../../../../redux/actions/Traslados/Combos/comboTrasladoServicioActions";
import { registroTrasladoMultipleActions } from "../../../../redux/actions/Informes/Principal/FolioPorServicioDependencia/registroTrasladoMultipleActions";

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
    registroTrasladoMultipleActions: (FormularioTraslado: Record<string, any>) => Promise<boolean>
    listaFolioServicioDependencia: ListaFolioServicioDependencia[];
    listaFolioServicioDependenciaActions: (dep_corr: number, establ_corr: number) => Promise<boolean>;
    comboServicioInforme: SERVICIO[];
    comboDependenciaDestino: DEPENDENCIA[];
    comboServicioInformeActions: (establ_corr: number) => void;//En buscador   
    // comboServicioInformeFormActions: (establ_corr: number) => void;//En formulario  
    obtenerfirmasAltasActions: () => Promise<boolean>;
    // comboDependenciaOrigenActions: (comboServicioOrigen: string) => void; // Nueva prop para pasar el servicio seleccionado
    comboDependenciaDestinoActions: (comboServicioDestino: string) => void; // Nueva prop para pasar el servicio seleccionado
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto; //Objeto que obtiene los datos del usuario
    datosFirmas: DatosFirmas[];

}

const FolioPorServicioDependencia: React.FC<DatosAltas> = ({ obtenerfirmasAltasActions, listaFolioServicioDependenciaActions, comboServicioInformeActions, comboDependenciaDestinoActions, registroTrasladoMultipleActions, listaFolioServicioDependencia, comboServicioInforme, objeto, token, isDarkMode, datosFirmas }) => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalTraslado, setMostrarModalTraslado] = useState(false);
    const [error, setError] = useState<Partial<ListaFolioServicioDependencia> & {}>({});
    const [loading, setLoading] = useState(false); // Estado para controlar la carga busqueda 
    const [paginaActual, setPaginaActual] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [__, setIsDisabled] = useState(true);
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
        servicio: 0,
    });
    //Estado para firmar
    const [Inventario, setInventario] = useState({
        ajustarFirma: false,//General
        finanzas: false,//Opcional
        abastecimiento: false,//Opcional
        administrativa: false,//Opcional
        unidadAdministrativa: null,//Este es el esado de un combo
        titularInventario: false,
        subroganteInventario: false,
        titularFinanzas: false,
        subroganteFinanzas: false,
        titularAbastecimiento: false,
        subroganteAbastecimiento: false,
        titularDemandante: false,
        subroganteDemandante: false,
        firmanteInventario: "",
        firmanteFinanzas: "",
        firmanteAbastecimiento: "",
        visadoInventario: "",
        visadoFinanzas: "",
        visadoAbastecimiento: ""
    });
    //Estado para completar fomulario traslado
    const [Traslados, setTraslados] = useState({
        aF_CLAVE: 0,
        usuario_crea: objeto.IdCredencial.toString(),
        seR_CORR: 0,
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
    //Estado de la paginacion


    const servicioOptions = comboServicioInforme.map((item) => ({
        value: item.deP_CORR,
        label: item.descripcion,
    }));

    const servicioFormOptions = comboServicioInforme.map((item) => ({
        value: item.deP_CORR,
        label: item.descripcion,
    }));

    const handleServicioChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : 0;
        setBuscar((prevInventario) => ({ ...prevInventario, servicio: value }));
        console.log("combo principal", value);
    };

    const handleServicioFormChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : 0;
        setTraslados((prevInventario) => ({ ...prevInventario, deP_CORR_DESTINO: value }));
        console.log("combo formulario", value);
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
            comboServicioInformeActions(objeto.Roles[0].codigoEstablecimiento);
            console.log("objeto.Roles[0].codigoEstablecimiento", objeto.Roles[0].codigoEstablecimiento);
        }
    }, [listaFolioServicioDependenciaActions, comboServicioInformeActions, listaFolioServicioDependencia.length, comboServicioInforme.length, token]); // Asegúrate de incluir dependencias relevantes

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Validación específica para af_codigo_generico: solo permitir números
        if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
            return; // Salir si contiene caracteres no numéricos
        }
        // Convierte `value` a número
        let newValue: string | number = ["seR_CORR", "deP_CORR_DESTINO", "n_TRASLADO", "paginacion"].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setTraslados((prevTraslados) => ({
            ...prevTraslados,
            [name]: newValue,
        }));
        if (name === "seR_CORR") {
            comboDependenciaDestinoActions(value);
        }
        setPaginacion((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);
        if (!Buscar.servicio || Buscar.servicio === 0) {
            Swal.fire({
                icon: "warning",
                title: "Por favor, seleccione un servicio",
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
        }
        resultado = await listaFolioServicioDependenciaActions(Buscar.servicio, objeto.Roles[0].codigoEstablecimiento);

        //resetea campos una vez hecha la busqueda
        setInventario((prevState) => ({
            ...prevState,
            servicio: 0,
        }));
        setError({});
        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin Resultados",
                text: "No se encontraron resultados para la busqueda, inténte con otro servicio.",
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
    };

    const handleCheck = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        // Copia del estado actual
        const prev = structuredClone(Inventario);
        const updatedState = { ...prev, [name]: checked };

        if (name === "ajustarFirma" && !checked) {
            const cleanedState = {
                ...updatedState,
                finanzas: false,
                abastecimiento: false,
                administrativa: false,
                titularInventario: false,
                subroganteInventario: false,
                titularFinanzas: false,
                subroganteFinanzas: false,
                titularAbastecimiento: false,
                subroganteAbastecimiento: false,
                titularDemandante: false,
                subroganteDemandante: false,
                firmanteInventario: "",
                firmanteFinanzas: "",
                firmanteAbastecimiento: "",
                visadoInventario: "",
                visadoFinanzas: "",
                visadoAbastecimiento: ""
            };
            setIsDisabled(false);
            setIsExpanded(true);
            setInventario(cleanedState);
            return;
        }


        let firmanteInventario = prev.firmanteInventario || "";
        let firmanteFinanzas = prev.firmanteFinanzas || "";
        let firmanteAbastecimiento = prev.firmanteAbastecimiento || "";
        let visadoInventario = prev.visadoInventario || "";
        let visadoFinanzas = prev.visadoFinanzas || "";
        let visadoAbastecimiento = prev.visadoAbastecimiento || "";

        for (const firma of datosFirmas) {

            const nombreCompleto = `${firma.nombre} ${firma.apellidO_PATERNO} ${firma.apellidO_MATERNO}`;

            const FIRMA = `data:image/${detectarTipo};base64,${firma.firma}`;
            console.log("FIRMA", FIRMA)
            // const FIRMA = `${firma.firma}`;
            if (firma.iD_UNIDAD === 1) {
                if (name === "titularInventario" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteInventario = nombreCompleto;
                    visadoInventario = FIRMA;
                    updatedState.subroganteInventario = false;
                }
                if (name === "subroganteInventario" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteInventario = nombreCompleto;
                    visadoInventario = FIRMA;
                    updatedState.titularInventario = false;
                }
            }

            if (firma.iD_UNIDAD === 2) {
                if (name === "titularFinanzas" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteFinanzas = nombreCompleto;
                    visadoFinanzas = FIRMA;
                    updatedState.subroganteFinanzas = false;
                }
                if (name === "subroganteFinanzas" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteFinanzas = nombreCompleto;
                    visadoFinanzas = FIRMA;
                    updatedState.titularFinanzas = false;
                }
            }

            if (firma.iD_UNIDAD === 3) {
                if (name === "titularAbastecimiento" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteAbastecimiento = nombreCompleto;
                    visadoAbastecimiento = FIRMA;
                    updatedState.subroganteAbastecimiento = false;
                }
                if (name === "subroganteAbastecimiento" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteAbastecimiento = nombreCompleto;
                    visadoAbastecimiento = FIRMA;
                    updatedState.titularAbastecimiento = false;
                }
            }
        }

        updatedState.firmanteInventario = firmanteInventario;
        updatedState.firmanteFinanzas = firmanteFinanzas;
        updatedState.firmanteAbastecimiento = firmanteAbastecimiento;
        updatedState.visadoInventario = visadoInventario;
        updatedState.visadoFinanzas = visadoFinanzas;
        updatedState.visadoAbastecimiento = visadoAbastecimiento;
        setIsDisabled(false);
        setIsExpanded(true);
        setInventario(updatedState);
    }, [Inventario, datosFirmas, objeto]);

    const handleSubmitTraslado = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            const result = await Swal.fire({
                icon: "info",
                title: "Confirmar Traslado",
                text: "¿Confirma que desea trasladar los inventarios seleccionados con los datos proporcionados?",
                showCancelButton: true,
                confirmButtonText: "Confirmar y Trasladar",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#444"}`,
                customClass: { popup: "custom-border" }
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
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#444"}`,
                        customClass: { popup: "custom-border" }
                    });

                    // Limpiar
                    setFilasSeleccionadas([]);
                    setMostrarModalTraslado(false);
                    // setLoading(false);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un problema al intentar trasladar los activos.",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#444"}`,
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

    // Función para redirigir al registro de inventario
    const handleAgregar = () => {
        navigate("/Inventario/FormInventario");
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
                    <Row className="border rounded p-2 m-2">
                        <Col sm={12} md={12} lg={4}>
                            {/* Servicio */}
                            <div className="mb-1 position-relative z-1">
                                <label className="fw-semibold">
                                    Servicio / Dependencia
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
                        <Col>
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
                                <Button
                                    onClick={handleAgregar}
                                    disabled={loading}
                                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                                    className="mx-1 mb-1">
                                    Agregar
                                    <Plus className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                </Button>


                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end">
                        <div className="d-flex align-items-center me-2">
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
                                {[10, 15, 20, 25, listaFolioServicioDependencia.length].map((val) => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </select>
                        </div>

                        {filasSeleccionadas.length > 0 ? (
                            <>
                                <Button
                                    onClick={() => setMostrarModal(true)}
                                    disabled={listaFolioServicioDependencia.length === 0}
                                    variant={isDarkMode ? "secondary" : "primary"}
                                    className="mx-1 mb-1"
                                >

                                    Exportar
                                    <FiletypePdf
                                        className={classNames("flex-shrink-0", "h-5 w-5 ms-1")}
                                        aria-hidden="true"
                                    />

                                </Button>

                                <Button
                                    onClick={() => setMostrarModalTraslado(true)} // Descomenta si ya tienes el estado y función
                                    disabled={listaFolioServicioDependencia.length === 0}
                                    variant={isDarkMode ? "secondary" : "warning"}
                                    className="mx-1 mb-1"
                                >
                                    Trasladar
                                    <ArrowsMove
                                        className={classNames("flex-shrink-0", "h-5 w-5 ms-1")}
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
                                        <th scope="col" className="text-nowrap">Nº Alta</th>
                                        <th scope="col" className="text-nowrap">Fecha Ingreso</th>
                                        <th scope="col" className="text-nowrap">Dependencia</th>
                                        <th scope="col" className="text-nowrap">Especie</th>
                                        <th scope="col" className="text-nowrap">Marca</th>
                                        <th scope="col" className="text-nowrap">Modelo</th>
                                        <th scope="col" className="text-nowrap">Serie</th>
                                        <th scope="col" className="text-nowrap">Precio</th>
                                        <th scope="col" className="text-nowrap">Observación</th>
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
                                                <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                                <td className="text-nowrap">{Lista.aF_FINGRESO}</td>
                                                <td className="text-nowrap">{Lista.dependencia}</td>
                                                <td className="text-nowrap">{Lista.aF_ESPECIE}</td>
                                                <td className="text-nowrap">{Lista.aF_MARCA}</td>
                                                <td className="text-nowrap">{Lista.aF_MODELO}</td>
                                                <td className="text-nowrap">{Lista.aF_SERIE}</td>
                                                <td className="text-nowrap"> ${(Lista.aF_PRECIO ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</td>
                                                <td>{Lista.aF_OBS}</td>
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
                                <Col md={4} >
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

                                {/* Opcional1 | Departamento Finanzas*/}
                                <Col md={4}>
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

                                {/* Opcional2 | Unidad Abastecimiento*/}
                                <Col md={4}>
                                    <p className="border-bottom fw-semibold text-center">Unidad de Abastecimiento</p>
                                    <div className="d-flex">
                                        <label htmlFor="abastecimiento" className="me-2">Opcional</label>
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!Inventario.ajustarFirma}
                                            name="abastecimiento"
                                            type="checkbox"
                                            className="form-switch"
                                            checked={Inventario.abastecimiento}
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!Inventario.abastecimiento}
                                            name="titularAbastecimiento"
                                            type="checkbox"
                                            checked={Inventario.titularAbastecimiento}
                                        />
                                        <label htmlFor="titularAbastecimiento" className="ms-2">Titular Abastecimiento</label>
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!Inventario.abastecimiento}
                                            name="subroganteAbastecimiento"
                                            type="checkbox"
                                            checked={Inventario.subroganteAbastecimiento}
                                        />
                                        <label htmlFor="subroganteAbastecimiento" className="ms-2">Subrogante Abastecimiento</label>
                                    </div>
                                </Col>

                                {/* Opcional3 | Unidad Administrativa */}
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
                                firmanteAbastecimiento={Inventario.firmanteAbastecimiento}
                                visadoInventario={Inventario.visadoInventario}
                                visadoFinanzas={Inventario.visadoFinanzas}
                                visadoAbastecimiento={Inventario.visadoAbastecimiento}
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
            {/* Modal formulario traslado*/}
            <Modal show={mostrarModalTraslado} onHide={() => setMostrarModalTraslado(false)} size="lg" dialogClassName="modal-right" backdrop="static"
            //  keyboard={false}     // Evita el cierre al presionar la tecla Esc
            >
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title className="fw-semibold">Inventarios a Trasladar: {filasSeleccionadasPDF.length}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form onSubmit={handleSubmitTraslado}>
                        <div className="d-flex justify-content-end">
                            <Button
                                variant="primary"
                                type="submit"
                                className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                                disabled={loading}  // Desactiva el botón mientras carga
                            >
                                {loading ? (
                                    <>
                                        {" Trasladar "}
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
                                        <ArrowsMove
                                            className={classNames("flex-shrink-0", "h-5 w-5 ms-1")}
                                            aria-hidden="true"
                                        />
                                    </>
                                )}
                            </Button>
                        </div>
                        {/* <div className="mb-1">
                            <label htmlFor="seR_CORR" className="fw-semibold fw-semibold">Servicio Destino</label>
                            <select
                                aria-label="seR_CORR"
                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.seR_CORR ? "is-invalid" : ""}`}
                                name="seR_CORR"
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar</option>
                                {comboTrasladoServicio.map((traeServicio) => (
                                    <option
                                        key={traeServicio.codigo}
                                        value={traeServicio.codigo}
                                    >
                                        {traeServicio.descripcion}
                                    </option>
                                ))}
                            </select>
                            {error.seR_CORR && (
                                <div className="invalid-feedback fw-semibold d-block">
                                    {error.seR_CORR}
                                </div>
                            )}
                        </div> */}
                        {/* Dependencia */}
                        {/* <div className="mb-1">
                            <label htmlFor="deP_CORR_DESTINO" className="fw-semibold">Dependencia Destino</label>
                            <select
                                aria-label="deP_CORR_DESTINO"
                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.deP_CORR_DESTINO ? "is-invalid" : ""}`}
                                name="deP_CORR_DESTINO"
                                disabled={!Traslados.seR_CORR}
                                onChange={handleChange}
                                value={Traslados.deP_CORR_DESTINO}
                            >
                                <option value="">Seleccionar</option>
                                {comboDependenciaDestino.map((traeDependencia) => (
                                    <option
                                        key={traeDependencia.codigo}
                                        value={traeDependencia.codigo}
                                    >
                                        {traeDependencia.descripcion}
                                    </option>
                                ))}
                            </select>
                            {error.deP_CORR_DESTINO && (
                                <div className="invalid-feedback fw-semibold d-block">
                                    {error.deP_CORR_DESTINO}
                                </div>
                            )}
                        </div> */}
                        <Row>
                            <Col>
                                <div className="mb-1 position-relative z-1">
                                    <label className="fw-semibold">
                                        Servicio / Dependencia
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
                                {/* Radios Pendiente Implementación */}
                                {/* <div className="mb-1">
                                    <label htmlFor="deP_CORR" className="fw-semibold">Tipo Traslado</label>
                                    <div className="mb-1 p-2 d-flex justify-content-center border rounded">
                                        <div className="form-check">
                                            <input
                                                aria-label="traS_CO_REAL"
                                                className={`form-check-input ${isDarkMode ? "bg-dark border-secondary" : ""} m-1`}
                                                onChange={handleChange}
                                                type="radio"
                                                name="traS_CO_REAL"
                                                value="1"

                                            />
                                            <label className={`form-check-label fw-semibold ${isDarkMode ? "text-light" : "text-muted"}`}>
                                                En Comodato
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                aria-label="traS_CO_REAL"
                                                className={`form-check-input ${isDarkMode ? "bg-dark border-secondary" : ""} m-1`}
                                                onChange={handleChange}
                                                type="radio"
                                                name="traS_CO_REAL"
                                                value="2"
                                            />
                                            <label className={`form-check-label fw-semibold ${isDarkMode ? "text-light" : "text-muted"}`}>
                                                Traspaso Real
                                            </label>
                                        </div>
                                    </div>
                                    {error.traS_CO_REAL && (
                                        <div className="invalid-feedback fw-semibold d-block">{error.traS_CO_REAL}</div>
                                    )}
                                </div> */}
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
                            <Col>
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
                                    />
                                    {error.traS_FECHA_MEMO && (
                                        <div className="invalid-feedback">{error.traS_FECHA_MEMO}</div>
                                    )}
                                </div>

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
    comboServicioInforme: state.comboServicioInformeReducers.comboServicioInforme,
    comboDependenciaDestino: state.comboDependenciaDestinoReducer.comboDependenciaDestino,
    objeto: state.validaApiLoginReducers,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas
});

export default connect(mapStateToProps, {
    registroTrasladoMultipleActions,
    listaFolioServicioDependenciaActions,
    obtenerfirmasAltasActions,
    comboServicioInformeActions,
    comboTrasladoServicioActions,
    comboDependenciaDestinoActions
})(FolioPorServicioDependencia);
