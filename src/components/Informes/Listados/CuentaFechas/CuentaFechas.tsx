import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner, Form, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { BoxArrowDown, FileEarmarkExcel, FileEarmarkWord, Search } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import MenuListados from "../../../Menus/MenuListados";
import Layout from "../../../../containers/hocs/layout/Layout";
import SkeletonLoader from "../../../Utils/SkeletonLoader";
import { RootState } from "../../../../store";
import Select from "react-select";
import { comboCuentasInformeActions } from "../../../../redux/actions/Informes/Listados/CuentasFechas/comboCuentasInformeActions";
import { listaCuentaFechasActions } from "../../../../redux/actions/Informes/Listados/CuentasFechas/listaCuentaFechasActions";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";
import DocumentoPDF from "./DocumentoPDFCuentaFechas";
import { BlobProvider } from "@react-pdf/renderer";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};
interface FechasProps {
    fechaInicio: string;
    fechaTermino: string;
}
export interface listaCuentaFechas {
    codinventario: string;
    codcuenta: string;
    cuenta: string;
    nuM_ALTA: number;
    codespecie: string;
    especie: string;
    fechaingreso: string;
    valorinicial: number;
    vidA_UTIL: number;
    depreciacion: number;
    depreciacionacumulada: number;
    deteriorO_DEBE: number;
    deteriorO_HABER: number;
    valorlibro: number;
    estabL_CORR: number;
    establecimiento: string;
    propietario: number;
    destino: string;
    nuM_OCO: string;
    nuM_FAC: string;
    proveedor: string;
    serie: string;
    marca: string;
}
interface ComboCuentas {
    codigo: string;
    descripcion: string;
}

interface DatosAltas {
    listaCuentaFechas: listaCuentaFechas[];
    listaCuentaFechasActions: () => Promise<boolean>;
    obtenerlistaCuentaFechasActions: (FechaInicio: string, FechaTermino: string) => Promise<boolean>;
    comboCuentasInformeActions: () => void;
    token: string | null;
    isDarkMode: boolean;
    comboCuentasInforme: ComboCuentas[];
}

