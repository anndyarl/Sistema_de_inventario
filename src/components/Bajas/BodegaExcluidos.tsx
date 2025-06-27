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
import { ArrowClockwise, Eraser, Search } from "react-bootstrap-icons";
import { obtenerListaExcluidosActions } from "../../redux/actions/Bajas/ListadoGeneral/obtenerListaExcluidosActions.tsx";
import { quitarBodegaExcluidosActions } from "../../redux/actions/Bajas/BodegaExcluidos/quitarBodegaExcluidosActions.tsx";
import { excluirBajasActions } from "../../redux/actions/Bajas/BodegaExcluidos/excluirBajasActions.tsx";
// import { devolverBajasActions } from "../../redux/actions/Bajas/BodegaExcluidos/devolverBajasActions.tsx";
import { Objeto } from "../Navegacion/Profile.tsx";
import { obtenerListaRematesActions } from "../../redux/actions/Bajas/obtenerListaRematesActions.tsx";
// import { listaAltasdesdeBajasActions } from "../../redux/actions/Bajas/ListadoGeneral/listaAltasdesdeBajasActions.tsx";

interface FechasProps {
  fDesde: string;
  fHasta: string;
}
export interface ListaExcluidos {
  aF_CODIGO_GENERICO: string,
  nresolucion: string;
  observaciones: string;
  useR_MOD: number;
  bajaS_CORR: number;
  aF_CLAVE: string;
  fechA_BAJA: string;
  especie: string;
  ncuenta: string;
  vutiL_AGNOS: number;
  vutiL_RESTANTE: number;
  deP_ACUMULADA: number;
  iniciaL_VALOR: number;
  saldO_VALOR: number;
  estado: number;
}


interface DatosBajas {
  listaExcluidos: ListaExcluidos[];
  obtenerListaExcluidosActions: (fDesde: string, fHasta: string, nresolucion: string, af_codigo_generico: string, establ_corr: number) => Promise<boolean>;
  obtenerListaRematesActions: (fDesde: string, fHasta: string, nresolucion: string, af_codigo_generico: string, establ_corr: number) => Promise<boolean>;
  // listaAltasdesdeBajasActions: (fDesde: string, fHasta: string, af_codigo_generico: string, altasCorr: number, establ_corr: number) => Promise<boolean>;
  quitarBodegaExcluidosActions: (listaExcluidos: Record<string, any>[]) => Promise<boolean>;
  excluirBajasActions: (listaExcluidos: Record<string, any>[]) => Promise<boolean>;
  // devolverBajasActions: (devolverBaja: Record<string, any>[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  nPaginacion: number; //número de paginas establecido desde preferencias
  objeto: Objeto;
}

