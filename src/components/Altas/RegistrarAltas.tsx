import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Form, Row, Col, Modal } from "react-bootstrap";
import { AppDispatch, RootState } from "../../store";
import { connect, useDispatch } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { registrarAltasActions } from "../../redux/actions/Altas/RegistrarAltas/registrarAltasActions";
import MenuAltas from "../Menus/MenuAltas";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";
import { listaAltasActions } from "../../redux/actions/Altas/RegistrarAltas/listaAltasActions.tsx";
import { Eraser, Search } from "react-bootstrap-icons";
import { setAltasRegistradas } from "../../redux/actions/Altas/RegistrarAltas/datosAltasRegistradasActions.tsx";

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
  estado: string,
  precio: number,
  mrecepcion: string
}

interface ListaSalidaAltas {
  aF_CLAVE: number;
  altaS_CORR: number;
}
interface DatosAltas {
  listaAltas: ListaAltas[];
  listaAltasActions: (af_codigo_generico: string, establ_corr: number) => Promise<boolean>;
  registrarAltasActions: (activos: { aF_CLAVE: number }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto;
  nPaginacion: number; //número de paginas establecido desde preferencias
  listaSalidaAltas: ListaSalidaAltas[];
}

const RegistrarAltas: React.FC<DatosAltas> = ({ listaAltasActions, registrarAltasActions, listaAltas, objeto, token, isDarkMode, nPaginacion, listaSalidaAltas }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalMostrarResumen, setModalMostrarResumen] = useState(false);
  const elementosPorPagina = nPaginacion;
  const dispatch = useDispatch<AppDispatch>();

  const [Inventario, setInventario] = useState({
    af_codigo_generico: "",
  });

  const mostrarAlerta = () => {
    document.body.style.overflow = "hidden"; // Evita que el fondo se desplace
    Swal.fire({
      icon: "success",
      title: "Registro Exitoso",
      text: `Se han registrado correctamente las Altas seleccionadas, Presione "OK" para visualizar un resumen de los datos ingresados.`,
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      customClass: { popup: "custom-border" },
      allowOutsideClick: false,
      showCancelButton: false, // Agrega un segundo botón
      cancelButtonText: "Cerrar", // Texto del botón
      willClose: () => {
        document.body.style.overflow = "auto"; // Restaura el scroll
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setModalMostrarResumen(true);
        dispatch(setAltasRegistradas(0));
      }
    });


  };

  const listaAltasAuto = async () => {
    if (token) {
      if (listaAltas.length === 0) {
        setLoading(true);
        const resultado = await listaAltasActions("", objeto.Establecimiento);
        if (resultado) {
          setLoading(false);
        }
        // else {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Error",
        //     text: `Error en la solicitud. Por favor, intente nuevamente.`,
        //     background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        //     color: `${isDarkMode ? "#ffffff" : "000000"}`,
        //     confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        //     customClass: {
        //       popup: "custom-border", // Clase personalizada para el borde
        //     }
        //   });
        // }
      }
    }
  };

