import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Pagination, Row, Spinner } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { registrarMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/registrarMantenedorDependenciasActions.tsx";
import { Objeto } from "../Navegacion/Profile.tsx";
import { Helmet } from "react-helmet-async";
import MenuTraslados from "../Menus/MenuTraslados.tsx";
import { listadoTrasladosActions } from "../../redux/actions/Traslados/listadoTrasladosActions.tsx";
import { Eraser, Search } from "react-bootstrap-icons";

interface FechasProps {
  fDesde: string;
  fHasta: string;
}
export interface listadoTraslados {
  aF_CODIGO_GENERICO: string,
  usuariO_MOD: string,
  usuariO_CREA: string,
  traS_OBS: string,
  traS_NOM_RECIBE: string,
  traS_NOM_ENTREGA: string,
  traS_NOM_AUTORIZA: string,
  traS_MEMO_REF: string,
  traS_FECHA_MEMO: number,
  traS_FECHA: string,
  traS_ESTADO_AF: string,
  traS_DET_CORR: number,
  traS_CORR: number,
  traS_CO_REAL: number,
  n_TRASLADO: number,
  iP_MOD: string,
  iP_CREA: string,
  f_MOD: number,
  f_CREA: number,
  estaD_D: number,
  deP_CORR_ORIGEN: number,
  deP_CORR: number,
  aF_CLAVE: number,
  seR_NOMBRE_ORIGEN: string,
  deP_NOMBRE_ORIGEN: string;
  seR_NOMBRE_DESTINO: string,
  deP_NOMBRE_DESTINO: string;
}

interface GeneralProps {
  listadoTraslados: listadoTraslados[];
  listadoTrasladosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number) => Promise<boolean>;
  registrarMantenedorDependenciasActions: (formModal: Record<string, any>) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
  nPaginacion: number; //número de paginas establecido desde preferencias
}