const BienesExcluidos: React.FC<DatosBajas> = ({ obtenerListaExcluidosActions, quitarBodegaExcluidosActions, excluirBajasActions, obtenerListaRematesActions, listaExcluidos, token, isDarkMode, nPaginacion, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [error, setError] = useState<Partial<ListaExcluidos> & Partial<FechasProps>>({});
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]); //Estado para seleccion multiple
  const [filaSeleccionada, _] = useState<string[]>([]); //Estado para seleccion unica(Quitar)
  const [mostrarModal, setMostrarModal] = useState<number | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = nPaginacion;

  const [Excluidos, setExcluidos] = useState({
    fDesde: "",
    fHasta: "",
    nresolucion: "",
    af_codigo_generico: ""
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Excluidos.nresolucion || Excluidos.nresolucion === "") tempErrors.nresolucion = "Campo obligatorio.";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateFechas = () => {
    let tempErrors: Partial<any> & {} = {};
    if (Excluidos.fDesde > Excluidos.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  //Se lista automaticamente apenas entra al componente
  const listaExcluidosAuto = async () => {
    if (token) {
      if (listaExcluidos.length === 0) {
        setLoading(true);
        const resultado = await obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
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
    listaExcluidosAuto()
  }, [obtenerListaExcluidosActions, token, listaExcluidos.length]); // Asegúrate de incluir dependencias relevantes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Validación específica para af_codigo_generico: solo permitir números
    if ((name === "nresolucion" || name === "af_codigo_generico") && !/^[0-9]*$/.test(value)) {
      return; // Salir si contiene caracteres no numéricos
    }
    // Actualizar estado
    setExcluidos((prevState) => ({
      ...prevState,
      [name]: value,
    }));

  };

  //Funcion para seleccion multiple
  const setSeleccionaFila = (index: number) => {
    setFilasSeleccionadas((prev) =>
      prev.includes(index.toString())
        ? prev.filter((rowIndex) => rowIndex !== index.toString())
        : [...prev, index.toString()]
    );
  };

  //Funcion para seleccion multiple(Todos)
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

  const handleRematarSeleccionados = async () => {
    const selectedIndices = filasSeleccionadas.map(Number);

    const result = await Swal.fire({
      icon: "info",
      title: "Enviar a Bienes Rematados",
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
      // setLoadingRegistro(true);
      // Crear un array de objetos con aF_CLAVE y nombre
      const Formulario = selectedIndices.map((activo) => ({
        aF_CLAVE: listaExcluidos[activo].aF_CLAVE,
        bajaS_CORR: listaExcluidos[activo].bajaS_CORR,
        especie: listaExcluidos[activo].especie,
        vutiL_RESTANTE: listaExcluidos[activo].vutiL_RESTANTE,
        vutiL_AGNOS: listaExcluidos[activo].vutiL_AGNOS,
        nresolucion: listaExcluidos[activo].nresolucion,
        observaciones: listaExcluidos[activo].observaciones,
        deP_ACUMULADA: listaExcluidos[activo].deP_ACUMULADA,
        ncuenta: listaExcluidos[activo].ncuenta,
        estado: listaExcluidos[activo].estado,
        // fechA_REMATES: listaExcluidos[activo].fechA_REMATES,

      }));
      // console.log(Formulario);
      const resultado = await excluirBajasActions(Formulario);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Enviado a Bienes Rematados",
          text: "Se ha enviado correctamente",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });

        setLoadingRegistro(false);
        obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
        obtenerListaRematesActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
        setFilasSeleccionadas([]);
      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: "Hubo un problema al registrar",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        setLoadingRegistro(false);
      }

    }

  };

  // const handleDevolverSeleccionados = async () => {
  //   const selectedIndices = filasSeleccionadas.map(Number);

  //   const result = await Swal.fire({
  //     icon: "info",
  //     title: "Devolver a Listado General",
  //     text: "Confirme para enviar",
  //     showDenyButton: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Confirmar y Enviar",
  //     background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //     color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //     confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
  //     customClass: {
  //       popup: "custom-border", // Clase personalizada para el borde
  //     }
  //   });

  //   if (result.isConfirmed) {
  //     // setLoadingRegistro(true);
  //     // Crear un array de objetos con aF_CLAVE y nombre
  //     const Formulario = selectedIndices.map((activo) => ({
  //       aF_CLAVE: listaExcluidos[activo].aF_CLAVE,

  //     }));

  //     const resultado = await devolverBajasActions(Formulario);
  //     if (resultado) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Devuelto a Listado General",
  //         text: "Se ha enviado correctamente",
  //         background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //         color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //         confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
  //         customClass: {
  //           popup: "custom-border", // Clase personalizada para el borde
  //         }
  //       });

  //       setLoadingRegistro(false);
  //       obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
  //       listaAltasdesdeBajasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
  //       handleBuscar();
  //       setFilasSeleccionadas([]);
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: ":'(",
  //         text: "Hubo un problema al registrar",
  //         background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //         color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //         confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
  //         customClass: {
  //           popup: "custom-border", // Clase personalizada para el borde
  //         }
  //       });
  //       setLoadingRegistro(false);
  //     }

  //   }

  // };

  const handleCerrarModal = () => {
    setMostrarModal(null); //Cierra modal del indice seleccionado
    setExcluidos((prevState) => ({
      ...prevState,
      nresolucion: "",
    }));
  };

  //Abre modal quitar datos seleccionado
  // const handleAbrirModal = (index: number) => {
  //   setMostrarModal(index); //Abre modal del indice seleccionado
  //   setFilasSeleccionadas([]);
  //   setFilaSeleccionada((prev) =>
  //     prev.includes(index.toString())
  //       ? prev.filter((rowIndex) => rowIndex !== index.toString())
  //       : [...prev, index.toString()]
  //   );
  // };

  const handleQuitar = async () => {
    if (validate()) {
      const selectedIndices = filaSeleccionada.map(Number);
      const result = await Swal.fire({
        icon: "info",
        title: "Quitar",
        text: "Confirme para quitar el bien de Bodega de Excluidos",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar y Quitar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      if (result.isConfirmed) {
        setLoadingRegistro(true); //Inicia spin de carga
        // Crear un array de objetos con aF_CLAVE y nombre
        const Formulario = selectedIndices.map((activo) => ({
          aF_CLAVE: listaExcluidos[activo].aF_CLAVE,
          ...Excluidos
        }));
        // console.log(Formulario);
        const resultado = await quitarBodegaExcluidosActions(Formulario);

        if (resultado) {
          Swal.fire({
            icon: "success",
            title: "Quitado correctamente",
            text: "Se han quitado correctamente de Bodega de excluidos",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
          obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
          obtenerListaRematesActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
          setLoadingRegistro(false);//termina de cargar      
          setFilasSeleccionadas([]); //deselecciona las filas     
          setExcluidos((prevState) => ({
            ...prevState,
            nresolucion: "",
          }));
          setMostrarModal(null);
        } else {
          Swal.fire({
            icon: "error",
            title: ":'(",
            text: "Hubo un problema al registrar",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
          setLoadingRegistro(false);//termina de cargar
        }
      }
    }

  };

  const handleBuscar = async () => {
    let resultado = false;
    setLoading(true);
    if (Excluidos.fDesde != "" || Excluidos.fHasta != "") {
      if (validateFechas()) {
        resultado = await obtenerListaExcluidosActions(Excluidos.fDesde, Excluidos.fHasta, Excluidos.nresolucion, Excluidos.af_codigo_generico, objeto.Roles[0].codigoEstablecimiento);
      }
    }
    else {
      resultado = await obtenerListaExcluidosActions("", "", Excluidos.nresolucion, Excluidos.af_codigo_generico, objeto.Roles[0].codigoEstablecimiento);
    }

    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "No se encontraron resultados para la consulta realizada.",
        confirmButtonText: "Ok",
      });
      obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }

  };

  const handleRefrescar = async () => {
    setLoadingRefresh(true); //Finaliza estado de carga
    const resultado = await obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
    if (!resultado) {
      setLoadingRefresh(false);
    } else {
      paginar(1);
      setLoadingRefresh(false);
    }
  };

  const handleLimpiar = () => {
    setExcluidos((prevInventario) => ({
      ...prevInventario,
      fDesde: "",
      fHasta: "",
      nresolucion: "",
      af_codigo_generico: ""
    }));
  };

  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () =>
      listaExcluidos.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaExcluidos, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listaExcluidos)
    ? Math.ceil(listaExcluidos.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  return (
    <Layout>
      <Helmet>
        <title>Bodega de Excluidos</title>
      </Helmet>
      <MenuBajas />
      <form>
        <div className="border-bottom shadow-sm p-4 rounded">
          <h3 className="form-title fw-semibold border-bottom p-1">Bodega de Excluidos</h3>
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
                    value={Excluidos.fDesde}
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
                      value={Excluidos.fHasta}
                      max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                    />
                  </div>
                  {error.fHasta && <div className="invalid-feedback d-block">{error.fHasta}</div>}

                </div>
                <small className="fw-semibold">Filtre los resultados por fecha de Baja.</small>
              </div>
            </Col>

            <Col md={2}>
              <div className="mb-1">
                <label htmlFor="nresolucion" className="fw-semibold">Nº Certificado</label>
                <input
                  aria-label="nresolucion"
                  type="text"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                  name="nresolucion"
                  size={10}
                  placeholder="0"
                  onChange={handleChange}
                  value={Excluidos.nresolucion}
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
                  value={Excluidos.af_codigo_generico}
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
            {filasSeleccionadas.length > 0 ? (
              <>
                {/* Botón Devolver a Listado General*/}
                {/* <Button
                  variant="warning"
                  onClick={handleDevolverSeleccionados}
                  className="m-1 p-2 d-flex align-items-center"
                  disabled={loadingRegistro}
                >
                  {loadingRegistro ? (
                    <>
                      {" Enviando.. "}
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
                      Devolver
                      <Arrow90degLeft className={"flex-shrink-0 h-5 w-5 mx-1 mb-1 text-danger"} aria-hidden="true" />
                    </>
                  )}
                </Button> */}
                {/* Botón Enviar a Remate */}
                <Button
                  variant="primary"
                  onClick={handleRematarSeleccionados}
                  className="m-1 p-2 d-flex align-items-center"
                  disabled={loadingRegistro}
                >
                  {loadingRegistro ? (
                    <>
                      {" Enviando a Remate... "}
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
                      Enviar a Remate
                      <span className="badge bg-light text-dark mx-1 mt-1">
                        {filasSeleccionadas.length}
                      </span>
                    </>
                  )}
                </Button>

              </>
            ) : (
              <strong className="alert alert-dark border m-1 p-2 mx-2">
                No hay filas seleccionadas
              </strong>
            )}

          </div>

          {/* </div> */}

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
                        className="check-danger"
                        type="checkbox"
                        onChange={handleSeleccionaTodos}
                        checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                      />
                    </th>
                    <th scope="col" className="text-nowrap text-center">Codigo Baja</th>
                    <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                    <th scope="col" className="text-nowrap text-center">Nº Certificado</th>
                    <th scope="col" className="text-nowrap text-center">Observaciones</th>
                    <th scope="col" className="text-nowrap text-center">Usuario Modifica</th>
                    <th scope="col" className="text-nowrap text-center">Fecha Baja</th>
                    <th scope="col" className="text-nowrap text-center">Especie</th>
                    <th scope="col" className="text-nowrap text-center">Nº Cuenta</th>
                    <th scope="col" className="text-nowrap text-center">Vida Útil en Años</th>
                    <th scope="col" className="text-nowrap text-center">Vida Útil Restante</th>
                    <th scope="col" className="text-nowrap text-center">Depreciación Acumulada</th>
                    <th scope="col" className="text-nowrap text-center">Valor Inicial</th>
                    <th scope="col" className="text-nowrap text-center">Saldo Valor</th>
                    <th scope="col" className="text-nowrap text-center">Estado</th>
                    {/* <th
                      className="text-nowrap text-center"
                      style={{
                        position: 'sticky',
                        right: 0                     
                      }}
                    >
                      Acción
                    </th> */}
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
                            onChange={() => setSeleccionaFila(indexReal)}
                            checked={filasSeleccionadas.includes(indexReal.toString())}
                          />
                        </td>
                        <td className="text-nowrap">{Lista.bajaS_CORR}</td>
                        <td className="text-nowrap">{Lista.aF_CODIGO_GENERICO}</td>
                        <td className="text-nowrap">{Lista.nresolucion}</td>
                        <td className="text-nowrap">{Lista.observaciones}</td>
                        <td className="text-nowrap">{Lista.useR_MOD}</td>
                        <td className="text-nowrap">{Lista.fechA_BAJA}</td>
                        <td className="text-nowrap">{Lista.especie}</td>
                        <td className="text-nowrap">{Lista.ncuenta}</td>
                        <td className="text-nowrap">{Lista.vutiL_AGNOS}</td>
                        <td className="text-nowrap">{Lista.vutiL_RESTANTE}</td>
                        <td className="text-nowrap">{Lista.deP_ACUMULADA}</td>
                        <td className="text-nowrap">{Lista.iniciaL_VALOR}</td>
                        <td className="text-nowrap">{Lista.saldO_VALOR}</td>
                        <td className="text-nowrap">{Lista.estado}</td>
                        {/* <td style={{
                          position: 'sticky',
                          right: 0                   

                        }}>
                          <Button variant="outline-danger" className="fw-semibold" size="sm"
                            // className="text-nowrap text-center"
                            onClick={() => handleAbrirModal(index)}>
                            Quitar
                          </Button>
                        </td> */}
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
      </form>
      {/* Modal formulario*/}
      {
        elementosActuales.map((lista, index) => (
          <div key={index}>
            <Modal
              show={mostrarModal === index}
              onHide={() => handleCerrarModal()}
              dialogClassName="modal-right" // Clase personalizada
            // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
            // keyboard={false}     // Evita el cierre al presionar la tecla Esc
            >
              <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                <Modal.Title className="fw-semibold">Quitar registro: {lista.nresolucion}</Modal.Title>
              </Modal.Header>
              <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                <form>
                  {/* <div className="d-flex justify-content-end">
                  <Button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
                    Enviar a Bodega
                  </Button>
                </div> */}
                  {/* Boton anular filas seleccionadas */}
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="danger"
                      onClick={handleQuitar}
                      className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                      disabled={loadingRegistro}  // Desactiva el botón mientras carga
                    >
                      {loadingRegistro ? (
                        <>
                          {" Quitando... "}
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"  // Espaciado entre el spinner y el texto
                          />

                        </>
                      ) : (
                        <>
                          Quitar
                        </>
                      )}
                    </Button>

                  </div>
                  <div className="mb-1">
                    <label htmlFor="nresolucion" className="fw-semibold">
                      Ingrese número de resolución
                    </label>
                    <input
                      aria-label="nresolucion"
                      type="text"
                      className={`form-control ${error.nresolucion ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      name="nresolucion"
                      maxLength={100}
                      onChange={handleChange}
                      value={Excluidos.nresolucion}
                    />
                    {error.nresolucion && (
                      <div className="invalid-feedback fw-semibold">{error.nresolucion}</div>
                    )}
                  </div>
                </form>
              </Modal.Body>
            </Modal >
          </div>
        ))
      }
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listaExcluidos: state.obtenerListaExcluidosReducers.listaExcluidos,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  nPaginacion: state.mostrarNPaginacionReducer.nPaginacion,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  excluirBajasActions,
  obtenerListaExcluidosActions,
  obtenerListaRematesActions,
  // listaAltasdesdeBajasActions,
  quitarBodegaExcluidosActions,
  // devolverBajasActions
})(BienesExcluidos);
