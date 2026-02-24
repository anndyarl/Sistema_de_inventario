import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Form, Button, Spinner, Modal, Row, Col } from "react-bootstrap";
import { RootState } from "../../../store.ts";
import { connect } from "react-redux";
import Layout from "../../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../../Utils/SkeletonLoader.tsx";
import MenuBajas from "../../Menus/MenuBajas.tsx";
import { Helmet } from "react-helmet-async";
import { Columns, Eraser, FiletypePdf, Search } from "react-bootstrap-icons";
import { rematarBajasActions } from "../../../redux/actions/Bajas/BienesRematados/rematarBajasActions.tsx";
import { obtenerListaRematesActions } from "../../../redux/actions/Bajas/BodegaExcluidos/obtenerListaRematesActions.tsx";
import { Objeto } from "../../Navegacion/Profile.tsx";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoRematesPDF from "./DocumentoRematesPDF.tsx";
import { TablaGenerica } from "../../Utils/TablaGenerica.tsx";
import { PageSizeSelector } from "../../Utils/PageSizeSelector.tsx";

interface FechasProps {
  fDesde: string;
  fHasta: string;
}

export interface ListaRemates {
  aF_CODIGO_GENERICO: string;
  boD_CORR: string;
  aF_CLAVE: number;
  bajaS_CORR: number;
  especie: string;
  observaciones: string;
  ncuenta: string;
  estado: number;
  fechA_INGRESO: string;
  nresolucion: string;
}

