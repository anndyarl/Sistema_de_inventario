import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Modal } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuMantenedores from "../Menus/MenuMantenedores.tsx";
import { Plus } from "react-bootstrap-icons";
import { Objeto } from "../Navegacion/Profile.tsx";

import { Helmet } from "react-helmet-async";
import { obtenerMaxServicioActions } from "../../redux/actions/Mantenedores/Servicios/obtenerMaxServicioActions.tsx";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions.tsx";
import { listadoMantenedorProveedoresActions } from "../../redux/actions/Mantenedores/Proveedores/listadoMantenedorProveedoresActions.tsx";
import { registrarMantenedorProveedoresActions } from "../../redux/actions/Mantenedores/Proveedores/registrarMantenedorProveedoresActions.tsx";

export interface ListadoMantenedor {
    proV_CORR: number,
    proV_RUN: number,
    proV_DV: string;
    proV_NOMBRE: string,
    proV_FONO: string,
    proV_DIR: string
}
interface GeneralProps {
    listadoMantenedor: ListadoMantenedor[];
    obtenerMaxServicioActions: () => void;
    listadoMantenedorProveedoresActions: () => Promise<boolean>;
    registrarMantenedorProveedoresActions: (formModal: Record<string, any>) => Promise<boolean>;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto; //Objeto que obtiene los datos del usuario  
    seR_CORR: number;
}

