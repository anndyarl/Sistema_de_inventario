import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { Calculator, CheckCircle, Eraser, ExclamationDiamond, FileEarmarkExcel, FiletypePdf, Search } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";
import Select from "react-select";
import { BlobProvider } from "@react-pdf/renderer";
import Layout from "../../../../containers/hocs/layout/Layout";
import MenuInformes from "../../../Menus/MenuInformes";
import SkeletonLoader from "../../../Utils/SkeletonLoader";
import { RootState } from "../../../../store";
import DocumentoPDF from "./DocumentoPDFCalcularDepreciacion";
import { listaActivosCalculadosActions } from "../../../../redux/actions/Informes/Principal/CalcularDepreciacion/listaActivosCalculadosActions";
import { listaActivosFijosActions } from "../../../../redux/actions/Informes/Principal/CalcularDepreciacion/listaActivosFijosActions";
import { comboCuentasInformeActions } from "../../../../redux/actions/Informes/Listados/CuentasFechas/comboCuentasInformeActions";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};
interface FechasProps {
    fDesde: string;
    fHasta: string;
}
export interface ListaActivosFijos {
    aF_CLAVE: number;
    aF_CODIGO_GENERICO: string;
    aF_CODIGO_LARGO: string;
    deP_CORR: number;
    // esP_CODIGO: number;
    // aF_SECUENCIA: number;
    itE_CLAVE: number;
    aF_DESCRIPCION: string;
    aF_FINGRESO: string;
    // aF_ESTADO: string;
    aF_CODIGO: string;
    aF_TIPO: string;
    aF_ALTA: string;
    aF_PRECIO_REF: number;
    aF_CANTIDAD: number;
    origen: string;
    aF_RESOLUCION: string;
    // aF_FECHA_SOLICITUD: string;
    aF_OCO_NUMERO_REF: string;
    usuariO_CREA: string;
    f_CREA: string;
    iP_CREA: string;
    usuariO_MOD: string;
    f_MOD: string;
    // iP_MODt: string;
    aF_TIPO_DOC: number;
    proV_RUN: string;
    reG_EQM: string;
    aF_NUM_FAC: string;
    aF_FECHAFAC: string;
    aF_3UTM: string;
    iD_GRUPO: number;
    ctA_COD: string;
    transitoria: string;
    aF_MONTOFACTURA: number;
    esP_DESCOMPONE: string;
    aF_ETIQUETA: string;
    aF_VIDAUTIL: number;
    aF_VIGENTE: string;
    idprograma: number;
    modalidad: string;
    idpropiedad: number;
    especie: string;
    marca?: string;
    modelo?: string;
    serie?: string;
    precio?: number;

    mesesTranscurridos?: number;
    vidaUtil?: number;
    mesVidaUtil?: number;
    mesesRestantes?: number;
    montoInicial?: number;
    depreciacionPorAno?: number;
    depreciacionPorMes?: number;
    depreciacionAcumuladaActualizada?: number;
    valorResidual?: number;
}
interface ComboCuentas {
    codigo: string;
    descripcion: string;
}
interface DatosAltas {
    listaActivosFijos: ListaActivosFijos[];
    listaActivosCalculados: ListaActivosFijos[];
    listaActivosNoCalculados: ListaActivosFijos[];
    listaActivosFijosActions: (cta_cod: string, fDesde: string, fHasta: string, af_codigo_generico: string) => Promise<boolean>;
    listaActivosCalculadosActions: (activosSeleccionados: Record<string, any>[]) => Promise<boolean>;
    token: string | null;
    isDarkMode: boolean;
    comboCuentasInformeActions: () => void;
    comboCuentasInforme: ComboCuentas[];
    nPaginacion: number; //número de paginas establecido desde preferencias
}

