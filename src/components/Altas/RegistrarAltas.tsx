import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Form } from "react-bootstrap";
import { RootState } from "../../store";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import Swal from "sweetalert2";
import { listaAltasActions } from "../../redux/actions/Altas/AnularAltas/listaAltasActions";
import { registrarAltasActions } from "../../redux/actions/Altas/RegistrarAltas/registrarAltasActions";
import MenuAltas from "../Menus/MenuAltas";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";

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
  precio: string,
  mrecepcion: string
}
interface DatosAltas {
  listaAltas: ListaAltas[];
  listaAltasActions: (establ_corr: number) => Promise<boolean>;
  registrarAltasActions: (activos: { aF_CLAVE: number }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto;
}

const RegistrarAltas: React.FC<DatosAltas> = ({ listaAltas, objeto, listaAltasActions, registrarAltasActions, token, isDarkMode }) => {
  // const [error, setError] = useState<Partial<FechasProps> & {}>({});


  const [loading, setLoading] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 12;

  useEffect(() => {
    const listaAltasAuto = async () => {
      if (token) {
        if (listaAltas.length === 0) {
          setLoading(true);
          const resultado = await listaAltasActions(objeto.Establecimiento);
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
    listaAltasAuto();
  }, [listaAltasActions, token, listaAltas.length]); // Asegúrate de incluir dependencias relevantes

  // const validate = () => {
  //   let tempErrors: Partial<any> & {} = {};
  //   // Validación para N° de Recepción (debe ser un número)
  //   if (!Inventario.fechaInicio) tempErrors.fechaInicio = "La Fecha de Inicio es obligatoria.";
  //   if (!Inventario.fechaTermino) tempErrors.fechaTermino = "La Fecha de Término es obligatoria.";
  //   if (Inventario.fechaInicio > Inventario.fechaTermino) tempErrors.fechaInicio = "La fecha de inicio es mayor a la fecha de término";
  //   // if (!Inventario.nInventario) tempErrors.nInventario = "La Fecha de Inicio es obligatoria.";


  //   setError(tempErrors);
  //   return Object.keys(tempErrors).length === 0;
  // };
  // const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   let newValue: string | number = [
  //     "aF_CLAVE"

  //   ].includes(name)
  //     ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
  //     : value;

  //   setInventario((prevState) => ({
  //     ...prevState,
  //     [name]: newValue,
  //   }));

  //   setInventario((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  // const handleBuscarAltas = async () => {
  //   let resultado = false;

  //   setLoading(true);
  //   if (Inventario.aF_CLAVE != 0) {
  //     resultado = await obtenerAltasPorCorrActions(Inventario.aF_CLAVE);
  //   }
  //   if (Inventario.fechaInicio != "" && Inventario.fechaTermino != "") {
  //     if (validate()) {
  //       resultado = await obtenerListaAltasActions(Inventario.fechaInicio, Inventario.fechaTermino);
  //     }
  //   }
  //   setInventario((prevState) => ({
  //     ...prevState,
  //     aF_CLAVE: 0,
  //     fechaInicio: "",
  //     fechaTermino: ""
  //   }));
  //   setError({});
  //   if (!resultado) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "No se encontraron resultados para la busqueda",
  //       confirmButtonText: "Ok",
  //     });
  //     setLoading(false); //Finaliza estado de carga
  //     return;
  //   } else {
  //     setLoading(false); //Finaliza estado de carga
  //   }

  // };

  // const handleRegistrar = async (index: number, aF_CLAVE: number) => {
  //   setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));

  //   const result = await Swal.fire({
  //     icon: "warning",
  //     title: "Registrar Altas",
  //     text: `Confirmar Alta del Nº de registro ${aF_CLAVE}`,
  //     showDenyButton: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Confirmar y Registrar",
  //   });

  //   if (result.isConfirmed) {
  //     const resultado = await registrarAltasActions(aF_CLAVE);
  //     if (resultado) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Registro exitoso",
  //         text: `Se ha registrado el Alta ${aF_CLAVE} correctamente`,
  //       });
  //       listaAltasAuto();
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: `Hubo un problema al registrar el Alta seleccionado Nª ${aF_CLAVE}.`,
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
        aF_CLAVE: listaAltas[index].aF_CLAVE
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

      const resultado = await registrarAltasActions(activosSeleccionados);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Altas Registradas",
          text: `Se han registrado correctamente las Altas seleccionadas`,
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        setLoadingRegistro(false);
        listaAltasActions(objeto.Establecimiento);
        setFilasSeleccionadas([]);
      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: `Hubo un problema al registrar las Altas`,
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
                <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                  <tr>
                    <th >
                      <Form.Check
                        type="checkbox"
                        onChange={handleSeleccionaTodos}
                        checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                      />
                    </th>
                    <th scope="col" className="text-nowrap text-center">Codigo</th>
                    <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                    <th scope="col" className="text-nowrap text-center">Servicio</th>
                    <th scope="col" className="text-nowrap text-center">Dependencia</th>
                    <th scope="col" className="text-nowrap text-center">Especie</th>
                    <th scope="col" className="text-nowrap text-center">N° Cuenta</th>
                    <th scope="col" className="text-nowrap text-center">Marca</th>
                    <th scope="col" className="text-nowrap text-center">Modelo</th>
                    <th scope="col" className="text-nowrap text-center">Serie</th>
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
                        <td>
                          <Form.Check
                            type="checkbox"
                            onChange={() => setSeleccionaFilas(index)}
                            checked={filasSeleccionadas.includes(indexReal.toString())} // Verifica con el índice real
                          />
                        </td>
                        <td className="text-nowrap text-center">{Lista.aF_CLAVE}</td>
                        <td className="text-nowrap text-center">{Lista.ninv}</td>
                        <td className="text-nowrap text-center">{Lista.serv}</td>
                        <td className="text-nowrap text-center">{Lista.dep}</td>
                        <td className="text-nowrap text-center">{Lista.esp}</td>
                        <td className="text-nowrap text-center">{Lista.ncuenta}</td>
                        <td className="text-nowrap text-center">{Lista.marca}</td>
                        <td className="text-nowrap text-center">{Lista.modelo}</td>
                        <td className="text-nowrap text-center">{Lista.serie}</td>
                        <td className="text-nowrap text-center">{Lista.precio}</td>
                        <td className="text-nowrap text-center">{Lista.mrecepcion}</td>
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
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listaAltas: state.datosListaAltasReducers.listaAltas,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  listaAltasActions,
  registrarAltasActions
})(RegistrarAltas);
