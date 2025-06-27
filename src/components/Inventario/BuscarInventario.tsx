import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import { Eraser, Search } from "react-bootstrap-icons";
import Select from "react-select";
import MenuInventario from "../Menus/MenuInventario.tsx";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";
import { comboEspeciesBienActions } from "../../redux/actions/Inventario/Combos/comboEspeciesBienActions.tsx";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions.tsx";
import { comboDependenciaActions } from "../../redux/actions/Inventario/Combos/comboDependenciaActions.tsx";
import { listaInventarioBuscarActions } from "../../redux/actions/Inventario/BuscarInventario/listaInventarioBuscarActions.tsx";

// Define el tipo de los elementos del combo `servicio`
interface SERVICIO {
  codigo: number;
  nombrE_ORD: string;
  descripcion: string;
}

interface DEPENDENCIA {
  codigo: number;
  descripcion: string;
  nombrE_ORD: string;
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
  listaInventarioBuscarActions: (af_codigo_generico: string, FechaInicio: string, FechaTermino: string, deP_CORR: number,
    esP_CODIGO: string, nrecepcion: string, marca: string, modelo: string,
    serie: string, order_compra: string, altaS_CORR: number, estabL_CORR: number) => Promise<boolean>,
  comboServicio: SERVICIO[];
  comboDependencia: DEPENDENCIA[];
  comboServicioActions: (establ_corr: number) => void;
  comboDependenciaActions: (serCorr: string) => void;
  comboEspeciesBienActions: (EST: number, IDBIEN: number) => Promise<boolean>; //Carga Combo Especie
  comboEspecies: ListaEspecie[],
  isDarkMode: boolean;
  nPaginacion: number; //número de paginas establecido desde preferencias
  objeto: Objeto;
}


