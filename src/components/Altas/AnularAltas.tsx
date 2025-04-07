import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Button, Spinner, Form } from "react-bootstrap";
import { RootState } from "../../store";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { Eraser, Search } from "react-bootstrap-icons";
import { anularAltasActions } from "../../redux/actions/Altas/AnularAltas/anularAltasActions";
import MenuAltas from "../Menus/MenuAltas";
import SkeletonLoader from "../Utils/SkeletonLoader";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile";
import { listaAltasRegistradasActions } from "../../redux/actions/Altas/AnularAltas/listaAltasRegistradasActions";

interface FechasProps {
  fDesde: string;
  fHasta: string;
}
export interface ListaAltas {
  aF_CLAVE: number,
  ninv: string,
  altaS_CORR: number,
  serv: string,
  dep: string,
  esp: string,
  ncuenta: string,
  marca: string,
  modelo: string,
  serie: string,
  estado: string,
  precio: string,
  fechA_ALTA: string,
  nrecep: string
}

interface DatosAltas {
  listaAltasRegistradas: ListaAltas[];
  listaAltasRegistradasActions: (fDesde: string, fHasta: string, estado: string, establ_corr: number, altasCorr: number) => Promise<boolean>;
  anularAltasActions: (activos: { aF_CLAVE: number }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto;
  nPaginacion: number; //número de paginas establecido desde preferencias
}

const AnularAltas: React.FC<DatosAltas> = ({ listaAltasRegistradasActions, anularAltasActions, listaAltasRegistradas, token, objeto, isDarkMode, nPaginacion }) => {
  const [error, setError] = useState<Partial<FechasProps> & {}>({});


  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  // const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaAltas[]>([]);
  const [loadingAnular, setLoadingAnular] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = nPaginacion;

  const [Inventario, setInventario] = useState({
    altaS_CORR: 0,
    fDesde: "",
    fHasta: "",
  });
  const listaAltasAuto = async () => {
    if (token) {
      if (listaAltasRegistradas.length === 0) {
        setLoading(true);
        const resultado = await listaAltasRegistradasActions("", "", "S", objeto.Establecimiento, 0);
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
  }, [listaAltasRegistradasActions, token, listaAltasRegistradas.length]); // Asegúrate de incluir dependencias relevantes

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    if (Inventario.fDesde > Inventario.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = [
      "altaS_CORR"

    ].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;

    setInventario((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

  };

  const handleBuscarAltas = async () => {
    let resultado = false;

    setLoading(true);
    if (Inventario.fDesde == "" && Inventario.fHasta == "" && Inventario.altaS_CORR == 0) {
      resultado = await listaAltasRegistradasActions("", "", "S", objeto.Establecimiento, Inventario.altaS_CORR);
    }
    if (Inventario.fDesde != "" && Inventario.fHasta != "") {
      if (validate()) {
        resultado = await listaAltasRegistradasActions(Inventario.fDesde, Inventario.fHasta, "", objeto.Establecimiento, Inventario.altaS_CORR);
      }
    }
    if (Inventario.altaS_CORR != 0) {
      resultado = await listaAltasRegistradasActions("", "", "", objeto.Establecimiento, Inventario.altaS_CORR);
    }

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
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }

  };

  const handleLimpiar = () => {
    setInventario((prevInventario) => ({
      ...prevInventario,
      altaS_CORR: 0,
      fDesde: "",
      fHasta: "",

    }));
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
        aF_CLAVE: listaAltasRegistradas[index].aF_CLAVE,
        USUARIO_MOD: objeto.IdCredencial,
        ESTABL_CORR: objeto.Establecimiento,
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
        document.body.style.overflow = "hidden"; // Evita que el fondo se desplace
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
        listaAltasRegistradasActions("", "", "N", objeto.Establecimiento, 0);
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
      listaAltasRegistradas.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaAltasRegistradas, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listaAltasRegistradas)
    ? Math.ceil(listaAltasRegistradas.length / elementosPorPagina)
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
                <label htmlFor="fDesde" className="fw-semibold">Desde</label>
                <input
                  aria-label="fDesde"
                  type="date"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fDesde ? "is-invalid" : ""}`}
                  name="fDesde"
                  onChange={handleChange}
                  value={Inventario.fDesde}
                />
                {error.fDesde && (
                  <div className="invalid-feedback d-block">{error.fDesde}</div>
                )}
              </div>
              <div className="mb-1">
                <label htmlFor="fHasta" className="fw-semibold">Hasta</label>
                <input
                  aria-label="fHasta"
                  type="date"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fHasta ? "is-invalid" : ""}`}
                  name="fHasta"
                  onChange={handleChange}
                  value={Inventario.fHasta}
                />
                {error.fHasta && (
                  <div className="invalid-feedback">{error.fHasta}</div>
                )}
              </div>

            </Col>
            <Col md={2}>
              <div className="mb-1">
                <label htmlFor="altaS_CORR" className="fw-semibold">Nº Alta</label>
                <input
                  aria-label="altaS_CORR"
                  type="text"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                  name="altaS_CORR"
                  size={10}
                  onChange={handleChange}
                  value={Inventario.altaS_CORR}
                />
              </div>
            </Col>
            <Col md={5}>
              <div className="mb-1 mt-4">
                <Button onClick={handleBuscarAltas}
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
                <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                  <tr>
                    <th >
                      <Form.Check
                        className="check-danger"
                        type="checkbox"
                        onChange={handleSeleccionaTodos}
                        checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                      />
                    </th>
                    <th scope="col" className="text-nowrap text-center">Código</th>
                    <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                    <th scope="col" className="text-nowrap text-center">N° Alta</th>
                    <th scope="col" className="text-nowrap text-center">Servicio</th>
                    <th scope="col" className="text-nowrap text-center">Dependencia</th>
                    <th scope="col" className="text-nowrap text-center">Especie</th>
                    <th scope="col" className="text-nowrap text-center">N° Cuenta</th>
                    <th scope="col" className="text-nowrap text-center">Marca</th>
                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                    <th scope="col" className="text-nowrap text-center">Serie</th>
                    <th scope="col" className="text-nowrap text-center">Estado</th>
                    <th scope="col" className="text-nowrap text-center">Precio</th>
                    <th scope="col" className="text-nowrap text-center">Fecha Alta</th>
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
                        <td className="text-nowrap text-center">{Lista.aF_CLAVE}</td>
                        <td className="text-nowrap text-center">{Lista.ninv}</td>
                        <td className="text-nowrap text-center">{Lista.altaS_CORR}</td>
                        <td className="text-nowrap text-center">{Lista.serv ? "" : "S/N"}</td>
                        <td className="text-nowrap text-center">{Lista.dep ? "" : "S/N"}</td>
                        <td className="text-nowrap text-center">{Lista.esp}</td>
                        <td className="text-nowrap text-center">{Lista.ncuenta}</td>
                        <td className="text-nowrap text-center">{Lista.marca}</td>
                        <td className="text-nowrap text-center">{Lista.modelo}</td>
                        <td className="text-nowrap text-center">{Lista.serie}</td>
                        <td className="text-nowrap text-center">{Lista.estado}</td>
                        <td className="text-nowrap text-center">{Lista.precio}</td>
                        <td className="text-nowrap text-center">{Lista.fechA_ALTA}</td>
                        <td className="text-nowrap text-center">{Lista.nrecep}</td>
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
  listaAltasRegistradas: state.listaAltasRegistradasReducers.listaAltasRegistradas,
  token: state.loginReducer.token,
  objeto: state.validaApiLoginReducers,
  isDarkMode: state.darkModeReducer.isDarkMode,
  nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
  listaAltasRegistradasActions,
  anularAltasActions
})(AnularAltas);
