import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Pagination, Modal, Col, Row, Button, Spinner, OverlayTrigger, Tooltip, Form, Collapse, CloseButton } from "react-bootstrap";
import { connect } from "react-redux";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { RootState } from "../../../store";
import MenuAltas from "../../Menus/MenuAltas";
import Layout from "../../../containers/hocs/layout/Layout";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../../Navegacion/Profile";
import { ArrowClockwise, CheckCircle, Eraser, Eye, Paperclip, Pencil, PencilFill, Search, Trash } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { listaEstadoActions } from "../../../redux/actions/Altas/EstadoFirmas/listaEstadoActions";
import { obtieneVisadoCompletoActions } from "../../../redux/actions/Altas/EstadoFirmas/obtieneVisadoCompletoActions";
import { listaEstadoVisadoresActions } from "../../../redux/actions/Altas/EstadoFirmas/listaEstadoVisadoresActions";
import { listaAltasRegistradasActions } from "../../../redux/actions/Altas/AnularAltas/listaAltasRegistradasActions";
import { FileSignatureIcon } from "lucide-react";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoPDF from "../FirmarAltas/DocumentoPDF";
import { obtenerfirmasAltasActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerfirmasAltasActions";
import { DatosFirmas, Unidades } from "../FirmarAltas/FirmarAltas";
import { pdf } from "@react-pdf/renderer";
import { registrarDocumentoAltaActions } from "../../../redux/actions/Altas/FirmarAltas/registrarDocumentoAltaActions";
import { modificarFormInventarioActions } from "../../../redux/actions/Inventario/ModificarInventario/modificarFormInventarioActions";
import ModificarInventario, { InventarioCompleto } from "../../Inventario/ModificarInventario";
import { rechazarAltaActions } from "../../../redux/actions/Altas/EstadoFirmas/rechazarAltaAcions";
import { limpiarDataActions } from "../../../redux/actions/Configuracion/limparDataActions";
import { obtenerUnidadesActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerUnidadesActions";

export interface ListaEstadoFirmas {
    idocumento: number;
    altaS_CORR: number;
    estado: number;
    fecha: string;
}

interface ListaEstadoVisadores {
    id: number;
    idcargo: number;
    nombrecargo: string;
    jerarquia: number;
    firmado: number;
    altaS_CORR: number;
    imovimiento: number;
    firmante: string;
    temails: string;
}

interface ListaAltas {
    aF_CLAVE: number,
    ninv: string,
    altaS_CORR: number,
    aF_NUM_FAC: string,
    aF_OCO_NUMERO_REF: string,
    serv: string,
    dep: string,
    esP_NOMBRE: string,
    ctA_COD: string,
    marca: string,
    deT_MODELO: string,
    deT_SERIE: string,
    estado: string,
    deT_PRECIO: string,
    fechA_ALTA: string,
    nrecep: string,
    estadO_FIRMA: number;
    idocumento: number;
    usuariO_CREA: string | number;
}
interface DatosBajas {
    listaEstado: ListaEstadoFirmas[];
    listaAltasRegistradas: ListaAltas[];
    listaAltasRegistradasActions: (fDesde: string, fHasta: string, establ_corr: number, altasCorr: number, af_codigo_generico: string) => Promise<boolean>;
    listaEstadoActions: (altasCorr: number, idDocumento: number, establ_corr: number) => Promise<boolean>;
    listaEstadoVisadoresActions: (altasCorr: number) => Promise<boolean>;
    obtieneVisadoCompletoActions: (idocumento: number) => Promise<boolean>;
    registrarDocumentoAltaActions: (documento: any) => Promise<boolean>;
    modificarFormInventarioActions: (activos: InventarioCompleto[]) => Promise<Boolean>;
    rechazarAltaActions: (documento: number) => Promise<boolean>;
    limpiarDataActions: () => Promise<boolean>;
    obtenerUnidadesActions: () => Promise<boolean>;
    obtenerfirmasAltasActions: () => Promise<boolean>;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
    documentoByte64: string;
    listaEstadoVisadores: ListaEstadoVisadores[];
    datosFirmas: DatosFirmas[];
    comboUnidades: Unidades[];
}

const EstadoFirmas: React.FC<DatosBajas> = ({ listaEstadoActions, obtieneVisadoCompletoActions, listaEstadoVisadoresActions, listaAltasRegistradasActions, registrarDocumentoAltaActions, modificarFormInventarioActions, rechazarAltaActions, limpiarDataActions, obtenerUnidadesActions, obtenerfirmasAltasActions, listaAltasRegistradas, listaEstadoVisadores, listaEstado, comboUnidades, token, isDarkMode, documentoByte64, objeto, datosFirmas }) => {
    const [loading, setLoading] = useState(false);
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [_, setLoadingSolicitarVisado] = useState(false);
    const [______, setLoadingEnvio] = useState(false);
    const [loadingModificar, setLoadingModificar] = useState(false);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalEstado, setMostrarModalEstado] = useState(false);
    const [mostrarModalVisadores, setMostrarModalVisadores] = useState(false);
    const [mostrarModalModificar, setMostrarModalModificar] = useState(false);

    const [paginaActual, setPaginaActual] = useState(1);
    const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
    const elementosPorPagina = Paginacion.nPaginacion;

    const [paginaActualModificar, setPaginaActualModificar] = useState(1);
    const [PaginacionModificar, setPaginacionModificar] = useState({ nPaginacionModificar: 10 });
    const elementosPorPaginaModificar = PaginacionModificar.nPaginacionModificar;

    const [__, setElementoSeleccionado] = useState<ListaEstadoFirmas[]>([]);
    const [___, setEditarCampo] = useState<string | null>(null);

    const [CuerpoDocumentoPDF, setCuerpoDocumentoPDF] = useState("");
    const [InventarioModificar, setInventarioModificar] = useState<any[]>([]);

    const [____, setIsDisabled] = useState(true); //Habilita los firmantes en cada check
    const [habilitarVisado, setHabilitarVisado] = useState(true); //Hasbilita botón solicitar visado
    const [habilitarModificar, setHabilitarModificar] = useState(true); //Hasbilita botón modificar en modal
    const [isExpanded, setIsExpanded] = useState(false); //expande el los visadores(ajustar visado)
    const [Unidad, setUnidad] = useState<number>(0);
    const [_____, setUnidadNombre] = useState<string>("");
    const filasSeleccionadasPDF = InventarioModificar;
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

    const [Buscar, setBuscar] = useState({
        altaS_CORR: 0,
        idDocumento: 0,
        CuerpoDocumento: ""
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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Solo permitir números
        if ((name === "altaS_CORR" || name === "idDocumento") && !/^[0-9]*$/.test(value)) {
            return; // Salir si contiene caracteres no numéricos
        }

        // Actualizar estado
        setBuscar((prevState) => ({
            ...prevState,
            [name]: value.replace(/^0+/, "")
        }));

        setPaginacion((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        setPaginacionModificar((prevState) => ({
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

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);

        resultado = await listaEstadoActions(Buscar.altaS_CORR, Buscar.idDocumento, objeto.Roles[0].codigoEstablecimiento);
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
            resultado = await listaEstadoActions(0, 0, objeto.Roles[0].codigoEstablecimiento);
            setLoading(false); //Finaliza estado de carga
        } else {
            paginar(1);
            setLoading(false); //Finaliza estado de carga
        }
    };

    const handleRefrescar = async () => {
        setLoadingRefresh(true); //Finaliza estado de carga
        const resultado = await listaEstadoActions(0, 0, objeto.Roles[0].codigoEstablecimiento);
        if (!resultado) {
            setLoadingRefresh(false);
        } else {
            paginar(1);
            setLoadingRefresh(false);
        }
    };

    const listaAuto = async () => {
        if (token) {
            if (listaEstado.length === 0) {
                setLoading(true);
                const resultado = await listaEstadoActions(0, 0, objeto.Roles[0].codigoEstablecimiento);
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
        // Solo copia cuando el modal está abierto y hay datos nuevos
        if (mostrarModalModificar && listaAltasRegistradas.length > 0) {
            setInventarioModificar(
                listaAltasRegistradas.map(item => ({ ...item }))
            );
            setLoadingModificar(false);
        }
        listaAuto();
        if (!documentoByte64) return;
        const tipo = detectarTipo(documentoByte64);
        const visadoBase64 = `data:application/${tipo};base64,${documentoByte64}`;
        setCuerpoDocumentoPDF(visadoBase64);

    }, [
        mostrarModalModificar,
        documentoByte64,
        listaEstado.length,
        listaEstadoVisadores.length,
        listaAltasRegistradas // <-- solo escucha cambios en estos
    ]);

    const handleLimpiar = () => {
        setBuscar((prevInventario) => ({
            ...prevInventario,
            altaS_CORR: 0,
            idDocumento: 0,
        }));
    };

    function detectarTipo(base64: string): string {
        if (base64.startsWith("JVBERi0")) return "pdf";
        if (base64.startsWith("/9j/")) return "jpeg";
        if (base64.startsWith("iVBOR")) return "png";
        if (base64.startsWith("R0lGOD")) return "gif";
        return "png"; // fallback
    };

    const handleObtenerVisado = useCallback((index: number, idocumento: number) => {
        setMostrarModal(true);
        setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));
        obtieneVisadoCompletoActions(idocumento); // solo dispara la acción
    }, []);

    const handleObtenerEstadoVisadores = useCallback((index: number, altaS_CORR: number) => {
        setMostrarModalEstado(true);
        setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));
        listaEstadoVisadoresActions(altaS_CORR);
    }, []);

    const handleBlur = () => {
        setEditarCampo(null);
    };

    // const handleCambiaNCuenta = (indexVisible: number, nuevaCuenta: string) => {
    //     const indexReal = indicePrimerElementoModificar + indexVisible;
    //     setInventarioModificar(prev =>
    //         prev.map((item, i) =>
    //             i === indexReal ? { ...item, ctA_COD: nuevaCuenta } : item
    //         )
    //     );
    // };

    const handleCambiaMarca = (indexVisible: number, nuevaMarca: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, deT_MARCA: nuevaMarca } : item
            )
        );
        setHabilitarModificar(false);
    };

    const handleCambiaModelo = (indexVisible: number, nuevaModelo: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, deT_MODELO: nuevaModelo } : item
            )
        );
        setHabilitarModificar(false);
    };

    const handleCambiaSerie = (indexVisible: number, nuevaSerie: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, deT_SERIE: nuevaSerie } : item
            )
        );
        setHabilitarModificar(false);
    };

    const handleCambiaPrecio = (indexVisible: number, nuevaPrecio: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, deT_PRECIO: nuevaPrecio } : item
            )
        );
        setHabilitarModificar(false);
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

    // const hoy = new Date();
    // const fechaHoy = [
    //     hoy.getFullYear(),
    //     String(hoy.getMonth() + 1).padStart(2, "0"),
    //     String(hoy.getDate()).padStart(2, "0")
    // ].join("-");

    const handleCheck = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        // Copia del estado actual
        const prev = structuredClone(AltaInventario);
        const updatedState = { ...prev, [name]: checked };
        //Limpia Todo al deshabilitar check
        if (name === "ajustarFirma") {
            if (datosFirmas.length === 0) obtenerfirmasAltasActions();
            if (comboUnidades.length === 0) obtenerUnidadesActions();
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

    const handleAbrirModalModificar = async (idocumento: number, altaS_CORR: number) => {
        setLoadingModificar(true);
        // Cargar datos auxiliares solo si están vacíos
        const result = await Swal.fire({
            icon: "warning",
            title: "Modificar",
            html: `Al confirmar la modificación del documento <b>Nº ${idocumento}</b> este quedará rechazado y se deberá iniciar un nuevo proceso de visado con la definición de los firmantes correspondientes. 
                   El número de alta <b>Nº ${altaS_CORR}</b> se mantendrá vigente.`,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Confirmar y Modificar",
            cancelButtonText: "Cerrar",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: {
                popup: "custom-border",
            }
        });
        if (result.isConfirmed) {
            rechazarAltaActions(idocumento);
            setMostrarModalModificar(true); // Solo abre el modal si confirma
            await listaAltasRegistradasActions("", "", objeto.Roles[0].codigoEstablecimiento, altaS_CORR, "");
            paginarModificar(1);
            setLoadingModificar(false); // Mejor desactivar en el useEffect cuando los datos llegan
        } else {
            setLoadingModificar(false);
        }
    };

    const handleCerrarModalModificar = () => {
        Swal.fire({
            icon: "info",
            title: '¿Está seguro que desea salir?',
            text: 'Para salir debe modificar los datos y volver a realizar la solicitud de visado.',
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Ok",
            cancelButtonText: "Cerrar",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,

            customClass: {
                popup: "custom-border", // Clase personalizada para el borde
            }
        })
    };

    const handleModificarSubmit = async () => {
        const result = await Swal.fire({
            icon: "info",
            title: "Confirmar Cambios",
            text: `Confirme para habilitar la solicitud de visado`,
            showCancelButton: true,
            confirmButtonText: "Confirmar y Continuar",
            background: isDarkMode ? "#1e1e1e" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: { popup: "custom-border" }
        });
        if (result.isConfirmed) {
            const ListaModificar = InventarioModificar.map(item => ({
                ...item,
                usuariO_MOD: objeto.IdCredencial.toString()
            }));

            const resultado = await modificarFormInventarioActions(ListaModificar);
            if (resultado) {
                Swal.fire({
                    icon: "success",
                    title: "Actualización exitosa",
                    text: "Se han actualizado los registros correctamente!",
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                    customClass: {
                        popup: "custom-border", // Clase personalizada para el borde
                    }
                });
                setMostrarModalVisadores(true);
                setHabilitarVisado(false);
                limpiarDataActions();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un error al actualizar el registro. Si el problema persiste, por favor contacte a la Unidad de Desarrollo para recibir asistencia.",
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                    customClass: {
                        popup: "custom-border", // Clase personalizada para el borde
                    }
                });
            }
        }
    };

    const handleSolicitarVisado = async () => {
        setLoadingSolicitarVisado(true);
        const result = await Swal.fire({
            icon: "info",
            title: "Solicitar Visado",
            text: `Confirme para enviar su solicitud`,
            showCancelButton: true,
            confirmButtonText: "Confirmar y Enviar",
            background: isDarkMode ? "#1e1e1e" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: { popup: "custom-border" }
        });

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

        const FirmaAlta = obtenerFirmasJerarquia().map(({ jerarquia, idcargo, correo }) => ({
            ALTAS_CORR: InventarioModificar[0]?.altaS_CORR,
            JERARQUIA: jerarquia,
            IDCARGO: idcargo,
            FIRMADO: 0,
            CORREO: correo
        }));

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



        if (result.isConfirmed) {
            console.log("documento", documento);
            setLoadingEnvio(true);
            setMostrarModalVisadores(false);
            const resultado = await registrarDocumentoAltaActions(documento);

            if (!resultado) {
                await Swal.fire({
                    icon: "warning",
                    title: "No se pudo enviar la solicitud",
                    text: "Por favor, intente nuevamente. Si el problema persiste, comuníquese con la Unidad de Desarrollo.",
                    background: isDarkMode ? "#1e1e1e" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                    customClass: { popup: "custom-border" }
                });
                setMostrarModalModificar(false);
                setLoadingEnvio(false);
            }
            else {
                await Swal.fire({
                    icon: "success",
                    title: "Solicitud enviada",
                    text: "Su solicitud de visado ha sido enviada con exito",
                    background: isDarkMode ? "#1e1e1e" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                    customClass: { popup: "custom-border" }
                });
                setMostrarModalModificar(false);
                setLoadingEnvio(false);
                // listaEstadoFirmasActions(0, 0, objeto.Roles[0].codigoEstablecimiento);
                // setFilasSeleccionadas([]);
                handleBuscar();
                setMostrarModalVisadores(false);
                setLoadingSolicitarVisado(false);
                // setAnexos([]);
            }
        }
    };

    const totalSum = useMemo(() => {
        return filasSeleccionadasPDF.reduce((sum, activo) => sum + parseFloat(activo.deT_PRECIO), 0);
    }, [filasSeleccionadasPDF]);

    const firmaFinanzasSeleccionada = (() => {
        if (!AltaInventario.chkFinanzas) return true;
        if (!AltaInventario.chkAbastecimiento) return true;
        return (
            (AltaInventario.titularInventario || AltaInventario.subroganteInventario) &&
            (AltaInventario.titularFinanzas || AltaInventario.subroganteFinanzas) &&
            (AltaInventario.titularAbastecimiento || AltaInventario.subroganteAbastecimiento)
        );
    })();

    const firmaUnidadSeleccionada = (() => {
        if (!AltaInventario.chkUnidad) return true;

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
    const botonHabilitado = (AltaInventario.chkFinanzas || AltaInventario.chkUnidad) && firmaFinanzasSeleccionada && firmaUnidadSeleccionada;

    //Listado estado visadores
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaEstado.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaEstado, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Math.ceil(listaEstado.length / elementosPorPagina);
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    //Listado modificar
    const indiceUltimoElementoModificar = paginaActualModificar * elementosPorPaginaModificar;
    const indicePrimerElementoModificar = indiceUltimoElementoModificar - elementosPorPaginaModificar;
    const elementosActualesModificar = useMemo(
        () => InventarioModificar.slice(indicePrimerElementoModificar, indiceUltimoElementoModificar),
        [InventarioModificar, indicePrimerElementoModificar, indiceUltimoElementoModificar]
    );
    const totalPaginasModificar = Math.ceil(InventarioModificar.length / elementosPorPaginaModificar);
    const paginarModificar = (numeroPaginaModificar: number) => setPaginaActualModificar(numeroPaginaModificar);

    return (
        <Layout>
            <Helmet>
                <title>Estado Firmas</title>
            </Helmet>
            <MenuAltas />
            <div className="table-responsive position-relative z-0 hide-scrollbar" >
                <div style={{ maxHeight: "80vh" }}>
                    <div className={`border border-botom p-2 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                        <h3 className="form-title fw-semibold border-bottom p-1">Estado Firmas</h3>
                        <Row className="border rounded p-2 m-2">
                            <Col lg={2} md={4}>
                                <div className="mb-2">
                                    <div className="mb-2">
                                        <label htmlFor="altaS_CORR" className="form-label fw-semibold small">Nº Alta</label>
                                        <input
                                            aria-label="altaS_CORR"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="altaS_CORR"
                                            placeholder="0"
                                            onChange={handleChange}
                                            maxLength={8}
                                            value={Buscar.altaS_CORR}
                                        />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <div className="mb-2">
                                        <label htmlFor="idDocumento" className="form-label fw-semibold small">Nº Documento</label>
                                        <input
                                            aria-label="idDocumento"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="idDocumento"
                                            placeholder="0"
                                            onChange={handleChange}
                                            maxLength={8}
                                            value={Buscar.idDocumento}
                                        />
                                    </div>
                                </div>
                            </Col>

                            {/* Columna 5: Botones de Acción */}
                            <Col lg={2} md={4}>
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
                                    <Button onClick={handleRefrescar}
                                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                                        className="w-100">
                                        {loadingRefresh ? (
                                            <>
                                                {" Refrescar "}
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
                                                {" Refrescar "}
                                                <ArrowClockwise className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
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
                        <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between mb-1">
                            {/* Tamaño de página */}
                            <Col xs={12} lg="auto">
                                {listaEstado.length > 10 && (
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
                        </Row>
                        {listaEstado.length > 0 ? (
                            <>
                                {/* Tabla*/}
                                {loading || loadingRefresh ? (
                                    <SkeletonLoader rowCount={elementosPorPagina} />
                                ) : (
                                    <div className="table-responsive">
                                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                                            <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                                                <tr>
                                                    <th scope="col" className="text-center">N° DOCUMENTO</th>
                                                    <th scope="col" className="text-center">Nº Alta</th>
                                                    <th scope="col" className="text-center">Estado Solicitud</th>
                                                    <th scope="col" className="text-center">Última Actualización</th>
                                                    <th scope="col" className="text-start">Acción</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {elementosActuales.map((Lista, index) => {
                                                    // const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                                    return (
                                                        <tr key={index}>
                                                            <td className="text-nowrap text-center">{Lista.idocumento}</td>
                                                            <td className="text-nowrap text-center">{Lista.altaS_CORR}</td>
                                                            <td className="text-center w-30">
                                                                <Button
                                                                    onClick={() => handleObtenerEstadoVisadores(index, Lista.altaS_CORR)}
                                                                    variant="light"
                                                                    size="sm"
                                                                    className={`rounded border-0 fw-semibold  
                                                                  ${Lista.estado === 0 ? "bg-warning text-white" :
                                                                            Lista.estado === 1 ? "bg-success text-white" :
                                                                                Lista.estado === 2 ? "bg-danger text-white" : "bg-secondary text-white"}`}
                                                                >
                                                                    {Lista.estado === 0 && "Enviada"}
                                                                    {Lista.estado === 1 && "Firmada"}
                                                                    {Lista.estado === 2 && "Rechazada"}
                                                                    <Eye className="mx-2" width={18} height={18} />
                                                                </Button>
                                                            </td>
                                                            <td className="text-center">{Lista.fecha === "0" ? "-" : Lista.fecha}</td>
                                                            <td
                                                                className="text-nowrap"
                                                                style={{
                                                                    position: 'sticky',
                                                                    left: 0,
                                                                }}>

                                                                {Lista.estado === 1 ? (
                                                                    <>
                                                                        <OverlayTrigger
                                                                            placement="right"
                                                                            overlay={<Tooltip id="tooltip-estado">Documento Firmado</Tooltip>}
                                                                        >
                                                                            <Button type="button" className="fw-semibold mx-1"
                                                                                onClick={() => handleObtenerVisado(index, Lista.idocumento)}
                                                                            >
                                                                                Ver
                                                                                < Eye className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                    </>
                                                                ) : (
                                                                    <Button type="button" className="fw-semibold mx-1" disabled>
                                                                        Ver
                                                                        < Eye className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                                                    </Button>
                                                                )}
                                                                {Lista.estado === 1 ? (
                                                                    <Button type="button" variant="secondary" className="fw-semibold mx-1"
                                                                        onClick={() => handleAbrirModalModificar(Lista.idocumento, Lista.altaS_CORR)}
                                                                    >
                                                                        Modificar
                                                                        <PencilFill className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                                                    </Button>
                                                                ) : (
                                                                    <Button type="button" variant="secondary" className="fw-semibold mx-1" disabled>
                                                                        Modificar
                                                                        < Eye className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                                                    </Button>
                                                                )}

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
                            </>
                        ) : (
                            <>
                                <p className={`text-center  pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                                    No hay resultados para mostrar.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/*Modal PDF */}
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="xl">
                <Modal.Header className={`modal-header text-white bg-success`} closeButton>
                    <Modal.Title className="fw-semibold">
                        <CheckCircle className={"flex-shrink-0 h-5 w-5 mx-2 mb-1"} aria-hidden="true" />Documento firmado
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form>
                        {CuerpoDocumentoPDF.includes("application/pdf") ? (
                            <iframe
                                src={CuerpoDocumentoPDF}
                                title="Vista Previa del PDF"
                                style={{
                                    width: "100%",
                                    height: "900px",
                                    border: "none"
                                }}
                            ></iframe>
                        ) : (
                            <img
                                src={CuerpoDocumentoPDF}
                                alt="Documento"
                                style={{
                                    width: "100%",
                                    maxHeight: "900px",
                                    objectFit: "contain"
                                }}
                            />
                        )}
                    </form>
                </Modal.Body>
            </Modal>
            {/*Modal Estado Visadores */}
            <Modal show={mostrarModalEstado} onHide={() => setMostrarModalEstado(false)} size="lg">
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title className="fw-semibold">Estado Visadores</Modal.Title>
                </Modal.Header>
                {/* <div className={` d-flex justify-content-end p-4 border-bottom ${isDarkMode ? "darkModePrincipal" : ""}`}>
                      <Button variant={`${isDarkMode ? "secondary" : "primary"}`} onClick={handleExportPDF}>
                        Exportar a PDF
                      </Button>
                    </div> */}
                <Modal.Body id="pdf-content" className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <div className="table-responsive">
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead>
                                <tr>
                                    <th className="text-nowrap">Nº Alta</th>
                                    <th className="text-nowrap">Firmante</th>
                                    <th className="text-nowrap">Cargo</th>
                                    <th className="text-nowrap">Correo</th>
                                    <th className="text-nowrap">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaEstadoVisadores.length ? (
                                    listaEstadoVisadores.map((item, index) => (
                                        <tr key={index}>

                                            <td>{item.altaS_CORR}</td>
                                            <td>{item.firmante}</td>
                                            <td>{item.nombrecargo}</td>
                                            <td>
                                                <a href={`mailto:${item.temails}`} className="text-blue-500 underline">
                                                    {item.temails}
                                                </a>
                                            </td>
                                            <td>{
                                                item.firmado === 0 ? <p className="badge bg-warning w-100">Pendiente</p>
                                                    : item.firmado === 1 ? <p className="badge bg-success w-100">Firmado</p>
                                                        : item.firmado === 2 ? <p className="badge bg-danger w-100">Rechazado</p>
                                                            : item.firmado === 3 ? <p className="badge bg-danger w-100">Rechazado</p> : <p className="fw-bold">-</p>
                                            }</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="text-center">No hay registros</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
            {/*Modal Modificar */}
            <Modal show={mostrarModalModificar} onHide={handleCerrarModalModificar}
                backdrop="static"
                keyboard={false}
                fullscreen style={{ top: "3%", width: '100%', maxWidth: "98%", left: "1%", borderRadius: "10px", maxHeight: "95vh" }}
            >
                <Modal.Header className={`bg-secondary`} style={{ paddingRight: "3%" }}>
                    <div className="d-flex justify-content-between w-100">
                        <Modal.Title className="fw-semibold text-white">
                            <Pencil className={"flex-shrink-0 h-5 w-5 mx-2 mb-1 "} aria-hidden="true" />Modificar
                        </Modal.Title>

                        <Button
                            variant="transparent"
                            className="border-0"
                            onClick={handleCerrarModalModificar}
                        >
                            <CloseButton
                                aria-hidden="true"
                                className={"flex-shrink-0 h-5 w-5"}
                            />
                        </Button>
                    </div>
                </Modal.Header>
                <Modal.Body className={`me-5 p-4 ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <p className={` text-start  p-2 m-2 rounded border-0 fs-09em fw-semibold bg-warning-subtle text-muted border`} >
                        El documento número <b>{InventarioModificar[0]?.idocumento ?? "-"}</b> ha sido rechazado.
                    </p>
                    {/* Botón o mensaje */}

                    {loadingModificar ? (
                        <SkeletonLoader rowCount={elementosPorPagina} />
                    ) : (
                        <>
                            <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                                <Col xs={12} lg="auto">
                                    {listaAltasRegistradas.length > 10 && (
                                        <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                                            <label htmlFor="nPaginacionModificar" className="form-label fw-semibold mb-0 me-2">
                                                Tamaño de página:
                                            </label>
                                            <select
                                                aria-label="Seleccionar tamaño de página"
                                                className={`form-select form-select-sm w-auto rounded-1 ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                name="nPaginacionModificar"
                                                onChange={handleChange}
                                                value={PaginacionModificar.nPaginacionModificar}
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
                                <Col xs={12} lg={3}>
                                    <div className="d-flex justify-content-center justify-content-lg-end w-100">
                                        <Button
                                            variant="secondary"
                                            className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-sm-auto"
                                            onClick={handleModificarSubmit}
                                            disabled={habilitarModificar}
                                        >
                                            {loadingModificar ? (
                                                <>
                                                    Modificar
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
                                                    Modificar
                                                    <span className="badge bg-light text-dark mx-1 mt-1">
                                                        {ModificarInventario.length}
                                                    </span>
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            onClick={() => setMostrarModalVisadores(true)}
                                            disabled={habilitarVisado}
                                            variant={isDarkMode ? "secondary" : "primary"}
                                            className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-sm-auto"
                                        >
                                            Solicitar Visado
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <div className="table-responsive">
                                <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-nowrap">N° Inventario</th>
                                            <th scope="col" className="text-nowrap">N° Alta</th>
                                            <th scope="col" className="text-nowrap">Fecha Alta</th>
                                            <th scope="col" className="text-nowrap">Nº Factura</th>
                                            <th scope="col" className="text-nowrap">Orden de Compra</th>
                                            <th scope="col" className="text-nowrap">Servicio</th>
                                            <th scope="col" className="text-nowrap">Dependencia</th>
                                            <th scope="col" className="text-nowrap">Especie</th>
                                            <th scope="col" className="text-nowrap">N° Cuenta</th>
                                            <th scope="col" className="text-nowrap">Marca</th>
                                            <th scope="col" className="text-nowrap">Modelo</th>
                                            <th scope="col" className="text-nowrap">Serie</th>
                                            <th scope="col" className="text-nowrap">Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elementosActualesModificar.map((Lista, index) => {
                                            const indexReal = indicePrimerElementoModificar + index;
                                            return (
                                                <tr key={index}>
                                                    <td className="text-nowrap">{Lista.aF_CODIGO_GENERICO}</td>
                                                    <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                                    <td className="text-nowrap">{Lista.fechA_ALTA}</td>
                                                    <td className="text-nowrap">{Lista.aF_NUM_FAC}</td>
                                                    <td className="text-nowrap">{Lista.aF_OCO_NUMERO_REF}</td>
                                                    <td className="text-nowrap">{Lista.serv}</td>
                                                    <td className="text-nowrap">{Lista.dep}</td>
                                                    <td className="text-nowrap">{Lista.esP_NOMBRE}</td>
                                                    <td className="text-nowrap">{Lista.ctA_COD}</td>

                                                    <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                        <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                            <Form.Control
                                                                type="text"
                                                                value={Lista.deT_MARCA}
                                                                onChange={(e) => handleCambiaMarca(index, e.target.value)}
                                                                onBlur={handleBlur}
                                                                autoFocus
                                                                maxLength={50}
                                                                placeholder="-"
                                                                pattern="\d*"
                                                                data-index={indexReal}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                        <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                            <Form.Control
                                                                type="text"
                                                                value={Lista.deT_MODELO}
                                                                onChange={(e) => handleCambiaModelo(index, e.target.value)}
                                                                onBlur={handleBlur}
                                                                autoFocus
                                                                maxLength={50}
                                                                placeholder="-"
                                                                pattern="\d*"
                                                                data-index={indexReal}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                        <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                            <Form.Control
                                                                type="text"
                                                                value={Lista.deT_SERIE}
                                                                onChange={(e) => handleCambiaSerie(index, e.target.value)}
                                                                onBlur={handleBlur}
                                                                autoFocus
                                                                maxLength={20}
                                                                placeholder="-"
                                                                pattern="\d*"
                                                                data-index={indexReal}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                        <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                            <Form.Control
                                                                type="text"
                                                                value={Lista.deT_PRECIO}
                                                                onChange={(e) => handleCambiaPrecio(index, e.target.value)}
                                                                onBlur={handleBlur}
                                                                autoFocus
                                                                maxLength={20}
                                                                placeholder="-"
                                                                pattern="\d*"
                                                                data-index={indexReal}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div className="paginador-container position-relative z-0">
                                    <Pagination className="paginador-scroll">
                                        <Pagination.First onClick={() => paginarModificar(1)} disabled={paginaActualModificar === 1} />
                                        <Pagination.Prev onClick={() => paginarModificar(paginaActualModificar - 1)} disabled={paginaActualModificar === 1} />
                                        {Array.from({ length: totalPaginasModificar }, (_, i) => (
                                            <Pagination.Item
                                                key={i + 1}
                                                active={i + 1 === paginaActualModificar}
                                                onClick={() => paginarModificar(i + 1)}
                                            >
                                                {i + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next onClick={() => paginarModificar(paginaActualModificar + 1)} disabled={paginaActualModificar === totalPaginasModificar} />
                                        <Pagination.Last onClick={() => paginarModificar(totalPaginasModificar)} disabled={paginaActualModificar === totalPaginasModificar} />
                                    </Pagination>
                                </div>
                            </div>
                        </>
                    )
                    }
                </Modal.Body>
            </Modal >

            {/*Modal Firma visadores */}
            <Modal show={mostrarModalVisadores} onHide={() => setMostrarModalVisadores(false)} dialogClassName="modal-right" size="xl">
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
                            {(objeto.IdCredencial === 18667 || objeto.IdCredencial === 66099 || objeto.IdCredencial === 66098 || objeto.IdCredencial === 62511) &&
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
                        {/*Seleccion de visadores */}
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
                                            type="checkbox"
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
                                            type="checkbox"
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
                                            type="checkbox"
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
                                            type="checkbox"
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
                                    {objeto.IdCredencial === 888 || objeto.IdCredencial === 62511 || objeto.IdCredencial === 6405 ? (
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
                                                            type="checkbox"
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
                                                            type="checkbox"
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
                                                            type="checkbox"
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
                                                            type="checkbox"
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
                                                            type="checkbox"
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
                                                            type="checkbox"
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
                                                            type="checkbox"
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
                                                            type="checkbox"
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
                                                            type="checkbox"
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
                                                            type="checkbox"
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
                                                    type="checkbox"
                                                    className="form-switch"
                                                    checked={AltaInventario.chkAbastecimiento}
                                                />
                                            </div>
                                            <div className="d-flex">
                                                <Form.Check
                                                    onChange={handleCheck}
                                                    disabled={!AltaInventario.chkAbastecimiento}
                                                    name="titularAbastecimiento"
                                                    type="checkbox"
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
                                                    type="checkbox"
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
                        <h6 className="fw-semibold p-2">Documentos Adjuntos:</h6>

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
                                            <th scope="col">Documento</th>
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
                                )
                            }
                        </BlobProvider>
                    </form>
                </Modal.Body>
            </Modal >

        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaAltasRegistradas: state.listaAltasRegistradasReducers.listaAltasRegistradas,
    listaEstado: state.listaEstadoReducers.listaEstado,
    listaEstadoVisadores: state.listaEstadoVisadoresReducers.listaEstadoVisadores,
    documentoByte64: state.obtieneVisadoCompletoReducers.documentoByte64,
    objeto: state.validaApiLoginReducers,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    comboUnidades: state.obtenerUnidadesReducers.comboUnidades,
});


export default connect(mapStateToProps, {
    listaAltasRegistradasActions,
    listaEstadoActions,
    obtieneVisadoCompletoActions,
    listaEstadoVisadoresActions,
    registrarDocumentoAltaActions,
    modificarFormInventarioActions,
    rechazarAltaActions,
    limpiarDataActions,
    obtenerfirmasAltasActions,
    obtenerUnidadesActions,
})(EstadoFirmas);

