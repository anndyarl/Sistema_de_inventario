import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import { Eraser, FileExcel, Search } from "react-bootstrap-icons";
import Select from "react-select";
import MenuInventario from "../Menus/MenuInventario.tsx";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";
import { comboEspeciesBienActions } from "../../redux/actions/Inventario/Combos/comboEspeciesBienActions.tsx";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions.tsx";
import { comboDependenciaActions } from "../../redux/actions/Inventario/Combos/comboDependenciaActions.tsx";
import { listaInventarioBuscarActions } from "../../redux/actions/Inventario/BuscarInventario/listaInventarioBuscarActions.tsx";
import * as XLSX from "xlsx";
import { TablaGenerica } from "../Utils/TablaGenerica.tsx";
import { PageSizeSelector } from "../Utils/PageSizeSelector.tsx";
// Define el tipo de los elementos del combo `servicio`
interface SERVICIO {
  codigo: number;
  nombrE_ORD: string;
  descripcion: string;
}

interface DEPENDENCIA {
  deP_CORR: number;
  descripcion: string;
}

interface ListaEspecie {
  estabL_CORR: number;
  esP_CODIGO: string;
  nombrE_ESP: string;
}
interface InventarioCompleto {
  aF_CLAVE: number;
  aF_CODIGO_GENERICO: string;
  seR_NOMBRE: string;
  deP_NOMBRE: string;
  seR_CORR: number;
  deP_CORR: number;
  aF_ALTA: string;
  aF_CANTIDAD: number;
  aF_DESCRIPCION: string;
  aF_ESTADO: string;
  aF_ETIQUETA: string;
  aF_FECHA_SOLICITUD: string; // formato ISO string (puedes cambiar a Date si es necesario)
  aF_FECHAFAC: string;
  aF_FINGRESO: string;
  fechA_ALTA: string;
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
  altaS_CORR: number;
  altaS_ESTADO: string;
  // aF_ESTADO_INV: number;
}

interface FechasProps {
  fechaInicio: string;
  fechaTermino: string;
}

interface ListaInventarioProps {
  listaInventarioBuscar: InventarioCompleto[];
  listaInventarioBuscarActions: (af_codigo_generico: string, FechaInicio: string, FechaTermino: string, seR_CORR: number, deP_CORR: number,
    esP_CODIGO: string, nrecepcion: string, marca: string, modelo: string,
    serie: string, order_compra: string, altaS_CORR: number, estabL_CORR: number) => Promise<boolean>,
  comboServicio: SERVICIO[];
  comboDependencia: DEPENDENCIA[];
  comboServicioActions: (establ_corr: number) => void;
  comboDependenciaActions: (serCorr: number) => void;
  comboEspeciesBienActions: (EST: number, IDBIEN: number) => Promise<boolean>; //Carga Combo Especie
  comboEspecies: ListaEspecie[],
  isDarkMode: boolean;
  objeto: Objeto;
}