const CalcularDepreciacion: React.FC<DatosAltas> = ({ listaActivosFijosActions, listaActivosCalculadosActions, comboCuentasInformeActions, listaActivosFijos, listaActivosCalculados, listaActivosNoCalculados, comboCuentasInforme, token, isDarkMode, nPaginacion }) => {
    const [error, setError] = useState<Partial<ListaActivosFijos> & Partial<FechasProps> & {}>({});
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalNoCalculados, setMostrarModalNoCalculados] = useState(false);
    const [mostrarModalCalcular, setMostrarModalCalcular] = useState(false);
    const [loadingBuscar, setLoadingBuscar] = useState(false); // Estado para controlar la carga 
    const [loading, setLoading] = useState(false); // Estado para controlar la carga 
    const [_, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginaActual2, setPaginaActual2] = useState(1);
    const [paginaActual3, setPaginaActual3] = useState(1);

    const [Paginacion, setPaginacion] = useState({
        nPaginacion2: 10
    });
    const elementosPorPagina = nPaginacion;
    const elementosPorPagina2 = Paginacion.nPaginacion2;
    const elementosPorPagina3 = nPaginacion;
    const [__, setlistaActivosCalculados] = useState<ListaActivosFijos[]>(listaActivosCalculados);

    const cuentasOptions = comboCuentasInforme.map((item) => ({
        value: item.codigo.toString(),
        label: item.descripcion,
    }));
    const [Inventario, setInventario] = useState({
        fDesde: "",
        fHasta: "",
        cta_cod: '',
        af_codigo_generico: ""
    });

    useEffect(() => {
        if (token) {
            setlistaActivosCalculados(listaActivosCalculados);
            if (comboCuentasInforme.length === 0) { comboCuentasInformeActions() }

        }

    }, [listaActivosFijosActions, comboCuentasInformeActions, token, listaActivosFijos.length, listaActivosNoCalculados.length, listaActivosCalculados]); // Asegúrate de incluir dependencias relevantes

    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación para N° de Recepción (debe ser un número)
        if (!Inventario.fDesde) tempErrors.fDesde = "La Fecha de Inicio es obligatoria.";
        if (!Inventario.fHasta) tempErrors.fHasta = "La Fecha de Término es obligatoria.";
        if (Inventario.fDesde > Inventario.fHasta) tempErrors.fDesde = "La fecha no cumple con el rango de busqueda";
        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Validación específica para af_codigo_generico: solo permitir números
        if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
            return; // Salir si contiene caracteres no numéricos
        }

        setInventario((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        setPaginacion((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === "nPaginacion2") {
            paginar2(1);
        }
    };

    const handleCuentasChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : "";
        setInventario((prevMantenedor) => ({ ...prevMantenedor, cta_cod: value }));
        console.log(value);
    };

    const handleBuscar = async () => {
        setLoadingBuscar(true);
        // Limpiar los activos seleccionados antes de enviar los nuevos datos


        const tieneFechas = Inventario.fDesde !== "" && Inventario.fHasta !== "";
        const tieneCuenta = Inventario.cta_cod && Inventario.cta_cod !== "";
        const tieneCodigoGenerico = Inventario.af_codigo_generico && Inventario.af_codigo_generico !== "";

        // Caso 1: no hay ningún filtro
        if (!tieneFechas && !tieneCuenta && !tieneCodigoGenerico) {
            Swal.fire({
                icon: "warning",
                title: "Por favor, filtre por alguna opción",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                customClass: {
                    popup: "custom-border",
                }
            });
            setLoadingBuscar(false);
            setMostrarModalNoCalculados(false);
            return;
        }

        // Caso 2: si hay fechas, validar antes de continuar
        if (tieneFechas && !validate()) {
            setLoadingBuscar(false);
            setMostrarModalNoCalculados(false);
            return;
        }

        // Llama al backend
        const resultado = await listaActivosFijosActions(
            Inventario.cta_cod,
            Inventario.fDesde,
            Inventario.fHasta,
            Inventario.af_codigo_generico
        );

        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin Resultados",
                text: "El Nº de Inventario consultado no se encuentra en este listado.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                customClass: {
                    popup: "custom-border",
                }
            });
        } else {
            paginar(1);
        }

        setLoadingBuscar(false);
    };


    const handleLimpiar = () => {
        setInventario((prevInventario) => ({
            ...prevInventario,
            fDesde: "",
            fHasta: "",
            cta_cod: "",
            af_codigo_generico: ""
        }));
        setFilasSeleccionadas([]);
    };

    const handleCalcular = async () => {
        setLoading(true);

        // Limpiar los activos seleccionados antes de enviar los nuevos datos
        setlistaActivosCalculados([]);
        await listaActivosCalculadosActions([]); // Envía un array vacío para eliminar datos previos

        // Seleccionar los nuevos activos
        // const selectedIndices = filasSeleccionadas.map(Number);
        const activosSeleccionados = listaActivosFijos.map((item) => ({
            aF_CLAVE: item.aF_CLAVE,
            aF_CODIGO_GENERICO: item.aF_CODIGO_GENERICO,
            aF_CODIGO_LARGO: item.aF_CODIGO_LARGO,
            deP_CORR: item.deP_CORR,
            itE_CLAVE: item.itE_CLAVE,
            aF_DESCRIPCION: item.aF_DESCRIPCION,
            aF_FINGRESO: item.aF_FINGRESO,
            aF_CODIGO: item.aF_CODIGO,
            aF_TIPO: item.aF_TIPO,
            aF_ALTA: item.aF_ALTA,
            aF_PRECIO_REF: item.aF_PRECIO_REF,
            aF_CANTIDAD: item.aF_CANTIDAD,
            origen: item.origen,
            aF_RESOLUCION: item.aF_RESOLUCION,
            aF_OCO_NUMERO_REF: item.aF_OCO_NUMERO_REF,
            usuariO_CREA: item.usuariO_CREA,
            f_CREA: item.f_CREA,
            iP_CREA: item.iP_CREA,
            usuariO_MOD: item.usuariO_MOD,
            f_MOD: item.f_MOD,
            aF_TIPO_DOC: item.aF_TIPO_DOC,
            proV_RUN: item.proV_RUN,
            reG_EQM: item.reG_EQM,
            aF_NUM_FAC: item.aF_NUM_FAC,
            aF_FECHAFAC: item.aF_FECHAFAC,
            aF_3UTM: item.aF_3UTM,
            iD_GRUPO: item.iD_GRUPO,
            ctA_COD: item.ctA_COD,
            transitoria: item.transitoria,
            aF_MONTOFACTURA: item.aF_MONTOFACTURA,
            esP_DESCOMPONE: item.esP_DESCOMPONE,
            aF_ETIQUETA: item.aF_ETIQUETA,
            aF_VIDAUTIL: item.aF_VIDAUTIL,
            aF_VIGENTE: item.aF_VIGENTE,
            idprograma: item.idprograma,
            modalidad: item.modalidad,
            idpropiedad: item.idpropiedad,
            especie: item.especie,
            marca: item.marca,
            modelo: item.modelo,
            serie: item.serie,
            precio: item.precio
        }));

        // Se envian los datos al metodo
        const resultado = await listaActivosCalculadosActions(activosSeleccionados);

        // Muestra mensaje de error si no hay resultados
        if (!resultado) {
            Swal.fire({
                icon: "error",
                title: ":'(",
                text: "No se encontraron resultados, inténte otro registro.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "#000000"}`,
                confirmButtonColor: `${isDarkMode ? "#007bff" : "#444"}`,
                customClass: { popup: "custom-border" }
            });
            setLoading(false);
            return;
        }
        paginar2(1);
        paginar3(1);
        // Muestra modal y finaliza la carga
        setMostrarModalCalcular(true);
        setLoading(false);
    };

    // const setSeleccionaFilas = (index: number) => {
    //     setFilasSeleccionadas((prev) =>
    //         prev.includes(index.toString())
    //             ? prev.filter((rowIndex) => rowIndex !== index.toString())
    //             : [...prev, index.toString()]
    //     );
    // };

    // const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.checked) {
    //         setFilasSeleccionadas(
    //             elementosActuales.map((_, index) =>
    //                 (indicePrimerElemento + index).toString()
    //             )
    //         );
    //         // console.log("filas Seleccionadas ", filasSeleccionadas);
    //     } else {
    //         setFilasSeleccionadas([]);
    //     }
    // };

    //------------------------------Tabla Principal(Activos Fijos)--------------------------------------//

    // Lógica de Paginación actualizada 
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () =>
            listaActivosFijos.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaActivosFijos, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Array.isArray(listaActivosFijos)
        ? Math.ceil(listaActivosFijos.length / elementosPorPagina)
        : 0;
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    //------------------------------Tabla Modal(Activos calculados)--------------------------------------//
    // Lógica de Paginación actualizada 
    const indiceUltimoElemento2 = paginaActual2 * elementosPorPagina2;
    const indicePrimerElemento2 = indiceUltimoElemento2 - elementosPorPagina2;
    const elementosActuales2 = useMemo(
        () =>
            listaActivosCalculados.slice(indicePrimerElemento2, indiceUltimoElemento2),
        [listaActivosCalculados, indicePrimerElemento2, indiceUltimoElemento2]
    );
    const totalPaginas2 = Array.isArray(listaActivosCalculados)
        ? Math.ceil(listaActivosCalculados.length / elementosPorPagina2)
        : 0;
    const paginar2 = (numeroPagina2: number) => setPaginaActual2(numeroPagina2);

    // Calcula el total del valor residual de la tabla
    const totalRes = useMemo(() => {
        return listaActivosCalculados.reduce((sum, activo) => sum + (activo.valorResidual ?? 0), 0);
    }, [listaActivosCalculados]);

    // Calcula el total de la depreciación de la tabla
    const totalDep = useMemo(() => {
        return listaActivosCalculados.reduce((sum, activo) => sum + (activo.depreciacionAcumuladaActualizada ?? 0), 0);
    }, [listaActivosCalculados]);

    // Calcula el total de la depreciación de la tabla
    const totalDepAnual = useMemo(() => {
        return listaActivosCalculados.reduce((sum, activo) => sum + (activo.depreciacionPorAno ?? 0), 0);
    }, [listaActivosCalculados]);


    //------------------------------ Fin Tabla Modal(Activos calculados)--------------------------------------//

    //------------------------------Tabla Modal(Activos no calculados)--------------------------------------//
    // Lógica de Paginación actualizada 
    const indiceUltimoElemento3 = paginaActual3 * elementosPorPagina3;
    const indicePrimerElemento3 = indiceUltimoElemento3 - elementosPorPagina3;
    const elementosActuales3 = useMemo(
        () =>
            listaActivosNoCalculados.slice(indicePrimerElemento3, indiceUltimoElemento3),
        [listaActivosNoCalculados, indicePrimerElemento3, indiceUltimoElemento3]
    );
    const totalPaginas3 = Array.isArray(listaActivosNoCalculados)
        ? Math.ceil(listaActivosNoCalculados.length / elementosPorPagina3)
        : 0;
    const paginar3 = (numeroPagina3: number) => setPaginaActual3(numeroPagina3);
    //------------------------------ Fin Tabla Modal(Activos calculados)--------------------------------------//

    // 📂 Función para exportar a Excel
    const exportarExcel = (listaActivosCalculados: any[], fileName: string = "Reporte.xlsx") => {

        // Definir los encabezados
        const encabezados = [
            [
                // "Código",
                "Nº Inventario",
                // "Código Largo",
                "Dependencia",
                // "Código Específico",
                // "Secuencia",
                // "Clave Ítem",
                "Descripción",
                "Fecha Ingreso",
                // "Estado",
                // "Código",
                "Tipo",
                "Alta",
                "Precio Referencial",
                // "Cantidad",
                "Origen",
                "Resolución",
                "Fecha Solicitud",
                "OCO Número Ref",
                "Usuario Crea",
                "Fecha Creación",
                // "IP Creación",
                // "Usuario Modificador",
                // "Fecha Modificación",
                // "IP Modificación",
                "Tipo Documento",
                "RUN Proveedor",
                // "Reg EQM",
                "Número Factura",
                "Fecha Factura",
                "Valor 3 UTM",
                // "ID Grupo",
                "Código Cuenta",
                // "Transitoria",
                "Monto Factura",
                // "Descompone",
                // "Etiqueta",
                "Vigente",
                // "ID Programa",
                "Modalidad Compra",
                // "ID Propiedad",
                // "Especie",
                "Meses Transcurridos",
                "Vida Útil",
                "Mes Vida Útil",
                "Meses Restantes",
                "Monto Inicial",
                "Depreciación por Año",
                "Depreciación por Mes",
                "Depreciación Acumulada Actualizada"
            ]
        ];

        // Convertir datos a array de arrays
        const datos = listaActivosCalculados.map((item) => [
            // item.aF_CLAVE ?? "",
            item.aF_CODIGO_GENERICO ?? "",
            // item.aF_CODIGO_LARGO ?? "",
            item.deP_CORR?.toString() ?? "",
            // item.esP_CODIGO?.toString() ?? "",
            // item.aF_SECUENCIA?.toString() ?? "",
            // item.itE_CLAVE?.toString() ?? "",
            item.aF_DESCRIPCION ?? "",
            item.aF_FINGRESO ?? "",
            // item.aF_ESTADO ?? "",
            // item.aF_CODIGO ?? "",
            item.aF_TIPO ?? "",
            item.aF_ALTA ?? "",
            item.aF_PRECIO_REF?.toString() ?? "",
            // item.aF_CANTIDAD?.toString() ?? "",
            item.origen ?? "",
            item.aF_RESOLUCION ?? "",
            item.aF_FECHA_SOLICITUD ?? "",
            item.aF_OCO_NUMERO_REF ?? "",
            item.usuariO_CREA ?? "",
            item.f_CREA ?? "",
            // item.iP_CREA ?? "",
            // item.usuariO_MOD ?? "",
            // item.f_MOD ?? "",
            // item.iP_MODt ?? "",
            item.aF_TIPO_DOC?.toString() ?? "",
            item.proV_RUN ?? "",
            // item.reG_EQM ?? "",
            item.aF_NUM_FAC ?? "",
            item.aF_FECHAFAC ?? "",
            item.aF_3UTM ?? "",
            // item.iD_GRUPO?.toString() ?? "",
            item.ctA_COD ?? "",
            // item.transitoria ?? "",
            item.aF_MONTOFACTURA?.toString() ?? "",
            // item.esP_DESCOMPONE ?? "",
            // item.aF_ETIQUETA ?? "",
            item.aF_VIGENTE ?? "",
            // item.idprograma?.toString() ?? "",
            item.modalidad ?? "",
            // item.idpropiedad?.toString() ?? "",
            // item.especie?.toString() ?? "",
            item.mesesTranscurridos ?? "",
            item.vidaUtil ?? "",
            item.mesVidaUtil ?? "",
            item.mesesRestantes ?? "",
            item.montoInicial ?? "",
            item.depreciacionPorAno ?? "",
            item.depreciacionPorMes ?? "",
            item.depreciacionAcumuladaActualizada ?? "",


        ]);

        // Crear hoja de cálculo
        const worksheet = XLSX.utils.aoa_to_sheet([...encabezados, ...datos]);

        worksheet["!cols"] = [
            // { wch: 12 }, // Código
            { wch: 12 }, // Código Genérico
            // { wch: 12 }, // Código Largo
            { wch: 15 }, // Departamento Corr
            // { wch: 15 }, // Código Específico
            // { wch: 15 }, // Secuencia
            // { wch: 12 }, // Clave Ítem
            { wch: 70 }, // Descripción
            { wch: 15 }, // Fecha Ingreso
            { wch: 12 }, // Estado
            // { wch: 12 }, // Código
            { wch: 12 }, // Tipo
            { wch: 15 }, // Alta
            { wch: 12 }, // Precio Referencial
            // { wch: 12 }, // Cantidad
            { wch: 12 }, // Origen
            { wch: 15 }, // Resolución
            { wch: 15 }, // Fecha Solicitud
            { wch: 12 }, // OCO Número Ref
            { wch: 15 }, // Usuario Creador
            { wch: 15 }, // Fecha Creación
            // { wch: 15 }, // IP Creación
            // { wch: 15 }, // Usuario Modificador
            // { wch: 15 }, // Fecha Modificación
            // { wch: 15 }, // IP Modificación
            { wch: 12 }, // Tipo Documento
            { wch: 12 }, // RUN Proveedor
            // { wch: 12 }, // Reg EQM
            { wch: 15 }, // Número Factura
            { wch: 15 }, // Fecha Factura
            { wch: 12 }, // Valor 3 UTM
            // { wch: 12 }, // ID Grupo
            { wch: 12 }, // Código Cuenta
            // { wch: 15 }, // Transitoria
            { wch: 15 }, // Monto Factura
            // { wch: 12 }, // Descompone
            // { wch: 12 }, // Etiqueta
            { wch: 12 }, // Vigente
            // { wch: 12 }, // ID Programa
            { wch: 12 }, // ID Modalidad Compra
            // { wch: 12 }, // ID Propiedad
            // { wch: 50 },  // Especie
            { wch: 20 }, // Meses Transcurridos
            { wch: 20 }, // Vida Útil
            { wch: 20 }, // Mes Vida Útil
            { wch: 20 }, // Meses Restantes
            { wch: 20 }, // Monto Inicial
            { wch: 20 }, // Depreciación por Año
            { wch: 20 }, // Depreciación por Mes
            { wch: 20 }  // Depreciación Acumulada Actualizada
        ];

        // Aplicar color de fondo y color de texto a los encabezados
        const range = XLSX.utils.decode_range(worksheet["!ref"]!);
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: C }); // Primera fila (encabezado)

            if (worksheet[cellRef]) {
                worksheet[cellRef].s = {
                    fill: { fgColor: { rgb: "004485" } }, // Fondo azul oscuro
                    font: { bold: true, color: { rgb: "FFFFFF" } }, // Texto blanco en negrita
                    alignment: { horizontal: "center", vertical: "center" }, // Centrado
                };
            }
        }
        // Crear libro de Excel
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

        // Descargar el archivo
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fileName);
    };

    // 📂 Función para exportar a Word
    // const exportarWord = () => {

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
    //                         text: "Reporte articulos por cuentas",
    //                         heading: "Heading1",
    //                     }),
    //                     new Table({
    //                         width: { size: 100, type: WidthType.PERCENTAGE },
    //                         rows: [
    //                             // Encabezado de la tabla
    //                             new TableRow({
    //                                 children: [
    //                                     // new TableCell({ children: [new Paragraph({ text: "Código", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     new TableCell({ children: [new Paragraph({ text: "Nº Inventario", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Código Largo", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Departamento Corr", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Código Específico", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Secuencia", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Clave Ítem", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Descripción", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Fecha Ingreso", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Estado", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Código", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Tipo", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Alta", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Precio Referencial", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Cantidad", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Origen", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Resolución", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Fecha Solicitud", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "OCO Número Ref", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Usuario Creador", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Fecha Creación", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "IP Creación", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Usuario Modificador", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Fecha Modificación", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "IP Modificación", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Tipo Documento", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "RUN Proveedor", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Reg EQM", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Número Factura", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Fecha Factura", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Valor 3 UTM", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "ID Grupo", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Código Cuenta", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Transitoria", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Monto Factura", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Descompone", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Etiqueta", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Vida Útil", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "Vigente", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "ID Programa", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "ID Modalidad Compra", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     // new TableCell({ children: [new Paragraph({ text: "ID Propiedad", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     new TableCell({ children: [new Paragraph({ text: "Especie", style: "tableCellHeader" })], shading: { fill: "004485" } }),

    //                                     new TableCell({ children: [new Paragraph({ text: "Meses Transcurridos", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     new TableCell({ children: [new Paragraph({ text: "Vida Útil", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     new TableCell({ children: [new Paragraph({ text: "Mes Vida Útil", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     new TableCell({ children: [new Paragraph({ text: "Meses Restantes", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     new TableCell({ children: [new Paragraph({ text: "Monto Inicial", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     new TableCell({ children: [new Paragraph({ text: "Depreciación por Año", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     new TableCell({ children: [new Paragraph({ text: "Depreciación por Mes", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     new TableCell({ children: [new Paragraph({ text: "Depreciación Acumulada Actualizada", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                     new TableCell({ children: [new Paragraph({ text: "Valor Residual", style: "tableCellHeader" })], shading: { fill: "004485" } }),
    //                                 ],
    //                             }),
    //                             // Filas dinámicas con datos
    //                             ...listaActivosCalculados.map((item) =>
    //                                 new TableRow({
    //                                     children: [
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_CLAVE.toString(), style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.aF_CODIGO_GENERICO, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_CODIGO_GENERICO, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_CODIGO_LARGO, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.deP_CORR.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.esP_CODIGO.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_SECUENCIA.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.itE_CLAVE.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_DESCRIPCION, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_FINGRESO, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_ESTADO, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_CODIGO, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_TIPO, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_ALTA, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_PRECIO_REF.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_CANTIDAD.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_ORIGEN.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_RESOLUCION, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_FECHA_SOLICITUD, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_OCO_NUMERO_REF, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.usuariO_CREA, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.f_CREA, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.iP_CREA, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.usuariO_MOD, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.f_MOD, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.iP_MODt, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_TIPO_DOC.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.proV_RUN, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.reG_EQM, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_NUM_FAC, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_FECHAFAC, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_3UTM, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.iD_GRUPO.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.ctA_COD, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.transitoria, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_MONTOFACTURA.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.esP_DESCOMPONE, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_ETIQUETA, style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_VIDAUTIL.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.aF_VIGENTE.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.idprograma.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.idmodalidadcompra.toString(), style: "tableCell" })] }),
    //                                         // new TableCell({ children: [new Paragraph({ text: item.idpropiedad.toString(), style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.especie, style: "tableCell" })] }),

    //                                         new TableCell({ children: [new Paragraph({ text: item.mesesTranscurridos?.toString(), style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.vidaUtil?.toString(), style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.mesVidaUtil?.toString(), style: "tableCell" })] }),
    //                                         new TableCell({ children: [new Paragraph({ text: item.mesesRestantes?.toString(), style: "tableCell" })] }),
    //                                         new TableCell({
    //                                             children: [new Paragraph({
    //                                                 text: `$ ${(item.montoInicial ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
    //                                                 style: "tableCell"
    //                                             })]
    //                                         }),
    //                                         new TableCell({
    //                                             children: [new Paragraph({
    //                                                 text: `$ ${(item.depreciacionPorAno ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
    //                                                 style: "tableCell"
    //                                             })]
    //                                         }),
    //                                         new TableCell({
    //                                             children: [new Paragraph({
    //                                                 text: `$ ${(item.depreciacionPorMes ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
    //                                                 style: "tableCell"
    //                                             })]
    //                                         }),
    //                                         new TableCell({
    //                                             children: [new Paragraph({
    //                                                 text: `$ ${(item.depreciacionAcumuladaActualizada ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
    //                                                 style: "tableCell"
    //                                             })]
    //                                         }),
    //                                         new TableCell({
    //                                             children: [new Paragraph({
    //                                                 text: `$ ${(item.valorResidual ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
    //                                                 style: "tableCell"
    //                                             })]
    //                                         }),
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
    //         saveAs(blob, `Reporte_ArticulosPorCuentas.docx`);
    //         setLoading(false); //evita que quede cargando
    //     }).catch(() => {
    //         // console.error("Error al generar el documento:", error);
    //         setLoading(false);
    //     });
    // };


    return (
        <Layout>
            <Helmet>
                <title>Calcular Depreciación</title>
            </Helmet>
            <MenuInformes />

            <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                <h3 className="form-title fw-semibold border-bottom p-1">Calcular Depreciación</h3>
                <Row className="border rounded p-2 m-2">
                    <Col md={3}>
                        <div className="mb-2">
                            <div className="mb-1">
                                <label htmlFor="fDesde" className="fw-semibold">Desde</label>
                                <input
                                    aria-label="fDesde"
                                    type="date"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fDesde ? "is-invalid" : ""}`}
                                    name="fDesde"
                                    onChange={handleChange}
                                    value={Inventario.fDesde}
                                    max={new Date().toISOString().split("T")[0]}
                                />
                                {error.fDesde && (
                                    <div className="invalid-feedback d-block">{error.fDesde}</div>
                                )}
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
                                        max={new Date().toISOString().split("T")[0]}
                                    />
                                </div>
                                {error.fHasta && <div className="invalid-feedback d-block">{error.fHasta}</div>}

                            </div>
                            <small className="fw-semibold">Filtre los resultados por fecha de Ingreso.</small>
                        </div>
                    </Col>

                    <Col md={3}>
                        <div className="mb-1 z-1000">
                            <label className="fw-semibold">
                                Seleccione una cuenta
                            </label>
                            <Select
                                options={cuentasOptions}
                                onChange={handleCuentasChange}
                                name="cta_cod"
                                value={cuentasOptions.find((option) => option.value === Inventario.cta_cod) || null}
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
                                    }),
                                    option: (base, { isFocused, isSelected }) => ({
                                        ...base,
                                        backgroundColor: isSelected ? "#6c757d" : isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                                        color: isSelected ? "white" : isFocused ? "white" : isDarkMode ? "white" : "#212529",
                                    }),
                                }}
                            />
                        </div>

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
                    </Col>
                    <Col md={5}>
                        <div className="mb-1 mt-4">
                            <Button onClick={handleBuscar}
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                className="mx-1 mb-1">
                                {loadingBuscar ? (
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
                    {listaActivosFijos.length > 0 && (
                        <Button
                            onClick={handleCalcular} disabled={listaActivosFijos.length === 0}
                            className={`btn m-1 p-2 ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
                            {loading ? (
                                <>
                                    {" Calculando..."}
                                    <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                </>
                            ) : (
                                <>
                                    <Calculator className={classNames("flex-shrink-0", "h-5 w-5 mx-1 mb-1")} aria-hidden="true" />
                                    {"Calcular"} <b>{listaActivosFijos.length}</b>
                                </>
                            )}
                        </Button>

                    )}
                </div>
                {/* Tabla principal activos fijos*/}
                {loading ? (
                    <>
                        {/* <SkeletonLoader rowCount={elementosPorPagina} /> */}
                        <SkeletonLoader rowCount={10} columnCount={10} />
                    </>
                ) : (
                    <div className='table-responsive'>
                        <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                            <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                                <tr>
                                    {/* <th style={{
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 2,

                                    }}>
                                        <Form.Check
                                            className="check-danger"
                                            type="checkbox"
                                            onChange={handleSeleccionaTodos}
                                            checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                        />
                                    </th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">Código</th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">Nº Inventario</th> */}
                                    <th
                                        className="text-nowrap"
                                        style={{
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 0

                                        }}>
                                        Nº Inventario
                                    </th>
                                    {/* <th scope="col" className="text-nowrap text-center">Código Largo</th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">Dependencia</th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">ESP Código</th>
                                        <th scope="col" className="text-nowrap text-center">Secuencia</th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">ITE Clave</th> */}
                                    <th scope="col" className="text-nowrap text-center">Especie</th>
                                    <th scope="col" className="text-nowrap text-center">Marca</th>
                                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                                    <th scope="col" className="text-nowrap text-center">Serie</th>
                                    <th scope="col" className="text-nowrap text-center">Precio</th>
                                    <th scope="col" className="text-nowrap text-center">Descripción</th>
                                    <th scope="col" className="text-nowrap text-center">Fecha Ingreso</th>
                                    {/* <th scope="col" className="text-nowrap text-center">Estado</th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">Código</th> */}
                                    <th scope="col" className="text-nowrap text-center">Tipo</th>
                                    <th scope="col" className="text-nowrap text-center">Alta</th>
                                    <th scope="col" className="text-nowrap text-center">Precio Referencial</th>
                                    {/* <th scope="col" className="text-nowrap text-center">Cantidad</th> */}
                                    <th scope="col" className="text-nowrap text-center">Origen</th>
                                    <th scope="col" className="text-nowrap text-center">Resolución</th>
                                    {/* <th scope="col" className="text-nowrap text-center">Fecha Solicitud</th> */}
                                    <th scope="col" className="text-nowrap text-center">Número OCO Ref</th>
                                    <th scope="col" className="text-nowrap text-center">Usuario Crea</th>
                                    <th scope="col" className="text-nowrap text-center">Fecha Creación</th>
                                    {/* <th scope="col" className="text-nowrap text-center">IP Creación</th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">Usuario Modificador</th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">Fecha Modificación</th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">IP Modificación</th> */}
                                    <th scope="col" className="text-nowrap text-center">Tipo Documento</th>
                                    <th scope="col" className="text-nowrap text-center">RUN Proveedor</th>
                                    {/* <th scope="col" className="text-nowrap text-center">Reg EQM</th> */}
                                    <th scope="col" className="text-nowrap text-center">Número Factura</th>
                                    <th scope="col" className="text-nowrap text-center">Fecha Factura</th>
                                    <th scope="col" className="text-nowrap text-center">3 UTM</th>
                                    {/* <th scope="col" className="text-nowrap text-center">ID Grupo</th> */}
                                    <th scope="col" className="text-nowrap text-center">Código Cuenta</th>
                                    {/* <th scope="col" className="text-nowrap text-center">Transitoria</th> */}
                                    <th scope="col" className="text-nowrap text-center">Monto Factura</th>
                                    {/* <th scope="col" className="text-nowrap text-center">ESP Descompone</th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">Etiqueta</th> */}
                                    <th scope="col" className="text-nowrap text-center">Vida Útil</th>
                                    <th scope="col" className="text-nowrap text-center">Vigente</th>
                                    {/* <th scope="col" className="text-nowrap text-center">ID Programa</th> */}
                                    <th scope="col" className="text-nowrap text-center">Modalidad Compra</th>
                                    {/* <th scope="col" className="text-nowrap text-center">ID Propiedad</th> */}
                                    {/* <th scope="col" className="text-nowrap text-center">Especie</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {elementosActuales.map((Lista, index) => {
                                    // const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                    return (
                                        <tr key={index}>
                                            {/* <td style={{
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 2,
                                            }}>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={() => setSeleccionaFilas(indexReal)}
                                                    checked={filasSeleccionadas.includes(indexReal.toString())}
                                                />
                                            </td> */}
                                            {/* <td className="text-nowrap">{Lista.aF_CLAVE}</td> */}
                                            <td
                                                className="text-nowrap"
                                                style={{
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 0
                                                }}>
                                                {Lista.aF_CODIGO_GENERICO}
                                            </td>
                                            {/* <td className="text-nowrap">{Lista.aF_CODIGO_LARGO}</td> */}
                                            {/* <td className="text-nowrap">{Lista.deP_CORR}</td> */}
                                            {/* <td className="text-nowrap text-center">{Lista.esP_CODIGO}</td>
                                                <td className="text-nowrap text-center">{Lista.aF_SECUENCIA}</td> */}
                                            <td className="text-nowrap">{Lista.especie}</td>
                                            <td className="text-nowrap">{Lista.marca}</td>
                                            <td className="text-nowrap">{Lista.modelo}</td>
                                            <td className="text-nowrap">{Lista.serie}</td>
                                            <td className="text-nowrap">
                                                ${(Lista.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            <td className="text-nowrap">{Lista.aF_DESCRIPCION == "0" ? "Sin Descripción" : Lista.aF_DESCRIPCION}</td>
                                            <td className="text-nowrap">{Lista.aF_FINGRESO}</td>
                                            {/* <td className="text-nowrap text-center">{Lista.aF_ESTADO}</td> */}
                                            {/* <td className="text-nowrap">{Lista.aF_CODIGO}</td> */}
                                            <td className="text-nowrap">{Lista.aF_TIPO}</td>
                                            <td className="text-nowrap">{Lista.aF_ALTA}</td>
                                            <td className="text-nowrap">
                                                ${(Lista.aF_PRECIO_REF ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            {/* <td className="text-nowrap">{Lista.aF_CANTIDAD}</td> */}
                                            <td className="text-nowrap">{Lista.origen}</td>
                                            <td className="text-nowrap">{Lista.aF_RESOLUCION}</td>
                                            {/* <td className="text-nowrap text-center">{Lista.aF_FECHA_SOLICITUD}</td> */}
                                            <td className="text-nowrap">{Lista.aF_OCO_NUMERO_REF}</td>
                                            <td className="text-nowrap">{Lista.usuariO_CREA}</td>
                                            <td className="text-nowrap">{Lista.f_CREA}</td>
                                            {/* <td className="text-nowrap">{Lista.iP_CREA}</td> */}
                                            {/* <td className="text-nowrap">{Lista.usuariO_MOD}</td> */}
                                            {/* <td className="text-nowrap">{Lista.f_MOD}</td> */}
                                            {/* <td className="text-nowrap text-center">{Lista.iP_MODt}</td> */}
                                            <td className="text-nowrap">{Lista.aF_TIPO_DOC}</td>
                                            <td className="text-nowrap">{Lista.proV_RUN}</td>
                                            {/* <td className="text-nowrap">{Lista.reG_EQM}</td> */}
                                            <td className="text-nowrap">{Lista.aF_NUM_FAC}</td>
                                            <td className="text-nowrap">{Lista.aF_FECHAFAC}</td>
                                            <td className="text-nowrap">{Lista.aF_3UTM}</td>
                                            {/* <td className="text-nowrap">{Lista.iD_GRUPO}</td> */}
                                            <td className="text-nowrap">{Lista.ctA_COD}</td>
                                            {/* <td className="text-nowrap">{Lista.transitoria}</td> */}
                                            <td className="text-nowrap">
                                                ${(Lista.aF_MONTOFACTURA ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            {/* <td className="text-nowrap">{Lista.esP_DESCOMPONE}</td> */}
                                            {/* <td className="text-nowrap">{Lista.aF_ETIQUETA}</td> */}
                                            <td className="text-nowrap">{Lista.aF_VIDAUTIL}</td>
                                            <td className="text-nowrap">{Lista.aF_VIGENTE}</td>
                                            {/* <td className="text-nowrap">{Lista.idprograma}</td> */}
                                            <td className="text-nowrap">{Lista.modalidad}</td>
                                            {/* <td className="text-nowrap">{Lista.idpropiedad}</td> */}
                                            {/* <td className="text-nowrap">{Lista.especie}</td> */}
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


            {/* Modal Activos Calculados */}
            {listaActivosCalculados.length > 0 && (
                < Modal show={mostrarModalCalcular} onHide={() => setMostrarModalCalcular(false)}
                    fullscreen
                    dialogClassName="draggable-modal"

                // scrollable={false}

                // backdrop="static" // Evita que se cierre al hacer clic afuera
                // keyboard={false}
                >
                    <Modal.Header className={`modal-header text-white bg-success`} closeButton>
                        <Modal.Title className="fw-semibold">
                            <CheckCircle className={"flex-shrink-0 h-5 w-5 mx-1 "} aria-hidden="true" />Depreciación Calculada</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                        <div
                            className="bg-white shadow-sm sticky-top p-3">
                            <Row >
                                <Col sm={6} md={6} lg={3}>
                                    <div className="bg-light border-start border-4 border-primary shadow-sm p-3 rounded m-2">
                                        <p className="text-uppercase text-primary fw-semibold small mb-1 text-center">
                                            Total Depreciación Acumulada
                                        </p>
                                        <h4 className="fw-bold text-primary text-center m-0">
                                            $ {totalDep.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                        </h4>
                                    </div>
                                </Col>

                                <Col sm={6} md={6} lg={3}>
                                    <div className="bg-light border-start border-4 border-success shadow-sm p-3 rounded m-2">
                                        <p className="text-uppercase text-success fw-semibold small mb-1 text-center">
                                            Total Valor Residual
                                        </p>
                                        <h4 className="fw-bold text-success text-center m-0">
                                            $ {totalRes.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                        </h4>
                                    </div>
                                </Col>

                                <Col sm={6} md={6} lg={3}>
                                    <div className="bg-light border-start border-4 border-warning shadow-sm p-3 rounded m-2">
                                        <p className="text-uppercase text-warning fw-semibold small mb-1 text-center">
                                            Total Depreciación Anual
                                        </p>
                                        <h4 className="fw-bold text-warning text-center m-0">
                                            $ {totalDepAnual.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                        </h4>
                                    </div>
                                </Col>

                                <div className="d-flex justify-content-end">
                                    {listaActivosFijos.length > 10 && (
                                        <div className="d-flex align-items-center me-2">
                                            <label htmlFor="nPaginacion2" className="form-label fw-semibold mb-0 me-2">
                                                Tamaño de página:
                                            </label>
                                            <select
                                                aria-label="Seleccionar tamaño de página"
                                                className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                name="nPaginacion2"
                                                onChange={handleChange}
                                                value={Paginacion.nPaginacion2}
                                            >
                                                {[10, 25, 50, 75, 100, listaActivosCalculados.length].map((val) => (
                                                    <option key={val} value={val}>{val}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    {listaActivosNoCalculados.length > 0 && (
                                        <Button
                                            onClick={() => setMostrarModalNoCalculados(true)}
                                            disabled={listaActivosCalculados.length === 0}
                                            variant="warning"
                                            className="mx-1 mb-1">
                                            <ExclamationDiamond className={classNames("flex-shrink-0", "h-5 w-5 mx-1 mb-1 text-danger")} aria-hidden="true" />
                                            {"No Calculados"} <b>{listaActivosNoCalculados.length}</b>
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => setMostrarModal(true)}
                                        disabled={listaActivosCalculados.length === 0}
                                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                                        className="mx-1 mb-1" >

                                        {mostrarModal ? (
                                            <>
                                                {" Un Momento..."}
                                                <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                            </>
                                        ) : (
                                            <>
                                                <FiletypePdf className={classNames("flex-shrink-0", "h-5 w-5 mx-1 mb-1")} aria-hidden="true" />
                                                {"Exportar"} <b>{listaActivosCalculados.length}</b>  {"Calculados"}

                                            </>
                                        )}
                                    </Button>

                                </div>
                            </Row>
                        </div>
                        {/* Tabla activos calculados*/}
                        <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="mt-2">
                            {loading ? (
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
                                                    {/* <th scope="col" className="text-nowrap text-center">Código</th> */}
                                                    <th
                                                        scope="col"
                                                        className="text-nowrap text-center"
                                                        style={{
                                                            position: 'sticky',
                                                            left: 0,
                                                            zIndex: 0,

                                                        }}>
                                                        Nº Inventario
                                                    </th>
                                                    {/* <th scope="col" className="text-nowrap text-center">Código Largo</th> */}
                                                    {/* <th scope="col" className="text-nowrap text-center">Dependencia</th> */}
                                                    {/* <th scope="col" className="text-nowrap text-center">ESP Código</th>
                                        <th scope="col" className="text-nowrap text-center">Secuencia</th> */}
                                                    {/* <th scope="col" className="text-nowrap text-center">ITE Clave</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Especie</th>
                                                    <th scope="col" className="text-nowrap text-center">Marca</th>
                                                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                                                    <th scope="col" className="text-nowrap text-center">Serie</th>
                                                    <th scope="col" className="text-nowrap text-center">Precio</th>
                                                    <th scope="col" className="text-nowrap text-center">Descripción</th>
                                                    <th scope="col" className="text-nowrap text-center">Fecha Ingreso</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">Estado</th> */}
                                                    {/* <th scope="col" className="text-nowrap text-center">Código</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Tipo</th>
                                                    <th scope="col" className="text-nowrap text-center">Alta</th>
                                                    <th scope="col" className="text-nowrap text-center">Precio Referencial</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">Cantidad</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Origen</th>
                                                    <th scope="col" className="text-nowrap text-center">Resolución</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">Fecha Solicitud</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Número OCO Ref</th>
                                                    <th scope="col" className="text-nowrap text-center">Usuario Crea</th>
                                                    <th scope="col" className="text-nowrap text-center">Fecha Creación</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">IP Creación</th> */}
                                                    {/* <th scope="col" className="text-nowrap text-center">Usuario Modificador</th> */}
                                                    {/* <th scope="col" className="text-nowrap text-center">Fecha Modificación</th> */}
                                                    {/* <th scope="col" className="text-nowrap text-center">IP Modificación</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Tipo Documento</th>
                                                    <th scope="col" className="text-nowrap text-center">RUN Proveedor</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">Reg EQM</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Número Factura</th>
                                                    <th scope="col" className="text-nowrap text-center">Fecha Factura</th>
                                                    <th scope="col" className="text-nowrap text-center">3 UTM</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">ID Grupo</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Código Cuenta</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">Transitoria</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Monto Factura</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">ESP Descompone</th> */}
                                                    {/* <th scope="col" className="text-nowrap text-center">Etiqueta</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Vigente</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">ID Programa</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Modalidad Compra</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">ID Propiedad</th> */}
                                                    {/* <th scope="col" className="text-nowrap text-center">Especie</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Meses transcurrido</th>
                                                    <th scope="col" className="text-nowrap text-center">Vida Útil</th>
                                                    <th scope="col" className="text-nowrap text-center">Mes Vida Útil</th>
                                                    <th scope="col" className="text-nowrap text-center">Meses Restantes</th>
                                                    <th scope="col" className="text-nowrap text-center">Monto Inicial</th>
                                                    <th scope="col" className="text-nowrap text-center">Depreciación Mensual</th>
                                                    <td
                                                        scope="col"
                                                        className="text-nowrap text-center bg-warning text-white rounded-top"
                                                        style={{
                                                            position: 'sticky',
                                                            right: 325,
                                                            zIndex: 0
                                                        }}>
                                                        <b> Depreciación Anual </b>
                                                    </td>
                                                    <td
                                                        scope="col"
                                                        className="text-nowrap text-center bg-primary text-white rounded-top"
                                                        style={{
                                                            position: 'sticky',
                                                            right: 122,
                                                            zIndex: 0
                                                        }}>
                                                        <b> Depreciación Acumulada </b>
                                                    </td>
                                                    <td
                                                        scope="col"
                                                        className="text-nowrap text-center bg-success text-white rounded-top"
                                                        style={{
                                                            position: 'sticky',
                                                            right: 0,
                                                            zIndex: 0
                                                        }}>
                                                        <b> Valor Residual</b>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {elementosActuales2.map((lista, index) =>

                                                    <tr key={index}>
                                                        {/* <td className="text-nowrap text-center">{lista.aF_CLAVE}</td> */}
                                                        <td
                                                            className="text-nowrap text-center"
                                                            style={{
                                                                position: 'sticky',
                                                                left: 0,
                                                                zIndex: 0,

                                                            }}>
                                                            {lista.aF_CODIGO_GENERICO}
                                                        </td>
                                                        {/* <td className="text-nowrap text-center">{lista.aF_CODIGO_LARGO}</td> */}
                                                        {/* <td className="text-nowrap text-center">{lista.deP_CORR}</td> */}
                                                        {/* <td className="text-nowrap text-center">{lista.esP_CODIGO}</td>
                                                          <td className="text-nowrap text-center">{lista.aF_SECUENCIA}</td> */}
                                                        <td className="text-nowrap text-center">{lista.especie}</td>
                                                        <td className="text-nowrap text-center">{lista.marca}</td>
                                                        <td className="text-nowrap text-center">{lista.modelo}</td>
                                                        <td className="text-nowrap text-center">{lista.serie}</td>
                                                        <td className="text-nowrap text-center">
                                                            ${(lista.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                        </td>
                                                        <td className="text-nowrap text-center">{lista.aF_DESCRIPCION == "0" ? "Sin Descripción" : lista.aF_DESCRIPCION}</td>
                                                        <td className="text-nowrap text-center">{lista.aF_FINGRESO}</td>
                                                        {/* <td className="text-nowrap text-center">{lista.aF_ESTADO}</td> */}
                                                        {/* <td className="text-nowrap text-center">{lista.aF_CODIGO}</td> */}
                                                        <td className="text-nowrap text-center">{lista.aF_TIPO}</td>
                                                        <td className="text-nowrap text-center">{lista.aF_ALTA}</td>
                                                        <td className="text-nowrap text-center">
                                                            ${(lista.aF_PRECIO_REF ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                        </td>
                                                        {/* <td className="text-nowrap text-center">{lista.aF_CANTIDAD}</td> */}
                                                        <td className="text-nowrap text-center">{lista.origen}</td>
                                                        <td className="text-nowrap text-center">{lista.aF_RESOLUCION}</td>
                                                        {/* <td className="text-nowrap text-center">{lista.aF_FECHA_SOLICITUD}</td> */}
                                                        <td className="text-nowrap text-center">{lista.aF_OCO_NUMERO_REF}</td>
                                                        <td className="text-nowrap text-center">{lista.usuariO_CREA}</td>
                                                        <td className="text-nowrap text-center">{lista.f_CREA}</td>
                                                        {/* <td className="text-nowrap text-center">{lista.iP_CREA}</td> */}
                                                        {/* <td className="text-nowrap text-center">{lista.usuariO_MOD}</td> */}
                                                        {/* <td className="text-nowrap text-center">{lista.f_MOD}</td> */}
                                                        {/* <td className="text-nowrap text-center">{lista.iP_MODt}</td> */}
                                                        <td className="text-nowrap text-center">{lista.aF_TIPO_DOC}</td>
                                                        <td className="text-nowrap text-center">{lista.proV_RUN}</td>
                                                        {/* <td className="text-nowrap text-center">{lista.reG_EQM}</td> */}
                                                        <td className="text-nowrap text-center">{lista.aF_NUM_FAC}</td>
                                                        <td className="text-nowrap text-center">{lista.aF_FECHAFAC}</td>
                                                        <td className="text-nowrap text-center">{lista.aF_3UTM}</td>
                                                        {/* <td className="text-nowrap text-center">{lista.iD_GRUPO}</td> */}
                                                        <td className="text-nowrap text-center">{lista.ctA_COD}</td>
                                                        {/* <td className="text-nowrap text-center">{lista.transitoria}</td> */}
                                                        <td className="text-nowrap text-center">
                                                            ${(lista.aF_MONTOFACTURA ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                        </td>
                                                        {/* <td className="text-nowrap text-center">{lista.esP_DESCOMPONE}</td> */}
                                                        {/* <td className="text-nowrap text-center">{lista.aF_ETIQUETA}</td> */}
                                                        <td className="text-nowrap text-center">{lista.aF_VIGENTE}</td>
                                                        {/* <td className="text-nowrap text-center">{lista.idprograma}</td> */}
                                                        <td className="text-nowrap text-center">{lista.modalidad}</td>
                                                        {/* <td className="text-nowrap text-center">{lista.idpropiedad}</td> */}
                                                        {/* <td className="text-nowrap text-center">{lista.especie}</td> */}

                                                        {/* valores calculados */}
                                                        <td className="text-nowrap text-center">{lista.mesesTranscurridos}</td>
                                                        <td className="text-nowrap text-center">{lista.vidaUtil}</td>
                                                        <td className="text-nowrap text-center">{lista.mesVidaUtil}</td>
                                                        <td className="text-nowrap text-center">{lista.mesesRestantes}</td>
                                                        <td className="text-nowrap text-center">
                                                            $ {(lista.montoInicial ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                        </td>
                                                        <td className="text-nowrap text-center">
                                                            $ {(lista.depreciacionPorMes ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                        </td>
                                                        <td
                                                            className="text-nowrap text-center fw-bold"
                                                            style={{
                                                                position: 'sticky',
                                                                right: 325,
                                                                zIndex: 0,
                                                                color: '#2f3e78',
                                                                background: '#a4d1ff'
                                                                // background: '#a4d1ff'
                                                            }}>
                                                            ${lista.depreciacionPorAno?.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                        </td>
                                                        <td
                                                            className="text-nowrap text-center fw-bold"
                                                            style={{
                                                                position: 'sticky',
                                                                right: 122,
                                                                zIndex: 0,
                                                                color: '#2f3e78',
                                                                background: '#a4d1ff'
                                                            }}>
                                                            ${lista.depreciacionAcumuladaActualizada?.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                        </td>
                                                        <td
                                                            className="text-nowrap text-center fw-bold"
                                                            style={{
                                                                position: 'sticky',
                                                                right: 0,
                                                                zIndex: 0,
                                                                color: '#2f3e78',
                                                                background: '#a4d1ff'
                                                                // background: '#baecbf'
                                                            }}>
                                                            ${lista.valorResidual === 0 ? 1 : lista.valorResidual?.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Paginador */}
                        <div className="paginador-container">
                            <Pagination className="paginador-scroll">
                                <Pagination.First
                                    onClick={() => paginar2(1)}
                                    disabled={paginaActual2 === 1}
                                />
                                <Pagination.Prev
                                    onClick={() => paginar2(paginaActual2 - 1)}
                                    disabled={paginaActual2 === 1}
                                />

                                {Array.from({ length: totalPaginas2 }, (_, i) => (
                                    <Pagination.Item
                                        key={i + 1}
                                        active={i + 1 === paginaActual2}
                                        onClick={() => paginar2(i + 1)}
                                    >
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => paginar2(paginaActual2 + 1)}
                                    disabled={paginaActual2 === totalPaginas2}
                                />
                                <Pagination.Last
                                    onClick={() => paginar2(totalPaginas2)}
                                    disabled={paginaActual2 === totalPaginas2}
                                />
                            </Pagination>
                        </div>
                    </Modal.Body>
                </Modal>

            )
            }

            {/* Modal Activos NO Calculados */}
            <Modal show={mostrarModalNoCalculados} onHide={() => setMostrarModalNoCalculados(false)} /*dialogClassName="modal-fullscreen" */ size="xl">
                <Modal.Header className={`modal-header bg-warning`} closeButton>
                    <Modal.Title className="fw-semibold">
                        <ExclamationDiamond className={"flex-shrink-0 h-5 w-5 mx-1 mb-1 text-danger"} aria-hidden="true" />No Calculados</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    {/* Tabla*/}
                    {loading ? (
                        <>
                            {/* <SkeletonLoader rowCount={elementosPorPagina} /> */}
                            <SkeletonLoader rowCount={10} columnCount={10} />
                        </>
                    ) : (
                        <div className='table-responsive'>
                            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                                <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                                    <tr>
                                        <th scope="col" className="text-nowrap text-center">Código</th>
                                        <th scope="col" className="text-nowrap text-center sticky-left z-0">
                                            Nº Inventario
                                        </th>
                                        {/* <th scope="col" className="text-nowrap text-center">Código Largo</th> */}
                                        {/* <th scope="col" className="text-nowrap text-center">Dependencia</th> */}
                                        {/* <th scope="col" className="text-nowrap text-center">ESP Código</th>
                                        <th scope="col" className="text-nowrap text-center">Secuencia</th> */}
                                        {/* <th scope="col" className="text-nowrap text-center">ITE Clave</th> */}
                                        <th scope="col" className="text-nowrap text-center">Especie</th>
                                        <th scope="col" className="text-nowrap text-center">Marca</th>
                                        <th scope="col" className="text-nowrap text-center">Modelo</th>
                                        <th scope="col" className="text-nowrap text-center">Serie</th>
                                        <th scope="col" className="text-nowrap text-center">Precio</th>
                                        <th scope="col" className="text-nowrap text-center">Descripción</th>
                                        <th scope="col" className="text-nowrap text-center">Vida Útil</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Ingreso</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Estado</th> */}
                                        {/* <th scope="col" className="text-nowrap text-center">Código</th> */}
                                        <th scope="col" className="text-nowrap text-center">Tipo</th>
                                        <th scope="col" className="text-nowrap text-center">Alta</th>
                                        <th scope="col" className="text-nowrap text-center">Precio Referencial</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Cantidad</th> */}
                                        <th scope="col" className="text-nowrap text-center">Origen</th>
                                        <th scope="col" className="text-nowrap text-center">Resolución</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Fecha Solicitud</th> */}
                                        <th scope="col" className="text-nowrap text-center">Número OCO Ref</th>
                                        <th scope="col" className="text-nowrap text-center">Usuario Crea</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Creación</th>
                                        {/* <th scope="col" className="text-nowrap text-center">IP Creación</th> */}
                                        {/* <th scope="col" className="text-nowrap text-center">Usuario Modificador</th> */}
                                        {/* <th scope="col" className="text-nowrap text-center">Fecha Modificación</th> */}
                                        {/* <th scope="col" className="text-nowrap text-center">IP Modificación</th> */}
                                        <th scope="col" className="text-nowrap text-center">Tipo Documento</th>
                                        <th scope="col" className="text-nowrap text-center">RUN Proveedor</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Reg EQM</th> */}
                                        <th scope="col" className="text-nowrap text-center">Número Factura</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Factura</th>
                                        <th scope="col" className="text-nowrap text-center">3 UTM</th>
                                        {/* <th scope="col" className="text-nowrap text-center">ID Grupo</th> */}
                                        <th scope="col" className="text-nowrap text-center">Código Cuenta</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Transitoria</th> */}
                                        <th scope="col" className="text-nowrap text-center">Monto Factura</th>
                                        {/* <th scope="col" className="text-nowrap text-center">ESP Descompone</th> */}
                                        {/* <th scope="col" className="text-nowrap text-center">Etiqueta</th> */}
                                        <th scope="col" className="text-nowrap text-center">Vigente</th>
                                        {/* <th scope="col" className="text-nowrap text-center">ID Programa</th> */}
                                        <th scope="col" className="text-nowrap text-center">Modalidad Compra</th>
                                        {/* <th scope="col" className="text-nowrap text-center">ID Propiedad</th> */}
                                        {/* <th scope="col" className="text-nowrap text-center">Especie</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {elementosActuales3.map((lista, index) =>

                                        <tr key={index}>
                                            <td className="text-nowrap text-center">{lista.aF_CLAVE}</td>
                                            <td scope="col" className="text-nowrap text-center sticky-left z-0">  {lista.aF_CODIGO_GENERICO}</td>
                                            {/* <td className="text-nowrap text-center">{lista.aF_CODIGO_LARGO}</td> */}
                                            {/* <td className="text-nowrap text-center">{lista.deP_CORR}</td> */}
                                            {/* <td className="text-nowrap text-center">{lista.esP_CODIGO}</td>
                                            <td className="text-nowrap text-center">{lista.aF_SECUENCIA}</td> */}
                                            <td className="text-nowrap text-center">{lista.especie}</td>
                                            <td className="text-nowrap text-center">{lista.marca}</td>
                                            <td className="text-nowrap text-center">{lista.modelo}</td>
                                            <td className="text-nowrap text-center">{lista.serie}</td>
                                            <td className="text-nowrap text-center">
                                                ${(lista.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            <td className="text-nowrap">{lista.aF_DESCRIPCION == "0" ? "Sin Descripción" : lista.aF_DESCRIPCION}</td>
                                            <td className={`text-nowrap text-center ${isDarkMode ? "bg-warning" : "bg-warning-subtle"}`}>{lista.vidaUtil}</td>
                                            <td className="text-nowrap text-center">{lista.aF_FINGRESO}</td>
                                            {/* <td className="text-nowrap text-center">{lista.aF_ESTADO}</td> */}
                                            {/* <td className="text-nowrap text-center">{lista.aF_CODIGO}</td> */}
                                            <td className="text-nowrap text-center">{lista.aF_TIPO}</td>
                                            <td className="text-nowrap text-center">{lista.aF_ALTA}</td>
                                            <td className="text-nowrap text-center">
                                                ${(lista.aF_PRECIO_REF ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            {/* <td className="text-nowrap text-center">{lista.aF_CANTIDAD}</td> */}
                                            <td className="text-nowrap text-center">{lista.origen}</td>
                                            <td className="text-nowrap text-center">{lista.aF_RESOLUCION}</td>
                                            {/* <td className="text-nowrap text-center">{lista.aF_FECHA_SOLICITUD}</td> */}
                                            <td className="text-nowrap text-center">{lista.aF_OCO_NUMERO_REF}</td>
                                            <td className="text-nowrap text-center">{lista.usuariO_CREA}</td>
                                            <td className="text-nowrap text-center">{lista.f_CREA}</td>
                                            {/* <td className="text-nowrap text-center">{lista.iP_CREA}</td> */}
                                            {/* <td className="text-nowrap text-center">{lista.usuariO_MOD}</td> */}
                                            {/* <td className="text-nowrap text-center">{lista.f_MOD}</td> */}
                                            {/* <td className="text-nowrap text-center">{lista.iP_MODt}</td> */}
                                            <td className="text-nowrap text-center">{lista.aF_TIPO_DOC}</td>
                                            <td className="text-nowrap text-center">{lista.proV_RUN}</td>
                                            {/* <td className="text-nowrap text-center">{lista.reG_EQM}</td> */}
                                            <td className="text-nowrap text-center">{lista.aF_NUM_FAC}</td>
                                            <td className="text-nowrap text-center">{lista.aF_FECHAFAC}</td>
                                            <td className="text-nowrap text-center">{lista.aF_3UTM}</td>
                                            {/* <td className="text-nowrap text-center">{lista.iD_GRUPO}</td> */}
                                            <td className="text-nowrap text-center">{lista.ctA_COD}</td>
                                            {/* <td className="text-nowrap text-center">{lista.transitoria}</td> */}
                                            <td className="text-nowrap text-center">
                                                ${(lista.aF_MONTOFACTURA ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            {/* <td className="text-nowrap text-center">{lista.esP_DESCOMPONE}</td> */}
                                            {/* <td className="text-nowrap text-center">{lista.aF_ETIQUETA}</td> */}
                                            <td className="text-nowrap text-center">{lista.aF_VIGENTE}</td>
                                            {/* <td className="text-nowrap text-center">{lista.idprograma}</td> */}
                                            <td className="text-nowrap text-center">{lista.modalidad}</td>
                                            {/* <td className="text-nowrap text-center">{lista.idpropiedad}</td> */}
                                            {/* <td className="text-nowrap text-center">{lista.especie}</td> */}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* Paginador */}
                    <div className="paginador-container">
                        <Pagination className="paginador-scroll">
                            <Pagination.First
                                onClick={() => paginar3(1)}
                                disabled={paginaActual3 === 1}
                            />
                            <Pagination.Prev
                                onClick={() => paginar3(paginaActual3 - 1)}
                                disabled={paginaActual3 === 1}
                            />

                            {Array.from({ length: totalPaginas3 }, (_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === paginaActual3}
                                    onClick={() => paginar3(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => paginar3(paginaActual3 + 1)}
                                disabled={paginaActual3 === totalPaginas3}
                            />
                            <Pagination.Last
                                onClick={() => paginar3(totalPaginas3)}
                                disabled={paginaActual3 === totalPaginas3}
                            />
                        </Pagination>
                    </div>
                </Modal.Body>
            </Modal >

            {/* Modal PDF Excel Word */}
            < Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="xl" >
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Reporte Depreciación</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                    <BlobProvider document={
                        <DocumentoPDF
                            row={listaActivosCalculados}
                            totalRes={totalRes}
                            totalDep={totalDep}
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
                                            onClick={() => exportarExcel(listaActivosCalculados)}
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
                </Modal.Body>
            </Modal >
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaActivosFijos: state.listaActivosFijosReducers.listaActivosFijos,
    listaActivosCalculados: state.listaActivosCalculadosReducers.listaActivosCalculados,
    listaActivosNoCalculados: state.listaActivosNoCalculadosReducers.listaActivosNoCalculados,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboCuentasInforme: state.comboCuentasInformeReducers.comboCuentasInforme,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    listaActivosFijosActions,
    listaActivosCalculadosActions,
    comboCuentasInformeActions
})(CalcularDepreciacion);
