import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Pagination, Form, Modal, Col, Row, Collapse, Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";
// import Swal from "sweetalert2";
// import SignatureCanvas from 'react-signature-canvas';
import { pdf } from "@react-pdf/renderer";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { RootState } from "../../../store";
import MenuAltas from "../../Menus/MenuAltas";
import Layout from "../../../containers/hocs/layout/Layout";
import DocumentoPDF from './DocumentoPDF';
import { BlobProvider, /*PDFDownloadLink*/ } from '@react-pdf/renderer';
import { Helmet } from "react-helmet-async";
import { Objeto } from "../../Navegacion/Profile";
import { Eraser, FiletypePdf, Paperclip, Search, Trash, XCircle } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { obtenerfirmasAltasActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerfirmasAltasActions";
import { obtenerUnidadesActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerUnidadesActions";
import { listaAltasRegistradasActions } from "../../../redux/actions/Altas/AnularAltas/listaAltasRegistradasActions";
import { registrarBienesBajasActions } from "../../../redux/actions/Bajas/ListadoGeneral/registrarBienesBajasActions";
import { FileSignatureIcon } from "lucide-react";
import { registrarDocumentoAltaActions } from "../../../redux/actions/Altas/FirmarAltas/registrarDocumentoAltaActions";
import { listaEstadoFirmasActions } from "../../../redux/actions/Altas/FirmarAltas/listaEstadoFirmasActions";
import { useLocation } from "react-router-dom";
import { listaEstadoActions } from "../../../redux/actions/Altas/EstadoFirmas/listaEstadoActions";
import { setSeguimientoFirmasActions } from "../../../redux/actions/Altas/EstadoFirmas/listaEstadoVisadoresActions";

// import { anularAltasActions } from "../../../redux/actions/Altas/AnularAltas/anularAltasActions";

interface FechasProps {
    fDesde?: string;
    fHasta?: string;
}
export interface ListaAltas {
    aF_CLAVE: number,
    aF_CODIGO_GENERICO: string,
    altaS_CORR: number,
    aF_NUM_FAC: string,
    aF_OCO_NUMERO_REF: string,
    seR_CORR: string,
    deP_CORR: string,
    esP_NOMBRE: string,
    ctA_COD: string,
    deT_MARCA: string,
    deT_MODELO: string,
    deT_SERIE: string,
    estado: string,
    deT_PRECIO: number,
    fechA_ALTA: string,
    nrecep: string,
    estadO_FIRMA: number;
    idocumento: number;
    usuariO_CREA: string | number;
    serv: string;
    dep: string;
}
export interface DatosFirmas {
    nombre: string,
    rut: string,
    estabL_CORR: string,
    estado: string,
    firma: string,
    rol: string,
    apellidO_MATERNO: string,
    apellidO_PATERNO: string,
    nombrE_USUARIO: string,
    descripcion: string,
    url: string,
    iD_UNIDAD: number,
    idcargo: number;
    correo: string;
}
export interface Unidades {
    iD_UNIDAD: number,
    nombre: string
}

export interface ListaEstadoFirmas {
    idocumento: number;
    altaS_CORR?: number;
    estado: number;
}
interface DatosBajas {
    listaAltasRegistradas: ListaAltas[];
    comboUnidades: Unidades[];
    listaAltasRegistradasActions: (fDesde: string, fHasta: string, af_codigo_generico: string, altasCorr: number, establ_corr: number) => Promise<boolean>;
    listaEstadoFirmasActions: (altasCorr: number, idDocumento: number, establ_corr: number) => Promise<boolean>;
    obtenerUnidadesActions: () => Promise<boolean>;
    obtenerfirmasAltasActions: () => Promise<boolean>;
    registrarDocumentoAltaActions: (documento: any) => Promise<number | null>;
    listaEstadoActions: (altasCorr: number, idDocumento: number, establ_corr: number) => Promise<boolean>;
    setSeguimientoFirmasActions: (dataSeguimientoEstadoFirma: any) => void;
    // anularAltasActions: (activos: { aF_CLAVE: number }[]) => Promise<boolean>;
    datosFirmas: DatosFirmas[];
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
    listaEstadoFirmas: ListaEstadoFirmas[];
    idocumentoAlta: number;
}

const FirmarAltas: React.FC<DatosBajas> = ({ listaAltasRegistradasActions, listaEstadoFirmasActions, obtenerUnidadesActions, obtenerfirmasAltasActions, registrarDocumentoAltaActions, listaEstadoActions, setSeguimientoFirmasActions, listaAltasRegistradas, listaEstadoFirmas, comboUnidades, token, isDarkMode, datosFirmas, objeto, idocumentoAlta }) => {
    const [loading, setLoading] = useState(false);
    // const [loadingAnular, setLoadingAnular] = useState(false);
    const [_, setLoadingSolicitarVisado] = useState(false);
    const [___, setIsDisabled] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    //-------------Modal-------------//
    // const [mostrarModal, setMostrarModal] = useState<number | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    // const [filaActiva, setFilaActiva] = useState<listaAltasRegistradas | null>(null);
    //------------Fin Modal----------//   
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [ultimaAltaSeleccionada, setUltimaAltaSeleccionada] = useState<number | null>(null);
    const [seleccionarTodosHabilitado, setSeleccionarTodosHabilitado] = useState(false);
    const [error, setError] = useState<Partial<FechasProps> & {}>({});
    const [paginaActual, setPaginaActual] = useState(1);
    const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
    const elementosPorPagina = Paginacion.nPaginacion;
    const [Unidad, setUnidad] = useState<number>(0);
    const [__, setUnidadNombre] = useState<string>("");
    const [altaSeleccionada, setAltaSeleccionada] = useState(0);

    const filasSeleccionadasPDF = listaAltasRegistradas.filter((_, index) =>
        filasSeleccionadas.includes(index.toString())
    );
    const location = useLocation();
    const afaltaS_CORR = location.state?.prop_altaS_CORR ?? 0;
    const [loadingEnvio, setLoadingEnvio] = useState(false);
    // type SeguimientoFirmasState = {
    //     altas: number;
    //     establecimiento: number;
    // } | null
    // const [seguimientoFirmas, setSeguimientoFirmas] = useState<SeguimientoFirmasState>(null);

    // adjuntar archivos modal
    const [anexos, setAnexos] = useState<File[]>([]);

    //Estado para renderizar los nombres de los usuarios en cada check de los firmantes
    const [nombreTitularInventario, setNombreTitularInventario] = useState<string>("");
    const [nombreSubInventario, setNombreSubInventario] = useState<string>("");
    const [nombreTitularfinanzas, setNombreTitularFinanzas] = useState<string>("");
    const [nombreSubFinanzas, setNombreSubFinanzas] = useState<string>("");
    const [nombreTitularAbastecimiento, setNombreTitularAbastecimiento] = useState<string>("");
    const [nombreSubAbastecimiento, setNombreSubAbastecimiento] = useState<string>("");
    const [nombreTitularInformatica, setNombreTitularInformatica] = useState<string>("");
    const [nombreSubInformatica, setNombreSubInformatica] = useState<string>("");
    const [nombreTitularCompra, setNombreTitularCompra] = useState<string>("");
    const [nombreSubCompra, setNombreSubCompra] = useState<string>("");
    const [nombreTitularConvenio, setNombreTitularConvenio] = useState<string>("");
    const [nombreSubConvenio, setNombreSubConvenio] = useState<string>("");
    const [nombreTitularRFisico, setNombreTitularRFisico] = useState<string>("");
    const [nombreSubRFisico, setNombreSubRFisico] = useState<string>("");


    //Este permiteadjuntar archivos y convertirlos a base64
    const convertirArchivosABase64 = async (archivos: File[]): Promise<{ nombre: string, contenido: string }[]> => {
        const resultado: { nombre: string, contenido: string }[] = [];

        for (const archivo of archivos) {
            const contenido = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(",")[1]);
                reader.onerror = reject;
                reader.readAsDataURL(archivo);
            });

            resultado.push({
                nombre: archivo.name,
                contenido
            });
        }

        return resultado;
    };

    // const sigCanvas = useRef<SignatureCanvas>(null);

    // const [isSigned, setIsSigned] = useState(false);
    // const [signatureImage, setSignatureImage] = useState<string | undefined>();
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

    const [Inventario, setInventario] = useState({
        fDesde: "",
        fHasta: "",
        altaS_CORR: afaltaS_CORR,
        af_codigo_generico: "",
        idocumentoAlta: idocumentoAlta //Se inicializa con el valor de redux luego de registrar el documento.
    });

    const [AltaInventario, setAltaInventario] = useState({
        ajustarFirma: false,//General
        chkFinanzas: false,//Opcional
        chkAbastecimiento: false,//Opcional
        chkUnidad: false,//Opcional

        titularInventario: false,
        subroganteInventario: false,
        titularFinanzas: false,
        subroganteFinanzas: false,

        unidad: 0, //Combo Unidad
        titularAbastecimiento: false,
        subroganteAbastecimiento: false,
        titularInformatica: false,
        subroganteInformatica: false,
        titularCompra: false,
        subroganteCompra: false,
        titularConvenio: false,
        subroganteConvenio: false,
        titularRFisico: false,
        subroganteRFisico: false,

        firmanteInventario: "",
        firmanteFinanzas: "",
        firmanteAbastecimiento: "",
        firmanteInformatica: "",
        firmanteCompra: "",
        firmanteConvenio: "",
        firmanteRFisico: "",

        visadoInventario: "",
        visadoFinanzas: "",
        visadoAbastecimiento: ""
    });

    const listaAuto = async () => {
        if (token) {
            if (listaAltasRegistradas.length === 0) {
                setLoading(true);
                const resultado = await listaAltasRegistradasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
                if (!resultado) {
                    Swal.fire({
                        icon: "warning",
                        title: "Sin Resultados",
                        text: "No hay registros disponibles para mostrar.",
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

        if (listaEstadoFirmas.length === 0) listaEstadoFirmasActions(altaSeleccionada, 0, objeto.Roles[0]?.codigoEstablecimiento);
        listaAuto();
        Unidad
        if (anexos.length > 2) {
            Swal.fire({
                icon: "warning",
                title: "Demasiados archivos adjuntos",
                text: "Solo se permite adjuntar un máximo de 2 archivos.",
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: "Cerrar",
                background: isDarkMode ? "#1e1e1e" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: { popup: "custom-border" }
            });
        }
    }, [listaAltasRegistradasActions, token, listaAltasRegistradas.length, isDarkMode, Unidad, listaEstadoFirmas.length, anexos.length]);


    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        if (Inventario.fDesde > Inventario.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        //solo permitir números
        if ((name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) || (name === "altaS_CORR" && !/^[0-9]*$/.test(value))) {
            return; // Salir si contiene caracteres no numéricos
        }

        // Actualizar estado
        setInventario((prevState) => ({
            ...prevState,
            [name]: value.replace(/^0+/, "") //Elimina ceroa la izquierda
        }));

        setPaginacion((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        const prev = structuredClone(AltaInventario);
        const updatedState = { ...prev, [name]: value };

        if (name === "unidad") {
            const unidadSeleccionada = parseInt(value);
            setUnidad(unidadSeleccionada);

            let nombreUnidad = "";
            let cleanedState = { ...updatedState };
            //Limpia los check segun la unidad selecionada
            switch (unidadSeleccionada) {
                case 3:
                    nombreUnidad = "Unidad de Abastecimiento";
                    cleanedState = {
                        ...cleanedState,
                        titularInformatica: false,
                        subroganteInformatica: false,
                        titularCompra: false,
                        subroganteCompra: false,
                        titularConvenio: false,
                        subroganteConvenio: false,
                        titularRFisico: false,
                        subroganteRFisico: false,
                    };
                    break;

                case 4:
                    nombreUnidad = "Departamento de Informática";
                    cleanedState = {
                        ...cleanedState,
                        titularAbastecimiento: false,
                        subroganteAbastecimiento: false,
                        titularCompra: false,
                        subroganteCompra: false,
                        titularConvenio: false,
                        subroganteConvenio: false,
                        titularRFisico: false,
                        subroganteRFisico: false,
                    };
                    break;

                case 5:
                    nombreUnidad = "Departamento de Compra";
                    cleanedState = {
                        ...cleanedState,
                        titularAbastecimiento: false,
                        subroganteAbastecimiento: false,
                        titularInformatica: false,
                        subroganteInformatica: false,
                        titularConvenio: false,
                        subroganteConvenio: false,
                        titularRFisico: false,
                        subroganteRFisico: false,
                    };
                    break;

                case 6:
                    nombreUnidad = "Departamento de Convenio";
                    cleanedState = {
                        ...cleanedState,
                        titularAbastecimiento: false,
                        subroganteAbastecimiento: false,
                        titularInformatica: false,
                        subroganteInformatica: false,
                        titularCompra: false,
                        subroganteCompra: false,
                        titularRFisico: false,
                        subroganteRFisico: false,
                    };
                    break;

                case 7:
                    nombreUnidad = "Departamento de Recursos fisicos";
                    cleanedState = {
                        ...cleanedState,
                        titularAbastecimiento: false,
                        subroganteAbastecimiento: false,
                        titularInformatica: false,
                        subroganteInformatica: false,
                        titularCompra: false,
                        subroganteCompra: false,
                        titularConvenio: false,
                        subroganteConvenio: false,
                    };
                    break;


                default:
                    nombreUnidad = "";
                    break;
            }

            setUnidadNombre(nombreUnidad);
            setAltaInventario(cleanedState);
        }

    };

    //Detecta el tipo de imagen para el PDF
    function detectarTipo(base64: string): string {
        if (base64.startsWith("/9j/")) return "jpeg";
        if (base64.startsWith("iVBOR")) return "png";
        if (base64.startsWith("R0lGOD")) return "gif";
        return "png"; // fallback
    }

    const generarPDFBase64 = async (): Promise<string> => {
        // 1. Genera un Blob real de tu componente PDF
        const blob = await pdf(
            <DocumentoPDF
                row={filasSeleccionadasPDF}
                totalSum={totalSum}
            // AltaInventario={AltaInventario}
            // objeto={objeto}
            // UnidadNombre={UnidadNombre}
            // Unidad={Unidad}
            />
        ).toBlob();

        // 2. Léelo como Data URL
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    const dataUrl = reader.result;
                    const base64 = dataUrl.split(',')[1];
                    resolve(base64);
                } else {
                    reject(new Error('FileReader no es un string'));
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);

        });
    };

    //Check de firmantes
    const handleCheck = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        // Copia del estado actual
        const prev = structuredClone(AltaInventario);
        const updatedState = { ...prev, [name]: checked };

        //Limpia Todo al deshabilitar check
        if (name === "ajustarFirma") {
            if (!checked) {
                const cleanedState = {
                    ...updatedState,
                    chkFinanzas: false,
                    chkAbastecimiento: false,
                    chkUnidad: false,
                    // JERARQUIA 1
                    titularInventario: false,
                    subroganteInventario: false,
                    // JERARQUIA 2
                    titularFinanzas: false,
                    subroganteFinanzas: false,
                    // JERARQUIA 3
                    titularAbastecimiento: false,
                    subroganteAbastecimiento: false,
                    // JERARQUIA 3 //Combo
                    titularInformatica: false,
                    subroganteInformatica: false,
                    titularCompra: false,
                    subroganteCompra: false,
                    titularConvenio: false,
                    subroganteConvenio: false,
                    titularRFisico: false,
                    subroganteRFisico: false,

                    // Nombres de firmantes
                    firmanteInventario: "",
                    firmanteFinanzas: "",
                    firmanteAbastecimiento: "",
                    firmanteInformatica: "",
                    firmanteCompra: "",
                    firmanteConvenio: "",
                    firmanteRFisico: "",

                    // Imágenes
                    visadoInventario: "",
                    visadoFinanzas: "",
                    visadoAbastecimiento: ""
                };
                setIsDisabled(true);
                setIsExpanded(false);
                setAltaInventario(cleanedState);
                setNombreTitularInventario("");
                setNombreSubInventario("");
                setNombreTitularFinanzas("");
                setNombreSubFinanzas("");
                setNombreTitularAbastecimiento("");
                setNombreSubAbastecimiento("");
                setNombreTitularInformatica("");
                setNombreSubInformatica("");
                setNombreTitularCompra("");
                setNombreSubCompra("");
                setNombreTitularConvenio("");
                setNombreSubConvenio("");
                setNombreTitularRFisico("");
                setNombreSubRFisico("");
            } else {
                setIsDisabled(false);
                setIsExpanded(true);
                setAltaInventario(updatedState);
            }
            return;
        }

        //Limpia Solo Finanzas al deshabilitar check
        if (name === "chkFinanzas" && !checked) {
            const cleanedState = {
                ...updatedState,
                titularFinanzas: false,
                subroganteFinanzas: false,
                firmanteFinanzas: "",

            };
            setIsDisabled(false);
            setIsExpanded(true);
            setAltaInventario(cleanedState);
            setNombreTitularFinanzas("");
            setNombreSubFinanzas("");
            return;
        }
        //Limpia Solo Abastecimiento al deshabilitar check
        if (name === "chkAbastecimiento" && !checked) {
            const cleanedState = {
                ...updatedState,
                titularAbastecimiento: false,
                subroganteAbastecimiento: false,
                firmanteAbastecimiento: "",

            };
            setIsDisabled(false);
            setIsExpanded(true);
            setAltaInventario(cleanedState);
            setNombreTitularAbastecimiento("");
            setNombreSubAbastecimiento("");
            return;
        }
        //Limpia solo combo y sus unidades al deshabilitar check
        if (name === "chkUnidad" && !checked) {
            if (!checked) {
                setUnidad(0); // limpia combo
                setUnidadNombre(""); // limpia nombre visible
                const cleanedState = {
                    ...updatedState,
                    titularAbastecimiento: false,
                    subroganteAbastecimiento: false,
                    titularInformatica: false,
                    subroganteInformatica: false,
                    titularCompra: false,
                    subroganteCompra: false,
                    titularConvenio: false,
                    subroganteConvenio: false,
                    titularRFisico: false,
                    subroganteRFisico: false,
                    firmanteAbastecimiento: "",
                    firmanteInformatica: "",
                    firmanteCompra: "",
                    firmanteConvenio: "",
                    firmanteRFisico: "",
                };
                setIsDisabled(false);
                setIsExpanded(true);
                setAltaInventario(cleanedState);
                setNombreTitularAbastecimiento("");
                setNombreSubAbastecimiento("");
                setNombreTitularInformatica("");
                setNombreSubInformatica("");
                setNombreTitularCompra("");
                setNombreSubCompra("");
                setNombreTitularConvenio("");
                setNombreSubConvenio("");
                setNombreTitularRFisico("");
                setNombreSubRFisico("");
                return;
            }
        }

        let firmanteInventario = prev.firmanteInventario || "";
        let firmanteFinanzas = prev.firmanteFinanzas || "";
        let firmanteAbastecimiento = prev.firmanteAbastecimiento || "";
        let firmanteInformatica = prev.firmanteInformatica || "";
        let firmanteCompra = prev.firmanteCompra || "";
        let firmanteConvenio = prev.firmanteConvenio || "";
        let firmanteRFisico = prev.firmanteRFisico || "";
        let visadoInventario = prev.visadoInventario || "";
        let visadoFinanzas = prev.visadoFinanzas || "";
        let visadoAbastecimiento = prev.visadoAbastecimiento || "";

        for (const firma of datosFirmas) {

            const nombreCompleto = `${firma.nombre} ${firma.apellidO_PATERNO} ${firma.apellidO_MATERNO}`;

            //Antes se renderizaba la imagen de la firma, este se cargaba desde la tabla en la columna firma(tabla inv_t_firmantes) se deja de todas manera si en algun momento se necesita volver a esto
            const FIRMA = `data:image/${detectarTipo};base64,${firma.firma}`;

            if (firma.iD_UNIDAD === 1) {
                if (name === "titularInventario" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteInventario = nombreCompleto;
                    visadoInventario = FIRMA;
                    updatedState.subroganteInventario = false;
                    setNombreTitularInventario(firma.nombre + " " + firma.apellidO_PATERNO);
                    setNombreSubInventario("");
                }
                if (name === "subroganteInventario" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteInventario = nombreCompleto;
                    visadoInventario = FIRMA;
                    updatedState.titularInventario = false;
                    setNombreSubInventario(firma.nombre + " " + firma.apellidO_PATERNO);
                    setNombreTitularInventario("");
                }
            }
            if (firma.iD_UNIDAD === 2) {
                if (name === "titularFinanzas" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteFinanzas = nombreCompleto;
                    visadoFinanzas = FIRMA;
                    updatedState.subroganteFinanzas = false;
                    setNombreTitularFinanzas(firma.nombre + " " + firma.apellidO_PATERNO);
                    setNombreSubFinanzas("");
                }
                if (name === "subroganteFinanzas" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteFinanzas = nombreCompleto;
                    visadoFinanzas = FIRMA;
                    updatedState.titularFinanzas = false;
                    setNombreSubFinanzas(firma.nombre + " " + firma.apellidO_PATERNO);
                    setNombreTitularFinanzas("");
                }
            }
            if (firma.iD_UNIDAD === 3) {
                if (name === "titularAbastecimiento" && checked && firma.rol === "TITULAR") {
                    firmanteAbastecimiento = nombreCompleto;
                    visadoAbastecimiento = FIRMA;
                    updatedState.subroganteAbastecimiento = false;
                    setNombreTitularAbastecimiento(firma.nombre + " " + firma.apellidO_PATERNO);
                    setNombreSubAbastecimiento("");
                }
                if (name === "subroganteAbastecimiento" && checked && firma.rol === "SUBROGANTE") {
                    firmanteAbastecimiento = nombreCompleto;
                    visadoAbastecimiento = FIRMA;
                    updatedState.titularAbastecimiento = false;
                    setNombreSubAbastecimiento(firma.nombre + " " + firma.apellidO_PATERNO);
                    setNombreTitularAbastecimiento("");
                }
            }
            if (AltaInventario.chkUnidad) {
                //Unidad de Abastecimiento
                if (firma.iD_UNIDAD === 3) {

                    if (name === "titularAbastecimiento" && checked && firma.rol === "TITULAR") {
                        firmanteAbastecimiento = nombreCompleto;
                        updatedState.subroganteAbastecimiento = false;
                        setNombreTitularAbastecimiento(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreSubAbastecimiento("");
                    }
                    if (name === "subroganteAbastecimiento" && checked && firma.rol === "SUBROGANTE") {
                        firmanteAbastecimiento = nombreCompleto;
                        updatedState.titularAbastecimiento = false;
                        setNombreSubAbastecimiento(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreTitularAbastecimiento("");
                    }
                }
                //Departamento de Informática
                if (firma.iD_UNIDAD === 4) {
                    if (name === "titularInformatica" && checked && firma.rol === "TITULAR") {
                        firmanteInformatica = nombreCompleto;
                        updatedState.subroganteInformatica = false;
                        setNombreTitularInformatica(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreSubInformatica("");
                    }
                    if (name === "subroganteInformatica" && checked && firma.rol === "SUBROGANTE") {
                        firmanteInformatica = nombreCompleto;
                        updatedState.titularInformatica = false;
                        setNombreSubInformatica(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreTitularInformatica("");
                    }
                }
                //Departamento de Compra
                if (firma.iD_UNIDAD === 5) {
                    if (name === "titularCompra" && checked && firma.rol === "TITULAR") {
                        firmanteCompra = nombreCompleto;
                        updatedState.subroganteCompra = false;
                        setNombreTitularCompra(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreSubCompra("");
                    }
                    if (name === "subroganteCompra" && checked && firma.rol === "SUBROGANTE") {
                        firmanteCompra = nombreCompleto;
                        updatedState.titularCompra = false;
                        setNombreSubCompra(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreTitularCompra("");
                    }
                }
                //Departamento de Convenio
                if (firma.iD_UNIDAD === 6) {
                    if (name === "titularConvenio" && checked && firma.rol === "TITULAR") {
                        firmanteConvenio = nombreCompleto;
                        updatedState.subroganteConvenio = false;
                        setNombreTitularConvenio(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreSubConvenio("");
                    }
                    if (name === "subroganteConvenio" && checked && firma.rol === "SUBROGANTE") {
                        firmanteConvenio = nombreCompleto;
                        updatedState.titularConvenio = false;
                        setNombreSubConvenio(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreTitularConvenio("");
                    }
                }
                //Departamento de Recursos Fisicos
                if (firma.iD_UNIDAD === 7) {
                    if (name === "titularRFisico" && checked && firma.rol === "TITULAR") {
                        firmanteRFisico = nombreCompleto;
                        updatedState.subroganteRFisico = false;
                        setNombreTitularRFisico(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreSubRFisico("");
                    }
                    if (name === "subroganteRFisico" && checked && firma.rol === "SUBROGANTE") {
                        firmanteRFisico = nombreCompleto;
                        updatedState.titularRFisico = false;
                        setNombreSubRFisico(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreTitularRFisico("");
                    }
                }
            }
        }

        updatedState.firmanteInventario = firmanteInventario;
        updatedState.firmanteFinanzas = firmanteFinanzas;
        updatedState.firmanteAbastecimiento = firmanteAbastecimiento;
        updatedState.firmanteInformatica = firmanteInformatica;
        updatedState.firmanteCompra = firmanteCompra;
        updatedState.firmanteConvenio = firmanteConvenio;
        updatedState.firmanteRFisico = firmanteRFisico;

        updatedState.visadoInventario = visadoInventario;
        updatedState.visadoFinanzas = visadoFinanzas;
        updatedState.visadoAbastecimiento = visadoAbastecimiento;
        setIsDisabled(false);
        setIsExpanded(true);
        setAltaInventario(updatedState);
    }, [AltaInventario, datosFirmas, objeto]);

    const handleBuscar = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        let resultado = false;
        setLoading(true);
        if (Inventario.fDesde != "" || Inventario.fHasta != "") {
            if (validate()) {
                resultado = await listaAltasRegistradasActions(Inventario.fDesde, Inventario.fHasta, Inventario.af_codigo_generico, Inventario.altaS_CORR, objeto.Roles[0].codigoEstablecimiento);
            }
        }
        else {
            resultado = await listaAltasRegistradasActions("", "", Inventario.af_codigo_generico, Inventario.altaS_CORR, objeto.Roles[0].codigoEstablecimiento);
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
            resultado = await listaAltasRegistradasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
            setLoading(false); //Finaliza estado de carga
            return;
        } else {
            paginar(1);
            setLoading(false); //Finaliza estado de carga
        }

    };

    const handleSolicitarVisado = async () => {
        setLoadingSolicitarVisado(true);
        const maxBytes = 11 * 1024 * 1024; // 20 MB
        if (anexos && anexos.some((f) => f.size > maxBytes)) {
            await Swal.fire({
                icon: 'warning',
                title: 'Archivo demasiado grande',
                text: 'No se permiten archivos mayores a 20 MB. Elimine o reemplace el archivo y vuelva a intentarlo.',
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "#000000"}`,
            });
            setLoadingSolicitarVisado(false);
            return;
        }
        else {
            const result = await Swal.fire({
                icon: "info",
                title: "Solicitud de Visado",
                text: "Por favor confirme si desea enviar su solicitud de visado.",
                showCancelButton: true,
                confirmButtonText: "Confirmar y Enviar",
                background: isDarkMode ? "#1e1e1e" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: { popup: "custom-border" }
            });

            // Genera el PDF
            const base64 = await generarPDFBase64();
            // Obtiene firmas según jerarquía activada
            const obtenerFirmasJerarquia = (): { jerarquia: number; idcargo: number; rut: string, correo: string }[] => {
                const firmasSeleccionadas: { jerarquia: number; idcargo: number; rut: string, correo: string }[] = [];
                const establecimiento = objeto.Roles[0].codigoEstablecimiento.toString();

                // Jerarquía 1 → ajustarFirma
                if (AltaInventario.ajustarFirma) {
                    const firmasUnidad1 = datosFirmas.filter(f => f.estabL_CORR === establecimiento && f.iD_UNIDAD === 1);

                    if (AltaInventario.titularInventario) {
                        const titular = firmasUnidad1.find(f => f.rol === "TITULAR");
                        if (titular) {
                            firmasSeleccionadas.push({ jerarquia: 1, idcargo: titular.idcargo, rut: titular.rut, correo: titular.correo });
                        }
                    } else if (AltaInventario.subroganteInventario) {
                        const subrogante = firmasUnidad1.find(f => f.rol === "SUBROGANTE");
                        if (subrogante) {
                            firmasSeleccionadas.push({ jerarquia: 1, idcargo: subrogante.idcargo, rut: subrogante.rut, correo: subrogante.correo });
                        }
                    }
                }

                // Jerarquía 2 → chkFinanzas
                if (AltaInventario.chkFinanzas) {
                    const firmasUnidad2 = datosFirmas.filter(f => f.estabL_CORR === establecimiento && f.iD_UNIDAD === 2);

                    if (AltaInventario.titularFinanzas) {
                        const titular = firmasUnidad2.find(f => f.rol === "TITULAR");
                        if (titular) {
                            firmasSeleccionadas.push({ jerarquia: 2, idcargo: titular.idcargo, rut: titular.rut, correo: titular.correo });
                        }
                    } else if (AltaInventario.subroganteFinanzas) {
                        const subrogante = firmasUnidad2.find(f => f.rol === "SUBROGANTE");
                        if (subrogante) {
                            firmasSeleccionadas.push({ jerarquia: 2, idcargo: subrogante.idcargo, rut: subrogante.rut, correo: subrogante.correo });
                        }
                    }
                }

                // Jerarquía 3 → chkAbastecimiento
                if (AltaInventario.chkAbastecimiento) {
                    const firmasUnidad3 = datosFirmas.filter(f => f.estabL_CORR === establecimiento && f.iD_UNIDAD === 3);

                    if (AltaInventario.titularAbastecimiento) {
                        const titular = firmasUnidad3.find(f => f.rol === "TITULAR");
                        if (titular) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: titular.idcargo, rut: titular.rut, correo: titular.correo });
                        }
                    } else if (AltaInventario.subroganteAbastecimiento) {
                        const subrogante = firmasUnidad3.find(f => f.rol === "SUBROGANTE");
                        if (subrogante) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: subrogante.idcargo, rut: subrogante.rut, correo: subrogante.correo });
                        }
                    }
                }

                // Jerarquía 3 extendida → chkUnidad (con combo)
                if (AltaInventario.chkUnidad) {
                    // Abastecimiento (Unidad 3)
                    const firmasUnidad1 = datosFirmas.filter(f => f.estabL_CORR === establecimiento && f.iD_UNIDAD === 3);
                    if (AltaInventario.titularAbastecimiento) {
                        const titular = firmasUnidad1.find(f => f.rol === "TITULAR");
                        if (titular) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: titular.idcargo, rut: titular.rut, correo: titular.correo });
                        }
                    } else if (AltaInventario.subroganteAbastecimiento) {
                        const subrogante = firmasUnidad1.find(f => f.rol === "SUBROGANTE");
                        if (subrogante) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: subrogante.idcargo, rut: subrogante.rut, correo: subrogante.correo });
                        }
                    }

                    // Informática (Unidad 4)
                    const firmasUnidad2 = datosFirmas.filter(f => f.iD_UNIDAD === 4);
                    if (AltaInventario.titularInformatica) {
                        const titular = firmasUnidad2.find(f => f.rol === "TITULAR");
                        if (titular) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: titular.idcargo, rut: titular.rut, correo: titular.correo });
                        }
                    } else if (AltaInventario.subroganteInformatica) {
                        const subrogante = firmasUnidad2.find(f => f.rol === "SUBROGANTE");
                        if (subrogante) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: subrogante.idcargo, rut: subrogante.rut, correo: subrogante.correo });
                        }
                    }

                    // Compras (Unidad 5)
                    const firmasUnidad3 = datosFirmas.filter(f => f.iD_UNIDAD === 5);
                    if (AltaInventario.titularCompra) {
                        const titular = firmasUnidad3.find(f => f.rol === "TITULAR");
                        if (titular) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: titular.idcargo, rut: titular.rut, correo: titular.correo });
                        }
                    } else if (AltaInventario.subroganteCompra) {
                        const subrogante = firmasUnidad3.find(f => f.rol === "SUBROGANTE");
                        if (subrogante) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: subrogante.idcargo, rut: subrogante.rut, correo: subrogante.correo });
                        }
                    }
                    // Convenio (Unidad 6)
                    const firmasUnidad4 = datosFirmas.filter(f => f.iD_UNIDAD === 6);
                    if (AltaInventario.titularConvenio) {
                        const titular = firmasUnidad4.find(f => f.rol === "TITULAR");
                        if (titular) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: titular.idcargo, rut: titular.rut, correo: titular.correo });
                        }
                    } else if (AltaInventario.subroganteConvenio) {
                        const subrogante = firmasUnidad4.find(f => f.rol === "SUBROGANTE");
                        if (subrogante) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: subrogante.idcargo, rut: subrogante.rut, correo: subrogante.correo });
                        }
                    }
                    // Recursos Fisicos (Unidad 7)
                    const firmasUnidad5 = datosFirmas.filter(f => f.iD_UNIDAD === 7);
                    if (AltaInventario.titularConvenio) {
                        const titular = firmasUnidad5.find(f => f.rol === "TITULAR");
                        if (titular) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: titular.idcargo, rut: titular.rut, correo: titular.correo });
                        }
                    } else if (AltaInventario.subroganteConvenio) {
                        const subrogante = firmasUnidad5.find(f => f.rol === "SUBROGANTE");
                        if (subrogante) {
                            firmasSeleccionadas.push({ jerarquia: 3, idcargo: subrogante.idcargo, rut: subrogante.rut, correo: subrogante.correo });
                        }
                    }
                }

                return firmasSeleccionadas;
            };

            const selectedIndices = filasSeleccionadas.map(Number);
            const FirmaAlta = selectedIndices.flatMap(index => {
                const item = listaAltasRegistradas[index];
                return obtenerFirmasJerarquia().map(({ jerarquia, idcargo, correo }) => ({
                    ALTAS_CORR: item.altaS_CORR,
                    JERARQUIA: jerarquia,
                    IDCARGO: idcargo,
                    FIRMADO: 0,
                    CORREO: correo
                }));
            });

            // const documento = {
            //     DescripcionDocumento: "Visado de altas de inventario",
            //     CuerpoDocumento: base64,
            //     UsuarioCreador: objeto.IdCredencial,
            //     FirmaAlta: FirmaAlta,
            //     ListaDistribucion: [],
            //     ListaAnexos: []
            // };
            const anexosBase64 = await convertirArchivosABase64(anexos);

            const documento = {
                DescripcionDocumento: "Visado de altas de inventario",
                CuerpoDocumento: base64,
                UsuarioCreador: objeto.IdCredencial,
                RUT: objeto.usr_run,
                ESTABL_CORR: objeto.Roles[0].codigoEstablecimiento,
                FirmaAlta: FirmaAlta,
                ListaDistribucion: [],
                ListaAnexos: anexosBase64
            };
            // console.log("documento", documento);
            if (result.isConfirmed) {
                setLoadingEnvio(true);
                setMostrarModal(false);
                const resultado = await registrarDocumentoAltaActions(documento);

                if (!resultado) {
                    await Swal.fire({
                        icon: "error",
                        title: "Error al enviar su solicitud",
                        text: "Por favor, intente nuevamente. Si el problema persiste, comuníquese con la Unidad de Desarrollo.",
                        background: isDarkMode ? "#1e1e1e" : "#ffffff",
                        color: isDarkMode ? "#ffffff" : "#000000",
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: { popup: "custom-border" }
                    });
                    setLoadingEnvio(false);
                }
                else {

                    setInventario({
                        ...Inventario,
                        idocumentoAlta: idocumentoAlta
                    });

                    await Swal.fire({
                        icon: "success",
                        title: "Solicitud enviada con exito",
                        html: `Número de documento <strong>${resultado}</strong>.<br> Puede realizar el seguimiento en el módulo estado de firmas.`,
                        background: isDarkMode ? "#1e1e1e" : "#ffffff",
                        color: isDarkMode ? "#ffffff" : "#000000",
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: { popup: "custom-border" }
                    });
                    setLoadingEnvio(false);
                    listaEstadoFirmasActions(0, 0, objeto.Roles[0].codigoEstablecimiento); // Actualiza estado de firmas del módulo FirmaAltas
                    listaEstadoActions(0, 0, objeto.Roles[0].codigoEstablecimiento);// Actualiza estado de firmas del módulo EstadoFirmas
                    setFilasSeleccionadas([]);
                    setMostrarModal(false);
                    setLoadingSolicitarVisado(false);
                    setAnexos([]);

                    // const altasSeguimiento = filasSeleccionadas.map(index =>
                    //     listaAltasRegistradas[parseInt(index)].idocumento
                    // );
                    setSeguimientoFirmasActions({ idocumento: resultado }); // Se guarda en el estado de redux para consultarlo en la funcion de estado de firmas

                }
            }
        }
    };

    const handleLimpiar = () => {
        setInventario((prevInventario) => ({
            ...prevInventario,
            fDesde: "",
            fHasta: "",
            altaS_CORR: 0,
            af_codigo_generico: ""
        }));
    };

    const handleLimpiarFilasSeleccionadas = () => {
        setFilasSeleccionadas([]);
        setUltimaAltaSeleccionada(null);
        setSeleccionarTodosHabilitado(false);
    };

    // Función al seleccionar una fila
    const setSeleccionaFilas = (index: number, altaS_CORR: number | null) => {
        setSeleccionarTodosHabilitado(false);
        if (altaS_CORR === null) return;

        // Cargar datos auxiliares solo si están vacíos
        if (comboUnidades.length === 0) obtenerUnidadesActions();
        if (datosFirmas.length === 0) obtenerfirmasAltasActions();

        const registro = listaAltasRegistradas.find((f) => f.altaS_CORR === altaS_CORR);
        const estado = registro?.estadO_FIRMA ?? null;

        // Validación: no mezclar altas diferentes
        if (ultimaAltaSeleccionada !== null && ultimaAltaSeleccionada !== altaS_CORR) {
            Swal.fire({
                icon: "warning",
                title: "Alta distinta",
                text: "Solo puedes seleccionar filas que correspondan a la misma alta.",
                background: isDarkMode ? "#1e1e1e" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
                confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
                customClass: { popup: "custom-border" },
            });
            return;
        }

        // Validaciones según el estado
        if (estado === 0) {
            Swal.fire({
                icon: "warning",
                title: "Solicitud en proceso",
                text: "Ya se ha enviado una solicitud para este número de alta.",
                background: isDarkMode ? "#1e1e1e" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
                confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
                customClass: { popup: "custom-border" },
            });

            setFilasSeleccionadas((prev) => prev.filter((rowIndex) => rowIndex !== index.toString()));
            setAltaSeleccionada(0);
            return;
        }

        if (estado === 1) {
            Swal.fire({
                icon: "info",
                title: "Firma registrada",
                text: "Esta solicitud ya cuenta con una firma registrada para este número de alta.",
                background: isDarkMode ? "#1e1e1e" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
                confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
                customClass: { popup: "custom-border" },
            });

            setFilasSeleccionadas((prev) => prev.filter((rowIndex) => rowIndex !== index.toString()));
            setAltaSeleccionada(0);
            return;
        }

        // Selección/deselección normal
        setFilasSeleccionadas((prev) => {
            let nuevas = prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString()) // deselecciona
                : [...prev, index.toString()]; // selecciona

            if (nuevas.length === 0) {
                // Reset si no queda nada
                setUltimaAltaSeleccionada(null);
                setAltaSeleccionada(0);
            } else {
                setUltimaAltaSeleccionada(altaS_CORR); // alta seleccionada
                setAltaSeleccionada(index);            // índice de la fila
            }

            return nuevas;
        });
    };

    // Función al seleccionar/deseleccionar todas
    const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (comboUnidades.length === 0) obtenerUnidadesActions();
        if (datosFirmas.length === 0) obtenerfirmasAltasActions();


        // Validar que exista una fila seleccionada previamente
        if (!ultimaAltaSeleccionada) {
            Swal.fire({
                icon: "warning",
                title: "Primero seleccione una fila",
                text: "Debe seleccionar al menos una fila antes de usar 'Seleccionar todos'.",
                background: isDarkMode ? "#1e1e1e" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
                confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
                customClass: { popup: "custom-border" },
            });
            e.target.checked = false;
            return;
        }

        // Seleccionar todas las filas que coincidan con ultimaAltaSeleccionada
        const filasValidas: string[] = [];

        elementosActuales.forEach((elemento, index) => {
            if (elemento.altaS_CORR !== ultimaAltaSeleccionada) return;

            const registro = listaAltasRegistradas.find(f => f.altaS_CORR === elemento.altaS_CORR);
            const estado = registro?.estadO_FIRMA;

            if (estado === 0) {
                Swal.fire({
                    icon: "info",
                    title: "Solicitud en proceso",
                    text: "Algunos bienes no pudieron ser seleccionados porque tienen solicitudes pendientes.",
                    background: isDarkMode ? "#1e1e1e" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
                    customClass: { popup: "custom-border" },
                });
                return;
            }
            if (estado === 1) return; // ya firmadas
            if (estado !== 2 && estado !== 3) {
                filasValidas.push((indicePrimerElemento + index).toString());
            }
        });

        if (filasValidas.length > 0) {
            setFilasSeleccionadas(filasValidas);
            Swal.fire({
                icon: "info",
                title: "Altas seleccionadas",
                text: "Se han seleccionado todas filas correspondientes a las altas coincidentes de la página actual.",
                background: isDarkMode ? "#1e1e1e" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
                confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
                customClass: { popup: "custom-border" },
            });
            setSeleccionarTodosHabilitado(true);
        } else {
            e.target.checked = false;
        }

        // Si ya hay filas seleccionadas → deseleccionar todo y reiniciar el flujo
        // if (filasSeleccionadas.length > 0) {
        //     setFilasSeleccionadas([]);
        //     setUltimaAltaSeleccionada(null);
        //     setAltaSeleccionada(0);
        //     e.target.checked = false;
        //     return;
        // }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileInput = () => {
        inputRef.current?.click();
    };

    const handleChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const nuevosArchivos = Array.from(e.target.files);

            setAnexos((prev) => {
                const nombresPrevios = new Set(prev.map((file) => file.name));
                const archivosFiltrados = nuevosArchivos.filter((file) => !nombresPrevios.has(file.name));
                return [...prev, ...archivosFiltrados];
            });
        }
    };

    // const handleAnularSeleccionados = async () => {
    //     const selectedIndices = filasSeleccionadas.map(Number);
    //     const activosSeleccionados = selectedIndices.map((index) => {
    //         return {
    //             aF_CLAVE: listaAltasRegistradas[index].aF_CLAVE,
    //             USUARIO_MOD: objeto.IdCredencial,
    //             ESTABL_CORR: objeto.Roles[0].codigoEstablecimiento,
    //         };

    //     });
    //     const result = await Swal.fire({
    //         icon: "info",
    //         title: "Anular Altas",
    //         text: `Confirme para anular las altas seleccionadas`,
    //         showDenyButton: false,
    //         showCancelButton: true,
    //         confirmButtonText: "Confirmar y Anular",
    //         background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //         color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //         confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
    //         customClass: {
    //             popup: "custom-border", // Clase personalizada para el borde
    //         }
    //     });

    //     // selectedIndices.map(async (index) => {

    //     if (result.isConfirmed) {
    //         setLoadingAnular(true);
    //         // const elemento = listaAltas[index].aF_CLAVE;
    //         // console.log("despues del confirm elemento", elemento);

    //         // const clavesSeleccionadas: number[] = selectedIndices.map((index) => listaAltas[index].aF_CLAVE);
    //         // console.log("Claves seleccionadas para registrar:", clavesSeleccionadas);
    //         // Crear un array de objetos con aF_CLAVE y nombre


    //         // console.log("Activos seleccionados para registrar:", activosSeleccionados);

    //         const resultado = await anularAltasActions(activosSeleccionados);
    //         if (resultado) {
    //             document.body.style.overflow = "hidden"; // Evita que el fondo se desplace
    //             Swal.fire({
    //                 icon: "success",
    //                 title: "Altas anuladas",
    //                 text: `Se han anulado correctamente las altas seleccionadas`,
    //                 background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //                 color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //                 confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
    //                 customClass: {
    //                     popup: "custom-border", // Clase personalizada para el borde
    //                 }
    //             });

    //             setLoadingAnular(false);
    //             listaAltasRegistradasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
    //             setFilasSeleccionadas([]);
    //         } else {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: ":'(",
    //                 text: `Hubo un problema al anular las Altas.`,
    //                 background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //                 color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //                 confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
    //                 customClass: {
    //                     popup: "custom-border", // Clase personalizada para el borde
    //                 }
    //             });
    //             setLoadingAnular(false);
    //         }

    //     }
    //     // })
    // };

    // const setSeleccionaFila = (index: number) => {
    //     setMostrarModal(index); //Abre modal del indice seleccionado
    //     if (datosFirmas.length === 0) {obtenerfirmasAltasActions(); }
    //     if (comboUnidades.length === 0) {obtenerUnidadesActions(); }
    //     setFilasSeleccionadas(prev =>
    //         prev.includes(index.toString())
    //             ? prev.filter(rowIndex => rowIndex !== index.toString())
    //             : [...prev, index.toString()]
    //     );
    // };

    // const handleCerrarModal = (index: number) => {
    //     setFilasSeleccionadas((prevSeleccionadas) =>
    //         prevSeleccionadas.filter((fila) => fila !== index.toString())
    //     );
    // setMostrarModal(null); //Cierra modal del indice seleccionado   
    // setSignatureImage("");// Limpia la firma
    // };

    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaAltasRegistradas.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaAltasRegistradas, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Math.ceil(listaAltasRegistradas.length / elementosPorPagina);
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);


    const filasSeleccionables = elementosActuales
        .map((elemento, index) => {
            const altaS_CORR = elemento.altaS_CORR;
            const registro = listaAltasRegistradas.find((f) => f.altaS_CORR === altaS_CORR);
            const estado = registro?.estadO_FIRMA;
            if (estado === 0 || estado === 1 || estado === 2 || estado === 3) return null;
            return (indicePrimerElemento + index).toString();
        })
        .filter((x): x is string => x !== null);

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

    //Logica para habilitar Boton "Solicitar Visado" si los opcionales son habilitados se requerirá algun titular o subrogante
    const firmaInventarioSeleccionada = (() => {
        return AltaInventario.titularInventario || AltaInventario.subroganteInventario;
    })();

    const firmaFinanzasSeleccionada = (() => {
        return (AltaInventario.titularFinanzas || AltaInventario.subroganteFinanzas);
    })();

    const firmaUnidadSeleccionada = (() => {

        switch (Unidad) {
            case 3:
                return AltaInventario.titularAbastecimiento || AltaInventario.subroganteAbastecimiento;
            case 4:
                return AltaInventario.titularInformatica || AltaInventario.subroganteInformatica;
            case 5:
                return AltaInventario.titularCompra || AltaInventario.subroganteCompra;
            case 6:
                return AltaInventario.titularConvenio || AltaInventario.subroganteConvenio;
            case 7:
                return AltaInventario.titularRFisico || AltaInventario.subroganteRFisico;
            default:
                return false;
        }
    })();

    // BOTÓN SE HABILITA SOLO CUANDO TODOS LOS CHEQUEADOS SE CUMPLEN
    const botonHabilitado = AltaInventario.chkFinanzas === true ? firmaInventarioSeleccionada && firmaFinanzasSeleccionada :
        AltaInventario.chkUnidad === true ? firmaInventarioSeleccionada && firmaUnidadSeleccionada :
            AltaInventario.ajustarFirma === true ? firmaInventarioSeleccionada : false

    const totalSum = useMemo(() => {
        return filasSeleccionadasPDF.reduce((sum, activo) => sum + parseFloat(activo.deT_PRECIO.toString()), 0);
    }, [filasSeleccionadasPDF]);

    return (
        <Layout>
            <Helmet>
                <title>Firmar Altas</title>
            </Helmet>
            <MenuAltas />
            <div className="table-responsive position-relative z-0 -hide-scrollbar" >
                <div style={{ maxHeight: "80vh" }}>
                    <div className={`border border-botom p-2 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                        <h3 className="form-title fw-semibold border-bottom p-1">Firmar Altas</h3>
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
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleBuscar(e);
                                                    }
                                                }}
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
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleBuscar(e);
                                                    }
                                                }}
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
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleBuscar(e);
                                                }
                                            }}
                                            maxLength={12}
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
                                            maxLength={12}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleBuscar(e);
                                                }
                                            }}
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
                        <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                            {/* Tamaño de página */}
                            <Col xs={12} lg="auto">
                                {listaAltasRegistradas.length > 10 && (
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
                                            {[10, 15, 20, 25, 50, 100, 200].map((val) => (
                                                <option key={val} value={val}>
                                                    {val}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </Col>

                            {/* Exportar*/}
                            {filasSeleccionadas.length > 0 ? (
                                <Col xs={12} lg={4}>
                                    <>
                                        <div className="d-flex justify-content-center justify-content-lg-end w-100">
                                            <Button
                                                onClick={handleLimpiarFilasSeleccionadas}
                                                disabled={listaAltasRegistradas.length === 0}
                                                variant="warning"
                                                className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-sm-auto"
                                            >
                                                <XCircle
                                                    className="flex-shrink-0 h-5 w-5 mx-1 mb-1"
                                                    aria-hidden="true"
                                                />
                                                Deseleccionar todo
                                                <span className="badge bg-light text-muted mx-2">
                                                    {filasSeleccionadas.length}
                                                </span>
                                            </Button>

                                            <Button
                                                onClick={() => setMostrarModal(true)}
                                                disabled={listaAltasRegistradas.length === 0}
                                                variant={isDarkMode ? "secondary" : "primary"}
                                                className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-sm-auto"
                                            >
                                                <FiletypePdf
                                                    className="flex-shrink-0 h-5 w-5 mx-1 mb-1"
                                                    aria-hidden="true"
                                                />
                                                Exportar
                                                <span className="badge bg-light text-dark mx-2">
                                                    {filasSeleccionadas.length}
                                                </span>
                                            </Button>
                                        </div>
                                    </>

                                </Col>
                            ) : (
                                <Col xs={12} lg={2}>
                                    <div className="d-flex justify-content-center justify-content-lg-end w-100">
                                        <strong className="alert alert-dark border p-2 mb-2 mb-sm-0 mx-sm-0 w-100 w-lg-auto text-center ">
                                            No hay filas seleccionadas
                                        </strong>
                                    </div>
                                </Col>
                            )}

                        </Row>

                        {/* Tabla*/}
                        {loading ? (
                            <SkeletonLoader rowCount={elementosPorPagina} />
                        ) : (
                            <>
                                {listaAltasRegistradas.length > 0 ? (
                                    <>
                                        <div className='table-responsive'>
                                            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                                                <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
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
                                                                checked={
                                                                    filasSeleccionadas.length > 0 &&
                                                                    filasSeleccionadas.length === filasSeleccionables.length &&
                                                                    filasSeleccionables.every((f) => filasSeleccionadas.includes(f))
                                                                }
                                                                disabled={seleccionarTodosHabilitado}
                                                            />

                                                        </th>
                                                        <th scope="col" className="text-nowrap">Estado</th>
                                                        <th scope="col" className="text-nowrap">N° Inventario</th>
                                                        <th scope="col" className="text-nowrap">N° Alta</th>
                                                        <th scope="col" className="text-nowrap">Fecha Alta</th>
                                                        <th scope="col" className="text-nowrap">Nº Factura</th>
                                                        <th scope="col" className="text-nowrap">Orden de Compra</th>
                                                        <th scope="col" className="text-nowrap">Servicio</th>
                                                        <th scope="col" className="text-nowrap">Dependencia</th>
                                                        <th scope="col" className="text-nowrap">Especie</th>
                                                        <th scope="col" className="text-nowrap">N° Cuenta</th>
                                                        <th scope="col" className="text-nowrap">Usuario Crea</th>
                                                        <th scope="col" className="text-nowrap">Marca</th>
                                                        <th scope="col" className="text-nowrap">Modelo</th>
                                                        <th scope="col" className="text-nowrap">Serie</th>
                                                        <th scope="col" className="text-nowrap">Precio</th>
                                                        <th scope="col" className="text-nowrap">Nº Recepción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {elementosActuales.map((Lista, index) => {
                                                        const indexReal = indicePrimerElemento + index;
                                                        // const registro = listaEstadoFirmas.find((f) => f.altaS_CORR === Lista.altaS_CORR);
                                                        // const estado = registro?.estado;

                                                        // if (estado === 2 || estado === 3) {
                                                        //     // Omitir estas filas completamente
                                                        //     return;
                                                        // }

                                                        return (
                                                            <tr key={index}>
                                                                <td style={{
                                                                    position: 'sticky',
                                                                    left: 0
                                                                }}>
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        onChange={() => setSeleccionaFilas(indexReal, Lista.altaS_CORR)}
                                                                        checked={filasSeleccionadas.includes(indexReal.toString())}
                                                                    />
                                                                </td>

                                                                {/* <td className="text-nowrap">{
                                                estado === 0 ? <p className="badge bg-warning w-100">Pendiente</p>
                                                    : estado === 1 ? <p className="badge bg-success w-100">Firmada</p> : <p className="badge bg-primary w-100">Sin Firma</p>}
                                            </td> */}
                                                                <td className="text-nowrap">
                                                                    {Lista.estadO_FIRMA === 0 ? (
                                                                        <p className="badge bg-warning w-100">Pendiente</p>
                                                                    ) : Lista.estadO_FIRMA === 1 ? (
                                                                        <p className="badge bg-success w-100">Firmada</p>
                                                                    ) : Lista.estadO_FIRMA === 2 ? (
                                                                        <p className="badge bg-danger w-100">Rechazado</p>
                                                                    ) : Lista.estadO_FIRMA === 3 ? (
                                                                        <p className="badge bg-danger w-100">Rechazado</p>
                                                                    ) : (
                                                                        <p className="badge bg-primary w-100">Sin Firma</p>
                                                                    )}
                                                                </td>

                                                                <td className="text-nowrap">{Lista.aF_CODIGO_GENERICO}</td>
                                                                <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                                                <td className="text-nowrap">{Lista.fechA_ALTA}</td>
                                                                <td className="text-nowrap">{Lista.aF_NUM_FAC}</td>
                                                                <td className="text-nowrap">{Lista.aF_OCO_NUMERO_REF}</td>
                                                                <td className="text-nowrap">{Lista.serv}</td>
                                                                <td className="text-nowrap">{Lista.dep}</td>
                                                                <td className="text-nowrap">{Lista.esP_NOMBRE}</td>
                                                                <td className="text-nowrap">{Lista.ctA_COD}</td>
                                                                <td className="text-nowrap">{
                                                                    Lista.usuariO_CREA === '62511' ? 'Andy Riquelme' :
                                                                        Lista.usuariO_CREA === '18124' ? 'Rodrigo Toledo' :
                                                                            Lista.usuariO_CREA === 'JCASTILLO' || Lista.usuariO_CREA === 'jcastillo' || Lista.usuariO_CREA === '1770' ? 'Jaime Castillo' :
                                                                                Lista.usuariO_CREA === 'DROJASP' || Lista.usuariO_CREA === 'drojasp' || Lista.usuariO_CREA === '66098' ? 'Daniel Rojas' :
                                                                                    Lista.usuariO_CREA === '1234567' || Lista.usuariO_CREA === '18667' ? 'Felipe Almonte' :
                                                                                        Lista.usuariO_CREA === 'JVARGAS' || Lista.usuariO_CREA === 'jvargas' || Lista.usuariO_CREA === '6405' ? 'Jonathan Vargas' :
                                                                                            Lista.usuariO_CREA === 'GFARIAS' || Lista.usuariO_CREA === 'gfarias' || Lista.usuariO_CREA === '888' ? 'Gabriela Farias' :
                                                                                                Lista.usuariO_CREA === '61870' ? 'Elena Navarro' :
                                                                                                    Lista.usuariO_CREA === '68321' ? 'Ivan Acevedo' :
                                                                                                        Lista.usuariO_CREA === '67234' ? 'Ignacio Avilés' :
                                                                                                            Lista.usuariO_CREA === '6601' ? 'Benjamin Bulboa' :
                                                                                                                Lista.usuariO_CREA === '67404' ? 'Ademir Pindea' :
                                                                                                                    Lista.usuariO_CREA === '21479' ? 'Nelsn Quiroz' :
                                                                                                                        Lista.usuariO_CREA === '66098' ? 'Daniel Rojas' :
                                                                                                                            Lista.usuariO_CREA === 'KREYESD' || Lista.usuariO_CREA === 'kreyesd' || Lista.usuariO_CREA === '66099' ? 'Katherine Reyes' : Lista.usuariO_CREA


                                                                }</td>
                                                                <td className="text-nowrap">{Lista.deT_MARCA}</td>
                                                                <td className="text-nowrap">{Lista.deT_MODELO}</td>
                                                                <td className="text-nowrap">{Lista.deT_SERIE}</td>
                                                                {/* <td className="text-nowrap">{Lista.estado}</td> */}
                                                                <td className="text-nowrap">
                                                                    ${(Lista.deT_PRECIO ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                                                </td>
                                                                <td className="text-nowrap">{Lista.nrecep == "" || parseInt(Lista.nrecep) == 0 ? "S/n" : Lista.nrecep}</td>
                                                            </tr>
                                                        );
                                                    })}

                                                </tbody>
                                            </table>
                                        </div>
                                        {/* Paginador */}
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
                                    </>
                                ) : (
                                    <p className={`text-center  pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                                        No hay resultados para mostrar.
                                    </p>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
            {/*Modal Firma visadores */}
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="xl">
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Firmar Alta</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form >
                        <Row>
                            <Col md={2}>
                                <Form.Check
                                    onChange={handleCheck}
                                    name="ajustarFirma"
                                    type="checkbox"
                                    label="Ajustar firma"
                                    style={{ transform: 'scale(1)' }}
                                    className="form-switch mx-2 "
                                    checked={AltaInventario.ajustarFirma}
                                /></Col>
                        </Row>

                        <div className="d-flex justify-content-end">
                            <Button
                                onClick={handleSolicitarVisado}
                                variant={isDarkMode ? "secondary" : "primary"}
                                className="mx-1 mb-1 d-flex align-items-center gap-2"
                                disabled={!botonHabilitado || anexos.length > 2}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <FileSignatureIcon className="flex-shrink-0" width={18} height={18} aria-hidden="true" />
                                        <span>Solicitar visado</span>
                                    </>
                                )}
                            </Button>
                            {(objeto.Roles[0].codigoEstablecimiento == 2) &&
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="tooltip-adjuntar">Puede adjuntar hasta 2 documentos</Tooltip>}
                                >
                                    <span>
                                        <Button
                                            variant={isDarkMode ? "secondary" : "primary"}
                                            className="mx-1 mb-1 d-flex align-items-center gap-2"
                                            onClick={handleFileInput}
                                            disabled={anexos.length >= 2}
                                        >
                                            <Paperclip width={18} height={18} aria-hidden="true" />
                                            <span>Adjuntar documento</span>
                                        </Button>
                                    </span>
                                </OverlayTrigger>


                            }
                            <input
                                aria-label="file"
                                ref={inputRef}
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                style={{ display: "none" }}
                                className={anexos.length > 2 ? "disabled" : ""}
                                disabled={anexos.length > 2}
                                onChange={handleChangeFiles}
                            />
                        </div>

                        <Collapse in={isExpanded} dimension="height">
                            <Row className="m-1 p-3 rounded rounded-4 border">
                                <p className="border-bottom mb-2">Seleccione quienes firmarán el alta</p>

                                {/* Unidad Inventario */}
                                <Col md={4}>
                                    <p className="border-bottom fw-semibold text-center">Unidad Inventario</p>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.ajustarFirma}
                                            name="titularInventario"
                                            type="radio"
                                            checked={AltaInventario.titularInventario}
                                        />
                                        {nombreTitularInventario ? (
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id="tooltip-limpiar">{nombreTitularInventario || ""}</Tooltip>}
                                            >
                                                <label htmlFor="titularInventario" className="ms-2">Titular Inventario</label>
                                            </OverlayTrigger>
                                        ) : (
                                            <label htmlFor="titularInventario" className="ms-2">Titular Inventario</label>
                                        )}

                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.ajustarFirma}
                                            name="subroganteInventario"
                                            type="radio"
                                            checked={AltaInventario.subroganteInventario}
                                        />
                                        {nombreSubInventario ? (
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id="tooltip-limpiar">{nombreSubInventario}</Tooltip>}
                                            >
                                                <label htmlFor="subroganteInventario" className="ms-2">Subrogante Inventario</label>
                                            </OverlayTrigger>
                                        ) : (
                                            <label htmlFor="subroganteInventario" className="ms-2">Subrogante Inventario</label>
                                        )}
                                    </div>
                                </Col>

                                {/* Finanzas */}
                                <Col md={4}>
                                    <p className="border-bottom fw-semibold text-center">Departamento de Finanzas</p>
                                    <div className="d-flex">
                                        <label htmlFor="chkFinanzas" className="me-2">Opcional</label>
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.ajustarFirma}
                                            name="chkFinanzas"
                                            type="checkbox"
                                            className="form-switch"
                                            checked={AltaInventario.chkFinanzas}
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.chkFinanzas}
                                            name="titularFinanzas"
                                            type="radio"
                                            checked={AltaInventario.titularFinanzas}
                                        />
                                        {nombreTitularfinanzas ? (
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id="tooltip-limpiar">{nombreTitularfinanzas}</Tooltip>}
                                            >
                                                <label htmlFor="titularFinanzas" className="ms-2">Titular Finanzas</label>
                                            </OverlayTrigger>
                                        ) : (
                                            <label htmlFor="titularFinanzas" className="ms-2">Titular Finanzas</label>
                                        )}
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.chkFinanzas}
                                            name="subroganteFinanzas"
                                            type="radio"
                                            checked={AltaInventario.subroganteFinanzas}
                                        />
                                        {nombreSubFinanzas ? (
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id="tooltip-limpiar">{nombreSubFinanzas}</Tooltip>}
                                            >
                                                <label htmlFor="subroganteFinanzas" className="ms-2">Subrogante Finanzas</label>
                                            </OverlayTrigger>
                                        ) : (
                                            <label htmlFor="subroganteFinanzas" className="ms-2">Subrogante Finanzas</label>
                                        )}
                                    </div>
                                </Col>

                                {/* Unidades específicas */}
                                <Col md={4}>
                                    {objeto.Roles[0].codigoEstablecimiento == 1 ? (
                                        <>
                                            <p className="border-bottom fw-semibold text-center">Seleccione una Unidad</p>

                                            <div className="d-flex">
                                                <label htmlFor="chkUnidad" className="me-2">Opcional</label>
                                                <Form.Check
                                                    onChange={handleCheck}
                                                    disabled={!AltaInventario.ajustarFirma}
                                                    name="chkUnidad"
                                                    type="checkbox"
                                                    className="form-switch"
                                                    checked={AltaInventario.chkUnidad}
                                                />
                                            </div>

                                            <select
                                                aria-label="unidad"
                                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                name="unidad"
                                                onChange={handleChange}
                                                disabled={!AltaInventario.chkUnidad}
                                            >
                                                <option value="">Seleccionar</option>
                                                {comboUnidades.map((traeUnidades) => (
                                                    <option key={traeUnidades.iD_UNIDAD} value={traeUnidades.iD_UNIDAD}>
                                                        {traeUnidades.nombre}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Firmas según unidad */}
                                            {Unidad === 3 && (
                                                <>
                                                    <div className="d-flex mt-2">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="titularAbastecimiento"
                                                            type="radio"
                                                            checked={AltaInventario.titularAbastecimiento}
                                                        />
                                                        {nombreTitularAbastecimiento ? (
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={<Tooltip id="tooltip-limpiar">{nombreTitularAbastecimiento}</Tooltip>}
                                                            >
                                                                <label htmlFor="titularAbastecimiento" className="ms-2">Titular Abastecimiento</label>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <label htmlFor="titularAbastecimiento" className="ms-2">Titular Abastecimiento</label>
                                                        )}
                                                    </div>
                                                    <div className="d-flex">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="subroganteAbastecimiento"
                                                            type="radio"
                                                            checked={AltaInventario.subroganteAbastecimiento}
                                                        />
                                                        {nombreSubAbastecimiento ? (
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={<Tooltip id="tooltip-limpiar">{nombreSubAbastecimiento}</Tooltip>}
                                                            >
                                                                <label htmlFor="subroganteAbastecimiento" className="ms-2">Subrogante Abastecimiento</label>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <label htmlFor="subroganteAbastecimiento" className="ms-2">Subrogante Abastecimiento</label>
                                                        )}
                                                    </div>
                                                </>
                                            )}

                                            {Unidad === 4 && (
                                                <>
                                                    <div className="d-flex mt-2">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="titularInformatica"
                                                            type="radio"
                                                            checked={AltaInventario.titularInformatica}
                                                        />
                                                        {nombreTitularInformatica ? (
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={<Tooltip id="tooltip-limpiar">{nombreTitularInformatica}</Tooltip>}
                                                            >
                                                                <label htmlFor="titularInformatica" className="ms-2">Titular Informática</label>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <label htmlFor="titularInformatica" className="ms-2">Titular Informática</label>
                                                        )}

                                                    </div>
                                                    <div className="d-flex">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="subroganteInformatica"
                                                            type="radio"
                                                            checked={AltaInventario.subroganteInformatica}
                                                        />
                                                        {nombreSubInformatica ? (
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={<Tooltip id="tooltip-limpiar">{nombreSubInformatica}</Tooltip>}
                                                            >
                                                                <label htmlFor="subroganteInformatica" className="ms-2">Subrogante Informática</label>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <label htmlFor="subroganteInformatica" className="ms-2">Subrogante Informática</label>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            {Unidad === 5 && (
                                                <>
                                                    <div className="d-flex mt-2">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="titularCompra"
                                                            type="radio"
                                                            checked={AltaInventario.titularCompra}
                                                        />
                                                        {nombreTitularCompra ? (
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={<Tooltip id="tooltip-limpiar">{nombreTitularCompra}</Tooltip>}
                                                            >
                                                                <label htmlFor="titularCompra" className="ms-2">Titular Compra</label>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <label htmlFor="titularCompra" className="ms-2">Titular Compra</label>
                                                        )}

                                                    </div>
                                                    <div className="d-flex">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="subroganteCompra"
                                                            type="radio"
                                                            checked={AltaInventario.subroganteCompra}
                                                        />
                                                        {nombreSubCompra ? (
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={<Tooltip id="tooltip-limpiar">{nombreSubCompra}</Tooltip>}
                                                            >
                                                                <label htmlFor="subroganteCompra" className="ms-2">Subrogante Compra</label>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <label htmlFor="subroganteCompra" className="ms-2">Subrogante Compra</label>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            {Unidad === 6 && (
                                                <>
                                                    <div className="d-flex mt-2">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="titularConvenio"
                                                            type="radio"
                                                            checked={AltaInventario.titularConvenio}
                                                        />
                                                        {nombreTitularConvenio ? (
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={<Tooltip id="tooltip-limpiar">{nombreTitularConvenio}</Tooltip>}
                                                            >
                                                                <label htmlFor="titularConvenio" className="ms-2">Titular Convenio</label>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <label htmlFor="titularConvenio" className="ms-2">Titular Convenio</label>
                                                        )}
                                                    </div>
                                                    <div className="d-flex">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="subroganteConvenio"
                                                            type="radio"
                                                            checked={AltaInventario.subroganteConvenio}
                                                        />
                                                        {nombreSubConvenio ? (
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={<Tooltip id="tooltip-limpiar">{nombreSubConvenio}</Tooltip>}
                                                            >
                                                                <label htmlFor="subroganteConvenio" className="ms-2">Subrogante Convenio</label>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <label htmlFor="subroganteConvenio" className="ms-2">Subrogante Convenio</label>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            {Unidad === 7 && (
                                                <>
                                                    <div className="d-flex mt-2">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="titularRFisico"
                                                            type="radio"
                                                            checked={AltaInventario.titularRFisico}
                                                        />
                                                        {nombreTitularRFisico ? (
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={<Tooltip id="tooltip-limpiar">{nombreTitularRFisico}</Tooltip>}
                                                            >
                                                                <label htmlFor="titularRFisico" className="ms-2">Titular Recursos Fisicos</label>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <label htmlFor="titularRFisico" className="ms-2">Titular Recursos Fisicos</label>
                                                        )}
                                                    </div>
                                                    <div className="d-flex">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="subroganteRFisico"
                                                            type="radio"
                                                            checked={AltaInventario.subroganteRFisico}
                                                        />
                                                        {nombreSubRFisico ? (
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={<Tooltip id="tooltip-limpiar">{nombreSubRFisico}</Tooltip>}
                                                            >
                                                                <label htmlFor="subroganteRFisico" className="ms-2">Subrogante Recursos Fisicos</label>
                                                            </OverlayTrigger>
                                                        ) : (
                                                            <label htmlFor="subroganteRFisico" className="ms-2">Subrogante Recursos Fisicos</label>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {/* Vista para usuarios sin privilegios especiales */}
                                            <p className="border-bottom fw-semibold text-center">Unidad de Abastecimiento</p>
                                            <div className="d-flex">
                                                <label htmlFor="chkAbastecimiento" className="me-2">Opcional</label>
                                                <Form.Check
                                                    onChange={handleCheck}
                                                    disabled={!AltaInventario.ajustarFirma}
                                                    name="chkAbastecimiento"
                                                    type="radio"
                                                    className="form-switch"
                                                    checked={AltaInventario.chkAbastecimiento}
                                                />
                                            </div>
                                            <div className="d-flex">
                                                <Form.Check
                                                    onChange={handleCheck}
                                                    disabled={!AltaInventario.chkAbastecimiento}
                                                    name="titularAbastecimiento"
                                                    type="radio"
                                                    checked={AltaInventario.titularAbastecimiento}
                                                />
                                                {nombreTitularAbastecimiento ? (
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={<Tooltip id="tooltip-limpiar">{nombreTitularAbastecimiento}</Tooltip>}
                                                    >
                                                        <label htmlFor="titularAbastecimiento" className="ms-2">Titular Abastecimiento</label>
                                                    </OverlayTrigger>
                                                ) : (
                                                    <label htmlFor="titularAbastecimiento" className="ms-2">Titular Abastecimiento</label>
                                                )}
                                            </div>
                                            <div className="d-flex">
                                                <Form.Check
                                                    onChange={handleCheck}
                                                    disabled={!AltaInventario.chkAbastecimiento}
                                                    name="subroganteAbastecimiento"
                                                    type="radio"
                                                    checked={AltaInventario.subroganteAbastecimiento}
                                                />
                                                {nombreSubAbastecimiento ? (
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={<Tooltip id="tooltip-limpiar">{nombreSubAbastecimiento}</Tooltip>}
                                                    >
                                                        <label htmlFor="subroganteAbastecimiento" className="ms-2">Subrogante Abastecimiento</label>
                                                    </OverlayTrigger>
                                                ) : (
                                                    <label htmlFor="subroganteAbastecimiento" className="ms-2">Subrogante Abastecimiento</label>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </Col>
                            </Row>
                        </Collapse>
                        {anexos.length > 2 && (
                            <div className="w-100 text-end">
                                <span className="badge bg-danger p-2">
                                    Elimine algunos archivos.
                                </span>
                            </div>
                        )}

                        {anexos.length > 0 && (
                            <div className='table-responsive'>
                                <table className={`table ${isDarkMode ? "table-dark" : "table-hover"}`}>
                                    <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark "}`}>
                                        <tr>
                                            <th scope="col">Documentos adjuntos:</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {anexos.map((file, index) => (
                                            <tr key={index} >
                                                <td> {file.name}</td>
                                                <td className="text-end">
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="p-2  mx-2 rounded"
                                                        onClick={() => { setAnexos(prev => prev.filter((_, i) => i !== index)); }}
                                                    >
                                                        {" Eliminar "}
                                                        <Trash className={"flex-shrink-0 h-5 w-5  "} aria-hidden="true" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}


                        {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                        <BlobProvider document={
                            <DocumentoPDF
                                row={filasSeleccionadasPDF}
                                totalSum={totalSum}
                            // AltaInventario={AltaInventario}
                            // objeto={objeto}
                            // UnidadNombre={UnidadNombre}
                            // Unidad={Unidad}
                            // firmanteInventario={AltaInventario.firmanteInventario}
                            // firmanteFinanzas={AltaInventario.firmanteFinanzas}
                            // firmanteAbastecimiento={AltaInventario.firmanteAbastecimiento}
                            // visadoInventario={AltaInventario.visadoInventario}
                            // visadoFinanzas={AltaInventario.visadoFinanzas}
                            // visadoAbastecimiento={AltaInventario.visadoAbastecimiento}
                            />
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
                                    // <iframe
                                    //     src={url ? `${url}${isFirefox ? "" : "#toolbar=0&navpanes=0&scrollbar=1"}` : ''}
                                    //     title="Vista Previa del PDF"
                                    //     style={{
                                    //         width: "100%",
                                    //         height: "900px",
                                    //         border: "none",
                                    //         pointerEvents: isFirefox ? "none" : "auto", // Deshabilita interacciones en Firefox
                                    //     }}
                                    // ></iframe>

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
            </Modal >
            {
                loadingEnvio && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 1050,
                        }}
                    >
                        <div className="text-center">
                            <div className="spinner-border text-light mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
                            <p className="text-white fw-semibold mb-0">Enviando, un momento...</p>
                        </div>
                    </div>
                )
            }
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaAltasRegistradas: state.listaAltasRegistradasReducers.listaAltasRegistradas,
    listaEstadoFirmas: state.listaEstadoFirmasReducers.listaEstadoFirmas,
    objeto: state.validaApiLoginReducers,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboUnidades: state.obtenerUnidadesReducers.comboUnidades,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    idocumentoAlta: state.registrarDocumentoAltasReducers.idocumentoAlta //Pendiente
});


export default connect(mapStateToProps, {
    listaAltasRegistradasActions,
    registrarBienesBajasActions,
    obtenerfirmasAltasActions,
    obtenerUnidadesActions,
    registrarDocumentoAltaActions,
    // anularAltasActions,
    listaEstadoFirmasActions,
    listaEstadoActions,
    setSeguimientoFirmasActions
})(FirmarAltas);