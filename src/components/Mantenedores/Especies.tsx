import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Spinner, Modal, Col, Row } from "react-bootstrap";
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
import { registrarMantenedorEspeciesActions } from "../../redux/actions/Mantenedores/Especies/registrarMantenedorEspeciesActions.tsx";
import { actualizarMantenedorEspeciesActions } from "../../redux/actions/Mantenedores/Especies/actualizarMantenedorEspeciesActions.tsx";
import { comboCuentaInicialActions } from "../../redux/actions/Inventario/Combos/comboCuentaInicialActions.tsx";
import { PageSizeSelector } from "../Utils/PageSizeSelector.tsx";
import { BusquedaTabla } from "../Utils/BusquedaTabla.tsx";
import { TablaGenerica } from "../Utils/TablaGenerica.tsx";

export interface ListadoMantenedor {
    esP_CODIGO: string;
    esP_NOMBRE: string;
    ctA_NOMBRE: string;
    ctA_COD: string;
    esP_VIGENTE: string;
    esP_USER_CREA: string;
    esP_USER_MOD: string;
    esP_IP_CREA: string;
    esP_VIDAUTIL: number;
    esP_F_CREA: string;
    esP_F_MOD: string;
}

interface ComboCuentas {
    codigo: number;
    descripcion: string;
}
interface GeneralProps {
    listadoMantenedor: ListadoMantenedor[];
    obtenerMaxServicioActions: () => void;
    listadoMantenedorEspeciesActions: (establ_corr: number) => Promise<boolean>;
    // comboCuentaInicialActions: () => Promise<boolean>;
    comboCuentaInicialActions: () => void;
    registrarMantenedorEspeciesActions: (formModal: Record<string, any>) => Promise<boolean>;
    actualizarMantenedorEspeciesActions: (formModal: Record<string, any>) => Promise<boolean>;
    comboCuentas: ComboCuentas[];
    token: string | null;
    isDarkMode: boolean;
    seR_CORR: number;
    objeto: Objeto; //Objeto que obtiene los datos del usuario

}

