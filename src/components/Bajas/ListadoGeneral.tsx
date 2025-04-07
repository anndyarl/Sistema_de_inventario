import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Form, Modal } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuBajas from "../Menus/MenuBajas.tsx";
import { listadoGeneralBajasActions } from "../../redux/actions/Bajas/listadoGeneralBajasActions.tsx";
import { registrarBienesBajasActions } from "../../redux/actions/Bajas/registrarBienesBajasActions.tsx";
import { ListaBajas } from "./BienesBajas.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";
import { obtenerListaExcluidosActions } from "../../redux/actions/Bajas/obtenerListaExcluidosActions.tsx";

export interface ListadoGeneralBajas {
  aF_CLAVE: number;
  aF_CODIGO_GENERICO: string;
  aF_CODIGO_LARGO: string;
  deP_CORR: number;
  esP_CODIGO: string;
  aF_SECUENCIA: number;
  itE_CLAVE: number;
  aF_DESCRIPCION: string;
  aF_FINGRESO: string;
  aF_ESTADO: string;
  aF_CODIGO: string;
  aF_TIPO: string;
  aF_ALTA: string;
  aF_PRECIO_REF: number;
  aF_CANTIDAD: number;
  aF_ORIGEN: number;
  aF_RESOLUCION: string;
  aF_FECHA_SOLICITUD: string;
  aF_OCO_NUMERO_REF: string;
  usuariO_CREA: string;
  f_CREA: string;
  iP_CREA: string;
  usuariO_MOD: string;
  f_MOD: string;
  iP_MOD: string;
  aF_TIPO_DOC: string;
  prov_RUN: number;
  reG_EQM: string;
  aF_NUM_FAC: string;
  aF_FECHAFAC: string;
  aF_3UTM: string;
  iD_GRUPO: number;
  ctA_COD: string;
  transitoria: string;
  aF_MONTOFACTURA: number;
  esP_DESCOMPONE: string;
  aF_ETIQUETA: string;
  aF_VIDAUTIL: number;
  aF_VIGENTE: string;
  idprograma: number;
  idmodalidadcompra: number;
  idpropiedad: number;
  especie: string;
  aF_ESTADO_INV: number;
}