const BuscarInventario: React.FC<ListaInventarioProps> = ({ listaInventarioBuscarActions, comboServicioActions, comboDependenciaActions, comboEspeciesBienActions, listaInventarioBuscar, comboServicio, comboDependencia, comboEspecies, isDarkMode, nPaginacion, objeto }) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});
  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = nPaginacion;
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
    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.fechaInicio) tempErrors.fechaInicio = "La Fecha de Inicio es obligatoria.";
    if (!Inventario.fechaTermino) tempErrors.fHasta = "La Fecha de Término es obligatoria.";
    if (Inventario.fechaInicio > Inventario.fechaTermino) tempErrors.fechaInicio = "La fecha no cumple con el rango de busqueda";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    listaAltasAuto();
    if (comboServicio.length === 0) comboServicioActions(objeto.Roles[0].codigoEstablecimiento);
    if (comboEspecies.length === 0) comboEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0);
  }, [listaInventarioBuscarActions, listaInventarioBuscar.length, comboServicio, comboEspecies]);

  const listaAltasAuto = async () => {
    if (listaInventarioBuscar.length === 0) {
      setLoading(true);
      const resultado = await listaInventarioBuscarActions("", "", "", 0, "", "", "", "", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
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
    if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
      return; // Salir si contiene caracteres no numéricos
    }
    setInventario((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "seR_CORR") {
      comboDependenciaActions(value);
    }
  };

  const handleBuscar = async () => {
    let resultado = false;
    setLoading(true);
    //Si las fechas no estan vacias las valida, de lo contrario solo permite filtrar por codigo de la cuenta
    if (Inventario.fechaTermino != "" && Inventario.fechaInicio != "") {
      if (validate()) {
        resultado = await listaInventarioBuscarActions("", Inventario.fechaInicio, Inventario.fechaTermino, 0, "", "", "", "", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
      }
    }
    else {
      resultado = await listaInventarioBuscarActions(Inventario.af_codigo_generico, "", "", Inventario.deP_CORR, Inventario.esP_CODIGO, Inventario.nrecepcion, Inventario.marca, Inventario.modelo, Inventario.serie, Inventario.aF_OCO_NUMERO_REF, Inventario.altaS_CORR, objeto.Roles[0].codigoEstablecimiento);

    }

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
      return;
    } else {
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }
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

  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () =>
      listaInventarioBuscar.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaInventarioBuscar, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listaInventarioBuscar)
    ? Math.ceil(listaInventarioBuscar.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);
  return (
    <Layout>
      <Helmet>
        <title>Buscar Inventario</title>
      </Helmet>
      <MenuInventario />
      <form>
        <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">
            Buscar Inventario
          </h3>
          <Row className="border rounded p-2 m-2">
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
              <small className="fw-semibold">Filtre los resultados por fecha de recepción.</small>
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
                    <option key={traeDependencia.codigo} value={traeDependencia.codigo}>
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
                  maxLength={50}
                  name="serie"
                  placeholder="Ingrese serie"
                  onChange={handleChange}
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
                  placeholder="Ej: 0"
                  onChange={handleChange}
                  value={Inventario.altaS_CORR}
                />
              </div>
            </Col>

            {/* Columna 5: Botones de Acción */}
            <Col md={1}>
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
              </div>
            </Col>
          </Row>
          {/* Tabla*/}
          {loading ? (
            <>
              <SkeletonLoader rowCount={elementosPorPagina} />
            </>
          ) : (
            <div className='skeleton-table table-responsive'>
              {elementosActuales.length > 0 && (
                <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                  <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                    <tr>
                      <th scope="col" className="text-nowrap">Nº Inventario</th>
                      <th scope="col" className="text-nowrap">Descripción</th>
                      <th scope="col" className="text-nowrap">Fecha</th>
                      <th scope="col" className="text-nowrap">Servicio</th>
                      <th scope="col" className="text-nowrap">Dependencia</th>
                      <th scope="col" className="text-nowrap">Especie</th>
                      <th scope="col" className="text-nowrap">Precio</th>
                      <th scope="col" className="text-nowrap">Vida Útil</th>
                      {/* <th scope="col" className="text-nowrap">Depreciación</th>
                      <th scope="col" className="text-nowrap">Depreciación Acumulada</th>
                      <th scope="col" className="text-nowrap">Valor Libro</th>
                      <th scope="col" className="text-nowrap">Nº Trapasos</th> */}
                      <th scope="col" className="text-nowrap">Nº Alta</th>
                      <th scope="col" className="text-nowrap">Origen</th>
                      <th scope="col" className="text-nowrap">Nº Recepción</th>
                      <th scope="col" className="text-nowrap">Nº Cta</th>
                      <th scope="col" className="text-nowrap">Orden de Compra</th>
                      <th scope="col" className="text-nowrap">Marca</th>
                      <th scope="col" className="text-nowrap">Modelo</th>
                      <th scope="col" className="text-nowrap">Serie</th>
                      {/* <th scope="col" className="text-nowrap">Estado Alta</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {elementosActuales.map((lista, index) => (
                      <tr key={index}>
                        <td className="text-start">{lista.aF_CODIGO_GENERICO}</td>
                        <td className="text-start">{lista.aF_DESCRIPCION}</td>
                        <td className="text-start">{lista.aF_FINGRESO == "" ? "Sin fecha" : lista.aF_FINGRESO}</td>
                        <td className="text-start">{lista.seR_NOMBRE}</td>
                        <td className="text-start">{lista.deP_NOMBRE}</td>
                        <td className="text-start">{lista.esP_NOMBRE}</td>
                        <td className="text-start">
                          ${lista.deT_PRECIO?.toLocaleString("es-ES", { minimumFractionDigits: 0 })}</td>
                        <td className="text-start">{lista.aF_VIDAUTIL}</td>
                        {/* <td className="text-start">.</td>
                        <td className="text-start">.</td>
                        <td className="text-start">.</td>
                        <td className="text-start">.</td> */}
                        <td className="text-start">{lista.altaS_CORR}</td>
                        <td className="text-start">{lista.origen.charAt(0).toUpperCase() + lista.origen.slice(1).toLocaleLowerCase() || "-"}</td>
                        <td className="text-start">{!lista.nrecepcion ? "-" : lista.nrecepcion}</td>
                        <td className="text-start">{lista.ctA_COD}</td>
                        <td className="text-start">{lista.aF_OCO_NUMERO_REF}</td>
                        <td className="text-start">{!lista.deT_MARCA ? "-" : lista.deT_MARCA}</td>
                        <td className="text-start">{!lista.deT_MODELO ? "-" : lista.deT_MODELO}</td>
                        <td className="text-start">{!lista.deT_SERIE ? "-" : lista.deT_SERIE}</td>
                        {/* <td className="text-start">{lista.altaS_ESTADO === "1" ? <p className="badge bg-success w-100">Disponible</p> : <p className="badge bg-danger w-100">Anulado</p>}</td> */}
                        {/* <td className="text-start">{lista.aF_ESTADO_INV}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Paginador */}
          {elementosActuales.length > 0 && (
            <div className="paginador-container position-relative z-0">
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
          )}
        </div>
      </form>
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
