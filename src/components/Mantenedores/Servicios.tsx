import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Modal } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuMantenedores from "../Menus/MenuMantenedores.tsx";
import { DEPENDENCIA, SERVICIO } from "../Inventario/RegistrarInventario/DatosCuenta.tsx";
import { comboDependenciaActions } from "../../redux/actions/Inventario/Combos/comboDependenciaActions.tsx";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions.tsx";
import { Plus } from "react-bootstrap-icons";
import { Objeto } from "../Navegacion/Profile.tsx";
import { listadoMantenedorServiciosActions } from "../../redux/actions/Mantenedores/Servicios/listadoMantenedorServiciosActions.tsx";
import { registrarMantenedorServiciosActions } from "../../redux/actions/Mantenedores/Servicios/registrarMantenedorServiciosActions.tsx";


export interface ListadoMantenedor {
    seR_CORR: number;
    seR_COD: string;
    seR_NOMBRE: string;
    seR_USER_CREA: string;
    seR_VIGENTE: string;
    seR_F_CREA: string;
    seR_IP_CREA: string;
    estabL_NOMBRE: string;
}

interface GeneralProps {
    listadoMantenedor: ListadoMantenedor[];
    listadoMantenedorServiciosActions: () => Promise<boolean>;
    registrarMantenedorServiciosActions: (formModal: Record<string, any>) => Promise<boolean>;

