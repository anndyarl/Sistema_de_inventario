import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button, Spinner, Pagination, Modal, Form } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import { RootState } from "../../store";
import { ArrowLeftRight, Eye, QrCodeScan } from "react-bootstrap-icons";
import "../../styles/Traslados.css"
import Swal from "sweetalert2";
import { Objeto } from "../Navegacion/Profile";
import { Helmet } from "react-helmet-async";
import MenuTraslados from "../Menus/MenuTraslados";
import { DEPENDENCIA } from "./RegistrarInventario/DatosCuenta";
import { comboEstablecimientoActions } from "../../redux/actions/Traslados/Combos/comboEstablecimientoActions";
import { comboTrasladoServicioActions } from "../../redux/actions/Traslados/Combos/comboTrasladoServicioActions";
import { comboTrasladoEspecieActions } from "../../redux/actions/Traslados/Combos/comboTrasladoEspecieActions";
import { comboDependenciaOrigenActions } from "../../redux/actions/Traslados/Combos/comboDependenciaoOrigenActions";
import { comboDependenciaDestinoActions } from "../../redux/actions/Traslados/Combos/comboDependenciaDestinoActions";
import { obtenerInventarioTrasladoActions } from "../../redux/actions/Traslados/obtenerInventarioTrasladoActions";
import { listadoDeEspeciesBienActions } from "../../redux/actions/Inventario/Combos/listadoDeEspeciesBienActions";
import SkeletonLoader from "../Utils/SkeletonLoader";
import { registroTrasladoMultipleActions } from "../../redux/actions/Informes/Principal/FolioPorServicioDependencia/registroTrasladoMultipleActions";
import { comboServicioInformeActions } from "../../redux/actions/Informes/Principal/FolioPorServicioDependencia/comboServicioInformeActions";
import { comboEspeciesBienActions } from "../../redux/actions/Inventario/Combos/comboEspeciesBienActions";
import { listadoTrasladosActions } from "../../redux/actions/Traslados/listadoTrasladosActions";
import { Html5QrcodeScanner } from "html5-qrcode";

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


/*-----Tabla principal------*/
interface ListaATrasladar {
    aF_CLAVE: number;
    aF_CODIGO_GENERICO: string;
    deT_OBS: string;
    esP_NOMBRE: string;
    deP_CORR_ORIGEN: number;
}

/*----Tabla Modal---*/
export interface ListaTrasladoSeleccion {
    aF_CLAVE: string;
    aF_CODIGO_GENERICO: string;
    altaS_CORR: number;
    deT_OBS: string;
    serviciO_DEPENDENCIA: string;
    esP_NOMBRE: string;
    deT_MARCA: string;
    deT_MODELO: string;
    deT_SERIE: string;
    deP_CORR_ORIGEN: number;
}

interface TrasladosProps {
    registroTrasladoMultipleActions: (FormularioTraslado: Record<string, any>) => Promise<boolean>
    comboTrasladoServicio: TRASLADOSERVICIO[];
    comboTrasladoServicioActions: (establ_corr: number) => void;
    comboDependenciaOrigen: DEPENDENCIA[];
    comboDependenciaOrigenActions: (comboServicioOrigen: string) => void; // Nueva prop para pasar el servicio seleccionado   
    obtenerInventarioTrasladoActions: (aF_CODIGO_GENERICO: string, altaS_CORR: number, esP_CODIGO: string, deP_CORR: number, deT_MARCA: string, deT_MODELO: string, deT_SERIE: string) => Promise<boolean>
    listaTrasladoSeleccion: ListaTrasladoSeleccion[];
    comboServicioInformeActions: (establ_corr: number) => void;//En buscador    
    listadoTrasladosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number) => Promise<boolean>;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
}


