import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Row, Col, Collapse, OverlayTrigger, Tooltip, Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import { RootState } from "../../store";
import { CaretDown, CaretUpFill, Eraser, EraserFill, Search } from "react-bootstrap-icons";
import "../../styles/Traslados.css"
import Swal from "sweetalert2";
import { Objeto } from "../Navegacion/Profile";
import { Helmet } from "react-helmet-async";
import MenuTraslados from "../Menus/MenuTraslados";
import { DEPENDENCIA } from "../Inventario/RegistrarInventario/DatosCuenta";
import { comboEstablecimientoActions } from "../../redux/actions/Traslados/Combos/comboEstablecimientoActions";
import { comboTrasladoServicioActions } from "../../redux/actions/Traslados/Combos/comboTrasladoServicioActions";
import { comboTrasladoEspecieActions } from "../../redux/actions/Traslados/Combos/comboTrasladoEspecieActions";
import { comboDependenciaOrigenActions } from "../../redux/actions/Traslados/Combos/comboDependenciaoOrigenActions";
import { comboDependenciaDestinoActions } from "../../redux/actions/Traslados/Combos/comboDependenciaDestinoActions";

import { obtenerInventarioTrasladoActions } from "../../redux/actions/Traslados/obtenerInventarioTrasladoActions";
import { useNavigate } from "react-router-dom";
import { registroTrasladoActions } from "../../redux/actions/Traslados/RegistroTrasladoActions";
import MenuTraspasos from "../Menus/MenuTraspasos";
// Define el tipo de los elementos del combo `Establecimiento`
export interface ESTABLECIMIENTO {
    codigo: number;
    descripcion: string;
}
// Define el tipo de los elementos del combo `traslado servicio`
interface TRASLADOSERVICIO {
    codigo: number;
    descripcion: string;
}
// Define el tipo de los elementos del combo `traslado especie`
interface TRASLADOESPECIE {
    codigo: number;
    descripcion: string;
}
interface PropsTraslados {
    aF_CLAVE: number;
    seR_CORR: number;
    deP_CORR_ORIGEN: number; //deP_CORR_ORIGEN
    esP_CODIGO: string;
    af_codigo_generico: string; //nInventario
    marca: string;
    modelo: string;
    serie: string;
    traS_DET_CORR?: number;
    deP_CORR?: number; //deP_CORR
    traS_CO_REAL?: number; //traspasoReal
    traS_MEMO_REF?: string; //nMemoRef
    traS_FECHA_MEMO?: string; //fechaMemo
    traS_OBS: string; //observaciones
    traS_NOM_ENTREGA?: string; //entrgadoPor
    traS_NOM_RECIBE?: string; //recibidoPor
    traS_NOM_AUTORIZA?: string; //jefeAutoriza
    n_TRASLADO?: number; //nTraslado
}

interface TraspasosProps extends PropsTraslados {
    comboTrasladoServicio: TRASLADOSERVICIO[];
    comboTrasladoServicioActions: (establ_corr: number) => void;
    comboEstablecimiento: ESTABLECIMIENTO[];
    comboEstablecimientoActions: () => void;
    comboTrasladoEspecie: TRASLADOESPECIE[];
    comboTrasladoEspecieActions: (establ_corr: number) => void;
    comboDependenciaOrigen: DEPENDENCIA[];
    comboDependenciaDestino: DEPENDENCIA[];
    comboDependenciaOrigenActions: (comboServicioOrigen: string) => void; // Nueva prop para pasar el servicio seleccionado
    comboDependenciaDestinoActions: (comboServicioDestino: string) => void; // Nueva prop para pasar el servicio seleccionado
    registroTrasladoActions: (FormularioTraslado: Record<string, any>) => Promise<boolean>
    obtenerInventarioTrasladoActions: (af_codigo_generico: string) => Promise<boolean>
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
}


