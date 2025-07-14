import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner } from "react-bootstrap";
import { RootState } from "../../store";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { ArrowClockwise, Eraser, Search } from "react-bootstrap-icons";
import MenuInventario from "../Menus/MenuInventario";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";
import { listaInventarioAnularActions } from "../../redux/actions/Inventario/AnularInventario/listaInventarioAnularActions.tsx";
import { anularInventarioActions } from "../../redux/actions/Inventario/AnularInventario/anularInventarioActions";
import { listaAltasActions } from "../../redux/actions/Altas/RegistrarAltas/listaAltasActions.tsx";
interface InventarioCompleto {
    aF_CLAVE: string;
    aF_CODIGO_GENERICO: string;
    seR_NOMBRE: string;
    deP_NOMBRE: string;
    aF_ALTA: string;
    aF_CANTIDAD: number;
    aF_DESCRIPCION: string;
    aF_ESTADO: string;
    aF_ETIQUETA: string;
    aF_FECHA_SOLICITUD: string; // formato ISO string (puedes cambiar a Date si es necesario)
    aF_FECHAFAC: string;
    aF_FINGRESO: string;
    aF_MONTOFACTURA: number;
    aF_NUM_FAC: string;
    aF_OCO_NUMERO_REF: string;
    nrecepcion: string;
    aF_ORIGEN: number;
    origen: string;
    aF_TIPO: string;
    aF_VIDAUTIL: number;
    ctA_NOMBRE: string;
    ctA_COD: string;
    esP_NOMBRE: string;
    esP_CODIGO: number;
    usuariO_CREA: string;
    deT_LOTE: string;
    deT_MARCA: string;
    deT_MODELO: string;
    deT_OBS: string;
    deT_PRECIO: number;
    deT_SERIE: string;
    proV_NOMBRE: string;
    altaS_CORR: number,
    aF_ESTADO_INV: number
}

interface ListaInventarioProps {
    listaInventarioAnular: InventarioCompleto[];
    listaInventarioAnularActions: (af_codigo_generico: string, FechaInicio: string, FechaTermino: string, estabL_CORR: number) => Promise<boolean>;
    anularInventarioActions: (aF_CLAVE: string) => Promise<boolean>;
    listaAltasActions: (fDesde: string, fHasta: string, af_codigo_generico: string, altas_corr: number, establ_corr: number) => Promise<boolean>;
    isDarkMode: boolean;
    nPaginacion: number; //número de paginas establecido desde preferencias
    objeto: Objeto;
}

interface FechasProps {
    fechaInicio: string;
    fechaTermino: string;
}

