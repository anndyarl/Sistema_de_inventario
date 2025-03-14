import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner, Modal } from "react-bootstrap";
import { RootState } from "../../../store";
import { connect } from "react-redux";
import Layout from "../../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { BoxArrowDown, FileEarmarkExcel, Search } from "react-bootstrap-icons";
import { listaAltasActions } from "../../../redux/actions/Altas/AnularAltas/listaAltasActions";
import { obtenerListaAltasActions } from "../../../redux/actions/Altas/AnularAltas/obtenerListaAltasActions";
import { obtenerAltasPorCorrActions } from "../../../redux/actions/Altas/AnularAltas/obtenerAltasPorCorrActions";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { Helmet } from "react-helmet-async";
import MenuInformes from "../../Menus/MenuInformes";
import { comboServicioInformeActions } from "../../../redux/actions/Informes/comboServicioInformeActions";
import { Objeto } from "../../Navegacion/Profile";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoPDF from "./DocumentoPDFServicioDependencia";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};

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

interface SERVICIO {
    codigo: number;
    nombrE_ORD: string;
    descripcion: string;
}

interface DatosAltas {
    listaAltas: ListaAltas[];
    listaAltasActions: () => Promise<boolean>;
    obtenerListaAltasActions: (FechaInicio: string, FechaTermino: string) => Promise<boolean>;
    obtenerAltasPorCorrActions: (altasCorr: number) => Promise<boolean>;
    comboServicioInforme: SERVICIO[];
    comboServicioInformeActions: (establ_corr: number) => void;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const FolioPorServicioDependencia: React.FC<DatosAltas> = ({ listaAltas, comboServicioInforme, objeto, listaAltasActions, comboServicioInformeActions, token, isDarkMode }) => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(false); // Estado para controlar la carga
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 12;

    const [Inventario, setInventario] = useState({
        encargadoInventario: "",
        jefeDependencia: "",
        jefeInventario: "",
        servicio: 0
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
        if (comboServicioInforme.length === 0) { comboServicioInformeActions(objeto.Establecimiento); };
    }, [listaAltasActions, token, listaAltas.length]); // Asegúrate de incluir dependencias relevantes

    // const validate = () => {
    //     let tempErrors: Partial<any> & {} = {};
    //     // Validación para N° de Recepción (debe ser un número)
    //     if (!Inventario.encargadoInventario) tempErrors.encargadoInventario = "Campo obligatorio.";
    //     if (!Inventario.jefeDependencia) tempErrors.jefeDependencia = "Campo obligatorio.";
    //     if (!Inventario.jefeInventario) tempErrors.jefeInventario = "Campo obligatorio.";


    //     setError(tempErrors);
    //     return Object.keys(tempErrors).length === 0;
    // };
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue: string | number = [""].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setInventario((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    // const handleBuscarAltas = async () => {
    //     let resultado = false;
    //     setLoading(true);
    //     resultado = await obtenerListaBienesActions(Inventario.encargadoInventario);

    //     //resetea campos una vez hecha la busqueda
    //     setInventario((prevState) => ({
    //         ...prevState,
    //         encargadoInventario: "",
    //         jefeDependencia: "",
    //         jefeInventario: "",
    //         servicio: 0,
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

    // Función para exportar a Excel
    // const exportarExcel = (listaAltas: ListaAltas[], fileName: string = "reporte.xlsx") => {
    //     const worksheet = XLSX.utils.json_to_sheet(listaAltas);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    //     const dataBlob = new Blob([excelBuffer], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    //     });

    //     saveAs(dataBlob, fileName);
    // };

    const exportarExcel = (listaAltas: any[], fileName: string = "reporte.xlsx") => {
        // Definir los encabezados
        const encabezados = [
            ["N° Inventario", "Especie", "Marca", "Modelo", "Serie", "Precio"]
        ];

        // Convertir datos a array de arrays
        const datos = listaAltas.map((item) => [
            item.ninv ?? "",
            item.esp ?? "",
            item.marca ?? "",
            item.modelo ?? "",
            item.serie ?? "",
            item.precio ?? ""
        ]);

        // Crear hoja de cálculo
        const worksheet = XLSX.utils.aoa_to_sheet([...encabezados, ...datos]);

        // Aplicar anchos de columna
        worksheet["!cols"] = [
            { wch: 15 }, // N° Inventario
            { wch: 20 }, // Especie
            { wch: 15 }, // Marca
            { wch: 15 }, // Modelo
            { wch: 20 }, // Serie
            { wch: 12 }  // Precio
        ];

        // Aplicar color de fondo a los encabezados
        const range = XLSX.utils.decode_range(worksheet["!ref"]!);
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: C }); // Celda del encabezado
            if (!worksheet[cellRef]) continue;

            worksheet[cellRef].s = {
                fill: { fgColor: { rgb: "000000" } }, // Fondo amarillo
                font: { bold: true, color: { rgb: "FFFFFF" } } // Texto blanco en negrita
            };
        }

        // Crear libro de Excel
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