const Proveedores: React.FC<GeneralProps> = ({ seR_CORR, listadoMantenedor, obtenerMaxServicioActions, listadoMantenedorProveedoresActions, registrarMantenedorProveedoresActions, token, isDarkMode, objeto }) => {
    const [loading, setLoading] = useState(false);
    const [loadingRegistro, setLoadingRegistro] = useState(false);
    const [error, setError] = useState<Partial<ListadoMantenedor> & {}>({});
    const [_, setFilaSeleccionada] = useState<any[]>([]);
    const [mostrarModal, setMostrarModal] = useState<number | null>(null);
    const [mostrarModalRegistrar, setMostrarModalRegistrar] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 12;

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

    //Se lista automaticamente apenas entra al componente
    const listadoMantenedorAuto = async () => {
        if (token) {
            if (listadoMantenedor.length === 0) {
                setLoading(true);
                const resultado = await listadoMantenedorProveedoresActions();
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

    const [Mantenedor, setMantenedor] = useState({
        proV_RUN: "",
        proV_DV: "",
        proV_NOMBRE: "",
        proV_FONO: "",
        proV_DIR: ""
    });

    useEffect(() => {

        // if (seR_CORR === 0) {
        //     obtenerMaxServicioActions(); // Solo se ejecuta si seR_CORR cambió                     
        // }
        // setMantenedor((prev) => ({
        //     ...prev,
        //     seR_CORR: seR_CORR + 1,
        // }));

        listadoMantenedorAuto();

    }, [listadoMantenedorProveedoresActions, obtenerMaxServicioActions, token, listadoMantenedor.length, seR_CORR]); // Asegúrate de incluir dependencias relevantes

    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación  
        if (!Mantenedor.proV_RUN) tempErrors.proV_RUN = "Campo obligatorio";
        if (!Mantenedor.proV_NOMBRE) tempErrors.proV_NOMBRE = "Campo obligatorio";
        if (!Mantenedor.proV_FONO) tempErrors.proV_FONO = "Campo obligatorio";
        if (!Mantenedor.proV_DIR) tempErrors.proV_DIR = "Campo obligatorio";
        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Convierte `value` a número
        let newValue: string | number = ["seR_COD"].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setMantenedor((prevPrev) => ({
            ...prevPrev,
            [name]: newValue,
        }));

    };

    const handleActualizar = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ) => {
        const { name, value } = e.target;

        // Actualiza el elemento correspondiente en el array
        setFilaSeleccionada((prevElementos) =>
            prevElementos.map((elemento, i) =>
                i === index
                    ? {
                        ...elemento,
                        [name]: value, // Actualiza solo la propiedad correspondiente
                    }
                    : elemento
            )
        );
    };

    // const setSeleccionaFila = (index: number) => {
    //     setMostrarModal(index); //Abre modal del indice seleccionado
    //     setFilaSeleccionada((prev) =>
    //         prev.includes(index.toString())
    //             ? prev.filter((rowIndex) => rowIndex !== index.toString())
    //             : [...prev, index.toString()]
    //     );
    // };

    const handleCerrarModal = (index: number) => {
        setFilaSeleccionada((prevSeleccionadas) =>
            prevSeleccionadas.filter((fila) => fila !== index.toString())
        );
        setMostrarModal(null); //Cierra modal del indice seleccionado
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            // const selectedIndices = filasSeleccionada.map(Number);
            const result = await Swal.fire({
                icon: "info",
                title: "Registrar",
                text: "Confirme para registrar un nuevo proveedor",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Confirmar",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            if (result.isConfirmed) {
                setLoadingRegistro(true);
                // const formMantenedor = selectedIndices.map((activo) => ({
                //     seR_COD: listadoMantenedor[activo].seR_COD,
                //     ...Mantenedor,
                // }));
                const resultado = await registrarMantenedorProveedoresActions(Mantenedor);
                console.log(Mantenedor);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Registro Exitoso",
                        text: "Se ha agregado un nuevo proveedor",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                    setLoadingRegistro(false);
                    // obtenerMaxServicioActions();//llama nuevamente el ultimo ser_corr
                    listadoMantenedorProveedoresActions();//llama al nuevo listado de servicios
                    // setFilaSeleccionada([]);
                    setMostrarModalRegistrar(false);

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
            <Helmet>
                <title>Proveedores</title>
            </Helmet>
            <MenuMantenedores />
            <div className="border-bottom shadow-sm p-4 rounded">
                <h3 className="form-title fw-semibold border-bottom p-1">Listado de Proveedores</h3>
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
                                    <th scope="col" className="text-nowrap text-center">Código</th>
                                    <th scope="col" className="text-nowrap text-center">Rut</th>
                                    <th scope="col" className="text-nowrap text-center">Dv</th>
                                    <th scope="col" className="text-nowrap text-center">Nombre</th>
                                    <th scope="col" className="text-nowrap text-center">Fono</th>
                                    <th scope="col" className="text-nowrap text-center">Dirección</th>
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
                                            <td>{Lista.proV_CORR}</td>
                                            <td>{Lista.proV_RUN}</td>
                                            <td>{Lista.proV_DV}</td>
                                            <td>{Lista.proV_NOMBRE}</td>
                                            <td>{Lista.proV_FONO}</td>
                                            <td>{Lista.proV_DIR}</td>
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
            <Modal
                show={mostrarModalRegistrar}
                onHide={() => setMostrarModalRegistrar(false)}
                dialogClassName="modal-right" // Clase personalizada
            // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
            // keyboard={false}     // Evita el cierre al presionar la tecla Esc
            >
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title className="fw-semibold">Nuevo Proveedor</Modal.Title>
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

                        <div className="d-flex ">
                            <div className="mt-1">
                                <label className="fw-semibold">Rut</label>
                                <input
                                    aria-label="proV_RUN"
                                    type="text"
                                    className={`form-control ${error.proV_RUN ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="proV_RUN"
                                    placeholder="Ingrese nuevo rut"
                                    maxLength={100}
                                    onChange={handleChange}
                                    value={Mantenedor.proV_RUN}
                                />
                                {error.proV_RUN && (
                                    <div className="invalid-feedback fw-semibold">{error.proV_RUN}</div>
                                )}
                            </div>
                            <div className="mt-1 mx-2">
                                <label className="fw-semibold"></label>
                                <p>-</p>
                            </div>
                            <div className="mt-1">
                                <label className="fw-semibold">DV</label>
                                <input
                                    aria-label="proV_DV"
                                    type="text"
                                    className={`form-control  w-25 ${error.proV_DV ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="proV_DV"
                                    maxLength={1}

                                    onChange={handleChange}
                                    value={Mantenedor.proV_DV}
                                />
                                {error.proV_DV && (
                                    <div className="invalid-feedback fw-semibold">{error.proV_DV}</div>
                                )}
                            </div>
                        </div>
                        <div className="mt-1">
                            <label className="fw-semibold">Nombre</label>
                            <input
                                aria-label="proV_NOMBRE"
                                type="text"
                                className={`form-control ${error.proV_NOMBRE ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="proV_NOMBRE"
                                placeholder="Ingrese nuevo nombre"
                                maxLength={100}
                                onChange={handleChange}
                                value={Mantenedor.proV_NOMBRE}
                            />
                            {error.proV_NOMBRE && (
                                <div className="invalid-feedback fw-semibold">{error.proV_NOMBRE}</div>
                            )}
                        </div>
                        <div className="mt-1">
                            <label className="fw-semibold">Fono</label>
                            <input
                                aria-label="proV_FONO"
                                type="text"
                                className={`form-control ${error.proV_FONO ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="proV_FONO"
                                placeholder="Ingrese nuevo fono"
                                maxLength={100}
                                onChange={handleChange}
                                value={Mantenedor.proV_FONO}
                            />
                            {error.proV_FONO && (
                                <div className="invalid-feedback fw-semibold">{error.proV_FONO}</div>
                            )}
                        </div>
                        <div className="mt-1">
                            <label className="fw-semibold">Dirección</label>
                            <input
                                aria-label="proV_DIR"
                                type="text"
                                className={`form-control ${error.proV_DIR ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="proV_DIR"
                                placeholder="Ingrese nueva dirección"
                                maxLength={100}
                                onChange={handleChange}
                                value={Mantenedor.proV_DIR}
                            />
                            {error.proV_DIR && (
                                <div className="invalid-feedback fw-semibold">{error.proV_DIR}</div>
                            )}
                        </div>
                    </form>
                </Modal.Body>
            </Modal >

            {/* Modal formulario Actualizar*/}
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
                                <Modal.Title className="fw-semibold">Servicio Nº {Lista.proV_CORR}</Modal.Title>
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
                                        <label className="fw-semibold">Nombre</label>
                                        <input
                                            aria-label="proV_NOMBRE"
                                            type="text"
                                            className={`form-control ${error.proV_NOMBRE ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="proV_NOMBRE"
                                            placeholder="Ingrese un nuevo proveedor"
                                            maxLength={100}
                                            onChange={(e) => handleActualizar(e, indexReal)} // Pasar índice real
                                            value={Lista.proV_NOMBRE || ""} // Valor controlado
                                        />
                                        {error.proV_NOMBRE && (
                                            <div className="invalid-feedback fw-semibold">{error.proV_NOMBRE}</div>
                                        )}
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal >
                    </div>
                )
            })}
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    seR_CORR: state.obtenerMaxServicioReducers.seR_CORR,//Obtiene el max correletivo para insertarlo en el formualario
    listadoMantenedor: state.listadoMantenedorProveedoresReducers.listadoMantenedor,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
    obtenerMaxServicioActions,
    listadoMantenedorProveedoresActions,
    registrarMantenedorProveedoresActions,
    comboServicioActions
})(Proveedores);