const CuentaFechas: React.FC<DatosAltas> = ({ listaCuentaFechas, comboCuentasInforme, listaCuentaFechasActions, comboCuentasInformeActions, token, isDarkMode }) => {
    const [error, __] = useState<Partial<FechasProps> & {}>({});
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(false); // Estado para controlar la carga 
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 12;

    const cuentasOptions = comboCuentasInforme.map((item) => ({
        value: item.codigo.toString(),
        label: item.descripcion,
    }));

    const [Inventario, setInventario] = useState({
        fechaInicio: "",
        fechaTermino: "",
        ctA_NOMBRE: '',
    });
    const listaCuentaFechasAuto = async () => {
        if (token) {
            if (listaCuentaFechas.length === 0) {
                setLoading(true);
                const resultado = await listaCuentaFechasActions();
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
        listaCuentaFechasAuto();
        if (comboCuentasInforme.length === 0) { comboCuentasInformeActions() }
    }, [listaCuentaFechasActions, token, listaCuentaFechas.length]); // Asegúrate de incluir dependencias relevantes

    // const validate = () => {
    //     let tempErrors: Partial<any> & {} = {};
    //     // Validación para N° de Recepción (debe ser un número)
    //     if (!Inventario.fechaInicio) tempErrors.fechaInicio = "La Fecha de Inicio es obligatoria.";
    //     if (!Inventario.fechaTermino) tempErrors.fechaTermino = "La Fecha de Término es obligatoria.";
    //     if (Inventario.fechaInicio > Inventario.fechaTermino) tempErrors.fechaInicio = "La fecha de inicio es mayor a la fecha de término";
    //     // if (!Inventario.nInventario) tempErrors.nInventario = "La Fecha de Inicio es obligatoria.";


    //     setError(tempErrors);
    //     return Object.keys(tempErrors).length === 0;
    // };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue: string | number = [
            "aF_CLAVE"

        ].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setInventario((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));

    };

    const handleCuentasChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : "";
        setInventario((prevMantenedor) => ({ ...prevMantenedor, ctA_NOMBRE: value }));
    }

    // const handleBuscarAltas = async () => {
    //     let resultado = false;
    //     setLoading(true);
    //     resultado = await obtenerAltasPorCorrActions(Inventario);
    //     if (Inventario.fechaInicio != "" && Inventario.fechaTermino != "") {
    //         if (validate()) {
    //             resultado = await obtenerlistaCuentaFechasActions(Inventario.fechaInicio, Inventario.fechaTermino);
    //         }
    //     }
    //     setInventario((prevState) => ({
    //         ...prevState,
    //         aF_CLAVE: 0,
    //         fechaInicio: "",
    //         fechaTermino: ""
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

    const setSeleccionaFilas = (index: number) => {
        setFilasSeleccionadas((prev) =>
            prev.includes(index.toString())
                ? prev.filter((rowIndex) => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
        // console.log("indices seleccionmados", index);
    };

    const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setFilasSeleccionadas(
                elementosActuales.map((_, index) =>
                    (indicePrimerElemento + index).toString()
                )
            );
            // console.log("filas Seleccionadas ", filasSeleccionadas);
        } else {
            setFilasSeleccionadas([]);
        }
    };

    // Lógica de Paginación actualizada
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () =>
            listaCuentaFechas.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaCuentaFechas, indicePrimerElemento, indiceUltimoElemento]
    );
    // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
    const totalPaginas = Array.isArray(listaCuentaFechas)
        ? Math.ceil(listaCuentaFechas.length / elementosPorPagina)
        : 0;
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);


    // 📂 Función para exportar a Excel
    const exportarExcel = (listaFolioServicioDependencia: any[], fileName: string = "Reporte.xlsx") => {
        // Definir los encabezados
        const encabezados = [
            [
                "Código Cuenta",
                "Cuenta",
                "Especie",
                "Código Inventario",
                "Fecha Ingreso",
                "Marca",
                "Serie",
                "N° Alta",
                "N° OCO",
                "N° Factura",
                "Proveedor",
                "Establecimiento",
                "Destino",
                "Valor Inicial",
                "Depreciación",
                "Depreciación Acumulada",
                "Valor Libro"
            ]
        ];

        // Convertir datos a array de arrays
        const datos = listaFolioServicioDependencia.map((item) => [
            item.codcuenta ?? "",
            item.cuenta ?? "",
            item.especie ?? "",
            item.codinventario ?? "",
            item.fechaingreso ?? "",
            item.marca ?? "",
            item.serie ?? "",
            item.nuM_ALTA?.toString() ?? "",
            item.nuM_OCO ?? "",
            item.nuM_FAC ?? "",
            item.proveedor ?? "",
            item.establecimiento ?? "",
            item.destino ?? "",
            item.valorinicial?.toString() ?? "",
            item.depreciacion?.toString() ?? "",
            item.depreciacionacumulada?.toString() ?? "",
            item.valorlibro?.toString() ?? ""
        ]);

        // Crear hoja de cálculo
        const worksheet = XLSX.utils.aoa_to_sheet([...encabezados, ...datos]);

        worksheet["!cols"] = [
            { wch: 12 }, // Código Cuenta
            { wch: 70 }, // Cuenta
            { wch: 50 }, // Especie
            { wch: 12 }, // Código Inventario
            { wch: 15 }, // Fecha Ingreso
            { wch: 12 }, // Marca
            { wch: 15 }, // Serie
            { wch: 12 }, // Nº Alta
            { wch: 12 }, // Nº OCO
            { wch: 12 }, // Nº Factura
            { wch: 20 }, // Proveedor
            { wch: 70 }, // Establecimiento
            { wch: 15 }, // Destino
            { wch: 12 }, // Valor Inicial
            { wch: 12 }, // Depreciación
            { wch: 12 }, // Depreciación Acumulada
            { wch: 12 }  // Valor Libro
        ];

        // Aplicar color de fondo a los encabezados
        const range = XLSX.utils.decode_range(worksheet["!ref"]!);
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: C }); // Celda del encabezado
            if (worksheet[cellRef]) {
                worksheet[cellRef].s = {
                    fill: { fgColor: { rgb: "FFFF00" } }, // Fondo amarillo
                    font: { bold: true, color: { rgb: "000000" } }, // Texto negro en negrita
                    alignment: { horizontal: "center", vertical: "center" } // Centrado
                };
            }
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
                                            children: [new Paragraph("Código Cuenta")],
                                            shading: { fill: "CCCCCC" }, // Fondo gris
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Cuenta")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Especie")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Código Inventario")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Fecha Ingreso")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Marca")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Serie")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("N° Alta")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("N° OCO")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("N° Factura")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Proveedor")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Establecimiento")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Destino")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Valor Inicial")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Depreciación")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Depreciación Acumulada")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Valor Libro")],
                                            shading: { fill: "CCCCCC" },
                                        }),
                                    ],
                                }),
                                // Filas dinámicas con datos
                                ...listaCuentaFechas.map((item) =>
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(item.codcuenta)] }),
                                            new TableCell({ children: [new Paragraph(item.cuenta)] }),
                                            new TableCell({ children: [new Paragraph(item.especie)] }),
                                            new TableCell({ children: [new Paragraph(item.codinventario)] }),
                                            new TableCell({ children: [new Paragraph(item.fechaingreso)] }),
                                            new TableCell({ children: [new Paragraph(item.marca)] }),
                                            new TableCell({ children: [new Paragraph(item.serie)] }),
                                            new TableCell({ children: [new Paragraph(item.nuM_ALTA.toString())] }),
                                            new TableCell({ children: [new Paragraph(item.nuM_OCO)] }),
                                            new TableCell({ children: [new Paragraph(item.nuM_FAC)] }),
                                            new TableCell({ children: [new Paragraph(item.proveedor)] }),
                                            new TableCell({ children: [new Paragraph(item.establecimiento)] }),
                                            new TableCell({ children: [new Paragraph(item.destino)] }),
                                            new TableCell({ children: [new Paragraph(item.valorinicial.toString())] }),
                                            new TableCell({ children: [new Paragraph(item.depreciacion.toString())] }),
                                            new TableCell({ children: [new Paragraph(item.depreciacionacumulada.toString())] }),
                                            new TableCell({ children: [new Paragraph(item.valorlibro.toString())] }),

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
            saveAs(blob, "Reporte.docx");
        });
    };
    return (
        <Layout>
            <Helmet>
                <title>Reporte articulos por cuentas</title>
            </Helmet>
            <MenuListados />
            <form>
                <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                    <h3 className="form-title fw-semibold border-bottom p-1">Reporte articulos por cuentas</h3>
                    <Row>
                        <Col md={3}>
                            <div className="mb-1">
                                <label htmlFor="fechaInicio" className="fw-semibold">Desde</label>
                                <input
                                    aria-label="fechaInicio"
                                    type="date"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaInicio ? "is-invalid" : ""}`}
                                    name="fechaInicio"
                                    onChange={handleChange}
                                    value={Inventario.fechaInicio}
                                />
                                {error.fechaInicio && (
                                    <div className="invalid-feedback d-block">{error.fechaInicio}</div>
                                )}
                            </div>
                            <div className="mb-1">
                                <label htmlFor="fechaTermino" className="fw-semibold">Hasta</label>
                                <input
                                    aria-label="fechaTermino"
                                    type="date"
                                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaTermino ? "is-invalid" : ""}`}
                                    name="fechaTermino"
                                    onChange={handleChange}
                                    value={Inventario.fechaTermino}
                                />
                                {error.fechaTermino && (
                                    <div className="invalid-feedback">{error.fechaTermino}</div>
                                )}
                            </div>

                        </Col>
                        <Col md={4}>
                            <div className="mb-1 z-1000">
                                <label className="fw-semibold">
                                    Seleccione una cuenta
                                </label>
                                <Select
                                    options={cuentasOptions}
                                    onChange={handleCuentasChange}
                                    name="ctA_NOMBRE"
                                    value={cuentasOptions.find((option) => option.value === Inventario.ctA_NOMBRE) || null}
                                    placeholder="Buscar"
                                    className={`form-select-container`}
                                    classNamePrefix="react-select"
                                    isClearable
                                    isSearchable
                                />
                            </div>
                        </Col>
                        <Col md={5}>
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
                                <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                                    <tr>
                                        <th >
                                            <Form.Check
                                                className="check-danger"
                                                type="checkbox"
                                                onChange={handleSeleccionaTodos}
                                                checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                            />
                                        </th>
                                        <th scope="col" className="text-nowrap text-center">Codigo Cuenta</th>
                                        <th scope="col" className="text-nowrap text-center">Cuenta</th>
                                        <th scope="col" className="text-nowrap text-center">Especies</th>
                                        <th scope="col" className="text-nowrap text-center">Codigo Inventario</th>
                                        <th scope="col" className="text-nowrap text-center">Fecha de Ingreso</th>
                                        <th scope="col" className="text-nowrap text-center">Marca</th>
                                        <th scope="col" className="text-nowrap text-center">Serie</th>
                                        <th scope="col" className="text-nowrap text-center">Nº Alta</th>
                                        <th scope="col" className="text-nowrap text-center">Nº OC</th>
                                        <th scope="col" className="text-nowrap text-center">Nº Factura</th>
                                        <th scope="col" className="text-nowrap text-center">Proovedor</th>
                                        <th scope="col" className="text-nowrap text-center">Establecimiento</th>
                                        <th scope="col" className="text-nowrap text-center">Destino</th>
                                        <th scope="col" className="text-nowrap text-center">Valor Inicial</th>
                                        <th scope="col" className="text-nowrap text-center">Depreciación</th>
                                        <th scope="col" className="text-nowrap text-center">Depreciación Acumulada</th>
                                        <th scope="col" className="text-nowrap text-center">Valor Libro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {elementosActuales.map((Lista, index) => {
                                        const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <Form.Check
                                                        type="checkbox"
                                                        onChange={() => setSeleccionaFilas(indexReal)}
                                                        checked={filasSeleccionadas.includes(indexReal.toString())}
                                                    />
                                                </td>
                                                <td className="text-nowrap text-center">{Lista.codcuenta}</td>
                                                <td className="text-nowrap text-center">{Lista.cuenta}</td>
                                                <td className="text-nowrap text-center">{Lista.especie}</td>
                                                <td className="text-nowrap text-center">{Lista.codinventario}</td>
                                                <td className="text-nowrap text-center">{Lista.fechaingreso}</td>
                                                <td className="text-nowrap text-center">{Lista.marca}</td>
                                                <td className="text-nowrap text-center">{Lista.serie}</td>
                                                <td className="text-nowrap text-center">{Lista.nuM_ALTA}</td>
                                                <td className="text-nowrap text-center">{Lista.nuM_OCO}</td>
                                                <td className="text-nowrap text-center">{Lista.nuM_FAC}</td>
                                                <td className="text-nowrap text-center">{Lista.proveedor}</td>
                                                <td className="text-nowrap text-center">{Lista.establecimiento}</td>
                                                <td className="text-nowrap text-center">{Lista.destino}</td>
                                                <td className="text-nowrap text-center">{Lista.valorinicial}</td>
                                                <td className="text-nowrap text-center">{Lista.depreciacion}</td>
                                                <td className="text-nowrap text-center">{Lista.depreciacionacumulada}</td>
                                                <td className="text-nowrap text-center">{Lista.valorlibro}</td>
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
                            row={listaCuentaFechas}
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
                                            onClick={() => exportarExcel(listaCuentaFechas)}
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
    listaCuentaFechas: state.listaCuentaFechasReducers.listaCuentaFechas,
    comboCuentasInforme: state.comboCuentasInformeReducers.comboCuentasInforme,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
    listaCuentaFechasActions,
    comboCuentasInformeActions
})(CuentaFechas);