const Especies: React.FC<GeneralProps> = ({ obtenerMaxServicioActions, listadoMantenedorEspeciesActions, comboCuentaInicialActions, registrarMantenedorEspeciesActions, actualizarMantenedorEspeciesActions, seR_CORR, listadoMantenedor, comboCuentas, objeto, token, isDarkMode }) => {
    const [loading, setLoading] = useState(false);
    const [loadingRegistro, setLoadingRegistro] = useState(false);
    const [error, setError] = useState<Partial<ListadoMantenedor> & {}>({});
    const [_, setFilaSeleccionada] = useState<any[]>([]);
    const [mostrarModalEditar, setMostrarModalEditar] = useState<ListadoMantenedor | null>(null);
    const [mostrarModalRegistrar, setMostrarModalRegistrar] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [terminoBusqueda, setTerminoBusqueda] = useState("");

    const datosFiltrados = useMemo(() => {
        if (!terminoBusqueda.trim()) {
            return listadoMantenedor;
        }

        const termino = terminoBusqueda.toLowerCase();
        return listadoMantenedor.filter((item) => {
            return (
                item.ctA_COD.toString().includes(termino) ||
                item.ctA_NOMBRE.toLowerCase().includes(termino) ||
                item.esP_CODIGO.toLowerCase().includes(termino) ||
                item.esP_NOMBRE.toLowerCase().includes(termino)
            );
        });
    }, [listadoMantenedor, terminoBusqueda]);



    useEffect(() => {
        setPaginaActual(1);
    }, [terminoBusqueda]);

    //------------- Lógica de Paginación----------------//
    // Totales
    const totalRegistros = datosFiltrados.length;
    const totalPaginas = Math.ceil(totalRegistros / pageSize);

    // Índices
    const indiceInicio = (paginaActual - 1) * pageSize;
    const indiceFin = indiceInicio + pageSize;

    // Datos paginados
    const elementosActuales = useMemo(() => {
        return datosFiltrados.slice(indiceInicio, indiceFin);
    }, [datosFiltrados, indiceInicio, indiceFin]);
    //-------------Fin Lógica de Paginación----------------//

    const cuentasOptions = comboCuentas.map((item) => ({
        value: item.codigo.toString(),
        label: item.descripcion,
    }));

    const handleCuentasChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : "";
        setMantenedor((prevMantenedor) => ({ ...prevMantenedor, ctA_COD: value }));
    }

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

    });

    useEffect(() => {
        // if (seR_CORR === 0) {
        //     obtenerMaxServicioActions(); // Solo se ejecuta si seR_CORR cambió                     
        // }
        // setMantenedor((prev) => ({
        //     ...prev,
        //     seR_CORR: seR_CORR + 1,
        // }));
        comboCuentaInicialActions();
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

        if (name === "ctA_NOMBRE") {
            console.log("ctA_NOMBRE", newValue);
        }
    };

    const handleSubmiRegistrar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) {
            const result = await Swal.fire({
                icon: "info",
                title: "Registrar",
                text: "Confirme para registrar una nueva especie.",
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
                const FormRegistrar = {
                    ...Mantenedor,
                    esP_CODIGO: Mantenedor.esP_CODIGO,
                    esP_NOMBRE: Mantenedor.esP_NOMBRE,
                    ctA_COD: Mantenedor.ctA_COD,
                    esp_user_crea: objeto.IdCredencial.toString(),
                };
                const resultado = await registrarMantenedorEspeciesActions(FormRegistrar);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Registro Exitoso",
                        text: "Se ha agregado una nueva especie correctamente.",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                    setLoadingRegistro(false);
                    listadoMantenedorEspeciesActions(objeto.Roles[0].codigoEstablecimiento);
                    setMostrarModalRegistrar(false);
                    setMantenedor((prevMantenedor) => ({
                        ...prevMantenedor,
                        esP_CODIGO: "",
                        esP_NOMBRE: "",
                        ctA_COD: "",
                    }));

                } else {
                    Swal.fire({
                        icon: "error",
                        title: ":'(",
                        text: "Hubo un problema al registrar la especie",
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
                const FormEditar = {
                    ...Mantenedor,
                    esP_CODIGO: Mantenedor.esP_CODIGO,
                    esP_NOMBRE: Mantenedor.esP_NOMBRE,
                    ctA_COD: Mantenedor.ctA_COD,
                    esp_user_mod: objeto.IdCredencial.toString(),
                };

                const resultado = await actualizarMantenedorEspeciesActions(FormEditar);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Actualización Exitosa",
                        text: "Se ha editado una especie correctamente.",
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

    const handleSeleccion = (item: ListadoMantenedor) => {
        setMostrarModalEditar(item)
        setMantenedor((prevMantenedor) => ({
            ...prevMantenedor,
            esP_CODIGO: item.esP_CODIGO,
            esP_NOMBRE: item.esP_NOMBRE,
            ctA_COD: item.ctA_COD,
        }));
    };

    const handleCerrarModalRegistro = () => {
        setMostrarModalRegistrar(false);
        setMantenedor((prevMantenedor) => ({
            ...prevMantenedor,
            esP_CODIGO: "",
            esP_NOMBRE: "",
            ctA_COD: "",
        }));
    };

    const handleCerrarModalEditar = (index?: number) => {
        if (index !== undefined) {
            setFilaSeleccionada((prevSeleccionadas) =>
                prevSeleccionadas.filter((fila) => fila !== index.toString())
            );
        }
        setMostrarModalEditar(null); //Cierra modal del indice seleccionado
        setMantenedor((prevPrev) => ({
            ...prevPrev,
            esP_CODIGO: '',
            esP_NOMBRE: '',
            ctA_COD: ''
        }));
    };

    const nombreUsuario = (codigo: string) => {
        const mapa: Record<string, string> = {
            '62511': 'Andy Riquelme',
            '18124': 'Rodrigo Toledo',
            'JCASTILLO': 'Jaime Castillo', 'jcastillo': 'Jaime Castillo', '1770': 'Jaime Castillo',
            'DROJASP': 'Daniel Rojas', 'drojasp': 'Daniel Rojas', '66098': 'Daniel Rojas',
            '1234567': 'Felipe Almonte', '18667': 'Felipe Almonte',
            'JVARGAS': 'Jonathan Vargas', 'jvargas': 'Jonathan Vargas', '6405': 'Jonathan Vargas',
            'GFARIAS': 'Gabriela Farias', 'gfarias': 'Gabriela Farias', '888': 'Gabriela Farias',
            'KREYESD': 'Katherine Reyes', 'kreyesd': 'Katherine Reyes', '66099': 'Katherine Reyes',
        };
        return mapa[codigo] || codigo;
    };

    const columnas = [
        { key: 'esP_CODIGO' as keyof ListadoMantenedor, header: 'Codigo' },
        { key: 'esP_NOMBRE' as keyof ListadoMantenedor, header: 'Nombre' },
        { key: 'ctA_NOMBRE' as keyof ListadoMantenedor, header: 'Descripcion Cuenta' },
        { key: 'esP_F_CREA' as keyof ListadoMantenedor, header: 'Fecha Creacion' },
        { key: 'esP_F_MOD' as keyof ListadoMantenedor, header: 'Fecha Modificacion' },
        {
            key: 'esP_USER_CREA' as keyof ListadoMantenedor,
            header: 'Creado por',
            render: (value: string) => nombreUsuario(value),
        },
        {
            key: 'esP_USER_MOD' as keyof ListadoMantenedor,
            header: 'Modificado por',
            render: (value: string) => nombreUsuario(value),
        },
    ];

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

                        <Row>
                            <Col xs={12} lg="auto" className="flex-grow-1 mb-lg-3 mb-1">

                                <BusquedaTabla
                                    value={terminoBusqueda}
                                    onChange={setTerminoBusqueda}
                                    isDarkMode={isDarkMode}
                                />
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

                            <PageSizeSelector
                                pageSize={pageSize}
                                total={listadoMantenedor.length}
                                totalFiltrados={totalRegistros}
                                onChange={(size) => setPageSize(size)}
                                isDarkMode={isDarkMode}
                            />
                        </Row>

                        {/* Tabla */}
                        {loading ? (
                            <SkeletonLoader rowCount={10} />
                        ) : (
                            <TablaGenerica<ListadoMantenedor>
                                data={elementosActuales}
                                columns={columnas}
                                isDarkMode={isDarkMode}
                                onEdit={(item) => handleSeleccion(item)}
                            />
                        )}

                        {/* Paginador */}
                        {totalPaginas > 1 && (
                            <div className="paginador-scroll mt-3">
                                <ul className="pagination pagination-sm justify-content-center">
                                    <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPaginaActual(1)}
                                        >
                                            Primera
                                        </button>
                                    </li>
                                    <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPaginaActual(paginaActual - 1)}
                                        >
                                            Anterior
                                        </button>
                                    </li>

                                    {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                                        let pageNum;
                                        if (totalPaginas <= 5) {
                                            pageNum = i + 1;
                                        } else if (paginaActual <= 3) {
                                            pageNum = i + 1;
                                        } else if (paginaActual >= totalPaginas - 2) {
                                            pageNum = totalPaginas - 4 + i;
                                        } else {
                                            pageNum = paginaActual - 2 + i;
                                        }

                                        return (
                                            <li
                                                key={pageNum}
                                                className={`page-item ${paginaActual === pageNum ? "active" : ""}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPaginaActual(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            </li>
                                        );
                                    })}

                                    <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPaginaActual(paginaActual + 1)}
                                        >
                                            Siguiente
                                        </button>
                                    </li>
                                    <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPaginaActual(totalPaginas)}
                                        >
                                            Última
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Modal formulario Registro*/}
            <Modal
                show={mostrarModalRegistrar}
                onHide={handleCerrarModalRegistro}
                dialogClassName="modal-right" // Clase personalizada
            // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
            // keyboard={false}     // Evita el cierre al presionar la tecla Esc
            >
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title className="fw-semibold">Nueva Especie</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form onSubmit={handleSubmiRegistrar}>
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
                                Asociar a cuenta
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
            <Modal
                show={mostrarModalEditar !== null}
                onHide={() => handleCerrarModalEditar()}
                dialogClassName="modal-right" // Clase personalizada
            // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
            // keyboard={false}     // Evita el cierre al presionar la tecla Esc
            >
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title className="fw-semibold">Especie: {Mantenedor.esP_CODIGO}</Modal.Title>
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
                                Asociar a cuenta
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
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    seR_CORR: state.obtenerMaxServicioReducers.seR_CORR,//Obtiene el max correletivo para insertarlo en el formualario
    listadoMantenedor: state.listadoMantenedorEspeciesReducers.listadoMantenedor,
    comboCuentas: state.comboCuentaReducer.comboCuenta,
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
    comboCuentaInicialActions
})(Especies);
