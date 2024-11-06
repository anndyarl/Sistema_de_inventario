import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Row, Col, Pagination, Button, Spinner } from "react-bootstrap";
import { RootState } from "../../../store";
import { connect } from "react-redux";
import Layout from "../../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";

import { InventarioCompleto } from "../ModificarInventario/ModificarInventario";
import { Eraser, Search } from "react-bootstrap-icons";
import { obtenerListaInventarioActions } from "../../../redux/actions/Inventario/obtenerListaInventarioActions";
import { anularInventarioActions } from "../../../redux/actions/Inventario/anularInventarioActions";

interface ListaInventarioProps {
  datosListaInventario: InventarioCompleto[];
  obtenerListaInventarioActions: (
    FechaInicio: string,
    FechaTermino: string
  ) => Promise<boolean>;
  anularInventarioActions: (nInventairio: string) => Promise<boolean>;
}

interface FechasProps {
  fechaInicio: string;
  fechaTermino: string;
}

const AnularInventario: React.FC<ListaInventarioProps> = ({
  datosListaInventario,
  obtenerListaInventarioActions,
  anularInventarioActions,
}) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});
  const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
  };

  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [elementoSeleccionado, setElementoSeleccionado] = useState<
    FechasProps[]
  >([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 40;

  const [Inventario, setInventario] = useState({
    fechaInicio: "",
    fechaTermino: "",
  });

  useEffect(() => {
    datosListaInventario;
  }, [datosListaInventario]);

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
      resultado = await obtenerListaInventarioActions(
        Inventario.fechaInicio,
        Inventario.fechaTermino
      );

      if (!resultado) {
        Swal.fire({
          icon: "error",
          title: "No se encontraron resultados para la busqueda ",
          confirmButtonText: "Ok",
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
      icon: "warning",
      title: "Anular Registro",
      text: `Confirma anular el registro Nº ${aF_CLAVE}`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar y Anular",
    });

    if (result.isConfirmed) {
      const resultado = await anularInventarioActions(aF_CLAVE);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Registro anulado",
          text: `Se ha anulado el registro Nº ${aF_CLAVE}.`,
        });
        handleBuscarInventario();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Hubo un problema al anular el registro ${aF_CLAVE}.`,
        });
      }
    }
  };

  const handleLimpiar = () => {
    setInventario((prevInventario) => ({
      ...prevInventario,
      fechaInicio: "",
      fechaTermino: "",
    }));
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
      <form>
        <div className="border-bottom shadow-sm p-4 rounded">
          <h3 className="form-title fw-semibold border-bottom p-1">
            Anular Inventario
          </h3>
          <Row>
            <Col md={5}>
              <div className="p-2 w-100">
                <dt className="text-muted">Fecha Inicio</dt>
                <div className=" d-flex mb-2 w-100 ">
                  <input
                    type="date"
                    className={`form-control text-center ${error.fechaInicio ? "is-invalid" : ""
                      }`}
                    name="fechaInicio"
                    onChange={handleChange}
                    value={Inventario.fechaInicio}
                  />
                  <Button
                    onClick={handleBuscarInventario}
                    variant="primary"
                    className="ms-1"
                  >
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
                      <Search
                        className={classNames("flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                  <Button
                    onClick={handleLimpiar}
                    variant="primary"
                    className="ms-1"
                  >
                    <Eraser
                      className={classNames("flex-shrink-0", "h-5 w-5")}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
                {error.fechaInicio && (
                  <div className="invalid-feedback d-block">
                    {error.fechaInicio}
                  </div>
                )}
              </div>
              <div className="p-2  w-81">
                <dt className="text-muted">Fecha Término</dt>
                <input
                  type="date"
                  className={`form-control text-center ${error.fechaTermino ? "is-invalid" : ""
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
          </Row>
          {/* Tabla*/}
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nª de Recepcion</th>
                  <th>Fecha de Factura</th>
                  <th>Fecha de Recepcion</th>
                  <th>Modalidad de Compra</th>
                  <th>Monto de Recepcion</th>
                  <th>Nª de Factura</th>
                  <th>Origen Presupuesto</th>
                  <th>Rut Proveedor</th>
                  <th>Dependencia</th>
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
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          handleAnular(index, datosListaInventario.aF_CLAVE)
                        }
                      >
                        Anular
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => ({
  datosListaInventario: state.datosListaInventarioReducer.datosListaInventario,
});

export default connect(mapStateToProps, {
  obtenerListaInventarioActions,
  anularInventarioActions,
})(AnularInventario);
