import "bootstrap/dist/css/bootstrap.min.css";
import React, { useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner } from "react-bootstrap";
import { RootState } from "../../store";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";

import { Search } from "react-bootstrap-icons";
import { obtenerListaInventarioActions } from "../../redux/actions/Inventario/AnularInventario/obtenerListaInventarioActions";
import { anularInventarioActions } from "../../redux/actions/Inventario/AnularInventario/anularInventarioActions";
import MenuInventario from "../Menus/MenuInventario";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { InventarioCompleto } from "./ModificarInventario";
import { Helmet } from "react-helmet-async";

const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
interface ListaInventarioProps {
  datosListaInventario: InventarioCompleto[];
  obtenerListaInventarioActions: (FechaInicio: string, FechaTermino: string) => Promise<boolean>;
  anularInventarioActions: (nInventario: string) => Promise<boolean>;
  isDarkMode: boolean;
}

interface FechasProps {
  fechaInicio: string;
  fechaTermino: string;
}

const AnularInventario: React.FC<ListaInventarioProps> = ({ datosListaInventario, obtenerListaInventarioActions, anularInventarioActions, isDarkMode }) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});
  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [__, setElementoSeleccionado] = useState<FechasProps[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 12;

  const [Inventario, setInventario] = useState({
    fechaInicio: "",
    fechaTermino: "",
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.fechaInicio)
      tempErrors.fechaInicio = "La Fecha de Inicio es obligatoria.";
    if (!Inventario.fechaTermino)
      tempErrors.fechaTermino = "La Fecha de Término es obligatoria.";
    if (Inventario.fechaInicio > Inventario.fechaTermino)
      tempErrors.fechaInicio =
        "La fecha de inicio es mayor a la fecha de término";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setInventario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBuscarInventario = async () => {
    let resultado = false;
    if (validate()) {
      setLoading(true);
      resultado = await obtenerListaInventarioActions(Inventario.fechaInicio, Inventario.fechaTermino);

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
    }
  };

  const handleAnular = async (index: number, aF_CLAVE: string) => {
    setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));

    const result = await Swal.fire({
      icon: "info",
      title: "Anular Registro",
      text: `Confirma anular el registro Nº ${aF_CLAVE}`,
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

    if (result.isConfirmed) {
      const resultado = await anularInventarioActions(aF_CLAVE);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Registro anulado",
          text: `Se ha anulado el registro Nº ${aF_CLAVE}.`,
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        handleBuscarInventario();
      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: `Hubo un problema al anular el registro ${aF_CLAVE}.`,
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
      }
    }
  };

  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () =>
      datosListaInventario.slice(indicePrimerElemento, indiceUltimoElemento),
    [datosListaInventario, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(datosListaInventario)
    ? Math.ceil(datosListaInventario.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  return (
    <Layout>
      <Helmet>
        <title>Anular Inventario</title>
      </Helmet>
      <MenuInventario />
      <form>
        <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">
            Anular Inventario
          </h3>
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
                  <div className="invalid-feedback fw-semibold d-block">{error.fechaInicio}</div>
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
                  <div className="invalid-feedback fw-semibold">{error.fechaTermino}</div>
                )}
              </div>

            </Col>
            <Col md={5}>
              <div className="mb-1 mt-4">
                <Button onClick={handleBuscarInventario} variant={`${isDarkMode ? "secondary" : "primary"}`} className="ms-1">
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

          {/* Tabla*/}

          {loading ? (
            <>
              <SkeletonLoader rowCount={elementosPorPagina} />
            </>
          ) : (
            <div className='skeleton-table table-responsive'>
              {elementosActuales.length > 0 && (
                <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                  <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                    <tr>
                      <th scope="col" className="text-nowrap text-center">Nª de Recepcion</th>
                      <th scope="col" className="text-nowrap text-center">Fecha de Factura</th>
                      <th scope="col" className="text-nowrap text-center">Fecha de Recepcion</th>
                      <th scope="col" className="text-nowrap text-center">Monto de Recepcion</th>
                      <th scope="col" className="text-nowrap text-center">Modalidad de Compra</th>
                      <th scope="col" className="text-nowrap text-center">Nª de Factura</th>
                      <th scope="col" className="text-nowrap text-center">Origen Presupuesto</th>
                      <th scope="col" className="text-nowrap text-center">Rut Proveedor</th>
                      <th scope="col" className="text-nowrap text-center">Dependencia</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {elementosActuales.map((datosListaInventario, index) => (
                      <tr key={index}>
                        <td>{datosListaInventario.aF_CLAVE}</td>
                        <td>{datosListaInventario.aF_FECHAFAC}</td>
                        <td>{datosListaInventario.aF_FINGRESO}</td>
                        <td>{datosListaInventario.idmodalidadcompra}</td>
                        <td>{datosListaInventario.aF_MONTOFACTURA}</td>
                        <td>{datosListaInventario.aF_NUM_FAC}</td>
                        <td>{datosListaInventario.aF_ORIGEN}</td>
                        <td>{datosListaInventario.proV_RUN}</td>
                        <td>{datosListaInventario.deP_CORR}</td>
                        <td>
                          <Button variant="outline-danger" className="fw-semibold" size="sm" onClick={() => handleAnular(index, datosListaInventario.aF_CLAVE)}>
                            Anular
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Paginador */}
          {elementosActuales.length > 0 && (
            < div className="paginador-container">
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
          )}
        </div>
      </form>
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  datosListaInventario: state.datosListaInventarioReducers.datosListaInventario,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  obtenerListaInventarioActions,
  anularInventarioActions,
})(AnularInventario);
