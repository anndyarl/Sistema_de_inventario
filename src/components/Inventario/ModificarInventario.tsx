import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Row, Col, Modal, Pagination, Spinner, OverlayTrigger, Tooltip, } from "react-bootstrap";
import { AppDispatch, RootState } from "../../store";
import { connect, useDispatch } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import { MODALIDAD, ORIGEN, PROVEEDOR, } from "./RegistrarInventario/DatosInventario";
import { BIEN, CUENTA, DEPENDENCIA, DETALLE, ListaEspecie, SERVICIO, } from "./RegistrarInventario/DatosCuenta";
import { Check2Circle, Eye, Pencil, Search } from "react-bootstrap-icons";
import MenuInventario from "../Menus/MenuInventario";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
import { Objeto } from "../Navegacion/Profile";
import { obtenerInventarioActions } from "../../redux/actions/Inventario/ModificarInventario/obtenerInventarioActions";
import { modificarFormInventarioActions } from "../../redux/actions/Inventario/ModificarInventario/modificarFormInventarioActions";
import { comboDetalleActions } from "../../redux/actions/Inventario/Combos/comboDetalleActions";
import { comboProveedorActions } from "../../redux/actions/Inventario/Combos/comboProveedorActions";
import { setModalidadCompraActions } from "../../redux/actions/Inventario/RegistrarInventario/datosRegistroInventarioActions";
import { listadoDeEspeciesBienActions } from "../../redux/actions/Inventario/Combos/listadoDeEspeciesBienActions";
import { comboEspeciesBienActions } from "../../redux/actions/Inventario/Combos/comboEspeciesBienActions";
import { comboDependenciaModificarActions } from "../../redux/actions/Inventario/Combos/comboDependenciaModificarActions ";
import { comboCuentaModificarActions } from "../../redux/actions/Inventario/Combos/comboCuentaModificarActions";
export interface InventarioCompleto {
  aF_CLAVE: number;
  aF_CODIGO_GENERICO: string;
  AF_FECHA_SOLICITUD: string; // fechaRecepcion 
  AF_OCO_NUMERO_REF: number // nOrdenCompra
  AF_NUM_FAC: string; // nFactura
  AF_ORIGEN: number;  //origenPresupuesto
  AF_MONTOFACTURA: number; //montoRecepcion
  AF_FECHAFAC: string; //fechaFactura
  PROV_RUN: number; // rutProveedor
  SER_CORR: number; //servicio
  DEP_CORR: number; //dependencia
  IDMODALIDADCOMPRA: number; // modalidadDeCompra
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
  comboServicio: SERVICIO[];
  comboDependencia: DEPENDENCIA[];
  comboCuenta: CUENTA[];
  comboBien: BIEN[];
  comboDetalle: DETALLE[];
  listaEspecie: ListaEspecie[];
  comboEspecies: ListaEspecie[];
  comboProveedor: PROVEEDOR[];

