import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Pagination, Modal, Col, Row, Button, Spinner, OverlayTrigger, Tooltip, Form, Collapse } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { AppDispatch, RootState } from "../../../store";
import MenuAltas from "../../Menus/MenuAltas";
import Layout from "../../../containers/hocs/layout/Layout";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../../Navegacion/Profile";
import { ArrowClockwise, Check2Circle, CheckCircle, Eraser, Eye, EyeSlash, FiletypePdf, InfoCircle, Paperclip, Pencil, PencilSquare, Search, Textarea, Trash } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import Select from "react-select";
import { pdf } from "@react-pdf/renderer";
import { DatosFirmas, Unidades } from "../FirmarAltas/FirmarAltas";
import { FileSignatureIcon } from "lucide-react";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoPDF from "../FirmarAltas/DocumentoPDF";
import ModificarInventario, { InventarioCompleto, SERVICIO_DEPENDENCIA } from "../../Inventario/ModificarInventario";
import { BIEN, CUENTA, DETALLE, ListaEspecie } from "../../Inventario/RegistrarInventario/DatosCuenta";
import { listaEstadoActions } from "../../../redux/actions/Altas/EstadoFirmas/listaEstadoActions";
import { obtieneVisadoCompletoActions } from "../../../redux/actions/Altas/EstadoFirmas/obtieneVisadoCompletoActions";
import { listaEstadoVisadoresActions, setSeguimientoFirmasActions } from "../../../redux/actions/Altas/EstadoFirmas/listaEstadoVisadoresActions";
import { listaAltasModificarActions } from "../../../redux/actions/Altas/AnularAltas/listaAltasModificarActions";
import { obtenerfirmasAltasActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerfirmasAltasActions";
import { registrarDocumentoAltaActions } from "../../../redux/actions/Altas/FirmarAltas/registrarDocumentoAltaActions";
import { modificarFormInventarioActions } from "../../../redux/actions/Inventario/ModificarInventario/modificarFormInventarioActions";
import { rechazarAltaActions } from "../../../redux/actions/Altas/EstadoFirmas/rechazarAltaAcions";
import { obtenerUnidadesActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerUnidadesActions";
import { listadoDeEspeciesBienActions } from "../../../redux/actions/Inventario/Combos/listadoDeEspeciesBienActions";
import { comboEspeciesBienActions } from "../../../redux/actions/Inventario/Combos/comboEspeciesBienActions";
import { comboDetalleActions } from "../../../redux/actions/Inventario/Combos/comboDetalleActions";
import { comboCuentaModificarActions } from "../../../redux/actions/Inventario/Combos/comboCuentaModificarActions";
import { comboSerDepActions } from "../../../redux/actions/Inventario/ModificarInventario/comboSerDepActions";
import { anularInventarioActions } from "../../../redux/actions/Inventario/AnularInventario/anularInventarioActions";
import { consultaFirmaVisadoresActions } from "../../../redux/actions/Altas/EstadoFirmas/consultaFirmaVisadoresActions";
import { TablaGenerica } from "../../Utils/TablaGenerica";
import { PageSizeSelector } from "../../Utils/PageSizeSelector";

export interface ListaEstadoFirmas {
    idocumento: number;
    altaS_CORR: number;
    estado: number;
    fecha: string;
}

export interface ListaEstadoVisadores {
    idocumento: number;
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
    aF_CODIGO_GENERICO: string,
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
    listaAltasModificar: ListaAltas[];
    listaEspecie: ListaEspecie[];
    comboBien: BIEN[];
    comboDetalle: DETALLE[];
    comboEspecies: ListaEspecie[];
    comboCuenta: CUENTA[];
    comboSerDep: SERVICIO_DEPENDENCIA[];
    listaAltasModificarActions: (fDesde: string, fHasta: string, af_codigo_generico: string, altasCorr: number, idocumento: number, establ_corr: number) => Promise<boolean>;
    listadoDeEspeciesBienActions: (establ_corr: number, IDBIEN: number, esP_CODIGO: string, esp_NOMBRE: string) => Promise<boolean>;
    listaEstadoActions: (altasCorr: number, idocumento: number, establ_corr: number, onSuccess?: (data: any[]) => void) => Promise<boolean>;
    listaEstadoVisadoresActions: (idocumento: number) => Promise<Array<ListaEstadoVisadores> | null>;
    consultaFirmaVisadoresActions: (idocumento: number) => Promise<Array<ListaEstadoVisadores> | null>;
    obtieneVisadoCompletoActions: (idocumento: number) => Promise<boolean>;
    registrarDocumentoAltaActions: (documento: any) => Promise<number | null>;
    modificarFormInventarioActions: (Inventario: InventarioCompleto[]) => Promise<{ success: boolean; error?: string }>;
    rechazarAltaActions: (documento: number) => Promise<boolean>;
    obtenerUnidadesActions: () => Promise<boolean>;
    obtenerfirmasAltasActions: () => Promise<boolean>;
    comboEspeciesBienActions: (EST: number, IDBIEN: number) => Promise<boolean>; //Carga Combo Especie
    comboDetalleActions: (bienSeleccionado: string) => void;
    comboCuentaModificarActions: (nombreEspecie: string) => Promise<boolean>;
    comboSerDepActions: (establ_corr: number) => void;
    anularInventarioActions: (aF_CLAVE: number) => Promise<boolean>;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
    documentoByte64: string;
    listaEstadoVisadores: ListaEstadoVisadores[];
    datosFirmas: DatosFirmas[];
    comboUnidades: Unidades[];
    dataSeguimientoEstadoFirma: any;
}

const EstadoFirmas: React.FC<DatosBajas> = ({ listaEstadoActions, obtieneVisadoCompletoActions, listaEstadoVisadoresActions, listaAltasModificarActions, registrarDocumentoAltaActions, modificarFormInventarioActions, rechazarAltaActions, obtenerUnidadesActions, obtenerfirmasAltasActions, listadoDeEspeciesBienActions, comboEspeciesBienActions, comboDetalleActions, comboCuentaModificarActions, comboSerDepActions, anularInventarioActions, consultaFirmaVisadoresActions, listaAltasModificar, listaEstadoVisadores, listaEstado, listaEspecie, comboBien, comboDetalle, comboEspecies, comboUnidades, comboCuenta, comboSerDep, token, isDarkMode, documentoByte64, objeto, datosFirmas, dataSeguimientoEstadoFirma }) => {

    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [_, setLoadingSolicitarVisado] = useState(false);
    const [______, setLoadingEnvio] = useState(false);
    const [loadingModificar, setLoadingModificar] = useState(false);

    const [modalPdf, setModalPDF] = useState(false);
    const [mostrarModalEstado, setMostrarModalEstado] = useState(false);
    const [modalVisadores, setModalSolicitarVisadores] = useState(false);
    const [modalVisadoresClasico, setModalSolicitarVisadoresClasico] = useState(false);
    const [modalModificar, setModalModificar] = useState(false);
    const [modalModificarDetalles, setModalModificarDetalles] = useState(false);
    const [paginaActualModificar, setPaginaActualModificar] = useState(1);
    const [PaginacionModificar, setPaginacionModificar] = useState({ nPaginacionModificar: 10 });
    const elementosPorPaginaModificar = PaginacionModificar.nPaginacionModificar;

    const [paginaActualEspecies, setPaginaActualEspecies] = useState(1);
    const [PaginacionEspecies, setPaginacionEspecies] = useState({ nPaginacionEspecies: 10 });
    const elementosPorPaginaEspecies = PaginacionEspecies.nPaginacionEspecies;

    // const [elementoSeleccionadoVisado, setElementoSeleccionadoVisado] = useState<ListaEstadoFirmas[]>([]);
    const [___, setEditarCampo] = useState<string | null>(null);

    const [CuerpoDocumentoPDF, setCuerpoDocumentoPDF] = useState("");
    const [InventarioModificar, setInventarioModificar] = useState<any[]>([]);

    const [____, setIsDisabled] = useState(true); //Habilita los firmantes en cada check
    const [habilitarVisado, setHabilitarVisado] = useState(true); //Hasbilita botón solicitar visado
    const [habilitarModificar, setHabilitarModificar] = useState(true); //Hasbilita botón modificar en modal
    const [isExpanded, setIsExpanded] = useState(false); //expande el los visadores(ajustar visado)
    const [Unidad, setUnidad] = useState<number>(0);
    const [UnidadNombre, setUnidadNombre] = useState<string>("");
    const filasSeleccionadasPDF = InventarioModificar;
    const [anexos, setAnexos] = useState<File[]>([]);
    const [estadoRechazado, setEstadoRechazado] = useState(true);

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

    const [filasSeleccionadas, setFilasSeleccionadas] = useState<number[]>([]);
    const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaEspecie>();
    const [mostrarModalEspecie, setMostrarModalEspecie] = useState(false);
    const [loadingEspecie, setLoadingEspecie] = useState(false);
    const [indiceEditar, setIndiceEditar] = useState<number | null>(null);

    // Estados para ordenamiento
    const [sortColumn, setSortColumn] = useState<keyof ListaEstadoFirmas | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [paginaActual, setPaginaActual] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [Buscar, setBuscar] = useState({
        altaS_CORR: 0,
        idDocumento: 0,
        CuerpoDocumento: ""
    });

    //Estados de los firmantes
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
        visadoAbastecimiento: "",
        visadoCompra: "",
        visadoInformatica: "",
        visadoConvenio: "",
        visadoRFisico: ""
    });

    //Estado de la especie
    const [_______, setEspecies] = useState({
        estableEspecie: 0,
        codigoEspecie: "",
        nombreEspecie: "",
        descripcionEspecie: "",
    });

    const [BuscarEspecie, setBuscarEspecie] = useState({
        esP_CODIGO: "",
        esp_NOMBRE: ""
    });

    const servicioOptions = comboSerDep.map((item) => ({
        value: item.deP_CORR,
        label: item.descripcion,
    }));

    const [modalObservacion, setModalObservacion] = useState(false);
    const [observacionTemp, setObservacionTemp] = useState('');
    const [indiceObservacion, setIndiceObservacion] = useState<number | null>(null);
    // const handleServicioChange = (selectedOption: any) => {
    //     const value = selectedOption ? selectedOption.value : 0;
    //     setInventarioModificar((prevInventario) => ({ ...prevInventario, DEP_CORR: value }));
    // };

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

        setPaginacionModificar((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        setPaginacionEspecies((prevState) => ({
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

        if (name === "bien") {
            comboDetalleActions(value);
        }

        if (name === "detalles") {
            listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, parseInt(value), "", "");
        }
    };
    const handleBuscar = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
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
            setLoading(false); //Finaliza estado de carga
        } else {
            setLoading(false); //Finaliza estado de carga
        }
    };

    const handleRefrescar = async () => {
        setLoadingRefresh(true); //Finaliza estado de carga
        const resultado = await listaEstadoActions(0, 0, objeto.Roles[0].codigoEstablecimiento);
        if (!resultado) {
            setLoadingRefresh(false);
        } else {
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
    //actualzia a pagina actual
    useEffect(() => {
        setPaginaActual(1);
    }, [listaEstado]);
    // Efecto para cargar datos inciales combos en modificar inventario
    useEffect(() => {
        if (comboBien.length === 0) {
            comboDetalleActions("0");
        }

        if (comboEspecies.length === 0) {
            comboEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0);
        }

        if (comboCuenta.length === 0) {
            comboCuentaModificarActions("");
        }

        if (comboSerDep.length === 0) {
            comboSerDepActions(objeto.Roles[0].codigoEstablecimiento)
        }

        // if (BuscarEspecie.esP_CODIGO) {
        //     comboCuentaModificarActions("");
        //     comboCuentaModificarActions(BuscarEspecie.esP_CODIGO);
        //     setInventarioModificar((prevState) => ({
        //         ...prevState,
        //         CTA_COD: "",
        //     }));
        // }


        // Solo copia cuando el modal está abierto y hay datos nuevos
        if (modalModificar && listaAltasModificar.length > 0) {
            setInventarioModificar(
                listaAltasModificar.map(item => ({ ...item }))
            );
            setLoadingModificar(false);
        }
        else {
            setInventarioModificar([]);
        }

        listaAuto();
        if (!documentoByte64) return;
        const tipo = detectarTipo(documentoByte64);
        const visadoBase64 = `data:application/${tipo};base64,${documentoByte64}`;
        setCuerpoDocumentoPDF(visadoBase64);

    }, [
        modalModificar,
        documentoByte64,
        listaEstado.length,
        listaEstadoVisadores.length,
        listaAltasModificar // <-- solo escucha cambios en estos
    ]);

    // Efecto para el seguimiento automático del estado de firmas una vez se ha enviado a visar el documento
    useEffect(() => {

        if (!dataSeguimientoEstadoFirma?.idocumento) return;

        let interval: NodeJS.Timeout;
        let activo = true;

        const consultarEstado = async () => {
            if (!activo) return;

            const resultado = await consultaFirmaVisadoresActions(dataSeguimientoEstadoFirma.idocumento);

            if (!resultado || resultado.length === 0) {
                // console.log("Sin resultados aún");
                return; // espera al próximo tick (5s)
            }

            // Verifica que TODAS las jerarquías estén firmadas
            const todasFirmadas = resultado.every((f) => Number(f.firmado) === 1);

            if (todasFirmadas) {
                // console.log("Todas las firmas completadas");

                clearInterval(interval);

                // refresca listado general paraactualzar estados de firmas
                listaEstadoActions(0, 0, objeto.Roles[0].codigoEstablecimiento);

                // detiene el seguimiento
                dispatch(setSeguimientoFirmasActions(null));
            } else {
                // console.log("Firmas pendientes, se reintenta en 5s", resultado);
            }
        };

        // el intervalo SE CREA SOLO UNA VEZ
        interval = setInterval(consultarEstado, 5000);

        return () => {
            activo = false;
            clearInterval(interval);
        };
    }, [dataSeguimientoEstadoFirma?.idocumento]);


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

    const handleObtieneVisado = useCallback((idocumento: number) => {
        setModalPDF(true);
        // setElementoSeleccionadoVisado((prev) => prev.filter((_, i) => i !== idocumento));
        obtieneVisadoCompletoActions(idocumento);
    }, []);

    const handleObtenerEstadoVisadores = useCallback(async (idocumento: number) => {
        try {
            // Llamar a la accion y esperar el resultado
            const resultado = await listaEstadoVisadoresActions(idocumento);

            // Si hay datos, mostrar el modal
            if (resultado && resultado.length > 0) {
                setMostrarModalEstado(true);
            } else {
                Swal.fire({
                    icon: "info",
                    title: "No disponible",
                    text: "El detalle de los visadores no está disponible, ya que esta alta fue gestionada desde el sistema de inventario anterior.",
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                });
            }
        } catch (error) {
            console.error("Error al obtener estado de visadores:", error);
        }
    }, [listaEstadoVisadoresActions, isDarkMode]);

    const handleBlur = () => {
        setEditarCampo(null);
    };

    const handleCambiaNumFac = (indexVisible: number, nuevaNumFac: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, aF_NUM_FAC: nuevaNumFac } : item
            )
        );
        setHabilitarModificar(false);
    };

    const handleCambiaServicioDependencia = (indexVisible: number, selectedOption: any) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, deP_CORR: selectedOption } : item
            )
        );
        setHabilitarModificar(false);
    };

    const handleCambiaOCO = (indexVisible: number, nuevaOco: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, aF_OCO_NUMERO_REF: nuevaOco } : item
            )
        );
        setHabilitarModificar(false);
    };

    const handleCambiaEspecie = (indexVisible: number, nueveEspecie: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, esP_NOMBRE: nueveEspecie } : item
            )
        );
        setHabilitarModificar(false);
    };

    const handleCambiaCuenta = (indexVisible: number, nuevaCuenta: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, ctA_COD: nuevaCuenta } : item
            )
        );
        setHabilitarModificar(false);
    };

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

    const handleCambiaOBS = (indexVisible: number, nuevaObs: string) => {
        const indexReal = indicePrimerElementoModificar + indexVisible;
        setInventarioModificar(prev =>
            prev.map((item, i) =>
                i === indexReal ? { ...item, deT_OBS: nuevaObs } : item
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
                    visadoAbastecimiento: "",
                    visadoInformatica: "",
                    visadoCompra: "",
                    visadoConvenio: "",
                    visadoRFisico: ""
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
        let visadoCompra = prev.visadoCompra || "";
        let visadoInformatica = prev.visadoInformatica || "";
        let visadoConvenio = prev.visadoConvenio || "";
        let visadoRFisico = prev.visadoRFisico || "";


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
                if (name === "titularAbastecimiento" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteAbastecimiento = nombreCompleto;
                    visadoAbastecimiento = FIRMA;
                    updatedState.subroganteAbastecimiento = false;
                    setNombreTitularAbastecimiento(firma.nombre + " " + firma.apellidO_PATERNO);
                    setNombreSubAbastecimiento("");
                }
                if (name === "subroganteAbastecimiento" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
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

                    if (name === "titularAbastecimiento" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                        firmanteAbastecimiento = nombreCompleto;
                        visadoAbastecimiento = FIRMA;
                        updatedState.subroganteAbastecimiento = false;
                        setNombreTitularAbastecimiento(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreSubAbastecimiento("");
                    }
                    if (name === "subroganteAbastecimiento" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                        firmanteAbastecimiento = nombreCompleto;
                        visadoAbastecimiento = FIRMA;
                        updatedState.titularAbastecimiento = false;
                        setNombreSubAbastecimiento(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreTitularAbastecimiento("");
                    }
                }
                //Departamento de Informática
                if (firma.iD_UNIDAD === 4) {
                    if (name === "titularInformatica" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                        firmanteInformatica = nombreCompleto;
                        visadoInformatica = FIRMA;
                        updatedState.subroganteInformatica = false;
                        setNombreTitularInformatica(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreSubInformatica("");
                    }
                    if (name === "subroganteInformatica" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                        firmanteInformatica = nombreCompleto;
                        visadoInformatica = FIRMA;
                        updatedState.titularInformatica = false;
                        setNombreSubInformatica(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreTitularInformatica("");
                    }
                }
                //Departamento de Compra
                if (firma.iD_UNIDAD === 5) {
                    if (name === "titularCompra" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                        firmanteCompra = nombreCompleto;
                        visadoCompra = FIRMA;
                        updatedState.subroganteCompra = false;
                        setNombreTitularCompra(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreSubCompra("");
                    }
                    if (name === "subroganteCompra" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                        firmanteCompra = nombreCompleto;
                        visadoCompra = FIRMA;
                        updatedState.titularCompra = false;
                        setNombreSubCompra(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreTitularCompra("");
                    }
                }
                //Departamento de Convenio
                if (firma.iD_UNIDAD === 6) {
                    if (name === "titularConvenio" && checked && firma.rol === "TITULAR") {
                        firmanteConvenio = nombreCompleto;
                        visadoConvenio = FIRMA;
                        updatedState.subroganteConvenio = false;
                        setNombreTitularConvenio(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreSubConvenio("");
                    }
                    if (name === "subroganteConvenio" && checked && firma.rol === "SUBROGANTE") {
                        firmanteConvenio = nombreCompleto;
                        visadoConvenio = FIRMA;
                        updatedState.titularConvenio = false;
                        setNombreSubConvenio(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreTitularConvenio("");
                    }
                }
                //Departamento de Recursos Fisicos
                if (firma.iD_UNIDAD === 7) {
                    if (name === "titularRFisico" && checked && firma.rol === "TITULAR" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                        firmanteRFisico = nombreCompleto;
                        visadoRFisico = FIRMA;
                        updatedState.subroganteRFisico = false;
                        setNombreTitularRFisico(firma.nombre + " " + firma.apellidO_PATERNO);
                        setNombreSubRFisico("");
                    }
                    if (name === "subroganteRFisico" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                        firmanteRFisico = nombreCompleto;
                        visadoRFisico = FIRMA;
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
        updatedState.visadoInformatica = visadoInformatica;
        updatedState.visadoCompra = visadoCompra;
        updatedState.visadoConvenio = visadoConvenio;
        updatedState.visadoRFisico = visadoRFisico;

        setIsDisabled(false);
        setIsExpanded(true);
        setAltaInventario(updatedState);
    }, [AltaInventario, datosFirmas, objeto]);

    const handleModalModificar = async (altaS_CORR: number, idocumento: number) => {
        setModalModificar(true); //Abre modal modificar
        setLoadingModificar(true); //Carga skeletor tabla
        setHabilitarModificar(true); //deshabilita boton modificar
        setHabilitarVisado(true); //deshabilita boton visado
        setEstadoRechazado(false); //quita mensaje de rechazo idocumento
        await listaAltasModificarActions("", "", "", altaS_CORR, idocumento, objeto.Roles[0].codigoEstablecimiento) // Consulta data y en useEffect actualiza la tabla nueva
        paginarModificar(1); //muestra la primera pagina
        setLoadingModificar(false); //para la carga de Skeletor
    };
    const handleModalModificarDetalles = async (altaS_CORR: number, idocumento: number) => {
        setModalModificarDetalles(true); //Abre modal modificar
        setLoadingModificar(true); //Carga skeletor tabla
        setHabilitarModificar(true); //deshabilita boton modificar
        setHabilitarVisado(true); //deshabilita boton visado
        setEstadoRechazado(false); //quita mensaje de rechazo idocumento
        await listaAltasModificarActions("", "", "", altaS_CORR, idocumento, objeto.Roles[0].codigoEstablecimiento) // Consulta data y en useEffect actualiza la tabla nueva
        paginarModificar(1); //muestra la primera pagina
        setLoadingModificar(false); //para la carga de Skeletor
    };

    const handleCerrarModalModificar = () => {
        setModalModificar(false);
        setFilasSeleccionadas([]);
        setAltaInventario((prevInventario) => ({
            ...prevInventario,
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
            visadoAbastecimiento: "",
            visadoCompra: "",
            visadoInformatica: "",
            visadoConvenio: "",
            visadoRFisico: ""
        }));
    };

    const handleModificarSubmit = async () => {
        let mensajeHtml = "";
        if (InventarioModificar[0]?.estadO_FIRMA === 0 || InventarioModificar[0]?.estadO_FIRMA === 1) {
            mensajeHtml = `Al modificar el documento <b>Nº ${InventarioModificar[0]?.idocumento}</b>, este será <b>rechazado de forma automática</b>. Posteriormente, deberá reiniciar el proceso de visado correspondiente manteniendo el número de alta <b>Nº ${InventarioModificar[0]?.altaS_CORR}</b>.`;
        } else {
            mensajeHtml = `Confirme para modificar su documento actualmente rechazado.`;
        }

        const result = await Swal.fire({
            icon: "warning",
            title: "Modificar Documento",
            html: mensajeHtml,
            showCancelButton: true,
            confirmButtonText: "De acuerdo, continuar",
            background: isDarkMode ? "#1e1e1e" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: { popup: "custom-border" }
        });
        if (result.isConfirmed) {

            if (InventarioModificar[0]?.estadO_FIRMA === 0 || InventarioModificar[0]?.estadO_FIRMA === 1) {
                const resultadoRechazar = await rechazarAltaActions(InventarioModificar[0]?.idocumento);
                if (resultadoRechazar) {
                    setEstadoRechazado(true);
                }
            }

            const ListaModificar = InventarioModificar.map(item => ({
                ...item,
                usuariO_MOD: objeto.IdCredencial.toString()
            }));

            const resultadoModificar = await modificarFormInventarioActions(ListaModificar);
            if (resultadoModificar) {
                Swal.fire({
                    icon: "success",
                    title: "Modificación exitosa",
                    text: "Se han actualizado los registros correctamente.",
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                    customClass: {
                        popup: "custom-border", // Clase personalizada para el borde
                    }
                });
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

            setHabilitarVisado(false); //habilita boton de visado
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
                        AltaInventario={AltaInventario}
                        objeto={objeto}
                        UnidadNombre={UnidadNombre}
                        Unidad={Unidad}
                    // firmanteInventario={AltaInventario.firmanteInventario}
                    // firmanteFinanzas={AltaInventario.firmanteFinanzas}
                    // firmanteAbastecimiento={AltaInventario.firmanteAbastecimiento}
                    // visadoInventario={AltaInventario.visadoInventario}
                    // visadoFinanzas={AltaInventario.visadoFinanzas}
                    // visadoAbastecimiento={AltaInventario.visadoAbastecimiento}
                    // visadoInformatica={AltaInventario.visadoInformatica}
                    // visadoCompra={AltaInventario.visadoCompra}
                    // visadoConvenio={AltaInventario.visadoConvenio}
                    // visadoRfisico={AltaInventario.visadoRfisico}
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
                setLoadingEnvio(true);
                setModalSolicitarVisadores(false);
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
                    setModalModificar(false);
                    setLoadingEnvio(false);
                    setFilasSeleccionadas([]);
                    setModalPDF(false);
                    setLoadingSolicitarVisado(false);
                    setAnexos([]);

                }
                else {
                    await Swal.fire({
                        icon: "success",
                        title: "Solicitud enviada",
                        html: `La solicitud de visado fue enviada exitosamente con el número de documento <strong>${resultado}</strong>.<br> Puede realizar el seguimiento en el estado de firmas.`,
                        background: isDarkMode ? "#1e1e1e" : "#ffffff",
                        color: isDarkMode ? "#ffffff" : "#000000",
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: { popup: "custom-border" }
                    });
                    setModalModificar(false);
                    setLoadingEnvio(false);
                    // listaEstadoFirmasActions(0, 0, objeto.Roles[0].codigoEstablecimiento);
                    // setFilasSeleccionadas([]);      
                    setModalSolicitarVisadores(false);
                    setLoadingSolicitarVisado(false);
                    // setAnexos([]);
                }
            }
        }
    };
    const handleModalSolicitarVisadores = () => {

        setAltaInventario((prev) => ({
            ...prev,
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

        }))
        setModalSolicitarVisadores(true);
    };

    const handleModalSolicitarVisadoresClasico = () => {

        setAltaInventario((prev) => ({
            ...prev,
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

        }))
        setModalSolicitarVisadoresClasico(true);
    };

    {/*---------------------- Logica Especies--------------------*/ }

    const especieOptions = comboEspecies.map((item) => ({
        value: item.esP_CODIGO,
        label: item.nombrE_ESP,
    }));

    const handleSubmitSeleccionado = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (elementoSeleccionado && indiceEditar !== null) {
            const estableEspecie = elementoSeleccionado.estabL_CORR;
            const codigoEspecie = elementoSeleccionado.esP_CODIGO;
            const nombreEspecie = elementoSeleccionado.nombrE_ESP;
            const descripcionEspecie = `${codigoEspecie} | ${nombreEspecie}`;

            // Actualiza el estado de la especie global si lo necesitas
            setEspecies({
                estableEspecie,
                codigoEspecie,
                nombreEspecie,
                descripcionEspecie,
            });

            setInventarioModificar((prev) =>
                prev.map((item, i) =>
                    i === indiceEditar
                        ? { ...item, esP_NOMBRE: nombreEspecie, esP_CODIGO: codigoEspecie }
                        : item
                )
            );

            // Limpieza
            setFilasSeleccionadas([]);
            setMostrarModalEspecie(false);
            setIndiceEditar(null);
            setHabilitarModificar(false);
        }
    };

    //Selecciona fila del listado de especies
    const handleSeleccionFila = (index: number) => {
        const item = listaEspecie[index];
        setFilasSeleccionadas([index]);
        setElementoSeleccionado(item);
    };

    // Si selecciona desde el combo
    const handleComboEspecieChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : "";
        setBuscarEspecie((prev) => ({ ...prev, esP_CODIGO: value }));
    };

    // Si escribe a mano
    const handleInputEspecieChange = (input: string) => {
        setBuscarEspecie((prev) => ({ ...prev, esp_NOMBRE: input }));
        handleBuscarEspecie();
    };

    const handleBuscarEspecie = async () => {
        setLoadingEspecie(true);
        let resultado = false;
        if (BuscarEspecie.esP_CODIGO && BuscarEspecie.esP_CODIGO.includes("-")) {
            // Seleccionó del combo: usar código
            resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0, BuscarEspecie.esP_CODIGO, "");
            // } else if (Buscar.esp_NOMBRE && Buscar.esp_NOMBRE.trim() !== "") {
            //   // Escribió manualmente: usar nombre   
            //   resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0, "", Buscar.esp_NOMBRE);
        } else {
            resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0, "", BuscarEspecie.esp_NOMBRE);
            setLoadingEspecie(false);
            return;
        }
        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Especie no encontrada",
                text: "La especie consultado no ha sido encontrada",
                confirmButtonText: "Ok",
            });
            setLoadingEspecie(false); //Finaliza estado de carga
            return;
        } else {
            paginarEspecies(1);
            setLoadingEspecie(false); //Finaliza estado de carga
        }
        setLoadingEspecie(false);
    };

    const handleAnular = async () => {
        const seleccionados = InventarioModificar.filter(item =>
            filasSeleccionadas.includes(item.aF_CLAVE)
        );
        let mensajeHtml = "";
        if (InventarioModificar[0]?.estadO_FIRMA === 0 || InventarioModificar[0]?.estadO_FIRMA === 1) {
            mensajeHtml = `Al anular el documento <b>Nº ${InventarioModificar[0]?.idocumento}</b>, este será <b>rechazado de forma automática</b>. Posteriormente, deberá reiniciar el proceso de visado correspondiente manteniendo el número de alta <b>Nº ${InventarioModificar[0]?.altaS_CORR}</b>.`;
        } else {
            mensajeHtml = `Confirme para anular su documento actualmente rechazado.`;
        }
        const result = await Swal.fire({
            icon: "info",
            title: "Anular Registro",
            html: mensajeHtml,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Confirmar y Anular",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: {
                popup: "custom-border", // Clase personalizada para el borde
            }
        });

        if (result.isConfirmed) {
            //Aplica la misma logica que al modificar, en este caso si va a anular un documento este antes rechazará el documento
            if (InventarioModificar[0]?.estadO_FIRMA === 0 || InventarioModificar[0]?.estadO_FIRMA === 1) {
                const resultadoRechazar = await rechazarAltaActions(InventarioModificar[0]?.idocumento);
                if (resultadoRechazar) {
                    setEstadoRechazado(true);
                }
            }
            const FormularioBajas = seleccionados.map(item => ({
                aF_CLAVE: item.aF_CLAVE,
                altaS_CORR: item.altaS_CORR,
                idocumento: item.idocumento
            }));

            try {
                // Anular todos en serie
                for (const i of FormularioBajas) {
                    await anularInventarioActions(i.aF_CLAVE);
                    listaAltasModificarActions("", "", "", i.altaS_CORR, i.idocumento, objeto.Roles[0].codigoEstablecimiento);
                    setFilasSeleccionadas([]);
                    setHabilitarVisado(false);
                    handleRefrescar();
                }
                Swal.fire({
                    icon: "success",
                    title: "Registros anulados",
                    text: `Se han anulado ${FormularioBajas.length} registro(s).`,
                    background: isDarkMode ? "#1e1e1e" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
                    customClass: { popup: "custom-border" }
                });

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un problema al anular uno o más registros.",
                    background: isDarkMode ? "#1e1e1e" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
                    customClass: { popup: "custom-border" }
                });
            }
        };

    };

    const setSeleccionaFilas = (item: any) => {
        const clave = item.aF_CLAVE;

        setFilasSeleccionadas((prev) =>
            prev.includes(clave)
                ? prev.filter((id) => id !== clave)
                : [...prev, clave]
        );
    };

    const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setFilasSeleccionadas(
                elementosActualesModificar.map(item => item.aF_CLAVE)
            );
        } else {
            setFilasSeleccionadas([]);
        }
    };

    {/*---------------------- Fin Logica Especies--------------------*/ }
    const totalSum = useMemo(() => {
        return filasSeleccionadasPDF.reduce((sum, activo) => sum + parseFloat(activo.deT_PRECIO), 0);
    }, [filasSeleccionadasPDF]);

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

    //Listado estado visadores
    // PASO 1: Primero ordenamos TODOS los datos según la columna seleccionada
    const datosOrdenados = useMemo(() => {
        if (!sortColumn) return listaEstado;

        return [...listaEstado].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            // Manejar valores numéricos
            if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
                return sortDirection === 'asc'
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            }

            // Manejar valores de texto
            const aString = aValue?.toString() || '';
            const bString = bValue?.toString() || '';

            return sortDirection === 'asc'
                ? aString.localeCompare(bString)
                : bString.localeCompare(aString);
        });
    }, [listaEstado, sortColumn, sortDirection]);

    // PASO 3: Paginación (para la vista, NO para la exportación)
    const totalRegistros = listaEstado.length;
    const totalPaginas = Math.ceil(totalRegistros / pageSize);
    const indiceInicio = (paginaActual - 1) * pageSize;
    const indiceFin = indiceInicio + pageSize;

    // Para la vista usamos los datos ordenados pero paginados
    const elementosActuales = useMemo(() => {
        return datosOrdenados.slice(indiceInicio, indiceFin);
    }, [datosOrdenados, indiceInicio, indiceFin]);

    // Función para manejar el ordenamiento
    const handleSort = (column: keyof ListaEstadoFirmas, direction: 'asc' | 'desc') => {
        setSortColumn(column);
        setSortDirection(direction);
        // No reseteamos la selección al ordenar
    };

    const handleCerrarModalObservacion = () => {
        setModalObservacion(false);
        setObservacionTemp('');
        setIndiceObservacion(null);
    };

    const handleGuardarObservacion = () => {
        if (indiceObservacion !== null) {
            const indexVisible = indiceObservacion - indicePrimerElementoModificar;
            if (indexVisible >= 0 && indexVisible < elementosActualesModificar.length) {
                handleCambiaOBS(indexVisible, observacionTemp);
            }
            handleCerrarModalObservacion();
        }
    };

    //Listado modificar
    const indiceUltimoElementoModificar = paginaActualModificar * elementosPorPaginaModificar;
    const indicePrimerElementoModificar = indiceUltimoElementoModificar - elementosPorPaginaModificar;
    const elementosActualesModificar = useMemo(
        () => InventarioModificar.slice(indicePrimerElementoModificar, indiceUltimoElementoModificar),
        [InventarioModificar, indicePrimerElementoModificar, indiceUltimoElementoModificar]
    );
    const totalPaginasModificar = Math.ceil(InventarioModificar.length / elementosPorPaginaModificar);
    const paginarModificar = (numeroPaginaModificar: number) => setPaginaActualModificar(numeroPaginaModificar);

    //Listado especies
    const indiceUltimoElementoEspecies = paginaActualEspecies * elementosPorPaginaEspecies;
    const indicePrimerElementoEspecies = indiceUltimoElementoEspecies - elementosPorPaginaEspecies;
    const elementosActualesEspecies = useMemo(
        () => listaEspecie.slice(indicePrimerElementoEspecies, indiceUltimoElementoEspecies),
        [listaEspecie, indicePrimerElementoEspecies, indiceUltimoElementoEspecies]
    );
    const totalPaginasEspecies = Math.ceil(listaEspecie.length / elementosPorPaginaEspecies);
    const paginarEspecies = (numeroPaginaEspecies: number) => setPaginaActualEspecies(numeroPaginaEspecies);

    const columnas = [
        {
            key: 'idocumento' as keyof ListaEstadoFirmas,
            header: 'N° DOCUMENTO',
            className: 'text-center',
            cellClassName: 'text-nowrap text-center',
            render: (value: number, item: ListaEstadoFirmas) => (
                <>
                    <span>{value}</span> {/* Texto adicional para verificar */}
                    {item.idocumento === 441154 && (
                        <>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip id="tooltip-limpiar" className="tooltip-info">
                                        Registrado desde el Sistema de Inventario anterior
                                    </Tooltip>
                                }
                            >

                                <span className="fw-semibold text-info me-2">
                                    <InfoCircle className="flex-shrink-0" width={15} height={15} aria-hidden="true" />
                                </span>
                            </OverlayTrigger>
                        </>
                    )
                    }
                </>
            )

        },
        {
            key: 'altaS_CORR' as keyof ListaEstadoFirmas,
            header: 'Nº Alta',
            className: 'text-center',
            cellClassName: 'text-nowrap text-center'
        },
        {
            key: 'fecha' as keyof ListaEstadoFirmas,
            header: 'Última Actualización',
            className: 'text-center',
            cellClassName: 'text-center',
            render: (value: string) => value === "0" ? "-" : value
        },

        {
            key: 'estado' as keyof ListaEstadoFirmas,
            header: 'Estado Solicitud',
            className: 'text-center',
            cellClassName: 'text-center',
            render: (value: number, item: ListaEstadoFirmas) => {

                const esSistemaAntiguo = item.idocumento === 441154;

                const estadoTexto =
                    value === 0 ? "Enviada" :
                        value === 1 ? "Firmada" :
                            value === 2 ? "Rechazada" :
                                "Desconocido";

                const estadoColor =
                    value === 0 ? "bg-warning text-white" :
                        value === 1 ? "bg-success text-white" :
                            value === 2 ? "bg-danger text-white" :
                                "bg-secondary text-white";

                return (
                    <Button
                        onClick={() => handleObtenerEstadoVisadores(item.idocumento)}
                        variant="light"
                        size="sm"
                        className={`rounded border-0 fw-semibold col-12 col-lg-6 ${estadoColor}`}
                    >
                        {estadoTexto}

                        {esSistemaAntiguo ? (
                            <EyeSlash className="ms-2" width={18} height={18} />
                        ) : (
                            <Eye className="ms-2" width={18} height={18} />
                        )}

                    </Button>
                );
            }
        },
        {
            key: 'estado' as keyof ListaEstadoFirmas,
            header: 'Ver',
            className: 'text-center',
            cellClassName: 'text-center',
            disableSort: true,
            render: (_: number, item: ListaEstadoFirmas) => (
                <>
                    {item.idocumento !== 441154 && item.estado === 1 && (
                        <>
                            <Button
                                type="button"
                                variant="danger"
                                className="fw-semibold"
                                onClick={() => handleObtieneVisado(item.idocumento)}
                            >
                                <FiletypePdf
                                    className="flex-shrink-0"
                                    width={20}
                                    height={20}
                                    aria-hidden="true"
                                />
                            </Button>
                        </>
                    )}
                </>
            )
        },
        {
            key: 'accion' as keyof ListaEstadoFirmas,
            header: 'Modificar',
            className: 'text-start',
            cellClassName: 'text-nowrap',
            headerStyle: { position: 'sticky', left: 0, zIndex: 3 },
            cellStyle: { position: 'sticky', left: 0, zIndex: 1 },
            disableSort: true,
            render: (_: any, item: ListaEstadoFirmas) => (
                <>
                    <Button
                        type="button"
                        variant="secondary"
                        className="fw-semibold mx-1"
                        onClick={() => handleModalModificar(item.altaS_CORR, item.idocumento)}
                    >

                        <PencilSquare className="flex-shrink-0 h-5 w-5" width={20} height={20} aria-hidden="true" />
                    </Button>
                </>
            )
        }
    ];

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
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleBuscar(e);
                                                }
                                            }}
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
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleBuscar(e);
                                                }
                                            }}
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
                        {/* Controles de página y exportación */}
                        <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                            <Col xs={12} lg="auto">
                                {listaEstado.length > 10 && (
                                    <PageSizeSelector
                                        pageSize={pageSize}
                                        total={listaEstado.length}
                                        totalFiltrados={totalRegistros}
                                        onChange={(size) => setPageSize(size)}
                                        isDarkMode={isDarkMode}
                                    />
                                )}
                            </Col>
                        </Row>

                        {/* Tabla con selección */}
                        {loading ? (
                            <SkeletonLoader rowCount={10} />
                        ) : (
                            <TablaGenerica<ListaEstadoFirmas>
                                data={elementosActuales}
                                columns={columnas}
                                isDarkMode={isDarkMode}
                                onSortChange={handleSort}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                            />
                        )}

                        {/* Paginador */}
                        {totalPaginas > 1 && (
                            <div className="mt-3 paginador-scroll">
                                <ul className="pagination pagination-sm justify-content-center">
                                    <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPaginaActual(1)}
                                        >
                                            Primera
                                        </button>
                                    </li>
                                    <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPaginaActual(paginaActual - 1)}
                                        >
                                            Anterior
                                        </button>
                                    </li>

                                    {Array.from({ length: Math.min(20, totalPaginas) }, (_, i) => {
                                        let pageNum;
                                        if (totalPaginas <= 20) {
                                            pageNum = i + 1;
                                        } else if (paginaActual <= 3) {
                                            pageNum = i + 1;
                                        } else if (paginaActual >= totalPaginas - 2) {
                                            pageNum = totalPaginas - 19 + i;
                                        } else {
                                            pageNum = paginaActual - 2 + i;
                                        }

                                        return (
                                            <li
                                                key={pageNum}
                                                className={`page-item ${paginaActual === pageNum ? "active" : ""}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPaginaActual(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            </li>
                                        );
                                    })}

                                    <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPaginaActual(paginaActual + 1)}
                                        >
                                            Siguiente
                                        </button>
                                    </li>
                                    <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPaginaActual(totalPaginas)}
                                        >
                                            Última
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/*Modal PDF */}
            <Modal show={modalPdf} onHide={() => setModalPDF(false)} dialogClassName="modal-right" size="xl">
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
            {/*Modal Modificar */}
            <Modal show={modalModificar} onHide={(handleCerrarModalModificar)}
                backdrop="static"
                keyboard={false}
                fullscreen style={{ top: "3%", width: '100%', maxWidth: "98%", left: "1%", borderRadius: "10px", maxHeight: "95vh" }}
            >
                <Modal.Header className={`bg-secondary`} style={{ paddingRight: "3%" }} closeButton>
                    <Modal.Title className="fw-semibold text-white">
                        <Pencil className={"flex-shrink-0 h-5 w-5 mx-2 mb-1 "} aria-hidden="true" />Modificar
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={`me-5 p-4 ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    {estadoRechazado && (
                        <p className={` text-start  p-2 m-2 rounded border-0 fs-09em fw-semibold bg-warning-subtle text-muted border`} >
                            El documento número <b>{InventarioModificar[0]?.idocumento ?? "-"}</b> ha sido rechazado.
                        </p>
                    )}

                    {loadingModificar ? (
                        <SkeletonLoader rowCount={elementosPorPaginaModificar} />
                    ) : (
                        <>
                            <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-lg-end">
                                <Col xs={12} lg="auto">
                                    {listaAltasModificar.length > 10 && (
                                        <div className="d-flex align-items-center justify-content-center justify-content-lg-end">
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
                                <Col xs={12} lg="auto">
                                    <div className="d-flex justify-content-center justify-content-lg-end">
                                        {filasSeleccionadas.length > 0 ? (
                                            <Button
                                                variant="danger"
                                                onClick={handleAnular}
                                                className="p-2 d-flex align-items-center justify-content-center"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        Quitar
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
                                                        Quitar
                                                        <span className="badge bg-light text-dark ms-1">
                                                            {filasSeleccionadas.length}
                                                        </span>
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <strong className="alert alert-dark border p-2 mb-0 text-center">
                                                No hay filas seleccionadas
                                            </strong>
                                        )}
                                    </div>
                                </Col>
                                <Col xs={12} lg="auto">
                                    <div className="d-flex justify-content-center justify-content-lg-end gap-2">
                                        {listaAltasModificar[0]?.idocumento !== 441154 ? (
                                            <>
                                                <Button
                                                    variant="secondary"
                                                    className="p-2"
                                                    onClick={handleModificarSubmit}
                                                    disabled={habilitarModificar}
                                                >
                                                    {loadingModificar ? (
                                                        <>
                                                            Un Momento...
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
                                                            Confirmar Cambios
                                                            <span className="badge bg-light text-dark mx-1">
                                                                {ModificarInventario.length}
                                                            </span>
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={handleModalSolicitarVisadores}
                                                    variant={isDarkMode ? "secondary" : "primary"}
                                                    className="p-2"
                                                    disabled={habilitarVisado}
                                                >
                                                    Visar Documento
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                onClick={handleModalSolicitarVisadoresClasico}
                                                variant={isDarkMode ? "secondary" : "primary"}
                                                className="p-2"
                                            >
                                                Visar documento
                                                <span className="fw-semibold mx-1 badge bg-warning bg-opacity-75">
                                                    Clásico
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                </Col>

                            </Row>
                            <Row className="g-3 mb-2 mt-2">
                                {/* Tarjeta de Nº Documento */}
                                <Col md={3}>
                                    <div className={`border rounded p-3 ${isDarkMode ? "bg-secondary" : "bg-light"} position-relative`}>
                                        <small className="text-muted d-block mb-1">Nº Documento</small>
                                        <h5 className="mb-0 fw-bold d-flex align-items-center">
                                            {listaAltasModificar[0]?.idocumento ?? "-"}
                                        </h5>
                                    </div>
                                </Col>

                                {/* Tarjeta de Nº Alta */}
                                <Col md={3}>
                                    <div className={`border rounded p-3 ${isDarkMode ? "bg-secondary" : "bg-light"} `}>
                                        <small className="d-block mb-1">Nº Alta</small>
                                        <h5 className="mb-0 fw-bold">{listaAltasModificar[0]?.altaS_CORR ?? "-"}</h5>
                                    </div>
                                </Col>

                                {/* Tarjeta de Fecha Alta */}
                                <Col md={2}>
                                    <div className={`border rounded p-3 ${isDarkMode ? "bg-secondary" : "bg-light"} `}>
                                        <small className="d-block mb-1">Fecha Alta</small>
                                        <h5 className="mb-0 fw-bold">{listaAltasModificar[0]?.fechA_ALTA ?? "-"}</h5>
                                    </div>
                                </Col>
                                {/* Tarjeta de Monto Total */}
                                <Col md={2}>
                                    <div className={`border rounded p-3 ${isDarkMode ? "bg-secondary" : "bg-light"} `}>
                                        <small className="d-block mb-1">Total</small>
                                        <h5 className="mb-0 fw-bold">$ {(totalSum ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</h5>
                                    </div>
                                </Col>
                                {/* Tarjeta de Cantidad */}
                                <Col md={2}>
                                    <div className={`border rounded p-3 ${isDarkMode ? "bg-secondary" : "bg-light"} `}>
                                        <small className="d-block mb-1">Cantidad</small>
                                        <h5 className="mb-0 fw-bold">{listaAltasModificar.length}</h5>
                                    </div>
                                </Col>
                            </Row>
                            <div className="table-responsive">
                                <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                                    <thead>
                                        <tr>
                                            <th style={{
                                                position: 'sticky',
                                                left: 0
                                            }}>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={handleSeleccionaTodos}
                                                    checked={filasSeleccionadas.length === elementosActualesModificar.length && elementosActualesModificar.length > 0}
                                                />
                                            </th>
                                            <th scope="col" className="text-nowrap">Nº Inventario</th>
                                            <th scope="col" className="text-nowrap">Nº Factura</th>
                                            <th scope="col" className="text-nowrap">Servicio/Dependencia</th>
                                            <th scope="col" className="text-nowrap">Orden de Compra</th>
                                            <th scope="col" className="text-nowrap">Especie</th>
                                            <th scope="col" className="text-nowrap">N° Cuenta</th>
                                            <th scope="col" className="text-nowrap">Marca</th>
                                            <th scope="col" className="text-nowrap">Modelo</th>
                                            <th scope="col" className="text-nowrap">Serie</th>
                                            <th scope="col" className="text-nowrap">Precio</th>
                                            <th scope="col" className="text-nowrap">Observación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elementosActualesModificar.map((Lista, index) => {
                                            const indexReal = indicePrimerElementoModificar + index;
                                            return (
                                                <tr key={index}>
                                                    <td style={{
                                                        position: 'sticky',
                                                        left: 0
                                                    }}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={filasSeleccionadas.includes(Lista.aF_CLAVE)}
                                                            onChange={() => setSeleccionaFilas(Lista)}
                                                        />
                                                    </td>
                                                    <td className="text-nowrap" >{Lista.aF_CODIGO_GENERICO}</td>
                                                    <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                        <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                            <Form.Control
                                                                size="sm"
                                                                type="text"
                                                                value={Lista.aF_NUM_FAC}
                                                                onChange={(e) => handleCambiaNumFac(index, e.target.value)}
                                                                onBlur={handleBlur}
                                                                autoFocus
                                                                maxLength={50}
                                                                placeholder="-"
                                                                pattern="\d*"
                                                                data-index={indexReal}
                                                            />
                                                        </div>
                                                    </td>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip id={`tooltip-serv-${index}`}>{Lista.serv + " " + Lista.dep}</Tooltip>}
                                                    >
                                                        <td className="mb-1 position-relative z-1000" >
                                                            <Select
                                                                options={servicioOptions}
                                                                onChange={(option) => handleCambiaServicioDependencia(index, option ? option.value : 0)}
                                                                value={servicioOptions.find((option) => option.value === Lista.deP_CORR) || null}
                                                                onBlur={handleBlur}
                                                                className="form-select-container"
                                                                classNamePrefix="react-select"
                                                                data-index={indexReal}
                                                                autoFocus
                                                                isClearable
                                                                isSearchable
                                                                styles={{
                                                                    control: (baseStyles) => ({
                                                                        ...baseStyles,
                                                                        backgroundColor: isDarkMode ? "#212529" : "white",
                                                                        color: isDarkMode ? "white" : "#dc3545",
                                                                        borderColor: isDarkMode ? "rgb(108 117 125)" : "#a6a6a66e",
                                                                        fontSize: "0.875rem",
                                                                        minHeight: "31px",
                                                                        height: "31px",
                                                                        width: "300px"
                                                                    }),
                                                                    singleValue: (base) => ({
                                                                        ...base,
                                                                        color: isDarkMode ? "white" : "#212529",
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: isDarkMode ? "#212529" : "white",
                                                                        color: isDarkMode ? "white" : "#212529",
                                                                    }),
                                                                    option: (base, { isFocused, isSelected }) => ({
                                                                        ...base,
                                                                        backgroundColor: isSelected ? "#6c757d" : isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                                                                        color: isSelected ? "white" : isFocused ? "white" : isDarkMode ? "white" : "#212529",
                                                                        fontSize: "0.875rem",
                                                                    }),
                                                                }}
                                                            />
                                                        </td>
                                                    </OverlayTrigger>

                                                    <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                        <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                            <Form.Control
                                                                size="sm"
                                                                type="text"
                                                                value={Lista.aF_OCO_NUMERO_REF}
                                                                onChange={(e) => handleCambiaOCO(index, e.target.value)}
                                                                onBlur={handleBlur}
                                                                autoFocus
                                                                maxLength={50}
                                                                placeholder="-"
                                                                pattern="\d*"
                                                                data-index={indexReal}
                                                            />
                                                        </div>
                                                    </td>

                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip id={`tooltip-serv-${index}`}>{Lista.esP_NOMBRE}</Tooltip>}
                                                    >
                                                        <td
                                                            className={`${isDarkMode ? "text-light" : "text-dark"}`}
                                                            onClick={() => setEditarCampo(indexReal.toString())}
                                                        >
                                                            <div className="d-flex align-items-center gap-2">

                                                                <Form.Control
                                                                    size="sm"
                                                                    aria-label="especie"
                                                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                                    type="text"
                                                                    name="especie"
                                                                    value={Lista.esP_NOMBRE}
                                                                    autoFocus
                                                                    onChange={(e) => handleCambiaEspecie(index, e.target.value)}
                                                                    pattern="\d*"
                                                                    disabled
                                                                    data-index={indexReal}
                                                                    style={{ height: "31px", width: "150px" }}
                                                                />

                                                                <Button
                                                                    size="sm"
                                                                    variant={isDarkMode ? "secondary" : "primary"}
                                                                    onClick={() => {
                                                                        setIndiceEditar(indexReal);
                                                                        setMostrarModalEspecie(true);
                                                                    }}
                                                                    className="d-flex align-items-center justify-content-center"
                                                                    style={{ height: "31px", width: "31px", padding: 0 }}
                                                                >
                                                                    <Search className="h-5 w-5" aria-hidden="true" />
                                                                </Button>

                                                            </div>
                                                        </td>
                                                    </OverlayTrigger>


                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip id={`tooltip-serv-${index}`}>{Lista.ctA_NOMBRE}</Tooltip>}
                                                    >
                                                        <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>

                                                            <select
                                                                aria-label="CTA_COD"
                                                                className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                                name="CTA_COD"
                                                                onChange={(e) => handleCambiaCuenta(index, e.target.value)}
                                                                onBlur={handleBlur}
                                                                value={Lista.ctA_COD}
                                                                autoFocus
                                                                data-index={indexReal}
                                                                style={{ height: "31px", width: "300px", fontSize: '13px' }}
                                                            >
                                                                <option value="">Selecciona una opción</option>

                                                                {comboCuenta.map((traeCuentas) => (

                                                                    <option key={traeCuentas.codigo} value={traeCuentas.codigo}>
                                                                        {traeCuentas.descripcion}
                                                                    </option>

                                                                ))}

                                                            </select>
                                                        </td>
                                                    </OverlayTrigger>

                                                    <td className={`${isDarkMode ? "text-light" : "text-dark"}`} onClick={() => setEditarCampo(indexReal.toString())}>
                                                        <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                                                            <Form.Control
                                                                size="sm"
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
                                                                size="sm"
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
                                                                size="sm"
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
                                                                size="sm"
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
                                                    {/* Celda de Observación con modal anidado */}
                                                    <td className={`${isDarkMode ? "text-light" : "text-dark"}`}>
                                                        <div className="d-flex align-items-center">
                                                            <Form.Control
                                                                size="sm"
                                                                type="text"
                                                                value={Lista.deT_OBS || ''}
                                                                onClick={() => {
                                                                    setIndiceObservacion(indexReal);
                                                                    setObservacionTemp(Lista.deT_OBS || '');
                                                                    setModalObservacion(true);
                                                                }}
                                                                readOnly
                                                                placeholder="Haz clic para editar observación"
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    backgroundColor: isDarkMode ? '#2c3034' : '#f8f9fa'
                                                                }}
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
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal anidado para editar observación */}
            <Modal
                show={modalObservacion}
                onHide={handleCerrarModalObservacion}
                size="lg"
                backdrop="static"
                keyboard={false}
                centered
                style={{ zIndex: 1060 }}
            >
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">
                        <PencilSquare className="me-2" size={18} />
                        Editar Observación
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className={isDarkMode ? "darkModePrincipal" : ""}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                            Observación del Activo Fijo
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={observacionTemp}
                            maxLength={1000}
                            onChange={(e) => setObservacionTemp(e.target.value)}
                            placeholder="Ingrese la observación aquí..."
                            className={isDarkMode ? "bg-dark text-light border-secondary" : ""}
                            autoFocus
                        />
                        <Form.Text className="text-muted">
                            Puede escribir hasta 1000 caracteres.
                        </Form.Text>
                    </Form.Group>

                    {indiceObservacion !== null && elementosActualesModificar && (
                        <div className={`alert alert-info p-2 mt-2 ${isDarkMode ? "bg-dark text-light" : ""}`}>
                            <small>
                                <strong>Activo:</strong> {elementosActualesModificar.find((_, idx) =>
                                    indicePrimerElementoModificar + idx === indiceObservacion
                                )?.aF_CODIGO_GENERICO || 'N/A'}
                            </small>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer className={isDarkMode ? "darkModePrincipal" : ""}>
                    <Button
                        variant="secondary"
                        onClick={handleCerrarModalObservacion}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleGuardarObservacion}
                    >
                        Guardar Observación
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*Modal Firma Visadores(Nuevo) */}
            <Modal show={modalVisadores} onHide={() => setModalSolicitarVisadores(false)} dialogClassName="modal-right" size="xl">
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Visar Documento</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <div className="d-flex flex-column flex-md-row align-items-start 
                       bg-light border-start border-4 border-info shadow-sm rounded p-3 gap-2 mb-2">

                        <span className="fw-semibold text-info me-2">
                            <InfoCircle className="flex-shrink-0" width={18} height={18} aria-hidden="true" />
                        </span>
                        <div className="small text-dark">
                            <strong>Validación de documento</strong><br />
                            Una vez enviada la solicitud, ingrese al sistema <b>ERP</b>:
                            <a href="https://www.ssmso.cl/GestorSSMSO/" target="_blank" className="mx-1" rel="noopener noreferrer">
                                https://www.ssmso.cl/GestorSSMSO/
                            </a>
                            <br />
                            Luego diríjase al módulo <b>Gestor Documental</b> y acceda a la sección <b>“Validar”</b>.
                        </div>
                    </div>
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
                                AltaInventario={AltaInventario}
                                objeto={objeto}
                                UnidadNombre={UnidadNombre}
                                Unidad={Unidad}
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
                                )
                            }
                        </BlobProvider>
                    </form>
                </Modal.Body>
            </Modal >
            {/*Modal Firma Visadores(Clásico) */}
            <Modal show={modalVisadoresClasico} onHide={() => setModalSolicitarVisadoresClasico(false)} dialogClassName="modal-right" size="xl">
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Visar Documento</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <div className="d-flex flex-column flex-md-row align-items-start bg-light border-start border-4 border-info shadow-sm rounded p-3 gap-2 mb-2">

                        <span className="fw-semibold text-info me-2">
                            <InfoCircle className="flex-shrink-0" width={18} height={18} aria-hidden="true" />
                        </span>

                        <div className="small text-dark">
                            <strong>Validación de documento:</strong><br />
                            El visado se mostrará automáticamente una vez que seleccione el o los firmantes.
                            Posteriormente, podrá utilizar las herramientas disponibles para imprimir el documento.<br />
                            En caso de que el visado no se visualice, deberá solicitar a la <b>Unidad de Desarrollo</b> cargar la imagen de la firma.
                        </div>

                    </div>
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
                            AltaInventario={AltaInventario}
                            objeto={objeto}
                            UnidadNombre={UnidadNombre}
                            Unidad={Unidad}
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
                            )
                        }
                    </BlobProvider>

                </Modal.Body>
            </Modal>

            {/* Modal Especies*/}
            <Modal
                show={mostrarModalEspecie}
                onHide={() => setMostrarModalEspecie(false)}
                size="lg"
                className="modal-fullscreen-sm-down"
            >
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title>Listado de Especies</Modal.Title>
                </Modal.Header>

                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form onSubmit={handleSubmitSeleccionado}>
                        <Row className="mb-2">
                            {/* Bien / Detalles */}
                            <Col xs={12} md={6}>
                                <div className="mb-1">
                                    <label aria-label="bien" className="fw-semibold">Bien</label>
                                    <select
                                        aria-label="bien"
                                        name="bien"
                                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar</option>
                                        {comboBien.map((traeBien) => (
                                            <option key={traeBien.codigo} value={traeBien.codigo}>
                                                {traeBien.descripcion}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-1">
                                    <label className="fw-semibold">Detalles</label>
                                    <select
                                        aria-label="detalles"
                                        name="detalles"
                                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                        onChange={handleChange}
                                    // disabled={!Cuenta.bien}
                                    >
                                        <option value="">Seleccionar</option>
                                        {comboDetalle.map((traeDetalles) => (
                                            <option key={traeDetalles.codigo} value={traeDetalles.codigo}>
                                                {traeDetalles.descripcion}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>

                            <Col xs={12} md={6}>
                                {/* Especie */}
                                <div className="mb-1">
                                    <label className="fw-semibold">
                                        Buscar Especie
                                    </label>
                                    <div className="d-flex align-items-center">
                                        <Select
                                            options={especieOptions}
                                            onChange={(selectedOption) => handleComboEspecieChange(selectedOption)}
                                            onInputChange={(inputValue) => handleInputEspecieChange(inputValue)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleBuscarEspecie();
                                                }
                                            }}
                                            name="esP_CODIGO"
                                            placeholder="Buscar"
                                            isClearable
                                            classNamePrefix="react-select"
                                            className="w-100 mx-1"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    backgroundColor: isDarkMode ? "#212529" : "white",
                                                    color: isDarkMode ? "white" : "#212529",
                                                    borderColor: isDarkMode ? "rgb(108 117 125)" : "#a6a6a66e",

                                                }),
                                                singleValue: (base) => ({
                                                    ...base,
                                                    color: isDarkMode ? "white" : "#212529",
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    backgroundColor: isDarkMode ? "#212529" : "white",
                                                    color: isDarkMode ? "white" : "#212529",

                                                }),
                                                option: (base, { isFocused, isSelected }) => ({
                                                    ...base,
                                                    backgroundColor:
                                                        isSelected || isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                                                    color:
                                                        isSelected || isFocused ? "white" : isDarkMode ? "white" : "#212529",
                                                }),
                                            }}
                                        />
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id="tooltip-limpiar">Buscar</Tooltip>}
                                        >
                                            <Button
                                                onClick={handleBuscarEspecie}
                                                variant={isDarkMode ? "secondary" : "primary"}
                                                className="w-md-auto"
                                                disabled={loadingEspecie}
                                            >
                                                {loadingEspecie ? (
                                                    <>
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
                                                        <Search className="ms-1" />
                                                    </>
                                                )}
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {listaEspecie.length > 0 && (
                            <Col xs={12} className="d-flex justify-content-end ">
                                <Button
                                    variant={isDarkMode ? "secondary" : "primary"}
                                    type="submit"
                                    className="mb-1"
                                    disabled={!filasSeleccionadas.length}
                                >
                                    Seleccionar <Check2Circle className="ms-1" />
                                </Button>
                            </Col>
                        )}

                    </form>
                    {/* Tabla responsive */}
                    {listaEspecie.length != 0 ? (
                        <div className="table-responsive" style={{ maxHeight: "50vh", overflowY: "auto" }}>
                            <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                                <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "table-light"}`}>
                                    <tr>
                                        <th></th>
                                        <th className={isDarkMode ? "text-light" : "text-dark"}>Código</th>
                                        <th className={isDarkMode ? "text-light" : "text-dark"}>Especie</th>
                                        {/* <th className={isDarkMode ? "text-light" : "text-dark"}>Vida Útil</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {elementosActualesEspecies.map((listadoEspecies, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={() => handleSeleccionFila(indicePrimerElementoEspecies + index)}
                                                    checked={filasSeleccionadas.includes(
                                                        (indicePrimerElementoEspecies + index)
                                                    )}
                                                />
                                            </td>
                                            <td className={isDarkMode ? "text-light" : "text-dark"}>
                                                {listadoEspecies.esP_CODIGO}
                                            </td>
                                            <td className={isDarkMode ? "text-light" : "text-dark"}>
                                                {listadoEspecies.nombrE_ESP}
                                            </td>
                                            {/* <td className={isDarkMode ? "text-light" : "text-dark"}>
                                    {listadoEspecies.vidA_UTIL}
                                  </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className={`text-center m-2 p-2 rounded fs-05em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                            Aplique un filtro para visualizar los detalles de cada especie aquí.
                        </p>

                    )}
                    {/* Paginador */}
                    {listaEspecie.length > 10 && (
                        <div className="paginador-container mt-3">
                            <Pagination className="paginador-scroll">
                                <Pagination.First onClick={() => paginarEspecies(1)} disabled={paginaActualEspecies === 1} />
                                <Pagination.Prev
                                    onClick={() => paginarEspecies(paginaActualEspecies - 1)}
                                    disabled={paginaActualEspecies === 1}
                                />
                                {Array.from({ length: totalPaginasEspecies }, (_, i) => (
                                    <Pagination.Item
                                        key={i + 1}
                                        active={i + 1 === paginaActualEspecies}
                                        onClick={() => paginarEspecies(i + 1)}
                                    >
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => paginarEspecies(paginaActualEspecies + 1)}
                                    disabled={paginaActualEspecies === totalPaginasEspecies}
                                />
                                <Pagination.Last
                                    onClick={() => paginarEspecies(totalPaginasEspecies)}
                                    disabled={paginaActualEspecies === totalPaginasEspecies}
                                />
                            </Pagination>
                        </div>
                    )}
                </Modal.Body>
            </Modal >

        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaAltasModificar: state.listaAltasModificarReducers.listaAltasModificar,
    listaEstado: state.listaEstadoReducers.listaEstado,
    listaEstadoVisadores: state.listaEstadoVisadoresReducers.listaEstadoVisadores,
    documentoByte64: state.obtieneVisadoCompletoReducers.documentoByte64,
    objeto: state.validaApiLoginReducers,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    comboUnidades: state.obtenerUnidadesReducers.comboUnidades,
    comboDetalle: state.detallesReducer.comboDetalle,
    comboBien: state.detallesReducer.comboBien,
    comboEspecies: state.listadoDeEspeciesBienReducers.comboEspecies,
    comboCuenta: state.comboCuentaModificarReducers.comboCuenta,
    comboSerDep: state.comboServDepReducers.comboSerDep,
    listaEspecie: state.listadoDeEspeciesBienReducers.listadoDeEspecies,
    dataSeguimientoEstadoFirma: state.listaEstadoVisadoresReducers.dataSeguimientoEstadoFirma
});


export default connect(mapStateToProps, {
    listaAltasModificarActions,
    listaEstadoActions,
    obtieneVisadoCompletoActions,
    listaEstadoVisadoresActions,
    registrarDocumentoAltaActions,
    modificarFormInventarioActions,
    rechazarAltaActions,
    obtenerfirmasAltasActions,
    obtenerUnidadesActions,
    listadoDeEspeciesBienActions,
    comboEspeciesBienActions,
    comboDetalleActions,
    comboCuentaModificarActions,
    comboSerDepActions,
    anularInventarioActions,
    consultaFirmaVisadoresActions
})(EstadoFirmas);

