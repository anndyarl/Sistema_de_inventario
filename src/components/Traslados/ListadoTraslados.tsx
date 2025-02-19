import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Modal } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { registrarMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/registrarMantenedorDependenciasActions.tsx";
import { Plus } from "react-bootstrap-icons";
import { Objeto } from "../Navegacion/Profile.tsx";
import { Helmet } from "react-helmet-async";

import MenuTraslados from "../Menus/MenuTraslados.tsx";
import { listadoTrasladosActions } from "../../redux/actions/Traslados/listadoTrasladosActions.tsx";

export interface listadoTraslados {
  usuariO_MOD: string,
  usuariO_CREA: string,
  traS_OBS: string,
  traS_NOM_RECIBE: string,
  traS_NOM_ENTREGA: string,
  traS_NOM_AUTORIZA: string,
  traS_MEMO_REF: string,
  traS_FECHA_MEMO: number,
  traS_FECHA: string,
  traS_ESTADO_AF: string,
  traS_DET_CORR: number,
  traS_CORR: number,
  traS_CO_REAL: number,
  n_TRASLADO: number,
  iP_MOD: string,
  iP_CREA: string,
  f_MOD: number,
  f_CREA: number,
  estaD_D: number,
  deP_CORR_ORIGEN: number,
  deP_CORR: number,
  aF_CLAVE: number
}

interface GeneralProps {
  listadoTraslados: listadoTraslados[];
  listadoTrasladosActions: () => Promise<boolean>;
  registrarMantenedorDependenciasActions: (formModal: Record<string, any>) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const ListadoTraslados: React.FC<GeneralProps> = ({ listadoTraslados, listadoTrasladosActions, registrarMantenedorDependenciasActions, token, isDarkMode, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Partial<listadoTraslados>>({});
  const [_, setFilaSeleccionada] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 12;
  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => listadoTraslados.slice(indicePrimerElemento, indiceUltimoElemento),
    [listadoTraslados, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listadoTraslados)
    ? Math.ceil(listadoTraslados.length / elementosPorPagina)
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
  const listadoTrasladosAuto = async () => {
    if (token) {
      if (listadoTraslados.length === 0) {
        setLoading(true);
        const resultado = await listadoTrasladosActions();
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
    listadoTrasladosAuto()
  }, [listadoTrasladosActions, token, listadoTraslados.length]); // Asegúrate de incluir dependencias relevantes

  // const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;

  //   // Convierte `value` a número
  //   let newValue: string | number = ["seR_COD"].includes(name)
  //     ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
  //     : value;

  //   setMantenedor((preBajas) => ({
  //     ...preBajas,
  //     [name]: newValue,
  //   }));
  // };

  // const setSeleccionaFila = (index: number) => {
  //   setMostrarModal(index); //Abre modal del indice seleccionado
  //   setFilaSeleccionada((prev) =>
  //     prev.includes(index.toString())
  //       ? prev.filter((rowIndex) => rowIndex !== index.toString())
  //       : [...prev, index.toString()]
  //   );
  // };

  // const handleCerrarModal = (index: number) => {
  //   setFilaSeleccionada((prevSeleccionadas) =>
  //     prevSeleccionadas.filter((fila) => fila !== index.toString())
  //   );
  //   setMostrarModal(null); //Cierra modal del indice seleccionado
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (validate()) {

  //     const result = await Swal.fire({
  //       icon: "info",
  //       title: "Registrar",
  //       text: "Confirme para registrar una nueva dependencia",
  //       showDenyButton: false,
  //       showCancelButton: true,
  //       confirmButtonText: "Confirmar",
  //       background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //       color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //       confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
  //       customClass: {
  //         popup: "custom-border", // Clase personalizada para el borde
  //       }
  //     });
  //     if (result.isConfirmed) {
  //       const resultado = await registrarMantenedorDependenciasActions(Mantenedor);
  //       console.log(Mantenedor);
  //       if (resultado) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Registro Exitoso",
  //           text: "Se ha agregado una nueva dependencia",
  //           background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //           color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //           confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
  //           customClass: {
  //             popup: "custom-border", // Clase personalizada para el borde
  //           }
  //         });
  //         listadoTrasladosActions();
  //         setFilaSeleccionada([]);

  //       } else {
  //         Swal.fire({
  //           icon: "error",
  //           title: ":'(",
  //           text: "Hubo un problema al registrar",
  //           background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //           color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //           confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
  //           customClass: {
  //             popup: "custom-border", // Clase personalizada para el borde
  //           }
  //         });
  //       }
  //     }
  //   }
  // };

  return (
    <Layout>
      <Helmet>
        <title>Listado de Traslados</title>
      </Helmet>
      <MenuTraslados />
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">Listado de Traslados</h3>
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
                  <th scope="col" className="text-nowrap">N° Traslado</th>
                  <th scope="col" className="text-nowrap">Fecha Traslado</th>
                  <th scope="col" className="text-nowrap">Clave Activo Fijo</th>
                  <th scope="col" className="text-nowrap">Dependencia</th>
                  <th scope="col" className="text-nowrap">Memo de Referencia</th>
                  <th scope="col" className="text-nowrap">Fecha Memo</th>
                  <th scope="col" className="text-nowrap">Observaciones</th>
                  <th scope="col" className="text-nowrap">Nombre Entrega</th>
                  <th scope="col" className="text-nowrap">Nombre Recibe</th>
                  <th scope="col" className="text-nowrap">Estado Activo Fijo</th>
                  <th scope="col" className="text-nowrap">Dependencia Origen</th>
                  <th scope="col" className="text-nowrap">Detalle de Traslado</th>
                  <th scope="col" className="text-nowrap">Usuario Crea</th>
                  <th scope="col" className="text-nowrap">Fecha Creación</th>
                  <th scope="col" className="text-nowrap">IP Creación</th>
                  <th scope="col" className="text-nowrap">Usuario Modifica</th>
                  <th scope="col" className="text-nowrap">Fecha Modificación</th>
                  <th scope="col" className="text-nowrap">IP Modificación</th>
                  <th scope="col" className="text-nowrap">Número de Traslado</th>
                  <th scope="col" className="text-nowrap">Código Real Traslado</th>
                  <th scope="col" className="text-nowrap">Nombre Autoriza</th>
                  <th scope="col" className="text-nowrap">Establecimiento</th>
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
                      <td>{Lista.traS_CORR}</td>
                      <td>{Lista.traS_FECHA}</td>
                      <td>{Lista.aF_CLAVE}</td>
                      <td>{Lista.deP_CORR}</td>
                      <td>{Lista.traS_MEMO_REF}</td>
                      <td>{Lista.traS_FECHA_MEMO}</td>
                      <td>{Lista.traS_OBS}</td>
                      <td>{Lista.traS_NOM_ENTREGA}</td>
                      <td>{Lista.traS_NOM_RECIBE}</td>
                      <td>{Lista.traS_ESTADO_AF}</td>
                      <td>{Lista.deP_CORR_ORIGEN}</td>
                      <td>{Lista.traS_DET_CORR}</td>
                      <td>{Lista.usuariO_CREA}</td>
                      <td>{Lista.f_CREA}</td>
                      <td>{Lista.iP_CREA}</td>
                      <td>{Lista.usuariO_MOD}</td>
                      <td>{Lista.f_MOD}</td>
                      <td>{Lista.iP_MOD}</td>
                      <td>{Lista.n_TRASLADO}</td>
                      <td>{Lista.traS_CO_REAL}</td>
                      <td>{Lista.traS_NOM_AUTORIZA}</td>
                      <td>{Lista.estaD_D}</td>

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
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listadoTraslados: state.listadoTrasladosReducers.listadoTraslados,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  comboServicio: state.comboServicioReducer.comboServicio,
  objeto: state.validaApiLoginReducers

});

export default connect(mapStateToProps, {
  listadoTrasladosActions,
  registrarMantenedorDependenciasActions,
})(ListadoTraslados);
