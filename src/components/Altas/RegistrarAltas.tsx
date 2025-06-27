import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Form, Row, Col, Modal } from "react-bootstrap";
import { RootState } from "../../store";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { registrarAltasActions } from "../../redux/actions/Altas/RegistrarAltas/registrarAltasActions";
import MenuAltas from "../Menus/MenuAltas";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";
import { listaAltasActions } from "../../redux/actions/Altas/RegistrarAltas/listaAltasActions.tsx";
import { ArrowClockwise, Eraser, Search } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { listaAltasRegistradasActions } from "../../redux/actions/Altas/AnularAltas/listaAltasRegistradasActions.tsx";

interface FechasProps {
  fDesde: string;
  fHasta: string;
}
export interface ListaAltas {
  aF_CLAVE: number,
  altaS_CORR: number;
  ninv: string,
  aF_FINGRESO: string;
  serv: string,
  dep: string,
  esp: string,
  ncuenta: string,
  marca: string,
  modelo: string,
  serie: string,
  estado: string,
  precio: number,
  aF_ESTADO_INV: number;
  nrecep: string
}

export interface ListaSalidaAltas {
  aF_CLAVE: number; //se devuelve el aF_CODIGO_GENERICO
  altaS_CORR: number;
}
interface DatosAltas {
  listaAltas: ListaAltas[];
  listaAltasActions: (fDesde: string, fHasta: string, af_codigo_generico: string, altas_corr: number, establ_corr: number) => Promise<boolean>;
  listaAltasRegistradasActions: (fDesde: string, fHasta: string, establ_corr: number, altasCorr: number, af_codigo_generico: string) => Promise<boolean>;
  registrarAltasActions: (activos: { aF_CLAVE: number }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto;
  listaSalidaAltas: ListaSalidaAltas[];
}

const RegistrarAltas: React.FC<DatosAltas> = ({ listaAltasActions, registrarAltasActions, listaAltasRegistradasActions, listaAltas, objeto, token, isDarkMode, listaSalidaAltas }) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});
  const [loading, setLoading] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalMostrarResumen, setModalMostrarResumen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
  const elementosPorPagina = Paginacion.nPaginacion;
  const afCodigoGenerico = location.state?.prop_codigo_origen ?? "";
  const [Inventario, setInventario] = useState({
    fDesde: "",
    fHasta: "",
    af_codigo_generico: afCodigoGenerico
  });

  useEffect(() => {
    listaAuto();
  }, [listaAltasActions, listaAltas.length]); // Asegúrate de incluir dependencias relevantes

  const listaAuto = async () => {
    if (token) {
      if (listaAltas.length === 0) {
        setLoading(true);
        const resultado = await listaAltasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
        if (!resultado) {
          Swal.fire({
            icon: "warning",
            title: "Sin Resultados",
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
        else {
          setLoading(false);
        }
      }
    }
  };
  const handleBuscar = async () => {
    let resultado = false;
    setLoading(true);

    if (Inventario.fDesde != "" || Inventario.fHasta != "") {
      if (validate()) {
        resultado = await listaAltasActions(Inventario.fDesde, Inventario.fHasta, Inventario.af_codigo_generico, 0, objeto.Roles[0].codigoEstablecimiento);
      }
    }
    else {
      resultado = await listaAltasActions("", "", Inventario.af_codigo_generico, 0, objeto.Roles[0].codigoEstablecimiento);
    }
    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "No se encontraron resultados para la consulta realizada.",
        confirmButtonText: "Ok",
      });
      listaAltasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }

  };

  const handleRefrescar = async () => {
    setLoadingRefresh(true); //Finaliza estado de carga
    const resultado = await listaAltasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
    if (!resultado) {
      setLoadingRefresh(false);
    } else {
      paginar(1);
      setLoadingRefresh(false);
    }
  };

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    if (Inventario.fDesde > Inventario.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    // Validación específica para af_codigo_generico: solo permitir números
    if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
      return; // Salir si contiene caracteres no numéricos
    }

    // Actualizar estado
    setInventario((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setPaginacion((prevState) => ({
      ...prevState,
      [name]: value,
    }));

  };

  const handleLimpiar = () => {
    setInventario((prevInventario) => ({
      ...prevInventario,
      fDesde: "",
      fHasta: "",
      af_codigo_generico: ""
    }));
  };

  const setSeleccionaFilas = (index: number) => {
    const indexReal = indicePrimerElemento + index;
    setFilasSeleccionadas((prev) =>
      prev.includes(indexReal.toString())
        ? prev.filter((rowIndex) => rowIndex !== indexReal.toString())
        : [...prev, indexReal.toString()]
    );
    // console.log("indices seleccionmados", indexReal);
  };

  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFilasSeleccionadas(
        elementosActuales.map((_, index) =>
          (indicePrimerElemento + index).toString()
        )
      );

    } else {
      setFilasSeleccionadas([]);
    }
  };

  const handleAgrearSeleccionados = async () => {
    const selectedIndices = filasSeleccionadas.map(Number);
    const activosSeleccionados = selectedIndices.map((index) => {
      return {
        aF_CLAVE: listaAltas[index].aF_CLAVE,
        aF_CODIGO_GENERICO: listaAltas[index].ninv,
        USUARIO_MOD: objeto.IdCredencial,
        ESTABL_CORR: objeto.Roles[0].codigoEstablecimiento,
      };

    });
    const result = await Swal.fire({
      icon: "info",
      title: "Registrar Altas",
      text: `Confirme para registrar las Altas seleccionadas`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar y Registrar",
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      customClass: {
        popup: "custom-border", // Clase personalizada para el borde
      }
    });
    // console.log("filas Seleccionadas ", filasSeleccionadas);
    // selectedIndices.map(async (index) => {

    if (result.isConfirmed) {
      setLoadingRegistro(true);
      // const elemento = listaAltas[index].aF_CLAVE;
      // console.log("despues del confirm elemento", elemento);
      // const clavesSeleccionadas: number[] = selectedIndices.map((index) => listaAltas[index].aF_CLAVE);      
      // console.log("Claves seleccionadas para registrar:", clavesSeleccionadas);
      // Crear un array de objetos con aF_CLAVE y nombre
      // console.log("Activos seleccionados para registrar:", activosSeleccionados);
      // console.log("listaSalidaAltas", listaSalidaAltas);
      if (activosSeleccionados[0].aF_CODIGO_GENERICO.toString() != "1") {
        const resultado = await registrarAltasActions(activosSeleccionados);
        if (resultado) {
          mostrarAlerta();
          listaAltasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
          setLoadingRegistro(false);//Detiene la carga
          setFilasSeleccionadas([]);//Limpia Formulario
        } else {
          Swal.fire({
            icon: "error",
            title: ":'(",
            text: `Hubo un problema al registrar las Altas.`,
            background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "#000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
              popup: "custom-border"
            }
          });
          setLoadingRegistro(false);
        }
      }
      else {
        Swal.fire({
          icon: "warning",
          title: "Número de inventario en estado anulado",
          text: `Este Nº de inventario no puede ser dado de alta, ya que ha sido previamente anulado.`,
          background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "#000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "#444"}`,
          customClass: {
            popup: "custom-border"
          }
        });
        setLoadingRegistro(false);
      }
    }
    // })
  };

  const mostrarAlerta = () => {
    document.body.style.overflow = "hidden"; // Evita que el fondo se desplace
    Swal.fire({
      icon: "success",
      title: "Registro Exitoso",
      text: `Se han registrado correctamente las Altas seleccionadas, Presione "OK" para visualizar un resumen de los datos ingresados.`,
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
      customClass: { popup: "custom-border" },
      allowOutsideClick: false,
      showCancelButton: false, // Agrega un segundo botón
      cancelButtonText: "Cerrar", // Texto del botón
      willClose: () => {
        document.body.style.overflow = "auto"; // Restaura el scroll
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setModalMostrarResumen(true);
      }
    });
  };

  const HandleFirmarAltas = () => {
    listaAltasRegistradasActions("", "", objeto.Roles[0].codigoEstablecimiento, listaSalidaAltas[0].altaS_CORR, "");
    navigate("/Altas/FirmarAltas", {
      state: { prop_altaS_CORR: listaSalidaAltas[0].altaS_CORR }
    });
  }

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

  // const handleExportPDF = () => {
  //   const input: any = document.getElementById("pdf-content");
  //   html2canvas(input, { scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const imgWidth = 190;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  //     pdf.save("Resumen_Inventario.pdf");
  //   });
  // };

  return (
    <Layout>
      <Helmet>
        <title>Registrar Altas</title>
      </Helmet>
      <MenuAltas />
      <form>
        <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">Registrar Altas</h3>
          <Row className="border rounded p-2 m-2">
            <Col md={3}>
              <div className="mb-2">
                <div className="flex-grow-1 mb-2">
                  <label htmlFor="fDesde" className="form-label fw-semibold small">Desde</label>
                  <div className="input-group">
                    <input
                      aria-label="Fecha Desde"
                      type="date"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fDesde ? "is-invalid" : ""}`}
                      name="fDesde"
                      onChange={handleChange}
                      value={Inventario.fDesde}
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
                      value={Inventario.fHasta}
                      max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                    />
                  </div>
                  {error.fHasta && <div className="invalid-feedback d-block">{error.fHasta}</div>}

                </div>
                <small className="fw-semibold">Filtre los resultados por fecha de ingreso.</small>
              </div>
            </Col>
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
                      < Search className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                    </>
                  )}
                </Button>
                <Button onClick={handleRefrescar}
                  variant={`${isDarkMode ? "secondary" : "primary"}`}
                  className="mx-1 mb-1">
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
          {/* Boton registrar filas seleccionadas */}
          <div className="d-flex justify-content-end">
            <div className="d-flex align-items-center me-2">
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
                {[10, 15, 20, 25, 50].map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
            {filasSeleccionadas.length > 0 ? (
              <Button
                variant="primary"
                onClick={handleAgrearSeleccionados}
                className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                disabled={loadingRegistro}  // Desactiva el botón mientras carga
              >
                {loadingRegistro ? (
                  <>
                    {" Registrando... "}
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="mx-1"
                    />

                  </>
                ) : (
                  <>
                    Registrar
                    <span className="badge bg-light text-dark mx-1 mt-1">
                      {filasSeleccionadas.length}
                    </span>
                    {filasSeleccionadas.length === 1 ? "Alta" : "Altas"}
                  </>
                )}
              </Button>
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
                      left: 0
                    }}>
                      <Form.Check
                        type="checkbox"
                        onChange={handleSeleccionaTodos}
                        checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                      />
                    </th>
                    <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                    <th scope="col" className="text-nowrap text-center">Servicio</th>
                    <th scope="col" className="text-nowrap text-center">Dependencia</th>
                    <th scope="col" className="text-nowrap text-center">Fecha Ingreso</th>
                    <th scope="col" className="text-nowrap text-center">Especie</th>
                    <th scope="col" className="text-nowrap text-center">N° Cuenta</th>
                    <th scope="col" className="text-nowrap text-center">Marca</th>
                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                    <th scope="col" className="text-nowrap text-center">Serie</th>
                    <th scope="col" className="text-nowrap text-center">Estado</th>
                    <th scope="col" className="text-nowrap text-center">Precio</th>
                    <th scope="col" className="text-nowrap text-center">N° Recepcion</th>
                    {/* <th scope="col">Acción</th> */}
                  </tr>
                </thead>
                <tbody>
                  {elementosActuales.map((Lista, index) => {
                    const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                    return (
                      <tr key={indexReal}>
                        <td style={{
                          position: 'sticky',
                          left: 0
                        }}>
                          <Form.Check
                            type="checkbox"
                            onChange={() => setSeleccionaFilas(index)}
                            checked={filasSeleccionadas.includes(indexReal.toString())} // Verifica con el índice real
                          />
                        </td>

                        <td className="text-nowrap">{Lista.ninv}</td>
                        <td className="text-nowrap">{Lista.serv}</td>
                        <td className="text-nowrap">{Lista.dep}</td>
                        <td className="text-nowrap">{Lista.aF_FINGRESO}</td>
                        <td className="text-nowrap">{Lista.esp}</td>
                        <td className="text-nowrap">{Lista.ncuenta}</td>
                        <td className="text-nowrap">{Lista.marca}</td>
                        <td className="text-nowrap">{Lista.modelo}</td>
                        <td className="text-nowrap">{Lista.serie}</td>
                        <td className="text-nowrap">{Lista.estado}</td>
                        <td className="text-nowrap">
                          ${(Lista.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                        </td>
                        <td className="text-nowrap">{Lista.nrecep == "" || parseInt(Lista.nrecep) == 0 ? "Sin Nº Recepción" : Lista.nrecep}</td>
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
          </div >
        </div >
      </form >

      <Modal show={modalMostrarResumen} onHide={() => setModalMostrarResumen(false)} size="lg">
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title className="fw-semibold">Inventario asociado a Nº de Alta</Modal.Title>
        </Modal.Header>
        {/* <div className={` d-flex justify-content-end p-4 border-bottom ${isDarkMode ? "darkModePrincipal" : ""}`}>
          <Button variant={`${isDarkMode ? "secondary" : "primary"}`} onClick={handleExportPDF}>
            Exportar a PDF
          </Button>
        </div> */}
        <Modal.Body id="pdf-content" className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <div className="d-flex justify-content-end">
            <Button onClick={HandleFirmarAltas} className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  px-4 py-2`}>
              Ir a Firmar Altas
            </Button>
          </div>
          <div className="table-responsive">
            <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
              <thead>
                <tr>
                  <th>Nº Inventario</th>
                  <th>N" Alta</th>
                </tr>
              </thead>
              <tbody>
                {listaSalidaAltas.length > 0 ? (
                  listaSalidaAltas.map((item, index) => (
                    <tr key={index}>
                      <td>{item.aF_CLAVE || 'N/A'}</td>
                      <td>{item.altaS_CORR || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='8' className="text-center">No hay registros</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>

    </Layout >

  );
};

const mapStateToProps = (state: RootState) => ({
  listaAltas: state.listaAltasReducers.listaAltas,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers,
  listaSalidaAltas: state.datosAltaRegistradaReducers.listaSalidaAltas
});

export default connect(mapStateToProps, {
  listaAltasActions,
  listaAltasRegistradasActions,
  registrarAltasActions
})(RegistrarAltas);
