import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { RootState } from "../../store";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { Eraser, FileExcel, Search } from "react-bootstrap-icons";
import MenuInventario from "../Menus/MenuInventario";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";
import { listaInventarioAnularActions } from "../../redux/actions/Inventario/AnularInventario/listaInventarioAnularActions.tsx";
import { anularInventarioActions } from "../../redux/actions/Inventario/AnularInventario/anularInventarioActions";
import { listaAltasActions } from "../../redux/actions/Altas/RegistrarAltas/listaAltasActions.tsx";
import { TablaGenerica } from "../Utils/TablaGenerica.tsx";
import { PageSizeSelector } from "../Utils/PageSizeSelector.tsx";
import * as XLSX from "xlsx";
export interface InventarioCompleto {
    aF_CLAVE: number;
    aF_CODIGO_GENERICO: string;
    seR_NOMBRE: string;
    deP_NOMBRE: string;
    aF_ALTA: string;
    aF_CANTIDAD: number;
    aF_DESCRIPCION: string;
    aF_ESTADO: string;
    aF_ETIQUETA: string;
    aF_FECHA_SOLICITUD: string; // formato ISO string (puedes cambiar a Date si es necesario)
    aF_FECHAFAC: string;
    aF_FINGRESO: string;
    aF_MONTOFACTURA: number;
    aF_NUM_FAC: string;
    aF_OCO_NUMERO_REF: string;
    nrecepcion: string;
    aF_ORIGEN: number;
    origen: string;
    aF_TIPO: string;
    aF_VIDAUTIL: number;
    ctA_NOMBRE: string;
    ctA_COD: string;
    esP_NOMBRE: string;
    esP_CODIGO: number;
    usuariO_CREA: string;
    deT_LOTE: string;
    deT_MARCA: string;
    deT_MODELO: string;
    deT_OBS: string;
    deT_PRECIO: number;
    deT_SERIE: string;
    proV_NOMBRE: string;
    altaS_CORR: number,
    aF_ESTADO_INV: number
}

interface ListaInventarioProps {
    listaInventarioAnular: InventarioCompleto[];
    listaInventarioAnularActions: (af_codigo_generico: string, FechaInicio: string, FechaTermino: string, fechaIniF: string, estabL_CORR: number, af_precio_ref: number, af_inv_estado: number | null) => Promise<boolean>;
    anularInventarioActions: (aF_CLAVE: number) => Promise<boolean>;
    listaAltasActions: (fDesde: string, fHasta: string, af_codigo_generico: string, altas_corr: number, establ_corr: number) => Promise<boolean>;
    isDarkMode: boolean;
    objeto: Objeto;
}

interface FechasProps {
    fechaInicio: string;
    fechaTermino: string;
}

