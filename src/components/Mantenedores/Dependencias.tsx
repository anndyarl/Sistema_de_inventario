import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Form, Modal } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { registrarMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/registrarMantenedorDependenciasActions.tsx";

import MenuMantenedores from "../Menus/MenuMantenedores.tsx";
import { listadoMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/listadoMantenedorDependenciasActions.tsx";

export interface ListadoDependencia {
  deP_CORR: number;
  deP_COD: string;
  seR_COD: string;
  nombre: string;
  vig: string;
  usuario: string;
  ip: string;
  num: number;
  fechA_CREA: string;
  id: number;
}

interface GeneralProps {
  listadoMantenedor: ListadoDependencia[];
  listadoMantenedorDependenciasActions: () => Promise<boolean>;
  registrarMantenedorDependenciasActions: (formModal: Record<string, any>) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
}

const Dependencias: React.FC<GeneralProps> = ({ listadoMantenedor, listadoMantenedorDependenciasActions, token, isDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRegistro, __] = useState(false);
  const [_, setError] = useState<Partial<ListadoDependencia>>({});
  const [filasSeleccionada, setFilaSeleccionada] = useState<string[]>([]);
  const [mostrarModal, setMostrarModal] = useState<number | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const [Mantenedor, ___] = useState({
    deP_CORR: 0,
    deP_COD: "",
    seR_COD: "",
    nombre: "",
    vig: "",
    usuario: "",
    ip: "",
    num: 0,
    fechA_CREA: "",
    id: 0,
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Mantenedor.deP_CORR) tempErrors.nresolucion = "Número de resolución es obligatorio.";
    if (!Mantenedor.deP_COD) tempErrors.fechA_BAJA = "Fecha de Baja es obligatorio.";
    if (!Mantenedor.nombre) tempErrors.observaciones = "Obervacion es obligatoria.";

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
  }, [listadoMantenedorDependenciasActions, token, listadoMantenedor.length]); // Asegúrate de incluir dependencias relevantes

  // const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   // Convierte `value` a número
  //   let newValue: string | number = ["nresolucion"].includes(name)
  //     ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
  //     : value;

  //   setMantenedor((preBajas) => ({
  //     ...preBajas,
  //     [name]: newValue,
  //   }));

  // };

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
      // const selectedIndices = filasSeleccionada.map(Number);
      // const result = await Swal.fire({
      //   icon: "info",
      //   title: "Enviar a Bodega de Excluidos",
      //   text: "Confirme para enviar a Bodega de Exlcuidos",
      //   showDenyButton: false,
      //   showCancelButton: true,
      //   confirmButtonText: "Confirmar y Enviar",
      //   background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      //   color: `${isDarkMode ? "#ffffff" : "000000"}`,
      //   confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      //   customClass: {
      //     popup: "custom-border", // Clase personalizada para el borde
      //   }
      // });
      // if (result.isConfirmed) {
      //   setLoadingRegistro(true);
      //   // Crear un array de objetos con aF_CLAVE y nombre
      //   const FormularioBajas = selectedIndices.map((activo) => ({
      //     aF_CLAVE: listadoMantenedor[activo].aF_CLAVE,
      //     usuariO_MOD: "123",
      //     bajaS_CORR: listadoMantenedor[activo].deP_CORR,
      //     especie: listadoMantenedor[activo].especie,
      //     ctA_COD: listadoMantenedor[activo].ctA_COD,
      //     ...Bajas,
      //   }));
      //   console.log(FormularioBajas);
      //   setLoadingRegistro(false);
      //   const resultado = await registrarMantenedorDependenciasActions(FormularioBajas);

      //   if (resultado) {
      //     Swal.fire({
      //       icon: "success",
      //       title: "Enviado a Bodega de Excluidos",
      //       text: "Se han enviado su seleccion a Bodega de Exluidos correctamente",
      //       background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      //       color: `${isDarkMode ? "#ffffff" : "000000"}`,
      //       confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      //       customClass: {
      //         popup: "custom-border", // Clase personalizada para el borde
      //       }
      //     });

      //     setLoadingRegistro(false);
      //     listadoMantenedorActions();
      //     setFilaSeleccionada([]);
      //     elementosActuales.map((_, index) => (
      //       handleCerrarModal(index)
      //     ));

      //   } else {
      //     Swal.fire({
      //       icon: "error",
      //       title: ":'(",
      //       text: "Hubo un problema al registrar",
      //       background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      //       color: `${isDarkMode ? "#ffffff" : "000000"}`,
      //       confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      //       customClass: {
      //         popup: "custom-border", // Clase personalizada para el borde
      //       }
      //     });
      //     setLoadingRegistro(false);
      //   }
      // }
    }
  };

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

  return (
    <Layout>
      <MenuMantenedores />
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">Listado de Dependencias</h3>

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
                  <th scope="col">Codigo Correlativo</th>
                  <th scope="col">Código Dependencia</th>
                  <th scope="col">Código Servicio</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Vigencia</th>
                  <th scope="col">IP</th>
                  <th scope="col">Fecha de Creación</th>
                  <th scope="col">ID</th>
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
                      <td>{Lista.deP_CORR}</td>
                      <td>{Lista.deP_COD}</td>
                      <td>{Lista.seR_COD}</td>
                      <td>{Lista.nombre}</td>
                      <td>{Lista.vig}</td>
                      <td>{Lista.ip}</td>
                      <td>{Lista.fechA_CREA}</td>
                      <td>{Lista.id}</td>
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
      {/* Modal formulario Registro*/}
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
              <Modal.Title className="fw-semibold">Registrar</Modal.Title>
            </Modal.Header>
            <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
              <form onSubmit={handleSubmit}>
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
                          Enviar
                        </>
                      )}
                    </Button>
                  ) : (
                    <strong className="alert alert-light border m-1 p-2 mx-2 text-muted">
                      No hay selecciones a registrar
                    </strong>
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
  listadoMantenedor: state.listadoMantenedorDependenciasReducers.listadoMantenedorDependencias,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  listadoMantenedorDependenciasActions,
  registrarMantenedorDependenciasActions
})(Dependencias);
