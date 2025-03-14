import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner, Form } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { Search } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import MenuListados from "../../Menus/MenuListados";
import Layout from "../../../containers/hocs/layout/Layout";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { listaAltasActions } from "../../../redux/actions/Altas/AnularAltas/listaAltasActions";
import { RootState } from "../../../store";
import { obtenerListaAltasActions } from "../../../redux/actions/Altas/AnularAltas/obtenerListaAltasActions";
import Select from "react-select";
import { comboCuentasInformeActions } from "../../../redux/actions/Informes/Listados/comboCuentasInformeActions";

const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};
interface FechasProps {
    fechaInicio: string;
    fechaTermino: string;
}
export interface ListaAltas {
    aF_CLAVE: number,
    ninv: string,
    serv: string,
    dep: string,
    esp: string,
    ncuenta: string,
    marca: string,
    modelo: string,
    serie: string,
    precio: string,
    mrecepcion: string
}
interface ComboCuentas {
    codigo: string;
    descripcion: string;
}

interface DatosAltas {
    listaAltas: ListaAltas[];
    listaAltasActions: () => Promise<boolean>;
    obtenerListaAltasActions: (FechaInicio: string, FechaTermino: string) => Promise<boolean>;
    comboCuentasInformeActions: () => void;
    token: string | null;
    isDarkMode: boolean;
    comboCuentasInforme: ComboCuentas[];
}

