import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Spinner, Modal, Row, Col, } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuMantenedores from "../Menus/MenuMantenedores.tsx";
import { Eraser, Plus, } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import { obtenerMaxServicioActions } from "../../redux/actions/Mantenedores/Servicios/obtenerMaxServicioActions.tsx";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions.tsx";
import { listadoMantenedorProveedoresActions } from "../../redux/actions/Mantenedores/Proveedores/listadoMantenedorProveedoresActions.tsx";
import { registrarMantenedorProveedoresActions } from "../../redux/actions/Mantenedores/Proveedores/registrarMantenedorProveedoresActions.tsx";
import { validate } from 'rut.js';
import { TablaGenerica } from "../Utils/TablaGenerica.tsx";
import { PageSizeSelector } from "../Utils/PageSizeSelector.tsx";
import { BusquedaTabla } from "../Utils/BusquedaTabla.tsx";
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
}

const Proveedores: React.FC<GeneralProps> = ({ obtenerMaxServicioActions, listadoMantenedorProveedoresActions, registrarMantenedorProveedoresActions, listadoMantenedor, token, isDarkMode }) => {
    const [loading, setLoading] = useState(false);
    const [loadingRegistro, setLoadingRegistro] = useState(false);
    const [error, setError] = useState<Partial<ListadoMantenedor> & {}>({});
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
                item.proV_CORR.toString().includes(termino) ||
                item.proV_DIR.toLowerCase().includes(termino) ||
                item.proV_FONO.toLowerCase().includes(termino) ||
                item.proV_NOMBRE.toLowerCase().includes(termino) ||
                item.proV_RUN.toString().includes(termino)
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
                const resultado = await listadoMantenedorProveedoresActions();
                if (resultado) {
                    setLoading(false);
                }
            }
        }
    };

    const [Mantenedor, setMantenedor] = useState({
        proV_RUN: 0,
        proV_DV: "",
        proV_NOMBRE: "",
        proV_FONO: "",
        proV_DIR: ""
    });

    useEffect(() => {
        listadoMantenedorAuto();
    }, [listadoMantenedorProveedoresActions, obtenerMaxServicioActions, token, listadoMantenedor.length]); // Asegúrate de incluir dependencias relevantes

    const validateForm = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación  
        if (!Mantenedor.proV_RUN) tempErrors.proV_RUN = "Campo obligatorio";
        const rutCompleto = `${Mantenedor.proV_RUN}-${Mantenedor.proV_DV}`.trim();
        if (!validate(rutCompleto)) {
            tempErrors.proV_RUN = "El RUT es incorrecto";
        }
        for (let i = 0; i < listadoMantenedor.length; i++) {
            if (String(Mantenedor.proV_RUN) === String(listadoMantenedor[i].proV_RUN)) {
                tempErrors.proV_RUN = "Rut ya existe";
                break; // Salir del bucle una vez encontrado
            }
        }
        if (!Mantenedor.proV_DV) tempErrors.proV_DV = "Campo obligatorio";
        if (!Mantenedor.proV_NOMBRE) tempErrors.proV_NOMBRE = "Campo obligatorio";
        if (!Mantenedor.proV_FONO) tempErrors.proV_FONO = "Campo obligatorio";
        if (!Mantenedor.proV_DIR) tempErrors.proV_DIR = "Campo obligatorio";
        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Convierte `value` a número
        let newValue: string | number = ["seR_COD", "proV_RUN"].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setMantenedor((prevPrev) => ({
            ...prevPrev,
            [name]: newValue,
        }));

        if (name === "proV_RUN") {
            // setMantenedor((prevState) => ({
            //     ...prevState,
            //     proV_RUN: format(String(newValue)),
            // }));
            newValue = parseFloat(value) || 0;
        }

        if (name === "proV_DV") {
            // Permitir solo números del 0-9 o la letra "K" (en mayúscula)
            if (/^[0-9Kk]$/.test(value)) {
                newValue = value.toUpperCase(); // Convierte "k" a "K" automáticamente
            } else {
                return; // Si es un carácter inválido, no actualiza el estado
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
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
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
            if (result.isConfirmed) {
                setLoadingRegistro(true);

                const resultado = await registrarMantenedorProveedoresActions(Mantenedor);
                // console.log(Mantenedor);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Registro Exitoso",
                        text: "Se ha agregado un nuevo proveedor",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
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

    const handleLimpiar = () => {
        setMantenedor((prevInventario) => ({
            ...prevInventario,
            proV_RUN: 0,
            proV_DV: "",
            proV_NOMBRE: "",
            proV_FONO: "",
            proV_DIR: ""
        }));
    }

    const columnas = [
        { key: 'proV_CORR' as keyof ListadoMantenedor, header: 'Codigo' },
        { key: 'proV_RUN' as keyof ListadoMantenedor, header: 'Rut' },
        { key: 'proV_DV' as keyof ListadoMantenedor, header: 'Dv' },
        { key: 'proV_NOMBRE' as keyof ListadoMantenedor, header: 'Nombre' },
        { key: 'proV_FONO' as keyof ListadoMantenedor, header: 'Fono' }
    ];

    return (
        <Layout>
            <Helmet>
                <title>Mantenedor de Proveedores</title>
            </Helmet>
            <MenuMantenedores />
            <div className="table-responsive position-relative z-0 hide-scrollbar" >
                <div style={{ maxHeight: "80vh" }}>
                    <div className="border-bottom shadow-sm p-4 rounded">
                        <h3 className="form-title fw-semibold border-bottom p-1">Listado de Proveedores</h3>
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
                    <Modal.Title className="fw-semibold">Nuevo Proveedor</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form onSubmit={handleSubmit}>
                        {/* Boton actualizar filas seleccionadas */}
                        <div className="d-flex justify-content-end">
                            <Button
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                className="mx-1 mb-1"
                                type="submit"
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
                            <Button onClick={handleLimpiar}
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                className="mx-1 mb-1">
                                Limpiar
                                <Eraser className={("flex-shrink-0 h-5 w-5 ms-1")} aria-hidden="true" />
                            </Button>
                        </div>

                        <div className="d-flex ">
                            <div className="mt-1">
                                <label className="fw-semibold">Rut</label>
                                <input
                                    aria-label="proV_RUN"
                                    type="text"
                                    className={`form-select ${error.proV_RUN ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="proV_RUN"
                                    placeholder="Ingrese nuevo rut"
                                    maxLength={8}
                                    size={10}
                                    onChange={handleChange}
                                    value={Mantenedor.proV_RUN}
                                />
                                {error.proV_RUN && (
                                    <div className="invalid-feedback fw-semibold">{error.proV_RUN}</div>
                                )}
                            </div>
                            <div className="mt-1 mx-2">
                                <label className="fw-semibold"></label>
                                <p className="fs-4">-</p>
                            </div>
                            <div className="mt-1">
                                <label className="fw-semibold mx-3">DV</label>
                                <input
                                    aria-label="proV_DV"
                                    type="text"
                                    className={`form-control  w-25 px-2 ${error.proV_DV ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="proV_DV"
                                    maxLength={1}
                                    onKeyPress={(e) => {
                                        if (!/[0-9Kk]/.test(e.key)) {
                                            e.preventDefault(); // Bloquea caracteres no permitidos
                                        }
                                    }}
                                    onChange={handleChange}
                                    value={Mantenedor.proV_DV}
                                />
                                {/* {error.proV_DV && (
                                    <div className="invalid-feedback fw-semibold">{error.proV_DV}</div>
                                )} */}
                            </div>
                        </div>
                        <div className="mt-1">
                            <label className="fw-semibold">Nombre</label>
                            <input
                                aria-label="proV_NOMBRE"
                                type="text"
                                className={`form-select ${error.proV_NOMBRE ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="proV_NOMBRE"
                                placeholder="Ingrese nuevo nombre"
                                maxLength={100}
                                size={10}
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
                                className={`form-select ${error.proV_FONO ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="proV_FONO"
                                placeholder="Ingrese nuevo fono"
                                maxLength={9}
                                size={10}
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
                                className={`form-select ${error.proV_DIR ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="proV_DIR"
                                placeholder="Ingrese nueva dirección"
                                maxLength={100}
                                size={10}
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
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listadoMantenedor: state.listadoMantenedorProveedoresReducers.listadoMantenedor,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    obtenerMaxServicioActions,
    listadoMantenedorProveedoresActions,
    registrarMantenedorProveedoresActions,
    comboServicioActions
})(Proveedores);
