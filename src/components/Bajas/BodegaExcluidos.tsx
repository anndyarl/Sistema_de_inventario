import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pagination, Button, Spinner, Form, Modal, Row, Col } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuBajas from "../Menus/MenuBajas.tsx";
import { Helmet } from "react-helmet-async";
import { Eraser, Paperclip, Plus, Search, Trash } from "react-bootstrap-icons";
import { obtenerListaExcluidosActions } from "../../redux/actions/Bajas/ListadoGeneral/obtenerListaExcluidosActions.tsx";
import { quitarBodegaExcluidosActions } from "../../redux/actions/Bajas/BodegaExcluidos/quitarBodegaExcluidosActions.tsx";
import { excluirBajasActions } from "../../redux/actions/Bajas/BodegaExcluidos/excluirBajasActions.tsx";
// import { devolverBajasActions } from "../../redux/actions/Bajas/BodegaExcluidos/devolverBajasActions.tsx";
import { Objeto } from "../Navegacion/Profile.tsx";
import { obtenerListaRematesActions } from "../../redux/actions/Bajas/obtenerListaRematesActions.tsx";

// import { listaAltasdesdeBajasActions } from "../../redux/actions/Bajas/ListadoGeneral/listaAltasdesdeBajasActions.tsx";

interface FechasProps {
  fDesde: string;
  fHasta: string;
}
export interface ListaExcluidos {
  aF_CODIGO_GENERICO: string,
  nresolucion: string;
  observaciones: string;
  useR_MOD: number;
  bajaS_CORR: number;
  aF_CLAVE: string;
  fechA_BAJA: string;
  especie: string;
  ncuenta: string;
  vutiL_AGNOS: number;
  vutiL_RESTANTE: number;
  deP_ACUMULADA: number;
  iniciaL_VALOR: number;
  saldO_VALOR: number;
  estado: number;
}

export interface RematesConAdjuntos {
  Entidad: any[];
  Adjuntos: any[];
}
interface DatosBajas {
  listaExcluidos: ListaExcluidos[];
  obtenerListaExcluidosActions: (fDesde: string, fHasta: string, nresolucion: string, af_codigo_generico: string, establ_corr: number) => Promise<boolean>;
  obtenerListaRematesActions: (fDesde: string, fHasta: string, nresolucion: string, af_codigo_generico: string, establ_corr: number) => Promise<boolean>;
  // listaAltasdesdeBajasActions: (fDesde: string, fHasta: string, af_codigo_generico: string, altasCorr: number, establ_corr: number) => Promise<boolean>;
  quitarBodegaExcluidosActions: (listaExcluidos: Record<string, any>[]) => Promise<boolean>;
  excluirBajasActions: (FormularioBodegaExcluido: RematesConAdjuntos) => Promise<boolean>
  // devolverBajasActions: (devolverBaja: Record<string, any>[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto;
}

