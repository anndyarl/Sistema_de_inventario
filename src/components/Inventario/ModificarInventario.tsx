import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Row, Col, Modal, Pagination, Spinner, } from "react-bootstrap";
import { AppDispatch, RootState } from "../../store";
import { connect, useDispatch } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import { obtenerInventarioActions } from "../../redux/actions/Inventario/ModificarInventario/obtenerInventarioActions";
import { MODALIDAD, ORIGEN, PROVEEDOR, } from "./RegistrarInventario/DatosInventario";
import { BIEN, CUENTA, DEPENDENCIA, DETALLE, ListaEspecie, SERVICIO, } from "./RegistrarInventario/DatosCuenta";

import Swal from "sweetalert2";
import { Check2Circle, Eye, Pencil, Search } from "react-bootstrap-icons";
import { modificarFormInventarioActions } from "../../redux/actions/Inventario/ModificarInventario/modificarFormInventarioActions";
import { comboDependenciaActions } from "../../redux/actions/Inventario/Combos/comboDependenciaActions";
import { comboDetalleActions } from "../../redux/actions/Inventario/Combos/comboDetalleActions";
import { comboListadoDeEspeciesBienActions } from "../../redux/actions/Inventario/Combos/comboListadoDeEspeciesBienActions";
import { comboCuentaActions } from "../../redux/actions/Inventario/Combos/comboCuentaActions";
import { comboProveedorActions } from "../../redux/actions/Inventario/Combos/comboProveedorActions";
import MenuInventario from "../Menus/MenuInventario";
import { setModalidadCompraActions } from "../../redux/actions/Inventario/RegistrarInventario/datosRegistroInventarioActions";
import { Helmet } from "react-helmet-async";


// export interface InventarioCompleto {
//   aF_CLAVE: string;
//   aF_CODIGO_GENERICO: string;
//   aF_CODIGO_LARGO: string;
//   deP_CORR: number;
//   esP_CODIGO: string;
//   aF_SECUENCIA: number;
//   itE_CLAVE: number;
//   aF_DESCRIPCION: string;
//   aF_FINGRESO: string;
//   aF_ESTADO: string;
//   aF_CODIGO: string;
//   aF_TIPO: string;
//   aF_ALTA: string;
//   aF_PRECIO_REF: number;
//   aF_CANTIDAD: number;
//   aF_ORIGEN: number;
//   aF_RESOLUCION: string;
//   aF_FECHA_SOLICITUD: string;
//   aF_OCO_NUMERO_REF: number;
//   usuariO_CREA: string;
//   f_CREA: string;
//   iP_CREA: string;
//   usuariO_MOD: string;
//   f_MOD: string;
//   iP_MOlabel: string;
//   aF_TIPO_DOC: number;
//   proV_RUN: number;
//   reG_EQM: string;
//   aF_NUM_FAC: string;
//   aF_FECHAFAC: string;
//   aF_3UTM: string;
//   iD_GRUPO: number;
//   ctA_COD: string;
//   transitoria: string;
//   aF_MONTOFACTURA: number;
//   esP_DESCOMPONE: string;
//   aF_ETIQUETA: string;
//   aF_VIDAUTIL: number;
//   aF_VIGENTE: string;
//   idprograma: number;
//   idmodalidadcompra: number;
//   idpropiedad: number;
//   especie: string;
//   deT_MARCA: string;
//   deT_MODELO: string;
//   deT_SERIE: string;
//   deT_LOTE: string;
//   deT_OBS: string;
//   iP_MOD: string;
//   deT_PRECIO: number;
//   deT_RECEPCION: number;
//   propietario: number;
//   tipopropietario: number;
// }

