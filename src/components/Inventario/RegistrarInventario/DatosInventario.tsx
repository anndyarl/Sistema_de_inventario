import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Modal, OverlayTrigger, Pagination, Row, Spinner, Tooltip } from "react-bootstrap";
import React, { useState, useEffect, useMemo } from "react";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import Swal from "sweetalert2";
import Select from "react-select";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
//importacion de objetos desde actions de redux
import {
  setNRecepcionActions,
  setFechaRecepcionActions,
  setNOrdenCompraActions,
  setNFacturaActions,
  setOrigenPresupuestoActions,
  setMontoRecepcionActions,
  setFechaFacturaActions,
  setRutProveedorActions,
  setModalidadCompraActions,
  vaciarDatosTabla,
  setServicioActions,
  setDependenciaActions,
  setCuentaActions,
  setBienActions,
  setDetalleActions,
  setEspecieActions,
  // setOtraModalidadActions,
  showInputActions,
  setOtroProveedorActions,
  setInventarioRegistrado,
  setTipoInventarioActions
} from "../../../redux/actions/Inventario/RegistrarInventario/datosRegistroInventarioActions";
import { obtenerRecepcionActions } from "../../../redux/actions/Inventario/RegistrarInventario/obtenerRecepcionActions";
import { ActivoFijo } from "./DatosActivoFijo";
import { Eraser, EraserFill, FiletypePdf, Info } from "react-bootstrap-icons";
import { Objeto } from "../../Navegacion/Profile";
import { DEPENDENCIA } from "./DatosCuenta";
import { obtenerServicioNombreActions } from "../../../redux/actions/Inventario/RegistrarInventario/obtenerServicioNombreActions";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoPDFResumen from "./DocumentoPDFResumen";
import { comboModalidadesActions } from "../../../redux/actions/Inventario/Combos/comboModalidadCompraActions";
import { registrarModalidadActions } from "../../../redux/actions/Inventario/ModificarInventario/registrarModalidadActions";
import { useNavigate } from "react-router-dom";

// Define el tipo de los elementos del combo `OrigenPresupuesto`
export interface ORIGEN {
  codigo: number;
  descripcion: string;
}

// Define el tipo de los elementos del combo `ModalidadCompra`
export interface MODALIDAD {
  codigo: string;
  descripcion: string;
}
// Define el tipo de los elementos del combo `Proveedor`
export interface PROVEEDOR {
  proV_RUN: number,
  proV_NOMBRE: string
}

// Props del formulario
export interface InventarioProps {
  fechaFactura: string;
  fechaRecepcion: string;
  montoRecepcion: number;
  nFactura: string;
  nOrdenCompra: string;
  nRecepcion: number;
  origenPresupuesto: number;
  rutProveedor: number;
  usuarioCrea?: string;
  modalidadDeCompra: number;
  otraModalidad: string;
  showInputReducer?: boolean;
  establecimiento?: number;
  tipoInventario: string; // 1 Inventario general(todos sus campos obligatorios) | 2 Inventario de funcionario(Origen presupuesto y precio son Obligatorios)
}

/*-----Se definen nuevas props para no tener conflictos------*/
export interface FormulariosCombinados {
  fechaFacturaR: string;
  fechaRecepcionR: string;
  modalidadDeCompraR: number;
  otraModalidadR: string | null;
  montoRecepcionR: number;
  nFacturaR: string;
  nOrdenCompraR: string;
  nRecepcionR: number;
  origenPresupuestoR: number;
  rutProveedorR: number;
  servicioR: number;
  cantidadR: number;
  dependenciaR: number;
  especieR: string;
}

export interface ActijosFijos {
  id: string;
  vidaUtil: string;
  fechaIngreso: string;
  marca: string;
  cuenta: string;
  cantidad: string;
  modelo: string;
  observaciones: string;
  serie: string;
  precio: string;
  dependencia: number;
  especie: string;
  color: string;
}

interface ServicioNomnbre {
  seR_COD: string;
  nombre: string;
}

interface ListaEspecie {
  estabL_CORR: number;
  esP_CODIGO: string;
  nombrE_ESP: string;
}

// Define el tipo de props para el componente, extendiendo InventarioProps
interface DatosInventarioProps extends InventarioProps {
  onNext: (Inventario: InventarioProps) => void; //Se pasan los datos a medida que se da siguiente al siguiente componente
  comboOrigen: ORIGEN[];
  comboModalidad: MODALIDAD[];
  comboProveedor: PROVEEDOR[];
  comboDependencia: DEPENDENCIA[];
  comboEspecies: ListaEspecie[];
  datosTablaActivoFijo: ActivoFijo[]; // se utliza aqui para validar el monto recepción, por si se tipea un cambio
  // obtenerRecepcionActions: (nRecepcion: number) => Promise<Boolean>;
  obtenerServicioNombreActions: (dep_corr: number) => Promise<Boolean>;
  onOrigenSeleccionado: (codOrigen: number) => void;
  comboModalidadesActions: () => Promise<boolean>;
  registrarModalidadActions: (otraModalidad: string) => Promise<number | null>;
  // listaInventarioRegistradoActions: () => Promise<Boolean>;
  isDarkMode: boolean;
  objeto: Objeto;
  resultadoRegistro?: number;
  formulariosCombinados: FormulariosCombinados;
  activosFijos: ActijosFijos[];
  listaServicioNombre: ServicioNomnbre[];
}