const AnularInventario: React.FC<ListaInventarioProps> = ({ listaInventarioAnularActions, anularInventarioActions, listaAltasActions, listaInventarioAnular, isDarkMode, objeto }) => {
    const [error, setError] = useState<Partial<FechasProps> & {}>({});
    const [loading, setLoading] = useState(false);
    const [loadingCrowne, setLoadingCrowne] = useState(false);
    const [__, setElementoSeleccionado] = useState<FechasProps[]>([]);
    // Estados para ordenamiento
    const [sortColumn, setSortColumn] = useState<keyof InventarioCompleto | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [paginaActual, setPaginaActual] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [Inventario, setInventario] = useState({
        af_codigo_generico: "",
        fechaInicio: "",
        fechaTermino: "",
        fechaIniF: "2026-03-16",
    });



    const validate = () => {
        let tempErrors: Partial<any> & {} = {};

        // Validar que si hay fecha de inicio, debe haber fecha de término
        if (Inventario.fechaInicio && !Inventario.fechaTermino) {
            tempErrors.fechaTermino = "Debe ingresar una fecha de término.";
        }

        // Validar que si hay fecha de término, debe haber fecha de inicio
        if (!Inventario.fechaInicio && Inventario.fechaTermino) {
            tempErrors.fechaInicio = "Debe ingresar una fecha de inicio.";
        }

        // Si ambas fechas están presentes, validar el rango
        if (Inventario.fechaInicio && Inventario.fechaTermino) {
            if (Inventario.fechaInicio > Inventario.fechaTermino) {
                tempErrors.fechaInicio = "La fecha de inicio no puede ser mayor a la fecha de término.";
                tempErrors.fechaTermino = "La fecha de término no puede ser menor a la fecha de inicio.";
            }
        }

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };


    const listaAuto = async () => {
        if (listaInventarioAnular.length === 0) {
            setLoading(true);
            const resultado = await listaInventarioAnularActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento, 0, 4);
            if (!resultado) {
                Swal.fire({
                    icon: "warning",
                    title: "Sin Resultados",
                    text: "No hay registros disponibles para mostrar.",
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                    customClass: {
                        popup: "custom-border", // Clase personalizada para el borde
                    }
                });
                setLoading(false);
            }
            else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        listaAuto();
    }, [listaInventarioAnularActions, listaInventarioAnular.length]); // Asegúrate de incluir dependencias relevantes

    useEffect(() => {
        setPaginaActual(1);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Validación específica para af_codigo_generico: solo permitir números
        if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
            return; // Salir si contiene caracteres no numéricos
        }

        // Convierte `value` a número
        let newValue: string | number = ["af_precio_ref"].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setInventario((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    const handleBuscar = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        setLoading(true);
        setError({});
        let resultado = false;

        // Si ambas fechas están ingresadas, validar    
        if (!validate()) {
            setLoading(false);
            return;
        }
        console.log(Inventario);
        resultado = await listaInventarioAnularActions(Inventario.af_codigo_generico, Inventario.fechaInicio, Inventario.fechaTermino, "", objeto.Roles[0].codigoEstablecimiento, 0, 4);


        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin resultados",
                text: "No se encontraron registros para la búsqueda realizada.",
                confirmButtonText: "Ok",
                background: isDarkMode ? "#1e1e1e" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
                confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
                customClass: {
                    popup: "custom-border",
                },
            });
            setLoading(false);
            return;
        } else {
            setLoading(false); //Finaliza estado de carga
        }
    };
    const handleBuscarCrown = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        setLoadingCrowne(true);
        setError({});
        let resultado = false;

        // Si ambas fechas están ingresadas, validar    
        if (!validate()) {
            setLoadingCrowne(false);
            return;
        }
        resultado = await listaInventarioAnularActions("", "", "", Inventario.fechaIniF, 0, 1, 0);


        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin resultados",
                text: "No se encontraron registros para la búsqueda realizada.",
                confirmButtonText: "Ok",
                background: isDarkMode ? "#1e1e1e" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
                confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
                customClass: {
                    popup: "custom-border",
                },
            });
            setLoadingCrowne(false);
            return;
        } else {
            setLoadingCrowne(false); //Finaliza estado de carga
        }
    };

    const handleLimpiar = () => {
        setInventario((prevInventario) => ({
            ...prevInventario,
            fechaInicio: "",
            fechaTermino: "",
            af_codigo_generico: ""
        }));
    };

    const handleAnular = async (aF_CLAVE: number, aF_CODIGO_GENERICO: string) => {
        setElementoSeleccionado((prev) => prev.filter((_, i) => i !== aF_CLAVE));
        const item = listaInventarioAnular.find((i) => i.aF_CLAVE === aF_CLAVE);
        if (item && item.aF_ALTA !== "S") {

            const result = await Swal.fire({
                icon: "info",
                title: "Anular Registro",
                text: `Confirma anular el registro Nº ${aF_CODIGO_GENERICO}`,
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Confirmar y Anular",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });

            if (result.isConfirmed) {
                const resultado = await anularInventarioActions(aF_CLAVE);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Registro anulado",
                        text: `Se ha anulado el registro Nº ${aF_CODIGO_GENERICO}.`,
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: {
                            popup: "custom-border", // Clase personalizada para el borde
                        }
                    });
                    listaAltasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: ":'(",
                        text: `Hubo un problema al anular el registro ${aF_CLAVE}.`,
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
        else {
            Swal.fire({
                icon: "warning",
                title: "Inventario con Alta",
                text: `El inventario ${aF_CODIGO_GENERICO} no puede ser anulado porque ya está dado de alta.`,
                showDenyButton: false,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: "Cerrar",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });
        }
    };

    // const setSeleccionaFilas = (index: number) => {
    //     setFilasSeleccionadas((prev) =>
    //         prev.includes(index.toString())
    //             ? prev.filter((rowIndex) => rowIndex !== index.toString())
    //             : [...prev, index.toString()]
    //     );
    // };

    // const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.checked) {
    //         setFilasSeleccionadas(
    //             elementosActuales.map((_, index) =>
    //                 (indicePrimerElemento + index).toString()
    //             )
    //         );
    //     } else {
    //         setFilasSeleccionadas([]);
    //     }
    // };

    // Definición de columnas
    const columnas = [
        {
            key: 'aF_ESTADO_INV' as keyof InventarioCompleto,
            header: 'Estado',
            className: 'text-nowrap',
            cellClassName: 'text-nowrap',
            render: (value: number) => {
                if (value === 1) return <span className="badge bg-primary w-100">Sin Alta</span>;
                if (value === 2) return <span className="badge bg-success w-100">Dado de Alta</span>;
                if (value === 3) return <span className="badge bg-danger w-100">Dado de Baja</span>;
                return <span>-</span>;
            }
        },
        {
            key: 'aF_CODIGO_GENERICO' as keyof InventarioCompleto,
            header: 'Nº Inventario',
            className: 'text-nowrap',
            cellClassName: 'text-start'
        },
        {
            key: 'aF_DESCRIPCION' as keyof InventarioCompleto,
            header: 'Descripción',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'aF_FINGRESO' as keyof InventarioCompleto,
            header: 'Fecha',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? "Sin información" : value
        },
        {
            key: 'seR_NOMBRE' as keyof InventarioCompleto,
            header: 'Servicio',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'deP_NOMBRE' as keyof InventarioCompleto,
            header: 'Dependencia',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'esP_NOMBRE' as keyof InventarioCompleto,
            header: 'Especie',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'deT_PRECIO' as keyof InventarioCompleto,
            header: 'Precio',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: number) => value === 0 ? <p className="text-danger text-center fw-bold" > - </p> : `$${value?.toLocaleString("es-ES", { minimumFractionDigits: 0 })}`
        },
        {
            key: 'aF_VIDAUTIL' as keyof InventarioCompleto,
            header: 'Vida Útil',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'origen' as keyof InventarioCompleto,
            header: 'Origen',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value.charAt(0).toUpperCase() + value.slice(1).toLocaleLowerCase()
        },
        {
            key: 'nrecepcion' as keyof InventarioCompleto,
            header: 'Nº Recepción',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'ctA_COD' as keyof InventarioCompleto,
            header: 'Nº Cta',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'aF_OCO_NUMERO_REF' as keyof InventarioCompleto,
            header: 'Orden de Compra',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'deT_MARCA' as keyof InventarioCompleto,
            header: 'Marca',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'deT_MODELO' as keyof InventarioCompleto,
            header: 'Modelo',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'deT_SERIE' as keyof InventarioCompleto,
            header: 'Serie',
            className: 'text-nowrap',
            cellClassName: 'text-start',
            render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
        },
        {
            key: 'accion' as keyof InventarioCompleto,
            header: 'Acción',
            className: 'text-nowrap sticky-right',
            cellClassName: 'sticky-right',
            headerStyle: { position: 'sticky', right: 0, zIndex: 3 },
            cellStyle: { position: 'sticky', right: 0, zIndex: 1 },
            render: (_: any, item: InventarioCompleto) => (
                item.aF_ESTADO_INV !== 1 ? (
                    <Button
                        variant="outline-danger"
                        className="fw-semibold"
                        size="sm"
                        disabled
                    >
                        Anular
                    </Button>
                ) : (
                    <Button
                        variant="outline-danger"
                        className="fw-semibold"
                        size="sm"
                        onClick={() => handleAnular(item.aF_CLAVE, item.aF_CODIGO_GENERICO)}
                    >
                        Anular
                    </Button>
                )
            )
        }
    ];

    // PASO 1: Primero ordenamos TODOS los datos según la columna seleccionada
    const datosOrdenados = useMemo(() => {
        if (!sortColumn) return listaInventarioAnular;

        return [...listaInventarioAnular].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            // Manejar valores numéricos
            if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
                return sortDirection === 'asc'
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            }

            // Manejar valores de texto
            const aString = aValue?.toString() || '';
            const bString = bValue?.toString() || '';

            return sortDirection === 'asc'
                ? aString.localeCompare(bString)
                : bString.localeCompare(aString);
        });
    }, [listaInventarioAnular, sortColumn, sortDirection]);

    // PASO 3: Paginación (para la vista, NO para la exportación)
    const totalRegistros = listaInventarioAnular.length;
    const totalPaginas = Math.ceil(totalRegistros / pageSize);
    const indiceInicio = (paginaActual - 1) * pageSize;
    const indiceFin = indiceInicio + pageSize;

    // Para la vista usamos los datos ordenados pero paginados
    const elementosActuales = useMemo(() => {
        return datosOrdenados.slice(indiceInicio, indiceFin);
    }, [datosOrdenados, indiceInicio, indiceFin]);

    // Función para manejar el ordenamiento
    const handleSort = (column: keyof InventarioCompleto, direction: 'asc' | 'desc') => {
        setSortColumn(column);
        setSortDirection(direction);
        // No reseteamos la selección al ordenar
    };

    const handleExportarExcel = () => {
        if (!listaInventarioAnular || listaInventarioAnular.length === 0) {
            Swal.fire({
                icon: "info",
                title: "Sin datos",
                text: "No hay datos para exportar.",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            });
            return;
        }

        const datosExportar = datosOrdenados.map(item => ({
            "Nº Inventario": item.aF_CODIGO_GENERICO,
            "Descripción": item.aF_DESCRIPCION || "-",
            "Fecha Ingreso": item.aF_FINGRESO || "-",
            "Servicio": item.seR_NOMBRE || "-",
            "Dependencia": item.deP_NOMBRE || "-",
            "Especie": item.esP_NOMBRE || "-",
            "Precio": item.deT_PRECIO || "-",
            "Vida Útil": item.aF_VIDAUTIL || "-",
            "Nº Alta": item.altaS_CORR || "-",
            "Origen": item.origen || "-",
            "Nº Recepción": item.nrecepcion || "-",
            "Cuenta": item.ctA_COD || "-",
            "Orden Compra": item.aF_OCO_NUMERO_REF || "-",
            "Marca": item.deT_MARCA || "-",
            "Modelo": item.deT_MODELO || "-",
            "Serie": item.deT_SERIE || "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(datosExportar);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

        // Exporta directamente
        XLSX.writeFile(workbook, "Inventario.xlsx");
    };
    return (
        <Layout>
            <Helmet>
                <title>Anular Inventario</title>
            </Helmet>
            <MenuInventario />
            <div className="table-responsive position-relative z-0 hide-scrollbar" >
                <div style={{ maxHeight: "80vh" }}>

                    <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                        <h3 className="form-title fw-semibold border-bottom p-1">
                            Anular Inventario
                        </h3>
                        <Row className="border rounded p-2 m-2">
                            <Col lg={3} md={4}>
                                <div className="mb-2">
                                    <div className="flex-grow-1 mb-2">
                                        <label htmlFor="fechaInicio" className="form-label fw-semibold small">Desde</label>
                                        <div className="input-group">
                                            <input
                                                aria-label="Fecha Desde"
                                                type="date"
                                                className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaInicio ? "is-invalid" : ""}`}
                                                name="fechaInicio"
                                                onChange={handleChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleBuscar(e);
                                                    }
                                                }}
                                                value={Inventario.fechaInicio}
                                                max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                                            />
                                        </div>
                                        {error.fechaInicio && <div className="invalid-feedback d-block">{error.fechaInicio}</div>}
                                    </div>

                                    <div className="flex-grow-1">
                                        <label htmlFor="fechaTermino" className="form-label fw-semibold small">Hasta</label>
                                        <div className="input-group">
                                            <input
                                                aria-label="Fecha Hasta"
                                                type="date"
                                                className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaTermino ? "is-invalid" : ""}`}
                                                name="fechaTermino"
                                                onChange={handleChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleBuscar(e);
                                                    }
                                                }}
                                                value={Inventario.fechaTermino}
                                                max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                                            />
                                        </div>
                                        {error.fechaTermino && <div className="invalid-feedback d-block">{error.fechaTermino}</div>}

                                    </div>
                                    <small className="fw-semibold">Filtre los resultados por fecha de recepción.</small>
                                </div>
                            </Col>

                            <Col lg={3} md={4}>
                                <div className="mb-2">
                                    <div className="mb-2">
                                        <label htmlFor="af_codigo_generico" className="form-label fw-semibold small">Nº Inventario</label>
                                        <input
                                            aria-label="af_codigo_generico"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="af_codigo_generico"
                                            placeholder="Ej: 1000000008"
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleBuscar(e);
                                                }
                                            }}
                                            maxLength={12}
                                            value={Inventario.af_codigo_generico}
                                        />
                                    </div>
                                </div>
                            </Col>

                            <Col lg={1} md={4}>
                                <div className="d-flex flex-column gap-2 mt-4">
                                    <Button
                                        onClick={handleBuscar}
                                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                                        className="w-100"
                                    // disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                Buscar
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
                                            </>
                                        ) : (
                                            <>
                                                Buscar
                                                <Search className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                            </>
                                        )}
                                    </Button>

                                    <Button onClick={handleLimpiar} variant={`${isDarkMode ? "secondary" : "primary"}`} className="w-100">
                                        Limpiar
                                        <Eraser className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                    </Button>
                                    <Button variant={`${isDarkMode ? "secondary" : "success"}`} onClick={handleExportarExcel}>
                                        Exportar
                                        <FileExcel className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        {objeto.Roles[0].codigoEstablecimiento === 2 && (
                            <>
                                <Row className="border rounded p-2 m-2 border-warning col-7">
                                    <Col lg={5} md={4}>
                                        <div className="mb-2">
                                            <div className="flex-grow-1 mb-2">
                                                <label htmlFor="fechaIniF" className="form-label fw-semibold small">Fecha Úlitima Carga Crowne</label>
                                                <div className="input-group">
                                                    <input
                                                        aria-label="Fecha Desde"
                                                        type="date"
                                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                        name="fechaIniF"
                                                        onChange={handleChange}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleBuscarCrown(e);
                                                            }
                                                        }}
                                                        value={Inventario.fechaIniF}
                                                        max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col lg={4} md={4}>
                                        <div className="d-flex flex-column gap-2 mt-4">
                                            <Button
                                                onClick={handleBuscarCrown}
                                                variant={`${isDarkMode ? "secondary" : "warning"}`}
                                                className="w-100"
                                            >
                                                {loadingCrowne ? (
                                                    <>
                                                        Buscar Crowne
                                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Buscar Crowne
                                                        <Search className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                                    </>
                                                )}
                                            </Button>

                                        </div>
                                    </Col>

                                </Row>
                            </>
                        )}


                        {/* Controles de página y exportación */}
                        <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                            <Col xs={12} lg="auto">
                                {listaInventarioAnular.length > 10 && (
                                    <PageSizeSelector
                                        pageSize={pageSize}
                                        total={listaInventarioAnular.length}
                                        totalFiltrados={totalRegistros}
                                        onChange={(size) => setPageSize(size)}
                                        isDarkMode={isDarkMode}
                                    />
                                )}
                            </Col>
                        </Row>

                        {/* Tabla con selección */}
                        {loading || loadingCrowne ? (
                            <SkeletonLoader rowCount={10} />
                        ) : (
                            <TablaGenerica<InventarioCompleto>
                                data={elementosActuales}
                                columns={columnas}
                                isDarkMode={isDarkMode}
                                onSortChange={handleSort}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
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
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    listaInventarioAnular: state.listaInventarioAnularReducers.listaInventarioAnular,
    isDarkMode: state.darkModeReducer.isDarkMode,
    nPaginacion: state.mostrarNPaginacionReducer.nPaginacion,
    objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
    listaInventarioAnularActions,
    anularInventarioActions,
    listaAltasActions
})(AnularInventario);
