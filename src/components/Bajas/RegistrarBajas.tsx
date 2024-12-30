import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Form, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";

import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { RootState } from "../../store";
import { registrarBajasActions } from "../../redux/actions/Bajas/registrarBajasActions";
import { listaBajasActions } from "../../redux/actions/Bajas/listaBajasActions";
import MenuBajas from "../Menus/MenuBajas";
import { Plus } from "react-bootstrap-icons";
import "../../styles/Layout.css";
import Layout from "../../containers/hocs/layout/Layout.tsx";

// interface FechasProps {
//   fechaInicio: string;
//   fechaTermino: string;
// }
export interface ListaBajas {
  bajaS_CORR: string;
  aF_CLAVE: number;
  id: number;
  vutiL_RESTANTE: number;
  vutiL_AGNOS: number;
  useR_MOD: number;
  saldO_VALOR: number;
  observaciones: string;
  nresolucion: number;
  ncuenta: string;
  iniciaL_VALOR: number;
  fechA_BAJA: string;
  especie: string;
  deP_ACUMULADA: number;
}

interface DatosBajas {
  listaBajas: ListaBajas[];
  listaBajasActions: () => Promise<boolean>;
  registrarBajasActions: (activos: { aF_CLAVE: number }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
}

const RegistrarBajas: React.FC<DatosBajas> = ({ listaBajas, listaBajasActions, registrarBajasActions, token, isDarkMode }) => {

  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [error, setError] = useState<Partial<ListaBajas>>({});
  //-------------Modal-------------//
  const [mostrarModal, setMostrarModal] = useState<number | null>(null);
  //------------Fin Modal----------//
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [filasSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  let indexReal = 0;//Indice para manejar el valor real de cada fila y para manejar check

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
          aF_CLAVE: listaBajas[activo].aF_CLAVE,
          bajaS_CORR: listaBajas[activo].bajaS_CORR,
          ...Bajas,
        }));
        const resultado = await registrarBajasActions(FormularioBajas);

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
          listaBajasActions();
          setFilaSeleccionada([]);
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
    listaABajasAuto();
  }, [listaBajasActions, token, listaBajas.length]); // Asegúrate de incluir dependencias relevantes

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
    console.log("indice", index);

  };

  const handleCerrarModal = (index: number) => {
    setFilaSeleccionada((prevSeleccionadas) =>
      prevSeleccionadas.filter((fila) => fila !== index.toString())
    );
    setMostrarModal(null); //Cierra modal del indice seleccionado
  };


  // const handleAgrearSeleccionados = async () => {
  //   const selectedIndices = filasSeleccionada.map(Number);
  //   const activosSeleccionados = selectedIndices.map((index) => {
  //     return {
  //       aF_CLAVE: listaBajas[index].aF_CLAVE
  //     };

  //   });
  //   const result = await Swal.fire({
  //     icon: "info",
  //     title: "Registrar Bajas",
  //     text: `Confirme para registrar las Bajas seleccionadas`,
  //     showDenyButton: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Confirmar y Registrar",

  //   });

  //   // selectedIndices.map(async (index) => {

  //   if (result.isConfirmed) {
  //     setLoadingRegistro(true);
  //     // const elemento = listaAltas[index].aF_CLAVE;
  //     // console.log("despues del confirm elemento", elemento);

  //     // const clavesSeleccionadas: number[] = selectedIndices.map((index) => listaAltas[index].aF_CLAVE);
  //     // console.log("Claves seleccionadas para registrar:", clavesSeleccionadas);
  //     // Crear un array de objetos con aF_CLAVE y nombre


  //     // console.log("Activos seleccionados para registrar:", activosSeleccionados);

  //     const resultado = await registrarBajasActions(activosSeleccionados);
  //     if (resultado) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Bajas Registradas",
  //         text: `Se han registrado correctamente las Bajas seleccionadas`,
  //       });
  //       setLoadingRegistro(false);
  //       listaBajasActions();
  //       setFilaSeleccionada([]);
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: ":'(",
  //         text: `Hubo un problema al registrar las Bajas`,
  //       });
  //       setLoadingRegistro(false);
  //     }

  //   }
  //   // })
  // };

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
  <p>Mostrar modal: {mostrarModal}</p>

  return (
    <Layout>
      <MenuBajas />
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">Bienes de Bajas</h3>
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
                  <th scope="col">Codigo</th>
                  <th scope="col">N° Inventario</th>
                  <th scope="col">Vidal últil</th>
                  <th scope="col">En años</th>
                  <th scope="col">N° Cuenta</th>
                  <th scope="col">Especie</th>
                  <th scope="col">Depreciación Acumulada</th>
                </tr>
              </thead>
              <tbody>
                {elementosActuales.map((ListaBajas, index) => {
                  indexReal = indicePrimerElemento + index; // Índice real basado en la página
                  return (
                    <tr key={indexReal}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => setSeleccionaFila(index)}
                          checked={filasSeleccionada.includes((indexReal).toString())}
                        />
                      </td>
                      <td>{ListaBajas.bajaS_CORR}</td>
                      <td>{ListaBajas.aF_CLAVE}</td>
                      <td>{ListaBajas.vutiL_RESTANTE}</td>
                      <td>{ListaBajas.vutiL_AGNOS}</td>
                      <td>{ListaBajas.ncuenta}</td>
                      <td>{ListaBajas.deP_ACUMULADA}</td>
                      <td>{ListaBajas.especie}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
                <div className="d-flex justify-content-end">
                  <Button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
                    Enviar a Bodega
                  </Button>
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
  listaBajas: state.datosListaBajasReducers.listaBajas,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  listaBajasActions,
  registrarBajasActions
})(RegistrarBajas);
