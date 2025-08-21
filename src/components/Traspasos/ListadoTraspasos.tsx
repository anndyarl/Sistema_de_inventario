import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Modal, Pagination, Row, Spinner } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Objeto } from "../Navegacion/Profile.tsx";
import { Helmet } from "react-helmet-async";
import { Check2Circle, CircleFill, Clock, Eraser, Eye, Search } from "react-bootstrap-icons";
import MenuTraspasos from "../Menus/MenuTraspasos.tsx";
import { registrarMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/registrarMantenedorDependenciasActions.tsx";
import { listadoTraspasosActions } from "../../redux/actions/Trapasos/listadoTraspasosActions.tsx";
import { recibeTraspasoActions } from "../../redux/actions/Trapasos/recibeTraspasoActions.tsx";
import { listadoTraspasosRecibidosActions } from "../../redux/actions/Trapasos/listadoTraspasosRecibidosActions.tsx";

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
  coD_ESTABL_ORIGEN: number
  seR_NOMBRE_ORIGEN: string;
  deP_NOMBRE_ORIGEN: string;
  coD_ESTABL_DESTINO: number
  seR_NOMBRE_DESTINO: string;
  deP_NOMBRE_DESTINO: string;
  paS_MEMO_REF: string;
  paS_FECHA_MEMO: string;
  paS_OBS: string;
  paS_NOM_ENTREGA: number;
  paS_NOM_RECIBE: number;
  paS_NOM_AUTORIZA: number;
  paS_ESTADO_AF: string;
  establecimientO_ORIGEN: number;
  establecimientO_DESTINO: number;
  usuariO_CREA: number;
  estabL_CORR_ORIGEN: number;
  estabL_CORR: number;
  deP_CORR_ORIGEN: number;
  deP_CORR: number;
  traS_CO_REAL: number;
  paS_DET_CORR: number;
  paS_ESTADO_RECIBE: number;
}

