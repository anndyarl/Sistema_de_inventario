import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner, Modal, Form, ModalDialog } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { Calculator, CheckCircle, Eraser, ExclamationDiamond, FileEarmarkExcel, FiletypePdf, Search } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { BlobProvider } from "@react-pdf/renderer";
import Layout from "../../../../containers/hocs/layout/Layout";
import MenuInformes from "../../../Menus/MenuInformes";
import SkeletonLoader from "../../../Utils/SkeletonLoader";
import { RootState } from "../../../../store";
import { Objeto } from "../../../Navegacion/Profile";
import { listaActivosCasrActions } from "../../../../redux/actions/Informes/Principal/CalcularDepreciacion/listaActivosCasrActions";
import { listaActivosCalculadosPorCuentasActions } from "../../../../redux/actions/Informes/Principal/CalcularDepreciacion/listaActivosCalculadosPorCuentasActions";
import { listaActivosFijosPorCuentasActions } from "../../../../redux/actions/Informes/Principal/CalcularDepreciacion/listaActivosFijosPorCuentasActions";
import DocumentoCuentasPDF from "./DocumentoPDFCalcularCuentasDepreciacion";
import { ListaActivosFijos } from "./CalcularDepreciacion";
import Draggable from "react-draggable";

const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};
interface FechasProps {
    fDesde: string;
    fHasta: string;
}
interface DatosAltas {
    listaActivosPorCuentasFijos: ListaActivosFijos[];
    listaActivosCalculadosPorCuentas: ListaActivosFijos[];
    listaActivosNoCalculadosPorCuentas: ListaActivosFijos[];
    listaActivosFijosPorCuentasActions: (cta_cod: string, fDesde: string, fHasta: string, af_codigo_generico: string, establ_corr: number) => Promise<boolean>;
    listaActivosCasrActions: (cta_cod: string, fDesde: string, fHasta: string, af_codigo_generico: string, establ_corr: number) => Promise<boolean>;
    listaActivosCalculadosPorCuentasActions: (activosSeleccionados: Record<string, any>[]) => Promise<{ success: boolean; error?: string }>;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;

}

