import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Row, Col, Modal, Pagination, Spinner, OverlayTrigger, Tooltip, CloseButton } from "react-bootstrap";
import { AppDispatch, RootState } from "../../store";
import { connect, useDispatch } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import { MODALIDAD, ORIGEN, PROVEEDOR, } from "./RegistrarInventario/DatosInventario";
import { BIEN, CUENTA, DETALLE, ListaEspecie } from "./RegistrarInventario/DatosCuenta";
import { Check2Circle, Eye, Pencil, Search, Trash } from "react-bootstrap-icons";
import MenuInventario from "../Menus/MenuInventario";
import { Objeto } from "../Navegacion/Profile";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
// import SkeletonLoader from "../Utils/SkeletonLoader";
import { limpiarDataActions } from "../../redux/actions/Configuracion/limparDataActions";
import { modificarFormInventarioActions } from "../../redux/actions/Inventario/ModificarInventario/modificarFormInventarioActions";
import { comboDetalleActions } from "../../redux/actions/Inventario/Combos/comboDetalleActions";
import { comboProveedorActions } from "../../redux/actions/Inventario/Combos/comboProveedorActions";
import { setModalidadCompraActions } from "../../redux/actions/Inventario/RegistrarInventario/datosRegistroInventarioActions";
import { listadoDeEspeciesBienActions } from "../../redux/actions/Inventario/Combos/listadoDeEspeciesBienActions";
import { comboEspeciesBienActions } from "../../redux/actions/Inventario/Combos/comboEspeciesBienActions";
import { comboDependenciaModificarActions } from "../../redux/actions/Inventario/Combos/comboDependenciaModificarActions ";
import { comboCuentaModificarActions } from "../../redux/actions/Inventario/Combos/comboCuentaModificarActions";
import { comboSerDepActions } from "../../redux/actions/Inventario/ModificarInventario/comboSerDepActions";
import { obtenerInventarioActions } from "../../redux/actions/Inventario/ModificarInventario/obtenerInventarioActions";
import { obtenerInventarioxAltasActions } from "../../redux/actions/Inventario/ModificarInventario/obtenerInventarioxAltasActions";
import { comboModalidadesActions } from "../../redux/actions/Inventario/Combos/comboModalidadCompraActions";
import { comboOrigenPresupuestosActions } from "../../redux/actions/Inventario/Combos/comboOrigenPresupuestoActions";

export interface SERVICIO_DEPENDENCIA {
  deP_CORR: number;
  descripcion: string
}

//Se usan estas props para llamar a la busqueda de inventario por altas_corr
export interface listaAltas {
  aF_CLAVE: number;
  aF_CODIGO_GENERICO: string;
  altaS_CORR: number;
  aF_ORIGEN: number;
  seR_CORR: number;
  deP_CORR: number,
  ctA_COD: string;
  aF_FECHA_SOLICITUD: string;
  aF_MONTOFACTURA: number;
  idmodalidadcompra: number;
  aF_OCO_NUMERO_REF: string;
  aF_FECHAFAC: string;
  esP_CODIGO: string;
  nombrE_ESP: string;
  esP_NOMBRE: string;
  aF_NUM_FAC: string;
  proV_RUN: number;
  //-------Tabla detalles---------//
  aF_VIDAUTIL: number;
  aF_FINGRESO: string;
  deT_MARCA: string;
  deT_MODELO: string;
  deT_SERIE: string;
  deT_PRECIO: number;
  deT_OBS: string;
}

//Se usan estas props para llamar a la busqueda de inventario por af_codigo_generico
export interface InventarioCompleto {
  AF_CLAVE: number;
  AF_CODIGO_GENERICO: string;
  AF_FECHA_SOLICITUD: string; // fechaRecepcion 
  AF_OCO_NUMERO_REF: string // nOrdenCompra
  AF_NUM_FAC: string; // nFactura
  AF_ORIGEN: number;  //origenPresupuesto
  AF_MONTOFACTURA: number; //montoRecepcion
  AF_FECHAFAC: string; //fechaFactura
  PROV_RUN: number; // rutProveedor
  // SER_CORR: number; //servicio 
  DEP_CORR: number; //dependencia
  IDMODALIDADCOMPRA: number; // modalidadDeCompra
  OTRA_MODALIDAD?: string; // otraModalidad
  ESP_CODIGO: string; //ESP_CODIGO
  CTA_COD: string;
  //-------Tabla---------//
  AF_VIDAUTIL: number;
  AF_FINGRESO: string;
  DET_MARCA: string;
  DET_MODELO: string;
  DET_SERIE: string;
  DET_PRECIO: number;
  DET_OBS: string;

}
interface InventarioCompletoProps extends InventarioCompleto {
  comboOrigen: ORIGEN[];
  comboModalidad: MODALIDAD[];
  // comboServicio: SERVICIO[];
  // comboDependencia: DEPENDENCIA[];
  comboCuenta: CUENTA[];
  comboBien: BIEN[];
  comboDetalle: DETALLE[];
  comboEspecies: ListaEspecie[];
  comboProveedor: PROVEEDOR[];
  comboSerDep: SERVICIO_DEPENDENCIA[];
  listaEspecie: ListaEspecie[];
  listaAltas: listaAltas[];
  comboSerDepActions: (establ_corr: number) => Promise<boolean>;//En buscador   
  // comboDependenciaModificarActions: (comboServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
  obtenerInventarioActions: (af_codigo_generico: string, estabL_CORR: number) => Promise<boolean>;
  obtenerInventarioxAltasActions: (altas_corr: number, estabL_CORR: number) => Promise<boolean>;
  comboDetalleActions: (bienSeleccionado: string) => void;
  comboEspeciesBienActions: (EST: number, IDBIEN: number) => Promise<boolean>; //Carga Combo Especie
  comboCuentaModificarActions: (nombreEspecie: string) => Promise<boolean>;
  comboProveedorActions: (rutProveedor: string) => Promise<boolean>;
  comboModalidadesActions: () => Promise<boolean>;
  comboOrigenPresupuestosActions: () => Promise<boolean>;
  listadoDeEspeciesBienActions: (EST: number, IDBIEN: number, esP_CODIGO: string, esP_NOMBRE: string) => Promise<boolean>;
  modificarFormInventarioActions: (Inventario: InventarioCompleto[]) => Promise<{ success: boolean; error?: string }>;
  limpiarDataActions: () => Promise<boolean>;
  esP_NOMBRE: string; // se utiliza solo para guardar la descripcion completa en el input de ESP_CODIGO
  estadO_VISADO: number;
  isDarkMode: boolean;
  objeto: Objeto;
}

