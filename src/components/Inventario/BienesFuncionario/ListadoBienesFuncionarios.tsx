import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Form, Row, Col } from "react-bootstrap";
import { RootState } from "../../../store.ts";
import { connect } from "react-redux";
import Layout from "../../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../../Utils/SkeletonLoader.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../../Navegacion/Profile.tsx";
import { Search } from "react-bootstrap-icons";
import { listadoBienesFuncionariosActions } from "../../../redux/actions/Inventario/RegistroBienesFuncionario/listadoBienesFuncionariosActions.tsx";
import MenuInventario from "../../Menus/MenuInventario.tsx";


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
  ctA_COD: string;
  iniciaL_VALOR: number;
  fechA_BAJA: string;
  esP_NOMBRE: string;
  deP_ACUMULADA: number;
  aF_FINGRESO: string;
  serv: string;
  dep: string;
}

export interface ListadoBienesFuncionarios {
  aF_CODIGO_GENERICO: string;
  ruT_FUNCIONARIO: string;
  deP_CORR: number;
  seR_CORR: number;
  seR_DEP: string;
  comprobantE_PAGO: string;
  autorizacion: string;
  imageN_COMPROBANTE_PAGO: string;
}

interface DatosBajas {
  listadoBienesFuncionarios: ListadoBienesFuncionarios[];
  listadoBienesFuncionariosActions: (establ_corr: number) => Promise<boolean>;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const ListadoBienesFuncionarios: React.FC<DatosBajas> = ({ listadoBienesFuncionariosActions, listadoBienesFuncionarios, isDarkMode, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
  const elementosPorPagina = Paginacion.nPaginacion;
  const [busquedaCodigoGenerico, setBusquedaCodigoGenerico] = useState("");
  const [busquedaAltas, setBusquedaAltas] = useState("");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");


  const datosFiltrados = useMemo(() => {
    if (!terminoBusqueda.trim()) {
      return listadoBienesFuncionarios;
    }

    const termino = terminoBusqueda.toLowerCase();
    return listadoBienesFuncionarios.filter((item) => {
      // Función auxiliar para convertir código de usuario a nombre

      return (
        item.aF_CODIGO_GENERICO.toString().includes(termino) ||
        item.ruT_FUNCIONARIO.toString().includes(termino) ||
        item.seR_DEP.toLowerCase().includes(termino)
      );
    });
  }, [listadoBienesFuncionarios, terminoBusqueda]);


  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaCodigoGenerico, busquedaAltas]);


