import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Modal, Form } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuMantenedores from "../Menus/MenuMantenedores.tsx";
import { Plus } from "react-bootstrap-icons";
import { Objeto } from "../Navegacion/Profile.tsx";
import { listadoMantenedorServiciosActions } from "../../redux/actions/Mantenedores/Servicios/listadoMantenedorServiciosActions.tsx";
import { registrarMantenedorServiciosActions } from "../../redux/actions/Mantenedores/Servicios/registrarMantenedorServiciosActions.tsx";
import { Helmet } from "react-helmet-async";
import { comboEstablecimientosMantenedorActions } from "../../redux/actions/Mantenedores/Servicios/comboEstablecimientosMantenedorActions.tsx";


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
interface ESTABLECIMIENTO {
    codigo: number;
    descripcion: string;
}
interface GeneralProps {
    listadoMantenedor: ListadoMantenedor[];
    comboEstablecimiento: ESTABLECIMIENTO[];
    listadoMantenedorServiciosActions: () => Promise<boolean>;
    registrarMantenedorServiciosActions: (formModal: Record<string, any>) => Promise<boolean>;
    // registrarMantenedorServiciosActions: (registro: { formModal: Record<string, any> }[]) => Promise<boolean>;

    comboEstablecimientosMantenedorActions: () => void;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const Servicios: React.FC<GeneralProps> = ({ listadoMantenedor, listadoMantenedorServiciosActions, registrarMantenedorServiciosActions, comboEstablecimientosMantenedorActions, token, isDarkMode, comboEstablecimiento, objeto }) => {
    const [loading, setLoading] = useState(false);
    const [loadingRegistro, setLoadingRegistro] = useState(false);
    const [error, setError] = useState<Partial<ListadoMantenedor> & Partial<ESTABLECIMIENTO> & {}>({});
    const [filasSeleccionada, setFilaSeleccionada] = useState<any[]>([]);
    const [mostrarModal, setMostrarModal] = useState<number | null>(null);
    const [mostrarModalRegistrar, setMostrarModalRegistrar] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;

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
        descripcion: "",
        usuario: objeto.IdCredencial.toString(),
    });

    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación  
        if (!Mantenedor.descripcion) tempErrors.Descripcion = "Campo obligatorio";

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
            if (comboEstablecimiento.length === 0) comboEstablecimientosMantenedorActions();
        }
    }, [listadoMantenedorServiciosActions, comboEstablecimientosMantenedorActions, token, listadoMantenedor.length]); // Asegúrate de incluir dependencias relevantes

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
            const selectedIndices = filasSeleccionada.map(Number);
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
                const formMantenedor = selectedIndices.map((activo) => ({
                    seR_COD: listadoMantenedor[activo].seR_COD,
                    ...Mantenedor,
                }));
                // const resultado = await registrarMantenedorServiciosActions(Mantenedor);
                console.log(formMantenedor);
                // if (resultado) {
                //     Swal.fire({
                //         icon: "success",
                //         title: "Registro Exitoso",
                //         text: "Se ha agregado un nueva dependencia",
                //         background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                //         color: `${isDarkMode ? "#ffffff" : "000000"}`,
                //         confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                //         customClass: {
                //             popup: "custom-border", // Clase personalizada para el borde
                //         }
                //     });

                //     setLoadingRegistro(false);
                //     listadoMantenedorServiciosActions();
                //     // setFilaSeleccionada([]);
                //     elementosActuales.map((_, index) => (
                //         handleCerrarModal(index)
                //     ));

                // } else {
                //     Swal.fire({
                //         icon: "error",
                //         title: ":'(",
                //         text: "Hubo un problema al registrar",
                //         background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                //         color: `${isDarkMode ? "#ffffff" : "000000"}`,
                //         confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                //         customClass: {
                //             popup: "custom-border", // Clase personalizada para el borde
                //         }
                //     });
                //     setLoadingRegistro(false);
                // }
            }
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Servicios</title>
            </Helmet>
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
                                    <th scope="col"></th>
                                    <th scope="col">Código</th>
                                    <th scope="col">Código Servicio</th>
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
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={() => setSeleccionaFila(indexReal)}
                                                    checked={filasSeleccionada.includes((indexReal).toString())}
                                                />
                                            </td>
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
                        {/* <div className="mt-1">
                            <label className="fw-semibold">Establecimiento</label>
                            <select
                                aria-label="codigo"
                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.codigo ? "is-invalid" : ""}`}
                                name="codigo"
                                onChange={handleChange}
                                value={Mantenedor.codigo}
                            >
                                <option value="">Seleccione un origen</option>
                                {comboEstablecimiento.map((TraeEstablecimiento) => (
                                    <option key={TraeEstablecimiento.codigo} value={TraeEstablecimiento.codigo}>
                                        {TraeEstablecimiento.descripcion}
                                    </option>
                                ))}
                            </select>
                            {error.codigo && (
                                <div className="invalid-feedback fw-semibold">{error.codigo}</div>
                            )}
                        </div> */}
                        <div className="mt-1">
                            <label className="fw-semibold">Servicio</label>
                            <input
                                aria-label="descripcion"
                                type="text"
                                className={`form-control ${error.descripcion ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="descripcion"
                                placeholder="Ingrese un nuevo servicio"
                                maxLength={100}
                                onChange={handleChange}
                                value={Mantenedor.descripcion}
                            />
                            {error.descripcion && (
                                <div className="invalid-feedback fw-semibold">{error.descripcion}</div>
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
                                        <label className="fw-semibold">Servicio</label>
                                        <input
                                            aria-label="descripcion"
                                            type="text"
                                            className={`form-control ${error.descripcion ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="descripcion"
                                            placeholder="Ingrese un nuevo servicio"
                                            maxLength={100}
                                            onChange={(e) => handleActualizar(e, indexReal)} // Pasar índice real
                                            value={Lista.seR_NOMBRE || ""} // Valor controlado
                                        />
                                        {error.descripcion && (
                                            <div className="invalid-feedback fw-semibold">{error.descripcion}</div>
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
    listadoMantenedor: state.listadoMantenedorServiciosReducers.listadoMantenedor,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboEstablecimiento: state.comboEstablecimientosMantenedorReducers.comboEstablecimiento,
    objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
    listadoMantenedorServiciosActions,
    registrarMantenedorServiciosActions,
    comboEstablecimientosMantenedorActions
})(Servicios);
