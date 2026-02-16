import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Button, Spinner, Form, Modal, Row, Col, ModalDialog } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import MenuBajas from "../Menus/MenuBajas.tsx";
import { Helmet } from "react-helmet-async";
import { Objeto } from "../Navegacion/Profile.tsx";
import { Eraser, FiletypePdf, Search, XCircle } from "react-bootstrap-icons";
import { ListaAltas } from "../Altas/RegistrarAltas.tsx";
import { useNavigate } from "react-router-dom";
import { registrarBienesBajasActions } from "../../redux/actions/Bajas/ListadoGeneral/registrarBienesBajasActions.tsx";
import { listaAltasdesdeBajasActions } from "../../redux/actions/Bajas/ListadoGeneral/listaAltasdesdeBajasActions.tsx";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoPDFResumenBajas from "./DocumentoPDFResumenBajas.tsx";
import Draggable from "react-draggable";

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
  deT_MARCA: string;
  deT_MODELO: string;
  deT_SERIE: string;
  esP_NOMBRE: string;
  deP_ACUMULADA: number;
  aF_FINGRESO: string;
  serv: string;
  dep: string;
}

interface DatosBajas {
  listadoGeneralBajas: ListaAltas[];
  listaSalidaBajas: ListaBajas[];
  listaAltasdesdeBajasActions: (fDesde: string, fHasta: string, af_codigo_generico: string, altasCorr: number, establ_corr: number) => Promise<boolean>;
  registrarBienesBajasActions: (baja: { aF_CLAVE: number, usuariO_MOD: string, ctA_COD: string, esP_NOMBRE: string, establ_corr: number }[]) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const ListadoGeneral: React.FC<DatosBajas> = ({ listaAltasdesdeBajasActions, registrarBienesBajasActions, listadoGeneralBajas, listaSalidaBajas, token, isDarkMode, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [__, setLoadingRegistro] = useState(false);
  const [error, setError] = useState<Partial<ListaBajas>>({});
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [busquedaCodigoGenerico, setBusquedaCodigoGenerico] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalResumen, setMostrarModalResumen] = useState(false);
  const [modalMostrarExportar, setModalMostrarExportar] = useState(false);
  const [busquedaAltas, setBusquedaAltas] = useState("");
  const [loadingExportar, setLoadingExportar] = useState(false);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [Paginacion, setPaginacion] = useState(
    { nPaginacion: 10 }
  );
  const elementosPorPagina = Paginacion.nPaginacion;

  const [paginaActual1, setPaginaActual1] = useState(1);
  const [Paginacion1, setPaginacion1] = useState({
    nPaginacion1: 10
  });
  const elementosPorPagina1 = Paginacion1.nPaginacion1;

  const [Bajas, setBajas] = useState({
    nresolucion: 0,
    observaciones: "",
    fechA_BAJA: ""
  });

  const [Buscar, setBuscar] = useState({
    fDesde: "",
    fHasta: "",
    altaS_CORR: 0,
    af_codigo_generico: ""
  });

  const datosFiltrados = listadoGeneralBajas.filter(item => {

    const coincideCodigo = !Buscar.af_codigo_generico || item.aF_CODIGO_GENERICO?.toString().toLowerCase().includes(Buscar.af_codigo_generico.toString().toLowerCase());
    const coincideAlta = !Buscar.altaS_CORR || item.altaS_CORR?.toString().toLowerCase().includes(Buscar.altaS_CORR.toString().toLowerCase());

    return coincideCodigo && coincideAlta;
  });

  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaCodigoGenerico, busquedaAltas]);


  //Se lista automaticamente apenas entra al componente
  const listadoGeneralBajasAuto = async () => {
    if (token) {
      if (listadoGeneralBajas.length === 0) {
        setLoading(true);
        const resultado = await listaAltasdesdeBajasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
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
    listadoGeneralBajasAuto();
  }, [listaAltasdesdeBajasActions, listadoGeneralBajas.length]); // Asegúrate de incluir dependencias relevantes


  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Bajas.nresolucion) tempErrors.nresolucion = "Campo obligatorio.";
    if (!Bajas.fechA_BAJA) tempErrors.fechA_BAJA = "Campo obligatorio.";
    if (!Bajas.observaciones) tempErrors.observaciones = "Campo obligatorio.";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
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

    // Actualizar filtros usados en la tabla
    setBuscar(prev => ({
      ...prev,
      [name]: value
    }));

    // Actualizar estado
    setBajas((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    setPaginacion((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    setPaginacion1((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  //Seleccion normal
  // const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.checked) {
  //     setFilasSeleccionadas(
  //       elementosActuales.map((_, index) =>
  //         (indicePrimerElemento + index).toString()
  //       )
  //     );
  //   } else {
  //     setFilasSeleccionadas([]);
  //   }
  // };

  //Seleccion con omiciones de establecimientos distintos
  // const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {

  //   const filasValidas: string[] = [];

  //   elementosActuales.forEach((elemento, index) => {
  //     const lista = listadoGeneralBajas.find(
  //       f => f.estabL_CORR === elemento.estabL_CORR
  //     );
  //     const estableActual = lista?.estabL_CORR;

  //     if (estableActual === objeto.Roles[0].codigoEstablecimiento) {
  //       filasValidas.push((indicePrimerElemento + index).toString());
  //     }
  //   });

  //   //SI EL CHECKBOX SE MARCA → SELECCIONA LOS VÁLIDOS
  //   if (e.target.checked) {

  //     setFilasSeleccionadas(filasValidas);

  //     if (filasValidas.length < elementosActuales.length) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "Información",
  //         text: "Hay bienes que pertenecen a otros establecimientos. Revise antes de seleccionar.",
  //         background: isDarkMode ? "#1e1e1e" : "#ffffff",
  //         color: isDarkMode ? "#ffffff" : "#000000",
  //         confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
  //         customClass: { popup: "custom-border" },
  //       });
  //     }

  //     // ⬇ SI EL CHECKBOX SE DESMARCA → DESELECCIONA TODO
  //   } else {
  //     setFilasSeleccionadas([]);
  //   }
  // };

  //Seleccion de todos los bienes pero con notificacion que existen bienes de otros establecimientos
  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.checked) {
      setFilasSeleccionadas([]);
      return;
    }

    // Seleccionar todos normalmente
    const todasLasFilas: string[] = elementosActuales.map(
      (_, index) => (indicePrimerElemento + index).toString()
    );

    setFilasSeleccionadas(todasLasFilas);

    // Verificar si hay establecimientos distintos
    const existeEstablecimientoDistinto = elementosActuales.some((elemento) => {
      const lista = listadoGeneralBajas.find(
        f => f.estabL_CORR === elemento.estabL_CORR
      );
      const estableActual = lista?.estabL_CORR;
      return estableActual !== objeto.Roles[0].codigoEstablecimiento;
    });

    if (existeEstablecimientoDistinto) {
      Swal.fire({
        icon: "warning",
        title: "Revisión necesaria",
        text: "Algunos bienes no corresponden a su establecimiento. Revise los bienes seleccionados antes de continuar.",
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
        confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
        customClass: { popup: "custom-border" },
      });
    }
  };

  // const setSeleccionaFilas = (index: number) => {
  //   const indexReal = indicePrimerElemento + index;
  //   setFilasSeleccionadas((prev) =>
  //     prev.includes(indexReal.toString())
  //       ? prev.filter((rowIndex) => rowIndex !== indexReal.toString())
  //       : [...prev, indexReal.toString()]
  //   );
  //   // console.log("indices seleccionmados", indexReal);
  // };

  const setSeleccionaFilas = (aF_CLAVE: number, aF_CODIGO_GENERICO: string, altaS_CORR: number, estabL_CORR: number) => {

    const lista = listadoGeneralBajas.find((f) => f.estabL_CORR === estabL_CORR);
    const estableActual = lista?.estabL_CORR ?? null;

    if (estableActual == objeto.Roles[0].codigoEstablecimiento) {
      // Selección/deselección normal
      setFilasSeleccionadas(prev =>
        prev.includes(aF_CLAVE.toString())
          ? prev.filter(v => v !== aF_CLAVE.toString())
          : [...prev, aF_CLAVE.toString()]
      );
      // console.log(filasSeleccionadas);
    }

    else {

      if (estableActual === 1) {
        Swal.fire({
          icon: "warning",
          title: "Revisión necesaria",
          html: `El bien seleccionado <b>${aF_CODIGO_GENERICO}</b> con código de Alta <b>${altaS_CORR}</b> pertenece al establecimiento <b>SSMSO</b>.`,
          background: isDarkMode ? "#1e1e1e" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
          confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
          customClass: { popup: "custom-border" },
        });
        // return;
      }

      if (estableActual === 2) {
        Swal.fire({
          icon: "warning",
          title: "Revisión necesaria",
          html: `El bien seleccionado <b>${aF_CODIGO_GENERICO}</b> con código de Alta <b>${altaS_CORR}</b> pertenece al establecimiento <b>CASR</b>.`,
          background: isDarkMode ? "#1e1e1e" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
          confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
          customClass: { popup: "custom-border" },
        });
        // return;
      }

      if (estableActual === 3) {
        Swal.fire({
          icon: "warning",
          title: "Revisión necesaria",
          html: `El bien seleccionado <b>${aF_CODIGO_GENERICO}</b> con código de Alta <b>${altaS_CORR}</b> pertenece al establecimiento <b>HSJM</b>.`,
          background: isDarkMode ? "#1e1e1e" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
          confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
          customClass: { popup: "custom-border" },
        });
        // return;
      }

      // Selección/deselección normal
      setFilasSeleccionadas(prev =>
        prev.includes(aF_CLAVE.toString())
          ? prev.filter(v => v !== aF_CLAVE.toString())
          : [...prev, aF_CLAVE.toString()]
      );
      console.log(filasSeleccionadas);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      // const selectedIndices = listadoGeneralBajas.map(Number);
      const seleccionados = listadoGeneralBajas.filter(item =>
        filasSeleccionadas.includes(item.aF_CLAVE.toString())
      );

      const result = await Swal.fire({
        icon: "info",
        title: "Confirmación de Envío",
        text: "Por favor confirme si desea enviar los bienes a la Bodega de Excluidos.",
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
        setLoadingRegistro(true);
        //   // Crear un array de objetos con aF_CLAVE y nombre
        const FormularioBajas = seleccionados.map((item) => ({
          aF_CODIGO_GENERICO: item.aF_CODIGO_GENERICO,
          aF_CLAVE: item.aF_CLAVE,
          usuariO_MOD: objeto.IdCredencial.toString(),
          ctA_COD: item.ctA_COD,
          deT_MARCA: item.deT_MARCA,
          deT_MODELO: item.deT_MODELO,
          deT_SERIE: item.deT_SERIE,
          esP_NOMBRE: item.esP_NOMBRE,
          ...Bajas,
          establ_corr: objeto.Roles[0].codigoEstablecimiento
        }));

        // console.log("FORMULARIO", FormularioBajas);

        const resultado = await registrarBienesBajasActions(FormularioBajas);
        if (resultado) {
          mostrarAlerta();
          listaAltasdesdeBajasActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento); //Carga la tabla nuevamente
          setLoadingRegistro(false);//Detiene la carga
          setFilasSeleccionadas([]);//Limpia Formulario
          setMostrarModal(false);//Cierra modal formulario
        } else {
          Swal.fire({
            icon: "error",
            title: "No se pudo enviar la solicitud",
            text: "Por favor, intente nuevamente. Si el problema persiste, comuníquese con la Unidad de Desarrollo.",
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
  }

  const mostrarAlerta = () => {
    document.body.style.overflow = "hidden"; // Evita que el fondo se desplace
    Swal.fire({
      icon: "success",
      title: "Registro Exitoso",
      text: `Se han registrado correctamente las Bajas seleccionadas, Presione "OK" para visualizar un resumen de los datos ingresados.`,
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
      customClass: { popup: "custom-border" },
      allowOutsideClick: false,
      showCancelButton: false, // Agrega un segundo botón
      cancelButtonText: "Cerrar", // Texto del botón
      willClose: () => {
        document.body.style.overflow = "auto"; // Restaura el scroll
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setMostrarModalResumen(true);
      }
    });
  };

  const handleBuscar = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let resultado = false;
    setLoading(true);
    if (Buscar.fDesde != "" || Buscar.fHasta != "") {
      if (validate()) {
        resultado = await listaAltasdesdeBajasActions(Buscar.fDesde, Buscar.fHasta, Buscar.af_codigo_generico, Buscar.altaS_CORR, objeto.Roles[0].codigoEstablecimiento);
      }
    }
    else {
      resultado = await listaAltasdesdeBajasActions("", "", Buscar.af_codigo_generico, Buscar.altaS_CORR, objeto.Roles[0].codigoEstablecimiento);
    }
    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "No se encontraron resultados para la consulta realizada.",
        confirmButtonText: "Ok",
      });
      // listaAltasdesdeBajasActions("");
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }

  };

  const handleLimpiar = () => {
    // limpiar filtros
    setBuscar({
      fDesde: "",
      fHasta: "",
      altaS_CORR: 0,
      af_codigo_generico: ""
    });

    // limpiar inputs visuales
    setBusquedaAltas("");
    setBusquedaCodigoGenerico("");
  };

  const handleLimpiarFilasSeleccionadas = () => {
    setFilasSeleccionadas([]);
  };


  const handleAbrirModalExportar = () => {
    setLoadingExportar(true);
    // Espera un ciclo de evento para mostrar el modal
    setTimeout(() => {
      setModalMostrarExportar(true);
    }, 50); //se ajusta este tiempo para que cargue de inmediato
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "";
    const [anio, mes, dia] = fecha.split("T")[0].split("-");
    return `${dia}/${mes}/${anio}`;
  };
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
  /*-----------------------Tabla Resumen----------------------*/

  // Lógica de Paginación actualizada 
  const indiceUltimoElemento1 = paginaActual1 * elementosPorPagina1;
  const indicePrimerElemento1 = indiceUltimoElemento1 - elementosPorPagina1;
  const elementosActuales1 = useMemo(
    () => listaSalidaBajas.slice(indicePrimerElemento1, indiceUltimoElemento1),
    [listaSalidaBajas, indicePrimerElemento1, indiceUltimoElemento1]);

  const totalPaginas1 = Array.isArray(listaSalidaBajas)
    ? Math.ceil(listaSalidaBajas.length / elementosPorPagina1) : 0;
  const paginar1 = (numeroPagina1: number) => setPaginaActual1(numeroPagina1);
  return (
    <Layout>
      <Helmet>
        <title>Listado General</title>
      </Helmet>
      <MenuBajas />
      <div className="table-responsive position-relative z-0 hide-scrollbar" >
        <div style={{ maxHeight: "80vh" }}>
          <div className="border-bottom shadow-sm p-2 rounded">
            <h3 className="form-title fw-semibold border-bottom p-1">Listado General</h3>
            <Row className="border rounded p-2 m-2">
              <Col lg={2} md={5}>
                <div className="mb-2">
                  <label htmlFor="altaS_CORR" className="form-label fw-semibold small">Nº Alta</label>
                  <div className="position-relative">
                    <input
                      aria-label="Nº Alta"
                      type="text"
                      placeholder="0"
                      value={busquedaAltas}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleBuscar(e);
                        }
                      }}
                      name="altaS_CORR"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      style={{ maxWidth: "400px" }}
                      maxLength={5}
                    />
                    <Search
                      className="position-absolute top-50 end-0 translate-middle-y me-3"
                      size={18}
                      style={{ color: isDarkMode ? "#adb5bd" : "#6c757d" }}
                    />
                  </div>
                  {/* <input
                    aria-label="altaS_CORR"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="altaS_CORR"
                    placeholder="0"
                    onChange={handleChange}
                    maxLength={12}
                    value={Buscar.altaS_CORR}
                  /> */}
                </div>
                <div className="mb-1">
                  <label htmlFor="af_codigo_generico" className="fw-semibold">Nº Inventario</label>
                  <div className="position-relative">
                    <input
                      aria-label="Nº Inventario"
                      type="text"
                      placeholder="Eje: 1000000008"
                      value={busquedaCodigoGenerico}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleBuscar(e);
                        }
                      }}
                      name="af_codigo_generico"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      style={{ maxWidth: "400px" }}
                      maxLength={12}
                    />
                    <Search
                      className="position-absolute top-50 end-0 translate-middle-y me-3"
                      size={18}
                      style={{ color: isDarkMode ? "#adb5bd" : "#6c757d" }}
                    />
                  </div>
                  {/* <input
                    aria-label="af_codigo_generico"
                    type="text"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="af_codigo_generico"
                    size={10}
                    placeholder="Eje: 1000000008"
                    onChange={handleChange}
                    maxLength={12}
                    value={Buscar.af_codigo_generico}
                  /> */}
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
                {listadoGeneralBajas.length > 10 && (
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
              {listadoGeneralBajas.length > 0 && (
                <>
                  {filasSeleccionadas.length > 0 ? (
                    // 🟦 CUANDO HAY FILAS SELECCIONADAS → Mostrar botones
                    <Col xs={12} lg={4}>
                      <div className="d-flex justify-content-center justify-content-lg-end w-100">

                        {/* Botón Deseleccionar Todo */}
                        <Button
                          onClick={handleLimpiarFilasSeleccionadas}
                          disabled={listadoGeneralBajas.length === 0}
                          variant="warning"
                          className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-sm-auto d-flex align-items-center"
                        >
                          <XCircle className="h-5 w-5 mx-2" aria-hidden="true" />
                          Deseleccionar todo
                          <span className="badge bg-light text-muted ms-2">
                            {filasSeleccionadas.length}
                          </span>
                        </Button>

                        {/* Botón Enviar a Bodega */}
                        <Button
                          variant={isDarkMode ? "secondary" : "primary"}
                          onClick={() => setMostrarModal(true)}
                          className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 w-sm-auto d-flex align-items-center justify-content-center"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              Enviar a Bodega
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="ms-2"
                              />
                            </>
                          ) : (
                            <>
                              Enviar a Bodega
                              <span className="badge bg-light text-dark ms-2">
                                {filasSeleccionadas.length}
                              </span>
                            </>
                          )}
                        </Button>

                      </div>
                    </Col>
                  ) : (
                    <Col xs={12} lg={2}>
                      <div className="d-flex justify-content-center justify-content-lg-end w-100">
                        <strong className="alert alert-dark border p-2 mb-2 mb-sm-0 mx-sm-0 w-100 w-lg-auto text-center">
                          No hay filas seleccionadas
                        </strong>
                      </div>
                    </Col>
                  )}
                </>
              )}

            </Row>

            <div className="mb-2">
              <small className={`${isDarkMode ? "text-light" : "text-muted"}`}>
                Mostrando {datosFiltrados.length} de {listadoGeneralBajas.length} registros
              </small>
            </div>


            {/* Tabla */}
            {loading ? (
              <SkeletonLoader rowCount={elementosPorPagina} />
            ) : (
              <>
                {listadoGeneralBajas.length > 0 ? (
                  <>
                    <div className="table-responsive">
                      <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}
                      >
                        <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light"}`}
                        >
                          <tr>
                            <th style={{ position: "sticky", left: 0 }}>
                              <Form.Check
                                type="checkbox"
                                onChange={handleSeleccionaTodos}
                                checked={
                                  filasSeleccionadas.length === elementosActuales.length &&
                                  elementosActuales.length > 0
                                }
                              />
                            </th>

                            <th className="text-nowrap text-center">N° Inventario</th>
                            <th className="text-nowrap text-center">N° Alta</th>
                            {/* {(objeto.IdCredencial === 6405 || objeto.IdCredencial === 888) && (
                              <th className="text-nowrap text-center">Establecimiento</th>
                            )} */}
                            <th className="text-nowrap text-center">Servicio</th>
                            <th className="text-nowrap text-center">Dependencia</th>
                            <th className="text-nowrap text-center">Fecha Ingreso</th>
                            <th className="text-nowrap text-center">Especie</th>
                            <th className="text-nowrap text-center">N° Cuenta</th>
                            <th className="text-nowrap text-center">Usuario Crea</th>
                            <th className="text-nowrap text-center">Marca</th>
                            <th className="text-nowrap text-center">Modelo</th>
                            <th className="text-nowrap text-center">Serie</th>
                            <th className="text-nowrap text-center">Estado</th>
                            <th className="text-nowrap text-center">Precio</th>
                            <th className="text-nowrap text-center">N° Recepción</th>
                          </tr>
                        </thead>

                        <tbody>
                          {elementosActuales.map((Lista, index) => {
                            const indexReal = indicePrimerElemento + index;

                            return (
                              <tr key={indexReal}>
                                <td style={{ position: "sticky", left: 0 }}>
                                  <Form.Check
                                    type="checkbox"
                                    onChange={() => setSeleccionaFilas(Lista.aF_CLAVE, Lista.aF_CODIGO_GENERICO, Lista.altaS_CORR, Lista.estabL_CORR)}
                                    checked={filasSeleccionadas.includes(Lista.aF_CLAVE.toString())}
                                  />
                                </td>

                                <td className="text-nowrap">{Lista.aF_CODIGO_GENERICO}</td>
                                <td className="text-nowrap">{Lista.altaS_CORR}</td>
                                {/* {(objeto.IdCredencial === 6405 || objeto.IdCredencial === 888) && (
                                  <td className="text-nowrap">{Lista.estabL_CORR === 1 ? <p className="badge bg-primary w-100 p-1">SSMSO</p> :
                                    Lista.estabL_CORR === 2 ? <p className="badge bg-warning w-100 p-1">CASR</p> :
                                      Lista.estabL_CORR === 3 ? <p className="badge bg-success w-100 p-1">HSJM</p> : ""}</td>
                                )} */}
                                <td className="text-nowrap">{Lista.serv}</td>
                                <td className="text-nowrap">{Lista.dep}</td>
                                <td className="text-nowrap">{Lista.aF_FINGRESO}</td>
                                <td className="text-nowrap">{Lista.esP_NOMBRE}</td>
                                <td className="text-nowrap">{Lista.ctA_COD}</td>
                                <td className="text-nowrap">{
                                  Lista.usuariO_CREA === '62511' ? 'Andy Riquelme' :
                                    Lista.usuariO_CREA === '18124' ? 'Rodrigo Toledo' :
                                      Lista.usuariO_CREA === 'JCASTILLO' || Lista.usuariO_CREA === 'jcastillo' || Lista.usuariO_CREA === '1770' ? 'Jaime Castillo' :
                                        Lista.usuariO_CREA === 'DROJASP' || Lista.usuariO_CREA === 'drojasp' || Lista.usuariO_CREA === '66098' ? 'Daniel Rojas' :
                                          Lista.usuariO_CREA === '1234567' || Lista.usuariO_CREA === '18667' ? 'Felipe Almonte' :
                                            Lista.usuariO_CREA === 'JVARGAS' || Lista.usuariO_CREA === 'jvargas' || Lista.usuariO_CREA === '6405' ? 'Jonathan Vargas' :
                                              Lista.usuariO_CREA === 'GFARIAS' || Lista.usuariO_CREA === 'gfarias' || Lista.usuariO_CREA === '888' ? 'Gabriela Farias' :
                                                Lista.usuariO_CREA === '61870' ? 'Elena Navarro' :
                                                  Lista.usuariO_CREA === '68321' ? 'Ivan Acevedo' :
                                                    Lista.usuariO_CREA === '67234' ? 'Ignacio Avilés' :
                                                      Lista.usuariO_CREA === '6601' ? 'Benjamin Bulboa' :
                                                        Lista.usuariO_CREA === '67404' ? 'Ademir Pindea' :
                                                          Lista.usuariO_CREA === '21479' ? 'Nelsn Quiroz' :
                                                            Lista.usuariO_CREA === 'KREYESD' || Lista.usuariO_CREA === 'kreyesd' || Lista.usuariO_CREA === '66099' ? 'Katherine Reyes' : Lista.usuariO_CREA


                                }</td>
                                <td className="text-nowrap">{Lista.deT_MARCA}</td>
                                <td className="text-nowrap">{Lista.deT_MODELO}</td>
                                <td className="text-nowrap">{Lista.deT_SERIE}</td>
                                <td className="text-nowrap">{Lista.estado}</td>
                                <td className="text-nowrap">
                                  $
                                  {(Lista.deT_PRECIO ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0, })}
                                </td>
                                <td className="text-nowrap">
                                  {Lista.nrecep === "" || parseInt(Lista.nrecep) === 0 ? "Sin Nº Recepción" : Lista.nrecep}
                                </td>
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
                  <p className={`text-center pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? "bg-dark text-light border border-secondary" : "bg-light text-muted border"}`}>
                    No hay resultados para mostrar.
                  </p>
                )}
              </>
            )}

          </div >
        </div>
      </div>
      {/* Modal formulario*/}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} dialogClassName="modal-right" backdrop="static">
        <Modal.Header className={`bg-secondary text-white `} closeButton>
          <Modal.Title className="fw-semibold">Enviar a Bodega de Excluidos
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                className="m-1 p-2 d-flex align-items-center"
                disabled={loading}
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
                    <span className="badge bg-light text-dark mx-1 mt-1">
                      {filasSeleccionadas.length}
                    </span>
                    {/* <Down
                      className={classNames("flex-shrink-0", "h-5 w-5 ms-1")}
                      aria-hidden="true"
                    /> */}
                  </>
                )}
              </Button>
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
                maxLength={8}
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
                max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
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
                className={`form-control ${error.observaciones ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                aria-label="observaciones"
                name="observaciones"
                rows={3}
                maxLength={300}
                style={{ maxHeight: "10rem" }}
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

      {/* Modal Resumen Bajas */}
      {listaSalidaBajas.length > 0 && (
        <>
          <Modal show={mostrarModalResumen} onHide={() => setMostrarModalResumen(false)} size="xl">
            {/* Mensaje */}
            <div className="py-2 rounded fw-semibold fs-09em bg-success bg-opacity-10 text-success border-none"
            >
              Se han enviado a bodega de excluidos <strong>{listaSalidaBajas.length}</strong> {listaSalidaBajas.length === 1 ? "bien" : "bienes"} correctamente.
            </div>
            <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
              <Modal.Title className="fw-semibold">Resumen de Bajas</Modal.Title>
            </Modal.Header>

            <div className={` d-flex justify-content-end p-4 border-bottom ${isDarkMode ? "darkModePrincipal" : ""}`}>
              <Button
                className={`px-4 py-2 mx-1 fw-semibold ${isDarkMode ? "btn-secondary" : "btn-primary"}`}
                onClick={() => {
                  navigate("/bajas/BodegaExcluidos");
                }}
              >
                Ir a Listado de Excluidos
              </Button>
              <Button
                variant={`${isDarkMode ? "secondary" : "primary"}`}
                onClick={handleAbrirModalExportar}
                disabled={listaSalidaBajas.length === 0 || loadingExportar}
              >
                {loadingExportar ? (
                  <>
                    Un Momento...
                    <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <FiletypePdf
                      className="flex-shrink-0 h-5 w-5 mx-2"
                      aria-hidden="true"
                    />
                    Exportar
                    <span className="badge bg-light text-dark mx-1 mt-1">
                      {/* {listaSalidaBajas.length} */}
                    </span>
                  </>
                )}
              </Button>
            </div>
            <Modal.Body id="pdf-content" className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
              <Row className="mb-4 d-flex justify-content-between">
                <Col md={4}>
                  <p><strong>Certificado N° </strong> {listaSalidaBajas[0]?.nresolucion}</p>
                </Col>
                <Col md={4}>
                  <p><span className="fw-semibold">Fecha Baja: </span>{formatearFecha(listaSalidaBajas[0]?.fechA_BAJA)}</p>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={4}>
                  <p className="fw-semibold">Destino</p>
                  <p>
                    Bodega de Excluidos
                  </p>
                </Col>
              </Row>
              <Col className="row align-items-center justify-content-center gap-2 px-2">

                {listaSalidaBajas.length > 10 && (
                  <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                    <label htmlFor="nPaginacion1" className="form-label fw-semibold mb-0 me-2">
                      Tamaño de página:
                    </label>
                    <select
                      aria-label="Seleccionar tamaño de página"
                      className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      name="nPaginacion1"
                      onChange={handleChange}
                      value={Paginacion1.nPaginacion1}
                    >
                      {[10, 15, 20, 25, 50, 100].map((val) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                )}
              </Col>

              <div className="table-responsive" style={{ maxHeight: "50vh", overflowY: "auto" }}>
                <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                  <thead>
                    <tr>
                      <th className="text-center">Nº Inventario</th>
                      <th className="text-center">Especie</th>
                      <th className="text-center">Marca</th>
                      <th className="text-center">Modelo</th>
                      <th className="text-center">Serie</th>
                      {/* <th className="text-center">Observación</th>
                      <th className="text-center">Estado</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {elementosActuales1.length > 0 ? (
                      elementosActuales1.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{item.aF_CLAVE || 'N/A'}</td>
                          <td className="text-center">{item.esP_NOMBRE || 'N/A'}</td>
                          <td className="text-center">{item.deT_MARCA || 'N/A'}</td>
                          <td className="text-center">{item.deT_MODELO || 'N/A'}</td>
                          <td className="text-center">{item.deT_SERIE || 'N/A'}</td>
                          {/* <td className="text-center">{item.deT_OBS || 'N/A'}</td>
                          <td className="text-center">{item.paS_ESTADO_AF || 'N/A'}</td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="text-center">No hay registros</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Paginador */}
              {listaSalidaBajas.length > 10 && (
                <div className="paginador-container mt-3">
                  <Pagination className="paginador-scroll justify-content-center">
                    <Pagination.First onClick={() => paginar1(1)} disabled={paginaActual1 === 1} />
                    <Pagination.Prev
                      onClick={() => paginar1(paginaActual1 - 1)}
                      disabled={paginaActual1 === 1}
                    />
                    {Array.from({ length: totalPaginas1 }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === paginaActual1}
                        onClick={() => paginar1(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => paginar1(paginaActual1 + 1)}
                      disabled={paginaActual1 === totalPaginas1}
                    />
                    <Pagination.Last
                      onClick={() => paginar1(totalPaginas1)}
                      disabled={paginaActual1 === totalPaginas1}
                    />
                  </Pagination>
                </div>
              )}
            </Modal.Body>
          </Modal>
          {
            loading && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 z-99999 d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  // zIndex: 1050,
                }}
              >
                <div className="text-center">
                  <div className="spinner-border text-light mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
                  <p className="text-white fw-semibold mb-0">Enviando, un momento...</p>
                </div>
              </div>
            )
          }
        </>
      )}

      {/* Modal PDF Excel Word */}
      <Modal
        show={modalMostrarExportar}
        onHide={() => setModalMostrarExportar(false)}
        size="xl"
        centered={false}
        animation={false}
        handle=".modal-header"
        cancel=".modal-body"
        dialogAs={(props) => (
          <Draggable
            handle=".modal-header"
            cancel=".modal-body"
          >
            <ModalDialog {...props} />
          </Draggable>
        )}
      >
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton
          style={{
            cursor: "move",
            userSelect: "none"
          }}
        >
          <Modal.Title className="fw-semibold">Exportar</Modal.Title>
        </Modal.Header>
        <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
          {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
          <BlobProvider
            document={
              <DocumentoPDFResumenBajas
                listaSalidaBajas={listaSalidaBajas}
              />
            }
          >
            {({ url, loading }) => {
              // Cuando el PDF termina de cargarse, apagamos el spinner
              useEffect(() => {
                if (!loading) {
                  setLoadingExportar(false);
                }
              }, [loading]);

              return loading ? (
                <p>Generando vista previa...</p>
              ) : (
                <>
                  <iframe
                    src={url ?? ""}
                    title="Vista Previa del PDF"
                    style={{
                      width: "100%",
                      height: "900px",
                      border: "none"
                    }}
                  ></iframe>
                </>
              );
            }}
          </BlobProvider>
        </Modal.Body>
      </Modal>
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listadoGeneralBajas: state.datosListadoGeneralBajasReducers.listadoGeneralBajas || [],
  listaSalidaBajas: state.datosBajasRegistradaReducers.listaSalidaBajas || [],
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  listaAltasdesdeBajasActions,
  registrarBienesBajasActions
})(ListadoGeneral);
