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
import { ArrowClockwise, Eraser, FiletypePdf, Search } from "react-bootstrap-icons";
import { rematarBajasActions } from "../../../redux/actions/Bajas/BienesRematados/rematarBajasActions.tsx";
import { obtenerListaRematesActions } from "../../../redux/actions/Bajas/BodegaExcluidos/obtenerListaRematesActions.tsx";
import { Objeto } from "../../Navegacion/Profile.tsx";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoRematesPDF from "./DocumentoRematesPDF.tsx";

interface FechasProps {
  fDesde: string;
  fHasta: string;
}
export interface ListaRemates {
  aF_CODIGO_GENERICO: string;
  boD_CORR: number;
  aF_CLAVE: number;
  bajaS_CORR: number;
  especie: string;
  vutiL_RESTANTE: number;
  vutiL_AGNOS: number;
  nresolucion: number;
  observaciones: string;
  deP_ACUMULADA: number;
  ncuenta: string;
  estado: number;
  fechA_INGRESO: string;
  // aF_CLAVE: string;
  // bajaS_CORR: string;
  // especie: string;
  // vutiL_RESTANTE: number;
  // vutiL_AGNOS: number;
  // nresolucion: string;
  // observaciones: string;
  // deP_ACUMULADA: number;
  // ncuenta: string;
  // estado: number;
  // fechA_REMATES: string;
}
interface DatosBajas {
  listaRemates: ListaRemates[];
  obtenerListaRematesActions: (fDesde: string, fHasta: string, nresolucion: string, af_codigo_generico: string, establ_corr: number) => Promise<boolean>;
  rematarBajasActions: (listaRemates: Record<string, any>[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  nPaginacion: number; //número de paginas establecido desde preferencias
  objeto: Objeto;
}

const BienesRematados: React.FC<DatosBajas> = ({ obtenerListaRematesActions, listaRemates, token, isDarkMode, nPaginacion, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  // const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [error, setError] = useState<Partial<ListaRemates> & Partial<FechasProps>>({});
  const [filaSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = nPaginacion;
  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => listaRemates.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaRemates, indicePrimerElemento, indiceUltimoElemento]
  );
  const filasSeleccionadasPDF = listaRemates.filter((_, index) =>
    filaSeleccionada.includes(index.toString())
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listaRemates)
    ? Math.ceil(listaRemates.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  const [Rematados, setRematados] = useState({
    fDesde: "",
    fHasta: "",
    nresolucion: "",
    af_codigo_generico: ""
  });

  // const validate = () => {
  //   let tempErrors: Partial<any> & {} = {};
  //   // Validación para N° de Recepción (debe ser un número)
  //   if (!Rematados.nresolucion || Rematados.nresolucion === "") tempErrors.nresolucion = "Campo obligatorio.";
  //   if (Rematados.fDesde > Rematados.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";
  //   setError(tempErrors);
  //   return Object.keys(tempErrors).length === 0;
  // };

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
        const resultado = await obtenerListaRematesActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
        if (resultado) {
          setLoading(false);
        }
        else {
          Swal.fire({
            icon: "warning",
            title: "Sin resultados",
            text: "No hay registros disponibles para mostrar.",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    listaRematesAuto()
  }, [obtenerListaRematesActions, token, listaRemates.length]); // Asegúrate de incluir dependencias relevantes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Validación específica para af_codigo_generico: solo permitir números
    if ((name === "nresolucion" || name === "af_codigo_generico") && !/^[0-9]*$/.test(value)) {
      return; // Salir si contiene caracteres no numéricos
    }
    // Actualizar estado
    setRematados((prevState) => ({
      ...prevState,
      [name]: value,
    }));

  };


  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFilaSeleccionada(
        elementosActuales.map((_, index) =>
          (indicePrimerElemento + index).toString()
        )
      );
    } else {
      setFilaSeleccionada([]);
    }
  };

  const setSeleccionaFila = (index: number) => {
    setFilaSeleccionada((prev) =>
      prev.includes(index.toString())
        ? prev.filter((rowIndex) => rowIndex !== index.toString())
        : [...prev, index.toString()]
    );
  };

  // const handleCerrarModal = (index: number) => {
  //   setFilaSeleccionada((prevSeleccionadas) =>
  //     prevSeleccionadas.filter((fila) => fila !== index.toString())
  //   );
  //   setRematados((prevState) => ({
  //     ...prevState,
  //     nresolucion: "",
  //   }));
  // };

  const handleBuscar = async () => {
    let resultado = false;
    setLoading(true);
    if (Rematados.fDesde != "" || Rematados.fHasta != "") {
      if (validateFechas()) {
        resultado = await obtenerListaRematesActions(Rematados.fDesde, Rematados.fHasta, Rematados.nresolucion, Rematados.af_codigo_generico, objeto.Roles[0].codigoEstablecimiento);
      }
    }
    else {
      resultado = await obtenerListaRematesActions("", "", Rematados.nresolucion, Rematados.af_codigo_generico, objeto.Roles[0].codigoEstablecimiento);
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

  const handleRefrescar = async () => {
    setLoadingRefresh(true); //Finaliza estado de carga
    const resultado = await obtenerListaRematesActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
    if (!resultado) {
      setLoadingRefresh(false);
    } else {
      paginar(1);
      setLoadingRefresh(false);
    }
  };


  const handleLimpiar = () => {
    setRematados((prevInventario) => ({
      ...prevInventario,
      fDesde: "",
      fHasta: "",
      nresolucion: "",
      af_codigo_generico: ""
    }));
  };

  // const handleQuitar = async () => {
  //   if (validate()) {
  //     const selectedIndices = filaSeleccionada.map(Number);
  //     const result = await Swal.fire({
  //       icon: "info",
  //       title: "Quitar Bienes",
  //       text: "Confirme para quitar el bien seleccionados",
  //       showDenyButton: false,
  //       showCancelButton: true,
  //       confirmButtonText: "Confirmar y Quitar",
  //       background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //       color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //       confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
  //       customClass: {
  //         popup: "custom-border", // Clase personalizada para el borde
  //       }
  //     });
  //     if (result.isConfirmed) {

  //       setLoadingRegistro(true);
  //       // Crear un array de objetos con aF_CLAVE y nombre
  //       const Formulario = selectedIndices.map((activo) => ({
  //         aF_CLAVE: listaRemates[activo].aF_CLAVE,
  //         bajaS_CORR: listaRemates[activo].bajaS_CORR,
  //         especie: listaRemates[activo].especie,
  //         vutiL_RESTANTE: listaRemates[activo].vutiL_RESTANTE,
  //         vutiL_AGNOS: listaRemates[activo].vutiL_AGNOS,
  //         ...Rematados,// nresolucion
  //         observaciones: listaRemates[activo].observaciones,
  //         deP_ACUMULADA: listaRemates[activo].deP_ACUMULADA,
  //         ncuenta: listaRemates[activo].ncuenta,
  //         estado: listaRemates[activo].estado,
  //         // fechA_REMATES: listaRemates[activo].fechA_REMATES,

  //       }));
  //       // console.log(Formulario);
  //       const resultado = await rematarBajasActions(Formulario);

  //       if (resultado) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Bienes Rematados",
  //           text: "Se han quitdo del sistema correctamente",
  //           background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //           color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //           confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
  //           customClass: {
  //             popup: "custom-border", // Clase personalizada para el borde
  //           }
  //         });

  //         setLoadingRegistro(false);
  //         obtenerListaRematesActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
  //         setFilaSeleccionada([]);
  //         setRematados((prevState) => ({
  //           ...prevState,
  //           nresolucion: "",
  //         }));
  //         setMostrarModal(false);
  //       } else {
  //         Swal.fire({
  //           icon: "error",
  //           title: ":'(",
  //           text: "Hubo un problema al registrar",
  //           background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //           color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //           confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
  //           customClass: {
  //             popup: "custom-border", // Clase personalizada para el borde
  //           }
  //         });
  //         setLoadingRegistro(false);
  //       }
  //     }
  //   }
  // };

  return (
    <Layout>
      <Helmet>
        <title>Bienes Rematados</title>
      </Helmet>
      <MenuBajas />

      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">Bienes Rematados</h3>
        <Row className="border rounded p-2 m-2">
          <Col md={3}>
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

          <Col md={2}>
            <div className="mb-1">
              <label htmlFor="nresolucion" className="fw-semibold">Nº Resolución</label>
              <input
                aria-label="nresolucion"
                type="text"
                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                name="nresolucion"
                size={10}
                placeholder="0"
                onChange={handleChange}
                value={Rematados.nresolucion}
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
                value={Rematados.af_codigo_generico}
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
                    < Search className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                  </>
                )}
              </Button>
              <Button onClick={handleRefrescar}
                variant={`${isDarkMode ? "secondary" : "primary"}`}
                className="mx-1 mb-1"
                disabled={loadingRefresh}>
                {loadingRefresh ? (
                  <>
                    {" Refrescar "}
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
                    {" Refrescar "}
                    < ArrowClockwise className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                  </>
                )}
              </Button>
              <Button onClick={handleLimpiar}
                variant={`${isDarkMode ? "secondary" : "primary"}`}
                className="mx-1 mb-1">
                Limpiar
                <Eraser className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
              </Button>
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          {filaSeleccionada.length > 0 ? (
            <>
              <Button
                onClick={() => setMostrarModal(true)}
                disabled={listaRemates.length === 0}
                variant={isDarkMode ? "secondary" : "primary"}
                className="m-1 p-2 d-flex align-items-center"
              >
                <FiletypePdf
                  className="flex-shrink-0 h-5 w-5 ms-1"
                  aria-hidden="true"
                />
                {"Exportar"}
                <span className="badge bg-light text-dark mx-1 mt-1">
                  {filaSeleccionada.length}
                </span>

              </Button>

            </>
          ) : (
            <strong className="alert alert-dark border m-1 p-2 mx-2">
              No hay filas seleccionadas
            </strong>
          )}
        </div>
        {/* Tabla*/}
        {loading || loadingRefresh ? (
          <>
            <SkeletonLoader rowCount={elementosPorPagina} />
          </>
        ) : (
          <div className='table-responsive'>
            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
              <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                <tr>
                  <th style={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 0,

                  }}>
                    <Form.Check
                      className="check-danger"
                      type="checkbox"
                      onChange={handleSeleccionaTodos}
                      checked={filaSeleccionada.length === elementosActuales.length && elementosActuales.length > 0}
                    />
                  </th>
                  <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                  <th scope="col" className="text-nowrap text-center">Nº Resolución</th>
                  <th scope="col" className="text-nowrap text-center">Código Baja</th>
                  <th scope="col" className="text-nowrap text-center">Especie</th>
                  <th scope="col" className="text-nowrap text-center">Fecha de Ingreso</th>
                  <th scope="col" className="text-nowrap text-center">Vida Útil Restante</th>
                  <th scope="col" className="text-nowrap text-center">Vida Útil en Años</th>
                  <th scope="col" className="text-nowrap text-center">Observaciones</th>
                  <th scope="col" className="text-nowrap text-center">Depreciación Acumulada</th>
                  <th scope="col" className="text-nowrap text-center">Nº Cuenta</th>
                  <th scope="col" className="text-nowrap text-center">Estado</th>

                </tr>
              </thead>
              <tbody>
                {elementosActuales.map((Lista, index) => {
                  const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                  return (
                    <tr key={indexReal}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => setSeleccionaFila(index)}
                          checked={filaSeleccionada.includes(indexReal.toString())}
                        />
                      </td>
                      {/* <td className="text-nowrap text-center">{Lista.boD_CORR}</td> */}
                      <td className="text-nowrap">{Lista.aF_CODIGO_GENERICO}</td>
                      <td className="text-nowrap">{Lista.nresolucion}</td>
                      <td className="text-nowrap">{Lista.bajaS_CORR}</td>
                      <td className="text-nowrap">{Lista.especie}</td>
                      <td className="text-nowrap">{Lista.fechA_INGRESO}</td>
                      <td className="text-nowrap">{Lista.vutiL_RESTANTE}</td>
                      <td className="text-nowrap">{Lista.vutiL_AGNOS}</td>
                      <td className="text-nowrap">{Lista.observaciones}</td>
                      <td className="text-nowrap">{Lista.deP_ACUMULADA}</td>
                      <td className="text-nowrap">{Lista.ncuenta}</td>
                      <td className="text-nowrap">{Lista.estado}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginador */}
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
      </div>

      {/* Modal exportar*/}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" size="xl">
        <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
          <Modal.Title className="fw-semibold">Bienes Rematados</Modal.Title>
        </Modal.Header>
        <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
          <form >
            {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
            <BlobProvider document={
              <DocumentoRematesPDF
                row={filasSeleccionadasPDF}
              // firmanteInventario={AltaInventario.firmanteInventario}
              // firmanteFinanzas={AltaInventario.firmanteFinanzas}
              // firmanteAbastecimiento={AltaInventario.firmanteAbastecimiento}
              // visadoInventario={AltaInventario.visadoInventario}
              // visadoFinanzas={AltaInventario.visadoFinanzas}
              // visadoAbastecimiento={AltaInventario.visadoAbastecimiento}
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
                  // <iframe
                  //     src={url ? `${url}${isFirefox ? "" : "#toolbar=0&navpanes=0&scrollbar=1"}` : ''}
                  //     title="Vista Previa del PDF"
                  //     style={{
                  //         width: "100%",
                  //         height: "900px",
                  //         border: "none",
                  //         pointerEvents: isFirefox ? "none" : "auto", // Deshabilita interacciones en Firefox
                  //     }}
                  // ></iframe>

                )
              }
            </BlobProvider>
          </form>
        </Modal.Body>
      </Modal >
    </Layout>

  );
};

const mapStateToProps = (state: RootState) => ({
  listaRemates: state.obtenerListaRematesReducers.listaRemates,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  nPaginacion: state.mostrarNPaginacionReducer.nPaginacion,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  rematarBajasActions,
  obtenerListaRematesActions
})(BienesRematados);