interface GeneralProps {
  listadoTraspasos: listadoTraspasos[];
  listadoTraspasosRecibidos: listadoTraspasos[];
  listadoTraspasosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number, usuario_crea: number) => Promise<boolean>;
  listadoTraspasosRecibidosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number, usuario_crea: number) => Promise<boolean>;
  registrarMantenedorDependenciasActions: (formModal: Record<string, any>) => Promise<boolean>;
  recibeTraspasoActions: (RecibeTraspaso: Record<string, any>) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const ListadoTraspasos: React.FC<GeneralProps> = ({ listadoTraspasosActions, listadoTraspasosRecibidosActions, listadoTraspasos, listadoTraspasosRecibidos, recibeTraspasoActions, token, isDarkMode, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Partial<FechasProps> & {}>({});




  const [esCreador, setEsCreador] = useState(false);
  const [estadoRecibido, setEstadoRecibido] = useState<number>(0);

  //--------------- Lógica de Paginación traspasos recibidos ----------------//
  const [mostrarModalRecibidos, setMostrarModalRecibidos] = useState<number | null>(null);
  const [__, setElementoSeleccionado1] = useState<string[]>([]);
  const [paginaActual1, setPaginaActual1] = useState(1);
  const [Paginacion1, setPaginacion1] = useState({ nPaginacion1: 10 });
  const elementosPorPagina1 = Paginacion1.nPaginacion1;
  const indiceUltimoElemento1 = paginaActual1 * elementosPorPagina1;
  const indicePrimerElemento1 = indiceUltimoElemento1 - elementosPorPagina1;
  const elementosActuales1 = useMemo(() => listadoTraspasosRecibidos.slice(indicePrimerElemento1, indiceUltimoElemento1),
    [listadoTraspasosRecibidos, indicePrimerElemento1, indiceUltimoElemento1]
  );

  const totalPaginas1 = Array.isArray(listadoTraspasosRecibidos)
    ? Math.ceil(listadoTraspasosRecibidos.length / elementosPorPagina1)
    : 0;
  const paginar1 = (numeroPagina: number) => setPaginaActual1(numeroPagina);

  //------------------------------ Fin ------------------------------------//

  //--------------- Lógica de Paginación traspasos enviados ----------------//
  const [mostrarModal, setMostrarModal] = useState<number | null>(null);
  const [_, setElementoSeleccionado] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
  const elementosPorPagina = Paginacion.nPaginacion;
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => listadoTraspasos.slice(indicePrimerElemento, indiceUltimoElemento),
    [listadoTraspasos, indicePrimerElemento, indiceUltimoElemento]
  );
  const totalPaginas = Array.isArray(listadoTraspasos)
    ? Math.ceil(listadoTraspasos.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);
  //------------------------------ Fin ------------------------------------//


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
        const resultado = await listadoTraspasosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial);
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
      if (listadoTraspasosRecibidos.length === 0) {
        setLoading(true);
        const resultado = await listadoTraspasosRecibidosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial);
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
  }, [listadoTraspasosActions, listadoTraspasosRecibidosActions, listadoTraspasos.length, listadoTraspasosRecibidos.length, token]); // Asegúrate de incluir dependencias relevantes

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
    resultado = await listadoTraspasosActions(ListadoTraslado.fDesde, ListadoTraslado.fHasta, ListadoTraslado.af_codigo_generico, ListadoTraslado.tras_corr, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial);
    if (ListadoTraslado.fDesde != "" || ListadoTraslado.fHasta != "") {
      if (validate()) {
        resultado = await listadoTraspasosActions(ListadoTraslado.fDesde, ListadoTraslado.fHasta, ListadoTraslado.af_codigo_generico, ListadoTraslado.tras_corr, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial);
      }
    }
    else {
      resultado = await listadoTraspasosActions("", "", ListadoTraslado.af_codigo_generico, ListadoTraslado.tras_corr, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial);
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
      resultado = await listadoTraspasosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial);
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }

  };

  const handleVerRecibidos = async (index: number, lista: any) => {
    setMostrarModalRecibidos(index);

    // Actualiza lista eliminando el elemento seleccionado
    setElementoSeleccionado1((prev) => prev.filter((_, i) => i !== index));

    // Validar si el usuario actual es el creador
    const esCreadorActual = objeto.IdCredencial === lista.usuariO_CREA;
    setEsCreador(esCreadorActual);

    const estadoRecibido = parseInt(lista.paS_ESTADO_RECIBE);
    setEstadoRecibido(estadoRecibido);
    listadoTraspasosRecibidosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial);
  };


  const handleVer = async (index: number, lista: any) => {
    setMostrarModal(index);

    // Actualiza lista eliminando el elemento seleccionado
    setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));

    // Validar si el usuario actual es el creador
    const esCreadorActual = objeto.IdCredencial === lista.usuariO_CREA;
    setEsCreador(esCreadorActual);

    const estadoRecibido = parseInt(lista.paS_ESTADO_RECIBE);
    setEstadoRecibido(estadoRecibido);
    listadoTraspasosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial);
  };

  const handleCerrarModalRecibidos = (index: number) => {
    setElementoSeleccionado1((prevSeleccionadas) =>
      prevSeleccionadas.filter((fila) => fila !== index.toString())
    );
    setMostrarModalRecibidos(null); //Cierra modal del indice seleccionado       
  };

  const handleCerrarModal = (index: number) => {
    setElementoSeleccionado((prevSeleccionadas) =>
      prevSeleccionadas.filter((fila) => fila !== index.toString())
    );
    setMostrarModal(null); //Cierra modal del indice seleccionado       
  };

  const handleSubmitSI = async (aF_CLAVE: number) => {
    const result = await Swal.fire({
      icon: "info",
      title: "Confirmar recepción",
      text: "Está indicando que el bien ha sido entregado y recibido correctamente en su establecimiento.",
      showCancelButton: true,
      confirmButtonText: "Marcar como recibido",
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      cancelButtonText: "Cerrar",
      confirmButtonColor: `${isDarkMode ? "#6c757d" : "#198754"}`,
      customClass: { popup: "custom-border" }
    });

    if (result.isConfirmed) {
      setLoading(true);

      const RecibeTraspaso = {
        aF_CLAVE,
        pas_estado_recibe: 1
      };

      const resultado = await recibeTraspasoActions(RecibeTraspaso);
      if (resultado) {

        Swal.fire({
          icon: "success",
          title: "Recepción confirmada",
          text: "La recepción del activo en su establecimiento ha sido registrada correctamente.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        setMostrarModal(null);
        setMostrarModalRecibidos(null);
        listadoTraspasosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial);
        listadoTraspasosRecibidosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial);
      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: "Hubo un problema al editar la especie.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
      }
      setLoading(false);
    }
  };

  const handleSubmitNO = async (aF_CLAVE: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Confirmar no recepción",
      text: "Está indicando que el bien ha sido entregado y aún no se encuentra en su establecimiento.",
      showCancelButton: true,
      confirmButtonText: "Marcar como pendiente",
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      cancelButtonText: "Cerrar",
      confirmButtonColor: `${isDarkMode ? "#6c757d" : "#dc3545"}`,
      customClass: { popup: "custom-border" }
    });

    if (result.isConfirmed) {
      setLoading(true);

      const RecibeTraspaso = {
        aF_CLAVE,
        pas_estado_recibe: 2
      };

      const resultado = await recibeTraspasoActions(RecibeTraspaso);
      if (resultado) {
        Swal.fire({
          icon: "warning",
          text: "El activo seleccionado ha sido marcado como pendiente de recepción en su establecimiento. Una vez recibido, podrá actualizar su estado desde la opción 'Modificar estado'.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });

      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: "Hubo un problema al editar la especie.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
      }
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Listado de Traspasos</title>
      </Helmet>
      <MenuTraspasos />
      <div className="table-responsive position-relative z-0 hide-scrollbar" >
        <div style={{ maxHeight: "80vh" }}>
          <div className="border-bottom shadow-sm p-2 rounded">
            <h3 className="form-title fw-semibold border-bottom p-1">Listado de Traspasos</h3>
            <Row>
              {/*Traspasos recibidos */}
              <Col className="border border-1 rounded">
                <h5 className="mb-3 fw-bold text-primary m-1">Recibidos</h5>
                <Row className="border rounded p-2 m-2">
                  <Col>
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

                  <Col>
                    <div className="mb-1">
                      <label htmlFor="af_codigo_generico" className="form-label fw-semibold small">Nº Inventario</label>
                      <input
                        aria-label="af_codigo_generico"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                        name="af_codigo_generico"
                        placeholder="Ej: 1000000008"
                        onChange={handleChange}
                        maxLength={12}
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
                        maxLength={12}
                        value={ListadoTraslado.tras_corr}
                      />
                    </div>
                  </Col>

                  {/* Columna 5: Botones de Acción */}
                  <Col>
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
                    {listadoTraspasosRecibidos.length > 10 && (
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
                    <SkeletonLoader rowCount={elementosPorPagina1} />
                  </>
                ) : (
                  <div className='table-responsive'>
                    <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                      <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                        <tr>
                          {/* <th scope="col"></th> */}
                          <th scope="col" className="text-nowrap">N° Inventario</th>
                          <th scope="col" className="text-nowrap">N° Traspaso</th>
                          <th scope="col" className="text-nowrap">Fecha Traspaso</th>
                          <th scope="col" className="text-nowrap">Nombre Especie</th>
                          <th scope="col" className="text-nowrap">Enviado por</th>
                          <th scope="col" className="text-nowrap sticky-col-right-0 rounded-top">
                            <b>Acción</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {elementosActuales1.map((Lista, index) => {
                          let indexReal = indicePrimerElemento1 + index; // Índice real basado en la página
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
                              <td className="text-nowrap">{Lista.paS_FECHA}</td>
                              <td className="text-nowrap">{Lista.esP_NOMBRE}</td>
                              <td className="text-nowrap">{
                                Lista.usuariO_CREA === 62511 ? 'Andy Riquelme' :
                                  Lista.usuariO_CREA === 18124 ? 'Rodrigo Toledo' :
                                    Lista.usuariO_CREA === 1770 ? 'Jaime Castillo' :
                                      Lista.usuariO_CREA === 66098 ? 'Daniel Rojas' :
                                        Lista.usuariO_CREA === 1234567 || Lista.usuariO_CREA === 18667 ? 'Felipe Almonte' :
                                          Lista.usuariO_CREA === 6405 ? 'Jonathan Vargas' :
                                            Lista.usuariO_CREA === 888 ? 'Gabriela Farias' :
                                              Lista.usuariO_CREA === 66099 ? 'Katherine Reyes' : Lista.usuariO_CREA
                              }
                              </td>
                              <td className="text-nowrap sticky-col-right-0 rounded">
                                <Button
                                  variant="outline-primary"
                                  className="fw-semibold  ps-3 pe-3"
                                  onClick={() => handleVerRecibidos(index, Lista)}
                                >
                                  Ver
                                  <Eye className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                </Button>
                              </td>
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
                      onClick={() => paginar1(1)}
                      disabled={paginaActual1 === 1}

                    />
                    <Pagination.Prev
                      onClick={() => paginar1(paginaActual1 - 1)}
                      disabled={paginaActual1 === 1}
                    />

                    {Array.from({ length: totalPaginas1 }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === paginaActual1}
                        onClick={() => paginar1(i + 1)}

                      >
                        {i + 1} {/* adentro de aqui esta page-link */}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => paginar1(paginaActual1 + 1)}
                      disabled={paginaActual1 === totalPaginas1}

                    />
                    <Pagination.Last
                      onClick={() => paginar1(totalPaginas1)}
                      disabled={paginaActual1 === totalPaginas1}

                    />
                  </Pagination>
                </div>
              </Col>
              {/*Traspasos enviados */}
              <Col className="border border-1 rounded">
                <h5 className="mb-3 fw-bold text-warning m-1">Enviados</h5>
                <Row className="border rounded p-2 m-2">
                  <Col>
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

                  <Col>
                    <div className="mb-1">
                      <label htmlFor="af_codigo_generico" className="form-label fw-semibold small">Nº Inventario</label>
                      <input
                        aria-label="af_codigo_generico"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                        name="af_codigo_generico"
                        placeholder="Ej: 1000000008"
                        onChange={handleChange}
                        maxLength={12}
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
                        maxLength={12}
                        value={ListadoTraslado.tras_corr}
                      />
                    </div>
                  </Col>

                  {/* Columna 5: Botones de Acción */}
                  <Col>
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
                          <th scope="col" className="text-nowrap">N° Inventario</th>
                          <th scope="col" className="text-nowrap">N° Traspaso</th>
                          <th scope="col" className="text-nowrap">Fecha Traspaso</th>
                          <th scope="col" className="text-nowrap">Nombre Especie</th>
                          <th scope="col" className="text-nowrap sticky-col-right-0 rounded-top">
                            <b>Acción</b>
                          </th>
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
                              <td className="text-nowrap">{Lista.paS_FECHA}</td>
                              <td className="text-nowrap">{Lista.esP_NOMBRE}</td>
                              <td className="text-nowrap sticky-col-right-0 rounded">
                                <Button
                                  variant="outline-primary"
                                  className="fw-semibold  ps-3 pe-3"
                                  onClick={() => handleVer(index, Lista)}
                                >
                                  Ver
                                  <Eye className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                                </Button>
                              </td>
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
              </Col>
            </Row>
          </div>
        </div>
      </div>
      {/* Detalle de traspasos recibidos */}
      {elementosActuales1.map((fila, index) => (
        <Modal
          key={index}
          show={mostrarModalRecibidos === index}
          onHide={() => handleCerrarModalRecibidos(index)}
          size="xl"
          centered
        >
          <Modal.Header closeButton className={isDarkMode ? "darkModePrincipal" : ""}>
            <Modal.Title className="fw-semibold">Detalle del Traspaso</Modal.Title>
          </Modal.Header>

          <Modal.Body className={isDarkMode ? "darkModePrincipal" : ""}>
            <Row className="g-3">
              {/* Columna izquierda */}
              <Col md={4}>
                <div className="mb-3">
                  <label className="fw-semibold">
                    Nº Inventario
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.aF_CODIGO_GENERICO || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold ">
                    Establecimiento Origen
                    <CircleFill className="ms-1 text-warning" width={12} height={12} aria-hidden="true" />
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.establecimientO_ORIGEN || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">
                    Servicio/Dependencia Origen
                    <CircleFill className="ms-1 text-warning" width={12} height={12} aria-hidden="true" />
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{(fila.seR_NOMBRE_ORIGEN + " " + fila.deP_NOMBRE_ORIGEN) || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Fecha Traspaso</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.paS_FECHA || "No definida"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">N° Memo de Referencia</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.paS_MEMO_REF || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Especie</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.esP_NOMBRE || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Estado</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.paS_ESTADO_AF || "No definida"}</div>
                </div>

              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <label className="fw-semibold">
                    Nº Traspaso
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.n_TRASPASO || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">
                    Establecimiento Destino
                    <CircleFill className="ms-1 text-success" width={12} height={12} aria-hidden="true" />
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.establecimientO_DESTINO || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">
                    Servicio/Dependencia Destino
                    <CircleFill className="ms-1 text-success" width={12} height={12} aria-hidden="true" />
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{(fila.seR_NOMBRE_DESTINO + " " + fila.deP_NOMBRE_DESTINO) || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Fecha del Memo</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.paS_FECHA_MEMO || "No definida"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Codigo Especie</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.esP_CODIGO || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Observaciones</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`} style={{ whiteSpace: "pre-wrap", minHeight: "100px" }}>{fila.paS_OBS || "Sin observaciones"}</div>
                </div>
              </Col>
              {/* Columna derecha */}
              <Col md={4}>
                <div className="border rounded-3 p-4 mt-4 ">
                  <h5 className="fw-semibold mb-4">Datos de Recepción</h5>

                  <div className="mb-3">
                    <label className="fw-semibold">Entregado Por</label>
                    <p>{fila.paS_NOM_ENTREGA || "Sin Información"}</p>
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold">Recibido Por</label>
                    <p>{fila.paS_NOM_RECIBE || "Sin Información"}</p>
                  </div>

                  <div className="mb-1">
                    <label className="fw-semibold">Jefe que Autoriza</label>
                    <p>{fila.paS_NOM_AUTORIZA || "Sin Información"}</p>
                  </div>
                </div>
                {/* Validación Traspaso recibido */}
                <div className="border rounded-3 p-4 mt-4 text-center">
                  {!esCreador && (
                    <>
                      {estadoRecibido === 0 ? (
                        <>
                          <h5 className="fw-semibold mb-4">
                            ¿Ha recibido el bien en su establecimiento?
                          </h5>
                          <div className="d-flex">
                            <Button
                              variant="success"
                              className="w-100 mx-1"
                              onClick={() => handleSubmitSI(fila.aF_CLAVE)}
                            >
                              Sí, recibido
                            </Button>

                            <Button
                              variant="danger"
                              className="w-100 mx-1"
                              onClick={() => handleSubmitNO(fila.aF_CLAVE)}
                            >
                              No, pendiente
                            </Button>

                          </div>
                        </>
                      ) : estadoRecibido === 1 ? (
                        <>
                          <h5 className="fw-semibold mb-4">
                            Estado solicitud
                          </h5>
                          <div className="alert alert-success d-flex align-items-center  justify-content-center m-2 px-4 py-2 w-100 fs-09em rounded shadow-sm" role="alert">
                            <Check2Circle className="me-2 flex-shrink-0" aria-hidden="true" />
                            <span className="fw-semibold ">Marcado como recibido</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <h5 className="fw-semibold mb-4">
                            Estado solicitud
                          </h5>
                          <div className="alert alert-danger d-flex align-items-center  justify-content-center m-2 px-4 py-2 w-100 fs-09em rounded shadow-sm" role="alert">
                            <Clock className="me-2 flex-shrink-0" aria-hidden="true" />
                            <span className="fw-semibold ">Marcado como pendiente</span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Modal.Body>
        </Modal >
      ))
      }
      {/* Detalle de traspasos enviados */}
      {elementosActuales.map((fila, index) => (
        <Modal
          key={index}
          show={mostrarModal === index}
          onHide={() => handleCerrarModal(index)}
          size="xl"
          centered
        >
          <Modal.Header closeButton className={isDarkMode ? "darkModePrincipal" : ""}>
            <Modal.Title className="fw-semibold">Detalle del Traspaso</Modal.Title>
          </Modal.Header>

          <Modal.Body className={isDarkMode ? "darkModePrincipal" : ""}>
            <Row className="g-3">
              {/* Columna izquierda */}
              <Col md={4}>
                <div className="mb-3">
                  <label className="fw-semibold">
                    Nº Inventario
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.aF_CODIGO_GENERICO || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold ">
                    Establecimiento Origen
                    <CircleFill className="ms-1 text-warning" width={12} height={12} aria-hidden="true" />
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.establecimientO_ORIGEN || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">
                    Servicio/Dependencia Origen
                    <CircleFill className="ms-1 text-warning" width={12} height={12} aria-hidden="true" />
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{(fila.seR_NOMBRE_ORIGEN + " " + fila.deP_NOMBRE_ORIGEN) || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Fecha Traspaso</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.paS_FECHA || "No definida"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">N° Memo de Referencia</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.paS_MEMO_REF || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Especie</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.esP_NOMBRE || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Estado</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.paS_ESTADO_AF || "No definida"}</div>
                </div>

              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <label className="fw-semibold">
                    Nº Traspaso
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.n_TRASPASO || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">
                    Establecimiento Destino
                    <CircleFill className="ms-1 text-success" width={12} height={12} aria-hidden="true" />
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.establecimientO_DESTINO || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">
                    Servicio/Dependencia Destino
                    <CircleFill className="ms-1 text-success" width={12} height={12} aria-hidden="true" />
                  </label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{(fila.seR_NOMBRE_DESTINO + " " + fila.deP_NOMBRE_DESTINO) || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Fecha del Memo</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.paS_FECHA_MEMO || "No definida"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Codigo Especie</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}>{fila.esP_CODIGO || "Sin Información"}</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Observaciones</label>
                  <div className={`rounded border px-2 py-1 small fw-medium ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`} style={{ whiteSpace: "pre-wrap", minHeight: "100px" }}>{fila.paS_OBS || "Sin observaciones"}</div>
                </div>
              </Col>
              {/* Columna derecha */}
              <Col md={4}>
                <div className="border rounded-3 p-4 mt-4 ">
                  <h5 className="fw-semibold mb-4">Datos de Recepción</h5>

                  <div className="mb-3">
                    <label className="fw-semibold">Entregado Por</label>
                    <p>{fila.paS_NOM_ENTREGA || "Sin Información"}</p>
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold">Recibido Por</label>
                    <p>{fila.paS_NOM_RECIBE || "Sin Información"}</p>
                  </div>

                  <div className="mb-1">
                    <label className="fw-semibold">Jefe que Autoriza</label>
                    <p>{fila.paS_NOM_AUTORIZA || "Sin Información"}</p>
                  </div>
                </div>
                {/* Validación Traspaso recibido */}
                <div className="border rounded-3 p-4 mt-4 text-center">
                  {esCreador && (
                    <>
                      <h5 className="fw-semibold mb-4">
                        Estado solicitud
                      </h5>
                      {estadoRecibido === 0 ? (
                        <>
                          <div className="alert alert-warning d-flex align-items-center  justify-content-center m-2 px-4 py-2 w-100 fs-09em rounded shadow-sm" role="alert">
                            <Clock className="me-2 flex-shrink-0" aria-hidden="true" />
                            <span className="fw-semibold ">Esperando Validación</span>
                          </div>
                        </>
                      ) : estadoRecibido === 1 ? (
                        <>
                          <div className="alert alert-success d-flex align-items-center  justify-content-center m-2 px-4 py-2 w-100 fs-09em rounded shadow-sm" role="alert">
                            <Check2Circle className="me-2 flex-shrink-0" aria-hidden="true" />
                            <span className="fw-semibold ">Marcado como recibido</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="alert alert-danger d-flex align-items-center  justify-content-center m-2 px-4 py-2 w-100 fs-09em rounded shadow-sm" role="alert">
                            <Clock className="me-2 flex-shrink-0" aria-hidden="true" />
                            <span className="fw-semibold ">Marcado como pendiente</span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

              </Col>
            </Row>
          </Modal.Body>
        </Modal >
      ))
      }
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listadoTraspasos: state.listadoTraspasosReducers.listadoTraspasos,
  listadoTraspasosRecibidos: state.listadoTraspasosRecibidosReducers.listadoTraspasosRecibidos,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  comboServicio: state.comboServicioReducer.comboServicio,
  objeto: state.validaApiLoginReducers,
});

export default connect(mapStateToProps, {
  listadoTraspasosActions,
  listadoTraspasosRecibidosActions,
  registrarMantenedorDependenciasActions,
  recibeTraspasoActions
})(ListadoTraspasos);

