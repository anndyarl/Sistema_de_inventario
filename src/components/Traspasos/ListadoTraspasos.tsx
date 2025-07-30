import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Pagination, Row, Spinner } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Objeto } from "../Navegacion/Profile.tsx";
import { Helmet } from "react-helmet-async";
import { CircleFill, Eraser, Search } from "react-bootstrap-icons";
import MenuTraspasos from "../Menus/MenuTraspasos.tsx";
import { registrarMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/registrarMantenedorDependenciasActions.tsx";
import { listadoTraspasosActions } from "../../redux/actions/Trapasos/listadoTraspasosActions.tsx";

interface FechasProps {
  fDesde: string;
  fHasta: string;
}
export interface listadoTraspasos {
  aF_CODIGO_GENERICO: string;
  n_TRASPASO: number;
  aF_CLAVE: number;
  paS_FECHA: string;
  esP_CODIGO: string;
  esP_NOMBRE: string;
  seR_NOMBRE_ORIGEN: string;
  deP_NOMBRE_ORIGEN: string;
  seR_NOMBRE_DESTINO: string;
  deP_NOMBRE_DESTINO: string;
  paS_MEMO_REF: string;
  paS_FECHA_MEMO: string;
  paS_OBS: string;
  paS_NOM_ENTREGA: string;
  paS_NOM_RECIBE: string;
  paS_NOM_AUTORIZA: string;
  paS_ESTADO_AF: string;
  establecimientO_ORIGEN: string;
  establecimientO_DESTINO: string;
  usuariO_CREA: number;
  estabL_CORR_ORIGEN: number;
  estabL_CORR: number;
  deP_CORR_ORIGEN: number;
  deP_CORR: number;
  traS_CO_REAL: number;
  paS_DET_CORR: number;
}

interface GeneralProps {
  listadoTraspasos: listadoTraspasos[];
  listadoTraspasosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number) => Promise<boolean>;
  registrarMantenedorDependenciasActions: (formModal: Record<string, any>) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const ListadoTraspasos: React.FC<GeneralProps> = ({ listadoTraspasosActions, listadoTraspasos, token, isDarkMode, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Partial<FechasProps> & {}>({});
  // const [_, setFilaSeleccionada] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
  const elementosPorPagina = Paginacion.nPaginacion;
  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => listadoTraspasos.slice(indicePrimerElemento, indiceUltimoElemento),
    [listadoTraspasos, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listadoTraspasos)
    ? Math.ceil(listadoTraspasos.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    if (ListadoTraslado.fDesde > ListadoTraslado.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const [ListadoTraslado, setListadoTraslado] = useState({
    fDesde: "",
    fHasta: "",
    tras_corr: 0,
    af_codigo_generico: ""
  });

  const listaAuto = async () => {
    if (token) {
      if (listadoTraspasos.length === 0) {
        setLoading(true);
        const resultado = await listadoTraspasosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
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
    }
  };

  useEffect(() => {
    listaAuto()
  }, [listadoTraspasosActions, token, listadoTraspasos.length]); // Asegúrate de incluir dependencias relevantes

  const handleLimpiar = () => {
    setListadoTraslado((prevListadoTraslado) => ({
      ...prevListadoTraslado,
      fDesde: "",
      fHasta: "",
      tras_corr: 0,
      af_codigo_generico: ""
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Validación específica para af_codigo_generico: solo permitir números
    if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
      return; // Salir si contiene caracteres no numéricos
    }
    // Convertir a número solo si el campo está en la lista
    const camposNumericos = ["tras_corr", "establ_corr"];
    const newValue: string | number = camposNumericos.includes(name)
      ? parseFloat(value) || 0
      : value;

    // Actualizar estado
    setListadoTraslado((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    setPaginacion((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleBuscar = async () => {
    let resultado = false;
    setLoading(true);
    resultado = await listadoTraspasosActions(ListadoTraslado.fDesde, ListadoTraslado.fHasta, ListadoTraslado.af_codigo_generico, ListadoTraslado.tras_corr, objeto.Roles[0].codigoEstablecimiento);
    if (ListadoTraslado.fDesde != "" || ListadoTraslado.fHasta != "") {
      if (validate()) {
        resultado = await listadoTraspasosActions(ListadoTraslado.fDesde, ListadoTraslado.fHasta, ListadoTraslado.af_codigo_generico, ListadoTraslado.tras_corr, objeto.Roles[0].codigoEstablecimiento);
      }
    }
    else {
      resultado = await listadoTraspasosActions("", "", ListadoTraslado.af_codigo_generico, ListadoTraslado.tras_corr, objeto.Roles[0].codigoEstablecimiento);
    }

    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "No se encontraron resultados para la consulta realizada.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      resultado = await listadoTraspasosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }

  };



  // const setSeleccionaFila = (index: number) => {
  //   setMostrarModal(index); //Abre modal del indice seleccionado
  //   setFilaSeleccionada((prev) =>
  //     prev.includes(index.toString())
  //       ? prev.filter((rowIndex) => rowIndex !== index.toString())
  //       : [...prev, index.toString()]
  //   );
  // };

  // const handleCerrarModal = (index: number) => {
  //   setFilaSeleccionada((prevSeleccionadas) =>
  //     prevSeleccionadas.filter((fila) => fila !== index.toString())
  //   );
  //   setMostrarModal(null); //Cierra modal del indice seleccionado
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (validate()) {

  //     const result = await Swal.fire({
  //       icon: "info",
  //       title: "Registrar",
  //       text: "Confirme para registrar una nueva dependencia",
  //       showDenyButton: false,
  //       showCancelButton: true,
  //       confirmButtonText: "Confirmar",
  //       background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //       color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //       confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
  //       customClass: {
  //         popup: "custom-border", // Clase personalizada para el borde
  //       }
  //     });
  //     if (result.isConfirmed) {
  //       const resultado = await registrarMantenedorDependenciasActions(Mantenedor);
  //       console.log(Mantenedor);
  //       if (resultado) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Registro Exitoso",
  //           text: "Se ha agregado una nueva dependencia",
  //           background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //           color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //           confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
  //           customClass: {
  //             popup: "custom-border", // Clase personalizada para el borde
  //           }
  //         });
  //         listadoTraspasosActions();
  //         setFilaSeleccionada([]);

  //       } else {
  //         Swal.fire({
  //           icon: "error",
  //           title: ":'(",
  //           text: "Hubo un problema al registrar",
  //           background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //           color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //           confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
  //           customClass: {
  //             popup: "custom-border", // Clase personalizada para el borde
  //           }
  //         });
  //       }
  //     }
  //   }
  // };

  return (
    <Layout>
      <Helmet>
        <title>Listado de Traslados</title>
      </Helmet>
      <MenuTraspasos />
      <div className="border-bottom shadow-sm p-2 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">Listado de Traspasos</h3>
        <Row className="border rounded p-2 m-2">
          <Col md={3} sm={12}>
            <div className="mb-2 ">
              <div className="flex-grow-1 mb-2">
                <label htmlFor="fDesde" className="form-label fw-semibold small">Desde</label>
                <div className="input-group">
                  <input
                    aria-label="Fecha Desde"
                    type="date"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fDesde ? "is-invalid" : ""}`}
                    name="fDesde"
                    onChange={handleChange}
                    value={ListadoTraslado.fDesde}
                    max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                  />
                </div>
                {error.fDesde && <div className="invalid-feedback d-block">{error.fDesde}</div>}
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
                    value={ListadoTraslado.fHasta}
                    max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                  />
                </div>
                {error.fHasta && <div className="invalid-feedback d-block">{error.fHasta}</div>}

              </div>
              <small className="fw-semibold">Filtre los resultados por fecha de Traspasos.</small>
            </div>
          </Col>

          <Col md={2} sm={12}>
            <div className="mb-1">
              <label htmlFor="af_codigo_generico" className="form-label fw-semibold small">Nº Inventario</label>
              <input
                aria-label="af_codigo_generico"
                type="text"
                className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                name="af_codigo_generico"
                placeholder="Ej: 1000000008"
                onChange={handleChange}
                value={ListadoTraslado.af_codigo_generico}
              />
            </div>
            <div className="mb-1">
              <label htmlFor="tras_corr" className="fw-semibold">Nº Traspaso</label>
              <input
                aria-label="tras_corr"
                type="text"
                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                name="tras_corr"
                size={10}
                placeholder="Eje: 1000000008"
                onChange={handleChange}
                value={ListadoTraslado.tras_corr}
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

        <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
          {/* Tamaño de página */}
          <Col xs={12} lg="auto">
            {listadoTraspasos.length > 10 && (
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                <label htmlFor="nPaginacion" className="form-label fw-semibold mb-0 me-2">
                  Tamaño de página:
                </label>
                <select
                  aria-label="Seleccionar tamaño de página"
                  className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                  name="nPaginacion"
                  onChange={handleChange}
                  value={Paginacion.nPaginacion}
                >
                  {[10, 15, 20, 25, 50, 100].map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            )}
          </Col>
        </Row>
        {loading ? (
          <>
            <SkeletonLoader rowCount={elementosPorPagina} />
          </>
        ) : (
          <div className='table-responsive'>
            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
              <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                <tr>
                  {/* <th scope="col"></th> */}
                  <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                  <th scope="col" className="text-nowrap text-center">N° Traspaso</th>
                  <th scope="col" className="text-nowrap text-center">Clave Activo</th>
                  <th scope="col" className="text-nowrap text-center">Fecha Traslado</th>
                  <th scope="col" className="text-nowrap text-center">Código Especie</th>
                  <th scope="col" className="text-nowrap text-center">Nombre Especie</th>
                  <th scope="col" className="text-nowrap text-center">Establecimiento Origen<CircleFill className={"flex-shrink-0 h-5 w-5 ms-1 text-warning"} aria-hidden="true" /></th>
                  <th scope="col" className="text-nowrap text-center">Ubicación Origen<CircleFill className={"flex-shrink-0 h-5 w-5 ms-1 text-warning"} aria-hidden="true" /></th>
                  <th scope="col" className="text-nowrap text-center">Establecimiento Destino</th>
                  <th scope="col" className="text-nowrap text-center">Ubicación Destino<CircleFill className={"flex-shrink-0 h-5 w-5 ms-1 text-success"} aria-hidden="true" /></th>
                  <th scope="col" className="text-nowrap text-center">Memo de Referencia<CircleFill className={"flex-shrink-0 h-5 w-5 ms-1 text-success"} aria-hidden="true" /></th>
                  <th scope="col" className="text-nowrap text-center">Fecha Memo</th>
                  <th scope="col" className="text-nowrap text-center">Observaciones</th>
                  <th scope="col" className="text-nowrap text-center">Nombre Entrega</th>
                  <th scope="col" className="text-nowrap text-center">Nombre Recibe</th>
                  <th scope="col" className="text-nowrap text-center">Nombre Autoriza</th>
                  <th scope="col" className="text-nowrap text-center">Estado</th>

                </tr>
              </thead>
              <tbody>
                {elementosActuales.map((Lista, index) => {
                  let indexReal = indicePrimerElemento + index; // Índice real basado en la página
                  return (
                    <tr key={indexReal}>
                      {/* <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => setSeleccionaFila(indexReal)}
                          checked={filasSeleccionada.includes((indexReal).toString())}
                        />
                        </td> */}
                      <td className="text-nowrap">{Lista.aF_CODIGO_GENERICO}</td>
                      <td className="text-nowrap">{Lista.n_TRASPASO}</td>
                      <td className="text-nowrap">{Lista.aF_CLAVE}</td>
                      <td className="text-nowrap">{Lista.paS_FECHA}</td>
                      <td className="text-nowrap">{Lista.esP_CODIGO}</td>
                      <td className="text-nowrap">{Lista.esP_NOMBRE}</td>
                      <td className="text-nowrap">{Lista.establecimientO_ORIGEN}</td>
                      <td className="text-nowrap">{Lista.seR_NOMBRE_ORIGEN + ' ' + Lista.deP_NOMBRE_ORIGEN}</td>
                      <td className="text-nowrap">{Lista.establecimientO_DESTINO}</td>
                      <td className="text-nowrap">{Lista.seR_NOMBRE_DESTINO + ' ' + Lista.deP_NOMBRE_DESTINO}</td>
                      <td className="text-nowrap">{Lista.paS_MEMO_REF}</td>
                      <td className="text-nowrap">{Lista.paS_FECHA_MEMO}</td>
                      <td className="text-nowrap">{Lista.paS_OBS === '0' ? 'Sin observaciones' : Lista.paS_OBS}</td>
                      <td className="text-nowrap">{Lista.paS_NOM_ENTREGA}</td>
                      <td className="text-nowrap">{Lista.paS_NOM_RECIBE}</td>
                      <td className="text-nowrap">{Lista.paS_NOM_AUTORIZA}</td>
                      <td className="text-nowrap">{Lista.paS_ESTADO_AF}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {/* Paginador */}
        <div className="paginador-container position-relative z-0">
          <Pagination className="paginador-scroll ">
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
                {i + 1} {/* adentro de aqui esta page-link */}
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
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listadoTraspasos: state.listadoTraspasosReducers.listadoTraspasos,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  comboServicio: state.comboServicioReducer.comboServicio,
  objeto: state.validaApiLoginReducers,
});

export default connect(mapStateToProps, {
  listadoTraspasosActions,
  registrarMantenedorDependenciasActions,
})(ListadoTraspasos);