const TomaInventarioQR: React.FC<TrasladosProps> = ({
    comboTrasladoServicioActions,
    comboDependenciaOrigenActions,
    obtenerInventarioTrasladoActions,
    comboTrasladoServicio,
    comboDependenciaOrigen,
    listaTrasladoSeleccion,
    objeto,
    token,
    isDarkMode }) => {
    const [loading, setLoadingScan] = useState(false);
    const [loadingBuscar, _] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalLevantamiento, setMostrarModalLevantamiento] = useState(false);

    const [paginaActual, setPaginaActual] = useState(1);
    const [paginaActual1, setPaginaActual1] = useState(1);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [filasSeleccionadasLevantamiento, setfilasSeleccionadasLevantamiento] = useState<string[]>([]);
    const [activosFijos, setActivosFijos] = useState<ListaATrasladar[]>([]);
    const [mostrarScanner, setMostrarScanner] = useState(false);
    const [Paginacion, setPaginacion] = useState({
        nPaginacion: 10
    });
    const elementosPorPagina = Paginacion.nPaginacion;

    const [Paginacion1, setPaginacion1] = useState({
        nPaginacion1: 10
    });
    const elementosPorPagina1 = Paginacion1.nPaginacion1;

    const [Scan, setScan] = useState({
        aF_CODIGO_GENERICO: "",
        seR_CORR: 0,
        deP_CORR_ORIGEN: 0
    });


    useEffect(() => {
        if (token) {
            // Verifica si las acciones ya fueron disparadas
            if (comboTrasladoServicio.length === 0) comboTrasladoServicioActions(objeto.Roles[0].codigoEstablecimiento);
            if (comboDependenciaOrigen.length === 0) comboDependenciaOrigenActions("");
        }
    }, [comboTrasladoServicioActions,
        comboEstablecimientoActions,
        comboTrasladoEspecieActions,
        listaTrasladoSeleccion]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Validación específica para af_codigo_generico: solo permitir números
        if (name === "aF_CODIGO_GENERICO" && !/^[0-9]*$/.test(value)) {
            return; // Salir si contiene caracteres no numéricos
        }
        // Convierte `value` a número
        let newValue: string | number = ["deP_CORR_ORIGEN", "deP_CORR", "n_TRASLADO", "seR_CORR"].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setScan((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        setPaginacion((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setPaginacion1((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === "seR_CORR") {
            comboDependenciaOrigenActions(value);
        }
        if (name === "traS_DET_CORR") {
            comboDependenciaDestinoActions(value);
        }

    };

    /*-------------Tabla Modal-------------------*/
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

    const setSeleccionaFilas = (index: number) => {
        setFilasSeleccionadas((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
    };

    const handleAgregarSeleccionados = async () => {
        const selectedIndices = filasSeleccionadas.map(Number);
        const activosSeleccionados = selectedIndices.map((index) => {
            return {
                aF_CLAVE: parseInt(listaTrasladoSeleccion[index].aF_CLAVE),
                aF_CODIGO_GENERICO: listaTrasladoSeleccion[index].aF_CODIGO_GENERICO,
                deT_OBS: listaTrasladoSeleccion[index].deT_OBS,
                esP_NOMBRE: listaTrasladoSeleccion[index].esP_NOMBRE,
                deP_CORR_ORIGEN: listaTrasladoSeleccion[index].deP_CORR_ORIGEN
            };
        });

        const result = await Swal.fire({
            icon: "info",
            title: "Agregar articulo",
            text: `Confirme para agregar`,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Confirmar y Agregar",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
                popup: "custom-border", // Clase personalizada para el borde
            }
        });

        // Verificar duplicados antes de mostrar la confirmación
        const duplicados = activosSeleccionados.filter(activo =>
            activosFijos.some(existente => existente.aF_CLAVE === activo.aF_CLAVE)
        );

        if (result.isConfirmed) {
            if (duplicados.length > 0) {
                // Crear la tabla HTML con los duplicados
                const tablaHTML = `
            <div style="max-height: 300px; overflow-y: auto;">
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: ${isDarkMode ? '#333' : '#f5f5f5'};">
                    <th style="padding: 8px; border: 1px solid;  ${isDarkMode ? '#555' : '#ddd'}; text-align: center;">Nº Inventario</th>
                    <th style="padding: 8px; border: 1px solid;  ${isDarkMode ? '#555' : '#ddd'}; text-align: center;">Especie</th>
                  </tr>
                </thead>
                <tbody>
                  ${duplicados.map(item => `
                    <tr>
                      <td style="padding: 8px; border: 1px solid; text-align: center; width: 145px; ${isDarkMode ? '#555' : '#ddd'};">${item.aF_CODIGO_GENERICO}</td>
                      <td style="padding: 8px; border: 1px solid; text-align: center; width: 200px; ${isDarkMode ? '#555' : '#ddd'};">${item.esP_NOMBRE || 'Sin descripción'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
                Swal.fire({
                    icon: "warning",
                    title: "Artículos duplicados",
                    html: `<p>Los siguientes artículos ya están agregados:</p>${tablaHTML}`,
                    confirmButtonText: "Entendido",
                    background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "#000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                    width: '600px',
                    customClass: {
                        popup: "custom-border",
                    }
                });
                setFilasSeleccionadas([]);
                return;
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Artículos Agregados",
                    html: `Articulos agregados con exito!`,
                    confirmButtonText: "Cerrar",
                    background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "#000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                    width: '600px',
                    customClass: {
                        popup: "custom-border",
                    }
                });
                setActivosFijos((prev) => [...prev, ...activosSeleccionados]);
                setFilasSeleccionadas([]);
                paginar1(1);
                // setMostrarModal(false);
            }
        }
    }
    /*-------------Tabla Activos Seleccionados-------------------*/
    const handleSeleccionaTodosLevantamiento = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setfilasSeleccionadasLevantamiento(
                elementosActuales1.map((_, index) =>
                    (indicePrimerElemento1 + index).toString()
                )
            );
            // console.log("filas Seleccionadas ", filasSeleccionadas);
        } else {
            setfilasSeleccionadasLevantamiento([]);
        }
    };

    const setSeleccionaFilasLevantamiento = (index: number) => {
        setfilasSeleccionadasLevantamiento((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
    };

    const handleQuitarSeleccionados = () => {
        // Convertir los índices seleccionados a números
        const selectedIndices = filasSeleccionadasLevantamiento.map(Number);
        // Filtrar los activos y eliminar los seleccionados
        setActivosFijos((prev) => {
            const actualizados = prev.filter((_, index) => !selectedIndices.includes(index));
            return actualizados;
        });
        // Limpiar las filas seleccionadas
        setfilasSeleccionadasLevantamiento([]);
        paginar1(1);
    };

    const handleScan = () => {
        setMostrarScanner(true);
    };

    useEffect(() => {
        if (!mostrarScanner) return;

        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);

        scanner.render(
            (decodedText) => {
                // 👉 Aquí manejas el texto escaneado
                setMostrarScanner(false); // Oculta el escáner
                handleScanResult(decodedText);
                scanner.clear().catch(console.error);
            },
            (error) => {
                console.warn("QR no detectado:", error);
            }
        );

        return () => {
            scanner.clear().catch(console.error);
        };
    }, [mostrarScanner]);

    const handleScanResult = async (text: string) => {
        let resultado = false;
        // Extrae el número después de "Cod. Bien:"
        const match = text.match(/Cod\. Bien:\s*(\d+)/);
        const codigoExtraido = match ? match[1] : null;

        if (codigoExtraido) {
            console.log("Código:", codigoExtraido);

            resultado = await obtenerInventarioTrasladoActions(codigoExtraido, 0, "", 0, "", "", "");
            if (!resultado) {
                Swal.fire({
                    icon: "warning",
                    title: "Sin Resultados",
                    text: "No hay registros disponibles para mostrar.",
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                    customClass: {
                        popup: "custom-border", // Clase personalizada para el borde
                    }
                });
                setLoadingScan(false);
            } else {
                paginar(1);
                setMostrarModal(true);
                setLoadingScan(false); //Finaliza estado de carga     
            }

        } else {
            console.warn("No se encontró el código en el QR escaneado");
        }
    };

    /*-----------------------Tabla Resultado de busqueda----------------------*/
    // Lógica de Paginación actualizada 
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaTrasladoSeleccion.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaTrasladoSeleccion, indicePrimerElemento, indiceUltimoElemento]);

    const totalPaginas = Array.isArray(listaTrasladoSeleccion)
        ? Math.ceil(listaTrasladoSeleccion.length / elementosPorPagina) : 0;
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    /*-----------------------Tabla Selecciones a Trasladar----------------------*/

    // Lógica de Paginación actualizada 
    const indiceUltimoElemento1 = paginaActual1 * elementosPorPagina1;
    const indicePrimerElemento1 = indiceUltimoElemento1 - elementosPorPagina1;
    const elementosActuales1 = useMemo(
        () => activosFijos.slice(indicePrimerElemento1, indiceUltimoElemento1),
        [activosFijos, indicePrimerElemento1, indiceUltimoElemento1]);

    const totalPaginas1 = Array.isArray(activosFijos)
        ? Math.ceil(activosFijos.length / elementosPorPagina1) : 0;
    const paginar1 = (numeroPagina1: number) => setPaginaActual1(numeroPagina1);

    const dependencia = comboDependenciaOrigen.find(
        (f) => f.codigo === Scan.deP_CORR_ORIGEN
    );
    return (
        <Layout>
            <Helmet>
                <title>Registrar Traslados</title>
            </Helmet>
            <MenuTraslados />

            <div className={`border p-4 rounded ${isDarkMode ? "darkModePrincipal border-secondary" : ""}`}>
                <h3 className="form-title fw-semibold border-bottom p-1 mb-3 text-center">Levantamiento Fisico</h3>
                <Row className="p-1 mb-5 row justify-content-center ">
                    <h6 className="fw-semibold">SELECCIONAR DEPENDENCIA</h6>
                    <Col md={4} mb={5}>
                        {/* servicio */}
                        <div className="mb-1">
                            <label htmlFor="seR_CORR" className="fw-semibold fw-semibold">Servicio</label>
                            <select
                                aria-label="seR_CORR"
                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="seR_CORR"
                                onChange={handleChange}
                                value={Scan.seR_CORR}
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
                        </div>
                        {/* Dependencia */}
                        <div className="mb-5">
                            <label htmlFor="deP_CORR_ORIGEN" className="fw-semibold">Dependencia</label>
                            <select
                                aria-label="deP_CORR_ORIGEN"
                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="deP_CORR_ORIGEN"
                                onChange={handleChange}
                                value={Scan.deP_CORR_ORIGEN}
                                disabled={!Scan.seR_CORR}
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

                        </div>
                        <div className="mb-1 d-flex justify-content-center">
                            <Button
                                onClick={handleScan}
                                variant="primary"
                                className={`btn w-100 ${isDarkMode ? "btn-secondary" : "btn-primary"} `}
                            >
                                {loadingBuscar ? (
                                    <Spinner as="span" animation="border" size="sm" />
                                ) : (
                                    <QrCodeScan className={"flex-shrink-0 h-5 w-5 mb-1 me-1"} />
                                )}
                                {"Scanear"}
                            </Button>
                        </div>

                        {activosFijos.length > 0 && (
                            <div className="mb-1 d-flex justify-content-center">
                                <Button
                                    onClick={() => setMostrarModalLevantamiento(true)}
                                    variant="primary"
                                    className={`btn w-100 ${isDarkMode ? "btn-secondary" : "btn-primary"} `}
                                >
                                    {loadingBuscar ? (
                                        <Spinner as="span" animation="border" size="sm" />
                                    ) : (
                                        <Eye className={"flex-shrink-0 h-5 w-5 mb-1 me-1"} />
                                    )}
                                    {`Ver ${activosFijos.length} Levantamiento`}
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>

            {/* Modal lista seleccion inventarios */}
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}
                size="xl"
                dialogClassName="draggable-modal"
                // scrollable={false}
                backdrop="static" // Evita que se cierre al hacer clic afuera
                keyboard={false}
            >
                <Modal.Header className={`modal-header`} closeButton>
                    <Modal.Title className="fw-semibold">Resultado Busqueda</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <div className="bg-white shadow-sm sticky-top p-3">
                        <Row>
                            <Col md={6}>
                                {listaTrasladoSeleccion.length > 10 && (
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
                                            {[10, 25, 50, 75, 100, listaTrasladoSeleccion.length].map((val) => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </Col>
                            <Col md={6} className="d-flex justify-content-end">
                                {filasSeleccionadas.length > 0 ? (
                                    <Button
                                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                                        onClick={handleAgregarSeleccionados}
                                        className="m-1 p-2 d-flex align-items-center">
                                        Agregar
                                        <span className="badge bg-light text-dark mx-1 mt-1">
                                            {filasSeleccionadas.length}
                                        </span>
                                    </Button>
                                ) : (
                                    <strong className="alert alert-dark border m-1 p-2 mx-2">
                                        No hay filas seleccionadas
                                    </strong>
                                )}
                            </Col>
                        </Row>
                    </div>
                    {/* Tabla activos*/}
                    <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="mt-2">
                        {/* Tabla*/}
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
                                                <th style={{ position: 'sticky', left: 0 }}>
                                                    <Form.Check
                                                        className="check-danger"
                                                        type="checkbox"
                                                        onChange={handleSeleccionaTodos}
                                                        checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                                    />
                                                </th>
                                                <th scope="col" className="text-nowrap text-center">Código</th>
                                                <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                                                <th scope="col" className="text-nowrap text-center">Nº Alta</th>
                                                <th scope="col" className="text-nowrap text-center">Descripción</th>
                                                <th scope="col" className="text-nowrap text-center">Dependencia	Serv/Depto</th>
                                                <th scope="col" className="text-nowrap text-center">Especie</th>
                                                <th scope="col" className="text-nowrap text-center">Marca</th>
                                                <th scope="col" className="text-nowrap text-center">Modelo</th>
                                                <th scope="col" className="text-nowrap text-center">Serie</th>
                                                <th scope="col" className="text-nowrap text-center">Código Dependencia</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {elementosActuales.map((lista, index) => {
                                                const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                                return (
                                                    <tr key={index}>
                                                        <td style={{ position: 'sticky', left: 0 }}>
                                                            <Form.Check
                                                                type="checkbox"
                                                                onChange={() => setSeleccionaFilas(indexReal)}
                                                                checked={filasSeleccionadas.includes(indexReal.toString())}
                                                            />
                                                        </td>
                                                        <td className="text-nowrap text-center">{lista.aF_CLAVE}</td>
                                                        <td className="text-nowrap text-center">{lista.aF_CODIGO_GENERICO}</td>
                                                        <td className="text-nowrap text-center">{lista.altaS_CORR}</td>
                                                        <td className="text-nowrap text-center">{lista.deT_OBS}</td>
                                                        <td className="text-nowrap text-center">{lista.serviciO_DEPENDENCIA}</td>
                                                        <td className="text-nowrap text-center">{lista.esP_NOMBRE}</td>
                                                        <td className="text-nowrap text-center">{lista.deT_MARCA}</td>
                                                        <td className="text-nowrap text-center">{lista.deT_MODELO}</td>
                                                        <td className="text-nowrap text-center">{lista.deT_SERIE}</td>
                                                        <td className="text-nowrap text-center">{lista.deP_CORR_ORIGEN}</td>
                                                    </tr>
                                                );
                                            })}
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
                </Modal.Body>
            </Modal>

            {/*  */}
            < Modal show={mostrarModalLevantamiento} onHide={() => setMostrarModalLevantamiento(false)}
                size="lg"
                dialogClassName="modal-right"
                backdrop="static"
            //  keyboard={false}  // Evita el cierre al presionar la tecla Esc
            >
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title className="fw-semibold">
                        Nº Levantamiento: {activosFijos.length}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    {activosFijos.length === 0 ? (
                        <p className="d-flex justify-content-center m-1 p-1 ">
                            Seleccione artículos de la búsqueda para incluirlos aquí
                        </p>
                    ) : (
                        <div className={`border p-4 rounded ${isDarkMode ? "darkModePrincipal border-secondary" : ""}`}>

                            <p className="fw-semibold border-bottom fs-4">{dependencia ? dependencia.nombrE_ORD : "—"}</p>
                            <p className="mb-4 fs-05em text-start">(Dependencia del levantamiento) </p>
                            <Row className="p-1 row justify-content-center ">
                                <Col md={8}>
                                    <div className="d-flex justify-content-end">
                                        {/* Boton elimina filas seleccionadas */}
                                        {filasSeleccionadasLevantamiento.length > 0 && (
                                            <Button
                                                variant="danger"
                                                onClick={handleQuitarSeleccionados}
                                                className="mb-1 p-2 mx-1"  // Alinea el spinner y el texto
                                            >
                                                <ArrowLeftRight className="flex-shrink-0 h-5 w-5 mx-1 mb-1" aria-hidden="true" />
                                                {" Quitar "}
                                                <span className="badge bg-light text-dark mx-1 mb-1">
                                                    {filasSeleccionadasLevantamiento.length}
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                    <div className='table-responsive'>
                                        <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                                            <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                                                <tr>
                                                    <th>
                                                        <Form.Check
                                                            type="checkbox"
                                                            className="text-center"
                                                            onChange={handleSeleccionaTodosLevantamiento}
                                                            checked={filasSeleccionadasLevantamiento.length === elementosActuales1.length && elementosActuales1.length > 0}
                                                        />
                                                    </th>
                                                    <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                                                    <th scope="col" className="text-nowrap text-center">Descripción</th>
                                                    <th scope="col" className="text-nowrap text-center">Especie</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {elementosActuales1.map((lista, index) => {
                                                    let indexReal = indicePrimerElemento1 + index; // Índice real basado en la página
                                                    return (
                                                        <tr key={indexReal}>
                                                            <td className="text-center">
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    onChange={() => setSeleccionaFilasLevantamiento(indexReal)}
                                                                    checked={filasSeleccionadasLevantamiento.includes(indexReal.toString())}
                                                                />
                                                            </td>
                                                            <td className="text-nowrap">{lista.aF_CODIGO_GENERICO}</td>
                                                            <td className="text-nowrap">{lista.deT_OBS}</td>
                                                            <td className="text-nowrap">{lista.esP_NOMBRE}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Paginador */}
                                    <div className="paginador-container position-relative z-0">
                                        <Pagination className="paginador-scroll ">
                                            <Pagination.First
                                                onClick={() => paginar1(1)}
                                                disabled={paginaActual1 === 1}
                                            />
                                            <Pagination.Prev
                                                onClick={() => paginar1(paginaActual1 - 1)}
                                                disabled={paginaActual1 === 1}
                                            />

                                            {Array.from({ length: totalPaginas1 }, (_, i) => (
                                                <Pagination.Item
                                                    key={i + 1}
                                                    active={i + 1 === paginaActual1}
                                                    onClick={() => paginar1(i + 1)}
                                                >
                                                    {i + 1} {/* adentro de aqui esta page-link */}
                                                </Pagination.Item>
                                            ))}
                                            <Pagination.Next
                                                onClick={() => paginar1(paginaActual1 + 1)}
                                                disabled={paginaActual1 === totalPaginas1}

                                            />
                                            <Pagination.Last
                                                onClick={() => paginar1(totalPaginas1)}
                                                disabled={paginaActual1 === totalPaginas1}

                                            />
                                        </Pagination>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
            </Modal >

            {mostrarScanner && <div id="reader" style={{ width: "100%" }} />}
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
    listaTrasladoSeleccion: state.obtenerInventarioTrasladoReducers.listaTrasladoSeleccion,
    objeto: state.validaApiLoginReducers,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboEspecies: state.comboEspeciesBienReducers.comboEspecies,
    comboServicioInforme: state.comboServicioInformeReducers.comboServicioInforme,
    listaSalidaTraslados: state.datosTrasladoRegistradoReducers.listaSalidaTraslados
});

export default connect(mapStateToProps, {
    registroTrasladoMultipleActions,
    comboTrasladoServicioActions,
    comboEstablecimientoActions,
    comboTrasladoEspecieActions,
    comboDependenciaOrigenActions,
    comboDependenciaDestinoActions,
    comboServicioInformeActions,
    comboEspeciesBienActions,
    obtenerInventarioTrasladoActions,
    listadoDeEspeciesBienActions,
    listadoTrasladosActions
})(TomaInventarioQR);