const CalcularDepreciacionPorCuentas: React.FC<DatosAltas> = ({ listaActivosFijosPorCuentasActions, listaActivosCasrActions, listaActivosCalculadosPorCuentasActions, listaActivosPorCuentasFijos, listaActivosCalculadosPorCuentas, listaActivosNoCalculadosPorCuentas, isDarkMode, objeto }) => {
    const [error, setError] = useState<Partial<ListaActivosFijos> & Partial<FechasProps> & {}>({});
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalNoCalculados, setMostrarModalNoCalculados] = useState(false);
    const [mostrarModalCalcular, setMostrarModalCalcular] = useState(false);
    const [loadingBuscar, setLoadingBuscar] = useState(false); // Estado para controlar la carga 
    const [loading, setLoading] = useState(false);
    const [loadingBuscarCasr, setloadingBuscarCasr] = useState(false);
    const [loadingExportar, setLoadingExportar] = useState(false);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginaActual2, setPaginaActual2] = useState(1);
    const [paginaActual3, setPaginaActual3] = useState(1);

    const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
    const elementosPorPagina = Paginacion.nPaginacion;

    const [Paginacion2, setPaginacion2] = useState({ nPaginacion2: 10 });
    const elementosPorPagina2 = Paginacion2.nPaginacion2;

    const [Paginacion3, setPaginacion3] = useState({ nPaginacion3: 10 });
    const elementosPorPagina3 = Paginacion3.nPaginacion3;

    const [__, setlistaActivosCalculados] = useState<ListaActivosFijos[]>(listaActivosCalculadosPorCuentas);

    const [Inventario, setInventario] = useState({
        fDesde: "",
        fHasta: ""
    });

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
        setInventario((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        setPaginacion((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        setPaginacion2((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        setPaginacion3((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === "nPaginacion2") {
            console.log(value);
            paginar2(1);
        }
    };


    const handleBuscar = async () => {
        setLoadingBuscar(true);
        // Limpiar los activos seleccionados antes de enviar los nuevos datos

        const tieneFechas = Inventario.fDesde !== "" && Inventario.fHasta !== "";

        // Caso 1: no hay ningún filtro
        if (!tieneFechas) {
            Swal.fire({
                icon: "warning",
                title: "Por favor, filtre por alguna opción",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
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
        const resultado = await listaActivosFijosPorCuentasActions("", Inventario.fDesde, Inventario.fHasta, "", objeto.Roles[0].codigoEstablecimiento);

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
                    popup: "custom-border",
                }
            });
        } else {
            paginar(1);
        }

        setLoadingBuscar(false);
    };

    const handleBuscarCasr = async () => {
        setloadingBuscarCasr(true);

        // Llama al backend
        const resultado = await listaActivosCasrActions(
            "",
            Inventario.fDesde,
            Inventario.fHasta,
            "",
            objeto.Roles[0].codigoEstablecimiento
        );

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
                    popup: "custom-border",
                }
            });
        } else {
            paginar(1);
        }

        setloadingBuscarCasr(false);
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

    const handleCalcularSeleccion = async () => {
        setLoading(true);

        // Limpiar los activos seleccionados antes de enviar los nuevos datos
        setlistaActivosCalculados([]);
        await listaActivosCalculadosPorCuentasActions([]); // Envía un array vacío para eliminar datos previos

        // Seleccionar los nuevos activos
        const selectedIndices = filasSeleccionadas.map(Number);
        const activosSeleccionados = selectedIndices.map((item) => {
            return {
                aF_CLAVE: listaActivosPorCuentasFijos[item].aF_CLAVE,
                altaS_CORR: listaActivosPorCuentasFijos[item].altaS_CORR,
                aF_CODIGO_GENERICO: listaActivosPorCuentasFijos[item].aF_CODIGO_GENERICO,
                aF_CODIGO_LARGO: listaActivosPorCuentasFijos[item].aF_CODIGO_LARGO,
                deP_CORR: listaActivosPorCuentasFijos[item].deP_CORR,
                itE_CLAVE: listaActivosPorCuentasFijos[item].itE_CLAVE,
                aF_DESCRIPCION: listaActivosPorCuentasFijos[item].aF_DESCRIPCION,
                aF_FINGRESO: listaActivosPorCuentasFijos[item].aF_FINGRESO,
                fechA_ALTA: listaActivosPorCuentasFijos[item].fechA_ALTA,
                aF_CODIGO: listaActivosPorCuentasFijos[item].aF_CODIGO,
                aF_TIPO: listaActivosPorCuentasFijos[item].aF_TIPO,
                aF_ALTA: listaActivosPorCuentasFijos[item].aF_ALTA,
                aF_PRECIO_REF: listaActivosPorCuentasFijos[item].aF_PRECIO_REF,
                aF_CANTIDAD: listaActivosPorCuentasFijos[item].aF_CANTIDAD,
                origen: listaActivosPorCuentasFijos[item].origen,
                aF_RESOLUCION: listaActivosPorCuentasFijos[item].aF_RESOLUCION,
                aF_OCO_NUMERO_REF: listaActivosPorCuentasFijos[item].aF_OCO_NUMERO_REF,
                usuariO_CREA: listaActivosPorCuentasFijos[item].usuariO_CREA,
                f_CREA: listaActivosPorCuentasFijos[item].f_CREA,
                iP_CREA: listaActivosPorCuentasFijos[item].iP_CREA,
                usuariO_MOD: listaActivosPorCuentasFijos[item].usuariO_MOD,
                // f_MOD: item.f_MOD,
                aF_TIPO_DOC: listaActivosPorCuentasFijos[item].aF_TIPO_DOC,
                proV_RUN: listaActivosPorCuentasFijos[item].proV_RUN,
                reG_EQM: listaActivosPorCuentasFijos[item].reG_EQM,
                aF_NUM_FAC: listaActivosPorCuentasFijos[item].aF_NUM_FAC,
                aF_FECHAFAC: listaActivosPorCuentasFijos[item].aF_FECHAFAC,
                aF_3UTM: listaActivosPorCuentasFijos[item].aF_3UTM,
                iD_GRUPO: listaActivosPorCuentasFijos[item].iD_GRUPO,
                ctA_COD: listaActivosPorCuentasFijos[item].ctA_COD,
                transitoria: listaActivosPorCuentasFijos[item].transitoria,
                aF_MONTOFACTURA: listaActivosPorCuentasFijos[item].aF_MONTOFACTURA,
                esP_DESCOMPONE: listaActivosPorCuentasFijos[item].esP_DESCOMPONE,
                aF_ETIQUETA: listaActivosPorCuentasFijos[item].aF_ETIQUETA,
                aF_VIDAUTIL: listaActivosPorCuentasFijos[item].aF_VIDAUTIL,
                aF_VIGENTE: listaActivosPorCuentasFijos[item].aF_VIGENTE,
                idprograma: listaActivosPorCuentasFijos[item].idprograma,
                modalidad: listaActivosPorCuentasFijos[item].modalidad,
                idpropiedad: listaActivosPorCuentasFijos[item].idpropiedad,
                especie: listaActivosPorCuentasFijos[item].especie,
                marca: listaActivosPorCuentasFijos[item].marca,
                modelo: listaActivosPorCuentasFijos[item].modelo,
                serie: listaActivosPorCuentasFijos[item].serie,
                precio: listaActivosPorCuentasFijos[item].precio,
                ctA_NOMBRE: listaActivosPorCuentasFijos[item].ctA_NOMBRE,
                aF_ESTADO_INV: listaActivosPorCuentasFijos[item].aF_ESTADO_INV

            };

        });
        //     aF_CLAVE: item.aF_CLAVE,
        //     altaS_CORR: item.altaS_CORR,
        //     aF_CODIGO_GENERICO: item.aF_CODIGO_GENERICO,
        //     aF_CODIGO_LARGO: item.aF_CODIGO_LARGO,
        //     deP_CORR: item.deP_CORR,
        //     itE_CLAVE: item.itE_CLAVE,
        //     aF_DESCRIPCION: item.aF_DESCRIPCION,
        //     aF_FINGRESO: item.aF_FINGRESO,
        //     fechA_ALTA: item.fechA_ALTA,
        //     aF_CODIGO: item.aF_CODIGO,
        //     aF_TIPO: item.aF_TIPO,
        //     aF_ALTA: item.aF_ALTA,
        //     aF_PRECIO_REF: item.aF_PRECIO_REF,
        //     aF_CANTIDAD: item.aF_CANTIDAD,
        //     origen: item.origen,
        //     aF_RESOLUCION: item.aF_RESOLUCION,
        //     aF_OCO_NUMERO_REF: item.aF_OCO_NUMERO_REF,
        //     usuariO_CREA: item.usuariO_CREA,
        //     f_CREA: item.f_CREA,
        //     iP_CREA: item.iP_CREA,
        //     usuariO_MOD: item.usuariO_MOD,
        //     // f_MOD: item.f_MOD,
        //     aF_TIPO_DOC: item.aF_TIPO_DOC,
        //     proV_RUN: item.proV_RUN,
        //     reG_EQM: item.reG_EQM,
        //     aF_NUM_FAC: item.aF_NUM_FAC,
        //     aF_FECHAFAC: item.aF_FECHAFAC,
        //     aF_3UTM: item.aF_3UTM,
        //     iD_GRUPO: item.iD_GRUPO,
        //     ctA_COD: item.ctA_COD,
        //     transitoria: item.transitoria,
        //     aF_MONTOFACTURA: item.aF_MONTOFACTURA,
        //     esP_DESCOMPONE: item.esP_DESCOMPONE,
        //     aF_ETIQUETA: item.aF_ETIQUETA,
        //     aF_VIDAUTIL: item.aF_VIDAUTIL,
        //     aF_VIGENTE: item.aF_VIGENTE,
        //     idprograma: item.idprograma,
        //     modalidad: item.modalidad,
        //     idpropiedad: item.idpropiedad,
        //     especie: item.especie,
        //     marca: item.marca,
        //     modelo: item.modelo,
        //     serie: item.serie,
        //     precio: item.precio
        // }));

        // Se envian los datos al metodo
        const resultado = await listaActivosCalculadosPorCuentasActions(activosSeleccionados);

        // Muestra mensaje de error si no hay resultados
        if (!resultado.success) {
            Swal.fire({
                icon: "error",
                title: "Error al calcular depreciación",
                text: resultado.error == "String '0' was not recognized as a valid DateTime." ? "La fecha de alta no puede ser cero y debe tener un formato válido." : resultado.error ?? "Error inesperado",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "#000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
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

    const handleCalcular = async () => {
        setLoading(true);

        // Limpiar los activos seleccionados antes de enviar los nuevos datos
        setlistaActivosCalculados([]);
        await listaActivosCalculadosPorCuentasActions([]); // Envía un array vacío para eliminar datos previos

        const activosSeleccionados = listaActivosPorCuentasFijos.map((item) => ({
            aF_CLAVE: item.aF_CLAVE,
            altaS_CORR: item.altaS_CORR,
            aF_CODIGO_GENERICO: item.aF_CODIGO_GENERICO,
            aF_CODIGO_LARGO: item.aF_CODIGO_LARGO,
            deP_CORR: item.deP_CORR,
            itE_CLAVE: item.itE_CLAVE,
            aF_DESCRIPCION: item.aF_DESCRIPCION,
            aF_FINGRESO: item.aF_FINGRESO,
            fechA_ALTA: item.fechA_ALTA,
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
            // f_MOD: item.f_MOD,
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
            precio: item.precio,
            ctA_NOMBRE: item.ctA_NOMBRE,
            aF_ESTADO_INV: item.aF_ESTADO_INV
        }));

        // Se envian los datos al metodo
        const resultado = await listaActivosCalculadosPorCuentasActions(activosSeleccionados);

        // Muestra mensaje de error si no hay resultados
        if (!resultado) {
            Swal.fire({
                icon: "error",
                title: ":'(",
                text: "No se encontraron resultados, inténte otro registro.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "#000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
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

    const handleAbrirModalCalcular = () => {
        setLoadingExportar(true);
        // Espera un ciclo de evento para mostrar el modal
        setTimeout(() => {
            setMostrarModal(true);
        }, 50); //se ajusta este tiempo para que cargue de inmediato
    };

    const handleCerrarModal = () => {
        setTotalRes(0);
        setTotalDep(0);
        setTotalDepAnual(0);
        setMostrarModalCalcular(false);
    };


    const setSeleccionaFilas = (index: number) => {
        setFilasSeleccionadas((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
    };

    //Funcion para seleccion multiple(Todos)
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



    //------------------------------Tabla Principal(Activos Fijos)--------------------------------------//

    // Lógica de Paginación actualizada 
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () =>
            listaActivosPorCuentasFijos.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaActivosPorCuentasFijos, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Array.isArray(listaActivosPorCuentasFijos)
        ? Math.ceil(listaActivosPorCuentasFijos.length / elementosPorPagina)
        : 0;
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    //------------------------------Tabla Modal(Activos calculados)--------------------------------------//
    // Lógica de Paginación actualizada 
    const indiceUltimoElemento2 = paginaActual2 * elementosPorPagina2;
    const indicePrimerElemento2 = indiceUltimoElemento2 - elementosPorPagina2;
    const elementosActuales2 = useMemo(
        () =>
            listaActivosCalculadosPorCuentas.slice(indicePrimerElemento2, indiceUltimoElemento2),
        [listaActivosCalculadosPorCuentas.slice(indicePrimerElemento2, indiceUltimoElemento2),
            , indicePrimerElemento2, indiceUltimoElemento2]
    );
    const totalPaginas2 = Array.isArray(listaActivosCalculadosPorCuentas.slice(indicePrimerElemento2, indiceUltimoElemento2),
    )
        ? Math.ceil(listaActivosCalculadosPorCuentas.length / elementosPorPagina2)
        : 0;
    const paginar2 = (numeroPagina2: number) => setPaginaActual2(numeroPagina2);
    const [totalRes, setTotalRes] = useState(0);
    const [totalDep, setTotalDep] = useState(0);
    const [totalDepAnual, setTotalDepAnual] = useState(0);
    const [totalMontoInicial, setTotalMontoInicial] = useState(0);


    useEffect(() => {
        // Calcula el total del valor residual de la tabla
        const sumaResidual = listaActivosCalculadosPorCuentas.reduce(
            (sum, activo) => sum + (activo.valorResidual ?? 0),
            0
        );
        // Calcula el total de la depreciación de la tabla
        const sumaDep = listaActivosCalculadosPorCuentas.reduce(
            (sum, activo) => sum + (activo.depreciacionAcumuladaActualizada ?? 0),
            0
        );
        // Calcula el total de la depreciación de la tabla
        const sumaDepAnual = listaActivosCalculadosPorCuentas.reduce(
            (sum, activo) => sum + (activo.depreciacionPorAno ?? 0),
            0
        );

        // Calcula el total de la depreciación de la tabla
        const sumaMontoInicial = listaActivosCalculadosPorCuentas.reduce(
            (sum, activo) => sum + (activo.montoInicial ?? 0),
            0
        );

        setTotalRes(sumaResidual);
        setTotalDep(sumaDep);
        setTotalDepAnual(sumaDepAnual);
        setTotalMontoInicial(sumaMontoInicial);

    }, [listaActivosCalculadosPorCuentas]);


    //------------------------------ Fin Tabla Modal(Activos calculados)--------------------------------------//

    //------------------------------Tabla Modal(Activos no calculados)--------------------------------------//
    // Lógica de Paginación actualizada 
    const indiceUltimoElemento3 = paginaActual3 * elementosPorPagina3;
    const indicePrimerElemento3 = indiceUltimoElemento3 - elementosPorPagina3;
    const elementosActuales3 = useMemo(
        () =>
            listaActivosNoCalculadosPorCuentas.slice(indicePrimerElemento3, indiceUltimoElemento3),
        [listaActivosNoCalculadosPorCuentas, indicePrimerElemento3, indiceUltimoElemento3]
    );
    const totalPaginas3 = Array.isArray(listaActivosNoCalculadosPorCuentas)
        ? Math.ceil(listaActivosNoCalculadosPorCuentas.length / elementosPorPagina3)
        : 0;
    const paginar3 = (numeroPagina3: number) => setPaginaActual3(numeroPagina3);
    //------------------------------ Fin Tabla Modal(Activos calculados)--------------------------------------//

    // 📂 Función para exportar a Excel
    const exportarExcel = (listaActivosCalculados: any[], fileName: string = "Reporte.xlsx") => {

        // Definir los encabezados
        const encabezados = [
            [
                "Cuenta",
                "Descripción",
                "Monto Inicial",
                "Depreciación Anual",
                "Depreciación Acumulada",
                "Valor Residual"
            ]
        ];

        // Convertir datos a array de arrays
        const datos = listaActivosCalculados.map((item) => [
            item.ctA_COD ?? "",
            item.ctA_NOMBRE ?? "",
            item.montoInicial ?? 0,
            item.depreciacionPorAno ?? 0,
            item.depreciacionAcumuladaActualizada ?? 0,
            item.valorResidual ?? 0
        ]);

        // Crear hoja de cálculo
        const worksheet = XLSX.utils.aoa_to_sheet([...encabezados, ...datos]);

        worksheet["!cols"] = [
            { wch: 12 }, // CTA Cod
            { wch: 80 }, // Descripción
            { wch: 25 }, // Monto Inicial
            { wch: 25 }, // Depreciación / Año
            { wch: 25 }, // Depreciación Acumulada
            { wch: 25 }, // Valor Residual

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

    //Este ancho de la columna se aplica para que los botones no se expandan en su totalidad segun el ancho
    const lgSize = listaActivosNoCalculadosPorCuentas.length > 0 ? 4 : 2;

    return (
        <Layout>
            <Helmet>
                <title>Calcular Depreciación</title>
            </Helmet>
            <MenuInformes />
            <div className="table-responsive position-relative z-0 hide-scrollbar" >
                <div style={{ maxHeight: "80vh" }}>
                    <div className={`border border-botom p-2 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                        <h3 className="form-title fw-semibold border-bottom p-1">Calcular Depreciación por Cuenta</h3>
                        <Row className="border rounded p-2 m-2">
                            <Col lg={3} md={4}>
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
                                            max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
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
                                                max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                                            />
                                        </div>
                                        {error.fHasta && <div className="invalid-feedback d-block">{error.fHasta}</div>}

                                    </div>
                                    <small className="fw-semibold">Filtre los resultados por fecha de Ingreso.</small>
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
                                        {loadingBuscar ? (
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
                            {objeto.IdCredencial === 18667 && (
                                <Col lg={2} md={6}>
                                    <div className="d-flex flex-column gap-2 mt-4">
                                        <Button
                                            onClick={handleBuscarCasr}
                                            variant={`${isDarkMode ? "secondary" : "warning"}`}
                                            className="w-100"
                                        // disabled={loading}
                                        >
                                            {loadingBuscarCasr ? (
                                                <>
                                                    Buscar Crowe
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
                                                </>
                                            ) : (
                                                <>
                                                    Buscar Crowe
                                                    <Search className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                                </>
                                            )}

                                        </Button>
                                    </div>
                                </Col>
                            )}
                        </Row>

                        <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                            {/* Tamaño Paginación */}
                            <Col xs={12} lg="auto">
                                {listaActivosPorCuentasFijos.length > 10 && (
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
                            {/* Botón Calcular */}
                            <Col xs={12} lg={4}>
                                <div className="d-lg-flex justify-content-center justify-content-lg-end">

                                    {listaActivosPorCuentasFijos.length != 0 && (
                                        <>
                                            {filasSeleccionadas.length > 0 ? (
                                                <Button
                                                    variant="warning"
                                                    onClick={handleCalcularSeleccion}
                                                    className="w-100 px-2 mx-1  d-flex align-items-center justify-content-center"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            Calculando...
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                                className="ms-2"
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Calculator className={classNames("flex-shrink-0", "h-5 w-5 mx-1")} aria-hidden="true" />
                                                            Calcular Selección
                                                            <span className="badge bg-light text-dark ms-1">
                                                                {filasSeleccionadas.length}
                                                            </span>
                                                        </>
                                                    )}



                                                </Button>
                                            ) : (
                                                <div className="d-flex justify-content-center justify-content-lg-end w-100 ">
                                                    <strong className="alert alert-dark border p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-lg-auto text-center">
                                                        No hay filas seleccionadas
                                                    </strong>
                                                </div>
                                            )}
                                            <Button
                                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                                onClick={handleCalcular}
                                                className="w-100 p-2 ms-1 d-flex align-items-center justify-content-center"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        Calculando...
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            className="ms-2"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Calculator className={classNames("flex-shrink-0", "h-5 w-5 mx-1")} aria-hidden="true" />
                                                        Calcular Todo
                                                        <span className="badge bg-light text-dark mt-1 ms-1">
                                                            {listaActivosPorCuentasFijos.length}
                                                        </span>
                                                    </>
                                                )}
                                            </Button>
                                        </>

                                    )}
                                </div>
                            </Col>
                        </Row>

                        {listaActivosPorCuentasFijos.length > 0 ? (
                            <>
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

                                                    }}>
                                                        <Form.Check
                                                            className="check-danger"
                                                            type="checkbox"
                                                            onChange={handleSeleccionaTodos}
                                                            checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                                        />
                                                    </th>
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
                                                    <th scope="col" className="text-nowrap text-center">Nº Altas</th>
                                                    <th scope="col" className="text-nowrap text-center">Especie</th>
                                                    <th scope="col" className="text-nowrap text-center">Marca</th>
                                                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                                                    <th scope="col" className="text-nowrap text-center">Serie</th>
                                                    <th scope="col" className="text-nowrap text-center">Valor Inicial</th>
                                                    <th scope="col" className="text-nowrap text-center">Descripción</th>
                                                    <th scope="col" className="text-nowrap text-center">Fecha Alta</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">Estado</th> */}
                                                    {/* <th scope="col" className="text-nowrap text-center">Código</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Tipo</th>
                                                    <th scope="col" className="text-nowrap text-center">Alta</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">Cantidad</th> */}
                                                    <th scope="col" className="text-nowrap text-center">Origen</th>
                                                    <th scope="col" className="text-nowrap text-center">Resolución</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">Fecha Solicitud</th> */}
                                                    <th scope="col" className="text-nowrap text-center">N° Orden de Compra</th>
                                                    {/* <th scope="col" className="text-nowrap text-center">Usuario Crea</th> */}
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
                                                    <th scope="col" className="text-nowrap text-center">Cuenta</th>
                                                    <th scope="col" className="text-nowrap text-center">Nombre Cuenta</th>
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
                                                                // onChange={() => setSeleccionaFilas(Lista.aF_CLAVE)}
                                                                // checked={filasSeleccionadas.includes(Lista.aF_CLAVE.toString())}
                                                                />
                                                            </td>
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
                                                            <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                                            <td className="text-nowrap">{Lista.especie}</td>
                                                            <td className="text-nowrap">{Lista.marca}</td>
                                                            <td className="text-nowrap">{Lista.modelo}</td>
                                                            <td className="text-nowrap">{Lista.serie}</td>
                                                            <td className="text-nowrap">
                                                                ${(Lista.aF_PRECIO_REF ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                            </td>
                                                            <td className="text-nowrap">{Lista.aF_DESCRIPCION == "0" ? "Sin Descripción" : Lista.aF_DESCRIPCION}</td>
                                                            {/* <td className="text-nowrap">{Lista.aF_FINGRESO}</td> */}
                                                            <td className="text-nowrap">{Lista.fechA_ALTA}</td>
                                                            {/* <td className="text-nowrap text-center">{Lista.aF_ESTADO}</td> */}
                                                            {/* <td className="text-nowrap">{Lista.aF_CODIGO}</td> */}
                                                            <td className="text-nowrap">{Lista.aF_TIPO}</td>
                                                            <td className="text-nowrap">{Lista.aF_ALTA}</td>
                                                            {/* <td className="text-nowrap">{Lista.aF_CANTIDAD}</td> */}
                                                            <td className="text-nowrap">{Lista.origen}</td>
                                                            <td className="text-nowrap">{Lista.aF_RESOLUCION}</td>
                                                            {/* <td className="text-nowrap text-center">{Lista.aF_FECHA_SOLICITUD}</td> */}
                                                            <td className="text-nowrap">{Lista.aF_OCO_NUMERO_REF}</td>
                                                            {/* <td className="text-nowrap">{Lista.usuariO_CREA}</td> */}
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
                                                            <td className="text-nowrap">{Lista.ctA_NOMBRE}</td>
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
                </div>
            </div>
            {/* Modal Activos Calculados */}
            {
                listaActivosCalculadosPorCuentas.length > 0 && (
                    < Modal show={mostrarModalCalcular} onHide={handleCerrarModal}
                        dialogClassName="draggable-modal"
                        // scrollable={false}
                        // backdrop="static" // Evita que se cierre al hacer clic afuera
                        // keyboard={false}
                        fullscreen style={{ top: "3%", width: '100%', maxWidth: "98%", left: "1%", borderRadius: "10px", maxHeight: "95vh" }}>
                        <Modal.Header className={`modal-header text-white bg-success`} style={{ paddingRight: "3%" }} closeButton>
                            <Modal.Title className="fw-semibold">
                                <CheckCircle className={"flex-shrink-0 h-5 w-5 mx-2 mb-1"} aria-hidden="true" />Depreciación Calculada por Cuenta</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={`me-lg-5 me-sm-none p-4 ${isDarkMode ? "darkModePrincipal" : ""}`}>
                            <div
                                className={`shadow-sm sticky-lg-top p-3 ${isDarkMode ? "darkModePrincipal" : "bg-white"}`}>
                                <Row className="mb-4">
                                    <Col sm={8} md={6} lg={3}>
                                        <div className={`${isDarkMode ? "bg-dark text-light" : "bg-light"} border-start border-4 border-secondary shadow-sm p-lg-3 p-sm-1 rounded m-2`}>
                                            <p className={`text-uppercase text-secondary fw-semibold small mb-1 text-center ${isDarkMode ? "text-light" : ""}`}>
                                                Total Monto Inicial
                                            </p>
                                            <h4 className={`fw-bold ${isDarkMode ? "text-light" : "text-secondary"} text-center m-0`}>
                                                $ {totalMontoInicial.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </h4>
                                        </div>
                                    </Col>
                                    <Col sm={8} md={6} lg={3}>
                                        <div className={` ${isDarkMode ? "bg-dark text-light" : "bg-light"} border-start border-4 border-success shadow-sm p-lg-3 p-sm-1 rounded m-2`}>
                                            <p className={`text-uppercase fw-semibold small mb-1 text-center ${isDarkMode ? "text-success" : "text-secondary"}`}>
                                                Total Depreciación Anual
                                            </p>
                                            <h4 className={`fw-bold text-success text-center m-0`}>
                                                $ {totalDepAnual.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </h4>
                                        </div>
                                    </Col>
                                    <Col sm={6} md={6} lg={3}>
                                        <div className={` ${isDarkMode ? "bg-dark text-light" : "bg-light"} border-start border-4 border-success shadow-sm p-lg-3 p-sm-1  rounded m-2`}>
                                            <p className={`text-uppercase fw-semibold small mb-1 text-center ${isDarkMode ? "text-success" : "text-secondary"}`}>
                                                Total Depreciación Acumulada
                                            </p>
                                            <h4 className={`fw-bold text-success text-center m-0`}>
                                                $ {totalDep.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </h4>
                                        </div>
                                    </Col>

                                    <Col sm={6} md={6} lg={3}>
                                        <div className={` ${isDarkMode ? "bg-dark text-light" : "bg-light"} border-start border-4 border-success shadow-sm p-lg-3 p-sm-1 rounded m-2`}>
                                            <p className={`text-uppercase fw-semibold small mb-1 text-center ${isDarkMode ? "text-success" : "text-secondary"}`}>
                                                Total Valor Residual
                                            </p>
                                            <h4 className={`fw-bold text-success text-center m-0`}>
                                                $ {totalRes.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </h4>
                                        </div>
                                    </Col>

                                </Row>

                                <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                                    {/* Tamaño de página */}
                                    <Col xs={12} lg="auto">
                                        {listaActivosPorCuentasFijos.length > 10 && (
                                            <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                                                <label htmlFor="nPaginacion2" className="form-label fw-semibold mb-0 me-2">
                                                    Tamaño de página:
                                                </label>
                                                <select
                                                    aria-label="Seleccionar tamaño de página"
                                                    className={`form-select form-select-sm w-auto rounded-1 ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                    name="nPaginacion2"
                                                    onChange={handleChange}
                                                    value={Paginacion2.nPaginacion2}
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
                                    <Col xs={12} lg={lgSize}>
                                        <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-end align-items-stretch">
                                            {listaActivosNoCalculadosPorCuentas.length > 0 && (
                                                <>
                                                    {/* Botón No calculados */}
                                                    <Button
                                                        variant='warning'
                                                        onClick={() => setMostrarModalNoCalculados(true)}
                                                        disabled={listaActivosNoCalculadosPorCuentas.length === 0}
                                                        className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 d-flex align-items-center justify-content-center"
                                                    >
                                                        <ExclamationDiamond className={classNames("flex-shrink-0", "h-5 w-5 mx-1  text-danger")} aria-hidden="true" />
                                                        No Calculados
                                                        <span className="badge bg-light text-dark mx-1 mt-1">
                                                            {listaActivosNoCalculadosPorCuentas.length}
                                                        </span>

                                                    </Button>
                                                </>
                                            )}
                                            {listaActivosPorCuentasFijos.length > 0 && (
                                                <>
                                                    {/* Botón Exportar Calculados */}
                                                    <Button
                                                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                                                        onClick={handleAbrirModalCalcular}
                                                        disabled={listaActivosPorCuentasFijos.length === 0 || loadingExportar}
                                                        className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 d-flex align-items-center justify-content-center"
                                                    >
                                                        {loadingExportar ? (
                                                            <>
                                                                Un Momento...
                                                                <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiletypePdf
                                                                    className="flex-shrink-0 h-5 w-5 mx-2"
                                                                    aria-hidden="true"
                                                                />
                                                                Exportar
                                                                <span className="badge bg-light text-dark mx-1 mt-1">
                                                                    {listaActivosCalculadosPorCuentas.length}
                                                                </span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </>
                                            )}


                                        </div>
                                    </Col>
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
                                                        <th scope="col" className="text-nowrap text-center">Cuenta</th>
                                                        <th scope="col" className="text-nowrap text-center">Descripción</th>
                                                        <th scope="col" className="text-nowrap text-center">Monto Inicial</th>
                                                        <td
                                                            scope="col"
                                                            className="text-nowrap text-center bg-success text-white">
                                                            <b> Depreciación Anual</b>
                                                        </td>
                                                        <td
                                                            scope="col"
                                                            className="text-nowrap text-center bg-success text-white">
                                                            <b>Depreciación Acumulada</b>
                                                        </td>
                                                        <td
                                                            scope="col"
                                                            className="text-nowrap text-center bg-success text-white">
                                                            <b>Valor Residual</b>
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {elementosActuales2.map((lista, index) =>

                                                        <tr key={index}>
                                                            <td className="text-nowrap text-center">{lista.ctA_COD}</td>
                                                            {/* <td className="text-nowrap text-center">{lista.aF_CANTIDAD}</td> */}
                                                            <td className="text-nowrap">{lista.ctA_NOMBRE == "0" ? "Sin Descripción" : lista.ctA_NOMBRE}</td>
                                                            <td className="text-nowrap text-center">
                                                                {lista.montoInicial?.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                            </td>
                                                            <td className="text-nowrap text-center fw-bold" style={{
                                                                color: isDarkMode ? '#ffffff' : '#2f3e78',
                                                                background: 'rgb(25 135 84 / 14%)'
                                                            }}>
                                                                {lista.depreciacionPorAno === 0 ? "-" : "$" + lista.depreciacionPorAno?.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                            </td>
                                                            <td className="text-nowrap fw-bold" style={{
                                                                color: isDarkMode ? '#ffffff' : '#2f3e78',
                                                                background: 'rgb(25 135 84 / 14%)'
                                                            }}>
                                                                {lista.depreciacionAcumuladaActualizada === 0 ? "-" : "$" + lista.depreciacionAcumuladaActualizada?.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                            </td>
                                                            <td className="text-nowrap text-center fw-bold" style={{
                                                                color: isDarkMode ? '#ffffff' : '#2f3e78',
                                                                background: 'rgb(25 135 84 / 14%)'
                                                            }}>
                                                                {lista.valorResidual === 0 ? "-" : "$" + lista.valorResidual?.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
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
                            <div className="paginador-container position-relative z-0">
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
                    </Modal >

                )
            }

            {/* Modal Activos NO Calculados */}
            <Modal show={mostrarModalNoCalculados} onHide={() => setMostrarModalNoCalculados(false)} /*dialogClassName="modal-fullscreen" */ size="xl">
                <Modal.Header className={`modal-header bg-warning`} closeButton>
                    <Modal.Title className="fw-semibold text-muted ">
                        <ExclamationDiamond className={"flex-shrink-0 h-5 w-5 mx-2 mb-1 text-danger"} aria-hidden="true" />No Calculados</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <p className="alert alert-warning border-start border-1 border-warning-subtle text-dark fw-semibold">
                        Algunos inventarios no fueron calculados porque su vida útil está registrada como <strong>cero</strong>.
                    </p>

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
                                        <th scope="col" className="text-nowrap text-center">Nº Altas</th>
                                        <th scope="col" className="text-nowrap text-center">Especie</th>
                                        <th scope="col" className="text-nowrap text-center">Marca</th>
                                        <th scope="col" className="text-nowrap text-center">Modelo</th>
                                        <th scope="col" className="text-nowrap text-center">Serie</th>
                                        <th scope="col" className="text-nowrap text-center">Valor Inicial</th>
                                        <th scope="col" className="text-nowrap text-center">Descripción</th>
                                        <th scope="col" className="text-nowrap text-center">Vida Útil</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Alta</th>
                                        <th scope="col" className="text-nowrap text-center">N° Orden de compra</th>
                                        <th scope="col" className="text-nowrap text-center">Usuario Crea</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Creación</th>
                                        <th scope="col" className="text-nowrap text-center">Tipo Documento</th>
                                        <th scope="col" className="text-nowrap text-center">RUN Proveedor</th>
                                        <th scope="col" className="text-nowrap text-center">Número Factura</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Factura</th>
                                        <th scope="col" className="text-nowrap text-center">3 UTM</th>
                                        <th scope="col" className="text-nowrap text-center">Cuenta</th>
                                        <th scope="col" className="text-nowrap text-center">Monto Factura</th>
                                        <th scope="col" className="text-nowrap text-center">Vigente</th>
                                        <th scope="col" className="text-nowrap text-center">Modalidad Compra</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {elementosActuales3.map((lista, index) =>

                                        <tr key={index}>
                                            <td className="text-nowrap text-center">{lista.aF_CLAVE}</td>
                                            <td scope="col" className="text-nowrap text-center sticky-left z-0">  {lista.aF_CODIGO_GENERICO}</td>
                                            <td className="text-nowrap text-center">{lista.altaS_CORR}</td>
                                            <td className="text-nowrap text-center">{lista.especie}</td>
                                            <td className="text-nowrap text-center">{lista.marca}</td>
                                            <td className="text-nowrap text-center">{lista.modelo}</td>
                                            <td className="text-nowrap text-center">{lista.serie}</td>
                                            <td className="text-nowrap text-center">
                                                ${(lista.aF_PRECIO_REF ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            <td className="text-nowrap">{lista.aF_DESCRIPCION == "0" ? "Sin Descripción" : lista.aF_DESCRIPCION}</td>
                                            <td className={`text-nowrap text-center ${isDarkMode ? "bg-warning" : "bg-warning-subtle"}`}>{lista.vidaUtil}</td>
                                            {/* <td className="text-nowrap text-center">{lista.aF_FINGRESO}</td> */}
                                            <td className="text-nowrap text-center">{lista.fechA_ALTA}</td>
                                            <td className="text-nowrap text-center">{lista.aF_OCO_NUMERO_REF}</td>
                                            <td className="text-nowrap text-center">{lista.usuariO_CREA}</td>
                                            <td className="text-nowrap text-center">{lista.f_CREA}</td>
                                            <td className="text-nowrap text-center">{lista.aF_TIPO_DOC}</td>
                                            <td className="text-nowrap text-center">{lista.proV_RUN}</td>
                                            <td className="text-nowrap text-center">{lista.aF_NUM_FAC}</td>
                                            <td className="text-nowrap text-center">{lista.aF_FECHAFAC}</td>
                                            <td className="text-nowrap text-center">{lista.aF_3UTM}</td>
                                            <td className="text-nowrap text-center">{lista.ctA_COD}</td>
                                            <td className="text-nowrap text-center">
                                                ${(lista.aF_MONTOFACTURA ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            <td className="text-nowrap text-center">{lista.aF_VIGENTE}</td>
                                            <td className="text-nowrap text-center">{lista.modalidad}</td>

                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* Paginador */}
                    <div className="paginador-container position-relative z-0">
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
            </Modal>

            {/* Modal PDF Excel Word */}
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
                )} >
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""}
                    style={{
                        cursor: "move",
                        userSelect: "none"
                    }}
                    closeButton>
                    <Modal.Title className="fw-semibold">Exportar</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                    <BlobProvider
                        document={
                            <DocumentoCuentasPDF
                                row={listaActivosCalculadosPorCuentas}
                                totalRes={totalRes}
                                totalDep={totalDep}
                                totalDepAnual={totalDepAnual}
                                totalMontoInicial={totalMontoInicial}
                            />
                        }
                    >
                        {({ url, loading }) => {
                            // Cuando el PDF termina de cargarse, apagamos el spinner
                            useEffect(() => {
                                if (!loading) {
                                    setLoadingExportar(false);
                                }
                            }, [loading]);

                            return loading ? (
                                <p>Generando vista previa...</p>
                            ) : (
                                <>
                                    <div className="mt-3 d-flex justify-content-end gap-2 mb-1">
                                        <Button
                                            onClick={() => exportarExcel(listaActivosCalculadosPorCuentas)}
                                            variant="success"
                                        >
                                            Descargar Excel
                                            <FileEarmarkExcel className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                        </Button>
                                    </div>
                                    <iframe
                                        src={url ?? ""}
                                        title="Vista Previa del PDF"
                                        style={{
                                            width: "100%",
                                            height: "900px",
                                            border: "none"
                                        }}
                                    ></iframe>
                                </>
                            );
                        }}
                    </BlobProvider>
                </Modal.Body>
            </Modal>
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaActivosPorCuentasFijos: state.listaActivosFijosPorCuentasReducers.listaActivosPorCuentasFijos,
    listaActivosCalculadosPorCuentas: state.listaActivosCalculadosPorCuentasReducers.listaActivosCalculadosPorCuentas,
    listaActivosNoCalculadosPorCuentas: state.listaActivosNoCalculadosPorCuentasReducers.listaActivosNoCalculadosPorCuentas,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion,
    objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
    listaActivosFijosPorCuentasActions,
    listaActivosCasrActions,
    listaActivosCalculadosPorCuentasActions,
})(CalcularDepreciacionPorCuentas);
