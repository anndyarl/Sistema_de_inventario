import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Table, Form, Row, Col, Modal, Pagination, Spinner, } from "react-bootstrap";
import { RootState } from "../../store";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import { obtenerInventarioActions } from "../../redux/actions/Inventario/ModificarInventario/obtenerInventarioActions";
import { InventarioProps, MODALIDAD, ORIGEN, PROVEEDOR, } from "./RegistrarInventario/Datos_inventario";
import { BIEN, CUENTA, CuentaProps, DEPENDENCIA, DETALLE, ListaEspecie, SERVICIO, } from "./RegistrarInventario/Datos_cuenta";

import Swal from "sweetalert2";
import { Check2Circle, Eye, Pencil, Search } from "react-bootstrap-icons";
import { modificarFormInventarioActions } from "../../redux/actions/Inventario/ModificarInventario/modificarFormInventarioActions";
import { comboDependenciaActions } from "../../redux/actions/Inventario/Combos/comboDependenciaActions";
import { comboDetalleActions } from "../../redux/actions/Inventario/Combos/comboDetalleActions";
import { comboListadoDeEspeciesBienActions } from "../../redux/actions/Inventario/Combos/comboListadoDeEspeciesBienActions";
import { comboCuentaActions } from "../../redux/actions/Inventario/Combos/comboCuentaActions";
import { comboProveedorActions } from "../../redux/actions/Inventario/Combos/comboProveedorActions";
import MenuInventario from "../Menus/MenuInventario";


export interface InventarioCompleto {
  aF_CLAVE: string;
  aF_CODIGO_GENERICO: string;
  aF_CODIGO_LARGO: string;
  deP_CORR: number;
  esP_CODIGO: string;
  aF_SECUENCIA: number;
  itE_CLAVE: number;
  aF_DESCRIPCION: string;
  aF_FINGRESO: string;
  aF_ESTADO: string;
  aF_CODIGO: string;
  aF_TIPO: string;
  aF_ALTA: string;
  aF_PRECIO_REF: number;
  aF_CANTIDAD: number;
  aF_ORIGEN: number;
  aF_RESOLUCION: string;
  aF_FECHA_SOLICITUD: string;
  aF_OCO_NUMERO_REF: string;
  usuariO_CREA: string;
  f_CREA: string;
  iP_CREA: string;
  usuariO_MOD: string;
  f_MOD: string;
  iP_MOlabel: string;
  aF_TIPO_DOC: number;
  proV_RUN: number;
  reG_EQM: string;
  aF_NUM_FAC: string;
  aF_FECHAFAC: string;
  aF_3UTM: string;
  iD_GRUPO: number;
  ctA_COD: string;
  transitoria: string;
  aF_MONTOFACTURA: number;
  esP_DESCOMPONE: string;
  aF_ETIQUETA: string;
  aF_VIDAUTIL: number;
  aF_VIGENTE: string;
  idprograma: number;
  idmodalidadcompra: number;
  idpropiedad: number;
  especie: string;
  deT_MARCA: string;
  deT_MODELO: string;
  deT_SERIE: string;
  deT_LOTE: string;
  deT_OBS: string;
  iP_MOD: string;
  deT_PRECIO: number;
  deT_RECEPCION: number;
  propietario: number;
  tipopropietario: number;
}
interface InventarioCompletoProps {
  datosInventarioCompleto: InventarioCompleto[];
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
  comboListadoDeEspeciesBienActions: (
    EST: number,
    IDBIEN: string
  ) => Promise<void>;
  comboCuentaActions: (nombreEspecie: string) => void;
  modificarFormInventarioActions: (
    formInventario: Record<string, any>
  ) => Promise<Boolean>;
  descripcionEspecie: string; // se utiliza solo para guardar la descripcion completa en el input de especie
}