export interface InventarioCompleto {
  aF_CLAVE: string; // nRecepcion
  aF_FECHA_SOLICITUD: string; // fechaRecepcion 
  aF_OCO_NUMERO_REF: number // nOrdenCompra
  aF_NUM_FAC: string; // nFactura
  aF_ORIGEN: number;  //origenPresupuesto
  aF_MONTOFACTURA: number; //montoRecepcion
  aF_FECHAFAC: string; //fechaFactura
  proV_RUN: number; // rutProveedor
  idprograma: number; //servicio
  deP_CORR: number; //dependencia
  idmodalidadcompra: number; // modalidadDeCompra
  especie: string; //especie
  ctA_COD: string;
  //-------Tabla---------//
  aF_VIDAUTIL: number;
  aF_FINGRESO: string;
  deT_MARCA: string;
  deT_MODELO: string;
  deT_SERIE: string;
  deT_PRECIO: number;
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
  comboProveedor: PROVEEDOR[];

  comboDependenciaActions: (comboServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
  obtenerInventarioActions: (aF_CLAVE: string) => Promise<boolean>;
  comboDetalleActions: (bienSeleccionado: string) => void;
  comboListadoDeEspeciesBienActions: (EST: number, IDBIEN: string) => Promise<void>;
  comboCuentaActions: (nombreEspecie: string) => void;
  comboProveedorActions: (rutProveedor: string) => void;
  modificarFormInventarioActions: (formInventario: Record<string, any>) => Promise<Boolean>;
  descripcionEspecie: string; // se utiliza solo para guardar la descripcion completa en el input de especie
  isDarkMode: boolean;
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
  aF_CLAVE, // nRecepcion
  aF_FECHA_SOLICITUD,// fechaRecepcion 
  aF_OCO_NUMERO_REF, // nOrdenCompra
  aF_NUM_FAC,// nFactura
  aF_ORIGEN, //origenPresupuesto
  aF_MONTOFACTURA, //montoRecepcion
  aF_FECHAFAC, //fechaFactura
  proV_RUN, // rutProveedor
  idprograma, //servicio
  deP_CORR, //dependencia
  idmodalidadcompra, // modalidadDeCompra
  especie,// descripcion especie
  ctA_COD,
  //-------Tabla---------//
  aF_VIDAUTIL,
  aF_FINGRESO,
  deT_MARCA,
  deT_MODELO,
  deT_SERIE,
  deT_PRECIO,
  isDarkMode,
  comboDependenciaActions,
  obtenerInventarioActions,
  comboDetalleActions,
  comboListadoDeEspeciesBienActions,
  comboCuentaActions,
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
  // Asegúrate de que el array tiene datos
  //-------------------------Formulario---------------------------//
  // Campos principales
  // const fechaFactura = datosInventarioCompleto[index]?.aF_FECHAFAC
  //   ? new Date(datosInventarioCompleto[index]?.aF_FECHAFAC)
  //     .toISOString()
  //     .split("T")[0]
  //   : "";
  // const fechaRecepcion = datosInventarioCompleto[index]?.aF_FINGRESO
  //   ? new Date(datosInventarioCompleto[index]?.aF_FINGRESO)
  //     .toISOString()
  //     .split("T")[0]
  //   : "";
  // const modalidadDeCompra = datosInventarioCompleto[index]?.idmodalidadcompra || 0;
  // const montoRecepcion = datosInventarioCompleto[index]?.aF_MONTOFACTURA || 0;
  // const nFactura = datosInventarioCompleto[index]?.aF_NUM_FAC || "";
  // const nOrdenCompra = datosInventarioCompleto[index]?.aF_MONTOFACTURA || 0; //falta
  // const nRecepcion = datosInventarioCompleto[index]?.aF_CLAVE || "";
  // const nombreProveedor = datosInventarioCompleto[index]?.aF_NUM_FAC || "";
  // const origenPresupuesto = datosInventarioCompleto[index]?.aF_ORIGEN || 0;
  // const rutProveedor = datosInventarioCompleto[index]?.proV_RUN || 0; //falta
  // const dependencia = datosInventarioCompleto[index]?.deP_CORR || 0;
  // const servicio = datosInventarioCompleto[index]?.aF_ORIGEN || 0; //falta
  // const cuenta = datosInventarioCompleto[index]?.aF_ORIGEN || 0; //falta

  // Tabla
  // const vidaUtil = datosInventarioCompleto[index]?.aF_VIDAUTIL || 0;
  // const marca = datosInventarioCompleto[index]?.deT_MARCA || "";
  // const modelo = datosInventarioCompleto[index]?.deT_MODELO || "";
  // const serie = datosInventarioCompleto[index]?.deT_SERIE || "";
  // const precio = datosInventarioCompleto[index]?.deT_PRECIO || 0;
  // const especie = datosInventarioCompleto[index]?.esP_CODIGO || "";

  const parseFecha = (fecha: string) => {
    const [fechaPart,] = fecha.split(" "); // Tomamos solo la parte de la fecha
    const [dia, mes, año] = fechaPart.split("/").map(Number);
    return new Date(año, mes - 1, dia); // Meses en JS van de 0 a 11
  };

  const fechaRecepcion = aF_FECHA_SOLICITUD && /^\d{4}-\d{2}-\d{2}$/.test(aF_FECHA_SOLICITUD)
    ? parseFecha(`${aF_FECHA_SOLICITUD}T00:00:00`).toISOString().split("T")[0]
    : "";
  const fechaFactura = aF_FECHAFAC && /^\d{4}-\d{2}-\d{2}$/.test(aF_FECHAFAC)
    ? parseFecha(`${aF_FECHAFAC}T00:00:00`).toISOString().split("T")[0]
    : "";
  const fechaIngreso = aF_FINGRESO && /^\d{4}-\d{2}-\d{2}$/.test(aF_FINGRESO)
    ? parseFecha(`${aF_FINGRESO}T00:00:00`).toISOString().split("T")[0]
    : "";

  const [Inventario, setInventario] = useState({
    aF_CLAVE: "", // nRecepcion
    fechaRecepcion, // fechaRecepcion 
    aF_OCO_NUMERO_REF: 0, // nOrdenCompra
    aF_NUM_FAC: "",// nFactura
    aF_ORIGEN: 0,  //origenPresupuesto
    aF_MONTOFACTURA: 0, //montoRecepcion
    fechaFactura: "", //fechaFactura
    proV_RUN: 0, // rutProveedor
    idprograma: 0, //servicio
    deP_CORR: 0, //dependencia
    idmodalidadcompra: 0, // modalidadDeCompra
    especie: "", //especie
    ctA_COD: "",
    //-------Tabla---------//
    aF_VIDAUTIL: 0,
    fechaIngreso: "",
    deT_MARCA: "",
    deT_MODELO: "",
    deT_SERIE: "",
    deT_PRECIO: 0,
  });
  const [Especies, setEspecies] = useState({
    estableEspecie: 0,
    codigoEspecie: "",
    nombreEspecie: "",
    descripcionEspecie: "",
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.aF_CLAVE)
      tempErrors.aF_CLAVE = "El N° de Recepción es obligatorio.";
    if (!Inventario.fechaRecepcion)
      tempErrors.aF_FECHA_SOLICITUD = "La Fecha de Recepción es obligatoria.";
    if (!Inventario.aF_OCO_NUMERO_REF || Inventario.aF_OCO_NUMERO_REF == 0)
      tempErrors.aF_OCO_NUMERO_REF = "El N° de Orden de Compra es obligatorio.";
    else if (isNaN(Inventario.aF_OCO_NUMERO_REF))
      tempErrors.aF_OCO_NUMERO_REF = "El N° de Orden de Compra debe ser numérico.";
    if (!Inventario.aF_NUM_FAC || Inventario.aF_NUM_FAC == "0")
      tempErrors.aF_NUM_FAC = "El N° de Factura es obligatorio.";
    if (!Inventario.aF_ORIGEN)
      tempErrors.aF_ORIGEN = "El Origen de Presupuesto es obligatorio.";
    if (!Inventario.aF_MONTOFACTURA || Inventario.aF_MONTOFACTURA == 0)
      tempErrors.aF_MONTOFACTURA = "El Monto de Recepción es obligatorio.";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.aF_MONTOFACTURA)))
      tempErrors.aF_MONTOFACTURA =
        "El Monto debe ser un número válido con hasta dos decimales.";
    if (!Inventario.fechaFactura)
      tempErrors.aF_FECHAFAC = "La Fecha de Factura es obligatoria.";
    if (!Inventario.proV_RUN || Inventario.proV_RUN === 0)
      tempErrors.proV_RUN = "El Proveedor es obligatorio.";
    if (!Inventario.idmodalidadcompra)
      tempErrors.idmodalidadcompra = "La Modalidad de Compra es obligatoria.";
    if (!Inventario.idprograma)
      tempErrors.idprograma = "EL Servicio es obligatoria.";
    if (!Inventario.deP_CORR)
      tempErrors.deP_CORR = "La Dependencia es obligatoria.";
    if (!Inventario.ctA_COD || Inventario.ctA_COD === "")
      tempErrors.ctA_COD = "La Cuenta es obligatoria.";
    if (!Inventario.especie) tempErrors.especie = "La Especie es obligatoria.";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  //Hook que muestra los valores al input, Sincroniza el estado local con Redux
  useEffect(() => {
    setInventario({
      aF_CLAVE, // nRecepcion
      fechaRecepcion,// fechaRecepcion 
      aF_OCO_NUMERO_REF, // nOrdenCompra
      aF_NUM_FAC,// nFactura
      aF_ORIGEN, //origenPresupuesto
      aF_MONTOFACTURA, //montoRecepcion
      fechaFactura, //fechaFactura
      proV_RUN, // rutProveedor
      idprograma, //servicio
      deP_CORR, //dependencia
      idmodalidadcompra, // modalidadDeCompra
      especie,//especie
      ctA_COD,
      //-------Tabla---------//
      aF_VIDAUTIL,
      fechaIngreso,
      deT_MARCA,
      deT_MODELO,
      deT_SERIE,
      deT_PRECIO

    });
    //Se usa useEffect en este caso de Especie ya que por handleChange no detecta el cambio
    // debido que este se pasa por una seleccion desde el modal en la selccion que se hace desde el listado
    if (Especies.codigoEspecie) {
      comboCuentaActions(Especies.codigoEspecie); // aqui le paso codigo de detalle
      // console.log("Código de especie seleccionado:", Especies.codigoEspecie);
    }
  }, [
    aF_CLAVE, // nRecepcion
    fechaRecepcion,//fechaRecepcion 
    aF_OCO_NUMERO_REF, //nOrdenCompra
    aF_NUM_FAC, //nFactura
    aF_ORIGEN, //origenPresupuesto
    aF_MONTOFACTURA, //montoRecepcion
    fechaFactura, //fechaFactura
    proV_RUN, // rutProveedor
    idprograma, //servicio
    deP_CORR, //dependencia
    idmodalidadcompra, // modalidadDeCompra
    especie,//especie
    ctA_COD, //cuenta
    //-------Tabla---------//
    aF_VIDAUTIL,
    fechaIngreso,
    deT_MARCA,
    deT_MODELO,
    deT_SERIE,
    deT_PRECIO,
    Especies.codigoEspecie,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = [
      "idmodalidadcompra", //modalidadDeCompra
      "aF_MONTOFACTURA",//montoRecepcion
      "aF_NUM_FAC", //nFactura
      "aF_OCO_NUMERO_REF", //nOrdenCompra
      "aF_ORIGEN", //origenPresupuesto
      "proV_RUN", //rutProveedor
      "deP_CORR", //dependencia
      "idprograma", //servicio
      "ctA_COD", //cuenta
      "aF_VIDAUTIL", //vidaUtil
      "deT_PRECIO" //precio

    ].includes(name)

      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;
    setInventario((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    if (name === "idprograma") { //servicio
      comboDependenciaActions(value);
    }
    if (comboBien.length === 0) comboDetalleActions("0");

    if (name === "bien") {
      comboDetalleActions(value);
    }
    if (name === "detalles") {
      comboListadoDeEspeciesBienActions(1, value);
    }
    if (name === "proV_RUN") { //rutProveedor
      comboProveedorActions(value);
    }
    if (name === "idmodalidadcompra") { //modalidadDeCompra
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
  };

  const handleEdit = () => {
    setInventario((prevInventario) => ({
      ...prevInventario,
      aF_CLAVE: "", // nRecepcion
      fechaRecepcion, // fechaRecepcion 
      aF_OCO_NUMERO_REF: 0, // nOrdenCompra
      aF_NUM_FAC: "",// nFactura
      aF_ORIGEN: 0,  //origenPresupuesto
      aF_MONTOFACTURA: 0, //montoRecepcion
      fechaFactura: "", //fechaFactura
      proV_RUN: 0, // rutProveedor
      idprograma: 0, //servicio
      deP_CORR: 0, //dependencia
      idmodalidadcompra: 0, // modalidadDeCompra
      especie: "", //especie
      ctA_COD: "",
      //-------Tabla---------//
      aF_VIDAUTIL: 0,
      fechaIngreso: "",
      deT_MARCA: "",
      deT_MODELO: "",
      deT_SERIE: "",
      deT_PRECIO: 0,
    }));
    setIsDisabled(true);
    setIsDisabledNRecepcion(false);
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
      setInventario((inventarioPrevia) => ({
        ...inventarioPrevia,
        especie: codigoEspecie.toString(), // Actualiza el campo 'especie' en el estado de 'Inventario'
      }));
      // Resetea el estado de las filas seleccionadas para desmarcar el checkbox
      setFilasSeleccionadas([]);

      setMostrarModal(false); // Cierra el modal
    } else {
      // console.log("No se ha seleccionado ningún elemento.");
    }
  };
  //Selecciona fila del listado de especies
  const handleSeleccionFila = (index: number) => {
    const item = listaEspecie[index];
    setFilasSeleccionadas([index.toString()]);
    setElementoSeleccionado(item);
    // console.log("Elemento seleccionado", item);
  };
  const handleInventarioSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    let resultado = false;
    e.preventDefault();
    setLoading(true); // Inicia el estado de carga
    if (!Inventario.aF_CLAVE || Inventario.aF_CLAVE === "") {
      Swal.fire({
        icon: "warning",
        title: "Por favor, ingrese un número de inventario",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      setLoading(false); //Finaliza estado de carga
      return;
    }
    resultado = await obtenerInventarioActions(Inventario.aF_CLAVE);
    if (!resultado) {
      Swal.fire({
        icon: "error",
        title: ":'(",
        text: "No se encontraron resultados, inténte otro registro.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      setIsDisabled(true);
      setIsDisabledNRecepcion(false);
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      setIsDisabled(false);
      setIsDisabledNRecepcion(true);
      setLoading(false); //Finaliza estado de carga
    }
  };
  const handleValidar = () => {
    console.log("campos", JSON.stringify(Inventario, null, 2));
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
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "Inventario Modificado",
            text: "Se ha modificado correctamente",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
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
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      setInventario((inventarioPrevia) => ({
        ...inventarioPrevia,
        aF_CLAVE: "", // nRecepcion
        fechaRecepcion, // fechaRecepcion 
        aF_OCO_NUMERO_REF: 0, // nOrdenCompra
        aF_NUM_FAC: "",// nFactura
        aF_ORIGEN: 0,  //origenPresupuesto
        aF_MONTOFACTURA: 0, //montoRecepcion
        fechaFactura: "", //fechaFactura
        proV_RUN: 0, // rutProveedor
        idprograma: 0, //servicio
        deP_CORR: 0, //dependencia
        idmodalidadcompra: 0, // modalidadDeCompra
        especie: "", //especie
        ctA_COD: "",
        //-------Tabla---------//
        aF_VIDAUTIL: 0,
        fechaIngreso: "",
        deT_MARCA: "",
        deT_MODELO: "",
        deT_SERIE: "",
        deT_PRECIO: 0,
      }));

    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el registro.",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
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
  // const totalPaginas = Array.isArray(listaEspecie) ? Math.ceil(listaEspecie.length / elementosPorPagina) : 0;
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
                    aria-label="aF_CLAVE"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.aF_CLAVE ? "is-invalid" : ""}`}
                    maxLength={12}
                    name="aF_CLAVE"
                    onChange={handleChange}
                    value={Inventario.aF_CLAVE}
                    disabled={isDisabledNRecepcion}
                  />
                  <Button
                    onClick={handleInventarioSubmit}
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
                </div>
                {error.aF_CLAVE && (<div className="invalid-feedback fw-semibold d-block">{error.aF_CLAVE}
                </div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Fecha Recepción
                </label>
                <input
                  aria-label="fechaRecepcion"
                  type="date"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.aF_FECHA_SOLICITUD ? "is-invalid" : ""}`}
                  name="fechaRecepcion"
                  onChange={handleChange}
                  value={Inventario.fechaRecepcion}
                  disabled={isDisabled}
                />
                {error.aF_FECHA_SOLICITUD && (
                  <div className="invalid-feedback fw-semibold">{error.aF_FECHA_SOLICITUD}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  N° Orden de compra
                </label>
                <input
                  aria-label="aF_OCO_NUMERO_REF"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.aF_OCO_NUMERO_REF ? "is-invalid" : ""}`}
                  maxLength={12}
                  name="aF_OCO_NUMERO_REF"
                  onChange={handleChange}
                  value={Inventario.aF_OCO_NUMERO_REF}
                  disabled={isDisabled}
                />
                {error.aF_OCO_NUMERO_REF && (
                  <div className="invalid-feedback fw-semibold">{error.aF_OCO_NUMERO_REF}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Nº factura
                </label>
                <input
                  aria-label="aF_NUM_FAC"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.aF_NUM_FAC ? "is-invalid" : ""}`}
                  maxLength={12}
                  name="aF_NUM_FAC"
                  onChange={handleChange}
                  value={Inventario.aF_NUM_FAC}
                  disabled={isDisabled}
                />
                {error.aF_NUM_FAC && (
                  <div className="invalid-feedback fw-semibold">{error.aF_NUM_FAC}</div>
                )}
              </div>

            </Col>
            <Col md={3}>
              <div className="mb-1">
                <label className="fw-semibold">
                  Origen Presupuesto</label>
                <select
                  aria-label="aF_ORIGEN"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.aF_ORIGEN ? "is-invalid" : ""}`}
                  name="aF_ORIGEN"
                  onChange={handleChange}
                  value={Inventario.aF_ORIGEN}
                  disabled={isDisabled}
                >
                  <option value="">Seleccione un origen</option>
                  {comboOrigen.map((traeOrigen) => (
                    <option key={traeOrigen.codigo} value={traeOrigen.codigo}>
                      {traeOrigen.descripcion}
                    </option>
                  ))}
                </select>
                {error.aF_ORIGEN && (<div className="invalid-feedback fw-semibold">{error.aF_ORIGEN}
                </div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Monto Recepción
                </label>
                <input
                  aria-label="aF_MONTOFACTURA"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.aF_MONTOFACTURA ? "is-invalid" : ""}`}
                  maxLength={12}
                  name="aF_MONTOFACTURA"
                  onChange={handleChange}
                  value={Inventario.aF_MONTOFACTURA}
                  disabled={isDisabled}
                />
                {error.aF_MONTOFACTURA && (
                  <div className="invalid-feedback fw-semibold">{error.aF_MONTOFACTURA}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Fecha Factura</label>
                <input
                  aria-label="fechaFactura"
                  type="date"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.aF_FECHAFAC ? "is-invalid" : ""}`}
                  name="fechaFactura"
                  onChange={handleChange}
                  value={Inventario.fechaFactura}
                  disabled={isDisabled}
                />
                {error.aF_FECHAFAC && (
                  <div className="invalid-feedback fw-semibold">{error.aF_FECHAFAC}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Proveedor</label>
                <select
                  aria-label="proV_RUN"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.proV_RUN ? "is-invalid" : ""}`}
                  name="proV_RUN"
                  onChange={handleChange}
                  value={Inventario.proV_RUN}
                  disabled={isDisabled}
                >
                  <option value="0">Seleccione un Proveedor</option>
                  {comboProveedor.map((traeProveedor) => (
                    <option key={traeProveedor.rut} value={traeProveedor.rut}>
                      {traeProveedor.nomprov}
                    </option>
                  ))}
                </select>
                {error.proV_RUN && (<div className="invalid-feedback fw-semibold d-block">{error.proV_RUN}
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
                  aria-label="idprograma"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.idprograma ? "is-invalid" : ""}`}
                  name="idprograma"
                  onChange={handleChange}
                  value={Inventario.idprograma}
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
                {error.idprograma && (
                  <div className="invalid-feedback fw-semibold">{error.idprograma}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Dependencia
                </label>
                <select
                  aria-label="deP_CORR"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.deP_CORR ? "is-invalid" : ""}`}
                  name="deP_CORR"
                  onChange={handleChange}
                  value={Inventario.deP_CORR}
                  disabled={isDisabled ? isDisabled : !Inventario.idprograma}
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
                {error.deP_CORR && (
                  <div className="invalid-feedback fw-semibold">{error.deP_CORR}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Modalidad de Compra
                </label>
                <select
                  aria-label="idmodalidadcompra"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.idmodalidadcompra ? "is-invalid" : ""}`}
                  name="idmodalidadcompra"
                  onChange={handleChange}
                  value={Inventario.idmodalidadcompra}
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
                {error.idmodalidadcompra && (<div className="invalid-feedback fw-semibold">{error.idmodalidadcompra}
                </div>
                )}
              </div>
              {showInput && (
                <div className="mb-1">
                  {/* <label className="fw-semibold">
                    Modalidad de Compra
                  </label> */}
                  <input
                    aria-label="idmodalidadcompra"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-secondary text-light border-secondary" : ""} ${error.idmodalidadcompra ? "is-invalid" : ""}`}
                    name="idmodalidadcompra"
                    placeholder="Especifique otro"
                    onChange={(e) =>
                      setInventario({
                        ...Inventario,
                        idmodalidadcompra: parseInt(e.target.value),
                      })
                    }
                  />
                  {error.idmodalidadcompra && (
                    <div className="invalid-feedback fw-semibold">
                      {error.idmodalidadcompra}
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
                    value={Especies.codigoEspecie || Inventario.especie ||
                      "Haz clic en más para seleccionar una especie"
                    }
                    onChange={handleChange}
                    disabled
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.especie ? "is-invalid" : ""}`}
                  />
                  {/* Botón para abrir el modal y seleccionar una especie */}
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
                {error.especie && (
                  <div className="invalid-feedback fw-semibold d-block">
                    {error.especie}
                  </div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Cuenta</label>
                <select
                  aria-label="ctA_COD"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.ctA_COD ? "is-invalid" : ""}`}
                  name="ctA_COD"
                  onChange={handleChange}
                  value={Inventario.ctA_COD}
                // disabled={isDisabled ? isDisabled : !Especies.codigoEspecie}
                >
                  <option value="">Selecciona una opción</option>
                  {comboCuenta.map((traeCuentas) => (
                    <option key={traeCuentas.codigo} value={traeCuentas.codigo}>
                      {traeCuentas.descripcion}
                    </option>
                  ))}
                </select>
                {error.ctA_COD && (
                  <div className="invalid-feedback fw-semibold">{error.ctA_COD}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">
                  Activos fijos</label>
                <div className="d-flex align-items-center">
                  <p className="text-right w-100 border p-2 m-0 rounded">
                    Detalles activos fijos
                  </p>
                  {/* Botón para abrir el modal y seleccionar una especie */}
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
      {/* Modal especies*/}
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
                {/* <div className="mb-1">
                  <div className="d-flex align-items-center">
                    <input type="text" name="" className="form-control" />
                    <Button variant="primary">Buscar</Button>
                  </div>
                </div> */}
              </Col>
            </Row>
          </form>

          {/* Tabla*/}
          <table className={`table  ${isDarkMode ? "table-dark" : "table-hover "}`} >
            <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
              <tr>
                <th></th>
                <th>Establecimiento</th>
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
                  <td>{listadoEspecies.estabL_CORR}</td>
                  <td>{listadoEspecies.esP_CODIGO}</td>
                  <td>{listadoEspecies.nombrE_ESP}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
            Detalles activo fijo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <div className="shadow-sm">
            <div className="overflow-auto">
              <table className={`table  ${isDarkMode ? "table-dark" : "table-hover "}`} >
                <thead className={`sticky-top ${isDarkMode ? "table-" : "text-dark table-light "}`}>
                  <tr>
                    <th>
                      Vida Útil
                    </th>
                    <th>
                      Fecha Ingreso
                    </th>
                    <th>
                      Marca
                    </th>
                    <th>
                      Modelo
                    </th>
                    <th>
                      Serie
                    </th>
                    <th>
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{aF_VIDAUTIL}</td>
                    <td>{fechaIngreso}</td>
                    <td>{deT_MARCA}</td>
                    <td>{deT_MODELO}</td>
                    <td className={`d-flex align-items-center p-1  ${isDarkMode ? "text-light" : "text-dark"}`}>
                      <input
                        aria-label="deT_SERIE"
                        type="text"
                        name="deT_SERIE"
                        className={` form-control border border-0 rounded-0  ${isDarkMode ? "bg-secondary text-white" : ""}`}
                        value={Inventario.deT_SERIE}
                        onChange={(e) => handleChange(e)}
                      />
                      <Pencil
                        className={classNames("flex-shrink-0", "h-5 w-5 m-1")}
                        aria-hidden="true"
                      />
                    </td>
                    <td>
                      {deT_PRECIO.toLocaleString("es-ES", {
                        minimumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
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
  comboCuenta: state.comboCuentaReducer.comboCuenta,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  comboDetalle: state.detallesReducer.comboDetalle,
  comboBien: state.detallesReducer.comboBien,
  comboProveedor: state.comboProveedorReducers.comboProveedor,
  listaEspecie: state.comboListadoDeEspeciesBien.listadoDeEspecies,
  descripcionEspecie: state.datosActivoFijoReducers.descripcionEspecie,
  isDarkMode: state.darkModeReducer.isDarkMode,
  aF_CLAVE: state.obtenerInventarioReducers.aF_CLAVE,// nRecepcion
  aF_FECHA_SOLICITUD: state.obtenerInventarioReducers.aF_FECHA_SOLICITUD,// fechaRecepcion 
  aF_OCO_NUMERO_REF: state.obtenerInventarioReducers.aF_OCO_NUMERO_REF, // nOrdenCompra
  aF_NUM_FAC: state.obtenerInventarioReducers.aF_NUM_FAC,// nFactura
  aF_ORIGEN: state.obtenerInventarioReducers.aF_ORIGEN, //origenPresupuesto
  aF_MONTOFACTURA: state.obtenerInventarioReducers.aF_MONTOFACTURA, //montoRecepcion
  aF_FECHAFAC: state.obtenerInventarioReducers.aF_FECHAFAC, //fechaFactura
  proV_RUN: state.obtenerInventarioReducers.proV_RUN, // rutProveedor
  idprograma: state.obtenerInventarioReducers.idprograma, //servicio
  deP_CORR: state.obtenerInventarioReducers.deP_CORR, //dependencia
  idmodalidadcompra: state.obtenerInventarioReducers.idmodalidadcompra, // modalidadDeCompra
  especie: state.obtenerInventarioReducers.especie,//especie
  ctA_COD: state.obtenerInventarioReducers.ctA_COD,
  //-------Tabla---------//
  aF_VIDAUTIL: state.obtenerInventarioReducers.aF_VIDAUTIL,
  aF_FINGRESO: state.obtenerInventarioReducers.aF_FINGRESO,
  deT_MARCA: state.obtenerInventarioReducers.deT_MARCA,
  deT_MODELO: state.obtenerInventarioReducers.deT_MODELO,
  deT_SERIE: state.obtenerInventarioReducers.deT_SERIE,
  deT_PRECIO: state.obtenerInventarioReducers.deT_PRECIO,
});

export default connect(mapStateToProps, {
  obtenerInventarioActions,
  comboDependenciaActions,
  comboDetalleActions,
  comboListadoDeEspeciesBienActions,
  comboCuentaActions,
  comboProveedorActions,
  modificarFormInventarioActions,

})(ModificarInventario);
