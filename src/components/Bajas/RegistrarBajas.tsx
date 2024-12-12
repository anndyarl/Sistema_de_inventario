import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Row, Col, Pagination, Button, Form, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import Layout from "../../containers/hocs/layout/Layout";
import SkeletonLoader from "../Utils/SkeletonLoader";
import { RootState } from "../../store";
import { registrarBajasActions } from "../../redux/actions/Bajas/registrarBajasActions";
import { listaBajasActions } from "../../redux/actions/Bajas/listaBajasActions";
import MenuBajas from "../Menus/MenuBajas";

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
  registrarBajasActions: (activos: { aF_CLAVE: number }[]) => Promise<boolean>;
  token: string | null;
}

const RegistrarBajas: React.FC<DatosBajas> = ({ listaBajas, listaBajasActions, registrarBajasActions, token }) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});


  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaBajas[]>([]);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
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

  const handleAgrearSeleccionados = async () => {
    const selectedIndices = filasSeleccionadas.map(Number);
    const activosSeleccionados = selectedIndices.map((index) => {
      return {
        aF_CLAVE: listaBajas[index].aF_CLAVE
      };

    });
    const result = await Swal.fire({
      icon: "info",
      title: "Registrar Bajas",
      text: `Confirme para registrar las Bajas seleccionadas`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar y Registrar",

    });

    // selectedIndices.map(async (index) => {

    if (result.isConfirmed) {
      setLoadingRegistro(true);
      // const elemento = listaAltas[index].aF_CLAVE;
      // console.log("despues del confirm elemento", elemento);

      // const clavesSeleccionadas: number[] = selectedIndices.map((index) => listaAltas[index].aF_CLAVE);      
      // console.log("Claves seleccionadas para registrar:", clavesSeleccionadas);
      // Crear un array de objetos con aF_CLAVE y nombre


      // console.log("Activos seleccionados para registrar:", activosSeleccionados);

      const resultado = await registrarBajasActions(activosSeleccionados);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Bajas Registradas",
          text: `Se han registrado correctamente las Bajas seleccionadas`,
        });
        setLoadingRegistro(false);
        listaBajasActions();
        setFilasSeleccionadas([]);
      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: `Hubo un problema al registrar las Bajas`,
        });
        setLoadingRegistro(false);
      }

    }
    // })
  };

  // const handleRegistrar = async (index: number, aF_CLAVE: number,) => {
  //   setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));

  //   const result = await Swal.fire({
  //     icon: "warning",
  //     title: "Registrar Bajas",
  //     text: `Confirmar Baja del Nº de registro ${aF_CLAVE}`,
  //     showDenyButton: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Confirmar y Registrar",
  //   });

  //   if (result.isConfirmed) {
  //     const resultado = await registrarBajasActions(aF_CLAVE);
  //     if (resultado) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Registro exitoso",
  //         text: `Se ha registrado el Baja ${aF_CLAVE} correctamente`,
  //       });
  //       listaABajasAuto();
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: `Hubo un problema al registrar la Baja seleccionado Nª ${aF_CLAVE}.`,
  //       });
  //     }
  //   }
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
          <h3 className="form-title fw-semibold border-bottom p-1">Registrar Bajas</h3>
          {/* Boton registrar filas seleccionadas */}
          <div className="d-flex justify-content-start">
            {filasSeleccionadas.length > 0 ? (
              <Button
                variant="primary"
                onClick={handleAgrearSeleccionados}
                className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                disabled={loadingRegistro}  // Desactiva el botón mientras carga
              >
                {loadingRegistro ? (
                  <>
                    {" Registrando... "}
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
                    Registrar{" "}
                    <span className="badge bg-light text-dark mx-2">
                      {filasSeleccionadas.length}
                    </span>{" "}
                    {filasSeleccionadas.length === 1 ? "Baja seleccionada" : "Bajas seleccionadas"}
                  </>
                )}
              </Button>
            ) : (
              <strong className="alert alert-light border m-1 p-2 mx-2 text-muted">
                No hay bajas seleccionadas para registrar
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
              <Table striped bordered hover>
                <thead className="table-light sticky-top">
                  <tr>
                    <th >
                      <Form.Check
                        type="checkbox"
                        onChange={handleSeleccionaTodos}
                        checked={
                          filasSeleccionadas.length ===
                          elementosActuales.length &&
                          elementosActuales.length > 0
                        }
                      />
                    </th>
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
                    {/* <th scope="col">Acción</th> */}
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
                        {/* <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRegistrar(index, ListaBajas.aF_CLAVE)}>
                            Registrar
                          </Button>
                        </td> */}
                      </tr>
                    );
                  })}
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
