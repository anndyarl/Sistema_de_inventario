import React, { useMemo, useState } from "react";
import { Pagination, Form, Modal, Col, Row, Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import SkeletonLoader from "../../../Utils/SkeletonLoader";
import { RootState } from "../../../../store";
import Layout from "../../../../containers/hocs/layout/Layout";
import { BlobProvider, /*PDFDownloadLink*/ } from '@react-pdf/renderer';
import { Helmet } from "react-helmet-async";
import { Eraser, Search } from "react-bootstrap-icons";
import DocumentoPDF from "./DocumentoPDFConsultaInventarioEspecie";
import MenuInformes from "../../../Menus/MenuInformes";
import { listaConsultaInventarioEspecieActions } from "../../../../redux/actions/Informes/Principal/ConsultaInventarioEspecies/listaConsultaInventarioEspecieActions";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};

export interface ListaInvenarioEspecies {
    aF_CLAVE: number;
    traS_CORR: number;
    id: number;
    aF_CODIGO_GENERICO: string;
    fecha: string;
    aF_TIPO: string;
    dependencia: string;
    servicio: string;
    valor: number;
    especie: string;
    deT_MARCA: string;
    deT_MODELO: string;
    deT_SERIE: string;
    deT_OBS: string;
    altaS_CORR: number;
    aF_RESOLUCION: string;
    ctA_COD: string;
    vida: number;
    establecmiento: number;
    proV_RUN: number
    proV_NOMBRE: string;
    origen: string;
}


interface DatosBajas {
    listaConsultaInventarioEspecieActions: (nInventario: string) => Promise<boolean>;
    listaConsultaInventarioEspecie: ListaInvenarioEspecies[];
    // token: string | null;
    isDarkMode: boolean;
    nPaginacion: number; //número de paginas establecido desde preferencias
}