interface DatosBajas {
  listadoGeneralBajas: ListadoGeneralBajas[];
  listadoGeneralBajasActions: () => Promise<boolean>;
  obtenerListaExcluidosActions: (aF_CLAVE: string) => Promise<boolean>;
  registrarBienesBajasActions: (baja: { aF_CLAVE: number, usuariO_MOD: string, bajaS_CORR: number, especie: string, ctA_COD: string }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
  nPaginacion: number; //número de paginas establecido desde preferencias
}

const ListadoGeneral: React.FC<DatosBajas> = ({ listadoGeneralBajasActions, obtenerListaExcluidosActions, registrarBienesBajasActions, listadoGeneralBajas, token, isDarkMode, objeto, nPaginacion }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [error, setError] = useState<Partial<ListaBajas>>({});
  const [filasSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
  const [mostrarModal, setMostrarModal] = useState<number | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = nPaginacion;

  const [Bajas, setBajas] = useState({
    nresolucion: 0,
    observaciones: "",
    fechA_BAJA: ""
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Bajas.nresolucion) tempErrors.nresolucion = "Campo obligatorio.";
    if (!Bajas.fechA_BAJA) tempErrors.fechA_BAJA = "Campo obligatorio.";
    if (!Bajas.observaciones) tempErrors.observaciones = "Campo obligatorio.";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  //Se lista automaticamente apenas entra al componente
  const listadoGeneralBajasAuto = async () => {
    if (token) {
      if (listadoGeneralBajas.length === 0) {
        setLoading(true);
        const resultado = await listadoGeneralBajasActions();
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
    listadoGeneralBajasAuto()
  }, [listadoGeneralBajasActions, token, listadoGeneralBajas.length]); // Asegúrate de incluir dependencias relevantes

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Convierte `value` a número
    let newValue: string | number = ["nresolucion", "aF_CLAVE"].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;

    setBajas((preBajas) => ({
      ...preBajas,
      [name]: newValue,
    }));

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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      const selectedIndices = filasSeleccionada.map(Number);
      const result = await Swal.fire({
        icon: "info",
        title: "Enviar a Bienes de Bajas",
        text: "Confirme para enviar",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar y Enviar",
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
        const FormularioBajas = selectedIndices.map((activo) => ({
          aF_CLAVE: listadoGeneralBajas[activo].aF_CLAVE,
          usuariO_MOD: objeto.IdCredencial.toString(),
          bajaS_CORR: listadoGeneralBajas[activo].deP_CORR,
          especie: listadoGeneralBajas[activo].especie,
          ctA_COD: listadoGeneralBajas[activo].ctA_COD,
          ...Bajas,
        }));
        console.log(FormularioBajas);
        setLoadingRegistro(false);
        const resultado = await registrarBienesBajasActions(FormularioBajas);

        if (resultado) {
          Swal.fire({
            icon: "success",
            title: "Enviado a Bodega de Excluidos",
            text: "Se ha enviado correctamente",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });

          setLoadingRegistro(false);
          listadoGeneralBajasActions();
          obtenerListaExcluidosActions("");
          setFilaSeleccionada([]);
          elementosActuales.map((_, index) => (
            handleCerrarModal(index)
          ));

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

  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () =>
      listadoGeneralBajas.slice(indicePrimerElemento, indiceUltimoElemento),
    [listadoGeneralBajas, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listadoGeneralBajas)
    ? Math.ceil(listadoGeneralBajas.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  return (
    <Layout>
      <Helmet>
        <title>Listado General</title>
      </Helmet>
      <MenuBajas />
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">Listado General</h3>
        {/* Boton registrar filas seleccionadas */}
        {/* <div className="d-flex justify-content-end">
          {filasSeleccionada.length > 0 ? (
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
                    {filasSeleccionada.length}
                  </span>{" "}
                  {filasSeleccionada.length === 1 ? "Baja seleccionada" : "Bajas seleccionadas"}
                </>
              )}
            </Button>
          ) : (
            <strong className="alert alert-light border m-1 p-2 mx-2 text-muted">
              No hay bajas seleccionadas para registrar
            </strong>
          )}
        </div> */}
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
                  <th scope="col"></th>
                  <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                  <th scope="col" className="text-nowrap text-center">Código Genérico</th>
                  <th scope="col" className="text-nowrap text-center">Código Largo</th>
                  <th scope="col" className="text-nowrap text-center">DEP Corr</th>
                  <th scope="col" className="text-nowrap text-center">ESP Código</th>
                  <th scope="col" className="text-nowrap text-center">Secuencia</th>
                  <th scope="col" className="text-nowrap text-center">ITE Clave</th>
                  <th scope="col" className="text-nowrap text-center">Descripción</th>
                  <th scope="col" className="text-nowrap text-center">Fecha Ingreso</th>
                  <th scope="col" className="text-nowrap text-center">Estado</th>
                  <th scope="col" className="text-nowrap text-center">Código</th>
                  <th scope="col" className="text-nowrap text-center">Tipo</th>
                  <th scope="col" className="text-nowrap text-center">Alta</th>
                  <th scope="col" className="text-nowrap text-center">Precio Ref.</th>
                  <th scope="col" className="text-nowrap text-center">Cantidad</th>
                  <th scope="col" className="text-nowrap text-center">Origen</th>
                  <th scope="col" className="text-nowrap text-center">Resolución</th>
                  <th scope="col" className="text-nowrap text-center">Fecha Solicitud</th>
                  <th scope="col" className="text-nowrap text-center">Número Referencia</th>
                  <th scope="col" className="text-nowrap text-center">Usuario Creación</th>
                  <th scope="col" className="text-nowrap text-center">Fecha Creación</th>
                  <th scope="col" className="text-nowrap text-center">IP Creación</th>
                  <th scope="col" className="text-nowrap text-center">Usuario Modificación</th>
                  <th scope="col" className="text-nowrap text-center">Fecha Modificación</th>
                  <th scope="col" className="text-nowrap text-center">IP Modificación</th>
                  <th scope="col" className="text-nowrap text-center">Tipo Documento</th>
                  <th scope="col" className="text-nowrap text-center">Proveedor RUN</th>
                  <th scope="col" className="text-nowrap text-center">Reg EQM</th>
                  <th scope="col" className="text-nowrap text-center">Número Factura</th>
                  <th scope="col" className="text-nowrap text-center">Fecha Factura</th>
                  <th scope="col" className="text-nowrap text-center">UTM</th>
                  <th scope="col" className="text-nowrap text-center">ID Grupo</th>
                  <th scope="col" className="text-nowrap text-center">Nº Cuenta</th>
                  <th scope="col" className="text-nowrap text-center">Transitoria</th>
                  <th scope="col" className="text-nowrap text-center">Monto Factura</th>
                  <th scope="col" className="text-nowrap text-center">ESP Descompone</th>
                  <th scope="col" className="text-nowrap text-center">Etiqueta</th>
                  <th scope="col" className="text-nowrap text-center">Vida Útil</th>
                  <th scope="col" className="text-nowrap text-center">Vigente</th>
                  <th scope="col" className="text-nowrap text-center">ID Programa</th>
                  <th scope="col" className="text-nowrap text-center">ID Modalidad Compra</th>
                  <th scope="col" className="text-nowrap text-center">ID Propiedad</th>
                  <th scope="col" className="text-nowrap text-center">Especie</th>
                  <th scope="col" className="text-nowrap text-center">Estado Inventario</th>
                </tr>
              </thead>
              <tbody>
                {elementosActuales.map((Lista, index) => {
                  let indexReal = indicePrimerElemento + index; // Índice real basado en la página
                  return (
                    <tr key={indexReal}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => setSeleccionaFila(index)}
                          checked={filasSeleccionada.includes((indexReal).toString())}
                        />
                      </td>
                      <td className="text-nowrap text-center">{Lista.aF_CLAVE}</td>
                      <td className="text-nowrap text-center">{Lista.aF_CODIGO_GENERICO}</td>
                      <td className="text-nowrap text-center">{Lista.aF_CODIGO_LARGO}</td>
                      <td className="text-nowrap text-center">{Lista.deP_CORR}</td>
                      <td className="text-nowrap text-center">{Lista.esP_CODIGO}</td>
                      <td className="text-nowrap text-center">{Lista.aF_SECUENCIA}</td>
                      <td className="text-nowrap text-center">{Lista.itE_CLAVE}</td>
                      <td className="text-nowrap text-center">{Lista.aF_DESCRIPCION}</td>
                      <td className="text-nowrap text-center">{Lista.aF_FINGRESO}</td>
                      <td className="text-nowrap text-center">{Lista.aF_ESTADO}</td>
                      <td className="text-nowrap text-center">{Lista.aF_CODIGO}</td>
                      <td className="text-nowrap text-center">{Lista.aF_TIPO}</td>
                      <td className="text-nowrap text-center">{Lista.aF_ALTA}</td>
                      <td className="text-nowrap text-center">{Lista.aF_PRECIO_REF}</td>
                      <td className="text-nowrap text-center">{Lista.aF_CANTIDAD}</td>
                      <td className="text-nowrap text-center">{Lista.aF_ORIGEN}</td>
                      <td className="text-nowrap text-center">{Lista.aF_RESOLUCION}</td>
                      <td className="text-nowrap text-center">{Lista.aF_FECHA_SOLICITUD}</td>
                      <td className="text-nowrap text-center">{Lista.aF_OCO_NUMERO_REF}</td>
                      <td className="text-nowrap text-center">{Lista.usuariO_CREA}</td>
                      <td className="text-nowrap text-center">{Lista.f_CREA}</td>
                      <td className="text-nowrap text-center">{Lista.iP_CREA}</td>
                      <td className="text-nowrap text-center">{Lista.usuariO_MOD}</td>
                      <td className="text-nowrap text-center">{Lista.f_MOD}</td>
                      <td className="text-nowrap text-center">{Lista.iP_MOD}</td>
                      <td className="text-nowrap text-center">{Lista.aF_TIPO_DOC}</td>
                      <td className="text-nowrap text-center">{Lista.prov_RUN}</td>
                      <td className="text-nowrap text-center">{Lista.reG_EQM}</td>
                      <td className="text-nowrap text-center">{Lista.aF_NUM_FAC}</td>
                      <td className="text-nowrap text-center">{Lista.aF_FECHAFAC}</td>
                      <td className="text-nowrap text-center">{Lista.aF_3UTM}</td>
                      <td className="text-nowrap text-center">{Lista.iD_GRUPO}</td>
                      <td className="text-nowrap text-center">{Lista.ctA_COD}</td>
                      <td className="text-nowrap text-center">{Lista.transitoria}</td>
                      <td className="text-nowrap text-center">{Lista.aF_MONTOFACTURA}</td>
                      <td className="text-nowrap text-center">{Lista.esP_DESCOMPONE}</td>
                      <td className="text-nowrap text-center">{Lista.aF_ETIQUETA}</td>
                      <td className="text-nowrap text-center">{Lista.aF_VIDAUTIL}</td>
                      <td className="text-nowrap text-center">{Lista.aF_VIGENTE}</td>
                      <td className="text-nowrap text-center">{Lista.idprograma}</td>
                      <td className="text-nowrap text-center">{Lista.idmodalidadcompra}</td>
                      <td className="text-nowrap text-center">{Lista.idpropiedad}</td>
                      <td className="text-nowrap text-center">{Lista.especie}</td>
                      <td className="text-nowrap text-center">{Lista.aF_ESTADO_INV}</td>
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
      {elementosActuales.map((_, index) => (
        <div key={index}>
          <Modal
            show={mostrarModal === index}
            onHide={() => handleCerrarModal(index)}
            dialogClassName="modal-right" // Clase personalizada
          // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
          // keyboard={false}     // Evita el cierre al presionar la tecla Esc
          >
            <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
              <Modal.Title className="fw-semibold">Complete los detalles de registro</Modal.Title>
            </Modal.Header>
            <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
              <form onSubmit={handleSubmit}>
                {/* <div className="d-flex justify-content-end">
                  <Button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
                    Enviar a Bodega
                  </Button>
                </div> */}
                <div className="d-flex justify-content-end">
                  {filasSeleccionada.length > 0 ? (
                    <Button
                      variant="primary"
                      type="submit"
                      className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                      disabled={loadingRegistro}  // Desactiva el botón mientras carga
                    >
                      {loadingRegistro ? (
                        <>
                          {" Enviando... "}
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
                          Enviar a Bodega de Excluidos
                        </>
                      )}
                    </Button>
                  ) : (
                    <strong className="alert alert-light border m-1 p-2 mx-2 text-muted">
                      No hay bajas seleccionadas para registrar
                    </strong>
                  )}
                </div>
                <div className="mb-1">
                  <label htmlFor="nresolucion" className="fw-semibold">
                    Nº Certificado
                  </label>
                  <input
                    aria-label="nresolucion"
                    type="text"
                    className={`form-select ${error.nresolucion ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="nresolucion"
                    maxLength={100}
                    onChange={handleChange}
                    value={Bajas.nresolucion}
                  />
                  {error.nresolucion && (
                    <div className="invalid-feedback fw-semibold">{error.nresolucion}</div>
                  )}
                </div>
                <div className="mb-1">
                  <label htmlFor="fechA_BAJA" className="fw-semibold">
                    Fecha Baja
                  </label>
                  <input
                    aria-label="fechA_BAJA"
                    type="date"
                    className={`form-select ${error.fechA_BAJA ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="fechA_BAJA"
                    onChange={handleChange}
                    value={Bajas.fechA_BAJA}
                  />
                  {error.fechA_BAJA && (
                    <div className="invalid-feedback fw-semibold">{error.fechA_BAJA}</div>
                  )}
                </div>
                <div className="mb-1">
                  <label htmlFor="observaciones" className="fw-semibold">
                    Observaciones
                  </label>
                  <textarea
                    className={`form-select ${error.observaciones ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    aria-label="observaciones"
                    name="observaciones"
                    rows={4}
                    onChange={handleChange}
                    value={Bajas.observaciones}
                  />
                  {error.observaciones && (
                    <div className="invalid-feedback fw-semibold">
                      {error.observaciones}
                    </div>
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
  listadoGeneralBajas: state.datosListadoGeneralBajasReducers.listadoGeneralBajas,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers,
  nPaginacion: state.mostrarNPaginacionReducer.nPaginacion
});

export default connect(mapStateToProps, {
  listadoGeneralBajasActions,
  obtenerListaExcluidosActions,
  registrarBienesBajasActions
})(ListadoGeneral);
