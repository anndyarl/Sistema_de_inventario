import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Form, Modal, Row, Col } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuBajas from "../Menus/MenuBajas.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";
import { ArrowClockwise, Eraser, Search } from "react-bootstrap-icons";
import { registrarBienesBajasActions } from "../../redux/actions/Bajas/ListadoGeneral/registrarBienesBajasActions.tsx";
import { listaAltasdesdeBajasActions } from "../../redux/actions/Bajas/ListadoGeneral/listaAltasdesdeBajasActions.tsx";
import { ListaAltas } from "../Altas/RegistrarAltas.tsx";
export interface ListaBajas {
  bajaS_CORR: string;
  aF_CLAVE: number;
  id: number;
  vutiL_RESTANTE: number;
  vutiL_AGNOS: number;
  useR_MOD: number;
  saldO_VALOR: number;
  observaciones: string;
  nresolucion: number;
  ncuenta: string;
  iniciaL_VALOR: number;
  fechA_BAJA: string;
  especie: string;
  deP_ACUMULADA: number;
}

interface DatosBajas {
  listadoGeneralBajas: ListaAltas[];
  listaSalidaBajas: ListaBajas[];
  listaAltasdesdeBajasActions: (fDesde: string, fHasta: string, af_codigo_generico: string, altasCorr: number, establ_corr: number) => Promise<boolean>;
  registrarBienesBajasActions: (baja: { aF_CLAVE: number, usuariO_MOD: string, ctA_COD: string, especie: string }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const ListadoGeneral: React.FC<DatosBajas> = ({ listaAltasdesdeBajasActions, registrarBienesBajasActions, listadoGeneralBajas, listaSalidaBajas, token, isDarkMode, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [__, setLoadingRegistro] = useState(false);
  const [error, setError] = useState<Partial<ListaBajas>>({});
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalMostrarResumen, setModalMostrarResumen] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
  const elementosPorPagina = Paginacion.nPaginacion;

  const [Bajas, setBajas] = useState({
    nresolucion: 0,
    observaciones: "",
    fechA_BAJA: ""
  });

  const [Buscar, setBuscar] = useState({
    fDesde: "",
    fHasta: "",
    altaS_CORR: 0,
    af_codigo_generico: ""
  });

  //Se lista automaticamente apenas entra al componente
  const listadoGeneralBajasAuto = async () => {
    if (token) {
      if (listadoGeneralBajas.length === 0) {
        setLoading(true);
        const resultado = await listaAltasdesdeBajasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
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
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
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
    listadoGeneralBajasAuto();
  }, [listaAltasdesdeBajasActions, listadoGeneralBajas.length]); // Asegúrate de incluir dependencias relevantes


  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Bajas.nresolucion) tempErrors.nresolucion = "Campo obligatorio.";
    if (!Bajas.fechA_BAJA) tempErrors.fechA_BAJA = "Campo obligatorio.";
    if (!Bajas.observaciones) tempErrors.observaciones = "Campo obligatorio.";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validación específica para af_codigo_generico: solo permitir números
    if ((name === "af_codigo_generico" || name === "altaS_CORR") && !/^[0-9]*$/.test(value)) {
      return; // Salir si contiene caracteres no numéricos
    }
    // Convertir a número solo si el campo está en la lista
    const camposNumericos = ["nresolucion"];
    const newValue: string | number = camposNumericos.includes(name)
      ? parseFloat(value) || 0
      : value;

    // Actualizar estado
    setBajas((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    setBuscar((prevBuscar) => ({
      ...prevBuscar,
      [name]: newValue,
    }));

    setPaginacion((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

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

  const setSeleccionaFilas = (index: number) => {
    const indexReal = indicePrimerElemento + index;
    setFilasSeleccionadas((prev) =>
      prev.includes(indexReal.toString())
        ? prev.filter((rowIndex) => rowIndex !== indexReal.toString())
        : [...prev, indexReal.toString()]
    );
    // console.log("indices seleccionmados", indexReal);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      const selectedIndices = filasSeleccionadas.map(Number);
      const result = await Swal.fire({
        icon: "info",
        title: "Enviar a Bodega de Excluidos",
        text: "Confirme para enviar",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar y Enviar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      if (result.isConfirmed) {
        setLoadingRegistro(true);
        // Crear un array de objetos con aF_CLAVE y nombre
        const FormularioBajas = selectedIndices.map((activo) => ({
          aF_CODIGO_GENERICO: listadoGeneralBajas[activo].ninv,
          aF_CLAVE: listadoGeneralBajas[activo].aF_CLAVE,
          usuariO_MOD: objeto.IdCredencial.toString(),
          ctA_COD: listadoGeneralBajas[activo].ncuenta,
          especie: listadoGeneralBajas[activo].esp,
          ...Bajas,
        }));
        const resultado = await registrarBienesBajasActions(FormularioBajas);
        if (resultado) {
          mostrarAlerta();
          listaAltasdesdeBajasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento); //Carga la tabla nuevamente
          setLoadingRegistro(false);//Detiene la carga
          setFilasSeleccionadas([]);//Limpia Formulario
          setMostrarModal(false);//Cierra modal formulario
        } else {
          Swal.fire({
            icon: "error",
            title: ":'(",
            text: "Hubo un problema al registrar",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "#444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
          setLoadingRegistro(false);
        }
      }
    }
  };

  const mostrarAlerta = () => {
    document.body.style.overflow = "hidden"; // Evita que el fondo se desplace
    Swal.fire({
      icon: "success",
      title: "Registro Exitoso",
      text: `Se han registrado correctamente las Bajas seleccionadas, Presione "OK" para visualizar un resumen de los datos ingresados.`,
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

  const handleBuscar = async () => {
    let resultado = false;
    setLoading(true);
    if (Buscar.fDesde != "" || Buscar.fHasta != "") {
      if (validate()) {
        resultado = await listaAltasdesdeBajasActions(Buscar.fDesde, Buscar.fHasta, Buscar.af_codigo_generico, Buscar.altaS_CORR, objeto.Roles[0].codigoEstablecimiento);
      }
    }
    else {
      resultado = await listaAltasdesdeBajasActions("", "", Buscar.af_codigo_generico, Buscar.altaS_CORR, objeto.Roles[0].codigoEstablecimiento);
    }
    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "No se encontraron resultados para la consulta realizada.",
        confirmButtonText: "Ok",
      });
      // listaAltasdesdeBajasActions("");
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }

  };

  const handleRefrescar = async () => {
    setLoadingRefresh(true); //Finaliza estado de carga
    const resultado = await listaAltasdesdeBajasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
    if (!resultado) {
      setLoadingRefresh(false);
    } else {
      paginar(1);
      setLoadingRefresh(false);
    }
  };

  const handleLimpiar = () => {
    setBuscar((prevInventario) => ({
      ...prevInventario,
      af_codigo_generico: "",
      altaS_CORR: 0,
    }));
  };

  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () =>
      listadoGeneralBajas.slice(indicePrimerElemento, indiceUltimoElemento),
    [listadoGeneralBajas, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listadoGeneralBajas)
    ? Math.ceil(listadoGeneralBajas.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  return (
    <Layout>
      <Helmet>
        <title>Listado General</title>
      </Helmet>
      <MenuBajas />
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">Listado General</h3>
        <Row className="border rounded p-2 m-2">
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
                value={Buscar.af_codigo_generico}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="altaS_CORR" className="form-label fw-semibold small">Nº Alta</label>
              <input
                aria-label="altaS_CORR"
                type="text"
                className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                name="altaS_CORR"
                placeholder="0"
                onChange={handleChange}
                value={Buscar.altaS_CORR}
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
            <>
              <Button
                onClick={() => setMostrarModal(true)} // Descomenta si ya tienes el estado y función
                disabled={listadoGeneralBajas.length === 0}
                variant={isDarkMode ? "secondary" : "primary"}
                className="m-1 p-2 d-flex align-items-center"
              >
                {/* <Plus
                  className={classNames("flex-shrink-0", "h-5 w-5 ms-1")}
                  aria-hidden="true"
                /> */}
                {"Enviar"}
                <span className="badge bg-light text-dark mx-1 mt-1">
                  {filasSeleccionadas.length}
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
                    left: 0
                  }}>
                    <Form.Check
                      type="checkbox"
                      onChange={handleSeleccionaTodos}
                      checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                    />
                  </th>
                  <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                  <th scope="col" className="text-nowrap text-center">N° Alta</th>
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
                      <td className="text-nowrap">{Lista.altaS_CORR}</td>
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

        )
        }
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
      </div >
      {/* Modal formulario*/}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" backdrop="static">
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title className="fw-semibold">Enviar a Bodega de Excluidos</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                className="m-1 p-2 d-flex align-items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    {" Enviar "}
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />

                  </>
                ) : (
                  <>
                    Enviar
                    {/* <Down
                      className={classNames("flex-shrink-0", "h-5 w-5 ms-1")}
                      aria-hidden="true"
                    /> */}
                  </>
                )}
              </Button>
            </div>
            <div className="mb-1">
              <label htmlFor="nresolucion" className="fw-semibold">
                Nº Certificado
              </label>
              <input
                aria-label="nresolucion"
                type="text"
                className={`form-select ${error.nresolucion ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                name="nresolucion"
                maxLength={8}
                onChange={handleChange}
                value={Bajas.nresolucion}
              />
              {error.nresolucion && (
                <div className="invalid-feedback fw-semibold">{error.nresolucion}</div>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="fechA_BAJA" className="fw-semibold">
                Fecha Baja
              </label>
              <input
                aria-label="fechA_BAJA"
                type="date"
                className={`form-select ${error.fechA_BAJA ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                name="fechA_BAJA"
                onChange={handleChange}
                value={Bajas.fechA_BAJA}
                max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
              />
              {error.fechA_BAJA && (
                <div className="invalid-feedback fw-semibold">{error.fechA_BAJA}</div>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="observaciones" className="fw-semibold">
                Observaciones
              </label>
              <textarea
                className={`form-select ${error.observaciones ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                aria-label="observaciones"
                name="observaciones"
                rows={4}
                onChange={handleChange}
                value={Bajas.observaciones}
              />
              {error.observaciones && (
                <div className="invalid-feedback fw-semibold">
                  {error.observaciones}
                </div>
              )}
            </div>

          </form>
        </Modal.Body>
      </Modal >

      <Modal show={modalMostrarResumen} onHide={() => setModalMostrarResumen(false)} size="lg">
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title className="fw-semibold">Inventario asociado a Nº de Certificado</Modal.Title>
        </Modal.Header>
        {/* <div className={` d-flex justify-content-end p-4 border-bottom ${isDarkMode ? "darkModePrincipal" : ""}`}>
                <Button variant={`${isDarkMode ? "secondary" : "primary"}`} onClick={handleExportPDF}>
                  Exportar a PDF
                </Button>
              </div> */}
        <Modal.Body id="pdf-content" className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <div className="table-responsive">
            <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
              <thead>
                <tr>
                  <th>Nº Inventario</th>
                  <th>N" Certificado</th>
                </tr>
              </thead>
              <tbody>
                {listaSalidaBajas.length > 0 ? (
                  listaSalidaBajas.map((item, index) => (
                    <tr key={index}>
                      <td>{item.aF_CLAVE || 'N/A'}</td>
                      <td>{item.nresolucion || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center">No hay registros</td>
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
  listadoGeneralBajas: state.datosListadoGeneralBajasReducers.listadoGeneralBajas,
  listaSalidaBajas: state.datosBajasRegistradaReducers.listaSalidaBajas,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  listaAltasdesdeBajasActions,
  registrarBienesBajasActions
})(ListadoGeneral);