  useEffect(() => {
    // dispatch(setAltasRegistradas(1));
    if (listaSalidaAltas.length > 0) {
      mostrarAlerta();
    }
    listaAltasAuto();
  }, [listaAltasActions, token, listaAltas.length]); // Asegúrate de incluir dependencias relevantes

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    // Si el campo es "af_codigo_generico", validamos que solo tenga números
    if (name === "af_codigo_generico") {
      // Solo números usando una expresión regular
      const soloNumeros = /^[0-9]*$/;

      if (!soloNumeros.test(value)) {
        return; // No actualiza el estado si hay caracteres inválidos
      }

      setInventario((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      return;
    }

  };

  const handleBuscar = async () => {
    setLoading(true);
    const resultado = await listaAltasActions(Inventario.af_codigo_generico, objeto.Establecimiento);
    if (!resultado) {
      Swal.fire({
        icon: "error",
        title: "No se encontraron resultados para la busqueda",
        confirmButtonText: "Ok",
      });
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      setLoading(false); //Finaliza estado de carga
    }

  };

  const handleLimpiar = () => {
    setInventario((prevInventario) => ({
      ...prevInventario,
      af_codigo_generico: ""
    }));
  };

  const setSeleccionaFilas = (index: number) => {
    const indexReal = indicePrimerElemento + index;
    setFilasSeleccionadas((prev) =>
      prev.includes(indexReal.toString())
        ? prev.filter((rowIndex) => rowIndex !== indexReal.toString())
        : [...prev, indexReal.toString()]
    );
    // console.log("indices seleccionmados", indexReal);
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

  const handleAgrearSeleccionados = async () => {
    const selectedIndices = filasSeleccionadas.map(Number);
    const activosSeleccionados = selectedIndices.map((index) => {
      return {
        aF_CLAVE: listaAltas[index].aF_CLAVE,
        USUARIO_MOD: objeto.IdCredencial,
        ESTABL_CORR: objeto.Establecimiento,
      };

    });
    const result = await Swal.fire({
      icon: "info",
      title: "Registrar Altas",
      text: `Confirme para registrar las Altas seleccionadas`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar y Registrar",
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      customClass: {
        popup: "custom-border", // Clase personalizada para el borde
      }
    });
    // console.log("filas Seleccionadas ", filasSeleccionadas);
    // selectedIndices.map(async (index) => {

    if (result.isConfirmed) {
      setLoadingRegistro(true);
      // const elemento = listaAltas[index].aF_CLAVE;
      // console.log("despues del confirm elemento", elemento);
      // const clavesSeleccionadas: number[] = selectedIndices.map((index) => listaAltas[index].aF_CLAVE);      
      // console.log("Claves seleccionadas para registrar:", clavesSeleccionadas);
      // Crear un array de objetos con aF_CLAVE y nombre
      // console.log("Activos seleccionados para registrar:", activosSeleccionados);
      console.log("listaSalidaAltas", listaSalidaAltas);
      const resultado = await registrarAltasActions(activosSeleccionados);
      if (resultado) {
        dispatch(setAltasRegistradas(1));
        setLoadingRegistro(false);
        listaAltasActions("", objeto.Establecimiento);
        setFilasSeleccionadas([]);
      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: `Hubo un problema al registrar las Altas.`,
          background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "#000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "#444"}`,
          customClass: {
            popup: "custom-border"
          }
        });

        setLoadingRegistro(false);
      }
    }
    // })
  };

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
        <title>Registrar Altas</title>
      </Helmet>
      <MenuAltas />
      <form>
        <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">Registrar Altas</h3>
          <Row>
            <Col md={2}>
              <div className="mb-1">
                <label htmlFor="af_codigo_generico" className="fw-semibold">Nº Inventario</label>
                <input
                  aria-label="af_codigo_generico"
                  type="text"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                  name="af_codigo_generico"
                  size={10}
                  placeholder="Eje: 1000000008"
                  onChange={handleChange}
                  value={Inventario.af_codigo_generico}
                />
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
          {/* Boton registrar filas seleccionadas */}
          <div className="d-flex justify-content-end">
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
                    Registrar
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
              <SkeletonLoader rowCount={elementosPorPagina} />
            </>
          ) : (
            <div className='table-responsive'>
              <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                  <tr>
                    <th style={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 2,
                    }}>
                      <Form.Check
                        type="checkbox"
                        onChange={handleSeleccionaTodos}
                        checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                      />
                    </th>
                    <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                    <th scope="col" className="text-nowrap text-center">Servicio</th>
                    <th scope="col" className="text-nowrap text-center">Dependencia</th>
                    <th scope="col" className="text-nowrap text-center">Especie</th>
                    <th scope="col" className="text-nowrap text-center">N° Cuenta</th>
                    <th scope="col" className="text-nowrap text-center">Marca</th>
                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                    <th scope="col" className="text-nowrap text-center">Serie</th>
                    <th scope="col" className="text-nowrap text-center">Estado</th>
                    <th scope="col" className="text-nowrap text-center">Precio</th>
                    <th scope="col" className="text-nowrap text-center">N° Recepcion</th>
                    {/* <th scope="col">Acción</th> */}
                  </tr>
                </thead>
                <tbody>
                  {elementosActuales.map((Lista, index) => {
                    const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                    return (
                      <tr key={indexReal}>
                        <td style={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 2,
                        }}>
                          <Form.Check
                            type="checkbox"
                            onChange={() => setSeleccionaFilas(index)}
                            checked={filasSeleccionadas.includes(indexReal.toString())} // Verifica con el índice real
                          />
                        </td>

                        <td className="text-nowrap">{Lista.ninv}</td>
                        <td className="text-nowrap">{Lista.serv}</td>
                        <td className="text-nowrap">{Lista.dep}</td>
                        <td className="text-nowrap">{Lista.esp}</td>
                        <td className="text-nowrap">{Lista.ncuenta}</td>
                        <td className="text-nowrap">{Lista.marca}</td>
                        <td className="text-nowrap">{Lista.modelo}</td>
                        <td className="text-nowrap">{Lista.serie}</td>
                        <td className="text-nowrap">{Lista.estado}</td>
                        <td className="text-nowrap">
                          ${(Lista.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                        </td>
                        <td className="text-nowrap">{Lista.mrecepcion ? "" : "S/N"}</td>
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
          </div >
        </div >
      </form >

      <Modal show={modalMostrarResumen} onHide={() => setModalMostrarResumen(false)} size="lg">
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title className="fw-semibold">Resumen Registro Altas</Modal.Title>
        </Modal.Header>
        <Modal.Body id="pdf-content" className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <Row className="mb-4">

          </Row>
          <div className="table-responsive">
            <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
              <thead>
                <tr>
                  <th>Nº Inventario</th>
                  <th>N" Alta</th>
                </tr>
              </thead>
              <tbody>
                {listaSalidaAltas.length > 0 ? (
                  listaSalidaAltas.map((item, index) => (
                    <tr key={index}>
                      <td>{item.aF_CLAVE || 'N/A'}</td>
                      <td>{item.altaS_CORR || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='8' className="text-center">No hay registros</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal>
    </Layout >

  );
};

const mapStateToProps = (state: RootState) => ({
  listaAltas: state.listaAltasReducers.listaAltas,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers,
  nPaginacion: state.mostrarNPaginacionReducer.nPaginacion,
  listaSalidaAltas: state.datosAltaRegistradaReducers.listaSalidaAltas
});

export default connect(mapStateToProps, {
  listaAltasActions,
  registrarAltasActions
})(RegistrarAltas);
