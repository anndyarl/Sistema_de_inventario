import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Row, Col, Pagination, Button, Spinner, Form } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import { Search } from "react-bootstrap-icons";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { listaBajasActions } from "../../redux/actions/Bajas/listaBajasActions.tsx";
import MenuBajas from "../Menus/MenuBajas.tsx";
import { excluirBajasActions } from "../../redux/actions/Bajas/excluirBajasActions.tsx";
import { obtenerListaBajasActions } from "../../redux/actions/Bajas/obtenerListaBajasActions.tsx";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
interface FechasProps {
  fechaInicio: string;
  fechaTermino: string;
}
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
  listaBajas: ListaBajas[];
  listaBajasActions: () => Promise<boolean>;
  obtenerListaBajasActions: (FechaInicio: string, FechaTermino: string) => Promise<boolean>;
  excluirBajasActions: (activos: { aF_CLAVE: number }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
}

const BienesRematados: React.FC<DatosBajas> = ({ listaBajas, listaBajasActions, obtenerListaBajasActions, excluirBajasActions, token, isDarkMode }) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});


  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [loadingExcluir, setLoadingExcluir] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const [Inventario, setInventario] = useState({
    aF_CLAVE: 0,
    fechaInicio: "",
    fechaTermino: "",
  });
  const listaBajasAuto = async () => {
    if (token) {
      if (listaBajas.length === 0) {
        setLoading(true);
        const resultado = await listaBajasActions();
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
    listaBajasAuto();
  }, [listaBajasActions, token, listaBajas.length]); // Asegúrate de incluir dependencias relevantes

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

  const handleBuscarBajas = async () => {
    let resultado = false;

    setLoading(true);
    if (Inventario.fechaInicio != "" && Inventario.fechaTermino != "") {
      if (validate()) {
        resultado = await obtenerListaBajasActions(Inventario.fechaInicio, Inventario.fechaTermino);
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

  const handleExcluirSeleccionados = async () => {
    const selectedIndices = filasSeleccionadas.map(Number);
    const activosSeleccionados = selectedIndices.map((index) => {
      return {
        aF_CLAVE: listaBajas[index].aF_CLAVE
      };

    });
    const result = await Swal.fire({
      icon: "info",
      title: "Rematar Bienes",
      text: `Confirme para rematar los bienes seleccionados`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar y rematar",
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      customClass: {
        popup: "custom-border", // Clase personalizada para el borde
      }
    });

    if (result.isConfirmed) {
      setLoadingExcluir(true);

      const resultado = await excluirBajasActions(activosSeleccionados);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Bajas Excluidas",
          text: `Se han excluido correctamente las bajas seleccionadas`,
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        setLoadingExcluir(false);
        listaBajasActions();
        setFilasSeleccionadas([]);
      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: `Hubo un problema al excluir las bajas`,
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        setLoadingExcluir(false);
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
      listaBajas.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaBajas, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listaBajas)
    ? Math.ceil(listaBajas.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  return (
    <Layout>
      <MenuBajas />
      <form>
        <div className="border-bottom shadow-sm p-4 rounded">
          <h3 className="form-title fw-semibold border-bottom p-1">Bienes Rematados</h3>
          {/* <Row>
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
          <Col md={5}>
            <div className="mb-1 mt-4">
              <Button onClick={handleBuscarBajas} variant="primary" className="ms-1">
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
        </Row>  */}
          {/* Boton anular filas seleccionadas */}
          <div className="d-flex justify-content-end">
            {filasSeleccionadas.length > 0 ? (
              <Button
                variant="danger"
                onClick={handleExcluirSeleccionados}
                className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                disabled={loadingExcluir}  // Desactiva el botón mientras carga
              >
                {loadingExcluir ? (
                  <>
                    {" Excluyendo... "}
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
                    Rematar
                    <span className="badge bg-light text-dark mx-1">
                      {filasSeleccionadas.length}
                    </span>
                    {filasSeleccionadas.length === 1 ? "Baja" : "Bajas"}
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
                    <th scope="col" className={`${isDarkMode ? "text-light" : "text-dark"}`}>Codigo</th>
                    <th scope="col" className={`${isDarkMode ? "text-light" : "text-dark"}`}>N° Inventario</th>
                    <th scope="col" className={`${isDarkMode ? "text-light" : "text-dark"}`}>Vidal últil</th>
                    <th scope="col" className={`${isDarkMode ? "text-light" : "text-dark"}`}>En años</th>
                    <th scope="col" className={`${isDarkMode ? "text-light" : "text-dark"}`}>N° Cuenta</th>
                    <th scope="col" className={`${isDarkMode ? "text-light" : "text-dark"}`}>Especie</th>
                    <th scope="col" className={`${isDarkMode ? "text-light" : "text-dark"}`}>Depreciación Acumulada</th>
                  </tr>
                </thead>
                <tbody>
                  {elementosActuales.map((ListaBajas, index) => {
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
                        <td className={`${isDarkMode ? "text-light" : "text-dark"}`}>{ListaBajas.bajaS_CORR}</td>
                        <td className={`${isDarkMode ? "text-light" : "text-dark"}`}>{ListaBajas.aF_CLAVE}</td>
                        <td className={`${isDarkMode ? "text-light" : "text-dark"}`}>{ListaBajas.vutiL_RESTANTE}</td>
                        <td className={`${isDarkMode ? "text-light" : "text-dark"}`}>{ListaBajas.vutiL_AGNOS}</td>
                        <td className={`${isDarkMode ? "text-light" : "text-dark"}`}>{ListaBajas.ncuenta}</td>
                        <td className={`${isDarkMode ? "text-light" : "text-dark"}`}>{ListaBajas.especie}</td>
                        <td className={`${isDarkMode ? "text-light" : "text-dark"}`}>{ListaBajas.deP_ACUMULADA}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listaBajas: state.datosListaBajasReducers.listaBajas,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  listaBajasActions,
  excluirBajasActions,
  obtenerListaBajasActions
})(BienesRematados);
