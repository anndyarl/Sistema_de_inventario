import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Modal } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { registrarMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/registrarMantenedorDependenciasActions.tsx";

import MenuMantenedores from "../Menus/MenuMantenedores.tsx";
import { listadoMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/listadoMantenedorDependenciasActions.tsx";
import { SERVICIO } from "../Inventario/RegistrarInventario/DatosCuenta.tsx";
import { Plus } from "react-bootstrap-icons";
import { Objeto } from "../Navegacion/Profile.tsx";
import { Helmet } from "react-helmet-async";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions.tsx";

export interface ListadoMantenedor {
  deP_CORR: number;
  deP_COD: string;
  seR_COD: number;
  nombre: string;
  vig: string;
  usuario: string;
  ip: string;
  num: number;
  fechA_CREA: string;
}

interface GeneralProps {
  listadoMantenedor: ListadoMantenedor[];
  listadoMantenedorDependenciasActions: () => Promise<boolean>;
  registrarMantenedorDependenciasActions: (formModal: Record<string, any>) => Promise<boolean>;

  comboServicio: SERVICIO[];
  comboServicioActions: (establ_corr: number) => void;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const Dependencias: React.FC<GeneralProps> = ({ listadoMantenedor, listadoMantenedorDependenciasActions, registrarMantenedorDependenciasActions, comboServicioActions, token, isDarkMode, comboServicio, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [error, setError] = useState<Partial<ListadoMantenedor>>({});
  const [_, setFilaSeleccionada] = useState<string[]>([]);
  const [mostrarModal, setMostrarModal] = useState<number | null>(null);
  const [mostrarModalRegistrar, setMostrarModalRegistrar] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 12;

  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => listadoMantenedor.slice(indicePrimerElemento, indiceUltimoElemento),
    [listadoMantenedor, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listadoMantenedor)
    ? Math.ceil(listadoMantenedor.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);


  const [Mantenedor, setMantenedor] = useState({
    seR_COD: 0,
    nombre: "",
    usuario: objeto.IdCredencial.toString(),
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Mantenedor.seR_COD) tempErrors.seR_COD = "Campo obligatorio";
    if (!Mantenedor.nombre) tempErrors.nombre = "Campo obligatorio";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  //Se lista automaticamente apenas entra al componente
  const listadoMantenedorAuto = async () => {
    if (token) {
      if (listadoMantenedor.length === 0) {
        setLoading(true);
        const resultado = await listadoMantenedorDependenciasActions();
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
    listadoMantenedorAuto()
    if (token) {
      if (comboServicio.length === 0) comboServicioActions(objeto.Establecimiento);
    }
  }, [listadoMantenedorDependenciasActions, comboServicioActions, token, listadoMantenedor.length]); // Asegúrate de incluir dependencias relevantes

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Convierte `value` a número
    let newValue: string | number = ["seR_COD"].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;

    setMantenedor((preBajas) => ({
      ...preBajas,
      [name]: newValue,
    }));
  };

  // const setSeleccionaFila = (index: number) => {
  //   setMostrarModal(index); //Abre modal del indice seleccionado
  //   setFilaSeleccionada((prev) =>
  //     prev.includes(index.toString())
  //       ? prev.filter((rowIndex) => rowIndex !== index.toString())
  //       : [...prev, index.toString()]
  //   );
  // };

  const handleCerrarModal = (index: number) => {
    setFilaSeleccionada((prevSeleccionadas) =>
      prevSeleccionadas.filter((fila) => fila !== index.toString())
    );
    setMostrarModal(null); //Cierra modal del indice seleccionado
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {

      const result = await Swal.fire({
        icon: "info",
        title: "Registrar",
        text: "Confirme para registrar una nueva dependencia",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      if (result.isConfirmed) {
        setLoadingRegistro(true);
        const resultado = await registrarMantenedorDependenciasActions(Mantenedor);
        console.log(Mantenedor);
        if (resultado) {
          Swal.fire({
            icon: "success",
            title: "Registro Exitoso",
            text: "Se ha agregado una nueva dependencia",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });

          setLoadingRegistro(false);
          listadoMantenedorDependenciasActions();
          setFilaSeleccionada([]);
          setMostrarModalRegistrar(false);

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
        <title>Mantenedor de Dependencias</title>
      </Helmet>
      <MenuMantenedores />
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">Listado de Dependencias</h3>
        <div className="d-flex">
          <div className="mb-1 mx-1">
            <Button
              className="align-content-center"
              variant={`${isDarkMode ? "secondary" : "primary"}`}
              onClick={() => setMostrarModalRegistrar(true)}
            >
              <Plus className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
              Nuevo
            </Button>
          </div>
        </div>

        {loading ? (
          <>
            <SkeletonLoader rowCount={elementosPorPagina} />
          </>
        ) : (
          <div className='table-responsive'>
            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
              <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                <tr>
                  {/* <th scope="col"></th> */}
                  <th scope="col" className="text-nowrap text-center">Codigo</th>
                  <th scope="col" className="text-nowrap text-center">Código Dependencia</th>
                  <th scope="col" className="text-nowrap text-center">Código Servicio</th>
                  <th scope="col" className="text-nowrap text-center">Nombre</th>
                  <th scope="col" className="text-nowrap text-center">Vigencia</th>
                  <th scope="col" className="text-nowrap text-center">IP</th>
                  <th scope="col" className="text-nowrap text-center">Fecha de Creación</th>
                </tr>
              </thead>
              <tbody>
                {elementosActuales.map((Lista, index) => {
                  let indexReal = indicePrimerElemento + index; // Índice real basado en la página
                  return (
                    <tr key={indexReal}>
                      {/* <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => setSeleccionaFila(indexReal)}
                          checked={filasSeleccionada.includes((indexReal).toString())}
                        />
                      </td> */}
                      <td scope="col" className="text-nowrap">{Lista.deP_CORR}</td>
                      <td scope="col" className="text-nowrap">{Lista.deP_COD}</td>
                      <td scope="col" className="text-nowrap">{Lista.seR_COD}</td>
                      <td scope="col" className="text-nowrap">{Lista.nombre}</td>
                      <td scope="col" className="text-nowrap">{Lista.vig}</td>
                      <td scope="col" className="text-nowrap">{Lista.ip}</td>
                      <td scope="col" className="text-nowrap">{Lista.fechA_CREA}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {/* Paginador */}
        <div className="paginador-container">
          <Pagination className="paginador-scroll ">
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
                {i + 1} {/* adentro de aqui esta page-link */}
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

      {/* Modal formulario Registro*/}
      <Modal
        show={mostrarModalRegistrar}
        onHide={() => setMostrarModalRegistrar(false)}
        dialogClassName="modal-right" // Clase personalizada
      // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
      // keyboard={false}     // Evita el cierre al presionar la tecla Esc
      >
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title className="fw-semibold">Nueva Dependencia</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <form onSubmit={handleSubmit}>
            {/* Boton actualizar filas seleccionadas */}
            <div className="d-flex justify-content-end">
              <Button
                variant={`${isDarkMode ? "secondary" : "primary"}`}
                type="submit"
                className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                disabled={loadingRegistro}  // Desactiva el botón mientras carga
              >
                {loadingRegistro ? (
                  <>
                    {"Un Momento... "}
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
                    Agregar
                  </>
                )}
              </Button>
            </div>
            <div className="mt-1">
              <label className="fw-semibold">Nombre</label>
              <input
                aria-label="nombre"
                type="text"
                className={`form-select ${error.nombre ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                name="nombre"
                placeholder="Ingrese una nueva dependencia"
                maxLength={100}
                size={10}
                onChange={handleChange}
                value={Mantenedor.nombre}
              />
              {error.nombre && (
                <div className="invalid-feedback fw-semibold">{error.nombre}</div>
              )}
            </div>
            <div className="mt-1">
              <label className="fw-semibold">Servicio</label>
              <select
                aria-label="seR_COD"
                className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.seR_COD ? "is-invalid" : ""}`}
                name="seR_COD"
                onChange={handleChange}
                value={Mantenedor.seR_COD}
              >
                <option value="">Seleccione</option>
                {comboServicio.map((traeServicio) => (
                  <option key={traeServicio.codigo} value={traeServicio.codigo}>
                    {traeServicio.nombrE_ORD}
                  </option>
                ))}
              </select>
              {error.seR_COD && (
                <div className="invalid-feedback fw-semibold">{error.seR_COD}</div>
              )}
            </div>
          </form>
        </Modal.Body>
      </Modal >

      {/* Modal formulario Actualizar*/}
      {elementosActuales.map((Lista, index) => {
        let indexReal = indicePrimerElemento + index;
        return (
          <div key={indexReal}>
            <Modal
              show={mostrarModal === indexReal}
              onHide={() => handleCerrarModal(indexReal)}
              dialogClassName="modal-right" // Clase personalizada
            // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
            // keyboard={false}     // Evita el cierre al presionar la tecla Esc
            >
              <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                <Modal.Title className="fw-semibold">Dependencia Nº {Lista.deP_CORR}</Modal.Title>
              </Modal.Header>
              <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                <form onSubmit={handleSubmit}>
                  {/* Boton actualizar filas seleccionadas */}
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      type="submit"
                      className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                      disabled={loadingRegistro}  // Desactiva el botón mientras carga
                    >
                      {loadingRegistro ? (
                        <>
                          {"Un momento... "}
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
                          Actualizar
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="mt-1">
                    <label className="fw-semibold">Servicio</label>
                    <select
                      aria-label="seR_COD"
                      className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.seR_COD ? "is-invalid" : ""}`}
                      name="seR_COD"
                      onChange={handleChange}
                      value={Mantenedor.seR_COD}
                    >
                      <option value="">Seleccionar</option>
                      {comboServicio.map((traeServicio) => (
                        <option key={traeServicio.codigo} value={traeServicio.codigo}>
                          {traeServicio.nombrE_ORD}
                        </option>
                      ))}
                    </select>
                    {error.seR_COD && (
                      <div className="invalid-feedback fw-semibold">{error.seR_COD}</div>
                    )}
                  </div>

                  <div className="mt-1">
                    <label className="fw-semibold">Nombre Dependencia</label>
                    <input
                      aria-label="nombre"
                      type="text"
                      className={`form-control ${error.nombre ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      name="nombre"
                      maxLength={100}
                      onChange={handleChange}
                      value={Mantenedor.nombre}
                    />
                    {error.deP_COD && (
                      <div className="invalid-feedback fw-semibold">{error.deP_COD}</div>
                    )}
                  </div>
                </form>
              </Modal.Body>
            </Modal >
          </div>
        )
      })}
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listadoMantenedor: state.listadoMantenedorDependenciasReducers.listadoMantenedor,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  comboServicio: state.comboServicioReducer.comboServicio,
  objeto: state.validaApiLoginReducers

});

export default connect(mapStateToProps, {
  listadoMantenedorDependenciasActions,
  registrarMantenedorDependenciasActions,
  comboServicioActions
})(Dependencias);