        // Descargar el archivo
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fileName);
    };

    // 📂 Función para exportar a Word
    const exportarWord = () => {
        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            text: "Folio por Servicio Dependencia",
                            heading: "Heading1",
                        }),
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE }, // Ajustar la tabla al 100% del ancho
                            rows: [
                                // Encabezado de la tabla
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph("N° Inventario")],
                                            shading: { fill: "CCCCCC" }, // Fondo gris
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Especie")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Marca")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Modelo")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Serie")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Precio")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                    ],
                                }),
                                // Filas dinámicas con datos
                                ...listaAltas.map((item) =>
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(item.ninv)] }),
                                            new TableCell({ children: [new Paragraph(item.esp)] }),
                                            new TableCell({ children: [new Paragraph(item.marca)] }),
                                            new TableCell({ children: [new Paragraph(item.modelo)] }),
                                            new TableCell({ children: [new Paragraph(item.serie)] }),
                                            new TableCell({ children: [new Paragraph(item.precio)] }),
                                        ],
                                    })
                                ),
                            ],
                        }),
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "Inventario.docx");
        });
    };
    return (
        <Layout>
            <Helmet>
                <title>Folio por Servicio Dependencia</title>
            </Helmet>
            <MenuInformes />
            <form>
                <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                    <h3 className="form-title fw-semibold border-bottom p-1">Folio por Servicio Dependencia</h3>
                    <Row>
                        <Col md={3}>
                            <div className="mt-1">
                                <label className="fw-semibold">Servicio</label>
                                <select
                                    aria-label="servicio"
                                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="servicio"
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar</option>
                                    {comboServicioInforme.map((traeServicio) => (
                                        <option key={traeServicio.codigo} value={traeServicio.codigo}>
                                            {traeServicio.nombrE_ORD}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-1">
                                <label htmlFor="encargadoInventario" className="fw-semibold">Encargado de Inventario de la dependencia</label>
                                <input
                                    aria-label="encargadoInventario"
                                    type="text"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="encargadoInventario"
                                    placeholder="Ingrege un nombre"
                                    onChange={handleChange}
                                    value={Inventario.encargadoInventario}
                                />
                            </div>

                        </Col>
                        <Col md={3}>
                            <div className="mb-1">
                                <label htmlFor="jefeDependencia" className="fw-semibold">Jefe de Dependencia</label>
                                <input
                                    aria-label="jefeDependencia"
                                    type="text"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="jefeDependencia"
                                    placeholder="Ingrege un nombre"
                                    onChange={handleChange}
                                    value={Inventario.jefeDependencia}
                                />
                            </div>

                            <div className="mb-1">
                                <label htmlFor="jefeInventario" className="fw-semibold">Jefe de Inventario</label>
                                <input
                                    aria-label="jefeInventario"
                                    type="text"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                    name="jefeInventario"
                                    placeholder="Ingrege un nombre"
                                    onChange={handleChange}
                                    value={Inventario.jefeInventario}
                                />
                            </div>
                        </Col>
                        <Col md={3}>
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
                                <Button
                                    variant="primary"
                                    onClick={() => setMostrarModal(true)}
                                    className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}>
                                    Exportar
                                    <BoxArrowDown className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
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
                        <div className='table-responsive'>
                            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                                <thead className={`sticky-top  z-0 ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                                    <tr>
                                        <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                                        <th scope="col" className="text-nowrap text-center">Especie</th>
                                        <th scope="col" className="text-nowrap text-center">Marca</th>
                                        <th scope="col" className="text-nowrap text-center">Modelo</th>
                                        <th scope="col" className="text-nowrap text-center">Serie</th>
                                        <th scope="col" className="text-nowrap text-center">Observación</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha Inngreso</th>
                                        <th scope="col" className="text-nowrap text-center">Nº Alta</th>
                                        <th scope="col" className="text-nowrap text-center">Estado</th>
                                        <th scope="col" className="text-nowrap text-center">Nº Traslado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {elementosActuales.map((Lista, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="text-nowrap text-center">{Lista.aF_CLAVE}</td>
                                                <td className="text-nowrap text-center">{Lista.ninv}</td>
                                                <td className="text-nowrap text-center">{Lista.serv}</td>
                                                <td className="text-nowrap text-center">{Lista.dep}</td>
                                                <td className="text-nowrap text-center">{Lista.esp}</td>
                                                <td className="text-nowrap text-center">{Lista.ncuenta}</td>
                                                <td className="text-nowrap text-center">{Lista.marca}</td>
                                                <td className="text-nowrap text-center">{Lista.modelo}</td>
                                                <td className="text-nowrap text-center">{Lista.serie}</td>
                                                <td className="text-nowrap text-center">{Lista.serie}</td>

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
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="xl">
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Folio por Servicio Dependencia</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                    <BlobProvider document={
                        <DocumentoPDF
                            row={listaAltas}
                        />
                    }>
                        {({ url, loading }) =>
                            loading ? (
                                <p>Generando vista previa...</p>
                            ) : (

                                <>
                                    {/* Botones para exportar a Excel y Word */}
                                    <div className="mt-3 d-flex justify-content-center gap-2 mb-1">
                                        <Button
                                            onClick={() => exportarExcel(listaAltas)}
                                            variant="success">
                                            Descargar Excel
                                            <FileEarmarkExcel className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                        </Button>
                                        <Button
                                            onClick={() => exportarWord()}
                                            variant="primary">
                                            Descargar Word
                                            <FileEarmarkExcel className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                        </Button>
                                    </div>
                                    {/* Frame para vista previa del PDF */}
                                    <iframe
                                        src={url ? `${url}` : ""}
                                        title="Vista Previa del PDF"
                                        style={{
                                            width: "100%",
                                            height: "900px",
                                            border: "none"
                                        }}
                                    ></iframe>
                                </>

                            )
                        }
                    </BlobProvider>
                </Modal.Body>
            </Modal>
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaAltas: state.datosListaAltasReducers.listaAltas,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboServicioInforme: state.comboServicioInformeReducers.comboServicioInforme,
    objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
    listaAltasActions,
    obtenerListaAltasActions,
    obtenerAltasPorCorrActions,
    comboServicioInformeActions
})(FolioPorServicioDependencia);
