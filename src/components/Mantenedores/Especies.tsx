import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Modal, Col, Row } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuMantenedores from "../Menus/MenuMantenedores.tsx";
import { Plus } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";
import Select from "react-select";
import { obtenerMaxServicioActions } from "../../redux/actions/Mantenedores/Servicios/obtenerMaxServicioActions.tsx";
import { listadoMantenedorEspeciesActions } from "../../redux/actions/Mantenedores/Especies/listadoMantenedorEspeciesActions.tsx";
import { comboCuentaMantenedorActions } from "../../redux/actions/Mantenedores/Especies/comboCuentaMantenedorActions.tsx";
import { registrarMantenedorEspeciesActions } from "../../redux/actions/Mantenedores/Especies/registrarMantenedorEspeciesActions.tsx";
import { actualizarMantenedorEspeciesActions } from "../../redux/actions/Mantenedores/Especies/actualizarMantenedorEspeciesActions.tsx";

export interface ListadoMantenedor {
    esP_CODIGO: string;
    esP_NOMBRE: string;
    ctA_NOMBRE: string;
    ctA_COD: string;
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
    listadoMantenedorEspeciesActions: (establ_corr: number) => Promise<boolean>;
    comboCuentaMantenedorActions: () => Promise<boolean>;
    registrarMantenedorEspeciesActions: (formModal: Record<string, any>) => Promise<boolean>;
    actualizarMantenedorEspeciesActions: (formModal: Record<string, any>) => Promise<boolean>;
    comboCuentas: ComboCuentas[];
    token: string | null;
    isDarkMode: boolean;
    seR_CORR: number;
    objeto: Objeto; //Objeto que obtiene los datos del usuario

}

