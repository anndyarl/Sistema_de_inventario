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
  registrarBienesBajasActions: (baja: { aF_CLAVE: number, usuariO_MOD: string, bajaS_CORR: number, especie: string, ctA_COD: string }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
}

const ListadoGeneral: React.FC<DatosBajas> = ({ listadoGeneralBajas, listadoGeneralBajasActions, registrarBienesBajasActions, token, isDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [error, setError] = useState<Partial<ListaBajas>>({});
  const [filasSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
  const [mostrarModal, setMostrarModal] = useState<number | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const [Bajas, setBajas] = useState({
    nresolucion: 0,
    observaciones: "",
    fechA_BAJA: ""
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Bajas.nresolucion) tempErrors.nresolucion = "Número de resolución es obligatorio.";
    if (!Bajas.fechA_BAJA) tempErrors.fechA_BAJA = "Fecha de Baja es obligatorio.";
    if (!Bajas.observaciones) tempErrors.observaciones = "Obervacion es obligatoria.";

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
    let newValue: string | number = ["nresolucion"].includes(name)
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
        title: "Enviar a Bodega de Excluidos",
        text: "Confirme para enviar a Bodega de Exlcuidos",
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
          usuariO_MOD: "123",
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
            text: "Se han enviado su seleccion a Bodega de Exluidos correctamente",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });

          setLoadingRegistro(false);
          listadoGeneralBajasActions();
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
                  <th scope="col">Clave</th>
                  <th scope="col">Código Genérico</th>
                  <th scope="col">Código Largo</th>
                  <th scope="col">DEP Corr</th>
                  <th scope="col">ESP Código</th>
                  <th scope="col">Secuencia</th>
                  <th scope="col">ITE Clave</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Fecha Ingreso</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Código</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Alta</th>
                  <th scope="col">Precio Ref.</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Origen</th>
                  <th scope="col">Resolución</th>
                  <th scope="col">Fecha Solicitud</th>
                  <th scope="col">Número Referencia</th>
                  <th scope="col">Usuario Creación</th>
                  <th scope="col">Fecha Creación</th>
                  <th scope="col">IP Creación</th>
                  <th scope="col">Usuario Modificación</th>
                  <th scope="col">Fecha Modificación</th>
                  <th scope="col">IP Modificación</th>
                  <th scope="col">Tipo Documento</th>
                  <th scope="col">Proveedor RUN</th>
                  <th scope="col">Reg EQM</th>
                  <th scope="col">Número Factura</th>
                  <th scope="col">Fecha Factura</th>
                  <th scope="col">UTM</th>
                  <th scope="col">ID Grupo</th>
                  <th scope="col">Nº Cuenta</th>
                  <th scope="col">Transitoria</th>
                  <th scope="col">Monto Factura</th>
                  <th scope="col">ESP Descompone</th>
                  <th scope="col">Etiqueta</th>
                  <th scope="col">Vida Útil</th>
                  <th scope="col">Vigente</th>
                  <th scope="col">ID Programa</th>
                  <th scope="col">ID Modalidad Compra</th>
                  <th scope="col">ID Propiedad</th>
                  <th scope="col">Especie</th>
                  <th scope="col">Estado Inventario</th>
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
                      <td>{Lista.aF_CLAVE}</td>
                      <td>{Lista.aF_CODIGO_GENERICO}</td>
                      <td>{Lista.aF_CODIGO_LARGO}</td>
                      <td>{Lista.deP_CORR}</td>
                      <td>{Lista.esP_CODIGO}</td>
                      <td>{Lista.aF_SECUENCIA}</td>
                      <td>{Lista.itE_CLAVE}</td>
                      <td>{Lista.aF_DESCRIPCION}</td>
                      <td>{Lista.aF_FINGRESO}</td>
                      <td>{Lista.aF_ESTADO}</td>
                      <td>{Lista.aF_CODIGO}</td>
                      <td>{Lista.aF_TIPO}</td>
                      <td>{Lista.aF_ALTA}</td>
                      <td>{Lista.aF_PRECIO_REF}</td>
                      <td>{Lista.aF_CANTIDAD}</td>
                      <td>{Lista.aF_ORIGEN}</td>
                      <td>{Lista.aF_RESOLUCION}</td>
                      <td>{Lista.aF_FECHA_SOLICITUD}</td>
                      <td>{Lista.aF_OCO_NUMERO_REF}</td>
                      <td>{Lista.usuariO_CREA}</td>
                      <td>{Lista.f_CREA}</td>
                      <td>{Lista.iP_CREA}</td>
                      <td>{Lista.usuariO_MOD}</td>
                      <td>{Lista.f_MOD}</td>
                      <td>{Lista.iP_MOD}</td>
                      <td>{Lista.aF_TIPO_DOC}</td>
                      <td>{Lista.prov_RUN}</td>
                      <td>{Lista.reG_EQM}</td>
                      <td>{Lista.aF_NUM_FAC}</td>
                      <td>{Lista.aF_FECHAFAC}</td>
                      <td>{Lista.aF_3UTM}</td>
                      <td>{Lista.iD_GRUPO}</td>
                      <td>{Lista.ctA_COD}</td>
                      <td>{Lista.transitoria}</td>
                      <td>{Lista.aF_MONTOFACTURA}</td>
                      <td>{Lista.esP_DESCOMPONE}</td>
                      <td>{Lista.aF_ETIQUETA}</td>
                      <td>{Lista.aF_VIDAUTIL}</td>
                      <td>{Lista.aF_VIGENTE}</td>
                      <td>{Lista.idprograma}</td>
                      <td>{Lista.idmodalidadcompra}</td>
                      <td>{Lista.idpropiedad}</td>
                      <td>{Lista.especie}</td>
                      <td>{Lista.aF_ESTADO_INV}</td>
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
      {/* Modal formulario Registro Bajas*/}
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
                          Enviar a Bajas
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
                    Nª Resolución
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
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  listadoGeneralBajasActions,
  registrarBienesBajasActions
})(ListadoGeneral);