const BienesExcluidos: React.FC<DatosBajas> = ({ obtenerListaExcluidosActions, quitarBodegaExcluidosActions, excluirBajasActions, obtenerListaRematesActions, listaExcluidos, token, isDarkMode, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [error, setError] = useState<Partial<ListaExcluidos> & Partial<FechasProps>>({});
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]); //Estado para seleccion multiple
  const [filaSeleccionada, _] = useState<string[]>([]); //Estado para seleccion unica(Quitar)
  const [mostrarModal, setMostrarModal] = useState<number | null>(null);
  const [mostrarModalAdjunto, setMostrarModalAdjunto] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
  const elementosPorPagina = Paginacion.nPaginacion;
  const [anexos, setAnexos] = useState<File[]>([]);
  const [nombreDocumento, setNombreDocumento] = useState<string>("");

  //----------------Estado de archivo adjuntos ---------------//
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);


  const handleFileInput = () => {
    inputRef.current?.click();
  };

  const handleChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevosArchivos = Array.from(e.target.files);

      setAnexos((prev) => {
        const nombresPrevios = new Set(prev.map((file) => file.name));
        const archivosFiltrados = nuevosArchivos.filter((file) => !nombresPrevios.has(file.name));
        return [...prev, ...archivosFiltrados];
      });

      // Resetear el input para permitir seleccionar el mismo archivo nuevamente
      e.target.value = "";
    }
  };

  //Habilita el estado arrastrar
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  //Deshabilita el estado arrastrar al salir de la zona
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  //Adjuntar por arrastre (soporta multiples archivos)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const archivosArrastrados = Array.from(e.dataTransfer.files);
    if (archivosArrastrados.length > 0) {
      setAnexos((prev) => {
        const nombresPrevios = new Set(prev.map((file) => file.name));
        const archivosFiltrados = archivosArrastrados.filter((file) => !nombresPrevios.has(file.name));
        return [...prev, ...archivosFiltrados];
      });
    }
  };
  //----------------Fin Estado de archivo adjuntos ---------------//

  const [Excluidos, setExcluidos] = useState({
    fDesde: "",
    fHasta: "",
    nresolucion: "",
    af_codigo_generico: "",
    observaciones: ""
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Excluidos.nresolucion || Excluidos.nresolucion === "") tempErrors.nresolucion = "Campo obligatorio.";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateFechas = () => {
    let tempErrors: Partial<any> & {} = {};
    if (Excluidos.fDesde > Excluidos.fHasta) tempErrors.fDesde = "La fecha de inicio es mayor a la fecha de término";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  //Se lista automaticamente apenas entra al componente
  const listaExcluidosAuto = async () => {
    if (token) {
      if (listaExcluidos.length === 0) {
        setLoading(true);
        const resultado = await obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
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
    }
  };

  useEffect(() => {
    listaExcluidosAuto()
  }, [obtenerListaExcluidosActions, token, listaExcluidos.length]); // Asegúrate de incluir dependencias relevantes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Validación específica para af_codigo_generico: solo permitir números
    if ((name === "nresolucion" || name === "af_codigo_generico") && !/^[0-9]*$/.test(value)) {
      return; // Salir si contiene caracteres no numéricos
    }
    // Actualizar estado
    setExcluidos((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setPaginacion((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'nPaginacion') {
      paginar(1);
    }

  };

  //Funcion para seleccion multiple
  const setSeleccionaFila = (index: number) => {
    setFilasSeleccionadas((prev) =>
      prev.includes(index.toString())
        ? prev.filter((rowIndex) => rowIndex !== index.toString())
        : [...prev, index.toString()]
    );
  };

  //Funcion para seleccion multiple(Todos)
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


  const convertirArchivosABase64 = async (archivos: File[]): Promise<{ nombre: string, contenido: string }[]> => {
    const resultado: { nombre: string, contenido: string }[] = [];

    for (const archivo of archivos) {
      const contenido = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(archivo);
      });

      resultado.push({
        nombre: archivo.name,
        contenido
      });

      setNombreDocumento(archivo.name);//Guardo el nombre del documento adjunto
      // console.log("archivo.name", archivo.name);
    }

    return resultado;
  };

  const handlesubmit = async () => {
    const selectedIndices = filasSeleccionadas.map(Number);

    const result = await Swal.fire({
      icon: "info",
      title: "Confirmar Envio",
      text: "¿Confirma que desea enviar los bienes seleccionados a bienes rematados?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar y Enviar",
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
      customClass: {
        popup: "custom-border", // Clase personalizada para el borde
      }
    });

    if (result.isConfirmed) {
      setLoadingRegistro(false);
      const anexosBase64 = await convertirArchivosABase64(anexos);
      if (anexos.length > 2) {
        Swal.fire({
          icon: "warning",
          title: "Máximo de archivos adjuntos",
          text: "No puede adjuntar mas de dos documentos, quite algunos antes de continuar con su solicitud",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        return;
      }
      // Crear un array de objetos con aF_CLAVE y nombre
      const Entidad = selectedIndices.map((activo) => ({
        aF_CLAVE: listaExcluidos[activo].aF_CLAVE,
        especie: listaExcluidos[activo].especie,
        nresolucion: listaExcluidos[activo].nresolucion,
        observaciones: Excluidos.observaciones,
        ncuenta: listaExcluidos[activo].ncuenta,
        estado: listaExcluidos[activo].estado,
      }));

      const Adjuntos = anexosBase64.map((anexo) => ({
        nombre: anexo.nombre,
        contenido: anexo.contenido
      }));

      const RemateConAdjuntos = {
        Entidad,
        Adjuntos
      };
      // console.log(Formulario);
      const resultado = await excluirBajasActions(RemateConAdjuntos);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Enviado a Bienes Rematados",
          text: "Los bienes seleccionados se han enviado correctamente.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });

        setLoadingRegistro(false);
        obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
        obtenerListaRematesActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
        setFilasSeleccionadas([]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un problema al intentar enviar los bienes a remate.",
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
  };

  // const handleDevolverSeleccionados = async () => {
  //   const selectedIndices = filasSeleccionadas.map(Number);

  //   const result = await Swal.fire({
  //     icon: "info",
  //     title: "Devolver a Listado General",
  //     text: "Confirme para enviar",
  //     showDenyButton: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Confirmar y Enviar",
  //     background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //     color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //     confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
  //     customClass: {
  //       popup: "custom-border", // Clase personalizada para el borde
  //     }
  //   });

  //   if (result.isConfirmed) {
  //     // setLoadingRegistro(true);
  //     // Crear un array de objetos con aF_CLAVE y nombre
  //     const Formulario = selectedIndices.map((activo) => ({
  //       aF_CLAVE: listaExcluidos[activo].aF_CLAVE,

  //     }));

  //     const resultado = await devolverBajasActions(Formulario);
  //     if (resultado) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Devuelto a Listado General",
  //         text: "Se ha enviado correctamente",
  //         background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //         color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //         confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
  //         customClass: {
  //           popup: "custom-border", // Clase personalizada para el borde
  //         }
  //       });

  //       setLoadingRegistro(false);
  //       obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
  //       listaAltasdesdeBajasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
  //       handleBuscar();
  //       setFilasSeleccionadas([]);
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: ":'(",
  //         text: "Hubo un problema al registrar",
  //         background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //         color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //         confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
  //         customClass: {
  //           popup: "custom-border", // Clase personalizada para el borde
  //         }
  //       });
  //       setLoadingRegistro(false);
  //     }

  //   }

  // };

  const handleCerrarModal = () => {
    setMostrarModal(null); //Cierra modal del indice seleccionado
    setExcluidos((prevState) => ({
      ...prevState,
      nresolucion: "",
    }));
  };

  //Abre modal quitar datos seleccionado
  // const handleAbrirModal = (index: number) => {
  //   setMostrarModal(index); //Abre modal del indice seleccionado
  //   setFilasSeleccionadas([]);
  //   setFilaSeleccionada((prev) =>
  //     prev.includes(index.toString())
  //       ? prev.filter((rowIndex) => rowIndex !== index.toString())
  //       : [...prev, index.toString()]
  //   );
  // };

  const handleQuitar = async () => {
    if (validate()) {
      const selectedIndices = filaSeleccionada.map(Number);
      const result = await Swal.fire({
        icon: "info",
        title: "Quitar",
        text: "Confirme para quitar el bien de Bodega de Excluidos",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar y Quitar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      if (result.isConfirmed) {
        setLoadingRegistro(true); //Inicia spin de carga
        // Crear un array de objetos con aF_CLAVE y nombre
        const Formulario = selectedIndices.map((activo) => ({
          aF_CLAVE: listaExcluidos[activo].aF_CLAVE,
          ...Excluidos
        }));
        // console.log(Formulario);
        const resultado = await quitarBodegaExcluidosActions(Formulario);

        if (resultado) {
          Swal.fire({
            icon: "success",
            title: "Quitado correctamente",
            text: "Se han quitado correctamente de Bodega de excluidos",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
          obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
          obtenerListaRematesActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
          setLoadingRegistro(false);//termina de cargar      
          setFilasSeleccionadas([]); //deselecciona las filas     
          setExcluidos((prevState) => ({
            ...prevState,
            nresolucion: "",
          }));
          setMostrarModal(null);
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
          setLoadingRegistro(false);//termina de cargar
        }
      }
    }

  };


  const handleBuscar = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let resultado = false;
    setLoading(true);
    if (Excluidos.fDesde != "" || Excluidos.fHasta != "") {
      if (validateFechas()) {
        resultado = await obtenerListaExcluidosActions(Excluidos.fDesde, Excluidos.fHasta, Excluidos.nresolucion, Excluidos.af_codigo_generico, objeto.Roles[0].codigoEstablecimiento);
      }
    }
    else {
      resultado = await obtenerListaExcluidosActions("", "", Excluidos.nresolucion, Excluidos.af_codigo_generico, objeto.Roles[0].codigoEstablecimiento);
    }

    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "No se encontraron resultados para la consulta realizada.",
        confirmButtonText: "Ok",
      });
      obtenerListaExcluidosActions("", "", "", "", objeto.Roles[0].codigoEstablecimiento);
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }

  };

  const handleLimpiar = () => {
    setExcluidos((prevInventario) => ({
      ...prevInventario,
      fDesde: "",
      fHasta: "",
      nresolucion: "",
      af_codigo_generico: ""
    }));
  };

  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () =>
      listaExcluidos.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaExcluidos, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(listaExcluidos)
    ? Math.ceil(listaExcluidos.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  return (
    <Layout>
      <Helmet>
        <title>Bodega de Excluidos</title>
      </Helmet>
      <MenuBajas />
      <div className="table-responsive position-relative z-0 hide-scrollbar" >
        <div style={{ maxHeight: "80vh" }}>
          <form>
            <div className="border-bottom shadow-sm p-2 rounded">
              <h3 className="form-title fw-semibold border-bottom p-1">Bodega de Excluidos</h3>
              <Row className="border rounded p-2 m-2">
                <Col lg={3} md={4}>
                  <div className="mb-2">
                    <div className="mb-1">
                      <label htmlFor="fDesde" className="fw-semibold">Desde</label>
                      <input
                        aria-label="fDesde"
                        type="date"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fDesde ? "is-invalid" : ""}`}
                        name="fDesde"
                        onChange={handleChange}
                        value={Excluidos.fDesde}
                        max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                      />
                      {error.fDesde && (
                        <div className="invalid-feedback d-block">{error.fDesde}</div>
                      )}
                    </div>

                    <div className="flex-grow-1">
                      <label htmlFor="fHasta" className="form-label fw-semibold small">Hasta</label>
                      <div className="input-group">
                        <input
                          aria-label="Fecha Hasta"
                          type="date"
                          className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fHasta ? "is-invalid" : ""}`}
                          name="fHasta"
                          onChange={handleChange}
                          value={Excluidos.fHasta}
                          max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                        />
                      </div>
                      {error.fHasta && <div className="invalid-feedback d-block">{error.fHasta}</div>}

                    </div>
                    <small className="fw-semibold">Filtre los resultados por fecha de Baja.</small>
                  </div>
                </Col>

                <Col lg={2} md={4}>
                  <div className="mb-1">
                    <label htmlFor="nresolucion" className="fw-semibold">Nº Certificado</label>
                    <input
                      aria-label="nresolucion"
                      type="text"
                      className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      name="nresolucion"
                      size={10}
                      placeholder="0"
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleBuscar(e);
                        }
                      }}
                      maxLength={12}
                      value={Excluidos.nresolucion}
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="af_codigo_generico" className="form-label fw-semibold">Nº Inventario</label>
                    <input
                      aria-label="af_codigo_generico"
                      type="text"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      name="af_codigo_generico"
                      placeholder="Ej: 1000000008"
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleBuscar(e);
                        }
                      }}
                      maxLength={12}
                      value={Excluidos.af_codigo_generico}
                    />
                  </div>
                </Col>

                {/* Columna 5: Botones de Acción */}
                <Col lg={1} md={4}>
                  <div className="d-flex flex-column gap-2 mt-4">
                    <Button
                      onClick={handleBuscar}
                      variant={`${isDarkMode ? "secondary" : "primary"}`}
                      className="w-100"
                    // disabled={loading}
                    >
                      {loading ? (
                        <>
                          Buscar
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
                        </>
                      ) : (
                        <>
                          Buscar
                          <Search className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                        </>
                      )}
                    </Button>

                    <Button onClick={handleLimpiar} variant={`${isDarkMode ? "secondary" : "primary"}`} className="w-100">
                      Limpiar
                      <Eraser className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                {/* Tamaño de página */}
                <Col xs={12} lg="auto">
                  {listaExcluidos.length > 10 && (
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
                {listaExcluidos.length > 0 && (
                  <>
                    {/* Botón o mensaje */}
                    <Col xs={12} lg={2}>
                      <div className="d-flex justify-content-center justify-content-lg-end">
                        {filasSeleccionadas.length > 0 ? (
                          <Button
                            variant={`${isDarkMode ? "secondary" : "primary"}`}
                            onClick={() => setMostrarModalAdjunto(true)}
                            className="p-2 w-100 w-sm-auto d-flex align-items-center justify-content-center"
                            disabled={loadingRegistro}
                          >
                            {loadingRegistro ? (
                              <>
                                Enviar a Remate
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="mx-1"
                                />
                              </>
                            ) : (
                              <>
                                Enviar a Remate
                                <span className="badge bg-light text-dark mx-1 mt-1">
                                  {filasSeleccionadas.length}
                                </span>
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="d-flex justify-content-center justify-content-lg-end w-100">
                            <strong className="alert alert-dark border p-2 mb-2 mb-sm-0 mx-sm-0 w-100 w-lg-auto text-center ">
                              No hay filas seleccionadas
                            </strong>
                          </div>
                        )}
                      </div>
                    </Col>
                  </>
                )}
              </Row>
              {/* </div> */}


              {/* Tabla*/}
              {loading ? (
                <>
                  <SkeletonLoader rowCount={elementosPorPagina} />
                </>
              ) : (
                <>
                  {listaExcluidos.length > 0 ? (
                    <>
                      <div className='table-responsive'>
                        <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                          <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                            <tr>
                              <th style={{
                                position: 'sticky',
                                left: 0

                              }}>
                                <Form.Check
                                  className="check-danger"
                                  type="checkbox"
                                  onChange={handleSeleccionaTodos}
                                  checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                />
                              </th>
                              <th scope="col" className="text-nowrap text-center">Código</th>
                              <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                              <th scope="col" className="text-nowrap text-center">Nº Certificado</th>
                              <th scope="col" className="text-nowrap text-center">Observaciones</th>
                              <th scope="col" className="text-nowrap text-center">Usuario Modifica</th>
                              <th scope="col" className="text-nowrap text-center">Fecha Baja</th>
                              <th scope="col" className="text-nowrap text-center">Especie</th>
                              <th scope="col" className="text-nowrap text-center">Nº Cuenta</th>
                              <th scope="col" className="text-nowrap text-center">Vida Útil en Años</th>
                              <th scope="col" className="text-nowrap text-center">Vida Útil Restante</th>
                              <th scope="col" className="text-nowrap text-center">Depreciación Acumulada</th>
                              <th scope="col" className="text-nowrap text-center">Valor Inicial</th>
                              <th scope="col" className="text-nowrap text-center">Saldo Valor</th>
                              <th scope="col" className="text-nowrap text-center">Estado</th>
                              {/* <th
                      className="text-nowrap text-center"
                      style={{
                        position: 'sticky',
                        right: 0                     
                      }}
                    >
                      Acción
                    </th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {elementosActuales.map((Lista, index) => {
                              const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                              return (
                                <tr key={indexReal}>
                                  <td style={{
                                    position: 'sticky',
                                    left: 0

                                  }}>
                                    <Form.Check
                                      type="checkbox"
                                      onChange={() => setSeleccionaFila(indexReal)}
                                      checked={filasSeleccionadas.includes(indexReal.toString())}
                                    />
                                  </td>
                                  <td className="text-nowrap">{Lista.bajaS_CORR}</td>
                                  <td className="text-nowrap">{Lista.aF_CODIGO_GENERICO}</td>
                                  <td className="text-nowrap">{Lista.nresolucion}</td>
                                  <td className="text-nowrap">{Lista.observaciones}</td>
                                  <td className="text-nowrap">{Lista.useR_MOD}</td>
                                  <td className="text-nowrap">{Lista.fechA_BAJA}</td>
                                  <td className="text-nowrap">{Lista.especie}</td>
                                  <td className="text-nowrap">{Lista.ncuenta}</td>
                                  <td className="text-nowrap">{Lista.vutiL_AGNOS}</td>
                                  <td className="text-nowrap">{Lista.vutiL_RESTANTE}</td>
                                  <td className="text-nowrap">{Lista.deP_ACUMULADA}</td>
                                  <td className="text-nowrap">{Lista.iniciaL_VALOR}</td>
                                  <td className="text-nowrap">{Lista.saldO_VALOR}</td>
                                  <td className="text-nowrap">{Lista.estado}</td>
                                  {/* <td style={{
                          position: 'sticky',
                          right: 0                   

                        }}>
                          <Button variant="outline-danger" className="fw-semibold" size="sm"
                            // className="text-nowrap text-center"
                            onClick={() => handleAbrirModal(index)}>
                            Quitar
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
            </div>
          </form>
        </div>
      </div>
      {/* Modal formulario quitar*/}
      {elementosActuales.map((lista, index) => (
        <div key={index}>
          <Modal
            show={mostrarModal === index}
            onHide={() => handleCerrarModal()}
            dialogClassName="modal-right" // Clase personalizada
          // backdrop="static"    // Evita el cierre al hacer clic fuera del modal
          // keyboard={false}     // Evita el cierre al presionar la tecla Esc
          >
            <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
              <Modal.Title className="fw-semibold">Quitar registro: {lista.nresolucion}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
              <form>
                {/* <div className="d-flex justify-content-end">
                  <Button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
                    Enviar a Bodega
                  </Button>
                </div> */}
                {/* Boton anular filas seleccionadas */}
                <div className="d-flex justify-content-end">
                  <Button
                    variant="danger"
                    onClick={handleQuitar}
                    className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                    disabled={loadingRegistro}  // Desactiva el botón mientras carga
                  >
                    {loadingRegistro ? (
                      <>
                        {" Quitando... "}
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
                        Quitar
                      </>
                    )}
                  </Button>

                </div>
                <div className="mb-1">
                  <label htmlFor="nresolucion" className="fw-semibold">
                    Ingrese número de resolución
                  </label>
                  <input
                    aria-label="nresolucion"
                    type="text"
                    className={`form-control ${error.nresolucion ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="nresolucion"
                    maxLength={100}
                    onChange={handleChange}
                    value={Excluidos.nresolucion}
                  />
                  {error.nresolucion && (
                    <div className="invalid-feedback fw-semibold">{error.nresolucion}</div>
                  )}
                </div>
              </form>
            </Modal.Body>
          </Modal >
        </div>
      ))}

      {/* Modal formulario adjuntar*/}
      <Modal show={mostrarModalAdjunto} onHide={() => setMostrarModalAdjunto(false)} size="lg" dialogClassName="modal-right" backdrop="static">
        <Modal.Header className={`bg-secondary text-white `} closeButton>
          <Modal.Title className="fw-semibold">Enviar a Bienes Rematados
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <form >
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                onClick={handlesubmit}
                className="m-1 p-2 d-flex align-items-center"
                disabled={loading || anexos.length > 2 || anexos.length == 0}
              >
                {loading ? (
                  <>
                    {" Enviar "}
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
                    {/* <span className="badge bg-light text-dark mx-1 mt-1">
                      {filasSeleccionadas.length}
                    </span> */}
                  </>
                )}
              </Button>
            </div>
            <div className="mb-1">
              <label htmlFor="observaciones" className="fw-semibold">
                Observaciones
              </label>
              <textarea
                className={`form-control ${error.observaciones ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                aria-label="observaciones"
                name="observaciones"
                rows={3}
                maxLength={300}
                style={{ maxHeight: "10rem" }}
                onChange={handleChange}
                value={Excluidos.observaciones}
              />
              {error.observaciones && (
                <div className="invalid-feedback fw-semibold">
                  {error.observaciones}
                </div>
              )}
              <label htmlFor="observaciones" className="fw-semibold">
                Adjuntar documentación
              </label>
              {/* Zona de arrastre - siempre visible mientras no se alcance el limite */}
              {anexos.length < 2 && (
                <div
                  className={`text-center m-2 px-4 py-3 rounded border-2 border-dashed ${isDragging
                    ? "border-primary bg-primary bg-opacity-10"
                    : isDarkMode
                      ? "bg-dark text-light border-secondary"
                      : "bg-light text-muted border"
                    }`}
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={handleFileInput}
                >
                  <Paperclip width={24} height={24} aria-hidden="true" className="mb-1" />
                  <p className="file-name fw-semibold mb-0">
                    {isDragging
                      ? "Suelta los archivos aqui"
                      : "Arrastra y suelta archivos aqui, o haz clic para seleccionar"}
                  </p>
                  <small className="text-muted">Formatos: PDF, DOC, DOCX, JPG, PNG (max. 2 archivos)</small>
                  <input
                    aria-label="file"
                    ref={inputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    style={{ display: "none" }}
                    onChange={handleChangeFiles}
                  />
                </div>
              )}

              {/* Lista de archivos adjuntos */}
              {anexos.length > 0 && (
                <div className="m-2">
                  <label className="fw-semibold mb-1">Archivos adjuntos ({anexos.length}/2)</label>
                  <ul className="list-group">
                    {anexos.map((file, index) => (
                      <li
                        key={index}
                        className={`list-group-item d-flex justify-content-between align-items-center ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                          }`}
                      >
                        <div className="d-flex align-items-center text-truncate">
                          <Paperclip width={14} height={14} aria-hidden="true" className="me-2 flex-shrink-0" />
                          <span className="text-truncate">{file.name}</span>
                          <small className="text-muted ms-2 flex-shrink-0">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </small>
                        </div>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="ms-2 flex-shrink-0"
                          onClick={() => {
                            setAnexos((prev) => prev.filter((_, i) => i !== index));
                          }}
                          title="Quitar archivo"
                        >
                          <Trash className="flex-shrink-0" width={14} height={14} aria-hidden="true" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mensaje cuando se alcanzo el limite */}
              {anexos.length > 2 && (
                <div className="alert alert-warning m-2 py-2 mb-0">
                  <small className="fw-semibold">Se alcanzo el limite maximo de 2 archivos adjuntos.</small>
                </div>
              )}
            </div>

          </form>
        </Modal.Body>
      </Modal>
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listaExcluidos: state.obtenerListaExcluidosReducers.listaExcluidos,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  nPaginacion: state.mostrarNPaginacionReducer.nPaginacion,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  excluirBajasActions,
  obtenerListaExcluidosActions,
  obtenerListaRematesActions,
  // listaAltasdesdeBajasActions,
  quitarBodegaExcluidosActions,
  // devolverBajasActions
})(BienesExcluidos);