    comboServicio: SERVICIO[];
    comboDependencia: DEPENDENCIA[];
    comboServicioActions: () => void;
    comboDependenciaActions: (comboServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;

}

const Servicios: React.FC<GeneralProps> = ({ listadoMantenedor, listadoMantenedorServiciosActions, registrarMantenedorServiciosActions, comboServicioActions, comboDependenciaActions, token, isDarkMode, comboServicio, comboDependencia, objeto }) => {
    const [loading, setLoading] = useState(false);
    const [loadingRegistro, setLoadingRegistro] = useState(false);
    const [error, setError] = useState<Partial<ListadoMantenedor>>({});
    const [filasSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
    const [mostrarModal, setMostrarModal] = useState<number | null>(null);
    const [mostrarModalRegistrar, setMostrarModalRegistrar] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;

    const fecha = Date.now();
    const fechaHoy = new Date(fecha);

    // Lógica de Paginación actualizada
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(() => listadoMantenedor.slice(indicePrimerElemento, indiceUltimoElemento),
        [listadoMantenedor, indicePrimerElemento, indiceUltimoElemento]
    );
    // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
    const totalPaginas = Array.isArray(listadoMantenedor)
        ? Math.ceil(listadoMantenedor.length / elementosPorPagina)
        : 0;
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);


    const [Mantenedor, setMantenedor] = useState({
        seR_NOMBRE: "",
        usuario: objeto.IdCredencial,
    });

    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación para N° de Recepción (debe ser un número)
        // if (!Mantenedor.seR_COD) tempErrors.seR_COD = "Campo obligatorio";
        if (!Mantenedor.seR_NOMBRE) tempErrors.seR_NOMBRE = "Campo obligatorio";

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    //Se lista automaticamente apenas entra al componente
    const listadoMantenedorAuto = async () => {
        if (token) {
            if (listadoMantenedor.length === 0) {
                setLoading(true);
                const resultado = await listadoMantenedorServiciosActions();
                if (resultado) {
                    setLoading(false);
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `Error en la solicitud. Por favor, intentne nuevamente.`,
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
        listadoMantenedorAuto()
        if (token) {
            if (comboServicio.length === 0) comboServicioActions();
        }
    }, [listadoMantenedorServiciosActions, comboServicioActions, token, listadoMantenedor.length]); // Asegúrate de incluir dependencias relevantes


    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Convierte `value` a número
        let newValue: string | number = ["deP_CORR"].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setMantenedor((preBajas) => ({
            ...preBajas,
            [name]: newValue,
        }));

    };

    const setSeleccionaFila = (index: number) => {
        setMostrarModal(index); //Abre modal del indice seleccionado
        setFilaSeleccionada((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
    };

    const handleCerrarModal = (index: number) => {
        setFilaSeleccionada((prevSeleccionadas) =>
            prevSeleccionadas.filter((fila) => fila !== index.toString())
        );
        setMostrarModal(null); //Cierra modal del indice seleccionado
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {

            const result = await Swal.fire({
                icon: "info",
                title: "Registrar",
                text: "Confirme para registrar nueva dependencia",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Confirmar y Enviar",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            if (result.isConfirmed) {
                setLoadingRegistro(true);
                const resultado = await registrarMantenedorServiciosActions(Mantenedor);
                console.log(Mantenedor);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Registro Exitoso",
                        text: "Se ha agregado un nueva dependencia",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });

                    setLoadingRegistro(false);
                    listadoMantenedorServiciosActions();
                    // setFilaSeleccionada([]);
                    elementosActuales.map((_, index) => (
                        handleCerrarModal(index)
                    ));

                } else {
                    Swal.fire({
                        icon: "error",
                        title: ":'(",
                        text: "Hubo un problema al registrar",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                    setLoadingRegistro(false);
                }
            }
        }
    };


    return (
        <Layout>
            <MenuMantenedores />
            <div className="border-bottom shadow-sm p-4 rounded">
                <h3 className="form-title fw-semibold border-bottom p-1">Listado de Servicios</h3>
                <div className="d-flex">
                    <div className="mb-1 mx-1">
                        <Button
                            className="align-content-center"
                            variant={`${isDarkMode ? "secondary" : "primary"}`}
                            onClick={() => setMostrarModalRegistrar(true)}
                        >
                            <Plus className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                            Nuevo
                        </Button>
                    </div>
                </div>
                {loading ? (
                    <>
                        <SkeletonLoader rowCount={elementosPorPagina} />
                    </>
                ) : (
                    <div className='table-responsive'>
                        <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                            <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                                <tr>
                                    {/* <th scope="col"></th> */}
                                    <th scope="col">Codigo</th>
                                    <th scope="col">Código Dependencia</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Vigencia</th>
                                    <th scope="col">Fecha de Creación</th>
                                    <th scope="col">IP</th>
                                    <th scope="col">Establecimiento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elementosActuales.map((Lista, index) => {
                                    let indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                    return (
                                        <tr key={indexReal}>
                                            {/* <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => setSeleccionaFila(indexReal)}
                          checked={filasSeleccionada.includes((indexReal).toString())}
                        />
                      </td> */}
                                            <td>{Lista.seR_CORR}</td>
                                            <td>{Lista.seR_COD}</td>
                                            <td>{Lista.seR_NOMBRE}</td>
                                            <td>{Lista.seR_VIGENTE}</td>
                                            <td>{Lista.seR_F_CREA}</td>
                                            <td>{Lista.seR_IP_CREA}</td>
                                            <td>{Lista.estabL_NOMBRE}</td>
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
            {/* Modal formulario Registro*/}
            {elementosActuales.map((Lista, index) => {
                let indexReal = indicePrimerElemento + index;
                return (
                    <div key={indexReal}>
                        <Modal
                            show={mostrarModal === indexReal}
                            onHide={() => handleCerrarModal(indexReal)}
                            dialogClassName="modal-right" // Clase personalizada
                        // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
                        // keyboard={false}     // Evita el cierre al presionar la tecla Esc
                        >
                            <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                                <Modal.Title className="fw-semibold">Servicio Nº {Lista.seR_COD}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                                <form onSubmit={handleSubmit}>
                                    {/* Boton actualizar filas seleccionadas */}
                                    <div className="d-flex justify-content-end">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                                            disabled={loadingRegistro}  // Desactiva el botón mientras carga
                                        >
                                            {loadingRegistro ? (
                                                <>
                                                    {"Un momento... "}
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="me-2"
                                                    />

                                                </>
                                            ) : (
                                                <>
                                                    Actualizar
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="mt-1">
                                        <label className="fw-semibold">Nombre Servicio</label>
                                        <input
                                            aria-label="seR_NOMBRE"
                                            type="text"
                                            className={`form-control ${error.seR_NOMBRE ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="seR_NOMBRE"
                                            maxLength={100}
                                            onChange={handleChange}
                                            value={Mantenedor.seR_NOMBRE}
                                        />
                                        {error.seR_NOMBRE && (
                                            <div className="invalid-feedback fw-semibold">{error.seR_NOMBRE}</div>
                                        )}
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal >
                    </div>
                )
            })}
            <Modal
                show={mostrarModalRegistrar}
                onHide={() => setMostrarModalRegistrar(false)}
                dialogClassName="modal-right" // Clase personalizada
            // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
            // keyboard={false}     // Evita el cierre al presionar la tecla Esc
            >
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title className="fw-semibold">Nuevo Servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form onSubmit={handleSubmit}>
                        {/* Boton actualizar filas seleccionadas */}
                        <div className="d-flex justify-content-end">
                            <Button
                                variant="primary"
                                type="submit"
                                className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                                disabled={loadingRegistro}  // Desactiva el botón mientras carga
                            >
                                {loadingRegistro ? (
                                    <>
                                        {"Un Momento... "}
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                    </>
                                ) : (
                                    <>
                                        Agregar
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="mt-1">
                            <label className="fw-semibold">Nombre Servicio</label>
                            <input
                                aria-label="nombre"
                                type="text"
                                className={`form-control ${error.seR_NOMBRE ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="nombre"
                                maxLength={100}
                                onChange={handleChange}
                                value={Mantenedor.seR_NOMBRE}
                            />
                            {error.seR_NOMBRE && (
                                <div className="invalid-feedback fw-semibold">{error.seR_NOMBRE}</div>
                            )}
                        </div>
                    </form>
                </Modal.Body>
            </Modal >
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listadoMantenedor: state.listadoMantenedorServiciosReducers.listadoMantenedor,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboServicio: state.comboServicioReducer.comboServicio,
    comboDependencia: state.comboDependenciaReducer.comboDependencia,
    objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
    listadoMantenedorServiciosActions,
    registrarMantenedorServiciosActions,
    comboServicioActions,
    comboDependenciaActions,
})(Servicios);