const CuentaFechas: React.FC<DatosAltas> = ({ listaAltas, comboCuentasInforme, listaAltasActions, obtenerListaAltasActions, comboCuentasInformeActions, token, isDarkMode }) => {
    const [error, setError] = useState<Partial<FechasProps> & {}>({});
    const [loading, setLoading] = useState(false); // Estado para controlar la carga 
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 12;

    const cuentasOptions = comboCuentasInforme.map((item) => ({
        value: item.codigo.toString(),
        label: item.descripcion,
    }));

    const [Inventario, setInventario] = useState({
        fechaInicio: "",
        fechaTermino: "",
        ctA_NOMBRE: '',
    });
    const listaAltasAuto = async () => {
        if (token) {
            if (listaAltas.length === 0) {
                setLoading(true);
                const resultado = await listaAltasActions();
                if (resultado) {
                    setLoading(false);
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `Error en la solicitud. Por favor, recargue nuevamente la página.`,
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                }
            }
        }
    };

    useEffect(() => {
        listaAltasAuto();
        if (comboCuentasInforme.length === 0) { comboCuentasInformeActions() }
    }, [listaAltasActions, token, listaAltas.length]); // Asegúrate de incluir dependencias relevantes

    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación para N° de Recepción (debe ser un número)
        if (!Inventario.fechaInicio) tempErrors.fechaInicio = "La Fecha de Inicio es obligatoria.";
        if (!Inventario.fechaTermino) tempErrors.fechaTermino = "La Fecha de Término es obligatoria.";
        if (Inventario.fechaInicio > Inventario.fechaTermino) tempErrors.fechaInicio = "La fecha de inicio es mayor a la fecha de término";
        // if (!Inventario.nInventario) tempErrors.nInventario = "La Fecha de Inicio es obligatoria.";


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
        setInventario((prevMantenedor) => ({ ...prevMantenedor, ctA_NOMBRE: value }));
    }

    // const handleBuscarAltas = async () => {
    //     let resultado = false;
    //     setLoading(true);
    //     resultado = await obtenerAltasPorCorrActions(Inventario);
    //     if (Inventario.fechaInicio != "" && Inventario.fechaTermino != "") {
    //         if (validate()) {
    //             resultado = await obtenerListaAltasActions(Inventario.fechaInicio, Inventario.fechaTermino);
    //         }
    //     }
    //     setInventario((prevState) => ({
    //         ...prevState,
    //         aF_CLAVE: 0,
    //         fechaInicio: "",
    //         fechaTermino: ""
    //     }));
    //     setError({});
    //     if (!resultado) {
    //         Swal.fire({
    //             icon: "error",
    //             title: ":'(",
    //             text: "No se encontraron resultados, inténte otro registro.",
    //             confirmButtonText: "Ok",
    //             background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //             color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //             confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
    //             customClass: {
    //                 popup: "custom-border", // Clase personalizada para el borde
    //             }
    //         });
    //         setLoading(false); //Finaliza estado de carga
    //         return;
    //     } else {
    //         setLoading(false); //Finaliza estado de carga
    //     }

    // };

    const setSeleccionaFilas = (index: number) => {
        setFilasSeleccionadas((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
        // console.log("indices seleccionmados", index);
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

    // Lógica de Paginación actualizada
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () =>
            listaAltas.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaAltas, indicePrimerElemento, indiceUltimoElemento]
    );
    // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
    const totalPaginas = Array.isArray(listaAltas)
        ? Math.ceil(listaAltas.length / elementosPorPagina)
        : 0;
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    return (
        <Layout>
            <Helmet>
                <title>Reporte articulos por cuentas</title>
            </Helmet>
            <MenuListados />
            <form>
                <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                    <h3 className="form-title fw-semibold border-bottom p-1">Reporte articulos por cuentas</h3>
                    <Row>
                        <Col md={3}>
                            <div className="mb-1">
                                <label htmlFor="fechaInicio" className="fw-semibold">Desde</label>
                                <input
                                    aria-label="fechaInicio"
                                    type="date"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaInicio ? "is-invalid" : ""}`}
                                    name="fechaInicio"
                                    onChange={handleChange}
                                    value={Inventario.fechaInicio}
                                />
                                {error.fechaInicio && (
                                    <div className="invalid-feedback d-block">{error.fechaInicio}</div>
                                )}
                            </div>
                            <div className="mb-1">
                                <label htmlFor="fechaTermino" className="fw-semibold">Hasta</label>
                                <input
                                    aria-label="fechaTermino"
                                    type="date"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaTermino ? "is-invalid" : ""}`}
                                    name="fechaTermino"
                                    onChange={handleChange}
                                    value={Inventario.fechaTermino}
                                />
                                {error.fechaTermino && (
                                    <div className="invalid-feedback">{error.fechaTermino}</div>
                                )}
                            </div>

                        </Col>
                        <Col md={4}>
                            <div className="mb-1 z-1000">
                                <label className="fw-semibold">
                                    Seleccione una cuenta
                                </label>
                                <Select
                                    options={cuentasOptions}
                                    onChange={handleCuentasChange}
                                    name="ctA_NOMBRE"
                                    value={cuentasOptions.find((option) => option.value === Inventario.ctA_NOMBRE) || null}
                                    placeholder="Buscar"
                                    className={`form-select-container`}
                                    classNamePrefix="react-select"
                                    isClearable
                                    isSearchable
                                />
                            </div>
                        </Col>
                        <Col md={5}>
                            <div className="mb-1 mt-4">
                                <Button /*onClick={handleBuscarAltas}*/ variant={`${isDarkMode ? "secondary" : "primary"}`} className="ms-1">
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
                                        <Search className={classNames("flex-shrink-0", "h-5 w-5")} aria-hidden="true" />
                                    )}
                                </Button>
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
                        <div className='table-responsive z-0'>
                            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                                <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                                    <tr>
                                        <th >
                                            <Form.Check
                                                className="check-danger"
                                                type="checkbox"
                                                onChange={handleSeleccionaTodos}
                                                checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                            />
                                        </th>
                                        <th scope="col" className="text-nowrap text-center">Codigo</th>
                                        <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                                        <th scope="col" className="text-nowrap text-center">Servicio</th>
                                        <th scope="col" className="text-nowrap text-center">Dependencia</th>
                                        <th scope="col" className="text-nowrap text-center">Especie</th>
                                        <th scope="col" className="text-nowrap text-center">N° Cuenta</th>
                                        <th scope="col" className="text-nowrap text-center">Marca</th>
                                        <th scope="col" className="text-nowrap text-center">Modelo</th>
                                        <th scope="col" className="text-nowrap text-center">Serie</th>
                                        <th scope="col" className="text-nowrap text-center">Precio</th>
                                        <th scope="col" className="text-nowrap text-center">N° Recepcion</th>
                                        {/* <th>Acción</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {elementosActuales.map((Lista, index) => {
                                        const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <Form.Check
                                                        type="checkbox"
                                                        onChange={() => setSeleccionaFilas(indexReal)}
                                                        checked={filasSeleccionadas.includes(indexReal.toString())}
                                                    />
                                                </td>
                                                <td className="text-nowrap text-center">{Lista.aF_CLAVE}</td>
                                                <td className="text-nowrap text-center">{Lista.ninv}</td>
                                                <td className="text-nowrap text-center">{Lista.serv}</td>
                                                <td className="text-nowrap text-center">{Lista.dep}</td>
                                                <td className="text-nowrap text-center">{Lista.esp}</td>
                                                <td className="text-nowrap text-center">{Lista.ncuenta}</td>
                                                <td className="text-nowrap text-center">{Lista.marca}</td>
                                                <td className="text-nowrap text-center">{Lista.modelo}</td>
                                                <td className="text-nowrap text-center">{Lista.serie}</td>
                                                <td className="text-nowrap text-center">{Lista.precio}</td>
                                                <td className="text-nowrap text-center">{Lista.mrecepcion}</td>
                                                {/* <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleAnular(index, listaAltas.aF_CLAVE)}
                          >
                            Anular
                          </Button>
                        </td> */}
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
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaAltas: state.datosListaAltasReducers.listaAltas,
    comboCuentasInforme: state.comboCuentasInformeReducers.comboCuentasInforme,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
    listaAltasActions,
    obtenerListaAltasActions,
    comboCuentasInformeActions
})(CuentaFechas);
