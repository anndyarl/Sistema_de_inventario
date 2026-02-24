import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Modal, Row, Col, Form } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Plus, Search } from "react-bootstrap-icons";
import { SERVICIO } from "../Inventario/RegistrarInventario/DatosCuenta.tsx";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import { Objeto } from "../Navegacion/Profile.tsx";
import MenuMantenedores from "../Menus/MenuMantenedores.tsx";
import { registrarMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/registrarMantenedorDependenciasActions.tsx";
import { listadoMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/listadoMantenedorDependenciasActions.tsx";
import { comboServicioActions } from "../../redux/actions/Mantenedores/Servicios/comboServicioMantenedorActions.tsx";
import { PageSizeSelector } from "../Utils/PageSizeSelector.tsx";
import { TablaGenerica } from "../Utils/TablaGenerica.tsx";
import { BusquedaTabla } from "../Utils/BusquedaTabla.tsx";


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
  listadoMantenedorDependenciasActions: (establ_corr: number) => Promise<boolean>;
  registrarMantenedorDependenciasActions: (formModal: Record<string, any>) => Promise<boolean>;

  comboServicio: SERVICIO[];
  comboServicioActions: (establ_corr: number) => void;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario

}

const Dependencias: React.FC<GeneralProps> = ({ listadoMantenedorDependenciasActions, registrarMantenedorDependenciasActions, comboServicioActions, listadoMantenedor, token, isDarkMode, comboServicio, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [error, setError] = useState<Partial<ListadoMantenedor>>({});
  const [_, setFilaSeleccionada] = useState<string[]>([]);
  const [mostrarModalRegistrar, setMostrarModalRegistrar] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const datosFiltrados = useMemo(() => {
    if (!terminoBusqueda.trim()) {
      return listadoMantenedor;
    }

    const termino = terminoBusqueda.toLowerCase();
    return listadoMantenedor.filter((item) => {
      // Función auxiliar para convertir código de usuario a nombre

      return (
        item.deP_COD.toString().includes(termino) ||
        item.deP_CORR.toString().includes(termino) ||
        item.nombre.toLowerCase().includes(termino) ||
        item.seR_COD.toString().includes(termino)
      );
    });
  }, [listadoMantenedor, terminoBusqueda]);


  useEffect(() => {
    setPaginaActual(1);
  }, [terminoBusqueda]);

  //------------- Lógica de Paginación----------------//
  // Totales
  const totalRegistros = datosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / pageSize);

  // Índices
  const indiceInicio = (paginaActual - 1) * pageSize;
  const indiceFin = indiceInicio + pageSize;

  // Datos paginados
  const elementosActuales = useMemo(() => {
    return datosFiltrados.slice(indiceInicio, indiceFin);
  }, [datosFiltrados, indiceInicio, indiceFin]);
  //-------------Fin Lógica de Paginación----------------//


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
        const resultado = await listadoMantenedorDependenciasActions(objeto.Roles[0].codigoEstablecimiento);
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
    listadoMantenedorAuto()
    if (token) {
      if (comboServicio.length === 0) comboServicioActions(objeto.Roles[0].codigoEstablecimiento);
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
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      if (result.isConfirmed) {
        setLoadingRegistro(true);
        const resultado = await registrarMantenedorDependenciasActions(Mantenedor);
        if (resultado) {
          Swal.fire({
            icon: "success",
            title: "Registro Exitoso",
            text: "Se ha agregado una nueva dependencia",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });

          setLoadingRegistro(false);
          listadoMantenedorDependenciasActions(objeto.Roles[0].codigoEstablecimiento);
          setFilaSeleccionada([]);
          setMostrarModalRegistrar(false);

        } else {
          Swal.fire({
            icon: "error",
            title: ":'(",
            text: "Hubo un problema al registrar",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
          setLoadingRegistro(false);
        }
      }
    }
  };


  const columnas = [
    { key: 'deP_CORR' as keyof ListadoMantenedor, header: 'Código' },
    { key: 'deP_COD' as keyof ListadoMantenedor, header: 'Código Dependencia' },
    { key: 'seR_COD' as keyof ListadoMantenedor, header: 'Código Servicio' },
    { key: 'nombre' as keyof ListadoMantenedor, header: 'Nombre' },
    { key: 'fechA_CREA' as keyof ListadoMantenedor, header: 'Fecha Creación' }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Mantenedor de Dependencias</title>
      </Helmet>
      <MenuMantenedores />
      <div className="table-responsive position-relative z-0 hide-scrollbar" >
        <div style={{ maxHeight: "80vh" }}>
          <div className="border-bottom shadow-sm p-4 rounded">
            <h3 className="form-title fw-semibold border-bottom p-1">Listado de Dependencias</h3>
            <Row>
              <Col xs={12} lg="auto" className="flex-grow-1 mb-lg-3 mb-1">

                <BusquedaTabla
                  value={terminoBusqueda}
                  onChange={setTerminoBusqueda}
                  isDarkMode={isDarkMode}
                />
              </Col>
              {/* Boton Agregar */}
              <Col xs={12} lg={1}>
                <div className="d-flex justify-content-center justify-content-lg-end">
                  <Button
                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                    className="p-2 mb-2 mb-sm-0 mx-sm-0 w-100 w-sm-auto"
                    onClick={() => setMostrarModalRegistrar(true)}
                  >
                    Nuevo
                    <Plus className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                  </Button>
                </div>
              </Col>

              <PageSizeSelector
                pageSize={pageSize}
                total={listadoMantenedor.length}
                totalFiltrados={totalRegistros}
                onChange={(size) => setPageSize(size)}
                isDarkMode={isDarkMode}
              />
            </Row>

            {/* Tabla */}
            {loading ? (
              <SkeletonLoader rowCount={10} />
            ) : (
              <TablaGenerica<ListadoMantenedor>
                data={elementosActuales}
                columns={columnas}
                isDarkMode={isDarkMode}
              // onEdit={(item) => handleSeleccion(item)}
              />
            )}
            {/* Paginador */}
            {/* Paginador */}
            {totalPaginas > 1 && (
              <div className="paginador-scroll mt-3">
                <ul className="pagination pagination-sm justify-content-center">
                  <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(1)}
                    >
                      Primera
                    </button>
                  </li>
                  <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(paginaActual - 1)}
                    >
                      Anterior
                    </button>
                  </li>

                  {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                    let pageNum;
                    if (totalPaginas <= 5) {
                      pageNum = i + 1;
                    } else if (paginaActual <= 3) {
                      pageNum = i + 1;
                    } else if (paginaActual >= totalPaginas - 2) {
                      pageNum = totalPaginas - 4 + i;
                    } else {
                      pageNum = paginaActual - 2 + i;
                    }

                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${paginaActual === pageNum ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPaginaActual(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}

                  <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(paginaActual + 1)}
                    >
                      Siguiente
                    </button>
                  </li>
                  <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(totalPaginas)}
                    >
                      Última
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
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
                    {/* <Plus className={("flex-shrink-0 h-5 w-5 ms-1")} aria-hidden="true" /> */}
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

    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listadoMantenedor: state.listadoMantenedorDependenciasReducers.listadoMantenedor,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  comboServicio: state.comboServicioMantenedorReducers.comboServicio,
  objeto: state.validaApiLoginReducers,
  nPaginacion: state.mostrarNPaginacionReducer.nPaginacion

});

export default connect(mapStateToProps, {
  listadoMantenedorDependenciasActions,
  registrarMantenedorDependenciasActions,
  comboServicioActions
})(Dependencias);
