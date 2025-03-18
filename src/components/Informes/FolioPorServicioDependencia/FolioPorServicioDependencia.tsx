import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner, Modal } from "react-bootstrap";
import { RootState } from "../../../store";
import { connect } from "react-redux";
import Layout from "../../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { BoxArrowDown, FileEarmarkExcel, FileEarmarkWord, Search } from "react-bootstrap-icons";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { Helmet } from "react-helmet-async";
import MenuInformes from "../../Menus/MenuInformes";
import { comboServicioInformeActions } from "../../../redux/actions/Informes/Principal/comboServicioInformeActions";
import { Objeto } from "../../Navegacion/Profile";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoPDF from "./DocumentoPDFServicioDependencia";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";
import { listaFolioServicioDependenciaActions } from "../../../redux/actions/Informes/Principal/listaFolioServicioDependenciaActions";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};

export interface ListaFolioServicioDependencia {
    servicio: string;
    dependencia: string;
    cuenta: string;
    especie: string;
    tipo: string;
    traS_ESTADO_AF: string;
    deP_CORR: number;
    deP_COD: string;
    seR_CORR: number;
    seR_COD: string;
    ctA_COD: string;
    altaS_CORR: number;
    aF_CANTIDAD: string;
    aF_RESOLUCION: string;
    aF_CODIGO_GENERICO: string;
    aF_FINGRESO: string;
    traS_CORR: number;
    aF_ESPECIE: string;
    aF_MARCA: string;
    aF_MODELO: string;
    aF_SERIE: string;
    aF_OBS: string;
    aF_FOLIO: string;
    ntraslado: number;
    deP_CORR_DESTINO: number;
    aF_CLAVE: number;
    valoR_LIBRO: number;
    vidA_UTIL: string;
    vutiL_RESTANTE: string;
    estabL_CORR: number;
}

interface SERVICIO {
    deP_CORR: number;
    descripcion: string;
}

interface DatosAltas {
    listaFolioServicioDependencia: ListaFolioServicioDependencia[];
    listaFolioServicioDependenciaActions: () => Promise<boolean>;
    comboServicioInforme: SERVICIO[];
    comboServicioInformeActions: (establ_corr: number) => void;
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const FolioPorServicioDependencia: React.FC<DatosAltas> = ({ listaFolioServicioDependencia, comboServicioInforme, objeto, listaFolioServicioDependenciaActions, comboServicioInformeActions, token, isDarkMode }) => {
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
    const listaAuto = async () => {
        if (token) {
            if (listaFolioServicioDependencia.length === 0) {
                setLoading(true);
                const resultado = await listaFolioServicioDependenciaActions();
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
        listaAuto();
        if (comboServicioInforme.length === 0) { comboServicioInformeActions(objeto.Establecimiento); };
    }, [listaFolioServicioDependencia, comboServicioInforme, token]); // Asegúrate de incluir dependencias relevantes

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
            listaFolioServicioDependencia.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaFolioServicioDependencia, indicePrimerElemento, indiceUltimoElemento]
    );
    // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
    const totalPaginas = Array.isArray(listaFolioServicioDependencia)
        ? Math.ceil(listaFolioServicioDependencia.length / elementosPorPagina)
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

    // 📂 Función para exportar a Excel
    const exportarExcel = (listaFolioServicioDependencia: any[], fileName: string = "Reporte.xlsx") => {
        // Definir los encabezados
        const encabezados = [
            ["N° Inventario", "Especie", "Marca", "Modelo", "Serie", "Observación", "Fecha Ingreso", "Nº Alta", "Estado", "Nº Traslado"]
        ];

        // Convertir datos a array de arrays
        const datos = listaFolioServicioDependencia.map((item) => [
            item.aF_CLAVE ?? "",
            item.especie ?? "",
            item.aF_MARCA ?? "",
            item.aF_MODELO ?? "",
            item.aF_SERIE ?? "",
            item.aF_OBS ?? "",
            item.aF_FINGRESO ?? "",
            item.altaS_CORR ?? "",
            item.traS_ESTADO_AF ?? "",
            item.ntraslado ?? ""
        ]);

        // Crear hoja de cálculo
        const worksheet = XLSX.utils.aoa_to_sheet([...encabezados, ...datos]);

        // Aplicar anchos de columna
        worksheet["!cols"] = [
            { wch: 12 }, // N° Inventario
            { wch: 150 }, // Especie
            { wch: 12 }, // Marca
            { wch: 12 }, // Modelo
            { wch: 12 }, // Serie
            { wch: 150 },  // Observacion
            { wch: 12 },  // Fecha Ingreso
            { wch: 12 }, // Nº Alta 
            { wch: 12 }, // Estado
            { wch: 12 },  // Nº Traslado
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
                                            children: [new Paragraph("Observación")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Fecha Ingreso")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Nº Alta")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Estado")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Nº Traslado")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                    ],
                                }),
                                // Filas dinámicas con datos
                                ...listaFolioServicioDependencia.map((item) =>
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(item.aF_CLAVE.toString())] }),
                                            new TableCell({ children: [new Paragraph(item.especie)] }),
                                            new TableCell({ children: [new Paragraph(item.aF_MARCA)] }),
                                            new TableCell({ children: [new Paragraph(item.aF_MODELO)] }),
                                            new TableCell({ children: [new Paragraph(item.aF_SERIE)] }),
                                            new TableCell({ children: [new Paragraph(item.aF_OBS)] }),
                                            new TableCell({ children: [new Paragraph(item.aF_FINGRESO)] }),
                                            new TableCell({ children: [new Paragraph(item.altaS_CORR.toString())] }),
                                            new TableCell({ children: [new Paragraph(item.traS_ESTADO_AF)] }),
                                            new TableCell({ children: [new Paragraph(item.ntraslado.toString())] }),
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
                                        <option key={traeServicio.deP_CORR} value={traeServicio.deP_CORR}>
                                            {traeServicio.descripcion}
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
                                        <th scope="col" className="text-nowrap text-center">Fecha Ingreso</th>
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
                                                <td className="text-nowrap text-start">{Lista.especie}</td>
                                                <td className="text-nowrap text-center">{Lista.aF_MARCA}</td>
                                                <td className="text-nowrap text-center">{Lista.aF_MODELO}</td>
                                                <td className="text-nowrap text-center">{Lista.aF_SERIE}</td>
                                                <td className="text-nowrap text-start">{Lista.aF_OBS}</td>
                                                <td className="text-nowrap text-center">{Lista.aF_FINGRESO}</td>
                                                <td className="text-nowrap text-center">{Lista.altaS_CORR}</td>
                                                <td className="text-nowrap text-center">{Lista.traS_ESTADO_AF}</td>
                                                <td className="text-nowrap text-center">{Lista.ntraslado}</td>
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
                            row={listaFolioServicioDependencia}
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
                                            onClick={() => exportarExcel(listaFolioServicioDependencia)}
                                            variant="success">
                                            Descargar Excel
                                            <FileEarmarkExcel className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
                                        </Button>
                                        <Button
                                            onClick={() => exportarWord()}
                                            variant="primary">
                                            Descargar Word
                                            <FileEarmarkWord className={classNames("flex-shrink-0", "h-5 w-5 ms-1")} aria-hidden="true" />
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
    listaFolioServicioDependencia: state.listaFolioServicioDependenciaReducers.listaFolioServicioDependencia,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboServicioInforme: state.comboServicioInformeReducers.comboServicioInforme,
    objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
    listaFolioServicioDependenciaActions,
    comboServicioInformeActions
})(FolioPorServicioDependencia);