const BuscarInventario: React.FC<ListaInventarioProps> = ({ listaInventarioBuscarActions, comboServicioActions, comboDependenciaActions, comboEspeciesBienActions, listaInventarioBuscar, comboServicio, comboDependencia, comboEspecies, isDarkMode, objeto }) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});
  const [loading, setLoading] = useState(false);
  const [loadingCrowne, setLoadingCrowne] = useState(false);

  const [Inventario, setInventario] = useState({
    af_codigo_generico: "",
    fechaInicio: "",
    fechaTermino: "",
    seR_CORR: 0,
    deP_CORR: 0,
    esP_CODIGO: "",
    nrecepcion: "",
    marca: "",
    modelo: "",
    serie: "",
    aF_OCO_NUMERO_REF: "",
    altaS_CORR: 0
  });
  // Estados para ordenamiento
  const [sortColumn, setSortColumn] = useState<keyof InventarioCompleto | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [paginaActual, setPaginaActual] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const especieOptions = comboEspecies.map((item) => ({
    value: item.esP_CODIGO,
    label: item.nombrE_ESP,
  }));

  const handleComboEspecieChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : "";
    setInventario((prev) => ({ ...prev, esP_CODIGO: value }));
  };

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

  useEffect(() => {
    listaAltasAuto();
    if (comboServicio.length === 0) comboServicioActions(objeto.Roles[0].codigoEstablecimiento);
    if (comboEspecies.length === 0) comboEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0);
  }, [comboServicio, comboEspecies]);


  const listaAltasAuto = async () => {
    if (listaInventarioBuscar.length === 0) {
      setLoading(true);
      const resultado = await listaInventarioBuscarActions("", "", "", 0, 0, "", "", "", "", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
      if (resultado) {
        setLoading(false);
      }
      // else {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Error",
      //     text: `Error en la solicitud. Por favor, intente nuevamente.`,
      //     background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      //     color: `${isDarkMode ? "#ffffff" : "000000"}`,
      //     confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      //     customClass: {
      //       popup: "custom-border", // Clase personalizada para el borde
      //     }
      //   });
      // }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    // Validación específica para af_codigo_generico: solo permitir números
    if ((name === "altaS_CORR" && !/^[0-9]*$/.test(value))) {
      return; // Salir si contiene caracteres no numéricos
    }

    // Convierte `value` a número
    let newValue: string | number = ["seR_CORR", "deP_CORR", "altaS_CORR"].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;


    setInventario((prevState) => ({
      ...prevState,
      [name]: newValue //Elimina ceroa la izquierda
    }));

    if (name === "seR_CORR") {
      comboDependenciaActions(newValue as number);
    }
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

    resultado = await listaInventarioBuscarActions(
      Inventario.af_codigo_generico,
      Inventario.fechaInicio,
      Inventario.fechaTermino,
      Inventario.seR_CORR,
      Inventario.deP_CORR,
      Inventario.esP_CODIGO,
      Inventario.nrecepcion,
      Inventario.marca,
      Inventario.modelo,
      Inventario.serie,
      Inventario.aF_OCO_NUMERO_REF,
      Inventario.altaS_CORR,
      objeto.Roles[0].codigoEstablecimiento
    );

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
    }
    setLoading(false);
  };
  const handleBuscarCrowne = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoadingCrowne(true);
    setError({});
    let resultado = false;

    // Si ambas fechas están ingresadas, validar    
    if (!validate()) {
      setLoadingCrowne(false);
      return;
    }

    resultado = await listaInventarioBuscarActions(
      Inventario.af_codigo_generico,
      Inventario.fechaInicio,
      Inventario.fechaTermino,
      Inventario.seR_CORR,
      Inventario.deP_CORR,
      Inventario.esP_CODIGO,
      Inventario.nrecepcion,
      Inventario.marca,
      Inventario.modelo,
      Inventario.serie,
      Inventario.aF_OCO_NUMERO_REF,
      Inventario.altaS_CORR,
      0
    );

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
    }
    setLoadingCrowne(false);
  };

  const handleLimpiar = () => {
    setInventario((prevInventario) => ({
      ...prevInventario,
      af_codigo_generico: "",
      fechaInicio: "",
      fechaTermino: "",
      seR_CORR: 0,
      deP_CORR: 0,
      esP_CODIGO: "",
      nrecepcion: "",
      marca: "",
      modelo: "",
      serie: "",
      aF_OCO_NUMERO_REF: "",
      altaS_CORR: 0
    }));
  };

  const handleExportarExcel = () => {
    if (!listaInventarioBuscar || listaInventarioBuscar.length === 0) {
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
      "Fecha Alta": item.fechA_ALTA || "-",
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

  // PASO 1: Filtrar los datos
  const datosFiltrados = useMemo(() => {
    return listaInventarioBuscar.filter(item => {
      const coincideCodigo = !Inventario.af_codigo_generico ||
        item.aF_CODIGO_GENERICO?.toString().toLowerCase().includes(Inventario.af_codigo_generico.toString().toLowerCase());
      const coincideAlta = !Inventario.altaS_CORR ||
        item.altaS_CORR?.toString().toLowerCase().includes(Inventario.altaS_CORR.toString().toLowerCase());
      const coincideMarca = !Inventario.marca ||
        item.deT_MARCA?.toString().toLowerCase().includes(Inventario.marca.toString().toLowerCase());
      const coincideModelo = !Inventario.modelo ||
        item.deT_MODELO?.toString().toLowerCase().includes(Inventario.modelo.toString().toLowerCase());
      const coincideSerie = !Inventario.serie ||
        item.deT_SERIE?.toString().toLowerCase().includes(Inventario.serie.toString().toLowerCase());
      const coincideOC = !Inventario.aF_OCO_NUMERO_REF ||
        item.aF_OCO_NUMERO_REF?.toString().toLowerCase().includes(Inventario.aF_OCO_NUMERO_REF.toString().toLowerCase());
      const coincideEspecie = !Inventario.esP_CODIGO ||
        item.esP_CODIGO?.toString().toLowerCase().includes(Inventario.esP_CODIGO.toString().toLowerCase());
      const coincideServicio = !Inventario.seR_CORR ||
        item.seR_CORR?.toString().toLowerCase().includes(Inventario.seR_CORR.toString().toLowerCase());
      const coincideDependencia = !Inventario.deP_CORR ||
        item.deP_CORR?.toString().toLowerCase().includes(Inventario.deP_CORR.toString().toLowerCase());
      const coincideRecepcion = !Inventario.nrecepcion ||
        item.nrecepcion?.toString().toLowerCase().includes(Inventario.nrecepcion.toString().toLowerCase());

      return coincideCodigo && coincideAlta && coincideMarca && coincideModelo
        && coincideSerie && coincideOC && coincideEspecie && coincideServicio
        && coincideDependencia && coincideRecepcion;
    });
  }, [listaInventarioBuscar, Inventario.af_codigo_generico, Inventario.altaS_CORR, Inventario.marca,
    Inventario.modelo, Inventario.serie, Inventario.aF_OCO_NUMERO_REF, Inventario.esP_CODIGO,
    Inventario.seR_CORR, Inventario.deP_CORR, Inventario.nrecepcion]);

  // PASO 2: Ordenar los datos YA FILTRADOS
  const datosOrdenados = useMemo(() => {
    if (!sortColumn) return datosFiltrados;

    return [...datosFiltrados].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortDirection === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      const aString = aValue?.toString() || '';
      const bString = bValue?.toString() || '';

      return sortDirection === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [datosFiltrados, sortColumn, sortDirection]); // <-- Depende de datosFiltrados

  // PASO 3: Paginación sobre los datos filtrados Y ordenados
  const totalRegistros = datosOrdenados.length; // <-- Usar datosOrdenados
  const totalPaginas = Math.ceil(totalRegistros / pageSize);
  const indiceInicio = (paginaActual - 1) * pageSize;
  const indiceFin = indiceInicio + pageSize;

  const elementosActuales = useMemo(() => {
    return datosOrdenados.slice(indiceInicio, indiceFin); // <-- Usar datosOrdenados
  }, [datosOrdenados, indiceInicio, indiceFin]);

  const handleSort = (column: keyof InventarioCompleto, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
    // No reseteamos la selección al ordenar
  };
  const columnas = [
    { key: 'aF_CODIGO_GENERICO' as keyof InventarioCompleto, header: 'Nº Inventario' },
    {
      key: 'aF_DESCRIPCION' as keyof InventarioCompleto,
      header: 'Descripción',
      className: 'text-nowrap',
      cellClassName: 'text-start',
      render: (value: string) => value === "" ? <p className="text-danger text-center fw-bold" > - </p> : value
    },
    { key: 'aF_FINGRESO' as keyof InventarioCompleto, header: 'Fecha Ingreso' },
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
    { key: 'altaS_CORR' as keyof InventarioCompleto, header: 'Nº Alta' },
    { key: 'fechA_ALTA' as keyof InventarioCompleto, header: 'Fecha Alta' },
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
  ];

  useEffect(() => {
    setPaginaActual(1);
  }, [datosFiltrados, listaInventarioBuscar, datosOrdenados]);

  return (
    <Layout>
      <Helmet>
        <title>Buscar Inventario</title>
      </Helmet>
      <MenuInventario />
      <div className="table-responsive position-relative z-0 hide-scrollbar" >
        <div style={{ maxHeight: "80vh" }}>
          <div className={`border border-botom p-2 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
            <h4 className="text-lg-start text-center fw-semibold border-bottom p-1">
              Buscar Inventario
            </h4>
            <Row className="border rounded p-1 m-2">
              {/* Columna 1: Fechas y Especie */}
              <Col md={3}>
                <div className="mb-2">
                  <label htmlFor="fechaInicio" className="form-label fw-semibold small">
                    Desde
                  </label>
                  <input
                    aria-label="Fecha Desde"
                    type="date"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaInicio ? "is-invalid" : ""
                      }`}
                    name="fechaInicio"
                    onChange={handleChange}
                    value={Inventario.fechaInicio}
                    max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                  />
                  {error.fechaInicio && <div className="invalid-feedback d-block">{error.fechaInicio}</div>}
                </div>

                <div className="mb-2">
                  <label htmlFor="fechaTermino" className="form-label fw-semibold small">
                    Hasta
                  </label>
                  <input
                    aria-label="Fecha Hasta"
                    type="date"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaTermino ? "is-invalid" : ""
                      }`}
                    name="fechaTermino"
                    onChange={handleChange}
                    value={Inventario.fechaTermino}
                    max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                  />
                  {error.fechaTermino && <div className="invalid-feedback d-block">{error.fechaTermino}</div>}
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold small">Buscar Especie</label>
                  <Select
                    options={especieOptions}
                    onChange={(selectedOption) => {
                      handleComboEspecieChange(selectedOption)
                    }}
                    name="esP_CODIGO"
                    placeholder="Buscar"
                    className="form-select-container"
                    classNamePrefix="react-select"
                    isClearable
                    value={especieOptions.find((option) => option.value === Inventario.esP_CODIGO) || null}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: isDarkMode ? "#212529" : "white",
                        color: isDarkMode ? "white" : "#212529",
                        borderColor: isDarkMode ? "rgb(108 117 125)" : "#a6a6a66e",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: isDarkMode ? "white" : "#212529",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: isDarkMode ? "#212529" : "white",
                        color: isDarkMode ? "white" : "#212529",
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? "#6c757d" : isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                        color: isSelected ? "white" : isFocused ? "white" : isDarkMode ? "white" : "#212529",
                      }),
                    }}
                  />
                </div>
                <small className="fw-semibold">Filtre los resultados por fecha de ingreso.</small>
              </Col>

              {/* Columna 2: Servicio, Dependencia y N° Inventario */}
              <Col md={3}>
                <div className="mb-2">
                  <label htmlFor="seR_CORR" className="form-label fw-semibold small">
                    Servicio
                  </label>
                  <select
                    aria-label="seR_CORR"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="seR_CORR"
                    onChange={handleChange}
                    value={Inventario.seR_CORR}
                  >
                    <option value="">Seleccionar</option>
                    {comboServicio.map((traeServicio) => (
                      <option key={traeServicio.codigo} value={traeServicio.codigo}>
                        {traeServicio.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label htmlFor="deP_CORR" className="form-label fw-semibold small">
                    Dependencia
                  </label>
                  <select
                    aria-label="deP_CORR"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="deP_CORR"
                    onChange={handleChange}
                    value={Inventario.deP_CORR}
                    disabled={!Inventario.seR_CORR}
                  >
                    <option value="">Seleccionar</option>
                    {comboDependencia.map((traeDependencia) => (
                      <option key={traeDependencia.deP_CORR} value={traeDependencia.deP_CORR}>
                        {traeDependencia.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label htmlFor="af_codigo_generico" className="form-label fw-semibold small">
                    Nº Inventario
                  </label>
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
              </Col>

              {/* Columna 3: Marca, Modelo y Serie */}
              <Col md={2}>
                <div className="mb-2">
                  <label htmlFor="marca" className="form-label fw-semibold small">
                    Marca
                  </label>
                  <input
                    aria-label="marca"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    maxLength={50}
                    name="marca"
                    placeholder="Introduzca marca"
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBuscar(e);
                      }
                    }}
                    value={Inventario.marca}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="modelo" className="form-label fw-semibold small">
                    Modelo
                  </label>
                  <input
                    aria-label="modelo"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    maxLength={50}
                    name="modelo"
                    placeholder="Introduzca modelo"
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBuscar(e);
                      }
                    }}
                    value={Inventario.modelo}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="serie" className="form-label fw-semibold small">
                    Serie
                  </label>
                  <input
                    aria-label="serie"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    maxLength={12}
                    name="serie"
                    placeholder="Ingrese serie"
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBuscar(e);
                      }
                    }}
                    value={Inventario.serie}
                  />
                </div>
              </Col>

              {/* Columna 4: Recepción, Orden de Compra y N° Alta */}
              <Col md={2}>
                <div className="mb-2">
                  <label htmlFor="nrecepcion" className="form-label fw-semibold small">
                    Nº Recepción
                  </label>
                  <input
                    aria-label="nrecepcion"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    maxLength={10}
                    name="nrecepcion"
                    placeholder="0"
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBuscar(e);
                      }
                    }}
                    value={Inventario.nrecepcion}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="aF_OCO_NUMERO_REF" className="form-label fw-semibold small">
                    Orden de Compra
                  </label>
                  <input
                    aria-label="aF_OCO_NUMERO_REF"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    maxLength={30}
                    name="aF_OCO_NUMERO_REF"
                    placeholder="-"
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBuscar(e);
                      }
                    }}
                    value={Inventario.aF_OCO_NUMERO_REF}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="altaS_CORR" className="form-label fw-semibold small">
                    Nº Alta
                  </label>
                  <input
                    aria-label="altaS_CORR"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="altaS_CORR"
                    placeholder="0"
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBuscar(e);
                      }
                    }}
                    maxLength={12}
                    value={Inventario.altaS_CORR}
                  />
                </div>
              </Col>

              {/* Columna 5: Botones de Acción */}
              <Col lg={2} md={2}>
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
                  {objeto.Roles[0].codigoEstablecimiento === 2 && (
                    <>
                      <Button
                        onClick={handleBuscarCrowne}
                        variant={`${isDarkMode ? "secondary" : "warning"}`}
                        className="w-100"
                      // disabled={loading}
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
                    </>
                  )}
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


            {/* Controles de página y exportación */}
            <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
              <Col xs={12} lg="auto">
                {listaInventarioBuscar.length > 10 && (
                  <PageSizeSelector
                    pageSize={pageSize}
                    total={listaInventarioBuscar.length}
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
  listaInventarioBuscar: state.listaInventarioBuscarReducers.listaInventarioBuscar,
  comboEspecies: state.comboEspeciesBienReducers.comboEspecies,
  comboServicio: state.comboServicioReducer.comboServicio,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  isDarkMode: state.darkModeReducer.isDarkMode,
  nPaginacion: state.mostrarNPaginacionReducer.nPaginacion,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  listaInventarioBuscarActions,
  comboServicioActions,
  comboDependenciaActions,
  comboEspeciesBienActions
})(BuscarInventario);