const ModificarInventario: React.FC<InventarioCompletoProps> = ({
  datosInventarioCompleto,
  comboOrigen,
  comboModalidad,
  comboServicio,
  comboDependencia,
  comboCuenta,
  comboBien,
  comboDetalle,
  comboProveedor,
  listaEspecie,
  descripcionEspecie,
  comboDependenciaActions,
  obtenerInventarioActions,
  comboDetalleActions,
  comboListadoDeEspeciesBienActions,
  comboCuentaActions,
  modificarFormInventarioActions,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalLista, setMostrarModalLista] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [elementoSeleccionado, setElementoSeleccionado] =
    useState<ListaEspecie>();
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 50;
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledNRecepcion, setIsDisabledNRecepcion] = useState(false);
  const [error, setError] = useState<Partial<InventarioProps> & Partial<CuentaProps> & {}>({});
  const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
  };
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  // Asegúrate de que el array tiene datos
  const index = 0; // Cambia esto al índice que desees
  //-------------------------Formulario---------------------------//
  // Campos principales
  const fechaFactura = datosInventarioCompleto[index]?.aF_FECHAFAC
    ? new Date(datosInventarioCompleto[index]?.aF_FECHAFAC)
      .toISOString()
      .split("T")[0]
    : "";

  const fechaRecepcion = datosInventarioCompleto[index]?.aF_FINGRESO
    ? new Date(datosInventarioCompleto[index]?.aF_FINGRESO)
      .toISOString()
      .split("T")[0]
    : "";
  const modalidadDeCompra =
    datosInventarioCompleto[index]?.idmodalidadcompra || 0;
  const montoRecepcion = datosInventarioCompleto[index]?.aF_MONTOFACTURA || 0;
  const nFactura = datosInventarioCompleto[index]?.aF_NUM_FAC || "";
  const nOrdenCompra = datosInventarioCompleto[index]?.aF_MONTOFACTURA || 0; //falta
  const nRecepcion = datosInventarioCompleto[index]?.aF_CLAVE || "";
  const nombreProveedor = datosInventarioCompleto[index]?.aF_NUM_FAC || "";
  const origenPresupuesto = datosInventarioCompleto[index]?.aF_ORIGEN || 0;
  const rutProveedor = datosInventarioCompleto[index]?.proV_RUN || 0; //falta
  const dependencia = datosInventarioCompleto[index]?.deP_CORR || 0;
  const servicio = datosInventarioCompleto[index]?.aF_ORIGEN || 0; //falta
  const cuenta = datosInventarioCompleto[index]?.aF_ORIGEN || 0; //falta

  // Tabla
  const vidaUtil = datosInventarioCompleto[index]?.aF_VIDAUTIL || 0;
  const marca = datosInventarioCompleto[index]?.deT_MARCA || "";
  const modelo = datosInventarioCompleto[index]?.deT_MODELO || "";
  const serie = datosInventarioCompleto[index]?.deT_SERIE || "";
  const precio = datosInventarioCompleto[index]?.deT_PRECIO || 0;
  const especie = datosInventarioCompleto[index]?.esP_CODIGO || "";

  const [Inventario, setInventario] = useState({
    fechaFactura: "",
    fechaRecepcion: "",
    modalidadDeCompra: 0,
    montoRecepcion: 0,
    nFactura: "",
    nOrdenCompra: 0,
    nRecepcion: "",
    nombreProveedor: "",
    origenPresupuesto: 0,
    rutProveedor: 0,
    dependencia: 0,
    servicio: 0,
    cuenta: 0,
    vidaUtil: 0,
    marca: "",
    modelo: "",
    serie: "",
    precio: 0,
    especie: "",
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
    if (!Inventario.nRecepcion)
      tempErrors.nRecepcion = "El N° de Recepción es obligatorio.";
    if (!Inventario.fechaRecepcion)
      tempErrors.fechaRecepcion = "La Fecha de Recepción es obligatoria.";
    if (!Inventario.nOrdenCompra)
      tempErrors.nOrdenCompra = "El N° de Orden de Compra es obligatorio.";
    else if (isNaN(Inventario.nOrdenCompra))
      tempErrors.nOrdenCompra = "El N° de Orden de Compra debe ser numérico.";
    if (!Inventario.nFactura || Inventario.nFactura === "0")
      tempErrors.nFactura = "El N° de Factura es obligatorio.";
    if (!Inventario.origenPresupuesto)
      tempErrors.origenPresupuesto = "El Origen de Presupuesto es obligatorio.";
    if (!Inventario.montoRecepcion || Inventario.montoRecepcion === 0)
      tempErrors.montoRecepcion = "El Monto de Recepción es obligatorio.";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.montoRecepcion)))
      tempErrors.montoRecepcion =
        "El Monto debe ser un número válido con hasta dos decimales.";
    if (!Inventario.fechaFactura)
      tempErrors.fechaFactura = "La Fecha de Factura es obligatoria.";
    if (!Inventario.rutProveedor || Inventario.rutProveedor === 0)
      tempErrors.rutProveedor = "El Proveedor es obligatorio.";

    if (!Inventario.modalidadDeCompra)
      tempErrors.modalidadDeCompra = "La Modalidad de Compra es obligatoria.";
    if (!Inventario.servicio)
      tempErrors.servicio = "EL Servicio es obligatoria.";
    if (!Inventario.dependencia)
      tempErrors.dependencia = "La Dependencia es obligatoria.";
    if (!Inventario.cuenta || Inventario.cuenta === 0)
      tempErrors.cuenta = "La Cuenta es obligatoria.";
    // if (!Inventario.especie) tempErrors.especie = "La Especie es obligatoria.";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  //Hook que muestra los valores al input, Sincroniza el estado local con Redux
  useEffect(() => {

    setInventario({
      fechaFactura,
      fechaRecepcion,
      modalidadDeCompra,
      montoRecepcion,
      nFactura,
      nOrdenCompra,
      nRecepcion,
      nombreProveedor,
      origenPresupuesto,
      rutProveedor,
      dependencia,
      servicio,
      cuenta,
      vidaUtil,
      marca,
      modelo,
      serie,
      precio,
      especie,

    });
    //Se usa useEffect en este caso de Especie ya que por handleChange no detecta el cambio
    // debido que este se pasa por una seleccion desde el modal en la selccion que se hace desde el listado
    if (Especies.codigoEspecie) {
      comboCuentaActions(Especies.codigoEspecie); // aqui le paso codigo de detalle
      // console.log("Código de especie seleccionado:", Especies.codigoEspecie);
    }
  }, [
    fechaFactura,
    fechaRecepcion,
    modalidadDeCompra,
    montoRecepcion,
    nFactura,
    nOrdenCompra,
    nRecepcion,
    nombreProveedor,
    origenPresupuesto,
    rutProveedor,
    dependencia,
    servicio,
    cuenta,
    vidaUtil,
    marca,
    modelo,
    serie,
    precio,
    especie,
    Especies.codigoEspecie,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = [
      "modalidadDeCompra",
      "montoRecepcion",
      "nFactura",
      "nOrdenCompra",
      "origenPresupuesto",
      "rutProveedor",
      "dependencia",
      "servicio",
      "cuenta",
      "vidaUtil",
      "precio"

    ].includes(name)

      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;
    setInventario((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    if (name === "servicio") {
      comboDependenciaActions(value);
    }
    if (name === "bien") {
      comboDetalleActions(value);
    }
    if (name === "detalles") {
      comboListadoDeEspeciesBienActions(1, value);
    }
    if (name === "rutProveedor") {
      console.log("rutProveedor", value);
    }
  };

  const handleEdit = () => {
    setInventario((prevInventario) => ({
      ...prevInventario,
      nRecepcion: "",
    }));
    setIsDisabled(true);
    setIsDisabledNRecepcion(false);
  };

  const handleSubmitSeleccionado = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      typeof elementoSeleccionado === "object" &&
      elementoSeleccionado !== null
    ) {
      const estableEspecie = (elementoSeleccionado as ListaEspecie).estabL_CORR;
      const codigoEspecie = (elementoSeleccionado as ListaEspecie).esP_CODIGO;
      const nombreEspecie = `${(elementoSeleccionado as ListaEspecie).nombrE_ESP
        }`;
      const descripcionEspecie =
        (elementoSeleccionado as ListaEspecie).esP_CODIGO +
        " | " +
        `${(elementoSeleccionado as ListaEspecie).nombrE_ESP}`;
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
    if (!Inventario.nRecepcion || Inventario.nRecepcion === "") {
      Swal.fire({
        icon: "warning",
        title: "Por favor, ingrese un número de inventario",
        confirmButtonText: "Ok",
      });
      setLoading(false); //Finaliza estado de carga
      return;
    }
    resultado = await obtenerInventarioActions(Inventario.nRecepcion);

    if (!resultado) {
      Swal.fire({
        icon: "error",
        title: ":'(",
        text: "No se encontraron resultados, inténte otro registro.",
        confirmButtonText: "Ok",
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
    console.log("campos", Inventario);
    if (validate()) {
      Swal.fire({
        icon: "info",
        // title: 'Confirmar',
        text: "Confirmar la modificación del formulario",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar y modificar",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Modificación realizada corectamente", "", "success");
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
      });
      setInventario((inventarioPrevia) => ({
        ...inventarioPrevia,
        fechaFactura: "",
        fechaRecepcion: "",
        modalidadDeCompra: 0,
        montoRecepcion: 0,
        nFactura: "",
        nOrdenCompra: 0,
        nRecepcion: "",
        nombreProveedor: "",
        origenPresupuesto: 0,
        rutProveedor: 0,
        dependencia: 0,
        servicio: 0,
        cuenta: 0,
        vidaUtil: 0,
        marca: "",
        modelo: "",
        serie: "",
        precio: 0,
        especie: ""
      }));

    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el registro.",
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
      <MenuInventario />
      <form onSubmit={handleSubmit}>
        <div className="border-bottom shadow-sm p-4 rounded">
          <h3 className="form-title fw-semibold border-bottom p-1">
            Modificar Inventario
          </h3>
          <Row>
            <Col md={3}>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Nº Inventario</label>
                <div className="d-flex align-items-center">
                  <input
                    aria-label="nRecepcion"
                    type="text"
                    className={`form-control ${error.nRecepcion ? "is-invalid" : ""
                      } w-100`}
                    maxLength={12}
                    name="nRecepcion"
                    onChange={handleChange}
                    value={Inventario.nRecepcion}
                    disabled={isDisabledNRecepcion}
                  />

                  <Button
                    onClick={handleInventarioSubmit}
                    variant="primary"
                    className="ms-1"
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
                    className="ms-1"
                  >
                    <Pencil
                      className={classNames("flex-shrink-0", "h-5 w-5")}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
                {error.nRecepcion && (
                  <div className="invalid-feedback d-block">
                    {error.nRecepcion}
                  </div>
                )}
              </div>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Fecha Recepción</label>
                <input
                  aria-label="fechaRecepcion"
                  type="date"
                  className={`form-control ${error.fechaRecepcion ? "is-invalid" : ""
                    }`}
                  name="fechaRecepcion"
                  onChange={handleChange}
                  value={Inventario.fechaRecepcion || fechaRecepcion}
                  disabled={isDisabled}
                />
                {error.fechaRecepcion && (
                  <div className="invalid-feedback">{error.fechaRecepcion}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="text-muted fw-semibold">N° Orden de compra</label>
                <input
                  aria-label="nOrdenCompra"
                  type="text"
                  className={`form-control ${error.nOrdenCompra ? "is-invalid" : ""
                    }`}
                  maxLength={12}
                  name="nOrdenCompra"
                  onChange={handleChange}
                  value={Inventario.nOrdenCompra || nOrdenCompra}
                  disabled={isDisabled}
                />
                {error.nOrdenCompra && (
                  <div className="invalid-feedback">{error.nOrdenCompra}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Nº factura</label>
                <input
                  aria-label="nFactura"
                  type="text"
                  className={`form-control ${error.nFactura ? "is-invalid" : ""
                    }`}
                  maxLength={12}
                  name="nFactura"
                  onChange={handleChange}
                  value={Inventario.nFactura || nFactura}
                  disabled={isDisabled}
                />
                {error.nFactura && (
                  <div className="invalid-feedback">{error.nFactura}</div>
                )}
              </div>

            </Col>
            <Col md={3}>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Origen Presupuesto</label>
                <select
                  aria-label="origenPresupuesto"
                  className={`form-select ${error.origenPresupuesto ? "is-invalid" : ""
                    }`}
                  name="origenPresupuesto"
                  onChange={handleChange}
                  value={Inventario.origenPresupuesto || origenPresupuesto}
                  disabled={isDisabled}
                >
                  <option value="">Seleccione un origen</option>
                  {comboOrigen.map((traeOrigen) => (
                    <option key={traeOrigen.codigo} value={traeOrigen.codigo}>
                      {traeOrigen.descripcion}
                    </option>
                  ))}
                </select>
                {error.origenPresupuesto && (
                  <div className="invalid-feedback">
                    {error.origenPresupuesto}
                  </div>
                )}
              </div>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Monto Recepción</label>
                <input
                  aria-label="montoRecepcion"
                  type="text"
                  className={`form-select ${error.montoRecepcion ? "is-invalid" : ""
                    }`}
                  maxLength={12}
                  name="montoRecepcion"
                  onChange={handleChange}
                  value={Inventario.montoRecepcion || montoRecepcion}
                  disabled={isDisabled}
                />
                {error.montoRecepcion && (
                  <div className="invalid-feedback">{error.montoRecepcion}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Fecha Factura</label>
                <input
                  aria-label="fechaFactura"
                  type="date"
                  className={`form-select ${error.fechaFactura ? "is-invalid" : ""
                    }`}
                  name="fechaFactura"
                  onChange={handleChange}
                  value={Inventario.fechaFactura || fechaFactura}
                  disabled={isDisabled}
                />
                {error.fechaFactura && (
                  <div className="invalid-feedback">{error.fechaFactura}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Proveedor</label>
                <select
                  aria-label="rutProveedor"
                  className={`form-select ${error.rutProveedor ? "is-invalid" : ""
                    }`}
                  name="rutProveedor"
                  onChange={handleChange}
                  value={Inventario.rutProveedor}
                  disabled={isDisabled}
                >
                  <option value="0">Seleccione un Proveedor</option>
                  {comboProveedor.map((traeProveedor) => (
                    <option key={traeProveedor.rut} value={traeProveedor.rut}>
                      {traeProveedor.nomprov}
                    </option>
                  ))}
                </select>
                {error.rutProveedor && (
                  <div className="invalid-feedback d-block">
                    {error.rutProveedor}
                  </div>
                )}
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Servicio</label>
                <select
                  aria-label="servicio"
                  className={`form-select ${error.servicio ? "is-invalid" : ""
                    }`}
                  name="servicio"
                  onChange={handleChange}
                  value={Inventario.servicio || servicio}
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
                {error.servicio && (
                  <div className="invalid-feedback">{error.servicio}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Dependencia</label>
                <select
                  aria-label="dependencia"
                  className={`form-select ${error.dependencia ? "is-invalid" : ""
                    }`}
                  name="dependencia"
                  onChange={handleChange}
                  value={Inventario.dependencia || dependencia}
                  disabled={isDisabled ? isDisabled : !Inventario.servicio}
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
                {error.dependencia && (
                  <div className="invalid-feedback">{error.dependencia}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Modalida de Compra</label>
                <select
                  aria-label="modalidadDeCompra"
                  className={`form-select ${error.modalidadDeCompra ? "is-invalid" : ""
                    }`}
                  name="modalidadDeCompra"
                  onChange={handleChange}
                  value={Inventario.modalidadDeCompra || modalidadDeCompra}
                  disabled={isDisabled}
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
                {error.modalidadDeCompra && (
                  <div className="invalid-feedback">
                    {error.modalidadDeCompra}
                  </div>
                )}
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Especie</label>
                <div className="d-flex align-items-center">
                  <input
                    aria-label="especie"
                    type="text"
                    name="especie"
                    value={
                      Especies.descripcionEspecie ||
                      especie ||
                      "Haz clic en más para seleccionar una especie"
                    }
                    onChange={handleChange}
                    disabled
                    // className={`form-select ${error.especie ? "is-invalid" : ""}`}
                    className="form-control"
                  />
                  {/* Botón para abrir el modal y seleccionar una especie */}
                  <Button
                    variant="primary"
                    onClick={() => setMostrarModal(true)}
                    className="ms-1"
                    disabled={isDisabled}
                  >
                    <Pencil
                      className={classNames("flex-shrink-0", "h-5 w-5")}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
                {/* {error.especie && (
                    <div className="invalid-feedback d-block">
                      {error.especie}
                    </div>
                  )} */}
              </div>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Cuenta</label>
                <select
                  aria-label="cuenta"
                  className={`form-select ${error.cuenta ? "is-invalid" : ""}`}
                  name="cuenta"
                  onChange={handleChange}
                  value={Inventario.cuenta || cuenta || 0}
                  disabled={isDisabled ? isDisabled : !Especies.codigoEspecie}
                >
                  <option value="">Selecciona una opción</option>
                  {comboCuenta.map((traeCuentas) => (
                    <option key={traeCuentas.codigo} value={traeCuentas.codigo}>
                      {traeCuentas.descripcion}
                    </option>
                  ))}
                </select>
                {error.cuenta && (
                  <div className="invalid-feedback">{error.cuenta}</div>
                )}
              </div>
              <div className="mb-1">
                <label className="text-muted fw-semibold">Activos fijos</label>
                <div className="d-flex align-items-center">
                  <p className="text-right w-100 border p-2 m-0 rounded">
                    Detalles activos fijos
                  </p>
                  {/* Botón para abrir el modal y seleccionar una especie */}
                  <Button
                    variant="primary"
                    onClick={() => setMostrarModalLista(true)}
                    className="ms-1"
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
          <div className="p-1 rounded bg-white d-flex justify-content-end">
            <Button
              variant="btn btn-primary m-1"
              disabled={isDisabled}
              onClick={handleValidar}
            >
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
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">Listado de Especies</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitSeleccionado}>
            <Row>
              <Col md={12}>
                <div className="d-flex justify-content-between">
                  <div className="mb-1 w-50">
                    <label className="text-muted fw-semibold">Bien</label>
                    <div className="d-flex align-items-center">
                      <select
                        aria-label="bien"
                        name="bien"
                        className="form-select"
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
                    <Button variant="primary" type="submit">
                      Seleccionar{" "}
                      <Check2Circle
                        className={classNames("flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
                <div className="mb-1 w-50">
                  <label className="text-muted fw-semibold">Detalles</label>
                  <div className="d-flex align-items-center">
                    <select
                      aria-label="detalles"
                      name="detalles"
                      className="form-select"
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
          <div className="table-responsive overflow-auto" style={{ maxHeight: "500px" }}>
            <Table striped bordered hover>
              <thead>
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
            </Table>
          </div>

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

      {/* Modal tabla detalles ativos Fijo*/}
      <Modal
        show={mostrarModalLista}
        onHide={() => setMostrarModalLista(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">
            Detalles activo fijo
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="shadow-sm">
            <div className="overflow-auto">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th className="bg-primary text-white" >
                      Vida Útil
                    </th>
                    <th className="bg-primary text-white">
                      Fecha Ingreso
                    </th>
                    <th className="bg-primary text-white">
                      Marca
                    </th>
                    <th className="bg-primary text-white">
                      Modelo
                    </th>
                    <th className="bg-primary text-white">
                      Serie
                    </th>
                    <th className="bg-primary text-white">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{vidaUtil}</td>
                    <td>{fechaRecepcion}</td>
                    <td>{marca}</td>
                    <td>{modelo}</td>
                    <td className="d-flex align-items-center p-1">
                      <input
                        aria-label="serie"
                        type="text"
                        name="serie"
                        className="form-control border border-0 rounded-0 "
                        value={Inventario.serie || serie}
                        onChange={(e) => handleChange(e)}
                      />
                      <Pencil
                        className={classNames("flex-shrink-0", "h-5 w-5 m-1")}
                        aria-hidden="true"
                      />
                    </td>
                    <td>
                      {precio.toLocaleString("es-ES", {
                        minimumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  datosInventarioCompleto: state.datosInventarioReducers.datosInventarioCompleto,
  comboOrigen: state.origenPresupuestoReducer.comboOrigen,
  comboServicio: state.comboServicioReducer.comboServicio,
  comboModalidad: state.modalidadCompraReducer.comboModalidad,
  comboCuenta: state.comboCuentaReducer.comboCuenta,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  comboDetalle: state.detallesReducer.comboDetalle,
  comboBien: state.detallesReducer.comboBien,
  comboProveedor: state.comboProveedorReducers.comboProveedor,
  listaEspecie: state.comboListadoDeEspeciesBien.listadoDeEspecies,
  descripcionEspecie: state.datosActivoFijoReducers.descripcionEspecie
});

export default connect(mapStateToProps, {
  comboDependenciaActions,
  obtenerInventarioActions,
  comboDetalleActions,
  comboListadoDeEspeciesBienActions,
  comboCuentaActions,
  modificarFormInventarioActions,
  comboProveedorActions
})(ModificarInventario);
