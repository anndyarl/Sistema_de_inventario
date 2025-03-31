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
import { Helmet } from "react-helmet-async";
import { obtenerMaxServicioActions } from "../../redux/actions/Mantenedores/Servicios/obtenerMaxServicioActions.tsx";
import { listadoMantenedorEspeciesActions } from "../../redux/actions/Mantenedores/Especies/listadoMantenedorEspeciesActions.tsx";
import { comboCuentaMantenedorActions } from "../../redux/actions/Mantenedores/Especies/comboCuentaMantenedorActions.tsx";
import { registrarMantenedorEspeciesActions } from "../../redux/actions/Mantenedores/Especies/registrarMantenedorEspeciesActions.tsx";
import { Objeto } from "../Navegacion/Profile.tsx";
import Select from "react-select";

export interface ListadoMantenedor {
    esP_CODIGO: string;
    esP_NOMBRE: string;
    ctA_NOMBRE: string;
    esP_VIGENTE: string;
    esP_USER_CREA: string;
    estabL_NOMBRE: string;
    esP_IP_CREA: string;
    esP_VIDAUTIL: number;
}

interface ComboCuentas {
    codigo: string;
    descripcion: string;
}
interface GeneralProps {
    listadoMantenedor: ListadoMantenedor[];
    obtenerMaxServicioActions: () => void;
    listadoMantenedorEspeciesActions: () => Promise<boolean>;
    comboCuentaMantenedorActions: () => Promise<boolean>;
    registrarMantenedorEspeciesActions: (formModal: Record<string, any>) => Promise<boolean>;
    comboCuentas: ComboCuentas[];
    token: string | null;
    isDarkMode: boolean;
    seR_CORR: number;
    objeto: Objeto; //Objeto que obtiene los datos del usuario
    nPaginacion: number; //número de paginas establecido desde preferencias
}