  //Se lista automaticamente apenas entra al componente
  const listadoBienesFuncionariosAuto = async () => {

    if (listadoBienesFuncionarios.length === 0) {
      setLoading(true);
      const resultado = await listadoBienesFuncionariosActions(objeto.Roles[0].codigoEstablecimiento);
      if (resultado) {
        setLoading(false);
      }
      else {
        Swal.fire({
          icon: "warning",
          title: "Sin resultados",
          text: "No hay registros disponibles para mostrar.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        setLoading(false);
      }

    }
  };

  useEffect(() => {
    listadoBienesFuncionariosAuto();
  }, [listadoBienesFuncionariosActions, listadoBienesFuncionarios.length]); // Asegúrate de incluir dependencias relevantes


  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Validación numérica
    if ((name === "af_codigo_generico" || name === "altaS_CORR") && !/^[0-9]*$/.test(value)) {
      return;
    }

    // Convertir a número solo si el campo está en la lista
    const camposNumericos = ["nresolucion"];
    const newValue: string | number = camposNumericos.includes(name)
      ? parseFloat(value) || 0
      : value;

    if (name === "altaS_CORR") {
      setBusquedaAltas(value); // <-- estado de búsqueda
    }

    if (name === "af_codigo_generico") {
      setBusquedaCodigoGenerico(value);
    }

    setPaginacion((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

  };

  // const handleBuscar = async () => {
  //   let resultado = false;
  //   setLoading(true);
  //   if (Buscar.fDesde != "" || Buscar.fHasta != "") {
  //     if (validate()) {
  //       resultado = await listadoBienesFuncionariosActions(objeto.Roles[0].codigoEstablecimiento);
  //     }
  //   }
  //   else {
  //     resultado = await listadoBienesFuncionariosActions( objeto.Roles[0].codigoEstablecimiento);
  //   }
  //   if (!resultado) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Sin Resultados",
  //       text: "No se encontraron resultados para la consulta realizada.",
  //       confirmButtonText: "Ok",
  //     });
  //     // listaAltasdesdeBajasActions("");
  //     setLoading(false); //Finaliza estado de carga
  //     return;
  //   } else {
  //     paginar(1);
  //     setLoading(false); //Finaliza estado de carga
  //   }

  // };

  // function detectarTipo(base64: string): string {
  //   if (base64.startsWith("JVBERi0")) return "pdf";
  //   if (base64.startsWith("/9j/")) return "jpeg";
  //   if (base64.startsWith("iVBOR")) return "png";
  //   if (base64.startsWith("R0lGOD")) return "gif";
  //   return "png"; // fallback
  // };

  // const handleDescargarAdjunto = (lista: any) => {
  //   const contenido = listadoBienesFuncionarios?.[lista]?.imageN_COMPROBANTE_PAGO || lista?.imageN_COMPROBANTE_PAGO;
  //   const nombreArchivo = lista?.nombre || "documento";

  //   if (!contenido) {
  //     console.warn("Sin contenido en el adjunto");
  //     return;
  //   }

  //   // Limpia el base64 (quita saltos de línea o espacios)
  //   const base64Limpio = contenido.replace(/\s/g, "").trim();

  //   // Detecta tipo de archivo
  //   const tipo = detectarTipo(base64Limpio);
  //   const mimeType =
  //     tipo === "pdf"
  //       ? "application/pdf"
  //       : tipo === "docx"
  //         ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  //         : tipo === "doc"
  //           ? "image/jpeg"
  //           : tipo === "png"
  //             ? "image/png"
  //             : tipo === "gif"
  //               ? "image/gif"
  //               : "application/octet-stream";

  //   // Convierte base64 → Blob
  //   const byteCharacters = atob(base64Limpio);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const blob = new Blob([new Uint8Array(byteNumbers)], { type: mimeType });

  //   // Crea una URL temporal tipo blob:
  //   const blobUrl = URL.createObjectURL(blob);

  //   // Crea un link invisible para descargar el archivo
  //   const link = document.createElement("a");
  //   link.href = blobUrl;
  //   link.download = `${nombreArchivo}.${tipo === "jpeg" ? "jpg" : tipo}`; // agrega extensión correcta
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);

  //   // Limpia la URL del blob después de un momento
  //   setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
  // };


  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => datosFiltrados.slice(indicePrimerElemento, indiceUltimoElemento),
    [datosFiltrados, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(datosFiltrados)
    ? Math.ceil(datosFiltrados.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  return (
    <Layout>
      <Helmet>
        <title>Listado BienesFuncioario</title>
      </Helmet>
      <MenuInventario />
      <div className="table-responsive position-relative z-0 hide-scrollbar" >
        <div style={{ maxHeight: "80vh" }}>
          <div className="border-bottom shadow-sm p-2 rounded">
            <h3 className="form-title fw-semibold border-bottom p-1">Listado Bienes Funcionarios</h3>
            <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between mb-2">
              <Col xs={12} lg="auto" className="flex-grow-1">
                <div className="position-relative">
                  <Search
                    className="position-absolute top-50 start-0 translate-middle-y ms-3"
                    size={18}
                    style={{ color: isDarkMode ? "#adb5bd" : "#6c757d" }}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Buscar en todas las columnas..."
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    className={`ps-5 ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    style={{ maxWidth: "400px" }}
                  />
                </div>
              </Col>
            </Row>

            <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
              {/* Tamaño de página */}
              <Col xs={12} lg="auto">
                {listadoBienesFuncionarios.length > 10 && (
                  <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                    <label htmlFor="nPaginacion" className="form-label fw-semibold mb-0 me-2">
                      Tamaño de página:
                    </label>
                    <select
                      aria-label="Seleccionar tamaño de página"
                      className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      name="nPaginacion"
                      onChange={handleChange}
                      value={Paginacion.nPaginacion}
                    >
                      {[10, 15, 20, 25, 50, 100].map((val) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                )}
              </Col>
            </Row>

            <div className="mb-2">
              <small className={`${isDarkMode ? "text-light" : "text-muted"}`}>
                Mostrando {datosFiltrados.length} de {listadoBienesFuncionarios.length} registros
              </small>
            </div>

            {/* Tabla*/}
            {loading ? (
              <>
                <SkeletonLoader rowCount={elementosPorPagina} />
              </>
            ) : (
              <>
                {listadoBienesFuncionarios.length > 0 ? (
                  <>
                    <div className='table-responsive'>
                      <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                        <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                          <tr>
                            <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                            <th scope="col" className="text-nowrap text-center">Rut Funcionario</th>
                            <th scope="col" className="text-nowrap text-center">Servicio/Dependencia</th>
                            {/* <th scope="col" className="text-center" >
                              Comprobante Pago
                            </th>
                            <th scope="col" className="text-center" >
                              Autorización
                            </th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {elementosActuales.map((Lista, index) => {
                            const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                            return (
                              <tr key={indexReal}>
                                <td className="text-nowrap">{Lista.aF_CODIGO_GENERICO}</td>
                                <td className="text-nowrap">{Lista.ruT_FUNCIONARIO}</td>
                                <td className="text-nowrap">{Lista.seR_DEP}</td>
                                {/* <td className="text-center">
                                  <Button
                                    size="sm"
                                    variant={isDarkMode ? "outline-light" : "outline-primary"}
                                    onClick={() => handleDescargarAdjunto(Lista)}
                                  >
                                    <Download className="h-4 w-4" aria-hidden="true" />
                                  </Button>
                                </td> */}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* Paginador */}
                    <div className="paginador-container position-relative z-0">
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
                  </>
                ) : (
                  <p className={`text-center  pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                    No hay resultados para mostrar.
                  </p>
                )}
              </>
            )}
          </div >
        </div>
      </div>

    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listadoBienesFuncionarios: state.listadoBienesFuncionariosReducers.listadoBienesFuncionarios,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  listadoBienesFuncionariosActions
})(ListadoBienesFuncionarios);