const ListadoTraslados: React.FC<GeneralProps> = ({ listadoTrasladosActions, listadoTraslados, token, isDarkMode, nPaginacion }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Partial<FechasProps> & {}>({});
  // const [_, setFilaSeleccionada] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = nPaginacion;
  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => listadoTraslados.slice(indicePrimerElemento, indiceUltimoElemento),
    [listadoTraslados, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listadoTraslados)
    ? Math.ceil(listadoTraslados.length / elementosPorPagina)
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


  //Se lista automaticamente apenas entra al componente
  const listadoTrasladosAuto = async () => {
    if (token) {
      if (listadoTraslados.length === 0) {
        setLoading(true);
        const resultado = await listadoTrasladosActions("", "", "", 0);
        if (resultado) {
          setLoading(false);
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Error en la solicitud. Por favor, intente nuevamente.`,
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
        }
      }
    }
  };

  useEffect(() => {
    listadoTrasladosAuto()
  }, [listadoTrasladosActions, token, listadoTraslados.length]); // Asegúrate de incluir dependencias relevantes

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
    const camposNumericos = ["tras_corr"];
    const newValue: string | number = camposNumericos.includes(name)
      ? parseFloat(value) || 0
      : value;

    // Actualizar estado
    setListadoTraslado((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

  };

  const handleBuscar = async () => {
    let resultado = false;
    setLoading(true);
    resultado = await listadoTrasladosActions(ListadoTraslado.fDesde, ListadoTraslado.fHasta, ListadoTraslado.af_codigo_generico, ListadoTraslado.tras_corr);
    if (ListadoTraslado.fDesde != "" || ListadoTraslado.fHasta != "") {
      if (validate()) {
        resultado = await listadoTrasladosActions(ListadoTraslado.fDesde, ListadoTraslado.fHasta, ListadoTraslado.af_codigo_generico, ListadoTraslado.tras_corr);
      }
    }
    else {
      resultado = await listadoTrasladosActions("", "", ListadoTraslado.af_codigo_generico, ListadoTraslado.tras_corr);
    }

    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "El Nº de Inventario consultado no se encuentra en este listado.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      resultado = await listadoTrasladosActions("", "", "", 0);
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
  //         listadoTrasladosActions();
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
      <MenuTraslados />
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">Listado de Traslados</h3>
        <Row className="border rounded p-2 m-2">
          <Col md={2}>
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
                    value={ListadoTraslado.fDesde}
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
                  />
                </div>
                {error.fHasta && <div className="invalid-feedback d-block">{error.fHasta}</div>}

              </div>
              <small className="fw-semibold">Filtre los resultados por fecha de Traslado.</small>
            </div>
          </Col>

          <Col md={2}>
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
                  value={ListadoTraslado.af_codigo_generico}
                />
              </div>
              <div className="mb-1">
                <label htmlFor="tras_corr" className="fw-semibold">Nº Traslado</label>
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
            </div>
          </Col>

          <Col md={5}>
            <div className="mb-1 mt-4">
              <Button onClick={handleBuscar}
                variant={`${isDarkMode ? "secondary" : "primary"}`}
                className="mx-1 mb-1">
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
              <Button onClick={handleLimpiar}
                variant={`${isDarkMode ? "secondary" : "primary"}`}
                className="mx-1 mb-1">
                Limpiar
                <Eraser className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
              </Button>
            </div>
          </Col>
        </Row>
        {loading ? (
          <>
            <SkeletonLoader rowCount={elementosPorPagina} />
          </>
        ) : (
          <div className='table-responsive'>
            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
              <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                <tr>
                  {/* <th scope="col"></th> */}
                  <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                  <th scope="col" className="text-nowrap text-center">N° Traslado</th>
                  {/* <th scope="col" className="text-nowrap text-center">Codigo Traslado</th> */}
                  <th scope="col" className="text-nowrap text-center">Fecha Traslado</th>
                  {/* <th scope="col" className="text-nowrap text-center">Servicio</th> */}
                  <th scope="col" className="text-nowrap text-center">Ubicación de Origen</th>
                  <th scope="col" className="text-nowrap text-center">Ubicación de Destino</th>
                  <th scope="col" className="text-nowrap text-center">Memo de Referencia</th>
                  <th scope="col" className="text-nowrap text-center">Fecha Memo</th>
                  <th scope="col" className="text-nowrap text-center">Observaciones</th>
                  <th scope="col" className="text-nowrap text-center">Nombre Entrega</th>
                  <th scope="col" className="text-nowrap text-center">Nombre Recibe</th>
                  <th scope="col" className="text-nowrap text-center">Nombre Autoriza</th>
                  <th scope="col" className="text-nowrap text-center">Estado</th>
                  <th scope="col" className="text-nowrap text-center">Detalle de Traslado</th>
                  {/* <th scope="col" className="text-nowrap text-center">Usuario Crea</th> */}
                  {/* <th scope="col" className="text-nowrap text-center">Fecha Creación</th> */}
                  {/* <th scope="col" className="text-nowrap text-center">IP Creación</th> */}
                  {/* <th scope="col" className="text-nowrap text-center">Usuario Modifica</th>
                  <th scope="col" className="text-nowrap text-center">Fecha Modificación</th> */}
                  {/* <th scope="col" className="text-nowrap text-center">IP Modificación</th> */}
                  <th scope="col" className="text-nowrap text-center">Tipo Traslado</th>

                  {/* <th scope="col" className="text-nowrap text-center">Estado</th> */}
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
                      {/* <td className="text-nowrap">{Lista.traS_CORR}</td> */}
                      <td className="text-nowrap">{Lista.n_TRASLADO}</td>
                      <td className="text-nowrap">{Lista.traS_FECHA}</td>
                      {/* <td className="text-nowrap">{Lista.seR_NOMBRE}</td> */}
                      <td className="text-nowrap">{Lista.seR_NOMBRE_ORIGEN + " " + Lista.deP_NOMBRE_ORIGEN}</td>
                      <td className="text-nowrap">{Lista.seR_NOMBRE_DESTINO + " " + Lista.deP_NOMBRE_DESTINO}</td>
                      <td className="text-nowrap">{Lista.traS_MEMO_REF}</td>
                      <td className="text-nowrap">{Lista.traS_FECHA_MEMO}</td>
                      <td className="text-nowrap">{parseInt(Lista.traS_OBS) == 0 ? "N/a" : Lista.traS_OBS}</td>
                      <td className="text-nowrap">{Lista.traS_NOM_ENTREGA}</td>
                      <td className="text-nowrap">{Lista.traS_NOM_RECIBE}</td>
                      <td className="text-nowrap">{Lista.traS_NOM_AUTORIZA}</td>
                      <td className="text-nowrap">{Lista.traS_ESTADO_AF}</td>
                      {/* <td className="text-nowrap">{Lista.deP_CORR_ORIGEN}</td> */}
                      <td className="text-nowrap">{Lista.traS_DET_CORR}</td>
                      {/* <td className="text-nowrap">{Lista.usuariO_CREA}</td> */}
                      {/* <td className="text-nowrap">{Lista.f_CREA}</td> */}
                      {/* <td className="text-nowrap">{Lista.iP_CREA}</td> */}
                      {/* <td className="text-nowrap">{Lista.usuariO_MOD}</td>
                      <td className="text-nowrap">{Lista.f_MOD}</td> */}
                      {/* <td className="text-nowrap">{Lista.iP_MOD}</td> */}

                      <td className="text-nowrap">{Lista.traS_CO_REAL == 1 ? "En Comodato" : "Traspaso Real"}</td>
                      {/* <td className="text-nowrap">{Lista.estaD_D}</td> */}

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {/* Paginador */}
        <div className="paginador-container">
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
  listadoTraslados: state.listadoTrasladosReducers.listadoTraslados,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  comboServicio: state.comboServicioReducer.comboServicio,
  objeto: state.validaApiLoginReducers,
  nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
  listadoTrasladosActions,
  registrarMantenedorDependenciasActions,
})(ListadoTraslados);
