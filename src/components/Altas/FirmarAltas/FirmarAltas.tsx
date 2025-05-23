import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Pagination, Form, Modal, Col, Row, Collapse, Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
// import Swal from "sweetalert2";
// import SignatureCanvas from 'react-signature-canvas';
// import { pdf } from "@react-pdf/renderer";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { RootState } from "../../../store";
import MenuAltas from "../../Menus/MenuAltas";
import Layout from "../../../containers/hocs/layout/Layout";
import DocumentoPDF from './DocumentoPDF';
import { BlobProvider, /*PDFDownloadLink*/ } from '@react-pdf/renderer';
import { Helmet } from "react-helmet-async";
import { Objeto } from "../../Navegacion/Profile";
import { Eraser, FiletypePdf, Search } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { obtenerfirmasAltasActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerfirmasAltasActions";
import { obtenerUnidadesActions } from "../../../redux/actions/Altas/FirmarAltas/obtenerUnidadesActions";
import { listaAltasRegistradasActions } from "../../../redux/actions/Altas/AnularAltas/listaAltasRegistradasActions";
import { registrarBienesBajasActions } from "../../../redux/actions/Bajas/ListadoGeneral/registrarBienesBajasActions";
import { FileSignatureIcon } from "lucide-react";
import { registrarDocumentoAltaActions } from "../../../redux/actions/Altas/FirmarAltas/registrarDocumentoAltaActions";

interface FechasProps {
    fDesde: string;
    fHasta: string;
}
export interface ListaAltas {
    aF_CLAVE: number,
    ninv: string,
    altaS_CORR: number,
    serv: string,
    dep: string,
    esp: string,
    ncuenta: string,
    marca: string,
    modelo: string,
    serie: string,
    estado: string,
    precio: number,
    fechA_ALTA: string,
    nrecep: string
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
    iD_UNIDAD: number
}
export interface Unidades {
    iD_UNIDAD: number,
    nombre: string
}
interface DatosBajas {
    listaAltasRegistradas: ListaAltas[];
    comboUnidades: Unidades[];
    obtenerUnidadesActions: () => Promise<boolean>;
    listaAltasRegistradasActions: (fDesde: string, fHasta: string, establ_corr: number, altasCorr: number, af_codigo_generico: string) => Promise<boolean>;
    obtenerfirmasAltasActions: () => Promise<boolean>;
    registrarDocumentoAltaActions: (activos: { jerarquia: number }[]) => Promise<boolean>;
    datosFirmas: DatosFirmas[];
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
    nPaginacion: number; //número de paginas establecido desde preferencias
}


const FirmarAltas: React.FC<DatosBajas> = ({ listaAltasRegistradasActions, obtenerfirmasAltasActions, obtenerUnidadesActions, registrarDocumentoAltaActions, listaAltasRegistradas, comboUnidades, token, isDarkMode, datosFirmas, nPaginacion, objeto }) => {
    const [loading, setLoading] = useState(false);
    const [loadingSolicitarVisado, setLoadingSolicitarVisado] = useState(false);
    const [__, setIsDisabled] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    //-------------Modal-------------//
    // const [mostrarModal, setMostrarModal] = useState<number | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    // const [filaActiva, setFilaActiva] = useState<listaAltasRegistradas | null>(null);
    //------------Fin Modal----------//   
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [error, setError] = useState<Partial<FechasProps> & {}>({});
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = nPaginacion;
    const [Unidad, setUnidad] = useState<number>(0);
    const [UnidadNombre, setUnidadNombre] = useState<string>("");
    const filasSeleccionadasPDF = listaAltasRegistradas.filter((_, index) =>
        filasSeleccionadas.includes(index.toString())
    );
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
        altaS_CORR: 0,
        af_codigo_generico: ""
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

        firmanteInventario: "",
        firmanteFinanzas: "",
        firmanteAbastecimiento: "",
        firmanteInformatica: "",
        firmanteCompra: "",

        visadoInventario: "",
        visadoFinanzas: "",
        visadoAbastecimiento: "",


    });

    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        if (Inventario.fDesde > Inventario.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Validación específica para af_codigo_generico: solo permitir números
        if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
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

        // Si cambió la unidad, actualiza también su nombre
        if (name === "unidad") {
            const unidadSeleccionada = parseInt(value);
            setUnidad(unidadSeleccionada);
            switch (unidadSeleccionada) {
                case 3:
                    setUnidadNombre("Unidad de Abastecimiento");
                    break;
                case 4:
                    setUnidadNombre("Departamento de Informática");
                    break;
                case 5:
                    setUnidadNombre("Departamento de Compra");
                    break;
                default:
                    setUnidadNombre("");
                    break;
            }
        }
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
        const prev = structuredClone(AltaInventario);
        const updatedState = { ...prev, [name]: checked };

        //Limpia Todo al deshabilitar check
        if (name === "ajustarFirma" && !checked) {
            const cleanedState = {
                ...updatedState,
                chkFinanzas: false,
                chkAbastecimiento: false,
                chkUnidad: false,
                //JERARQUIA 1
                titularInventario: false,
                subroganteInventario: false,
                //JERARQUIA 2
                titularFinanzas: false,
                subroganteFinanzas: false,
                //JERARQUIA 3
                titularAbastecimiento: false,
                subroganteAbastecimiento: false,
                //JERARQUIA 3 //Combo
                titularInformatica: false,
                subroganteInformatica: false,
                titularCompra: false,
                subroganteCompra: false,


                //Nombres de los firmantes
                firmanteInventario: "",
                firmanteFinanzas: "",
                firmanteAbastecimiento: "",
                firmanteInformatica: "",
                firmanteCompra: "",

                //Imagenes(esta integrado para su renderizaci+on pero no se usa) se deja de todas maneras
                visadoInventario: "",
                visadoFinanzas: "",
                visadoAbastecimiento: ""
            };
            setIsDisabled(false);
            setIsExpanded(true);
            setAltaInventario(cleanedState);

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
                firmanteAbastecimiento: "",
                firmanteInformatica: "",
                firmanteCompra: "",
            };
            setIsDisabled(false);
            setIsExpanded(true);
            setAltaInventario(cleanedState);
            return;
        }


        let firmanteInventario = prev.firmanteInventario || "";
        let firmanteFinanzas = prev.firmanteFinanzas || "";
        let firmanteAbastecimiento = prev.firmanteAbastecimiento || "";
        let firmanteInformatica = prev.firmanteInformatica || "";
        let firmanteCompra = prev.firmanteCompra || "";

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
                }
                if (name === "subroganteInventario" && checked && firma.rol === "SUBROGANTE" && firma.estabL_CORR === objeto.Roles[0].codigoEstablecimiento.toString()) {
                    firmanteInventario = nombreCompleto;
                    visadoInventario = FIRMA;
                    updatedState.titularInventario = false;
                }
            }
            if (firma.iD_UNIDAD === 2) {
                if (name === "titularFinanzas" && checked && firma.rol === "TITULAR") {
                    firmanteFinanzas = nombreCompleto;
                    visadoFinanzas = FIRMA;
                    updatedState.subroganteFinanzas = false;
                }
                if (name === "subroganteFinanzas" && checked && firma.rol === "SUBROGANTE") {
                    firmanteFinanzas = nombreCompleto;
                    visadoFinanzas = FIRMA;
                    updatedState.titularFinanzas = false;
                }
            }
            if (firma.iD_UNIDAD === 3) {
                if (name === "titularAbastecimiento" && checked && firma.rol === "TITULAR") {
                    firmanteAbastecimiento = nombreCompleto;
                    visadoAbastecimiento = FIRMA;
                    updatedState.subroganteAbastecimiento = false;
                }
                if (name === "subroganteAbastecimiento" && checked && firma.rol === "SUBROGANTE") {
                    firmanteAbastecimiento = nombreCompleto;
                    visadoAbastecimiento = FIRMA;
                    updatedState.titularAbastecimiento = false;
                }
            }

            if (AltaInventario.chkUnidad) {
                //Unidad de Abastecimiento
                if (firma.iD_UNIDAD === 3) {

                    if (name === "titularAbastecimiento" && checked && firma.rol === "TITULAR") {
                        firmanteAbastecimiento = nombreCompleto;
                        updatedState.subroganteAbastecimiento = false;
                    }
                    if (name === "subroganteAbastecimiento" && checked && firma.rol === "SUBROGANTE") {
                        firmanteAbastecimiento = nombreCompleto;
                        updatedState.titularAbastecimiento = false;
                    }
                }
                //Departamento de Informática
                if (firma.iD_UNIDAD === 4) {
                    if (name === "titularInformatica" && checked && firma.rol === "TITULAR") {
                        firmanteInformatica = nombreCompleto;
                        updatedState.subroganteInformatica = false;
                    }
                    if (name === "subroganteInformatica" && checked && firma.rol === "SUBROGANTE") {
                        firmanteInformatica = nombreCompleto;
                        updatedState.titularInformatica = false;
                    }
                }
                //Departamento de compra
                if (firma.iD_UNIDAD === 5) {
                    if (name === "titularCompra" && checked && firma.rol === "TITULAR") {
                        firmanteCompra = nombreCompleto;
                        updatedState.subroganteCompra = false;
                    }
                    if (name === "subroganteCompra" && checked && firma.rol === "SUBROGANTE") {
                        firmanteCompra = nombreCompleto;
                        updatedState.titularCompra = false;
                    }
                }

            }



        }

        updatedState.firmanteInventario = firmanteInventario;
        updatedState.firmanteFinanzas = firmanteFinanzas;
        updatedState.firmanteAbastecimiento = firmanteAbastecimiento;
        updatedState.firmanteInformatica = firmanteInformatica;
        updatedState.firmanteCompra = firmanteCompra;

        updatedState.visadoInventario = visadoInventario;
        updatedState.visadoFinanzas = visadoFinanzas;
        updatedState.visadoAbastecimiento = visadoAbastecimiento;
        setIsDisabled(false);
        setIsExpanded(true);
        setAltaInventario(updatedState);
    }, [AltaInventario, datosFirmas, objeto]);

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);

        if (Inventario.fDesde != "" || Inventario.fHasta != "") {
            if (validate()) {
                resultado = await listaAltasRegistradasActions(Inventario.fDesde, Inventario.fHasta, objeto.Roles[0].codigoEstablecimiento, Inventario.altaS_CORR, Inventario.af_codigo_generico);
            }
        }
        else {
            resultado = await listaAltasRegistradasActions("", "", objeto.Roles[0].codigoEstablecimiento, Inventario.altaS_CORR, Inventario.af_codigo_generico);
        }

        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin Resultados",
                text: "El Nº de Inventario consultado no se encuentra en este listado.",
                confirmButtonText: "Ok",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            resultado = await listaAltasRegistradasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
            setLoading(false); //Finaliza estado de carga
            return;
        } else {
            paginar(1);
            setLoading(false); //Finaliza estado de carga
        }

    };

    const handleSolicitarVisado = async () => {
        setLoadingSolicitarVisado(true);

        const asignarJerarquia = (estado: typeof AltaInventario): number => {
            const { ajustarFirma, chkFinanzas, chkAbastecimiento, chkUnidad } = estado;
            if (ajustarFirma && chkFinanzas && (chkAbastecimiento || chkUnidad)) return 4;
            if (ajustarFirma && (chkAbastecimiento || chkUnidad)) return 3;
            if (ajustarFirma && chkFinanzas) return 2;
            if (ajustarFirma) return 1;
            return 0;
        };

        const selectedIndices = filasSeleccionadas.map(Number);
        const activosSeleccionados = selectedIndices.map((index) => {
            return {
                altaS_CORR: listaAltasRegistradas[index].altaS_CORR,
                jerarquia: asignarJerarquia(AltaInventario),
            };
        });

        const result = await Swal.fire({
            icon: "info",
            title: "Solicitar Visado",
            text: `Confirme para enviar su solicitud`,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Confirmar y Registrar",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
                popup: "custom-border", // Clase personalizada para el borde
            }
        });

        if (result.isConfirmed) {
            setLoadingSolicitarVisado(true);
            console.log(activosSeleccionados);
            const resultado = await registrarDocumentoAltaActions(activosSeleccionados);
            if (resultado) {

            } else {
                Swal.fire({
                    icon: "error",
                    title: ":'(",
                    text: `Hubo un problema al enviar las firmas.`,
                    background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "#000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#007bff" : "#444"}`,
                    customClass: {
                        popup: "custom-border"
                    }
                });
                setLoadingSolicitarVisado(false);
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

    const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            if (comboUnidades.length === 0) obtenerUnidadesActions();
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
        if (comboUnidades.length === 0) obtenerUnidadesActions();
        if (datosFirmas.length === 0) { obtenerfirmasAltasActions(); }
        setFilasSeleccionadas((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
    };

    const listaAltasAuto = async () => {
        if (token) {
            if (listaAltasRegistradas.length === 0) {
                setLoading(true);
                const resultado = await listaAltasRegistradasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, "");
                if (resultado) {
                    setLoading(false);
                }
                // else {
                //   Swal.fire({
                //     icon: "error",
                //     title: "Error",
                //     text: `Error en la solicitud. Por favor, intente nuevamente.`,
                //     background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                //     color: `${isDarkMode ? "#ffffff" : "000000"}`,
                //     confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                //     customClass: {
                //       popup: "custom-border", // Clase personalizada para el borde
                //     }
                //   });
                // }
            }
        }
    };

    useEffect(() => {
        listaAltasAuto();
        Unidad
    }, [listaAltasRegistradasActions, token, listaAltasRegistradas.length, isDarkMode, Unidad]);

    // const setSeleccionaFila = (index: number) => {
    //     setMostrarModal(index); //Abre modal del indice seleccionado
    //     if (datosFirmas.length === 0) { obtenerfirmasAltasActions(); }
    //     if (comboUnidades.length === 0) { obtenerUnidadesActions(); }
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

    //Logica para habilitar Boton "Solicitar Visado" si los opcionales son habilitados se requerira algun titular o subrogante
    const tieneFirmaInventario =
        AltaInventario.titularInventario || AltaInventario.subroganteInventario;

    const requiereFirmaFinanzas = AltaInventario.chkFinanzas
        ? AltaInventario.titularFinanzas || AltaInventario.subroganteFinanzas
        : true;

    const requiereFirmaAbastecimiento = AltaInventario.chkAbastecimiento
        ? AltaInventario.titularAbastecimiento || AltaInventario.subroganteAbastecimiento
        : true;

    const requiereFirmaUnidad = (() => {
        if (!AltaInventario.chkUnidad) return true;

        switch (Unidad) {
            case 3:
                return AltaInventario.titularAbastecimiento || AltaInventario.subroganteAbastecimiento;
            case 4:
                return AltaInventario.titularInformatica || AltaInventario.subroganteInformatica;
            case 5:
                return AltaInventario.titularCompra || AltaInventario.subroganteCompra;
            default:
                return false;
        }
    })();

    const botonHabilitado =
        tieneFirmaInventario &&
        requiereFirmaFinanzas &&
        requiereFirmaAbastecimiento &&
        requiereFirmaUnidad;
    return (
        <Layout>
            <Helmet>
                <title>Firmar Altas</title>
            </Helmet>
            <MenuAltas />
            <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
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
                                        value={Inventario.fDesde}
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

                    <Col md={5}>
                        <div className="mb-1 mt-4">
                            <Button onClick={handleBuscar}
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                className="mx-1 mb-1">
                                {loading ? (
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
                    {filasSeleccionadas.length > 0 ? (
                        <>
                            <Button
                                onClick={() => setMostrarModal(true)}
                                disabled={listaAltasRegistradas.length === 0}
                                variant={isDarkMode ? "secondary" : "primary"}
                                className="mx-1 mb-1"
                            >
                                Exportar
                                <FiletypePdf
                                    className="flex-shrink-0 h-5 w-5 ms-1"
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
                    <SkeletonLoader rowCount={elementosPorPagina} />
                ) : (
                    <div className='table-responsive'>
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
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
                                    <th scope="col" className="text-nowrap text-center">N° Alta</th>
                                    <th scope="col" className="text-nowrap text-center">Fecha Alta</th>
                                    <th scope="col" className="text-nowrap text-center">Servicio</th>
                                    <th scope="col" className="text-nowrap text-center">Dependencia</th>
                                    <th scope="col" className="text-nowrap text-center">Especie</th>
                                    <th scope="col" className="text-nowrap text-center">N° Cuenta</th>
                                    <th scope="col" className="text-nowrap text-center">Marca</th>
                                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                                    <th scope="col" className="text-nowrap text-center">Serie</th>
                                    <th scope="col" className="text-nowrap text-center">Estado</th>
                                    <th scope="col" className="text-nowrap text-center">Precio</th>
                                    <th scope="col" className="text-nowrap text-center">N° Recepcion</th>
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
                                                {/* <Form.Check
                                                type="checkbox"
                                                onChange={() => setSeleccionaFila(index)}
                                                checked={filasSeleccionadas.includes(
                                                    (indicePrimerElemento + index).toString()
                                                )}
                                            /> */}
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={() => setSeleccionaFilas(indexReal)}
                                                    checked={filasSeleccionadas.includes(indexReal.toString())}
                                                />
                                            </td>
                                            <td className="text-nowrap">{Lista.ninv}</td>
                                            <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                            <td className="text-nowrap">{Lista.fechA_ALTA}</td>
                                            <td className="text-nowrap">{Lista.serv}</td>
                                            <td className="text-nowrap">{Lista.dep}</td>
                                            <td className="text-nowrap">{Lista.esp}</td>
                                            <td className="text-nowrap">{Lista.ncuenta}</td>
                                            <td className="text-nowrap">{Lista.marca}</td>
                                            <td className="text-nowrap">{Lista.modelo}</td>
                                            <td className="text-nowrap">{Lista.serie}</td>
                                            <td className="text-nowrap">{Lista.estado}</td>
                                            <td className="text-nowrap">
                                                ${(Lista.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                            </td>
                                            <td className="text-nowrap">{Lista.nrecep}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="paginador-container">
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

            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="xl">
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Firmar Alta</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form >

                        <div className="fw-semibold p-1" >
                            <Form.Check
                                onChange={handleCheck}
                                name="ajustarFirma"
                                type="checkbox"
                                label="Ajustar firma"
                                className="form-switch mx-2 "
                                checked={AltaInventario.ajustarFirma}
                            />
                        </div>
                        <div className="d-flex justify-content-end">
                            <Button onClick={handleSolicitarVisado}
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                className="mx-1 mb-1"
                                disabled={!botonHabilitado}
                            >
                                {loading ? (
                                    <>
                                        {"Solicitar Visado"}
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
                                        {"Solicitar Visado"}
                                        <FileSignatureIcon className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                    </>
                                )}
                            </Button>
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
                                            type="checkbox"
                                            checked={AltaInventario.titularInventario}
                                        />
                                        <label htmlFor="titularInventario" className="ms-2">Titular Inventario</label>
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.ajustarFirma}
                                            name="subroganteInventario"
                                            type="checkbox"
                                            checked={AltaInventario.subroganteInventario}
                                        />
                                        <label htmlFor="subroganteInventario" className="ms-2">Subrogante Inventario</label>
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
                                        <label htmlFor="titularFinanzas" className="ms-2">Titular Finanzas</label>
                                    </div>
                                    <div className="d-flex">
                                        <Form.Check
                                            onChange={handleCheck}
                                            disabled={!AltaInventario.chkFinanzas}
                                            name="subroganteFinanzas"
                                            type="checkbox"
                                            checked={AltaInventario.subroganteFinanzas}
                                        />
                                        <label htmlFor="subroganteFinanzas" className="ms-2">Subrogante Finanzas</label>
                                    </div>
                                </Col>

                                {/* Unidades específicas */}
                                <Col md={4}>
                                    {objeto.IdCredencial === 888 || objeto.IdCredencial === 62511 ? (
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
                                                        <label htmlFor="titularAbastecimiento" className="ms-2">Titular Abastecimiento</label>
                                                    </div>
                                                    <div className="d-flex">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="subroganteAbastecimiento"
                                                            type="checkbox"
                                                            checked={AltaInventario.subroganteAbastecimiento}
                                                        />
                                                        <label htmlFor="subroganteAbastecimiento" className="ms-2">Subrogante Abastecimiento</label>
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
                                                        <label htmlFor="titularInformatica" className="ms-2">Titular Informática</label>
                                                    </div>
                                                    <div className="d-flex">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="subroganteInformatica"
                                                            type="checkbox"
                                                            checked={AltaInventario.subroganteInformatica}
                                                        />
                                                        <label htmlFor="subroganteInformatica" className="ms-2">Subrogante Informática</label>
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
                                                        <label htmlFor="titularCompra" className="ms-2">Titular Compra</label>
                                                    </div>
                                                    <div className="d-flex">
                                                        <Form.Check
                                                            onChange={handleCheck}
                                                            disabled={!AltaInventario.chkUnidad}
                                                            name="subroganteCompra"
                                                            type="checkbox"
                                                            checked={AltaInventario.subroganteCompra}
                                                        />
                                                        <label htmlFor="subroganteCompra" className="ms-2">Subrogante Compra</label>
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
                                                <label htmlFor="titularAbastecimiento" className="ms-2">Titular Abastecimiento</label>
                                            </div>
                                            <div className="d-flex">
                                                <Form.Check
                                                    onChange={handleCheck}
                                                    disabled={!AltaInventario.chkAbastecimiento}
                                                    name="subroganteAbastecimiento"
                                                    type="checkbox"
                                                    checked={AltaInventario.subroganteAbastecimiento}
                                                />
                                                <label htmlFor="subroganteAbastecimiento" className="ms-2">Subrogante Abastecimiento</label>
                                            </div>
                                        </>
                                    )}
                                </Col>
                            </Row>
                        </Collapse>

                        {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                        <BlobProvider document={
                            <DocumentoPDF
                                row={filasSeleccionadasPDF}
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
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaAltasRegistradas: state.listaAltasRegistradasReducers.listaAltasRegistradas,
    objeto: state.validaApiLoginReducers,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboUnidades: state.obtenerUnidadesReducers.comboUnidades,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    listaAltasRegistradasActions,
    registrarBienesBajasActions,
    obtenerfirmasAltasActions,
    obtenerUnidadesActions,
    registrarDocumentoAltaActions
})(FirmarAltas);
