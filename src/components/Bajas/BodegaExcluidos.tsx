import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner, Form } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import { Search } from "react-bootstrap-icons";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuBajas from "../Menus/MenuBajas.tsx";

import { excluirBajasActions } from "../../redux/actions/Bajas/excluirBajasActions.tsx";
import { obtenerListaExcluidosActions } from "../../redux/actions/Bajas/obtenerListaExcluidosActions.tsx";
import { Helmet } from "react-helmet-async";

const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};

export interface ListaExcluidos {
  aF_CLAVE: string;
  bajaS_CORR: string;
  especie: string;
  vutiL_RESTANTE: number;
  vutiL_AGNOS: number;
  nresolucion: string;
  observaciones: string;
  deP_ACUMULADA: number;
  ncuenta: string;
  estado: number;
  fechA_REMATES: string;
}


interface DatosBajas {
  listaExcluidos: ListaExcluidos[];
  obtenerListaExcluidosActions: (aF_CLAVE: string) => Promise<boolean>;
  excluirBajasActions: (listaExcluidos: Record<string, any>[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
}

const BienesExcluidos: React.FC<DatosBajas> = ({ listaExcluidos, obtenerListaExcluidosActions, excluirBajasActions, token, isDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 12;

  const [Bajas, setBajas] = useState({
    aF_CLAVE: "",
  });

  //Se lista automaticamente apenas entra al componente
  const listaExcluidosAuto = async () => {
    if (token) {
      if (listaExcluidos.length === 0) {
        setLoading(true);
        const resultado = await obtenerListaExcluidosActions("");
        if (resultado) {
          setLoading(false);
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Error en la solicitud. Por favor, intentne nuevamente.`,
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
        }
      }
    }
  };

  useEffect(() => {
    listaExcluidosAuto()
  }, [obtenerListaExcluidosActions, token, listaExcluidos.length]); // Asegúrate de incluir dependencias relevantes

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setBajas((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const setSeleccionaFilas = (index: number) => {
    setFilasSeleccionadas((prev) =>
      prev.includes(index.toString())
        ? prev.filter((rowIndex) => rowIndex !== index.toString())
        : [...prev, index.toString()]
    );
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


  const handleBuscarRemates = async () => {
    let resultado = false;
    setLoading(true);
    resultado = await obtenerListaExcluidosActions(Bajas.aF_CLAVE);


    if (!resultado) {
      Swal.fire({
        icon: "error",
        title: ":'(",
        text: "No se encontraron resultados, inténte otro registro.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      setLoading(false); //Finaliza estado de carga
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
      confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      customClass: {
        popup: "custom-border", // Clase personalizada para el borde
      }
    });

    if (result.isConfirmed) {
      setLoadingRegistro(true);
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
        fechA_REMATES: listaExcluidos[activo].fechA_REMATES,

      }));
      const resultado = await excluirBajasActions(Formulario);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Enviado a Bienes Rematados",
          text: "Se ha enviado correctamente",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });

        setLoadingRegistro(false);
        obtenerListaExcluidosActions("");
        setFilasSeleccionadas([]);
      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: "Hubo un problema al registrar",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        setLoadingRegistro(false);
      }
    }

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
          <Row>
            <Col md={3}>
              <div className="mb-1">
                <label htmlFor="aF_CLAVE" className="fw-semibold">Nº Inventario</label>
                <input
                  aria-label="aF_CLAVE"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                  name="aF_CLAVE"
                  onChange={handleChange}
                  value={Bajas.aF_CLAVE}
                />
              </div>
            </Col>
            <Col md={5}>
              <div className="mb-1 mt-4">
                <Button onClick={handleBuscarRemates} variant={`${isDarkMode ? "secondary" : "primary"}`} className="ms-1">
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    <Search className={classNames("flex-shrink-0", "h-5 w-5")} aria-hidden="true" />
                  )}
                </Button>
              </div>
            </Col>
          </Row>
          {/* Boton filas seleccionadas */}
          <div className="d-flex justify-content-end">
            {filasSeleccionadas.length > 0 ? (
              <Button
                variant="warning"
                onClick={handleRematarSeleccionados}
                className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                disabled={loadingRegistro}  // Desactiva el botón mientras carga
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
                      className="me-2"  // Espaciado entre el spinner y el texto
                    />

                  </>
                ) : (
                  <>
                    Enviar a Remate
                    <span className="badge bg-light text-dark mx-2">
                      {filasSeleccionadas.length}
                    </span>
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
          {loading ? (
            <>
              <SkeletonLoader rowCount={elementosPorPagina} />
            </>
          ) : (
            <div className='table-responsive'>
              <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                  <tr>
                    <th >
                      <Form.Check
                        className="check-danger"
                        type="checkbox"
                        onChange={handleSeleccionaTodos}
                        checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                      />
                    </th>
                    <th scope="col" className="text-nowrap text-center">Nª Inventario</th>
                    <th scope="col" className="text-nowrap text-center">Codigo</th>
                    <th scope="col" className="text-nowrap text-center">Especie</th>
                    <th scope="col" className="text-nowrap text-center">Vida UtiL Restante</th>
                    <th scope="col" className="text-nowrap text-center">Vida Util en Años</th>
                    <th scope="col" className="text-nowrap text-center">Nº Resolucion</th>
                    <th scope="col" className="text-nowrap text-center">Observaciones</th>
                    <th scope="col" className="text-nowrap text-center">Depreciacion Acumulada</th>
                    <th scope="col" className="text-nowrap text-center">Nº Cuenta</th>
                    <th scope="col" className="text-nowrap text-center">Estado</th>
                    <th scope="col" className="text-nowrap text-center">Fecha de Remate</th>
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
                            onChange={() => setSeleccionaFilas(indexReal)}
                            checked={filasSeleccionadas.includes(indexReal.toString())}
                          />
                        </td>
                        <td className="text-nowrap text-center">{Lista.aF_CLAVE}</td>
                        <td className="text-nowrap text-center">{Lista.bajaS_CORR}</td>
                        <td className="text-nowrap text-center">{Lista.especie}</td>
                        <td className="text-nowrap text-center">{Lista.vutiL_RESTANTE}</td>
                        <td className="text-nowrap text-center">{Lista.vutiL_AGNOS}</td>
                        <td className="text-nowrap text-center">{Lista.nresolucion}</td>
                        <td className="text-nowrap text-center">{Lista.observaciones}</td>
                        <td className="text-nowrap text-center">{Lista.deP_ACUMULADA}</td>
                        <td className="text-nowrap text-center">{Lista.ncuenta}</td>
                        <td className="text-nowrap text-center">{Lista.estado}</td>
                        <td className="text-nowrap text-center">{Lista.fechA_REMATES}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}


          {/* Paginador */}
          <div className="paginador-container">
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
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listaExcluidos: state.obtenerListaExcluidosReducers.listaExcluidos,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  excluirBajasActions,
  obtenerListaExcluidosActions,
})(BienesExcluidos);