//Paso 1 del Formulario
const DatosInventario: React.FC<DatosInventarioProps> = ({
  onNext,
  obtenerServicioNombreActions,
  onOrigenSeleccionado,
  comboModalidadesActions,
  registrarModalidadActions,
  // obtenerRecepcionActions,
  comboOrigen,
  comboModalidad,
  comboProveedor,
  comboDependencia,
  fechaFactura,
  fechaRecepcion,
  montoRecepcion,
  nFactura,
  nOrdenCompra,
  nRecepcion,
  usuarioCrea,
  establecimiento,
  origenPresupuesto,
  tipoInventario,
  /*-------Modalidad compra----*/
  modalidadDeCompra,
  otraModalidad,
  showInputReducer,
  /*-------Fin Modalidad compra----*/
  rutProveedor,
  datosTablaActivoFijo,
  isDarkMode,
  objeto,
  resultadoRegistro,
  /*----resumen inventario registrado*/
  formulariosCombinados,
  activosFijos,
  comboEspecies,
  listaServicioNombre
}) => {
  const [Inventario, setInventario] = useState<InventarioProps>({
    fechaFactura: "",
    fechaRecepcion: "",
    modalidadDeCompra: 0,
    montoRecepcion: 0,
    nFactura: "",
    nOrdenCompra: "",
    nRecepcion: 0,
    origenPresupuesto: 0,
    rutProveedor: 0,
    otraModalidad: "",
    establecimiento: objeto.Roles[0].codigoEstablecimiento,
    tipoInventario: "1"
  });

  const dispatch = useDispatch<AppDispatch>();

  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState<Partial<InventarioProps> & { general?: string; generalTabla?: string }>({});
  const [isMontoRecepcionEdited, setIsMontoRecepcionEdited] = useState(false); // Validaciones
  // const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [modalMostrarResumen, setModalMostrarResumen] = useState(false);
  const [modalMostrarExportar, setModalMostrarExportar] = useState(false);
  const [loadingExportar, setLoadingExportar] = useState(false);
  const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = Paginacion.nPaginacion;
  const [loadingModalidadCompra, setLoadingModalidadCompra] = useState(false);
  const navigate = useNavigate();
  const proveedorOptions = comboProveedor.map((item) => ({
    value: item.proV_RUN,
    label: item.proV_NOMBRE,
  }));

  const handleProveedorChange = (selectedOption: { value: number; label: string } | null) => {
    let value = selectedOption ? selectedOption.value : 0;
    value = Number(value) || 0;

    setInventario((prev) => ({
      ...prev,
      rutProveedor: value,
    }));

    dispatch(setRutProveedorActions(Number(value) || 0));
  };

  //Validaciones del formulario
  const validate = () => {
    let tempErrors: Partial<any> & {} = {};

    // Validación para Bienes Funcionarios
    if (Inventario.tipoInventario === "2") { // Inventario tpo 2 es Bienes de funcionario

      // origenPresupuesto
      if (!Inventario.origenPresupuesto) {
        tempErrors.origenPresupuesto = "Campo obligatorio";
      }

      // montoRecepcion
      if (!Inventario.montoRecepcion && Inventario.montoRecepcion === 0) {
        tempErrors.montoRecepcion = "Campo obligatorio";
      } else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.montoRecepcion))) {
        tempErrors.montoRecepcion = "Monto inválido (máx. 2 decimales)";
      }

      setError(tempErrors);
      return Object.keys(tempErrors).length === 0;
    }
    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.nRecepcion && Inventario.nRecepcion === 0) tempErrors.nRecepcion = "Campo obligatorio";
    if (!Inventario.fechaRecepcion) tempErrors.fechaRecepcion = "Campo obligatorio";
    if (!Inventario.nOrdenCompra) tempErrors.nOrdenCompra = "Campo obligatorio";
    if (!Inventario.nFactura) tempErrors.nFactura = "Campo obligatorio";
    if (!Inventario.origenPresupuesto) tempErrors.origenPresupuesto = "Campo obligatorio";
    if (!Inventario.montoRecepcion && Inventario.montoRecepcion === 0) tempErrors.montoRecepcion = "Campo obligatorio";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.montoRecepcion))) tempErrors.montoRecepcion = "El Monto debe ser un número válido con hasta dos decimales.";
    if (!Inventario.fechaFactura) tempErrors.fechaFactura = "Campo obligatorio";
    if (!Inventario.rutProveedor) tempErrors.rutProveedor = "Campo obligatorio";
    /*---------Modalidad Compra----------*/
    if (!Inventario.modalidadDeCompra) tempErrors.modalidadDeCompra = "Campo obligatorio";
    if (showInputReducer) {
      if (!Inventario.otraModalidad) tempErrors.otraModalidad = "Campo obligatorio";
    }
    /*---------Fin Modalidad Compra----------*/
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  //Validaciones modalidad registra otra
  const validaModalidad = () => {
    let tempErrors: Partial<any> & {} = {};
    if (!Inventario.otraModalidad) tempErrors.otraModalidad = "Ingrese un nueva modalidad";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convierte `value` a número
    let newValue: string | number = ["montoRecepcion", "nRecepcion", "rutProveedor"].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;

    setInventario((prevInventario) => ({
      ...prevInventario,
      [name]: newValue,
    }));

    setPaginacion((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "nPaginacion") {
      paginar(1);
    }

    // Ejecuta los dispatch correspondientes
    if (name === "fechaFactura") {
      dispatch(setFechaFacturaActions(newValue as string));
    } else if (name === "fechaRecepcion") {
      dispatch(setFechaRecepcionActions(newValue as string));
    } else if (name === "nFactura") {
      dispatch(setNFacturaActions(newValue as string));
    } else if (name === "nOrdenCompra") {
      dispatch(setNOrdenCompraActions(newValue as string));
    } else if (name === "nRecepcion") {
      dispatch(setNRecepcionActions(newValue as number)); // Convertido a número
    } else if (name === "origenPresupuesto") {
      newValue = parseFloat(value) || 0;
      dispatch(setOrigenPresupuestoActions(newValue as number)); // Convertido a número   
      onOrigenSeleccionado(newValue);//guardo el origen para pasarselo a al componente FormInventario
    }
    else if (name === "montoRecepcion") {
      newValue = parseFloat(value) || 0;
      dispatch(setMontoRecepcionActions(newValue as number)); // Convertido a número
    }
    else if (name === "modalidadDeCompra") {
      newValue = parseFloat(value) || 0;
      // dispatch(setModalidadCompraActions(newValue as number)); // Convertido a número  
      //Al seleccionar "Otros" es decir el valor 7 este habilitará el input text
      if (value === "-1") { // cero es igual a Otros
        setShowInput(true); //estado de react para mostrar el input Otros
        dispatch(showInputActions(true)); //Se envia al estado de Otros a redux para guardarlo
        dispatch(setModalidadCompraActions(newValue));
      } else {
        setShowInput(false);
        dispatch(showInputActions(false));
        dispatch(setModalidadCompraActions(newValue));
      }
    }
    // else if (name === "otraModalidad") {
    //   dispatch(setOtraModalidadActions(newValue as string));
    // }
    else if (name === "rutProveedor") {
      newValue = parseFloat(value) || 0;
      dispatch(setRutProveedorActions(newValue as number));
    }
    else if (name === "otroProveedor") {
      dispatch(setOtroProveedorActions(newValue as string));
    }
    if (name === "montoRecepcion" && datosTablaActivoFijo.length > 0) {
      if (!isMontoRecepcionEdited) {
        Swal.fire({
          icon: "warning",
          title: "¿Está seguro que desea modificar monto recepción?",
          text: "Al modificar el monto de recepción, se eliminarán los datos registrados en la tabla de activos fijos(Paso 3).",
          showCancelButton: true,
          confirmButtonText: "Si, Modificar",
          cancelButtonText: "Cancelar",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        }).then((result) => {
          if (result.isConfirmed) {
            setInventario((prevInventario) => ({
              ...prevInventario,
              [name]: 0,
            }));
            setIsMontoRecepcionEdited(true);
            dispatch(vaciarDatosTabla());
          }
          else {
            setInventario((prevInventario) => ({
              ...prevInventario,
              [name]: Inventario.montoRecepcion,
            }));
          }
        });
        return;
      }
    }
    if (name === "tipoInventario") {

      dispatch(setTipoInventarioActions(value));

      if (value === "2") {
        setInventario(prev => ({
          ...prev,
          tipoInventario: value,
          origenPresupuesto: 6
        }));
        dispatch(setOrigenPresupuestoActions(6));
      }
      else {
        setInventario(prev => ({
          ...prev,
          tipoInventario: value,
          origenPresupuesto: 0
        }));
        dispatch(setOrigenPresupuestoActions(0));
      }

      return;
    }
  };

  const mostrarAlerta = () => {
    document.body.style.overflow = "hidden"; // Evita que el fondo se desplace
    Swal.fire({
      icon: "success",
      title: "Registro Exitoso",
      text: `Su formulario ha sido registrado exitosamente. Presione "OK" para visualizar un resumen de los datos ingresados.`,
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
      customClass: {
        popup: "custom-border", // Clase personalizada para el borde
      },
      allowOutsideClick: false,
      showCancelButton: false,
      cancelButtonText: "Cerrar",
      willClose: () => {
        document.body.style.overflow = "auto"; // Restaura el scroll
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setModalMostrarResumen(true);
        dispatch(setInventarioRegistrado(0));
      }
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //   dispatch(setInventarioRegistrado(0));
      // }
    });
  };

  // Muestra la alerta solo si resultadoRegistro es 1
  useEffect(() => {
    // dispatch(setInventarioRegistrado(1));
    // setModalMostrarResumen(true);
    if (resultadoRegistro === 1) {
      for (let i = 0; i < comboDependencia.length; i++) {
        const dep_corr_n = comboDependencia[i].deP_CORR;
        if (listaServicioNombre.length === 0) {
          obtenerServicioNombreActions(dep_corr_n); //consulta nombre servicio por dep_corr
          // console.log(dep_corr_n);
        }
        break;
      }
      mostrarAlerta();
    }
  }, [resultadoRegistro]); // Dependencia correcta, sin ejecutar directamente mostrarAlerta()

  //Se usa este useEffect para trae desde el boton de busqueda
  useEffect(() => {
    setInventario({
      fechaFactura,
      fechaRecepcion,
      modalidadDeCompra,
      otraModalidad,
      // ...(showInputReducer ? { otraModalidad } : {}), // Permite pasar el estado del input otraModalidad solo si es seleccionado
      montoRecepcion,
      nFactura,
      nOrdenCompra,
      nRecepcion,
      origenPresupuesto,
      rutProveedor,
      usuarioCrea: objeto.IdCredencial.toString(),
      establecimiento: objeto.Roles[0].codigoEstablecimiento,
      tipoInventario
    });

  }, [
    fechaFactura,
    fechaRecepcion,
    modalidadDeCompra,
    montoRecepcion,
    nFactura,
    nOrdenCompra,
    nRecepcion,
    origenPresupuesto,
    rutProveedor,
    otraModalidad,
    showInputReducer,
    usuarioCrea,
    establecimiento
  ]);

  // const handleRecepcionSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   setLoading(true); // Inicia el estado de carga
  //   if (!Inventario.nRecepcion) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Por favor, ingrese un número de recepción.",
  //       confirmButtonText: "Ok",
  //       background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //       color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //       confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
  //       customClass: {
  //         popup: "custom-border", // Clase personalizada para el borde
  //       }
  //     });
  //     setLoading(false);
  //     return;
  //   }
  //   // Despacha la acción para obtener la recepción en el formulario de activos fijos
  //   const resultado = await obtenerRecepcionActions(Inventario.nRecepcion);
  //   if (!resultado) {
  //     Swal.fire({
  //       icon: "error",
  //       title: ":'(",
  //       text: "No se encontraron resultados, inténte otro registro.",
  //       confirmButtonText: "Ok",
  //       background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //       color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //       confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
  //       customClass: {
  //         popup: "custom-border", // Clase personalizada para el borde
  //       }
  //     });
  //     setLoading(false); //Finaliza estado de carga
  //     return;
  //   } else {
  //     setLoading(false); //Finaliza estado de carga
  //   }
  // };

  const handleLimpiar = () => {
    const { usuarioCrea, ...restoTraslados } = Inventario;
    const tieneDatos = Object.values(restoTraslados).some(
      (valor) => valor !== "" && valor !== 0);
    if (tieneDatos) {
      Swal.fire({
        icon: "warning",
        title: "¿Está seguro de que desea limpiar el formulario?",
        text: "Esta acción eliminará todos los datos ingresados en los pasos completados.",
        showCancelButton: true,
        confirmButtonText: "Si, Limpiar",
        cancelButtonText: "Cancelar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setInventario((prevInventario) => ({
            ...prevInventario,
            fechaFactura: "",
            fechaRecepcion: "",
            modalidadDeCompra: 0,
            montoRecepcion: 0,
            nFactura: "",
            nOrdenCompra: "",
            nRecepcion: 0,
            nombreProveedor: "",
            origenPresupuesto: 0,
            rutProveedor: 0
          }));
          dispatch(setNRecepcionActions(0));
          dispatch(setFechaRecepcionActions(""));
          dispatch(setNOrdenCompraActions(""));
          dispatch(setNFacturaActions(""));
          dispatch(setOrigenPresupuestoActions(0));
          dispatch(setMontoRecepcionActions(0));
          dispatch(setFechaFacturaActions(""));
          dispatch(setRutProveedorActions(0));
          dispatch(setModalidadCompraActions(0));
          dispatch(setModalidadCompraActions(0));
          dispatch(setServicioActions(0));
          dispatch(setDependenciaActions(0));
          dispatch(setCuentaActions(0));
          dispatch(setBienActions(0));
          dispatch(setDetalleActions(0));
          dispatch(setEspecieActions(""));
          dispatch(vaciarDatosTabla());
        }
      });
    }
  }

  //En el componente DatosActivoFijo se encuentra el post del fomrulario completo
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      dispatch(setMontoRecepcionActions(Inventario.montoRecepcion));
      onNext(Inventario);
      console.log(Inventario);
    }
  };

  // const handleExportPDF = () => {
  //   const input: any = document.getElementById("pdf-content");
  //   html2canvas(input, { scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const imgWidth = 190;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  //     pdf.save("Resumen_Inventario.pdf");
  //   });
  // };

  const handleAbrirModalExportar = () => {
    setLoadingExportar(true);
    // Espera un ciclo de evento para mostrar el modal
    setTimeout(() => {
      setModalMostrarExportar(true);
    }, 50); //se ajusta este tiempo para que cargue de inmediato
  };

  const handleCargarMCompra = async () => {
    if (comboModalidad.length === 0) {
      setLoadingModalidadCompra(true);
      const resultado = await comboModalidadesActions();
      if (resultado) {
        setLoadingModalidadCompra(false);
      }
    }
  }

  const handleRegistrarModalidad = async () => {
    if (validaModalidad()) {
      const result = await Swal.fire({
        icon: "info",
        title: "Agregar Modalidad",
        text: "Confirme para agregar una nueva modalidad.",
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
        const ultimaModalidad = await registrarModalidadActions(Inventario.otraModalidad.trim());
        console.log(Inventario.otraModalidad.trim());

        if (ultimaModalidad === null) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al registrar la nueva modalidad. Por favor, intente nuevamente.",
            background: isDarkMode ? "#1e1e1e" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
            confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
            customClass: { popup: "custom-border" },
          });
          return;
        }
        if (ultimaModalidad === -1) {
          Swal.fire({
            icon: "warning",
            title: "Modalidad ya registrada",
            html: `La modalidad que intenta ingresar ya existe.<br>
              Por favor, utilice un nombre diferente.`,
            background: isDarkMode ? "#1e1e1e" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
            confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
            customClass: { popup: "custom-border" },
          });
          return;
        }

        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Se ha registrado una nueva modalidad",
          background: isDarkMode ? "#1e1e1e" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
          confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
          customClass: { popup: "custom-border" },
        });

        await comboModalidadesActions();
        setShowInput(false);
        dispatch(showInputActions(false));

        setInventario((prev) => ({
          ...prev,
          modalidadDeCompra: ultimaModalidad
        }));

        dispatch(setModalidadCompraActions(ultimaModalidad));
      }
    }
  };
  //------------------------------Tabla Modal(Resumen)--------------------------------------//
  // Lógica de Paginación actualizada 
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () =>
      activosFijos.slice(indicePrimerElemento, indiceUltimoElemento),
    [activosFijos, indicePrimerElemento, indiceUltimoElemento]
  );
  const totalPaginas = Array.isArray(activosFijos)
    ? Math.ceil(activosFijos.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);
  //------------------------------ Fin Tabla Modal(Resumen)--------------------------------------//
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={`border border-botom p-2 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">
            Registrar Inventario
          </h3>
          {objeto.Roles[0].codigoEstablecimiento === 1 && (
            <div className="mb-4">
              <label
                htmlFor="tipoInventario"
                className="fw-bold mb-1 text-secondary"
              >
                Tipo de Inventario
              </label>

              <select
                id="tipoInventario"
                name="tipoInventario"
                value={tipoInventario}
                onChange={handleChange}
                className={`form-select form-select-sm rounded-pill px-3 shadow-sm 
    ${isDarkMode ? "bg-dark text-light border-light" : "bg-white border-secondary"}`}
                style={{
                  width: "260px",
                  fontWeight: 600,
                  borderWidth: "2px",
                }}
              >
                <option value="1" selected>General</option>
                <option value="2">Bienes de Funcionarios</option>
              </select>

            </div >
          )}

          <Row>
            <Col md={4}>
              {/* Nº Recepción */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Nº Recepción *
                </label>
                <div className="d-flex align-items-center">
                  <input
                    aria-label="nRecepcion"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.nRecepcion ? "is-invalid" : ""}`}
                    maxLength={12}
                    name="nRecepcion"
                    onChange={handleChange}
                    value={Inventario.nRecepcion}
                  />
                  {/* <Button
                    onClick={handleRecepcionSubmit}
                    variant="primary"
                    className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}
                  >
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      <Search
                        className={classNames("flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />
                    )}
                  </Button> */}
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-limpiar">Limpiar formulario</Tooltip>}
                  >
                    <Button
                      onClick={handleLimpiar}
                      variant="primary"
                      className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"} mx-1`}
                    >
                      {
                        (() => {
                          const { usuarioCrea, ...restoTraslados } = Inventario;
                          const tieneDatos = Object.values(restoTraslados).some(
                            (valor) => valor !== "" && valor !== 0
                          );
                          return tieneDatos ? (
                            <EraserFill
                              className="flex-shrink-0 h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <Eraser
                              className="flex-shrink-0 h-5 w-5"
                              aria-hidden="true"
                            />
                          );
                        })()
                      }
                    </Button>
                  </OverlayTrigger>
                </div>
                {error.nRecepcion && (
                  <div className="invalid-feedback fw-semibold d-block">
                    {error.nRecepcion}
                  </div>
                )}
              </div>
              {/* Fecha Recepción */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Fecha Recepción *
                </label>
                <input
                  aria-label="fechaRecepcion"
                  type="date"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaRecepcion ? "is-invalid" : ""}`}
                  name="fechaRecepcion"
                  onChange={handleChange}
                  value={Inventario.fechaRecepcion}
                  max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                />
                {error.fechaRecepcion && (
                  <div className="invalid-feedback fw-semibold">{error.fechaRecepcion}</div>
                )}
              </div>
              {/* N° Orden de Compra */}
              <div className="mb-1">
                <label className="fw-semibold">
                  N° Orden de Compra *
                </label>
                <input
                  aria-label="nOrdenCompra"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                    } ${error.nOrdenCompra ? "is-invalid" : ""}`}
                  maxLength={30}
                  name="nOrdenCompra"
                  onChange={handleChange}
                  value={Inventario.nOrdenCompra}
                />
                {error.nOrdenCompra && (
                  <div className="invalid-feedback fw-semibold">{error.nOrdenCompra}</div>
                )}
              </div>
            </Col>

            <Col md={4}>
              {/* Nº Factura */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Nº Factura *
                </label>
                <input
                  aria-label="nFactura"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                    } ${error.nFactura ? "is-invalid" : ""}`}
                  maxLength={12}
                  name="nFactura"
                  onChange={handleChange}
                  value={Inventario.nFactura}
                />
                {error.nFactura && (
                  <div className="invalid-feedback fw-semibold">{error.nFactura}</div>
                )}
              </div>
              {/* Origen Presupuesto */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Origen Presupuesto *
                </label>
                <select
                  aria-label="origenPresupuesto"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                    } ${error.origenPresupuesto ? "is-invalid" : ""}`}
                  name="origenPresupuesto"
                  onChange={handleChange}
                  value={Inventario.origenPresupuesto}
                >
                  <option value="">Seleccionar</option>
                  {comboOrigen.map((traeOrigen) => (
                    <option key={traeOrigen.codigo} value={traeOrigen.codigo}>
                      {traeOrigen.descripcion}
                    </option>
                  ))}

                </select>
                {error.origenPresupuesto && (
                  <div className="invalid-feedback fw-semibold">{error.origenPresupuesto}</div>
                )}
              </div>
              {/* Monto Recepción */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Monto Recepción *
                </label>
                <input
                  aria-label="montoRecepcion"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.montoRecepcion ? "is-invalid" : ""}`}
                  maxLength={12}
                  name="montoRecepcion"
                  onChange={handleChange}
                  value={Inventario.montoRecepcion}
                />
                {error.montoRecepcion && (
                  <div className="invalid-feedback fw-semibold">{error.montoRecepcion}</div>
                )}
              </div>
            </Col>

            <Col md={4}>
              {/* Fecha Factura */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Fecha Factura *
                </label>
                <input
                  aria-label="fechaFactura"
                  type="date"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                    } ${error.fechaFactura ? "is-invalid" : ""}`}
                  name="fechaFactura"
                  onChange={handleChange}
                  value={Inventario.fechaFactura}
                  max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                />
                {error.fechaFactura && (
                  <div className="invalid-feedback fw-semibold">{error.fechaFactura}</div>
                )}
              </div>
              {/* Proveedor */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Proveedor *
                </label>
                <Select
                  options={proveedorOptions}
                  onChange={handleProveedorChange}
                  name="rutProveedor"
                  value={
                    Inventario.rutProveedor && Inventario.rutProveedor !== 0
                      ? proveedorOptions.find((option) => option.value === Inventario.rutProveedor)
                      : null
                  }
                  placeholder="Buscar"
                  isClearable
                  isSearchable
                  className={`form-select-container ${error.rutProveedor ? "is-invalid border border-danger rounded" : ""}`}
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#212529" : "white",
                      color: isDarkMode ? "white" : "#212529",
                      borderColor: isDarkMode ? "rgb(108 117 125)" : "#a6a6a66e",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: isDarkMode ? "white" : "#212529",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#212529" : "white",
                      color: isDarkMode ? "white" : "#212529",
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected
                        ? "#6c757d"
                        : isFocused
                          ? "#6c757d"
                          : isDarkMode
                            ? "#212529"
                            : "white",
                      color: isSelected
                        ? "white"
                        : isFocused
                          ? "white"
                          : isDarkMode
                            ? "white"
                            : "#212529",
                    }),
                  }}
                />


                {error.rutProveedor && (
                  <div className="invalid-feedback fw-semibold">{error.rutProveedor}</div>
                )}

              </div>
              {/* Modalidad de Compra */}
              {/* Modalidad de Compra */}
              <div className="mb-2">
                <label className="fw-semibold mb-1">
                  Modalidad de Compra *
                </label>

                <div className="input-group">
                  <select
                    aria-label="modalidadDeCompra"
                    className={`${loadingModalidadCompra ? "form-control border-end-0" : "form-select"}
                    ${isDarkMode ? "bg-dark text-light border-secondary" : ""}
                    ${error.modalidadDeCompra ? "is-invalid" : ""}`}
                    name="modalidadDeCompra"
                    onChange={handleChange}
                    onClick={handleCargarMCompra}   // opcional si cargas bajo demanda
                    value={Inventario.modalidadDeCompra}

                  >
                    <option value="">
                      {loadingModalidadCompra
                        ? "Cargando modalidades…"
                        : "Seleccione una modalidad"}
                    </option>

                    {comboModalidad.map((traeModalidad) => (
                      <option
                        key={traeModalidad.codigo}
                        value={traeModalidad.codigo}
                      >
                        {traeModalidad.descripcion}
                      </option>
                    ))}

                    {/* opción Otros */}
                    <option value="-1">Otros</option>
                  </select>

                  {/* Spinner integrado */}
                  {loadingModalidadCompra && (
                    <span
                      className="input-group-text border-start-0"
                      style={{
                        backgroundColor: isDarkMode ? "#212529" : "rgb(233, 236, 239)",
                        border: "1px solid",
                        borderColor: isDarkMode ? "#6c757d" : "#dee2e6",
                      }}
                    >
                      <Spinner
                        animation="border"
                        size="sm"
                        variant={isDarkMode ? "light" : "primary"}
                      />
                    </span>
                  )}
                </div>

                {error.modalidadDeCompra && (
                  <div className="invalid-feedback d-block fw-semibold">
                    {error.modalidadDeCompra}
                  </div>
                )}

                {/* Input Otra Modalidad */}
                {showInput && (
                  <div className="d-flex mt-1">
                    <div className="w-100">
                      <input
                        aria-label="otraModalidad"
                        type="text"
                        className={`form-control
          ${isDarkMode ? "bg-secondary text-light border-secondary" : ""}
          ${error.otraModalidad ? "is-invalid" : ""}`}
                        name="otraModalidad"
                        placeholder="Especifique otro"
                        onChange={handleChange}
                        value={Inventario.otraModalidad || ""}
                      />
                    </div>

                    {/* Botón opcional para registrar */}
                    <Button
                      variant={isDarkMode ? "secondary" : "primary"}
                      className="ms-1"
                      onClick={handleRegistrarModalidad}
                    >
                      +
                    </Button>
                  </div>
                )}

                {error.otraModalidad && (
                  <div className="invalid-feedback fw-semibold d-block">
                    {error.otraModalidad}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <div className="rounded d-flex justify-content-end m-2">

            <button type="submit" disabled={showInput === true} className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}>
              Siguiente
            </button>
          </div>
          <p className="fw-semibold"><Info width={22} height={22} aria-hidden="true" /> Campos obligatorios *</p>
        </div>
      </form>

      <Modal show={modalMostrarResumen} onHide={() => setModalMostrarResumen(false)} size="xl">
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title className="fw-semibold">Resumen de Registro de Activos Fijos</Modal.Title>
        </Modal.Header>

        <div className={` d-flex justify-content-end p-4 border-bottom ${isDarkMode ? "darkModePrincipal" : ""}`}>

          <Button
            variant={`${isDarkMode ? "secondary" : "primary"}`}
            onClick={handleAbrirModalExportar}
            disabled={activosFijos.length === 0 || loadingExportar}
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
                  {/* {activosFijos.length} */}
                </span>
              </>
            )}
          </Button>

        </div>
        {tipoInventario === "2" && (
          <div className={`d-flex flex-column flex-md-row align-items-center bg-light border-start border-4 border-warning shadow-sm rounded p-2 gap-2 m-2`}>
            <p className="fw-semibold small text-dark">
              Para completar el registro de los bienes de funcionarios debe adjuntar la documentación correspondiente
            </p>
            <Button onClick={() => navigate("/Inventario/RegistroBienesFuncionarios")}
              className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  px-4 py-2`}>
              Aquí
            </Button>
          </div>
        )}
        <Modal.Body id="pdf-content" className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <Row className="mb-4">
            <Col md={4}>
              <p><strong>Nº Recepción:</strong></p>
              <p>{formulariosCombinados.nRecepcionR || 'N/A'}</p>
              <p><strong>Fecha Recepción:</strong></p>
              <p>
                {formulariosCombinados.fechaRecepcionR ? formulariosCombinados.fechaRecepcionR.split('-').reverse().join('/') : 'N/A'}
              </p>
              <p><strong>N° Orden de Compra:</strong></p>
              <p>{formulariosCombinados.nOrdenCompraR || 'N/A'}</p>
            </Col>
            <Col md={4}>
              <p><strong>Nº Factura:</strong></p>
              <p>{formulariosCombinados.nFacturaR || 'N/A'}</p>
              <p><strong>Origen Presupuesto:</strong></p>
              {(() => {
                let nombreOrigen = "N/A"; // Valor por defecto
                for (let i = 0; i < comboOrigen.length; i++) {
                  if (String(comboOrigen[i].codigo) === String(formulariosCombinados.origenPresupuestoR)) {
                    nombreOrigen = comboOrigen[i].descripcion;
                    break; // Salir del bucle una vez encontrado
                  }
                }
                return <p>{nombreOrigen}</p>;
              })()}
              <p><strong>Monto Recepción:</strong></p>
              <p>${formulariosCombinados.montoRecepcionR || 'N/A'}</p>
            </Col>
            <Col md={4}>
              <p><strong>Fecha Factura:</strong></p>
              <p>
                {formulariosCombinados.fechaFacturaR
                  ? formulariosCombinados.fechaFacturaR.split('-').reverse().join('/')
                  : 'N/A'
                }
              </p>
              <p><strong>Proveedor:</strong></p>
              {(() => {
                let nombreProveedor = "N/A"; // Valor por defecto
                for (let i = 0; i < comboProveedor.length; i++) {
                  if (String(comboProveedor[i].proV_RUN) === String(formulariosCombinados.rutProveedorR)) {
                    nombreProveedor = comboProveedor[i].proV_NOMBRE;
                    break; // Salir del bucle una vez encontrado
                  }
                }
                return <p>{nombreProveedor || 'N/A'}</p>;
              })()}
              <p><strong>Modalidad de Compra:</strong></p>
              {(() => {
                let nombreModalidad = "N/A"; // Valor por defecto
                for (let i = 0; i < comboModalidad.length; i++) {
                  if (String(comboModalidad[i].codigo) === String(formulariosCombinados.modalidadDeCompraR)) {
                    nombreModalidad = comboModalidad[i].descripcion;
                    break; // Salir del bucle una vez encontrado
                  }
                }
                return formulariosCombinados.modalidadDeCompraR === 7 ? <div className="d-flex"><p className="fw-semibold me-1">{nombreModalidad}</p> | <p className="ms-1">{formulariosCombinados.otraModalidadR}</p></div> : <p className="fw-normal">{nombreModalidad}</p>;
              })()}
            </Col>
            <Col>
              <p><strong>Fecha Ingreso:</strong></p>
              {activosFijos.length > 0 && activosFijos[0]?.fechaIngreso ? (
                <p>{activosFijos[0].fechaIngreso.split('-').reverse().join('/')}</p>
              ) : (
                <p>N/A</p>
              )}

            </Col>
          </Row>
          <Row>
            {/* <Col md={4}>
              <p><strong>Servicio:</strong></p>
              {(() => {
                let nombreServicio = "N/A"; // Valor por defecto
                for (let i = 0; i < listaServicioNombre.length; i++) {
                  nombreServicio = listaServicioNombre[i].nombre;
                  break;
                }
                return <p>{nombreServicio}</p>;
              })()}
            </Col>
            <Col>
              <p><strong>Dependencia:</strong></p>
              {(() => {
                let nombreDependencia = "N/A"; // Valor por defecto
                for (let i = 0; i < comboDependencia.length; i++) {
                  if (String(comboDependencia[i].codigo) === String(formulariosCombinados.dependenciaR)) {
                    nombreDependencia = comboDependencia[i].descripcion;
                    break; // Salir del bucle una vez encontrado
                  }
                }
                return <p>{nombreDependencia}</p>;
              })()}
            </Col> */}


          </Row>
          <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
            {/* Tamaño Paginación */}
            <Col xs={12} lg="auto">
              {activosFijos.length > 10 && (
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                  <label htmlFor="nPaginacion" className="form-label fw-semibold mb-0 me-2">
                    Tamaño de página:
                  </label>
                  <select
                    aria-label="Seleccionar tamaño de página"
                    className={`form-select form-select-sm w-auto rounded-1 ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="nPaginacion"
                    onChange={handleChange}
                    value={Paginacion.nPaginacion}
                  >
                    {[10, 15, 20, 25, 50, 100, activosFijos.length].map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </Col>
          </Row>
          <div className="table-responsive">
            <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
              <thead>
                <tr>
                  <th className="text-center">Nº Inventario</th>
                  <th className="text-center">Especie</th>
                  <th className="text-center">Vida Útil</th>
                  <th className="text-center">Marca</th>
                  <th className="text-center">Modelo</th>
                  <th className="text-center">Precio</th>
                  <th className="text-center">Serie</th>
                  <th className="text-center">Servicio/Dependencia</th>
                  <th className="text-center">Cuenta</th>
                  {/* <th>Observaciones</th> */}
                </tr>
              </thead>
              <tbody>
                {elementosActuales?.length > 0 ? (
                  elementosActuales.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{item.id || 'N/A'}</td>
                      {(() => {
                        let nombreEspecie = "N/A"; // Valor por defecto
                        for (let i = 0; i < comboEspecies.length; i++) {
                          if (String(comboEspecies[i].esP_CODIGO) === String(item.especie)) {
                            nombreEspecie = comboEspecies[i].nombrE_ESP;
                            break; // Salir del bucle una vez encontrado
                          }
                        }
                        return <td>{nombreEspecie}</td>;
                      })()}
                      <td className="text-center">{item.vidaUtil || 'N/A'}</td>
                      <td className="text-center">{item.marca || 'N/A'}</td>
                      <td className="text-center">{item.modelo || 'N/A'}</td>
                      <td className="text-center">
                        $
                        {parseFloat(item.precio).toLocaleString("es-ES", {
                          minimumFractionDigits: 0,
                        })}
                      </td>
                      <td className="text-center">{item.serie || '-'}</td>
                      <td className="text-center">{item.dependencia}</td>
                      <td className="text-center">{item.cuenta || 'N/A'}</td>
                      {/* <td>{item.observaciones || 'N/A'}</td> */}
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
        </Modal.Body>
      </Modal >

      {/* Modal PDF Excel Word */}
      < Modal show={modalMostrarExportar} onHide={() => setModalMostrarExportar(false)} dialogClassName="modal-right" size="xl" >
        <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
          <Modal.Title className="fw-semibold">Exportar</Modal.Title>
        </Modal.Header>
        <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
          {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
          <BlobProvider
            document={
              <DocumentoPDFResumen
                row={activosFijos}
                formulariosCombinados={formulariosCombinados}
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
      </Modal >
    </>
  );
};

//mapea los valores del estado global de Redux
const mapStateToProps = (state: RootState) => ({
  fechaFactura: state.obtenerRecepcionReducers.fechaFactura,
  fechaRecepcion: state.obtenerRecepcionReducers.fechaRecepcion,
  montoRecepcion: state.obtenerRecepcionReducers.montoRecepcion,
  nFactura: state.obtenerRecepcionReducers.nFactura,
  nOrdenCompra: state.obtenerRecepcionReducers.nOrdenCompra,
  nRecepcion: state.obtenerRecepcionReducers.nRecepcion,
  origenPresupuesto: state.obtenerRecepcionReducers.origenPresupuesto,
  tipoInventario: state.obtenerRecepcionReducers.tipoInventario,
  /*--------------Modalidad Compra--------------*/
  modalidadDeCompra: state.obtenerRecepcionReducers.modalidadDeCompra,
  otraModalidad: state.obtenerRecepcionReducers.otraModalidad,
  showInputReducer: state.obtenerRecepcionReducers.showInput,
  /*--------------Fin Modalidad Compra--------------*/
  rutProveedor: state.obtenerRecepcionReducers.rutProveedor,
  datosTablaActivoFijo: state.datosActivoFijoReducers.datosTablaActivoFijo,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers,

  /*-------------------- Resumen de registro para mostrar en modal------------------------*/
  resultadoRegistro: state.datosActivoFijoReducers.resultadoRegistro,
  activosFijos: state.resumenInventarioRegistroReducers.activosFijos,
  formulariosCombinados: state.resumenInventarioRegistroReducers,
  /*----------------Se agregan estos combos para mostrar las descripciones en resumen------------------*/
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  comboEspecies: state.comboEspeciesBienReducers.comboEspecies,
  listaServicioNombre: state.obtenerServicioNombreReducers.listaServicioNombre
});

export default connect(mapStateToProps, {
  obtenerRecepcionActions,
  obtenerServicioNombreActions,
  comboModalidadesActions,
  registrarModalidadActions
})(DatosInventario);
