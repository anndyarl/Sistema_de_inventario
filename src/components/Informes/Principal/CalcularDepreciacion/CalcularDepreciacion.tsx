import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner, Form, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { BoxArrowDown, Calculator, Eraser, ExclamationDiamond, FileEarmarkExcel, FileEarmarkWord, Search } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";
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
    aF_ORIGEN: number;
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
    idmodalidadcompra: number;
    idpropiedad: number;
    especie: string;

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
    listaActivosFijosActions: (cta_cod: string, fDesde: string, fHasta: string) => Promise<boolean>;
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
    const [loading, setLoading] = useState(false); // Estado para controlar la carga 
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginaActual2, setPaginaActual2] = useState(1);
    const [paginaActual3, setPaginaActual3] = useState(1);
    const elementosPorPagina = nPaginacion;
    const elementosPorPagina2 = nPaginacion;
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
    });
    const listaActivosFijosAuto = async () => {
        if (listaActivosFijos.length === 0) {
            setLoading(true);
            const resultado = await listaActivosFijosActions("", "", "");
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
            listaActivosFijosAuto();
            setlistaActivosCalculados(listaActivosCalculados);
            if (comboCuentasInforme.length === 0) { comboCuentasInformeActions() }
            if (listaActivosNoCalculados.length > 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Activos con cálculo pendiente",
                    text: "Algunos activos no han sido calculados porque su vida útil es 0. Haga clic en 'Ver' para revisar los detalles.",
                    confirmButtonText: "Ver",
                    cancelButtonText: "Cerrar",
                    showCancelButton: true,
                    width: "600px", // Aumenta el tamaño del modal
                    background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "#000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                    cancelButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                    customClass: {
                        popup: "custom-border",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        setMostrarModalNoCalculados(true); // Abre el modal después de confirmar
                    }
                });
            }
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
        let newValue: string | number = [
            "aF_CLAVE"

        ].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setInventario((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));

    };

    const handleCuentasChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : "";
        setInventario((prevMantenedor) => ({ ...prevMantenedor, cta_cod: value }));
        console.log(value);
    };

    const handleBuscar = async () => {
        let resultado = false;

        setLoading(true);
        //Si las fechas no estan vacias las valida, de lo contrario solo permite filtrar por codigo de la cuenta
        if (Inventario.fDesde != "" && Inventario.fHasta != "") {
            if (validate()) {
                resultado = await listaActivosFijosActions(Inventario.cta_cod, Inventario.fDesde, Inventario.fHasta);
            }
        }
        else {
            resultado = await listaActivosFijosActions(Inventario.cta_cod, "", "");
        }
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
            fDesde: "",
            fHasta: "",
            cta_cod: ""
        }));
        setFilasSeleccionadas([]);
    };

    const handleCalcular = async () => {
        setLoading(true);

        // Limpiar los activos seleccionados antes de enviar los nuevos datos
        setlistaActivosCalculados([]);
        await listaActivosCalculadosActions([]); // Envía un array vacío para eliminar datos previos

        // Seleccionar los nuevos activos
        const selectedIndices = filasSeleccionadas.map(Number);
        const activosSeleccionados = selectedIndices.map((index) => ({
            aF_CLAVE: listaActivosFijos[index].aF_CLAVE,
            aF_CODIGO_GENERICO: listaActivosFijos[index].aF_CODIGO_GENERICO,
            aF_CODIGO_LARGO: listaActivosFijos[index].aF_CODIGO_LARGO,
            deP_CORR: listaActivosFijos[index].deP_CORR,
            itE_CLAVE: listaActivosFijos[index].itE_CLAVE,
            aF_DESCRIPCION: listaActivosFijos[index].aF_DESCRIPCION,
            aF_FINGRESO: listaActivosFijos[index].aF_FINGRESO,
            aF_CODIGO: listaActivosFijos[index].aF_CODIGO,
            aF_TIPO: listaActivosFijos[index].aF_TIPO,
            aF_ALTA: listaActivosFijos[index].aF_ALTA,
            aF_PRECIO_REF: listaActivosFijos[index].aF_PRECIO_REF,
            aF_CANTIDAD: listaActivosFijos[index].aF_CANTIDAD,
            aF_ORIGEN: listaActivosFijos[index].aF_ORIGEN,
            aF_RESOLUCION: listaActivosFijos[index].aF_RESOLUCION,
            aF_OCO_NUMERO_REF: listaActivosFijos[index].aF_OCO_NUMERO_REF,
            usuariO_CREA: listaActivosFijos[index].usuariO_CREA,
            f_CREA: listaActivosFijos[index].f_CREA,
            iP_CREA: listaActivosFijos[index].iP_CREA,
            usuariO_MOD: listaActivosFijos[index].usuariO_MOD,
            f_MOD: listaActivosFijos[index].f_MOD,
            aF_TIPO_DOC: listaActivosFijos[index].aF_TIPO_DOC,
            proV_RUN: listaActivosFijos[index].proV_RUN,
            reG_EQM: listaActivosFijos[index].reG_EQM,
            aF_NUM_FAC: listaActivosFijos[index].aF_NUM_FAC,
            aF_FECHAFAC: listaActivosFijos[index].aF_FECHAFAC,
            aF_3UTM: listaActivosFijos[index].aF_3UTM,
            iD_GRUPO: listaActivosFijos[index].iD_GRUPO,
            ctA_COD: listaActivosFijos[index].ctA_COD,
            transitoria: listaActivosFijos[index].transitoria,
            aF_MONTOFACTURA: listaActivosFijos[index].aF_MONTOFACTURA,
            esP_DESCOMPONE: listaActivosFijos[index].esP_DESCOMPONE,
            aF_ETIQUETA: listaActivosFijos[index].aF_ETIQUETA,
            aF_VIDAUTIL: listaActivosFijos[index].aF_VIDAUTIL,
            aF_VIGENTE: listaActivosFijos[index].aF_VIGENTE,
            idprograma: listaActivosFijos[index].idprograma,
            idmodalidadcompra: listaActivosFijos[index].idmodalidadcompra,
            idpropiedad: listaActivosFijos[index].idpropiedad,
            especie: listaActivosFijos[index].especie
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

        // Muestra modal y finaliza la carga
        setMostrarModalCalcular(true);
        setLoading(false);
    };

    const setSeleccionaFilas = (index: number) => {
        setFilasSeleccionadas((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
    };

    const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setFilasSeleccionadas(
                elementosActuales.map((_, index) =>
                    (indicePrimerElemento + index).toString()
                )
            );
            // console.log("filas Seleccionadas ", filasSeleccionadas);
        } else {
            setFilasSeleccionadas([]);
        }
    };
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

    // Calcula el total del precio de la tabla
    const totalSum = useMemo(() => {
        return listaActivosCalculados.reduce((sum, activo) => sum + (activo.valorResidual ?? 0), 0);
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
                "Departamento Corr",
                "Código Específico",
                "Secuencia",
                "Clave Ítem",
                "Descripción",
                "Fecha Ingreso",
                "Estado",
                "Código",
                "Tipo",
                "Alta",
                "Precio Referencial",
                "Cantidad",
                "Origen",
                "Resolución",
                "Fecha Solicitud",
                "OCO Número Ref",
                "Usuario Creador",
                "Fecha Creación",
                "IP Creación",
                "Usuario Modificador",
                "Fecha Modificación",
                "IP Modificación",
                "Tipo Documento",
                "RUN Proveedor",
                "Reg EQM",
                "Número Factura",
                "Fecha Factura",
                "Valor 3 UTM",
                "ID Grupo",
                "Código Cuenta",
                "Transitoria",
                "Monto Factura",
                "Descompone",
                "Etiqueta",
                "Vigente",
                "ID Programa",
                "ID Modalidad Compra",
                "ID Propiedad",
                "Especie",
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
            item.esP_CODIGO?.toString() ?? "",
            item.aF_SECUENCIA?.toString() ?? "",
            item.itE_CLAVE?.toString() ?? "",
            item.aF_DESCRIPCION ?? "",
            item.aF_FINGRESO ?? "",
            item.aF_ESTADO ?? "",
            item.aF_CODIGO ?? "",
            item.aF_TIPO ?? "",
            item.aF_ALTA ?? "",
            item.aF_PRECIO_REF?.toString() ?? "",
            item.aF_CANTIDAD?.toString() ?? "",
            item.aF_ORIGEN?.toString() ?? "",
            item.aF_RESOLUCION ?? "",
            item.aF_FECHA_SOLICITUD ?? "",
            item.aF_OCO_NUMERO_REF ?? "",
            item.usuariO_CREA ?? "",
            item.f_CREA ?? "",
            item.iP_CREA ?? "",
            item.usuariO_MOD ?? "",
            item.f_MOD ?? "",
            item.iP_MODt ?? "",
            item.aF_TIPO_DOC?.toString() ?? "",
            item.proV_RUN ?? "",
            item.reG_EQM ?? "",
            item.aF_NUM_FAC ?? "",
            item.aF_FECHAFAC ?? "",
            item.aF_3UTM ?? "",
            item.iD_GRUPO?.toString() ?? "",
            item.ctA_COD ?? "",
            item.transitoria ?? "",
            item.aF_MONTOFACTURA?.toString() ?? "",
            item.esP_DESCOMPONE ?? "",
            item.aF_ETIQUETA ?? "",
            item.aF_VIGENTE ?? "",
            item.idprograma?.toString() ?? "",
            item.idmodalidadcompra?.toString() ?? "",
            item.idpropiedad?.toString() ?? "",
            item.especie?.toString() ?? "",
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
            { wch: 15 }, // Código Específico
            { wch: 15 }, // Secuencia
            { wch: 12 }, // Clave Ítem
            { wch: 70 }, // Descripción
            { wch: 15 }, // Fecha Ingreso
            { wch: 12 }, // Estado
            { wch: 12 }, // Código
            { wch: 12 }, // Tipo
            { wch: 15 }, // Alta
            { wch: 12 }, // Precio Referencial
            { wch: 12 }, // Cantidad
            { wch: 12 }, // Origen
            { wch: 15 }, // Resolución
            { wch: 15 }, // Fecha Solicitud
            { wch: 12 }, // OCO Número Ref
            { wch: 15 }, // Usuario Creador
            { wch: 15 }, // Fecha Creación
            { wch: 15 }, // IP Creación
            { wch: 15 }, // Usuario Modificador
            { wch: 15 }, // Fecha Modificación
            { wch: 15 }, // IP Modificación
            { wch: 12 }, // Tipo Documento
            { wch: 12 }, // RUN Proveedor
            { wch: 12 }, // Reg EQM
            { wch: 15 }, // Número Factura
            { wch: 15 }, // Fecha Factura
            { wch: 12 }, // Valor 3 UTM
            { wch: 12 }, // ID Grupo
            { wch: 12 }, // Código Cuenta
            { wch: 15 }, // Transitoria
            { wch: 15 }, // Monto Factura
            { wch: 12 }, // Descompone
            { wch: 12 }, // Etiqueta
            { wch: 12 }, // Vigente
            { wch: 12 }, // ID Programa
            { wch: 12 }, // ID Modalidad Compra
            { wch: 12 }, // ID Propiedad
            { wch: 50 },  // Especie
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
    const exportarWord = () => {

        const doc = new Document({
            styles: {
                paragraphStyles: [
                    {
                        id: "tableCellHeader",
                        name: "tableCellHeader",
                        basedOn: "Normal",
                        run: {
                            size: 10,
                            color: "FFFFFF",
                            bold: true,
                        },
                    },
                    {
                        id: "tableCell",
                        name: "tableCell",
                        basedOn: "Normal",
                        run: {
                            size: 10,
                            bold: true,
                        },
                    },
                ],
            },
            sections: [
                {
                    children: [
                        new Paragraph({
                            text: "Reporte articulos por cuentas",
                            heading: "Heading1",
                        }),
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            rows: [
                                // Encabezado de la tabla
                                new TableRow({
                                    children: [
                                        // new TableCell({ children: [new Paragraph({ text: "Código", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        new TableCell({ children: [new Paragraph({ text: "Nº Inventario", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Código Largo", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Departamento Corr", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Código Específico", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Secuencia", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Clave Ítem", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Descripción", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Fecha Ingreso", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Estado", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Código", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Tipo", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Alta", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Precio Referencial", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Cantidad", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Origen", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Resolución", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Fecha Solicitud", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "OCO Número Ref", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Usuario Creador", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Fecha Creación", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "IP Creación", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Usuario Modificador", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Fecha Modificación", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "IP Modificación", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Tipo Documento", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "RUN Proveedor", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Reg EQM", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Número Factura", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Fecha Factura", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Valor 3 UTM", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "ID Grupo", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Código Cuenta", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Transitoria", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Monto Factura", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Descompone", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Etiqueta", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Vida Útil", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "Vigente", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "ID Programa", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "ID Modalidad Compra", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        // new TableCell({ children: [new Paragraph({ text: "ID Propiedad", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        new TableCell({ children: [new Paragraph({ text: "Especie", style: "tableCellHeader" })], shading: { fill: "004485" } }),

                                        new TableCell({ children: [new Paragraph({ text: "Meses Transcurridos", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        new TableCell({ children: [new Paragraph({ text: "Vida Útil", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        new TableCell({ children: [new Paragraph({ text: "Mes Vida Útil", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        new TableCell({ children: [new Paragraph({ text: "Meses Restantes", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        new TableCell({ children: [new Paragraph({ text: "Monto Inicial", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        new TableCell({ children: [new Paragraph({ text: "Depreciación por Año", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        new TableCell({ children: [new Paragraph({ text: "Depreciación por Mes", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        new TableCell({ children: [new Paragraph({ text: "Depreciación Acumulada Actualizada", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                        new TableCell({ children: [new Paragraph({ text: "Valor Residual", style: "tableCellHeader" })], shading: { fill: "004485" } }),
                                    ],
                                }),
                                // Filas dinámicas con datos
                                ...listaActivosCalculados.map((item) =>
                                    new TableRow({
                                        children: [
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_CLAVE.toString(), style: "tableCell" })] }),
                                            new TableCell({ children: [new Paragraph({ text: item.aF_CODIGO_GENERICO, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_CODIGO_GENERICO, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_CODIGO_LARGO, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.deP_CORR.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.esP_CODIGO.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_SECUENCIA.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.itE_CLAVE.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_DESCRIPCION, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_FINGRESO, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_ESTADO, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_CODIGO, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_TIPO, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_ALTA, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_PRECIO_REF.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_CANTIDAD.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_ORIGEN.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_RESOLUCION, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_FECHA_SOLICITUD, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_OCO_NUMERO_REF, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.usuariO_CREA, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.f_CREA, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.iP_CREA, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.usuariO_MOD, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.f_MOD, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.iP_MODt, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_TIPO_DOC.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.proV_RUN, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.reG_EQM, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_NUM_FAC, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_FECHAFAC, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_3UTM, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.iD_GRUPO.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.ctA_COD, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.transitoria, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_MONTOFACTURA.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.esP_DESCOMPONE, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_ETIQUETA, style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_VIDAUTIL.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.aF_VIGENTE.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.idprograma.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.idmodalidadcompra.toString(), style: "tableCell" })] }),
                                            // new TableCell({ children: [new Paragraph({ text: item.idpropiedad.toString(), style: "tableCell" })] }),
                                            new TableCell({ children: [new Paragraph({ text: item.especie, style: "tableCell" })] }),

                                            new TableCell({ children: [new Paragraph({ text: item.mesesTranscurridos?.toString(), style: "tableCell" })] }),
                                            new TableCell({ children: [new Paragraph({ text: item.vidaUtil?.toString(), style: "tableCell" })] }),
                                            new TableCell({ children: [new Paragraph({ text: item.mesVidaUtil?.toString(), style: "tableCell" })] }),
                                            new TableCell({ children: [new Paragraph({ text: item.mesesRestantes?.toString(), style: "tableCell" })] }),
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text: `$ ${(item.montoInicial ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
                                                    style: "tableCell"
                                                })]
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text: `$ ${(item.depreciacionPorAno ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
                                                    style: "tableCell"
                                                })]
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text: `$ ${(item.depreciacionPorMes ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
                                                    style: "tableCell"
                                                })]
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text: `$ ${(item.depreciacionAcumuladaActualizada ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
                                                    style: "tableCell"
                                                })]
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text: `$ ${(item.valorResidual ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
                                                    style: "tableCell"
                                                })]
                                            }),
                                        ],
                                    })
                                ),
                            ],
                        }),
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, `Reporte_ArticulosPorCuentas.docx`);
            setLoading(false); //evita que quede cargando
        }).catch(() => {
            // console.error("Error al generar el documento:", error);
            setLoading(false);
        });
    };


    return (
        <Layout>
            <Helmet>
                <title>Calcular depreciación</title>
            </Helmet>
            <MenuInformes />
            <form>
                <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                    <h3 className="form-title fw-semibold border-bottom p-1">Calcular depreciación</h3>
                    <Row>
                        <Col md={2}>
                            <div className="mb-1">
                                <h5 className="fw-semibold border-bottom">Fecha creación</h5>
                                <label htmlFor="fDesde" className="fw-semibold">Desde</label>
                                <input
                                    aria-label="fDesde"
                                    type="date"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fDesde ? "is-invalid" : ""}`}
                                    name="fDesde"
                                    onChange={handleChange}
                                    value={Inventario.fDesde}
                                />
                                {error.fDesde && (
                                    <div className="invalid-feedback d-block">{error.fDesde}</div>
                                )}
                            </div>
                            <div className="mb-1">
                                <label htmlFor="fHasta" className="fw-semibold">Hasta</label>
                                <input
                                    aria-label="fHasta"
                                    type="date"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fHasta ? "is-invalid" : ""}`}
                                    name="fHasta"
                                    onChange={handleChange}
                                    value={Inventario.fHasta}
                                />
                                {error.fHasta && (
                                    <div className="invalid-feedback">{error.fHasta}</div>
                                )}
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
                        </Col>
                        <Col md={5}>
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
                                onClick={handleCalcular} disabled={listaActivosFijos.length === 0}
                                className={`btn m-1 p-2 ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
                                {loading ? (
                                    <>
                                        {" Calcular"}
                                        <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                    </>
                                ) : (
                                    <>
                                        {"Calcular"}
                                        <Calculator className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <strong className="alert alert-dark border m-1 p-2">
                                No hay filas seleccionadas
                            </strong>
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
                                        <th style={{
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
                                        </th>
                                        {/* <th scope="col" className="text-nowrap text-center">Código</th> */}
                                        <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Código Largo</th> */}
                                        <th scope="col" className="text-nowrap text-center">Dep Corr</th>
                                        {/* <th scope="col" className="text-nowrap text-center">ESP Código</th>
                                        <th scope="col" className="text-nowrap text-center">Secuencia</th> */}
                                        <th scope="col" className="text-nowrap text-center">ITE Clave</th>
                                        <th scope="col" className="text-nowrap text-center">Descripción</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Ingreso</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Estado</th> */}
                                        <th scope="col" className="text-nowrap text-center">Código</th>
                                        <th scope="col" className="text-nowrap text-center">Tipo</th>
                                        <th scope="col" className="text-nowrap text-center">Alta</th>
                                        <th scope="col" className="text-nowrap text-center">Precio Referencial</th>
                                        <th scope="col" className="text-nowrap text-center">Cantidad</th>
                                        <th scope="col" className="text-nowrap text-center">Origen</th>
                                        <th scope="col" className="text-nowrap text-center">Resolución</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Fecha Solicitud</th> */}
                                        <th scope="col" className="text-nowrap text-center">Número OCO Ref</th>
                                        <th scope="col" className="text-nowrap text-center">Usuario Creador</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Creación</th>
                                        <th scope="col" className="text-nowrap text-center">IP Creación</th>
                                        <th scope="col" className="text-nowrap text-center">Usuario Modificador</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Modificación</th>
                                        {/* <th scope="col" className="text-nowrap text-center">IP Modificación</th> */}
                                        <th scope="col" className="text-nowrap text-center">Tipo Documento</th>
                                        <th scope="col" className="text-nowrap text-center">RUN Proveedor</th>
                                        <th scope="col" className="text-nowrap text-center">Reg EQM</th>
                                        <th scope="col" className="text-nowrap text-center">Número Factura</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Factura</th>
                                        <th scope="col" className="text-nowrap text-center">3 UTM</th>
                                        <th scope="col" className="text-nowrap text-center">ID Grupo</th>
                                        <th scope="col" className="text-nowrap text-center">Código Cuenta</th>
                                        <th scope="col" className="text-nowrap text-center">Transitoria</th>
                                        <th scope="col" className="text-nowrap text-center">Monto Factura</th>
                                        <th scope="col" className="text-nowrap text-center">ESP Descompone</th>
                                        <th scope="col" className="text-nowrap text-center">Etiqueta</th>
                                        <th scope="col" className="text-nowrap text-center">Vida Útil</th>
                                        <th scope="col" className="text-nowrap text-center">Vigente</th>
                                        <th scope="col" className="text-nowrap text-center">ID Programa</th>
                                        <th scope="col" className="text-nowrap text-center">ID Modalidad Compra</th>
                                        <th scope="col" className="text-nowrap text-center">ID Propiedad</th>
                                        <th scope="col" className="text-nowrap text-center">Especie</th>
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
                                                    <Form.Check
                                                        type="checkbox"
                                                        onChange={() => setSeleccionaFilas(indexReal)}
                                                        checked={filasSeleccionadas.includes(indexReal.toString())}
                                                    />
                                                </td>
                                                {/* <td className="text-nowrap">{Lista.aF_CLAVE}</td> */}
                                                <td className="text-nowrap">{Lista.aF_CODIGO_GENERICO}</td>
                                                {/* <td className="text-nowrap">{Lista.aF_CODIGO_LARGO}</td> */}
                                                <td className="text-nowrap">{Lista.deP_CORR}</td>
                                                {/* <td className="text-nowrap text-center">{Lista.esP_CODIGO}</td>
                                                <td className="text-nowrap text-center">{Lista.aF_SECUENCIA}</td> */}
                                                <td className="text-nowrap">{Lista.itE_CLAVE}</td>
                                                <td className="text-nowrap">{Lista.aF_DESCRIPCION}</td>
                                                <td className="text-nowrap">{Lista.aF_FINGRESO}</td>
                                                {/* <td className="text-nowrap text-center">{Lista.aF_ESTADO}</td> */}
                                                <td className="text-nowrap">{Lista.aF_CODIGO}</td>
                                                <td className="text-nowrap">{Lista.aF_TIPO}</td>
                                                <td className="text-nowrap">{Lista.aF_ALTA}</td>
                                                <td className="text-nowrap">
                                                    ${(Lista.aF_PRECIO_REF ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                </td>
                                                <td className="text-nowrap">{Lista.aF_CANTIDAD}</td>
                                                <td className="text-nowrap">{Lista.aF_ORIGEN}</td>
                                                <td className="text-nowrap">{Lista.aF_RESOLUCION}</td>
                                                {/* <td className="text-nowrap text-center">{Lista.aF_FECHA_SOLICITUD}</td> */}
                                                <td className="text-nowrap">{Lista.aF_OCO_NUMERO_REF}</td>
                                                <td className="text-nowrap">{Lista.usuariO_CREA}</td>
                                                <td className="text-nowrap">{Lista.f_CREA}</td>
                                                <td className="text-nowrap">{Lista.iP_CREA}</td>
                                                <td className="text-nowrap">{Lista.usuariO_MOD}</td>
                                                <td className="text-nowrap">{Lista.f_MOD}</td>
                                                {/* <td className="text-nowrap text-center">{Lista.iP_MODt}</td> */}
                                                <td className="text-nowrap">{Lista.aF_TIPO_DOC}</td>
                                                <td className="text-nowrap">{Lista.proV_RUN}</td>
                                                <td className="text-nowrap">{Lista.reG_EQM}</td>
                                                <td className="text-nowrap">{Lista.aF_NUM_FAC}</td>
                                                <td className="text-nowrap">{Lista.aF_FECHAFAC}</td>
                                                <td className="text-nowrap">{Lista.aF_3UTM}</td>
                                                <td className="text-nowrap">{Lista.iD_GRUPO}</td>
                                                <td className="text-nowrap">{Lista.ctA_COD}</td>
                                                <td className="text-nowrap">{Lista.transitoria}</td>
                                                <td className="text-nowrap">
                                                    ${(Lista.aF_MONTOFACTURA ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                </td>
                                                <td className="text-nowrap">{Lista.esP_DESCOMPONE}</td>
                                                <td className="text-nowrap">{Lista.aF_ETIQUETA}</td>
                                                <td className="text-nowrap">{Lista.aF_VIDAUTIL}</td>
                                                <td className="text-nowrap">{Lista.aF_VIGENTE}</td>
                                                <td className="text-nowrap">{Lista.idprograma}</td>
                                                <td className="text-nowrap">{Lista.idmodalidadcompra}</td>
                                                <td className="text-nowrap">{Lista.idpropiedad}</td>
                                                <td className="text-nowrap">{Lista.especie}</td>
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

            {/* Modal Activos Calculados */}
            {listaActivosCalculados.length > 0 && (
                < Modal show={mostrarModalCalcular} onHide={() => setMostrarModalCalcular(false)}
                    size="xl"
                    dialogClassName="draggable-modal"
                    backdrop="static" // Evita que se cierre al hacer clic afuera
                    keyboard={false}>
                    <Modal.Header className={`modal-header ${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                        <Modal.Title className="fw-semibold">Depreciación calculada por activo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                        <Row>
                            <Col md={6}>
                                <div className="d-flex ">
                                    <div className="mx-1 bg-primary text-white p-2 rounded">
                                        <p className="text-center">Total Valor Residual</p>
                                        <p className="fw-semibold text-center">
                                            $ {totalSum.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex justify-content-end p-4">
                                    <Button
                                        onClick={() => setMostrarModal(true)}
                                        disabled={listaActivosCalculados.length === 0}
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
                                    {listaActivosNoCalculados.length > 0 && (
                                        <Button
                                            onClick={() => setMostrarModalNoCalculados(true)}
                                            disabled={listaActivosCalculados.length === 0}
                                            variant={`${isDarkMode ? "secondary" : "primary"}`}
                                            className="mx-1 mb-1">
                                            {mostrarModal ? (
                                                <>
                                                    {" No Calculados"}
                                                    <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                                </>
                                            ) : (
                                                <>
                                                    {"No Calculados"}
                                                    <ExclamationDiamond className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                                </>
                                            )}
                                        </Button>
                                    )}

                                </div>
                            </Col>
                        </Row>

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
                                            {/* <th scope="col" className="text-nowrap text-center">Código</th> */}
                                            <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                                            {/* <th scope="col" className="text-nowrap text-center">Código Largo</th> */}
                                            <th scope="col" className="text-nowrap text-center">Dep Corr</th>
                                            {/* <th scope="col" className="text-nowrap text-center">ESP Código</th>
                                        <th scope="col" className="text-nowrap text-center">Secuencia</th> */}
                                            <th scope="col" className="text-nowrap text-center">ITE Clave</th>
                                            <th scope="col" className="text-nowrap text-center">Descripción</th>
                                            <th scope="col" className="text-nowrap text-center">Fecha Ingreso</th>
                                            {/* <th scope="col" className="text-nowrap text-center">Estado</th> */}
                                            <th scope="col" className="text-nowrap text-center">Código</th>
                                            <th scope="col" className="text-nowrap text-center">Tipo</th>
                                            <th scope="col" className="text-nowrap text-center">Alta</th>
                                            <th scope="col" className="text-nowrap text-center">Precio Referencial</th>
                                            <th scope="col" className="text-nowrap text-center">Cantidad</th>
                                            <th scope="col" className="text-nowrap text-center">Origen</th>
                                            <th scope="col" className="text-nowrap text-center">Resolución</th>
                                            {/* <th scope="col" className="text-nowrap text-center">Fecha Solicitud</th> */}
                                            <th scope="col" className="text-nowrap text-center">Número OCO Ref</th>
                                            <th scope="col" className="text-nowrap text-center">Usuario Creador</th>
                                            <th scope="col" className="text-nowrap text-center">Fecha Creación</th>
                                            <th scope="col" className="text-nowrap text-center">IP Creación</th>
                                            <th scope="col" className="text-nowrap text-center">Usuario Modificador</th>
                                            <th scope="col" className="text-nowrap text-center">Fecha Modificación</th>
                                            {/* <th scope="col" className="text-nowrap text-center">IP Modificación</th> */}
                                            <th scope="col" className="text-nowrap text-center">Tipo Documento</th>
                                            <th scope="col" className="text-nowrap text-center">RUN Proveedor</th>
                                            <th scope="col" className="text-nowrap text-center">Reg EQM</th>
                                            <th scope="col" className="text-nowrap text-center">Número Factura</th>
                                            <th scope="col" className="text-nowrap text-center">Fecha Factura</th>
                                            <th scope="col" className="text-nowrap text-center">3 UTM</th>
                                            <th scope="col" className="text-nowrap text-center">ID Grupo</th>
                                            <th scope="col" className="text-nowrap text-center">Código Cuenta</th>
                                            <th scope="col" className="text-nowrap text-center">Transitoria</th>
                                            <th scope="col" className="text-nowrap text-center">Monto Factura</th>
                                            <th scope="col" className="text-nowrap text-center">ESP Descompone</th>
                                            <th scope="col" className="text-nowrap text-center">Etiqueta</th>
                                            <th scope="col" className="text-nowrap text-center">Vigente</th>
                                            <th scope="col" className="text-nowrap text-center">ID Programa</th>
                                            <th scope="col" className="text-nowrap text-center">ID Modalidad Compra</th>
                                            <th scope="col" className="text-nowrap text-center">ID Propiedad</th>
                                            <th scope="col" className="text-nowrap text-center">Especie</th>
                                            <th scope="col" className="text-nowrap text-center">Meses transcurrido</th>
                                            <th scope="col" className="text-nowrap text-center">Vida Útil</th>
                                            <th scope="col" className="text-nowrap text-center">Mes Vida Útil</th>
                                            <th scope="col" className="text-nowrap text-center">Meses Restantes</th>
                                            <th scope="col" className="text-nowrap text-center">Monto Inicial</th>
                                            <th scope="col" className="text-nowrap text-center">Depreciación por Año</th>
                                            <th scope="col" className="text-nowrap text-center">Depreciación por Mes</th>
                                            <th scope="col" className="text-nowrap text-center">Depreciación Acumulada</th>
                                            <th scope="col" className="text-nowrap text-center">Valor Residual</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elementosActuales2.map((lista, index) =>

                                            <tr key={index}>
                                                {/* <td className="text-nowrap text-center">{lista.aF_CLAVE}</td> */}
                                                <td className="text-nowrap text-center">{lista.aF_CODIGO_GENERICO}</td>
                                                {/* <td className="text-nowrap text-center">{lista.aF_CODIGO_LARGO}</td> */}
                                                <td className="text-nowrap text-center">{lista.deP_CORR}</td>
                                                {/* <td className="text-nowrap text-center">{lista.esP_CODIGO}</td>
                                            <td className="text-nowrap text-center">{lista.aF_SECUENCIA}</td> */}
                                                <td className="text-nowrap text-center">{lista.itE_CLAVE}</td>
                                                <td className="text-nowrap text-center">{lista.aF_DESCRIPCION}</td>
                                                <td className="text-nowrap text-center">{lista.aF_FINGRESO}</td>
                                                {/* <td className="text-nowrap text-center">{lista.aF_ESTADO}</td> */}
                                                <td className="text-nowrap text-center">{lista.aF_CODIGO}</td>
                                                <td className="text-nowrap text-center">{lista.aF_TIPO}</td>
                                                <td className="text-nowrap text-center">{lista.aF_ALTA}</td>
                                                <td className="text-nowrap text-center">
                                                    ${(lista.aF_PRECIO_REF ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                </td>
                                                <td className="text-nowrap text-center">{lista.aF_CANTIDAD}</td>
                                                <td className="text-nowrap text-center">{lista.aF_ORIGEN}</td>
                                                <td className="text-nowrap text-center">{lista.aF_RESOLUCION}</td>
                                                {/* <td className="text-nowrap text-center">{lista.aF_FECHA_SOLICITUD}</td> */}
                                                <td className="text-nowrap text-center">{lista.aF_OCO_NUMERO_REF}</td>
                                                <td className="text-nowrap text-center">{lista.usuariO_CREA}</td>
                                                <td className="text-nowrap text-center">{lista.f_CREA}</td>
                                                <td className="text-nowrap text-center">{lista.iP_CREA}</td>
                                                <td className="text-nowrap text-center">{lista.usuariO_MOD}</td>
                                                <td className="text-nowrap text-center">{lista.f_MOD}</td>
                                                {/* <td className="text-nowrap text-center">{lista.iP_MODt}</td> */}
                                                <td className="text-nowrap text-center">{lista.aF_TIPO_DOC}</td>
                                                <td className="text-nowrap text-center">{lista.proV_RUN}</td>
                                                <td className="text-nowrap text-center">{lista.reG_EQM}</td>
                                                <td className="text-nowrap text-center">{lista.aF_NUM_FAC}</td>
                                                <td className="text-nowrap text-center">{lista.aF_FECHAFAC}</td>
                                                <td className="text-nowrap text-center">{lista.aF_3UTM}</td>
                                                <td className="text-nowrap text-center">{lista.iD_GRUPO}</td>
                                                <td className="text-nowrap text-center">{lista.ctA_COD}</td>
                                                <td className="text-nowrap text-center">{lista.transitoria}</td>
                                                <td className="text-nowrap text-center">
                                                    ${(lista.aF_MONTOFACTURA ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                </td>
                                                <td className="text-nowrap text-center">{lista.esP_DESCOMPONE}</td>
                                                <td className="text-nowrap text-center">{lista.aF_ETIQUETA}</td>
                                                <td className="text-nowrap text-center">{lista.aF_VIGENTE}</td>
                                                <td className="text-nowrap text-center">{lista.idprograma}</td>
                                                <td className="text-nowrap text-center">{lista.idmodalidadcompra}</td>
                                                <td className="text-nowrap text-center">{lista.idpropiedad}</td>
                                                <td className="text-nowrap text-center">{lista.especie}</td>

                                                {/* valores calculados */}
                                                <td className="text-nowrap text-center">{lista.mesesTranscurridos}</td>
                                                <td className="text-nowrap text-center">{lista.vidaUtil}</td>
                                                <td className="text-nowrap text-center">{lista.mesVidaUtil}</td>
                                                <td className="text-nowrap text-center">{lista.mesesRestantes}</td>
                                                <td className="text-nowrap text-center">
                                                    $ {(lista.montoInicial ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                </td>
                                                <td className="text-nowrap text-center">
                                                    $ {(lista.depreciacionPorAno ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                </td>
                                                <td className="text-nowrap text-center">
                                                    $ {(lista.depreciacionPorMes ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                </td>
                                                <td className="text-nowrap text-center">
                                                    $ {(lista.depreciacionAcumuladaActualizada ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                </td>
                                                <td className="text-nowrap text-center">
                                                    ${(lista.valorResidual ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={6} className={`text-right ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                <strong >Total Valor Residual:</strong>
                                            </td>
                                            <td colSpan={3}>
                                                <strong >
                                                    ${totalSum.toLocaleString("es-ES", { minimumFractionDigits: 0, })}
                                                </strong>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
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
                <Modal.Header className={isDarkMode ? "darkModePrincipal modal-header" : "modal-header"} closeButton>
                    <Modal.Title className="fw-semibold">Activos no calculados</Modal.Title>
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
                                        {/* <th scope="col" className="text-nowrap text-center">Código</th> */}
                                        <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Código Largo</th> */}
                                        <th scope="col" className="text-nowrap text-center">Dep Corr</th>
                                        {/* <th scope="col" className="text-nowrap text-center">ESP Código</th>
                                        <th scope="col" className="text-nowrap text-center">Secuencia</th> */}
                                        <th scope="col" className="text-nowrap text-center">ITE Clave</th>
                                        <th scope="col" className="text-nowrap text-center">Descripción</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Ingreso</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Estado</th> */}
                                        <th scope="col" className="text-nowrap text-center">Código</th>
                                        <th scope="col" className="text-nowrap text-center">Tipo</th>
                                        <th scope="col" className="text-nowrap text-center">Alta</th>
                                        <th scope="col" className="text-nowrap text-center">Precio Referencial</th>
                                        <th scope="col" className="text-nowrap text-center">Cantidad</th>
                                        <th scope="col" className="text-nowrap text-center">Origen</th>
                                        <th scope="col" className="text-nowrap text-center">Resolución</th>
                                        {/* <th scope="col" className="text-nowrap text-center">Fecha Solicitud</th> */}
                                        <th scope="col" className="text-nowrap text-center">Número OCO Ref</th>
                                        <th scope="col" className="text-nowrap text-center">Usuario Creador</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Creación</th>
                                        <th scope="col" className="text-nowrap text-center">IP Creación</th>
                                        <th scope="col" className="text-nowrap text-center">Usuario Modificador</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Modificación</th>
                                        {/* <th scope="col" className="text-nowrap text-center">IP Modificación</th> */}
                                        <th scope="col" className="text-nowrap text-center">Tipo Documento</th>
                                        <th scope="col" className="text-nowrap text-center">RUN Proveedor</th>
                                        <th scope="col" className="text-nowrap text-center">Reg EQM</th>
                                        <th scope="col" className="text-nowrap text-center">Número Factura</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Factura</th>
                                        <th scope="col" className="text-nowrap text-center">3 UTM</th>
                                        <th scope="col" className="text-nowrap text-center">ID Grupo</th>
                                        <th scope="col" className="text-nowrap text-center">Código Cuenta</th>
                                        <th scope="col" className="text-nowrap text-center">Transitoria</th>
                                        <th scope="col" className="text-nowrap text-center">Monto Factura</th>
                                        <th scope="col" className="text-nowrap text-center">ESP Descompone</th>
                                        <th scope="col" className="text-nowrap text-center">Etiqueta</th>
                                        <th scope="col" className="text-nowrap text-center">Vida Útil</th>
                                        <th scope="col" className="text-nowrap text-center">Vigente</th>
                                        <th scope="col" className="text-nowrap text-center">ID Programa</th>
                                        <th scope="col" className="text-nowrap text-center">ID Modalidad Compra</th>
                                        <th scope="col" className="text-nowrap text-center">ID Propiedad</th>
                                        <th scope="col" className="text-nowrap text-center">Especie</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {elementosActuales3.map((lista, index) =>

                                        <tr key={index}>
                                            {/* <td className="text-nowrap text-center">{lista.aF_CLAVE}</td> */}
                                            <td className="text-nowrap text-center">{lista.aF_CODIGO_GENERICO}</td>
                                            {/* <td className="text-nowrap text-center">{lista.aF_CODIGO_LARGO}</td> */}
                                            <td className="text-nowrap text-center">{lista.deP_CORR}</td>
                                            {/* <td className="text-nowrap text-center">{lista.esP_CODIGO}</td>
                                            <td className="text-nowrap text-center">{lista.aF_SECUENCIA}</td> */}
                                            <td className="text-nowrap text-center">{lista.itE_CLAVE}</td>
                                            <td className="text-nowrap text-center">{lista.aF_DESCRIPCION}</td>
                                            <td className="text-nowrap text-center">{lista.aF_FINGRESO}</td>
                                            {/* <td className="text-nowrap text-center">{lista.aF_ESTADO}</td> */}
                                            <td className="text-nowrap text-center">{lista.aF_CODIGO}</td>
                                            <td className="text-nowrap text-center">{lista.aF_TIPO}</td>
                                            <td className="text-nowrap text-center">{lista.aF_ALTA}</td>
                                            <td className="text-nowrap text-center">
                                                ${(lista.aF_PRECIO_REF ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            <td className="text-nowrap text-center">{lista.aF_CANTIDAD}</td>
                                            <td className="text-nowrap text-center">{lista.aF_ORIGEN}</td>
                                            <td className="text-nowrap text-center">{lista.aF_RESOLUCION}</td>
                                            {/* <td className="text-nowrap text-center">{lista.aF_FECHA_SOLICITUD}</td> */}
                                            <td className="text-nowrap text-center">{lista.aF_OCO_NUMERO_REF}</td>
                                            <td className="text-nowrap text-center">{lista.usuariO_CREA}</td>
                                            <td className="text-nowrap text-center">{lista.f_CREA}</td>
                                            <td className="text-nowrap text-center">{lista.iP_CREA}</td>
                                            <td className="text-nowrap text-center">{lista.usuariO_MOD}</td>
                                            <td className="text-nowrap text-center">{lista.f_MOD}</td>
                                            {/* <td className="text-nowrap text-center">{lista.iP_MODt}</td> */}
                                            <td className="text-nowrap text-center">{lista.aF_TIPO_DOC}</td>
                                            <td className="text-nowrap text-center">{lista.proV_RUN}</td>
                                            <td className="text-nowrap text-center">{lista.reG_EQM}</td>
                                            <td className="text-nowrap text-center">{lista.aF_NUM_FAC}</td>
                                            <td className="text-nowrap text-center">{lista.aF_FECHAFAC}</td>
                                            <td className="text-nowrap text-center">{lista.aF_3UTM}</td>
                                            <td className="text-nowrap text-center">{lista.iD_GRUPO}</td>
                                            <td className="text-nowrap text-center">{lista.ctA_COD}</td>
                                            <td className="text-nowrap text-center">{lista.transitoria}</td>
                                            <td className="text-nowrap text-center">
                                                ${(lista.aF_MONTOFACTURA ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            <td className="text-nowrap text-center">{lista.esP_DESCOMPONE}</td>
                                            <td className="text-nowrap text-center">{lista.aF_ETIQUETA}</td>
                                            <td className={`text-nowrap text-center ${isDarkMode ? "bg-warning" : "bg-warning-subtle"}`}>{lista.vidaUtil}</td>
                                            <td className="text-nowrap text-center">{lista.aF_VIGENTE}</td>
                                            <td className="text-nowrap text-center">{lista.idprograma}</td>
                                            <td className="text-nowrap text-center">{lista.idmodalidadcompra}</td>
                                            <td className="text-nowrap text-center">{lista.idpropiedad}</td>
                                            <td className="text-nowrap text-center">{lista.especie}</td>
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
                    <Modal.Title className="fw-semibold">Reporte articulos por cuentas</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                    <BlobProvider document={
                        <DocumentoPDF
                            row={listaActivosCalculados}
                            totalSum={totalSum}
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