const Especies: React.FC<GeneralProps> = ({ obtenerMaxServicioActions, listadoMantenedorEspeciesActions, comboCuentaMantenedorActions, seR_CORR, listadoMantenedor, comboCuentas, objeto, token, isDarkMode, nPaginacion }) => {
    const [loading, setLoading] = useState(false);
    const [loadingRegistro, __] = useState(false);
    const [error, setError] = useState<Partial<ListadoMantenedor> & {}>({});
    const [_, setFilaSeleccionada] = useState<any[]>([]);
    const [mostrarModal, setMostrarModal] = useState<number | null>(null);
    const [mostrarModalRegistrar, setMostrarModalRegistrar] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = nPaginacion;

    // Lógica de Paginación actualizada
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(() => listadoMantenedor.slice(indicePrimerElemento, indiceUltimoElemento),
        [listadoMantenedor, indicePrimerElemento, indiceUltimoElemento]
    );

    const cuentasOptions = comboCuentas.map((item) => ({
        value: item.codigo.toString(),
        label: item.descripcion,
    }));

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
                const resultado = await listadoMantenedorEspeciesActions();
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
        esP_NOMBRE: '',
        ctA_NOMBRE: '',
        estabL_corr: objeto.Establecimiento, //1 es iguall a establecimiento SSMSO (falta obtenerlo desde el login del usuario)
        usuario: objeto.IdCredencial.toString(),
    });

    useEffect(() => {

        // if (seR_CORR === 0) {
        //     obtenerMaxServicioActions(); // Solo se ejecuta si seR_CORR cambió                     
        // }
        // setMantenedor((prev) => ({
        //     ...prev,
        //     seR_CORR: seR_CORR + 1,
        // }));
        comboCuentaMantenedorActions();
        listadoMantenedorAuto();

    }, [listadoMantenedorEspeciesActions, obtenerMaxServicioActions, token, listadoMantenedor.length, seR_CORR]); // Asegúrate de incluir dependencias relevantes

    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación  
        if (!Mantenedor.esP_NOMBRE) tempErrors.esP_NOMBRE = "Campo obligatorio";
        if (!Mantenedor.ctA_NOMBRE) tempErrors.ctA_NOMBRE = "Campo obligatorio";
        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleCuentasChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : "";
        setMantenedor((prevMantenedor) => ({ ...prevMantenedor, ctA_NOMBRE: value }));
    }

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

        if (name === "ctA_NOMBRE") {
            console.log("ctA_NOMBRE", newValue);
        }
    };

    // const handleActualizar = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>,
    //     index: number
    // ) => {
    //     const { name, value } = e.target;

    //     // Actualiza el elemento correspondiente en el array
    //     setFilaSeleccionada((prevElementos) =>
    //         prevElementos.map((elemento, i) =>
    //             i === index
    //                 ? {
    //                     ...elemento,
    //                     [name]: value, // Actualiza solo la propiedad correspondiente
    //                 }
    //                 : elemento
    //         )
    //     );
    // };

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
                text: "Confirme para registrar una nueva especie",
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
                // setLoadingRegistro(true);
                // // const formMantenedor = selectedIndices.map((activo) => ({
                // //     seR_COD: listadoMantenedor[activo].seR_COD,
                // //     ...Mantenedor,
                // // }));
                // const resultado = await registrarMantenedorEspeciesActions(Mantenedor);
                // console.log(Mantenedor);
                // if (resultado) {
                //     Swal.fire({
                //         icon: "success",
                //         title: "Registro Exitoso",
                //         text: "Se ha agregado un nuevo proveedor",
                //         background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                //         color: `${isDarkMode ? "#ffffff" : "000000"}`,
                //         confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                //         customClass: {
                //             popup: "custom-border", // Clase personalizada para el borde
                //         }
                //     });
                //     setLoadingRegistro(false);
                //     // obtenerMaxServicioActions();//llama nuevamente el ultimo ser_corr
                //     listadoMantenedorEspeciesActions();//llama al nuevo listado de servicios
                //     // setFilaSeleccionada([]);
                //     setMostrarModalRegistrar(false);

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

                console.log(Mantenedor);
            }
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Mantenedor de Especies</title>
            </Helmet>
            <MenuMantenedores />
            <div className="border-bottom shadow-sm p-4 rounded">
                <h3 className="form-title fw-semibold border-bottom p-1">Listado de Especies</h3>
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
                                    <th scope="col" className="text-nowrap text-center">Nombre</th>
                                    <th scope="col" className="text-nowrap text-center">Descripcion Cuenta</th>
                                    <th scope="col" className="text-nowrap text-center">Vigencia</th>
                                    <th scope="col" className="text-nowrap text-center">Usuario</th>
                                    <th scope="col" className="text-nowrap text-center">Establecimiento</th>
                                    <th scope="col" className="text-nowrap text-center">Dirección Ip</th>
                                    <th scope="col" className="text-nowrap text-center">Vida Útil</th>
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
                                            <td scope="col" className="text-nowrap">{Lista.esP_CODIGO}</td>
                                            <td scope="col" className="text-nowrap">{Lista.esP_NOMBRE}</td>
                                            <td scope="col" className="text-nowrap">{Lista.ctA_NOMBRE}</td>
                                            <td scope="col" className="text-nowrap">{Lista.esP_VIGENTE}</td>
                                            <td scope="col" className="text-nowrap">{Lista.esP_USER_CREA}</td>
                                            <td scope="col" className="text-nowrap">{Lista.estabL_NOMBRE}</td>
                                            <td scope="col" className="text-nowrap">{Lista.esP_IP_CREA}</td>
                                            <td scope="col" className="text-nowrap">{Lista.esP_VIDAUTIL}</td>
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
                    <Modal.Title className="fw-semibold">Nueva Especie</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form onSubmit={handleSubmit}>
                        {/* Boton actualizar filas seleccionadas */}
                        <div className="d-flex justify-content-end">
                            <Button
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
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
                            <label className="fw-semibold">Nombre</label>
                            <input
                                aria-label="esP_NOMBRE"
                                type="text"
                                className={`form-select ${error.esP_NOMBRE ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="esP_NOMBRE"
                                size={10}
                                placeholder="Ingrese nueva especie"
                                maxLength={100}
                                onChange={handleChange}
                                value={Mantenedor.esP_NOMBRE}
                            />
                            {error.esP_NOMBRE && (
                                <div className="invalid-feedback fw-semibold">{error.esP_NOMBRE}</div>
                            )}
                        </div>
                        <div className="mb-1">
                            <label className="fw-semibold">
                                Seleccione una cuenta
                            </label>
                            <Select
                                options={cuentasOptions}
                                onChange={handleCuentasChange}
                                name="ctA_NOMBRE"
                                value={cuentasOptions.find((option) => option.value === Mantenedor.ctA_NOMBRE) || null}
                                placeholder="Buscar"
                                className={`form-select-container ${error.ctA_NOMBRE ? "is-invalid" : ""}`}
                                classNamePrefix="react-select"
                                isClearable
                                isSearchable
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: isDarkMode ? "#212529" : "white", // Fondo oscuro
                                        color: isDarkMode ? "white" : "#212529", // Texto blanco
                                        borderColor: isDarkMode ? "rgb(108 117 125)" : "#a6a6a66e", // Bordes
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: isDarkMode ? "white" : "#212529", // Color del texto seleccionado
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: isDarkMode ? "#212529" : "white", // Fondo del menú desplegable
                                        color: isDarkMode ? "white" : "#212529",
                                    }),
                                    option: (base, { isFocused, isSelected }) => ({
                                        ...base,
                                        backgroundColor: isSelected ? "#6c757d" : isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                                        color: isSelected ? "white" : isFocused ? "white" : isDarkMode ? "white" : "#212529",
                                    }),
                                }}
                            />
                            {error.ctA_NOMBRE && (
                                <div className="invalid-feedback fw-semibold">
                                    {error.ctA_NOMBRE}
                                </div>
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
                                <Modal.Title className="fw-semibold">Servicio Nº {Lista.esP_CODIGO}</Modal.Title>
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
                                        <label className="fw-semibold">Nombre Especie</label>
                                        <input
                                            aria-label="esP_NOMBRE"
                                            type="text"
                                            className={`form-constrol ${error.esP_NOMBRE ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="esP_NOMBRE"
                                            placeholder="Ingrese nueva especie"
                                            maxLength={100}
                                            onChange={handleChange}
                                            value={Mantenedor.esP_NOMBRE}
                                        />
                                        {error.esP_NOMBRE && (
                                            <div className="invalid-feedback fw-semibold">{error.esP_NOMBRE}</div>
                                        )}
                                    </div>
                                    {/* <div className="mt-1">
                                        <label className="fw-semibold">Cuentas</label>
                                        <select
                                            aria-label="seR_COD"
                                            className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.ctA_NOMBRE ? "is-invalid" : ""}`}
                                            name="seR_COD"
                                            onChange={handleChange}
                                            value={Mantenedor.ctA_NOMBRE}
                                        >
                                            <option value="">Seleccione</option>
                                            {comboCuentas.map((traeCuentas) => (
                                                <option key={traeCuentas.codigo} value={traeCuentas.codigo}>
                                                    {traeCuentas.descripcion}
                                                </option>
                                            ))}
                                        </select>
                                        {error.ctA_NOMBRE && (
                                            <div className="invalid-feedback fw-semibold">{error.ctA_NOMBRE}</div>
                                        )}
                                    </div> */}
                                    <div className="mb-1">
                                        <label className="fw-semibold">
                                            Seleccione una cuenta
                                        </label>
                                        <Select
                                            options={cuentasOptions}
                                            onChange={handleCuentasChange}
                                            name="ctA_NOMBRE"
                                            value={cuentasOptions.find((option) => option.value === Mantenedor.ctA_NOMBRE) || null}
                                            placeholder="Buscar"
                                            className={`form-select-container ${error.ctA_NOMBRE ? "is-invalid" : ""}`}
                                            classNamePrefix="react-select"
                                            isClearable
                                            isSearchable
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    backgroundColor: isDarkMode ? "#212529" : "white", // Fondo oscuro
                                                    color: isDarkMode ? "white" : "#212529", // Texto blanco
                                                    borderColor: isDarkMode ? "rgb(108 117 125)" : "#a6a6a66e", // Bordes
                                                }),
                                                singleValue: (base) => ({
                                                    ...base,
                                                    color: isDarkMode ? "white" : "#212529", // Color del texto seleccionado
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    backgroundColor: isDarkMode ? "#212529" : "white", // Fondo del menú desplegable
                                                    color: isDarkMode ? "white" : "#212529",
                                                }),
                                                option: (base, { isFocused, isSelected }) => ({
                                                    ...base,
                                                    backgroundColor: isSelected ? "#6c757d" : isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                                                    color: isSelected ? "white" : isFocused ? "white" : isDarkMode ? "white" : "#212529",
                                                }),
                                            }}
                                        />
                                        {error.ctA_NOMBRE && (
                                            <div className="invalid-feedback fw-semibold">
                                                {error.ctA_NOMBRE}
                                            </div>
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
    listadoMantenedor: state.listadoMantenedorEspeciesReducers.listadoMantenedor,
    comboCuentas: state.comboCuentaMantenedorReducers.comboCuentaMantenedor,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    objeto: state.validaApiLoginReducers,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    obtenerMaxServicioActions,
    listadoMantenedorEspeciesActions,
    registrarMantenedorEspeciesActions,
    comboCuentaMantenedorActions
})(Especies);
