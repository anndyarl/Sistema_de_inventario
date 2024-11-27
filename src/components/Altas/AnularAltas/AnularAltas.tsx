import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Row, Col, Pagination, Button, Spinner, Form } from "react-bootstrap";
import { RootState } from "../../../store";
import { connect } from "react-redux";
import Layout from "../../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { Search } from "react-bootstrap-icons";
import { listaAltasActions } from "../../../redux/actions/Altas/AnularAltas/listaAltasActions";

import { obtenerListaAltasActions } from "../../../redux/actions/Altas/AnularAltas/obtenerListaAltasActions";
import { anularAltasActions } from "../../../redux/actions/Altas/AnularAltas/anularAltasActions";
import MenuAltas from "../../Menus/MenuAltas";
import { obtenerAltasPorCorrActions } from "../../../redux/actions/Altas/AnularAltas/obtenerAltasPorCorrActions";
import SkeletonLoader from "../../Utils/SkeletonLoader";
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
}

const AnularAltas: React.FC<DatosAltas> = ({ listaAltas, listaAltasActions, obtenerListaAltasActions, obtenerAltasPorCorrActions, anularAltasActions, token }) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});


  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaAltas[]>([]);
  const [loadingAnular, setLoadingAnular] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

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
    console.log("indices seleccionmados", index);
  };

  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFilasSeleccionadas(
        elementosActuales.map((_, index) =>
          (indicePrimerElemento + index).toString()
        )
      );
      console.log("filas Seleccionadas ", filasSeleccionadas);
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
      confirmButtonColor: '#dc3545',
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
        });
        setLoadingAnular(false);
        listaAltasActions();
        setFilasSeleccionadas([]);
      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: `Hubo un problema al anular las Altas`,
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
      <MenuAltas />
      <div className="container mt-2">
        <form>
          <div className="border-bottom shadow-sm p-4 rounded">
            <h3 className="form-title fw-semibold border-bottom p-1">Anular Altas</h3>
            <Row>
              <Col md={3}>
                <div className="mb-1">
                  <label htmlFor="fechaInicio" className="text-muted">Fecha Inicio</label>
                  <input
                    aria-label="fechaInicio"
                    type="date"
                    className={`form-control  ${error.fechaInicio ? "is-invalid" : ""
                      }`}
                    name="fechaInicio"
                    onChange={handleChange}
                    value={Inventario.fechaInicio}
                  />
                  {error.fechaInicio && (
                    <div className="invalid-feedback d-block">{error.fechaInicio}</div>
                  )}
                </div>
                <div className="mb-1">
                  <label htmlFor="fechaTermino" className="text-muted">Fecha Término</label>
                  <input
                    aria-label="fechaTermino"
                    type="date"
                    className={`form-control  ${error.fechaTermino ? "is-invalid" : ""
                      }`}
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
                  <label htmlFor="nInventario" className="text-muted">Nº Inventario</label>
                  <input
                    aria-label="nInventario"
                    type="text"
                    className='form-control'
                    name="aF_CLAVE"
                    onChange={handleChange}
                    value={Inventario.aF_CLAVE}
                  />
                </div></Col>
              <Col md={5}>
                <div className="mb-1 mt-4">
                  <Button onClick={handleBuscarAltas} variant="primary" className="ms-1">
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
            <div className="d-flex justify-content-start">
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
                      Anular{" "}
                      <span className="badge bg-light text-dark mx-2">
                        {filasSeleccionadas.length}
                      </span>{" "}
                      {filasSeleccionadas.length === 1 ? "Alta seleccionada" : "Altas seleccionadas"}
                    </>
                  )}
                </Button>
              ) : (
                <strong className="alert alert-light border m-1 p-2 mx-2 text-muted">
                  No hay altas seleccionadas para anular
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
                <Table striped bordered hover  >
                  <thead className="table-light sticky-top">
                    <tr>
                      <th >
                        <Form.Check
                          className="check-danger"
                          type="checkbox"
                          onChange={handleSeleccionaTodos}
                          checked={
                            filasSeleccionadas.length ===
                            elementosActuales.length &&
                            elementosActuales.length > 0
                          }
                        />
                      </th>
                      <th>Codigo</th>
                      <th>N° Inventario</th>
                      <th>Servicio</th>
                      <th>Dependencia</th>
                      <th>Especie</th>
                      <th>N° Cuenta</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Serie</th>
                      <th>Precio</th>
                      <th>N° Recepcion</th>
                      {/* <th>Acción</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {elementosActuales.map((listaAltas, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            onChange={() => setSeleccionaFilas(index)}
                            checked={filasSeleccionadas.includes(
                              index.toString()
                            )}
                          />
                        </td>
                        <td>{listaAltas.aF_CLAVE}</td>
                        <td>{listaAltas.ninv}</td>
                        <td>{listaAltas.serv}</td>
                        <td>{listaAltas.dep}</td>
                        <td>{listaAltas.esp}</td>
                        <td>{listaAltas.ncuenta}</td>
                        <td>{listaAltas.marca}</td>
                        <td>{listaAltas.modelo}</td>
                        <td>{listaAltas.serie}</td>
                        <td>{listaAltas.precio}</td>
                        <td>{listaAltas.mrecepcion}</td>
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
                    ))}
                  </tbody>
                </Table>
              </div>
            )}


            {/* Paginador */}
            <Pagination className="d-flex justify-content-end">
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
        </form>
      </div >
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listaAltas: state.datosListaAltasReducers.listaAltas,
  token: state.loginReducer.token
});

export default connect(mapStateToProps, {
  listaAltasActions,
  obtenerListaAltasActions,
  obtenerAltasPorCorrActions,
  anularAltasActions
})(AnularAltas);
