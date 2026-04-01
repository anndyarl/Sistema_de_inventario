import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Spinner, Modal, Row, Col } from "react-bootstrap";
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
import { obtenerMaxServicioActions } from "../../redux/actions/Mantenedores/Servicios/obtenerMaxServicioActions.tsx";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions.tsx";
import { PageSizeSelector } from "../Utils/PageSizeSelector.tsx";
import { TablaGenerica } from "../Utils/TablaGenerica.tsx";
import { BusquedaTabla } from "../Utils/BusquedaTabla.tsx";


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
    obtenerMaxServicioActions: () => void;
    listadoMantenedorServiciosActions: (establ_corr: number) => Promise<boolean>;
    registrarMantenedorServiciosActions: (formModal: Record<string, any>) => Promise<boolean>;
    // registrarMantenedorServiciosActions: (registro: { formModal: Record<string, any> }[]) => Promise<boolean>;
    comboServicioActions: (establ_corr: number) => void;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto; //Objeto que obtiene los datos del usuario  
    seR_CORR: number;
}

const Servicios: React.FC<GeneralProps> = ({ comboServicioActions, obtenerMaxServicioActions, listadoMantenedorServiciosActions, registrarMantenedorServiciosActions, seR_CORR, listadoMantenedor, token, isDarkMode, objeto }) => {
    const [loading, setLoading] = useState(false);
    const [loadingRegistro, setLoadingRegistro] = useState(false);
    const [error, setError] = useState<Partial<ListadoMantenedor> & Partial<ESTABLECIMIENTO> & {}>({});
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
            // Función auxiliar para convertir código de usuario a nombre

            return (
                item.seR_COD.toString().includes(termino) ||
                item.seR_CORR.toString().includes(termino) ||
                item.seR_NOMBRE.toLowerCase().includes(termino)

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

    //Se lista automaticamente apenas entra al componente
    const listadoMantenedorAuto = async () => {
        if (token) {
            if (listadoMantenedor.length === 0) {
                setLoading(true);
                const resultado = await listadoMantenedorServiciosActions(objeto.Roles[0].codigoEstablecimiento);
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
        seR_CORR: seR_CORR,
        estabL_corr: objeto.Roles[0].codigoEstablecimiento,
        descripcion: "",
        usuario: objeto.IdCredencial.toString(),
    });

    useEffect(() => {

        if (seR_CORR === 0) {
            obtenerMaxServicioActions(); // Solo se ejecuta si seR_CORR cambió                     
        }
        setMantenedor((prev) => ({
            ...prev,
            seR_CORR: seR_CORR + 1,
        }));

        listadoMantenedorAuto();

    }, [listadoMantenedorServiciosActions, obtenerMaxServicioActions, token, listadoMantenedor.length, seR_CORR]); // Asegúrate de incluir dependencias relevantes

    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación  
        if (!Mantenedor.descripcion) tempErrors.Descripcion = "Campo obligatorio";

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            // const selectedIndices = filasSeleccionada.map(Number);
            const result = await Swal.fire({
                icon: "info",
                title: "Registrar",
                text: "Confirme para registrar un nuevo servicio",
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
                setLoadingRegistro(true);
                // const formMantenedor = selectedIndices.map((activo) => ({
                //     seR_COD: listadoMantenedor[activo].seR_COD,
                //     ...Mantenedor,
                // }));
                const resultado = await registrarMantenedorServiciosActions(Mantenedor);
                // console.log(Mantenedor);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Registro Exitoso",
                        text: "Se ha agregado un nuevo servicio",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                    setLoadingRegistro(false);
                    obtenerMaxServicioActions();//llama nuevamente el ultimo ser_corr
                    comboServicioActions(objeto.Roles[0].codigoEstablecimiento);//llama al nuevo servicio
                    listadoMantenedorServiciosActions(objeto.Roles[0].codigoEstablecimiento);//llama al nuevo listado de servicios
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
            'nquiroz': 'Nelson Quiroz', 'NQUIROZ': 'Nelson Quiroz', '21479': 'Nelson Quiroz',
        };
        return mapa[codigo] || codigo;
    };

    const columnas = [
        { key: 'seR_CORR' as keyof ListadoMantenedor, header: 'Codigo' },
        { key: 'seR_NOMBRE' as keyof ListadoMantenedor, header: 'Nombre' },
        {
            key: 'seR_USER_CREA' as keyof ListadoMantenedor,
            header: 'Creado por',
            render: (value: string) => nombreUsuario(value),
        },
        { key: 'seR_F_CREA' as keyof ListadoMantenedor, header: 'Fecha Creación' },
    ]

    return (
        <Layout>
            <Helmet>
                <title>Mantenedor de Servicios</title>
            </Helmet>
            <MenuMantenedores />
            <div className="table-responsive position-relative z-0 hide-scrollbar" >
                <div style={{ maxHeight: "80vh" }}>
                    <div className="border-bottom shadow-sm p-2 rounded">
                        <h4 className="text-lg-start text-center fw-semibold border-bottom p-1 ">
                            Listado de Servicios
                        </h4>
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
                            // onEdit={(item) => handleSeleccion(item)}
                            />
                        )}
                        {/* Paginador */}
                        {totalPaginas > 1 && (
                            <div className="mt-3 paginador-scroll">
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

                                    {Array.from({ length: Math.min(20, totalPaginas) }, (_, i) => {
                                        let pageNum;
                                        if (totalPaginas <= 20) {
                                            pageNum = i + 1;
                                        } else if (paginaActual <= 3) {
                                            pageNum = i + 1;
                                        } else if (paginaActual >= totalPaginas - 2) {
                                            pageNum = totalPaginas - 19 + i;
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
                            <label className="fw-semibold">Nombre</label>
                            <input
                                aria-label="descripcion"
                                type="text"
                                className={`form-select ${error.descripcion ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="descripcion"
                                placeholder="Ingrese un nuevo servicio"
                                maxLength={100}
                                size={10}
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

        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    seR_CORR: state.obtenerMaxServicioReducers.seR_CORR,//Obtiene el max correletivo para insertarlo en el formualario
    listadoMantenedor: state.listadoMantenedorServiciosReducers.listadoMantenedor,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    objeto: state.validaApiLoginReducers,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    obtenerMaxServicioActions,
    listadoMantenedorServiciosActions,
    registrarMantenedorServiciosActions,
    comboServicioActions
})(Servicios);