const ConsultaInventarioEspecies: React.FC<DatosBajas> = ({ listaConsultaInventarioEspecieActions, listaConsultaInventarioEspecie, isDarkMode, nPaginacion }) => {
    const [loading, setLoading] = useState(false);
    //-------------Modal-------------//
    const [mostrarModal, setMostrarModal] = useState<number | null>(null);
    //------------Fin Modal----------//
    const [filaSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = nPaginacion;
    const [Inventario, setInventario] = useState({
        aF_CLAVE: 0,
        traS_CORR: 0,
        id: 0,
        af_codigo_generico: "",
        fecha: "",
        aF_TIPO: "",
        dependencia: "",
        servicio: "",
        valor: 0,
        especie: "",
        altaS_CORR: 0,
        aF_RESOLUCION: "",
        ctA_COD: "",
        vida: 0,
        establecmiento: 0,

    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Si el campo es "af_codigo_generico", validamos que solo tenga números
        if (name === "af_codigo_generico") {
            // Solo números usando una expresión regular
            const soloNumeros = /^[0-9]*$/;

            if (!soloNumeros.test(value)) {
                return; // No actualiza el estado si hay caracteres inválidos
            }

            setInventario((prevState) => ({
                ...prevState,
                [name]: value,
            }));
            return;
        }
    };

    const handleBuscar = async () => {
        let resultado = false;
        setLoading(true);
        if (!Inventario.af_codigo_generico || Inventario.af_codigo_generico === "") {
            Swal.fire({
                icon: "warning",
                title: "Por favor, ingrese un número de inventario",
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
        }
        resultado = await listaConsultaInventarioEspecieActions(Inventario.af_codigo_generico);
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
            listaConsultaInventarioEspecie
            return;
        } else {
            paginar(1);
            setLoading(false); //Finaliza estado de carga
        }

    };

    const handleLimpiar = () => {
        setInventario((prevInventario) => ({
            ...prevInventario,
            af_codigo_generico: ""
        }));
    };
    // const fetchBajas = async () => {
    //     if (token) {
    //         setLoading(true);
    //         try {
    //             const resultado = await listaConsultaInventarioEspecieActions(Inventario.af_codigo_generico);
    //             if (!resultado) {
    //                 throw new Error("Error al cargar la lista de bajas");
    //             }
    //         } catch (error) {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Error",
    //                 text: `Error en la solicitud. Por favor, intente nuevamente.`,
    //                 background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //                 color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //                 confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
    //                 customClass: {
    //                     popup: "custom-border", // Clase personalizada para el borde
    //                 }
    //             });
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    // };

    // useEffect(() => {
    // if (listaConsultaInventarioEspecie.length === 0) {
    //     fetchBajas()
    // };
    // }, [listaConsultaInventarioEspecieActions, listaConsultaInventarioEspecie.length]);

    const setSeleccionaFila = (index: number) => {
        setMostrarModal(index); //Abre modal del indice seleccionado    
        setFilaSeleccionada(prev =>
            prev.includes(index.toString())
                ? prev.filter(rowIndex => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
    };

    const handleCerrarModal = (index: number) => {
        setFilaSeleccionada((prevSeleccionadas) =>
            prevSeleccionadas.filter((fila) => fila !== index.toString())
        );
        setMostrarModal(null); //Cierra modal del indice seleccionado       
    };

    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaConsultaInventarioEspecie.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaConsultaInventarioEspecie, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Math.ceil(listaConsultaInventarioEspecie.length / elementosPorPagina);
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    return (
        <Layout>
            <Helmet>
                <title>Consulta Inventario para Especie</title>
            </Helmet>
            <MenuInformes />
            <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                <h3 className="form-title fw-semibold border-bottom p-1">Consulta Inventario para Especie</h3>
                <Row className="border rounded p-2 m-2">
                    <Col md={2}>
                        <div className="mb-1">
                            <label htmlFor="af_codigo_generico" className="fw-semibold">Nº Inventario</label>
                            <input
                                aria-label="af_codigo_generico"
                                type="text"
                                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                name="af_codigo_generico"
                                size={10}
                                placeholder="Eje: 1000000008"
                                onChange={handleChange}
                                value={Inventario.af_codigo_generico}
                            />
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
                                        < Search className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                    </>
                                )}
                            </Button>
                            <Button onClick={handleLimpiar}
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                className="mx-1 mb-1">
                                Limpiar
                                <Eraser className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                            </Button>
                        </div>
                    </Col>
                </Row>
                {loading ? (
                    <SkeletonLoader rowCount={elementosPorPagina} />
                ) : (
                    <div className='table-responsive'>
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                                <tr>
                                    <th scope="col" className="text-nowrap text-center"></th>
                                    <th scope="col" className="text-nowrap text-center">Cuenta</th>
                                    <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                                    <th scope="col" className="text-nowrap text-center">N° Traslado</th>
                                    <th scope="col" className="text-nowrap text-center">N° Altas</th>
                                    <th scope="col" className="text-nowrap text-center">Especie</th>
                                    <th scope="col" className="text-nowrap text-center">Marca</th>
                                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                                    <th scope="col" className="text-nowrap text-center">Serie</th>
                                    <th scope="col" className="text-nowrap text-center">Observaciones</th>
                                    <th scope="col" className="text-nowrap text-center">Rut Proveedor</th>
                                    <th scope="col" className="text-nowrap text-center">Nombre Proveedor</th>
                                    <th scope="col" className="text-nowrap text-center">Servicio</th>
                                    <th scope="col" className="text-nowrap text-center">Dependencia</th>
                                    <th scope="col" className="text-nowrap text-center">Fecha Recepción</th>
                                    <th scope="col" className="text-nowrap text-center">Años Vida Útil</th>
                                    <th scope="col" className="text-nowrap text-center">Resolución</th>
                                    <th scope="col" className="text-nowrap text-center">Origen</th>
                                    <th scope="col" className="text-nowrap text-center">Valor</th>

                                </tr>
                            </thead>
                            <tbody>
                                {elementosActuales.map((fila, index) => (
                                    <tr key={indicePrimerElemento + index}>
                                        <td style={{
                                            position: 'sticky',
                                            left: 0

                                        }}>
                                            <Form.Check
                                                type="checkbox"
                                                onChange={() => setSeleccionaFila(index)}
                                                checked={filaSeleccionada.includes(
                                                    (indicePrimerElemento + index).toString()
                                                )}
                                            />
                                        </td>
                                        <td className="text-nowrap">{fila.ctA_COD}</td>
                                        <td className="text-nowrap">{fila.aF_CODIGO_GENERICO}</td>
                                        <td className="text-nowrap">{fila.id}</td>
                                        <td className="text-nowrap">{fila.altaS_CORR}</td>
                                        <td className="text-nowrap">{fila.especie.split('/')[0]}</td>
                                        <td className="text-nowrap">{fila.deT_MARCA}</td>
                                        <td className="text-nowrap">{fila.deT_MODELO}</td>
                                        <td className="text-nowrap">{fila.deT_SERIE}</td>
                                        <td className="text-nowrap">{fila.deT_OBS}</td>
                                        <td className="text-nowrap">{fila.proV_RUN}</td>
                                        <td className="text-nowrap">{fila.proV_NOMBRE}</td>
                                        <td className="text-nowrap">{fila.servicio}</td>
                                        <td className="text-nowrap">{fila.dependencia}</td>
                                        <td className="text-nowrap">{fila.fecha}</td>
                                        <td className="text-nowrap">{fila.vida} de 15 años</td>
                                        <td className="text-nowrap">{fila.aF_RESOLUCION ? fila.aF_RESOLUCION : "n/a"}</td>
                                        <td className="text-nowrap">{fila.origen}</td>
                                        <td className="text-nowrap">
                                            ${(fila.valor ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="paginador-container">
                    <Pagination className="paginador-scroll">
                        <Pagination.First onClick={() => paginar(1)} disabled={paginaActual === 1} />
                        <Pagination.Prev onClick={() => paginar(paginaActual - 1)} disabled={paginaActual === 1} />
                        {Array.from({ length: totalPaginas }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === paginaActual}
                                onClick={() => paginar(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => paginar(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
                        <Pagination.Last onClick={() => paginar(totalPaginas)} disabled={paginaActual === totalPaginas} />
                    </Pagination>
                </div>
            </div>
            {elementosActuales.map((fila, index) => (
                <div key={index}>
                    <Modal
                        show={mostrarModal === index}
                        onHide={() => handleCerrarModal(index)}
                        dialogClassName="modal-right" size="lg">
                        <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                            <Modal.Title className="fw-semibold">Consulta Inventario Especies</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                            <form>

                                {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                                <BlobProvider document={
                                    <DocumentoPDF
                                        row={fila}

                                    />
                                }>
                                    {({ url, loading }) =>
                                        loading ? (
                                            <p>Generando vista previa...</p>
                                        ) : (

                                            <iframe
                                                src={url ? `${url}` : ""}
                                                title="Vista Previa del PDF"
                                                style={{
                                                    width: "100%",
                                                    height: "900px",
                                                    border: "none"
                                                }}
                                            ></iframe>

                                        )
                                    }
                                </BlobProvider>
                            </form>
                        </Modal.Body>
                    </Modal>
                </div>
            ))
            }
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaConsultaInventarioEspecie: state.listaConsultaInventarioEspeciesReducers.listaConsultaInventarioEspecie,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    datosFirmas: state.obtenerfirmasAltasReducers.datosFirmas,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
    listaConsultaInventarioEspecieActions,
})(ConsultaInventarioEspecies);