interface DatosBajas {
  listaRemates: ListaRemates[];
  obtenerListaRematesActions: (fDesde: string, fHasta: string, bod_corr: string, nresolucion: string, af_codigo_generico: string, establ_corr: number) => Promise<boolean>;
  rematarBajasActions: (listaRemates: Record<string, any>[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto;
}

const BienesRematados: React.FC<DatosBajas> = ({
  obtenerListaRematesActions,
  listaRemates,
  token,
  isDarkMode,
  objeto
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Partial<ListaRemates> & Partial<FechasProps>>({});
  const [filaSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  // Estados para ordenamiento
  const [sortColumn, setSortColumn] = useState<keyof ListaRemates | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [Rematados, setRematados] = useState({
    fDesde: "",
    fHasta: "",
    nresolucion: "",
    af_codigo_generico: "",
    boD_CORR: ""
  });

  const validateFechas = () => {
    let tempErrors: Partial<any> & {} = {};
    if (Rematados.fDesde > Rematados.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const listaRematesAuto = async () => {
    if (token) {
      if (listaRemates.length === 0) {
        setLoading(true);
        const resultado = await obtenerListaRematesActions("", "", "", "", "", objeto.Roles[0].codigoEstablecimiento);
        if (resultado) {
          setLoading(false);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Sin resultados",
            text: "No hay registros disponibles para mostrar.",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: { popup: "custom-border" }
          });
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    listaRematesAuto()
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    if ((name === "nresolucion" || name === "af_codigo_generico") && !/^[0-9]*$/.test(value)) {
      return;
    }

    setRematados((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    let numero = value.split("-")[0];
    if (name === "boD_CORR") {
      numero = numero.replace(/\D/g, "");
      value = numero ? `${numero}-01` : "";
    }

    setTimeout(() => {
      const input = document.querySelector('input[name="boD_CORR"]') as HTMLInputElement;
      if (input) {
        input.setSelectionRange(numero.length, numero.length);
      }
    }, 0);
  };

  const handleBuscar = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);

    const resultado = await obtenerListaRematesActions(
      Rematados.fDesde,
      Rematados.fHasta,
      Rematados.boD_CORR,
      Rematados.nresolucion,
      Rematados.af_codigo_generico,
      objeto.Roles[0].codigoEstablecimiento
    );

    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "No se encontraron resultados para la consulta realizada.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: { popup: "custom-border" }
      });
    }
    setLoading(false);
    setPaginaActual(1); // Reset a primera página
  };

  const handleLimpiar = () => {
    setRematados({
      fDesde: "",
      fHasta: "",
      boD_CORR: "",
      af_codigo_generico: "",
      nresolucion: ""
    });
    setFilaSeleccionada([]);
  };

  // Función para obtener el ID único de un item
  const obtenerIdItem = (item: ListaRemates): string => {
    return item.aF_CODIGO_GENERICO?.toString() || item.aF_CLAVE?.toString() || '';
  };

  // PASO 1: Primero ordenamos TODOS los datos según la columna seleccionada
  const datosOrdenados = useMemo(() => {
    if (!sortColumn) return listaRemates;

    return [...listaRemates].sort((a, b) => {
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
  }, [listaRemates, sortColumn, sortDirection]);

  // PASO 2: Filtramos SOLO las filas seleccionadas, pero MANTENIENDO el orden
  const filasSeleccionadasParaExportar = useMemo(() => {
    // Filtramos los datos ordenados para quedarnos solo con los seleccionados
    const seleccionadas = datosOrdenados.filter(item =>
      filaSeleccionada.includes(obtenerIdItem(item))
    );

    // console.log('Filas seleccionadas para exportar:', seleccionadas.length);
    return seleccionadas;
  }, [datosOrdenados, filaSeleccionada]);

  // PASO 3: Paginación (para la vista, NO para la exportación)
  const totalRegistros = listaRemates.length;
  const totalPaginas = Math.ceil(totalRegistros / pageSize);
  const indiceInicio = (paginaActual - 1) * pageSize;
  const indiceFin = indiceInicio + pageSize;

  // Para la vista usamos los datos ordenados pero paginados
  const elementosActuales = useMemo(() => {
    return datosOrdenados.slice(indiceInicio, indiceFin);
  }, [datosOrdenados, indiceInicio, indiceFin]);

  // Funciones de selección usando IDs
  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Selecciona todas las filas de la página actual usando datos ordenados
      const idsPaginaActual = elementosActuales.map(item => obtenerIdItem(item));
      setFilaSeleccionada(idsPaginaActual);
    } else {
      setFilaSeleccionada([]);
    }
  };

  const handleSeleccionaFila = (id: string) => {
    setFilaSeleccionada((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  // Función para manejar el ordenamiento
  const handleSort = (column: keyof ListaRemates, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
    // No reseteamos la selección al ordenar
  };

  // Definir las columnas de la tabla
  const columnas = [
    { key: 'boD_CORR' as keyof ListaRemates, header: 'Nº Remate' },
    { key: 'aF_CODIGO_GENERICO' as keyof ListaRemates, header: 'Nº Inventario' },
    { key: 'nresolucion' as keyof ListaRemates, header: 'Nº Resolución' },
    { key: 'especie' as keyof ListaRemates, header: 'Especie' },
    { key: 'observaciones' as keyof ListaRemates, header: 'Observaciones' },
    { key: 'ncuenta' as keyof ListaRemates, header: 'Nº Cuenta' },
    { key: 'estado' as keyof ListaRemates, header: 'Estado' },
    { key: 'fechA_INGRESO' as keyof ListaRemates, header: 'Fecha Ingreso' },

  ];

  // Columnas de la tabla con checkbox
  const columnasConCheckbox = [
    {
      key: 'checkbox' as keyof ListaRemates,
      header: (
        <Form.Check
          type="checkbox"
          onChange={handleSeleccionaTodos}
          checked={
            elementosActuales.length > 0 &&
            elementosActuales.every(item =>
              filaSeleccionada.includes(obtenerIdItem(item))
            )
          }
        />
      ),
      render: (_: any, item: ListaRemates) => {
        const id = obtenerIdItem(item);
        return (
          <Form.Check
            type="checkbox"
            onChange={() => handleSeleccionaFila(id)}
            checked={filaSeleccionada.includes(id)}
          />
        );
      },
      disableSort: true // ¡Esto es clave! Deshabilita el ordenamiento para esta columna
    },
    ...columnas
  ];

  return (
    <Layout>
      <Helmet>
        <title>Bienes Rematados</title>
      </Helmet>
      <MenuBajas />

      <div className="table-responsive position-relative z-0 hide-scrollbar">
        <div style={{ maxHeight: "80vh" }}>
          <div className="border-bottom shadow-sm p-2 rounded">
            <h3 className="form-title fw-semibold border-bottom p-1">Bienes Rematados</h3>

            {/* Filtros */}
            <Row className="border rounded p-2 m-2">
              <Col lg={3} md={4}>
                <div className="mb-2">
                  <div className="mb-1">
                    <label htmlFor="fDesde" className="fw-semibold">Desde</label>
                    <input
                      aria-label="fDesde"
                      type="date"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fDesde ? "is-invalid" : ""}`}
                      name="fDesde"
                      onChange={handleChange}
                      value={Rematados.fDesde}
                      max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                    />
                    {error.fDesde && (
                      <div className="invalid-feedback d-block">{error.fDesde}</div>
                    )}
                  </div>

                  <div className="flex-grow-1">
                    <label htmlFor="fHasta" className="form-label fw-semibold small">Hasta</label>
                    <div className="input-group">
                      <input
                        aria-label="Fecha Hasta"
                        type="date"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fHasta ? "is-invalid" : ""}`}
                        name="fHasta"
                        onChange={handleChange}
                        value={Rematados.fHasta}
                        max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                      />
                    </div>
                    {error.fHasta && <div className="invalid-feedback d-block">{error.fHasta}</div>}
                  </div>
                  <small className="fw-semibold">Filtre los resultados por fecha de Ingreso.</small>
                </div>
              </Col>

              <Col lg={2} md={4}>
                <div className="mb-1">
                  <label htmlFor="boD_CORR" className="fw-semibold">Nº Remate</label>
                  <input
                    aria-label="boD_CORR"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="boD_CORR"
                    placeholder="0"
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBuscar(e);
                      }
                    }}
                    maxLength={12}
                    value={Rematados.boD_CORR}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="af_codigo_generico" className="form-label fw-semibold">Nº Inventario</label>
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
                    value={Rematados.af_codigo_generico}
                  />
                </div>
              </Col>

              {/* Botones de Acción */}
              <Col lg={1} md={4}>
                <div className="d-flex flex-column gap-2 mt-4">
                  <Button
                    onClick={handleBuscar}
                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                    className="w-100"
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
                </div>
              </Col>
            </Row>

            {/* Controles de página y exportación */}
            <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
              <Col xs={12} lg="auto">
                {listaRemates.length > 10 && (
                  <PageSizeSelector
                    pageSize={pageSize}
                    total={listaRemates.length}
                    totalFiltrados={totalRegistros}
                    onChange={(size) => setPageSize(size)}
                    isDarkMode={isDarkMode}
                  />
                )}
              </Col>

              {listaRemates.length > 0 && (
                <Col xs={12} lg={2}>
                  <div className="d-flex justify-content-center justify-content-lg-end">
                    {filaSeleccionada.length > 0 ? (
                      <Button
                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                        onClick={() => setMostrarModal(true)}
                        className="p-2 w-100 d-flex align-items-center justify-content-center"
                      >
                        <FiletypePdf className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                        Exportar
                        <span className="badge bg-light text-dark mx-2 mt-1">
                          {filasSeleccionadasParaExportar.length}
                        </span>
                      </Button>
                    ) : (
                      <div className="d-flex justify-content-center justify-content-lg-end w-100">
                        <strong className="alert alert-dark border p-2 mb-2 w-100 text-center">
                          No hay filas seleccionadas
                        </strong>
                      </div>
                    )}
                  </div>
                </Col>
              )}
            </Row>

            {/* Tabla con selección */}
            {loading ? (
              <SkeletonLoader rowCount={10} />
            ) : (
              <TablaGenerica<ListaRemates>
                data={elementosActuales}
                columns={columnasConCheckbox}
                isDarkMode={isDarkMode}
                onSortChange={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
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

      {/* Modal exportar PDF */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="xl">
        <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
          <Modal.Title className="fw-semibold">Bienes Rematados</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? "darkModePrincipal" : ""}>
          <BlobProvider
            document={
              <DocumentoRematesPDF
                row={filasSeleccionadasParaExportar}
              />
            }
          >
            {({ url, loading }) =>
              loading ? (
                <p>Generando vista previa...</p>
              ) : (
                <iframe
                  src={url || ""}
                  title="Vista Previa del PDF"
                  style={{
                    width: "100%",
                    height: "900px",
                    border: "none"
                  }}
                />
              )
            }
          </BlobProvider>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => ({
  listaRemates: state.obtenerListaRematesReducers.listaRemates,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  rematarBajasActions,
  obtenerListaRematesActions
})(BienesRematados);