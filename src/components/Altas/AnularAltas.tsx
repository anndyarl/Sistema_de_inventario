import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner, Form } from "react-bootstrap";
import { RootState } from "../../store";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { Search } from "react-bootstrap-icons";
import { listaAltasActions } from "../../redux/actions/Altas/AnularAltas/listaAltasActions";

import { obtenerListaAltasActions } from "../../redux/actions/Altas/AnularAltas/obtenerListaAltasActions";
import { anularAltasActions } from "../../redux/actions/Altas/AnularAltas/anularAltasActions";
import MenuAltas from "../Menus/MenuAltas";
import { obtenerAltasPorCorrActions } from "../../redux/actions/Altas/AnularAltas/obtenerAltasPorCorrActions";
import SkeletonLoader from "../Utils/SkeletonLoader";
import { Helmet } from "react-helmet-async";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
interface FechasProps {
  fechaInicio: string;
  fechaTermino: string;
}
export interface ListaAltas {
  aF_CLAVE: number,
  ninv: string,
  serv: string,
  dep: string,
  esp: string,
  ncuenta: string,
  marca: string,
  modelo: string,
  serie: string,
  precio: string,
  mrecepcion: string
}

interface DatosAltas {
  listaAltas: ListaAltas[];
  listaAltasActions: () => Promise<boolean>;
  obtenerListaAltasActions: (FechaInicio: string, FechaTermino: string) => Promise<boolean>;
  obtenerAltasPorCorrActions: (altasCorr: number) => Promise<boolean>;
  anularAltasActions: (activos: { aF_CLAVE: number }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;

}

const AnularAltas: React.FC<DatosAltas> = ({ listaAltas, listaAltasActions, obtenerListaAltasActions, obtenerAltasPorCorrActions, anularAltasActions, token, isDarkMode }) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});


  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  // const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaAltas[]>([]);
  const [loadingAnular, setLoadingAnular] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 12;

  const [Inventario, setInventario] = useState({
    aF_CLAVE: 0,
    fechaInicio: "",
    fechaTermino: "",
  });
  const listaAltasAuto = async () => {
    if (token) {
      if (listaAltas.length === 0) {
        setLoading(true);
        const resultado = await listaAltasActions();
        if (resultado) {
          setLoading(false);
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Error en la solicitud. Por favor, recargue nuevamente la página.`,
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
    listaAltasAuto();
  }, [listaAltasActions, token, listaAltas.length]); // Asegúrate de incluir dependencias relevantes

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.fechaInicio) tempErrors.fechaInicio = "La Fecha de Inicio es obligatoria.";
    if (!Inventario.fechaTermino) tempErrors.fechaTermino = "La Fecha de Término es obligatoria.";
    if (Inventario.fechaInicio > Inventario.fechaTermino) tempErrors.fechaInicio = "La fecha de inicio es mayor a la fecha de término";
    // if (!Inventario.nInventario) tempErrors.nInventario = "La Fecha de Inicio es obligatoria.";


    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = [
      "aF_CLAVE"

    ].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;

    setInventario((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    setInventario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBuscarAltas = async () => {
    let resultado = false;

    setLoading(true);
    if (Inventario.aF_CLAVE != 0) {
      resultado = await obtenerAltasPorCorrActions(Inventario.aF_CLAVE);
    }
    if (Inventario.fechaInicio != "" && Inventario.fechaTermino != "") {
      if (validate()) {
        resultado = await obtenerListaAltasActions(Inventario.fechaInicio, Inventario.fechaTermino);
      }
    }
    setInventario((prevState) => ({
      ...prevState,
      aF_CLAVE: 0,
      fechaInicio: "",
      fechaTermino: ""
    }));
    setError({});
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

  const setSeleccionaFilas = (index: number) => {
    setFilasSeleccionadas((prev) =>
      prev.includes(index.toString())
        ? prev.filter((rowIndex) => rowIndex !== index.toString())
        : [...prev, index.toString()]
    );
    // console.log("indices seleccionmados", index);
  };

  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFilasSeleccionadas(
        elementosActuales.map((_, index) =>
          (indicePrimerElemento + index).toString()
        )
      );
      // console.log("filas Seleccionadas ", filasSeleccionadas);
    } else {
      setFilasSeleccionadas([]);
    }
  };

  const handleAnularSeleccionados = async () => {
    const selectedIndices = filasSeleccionadas.map(Number);
    const activosSeleccionados = selectedIndices.map((index) => {
      return {
        aF_CLAVE: listaAltas[index].aF_CLAVE
      };

    });
    const result = await Swal.fire({
      icon: "info",
      title: "Anular Altas",
      text: `Confirme para anular las altas seleccionadas`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar y Anular",
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      customClass: {
        popup: "custom-border", // Clase personalizada para el borde
      }
    });

    // selectedIndices.map(async (index) => {

    if (result.isConfirmed) {
      setLoadingAnular(true);
      // const elemento = listaAltas[index].aF_CLAVE;
      // console.log("despues del confirm elemento", elemento);

      // const clavesSeleccionadas: number[] = selectedIndices.map((index) => listaAltas[index].aF_CLAVE);      
      // console.log("Claves seleccionadas para registrar:", clavesSeleccionadas);
      // Crear un array de objetos con aF_CLAVE y nombre


      // console.log("Activos seleccionados para registrar:", activosSeleccionados);

      const resultado = await anularAltasActions(activosSeleccionados);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Altas anuladas",
          text: `Se han anulado correctamente las altas seleccionadas`,
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });

        setLoadingAnular(false);
        listaAltasActions();
        setFilasSeleccionadas([]);
      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: `Hubo un problema al anular las Altas`,
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        setLoadingAnular(false);
      }

    }
    // })
  };
  // const handleAnular = async (index: number, aF_CLAVE: number) => {
  //   setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));

  //   const result = await Swal.fire({
  //     icon: "warning",
  //     title: "Anular Registro",
  //     text: `Confirma anular el registro Nº ${aF_CLAVE}`,
  //     showDenyButton: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Confirmar y Anular",
  //   });

  //   if (result.isConfirmed) {
  //     const resultado = await anularAltasActions(aF_CLAVE);
  //     if (resultado) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Registro anulado",
  //         text: `Se ha anulado el registro Nº ${aF_CLAVE}.`,
  //       });
  //       listaAltasAuto();
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: ":'(",
  //         text: `Hubo un problema al anular el registro ${aF_CLAVE}.`,
  //       });
  //     }
  //   }
  // };

  // const handleLimpiar = () => {
  //   setInventario((prevInventario) => ({
  //     ...prevInventario,
  //     fechaInicio: "",
  //     fechaTermino: "",
  //   }));
  // };
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

  return (
    <Layout>
      <Helmet>
        <title>Anular Altas</title>
      </Helmet>
      <MenuAltas />
      <form>
        <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">Anular Altas</h3>
          <Row>
            <Col md={3}>
              <div className="mb-1">
                <label htmlFor="fechaInicio" className="fw-semibold">Fecha Inicio</label>
                <input
                  aria-label="fechaInicio"
                  type="date"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaInicio ? "is-invalid" : ""}`}
                  name="fechaInicio"
                  onChange={handleChange}
                  value={Inventario.fechaInicio}
                />
                {error.fechaInicio && (
                  <div className="invalid-feedback d-block">{error.fechaInicio}</div>
                )}
              </div>
              <div className="mb-1">
                <label htmlFor="fechaTermino" className="fw-semibold">Fecha Término</label>
                <input
                  aria-label="fechaTermino"
                  type="date"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaTermino ? "is-invalid" : ""}`}
                  name="fechaTermino"
                  onChange={handleChange}
                  value={Inventario.fechaTermino}
                />
                {error.fechaTermino && (
                  <div className="invalid-feedback">{error.fechaTermino}</div>
                )}
              </div>

            </Col>
            <Col md={2}>
              <div className="mb-1">
                <label htmlFor="nInventario" className="fw-semibold">Nº Inventario</label>
                <input
                  aria-label="nInventario"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                  name="aF_CLAVE"
                  onChange={handleChange}
                  value={Inventario.aF_CLAVE}
                />
              </div>
            </Col>
            <Col md={5}>
              <div className="mb-1 mt-4">
                <Button onClick={handleBuscarAltas} variant={`${isDarkMode ? "secondary" : "primary"}`} className="ms-1">
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
          {/* Boton anular filas seleccionadas */}
          <div className="d-flex justify-content-end">
            {filasSeleccionadas.length > 0 ? (
              <Button
                variant="danger"
                onClick={handleAnularSeleccionados}
                className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                disabled={loadingAnular}  // Desactiva el botón mientras carga
              >
                {loadingAnular ? (
                  <>
                    {" Anulando... "}
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
                    Anular
                    <span className="badge bg-light text-dark mx-1">
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
          {loading ? (
            <>
              {/* <SkeletonLoader rowCount={elementosPorPagina} /> */}
              <SkeletonLoader rowCount={10} columnCount={10} />
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
                    <th scope="col" className="text-nowrap text-center">Codigo</th>
                    <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                    <th scope="col" className="text-nowrap text-center">Servicio</th>
                    <th scope="col" className="text-nowrap text-center">Dependencia</th>
                    <th scope="col" className="text-nowrap text-center">Especie</th>
                    <th scope="col" className="text-nowrap text-center">N° Cuenta</th>
                    <th scope="col" className="text-nowrap text-center">Marca</th>
                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                    <th scope="col" className="text-nowrap text-center">Serie</th>
                    <th scope="col" className="text-nowrap text-center">Precio</th>
                    <th scope="col" className="text-nowrap text-center">N° Recepcion</th>
                    {/* <th>Acción</th> */}
                  </tr>
                </thead>
                <tbody>
                  {elementosActuales.map((Lista, index) => {
                    const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                    return (
                      <tr key={index}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            onChange={() => setSeleccionaFilas(indexReal)}
                            checked={filasSeleccionadas.includes(indexReal.toString())}
                          />
                        </td>
                        <td>{Lista.aF_CLAVE}</td>
                        <td>{Lista.ninv}</td>
                        <td>{Lista.serv}</td>
                        <td>{Lista.dep}</td>
                        <td>{Lista.esp}</td>
                        <td>{Lista.ncuenta}</td>
                        <td>{Lista.marca}</td>
                        <td>{Lista.modelo}</td>
                        <td>{Lista.serie}</td>
                        <td>{Lista.precio}</td>
                        <td>{Lista.mrecepcion}</td>
                        {/* <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleAnular(index, listaAltas.aF_CLAVE)}
                          >
                            Anular
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
  listaAltas: state.datosListaAltasReducers.listaAltas,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  listaAltasActions,
  obtenerListaAltasActions,
  obtenerAltasPorCorrActions,
  anularAltasActions
})(AnularAltas);
