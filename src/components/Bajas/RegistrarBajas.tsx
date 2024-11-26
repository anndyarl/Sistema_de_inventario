import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Row, Col, Pagination, Button } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import Layout from "../../containers/hocs/layout/Layout";
import SkeletonLoader from "../Utils/SkeletonLoader";
import { RootState } from "../../store";
import { registrarBajasActions } from "../../redux/actions/Bajas/registrarBajasActions";
import { listaBajasActions } from "../../redux/actions/Bajas/listaBajasActions";

const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
interface FechasProps {
  fechaInicio: string;
  fechaTermino: string;
}
export interface ListaBajas {
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

interface DatosBajas {
  listaBajas: ListaBajas[];
  listaBajasActions: () => Promise<boolean>;
  registrarBajasActions: (aF_CLAVE: number) => Promise<boolean>;
  token: string | null;
}

const RegistrarBajas: React.FC<DatosBajas> = ({ listaBajas, listaBajasActions, registrarBajasActions, token }) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});


  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaBajas[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const listaABajasAuto = async () => {
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
          });
        }
      }
    }
  };
  useEffect(() => {
    listaABajasAuto();
  }, [listaBajasActions, token, listaBajas.length]); // Asegúrate de incluir dependencias relevantes


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = [
      "aF_CLAVE"

    ].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;

  };

  const handleRegistrar = async (index: number, aF_CLAVE: number,) => {
    setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));

    const result = await Swal.fire({
      icon: "warning",
      title: "Registrar Bajas",
      text: `Confirmar Baja del Nº de registro ${aF_CLAVE}`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar y Registrar",
    });

    if (result.isConfirmed) {
      const resultado = await registrarBajasActions(aF_CLAVE);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: `Se ha registrado el Baja ${aF_CLAVE} correctamente`,
        });
        listaABajasAuto();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Hubo un problema al registrar la Baja seleccionado Nª ${aF_CLAVE}.`,
        });
      }
    }
  };


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
      <div className="container mt-2">
        <form>
          <div className="border-bottom shadow-sm p-4 rounded">
            <h3 className="form-title fw-semibold border-bottom p-1">Registrar Bajas</h3>
            {loading ? (
              <>
                <SkeletonLoader rowCount={elementosPorPagina} />
              </>
            ) : (
              <div className='table-responsive'>
                <Table striped bordered hover>
                  <thead className="table-light sticky-top">
                    <tr>
                      <th scope="col">Codigo</th>
                      <th scope="col">N° Inventario</th>
                      <th scope="col">Servicio</th>
                      <th scope="col">Dependencia</th>
                      <th scope="col">Especie</th>
                      <th scope="col">N° Cuenta</th>
                      <th scope="col">Marca</th>
                      <th scope="col">Modelo</th>
                      <th scope="col">Serie</th>
                      <th scope="col">Precio</th>
                      <th scope="col" >N° Recepcion</th>
                      <th scope="col">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {elementosActuales.map((ListaBajas, index) => (
                      <tr key={index}>
                        <td>{ListaBajas.aF_CLAVE}</td>
                        <td>{ListaBajas.ninv}</td>
                        <td>{ListaBajas.serv}</td>
                        <td>{ListaBajas.dep}</td>
                        <td>{ListaBajas.esp}</td>
                        <td>{ListaBajas.ncuenta}</td>
                        <td>{ListaBajas.marca}</td>
                        <td>{ListaBajas.modelo}</td>
                        <td>{ListaBajas.serie}</td>
                        <td>{ListaBajas.precio}</td>
                        <td>{ListaBajas.mrecepcion}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRegistrar(index, ListaBajas.aF_CLAVE)}>
                            Registrar
                          </Button>
                        </td>
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
  listaBajas: state.datosListaBajasReducers.listaBajas,
  token: state.loginReducer.token
});

export default connect(mapStateToProps, {
  listaBajasActions,
  registrarBajasActions
})(RegistrarBajas);