const RegistrarTraspasos: React.FC<TraspasosProps> = ({
    registroTrasladoActions,
    comboTrasladoServicioActions,
    comboEstablecimientoActions,
    comboTrasladoEspecieActions,
    comboDependenciaOrigenActions,
    comboDependenciaDestinoActions,
    obtenerInventarioTrasladoActions,
    comboTrasladoServicio,
    comboEstablecimiento,
    comboTrasladoEspecie,
    comboDependenciaOrigen,
    comboDependenciaDestino,
    aF_CLAVE,
    af_codigo_generico,
    seR_CORR,
    deP_CORR_ORIGEN,
    esP_CODIGO,
    marca,
    modelo,
    serie,
    traS_OBS,
    objeto,
    token,
    isDarkMode }) => {
    const navigate = useNavigate(); // Hook para redirigir
    const [loading, setLoading] = useState(false); // Estado para controlar la carga
    const [error, setError] = useState<Partial<PropsTraslados> & {}>({});
    const [Traslados, setTraslados] = useState({
        aF_CLAVE: 0,
        af_codigo_generico: "",
        seR_CORR: 0,
        deP_CORR_ORIGEN: 0,
        esP_CODIGO: "",
        marca: "",
        modelo: "",
        serie: "",
        traS_DET_CORR: 0,
        deP_CORR: 0,
        traS_CO_REAL: 0,
        traS_MEMO_REF: "",
        traS_FECHA_MEMO: "",
        traS_OBS: "",
        traS_NOM_ENTREGA: "",
        traS_NOM_RECIBE: "",
        traS_NOM_AUTORIZA: "",
        n_TRASLADO: 0,
        usuario_crea: objeto.IdCredencial.toString()
    });

    const validateForm = () => {
        let tempErrors: Partial<any> & {} = {};
        if (!Traslados.seR_CORR) tempErrors.seR_CORR = "Campo obligatorio.";
        if (!Traslados.deP_CORR_ORIGEN) tempErrors.deP_CORR_ORIGEN = "Campo obligatorio.";
        if (!Traslados.traS_DET_CORR) tempErrors.traS_DET_CORR = "Campo obligatorio.";
        if (!Traslados.deP_CORR) tempErrors.deP_CORR = "Campo obligatorio.";
        if (!Traslados.traS_NOM_ENTREGA) tempErrors.traS_NOM_ENTREGA = "Campo obligatorio.";
        if (!Traslados.traS_OBS) tempErrors.traS_OBS = "Campo obligatorio.";
        if (!Traslados.traS_MEMO_REF) tempErrors.traS_MEMO_REF = "Campo obligatorio.";
        if (!Traslados.traS_FECHA_MEMO) tempErrors.traS_FECHA_MEMO = "Campo obligatorio.";
        if (!Traslados.traS_NOM_RECIBE) tempErrors.traS_NOM_RECIBE = "Campo obligatorio.";
        if (!Traslados.traS_NOM_AUTORIZA) tempErrors.traS_NOM_AUTORIZA = "Campo obligatorio.";
        // if (!Traslados.traS_CO_REAL) tempErrors.traS_CO_REAL = "Campo obligatorio.";
        if (!Traslados.esP_CODIGO) tempErrors.esP_CODIGO = "Campo obligatorio.";
        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    useEffect(() => {
        // Detecta si el valor de 'especie' ha cambiado 
        setTraslados({
            aF_CLAVE,
            af_codigo_generico,
            seR_CORR,
            deP_CORR_ORIGEN,
            esP_CODIGO,
            marca,
            modelo,
            serie,
            traS_DET_CORR: 0,
            deP_CORR: 0,
            traS_CO_REAL: 0,
            traS_MEMO_REF: "",
            traS_FECHA_MEMO: "",
            traS_OBS,
            traS_NOM_ENTREGA: "",
            traS_NOM_RECIBE: "",
            traS_NOM_AUTORIZA: "",
            n_TRASLADO: 0,
            usuario_crea: objeto.IdCredencial.toString()
        });
        if (token) {
            // Verifica si las acciones ya fueron disparadas
            if (comboTrasladoServicio.length === 0) comboTrasladoServicioActions(objeto.Roles[0].codigoEstablecimiento);
            if (comboEstablecimiento.length === 0) comboEstablecimientoActions();
            if (comboTrasladoEspecie.length === 0) comboTrasladoEspecieActions(objeto.Roles[0].codigoEstablecimiento);
            if (comboDependenciaOrigen.length === 0) comboDependenciaOrigenActions("");
        }
    }, [comboTrasladoServicioActions,
        comboEstablecimientoActions,
        comboTrasladoEspecieActions,
        af_codigo_generico,
        seR_CORR,
        deP_CORR_ORIGEN,
        esP_CODIGO,
        marca,
        modelo,
        serie,
        traS_OBS]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Validación específica para af_codigo_generico: solo permitir números
        if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
            return; // Salir si contiene caracteres no numéricos
        }
        // Convierte `value` a número
        let newValue: string | number = ["deP_CORR_ORIGEN", "deP_CORR", "n_TRASLADO", "seR_CORR"].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setTraslados((prevTraslados) => ({
            ...prevTraslados,
            [name]: newValue,
        }));

        if (name === "seR_CORR") {
            comboDependenciaOrigenActions(value);
        }
        if (name === "traS_DET_CORR") {
            comboDependenciaDestinoActions(value);
        }

        if (name === "esP_CODIGO") {
            console.log(value);
        }

    };

    const [isExpanded, setIsExpanded] = useState({
        fila1: true,
        fila2: false,
        fila3: false,
    });

    const toggleRow = (fila: keyof typeof isExpanded) => {
        setIsExpanded((prevState) => ({
            ...prevState,
            [fila]: !prevState[fila],
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            const confirmResult = await Swal.fire({
                icon: "info",
                title: "Confirmar Traslado",
                text: "¿Confirma que desea trasladar el inventario con los datos proporcionados?",
                showCancelButton: true,
                confirmButtonText: "Confirmar y Trasladar",
                cancelButtonText: "Cancelar",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#444"}`,
                customClass: { popup: "custom-border" }
            });

            if (confirmResult.isConfirmed) {
                try {
                    const resultado = await registroTrasladoActions(Traslados);
                    console.log(Traslados);
                    if (resultado) {
                        Swal.fire({
                            icon: "success",
                            title: "Registro Exitoso",
                            text: `Su traslado ha sido registrado exitosamente`,
                            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                            color: `${isDarkMode ? "#ffffff" : "000000"}`,
                            confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                            customClass: { popup: "custom-border" }
                        });

                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo un problema al enviar el formulario.",
                            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                            color: `${isDarkMode ? "#ffffff" : "000000"}`,
                            confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                            customClass: { popup: "custom-border" }
                        });
                    }
                } catch (error) {
                    console.error("Error al registrar el formulario:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error inesperado",
                        text: "Ocurrió un error inesperado. Por favor, inténtelo nuevamente.",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                        customClass: { popup: "custom-border" }
                    });
                }
            }

        }
    }

    const handleLimpiar = () => {
        setTraslados((prev) => ({
            ...prev,
            aF_CLAVE: 0,
            af_codigo_generico: "",
            seR_CORR: 0,
            deP_CORR_ORIGEN: 0,
            esP_CODIGO: "",
            marca: "",
            modelo: "",
            serie: "",
            traS_DET_CORR: 0,
            deP_CORR: 0,
            traS_CO_REAL: 0,
            traS_MEMO_REF: "",
            traS_FECHA_MEMO: "",
            traS_OBS: "",
            traS_NOM_ENTREGA: "",
            traS_NOM_RECIBE: "",
            traS_NOM_AUTORIZA: "",
            n_TRASLADO: 0
        }));
    }



    const handleBuscar = async (e: React.MouseEvent<HTMLButtonElement>) => {
        let resultado = false;
        e.preventDefault();
        setLoading(true); // Inicia el estado de carga
        if (!Traslados.af_codigo_generico || Traslados.af_codigo_generico === "") {
            Swal.fire({
                icon: "warning",
                title: "Por favor, ingrese un número de inventario",
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
        resultado = await obtenerInventarioTrasladoActions(Traslados.af_codigo_generico);
        if (!resultado) {

            Swal.fire({
                icon: "warning",
                title: "Inventario sin alta",
                text: "Primero debe dar de alta el inventario para realizar un traslado.",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                customClass: { popup: "custom-border" },
                allowOutsideClick: false,
                confirmButtonText: "Registrar Alta",
                showCancelButton: true, // Agrega un segundo botón
                cancelButtonText: "Cerrar", // Texto del botón
                willClose: () => {
                    document.body.style.overflow = "auto"; // Restaura el scroll
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    //Al confirmar le paso como props el inventario que no ha sido dado de alta, con el fin que se renderize en el buscador de Reggistrar Altas
                    navigate("/Altas/RegistrarAltas", {
                        state: { prop_codigo_origen: Traslados.af_codigo_generico }
                    });
                    setLoading(false);
                }
            });
            return;
        } else {
            setLoading(false); //Finaliza estado de carga
        }
    };

    //Se usa para resaltar cuales son los datos restante(se marca con un borde rojo)
    const tieneErroresBusqueda = !!(
        error.seR_CORR ||
        error.deP_CORR_ORIGEN ||
        error.esP_CODIGO ||
        error.af_codigo_generico ||
        error.marca ||
        error.modelo ||
        error.serie
    );
    const tieneErroresDestino = !!(
        error.traS_DET_CORR ||
        error.deP_CORR ||
        error.traS_MEMO_REF ||
        error.traS_FECHA_MEMO ||
        error.traS_OBS ||
        error.traS_CO_REAL
    );
    const tieneErroresRecepcion = !!(
        error.traS_NOM_ENTREGA ||
        error.traS_NOM_RECIBE ||
        error.traS_NOM_AUTORIZA
    );

    return (
        <Layout>
            <Helmet>
                <title>Registrar Traspasos</title>
            </Helmet>
            <MenuTraspasos />
            <form onSubmit={handleFormSubmit}>
                <div className={`border p-4 rounded ${isDarkMode ? "darkModePrincipal border-secondary" : ""}`}>
                    <h3 className="form-title fw-semibold border-bottom p-1">Registrar Traspasos</h3>
                    {/* Fila 1 */}
                    <div className={`mb-3 border p-1 rounded-4 ${tieneErroresBusqueda ? "border-danger" : ""}`}>
                        <div className={`d-flex justify-content-between align-items-center m-1 p-3 hover-effect rounded-4 ${isDarkMode ? "bg-transparent " : ""}`} onClick={() => toggleRow("fila1")}>
                            <h5 className="fw-semibold">PARÁMETROS DE BÚSQUEDA</h5>
                            {isExpanded.fila1 ? (
                                <CaretUpFill className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                            ) : (
                                <CaretDown className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                            )}
                        </div>
                        <Collapse in={isExpanded.fila1} dimension="height">
                            <div className="border-top ">
                                <Row className="p-1 row justify-content-center ">
                                    <Col md={5}>
                                        {/* N° Inventario */}
                                        <div className="mb-1">
                                            <label className="fw-semibold">
                                                Nº Inventario
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    aria-label="af_codigo_generico"
                                                    type="text"
                                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.af_codigo_generico ? "is-invalid" : ""}`}
                                                    maxLength={12}
                                                    name="af_codigo_generico"
                                                    onChange={handleChange}
                                                    value={Traslados.af_codigo_generico}
                                                />
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip-limpiar">Buscar Inventario</Tooltip>}
                                                >
                                                    <Button
                                                        onClick={handleBuscar}
                                                        variant="primary"
                                                        className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  ms-1`}
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
                                                            </>
                                                        ) : (
                                                            <Search
                                                                className={"flex-shrink-0 h-5 w-5"}
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                    </Button>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="tooltip-limpiar">Limpiar formulario</Tooltip>}
                                                >
                                                    <Button
                                                        onClick={handleLimpiar}
                                                        variant="primary"
                                                        className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"} mx-1`}
                                                    >
                                                        {
                                                            (() => {
                                                                const { usuario_crea, ...restoTraslados } = Traslados;
                                                                const tieneDatos = Object.values(restoTraslados).some(
                                                                    (valor) => valor !== "" && valor !== 0
                                                                );
                                                                return tieneDatos ? (
                                                                    <EraserFill
                                                                        className="flex-shrink-0 h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <Eraser
                                                                        className="flex-shrink-0 h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                );
                                                            })()
                                                        }
                                                    </Button>

                                                </OverlayTrigger>
                                            </div>
                                            {error.af_codigo_generico && (<div className="invalid-feedback fw-semibold d-block">{error.af_codigo_generico}
                                            </div>
                                            )}
                                        </div>
                                    </Col>
                                    <Col md={5}>
                                        {/* Datos */}

                                        <div className="d-flex">
                                            <div className="ms-1">
                                                <label className="fw-semibold">
                                                    Marca
                                                </label>
                                                <input
                                                    aria-label="marca"
                                                    type="text"
                                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                    maxLength={50}
                                                    name="marca"
                                                    disabled
                                                    onChange={handleChange}
                                                    value={Traslados.marca}
                                                />
                                            </div>
                                            <div className="ms-1">
                                                <label className="fw-semibold">
                                                    Modelo
                                                </label>
                                                <input
                                                    aria-label="modelo"
                                                    type="text"
                                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                    maxLength={50}
                                                    name="modelo"
                                                    disabled
                                                    onChange={handleChange}
                                                    value={Traslados.modelo}
                                                />
                                            </div>
                                            <div className="ms-1">
                                                <label className="fw-semibold">
                                                    Serie
                                                </label>
                                                <input
                                                    aria-label="serie"
                                                    type="text"
                                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                    maxLength={50}
                                                    name="serie"
                                                    disabled
                                                    onChange={handleChange}
                                                    value={Traslados.serie}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Collapse>
                    </div>

                    {/* Fila 2 */}
                    <div className={`mb-3 border p-1 rounded-4 ${tieneErroresDestino ? "border-danger" : ""}`}>
                        <div className={`d-flex justify-content-between align-items-center m-1 p-3 hover-effect rounded-4 ${isDarkMode ? "bg-transparent text-light" : ""}`} onClick={() => toggleRow("fila2")}>
                            <h5 className="fw-semibold">SELECCIONE UBICACIÓN DE CENTRO DE DESTINO</h5>
                            {isExpanded.fila2 ? (
                                <CaretUpFill className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                            ) : (
                                <CaretDown className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                            )}
                        </div>
                        <Collapse in={isExpanded.fila2}>
                            <div className="border-top">
                                <Row className="p-1 row justify-content-center">
                                    <Col md={5}>
                                        {/* Radios Pendiente implementación */}
                                        <div className="mb-1">
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
                                        </div>
                                        {/* N° Memo Ref */}
                                        <div className="mb-1">
                                            <label className="fw-semibold">
                                                N° Memo Ref
                                            </label>
                                            <input
                                                aria-label="traS_MEMO_REF"
                                                type="text"
                                                className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                                                    } ${error.traS_MEMO_REF ? "is-invalid" : ""}`}
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
                                                className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                                                    } ${error.traS_FECHA_MEMO ? "is-invalid" : ""}`}
                                                name="traS_FECHA_MEMO"
                                                onChange={handleChange}
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
                                                className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                                                    } ${error.traS_OBS ? "is-invalid" : ""}`}
                                                aria-label="traS_OBS"
                                                name="traS_OBS"
                                                rows={4}
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
                                    <Col md={5}>
                                        {/* servicio Origen */}
                                        <div className="mb-1">
                                            <label htmlFor="seR_CORR" className="fw-semibold fw-semibold">Servicio Origen</label>
                                            <select
                                                aria-label="seR_CORR"
                                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.seR_CORR ? "is-invalid" : ""}`}
                                                name="seR_CORR"
                                                onChange={handleChange}
                                                value={Traslados.seR_CORR || 0}
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
                                        </div>
                                        {/* Dependencia/ Departamento */}
                                        <div className="mb-1">
                                            <label htmlFor="deP_CORR_ORIGEN" className="fw-semibold">Dependencia Origen</label>
                                            <select
                                                aria-label="deP_CORR_ORIGEN"
                                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.deP_CORR_ORIGEN ? "is-invalid" : ""}`}
                                                name="deP_CORR_ORIGEN"
                                                // disabled={!Traslados.servicioOrigen}
                                                onChange={handleChange}
                                                value={Traslados.deP_CORR_ORIGEN}
                                            >
                                                <option value="">Seleccionar</option>
                                                {comboDependenciaOrigen.map((traeDependencia) => (
                                                    <option
                                                        key={traeDependencia.codigo}
                                                        value={traeDependencia.codigo}
                                                    >
                                                        {traeDependencia.descripcion}
                                                    </option>
                                                ))}
                                            </select>
                                            {error.deP_CORR_ORIGEN && (
                                                <div className="invalid-feedback fw-semibold d-block">
                                                    {error.deP_CORR_ORIGEN}
                                                </div>
                                            )}
                                        </div>
                                        {/* Especie */}
                                        <div className="mb-1">
                                            <label className="fw-semibold">
                                                Especie
                                            </label>
                                            <select
                                                aria-label="esP_CODIGO"
                                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                                                    } ${error.esP_CODIGO ? "is-invalid" : ""}`}
                                                name="esP_CODIGO"
                                                onChange={handleChange}
                                                value={Traslados.esP_CODIGO}
                                            >
                                                <option value="">Seleccione un origen</option>
                                                {comboTrasladoEspecie.map((traeEspecie) => (
                                                    <option key={traeEspecie.codigo} value={traeEspecie.codigo}>
                                                        {traeEspecie.descripcion}
                                                    </option>
                                                ))}
                                            </select>
                                            {error.esP_CODIGO && (
                                                <div className="invalid-feedback">{error.esP_CODIGO}</div>
                                            )}
                                        </div>
                                        {/* Servicio */}
                                        <div className="mb-1">
                                            <label htmlFor="traS_DET_CORR" className="fw-semibold fw-semibold">Servicio Destino</label>
                                            <select
                                                aria-label="traS_DET_CORR"
                                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.traS_DET_CORR ? "is-invalid" : ""}`}
                                                name="traS_DET_CORR"
                                                onChange={handleChange}
                                                value={Traslados.traS_DET_CORR || 0}
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
                                            {error.traS_DET_CORR && (
                                                <div className="invalid-feedback fw-semibold d-block">
                                                    {error.traS_DET_CORR}
                                                </div>
                                            )}
                                        </div>
                                        {/* Dependencia */}
                                        <div className="mb-1">
                                            <label htmlFor="deP_CORR" className="fw-semibold">Dependencia Destino</label>
                                            <select
                                                aria-label="deP_CORR"
                                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.deP_CORR ? "is-invalid" : ""}`}
                                                name="deP_CORR"
                                                disabled={!Traslados.traS_DET_CORR}
                                                onChange={handleChange}
                                                value={Traslados.deP_CORR || 0}
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
                                            {error.deP_CORR && (
                                                <div className="invalid-feedback fw-semibold d-block">
                                                    {error.deP_CORR}
                                                </div>
                                            )}
                                        </div>
                                        {/* Radios Pendiente implementación */}
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
                                    </Col>
                                </Row>
                            </div>
                        </Collapse>
                    </div>
                    {/* Fila 3 */}
                    <div className={`mb-3 border p-1 rounded-4 ${tieneErroresRecepcion ? "border-danger" : ""}`}>
                        <div className={`mb-3 border p-1 rounded-4 ${isDarkMode ? "darkModePrincipal text-light" : ""}`}>
                            <div className={`d-flex justify-content-between align-items-center m-1 p-3 hover-effect rounded-4 ${isDarkMode ? "bg-transparent text-light" : ""}`} onClick={() => toggleRow("fila3")}>
                                <h5 className="fw-semibold">DATOS DE RECEPCIÓN</h5>
                                {isExpanded.fila3 ? (
                                    <CaretUpFill className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <CaretDown className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                )}
                            </div>
                            <Collapse in={isExpanded.fila3}>
                                <div className="border-top">
                                    <Row className="p-1 row justify-content-center">
                                        <Col md={4}>
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
                                                    <div className="invalid-feedback ">{error.traS_NOM_ENTREGA}</div>
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
                                                    <div className="invalid-feedback ">{error.traS_NOM_AUTORIZA}</div>
                                                )}
                                            </div>
                                        </Col>
                                        {/* <Col> */}
                                        {/* N° de Traslado */}
                                        {/* <div className="mb-1">
                      <label className="fw-semibold">
                        N° de Traslado
                      </label>
                      <p className={`${isDarkMode ? "text-light" : "text-dark"}`}>
                        {Traslados.n_TRASLADO}
                      </p>
                    </div> */}
                                        {/* </Col> */}
                                    </Row>
                                </div>
                            </Collapse>
                        </div>
                    </div>

                    {/* Botón de Validar */}
                    <div className="rounded d-flex justify-content-end m-2">
                        <button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}>
                            Validar
                        </button>
                    </div>
                </div>
            </form >
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    token: state.loginReducer.token,
    comboTrasladoServicio: state.comboTrasladoServicioReducer.comboTrasladoServicio,
    comboEstablecimiento: state.comboEstablecimientoReducer.comboEstablecimiento,
    comboTrasladoEspecie: state.comboTrasladoEspecieReducer.comboTrasladoEspecie,
    comboDependenciaOrigen: state.comboDependenciaOrigenReducer.comboDependenciaOrigen,
    comboDependenciaDestino: state.comboDependenciaDestinoReducer.comboDependenciaDestino,
    aF_CLAVE: state.obtenerInventarioTrasladoReducers.aF_CLAVE,
    af_codigo_generico: state.obtenerInventarioTrasladoReducers.af_codigo_generico,
    seR_CORR: state.obtenerInventarioTrasladoReducers.seR_CORR,
    deP_CORR_ORIGEN: state.obtenerInventarioTrasladoReducers.deP_CORR_ORIGEN,
    esP_CODIGO: state.obtenerInventarioTrasladoReducers.esP_CODIGO,
    marca: state.obtenerInventarioTrasladoReducers.marca,
    modelo: state.obtenerInventarioTrasladoReducers.modelo,
    serie: state.obtenerInventarioTrasladoReducers.serie,
    traS_OBS: state.obtenerInventarioTrasladoReducers.deT_OBS,
    objeto: state.validaApiLoginReducers,
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
    comboTrasladoServicioActions,
    comboEstablecimientoActions,
    comboTrasladoEspecieActions,
    comboDependenciaOrigenActions,
    comboDependenciaDestinoActions,
    registroTrasladoActions,
    obtenerInventarioTrasladoActions
})(RegistrarTraspasos);
