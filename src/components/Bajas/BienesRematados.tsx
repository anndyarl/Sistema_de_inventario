import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Form, Modal } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuBajas from "../Menus/MenuBajas.tsx";
import { obtenerListaRematesActions } from "../../redux/actions/Bajas/obtenerListaRematesActions.tsx";
import { rematarBajasActions } from "../../redux/actions/Bajas/rematarBajasActions.tsx";
import { Helmet } from "react-helmet-async";
export interface ListaRemates {
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
  listaRemates: ListaRemates[];
  obtenerListaRematesActions: (aF_CLAVE: string) => Promise<boolean>;
  rematarBajasActions: (listaRemates: Record<string, any>[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
}

const BienesRematados: React.FC<DatosBajas> = ({ listaRemates, obtenerListaRematesActions, rematarBajasActions, token, isDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [error, setError] = useState<Partial<ListaRemates>>({});
  const [filaSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
  const [mostrarModal, setMostrarModal] = useState<number | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 12;
  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => listaRemates.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaRemates, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listaRemates)
    ? Math.ceil(listaRemates.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  const [Rematados, setRematados] = useState({
    nresolucion: 0,
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Rematados.nresolucion || Rematados.nresolucion === 0) tempErrors.nresolucion = "Campo obligatorio.";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const listaRematesAuto = async () => {
    if (token) {
      if (listaRemates.length === 0) {
        setLoading(true);
        const resultado = await obtenerListaRematesActions("");
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
    listaRematesAuto()
  }, [obtenerListaRematesActions, token, listaRemates.length]); // Asegúrate de incluir dependencias relevantes

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convierte `value` a número
    let newValue: string | number = ["nresolucion"].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;
    setRematados((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    if (name === "nresolucion") {
      newValue = parseFloat(value) || 0;
    }
  };

  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFilaSeleccionada(
        elementosActuales.map((_, index) =>
          (indicePrimerElemento + index).toString()
        )
      );
    } else {
      setFilaSeleccionada([]);
    }
  };

  const setSeleccionaFila = (index: number) => {
    setMostrarModal(index); //Abre modal del indice seleccionado
    setFilaSeleccionada((prev) =>
      prev.includes(index.toString())
        ? prev.filter((rowIndex) => rowIndex !== index.toString())
        : [...prev, index.toString()]
    );
  };

  const handleCerrarModal = (index: number) => {
    setFilaSeleccionada((prevSeleccionadas) =>
      prevSeleccionadas.filter((fila) => fila !== index.toString())
    );
    setMostrarModal(null); //Cierra modal del indice seleccionado
    setRematados((prevState) => ({
      ...prevState,
      nresolucion: 0,
    }));
  };

  // const handleBuscarRemates = async () => {
  //   let resultado = false;
  //   setLoading(true);
  //   resultado = await obtenerListaRematesActions(Inventario.aF_CLAVE);


  //   if (!resultado) {
  //     Swal.fire({
  //       icon: "error",
  //       title: ":'(",
  //       text: "No se encontraron resultados, inténte otro registro.",
  //       confirmButtonText: "Ok",
  //       background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //       color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //       confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
  //       customClass: {
  //         popup: "custom-border", // Clase personalizada para el borde
  //       }
  //     });
  //     setLoading(false); //Finaliza estado de carga
  //     return;
  //   } else {
  //     setLoading(false); //Finaliza estado de carga
  //   }

  // };
  const handleQuitar = async () => {
    if (validate()) {
      const selectedIndices = filaSeleccionada.map(Number);
      const result = await Swal.fire({
        icon: "info",
        title: "Quitar Bienes",
        text: "Confirme para quitar el bien seleccionados",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar y Quitar",
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
          aF_CLAVE: listaRemates[activo].aF_CLAVE,
          bajaS_CORR: listaRemates[activo].bajaS_CORR,
          especie: listaRemates[activo].especie,
          vutiL_RESTANTE: listaRemates[activo].vutiL_RESTANTE,
          vutiL_AGNOS: listaRemates[activo].vutiL_AGNOS,
          ...Rematados,// nresolucion
          observaciones: listaRemates[activo].observaciones,
          deP_ACUMULADA: listaRemates[activo].deP_ACUMULADA,
          ncuenta: listaRemates[activo].ncuenta,
          estado: listaRemates[activo].estado,
          fechA_REMATES: listaRemates[activo].fechA_REMATES,

        }));
        console.log(Formulario);
        const resultado = await rematarBajasActions(Formulario);

        if (resultado) {
          Swal.fire({
            icon: "success",
            title: "Bienes Rematados",
            text: "Se han quitdo del sistema correctamente",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });

          setLoadingRegistro(false);
          obtenerListaRematesActions("");
          setFilaSeleccionada([]);
          setRematados((prevState) => ({
            ...prevState,
            nresolucion: 0,
          }));
          setMostrarModal(null);
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
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Bienes Rematados</title>
      </Helmet>
      <MenuBajas />

      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">Bienes Rematados</h3>
        {/* <Row>
            <Col md={3}>
              <div className="mb-1">
                <label htmlFor="aF_CLAVE" className="fw-semibold">Nº Inventario</label>
                <input
                  aria-label="aF_CLAVE"
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
          </Row> */}

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
                      checked={filaSeleccionada.length === elementosActuales.length && elementosActuales.length > 0}
                    />
                  </th>
                  <th scope="col" className="text-nowrap text-center">Nª Certificado</th>
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
                          onChange={() => setSeleccionaFila(index)}
                          checked={filaSeleccionada.includes(indexReal.toString())}
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

      {/* Modal formulario*/}
      {elementosActuales.map((Lista, index) => (
        <div key={index}>
          <Modal
            show={mostrarModal === index}
            onHide={() => handleCerrarModal(index)}
            dialogClassName="modal-right" // Clase personalizada
          // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
          // keyboard={false}     // Evita el cierre al presionar la tecla Esc
          >
            <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
              <Modal.Title className="fw-semibold">Quitar registro: {Lista.aF_CLAVE}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
              <form>
                {/* <div className="d-flex justify-content-end">
                  <Button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
                    Enviar a Bodega
                  </Button>
                </div> */}
                {/* Boton quitar */}
                <div className="d-flex justify-content-end">
                  <Button
                    variant="danger"
                    onClick={handleQuitar}
                    className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                    disabled={loadingRegistro}  // Desactiva el botón mientras carga
                  >
                    {loadingRegistro ? (
                      <>
                        {" Quitando... "}
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
                        Quitar
                      </>
                    )}
                  </Button>

                </div>
                <div className="mb-1">
                  <label htmlFor="nresolucion" className="fw-semibold">
                    Ingrese número de resolución
                  </label>
                  <input
                    aria-label="nresolucion"
                    type="text"
                    className={`form-control ${error.nresolucion ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="nresolucion"
                    maxLength={100}
                    onChange={handleChange}
                    value={Rematados.nresolucion}
                  />
                  {error.nresolucion && (
                    <div className="invalid-feedback fw-semibold">{error.nresolucion}</div>
                  )}
                </div>
              </form>
            </Modal.Body>
          </Modal >
        </div>
      ))}
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listaRemates: state.obtenerListaRematesReducers.listaRemates,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  rematarBajasActions,
  obtenerListaRematesActions
})(BienesRematados);