const AnularInventario: React.FC<ListaInventarioProps> = ({ listaInventarioAnularActions, anularInventarioActions, listaAltasActions, listaInventarioAnular, isDarkMode, nPaginacion, objeto }) => {
    const [error, setError] = useState<Partial<FechasProps> & {}>({});
    const [loading, setLoading] = useState(false);
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [__, setElementoSeleccionado] = useState<FechasProps[]>([]);
    // const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = nPaginacion;

    const [Inventario, setInventario] = useState({
        af_codigo_generico: "",
        fechaInicio: "",
        fechaTermino: "",
    });

    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación para N° de Recepción (debe ser un número)
        if (!Inventario.fechaInicio) tempErrors.fechaInicio = "La Fecha de Inicio es obligatoria.";
        if (!Inventario.fechaTermino) tempErrors.fHasta = "La Fecha de Término es obligatoria.";
        if (Inventario.fechaInicio > Inventario.fechaTermino) tempErrors.fechaInicio = "La fecha no cumple con el rango de busqueda";
        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const listaAuto = async () => {
        if (listaInventarioAnular.length === 0) {
            setLoading(true);
            const resultado = await listaInventarioAnularActions("", "", "", objeto.Roles[0].codigoEstablecimiento);
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
                setLoading(false);
            }
            else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        listaAuto();
    }, [listaInventarioAnularActions, listaInventarioAnular.length]); // Asegúrate de incluir dependencias relevantes

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
    };

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);
        //Si las fechas no estan vacias las valida, de lo contrario solo permite filtrar por codigo de la cuenta
        if (Inventario.fechaTermino != "" && Inventario.fechaInicio != "") {
            if (validate()) {
                resultado = await listaInventarioAnularActions(Inventario.af_codigo_generico, Inventario.fechaInicio, Inventario.fechaTermino, objeto.Roles[0].codigoEstablecimiento);
            }
        }
        else {
            resultado = await listaInventarioAnularActions(Inventario.af_codigo_generico, "", "", objeto.Roles[0].codigoEstablecimiento);
        }

        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin Resultados",
                text: "No se encontraron resultados para la consulta realizada.",
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

    const handleRefrescar = async () => {
        setLoadingRefresh(true); //Finaliza estado de carga
        const resultado = await listaInventarioAnularActions("", "", "", objeto.Roles[0].codigoEstablecimiento);
        if (!resultado) {
            setLoadingRefresh(false);
        } else {
            paginar(1);
            setLoadingRefresh(false);
        }
    };

    const handleLimpiar = () => {
        setInventario((prevInventario) => ({
            ...prevInventario,
            fechaInicio: "",
            fechaTermino: "",
            af_codigo_generico: ""
        }));
    };

    const handleAnular = async (index: number, aF_CLAVE: string, aF_CODIGO_GENERICO: string) => {
        setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));
        const item = listaInventarioAnular.find((i) => i.aF_CLAVE === aF_CLAVE);
        // const selectedIndices = filasSeleccionadas.map(Number);
        // const activosSeleccionados = selectedIndices.map((index) => {
        //     return {
        //         aF_CLAVE: listaInventarioAnular[index].aF_CLAVE,
        //     };
        // });
        if (item && item.aF_ALTA !== "S") {

            const result = await Swal.fire({
                icon: "info",
                title: "Anular Registro",
                text: `Confirma anular el registro Nº ${aF_CODIGO_GENERICO}`,
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Confirmar y Anular",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });

            if (result.isConfirmed) {
                const resultado = await anularInventarioActions(aF_CLAVE);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Registro anulado",
                        text: `Se ha anulado el registro Nº ${aF_CODIGO_GENERICO}.`,
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                    listaAltasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
                    handleBuscar();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: ":'(",
                        text: `Hubo un problema al anular el registro ${aF_CLAVE}.`,
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                }
            }
        }
        else {
            Swal.fire({
                icon: "warning",
                title: "Inventario con Alta",
                text: `El inventario ${aF_CODIGO_GENERICO} no puede ser anulado porque ya está dado de alta.`,
                showDenyButton: false,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: "Cerrar",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
        }

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
    //     } else {
    //         setFilasSeleccionadas([]);
    //     }
    // };

    // Lógica de Paginación actualizada
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () =>
            listaInventarioAnular.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaInventarioAnular, indicePrimerElemento, indiceUltimoElemento]
    );
    // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
    const totalPaginas = Array.isArray(listaInventarioAnular)
        ? Math.ceil(listaInventarioAnular.length / elementosPorPagina)
        : 0;
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);
    return (
        <Layout>
            <Helmet>
                <title>Anular Inventario</title>
            </Helmet>
            <MenuInventario />
            <form>
                <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                    <h3 className="form-title fw-semibold border-bottom p-1">
                        Anular Inventario
                    </h3>
                    <Row className="border rounded p-2 m-2">
                        <Col md={3}>
                            <div className="mb-2">
                                <div className="flex-grow-1 mb-2">
                                    <label htmlFor="fechaInicio" className="form-label fw-semibold small">Desde</label>
                                    <div className="input-group">
                                        <input
                                            aria-label="Fecha Desde"
                                            type="date"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaInicio ? "is-invalid" : ""}`}
                                            name="fechaInicio"
                                            onChange={handleChange}
                                            value={Inventario.fechaInicio}
                                            max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                                        />
                                    </div>
                                    {error.fechaInicio && <div className="invalid-feedback d-block">{error.fechaInicio}</div>}
                                </div>

                                <div className="flex-grow-1">
                                    <label htmlFor="fechaTermino" className="form-label fw-semibold small">Hasta</label>
                                    <div className="input-group">
                                        <input
                                            aria-label="Fecha Hasta"
                                            type="date"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaTermino ? "is-invalid" : ""}`}
                                            name="fechaTermino"
                                            onChange={handleChange}
                                            value={Inventario.fechaTermino}
                                            max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                                        />
                                    </div>
                                    {error.fechaTermino && <div className="invalid-feedback d-block">{error.fechaTermino}</div>}

                                </div>
                                <small className="fw-semibold">Filtre los resultados por fecha de recepción.</small>
                            </div>
                        </Col>

                        <Col md={3}>
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
                            </div>
                        </Col>

                        <Col md={5}>
                            <div className="mb-1 mt-4">
                                <Button onClick={handleBuscar}
                                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                                    className="mx-1 mb-1"
                                    disabled={loading}>
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
                                <Button onClick={handleRefrescar}
                                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                                    className="mx-1 mb-1"
                                    disabled={loadingRefresh}>
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
                                <Button onClick={handleLimpiar}
                                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                                    className="mx-1 mb-1">
                                    Limpiar
                                    <Eraser className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    {/* Tabla*/}

                    {loading ? (
                        <>
                            <SkeletonLoader rowCount={elementosPorPagina} />
                        </>
                    ) : (
                        <div className='skeleton-table table-responsive'>
                            {elementosActuales.length > 0 && (
                                <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                                    <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                                        <tr>
                                            {/* <th style={{
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 2
                                            }}>
                                                <Form.Check
                                                    className="check-danger"
                                                    type="checkbox"
                                                    onChange={handleSeleccionaTodos}
                                                    checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                                />
                                            </th> */}
                                            <th scope="col" className="text-nowrap">Estado</th>
                                            <th scope="col" className="text-nowrap">Nº Inventario</th>
                                            <th scope="col" className="text-nowrap">Descripción</th>
                                            <th scope="col" className="text-nowrap">Fecha</th>
                                            <th scope="col" className="text-nowrap">Servicio</th>
                                            <th scope="col" className="text-nowrap">Dependencia</th>
                                            <th scope="col" className="text-nowrap">Especie</th>
                                            <th scope="col" className="text-nowrap">Precio</th>
                                            <th scope="col" className="text-nowrap">Vida Útil</th>
                                            <th scope="col" className="text-nowrap">Origen</th>
                                            <th scope="col" className="text-nowrap">Nº Recepción</th>
                                            <th scope="col" className="text-nowrap">Nº Cta</th>
                                            <th scope="col" className="text-nowrap">Orden de Compra</th>
                                            <th scope="col" className="text-nowrap">Marca</th>
                                            <th scope="col" className="text-nowrap">Modelo</th>
                                            <th scope="col" className="text-nowrap">Serie</th>
                                            <th scope="col" className="text-nowrap" style={{
                                                position: 'sticky',
                                                right: 0,
                                            }}>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elementosActuales.map((lista, index) => {
                                            // const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                            return (
                                                <tr key={index}>
                                                    {/* <td style={{ position: 'sticky', left: 0, zIndex: 2 }}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            onChange={() => setSeleccionaFilas(indexReal)}
                                                            checked={filasSeleccionadas.includes(indexReal.toString())}
                                                        />
                                                    </td> */}
                                                    <td className="text-nowrap">
                                                        {lista.aF_ESTADO_INV === 1 ? <span className="badge bg-primary  w-100">Sin Alta</span>
                                                            : lista.aF_ESTADO_INV === 2 ? <span className="badge bg-success  w-100">Dado de Alta</span>
                                                                : lista.aF_ESTADO_INV === 3 ? <span className="badge bg-danger  w-100">Dado de Baja</span> : <span>-</span>}
                                                    </td>
                                                    <td className="text-start">{lista.aF_CODIGO_GENERICO}</td>
                                                    <td className="text-start">{lista.aF_DESCRIPCION}</td>
                                                    <td className="text-start">{lista.aF_FINGRESO == "" ? "Sin fecha" : lista.aF_FINGRESO}</td>
                                                    <td className="text-start">{lista.seR_NOMBRE}</td>
                                                    <td className="text-start">{lista.deP_NOMBRE}</td>
                                                    <td className="text-start">{lista.esP_NOMBRE}</td>
                                                    <td className="text-start">
                                                        ${lista.deT_PRECIO?.toLocaleString("es-ES", { minimumFractionDigits: 0 })}</td>
                                                    <td className="text-start">{lista.aF_VIDAUTIL}</td>

                                                    <td className="text-start">{lista.origen.charAt(0).toUpperCase() + lista.origen.slice(1).toLocaleLowerCase() || "S/N  "}</td>
                                                    <td className="text-start">{lista.nrecepcion || "S/N"}</td>
                                                    <td className="text-start">{lista.ctA_COD}</td>
                                                    <td className="text-start">{lista.aF_OCO_NUMERO_REF}</td>
                                                    <td className="text-start">{!lista.deT_MARCA ? "-" : lista.deT_MARCA}</td>
                                                    <td className="text-start">{!lista.deT_MODELO ? "-" : lista.deT_MODELO}</td>
                                                    <td className="text-start">{!lista.deT_SERIE ? "-" : lista.deT_SERIE}</td>
                                                    < td style={{
                                                        position: 'sticky',
                                                        right: 0
                                                    }}>
                                                        {lista.aF_ESTADO_INV != 1 ? (
                                                            <Button
                                                                variant="outline-danger"
                                                                className="fw-semibold"
                                                                size="sm"
                                                                disabled
                                                            >
                                                                Anular
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline-danger"
                                                                className="fw-semibold"
                                                                size="sm"
                                                                onClick={() => handleAnular(index, lista.aF_CLAVE, lista.aF_CODIGO_GENERICO)}
                                                            >
                                                                Anular
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* Paginador */}
                    {elementosActuales.length > 0 && (
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
                    )}
                </div>
            </form>
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaInventarioAnular: state.listaInventarioAnularReducers.listaInventarioAnular,
    isDarkMode: state.darkModeReducer.isDarkMode,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion,
    objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
    listaInventarioAnularActions,
    anularInventarioActions,
    listaAltasActions
})(AnularInventario);