const Especies: React.FC<GeneralProps> = ({ obtenerMaxServicioActions, listadoMantenedorEspeciesActions, comboCuentaMantenedorActions, registrarMantenedorEspeciesActions, actualizarMantenedorEspeciesActions, seR_CORR, listadoMantenedor, comboCuentas, objeto, token, isDarkMode }) => {
    const [loading, setLoading] = useState(false);
    const [loadingRegistro, setLoadingRegistro] = useState(false);
    const [error, setError] = useState<Partial<ListadoMantenedor> & {}>({});
    const [_, setFilaSeleccionada] = useState<any[]>([]);
    const [mostrarModalEditar, setMostrarModalEditar] = useState<number | null>(null);
    const [mostrarModalRegistrar, setMostrarModalRegistrar] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
    const elementosPorPagina = Paginacion.nPaginacion;

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

    const handleCuentasChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : "";
        setMantenedor((prevMantenedor) => ({ ...prevMantenedor, ctA_COD: value }));
    }
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
                const resultado = await listadoMantenedorEspeciesActions(objeto.Roles[0].codigoEstablecimiento);
                if (resultado) {
                    setLoading(false);
                }
                // else {
                //     Swal.fire({
                //         icon: "error",
                //         title: "Error",
                //         text: `Error en la solicitud. Por favor, intente nuevamente.`,
                //         background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                //         color: `${isDarkMode ? "#ffffff" : "000000"}`,
                //         confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                //         customClass: {
                //             popup: "custom-border", // Clase personalizada para el borde
                //         }
                //     });
                // }
            }
        }
    };

    const [Mantenedor, setMantenedor] = useState({
        esP_CODIGO: '',
        esP_NOMBRE: '',
        ctA_COD: '',
        estabL_corr: objeto.Roles[0].codigoEstablecimiento, //1 es iguall a establecimiento SSMSO (falta obtenerlo desde el login del usuario)
        esp_user_crea: objeto.IdCredencial.toString(),
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
        if (!Mantenedor.ctA_COD) tempErrors.ctA_COD = "Campo obligatorio";
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

        setPaginacion((prevPrev) => ({
            ...prevPrev,
            [name]: newValue,
        }));

        if (name === "ctA_NOMBRE") {
            console.log("ctA_NOMBRE", newValue);
        }
    };

    const handleCerrarModal = (index: number) => {
        setFilaSeleccionada((prevSeleccionadas) =>
            prevSeleccionadas.filter((fila) => fila !== index.toString())
        );
        setMostrarModalEditar(null); //Cierra modal del indice seleccionado
        setMantenedor((prevPrev) => ({
            ...prevPrev,
            esP_CODIGO: '',
            esP_NOMBRE: '',
            ctA_COD: ''
        }));
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
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            if (result.isConfirmed) {
                // // setLoadingRegistro(true);
                // const formMantenedor = selectedIndices.map((activo) => ({
                //     esP_CODIGO: listadoMantenedor[activo].esP_CODIGO,
                //     ...Mantenedor,
                // }));
                const resultado = await registrarMantenedorEspeciesActions(Mantenedor);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Registro Exitoso",
                        text: "Se ha agregado una nueva especie.",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                    setLoadingRegistro(false);
                    // obtenerMaxServicioActions();//llama nuevamente el ultimo ser_corr
                    listadoMantenedorEspeciesActions(objeto.Roles[0].codigoEstablecimiento);
                    // setFilaSeleccionada([]);
                    setMostrarModalRegistrar(false);

                } else {
                    Swal.fire({
                        icon: "error",
                        title: ":'(",
                        text: "Hubo un problema al registrar",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                    setLoadingRegistro(false);
                }
            }
        }
    };

    const handleSubmitEditar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) {
            // const selectedIndices = filasSeleccionada.map(Number);
            const result = await Swal.fire({
                icon: "info",
                title: "Editar",
                text: "Confirme para editar la especie seleccionada",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Confirmar",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            if (result.isConfirmed) {
                console.log("editar", Mantenedor);
                const resultado = await actualizarMantenedorEspeciesActions(Mantenedor);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Modificación Exitosa",
                        text: "Se ha modificado correctamente la especie seleccionada.",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                    listadoMantenedorEspeciesActions(objeto.Roles[0].codigoEstablecimiento);
                    setMostrarModalEditar(null);

                } else {
                    Swal.fire({
                        icon: "error",
                        title: ":'(",
                        text: "Hubo un problema al editar la especie.",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                }
            }
        }
    };
    const handleSeleccion = async (index: number, esP_CODIGO: string, esP_NOMBRE: string, ctA_COD: string) => {
        setMostrarModalEditar(index);

        setFilaSeleccionada((prev) => prev.filter((_, i) => i !== index));
        setMantenedor((prevMantenedor) => ({
            ...prevMantenedor,
            esP_CODIGO: esP_CODIGO,
            esP_NOMBRE: esP_NOMBRE,
            ctA_COD: ctA_COD,
        }));
    };

    return (
        <Layout>
            <Helmet>
                <title>Mantenedor de Especies</title>
            </Helmet>
            <MenuMantenedores />
            <div className="table-responsive position-relative z-0 hide-scrollbar" >
                <div style={{ maxHeight: "80vh" }}>
                    <div className="border-bottom shadow-sm p-4 rounded">
                        <h3 className="form-title fw-semibold border-bottom p-1">Listado de Especies</h3>
                        <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between mb-1">
                            {/* Tamaño de página */}
                            <Col xs={12} lg="auto">
                                {listadoMantenedor.length > 10 && (
                                    <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
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
                                            {[10, 15, 20, 25, 50, 100].map((val) => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </Col>
                            {/* Boton Agregar */}
                            <Col xs={12} lg={1}>
                                <div className="d-flex justify-content-center justify-content-lg-end">
                                    <Button
                                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                                        className="p-2 mb-2 mb-sm-0 mx-sm-0 w-100 w-sm-auto"
                                        onClick={() => setMostrarModalRegistrar(true)}
                                    >
                                        Nuevo
                                        <Plus className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        {/* Tabla */}
                        {loading ? (
                            <>
                                <SkeletonLoader rowCount={elementosPorPagina} />
                            </>
                        ) : (

                            <div className='table-responsive'>
                                <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                                    <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                                        <tr>
                                            {/* <th scope="col"></th> */}
                                            <th scope="col" className="text-nowrap text-center">Código</th>
                                            <th scope="col" className="text-nowrap text-center">Nombre</th>
                                            <th scope="col" className="text-nowrap text-center">Descripcion Cuenta</th>
                                            <th scope="col" className="text-nowrap text-center">Establecimiento</th>
                                            <th scope="col" className="text-nowrap text-center">Acción</th>
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
                                                    <td scope="col" className="text-nowrap">{Lista.estabL_NOMBRE}</td>
                                                    <td scope="col" className="text-nowrap" style={{
                                                        position: 'sticky',
                                                        right: 0
                                                    }}>
                                                        <Button
                                                            variant="outline-primary"
                                                            className="fw-semibold"
                                                            size="sm"
                                                            onClick={() => handleSeleccion(index, Lista.esP_CODIGO, Lista.esP_NOMBRE, Lista.ctA_COD)}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                    </div>
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
                                        {/* <Plus className={("flex-shrink-0 h-5 w-5 ms-1")} aria-hidden="true" /> */}
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
                                // size={10}
                                placeholder="Ingrese nueva especie"
                                // maxLength={50}
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
                                name="ctA_COD"
                                value={cuentasOptions.find((option) => option.value === Mantenedor.ctA_COD) || null}
                                placeholder="Buscar"
                                className={`form-select-container ${error.ctA_COD ? "is-invalid border border-danger rounded" : ""}`}
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
                            {error.ctA_COD && (
                                <div className="invalid-feedback fw-semibold d-block">
                                    {error.ctA_COD}
                                </div>
                            )}

                        </div>
                    </form>
                </Modal.Body>
            </Modal >

            {/* Modal formulario Editar*/}
            {elementosActuales.map((Lista, index) => {
                let indexReal = indicePrimerElemento + index;
                return (
                    <div key={indexReal}>
                        <Modal
                            show={mostrarModalEditar === indexReal}
                            onHide={() => handleCerrarModal(indexReal)}
                            dialogClassName="modal-right" // Clase personalizada
                        // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
                        // keyboard={false}     // Evita el cierre al presionar la tecla Esc
                        >
                            <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                                <Modal.Title className="fw-semibold">Especie Nº {Lista.esP_CODIGO}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                                <form onSubmit={handleSubmitEditar}>
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
                                                    Guardar
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="mt-1">
                                        <label className="fw-semibold">Nombre Especie</label>
                                        <input
                                            aria-label="esP_NOMBRE"
                                            type="text"
                                            className={`form-control ${error.esP_NOMBRE ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
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

                                    <div className="mb-1">
                                        <label className="fw-semibold">
                                            Seleccione una cuenta
                                        </label>
                                        <Select
                                            options={cuentasOptions}
                                            onChange={handleCuentasChange}
                                            name="ctA_COD"
                                            value={cuentasOptions.find((option) => option.value === Mantenedor.ctA_COD) || null}
                                            placeholder="Buscar"
                                            className={`form-select-container ${error.ctA_COD ? "is-invalid border border-danger rounded" : ""}`}
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
                                        {error.ctA_COD && (
                                            <div className="invalid-feedback fw-semibold">
                                                {error.ctA_COD}
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
    actualizarMantenedorEspeciesActions,
    comboCuentaMantenedorActions
})(Especies);