  comboDependenciaModificarActions: (comboServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
  obtenerInventarioActions: (af_codigo_generico: string) => Promise<boolean>;
  comboDetalleActions: (bienSeleccionado: string) => void;
  comboEspeciesBienActions: (EST: number, IDBIEN: number) => Promise<boolean>; //Carga Combo Especie
  listadoDeEspeciesBienActions: (EST: number, IDBIEN: number, esP_CODIGO: string) => Promise<boolean>;
  comboCuentaModificarActions: (nombreEspecie: string) => Promise<boolean>;
  comboProveedorActions: (rutProveedor: string) => void;
  modificarFormInventarioActions: (formInventario: Record<string, any>) => Promise<Boolean>;
  esP_NOMBRE: string; // se utiliza solo para guardar la descripcion completa en el input de ESP_CODIGO
  isDarkMode: boolean;
  objeto: Objeto;


}

const ModificarInventario: React.FC<InventarioCompletoProps> = ({
  comboOrigen,
  comboModalidad,
  comboServicio,
  comboDependencia,
  comboCuenta,
  comboBien,
  comboDetalle,
  comboProveedor,
  listaEspecie,
  comboEspecies,
  aF_CLAVE,
  aF_CODIGO_GENERICO, // nRecepcion
  AF_FECHA_SOLICITUD,// fechaRecepcion 
  AF_OCO_NUMERO_REF, // nOrdenCompra
  AF_NUM_FAC,// nFactura
  AF_ORIGEN, //origenPresupuesto
  AF_MONTOFACTURA, //montoRecepcion
  AF_FECHAFAC, //fechaFactura
  PROV_RUN, // rutProveedor
  SER_CORR, //servicio
  DEP_CORR, //dependencia
  IDMODALIDADCOMPRA, // modalidadDeCompra
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
  isDarkMode,
  objeto,
  comboDependenciaModificarActions,
  obtenerInventarioActions,
  comboDetalleActions,
  comboEspeciesBienActions,
  listadoDeEspeciesBienActions,
  comboCuentaModificarActions,
  comboProveedorActions,
  modificarFormInventarioActions,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalLista, setMostrarModalLista] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaEspecie>();
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 50;
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledNRecepcion, setIsDisabledNRecepcion] = useState(false);
  const [error, setError] = useState<Partial<InventarioCompleto> & {}>({});
  const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
  };
  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [showInput, setShowInput] = useState(false);

  const [Especies, setEspecies] = useState({
    estableEspecie: 0,
    codigoEspecie: "",
    nombreEspecie: "",
    descripcionEspecie: "",
  });
  const [Inventario, setInventario] = useState({
    aF_CLAVE,
    aF_CODIGO_GENERICO: "",
    AF_FECHA_SOLICITUD: "", // fechaRecepcion
    AF_OCO_NUMERO_REF: 0, // nOrdenCompra
    USUARIO_MOD: objeto.IdCredencial,
    AF_NUM_FAC: "",// nFactura
    AF_ORIGEN: 0,  //origenPresupuesto
    AF_MONTOFACTURA: 0, //montoRecepcion
    AF_FECHAFAC: "", //fechaFactura
    PROV_RUN: 0, // rutProveedor
    SER_CORR: 0, //servicio
    DEP_CORR: 0, //dependencia
    IDMODALIDADCOMPRA: 0, // modalidadDeCompra
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

  const [Buscar, setBuscar] = useState({
    esP_CODIGO: ""
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
    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.aF_CODIGO_GENERICO) tempErrors.aF_CODIGO_GENERICO = "Campo obligatorio";
    if (!Inventario.AF_FECHA_SOLICITUD) tempErrors.AF_FECHA_SOLICITUD = "Campo obligatorio";
    if (!Inventario.AF_OCO_NUMERO_REF || Inventario.AF_OCO_NUMERO_REF == 0)
      tempErrors.AF_OCO_NUMERO_REF = "Campo obligatorio";
    if (!Inventario.AF_NUM_FAC || Inventario.AF_NUM_FAC == "0")
      tempErrors.AF_NUM_FAC = "Campo obligatorio";
    if (!Inventario.AF_ORIGEN) tempErrors.AF_ORIGEN = "Campo obligatorio";
    if (!Inventario.AF_MONTOFACTURA || Inventario.AF_MONTOFACTURA == 0)
      tempErrors.AF_MONTOFACTURA = "Campo obligatorio";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.AF_MONTOFACTURA)))
      tempErrors.AF_MONTOFACTURA = "El Monto debe ser un número válido con hasta dos decimales.";
    if (!Inventario.AF_FECHAFAC) tempErrors.AF_FECHAFAC = "Campo obligatorio";
    if (!Inventario.PROV_RUN || Inventario.PROV_RUN === 0) tempErrors.PROV_RUN = "Campo obligatorio";
    if (!Inventario.IDMODALIDADCOMPRA) tempErrors.IDMODALIDADCOMPRA = "Campo obligatorio.";
    // if (!Inventario.SER_CORR) tempErrors.SER_CORR = "Campo obligatorio";
    if (!Inventario.DEP_CORR) tempErrors.DEP_CORR = "Campo obligatorio";
    if (!Inventario.CTA_COD || Inventario.CTA_COD === "") tempErrors.CTA_COD = "Campo obligatorio";
    if (!Inventario.ESP_CODIGO) tempErrors.ESP_CODIGO = "Campo obligatorio";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  //Hook que muestra los valores al input, Sincroniza el estado local con Redux
  useEffect(() => {
    //Carga combo especies
    if (comboEspecies.length === 0) {
      comboEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0);
    }
    if (comboDependencia.length === 0) { comboDependenciaModificarActions(""); }


    setInventario({
      aF_CLAVE,
      aF_CODIGO_GENERICO, // nRecepcion
      AF_FECHA_SOLICITUD,// fechaRecepcion 
      AF_OCO_NUMERO_REF, // nOrdenCompra
      USUARIO_MOD: objeto.IdCredencial,
      AF_NUM_FAC,// nFactura
      AF_ORIGEN, //origenPresupuesto
      AF_MONTOFACTURA, //montoRecepcion
      AF_FECHAFAC, //fechaFactura
      PROV_RUN, // rutProveedor
      SER_CORR, //servicio
      DEP_CORR, //dependencia
      IDMODALIDADCOMPRA, // modalidadDeCompra
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
    comboDependencia.length,
    aF_CODIGO_GENERICO, // nRecepcion
    AF_FECHA_SOLICITUD,//fechaRecepcion 
    AF_OCO_NUMERO_REF, //nOrdenCompra
    AF_NUM_FAC, //nFactura
    AF_ORIGEN, //origenPresupuesto
    AF_MONTOFACTURA, //montoRecepcion
    AF_FECHAFAC, //fechaFactura
    PROV_RUN, // rutProveedor
    SER_CORR, //servicio
    DEP_CORR, //dependencia
    IDMODALIDADCOMPRA, // modalidadDeCompra
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
    comboCuentaModificarActions
    // Especies.codigoEspecie,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "aF_CODIGO_GENERICO" && !/^[0-9]*$/.test(value)) {
      return; // Salir si contiene caracteres no numéricos
    }

    let newValue: string | number = [
      "IDMODALIDADCOMPRA", //modalidadDeCompra
      "AF_MONTOFACTURA",//montoRecepcion     
      "AF_ORIGEN", //origenPresupuesto
      "PROV_RUN", //rutProveedor
      "DEP_CORR", //dependencia
      "idprograma", //servicio
      "CTA_COD", //cuenta
      "AF_VIDAUTIL", //vidaUtil
      "DET_PRECIO",
      "USUARIO_MOD" //precio

    ].includes(name)

      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;
    setInventario((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    if (name === "idprograma") { //servicio
      comboDependenciaModificarActions(value);
    }
    if (comboBien.length === 0) comboDetalleActions("0");

    if (name === "bien") {
      comboDetalleActions(value);
    }
    if (name === "detalles") {
      listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, newValue as number, "");
    }
    if (name === "PROV_RUN") { //rutProveedor
      comboProveedorActions(value);
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
    if (name === "SER_CORR") {
      comboDependenciaModificarActions(value);
    }

    if (name === "aF_CODIGO_GENERICO") {
      comboCuentaModificarActions("");
    }

  };

  const handleEdit = () => {
    setInventario((prevInventario) => ({
      ...prevInventario,
      aF_CODIGO_GENERICO: "",
      AF_CLAVE: 0, // nRecepcion
      AF_FECHA_SOLICITUD: "", // fechaRecepcion 
      AF_OCO_NUMERO_REF: 0, // nOrdenCompra      
      AF_NUM_FAC: "",// nFactura
      AF_ORIGEN: 0,  //origenPresupuesto
      AF_MONTOFACTURA: 0, //montoRecepcion
      AF_FECHAFAC: "", //fechaFactura
      PROV_RUN: 0, // rutProveedor
      SER_CORR: 0, //servicio
      DEP_CORR: 0, //dependencia
      IDMODALIDADCOMPRA: 0, // modalidadDeCompra
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
    setIsDisabled(true);
    setIsDisabledNRecepcion(false);
  };

  //Selecciona fila del listado de Especies
  const handleSeleccionFila = (index: number) => {
    const item = listaEspecie[index];
    setFilasSeleccionadas([index.toString()]);
    setElementoSeleccionado(item);
    // console.log("Elemento seleccionado", item);
  };

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

  const handleObtenerInventario = async (e: React.MouseEvent<HTMLButtonElement>) => {
    let resultado = false;
    e.preventDefault();
    setLoading(true); // Inicia el estado de carga


    if (!Inventario.aF_CODIGO_GENERICO || Inventario.aF_CODIGO_GENERICO === "") {
      Swal.fire({
        icon: "warning",
        title: "Por favor, ingrese un número de inventario",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      setLoading(false); //Finaliza estado de carga
      return;
    }
    resultado = await obtenerInventarioActions(Inventario.aF_CODIGO_GENERICO);
    if (!resultado) {
      Swal.fire({
        icon: "error",
        title: ":'(",
        text: "No se encontraron resultados, inténte otro registro.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      setIsDisabled(true);
      setIsDisabledNRecepcion(false);
      setLoading(false); //Finaliza estado de carga

      // return;
    } else {
      setIsDisabled(false);
      setIsDisabledNRecepcion(true);
      setLoading(false); //Finaliza estado de carga
    }

  };

  const handleValidar = () => {
    // console.log("campos", JSON.stringify(Inventario, null, 2));
    if (validate()) {
      Swal.fire({
        icon: "info",
        // title: 'Confirmar',
        text: "Confirmar la modificación del formulario",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar y modificar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
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
    const resultado = await modificarFormInventarioActions(Inventario);
    if (resultado) {
      Swal.fire({
        icon: "success",
        title: "Actualización exitosa",
        text: "Se ha actualizado el registro con éxito!",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      // handleEdit();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al actualizar el registro. Si el problema persiste, por favor contacte a la Unidad de Desarrollo para recibir asistencia.",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
    }
  };

  const handleBuscar = async () => {
    setLoading(true);
    let resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0, Buscar.esP_CODIGO);

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

  };

  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () => listaEspecie.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaEspecie, indicePrimerElemento, indiceUltimoElemento]
  );
  const totalPaginas = Math.ceil(listaEspecie.length / elementosPorPagina);
  // const totalPaginas = Array.isArray(listaESP_CODIGO) ? Math.ceil(listaESP_CODIGO.length / elementosPorPagina) : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  return (
    <Layout>
      <Helmet>
        <title>Modificar Inventario</title>
      </Helmet>
      <MenuInventario />
      <form onSubmit={handleSubmit}>
        <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">
            Modificar Inventario
          </h3>
          <Row>
            <Col md={3}>
              <div className="mb-1">
                <label className="fw-semibold">
                  Nº Inventario
                </label>
                <div className="d-flex align-items-center">
                  <input
                    aria-label="aF_CODIGO_GENERICO"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.aF_CODIGO_GENERICO ? "is-invalid" : ""}`}
                    maxLength={12}
                    name="aF_CODIGO_GENERICO"
                    onChange={handleChange}
                    value={Inventario.aF_CODIGO_GENERICO}
                    disabled={isDisabledNRecepcion}
                  />
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-limpiar">Buscar Inventario</Tooltip>}
                  >
                    <Button
                      onClick={handleObtenerInventario}
                      variant="primary"
                      className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  ms-1`}
                    >
                      {loading ? (
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

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-limpiar">Editar Inventario</Tooltip>}>
                    <Button
                      onClick={handleEdit}
                      variant="primary"
                      className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  ms-1`}
                    >
                      <Pencil
                        className={classNames("flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />
                    </Button>
                  </OverlayTrigger>
                </div>
                {error.aF_CODIGO_GENERICO && (<div className="invalid-feedback fw-semibold d-block">{error.aF_CODIGO_GENERICO}
                </div>
                )}
              </div>
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
              <div className="mb-1">
                <label className="fw-semibold">
                  Origen Presupuesto</label>
                <select
                  aria-label="AF_ORIGEN"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.AF_ORIGEN ? "is-invalid" : ""}`}
                  name="AF_ORIGEN"
                  onChange={handleChange}
                  value={Inventario.AF_ORIGEN}
                  disabled={isDisabled}
                >
                  <option value="">Seleccione un origen</option>
                  {comboOrigen.map((traeOrigen) => (
                    <option key={traeOrigen.codigo} value={traeOrigen.codigo}>
                      {traeOrigen.descripcion}
                    </option>
                  ))}
                </select>
                {error.AF_ORIGEN && (<div className="invalid-feedback fw-semibold">{error.AF_ORIGEN}
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
                  value={Inventario.AF_MONTOFACTURA}
                  disabled={isDisabled}
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
                />
                {error.AF_FECHAFAC && (
                  <div className="invalid-feedback fw-semibold">{error.AF_FECHAFAC}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Proveedor</label>
                <select
                  aria-label="PROV_RUN"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.PROV_RUN ? "is-invalid" : ""}`}
                  name="PROV_RUN"
                  onChange={handleChange}
                  value={Inventario.PROV_RUN}
                  disabled={isDisabled}
                >
                  <option value="0">Seleccione un Proveedor</option>
                  {comboProveedor.map((traeProveedor) => (
                    <option key={traeProveedor.proV_RUN} value={traeProveedor.proV_RUN}>
                      {traeProveedor.proV_NOMBRE}
                    </option>
                  ))}
                </select>
                {error.PROV_RUN && (<div className="invalid-feedback fw-semibold d-block">{error.PROV_RUN}
                </div>
                )}
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-1">
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
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Modalidad de Compra
                </label>
                <select
                  aria-label="IDMODALIDADCOMPRA"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.IDMODALIDADCOMPRA ? "is-invalid" : ""}`}
                  name="IDMODALIDADCOMPRA"
                  onChange={handleChange}
                  value={Inventario.IDMODALIDADCOMPRA}
                >
                  <option value="">Seleccione una modalidad</option>
                  {comboModalidad.map((traeModalidad) => (
                    <option
                      key={traeModalidad.codigo}
                      value={traeModalidad.codigo}
                    >
                      {traeModalidad.descripcion}
                    </option>
                  ))}
                </select>
                {error.IDMODALIDADCOMPRA && (<div className="invalid-feedback fw-semibold">{error.IDMODALIDADCOMPRA}
                </div>
                )}
              </div>
              {showInput && (
                <div className="mb-1">
                  {/* <label className="fw-semibold">
                    Modalidad de Compra
                  </label> */}
                  <input
                    aria-label="IDMODALIDADCOMPRA"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-secondary text-light border-secondary" : ""} ${error.IDMODALIDADCOMPRA ? "is-invalid" : ""}`}
                    name="IDMODALIDADCOMPRA"
                    placeholder="Especifique otro"
                    onChange={(e) =>
                      setInventario({
                        ...Inventario,
                        IDMODALIDADCOMPRA: parseInt(e.target.value),
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
            </Col>
            <Col md={3}>
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
              <div className="mb-1">
                <label className="fw-semibold">
                  Cuenta</label>
                <select
                  aria-label="CTA_COD"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.CTA_COD ? "is-invalid" : ""}`}
                  name="CTA_COD"
                  onChange={handleChange}
                  value={Inventario.CTA_COD}
                // disabled={isDisabled ? isDisabled : !Especies.codigoEspecie}
                >
                  <option value="">Selecciona una opción</option>
                  {comboCuenta.map((traeCuentas) => (
                    <option key={traeCuentas.codigo} value={traeCuentas.codigo}>
                      {traeCuentas.descripcion}
                    </option>
                  ))}
                </select>
                {error.CTA_COD && (
                  <div className="invalid-feedback fw-semibold">{error.CTA_COD}</div>
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
                <div className="d-flex align-items-center">
                  <p className="text-right w-100 border p-2 m-0 rounded">
                    Detalles activos fijos
                  </p>
                  {/* Botón para abrir el modal y seleccionar una ESP_CODIGO */}
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-limpiar">Ver Detalles</Tooltip>}
                  >
                    <Button
                      onClick={() => setMostrarModalLista(true)}
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

              </div>
            </Col>
          </Row>
          <div className="rounded d-flex justify-content-end m-2">
            <Button disabled={isDisabled} onClick={handleValidar} className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}>
              Validar
            </Button>
          </div>
        </div>
      </form>
      {/* Modal ESP_CODIGOs*/}
      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        size="lg"
      >
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title className="fw-semibold">Listado de Especies</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <form onSubmit={handleSubmitSeleccionado}>
            <Row>
              <Col md={12}>
                <div className="d-flex justify-content-between">
                  <div className="mb-1 w-50">
                    <label className="fw-semibold">Bien</label>
                    <div className="d-flex align-items-center">
                      <select
                        aria-label="bien"
                        name="bien"
                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                        onChange={handleChange}
                      >
                        {comboBien.map((traeBien) => (
                          <option key={traeBien.codigo} value={traeBien.codigo}>
                            {traeBien.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end p-4">
                    <Button type="submit" variant={`${isDarkMode ? "secondary" : "primary "}`}>
                      Seleccionar{" "}
                      <Check2Circle
                        className={classNames("flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
                <div className="mb-1 w-50">
                  <label className="fw-semibold">Detalles</label>
                  <div className="d-flex align-items-center">
                    <select
                      aria-label="detalles"
                      name="detalles"
                      className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una opción</option>
                      {comboDetalle.map((traeDetalles) => (
                        <option
                          key={traeDetalles.codigo}
                          value={traeDetalles.codigo}
                        >
                          {traeDetalles.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="mb-1 w-50">
                    <label className="fw-semibold">
                      Buscar Especie
                    </label>
                    <Select
                      options={especieOptions}
                      onChange={(selectedOption) => { handleComboEspecieChange(selectedOption) }}
                      name="esP_CODIGO"
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
                  </div>
                  <div className="mb-1 mt-4">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-limpiar">Editar Especie</Tooltip>}
                    >
                      <Button onClick={handleBuscar}
                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                        className="mx-1 mb-1">
                        {loading ? (
                          <>
                            {" Buscar"}
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
                            {" Buscar"}
                            < Search className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                          </>
                        )}
                      </Button>
                    </OverlayTrigger>
                    {/* <Button onClick={handleLimpiar}
                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                    className="mx-1 mb-1">
                    Limpiar
                    <Eraser className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                  </Button> */}
                  </div>
                </div>
              </Col>
            </Row>
          </form>

          {/* Tabla*/}
          <div className='table-responsive position-relative z-0'>
            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
              <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                <tr>
                  <th></th>
                  {/* <th>Establecimiento</th> */}
                  <th>Nombre</th>
                  <th>Especie</th>
                </tr>
              </thead>
              <tbody>
                {elementosActuales.map((listadoEspecies, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        onChange={() =>
                          handleSeleccionFila(indicePrimerElemento + index)
                        }
                        checked={filasSeleccionadas.includes(
                          (indicePrimerElemento + index).toString()
                        )}
                      />
                    </td>
                    {/* <td>{listadoEspecies.estabL_CORR}</td> */}
                    <td>{listadoEspecies.esP_CODIGO}</td>
                    <td>{listadoEspecies.nombrE_ESP}</td>
                  </tr>
                ))}
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
      </Modal>

      {/* Modal tabla detalles activos Fijo*/}
      <Modal
        show={mostrarModalLista}
        onHide={() => setMostrarModalLista(false)}
        size="xl"
      >
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title className="fw-semibold">
            Detalles Activo Fijo
          </Modal.Title>
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
                    </td>

                    <td className={`align-items-center p-1  ${isDarkMode ? "text-light" : "text-dark"}`}>
                      <input
                        aria-label="AF_FINGRESO"
                        type="text"
                        name="AF_FINGRESO"
                        className={` form-control border border-0 rounded-0  ${isDarkMode ? "bg-secondary text-white" : ""}`}
                        value={Inventario.AF_FINGRESO}
                        onChange={(e) => handleChange(e)}
                      />
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
                        className={` form-control border border-0 rounded-0  ${isDarkMode ? "bg-secondary text-white" : ""}`}
                        value={Inventario.DET_PRECIO}

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
      </Modal>
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  comboOrigen: state.comboOrigenPresupuestoReducer.comboOrigen,
  comboServicio: state.comboServicioReducer.comboServicio,
  comboModalidad: state.comboModalidadCompraReducer.comboModalidad,
  comboCuenta: state.comboCuentaModificarReducers.comboCuenta,
  comboDependencia: state.comboDependenciaModificarReducers.comboDependencia,
  comboDetalle: state.detallesReducer.comboDetalle,
  comboBien: state.detallesReducer.comboBien,
  comboProveedor: state.comboProveedorReducers.comboProveedor,
  listaEspecie: state.listadoDeEspeciesBienReducers.listadoDeEspecies,
  comboEspecies: state.comboEspeciesBienReducers.comboEspecies,
  descripcionEspecie: state.datosActivoFijoReducers.descripcionEspecie,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers,
  aF_CLAVE: state.obtenerInventarioReducers.aF_CLAVE,
  aF_CODIGO_GENERICO: state.obtenerInventarioReducers.aF_CODIGO_GENERICO,// nRecepcion
  AF_FECHA_SOLICITUD: state.obtenerInventarioReducers.aF_FECHA_SOLICITUD,// fechaRecepcion 
  AF_OCO_NUMERO_REF: state.obtenerInventarioReducers.aF_OCO_NUMERO_REF, // nOrdenCompra
  AF_NUM_FAC: state.obtenerInventarioReducers.aF_NUM_FAC,// nFactura
  AF_ORIGEN: state.obtenerInventarioReducers.aF_ORIGEN, //origenPresupuesto
  AF_MONTOFACTURA: state.obtenerInventarioReducers.aF_MONTOFACTURA, //montoRecepcion
  AF_FECHAFAC: state.obtenerInventarioReducers.aF_FECHAFAC, //fechaFactura
  PROV_RUN: state.obtenerInventarioReducers.proV_RUN, // rutProveedor
  SER_CORR: state.obtenerInventarioReducers.seR_CORR, //servicio
  DEP_CORR: state.obtenerInventarioReducers.deP_CORR, //dependencia
  IDMODALIDADCOMPRA: state.obtenerInventarioReducers.idmodalidadcompra, // modalidadDeCompra
  ESP_CODIGO: state.obtenerInventarioReducers.esP_CODIGO,//ESP_CODIGO
  esP_NOMBRE: state.obtenerInventarioReducers.esP_NOMBRE,
  CTA_COD: state.obtenerInventarioReducers.ctA_COD,
  //-------Tabla---------//
  AF_VIDAUTIL: state.obtenerInventarioReducers.aF_VIDAUTIL,
  AF_FINGRESO: state.obtenerInventarioReducers.aF_FINGRESO,
  DET_MARCA: state.obtenerInventarioReducers.deT_MARCA,
  DET_MODELO: state.obtenerInventarioReducers.deT_MODELO,
  DET_SERIE: state.obtenerInventarioReducers.deT_SERIE,
  DET_PRECIO: state.obtenerInventarioReducers.deT_PRECIO,
  DET_OBS: state.obtenerInventarioReducers.deT_OBS,
});

export default connect(mapStateToProps, {
  obtenerInventarioActions,
  comboDependenciaModificarActions,
  comboDetalleActions,
  comboEspeciesBienActions,
  listadoDeEspeciesBienActions,
  comboCuentaModificarActions,
  comboProveedorActions,
  modificarFormInventarioActions
})(ModificarInventario);