const ModificarInventario: React.FC<InventarioCompletoProps> = ({
  comboOrigen,
  comboModalidad,
  // comboServicio,
  // comboDependencia,
  comboSerDep,
  comboCuenta,
  comboBien,
  comboDetalle,
  comboProveedor,
  comboEspecies,
  listaEspecie,
  // listaAltas,
  AF_CLAVE,
  AF_CODIGO_GENERICO, // nRecepcion
  AF_FECHA_SOLICITUD,// fechaRecepcion 
  AF_OCO_NUMERO_REF, // nOrdenCompra
  AF_NUM_FAC,// nFactura
  AF_ORIGEN, //origenPresupuesto
  AF_MONTOFACTURA, //montoRecepcion
  AF_FECHAFAC, //fechaFactura
  PROV_RUN, // rutProveedor
  // SER_CORR, //servicio
  DEP_CORR, //dependencia
  IDMODALIDADCOMPRA, // modalidadDeCompra
  OTRA_MODALIDAD,
  ESP_CODIGO,// descripcion ESP_CODIGO
  esP_NOMBRE,
  CTA_COD,
  //-------Tabla---------//
  AF_VIDAUTIL,
  AF_FINGRESO,
  DET_MARCA,
  DET_MODELO,
  DET_SERIE,
  DET_PRECIO,
  DET_OBS,
  estadO_VISADO,
  isDarkMode,
  objeto,
  comboSerDepActions,
  obtenerInventarioActions,
  // obtenerInventarioxAltasActions,
  comboDetalleActions,
  comboEspeciesBienActions,
  listadoDeEspeciesBienActions,
  comboCuentaModificarActions,
  comboModalidadesActions,
  comboOrigenPresupuestosActions,
  comboProveedorActions,
  modificarFormInventarioActions,
  limpiarDataActions
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  // const [mostrarModalAltas, setMostrarModalAltas] = useState(false);

  //--------------Paginación Especies--------------------//
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaEspecie>();
  const [paginaActual, setPaginaActual] = useState(1);
  const [Paginacion, setPaginacion] = useState({
    nPaginacion: 10
  });
  const elementosPorPagina = Paginacion.nPaginacion;
  //--------------Paginación Altas--------------------//
  // const [filasSeleccionadasAltas, setFilasSeleccionadasAltas] = useState<string[]>([]);
  // const [elementoSeleccionadoAltas, setElementoSeleccionadoAltas] = useState<listaAltas>();
  // const [paginaActual1, setPaginaActual1] = useState(1);
  // const [Paginacion1, setPaginacion1] = useState({
  //   nPaginacion1: 10
  // });
  // const elementosPorPagina1 = Paginacion1.nPaginacion1;

  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState<Partial<InventarioCompleto> & {}>({});
  const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
  };
  const [loading, setLoading] = useState(false);
  const [loadingModalidadCompra, setLoadingModalidadCompra] = useState(false);
  const [loadingOrigen, setLoadingOrigen] = useState(false);
  const [loadingProveedor, setLoadingProveedor] = useState(false);
  const [loadingCuenta, setLoadingCuenta] = useState(false);
  const [loadingServicio, setLoadingServicio] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [loadingBuscarInventario, setLoadingBuscarInventario] = useState(false);
  // const [loadingBuscarAlta, setLoadingBuscarAlta] = useState(false);

  const [Especies, setEspecies] = useState({
    estableEspecie: 0,
    codigoEspecie: "",
    nombreEspecie: "",
    descripcionEspecie: "",
  });
  const [Inventario, setInventario] = useState({
    AF_CLAVE,
    AF_CODIGO_GENERICO: "",
    AF_FECHA_SOLICITUD: "", // fechaRecepcion
    AF_OCO_NUMERO_REF: "", // nOrdenCompra
    USUARIO_MOD: objeto.IdCredencial,
    AF_NUM_FAC: "",// nFactura
    AF_ORIGEN: 0,  //origenPresupuesto
    AF_MONTOFACTURA: 0, //montoRecepcion
    AF_FECHAFAC: "", //fechaFactura
    PROV_RUN: 0, // rutProveedor
    // SER_CORR: 0, //servicio
    DEP_CORR: 0, //dependencia
    IDMODALIDADCOMPRA: 0, // modalidadDeCompra
    OTRA_MODALIDAD: "", // otraModalidad
    ESP_CODIGO: "", //ESP_CODIGO
    CTA_COD: "",
    //-------Tabla---------//
    AF_VIDAUTIL: 0,
    AF_FINGRESO: "",
    DET_MARCA: "",
    DET_MODELO: "",
    DET_SERIE: "",
    DET_PRECIO: 0,
    DET_OBS: ""
  });
  const especieOptions = comboEspecies.map((item) => ({
    value: item.esP_CODIGO,
    label: item.nombrE_ESP,
  }));

  // const cuentaOptions = comboCuenta.map((item) => ({
  //   value: item.codigo,
  //   label: item.descripcion,
  // }));

  //Buscar Inventario completo
  const [BuscarInventario, setBuscarInventario] = useState({
    aF_CODIGO_GENERICO_B: "",
    altaS_CORR: 0
  });
  //Buscar Especie
  const [Buscar, setBuscar] = useState({
    esP_CODIGO: "",
    esp_NOMBRE: ""
  });

  const handleComboEspecieChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : "";
    setBuscar((prev) => ({ ...prev, esP_CODIGO: value }));
  };

  // const handleComboCuentaChange = (selectedOption: any) => {
  //   const value = selectedOption ? selectedOption.value : "";
  //   setInventario((prev) => ({ ...prev, CTA_COD: value || Inventario.CTA_COD }));
  // };

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    if (!Inventario.AF_FECHA_SOLICITUD || Inventario.AF_FECHA_SOLICITUD === "0") tempErrors.AF_FECHA_SOLICITUD = "Campo obligatorio";
    if (!Inventario.AF_OCO_NUMERO_REF || Inventario.AF_OCO_NUMERO_REF === "0") tempErrors.AF_OCO_NUMERO_REF = "Campo obligatorio";
    if (!Inventario.AF_NUM_FAC || Inventario.AF_NUM_FAC == "0") tempErrors.AF_NUM_FAC = "Campo obligatorio";
    if (!Inventario.AF_ORIGEN) tempErrors.AF_ORIGEN = "Campo obligatorio";
    if (!Inventario.AF_MONTOFACTURA || Inventario.AF_MONTOFACTURA == 0) tempErrors.AF_MONTOFACTURA = "Campo obligatorio";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.AF_MONTOFACTURA))) tempErrors.AF_MONTOFACTURA = "El Monto debe ser un número válido con hasta dos decimales.";
    if (!Inventario.AF_FECHAFAC || Inventario.AF_FECHAFAC == "0") tempErrors.AF_FECHAFAC = "Campo obligatorio";
    if (!Inventario.PROV_RUN || Inventario.PROV_RUN === 0) tempErrors.PROV_RUN = "Campo obligatorio";
    if (!Inventario.IDMODALIDADCOMPRA) tempErrors.IDMODALIDADCOMPRA = "Campo obligatorio.";
    // if (!Inventario.SER_CORR) tempErrors.SER_CORR = "Campo obligatorio";
    if (!Inventario.DEP_CORR) tempErrors.DEP_CORR = "Campo obligatorio";
    if (!Inventario.CTA_COD || Inventario.CTA_COD === "") tempErrors.CTA_COD = "Campo obligatorio";
    if (!Inventario.ESP_CODIGO) tempErrors.ESP_CODIGO = "Campo obligatorio";
    if (!Inventario.AF_VIDAUTIL) tempErrors.AF_VIDAUTIL = "Campo obligatorio";
    if (!Inventario.AF_FINGRESO || Inventario.AF_FINGRESO === "0") tempErrors.AF_FINGRESO = "Campo obligatorio";
    if (!Inventario.DET_MARCA) tempErrors.DET_MARCA = "Campo obligatorio";
    if (!Inventario.DET_MODELO) tempErrors.DET_MODELO = "Campo obligatorio";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateDetalles = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)  
    if (!Inventario.AF_VIDAUTIL) tempErrors.AF_VIDAUTIL = "Campo obligatorio";
    if (!Inventario.AF_FINGRESO || Inventario.AF_FINGRESO === "0") tempErrors.AF_FINGRESO = "Campo obligatorio";
    if (!Inventario.DET_MARCA) tempErrors.DET_MARCA = "Campo obligatorio";
    if (!Inventario.DET_MODELO) tempErrors.DET_MODELO = "Campo obligatorio";
    // if (!Inventario.DET_SERIE) tempErrors.DET_SERIE = "Campo obligatorio";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const servicioOptions = comboSerDep.map((item) => ({
    value: item.deP_CORR,
    label: item.descripcion,
  }));

  const handleServicioChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : 0;
    setInventario((prevInventario) => ({ ...prevInventario, DEP_CORR: value }));
  };

  //Hook que muestra los valores al input, Sincroniza el estado local con Redux
  useEffect(() => {
    //Carga combo especies
    if (comboEspecies.length === 0) {
      comboEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0);
    }
    if (comboSerDep.length === 0) { comboSerDepActions(objeto.Roles[0].codigoEstablecimiento) }
    if (comboModalidad.length === 0) comboModalidadesActions();
    if (comboProveedor.length === 0) comboProveedorActions("");
    if (comboOrigen.length === 0) comboOrigenPresupuestosActions();
    setInventario({
      AF_CLAVE,
      AF_CODIGO_GENERICO, // nRecepcion
      AF_FECHA_SOLICITUD,// fechaRecepcion 
      AF_OCO_NUMERO_REF, // nOrdenCompra 
      USUARIO_MOD: objeto.IdCredencial,
      AF_NUM_FAC,// nFactura
      AF_ORIGEN, //origenPresupuesto
      AF_MONTOFACTURA, //montoRecepcion
      AF_FECHAFAC, //fechaFactura
      PROV_RUN, // rutProveedor
      // SER_CORR, //servicio
      DEP_CORR, //dependencia
      IDMODALIDADCOMPRA, // modalidadDeCompra
      OTRA_MODALIDAD: OTRA_MODALIDAD ?? "", // otraModalidad
      ESP_CODIGO: ESP_CODIGO ? ESP_CODIGO + " | " + esP_NOMBRE : "",//ESP_CODIGO
      CTA_COD,
      //-------Tabla---------//
      AF_VIDAUTIL,
      AF_FINGRESO,
      DET_MARCA,
      DET_MODELO,
      DET_SERIE,
      DET_PRECIO,
      DET_OBS
    });
    //Se usa useEffect en este caso de ESP_CODIGO ya que por handleChange no detecta el cambio
    // debido que este se pasa por una seleccion desde el modal en la seleccion que se hace desde el listado
    if (Especies.codigoEspecie) {
      comboCuentaModificarActions("");
      comboCuentaModificarActions(Especies.codigoEspecie); // aqui le paso codigo de detalle
      setInventario((prevState) => ({
        ...prevState,
        CTA_COD: "",
      }));
      // console.log("Código de especie seleccionado:", Especies.codigoEspecie);
    }
  }, [
    // comboDependencia.length,
    comboSerDep,
    comboModalidad,
    comboProveedor,
    AF_CODIGO_GENERICO, // nRecepcion
    AF_FECHA_SOLICITUD,//fechaRecepcion 
    AF_OCO_NUMERO_REF, //nOrdenCompra
    AF_NUM_FAC, //nFactura
    AF_ORIGEN, //origenPresupuesto
    AF_MONTOFACTURA, //montoRecepcion
    AF_FECHAFAC, //fechaFactura
    PROV_RUN, // rutProveedor
    // SER_CORR, //servicio
    DEP_CORR, //dependencia
    IDMODALIDADCOMPRA, // modalidadDeCompra
    OTRA_MODALIDAD,
    ESP_CODIGO,//ESP_CODIGO
    CTA_COD, //cuenta
    //-------Tabla---------//
    AF_VIDAUTIL,
    AF_FINGRESO,
    DET_MARCA,
    DET_MODELO,
    DET_SERIE,
    DET_PRECIO,
    DET_OBS,
    comboCuentaModificarActions,
    comboModalidadesActions,
    comboProveedorActions,
    // Especies.codigoEspecie,
  ]);

  const handleCargarMCompra = async () => {
    if (comboModalidad.length === 0) {
      setLoadingModalidadCompra(true);
      const resultado = await comboModalidadesActions();
      if (resultado) {
        setLoadingModalidadCompra(false);
      }
    }
  }

  const handleCargarProveedor = async () => {
    if (comboProveedor.length === 0) {
      setLoadingProveedor(true);
      const resultado = await comboProveedorActions("");
      if (resultado) {
        setLoadingProveedor(false);
      }
    }
  }

  const handleCargarOrigenPresupuesto = async () => {
    if (comboOrigen.length === 0) {
      setLoadingOrigen(true);
      const resultado = await comboOrigenPresupuestosActions();
      if (resultado) {
        setLoadingOrigen(false);
      }
    }
  }

  const handleCargarCuenta = async () => {
    if (comboCuenta.length === 0) {
      setLoadingCuenta(true);
      const resultado = await comboCuentaModificarActions("");
      if (resultado) {
        setLoadingCuenta(false);
      }
    }
  }

  const handleCargarServicio = async () => {
    if (comboSerDep.length === 0) {
      setLoadingServicio(true);
      const resultado = await comboSerDepActions(objeto.Roles[0].codigoEstablecimiento);
      if (resultado) {
        setLoadingServicio(false);
      }
    }
  }



  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if ((name === "aF_CODIGO_GENERICO_B" && !/^[0-9]*$/.test(value)) || (name === "altaS_CORR" && !/^[0-9]*$/.test(value))) {
      return; // Salir si contiene caracteres no numéricos
    }

    let newValue: string | number = [
      "IDMODALIDADCOMPRA", //modalidadDeCompra
      "AF_MONTOFACTURA",//montoRecepcion     
      "AF_ORIGEN", //origenPresupuesto
      "PROV_RUN", //rutProveedor
      "DEP_CORR", //dependencia
      "idprograma", //servicio     
      "AF_VIDAUTIL", //vidaUtil
      "DET_PRECIO",
      "USUARIO_MOD", //precio
      "AF_FINGRESO"
    ].includes(name)

      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value.replace(/^0+/, ""); //Elimina ceroa la izquierda

    //Parametros de busqueda
    setBuscarInventario((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    setInventario((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    setPaginacion((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // setPaginacion1((prevState) => ({
    //   ...prevState,
    //   [name]: value,
    // }));

    // if (name === "nPaginacion") {
    //   paginar1(1);
    // }

    // if (name === "nPaginacion1") {
    //   paginar1(1);
    // }

    if (name === "idprograma") { //servicio
      comboDependenciaModificarActions(value);
    }
    if (comboBien.length === 0) {
      comboDetalleActions("0");
    }
    if (name === "bien") {
      comboDetalleActions(value);
    }
    if (name === "detalles") {
      listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, newValue as number, "", "");
      setFilasSeleccionadas([]);
    }
    // if (name === "PROV_RUN") { //rutProveedor
    //   comboProveedorActions(value);
    // }
    if (name === "IDMODALIDADCOMPRA") { //modalidadDeCompra
      if (value === "7") {
        newValue = parseFloat(value) || 0;
        dispatch(setModalidadCompraActions(newValue as number));
        setShowInput(true);
      } else {
        newValue = parseFloat(value) || 0;
        dispatch(setModalidadCompraActions(newValue as number));
        setShowInput(false);
      }
    }

    if (name === "IDMODALIDADCOMPRA") { //modalidadDeCompra
      if (value === "7") {
        newValue = parseFloat(value) || 0;
        dispatch(setModalidadCompraActions(newValue as number));
        setShowInput(true);
      } else {
        newValue = parseFloat(value) || 0;
        dispatch(setModalidadCompraActions(newValue as number));
        setShowInput(false);
      }
    }
    if (name === "aF_CODIGO_GENERICO_B") {
      comboCuentaModificarActions("");
    }
    if (name === "altaS_CORR") {

      comboCuentaModificarActions("");
    }
  };

  const handleLimpiarTodo = () => {
    setInventario((prevInventario) => ({
      ...prevInventario,
      aF_CODIGO_GENERICO: "",
      AF_CLAVE: 0, // nRecepcion
      AF_FECHA_SOLICITUD: "", // fechaRecepcion 
      AF_OCO_NUMERO_REF: "", // nOrdenCompra      
      AF_NUM_FAC: "",// nFactura
      AF_ORIGEN: 0,  //origenPresupuesto
      AF_MONTOFACTURA: 0, //montoRecepcion
      AF_FECHAFAC: "", //fechaFactura
      PROV_RUN: 0, // rutProveedor
      SER_CORR: 0, //servicio
      DEP_CORR: 0, //dependencia
      IDMODALIDADCOMPRA: 0, // modalidadDeCompra
      OTRA_MODALIDAD: "", //otraModalidad
      ESP_CODIGO: "", //ESP_CODIGO
      CTA_COD: "",
      //-------Tabla---------//
      AF_VIDAUTIL: 0,
      AF_FINGRESO: "",
      DET_MARCA: "",
      DET_MODELO: "",
      DET_SERIE: "",
      DET_PRECIO: 0,
      DET_OBS: ""
    }));
    window.location.href = window.location.pathname;
    setIsDisabled(true);
  };

  //Selecciona fila del listado de Especies
  const handleSeleccionFila = (index: number) => {
    const item = listaEspecie[index];
    setFilasSeleccionadas([index.toString()]);
    setElementoSeleccionado(item);
  };

  //Selecciona fila del listado de Altas
  // const handleSeleccionFilaAltas = (index: number, altaS_CORR: number) => {
  //   const item = listaAltas[index];

  //   const registro = listaAltas.find((f) => f.altaS_CORR === altaS_CORR);
  //   const estado = registro?.estadO_VISADO ?? null;

  //   // Validaciones según el estado
  //   if (estado === 0) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Visado en curso",
  //       text: "Este inventario se encuentra en proceso de visado. No es posible realizar modificaciones.",
  //       background: isDarkMode ? "#1e1e1e" : "#ffffff",
  //       color: isDarkMode ? "#ffffff" : "#000000",
  //       confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
  //       customClass: { popup: "custom-border" },
  //     });

  //     setFilasSeleccionadas((prev) => prev.filter((rowIndex) => rowIndex !== index.toString()));
  //     return;
  //   }

  //   if (estado === 1) {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Inventario visado",
  //       text: "Este inventario ya cuenta con todas las firmas o visados correspondientes, por lo que no puede ser modificado.",
  //       background: isDarkMode ? "#1e1e1e" : "#ffffff",
  //       color: isDarkMode ? "#ffffff" : "#000000",
  //       confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
  //       customClass: { popup: "custom-border" },
  //     });

  //     setFilasSeleccionadas((prev) => prev.filter((rowIndex) => rowIndex !== index.toString()));
  //     return;
  //   }

  //   setFilasSeleccionadasAltas([index.toString()]);
  //   setElementoSeleccionadoAltas(item);
  // };

  const handleSubmitSeleccionado = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof elementoSeleccionado === "object" && elementoSeleccionado !== null) {
      const estableEspecie = (elementoSeleccionado as ListaEspecie).estabL_CORR;
      const codigoEspecie = (elementoSeleccionado as ListaEspecie).esP_CODIGO;
      const nombreEspecie = `${(elementoSeleccionado as ListaEspecie).nombrE_ESP}`;
      const descripcionEspecie = (elementoSeleccionado as ListaEspecie).esP_CODIGO + " | " + `${(elementoSeleccionado as ListaEspecie).nombrE_ESP}`;
      // Actualiza tanto el estado 'Especies' como el estado 'Cuenta.especie'
      setEspecies({
        estableEspecie,
        codigoEspecie,
        nombreEspecie,
        descripcionEspecie,
      });

      // if (Especies.codigoEspecie) {
      //   comboCuentaModificarActions(Especies.codigoEspecie); // aqui le paso codigo de detalle
      //   console.log("Código de especie seleccionado:", Especies.codigoEspecie);
      // }
      setInventario((Prev) => ({
        ...Prev,
        ESP_CODIGO: descripcionEspecie.toString() // Actualiza el campo 'especie' en el estado de 'Cuenta'
      }));
      // Resetea el estado de las filas seleccionadas para desmarcar el checkbox   
      setFilasSeleccionadas([]);
      setMostrarModal(false); // Cierra el modal
    } else {
      // console.log("No se ha seleccionado ningún elemento.");
    }
  };

  // const handleInventarioSeleccionado = () => {
  //   if (typeof elementoSeleccionadoAltas === "object" && elementoSeleccionadoAltas !== null) {
  //     const af_clave = (elementoSeleccionadoAltas as listaAltas).aF_CLAVE;
  //     const af_codigo_generico = (elementoSeleccionadoAltas as listaAltas).aF_CODIGO_GENERICO;
  //     const af_origen = (elementoSeleccionadoAltas as listaAltas).aF_ORIGEN;
  //     const dep_corr = (elementoSeleccionadoAltas as listaAltas).deP_CORR;
  //     const cta_cod = (elementoSeleccionadoAltas as listaAltas).ctA_COD;
  //     const af_fecha_solicitud = (elementoSeleccionadoAltas as listaAltas).aF_FECHA_SOLICITUD;
  //     const af_montofactura = (elementoSeleccionadoAltas as listaAltas).aF_MONTOFACTURA;
  //     const idmodalidadcompra = (elementoSeleccionadoAltas as listaAltas).idmodalidadcompra;
  //     const af_fechafac = (elementoSeleccionadoAltas as listaAltas).aF_FECHAFAC;
  //     const af_oco_numero_ref = (elementoSeleccionadoAltas as listaAltas).aF_OCO_NUMERO_REF;
  //     const af_num_fac = (elementoSeleccionadoAltas as listaAltas).aF_NUM_FAC;
  //     const descripcionEspecie = (elementoSeleccionadoAltas as listaAltas).esP_CODIGO + " | " + `${(elementoSeleccionadoAltas as listaAltas).esP_NOMBRE}`;
  //     const prov_run = (elementoSeleccionadoAltas as listaAltas).proV_RUN;

  //     const af_vidautil = (elementoSeleccionadoAltas as listaAltas).aF_VIDAUTIL;
  //     const af_fingreso = (elementoSeleccionadoAltas as listaAltas).aF_FINGRESO;
  //     const det_marca = (elementoSeleccionadoAltas as listaAltas).deT_MARCA;
  //     const det_modelo = (elementoSeleccionadoAltas as listaAltas).deT_MODELO;
  //     const det_serie = (elementoSeleccionadoAltas as listaAltas).deT_SERIE;
  //     const det_precio = (elementoSeleccionadoAltas as listaAltas).deT_PRECIO;
  //     const det_obs = (elementoSeleccionadoAltas as listaAltas).deT_OBS;


  //     // Actualiza el estado según la seleccion
  //     setInventario((Prev) => ({
  //       ...Prev,
  //       aF_CLAVE: af_clave,
  //       AF_CODIGO_GENERICO: af_codigo_generico,
  //       AF_ORIGEN: af_origen,
  //       DEP_CORR: dep_corr,
  //       CTA_COD: cta_cod,
  //       AF_FECHA_SOLICITUD: af_fecha_solicitud,
  //       AF_MONTOFACTURA: af_montofactura,
  //       IDMODALIDADCOMPRA: idmodalidadcompra,
  //       AF_FECHAFAC: af_fechafac,
  //       AF_OCO_NUMERO_REF: af_oco_numero_ref,
  //       AF_NUM_FAC: af_num_fac,
  //       ESP_CODIGO: descripcionEspecie.toString(),
  //       PROV_RUN: prov_run,
  //       AF_VIDAUTIL: af_vidautil,
  //       AF_FINGRESO: af_fingreso,
  //       DET_MARCA: det_marca,
  //       DET_MODELO: det_modelo,
  //       DET_SERIE: det_serie,
  //       DET_PRECIO: det_precio,
  //       DET_OBS: det_obs
  //     }));
  //     setMostrarModalAltas(false);
  //   }
  // };

  const handleValidar = () => {
    console.log("campos", JSON.stringify(Inventario, null, 2));

    if (objeto.IdCredencial != 18667) {
      if (validate()) {
        Swal.fire({
          icon: "info",
          title: 'Confirmar cambios',
          text: 'Está a punto de modificar la información. ¿Desea continuar?',
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Confirmar y modificar",
          cancelButtonText: "Cerrar",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            handleSubmit();
          }
        });
      }
      else {
        Swal.fire({
          icon: "warning",
          title: "Campos obligatorios incompletos",
          text: "Complete todos los campos requeridos antes de modificar el registro.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
      }
    }
    else {
      Swal.fire({
        icon: "info",
        title: 'Confirmar cambios',
        text: 'Está a punto de modificar la información. ¿Desea continuar?',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar y modificar",
        cancelButtonText: "Cerrar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          handleSubmit();
        }
      });
    }
  };

  const handleSubmit = async () => {
    const { success, error } = await modificarFormInventarioActions([Inventario]);

    if (success) {
      Swal.fire({
        icon: "success",
        title: "Actualización exitosa",
        text: "Se ha actualizado el registro con éxito!",
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
        confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
        customClass: { popup: "custom-border" },
      });
      setIsDisabled(true);
      limpiarDataActions();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        html: `Ocurrió un error al actualizar el registro.<br>
             Por favor contacte a la Unidad de Desarrollo para recibir asistencia.<br>
             <strong>Error:</strong> ${error}`,
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
        confirmButtonColor: isDarkMode ? "#6c757d" : "#0d6efd",
        customClass: { popup: "custom-border" },
      });
    }
  };

  const handleBuscarInventario = async (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    let resultado = false;
    e.preventDefault();
    setLoadingBuscarInventario(true);

    if (!BuscarInventario.aF_CODIGO_GENERICO_B || BuscarInventario.aF_CODIGO_GENERICO_B === "") {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor ingrese un número de inventario.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border",
        }
      });
      setLoadingBuscarInventario(false);
      return;
    }
    resultado = await obtenerInventarioActions(BuscarInventario.aF_CODIGO_GENERICO_B, objeto.Roles[0].codigoEstablecimiento);
    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "Inventario no encontrado",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border",
        }
      });
      setIsDisabled(true);
      setLoadingBuscarInventario(false);

      // return;
    } else {
      setIsDisabled(false);
      setLoadingBuscarInventario(false);
    }
  };

  // const handleBuscarAlta = async (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
  //   let resultado = false;
  //   e.preventDefault();
  //   setLoadingBuscarAlta(true);

  //   if (!BuscarInventario.altaS_CORR || BuscarInventario.altaS_CORR === 0) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Campo requerido",
  //       text: "Por favor ingrese un número de Alta.",
  //       confirmButtonText: "Ok",
  //       background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //       color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //       confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
  //       customClass: {
  //         popup: "custom-border",
  //       }
  //     });
  //     setLoadingBuscarAlta(false);
  //     return;
  //   }
  //   resultado = await obtenerInventarioxAltasActions(BuscarInventario.altaS_CORR, objeto.Roles[0].codigoEstablecimiento);
  //   if (!resultado) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Sin Resultados",
  //       text: "Inventarios no encontrados",
  //       confirmButtonText: "Ok",
  //       background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
  //       color: `${isDarkMode ? "#ffffff" : "000000"}`,
  //       confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
  //       customClass: {
  //         popup: "custom-border",
  //       }
  //     });
  //     setIsDisabled(true);
  //     setLoadingBuscarAlta(false);

  //     // return;
  //   } else {
  //     setFilasSeleccionadasAltas([]);
  //     setMostrarModalAltas(true);
  //     setIsDisabled(false);
  //     setLoadingBuscarAlta(false);
  //   }
  // };
  //Busca Especies

  const handleBuscar = async () => {
    setLoading(true);
    let resultado = false;
    if (Buscar.esP_CODIGO && Buscar.esP_CODIGO.includes("-")) {
      // Seleccionó del combo: usar código
      resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0, Buscar.esP_CODIGO, "");
    } else if (Buscar.esp_NOMBRE && Buscar.esp_NOMBRE.trim() !== "") {
      //   // Escribió manualmente: usar nombre   
      resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0, "", Buscar.esp_NOMBRE);
    } else {
      resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0, "", "");
      setLoading(false);
      return;
    }
    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Especie no encontrada",
        text: "La especie consultado no ha sido encontrada",
        confirmButtonText: "Ok",
      });
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }
    setLoading(false);
  };

  const handleCerrarModal = () => {

    if (objeto.IdCredencial != 18667) {
      if (!validateDetalles()) {
        Swal.fire({
          icon: "warning",
          title: 'Campos obligatorios incompletos',
          text: "Complete todos los campos requeridos antes de modificar el registro.",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "Cerrar",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,

          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isDismissed) {
            setMostrarModalDetalles(false);
          }
        });
      }
      else {
        setMostrarModalDetalles(false);
      }
    }
    else {
      setMostrarModalDetalles(false);
    }
  }

  // Si escribe a mano
  const handleInputEspecieChange = (input: string) => {
    setBuscar((prev) => ({ ...prev, esp_NOMBRE: input }));
    handleBuscar();
  };


  const fechaCorte = new Date("2025-06-02");
  const fechaIngreso = new Date(Inventario.AF_FINGRESO);

  const puedeValidar =
    (estadO_VISADO === 0 && fechaIngreso > fechaCorte) ||
    (estadO_VISADO === 1 && fechaIngreso < fechaCorte);

  const tieneAlta = estadO_VISADO === 1;

  // Lógica de paginación para lista especies
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () => listaEspecie.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaEspecie, indicePrimerElemento, indiceUltimoElemento]
  );
  const totalPaginas = Math.ceil(listaEspecie.length / elementosPorPagina);
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  // Lógica de paginación para lista altas
  // const indiceUltimoElemento1 = paginaActual1 * elementosPorPagina1;
  // const indicePrimerElemento1 = indiceUltimoElemento1 - elementosPorPagina1;
  // const elementosActuales1 = useMemo(
  //   () => listaAltas.slice(indicePrimerElemento1, indiceUltimoElemento1),
  //   [listaAltas, indicePrimerElemento1, indiceUltimoElemento1]
  // );
  // const totalPaginas1 = Math.ceil(listaAltas.length / elementosPorPagina1);
  // const paginar1 = (numeroPagina: number) => setPaginaActual1(numeroPagina);

  return (
    <Layout>
      <Helmet>
        <title>Modificar Inventario</title>
      </Helmet>
      <MenuInventario />
      <div className="table-responsive position-relative z-0 hide-scrollbar" >
        <div style={{ maxHeight: "80vh" }}>
          <form onSubmit={handleSubmit}>
            <div className={`border border-botom p-2 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
              <h3 className="form-title fw-semibold border-bottom p-1">
                Modificar Inventario
              </h3>
              <div className={`d-flex justify-content-between`}>
                <h5 className="fw-semibold">PARÁMETROS DE BÚSQUEDA</h5>
              </div>
              <Row className="p-1">
                <Col md={3}>
                  {/* N° Inventario */}
                  <div className="mb-1">
                    <label className="fw-semibold">
                      Nº Inventario
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        aria-label="aF_CODIGO_GENERICO_B"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                        maxLength={12}
                        name="aF_CODIGO_GENERICO_B"
                        placeholder="Eje: 1000000008"
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBuscarInventario(e);
                          }
                        }}
                        value={BuscarInventario.aF_CODIGO_GENERICO_B}
                      />
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-limpiar">Buscar Inventario</Tooltip>}
                      >
                        <Button
                          onClick={handleBuscarInventario}
                          variant="primary"
                          className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  ms-1`}
                        >
                          {loadingBuscarInventario ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            </>
                          ) : (
                            <Search
                              className={classNames("flex-shrink-0", "h-5 w-5")}
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      </OverlayTrigger>
                    </div>
                    {error.AF_CODIGO_GENERICO && (<div className="invalid-feedback fw-semibold d-block">{error.AF_CODIGO_GENERICO}
                    </div>
                    )}
                  </div>

                </Col>
                {/* <Col md={3}>
                  <div className="mb-1">
                    <label className="fw-semibold">
                      Nº Alta
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        aria-label="altaS_CORR"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                        maxLength={12}
                        name="altaS_CORR"
                        placeholder="Eje: 1000000008"
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBuscarAlta(e);
                          }
                        }}
                        value={BuscarInventario.altaS_CORR}
                      />
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-limpiar">Buscar Alta</Tooltip>}
                      >
                        <Button
                          onClick={handleBuscarAlta}
                          variant="primary"
                          className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  ms-1`}
                        >
                          {loadingBuscarAlta ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            </>
                          ) : (
                            <Search
                              className={classNames("flex-shrink-0", "h-5 w-5")}
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </div>
                </Col> */}
              </Row>
              <div className={`border-bottom mt-4 mb-2`}>
                <h5 className="fw-semibold">RESULTADO DE LA BUSQUEDA</h5>
              </div>
              <Row>
                <Col md={3}>
                  <div className="mb-1">
                    <label className="fw-semibold">
                      Nº Inventario
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        aria-label="AF_CODIGO_GENERICO"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.AF_CODIGO_GENERICO ? "is-invalid" : ""}`}
                        maxLength={12}
                        name="AF_CODIGO_GENERICO"
                        placeholder="Eje: 1000000008"
                        onChange={handleChange}
                        value={Inventario.AF_CODIGO_GENERICO}
                        disabled
                      />
                    </div>
                    {error.AF_CODIGO_GENERICO && (<div className="invalid-feedback fw-semibold d-block">{error.AF_CODIGO_GENERICO}
                    </div>
                    )}
                  </div>
                  {/* <div className="ms-1">
                <label className="fw-semibold">
                  Nº Alta
                </label>
                <input
                  aria-label="altaS_CORR"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                  maxLength={10}
                  name="altaS_CORR"
                  placeholder="0"
                  onChange={handleChange}
                // value={Buscar.altaS_CORR}
                />
              </div> */}
                  <div className="mb-1">
                    <label className="fw-semibold">
                      Fecha Recepción
                    </label>
                    <input
                      aria-label="AF_FECHA_SOLICITUD"
                      type="date"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.AF_FECHA_SOLICITUD ? "is-invalid" : ""}`}
                      name="AF_FECHA_SOLICITUD"
                      maxLength={10}
                      onChange={handleChange}
                      value={Inventario.AF_FECHA_SOLICITUD}
                      disabled={isDisabled}
                      max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                    />
                    {error.AF_FECHA_SOLICITUD && (
                      <div className="invalid-feedback fw-semibold">{error.AF_FECHA_SOLICITUD}</div>
                    )}
                  </div>
                  <div className="mb-1">
                    <label className="fw-semibold">
                      N° Orden de compra
                    </label>
                    <input
                      aria-label="AF_OCO_NUMERO_REF"
                      type="text"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.AF_OCO_NUMERO_REF ? "is-invalid" : ""}`}
                      maxLength={12}
                      name="AF_OCO_NUMERO_REF"
                      onChange={handleChange}
                      value={Inventario.AF_OCO_NUMERO_REF}
                      disabled={isDisabled}
                    />
                    {error.AF_OCO_NUMERO_REF && (
                      <div className="invalid-feedback fw-semibold">{error.AF_OCO_NUMERO_REF}</div>
                    )}
                  </div>
                  <div className="mb-1">
                    <label className="fw-semibold">
                      Nº factura
                    </label>
                    <input
                      aria-label="AF_NUM_FAC"
                      type="text"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.AF_NUM_FAC ? "is-invalid" : ""}`}
                      maxLength={12}
                      name="AF_NUM_FAC"
                      onChange={handleChange}
                      value={Inventario.AF_NUM_FAC}
                      disabled={isDisabled}
                    />
                    {error.AF_NUM_FAC && (
                      <div className="invalid-feedback fw-semibold">{error.AF_NUM_FAC}</div>
                    )}
                  </div>

                </Col>
                <Col md={3}>
                  <div className="mb-2">
                    <label className="fw-semibold mb-1">
                      Origen Presupuesto
                    </label>

                    <div className="input-group">
                      <select
                        aria-label="AF_ORIGEN"
                        className={`${loadingOrigen
                          ? "form-control border-end-0"
                          : "form-select"
                          }
                        ${isDarkMode ? "bg-dark text-light border-secondary" : ""}
                        ${error.AF_ORIGEN ? "is-invalid" : ""}`}
                        name="AF_ORIGEN"
                        value={Inventario.AF_ORIGEN}
                        onChange={handleChange}
                        onClick={handleCargarOrigenPresupuesto}
                        disabled={loadingOrigen || isDisabled}
                      >
                        <option value="">
                          {loadingOrigen
                            ? "Cargando orígen presupuesto…"
                            : "Seleccione un origen"}
                        </option>

                        {comboOrigen.map(o => (
                          <option key={o.codigo} value={o.codigo}>
                            {o.descripcion}
                          </option>
                        ))}
                      </select>

                      {/* Spinner integrado */}
                      {loadingOrigen && (
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

                    {error.AF_ORIGEN && (
                      <div className="invalid-feedback d-block fw-semibold">
                        {error.AF_ORIGEN}
                      </div>
                    )}
                  </div>

                  <div className="mb-1">
                    <label className="fw-semibold">
                      Monto Recepción
                    </label>
                    <input
                      aria-label="AF_MONTOFACTURA"
                      type="text"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.AF_MONTOFACTURA ? "is-invalid" : ""}`}
                      maxLength={12}
                      name="AF_MONTOFACTURA"
                      onChange={handleChange}
                      onClick={handleCargarOrigenPresupuesto}
                      value={Inventario.AF_MONTOFACTURA.toLocaleString("es-ES", {
                        minimumFractionDigits: 0,
                      })}
                      disabled={AF_MONTOFACTURA == 0 ? isDisabled : true}
                    />
                    {error.AF_MONTOFACTURA && (
                      <div className="invalid-feedback fw-semibold">{error.AF_MONTOFACTURA}</div>
                    )}
                  </div>
                  <div className="mb-1">
                    <label className="fw-semibold">
                      Fecha Factura</label>
                    <input
                      aria-label="AF_FECHAFAC"
                      type="date"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.AF_FECHAFAC ? "is-invalid" : ""}`}
                      name="AF_FECHAFAC"
                      onChange={handleChange}
                      value={Inventario.AF_FECHAFAC}
                      disabled={isDisabled}
                      max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                    />
                    {error.AF_FECHAFAC && (
                      <div className="invalid-feedback fw-semibold">{error.AF_FECHAFAC}</div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="fw-semibold mb-1">
                      Proveedor
                    </label>
                    <div className="input-group">
                      <select
                        aria-label="PROV_RUN"
                        className={` ${loadingProveedor ? "form-control border-end-0" : "form-select"} ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.PROV_RUN ? "is-invalid" : ""}`}
                        name="PROV_RUN"
                        value={Inventario.PROV_RUN}
                        onChange={handleChange}
                        onClick={handleCargarProveedor}
                        disabled={loadingProveedor || isDisabled}
                      >
                        <option value="0">
                          {loadingProveedor
                            ? "Cargando proveedores…"
                            : "Seleccione un proveedor"}
                        </option>

                        {comboProveedor.map(p => (
                          <option key={p.proV_RUN} value={p.proV_RUN}>
                            {p.proV_NOMBRE}
                          </option>
                        ))}

                      </select>

                      {/* Spinner integrado */}
                      {loadingProveedor && (
                        <span className="input-group-text border-start-0 "
                          style={{
                            'backgroundColor': isDarkMode ? "#212529" : "rgb(233, 236, 239)",
                            border: "1px solid",
                            borderColor: isDarkMode ? "#6c757d" : "#dee2e6"
                          }}>
                          <Spinner
                            animation="border"
                            size="sm"
                            variant={isDarkMode ? "light" : "primary"}
                          />
                        </span>
                      )}
                    </div>
                    {error.PROV_RUN && (
                      <div className="invalid-feedback d-block fw-semibold">
                        {error.PROV_RUN}
                      </div>
                    )}
                  </div>

                </Col>
                <Col md={3}>
                  {/* <div className="mb-1">
                <label className="fw-semibold">
                  Servicio
                </label>
                <select
                  aria-label="SER_CORR"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.SER_CORR ? "is-invalid" : ""}`}
                  name="SER_CORR"
                  onChange={handleChange}
                  value={Inventario.SER_CORR}
                  disabled={isDisabled}
                >
                  <option value="">Seleccione un origen</option>
                  {comboServicio.map((traeServicio) => (
                    <option
                      key={traeServicio.codigo}
                      value={traeServicio.codigo}
                    >
                      {traeServicio.nombrE_ORD}
                    </option>
                  ))}
                </select>
                {error.SER_CORR && (
                  <div className="invalid-feedback fw-semibold">{error.SER_CORR}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Dependencia
                </label>
                <select
                  aria-label="DEP_CORR"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.DEP_CORR ? "is-invalid" : ""}`}
                  name="DEP_CORR"
                  onChange={handleChange}
                  value={Inventario.DEP_CORR}
                // disabled={isDisabled ? isDisabled : !Inventario.idprograma}
                >
                  <option value="">Selecciona una opción</option>
                  {comboDependencia.map((traeDependencia) => (
                    <option
                      key={traeDependencia.codigo}
                      value={traeDependencia.codigo}
                    >
                      {traeDependencia.nombrE_ORD}
                    </option>
                  ))}
                </select>
                {error.DEP_CORR && (
                  <div className="invalid-feedback fw-semibold">{error.DEP_CORR}</div>
                )}
              </div> */}

                  {/* Servicio/Dependencia */}
                  <div className="mb-2 position-relative z-1">
                    <label className="fw-semibold mb-1">
                      Servicio / Dependencia
                    </label>

                    <Select
                      options={servicioOptions}
                      onChange={handleServicioChange}
                      onMenuOpen={handleCargarServicio}
                      name="DEP_CORR"
                      value={
                        servicioOptions.find(
                          option => option.value === Inventario.DEP_CORR
                        ) || null
                      }
                      placeholder="Buscar servicio o dependencia…"
                      className={`form-select-container ${error.DEP_CORR ? "is-invalid border border-danger rounded" : ""
                        }`}
                      classNamePrefix="react-select"
                      isDisabled={loadingServicio || isDisabled}
                      isClearable
                      isSearchable

                      /*LOADING NATIVO */
                      isLoading={loadingServicio}
                      loadingMessage={() => "Cargando servicios…"}
                      noOptionsMessage={() =>
                        loadingServicio
                          ? "Cargando servicios…"
                          : "No se encontraron resultados"
                      }

                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: isDarkMode ? "#212529" : "white",
                          borderColor: isDarkMode ? "#6c757d" : "#a6a6a66e",
                          minHeight: "38px",
                          opacity: loadingServicio ? 0.9 : 1,
                          cursor: loadingServicio ? "not-allowed" : "default",
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
                          color: isSelected || isFocused
                            ? "white"
                            : isDarkMode
                              ? "white"
                              : "#212529",
                        }),
                        indicatorSeparator: () => ({
                          display: "none",
                        }),
                      }}
                    />

                    {error.DEP_CORR && (
                      <div className="invalid-feedback fw-semibold d-block">
                        {error.DEP_CORR}
                      </div>
                    )}
                  </div>

                  {/* Modalidad de compra */}
                  <div className="mb-2">
                    <label className="fw-semibold mb-1">
                      Modalidad de Compra
                    </label>

                    <div className="input-group">
                      <select
                        aria-label="IDMODALIDADCOMPRA"
                        className={`${loadingModalidadCompra ? "form-control border-end-0" : "form-select"}
                       ${isDarkMode ? "bg-dark text-light border-secondary" : ""}
                       ${error.IDMODALIDADCOMPRA ? "is-invalid" : ""}`}
                        name="IDMODALIDADCOMPRA"
                        onChange={handleChange}          // 🔹 MISMA lógica
                        onClick={handleCargarMCompra}
                        value={Inventario.IDMODALIDADCOMPRA}
                        disabled={loadingModalidadCompra || isDisabled}
                      >
                        <option value="">
                          {loadingModalidadCompra
                            ? "Cargando modalidades…"
                            : "Seleccione una modalidad"}
                        </option>

                        {comboModalidad.map(m => (
                          <option key={m.codigo} value={m.codigo}>
                            {m.descripcion}
                          </option>
                        ))}
                      </select>

                      {/* SPINNER INTEGRADO */}
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

                    {error.IDMODALIDADCOMPRA && (
                      <div className="invalid-feedback d-block fw-semibold">
                        {error.IDMODALIDADCOMPRA}
                      </div>
                    )}

                    {/* INPUT "OTRO" — MISMA LÓGICA ANTERIOR */}
                    {showInput && (
                      <div className="mt-2">
                        <input
                          aria-label="OTRA_MODALIDAD"
                          type="text"
                          className={`form-control
                          ${isDarkMode ? "bg-secondary text-light border-secondary" : ""}
                          ${error.IDMODALIDADCOMPRA ? "is-invalid" : ""}`}
                          placeholder="Especifique otro"
                          onChange={(e) =>
                            setInventario({
                              ...Inventario,
                              OTRA_MODALIDAD: e.target.value.toString(),
                            })
                          }
                        />

                        {error.IDMODALIDADCOMPRA && (
                          <div className="invalid-feedback fw-semibold">
                            {error.IDMODALIDADCOMPRA}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mb-1">
                    <label className="fw-semibold">
                      Especie
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        aria-label="codigo"
                        type="text"
                        name="codigo"
                        value={Inventario.ESP_CODIGO || "Haz clic en más para seleccionar una especie"}
                        onChange={handleChange}
                        disabled
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.ESP_CODIGO ? "is-invalid" : ""}`}
                      />
                      {/* Botón para abrir el modal y seleccionar una Especie */}
                      <Button
                        variant="primary"
                        onClick={() => setMostrarModal(true)}
                        className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  ms-1`}
                        disabled={isDisabled}
                      >
                        <Pencil
                          className={classNames("flex-shrink-0", "h-5 w-5")}
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                    {error.ESP_CODIGO && (
                      <div className="invalid-feedback fw-semibold d-block">
                        {error.ESP_CODIGO}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-2">
                    <label className="fw-semibold mb-1">
                      Cuenta
                    </label>

                    <div className="input-group">
                      <select
                        aria-label="CTA_COD"
                        className={`${loadingCuenta
                          ? "form-control border-end-0"
                          : "form-select"
                          }
                          ${isDarkMode ? "bg-dark text-light border-secondary" : ""}
                          ${error.CTA_COD ? "is-invalid" : ""}`}
                        name="CTA_COD"
                        onChange={handleChange}
                        onClick={handleCargarCuenta}
                        value={Inventario.CTA_COD}
                        disabled={loadingCuenta || isDisabled}
                      >
                        <option value="">
                          {loadingCuenta
                            ? "Cargando cuentas…"
                            : "Seleccione una cuenta"}
                        </option>

                        {comboCuenta.map(c => (
                          <option key={c.codigo} value={c.codigo}>
                            {c.descripcion}
                          </option>
                        ))}
                      </select>

                      {/* Spinner integrado */}
                      {loadingCuenta && (
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

                    {error.CTA_COD && (
                      <div className="invalid-feedback d-block fw-semibold">
                        {error.CTA_COD}
                      </div>
                    )}
                  </div>

                  {/* <div className="mb-1">
                <label className="fw-semibold">
                  Cuenta
                </label>
                <Select
                  options={cuentaOptions}
                  onChange={(selectedOption) => { handleComboCuentaChange(selectedOption) }}
                  name="CTA_COD"
                  placeholder="Buscar"
                  className={`form-select-container `}
                  classNamePrefix="react-select"
                  isClearable
                  // isSearchable
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: isDarkMode ? "#212529" : "white", // Fondo oscuro
                      color: isDarkMode ? "white" : "#212529", // Texto blanco
                      borderColor: isDarkMode ? "rgb(108 117 125)" : "#a6a6a66e", // Bordes
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: isDarkMode ? "white" : "#212529", // Color del texto seleccionado
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#212529" : "white", // Fondo del menú desplegable
                      color: isDarkMode ? "white" : "#212529",
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected ? "#6c757d" : isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                      color: isSelected ? "white" : isFocused ? "white" : isDarkMode ? "white" : "#212529",
                    }),
                  }}
                />
                {error.CTA_COD && (
                  <div className="invalid-feedback fw-semibold d-block">
                    {error.CTA_COD}
                  </div>
                )}
              </div> */}
                  <div className="mb-1">
                    <label className="fw-semibold">
                      Activos fijos</label>
                    <div className={`d-flex align-items-center form-select-container ${error.AF_VIDAUTIL || error.AF_FINGRESO || error.DET_MARCA || error.DET_MODELO ? "is-invalid border border-danger rounded" : ""}`}>
                      <p className="text-right w-100 border p-2 m-0 rounded">
                        Detalles activos fijos
                      </p>
                      {/* Botón para abrir el modal y seleccionar una ESP_CODIGO */}
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-limpiar">Ver Detalles</Tooltip>}
                      >
                        <Button
                          onClick={() => setMostrarModalDetalles(true)}
                          className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  ms-1`}
                          disabled={isDisabled}
                        >
                          <Eye
                            className={classNames("flex-shrink-0", "h-5 w-5")}
                            aria-hidden="true"
                          />
                        </Button>
                      </OverlayTrigger>
                    </div>
                    {error.AF_VIDAUTIL || error.AF_FINGRESO || error.DET_MARCA || error.DET_MODELO && (
                      <div className="invalid-feedback fw-semibold d-block">{error.AF_VIDAUTIL || error.AF_FINGRESO || error.DET_MARCA || error.DET_MODELO}</div>
                    )}
                  </div>
                </Col>
              </Row>
              <div className="d-flex justify-content-end align-items-center gap-2 m-2 p-2 rounded">


                {/* Validación / Estado */}
                {/* // permitira modificar los activo igresados antes del 2 de junio de 2025(fecha de paso a producción) y los ingresados despues de esa fecha que esten en estado no visado */}
                {
                  puedeValidar ? (
                    <>
                      < Button
                        disabled={isDisabled}
                        onClick={handleLimpiarTodo}
                        variant="danger"
                        className="px-3 py-2 d-flex align-items-center"
                      >
                        <Trash className="h-5 w-5 me-2" aria-hidden="true" />
                        Limpiar todo
                      </Button>
                      <Button
                        onClick={handleValidar}
                        variant={isDarkMode ? "secondary" : "primary"}
                        className="px-3 py-2 d-flex align-items-center"
                        disabled={isDisabled}
                      >
                        Validar
                      </Button>
                    </>
                  ) : tieneAlta ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-alta">
                          Este activo tiene un alta asociada. Solo es posible modificar activos que aún no han sido dados de alta.
                        </Tooltip>
                      }
                    >
                      <Button
                        variant="success"
                        className="px-3 py-2 d-flex align-items-center"
                      >
                        <Check2Circle className="h-5 w-5 me-2" aria-hidden="true" />
                        Activo dado de alta
                      </Button>
                    </OverlayTrigger>
                  ) : null
                }

              </div>


            </div>
          </form>
        </div>
      </div >
      {/* Modal Especies */}
      < Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        size="lg"
        className="modal-fullscreen-sm-down"
      >
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title>Listado de Especies</Modal.Title>
        </Modal.Header>

        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <form onSubmit={handleSubmitSeleccionado}>
            <Row className="mb-2">
              {/* Bien / Detalles */}
              <Col xs={12} md={6}>
                <div className="mb-1">
                  <label aria-label="bien" className="fw-semibold">Bien</label>
                  <select
                    aria-label="bien"
                    name="bien"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {comboBien.map((traeBien) => (
                      <option key={traeBien.codigo} value={traeBien.codigo}>
                        {traeBien.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-1">
                  <label className="fw-semibold">Detalles</label>
                  <select
                    aria-label="detalles"
                    name="detalles"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    onChange={handleChange}
                  // disabled={!Cuenta.bien}
                  >
                    <option value="">Seleccionar</option>
                    {comboDetalle.map((traeDetalles) => (
                      <option key={traeDetalles.codigo} value={traeDetalles.codigo}>
                        {traeDetalles.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>

              <Col xs={12} md={6}>
                {/* Especie */}
                <div className="mb-1">
                  <label className="fw-semibold">
                    Buscar Especie
                  </label>
                  <div className="d-flex align-items-center">
                    <Select
                      options={especieOptions}
                      onChange={(selectedOption) => handleComboEspecieChange(selectedOption)}
                      onInputChange={(inputValue) => handleInputEspecieChange(inputValue)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleBuscar();
                        }
                      }}
                      name="esP_CODIGO"
                      placeholder="Buscar"
                      isClearable
                      classNamePrefix="react-select"
                      className="w-100 mx-1"
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
                          backgroundColor:
                            isSelected || isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                          color:
                            isSelected || isFocused ? "white" : isDarkMode ? "white" : "#212529",
                        }),
                      }}
                    />
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-limpiar">Buscar</Tooltip>}
                    >
                      <Button
                        onClick={handleBuscar}
                        variant={isDarkMode ? "secondary" : "primary"}
                        className="w-md-auto"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="ms-1"
                            />
                          </>
                        ) : (
                          <>
                            <Search className="ms-1" />
                          </>
                        )}
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
              </Col>
            </Row>

            {listaEspecie.length > 0 && (
              <Col xs={12} className="d-flex justify-content-end ">
                <Button
                  variant={isDarkMode ? "secondary" : "primary"}
                  type="submit"
                  className="mb-1"
                  disabled={!filasSeleccionadas.length}
                >
                  Seleccionar <Check2Circle className="ms-1" />
                </Button>
              </Col>
            )}

          </form>
          {/* Tabla responsive */}
          {listaEspecie.length != 0 ? (
            <div className="table-responsive" style={{ maxHeight: "50vh", overflowY: "auto" }}>
              <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "table-light"}`}>
                  <tr>
                    <th></th>
                    <th className={isDarkMode ? "text-light" : "text-dark"}>Código</th>
                    <th className={isDarkMode ? "text-light" : "text-dark"}>Especie</th>
                    {/* <th className={isDarkMode ? "text-light" : "text-dark"}>Vida Útil</th> */}
                  </tr>
                </thead>
                <tbody>
                  {elementosActuales.map((listadoEspecies, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => handleSeleccionFila(indicePrimerElemento + index)}
                          checked={filasSeleccionadas.includes(
                            (indicePrimerElemento + index).toString()
                          )}
                        />
                      </td>
                      <td className={isDarkMode ? "text-light" : "text-dark"}>
                        {listadoEspecies.esP_CODIGO}
                      </td>
                      <td className={isDarkMode ? "text-light" : "text-dark"}>
                        {listadoEspecies.nombrE_ESP}
                      </td>
                      {/* <td className={isDarkMode ? "text-light" : "text-dark"}>
                        {listadoEspecies.vidA_UTIL}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={`text-center m-2 p-2 rounded fs-05em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
              Aplique un filtro para visualizar los detalles de cada especie aquí.
            </p>

          )}
          {/* Paginador */}
          {listaEspecie.length > 10 && (
            <div className="paginador-container mt-3">
              <Pagination className="paginador-scroll justify-content-center">
                <Pagination.First onClick={() => paginar(1)} disabled={paginaActual === 1} />
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
          )}
        </Modal.Body>
      </Modal >

      {/* Modal tabla detalles activos Fijo*/}
      < Modal
        show={mostrarModalDetalles}
        onHide={() => setMostrarModalDetalles(false)}
        size="xl"
        backdrop="static"
      >
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} >
          <div className="d-flex justify-content-between w-100">
            <Modal.Title className="fw-semibold">
              Detalles Activo Fijo
            </Modal.Title>
            <Button
              variant="transparent"
              className="border-0"
              onClick={handleCerrarModal}
            >
              <CloseButton
                aria-hidden="true"
                className={"flex-shrink-0 h-5 w-5"}
              />
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <div className="shadow-sm">
            <div className="overflow-auto">
              <table className={`table  ${isDarkMode ? "table-dark" : "table-hover "}`} >
                <thead className={`sticky-top ${isDarkMode ? "table-" : "text-dark table-light "}`}>
                  <tr>
                    <th>Vida Útil</th>
                    <th>Fecha Ingreso</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Serie</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={`align-items-center p-1  ${isDarkMode ? "text-light" : "text-dark"}`}>
                      <input
                        aria-label="AF_VIDAUTIL"
                        type="text"
                        name="AF_VIDAUTIL"
                        className={` form-control border border-0 rounded-0  ${isDarkMode ? "bg-secondary text-white" : ""}`}
                        value={Inventario.AF_VIDAUTIL}
                        onChange={(e) => handleChange(e)}
                      />
                      {error.AF_VIDAUTIL && (
                        <div className="invalid-feedback fw-semibold d-block">{error.AF_VIDAUTIL}</div>
                      )}
                    </td>

                    <td className={`align-items-center p-1  ${isDarkMode ? "text-light" : "text-dark"}`}>
                      <input
                        aria-label="AF_FINGRESO"
                        type="date"
                        name="AF_FINGRESO"
                        className={` form-control border border-0 rounded-0  ${isDarkMode ? "bg-secondary text-white" : ""}`}
                        value={Inventario.AF_FINGRESO}
                        onChange={(e) => handleChange(e)}
                        max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                      />
                      {error.AF_FINGRESO && (
                        <div className="invalid-feedback fw-semibold d-block">{error.AF_FINGRESO}</div>
                      )}
                    </td>
                    <td className={`align-items-center p-1  ${isDarkMode ? "text-light" : "text-dark"}`}>
                      <input
                        aria-label="DET_MARCA"
                        type="text"
                        name="DET_MARCA"
                        className={` form-control border border-0 rounded-0  ${isDarkMode ? "bg-secondary text-white" : ""}`}
                        value={Inventario.DET_MARCA}
                        onChange={(e) => handleChange(e)}
                      />
                      {error.DET_MARCA && (
                        <div className="invalid-feedback fw-semibold d-block">{error.DET_MARCA}</div>
                      )}
                    </td>
                    <td className={`align-items-center p-1  ${isDarkMode ? "text-light" : "text-dark"}`}>
                      <input
                        aria-label="DET_MODELO"
                        type="text"
                        name="DET_MODELO"
                        className={` form-control border border-0 rounded-0  ${isDarkMode ? "bg-secondary text-white" : ""}`}
                        value={Inventario.DET_MODELO}
                        onChange={(e) => handleChange(e)}
                      />
                      {error.DET_MODELO && (
                        <div className="invalid-feedback fw-semibold d-block">{error.DET_MODELO}</div>
                      )}
                    </td>
                    <td className={` p-1  ${isDarkMode ? "text-light" : "text-dark"}`}>
                      <input
                        aria-label="DET_SERIE"
                        type="text"
                        name="DET_SERIE"
                        className={` form-control border border-0 rounded-0  ${isDarkMode ? "bg-secondary text-white" : ""}`}
                        value={Inventario.DET_SERIE}
                        onChange={(e) => handleChange(e)}
                      />
                      {/* <Pencil
                        className={classNames("flex-shrink-0", "h-5 w-5 m-1")}
                        aria-hidden="true"
                      /> */}
                    </td>
                    <td className={`align-items-center p-1  ${isDarkMode ? "text-light" : "text-dark"}`}>
                      <input
                        aria-label="DET_PRECIO"
                        type="text"
                        name="DET_PRECIO"
                        disabled
                        className={` form-control border border-0 rounded-0  ${isDarkMode ? "bg-secondary text-white" : ""}`}
                        value={`$ ${Inventario.DET_PRECIO.toLocaleString("es-ES", { minimumFractionDigits: 0 })}`}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                </tbody>

              </table>
              <div className={`mb-1 p-1 ${isDarkMode ? "text-light" : "text-dark"}`}>
                <label className="fw-semibold">Observaciones</label>
                <textarea
                  aria-label="DET_OBS"
                  name="DET_OBS"
                  rows={3}
                  maxLength={250}
                  style={{ maxHeight: "80px", resize: "none" }}
                  className={` form-control border border-0 rounded-0  ${isDarkMode ? "bg-secondary text-white" : ""}`}
                  value={Inventario.DET_OBS}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal >

      {/* Modal lista seleccion Altas */}
      {/* <Modal show={mostrarModalAltas} onHide={() => setMostrarModalAltas(false)}
        size="xl"
        dialogClassName="draggable-modal"
        scrollable={false}
        backdrop="static" 
        keyboard={false}
      >
        <Modal.Header className={`modal-header`} closeButton>
          <Modal.Title className="fw-semibold">Resultado Busqueda</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <div className="bg-white shadow-sm sticky-top">
            <Row>
              <Col md={6}>
                {listaAltas.length > 10 &&
                  < div className="d-flex align-items-center me-2">
                    <label htmlFor="nPaginacion" className="form-label fw-semibold mb-0 me-2">
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
                }
              </Col>
              <Col md={6} className="d-flex justify-content-end">
                {filasSeleccionadasAltas.length > 0 ? (
                  <Button
                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                    onClick={handleInventarioSeleccionado}
                    className="m-1 p-2 d-flex align-items-center">
                    Seleccionar
                  </Button>
                ) : (
                  <strong className="alert alert-dark border m-1 p-2 mx-2">
                    No hay filas seleccionadas
                  </strong>
                )}
              </Col>
            </Row>
          </div>
          <div style={{ maxHeight: "50vh", overflowY: "auto" }} className="mt-2">
            {loading ? (
              <>
                <SkeletonLoader rowCount={10} columnCount={10} />
              </>
            ) : (
              <div className='table-responsive position-relative z-0'>
                <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                  <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                    <tr>
                      <th style={{ position: 'sticky', left: 0 }}>
                        <Form.Check
                          className="check-danger"
                          type="checkbox"
                          checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                        />
                      </th>
                      <th scope="col" className="text-nowrap"></th>
                      <th scope="col" className="text-nowrap">Estado</th>
                      <th scope="col" className="text-nowrap">Nº Inventario</th>
                      <th scope="col" className="text-nowrap">Nº Alta</th>
                      <th scope="col" className="text-nowrap">Servicio</th>
                      <th scope="col" className="text-nowrap">Dependencia</th>
                      <th scope="col" className="text-nowrap">Monto Recepción</th>
                      <th scope="col" className="text-nowrap">N° Orden de Compra</th>
                      <th scope="col" className="text-nowrap">Especie</th>
                      <th scope="col" className="text-nowrap">N° Factura</th>
                      <th scope="col" className="text-nowrap">Cuenta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {elementosActuales1.map((lista, index) => {
                      const indexReal = indicePrimerElemento1 + index; // Índice real basado en la página
                      return (
                        <tr key={index}>
                          <td style={{ position: 'sticky', left: 0 }}>
                            <Form.Check
                              type="checkbox"
                              onChange={() =>
                                handleSeleccionFilaAltas(indexReal, lista.altaS_CORR)
                              }
                              checked={filasSeleccionadasAltas.includes(
                                (indicePrimerElemento1 + index).toString()
                              )}
                            />
                          </td>

                          <td className="text-nowrap">
                            {lista.estadO_VISADO === 0 ? (
                              <p className="badge bg-warning w-100">Visado en curso</p>
                            ) : lista.estadO_VISADO === 1 ? (
                              <p className="badge bg-success w-100">Visado</p>
                            ) : (
                              <p className="badge bg-primary w-100">Sin Visado</p>
                            )}
                          </td>
                          <td className="text-nowrap">{lista.aF_CODIGO_GENERICO}</td>
                          <td className="text-nowrap">{lista.altaS_CORR}</td>
                          <td className="text-nowrap">{lista.seR_CORR}</td>
                          <td className="text-nowrap">{lista.deP_CORR}</td>
                          <td className="text-nowrap">${lista.aF_MONTOFACTURA.toLocaleString("es-ES", { minimumFractionDigits: 0 })}</td>
                          <td className="text-nowrap">{lista.aF_OCO_NUMERO_REF}</td>
                          <td className="text-nowrap">{lista.esP_NOMBRE}</td>
                          <td className="text-nowrap">{lista.aF_NUM_FAC}</td>
                          <td className="text-nowrap">{lista.ctA_COD}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="paginador-container position-relative z-0">
            <Pagination className="paginador-scroll">
              <Pagination.First
                onClick={() => paginar1(1)}
                disabled={paginaActual1 === 1}
              />
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
        </Modal.Body>
      </Modal> */}

    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers,
  //-------Combos del Formulario---------//
  // comboServicio: state.comboServicioReducer.comboServicio,
  // comboDependencia: state.comboDependenciaModificarReducers.comboDependencia,
  comboOrigen: state.comboOrigenPresupuestoReducer.comboOrigen,
  comboModalidad: state.comboModalidadCompraReducer.comboModalidad,
  comboCuenta: state.comboCuentaModificarReducers.comboCuenta,
  comboSerDep: state.comboServDepReducers.comboSerDep,
  comboBien: state.detallesReducer.comboBien,
  comboDetalle: state.detallesReducer.comboDetalle,
  comboProveedor: state.comboProveedorReducers.comboProveedor,
  comboEspecies: state.comboEspeciesBienReducers.comboEspecies,

  //-------Lista especies(Modal)---------//
  descripcionEspecie: state.datosActivoFijoReducers.descripcionEspecie,
  listaEspecie: state.listadoDeEspeciesBienReducers.listadoDeEspecies,
  //-------Lista Altas(Obtener mediante la busqueda)---------//
  listaAltas: state.obtenerInventarioXAltasReducers.listaAltas,
  //-------Formulario(renderiza en cada propiedad)---------//
  AF_CLAVE: state.obtenerInventarioReducers.aF_CLAVE,
  AF_CODIGO_GENERICO: state.obtenerInventarioReducers.aF_CODIGO_GENERICO,// nRecepcion
  AF_FECHA_SOLICITUD: state.obtenerInventarioReducers.aF_FECHA_SOLICITUD,// fechaRecepcion 
  AF_OCO_NUMERO_REF: state.obtenerInventarioReducers.aF_OCO_NUMERO_REF, // nOrdenCompra
  AF_NUM_FAC: state.obtenerInventarioReducers.aF_NUM_FAC,// nFactura
  AF_ORIGEN: state.obtenerInventarioReducers.aF_ORIGEN, //origenPresupuesto
  AF_MONTOFACTURA: state.obtenerInventarioReducers.aF_MONTOFACTURA, //montoRecepcion
  AF_FECHAFAC: state.obtenerInventarioReducers.aF_FECHAFAC, //fechaFactura
  PROV_RUN: state.obtenerInventarioReducers.proV_RUN, // rutProveedor
  // SER_CORR: state.obtenerInventarioReducers.seR_CORR, //servicio
  DEP_CORR: state.obtenerInventarioReducers.deP_CORR, //dependencia
  IDMODALIDADCOMPRA: state.obtenerInventarioReducers.idmodalidadcompra, // modalidadDeCompra
  ESP_CODIGO: state.obtenerInventarioReducers.esP_CODIGO,
  esP_NOMBRE: state.obtenerInventarioReducers.esP_NOMBRE,
  CTA_COD: state.obtenerInventarioReducers.ctA_COD,

  //-------Detalles Activo fijo---------//
  AF_VIDAUTIL: state.obtenerInventarioReducers.aF_VIDAUTIL,
  AF_FINGRESO: state.obtenerInventarioReducers.aF_FINGRESO,
  DET_MARCA: state.obtenerInventarioReducers.deT_MARCA,
  DET_MODELO: state.obtenerInventarioReducers.deT_MODELO,
  DET_SERIE: state.obtenerInventarioReducers.deT_SERIE,
  DET_PRECIO: state.obtenerInventarioReducers.deT_PRECIO,
  DET_OBS: state.obtenerInventarioReducers.deT_OBS,

  //indica si el activo esta de alta o no
  estadO_VISADO: state.obtenerInventarioReducers.estadO_VISADO,
});

export default connect(mapStateToProps, {
  obtenerInventarioActions,
  obtenerInventarioxAltasActions,
  comboSerDepActions,
  // comboDependenciaModificarActions,
  comboDetalleActions,
  comboEspeciesBienActions,
  listadoDeEspeciesBienActions,
  comboCuentaModificarActions,
  comboModalidadesActions,
  comboProveedorActions,
  comboOrigenPresupuestosActions,
  modificarFormInventarioActions,
  limpiarDataActions
})(ModificarInventario);
